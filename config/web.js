/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const Boom = require('@hapi/boom');
const Cabin = require('cabin');
const dayjs = require('dayjs-with-plugins');
const ipaddr = require('ipaddr.js');
const isbot = require('isbot');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const openpgp = require('openpgp');
const sharedConfig = require('@ladjs/shared-config');
const { Octokit } = require('@octokit/core');

const routes = require('../routes');

const cookieOptions = require('./cookies');
const auth = require('./basic-auth');
const env = require('./env');
const koaCashConfig = require('./koa-cash');

const config = require('.');
const koaRedirectBackPolyfill = require('#helpers/koa-redirect-back-polyfill');
const _ = require('#helpers/lodash');

const Users = require('#models/users');
const createTangerine = require('#helpers/create-tangerine');
const i18n = require('#helpers/i18n');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');

const octokit = new Octokit({
  auth: env.GITHUB_OCTOKIT_TOKEN
});

let ACTIVE_GITHUB_ISSUES = {};

const RATELIMIT_ALLOWLIST =
  typeof env.RATELIMIT_ALLOWLIST === 'string'
    ? env.RATELIMIT_ALLOWLIST.split(',')
    : Array.isArray(env.RATELIMIT_ALLOWLIST)
    ? env.RATELIMIT_ALLOWLIST
    : [];

let signingKeys;
if (isSANB(env.GPG_SECURITY_KEY) && isSANB(env.GPG_SECURITY_PASSPHRASE)) {
  try {
    const privateKeyArmored = fs.readFileSync(env.GPG_SECURITY_KEY, 'utf8');
    (async () => {
      signingKeys = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({
          armoredKey: privateKeyArmored
        }),
        passphrase: env.GPG_SECURITY_PASSPHRASE
      });
    })();
  } catch (err) {
    logger.error(err);
  }
}

let appCss;
let botCss;
let freddyCss;

try {
  appCss = fs.readFileSync(
    path.join(config.buildDir, 'css', 'app.css'),
    'utf8'
  );
} catch (err) {
  logger.error(err);
}

try {
  botCss = fs.readFileSync(
    path.join(config.buildDir, 'css', 'app-bot.css'),
    'utf8'
  );
} catch (err) {
  logger.error(err);
}

try {
  freddyCss = fs.readFileSync(
    path.join(config.buildDir, 'css', 'freddy.css'),
    'utf8'
  );
} catch (err) {
  logger.error(err);
}

async function checkGitHubIssues() {
  try {
    ACTIVE_GITHUB_ISSUES = await octokit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: 'forwardemail',
        repo: 'status.forwardemail.net',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
    if (
      typeof ACTIVE_GITHUB_ISSUES === 'object' &&
      Array.isArray(ACTIVE_GITHUB_ISSUES.data)
    )
      ACTIVE_GITHUB_ISSUES.data = ACTIVE_GITHUB_ISSUES.data.filter(
        (obj) => obj.user.login === 'titanism'
      );
  } catch (err) {
    logger.fatal(err);
  }
}

// GitHub API is limited to 5K requests per hour
// (if we check every 10 seconds, then that is 360 requests per hour)
// (if we check every minute, then that is 60 requests per hour)
if (config.env !== 'test') {
  checkGitHubIssues();
  setInterval(checkGitHubIssues, 60000);
}

const defaultSrc = isSANB(process.env.WEB_HOST)
  ? [
      "'self'",
      'data:',
      `${env.NODE_ENV === 'production' ? 'https://' : 'http://'}*.${
        env.WEB_HOST
      }:*`,
      `${env.NODE_ENV === 'production' ? 'https://' : 'http://'}${
        env.WEB_HOST
      }`,
      ...(env.NODE_ENV === 'production'
        ? [`https://${env.WEB_HOST}:*`]
        : [`http://${env.WEB_HOST}:*`]),
      function (req, res) {
        let nonce;
        for (const s of Object.getOwnPropertySymbols(res)) {
          const desc = s.toString().replace(/Symbol\((.*)\)$/, '$1');
          if (
            desc === 'kOutHeaders' &&
            res[s]['x-csp-nonce'] &&
            Array.isArray(res[s]['x-csp-nonce']) &&
            res[s]['x-csp-nonce'].length === 2
          )
            nonce = res[s]['x-csp-nonce'][1];
        }

        if (!nonce) return;
        return `'nonce-${nonce}'`;
      }
    ]
  : null;

const reportUri = isSANB(process.env.WEB_URL)
  ? `${process.env.WEB_URL}/report`
  : null;

const sharedWebConfig = sharedConfig('WEB');

// setup our Cabin instance
const cabin = new Cabin({ logger });

module.exports = (redis) => ({
  ...sharedWebConfig,
  ...config,
  auth,
  rateLimit: {
    ...sharedWebConfig.rateLimit,
    ...config.rateLimit
  },
  routes: routes.web,
  logger: cabin,
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
          '/opensearch.xml',
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
    contentSecurityPolicy:
      defaultSrc && config.env !== 'development'
        ? {
            useDefaults: false,
            directives: {
              'default-src': _.without(defaultSrc, 'data:'),
              'connect-src': [
                ...defaultSrc,
                'https://www.paypal.com',
                'https://noembed.com',
                ...(env.NODE_ENV === 'production'
                  ? []
                  : ['https://www.sandbox.paypal.com'])
              ],
              'font-src': [...defaultSrc],
              'img-src': [
                ...defaultSrc,
                'https://badge.hardenize.com',
                'https://tracking.qa.paypal.com',
                'https://www.paypalobjects.com',
                'https://github.com',
                'https://*.github.com',
                'https://githubusercontent.com',
                'https://*.githubusercontent.com',
                'https://shields.io',
                'https://*.shields.io',
                'https://ytimg.com',
                'https://*.ytimg.com'
              ],
              'style-src': [
                ...defaultSrc,
                "'unsafe-inline'",
                'https://www.paypal.com',
                'https://challenges.cloudflare.com'
              ],
              'script-src': [
                ..._.without(defaultSrc, 'data:'),
                "'unsafe-inline'",
                'https://challenges.cloudflare.com',
                'https://www.paypal.com',
                ...(env.NODE_ENV === 'production'
                  ? []
                  : ['https://www.sandbox.paypal.com'])
              ],
              'object-src': ["'none'"],
              'frame-ancestors': ["'self'"],
              'frame-src': [
                ...defaultSrc,
                'https://www.youtube.com',
                'https://*.youtube-nocookie.com',
                'https://challenges.cloudflare.com',
                'https://www.paypal.com',
                ...(env.NODE_ENV === 'production'
                  ? []
                  : ['https://www.sandbox.paypal.com'])
              ],
              'report-uri': reportUri || null,
              'base-uri': ["'self'"],
              'form-action': [
                "'self'",
                'https://www.namecheap.com',
                'https://login.ubuntu.com'
              ]
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
    xssFilter: false
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
  hookBeforeSetup(app) {
    // Koa v3 polyfill for ctx.redirect('back')
    // @see https://github.com/koajs/koa/releases/tag/v3.0.0
    app.use(koaRedirectBackPolyfill({ fallbackUrl: '/' }));

    app.context.resolver = createTangerine(
      app.context.client,
      app.context.logger
    );
    app.use((ctx, next) => {
      // since we're on an older helmet version due to koa-helmet
      // <https://github.com/helmetjs/helmet/issues/230>
      ctx.set('X-XSS-Protection', '0');
      return next();
    });
    // csp nonce
    // <script nonce="whatever">
    // <style nonce="whatever">
    //
    // NOTE: CSP nonces are hidden from browser DOM
    //       <https://github.com/pugjs/pug/issues/2899>
    //       <https://github.com/whatwg/html/issues/2369>
    app.use((ctx, next) => {
      if (ctx.method === 'GET' && env.NODE_ENV !== 'test') {
        const nonce = crypto.randomBytes(16).toString('hex');
        ctx.set('X-CSP-Nonce', nonce);
        ctx.state.nonce = nonce;
      }

      return next();
    });
    //
    // OpenPGP WKD lookup requires this header
    // > The Access-Control-Allow-Origin: * header is needed to allow OpenPGP clients to fetch the policy from a different domain, bypassing CORS restrictions.
    // https://www.webkeydirectory.com/?email=support@forwardemail.net
    //
    app.use(async (ctx, next) => {
      if (ctx.path.startsWith('/.well-known/openpgpkey'))
        ctx.set('Access-Control-Allow-Origin', '*');
      return next();
    });
    // dynamic security.txt with 1 yr expiry
    // `gpg --clearsign --sign --default-key support@forwardemail.net assets/.well-known/security.txt`
    // <https://github.com/js-kyle/koa-security.txt>
    app.use(async (ctx, next) => {
      if (
        ctx.path !== '/security.txt' &&
        ctx.path !== '/.well-known/security.txt'
      )
        return next();
      if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
        ctx.status = ctx.method === 'OPTIONS' ? 200 : 405;
        ctx.set('Allow', 'GET, HEAD, OPTIONS');
      } else {
        ctx.type = 'text/plain';

        const text = [
          `Contact: mailto:security@${config.webHost}`,
          `Encryption: ${config.urls.web}${config.openPGPKey}`,
          // TODO: Acknowledgements (?)
          `Preferred-Languages: ${i18n.config.defaultLocale}`,
          `Canonical: ${config.urls.web}/.well-known/security.txt`,
          `Policy: https://github.com/forwardemail/.github/blob/main/SECURITY.md`,
          `Hiring: ${config.urls.web}`,
          // can't do more than 1 year otherwise test tools throw a warning
          // (e.g. <https://internet.nl/site/forwardemail.net/>)
          `Expires: ${dayjs().utc().endOf('year').toDate().toISOString()}`
        ]
          .join('\r\n')
          .trim();

        if (signingKeys) {
          try {
            const unsignedMessage = await openpgp.createCleartextMessage({
              text
            });
            const cleartextMessage = await openpgp.sign({
              message: unsignedMessage,
              signingKeys
            });
            ctx.body = cleartextMessage;
          } catch (err) {
            err.isCodeBug = true;
            ctx.logger.fatal(err);
            ctx.body = text;
          }
        } else {
          ctx.body = text;
        }
      }
    });
    app.use(async (ctx, next) => {
      // convert local IPv6 addresses to IPv4 format
      // <https://blog.apify.com/ipv4-mapped-ipv6-in-nodejs/>
      if (ipaddr.isValid(ctx.request.ip)) {
        const addr = ipaddr.parse(ctx.request.ip);
        if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress())
          ctx.request.ip = addr.toIPv4Address().toString();
      }

      // if we need to allowlist certain IP which resolve to our hostnames
      if (ctx.resolver) {
        try {
          // maximum of 3s before ac times out
          const abortController = new AbortController();
          const timeout = setTimeout(() => abortController.abort(), 3000);
          const [clientHostname] = await ctx.resolver.reverse(
            ctx.request.ip,
            abortController
          );
          clearTimeout(timeout);
          if (isFQDN(clientHostname)) {
            if (RATELIMIT_ALLOWLIST.includes(clientHostname))
              ctx.allowlistValue = clientHostname;
            else {
              const rootClientHostname = parseRootDomain(clientHostname);
              if (RATELIMIT_ALLOWLIST.includes(rootClientHostname))
                ctx.allowlistValue = rootClientHostname;
            }
          }
        } catch (err) {
          ctx.logger.warn(err);
        }
      }

      return next();
    });
  },
  hookBeforeRoutes(app) {
    // prevent bots from creating sessions
    app.use((ctx, next) => {
      // skip session for bots to prevent unnecessary Redis storage
      const isBot = isbot(ctx.get('User-Agent'));

      if (isBot) {
        ctx.sessionSave = false;

        // Wrap ctx.session with a Proxy that prevents any writes
        // This ensures code throughout the app can't accidentally create bot sessions
        const originalDescriptor = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(ctx),
          'session'
        );

        if (originalDescriptor && originalDescriptor.get) {
          const originalGetter = originalDescriptor.get;

          Object.defineProperty(ctx, 'session', {
            get() {
              const session = originalGetter.call(this);
              if (!session) return session;

              // Return a Proxy that silently ignores all writes
              return new Proxy(session, {
                set() {
                  return true; // Silently ignore
                },
                deleteProperty() {
                  return true; // Silently ignore
                }
              });
            },
            set() {
              // Ignore session assignment for bots
            }
          });
        }
      }

      return next();
    });

    // remove nonce used in headers for helmet compatibility (old req/res approach)
    app.use((ctx, next) => {
      if (ctx.method === 'GET') ctx.remove('X-CSP-Nonce');
      return next();
    });
    // redirect return-path CNAME to main domain
    // (e.g. fe-bounces.forwardemail.net > forwardemail.net)
    app.use((ctx, next) => {
      // if (env.NODE_ENV === 'test' || ctx.hostname === config.webHost)
      if (ctx.hostname !== `${config.returnPath}.${config.webHost}`)
        return next();
      // redirect
      ctx.status = 301;
      let port;
      if (ctx.host.split(':').length === 2) port = ':' + ctx.host.split(':')[1];
      ctx.redirect(`${ctx.protocol}://${config.webHost}${port}${ctx.url}`);
    });

    // if user has OTP remember me then set on session
    // and/or
    // if user is logged in then ensure their current session ID is stored
    app.use((ctx, next) => {
      if (ctx.session && ctx.isAuthenticated()) {
        if (!Array.isArray(ctx.state.user.sessions)) {
          Users.findOneAndUpdate(
            {
              id: ctx.state.user.id
            },
            {
              $set: {
                sessions: [ctx.sessionId]
              }
            }
          );
        } else if (!ctx.state.user.sessions.includes(ctx.sessionId)) {
          Users.findOneAndUpdate(
            {
              id: ctx.state.user.id
            },
            {
              $addToSet: {
                sessions: ctx.sessionId
              }
            }
          )
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }

        if (ctx.state.user[config.passport.fields.otpEnabled]) {
          if (ctx.session.otp) {
            if (ctx.session.otp_remember_me) {
              ctx.cookies.set(
                'otp_remember_me',
                ctx.state.user.id,
                cookieOptions
              );
            } else {
              ctx.cookies.set('otp_remember_me', null);
            }
          } else if (ctx.cookies.get('otp_remember_me') === ctx.state.user.id) {
            ctx.session.otp = 'remember_me';
          }
        }
      }

      return next();
    });
  },
  hookBeforePassport(app) {
    app.use(async (ctx, next) => {
      if (!ctx.api && ctx.method === 'GET' && ctx.accepts('html')) {
        // to avoid LCP lighthouse issues
        ctx.state.appCss = appCss;
        ctx.state.botCss = botCss;
        //
        // test mode should not render this because stars function
        // uses `random()` which causes CSS output to constantly change
        // (and CI would otherwise fail)
        //
        if (config.env !== 'test') ctx.state.freddyCss = freddyCss;

        ctx.state.tti = false;
      }

      return next();
    });

    app.use(async (ctx, next) => {
      let position = 'bottom';

      // TODO: make https://status.forwardemail.net into an env var and replace it everywhere with ripgrep
      if (
        config.env !== 'test' &&
        typeof ACTIVE_GITHUB_ISSUES === 'object' &&
        Array.isArray(ACTIVE_GITHUB_ISSUES.data) &&
        ACTIVE_GITHUB_ISSUES.data.length > 0
      ) {
        ctx.state.statusOutage = true;
        if (!ctx.session._gh_issue) {
          ctx.session._gh_issue = true;
          ctx.flash('custom', {
            title: ctx.request.t('Warning'),
            html: `<small>${ctx.translate(
              'ACTIVE_INCIDENT',
              'https://status.forwardemail.net',
              // ACTIVE_GITHUB_ISSUES.data.length > 1
              //   ? 'https://status.forwardemail.net'
              //   : ACTIVE_GITHUB_ISSUES.data[0].html_url ||
              //       'https://status.forwardemail.net',
              ACTIVE_GITHUB_ISSUES.data[0].title ||
                'Please view our status page for more information.'
            )}</small>`,
            type: 'warning',
            toast: true,
            showConfirmButton: false,
            position,
            timer: 10000
          });
          position = 'top';
        }
      } else {
        ctx.session._gh_issue = false;
      }

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
        config.env !== 'test' &&
        (isMongooseDown || isRedisDown)
      ) {
        ctx.state.statusOutage = true;
        ctx.flash('custom', {
          title: ctx.request.t('Warning'),
          html: `<small>${ctx.translate('WEBSITE_OUTAGE')}</small>`,
          type: 'warning',
          toast: true,
          showConfirmButton: false,
          timer: 5000,
          position
        });
      }

      return next();
    });
  }
});
