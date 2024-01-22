/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const ms = require('ms');
const pTimeout = require('p-timeout');
const safeStringify = require('fast-safe-stringify');

const logger = require('#helpers/logger');

const MAX_AGE = ms('1y') / 1000;

module.exports = (client) => ({
  maxAge: MAX_AGE,
  hash: (ctx) => `koa-cash:${ctx.request.url}`,
  setCachedHeader: true,
  async get(key) {
    try {
      let [buffer, data] = await pTimeout(
        Promise.all([client.getBuffer(`buffer:${key}`), client.get(key)]),
        1000
      );
      if (!data) return;
      data = JSON.parse(data);
      if (buffer) data.body = buffer;
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
      if (Buffer.isBuffer(value.body)) {
        const { body, ...data } = value;
        await pTimeout(
          client.mset(
            new Map([
              [
                `buffer:${key}`,
                body,
                ...(maxAge > 0 ? ['EX', maxAge] : ['EX', MAX_AGE])
              ],
              [
                key,
                safeStringify(data),
                ...(maxAge > 0 ? ['EX', maxAge] : ['EX', MAX_AGE])
              ]
            ])
          ),
          1000
        );
      } else {
        if (maxAge <= 0)
          await pTimeout(
            client.set(key, safeStringify(value), 'EX', MAX_AGE),
            1000
          );
        await client.set(key, safeStringify(value), 'EX', maxAge);
      }
    } catch (err) {
      err.key = key;
      logger.error(err);
    }
  }
});
