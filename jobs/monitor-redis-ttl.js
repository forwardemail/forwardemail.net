/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

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
  'alias_quota:',
  'backscatter:',
  'whois:'
];

(async () => {
  try {
    const keysWithoutTTL = {};
    let totalScanned = 0;
    let totalWithoutTTL = 0;

    logger.info('starting Redis TTL monitoring');

    for (const prefix of MONITORED_PREFIXES) {
      let cursor = '0';

      do {
        const [newCursor, keys] = await client.scan(
          cursor,
          'MATCH',
          `${prefix}*`,
          'COUNT',
          100
        );
        cursor = newCursor;
        totalScanned += keys.length;

        for (const key of keys) {
          const ttl = await client.ttl(key);

          // ttl = -1 means key has no expiry
          if (ttl === -1) {
            totalWithoutTTL++;

            // store sample keys (up to 5 per prefix)
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
          }
        }
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

    // if we found keys without TTL, email admins
    if (totalWithoutTTL > 0) {
      const message = {
        to: config.email.message.from,
        subject: `Redis Keys Without TTL Detected: ${totalWithoutTTL} keys`,
        text: `Redis TTL monitoring has detected ${totalWithoutTTL} keys without expiration across ${
          Object.keys(keysWithoutTTL).length
        } prefixes.

Summary by prefix:
${Object.keys(keysWithoutTTL)
  .map(
    (prefix) =>
      `- ${prefix}: ${
        keysWithoutTTL[prefix].count
      } keys\n  Sample keys: ${keysWithoutTTL[prefix].samples.join(', ')}`
  )
  .join('\n')}

Total keys scanned: ${totalScanned}

These keys should have TTL set to prevent unbounded Redis memory growth.`
      };

      try {
        await emailHelper({
          template: 'alert',
          message,
          locals: {
            message: message.text
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
