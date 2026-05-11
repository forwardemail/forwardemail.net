/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const ms = require('ms');
const nodeGzip = require('node-gzip');
const pTimeout = require('p-timeout');
const safeStringify = require('fast-safe-stringify');

const logger = require('#helpers/logger');

const MAX_AGE = ms('1y') / 1000;

module.exports = (client) => ({
  maxAge: MAX_AGE,
  hash: (ctx) => `koa-cash:${ctx.request.path}`,
  compression: true,
  setCachedHeader: true,
  async get(key) {
    try {
      let [buffer, data] = await pTimeout(
        Promise.all([client.getBuffer(`buffer-gzip:${key}`), client.get(key)]),
        1000
      );
      if (!data) return;
      data = JSON.parse(data);
      if (buffer) {
        data.body = await nodeGzip.ungzip(buffer);
        data.gzip = buffer;
      }

      return data;
    } catch (err) {
      err.key = key;
      logger.error(err);
    }
  },
  async set(key, value, maxAge) {
    //
    // we must detect if the `value.body` is a buffer
    // and if so, we need to store it in redis as a buffer
    // and fetch it as a buffer using `getBuffer` as well
    //
    try {
      //
      // handle cache clearing (koa-cash calls `set(key, false)`)
      // use `client.del` to properly remove the key from Redis
      //
      if (value === false) {
        await pTimeout(
          Promise.all([client.del(`buffer-gzip:${key}`), client.del(key)]),
          1000
        );
        return;
      }

      //
      // safeguard against unexpected value types
      //
      if (typeof value !== 'object' || value === null) {
        throw new TypeError(
          `Expected cache value to be an object, got ${typeof value}`
        );
      }

      //
      // ensure maxAge is a valid positive finite integer for Redis EX
      // (Redis rejects EX with 0, negative, NaN, Infinity, or non-integer values)
      //
      const effectiveMaxAge =
        typeof maxAge === 'number' && Number.isFinite(maxAge) && maxAge >= 1
          ? Math.floor(maxAge)
          : MAX_AGE;

      if (Buffer.isBuffer(value.body)) {
        let { body, gzip, ...data } = value;
        if (!gzip) gzip = await nodeGzip.gzip(body);
        const pipeline = client.pipeline();
        pipeline.mset(
          new Map([
            [`buffer-gzip:${key}`, gzip],
            [key, safeStringify(data)]
          ])
        );
        pipeline.expire(`buffer-gzip:${key}`, effectiveMaxAge);
        pipeline.expire(key, effectiveMaxAge);
        await pTimeout(pipeline.exec(), 1000);
      } else {
        await pTimeout(
          client.set(key, safeStringify(value), 'EX', effectiveMaxAge),
          1000
        );
      }
    } catch (err) {
      err.key = key;
      logger.error(err);
    }
  }
});
