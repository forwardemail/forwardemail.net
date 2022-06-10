const process = require('process');

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');
const env = require('./env');
const cookieOptions = require('./cookies');
const koaCashConfig = require('./koa-cash');
const config = require('.');
const i18n = require('#helpers/i18n');
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

module.exports = (redis) => ({
  ...sharedConfig('WEB'),
  ...config,
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
              'js.stripe.com',
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
              'js.stripe.com',
              'www.paypal.com',
              'hcaptcha.com',
              '*.hcaptcha.com',
              ...(env.NODE_ENV === 'production'
                ? []
                : ['www.sandbox.paypal.com'])
            ],
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
