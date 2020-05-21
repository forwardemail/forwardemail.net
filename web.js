const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const Redis = require('@ladjs/redis');
const Web = require('@ladjs/web');
const _ = require('lodash');
const ip = require('ip');
const sharedConfig = require('@ladjs/shared-config');
const ms = require('ms');
const safeStringify = require('fast-safe-stringify');

const env = require('./config/env');
const config = require('./config');
const routes = require('./routes');
const i18n = require('./helpers/i18n');
const logger = require('./helpers/logger');
const passport = require('./helpers/passport');

const webSharedConfig = sharedConfig('WEB');
const client = new Redis(webSharedConfig.redis);

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

const web = new Web({
  ...webSharedConfig,
  routes: routes.web,
  logger,
  i18n,
  meta: config.meta,
  views: config.views,
  passport,
  helmet: {
    expectCt: {
      enforce: true,
      // https://httpwg.org/http-extensions/expect-ct.html#maximum-max-age
      maxAge: ms('30d') / 1000
    },
    // <https://hstspreload.org/>
    // <https://helmetjs.github.io/docs/hsts/#preloading-hsts-in-chrome>
    hsts: {
      // must be at least 1 year to be approved
      maxAge: ms('1y') / 1000,
      // must be enabled to be approved
      includeSubDomains: true,
      preload: true
    }
  },
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
});

if (!module.parent) {
  const mongoose = new Mongoose(
    _.merge({ logger }, web.config.mongoose, config.mongoose)
  );

  const graceful = new Graceful({
    mongooses: [mongoose],
    servers: [web],
    redisClients: [web.client, client],
    logger
  });

  (async () => {
    try {
      await Promise.all([
        mongoose.connect(),
        web.listen(web.config.port),
        graceful.listen()
      ]);
      if (process.send) process.send('ready');
      const { port } = web.server.address();
      logger.info(
        `Lad web server listening on ${port} (LAN: ${ip.address()}:${port})`
      );
      if (config.env === 'development')
        logger.info(
          `Please visit ${config.urls.web} in your browser for testing`
        );
    } catch (err) {
      logger.error(err);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }
  })();
}

module.exports = web;
