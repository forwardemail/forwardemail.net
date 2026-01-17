/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Cabin = require('cabin');

const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');

const env = require('./env');

const config = require('.');
const koaRedirectBackPolyfill = require('#helpers/koa-redirect-back-polyfill');

const createTangerine = require('#helpers/create-tangerine');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const analyticsMiddleware = require('#helpers/analytics-middleware');
const denylistMiddleware = require('#helpers/denylist-request');

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
    // Denylist middleware: checks referer, IP, user email, and resolved hostname
    // Also handles IPv6 to IPv4 conversion and PTR lookup for allowlist
    app.use(denylistMiddleware(RATELIMIT_ALLOWLIST));

    // Analytics middleware for tracking API calls (excludes bots)
    app.use(analyticsMiddleware({ service: 'api', trackAPICalls: true }));
  },
  bodyParserIgnoredPathGlobs: ['/v1/log', '/v1/emails']
};
