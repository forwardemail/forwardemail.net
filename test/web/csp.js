/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const cheerio = require('cheerio');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function fetchPage(t, path = '/en') {
  const { web } = t.context;
  const res = await web.get(path).set({ Accept: 'text/html' });
  return res;
}

test('CSP header is present on HTML responses', async (t) => {
  const res = await fetchPage(t);
  const csp = res.headers['content-security-policy'];
  t.truthy(csp, 'Content-Security-Policy header must be present');
});

test('CSP header contains a nonce in script-src', async (t) => {
  const res = await fetchPage(t);
  const csp = res.headers['content-security-policy'];
  t.regex(
    csp,
    /script-src[^;]*'nonce-[a-f\d]+'/,
    'script-src must contain a nonce'
  );
});

test('CSP style-src does NOT contain a nonce (unsafe-inline only)', async (t) => {
  const res = await fetchPage(t);
  const csp = res.headers['content-security-policy'];
  const styleSrc = csp.match(/style-src([^;]*)/);
  t.truthy(styleSrc, 'style-src directive must exist');
  t.notRegex(
    styleSrc[1],
    /nonce-/,
    'style-src must NOT contain a nonce (it would disable unsafe-inline)'
  );
  t.true(
    styleSrc[1].includes("'unsafe-inline'"),
    "style-src must keep 'unsafe-inline' for third-party styles"
  );
});

test('CSP script-src nonce matches nonce attributes in HTML', async (t) => {
  const res = await fetchPage(t);
  const csp = res.headers['content-security-policy'];
  const nonceMatch = csp.match(/'nonce-([a-f\d]+)'/);
  t.truthy(nonceMatch, 'CSP must contain a nonce token');
  const nonce = nonceMatch[1];
  const $ = cheerio.load(res.text);
  const scripts = $('script[nonce]');
  t.true(scripts.length > 0, 'page must have at least one nonced script');
  scripts.each((_, el) => {
    t.is($(el).attr('nonce'), nonce, 'script nonce must match CSP nonce');
  });
});

test('CSP header has no double-spaces (no empty/undefined tokens)', async (t) => {
  const res = await fetchPage(t);
  const csp = res.headers['content-security-policy'];
  t.false(csp.includes('  '), 'CSP must not contain double spaces');
});

test("CSP script-src contains 'strict-dynamic'", async (t) => {
  const res = await fetchPage(t);
  const csp = res.headers['content-security-policy'];
  const scriptSrc = csp.match(/script-src([^;]*)/);
  t.truthy(scriptSrc, 'script-src directive must exist');
  t.true(
    scriptSrc[1].includes("'strict-dynamic'"),
    "script-src must include 'strict-dynamic'"
  );
});

test("CSP script-src does NOT contain 'unsafe-inline'", async (t) => {
  const res = await fetchPage(t);
  const csp = res.headers['content-security-policy'];
  const scriptSrc = csp.match(/script-src([^;]*)/);
  t.truthy(scriptSrc);
  t.false(
    scriptSrc[1].includes("'unsafe-inline'"),
    "script-src must NOT include 'unsafe-inline' when 'strict-dynamic' is present"
  );
});

test('X-CSP-Nonce header is NOT exposed to the client', async (t) => {
  const res = await fetchPage(t);
  t.falsy(
    res.headers['x-csp-nonce'],
    'X-CSP-Nonce must not leak to the client'
  );
});

test('every inline <script> in the HTML carries a nonce attribute', async (t) => {
  const res = await fetchPage(t);
  const $ = cheerio.load(res.text);
  const inlineScripts = $('script:not([src])');
  t.true(inlineScripts.length > 0, 'page must have at least one inline script');
  inlineScripts.each((_, el) => {
    const nonce = $(el).attr('nonce');
    t.truthy(
      nonce,
      `inline script must have a nonce attribute: ${$(el).html()?.slice(0, 40)}`
    );
  });
});

test('CSP nonce works on non-root pages (e.g. /en/about)', async (t) => {
  const res = await fetchPage(t, '/en/about');
  const csp = res.headers['content-security-policy'];
  t.regex(
    csp,
    /script-src[^;]*'nonce-[a-f\d]+'/,
    'non-root page must also have nonce in CSP'
  );
});
