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

const isbot = require('isbot');

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
const getSessionKeys = require('#helpers/get-session-keys');
const koaRedirectBackPolyfill = require('#helpers/koa-redirect-back-polyfill');
const {
  createOtpRememberMeCookie,
  isValidOtpRememberMeCookie
} = require('#helpers/otp-remember-me');
const _ = require('#helpers/lodash');

const Users = require('#models/users');
const createTangerine = require('#helpers/create-tangerine');
const i18n = require('#helpers/i18n');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');
const logger = require('#helpers/logger');
const analyticsMiddleware = require('#helpers/analytics-middleware');
const denylistMiddleware = require('#helpers/denylist-request');
const noindexQueryStrings = require('#helpers/noindex-query-strings');
const {
  getStatsForUser,
  buildBadgeTooltip
} = require('#controllers/web/event-feed');

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

//
// The stylesheet is inlined on a visitor's first page view (no extra round
// trip before first paint on a cold connection), and after the page loads a
// small script fetches the revisioned app.<hash>.css into the HTTP cache and
// sets the `fe_css` cookie to that revision. Later page views from that
// browser get a <link> to the cached file instead of ~250KB of inline CSS in
// every HTML response (~40KB compressed that could never be cached).
//
// A stale or missing cookie simply means inlining again, and a cookie whose
// cache entry was evicted costs one normal render-blocking stylesheet fetch.
//
const APP_CSS_COOKIE = 'fe_css';
let appCssRev;

function readAppCssRev() {
  try {
    const revManifest = JSON.parse(fs.readFileSync(config.manifest, 'utf8'));
    const file = revManifest['css/app.css'];
    const match =
      typeof file === 'string' && file.match(/app\.([\da-f]{8,})\.css$/);
    appCssRev = match ? match[1] : undefined;
  } catch (err) {
    appCssRev = undefined;
    logger.error(err);
  }
}

readAppCssRev();

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

//
// The bundles are read once above and inlined into every page. In
// development they are rebuilt while this process runs (`gulp watch`), so
// re-read them when they change rather than requiring a restart. Production
// keeps the single read at boot.
//
if (config.env === 'development') {
  try {
    const cssDir = path.join(config.buildDir, 'css');
    const timers = new Map();
    fs.watch(cssDir, (eventType, filename) => {
      if (filename !== 'app.css' && filename !== 'app-bot.css') return;
      clearTimeout(timers.get(filename));
      timers.set(
        filename,
        setTimeout(() => {
          try {
            const css = fs.readFileSync(path.join(cssDir, filename), 'utf8');
            if (filename === 'app.css') {
              appCss = css;
              readAppCssRev();
            } else {
              botCss = css;
            }

            logger.info(`reloaded css/${filename}`);
          } catch (err) {
            logger.error(err);
          }
        }, 250)
      );
    });
  } catch (err) {
    logger.error(err);
  }
}

async function checkGitHubIssues() {
  try {
    ACTIVE_GITHUB_ISSUES = await octokit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: 'forwardemail',
        repo: 'status.forwardemail.net',
        state: 'open',
        creator: 'titanism',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
  } catch (err) {
    logger.fatal(err);
  }
}

// GitHub API is limited to 5K requests per hour
// (if we check every 5 minutes, then that is 12 requests per hour)
if (config.env !== 'test') {
  checkGitHubIssues();
  setInterval(checkGitHubIssues, 300000);
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
        : [`http://${env.WEB_HOST}:*`])
    ]
  : null;

const reportUri = isSANB(process.env.WEB_URL)
  ? `${process.env.WEB_URL}/report`
  : null;

const sharedWebConfig = sharedConfig('WEB');
const sessionKeys = getSessionKeys();

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
          '/llms.txt',
          '/llms-full.txt',
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
                //
                // 'strict-dynamic' makes the host allowlist below a
                // no-op for <script> elements: only scripts carrying the
                // per-request nonce (or transitively trusted by such a
                // script) are executed. Every <script> opener in our pug
                // templates MUST therefore carry `nonce=nonce` — audit
                // with: `node scripts/audit-pug-nonces.js`
                // (or `grep -RnE "^\s*script\b" app/views/**/*.pug`).
                // The host allowlist is retained as a fallback for
                // browsers that don't yet implement strict-dynamic.
                //
                "'strict-dynamic'",
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
                'https://login.ubuntu.com',
                // Domain Connect provider apply URLs
                // (form POST to /domain-connect redirects to these external URLs)
                'https://dash.cloudflare.com',
                'https://dcc.godaddy.com',
                'https://api.domainconnect.ionos.com',
                'https://dns.glauca.digital',
                'https://domains.squarespace.com'
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
    // 'same-origin' sends no referrer for cross-origin requests, which is
    // the strictest practical setting (internet.nl "Good" category).
    // YouTube embeds need a Referer header to avoid Error 153, so every
    // lazyframe iframe gets referrerpolicy="strict-origin-when-cross-origin"
    // set via the onAppend callback in assets/js/core.js.
    referrerPolicy: {
      policy: 'same-origin'
    },
    xssFilter: false
  },
  sessionKeys,
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
      //
      // Client Hints — request high-entropy platform version so we can
      // display the real macOS/Windows version in the session list.
      // Chromium-based browsers freeze the UA string at macOS 10.15.7;
      // the Sec-CH-UA-Platform-Version header provides the true version.
      // <https://wicg.github.io/ua-client-hints/>
      //
      ctx.set('Accept-CH', 'Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version');
      //
      // Permissions-Policy response header.
      //
      // We disable every powerful API we don't actually use. This both
      // hardens the surface for cross-origin frames (PayPal, Cloudflare
      // Turnstile, YouTube) and silences spurious browser console
      // warnings such as:
      //   [Violation] Permissions policy violation: xr-spatial-tracking
      //     is not allowed in this document.
      // which are emitted by embedded YouTube/youtube-nocookie iframes
      // when the parent document does not opt into the requested
      // policy.
      //
      // Spec: <https://www.w3.org/TR/permissions-policy/>
      // Header registry: <https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md>
      //
      //
      // The YouTube player (every video on the site is a youtube-nocookie
      // embed via lazyframe) needs autoplay (so one click plays),
      // fullscreen, picture-in-picture, encrypted-media and the motion
      // sensors (360 video). A page cannot grant an iframe a feature it has
      // disabled for itself, so these are allowed for our own origin and the
      // two YouTube embed origins only; every other origin stays denied.
      //
      // Features Chrome does not recognize (ambient-light-sensor, battery,
      // execution-while-not-rendered, execution-while-out-of-viewport,
      // speaker-selection) were dropped: they disabled nothing and logged an
      // "Unrecognized feature" warning on every page view.
      //
      const youtube =
        'self "https://www.youtube-nocookie.com" "https://www.youtube.com"';
      ctx.set(
        'Permissions-Policy',
        [
          `accelerometer=(${youtube})`,
          `autoplay=(${youtube})`,
          'bluetooth=()',
          'browsing-topics=()',
          'camera=()',
          'display-capture=()',
          `encrypted-media=(${youtube})`,
          `fullscreen=(${youtube})`,
          'gamepad=()',
          'geolocation=()',
          `gyroscope=(${youtube})`,
          'hid=()',
          'identity-credentials-get=()',
          'idle-detection=()',
          'local-fonts=()',
          'magnetometer=()',
          'microphone=()',
          'midi=()',
          'otp-credentials=()',
          'payment=(self)',
          `picture-in-picture=(${youtube})`,
          'publickey-credentials-get=(self)',
          'screen-wake-lock=()',
          'serial=()',
          'storage-access=()',
          'usb=()',
          'web-share=()',
          'window-management=()',
          'xr-spatial-tracking=()'
        ].join(', ')
      );
      return next();
    });
    // CSP nonce — async middleware that wraps around helmet.
    // 1. Generate a per-request nonce and expose it to pug via ctx.state.
    // 2. After downstream (helmet) sets the CSP header, rewrite it to
    //    inject 'nonce-<hex>' into script-src only.
    // This replaces the old Symbol(kOutHeaders) hack and works reliably
    // across all Node.js versions.
    //
    // NOTE: We do NOT inject nonce into style-src because adding a nonce
    //       causes the browser to ignore 'unsafe-inline' (per CSP3 spec),
    //       which would break third-party injected styles (Scalar API
    //       reference, PayPal, Turnstile, etc.).  style-src keeps
    //       'unsafe-inline' without a nonce so all inline styles work.
    //
    // NOTE: CSP nonces are hidden from browser DOM
    //       <https://github.com/pugjs/pug/issues/2899>
    //       <https://github.com/whatwg/html/issues/2369>
    app.use(async (ctx, next) => {
      if (ctx.method !== 'GET') return next();

      const nonce =
        config.env === 'test'
          ? 'deadbeefcafeface0123456789abcdef'
          : crypto.randomBytes(16).toString('hex');
      ctx.state.nonce = nonce;

      try {
        await next();
      } finally {
        // Rewrite the CSP header that helmet set during downstream processing.
        // Wrapped in try/finally so the nonce is injected even when the error
        // handler (koa-better-error-handler) renders 4xx/5xx pages — otherwise
        // inline scripts on error pages are blocked by CSP.
        const csp = ctx.response.get('Content-Security-Policy');
        if (csp) {
          const nonceToken = `'nonce-${nonce}'`;
          const patched = csp.replace(
            /(?<=script-src\s)([^;]*)/,
            `$1 ${nonceToken}`
          );
          ctx.set('Content-Security-Policy', patched);
        }
      }
    });
    //
    // Browser cache policy for static build assets.
    //
    // koa-better-static always writes `Cache-Control: max-age=<maxage>` and
    // runs after koa-cache-responses, so any request that missed koa-cash
    // (cold Redis key, expiry, a new deploy) went out with `max-age=0` and
    // the browser revalidated or re-downloaded fonts, CSS, JS and images on
    // every page view. This runs outermost and sets the final header:
    //
    // - revisioned files (`app.5d4a813b.css`, `logo-710d76ea36.svg`) never
    //   change at a given URL, so they are immutable for a year
    // - fonts are not revisioned but change about never, so a year without
    //   `immutable` (a hard reload still revalidates)
    // - unrevisioned discovery files (robots.txt, llms.txt, .well-known/*)
    //   get an hour so crawlers and agents see edits the same day
    //
    const REVISIONED_ASSET =
      /[.-][\da-f]{8,10}\.(?:css|js|mjs|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|json|pdf|mp4|webm|txt|xml)$/;
    const DISCOVERY_FILES = new Set([
      '/robots.txt',
      '/llms.txt',
      '/llms-full.txt',
      '/site.webmanifest',
      '/browserconfig.xml',
      '/opensearch.xml'
    ]);
    app.use(async (ctx, next) => {
      await next();
      if (ctx.method !== 'GET' && ctx.method !== 'HEAD') return;
      if (ctx.status !== 200 && ctx.status !== 304) return;
      const { path } = ctx;
      if (
        /^\/(?:css|js|img|fonts)\//.test(path) &&
        REVISIONED_ASSET.test(path)
      ) {
        ctx.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.startsWith('/fonts/')) {
        ctx.set('Cache-Control', 'public, max-age=31536000');
      } else if (
        DISCOVERY_FILES.has(path) ||
        (path.startsWith('/.well-known/') &&
          !path.startsWith('/.well-known/openpgpkey/') &&
          path !== '/.well-known/security.txt')
      ) {
        ctx.set('Cache-Control', 'public, max-age=3600');
      }
    });
    //
    // Chrome DevTools automatic workspace discovery
    // <https://developer.chrome.com/docs/devtools/automatic-workspaces>
    // Chrome sends this request to localhost dev servers; return 204 to
    // silence the 404 noise in production logs.
    //
    app.use(async (ctx, next) => {
      if (ctx.path === '/.well-known/appspecific/com.chrome.devtools.json') {
        ctx.status = 204;
        return;
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
    //
    // AI agent / API discovery documents (app/controllers/web/ai-discovery.js)
    // are public and read by browser-based agents, so allow any origin. Set
    // here rather than in the controller because /.well-known/* responses are
    // served from koa-cash, which does not replay custom headers.
    //
    app.use(async (ctx, next) => {
      if (
        ctx.path === '/.well-known/ai-catalog.json' ||
        ctx.path === '/.well-known/api-catalog' ||
        ctx.path === '/.well-known/mcp/server-card.json' ||
        ctx.path === '/.well-known/mcp.json' ||
        ctx.path === '/llms.txt' ||
        ctx.path === '/llms-full.txt' ||
        ctx.path === '/api-spec.json'
      )
        ctx.set('Access-Control-Allow-Origin', '*');
      // RFC 9727 section 4: advertise the API catalog (the <head> of every
      // page also carries <link rel="api-catalog">, see _meta.pug)
      if (ctx.path === '/.well-known/api-catalog' || ctx.path === '/')
        ctx.append(
          'Link',
          `<${config.urls.web}/.well-known/api-catalog>; rel="api-catalog"`
        );
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
  },
  hookBeforeRoutes(app) {
    // Denylist middleware: checks referer, IP, user email, and resolved hostname.
    // Placed here (after i18n.middleware) so that when a denylisted request
    // triggers the error handler, ctx.pathWithoutLocale, ctx.locale and t()
    // are already set and the 500 error page renders correctly instead of
    // falling back to a generic "Internal Server Error" response.
    // Page views do not wait on cold reverse DNS lookups (mobile TTFB); see
    // helpers/denylist-request.js
    app.use(
      denylistMiddleware(RATELIMIT_ALLOWLIST, {
        safeMethodBudgetMs: denylistMiddleware.PTR_SAFE_METHOD_BUDGET_MS
      })
    );

    // Redirect www to non-www
    app.use((ctx, next) => {
      if (ctx.hostname === `www.${config.webHost}`) {
        ctx.status = 301;
        let port = '';
        if (ctx.host.split(':').length === 2)
          port = ':' + ctx.host.split(':')[1];
        ctx.redirect(`${ctx.protocol}://${config.webHost}${port}${ctx.url}`);
        return;
      }

      return next();
    });

    // Prevent search engines from indexing URLs with query strings
    // This avoids duplicate content issues (e.g., UTM parameters, tracking codes)
    app.use(noindexQueryStrings);

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

    // Analytics middleware for tracking page views (excludes bots)
    app.use(analyticsMiddleware({ service: 'web', trackPageViews: true }));

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
        // Skip session tracking for admin impersonation sessions
        if (!ctx.session._admin_impersonation) {
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
        }

        // Store session metadata for session management UI
        if (!ctx.session._meta) {
          ctx.session._meta = {
            ip: ctx.ip,
            ua: ctx.get('user-agent'),
            created_at: new Date().toISOString()
          };
        }

        // Keep IP and UA current (user may roam networks or switch devices)
        ctx.session._meta.ip = ctx.ip;
        ctx.session._meta.ua = ctx.get('user-agent');
        ctx.session._meta.last_active = new Date().toISOString();

        // Capture Client Hints headers for accurate OS version detection.
        // Chromium-based browsers send these when Accept-CH is set.
        const chPlatform = ctx.get('sec-ch-ua-platform');
        const chPlatformVersion = ctx.get('sec-ch-ua-platform-version');
        if (chPlatform) ctx.session._meta.ch_platform = chPlatform;
        if (chPlatformVersion)
          ctx.session._meta.ch_platform_version = chPlatformVersion;

        if (ctx.state.user[config.passport.fields.otpEnabled]) {
          if (ctx.session.otp) {
            if (ctx.session.otp_remember_me) {
              ctx.cookies.set(
                'otp_remember_me',
                createOtpRememberMeCookie(ctx.state.user.id),
                cookieOptions
              );
            } else {
              ctx.cookies.set('otp_remember_me', null);
            }
          } else if (
            isValidOtpRememberMeCookie(
              ctx.cookies.get('otp_remember_me'),
              ctx.state.user.id
            )
          ) {
            ctx.session.otp = 'remember_me';
          } else {
            ctx.cookies.set('otp_remember_me', null, cookieOptions);
          }
        }
      }

      return next();
    });

    //
    // Preferred locale middleware - allows users to set their language preference
    // When a user has set preferred_locale, redirect to the correct locale URL
    // and override automatic locale detection
    //
    app.use(async (ctx, next) => {
      if (
        ctx.isAuthenticated() &&
        ctx.state.user &&
        isSANB(ctx.state.user.preferred_locale) &&
        i18n.config.locales.includes(ctx.state.user.preferred_locale)
      ) {
        const preferredLocale = ctx.state.user.preferred_locale;

        // Check if the current URL locale matches the user's preferred locale
        // ctx.pathWithoutLocale is set by @ladjs/i18n middleware
        const urlLocale = ctx.path.split('/')[1];
        const hasLocaleInUrl = i18n.config.locales.includes(urlLocale);

        // If URL has a locale that doesn't match preferred, redirect
        if (
          hasLocaleInUrl &&
          urlLocale !== preferredLocale &&
          ctx.method === 'GET' &&
          ctx.accepts('html')
        ) {
          // Build the redirect URL with the preferred locale
          const pathWithoutLocale =
            ctx.pathWithoutLocale ||
            ctx.path.slice(urlLocale.length + 1) ||
            '/';
          let redirectUrl = `/${preferredLocale}${
            pathWithoutLocale === '/' ? '' : pathWithoutLocale
          }`;
          if (ctx.querystring) {
            redirectUrl += `?${ctx.querystring}`;
          }

          ctx.status = 302;
          return ctx.redirect(redirectUrl);
        }

        // Override the detected locale with user's preference for rendering
        ctx.locale = preferredLocale;
        ctx.request.locale = preferredLocale;
        if (typeof ctx.request.setLocale === 'function') {
          ctx.request.setLocale(preferredLocale);
        }
      }

      return next();
    });
  },
  hookBeforePassport(app) {
    app.use(async (ctx, next) => {
      if (!ctx.api && ctx.method === 'GET' && ctx.accepts('html')) {
        // inline on first view, cached <link> once the browser has it
        // (see APP_CSS_COOKIE above)
        ctx.state.appCss = appCss;
        ctx.state.botCss = botCss;
        ctx.state.appCssRev = appCssRev;
        ctx.state.appCssCookie = APP_CSS_COOKIE;
        ctx.state.appCssCached = Boolean(
          appCssRev &&
            ctx.cookies.get(APP_CSS_COOKIE, { signed: false }) === appCssRev
        );

        ctx.state.tti = false;
      }

      return next();
    });

    // Add twimg.com to CSP for event-feed page only
    app.use((ctx, next) => {
      if (ctx.pathWithoutLocale === '/event-feed') {
        const csp = ctx.response.get('Content-Security-Policy');
        if (csp) {
          let updatedCsp = csp;
          // Add *.twimg.com to img-src
          updatedCsp = updatedCsp.replace(
            /img-src ([^;]+)/,
            'img-src $1 https://*.twimg.com'
          );
          // Add *.twimg.com to connect-src
          updatedCsp = updatedCsp.replace(
            /connect-src ([^;]+)/,
            'connect-src $1 https://*.twimg.com'
          );
          // Add video-src with *.twimg.com if not present, or append to existing
          if (updatedCsp.includes('video-src')) {
            updatedCsp = updatedCsp.replace(
              /video-src ([^;]+)/,
              'video-src $1 https://*.twimg.com'
            );
          } else {
            updatedCsp = updatedCsp.replace(
              /img-src ([^;]+)/,
              "img-src $1; video-src 'self' https://*.twimg.com"
            );
          }

          ctx.response.set('Content-Security-Policy', updatedCsp);
        }
      }

      return next();
    });

    // Event feed navbar badge middleware (synchronous - reads from global memory)
    app.use((ctx, next) => {
      // Skip for bots and non-HTML requests
      if (
        ctx.api ||
        ctx.method !== 'GET' ||
        !ctx.accepts('html') ||
        isbot(ctx.get('User-Agent'))
      ) {
        return next();
      }

      // Get the last visit time from session
      const lastVisit = ctx.session?.eventFeedLastVisit
        ? new Date(ctx.session.eventFeedLastVisit)
        : null;

      // Get stats synchronously from global in-memory cache based on user's lastVisit
      const stats = getStatsForUser(lastVisit);

      // Show badge with new events count (red) or total events (grey)
      ctx.state.eventFeedStats = stats;
      if (stats.total > 0) {
        // New events since last visit - show red badge
        ctx.state.eventFeedBadgeCount = stats.total;
        ctx.state.eventFeedBadgeTooltip = buildBadgeTooltip(
          stats,
          true,
          ctx.request.t
        );
        ctx.state.eventFeedHasNew = true;
      } else {
        // No new events - show grey badge with total count
        ctx.state.eventFeedBadgeCount = stats.totalEvents;
        ctx.state.eventFeedBadgeTooltip = buildBadgeTooltip(
          stats,
          false,
          ctx.request.t
        );
        ctx.state.eventFeedHasNew = false;
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

    // EU referrer notification for users coming from forwardemail.eu
    app.use(async (ctx, next) => {
      if (
        ctx.method === 'GET' &&
        ctx.accepts('html') &&
        ctx.session &&
        !ctx.session._eu_referrer_shown
      ) {
        const referrer = ctx.get('Referer') || ctx.get('Referrer') || '';
        if (referrer.includes('forwardemail.eu')) {
          ctx.session._eu_referrer_shown = true;
          ctx.flash('custom', {
            title: `🇪🇺 ${ctx.request.t('EU Servers Coming Soon')}`,
            html: `<small>${ctx.translate('EU_REFERRER_NOTIFICATION')}</small>`,
            type: 'info',
            toast: true,
            showConfirmButton: false,
            position: 'top',
            timer: 15000
          });
        }
      }

      return next();
    });
  }
});
