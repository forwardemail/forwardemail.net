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

//
// Each SCAN page is checked with one pipelined round trip (TTL for every key
// on the page), and the keys it finds without a TTL get theirs in a second
// one. A TTL or PEXPIRE per key, awaited in turn, cost two system calls and a
// wait on the network for every key in Redis under these prefixes (millions
// of sessions and cache entries), which kept the bree host busy in the kernel
// for hours each run.
//
const TTL_CONFIG = {
  scanCount: 1000, // Keys per SCAN iteration (Redis reads about this many)
  scanDelay: 50 // Wait 50ms between SCAN pages so Redis serves others too
};

// Helper to delay between SCAN pages
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// prefixes whose keys without a TTL get one set, and the TTL in milliseconds
const REMEDIATION_TTL = new Map([
  // Fingerprint keys: use PX with config.fingerprintTTL
  ['f:', config.fingerprintTTL],
  // Denylist keys: use PX with 30 days
  ['denylist:', ms('30d')]
]);

// the reply to each command of a pipeline, or the first error among them
function pipelineReplies(results) {
  return results.map(([err, reply]) => {
    if (err) throw err;
    return reply;
  });
}

// Set a TTL on keys of a prefix found without one (one round trip)
async function setTTLOnKeys(keys, prefix, result) {
  const ttl = REMEDIATION_TTL.get(prefix);
  let results;
  try {
    results = await client
      .pipeline(keys.map((key) => ['pexpire', key, ttl]))
      .exec();
  } catch (err) {
    // the whole pipeline failed (e.g. the connection dropped)
    result.errorCount += keys.length;
    logger.error(err, { keys: keys.length, prefix });
    return;
  }

  for (const [index, [err]] of results.entries()) {
    if (err) {
      result.errorCount++;
      logger.error(err, { key: keys[index], prefix });
    } else {
      result.setCount++;
    }
  }
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

        if (keys.length > 0) {
          const ttls = pipelineReplies(
            await client.pipeline(keys.map((key) => ['ttl', key])).exec()
          );

          // ttl = -1 means key has no expiry
          const withoutTTL = keys.filter((key, index) => ttls[index] === -1);

          if (withoutTTL.length > 0) {
            totalWithoutTTL += withoutTTL.length;

            // count keys without TTL (and keep a few samples)
            if (!keysWithoutTTL[prefix]) {
              keysWithoutTTL[prefix] = {
                count: 0,
                samples: []
              };
            }

            keysWithoutTTL[prefix].count += withoutTTL.length;

            for (const key of withoutTTL) {
              if (keysWithoutTTL[prefix].samples.length >= 5) break;
              keysWithoutTTL[prefix].samples.push(key);
            }

            // set TTL on fingerprint and denylist keys
            if (REMEDIATION_TTL.has(prefix)) {
              if (!ttlSetResults[prefix])
                ttlSetResults[prefix] = { setCount: 0, errorCount: 0 };
              await setTTLOnKeys(withoutTTL, prefix, ttlSetResults[prefix]);
            }
          }
        }

        // Add small delay between scans to be resource-friendly
        await delay(TTL_CONFIG.scanDelay);
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
