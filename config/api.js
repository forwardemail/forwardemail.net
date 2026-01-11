/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Cabin = require('cabin');
const ipaddr = require('ipaddr.js');
const isFQDN = require('is-fqdn');
const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');

const env = require('./env');

const config = require('.');
const koaRedirectBackPolyfill = require('#helpers/koa-redirect-back-polyfill');

const createTangerine = require('#helpers/create-tangerine');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const analyticsMiddleware = require('#helpers/analytics-middleware');

const sharedAPIConfig = sharedConfig('API');

// setup our Cabin instance
const cabin = new Cabin({ logger });

const RATELIMIT_ALLOWLIST =
  typeof env.RATELIMIT_ALLOWLIST === 'string'
    ? env.RATELIMIT_ALLOWLIST.split(',')
    : Array.isArray(env.RATELIMIT_ALLOWLIST)
    ? env.RATELIMIT_ALLOWLIST
    : [];

const rateLimit = {
  ...sharedAPIConfig.rateLimit,
  ...config.rateLimit
};

if (!Array.isArray(rateLimit.ignoredPathGlobs)) rateLimit.ignoredPathGlobs = [];

//
// add `/v1/emails` so users can
// POST /v1/emails more than 1000 times (default limit)
//
rateLimit.ignoredPathGlobs.push('/v1/emails');

module.exports = {
  ...sharedAPIConfig,
  ...config,
  auth: false,
  rateLimit,
  routes: routes.api,
  logger: cabin,
  i18n,
  hookBeforeSetup(app) {
    // Koa v3 polyfill for ctx.redirect('back')
    // @see https://github.com/koajs/koa/releases/tag/v3.0.0
    app.use(koaRedirectBackPolyfill({ fallbackUrl: '/' }));

    app.context.resolver = createTangerine(
      app.context.client,
      app.context.logger
    );
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

    // Analytics middleware for tracking API calls (excludes bots)
    app.use(analyticsMiddleware({ service: 'api', trackAPICalls: true }));
  },
  bodyParserIgnoredPathGlobs: ['/v1/log', '/v1/emails']
};
