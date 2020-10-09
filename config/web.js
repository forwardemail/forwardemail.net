const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const i18n = require('../helpers/i18n');
const logger = require('../helpers/logger');
const passport = require('../helpers/passport');
const routes = require('../routes');
const env = require('./env');
const cookieOptions = require('./cookies');
const koaCashConfig = require('./koa-cash');
const config = require('.');

const defaultSrc = isSANB(process.env.WEB_HOST)
  ? ["'self'", 'data:', `*.${process.env.WEB_HOST}:*`]
  : null;

const reportUri = isSANB(process.env.WEB_URL)
  ? `${process.env.WEB_URL}/report`
  : null;

module.exports = client => ({
  routes: routes.web,
  logger,
  i18n,
  cookies: cookieOptions,
  meta: config.meta,
  views: config.views,
  passport,
  koaCash: env.CACHE_RESPONSES ? koaCashConfig(client) : false,
  redirectLoop: false,
  cacheResponses: env.CACHE_RESPONSES
    ? {
        routes: [
          '/.well-known/(.*)',
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
    : false,
  serveStatic: {
    hidden: true
  },
  helmet: {
    contentSecurityPolicy: defaultSrc
      ? {
          directives: {
            defaultSrc,
            connectSrc: defaultSrc,
            fontSrc: defaultSrc,
            imgSrc: defaultSrc,
            styleSrc: [...defaultSrc, "'unsafe-inline'"],
            scriptSrc: [...defaultSrc, "'unsafe-inline'"],
            frameSrc: [...defaultSrc, '*.youtube-nocookie.com'],
            reportUri: reportUri ? reportUri : null
          }
        }
      : null,
    expectCt: {
      enforce: true,
      // https://httpwg.org/http-extensions/expect-ct.html#maximum-max-age
      maxAge: ms('30d') / 1000,
      reportUri
    },
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
  }
});
