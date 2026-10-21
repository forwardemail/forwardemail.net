/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort } = require('node:worker_threads');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');
// (the session cookie's lifetime: `config.cookies` does not exist, so every
// run that found a session without a TTL failed before setting it)
const cookieOptions = require('#config/cookies');

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
      //
      // scan for session keys in batches of about 1000 keys, with the TTLs of
      // a page in one round trip and the expiries it sets in another (a TTL
      // and an EXPIRE each, awaited in turn, cost a round trip per session)
      //
      const [newCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        'koa:sess:*',
        'COUNT',
        1000
      );
      cursor = newCursor;
      scannedCount += keys.length;
      if (keys.length === 0) continue;

      const ttls = await client
        .pipeline(keys.map((key) => ['ttl', key]))
        .exec();
      const withoutTTL = [];
      for (const [index, [err, ttl]] of ttls.entries()) {
        if (err) throw err;
        // ttl = -1 means key has no expiry
        if (ttl === -1) withoutTTL.push(keys[index]);
        // key doesn't exist (race condition)
        else if (ttl === -2) expiredCount++;
      }

      if (withoutTTL.length > 0) {
        // set expiry based on the session cookie's maxAge (30 days)
        const results = await client
          .pipeline(
            withoutTTL.map((key) => [
              'expire',
              key,
              Math.floor(cookieOptions.maxAge / 1000)
            ])
          )
          .exec();
        for (const [err] of results) if (err) throw err;
        fixedCount += withoutTTL.length;
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
    await Promise.race([logger.error(err), delay(10_000)]);

    // (exit with an error code: on an 'error' message bree keeps the worker,
    // which its open connections keep alive, so it held its slot and the job
    // never ran again until a restart)
    process.exit(1);
  }
})();
