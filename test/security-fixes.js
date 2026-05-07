/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const config = require('#config');
const {
  getMinRSABits,
  isGracePeriod,
  MIN_RSA_BITS_ENFORCEMENT_DATE
} = require('#helpers/encrypt-message');

//
// REGEX_LOCALHOST coverage (extended ranges)
//
test('REGEX_LOCALHOST matches RFC 1918 private ranges', (t) => {
  t.true(REGEX_LOCALHOST.test('10.0.0.1'));
  t.true(REGEX_LOCALHOST.test('10.255.255.255'));
  t.true(REGEX_LOCALHOST.test('172.16.0.1'));
  t.true(REGEX_LOCALHOST.test('172.31.255.255'));
  t.true(REGEX_LOCALHOST.test('192.168.0.1'));
  t.true(REGEX_LOCALHOST.test('192.168.255.255'));
});

test('REGEX_LOCALHOST matches loopback', (t) => {
  t.true(REGEX_LOCALHOST.test('127.0.0.1'));
  t.true(REGEX_LOCALHOST.test('127.255.255.255'));
});

test('REGEX_LOCALHOST matches link-local', (t) => {
  t.true(REGEX_LOCALHOST.test('169.254.1.1'));
  t.true(REGEX_LOCALHOST.test('169.254.169.254'));
});

test('REGEX_LOCALHOST matches CGNAT (100.64/10)', (t) => {
  t.true(REGEX_LOCALHOST.test('100.64.0.1'));
  t.true(REGEX_LOCALHOST.test('100.127.255.255'));
  // Just outside CGNAT range
  t.false(REGEX_LOCALHOST.test('100.128.0.1'));
});

test('REGEX_LOCALHOST matches benchmarking (198.18/15)', (t) => {
  t.true(REGEX_LOCALHOST.test('198.18.0.1'));
  t.true(REGEX_LOCALHOST.test('198.19.255.255'));
  // Just outside benchmarking range
  t.false(REGEX_LOCALHOST.test('198.20.0.1'));
});

test('REGEX_LOCALHOST matches IPv6 loopback', (t) => {
  t.true(REGEX_LOCALHOST.test('::1'));
});

test('REGEX_LOCALHOST matches 0.0.0.0/8', (t) => {
  t.true(REGEX_LOCALHOST.test('0.0.0.0'));
  t.true(REGEX_LOCALHOST.test('0.1.2.3'));
});

test('REGEX_LOCALHOST matches IPv6 private ranges', (t) => {
  t.true(REGEX_LOCALHOST.test('fc00::1'));
  t.true(REGEX_LOCALHOST.test('fe80::1'));
  t.true(REGEX_LOCALHOST.test('::ffff:127.0.0.1'));
  t.true(REGEX_LOCALHOST.test('::ffff:10.0.0.1'));
});

test('REGEX_LOCALHOST does not match public IPs', (t) => {
  t.false(REGEX_LOCALHOST.test('8.8.8.8'));
  t.false(REGEX_LOCALHOST.test('1.1.1.1'));
  t.false(REGEX_LOCALHOST.test('172.32.0.1'));
  t.false(REGEX_LOCALHOST.test('192.169.0.1'));
});

//
// config.testDomains includes cloud metadata hostnames
//
test('config.testDomains includes metadata hostnames', (t) => {
  t.true(config.testDomains.includes('metadata'));
  t.true(config.testDomains.includes('instance-data'));
});

test('config.testDomains includes standard reserved TLDs', (t) => {
  t.true(config.testDomains.includes('localhost'));
  t.true(config.testDomains.includes('local'));
  t.true(config.testDomains.includes('internal'));
  t.true(config.testDomains.includes('test'));
  t.true(config.testDomains.includes('example'));
  t.true(config.testDomains.includes('invalid'));
});

//
// RSA key grace period
//
test('MIN_RSA_BITS_ENFORCEMENT_DATE is July 30, 2026', (t) => {
  t.is(MIN_RSA_BITS_ENFORCEMENT_DATE.format('YYYY-MM-DD'), '2026-07-30');
});

test('getMinRSABits returns 1024 during grace period', (t) => {
  // We are currently before July 30, 2026
  t.is(getMinRSABits(), 1024);
});

test('isGracePeriod returns true before enforcement date', (t) => {
  // We are currently before July 30, 2026
  t.true(isGracePeriod());
});

//
// ReDoS protection - escapeRegExp
//
test('lodash escapeRegExp neutralizes regex metacharacters', (t) => {
  const _ = require('#helpers/lodash');
  const malicious = '.*+?^${}()|[]\\';
  const escaped = _.escapeRegExp(malicious);
  // Should not throw when used in RegExp
  t.notThrows(() => new RegExp(escaped));
  // Should match the literal string
  const re = new RegExp(escaped);
  t.regex(malicious, re);
  // Should NOT match unintended patterns
  t.notRegex('anything', re);
});

//
// SSRF isPrivateHost logic (shared between test-s3-connection and domains model)
//
test('isPrivateHost blocks private IPs via REGEX_LOCALHOST', (t) => {
  // Replicate the isPrivateHost logic from test-s3-connection.js
  function isPrivateHost(hostname) {
    const host = hostname.toLowerCase().replace(/^\[|]$/g, '');
    if (REGEX_LOCALHOST.test(host)) return true;
    const parts = host.split('.');
    const tld = parts[parts.length - 1];
    if (config.testDomains.includes(tld)) return true;
    if (host === 'metadata.google.internal') return true;
    return false;
  }

  // Should block
  t.true(isPrivateHost('127.0.0.1'));
  t.true(isPrivateHost('10.0.0.1'));
  t.true(isPrivateHost('192.168.1.1'));
  t.true(isPrivateHost('169.254.169.254'));
  t.true(isPrivateHost('100.64.0.1'));
  t.true(isPrivateHost('198.18.0.1'));
  t.true(isPrivateHost('::1'));
  t.true(isPrivateHost('localhost'));
  t.true(isPrivateHost('my.local'));
  t.true(isPrivateHost('evil.internal'));
  t.true(isPrivateHost('metadata'));
  t.true(isPrivateHost('instance-data'));
  t.true(isPrivateHost('metadata.google.internal'));

  // Should allow
  t.false(isPrivateHost('s3.amazonaws.com'));
  t.false(isPrivateHost('storage.googleapis.com'));
  t.false(isPrivateHost('8.8.8.8'));
  t.false(isPrivateHost('my-s3.company.io'));
  t.false(isPrivateHost('100.128.0.1'));
});

//
// i18n phrase keys exist
//
test('PGP_WEAK_KEY phrase keys are defined', (t) => {
  const phrases = require('#config/phrases');
  t.is(typeof phrases.PGP_WEAK_KEY_WARNING, 'string');
  t.true(phrases.PGP_WEAK_KEY_WARNING.length > 0);
  t.is(typeof phrases.PGP_WEAK_KEY_MESSAGE, 'string');
  t.true(phrases.PGP_WEAK_KEY_MESSAGE.includes('%s'));
});

//
// Shared isPrivateHost helper (FWD-01-006)
//
test('isPrivateHost blocks private/internal hostnames', (t) => {
  const isPrivateHost = require('#helpers/is-private-host');
  // Should block
  t.true(isPrivateHost('127.0.0.1'));
  t.true(isPrivateHost('10.0.0.1'));
  t.true(isPrivateHost('192.168.1.1'));
  t.true(isPrivateHost('169.254.169.254'));
  t.true(isPrivateHost('100.64.0.1'));
  t.true(isPrivateHost('198.18.0.1'));
  t.true(isPrivateHost('::1'));
  t.true(isPrivateHost('[::1]'));
  t.true(isPrivateHost('localhost'));
  t.true(isPrivateHost('my.local'));
  t.true(isPrivateHost('evil.internal'));
  t.true(isPrivateHost('metadata'));
  t.true(isPrivateHost('instance-data'));
  t.true(isPrivateHost(null));
  t.true(isPrivateHost(''));
  // Should allow
  t.false(isPrivateHost('s3.amazonaws.com'));
  t.false(isPrivateHost('storage.googleapis.com'));
  t.false(isPrivateHost('8.8.8.8'));
  t.false(isPrivateHost('cloudflare.com'));
});

//
// json() XSS escaping (FWD-01-007)
//
test('json utility escapes script-breaking sequences', (t) => {
  const { json } = require('#config/utilities');
  const malicious = '</script><script>alert(1)</script>';
  const output = json({ msg: malicious }, null, null);
  // Must not contain literal </script>
  t.false(output.includes('</script>'));
  t.false(output.includes('</'));
  // Must still be valid JSON when parsed
  const parsed = JSON.parse(output);
  t.is(parsed.msg, malicious);
});

test('json utility preserves normal content', (t) => {
  const { json } = require('#config/utilities');
  const normal = { greeting: 'Hello, world!', count: 42 };
  const output = json(normal, null, null);
  const parsed = JSON.parse(output);
  t.is(parsed.greeting, 'Hello, world!');
  t.is(parsed.count, 42);
});

//
// CSP configuration (FWD-01-008)
//
test('CSP script-src does not include unsafe-inline', (t) => {
  // We can't easily test the full helmet config without starting the app,
  // but we can verify the config file doesn't have unsafe-inline in script-src
  const fs = require('node:fs');
  const path = require('node:path');
  const webConfig = fs.readFileSync(
    path.join(__dirname, '..', 'config', 'web.js'),
    'utf8'
  );
  // Find the script-src section
  const scriptSrcMatch = webConfig.match(/'script-src':\s*\[([\s\S]*?)]/);
  t.truthy(scriptSrcMatch);
  // Should not contain 'unsafe-inline'
  t.false(scriptSrcMatch[1].includes("'unsafe-inline'"));
  // Should contain 'strict-dynamic'
  t.true(scriptSrcMatch[1].includes("'strict-dynamic'"));
});
