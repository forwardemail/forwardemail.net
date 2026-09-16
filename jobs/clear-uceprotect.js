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

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');
const validator = require('@forwardemail/validator');

const logger = require('#helpers/logger');
const { scanRedisKeys } = require('#helpers/scan-redis-keys');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);
  try {
    // Delete IP-only backscatter and denylist entries in bounded batches.
    // SCAN yields control to Valkey between batches, unlike blocking KEYS.
    for (const pattern of ['denylist:*', 'backscatter:*']) {
      for await (const keys of scanRedisKeys(client, pattern)) {
        const pipeline = client.pipeline();

        for (const key of keys) {
          // Filter out keys to be IP addresses only.
          const [, ip] = key.split(':');
          if (validator.isIP(ip)) pipeline.del(key);
        }

        await pipeline.exec();
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
