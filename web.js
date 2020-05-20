const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const Redis = require('@ladjs/redis');
const Web = require('@ladjs/web');
const _ = require('lodash');
const ip = require('ip');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');

const env = require('./config/env');
const config = require('./config');
const routes = require('./routes');
const i18n = require('./helpers/i18n');
const logger = require('./helpers/logger');
const passport = require('./helpers/passport');

const webSharedConfig = sharedConfig('WEB');
const client = new Redis(webSharedConfig.redis);

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
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
    // <https://hstspreload.org/>
    // <https://helmetjs.github.io/docs/hsts/#preloading-hsts-in-chrome>
    hsts: {
      // must be at least 1 year to be approved
      maxAge: 31536000,
      // must be enabled to be approved
      includeSubDomains: true,
      preload: true
    }
  },
  koaCash: env.CACHE_RESPONSES
    ? {
        maxAge: 0,
        threshold: 0,
        async get(key) {
          let value;
          try {
            value = await client.get(key);
            if (value) value = JSON.parse(value);
          } catch (err) {
            logger.error(err);
          }

          return value;
        },
        set(key, value, maxAge) {
          if (maxAge <= 0) return client.set(key, safeStringify(value));
          return client.set(key, safeStringify(value), 'EX', maxAge);
        }
      }
    : false,
  cacheResponses: env.CACHE_RESPONSES
    ? {
        routes: [
          '/css/(.*)',
          '/img/(.*)',
          '/js/(.*)',
          '/browserconfig.xml',
          '/robots.txt',
          '/site.manifest',
          '/favicon.ico'
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
