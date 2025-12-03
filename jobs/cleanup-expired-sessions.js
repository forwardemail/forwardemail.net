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

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  try {
    let cursor = '0';
    let scannedCount = 0;
    let expiredCount = 0;
    let fixedCount = 0;

    logger.info('starting cleanup of expired sessions');

    do {
      // scan for session keys in batches
      const [newCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        'koa:sess:*',
        'COUNT',
        100
      );
      cursor = newCursor;
      scannedCount += keys.length;

      for (const key of keys) {
        const ttl = await client.ttl(key);

        // ttl = -1 means key has no expiry
        if (ttl === -1) {
          // set expiry based on cookie maxAge (7 days)
          await client.expire(key, Math.floor(config.cookies.maxAge / 1000));
          fixedCount++;
        } else if (ttl === -2) {
          // key doesn't exist (race condition)
          expiredCount++;
        }
      }
    } while (cursor !== '0');

    logger.info('completed cleanup of expired sessions', {
      scannedCount,
      expiredCount,
      fixedCount
    });

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  } catch (err) {
    logger.error(err);

    if (parentPort) parentPort.postMessage('error');
    else process.exit(1);
  }
})();
