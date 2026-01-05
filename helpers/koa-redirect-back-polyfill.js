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
 * Usage:
 *   const koaRedirectBackPolyfill = require('./helpers/koa-redirect-back-polyfill');
 *   app.use(koaRedirectBackPolyfill({ fallbackUrl: '/' }));
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.fallbackUrl='/'] - The fallback URL to use when Referer header is not available
 * @returns {Function} Koa middleware function
 */
function koaRedirectBackPolyfill(options = {}) {
  const { fallbackUrl = '/' } = options;

  return async function (ctx, next) {
    // Store the original redirect function
    const originalRedirect = ctx.redirect.bind(ctx);

    // Override ctx.redirect to handle 'back' specially
    ctx.redirect = function (url, alt) {
      // If url is 'back', use the Referer header or fallback
      if (url === 'back') {
        const referrer = ctx.get('Referer') || ctx.get('Referrer');
        // Use referrer if available, otherwise use fallback
        // Also handle localized fallback if ctx.state.l is available
        let backUrl = referrer || fallbackUrl;
        if (!referrer && typeof ctx.state?.l === 'function') {
          backUrl = ctx.state.l(fallbackUrl);
        }

        return originalRedirect(backUrl, alt);
      }

      // For all other URLs, use the original redirect
      return originalRedirect(url, alt);
    };

    await next();
  };
}

module.exports = koaRedirectBackPolyfill;
