/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const ms = require('ms');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');
const config = require('#config');
const emailHelper = require('#helpers/email');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  redisClients: [client],
  logger
});

graceful.listen();

// prefixes to monitor for missing TTL
const MONITORED_PREFIXES = [
  'koa:sess:',
  'koa-cash:',
  'buffer-gzip:',
  'f:',
  'sts:',
  'allowlist:',
  'denylist:',
  'v1_settings:',
  'v1_max_forwarded:',
  'vacuum_check:',
  'alias_quota_v2:',
  'backscatter:',
  'whois:'
];

// Configuration for TTL setting (resource-friendly)
const TTL_CONFIG = {
  batchSize: 50, // Process 50 keys at a time
  batchDelay: 200, // Wait 200ms between batches
  scanCount: 100 // Keys per SCAN iteration
};

// Helper to delay between batches
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// prefixes whose keys without a TTL get one set (see setTTLOnKey)
const REMEDIATED_PREFIXES = new Set(['f:', 'denylist:']);

// Set TTL on a key without expiration (non-blocking, resource-friendly)
async function setTTLOnKey(key, prefix, result) {
  try {
    // Set TTL based on prefix
    if (prefix === 'f:') {
      // Fingerprint keys: use PX with config.fingerprintTTL
      await client.pexpire(key, config.fingerprintTTL);
      result.setCount++;
    } else if (prefix === 'denylist:') {
      // Denylist keys: use PX with 30 days
      await client.pexpire(key, ms('30d'));
      result.setCount++;
    }
    // Add more prefix-specific TTL logic here if needed
  } catch (err) {
    result.errorCount++;
    logger.error(err, { key, prefix });
  }

  // Add delay between batches to prevent resource hogging
  if ((result.setCount + result.errorCount) % TTL_CONFIG.batchSize === 0)
    await delay(TTL_CONFIG.batchDelay);
}

(async () => {
  try {
    const keysWithoutTTL = {};
    let totalScanned = 0;
    let totalWithoutTTL = 0;
    const ttlSetResults = {};

    logger.info('starting Redis TTL monitoring');

    //
    // Scan and identify keys without TTL, and set one on fingerprint and
    // denylist keys as they are found. Collecting every key without a TTL
    // first (to remediate afterwards) held millions of keys in memory.
    //
    for (const prefix of MONITORED_PREFIXES) {
      let cursor = '0';

      do {
        const [newCursor, keys] = await client.scan(
          cursor,
          'MATCH',
          `${prefix}*`,
          'COUNT',
          TTL_CONFIG.scanCount
        );
        cursor = newCursor;
        totalScanned += keys.length;

        for (const key of keys) {
          const ttl = await client.ttl(key);

          // ttl = -1 means key has no expiry
          if (ttl === -1) {
            totalWithoutTTL++;

            // count keys without TTL (and keep a few samples)
            if (!keysWithoutTTL[prefix]) {
              keysWithoutTTL[prefix] = {
                count: 0,
                samples: []
              };
            }

            keysWithoutTTL[prefix].count++;

            if (keysWithoutTTL[prefix].samples.length < 5) {
              keysWithoutTTL[prefix].samples.push(key);
            }

            // set TTL on fingerprint and denylist keys
            if (REMEDIATED_PREFIXES.has(prefix)) {
              if (!ttlSetResults[prefix])
                ttlSetResults[prefix] = { setCount: 0, errorCount: 0 };
              await setTTLOnKey(key, prefix, ttlSetResults[prefix]);
            }
          }
        }

        // Add small delay between scans to be resource-friendly
        await delay(50);
      } while (cursor !== '0');
    }

    logger.info('completed Redis TTL monitoring', {
      totalScanned,
      totalWithoutTTL,
      prefixSummary: Object.keys(keysWithoutTTL).map((prefix) => ({
        prefix,
        count: keysWithoutTTL[prefix].count
      }))
    });

    logger.info('completed TTL remediation', ttlSetResults);

    // if we found keys without TTL, email admins
    if (totalWithoutTTL > 0) {
      const prefixSummary = Object.keys(keysWithoutTTL)
        .map((prefix) => {
          const info = keysWithoutTTL[prefix];
          const ttlResult = ttlSetResults[prefix];

          let line = `- ${prefix} ${info.count} keys`;

          if (ttlResult) {
            line += ` (${ttlResult.setCount} TTL set${
              ttlResult.errorCount > 0 ? `, ${ttlResult.errorCount} errors` : ''
            })`;
          }

          line += `\n  Sample keys: ${info.samples.join(', ')}`;

          return line;
        })
        .join('\n\n');

      const totalTTLSet = Object.values(ttlSetResults).reduce(
        (sum, r) => sum + r.setCount,
        0
      );
      const totalTTLErrors = Object.values(ttlSetResults).reduce(
        (sum, r) => sum + r.errorCount,
        0
      );

      const messageText = `Redis TTL monitoring has detected ${totalWithoutTTL} keys without expiration across ${
        Object.keys(keysWithoutTTL).length
      } prefixes.

Summary by prefix:

${prefixSummary}

Total keys scanned: ${totalScanned}

TTL Remediation:
- Total keys with TTL set: ${totalTTLSet}
- Total errors: ${totalTTLErrors}

Fingerprint keys (f:*) were set to ${Math.ceil(
        config.fingerprintTTL / 1000 / 60 / 60
      )} hours using PX.
Denylist keys (denylist:*) were set to 30 days using PX.

These keys should have TTL set to prevent unbounded Redis memory growth.`;

      const message = {
        to: config.email.message.from,
        subject: `Redis Keys Without TTL: ${totalWithoutTTL} found${
          totalTTLSet > 0 ? `, ${totalTTLSet} fixed` : ''
        }`,
        text: messageText
      };

      try {
        await emailHelper({
          template: 'alert',
          message,
          locals: {
            message: messageText
          }
        });
        logger.info('sent Redis TTL alert email to admins');
      } catch (err) {
        logger.error(err, { message });
      }
    }

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  } catch (err) {
    logger.error(err);

    if (parentPort) parentPort.postMessage('error');
    else process.exit(1);
  }
})();
