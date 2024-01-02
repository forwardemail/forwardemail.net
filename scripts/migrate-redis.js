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

const pMapSeries = require('p-map-series');
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
  // allowlist:*
  // denylist:*
  // backscatter:*
  // silent:*
  const [allowlist, denylist, backscatter, silent] = await pMapSeries(
    ['allowlist', 'denylist', 'backscatter', 'silent'],
    async (key) => {
      const keys = await oldRedis.keys(`${key}:*`);
      const pipeline = newRedis.pipeline();
      console.log('copying over', key, 'keys.length', keys.length);
      for (const key of keys) {
        // eslint-disable-next-line no-await-in-loop
        const results = await oldRedis.pipeline().get(key).pttl(key).exec();
        const val = results[0][1];
        const pttl = results[1][1];
        pipeline.set(key, val);
        if (pttl && pttl > 0) pipeline.pexpire(key, pttl);
      }

      await pipeline.exec();
      return keys.length;
    }
  );

  console.log('allowlist', allowlist);
  console.log('denylist', denylist);
  console.log('backscatter', backscatter);
  console.log('silent', silent);

  process.exit(0);
})();
