/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Koa v3 Redirect Back Polyfill
 *
 * In Koa v3, `ctx.redirect('back')` was removed and replaced with `ctx.back(fallbackUrl)`.
 * This middleware polyfills the old behavior by intercepting `ctx.redirect('back')` calls
 * and converting them to use the Referer header with a fallback URL.
 *
 * @see https://github.com/koajs/koa/releases/tag/v3.0.0
 * @see https://github.com/koajs/koa/pull/1115
 *
 * Only a referrer on one of `allowedOrigins` is followed.  Koa 3's own
 * `ctx.back()` checks this too; without it any page could send a visitor
 * here and have them bounced to an arbitrary site (an open redirect, e.g.
 * a POST to /forgot-password from a phishing page).  The origins come from
 * configuration, not from the request's Host header, which the client
 * controls.
 *
 * Usage:
 *   const koaRedirectBackPolyfill = require('./helpers/koa-redirect-back-polyfill');
 *   app.use(koaRedirectBackPolyfill({ fallbackUrl: '/', allowedOrigins: [config.urls.web] }));
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.fallbackUrl='/'] - The fallback URL to use when Referer header is not available
 * @param {string[]} [options.allowedOrigins=[]] - URLs whose origin a referrer may have
 * @returns {Function} Koa middleware function
 */

function toOrigin(url) {
  try {
    const { origin, protocol } = new URL(url);
    if (protocol !== 'http:' && protocol !== 'https:') return null;
    return origin;
  } catch {
    return null;
  }
}

function koaRedirectBackPolyfill(options = {}) {
  const { fallbackUrl = '/', allowedOrigins = [] } = options;
  const origins = new Set(allowedOrigins.map((url) => toOrigin(url)));
  origins.delete(null);

  return async function (ctx, next) {
    // Store the original redirect function
    const originalRedirect = ctx.redirect.bind(ctx);

    // Override ctx.redirect to handle 'back' specially
    ctx.redirect = function (url, alt) {
      // If url is 'back', use the Referer header or fallback
      if (url === 'back') {
        const referrer = ctx.get('Referer') || ctx.get('Referrer');
        if (referrer && origins.has(toOrigin(referrer)))
          return originalRedirect(referrer);

        // Also handle localized fallback if ctx.state.l is available
        const backUrl = alt || fallbackUrl;
        return originalRedirect(
          typeof ctx.state?.l === 'function' && backUrl.startsWith('/')
            ? ctx.state.l(backUrl)
            : backUrl
        );
      }

      // For all other URLs, use the original redirect
      return originalRedirect(url, alt);
    };

    await next();
  };
}

module.exports = koaRedirectBackPolyfill;
