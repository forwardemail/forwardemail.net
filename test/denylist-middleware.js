/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const utils = require('./utils');

const config = require('#config');

const denylistMiddleware = require('#helpers/denylist-request');

const {
  extractRefererHostname,
  checkReferer,
  checkIP,
  checkUserEmail,
  checkClientHostname,
  createDenylistError,
  isInDenylist
} = denylistMiddleware;

// Test domain that should be in the denylist
const DENYLISTED_DOMAIN = 'daxiaym.com';
const DENYLISTED_REFERER = `https://fe-bounces.${DENYLISTED_DOMAIN}/en`;

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

//
// extractRefererHostname helper tests
//
test('extractRefererHostname extracts hostname from valid URL', (t) => {
  const hostname = extractRefererHostname('https://example.com/path?query=1');
  t.is(hostname, 'example.com');
});

test('extractRefererHostname extracts hostname from URL with subdomain', (t) => {
  const hostname = extractRefererHostname(
    'https://fe-bounces.daxiaym.com/en/page'
  );
  t.is(hostname, 'fe-bounces.daxiaym.com');
});

test('extractRefererHostname returns null for invalid URL', (t) => {
  const hostname = extractRefererHostname('not-a-valid-url');
  t.is(hostname, null);
});

test('extractRefererHostname returns null for empty string', (t) => {
  const hostname = extractRefererHostname('');
  t.is(hostname, null);
});

test('extractRefererHostname returns null for null input', (t) => {
  const hostname = extractRefererHostname(null);
  t.is(hostname, null);
});

test('extractRefererHostname lowercases hostname', (t) => {
  const hostname = extractRefererHostname('https://EXAMPLE.COM/path');
  t.is(hostname, 'example.com');
});

//
// isInDenylist helper tests
//
test('isInDenylist returns true for denylisted domain', (t) => {
  // Add test domain to denylist
  config.denylist.add(DENYLISTED_DOMAIN);
  try {
    t.true(isInDenylist(DENYLISTED_DOMAIN));
  } finally {
    config.denylist.delete(DENYLISTED_DOMAIN);
  }
});

test('isInDenylist returns false for non-denylisted domain', (t) => {
  t.false(isInDenylist('example.com'));
});

//
// createDenylistError helper tests
//
test('createDenylistError creates Boom forbidden error with correct message format', (t) => {
  const error = createDenylistError('referer', 'example.com');
  t.true(error.isBoom);
  t.is(error.output.statusCode, 403);
  t.is(error.denylistValue, 'example.com');
  t.true(error.message.includes('example.com'));
  t.true(error.message.includes('denylisted'));
  t.true(error.message.includes('/denylist?q='));
  t.true(error.message.includes(config.supportEmail));
});

//
// checkReferer helper tests
//
test('checkReferer throws for denylisted referer hostname', (t) => {
  config.denylist.add(DENYLISTED_DOMAIN);
  try {
    const ctx = {
      get(header) {
        if (header === 'referer') return DENYLISTED_REFERER;
        return null;
      }
    };
    const error = t.throws(() => checkReferer(ctx));
    t.true(error.isBoom);
    t.is(error.output.statusCode, 403);
    t.true(error.message.includes(DENYLISTED_DOMAIN));
  } finally {
    config.denylist.delete(DENYLISTED_DOMAIN);
  }
});

test('checkReferer does not throw for non-denylisted referer', (t) => {
  const ctx = {
    get(header) {
      if (header === 'referer') return 'https://google.com/search';
      return null;
    }
  };
  t.notThrows(() => checkReferer(ctx));
});

test('checkReferer does not throw for missing referer', (t) => {
  const ctx = {
    get: () => null
  };
  t.notThrows(() => checkReferer(ctx));
});

//
// checkIP helper tests
//
test('checkIP throws for denylisted IP', (t) => {
  const testIP = '192.0.2.1';
  config.denylist.add(testIP);
  try {
    const ctx = {
      request: { ip: testIP }
    };
    const error = t.throws(() => checkIP(ctx));
    t.true(error.isBoom);
    t.is(error.output.statusCode, 403);
    t.true(error.message.includes(testIP));
  } finally {
    config.denylist.delete(testIP);
  }
});

test('checkIP does not throw for non-denylisted IP', (t) => {
  const ctx = {
    request: { ip: '127.0.0.1' }
  };
  t.notThrows(() => checkIP(ctx));
});

//
// checkUserEmail helper tests
//
test('checkUserEmail throws for denylisted user email', (t) => {
  const testEmail = 'test@denylisted.com';
  config.denylist.add(testEmail);
  try {
    const ctx = {
      state: { user: { email: testEmail } }
    };
    const error = t.throws(() => checkUserEmail(ctx));
    t.true(error.isBoom);
    t.is(error.output.statusCode, 403);
    t.true(error.message.includes(testEmail));
  } finally {
    config.denylist.delete(testEmail);
  }
});

test('checkUserEmail throws for denylisted email domain', (t) => {
  const testDomain = 'denylisted-domain.com';
  config.denylist.add(testDomain);
  try {
    const ctx = {
      state: { user: { email: `user@${testDomain}` } }
    };
    const error = t.throws(() => checkUserEmail(ctx));
    t.true(error.isBoom);
    t.is(error.output.statusCode, 403);
    t.true(error.message.includes(testDomain));
  } finally {
    config.denylist.delete(testDomain);
  }
});

test('checkUserEmail does not throw for non-denylisted user', (t) => {
  const ctx = {
    state: { user: { email: 'user@example.com' } }
  };
  t.notThrows(() => checkUserEmail(ctx));
});

test('checkUserEmail does not throw when no user', (t) => {
  const ctx = { state: {} };
  t.notThrows(() => checkUserEmail(ctx));
});

//
// checkClientHostname helper tests
//
test('checkClientHostname throws for denylisted hostname', (t) => {
  const testHostname = 'denylisted.example.com';
  config.denylist.add(testHostname);
  try {
    const error = t.throws(() => checkClientHostname(testHostname));
    t.true(error.isBoom);
    t.is(error.output.statusCode, 403);
    t.true(error.message.includes(testHostname));
  } finally {
    config.denylist.delete(testHostname);
  }
});

test('checkClientHostname throws for denylisted root hostname', (t) => {
  config.denylist.add(DENYLISTED_DOMAIN);
  try {
    const error = t.throws(() =>
      checkClientHostname(`subdomain.${DENYLISTED_DOMAIN}`)
    );
    t.true(error.isBoom);
    t.is(error.output.statusCode, 403);
    t.true(error.message.includes(DENYLISTED_DOMAIN));
  } finally {
    config.denylist.delete(DENYLISTED_DOMAIN);
  }
});

test('checkClientHostname returns root hostname for valid FQDN', (t) => {
  const rootHostname = checkClientHostname('subdomain.example.com');
  t.is(rootHostname, 'example.com');
});

test('checkClientHostname returns null for invalid FQDN', (t) => {
  const result = checkClientHostname('not-a-fqdn');
  t.is(result, null);
});

//
// Web server denylist integration tests
//
test('web server blocks request with denylisted referer', async (t) => {
  const { web } = t.context;

  // Add test domain to denylist for this test
  config.denylist.add(DENYLISTED_DOMAIN);

  try {
    const res = await web.get('/en').set('Referer', DENYLISTED_REFERER);

    // Should return 403 Forbidden
    t.is(res.status, 403);
    t.true(res.text.includes('denylisted'));
    t.true(res.text.includes(DENYLISTED_DOMAIN));
    t.true(res.text.includes(config.supportEmail));
  } finally {
    config.denylist.delete(DENYLISTED_DOMAIN);
  }
});

test('web server allows request without denylisted referer', async (t) => {
  const { web } = t.context;

  const res = await web.get('/en').set('Referer', 'https://google.com/search');

  // Should not be blocked (200 OK expected for /en)
  t.not(res.status, 403);
});

test('denylist error message includes removal instructions and support email', async (t) => {
  const { web } = t.context;

  // Add test domain to denylist for this test
  config.denylist.add(DENYLISTED_DOMAIN);

  try {
    const res = await web.get('/en').set('Referer', DENYLISTED_REFERER);

    t.is(res.status, 403);
    // Check error message contains key information
    t.true(res.text.includes('denylisted'));
    t.true(res.text.includes(DENYLISTED_DOMAIN));
    t.true(res.text.includes('/denylist?q='));
    t.true(res.text.includes(config.supportEmail));
    t.true(res.text.includes('request removal'));
  } finally {
    config.denylist.delete(DENYLISTED_DOMAIN);
  }
});

test('blocks subdomain referer when root domain is denylisted', async (t) => {
  const { web } = t.context;

  // Add test domain to denylist for this test
  config.denylist.add(DENYLISTED_DOMAIN);

  try {
    // Test with subdomain
    const res = await web
      .get('/en')
      .set('Referer', `https://subdomain.another.${DENYLISTED_DOMAIN}/page`);

    t.is(res.status, 403);
    t.true(res.text.includes('denylisted'));
    t.true(res.text.includes(DENYLISTED_DOMAIN));
  } finally {
    config.denylist.delete(DENYLISTED_DOMAIN);
  }
});
