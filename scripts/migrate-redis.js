/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const pMap = require('p-map');
const Graceful = require('@ladjs/graceful');
const isSANB = require('is-string-and-not-blank');

const Redis = require('@ladjs/redis');

const { scanRedisKeys } = require('#helpers/scan-redis-keys');

if (!isSANB(process.env.NEW_REDIS_URI))
  throw new TypeError('NEW_REDIS_URI not defined');

if (!isSANB(process.env.OLD_REDIS_URI))
  throw new TypeError('OLD_REDIS_URI not defined');

const newRedis = new Redis(process.env.NEW_REDIS_URI);
const oldRedis = new Redis(process.env.OLD_REDIS_URI);
const graceful = new Graceful({
  redisClients: [newRedis, oldRedis]
});

graceful.listen();

(async () => {
  // koa:sess:*
  // allowlist:*
  // denylist:*
  // backscatter:*
  // silent:*
  const [koa, allowlist, denylist, backscatter, silent] = await pMap(
    ['koa:sess', 'allowlist', 'denylist', 'backscatter', 'silent'],
    async (key) => {
      let count = 0;

      // Scan and migrate small batches so the source Valkey instance can
      // continue serving its normal clients throughout the migration.
      for await (const keys of scanRedisKeys(oldRedis, `${key}:*`)) {
        const values = await oldRedis.mget(keys);
        const pipeline = newRedis.pipeline();

        for (const [index, key_] of keys.entries()) {
          console.log(`${key_} = ${values[index]}`);
          pipeline.set(key_, values[index]);
        }

        await pipeline.exec();
        count += keys.length;
      }

      console.log('copying over', key, 'keys.length', count);
      return count;
    }
  );

  console.log('koa', koa);
  console.log('allowlist', allowlist);
  console.log('denylist', denylist);
  console.log('backscatter', backscatter);
  console.log('silent', silent);

  process.exit(0);
})();
