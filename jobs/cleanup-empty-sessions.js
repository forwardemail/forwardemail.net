/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');
const config = require('#config');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    logger.info('Starting empty session cleanup job');

    const sessionPrefix = config.sessionPrefix || 'koa:sess:';
    let cursor = '0';
    let totalScanned = 0;
    let totalEmpty = 0;
    let totalDeleted = 0;
    let totalErrors = 0;

    // Scan all session keys
    do {
      const result = await client.scan(
        cursor,
        'MATCH',
        `${sessionPrefix}*`,
        'COUNT',
        100
      );

      cursor = result[0];
      const keys = result[1];

      totalScanned += keys.length;

      // Check each key
      for (const key of keys) {
        try {
          // Skip destroyed session markers
          if (key.includes(':destroyed:')) {
            continue;
          }

          const value = await client.get(key);

          if (!value) {
            continue;
          }

          // Parse session data
          let session;
          try {
            session = typeof value === 'string' ? JSON.parse(value) : value;
          } catch {
            // Invalid JSON, skip
            continue;
          }

          // Check if session is empty (no user data)
          const isEmpty =
            !session ||
            typeof session !== 'object' ||
            Object.keys(session).length === 0 ||
            (Object.keys(session).length === 1 && session.cookie) ||
            (!session.user &&
              !session.passport &&
              !session._csrf &&
              Object.keys(session).every(
                (k) => k === 'cookie' || k.startsWith('_')
              ));

          if (isEmpty) {
            totalEmpty++;
            // Delete empty session
            await client.del(key);
            totalDeleted++;
            logger.debug('Deleted empty session', { key });
          }
        } catch (err) {
          totalErrors++;
          logger.error('Error processing session key', { key, error: err });
        }
      }
    } while (cursor !== '0');

    logger.info('Empty session cleanup completed', {
      totalScanned,
      totalEmpty,
      totalDeleted,
      totalErrors
    });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
