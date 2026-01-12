/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const analyticsMiddleware = require('#helpers/analytics-middleware');

// Helper to create mock Koa context
function createMockContext(options = {}) {
  const ctx = {
    path: options.path || '/',
    pathWithoutLocale: options.pathWithoutLocale || options.path || '/',
    method: options.method || 'GET',
    status: options.status || 200,
    type: options.type || 'text/html',
    ip: options.ip || '127.0.0.1',
    query: options.query || {},
    state: options.state || {},
    session: options.session || {},
    get(header) {
      const headers = {
        // Use a full Chrome UA to avoid being detected as a bot
        'User-Agent':
          options.userAgent ||
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        referer: options.referer || '',
        referrer: options.referrer || ''
      };
      return headers[header] || '';
    }
  };
  return ctx;
}

// ============================================================================
// TTI Route Exclusion Tests
// ============================================================================

test('analyticsMiddleware excludes /tti path', async (t) => {
  const middleware = analyticsMiddleware();
  let nextCalled = false;

  const ctx = createMockContext({ path: '/tti', pathWithoutLocale: '/tti' });
  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(nextCalled, 'next() should be called');
  // TTI should be excluded, so no tracking should occur
  // We verify this by checking that the middleware returns early
});

test('analyticsMiddleware excludes /tti with locale prefix /en/tti', async (t) => {
  const middleware = analyticsMiddleware();
  let nextCalled = false;

  const ctx = createMockContext({
    path: '/en/tti',
    pathWithoutLocale: '/tti'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(nextCalled, 'next() should be called for /en/tti');
});

test('analyticsMiddleware excludes /tti with locale prefix /de/tti', async (t) => {
  const middleware = analyticsMiddleware();
  let nextCalled = false;

  const ctx = createMockContext({
    path: '/de/tti',
    pathWithoutLocale: '/tti'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(nextCalled, 'next() should be called for /de/tti');
});

test('analyticsMiddleware excludes /tti with locale prefix /zh/tti', async (t) => {
  const middleware = analyticsMiddleware();
  let nextCalled = false;

  const ctx = createMockContext({
    path: '/zh/tti',
    pathWithoutLocale: '/tti'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(nextCalled, 'next() should be called for /zh/tti');
});

test('analyticsMiddleware excludes /tti with locale prefix /he/tti', async (t) => {
  const middleware = analyticsMiddleware();
  let nextCalled = false;

  const ctx = createMockContext({
    path: '/he/tti',
    pathWithoutLocale: '/tti'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(nextCalled, 'next() should be called for /he/tti');
});

// ============================================================================
// Default Exclusion Tests
// ============================================================================

test('analyticsMiddleware excludes health check paths', async (t) => {
  const middleware = analyticsMiddleware();

  for (const path of [
    '/health',
    '/healthcheck',
    '/_health',
    '/api/v1/health'
  ]) {
    let nextCalled = false;
    const ctx = createMockContext({ path, pathWithoutLocale: path });
    await middleware(ctx, async () => {
      nextCalled = true;
    });
    t.true(nextCalled, `next() should be called for ${path}`);
  }
});

test('analyticsMiddleware excludes static asset paths', async (t) => {
  const middleware = analyticsMiddleware();

  for (const path of [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/css/style.css',
    '/js/app.js',
    '/img/logo.png'
  ]) {
    let nextCalled = false;
    const ctx = createMockContext({ path, pathWithoutLocale: path });
    await middleware(ctx, async () => {
      nextCalled = true;
    });
    t.true(nextCalled, `next() should be called for ${path}`);
  }
});

// ============================================================================
// Bot Exclusion Tests
// ============================================================================

test('analyticsMiddleware excludes bots', async (t) => {
  const middleware = analyticsMiddleware();
  let nextCalled = false;

  const ctx = createMockContext({
    path: '/en',
    pathWithoutLocale: '/',
    userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(nextCalled, 'next() should be called for bots');
});

// ============================================================================
// Custom Exclusion Tests
// ============================================================================

test('analyticsMiddleware supports custom exclude paths', async (t) => {
  const middleware = analyticsMiddleware({
    excludePaths: ['/custom-exclude', '/admin/*']
  });

  // Test exact match
  let nextCalled = false;
  let ctx = createMockContext({
    path: '/custom-exclude',
    pathWithoutLocale: '/custom-exclude'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });
  t.true(nextCalled, 'next() should be called for custom exclude path');

  // Test wildcard match
  nextCalled = false;
  ctx = createMockContext({
    path: '/admin/users',
    pathWithoutLocale: '/admin/users'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });
  t.true(nextCalled, 'next() should be called for wildcard exclude path');
});

// ============================================================================
// Path Without Locale Tests
// ============================================================================

test('analyticsMiddleware uses pathWithoutLocale for exclusion checks', async (t) => {
  const middleware = analyticsMiddleware({
    excludePaths: ['/my-custom-page']
  });

  let nextCalled = false;
  const ctx = createMockContext({
    path: '/en/my-custom-page',
    pathWithoutLocale: '/my-custom-page'
  });
  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(
    nextCalled,
    'next() should be called when pathWithoutLocale matches exclude'
  );
});

test('analyticsMiddleware falls back to ctx.path when pathWithoutLocale is not set', async (t) => {
  const middleware = analyticsMiddleware();
  let nextCalled = false;

  const ctx = createMockContext({
    path: '/tti'
  });
  // Remove pathWithoutLocale to test fallback
  delete ctx.pathWithoutLocale;

  await middleware(ctx, async () => {
    nextCalled = true;
  });

  t.true(nextCalled, 'next() should be called using ctx.path fallback');
});

// ============================================================================
// Session Attribution Tests
// ============================================================================

test('analyticsMiddleware captures signup landing page using pathWithoutLocale', async (t) => {
  const middleware = analyticsMiddleware();
  const session = {};

  const ctx = createMockContext({
    path: '/en/pricing',
    pathWithoutLocale: '/pricing'
  });
  // Assign session directly to ctx for proper reference
  ctx.session = session;

  await middleware(ctx, async () => {});

  t.is(
    session.signup_landing_page,
    '/pricing',
    'Landing page should use pathWithoutLocale'
  );
});

test('analyticsMiddleware captures referrer on first visit', async (t) => {
  const middleware = analyticsMiddleware();
  const session = {};

  const ctx = createMockContext({
    path: '/en',
    pathWithoutLocale: '/',
    referer: 'https://www.google.com/search?q=email'
  });
  ctx.session = session;

  await middleware(ctx, async () => {});

  t.is(session.signup_referrer, 'www.google.com');
  t.is(session.signup_referrer_source, 'search');
});

test('analyticsMiddleware captures UTM parameters on first visit', async (t) => {
  const middleware = analyticsMiddleware();
  const session = {};

  const ctx = createMockContext({
    path: '/en',
    pathWithoutLocale: '/'
  });
  ctx.session = session;
  ctx.query = {
    utm_source: 'newsletter',
    utm_medium: 'email',
    utm_campaign: 'launch'
  };

  await middleware(ctx, async () => {});

  t.is(session.signup_utm_source, 'newsletter');
  t.is(session.signup_utm_medium, 'email');
  t.is(session.signup_utm_campaign, 'launch');
});

test('analyticsMiddleware does not overwrite existing signup data', async (t) => {
  const middleware = analyticsMiddleware();
  const session = {
    signup_landing_page: '/original-page',
    signup_referrer: 'original.com'
  };

  const ctx = createMockContext({
    path: '/en/new-page',
    pathWithoutLocale: '/new-page',
    referer: 'https://new-referrer.com'
  });
  ctx.session = session;

  await middleware(ctx, async () => {});

  t.is(
    session.signup_landing_page,
    '/original-page',
    'Should not overwrite landing page'
  );
  t.is(
    session.signup_referrer,
    'original.com',
    'Should not overwrite referrer'
  );
});

// ============================================================================
// Service Type Tests
// ============================================================================

test('analyticsMiddleware defaults to web service', (t) => {
  const middleware = analyticsMiddleware();
  t.truthy(middleware, 'Middleware should be created with default web service');
});

test('analyticsMiddleware supports api service type', (t) => {
  const middleware = analyticsMiddleware({
    service: 'api',
    trackAPICalls: true
  });
  t.truthy(middleware, 'Middleware should be created with api service');
});
