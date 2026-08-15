/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const utils = require('../utils');
const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function fetchPage(t, path = '/en') {
  const { web } = t.context;
  const res = await web.get(path).set({ Accept: 'text/html' });
  return res;
}

function assertAllScriptsCarryResponseNonce(t, res, path) {
  const csp = res.headers['content-security-policy'];
  const nonceMatch = csp.match(/script-src[^;]*'nonce-([a-f\d]+)'/);
  const scripts = [...res.text.matchAll(/<script\b[^>]*>/g)];

  t.truthy(nonceMatch, `${path} must include a script-src nonce`);
  t.true(scripts.length > 0, `${path} must render at least one script`);

  for (const script of scripts)
    t.regex(
      script[0],
      new RegExp(`\\bnonce="${nonceMatch[1]}"`),
      `${path} script must carry its response CSP nonce: ${script[0].slice(
        0,
        120
      )}`
    );
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

test('every root-page script tag carries the response CSP nonce', async (t) => {
  const res = await fetchPage(t);
  assertAllScriptsCarryResponseNonce(t, res, '/en');
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
  const inlineScripts = [
    ...res.text.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>/g)
  ];

  t.true(inlineScripts.length > 0, 'page must have at least one inline script');
  for (const script of inlineScripts)
    t.regex(
      script[0],
      /\bnonce="[a-f\d]+"/,
      `inline script must carry a nonce attribute: ${script[0].slice(0, 80)}`
    );
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

test('password recovery pages carry the nonce on every script', async (t) => {
  const resetToken = 'a'.repeat(32);

  for (const path of [
    '/en/forgot-password',
    `/en/reset-password/${resetToken}`
  ]) {
    const res = await fetchPage(t, path);
    t.is(res.status, 200, `${path} must render successfully`);
    assertAllScriptsCarryResponseNonce(t, res, path);
  }
});

test('shared client bundle and Turnstile loader carry the CSP nonce', async (t) => {
  const res = await fetchPage(t, '/en/forgot-password');
  const csp = res.headers['content-security-policy'];
  const nonceMatch = csp.match(/script-src[^;]*'nonce-([a-f\d]+)'/);

  assertAllScriptsCarryResponseNonce(t, res, '/en/forgot-password');
  t.regex(
    res.text,
    new RegExp(
      `<script[^>]*nonce="${nonceMatch[1]}"[^>]*src="[^"]*/js/build\\.js[^"]*"`
    ),
    'the shared client bundle must carry the CSP nonce'
  );

  if (config.turnstileEnabled) {
    t.regex(
      res.text,
      new RegExp(
        `<script[^>]*nonce="${nonceMatch[1]}"[^>]*src="https://challenges\\.cloudflare\\.com/turnstile/`
      ),
      'the Turnstile script must carry the CSP nonce'
    );
    t.true(
      csp.includes('https://challenges.cloudflare.com'),
      'CSP must allow the Turnstile host'
    );
  }
});
