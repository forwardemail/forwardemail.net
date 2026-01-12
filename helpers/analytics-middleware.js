/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isbot = require('isbot');

const analytics = require('#helpers/analytics');

/**
 * Koa middleware for tracking web page views and API calls
 * Privacy-focused: no IP storage, user agents parsed, bots excluded
 *
 * Also captures signup attribution data in session for later use during registration:
 * - Original referrer (where the user came from)
 * - Landing page (first page visited)
 * - UTM parameters
 *
 * @param {Object} options - Middleware options
 * @param {string} [options.service='web'] - Service type ('web' or 'api')
 * @param {boolean} [options.trackPageViews=true] - Whether to track page views
 * @param {boolean} [options.trackAPICalls=false] - Whether to track API calls
 * @param {string[]} [options.excludePaths=[]] - Paths to exclude from tracking (without locale prefix)
 * @returns {Function} Koa middleware
 */
function analyticsMiddleware(options = {}) {
  const {
    service = 'web',
    trackPageViews = true,
    trackAPICalls = false,
    excludePaths = []
  } = options;

  // Default paths to exclude (static assets, health checks, etc.)
  // These are matched against pathWithoutLocale to handle all locale variants
  const defaultExcludePaths = [
    '/health',
    '/healthcheck',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/_health',
    '/api/v1/health',
    // Exclude TTI (Time-To-Inbox) monitoring routes
    // These generate excessive events and are not meaningful page views
    '/tti'
  ];

  const allExcludePaths = [...defaultExcludePaths, ...excludePaths];

  return async function (ctx, next) {
    // Skip bots - don't track analytics for crawlers, scrapers, etc.
    const userAgent = ctx.get('User-Agent');
    if (isbot(userAgent)) {
      return next();
    }

    // Use pathWithoutLocale if available (set by @ladjs/i18n middleware)
    // This ensures we match paths regardless of locale prefix (e.g., /en/tti, /de/tti, /zh/tti)
    const pathToCheck = ctx.pathWithoutLocale || ctx.path;

    // Skip excluded paths (checked against path without locale)
    const shouldExclude = allExcludePaths.some((path) => {
      if (path.endsWith('*')) {
        return pathToCheck.startsWith(path.slice(0, -1));
      }

      return pathToCheck === path;
    });

    if (shouldExclude) {
      return next();
    }

    // Skip static assets
    if (
      ctx.path.startsWith('/css/') ||
      ctx.path.startsWith('/js/') ||
      ctx.path.startsWith('/img/') ||
      ctx.path.startsWith('/fonts/') ||
      ctx.path.startsWith('/assets/') ||
      ctx.path.endsWith('.js') ||
      ctx.path.endsWith('.css') ||
      ctx.path.endsWith('.map') ||
      ctx.path.endsWith('.png') ||
      ctx.path.endsWith('.jpg') ||
      ctx.path.endsWith('.jpeg') ||
      ctx.path.endsWith('.gif') ||
      ctx.path.endsWith('.svg') ||
      ctx.path.endsWith('.ico') ||
      ctx.path.endsWith('.woff') ||
      ctx.path.endsWith('.woff2') ||
      ctx.path.endsWith('.ttf') ||
      ctx.path.endsWith('.eot')
    ) {
      return next();
    }

    // Capture signup attribution data in session (only on first visit)
    // This data will be used when the user registers
    if (
      ctx.session &&
      service === 'web' && // Only capture on first visit (when landing page is not set)
      !ctx.session.signup_landing_page
    ) {
      // Store the landing page (use pathWithoutLocale for consistency)
      ctx.session.signup_landing_page = pathToCheck;

      // Store the referrer
      const referrer = ctx.get('referer') || ctx.get('referrer');
      if (referrer) {
        const referrerDomain = analytics.extractReferrerDomain(referrer);
        if (referrerDomain) {
          ctx.session.signup_referrer = referrerDomain;
          ctx.session.signup_referrer_source =
            analytics.categorizeReferrer(referrerDomain);
        }
      }

      // Store UTM parameters from query string
      const utmParams = analytics.extractUTMParams(ctx.query);
      if (utmParams.utm_source) {
        ctx.session.signup_utm_source = utmParams.utm_source;
      }

      if (utmParams.utm_medium) {
        ctx.session.signup_utm_medium = utmParams.utm_medium;
      }

      if (utmParams.utm_campaign) {
        ctx.session.signup_utm_campaign = utmParams.utm_campaign;
      }

      if (utmParams.utm_content) {
        ctx.session.signup_utm_content = utmParams.utm_content;
      }

      if (utmParams.utm_term) {
        ctx.session.signup_utm_term = utmParams.utm_term;
      }
    }

    // Determine if this is a landing page (first page view in session)
    const isLandingPage =
      ctx.session &&
      service === 'web' &&
      ctx.session.signup_landing_page === pathToCheck &&
      !ctx.session._analytics_page_count;

    // Increment page count for session
    if (ctx.session && service === 'web') {
      ctx.session._analytics_page_count =
        (ctx.session._analytics_page_count || 0) + 1;
    }

    // Execute the request first
    await next();

    // Track after the response is complete
    try {
      // Only track successful HTML page views for web
      if (
        service === 'web' &&
        trackPageViews && // Only track GET requests that return HTML
        ctx.method === 'GET' &&
        ctx.status < 400 &&
        ctx.type &&
        ctx.type.includes('text/html')
      ) {
        // Pass pathWithoutLocale to trackPageView for consistent pathname storage
        analytics.trackPageView(ctx, {
          is_landing_page: isLandingPage,
          pathWithoutLocale: pathToCheck
        });
      }

      // Track API calls
      if (service === 'api' && trackAPICalls) {
        analytics.trackAPICall(ctx);
      }
    } catch {
      // Don't let analytics errors affect the main application
    }
  };
}

module.exports = analyticsMiddleware;
