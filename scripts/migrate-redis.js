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
      const keys = await oldRedis.keys(`${key}:*`);
      console.log('copying over', key, 'keys.length', keys.length);
      const pipeline = newRedis.pipeline();
      const values = await oldRedis.mget(keys);
      for (const [i, key_] of keys.entries()) {
        console.log(`${key_} = ${values[i]}`);
        pipeline.set(key_, values[i]);
      }

      await pipeline.exec();

      return keys.length;
    }
  );

  console.log('koa', koa);
  console.log('allowlist', allowlist);
  console.log('denylist', denylist);
  console.log('backscatter', backscatter);
  console.log('silent', silent);

  process.exit(0);
})();
