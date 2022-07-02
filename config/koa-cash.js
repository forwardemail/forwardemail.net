const { Buffer } = require('buffer');

const ms = require('ms');
const pTimeout = require('p-timeout');
const safeStringify = require('fast-safe-stringify');

const logger = require('#helpers/logger');

module.exports = (client) => ({
  maxAge: ms('1y') / 1000,
  hash: (ctx) => `koa-cash:${ctx.request.url}`,
  setCachedHeader: true,
  async get(key) {
    try {
      let [buffer, data] = await pTimeout(
        Promise.all([client.getBuffer(`buffer:${key}`), client.get(key)]),
        500
      );
      if (!data) return;
      data = JSON.parse(data);
      if (buffer) data.body = buffer;
      return data;
    } catch (err) {
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
              [`buffer:${key}`, body, ...(maxAge > 0 ? ['EX', maxAge] : [])],
              [key, safeStringify(data), ...(maxAge > 0 ? ['EX', maxAge] : [])]
            ])
          ),
          500
        );
      } else {
        if (maxAge <= 0)
          await pTimeout(client.set(key, safeStringify(value)), 500);
        await client.set(key, safeStringify(value), 'EX', maxAge);
      }
    } catch (err) {
      logger.error(err);
    }
  }
});
