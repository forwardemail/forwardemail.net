const process = require('process');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');
const env = require('./env');
const cookieOptions = require('./cookies');
const koaCashConfig = require('./koa-cash');
const config = require('.');
const i18n = require('#helpers/i18n');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');
const logger = require('#helpers/logger');

const defaultSrc = isSANB(process.env.WEB_HOST)
  ? [
      "'self'",
      'data:',
      `*.${process.env.WEB_HOST}:*`,
      process.env.WEB_HOST,
      `${process.env.WEB_HOST}:*`
    ]
  : null;

const reportUri = isSANB(process.env.WEB_URL)
  ? `${process.env.WEB_URL}/report`
  : null;

const sharedWebConfig = sharedConfig('WEB');

module.exports = (redis) => ({
  ...sharedWebConfig,
  ...config,
  rateLimit: {
    ...sharedWebConfig.rateLimit,
    ...config.rateLimit
  },
  routes: routes.web,
  logger,
  i18n,
  cookies: cookieOptions,
  meta: config.meta,
  views: config.views,
  koaCash: env.CACHE_RESPONSES ? koaCashConfig(redis) : false,
  redis,
  cacheResponses: env.CACHE_RESPONSES
    ? {
        routes: [
          '/.well-known/(.*)',
          '/css/(.*)',
          '/img/(.*)',
          '/js/(.*)',
          '/fonts/(.*)',
          '/browserconfig.xml',
          '/robots.txt',
          '/site.webmanifest'
        ]
      }
    : false,
  serveStatic: {
    hidden: true
  },
  helmet: {
    // TODO: eventually make the CSP only set on PayPal required pages
    contentSecurityPolicy: defaultSrc
      ? {
          directives: {
            defaultSrc,
            connectSrc: [
              ...defaultSrc,
              'plausible.io',
              'www.paypal.com',
              'noembed.com',
              'hcaptcha.com',
              '*.hcaptcha.com',
              ...(env.NODE_ENV === 'production'
                ? []
                : ['www.sandbox.paypal.com'])
            ],
            fontSrc: [...defaultSrc],
            imgSrc: [
              ...defaultSrc,
              'tracking.qa.paypal.com',
              'ytimg.com',
              '*.ytimg.com'
            ],
            styleSrc: [
              ...defaultSrc,
              "'unsafe-inline'",
              'hcaptcha.com',
              '*.hcaptcha.com'
            ],
            scriptSrc: [
              ...defaultSrc,
              "'unsafe-inline'",
              'plausible.io',
              'www.paypal.com',
              'hcaptcha.com',
              '*.hcaptcha.com',
              ...(env.NODE_ENV === 'production'
                ? []
                : ['www.sandbox.paypal.com'])
            ],
            frameSrc: [
              ...defaultSrc,
              'www.youtube.com',
              '*.youtube-nocookie.com',
              'www.paypal.com',
              'hcaptcha.com',
              '*.hcaptcha.com',
              ...(env.NODE_ENV === 'production'
                ? []
                : ['www.sandbox.paypal.com'])
            ],
            reportUri: reportUri || null
          }
        }
      : null,
    // <https://hstspreload.org/>
    // <https://helmetjs.github.io/docs/hsts/#preloading-hsts-in-chrome>
    hsts: {
      // must be at least 1 year to be approved
      maxAge: ms('1y') / 1000,
      // must be enabled to be approved
      includeSubDomains: true,
      preload: true
    },
    // <https://helmetjs.github.io/docs/referrer-policy>
    // <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy>
    referrerPolicy: {
      policy: 'same-origin'
    },
    xssFilter: {
      reportUri
    }
  },
  session: {
    errorHandler(err, type, ctx) {
      if (
        // <https://github.com/luin/ioredis/issues/1716>
        err.message === 'Connection is closed.' ||
        isErrorConstructorName(err, 'MongooseError') ||
        isErrorConstructorName(err, 'MongoError') ||
        isErrorConstructorName(err, 'RedisError')
      ) {
        ctx.logger.fatal(err);
        throw Boom.clientTimeout(ctx.translateError('WEBSITE_OUTAGE'));
      }

      // unknown error
      throw err;
    }
  },
  hookBeforePassport(app) {
    app.use((ctx, next) => {
      // if either mongoose or redis are not connected
      // then render website outage message to users
      const isMongooseDown = mongoose.connections.some(
        (conn) => conn.readyState !== mongoose.ConnectionStates.connected
      );
      const isRedisDown =
        !ctx.client || (ctx.client.status && ctx.client.status !== 'ready');

      if (isMongooseDown || isRedisDown) {
        const obj = {};
        obj.mongoose = mongoose.connections.map((conn) => ({
          id: conn.id,
          readyState: conn.readyState,
          name: conn.name,
          host: conn.host,
          port: conn.port
        }));
        if (ctx?.client?.status && ctx?.client?._getDescription)
          obj.redis = {
            status: ctx.client.status,
            description: ctx.client._getDescription()
          };
        else obj.redis = 'ioredis-mock';
        ctx.logger.fatal(new Error('Website outage'), obj);
      }

      if (
        ctx.method === 'GET' &&
        ctx.accepts('html') &&
        (isMongooseDown || isRedisDown)
      ) {
        ctx.flash('custom', {
          title: ctx.request.t('Warning'),
          html: `<small>${ctx.translate('WEBSITE_OUTAGE')}</small>`,
          type: 'warning',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          position: 'top'
        });
      }

      return next();
    });
  }
});
