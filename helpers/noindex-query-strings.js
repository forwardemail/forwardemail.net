/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isbot = require('isbot');

/**
 * Noindex Query Strings Middleware
 *
 * This middleware adds `X-Robots-Tag: noindex` header for bot requests
 * that include query strings. This prevents search engines from indexing
 * URLs with query parameters (e.g., UTM tracking, session IDs, filters)
 * which can cause duplicate content issues in search results.
 *
 * The middleware only affects bots/crawlers - regular users are not impacted.
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
 * @see https://github.com/omrilotan/isbot
 *
 * Usage:
 *   const noindexQueryStrings = require('./helpers/noindex-query-strings');
 *   app.use(noindexQueryStrings);
 */
function noindexQueryStrings(ctx, next) {
  // Only process GET/HEAD requests (search engines primarily use these)
  if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
    return next();
  }

  // Check if this is a bot/crawler
  const userAgent = ctx.get('User-Agent');
  if (!isbot(userAgent)) {
    return next();
  }

  // Check if the request has query parameters
  // ctx.querystring is the raw query string without the leading '?'
  if (ctx.querystring && ctx.querystring.length > 0) {
    // Add X-Robots-Tag header to prevent indexing
    // Using 'noindex' tells search engines not to index this URL
    ctx.set('X-Robots-Tag', 'noindex');
  }

  return next();
}

module.exports = noindexQueryStrings;
