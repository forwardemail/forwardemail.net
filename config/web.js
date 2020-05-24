const ms = require('ms');
const safeStringify = require('fast-safe-stringify');
const config = require('.');
const cookieOptions = require('./cookies');
const env = require('./env');
const routes = require('../routes');
const i18n = require('../helpers/i18n');
const logger = require('../helpers/logger');
const passport = require('../helpers/passport');

module.exports = client => {
  const koaCash = {
    maxAge: ms('1y') / 1000,
    async get(key) {
      const [buffer, data] = await Promise.all([
        client.getBuffer(`buffer:${key}`),
        client.get(key)
      ]);
      if (buffer) data.body = buffer;
      return data;
    },
    async set(key, value, maxAge) {
      //
      // we must detect if the `value.body` is a buffer
      // and if so, we need to store it in redis as a buffer
      // and fetch it as a buffer using `getBuffer` as well
      //
      if (Buffer.isBuffer(value.body)) {
        const { body, ...data } = value;
        await client.mset(
          new Map([
            [`buffer:${key}`, body, ...(maxAge > 0 ? ['EX', maxAge] : [])],
            [key, safeStringify(data), ...(maxAge > 0 ? ['EX', maxAge] : [])]
          ])
        );
      } else {
        if (maxAge <= 0) return client.set(key, safeStringify(value));
        client.set(key, Buffer.from(safeStringify(value)), 'EX', maxAge);
      }
    }
  };

  return {
    routes: routes.web,
    logger,
    i18n,
    cookies: cookieOptions,
    meta: config.meta,
    views: config.views,
    passport,
    koaCash: env.CACHE_RESPONSES ? koaCash : false,
    cacheResponses: env.CACHE_RESPONSES
      ? {
          routes: [
            '/css/(.*)',
            '/img/(.*)',
            '/js/(.*)',
            '/fonts/(.*)',
            '/browserconfig(.*)',
            '/robots(.*)',
            '/site(.*)',
            '/favicon(.*)'
          ]
        }
      : false
  };
};
