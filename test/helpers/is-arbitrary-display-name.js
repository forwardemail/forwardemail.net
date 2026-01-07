/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const env = require('#config/env');
const isArbitrary = require('#helpers/is-arbitrary');

// Mock headers object that mimics mailsplit headers
function createMockHeaders(fromValue, subjectValue = 'Test Subject') {
  const headersMap = new Map();
  headersMap.set('from', fromValue);
  headersMap.set('subject', subjectValue);

  return {
    headers: Buffer.from(`From: ${fromValue}\r\nSubject: ${subjectValue}\r\n`),
    _normalizeHeader(key) {
      return key.toLowerCase();
    },
    hasHeader(key) {
      return headersMap.has(key.toLowerCase());
    },
    getFirst(key) {
      return headersMap.get(key.toLowerCase()) || '';
    },
    libmime: {
      decodeWords(str) {
        return str;
      }
    }
  };
}

// Mock session object for non-authenticated sender
function createMockSession(fromAddress = 'lynnied@mhtc.net') {
  const domain = fromAddress.split('@')[1] || 'mhtc.net';
  return {
    originalFromAddress: fromAddress,
    originalFromAddressRootDomain: domain,
    resolvedRootClientHostname: null,
    resolvedClientHostname: null,
    hadAlignedAndPassingDKIM: false,
    hasSameHostnameAsFrom: false,
    isAllowlisted: false,
    spfFromHeader: {
      status: {
        result: 'fail'
      }
    },
    spf: {
      domain
    },
    envelope: {
      rcptTo: [{ address: 'support@forwardemail.net' }]
    }
  };
}

// Mock session for authenticated Forward Email sender
// Uses env.WEB_HOST to match the actual domain check in is-arbitrary.js
function createAuthenticatedSession() {
  return {
    originalFromAddress: `support@${env.WEB_HOST}`,
    originalFromAddressRootDomain: env.WEB_HOST,
    resolvedRootClientHostname: env.WEB_HOST,
    resolvedClientHostname: `mx1.${env.WEB_HOST}`,
    hadAlignedAndPassingDKIM: true,
    hasSameHostnameAsFrom: true,
    isAllowlisted: true,
    spfFromHeader: {
      status: {
        result: 'pass'
      }
    },
    spf: {
      domain: env.WEB_HOST
    },
    envelope: {
      rcptTo: [{ address: 'user@example.com' }]
    }
  };
}

//
// Test cases for display name impersonation
//

test('blocks display name impersonation: forwardemail.net<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('forwardemail.net<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: forwardemail<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('forwardemail<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: forward email<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('forward email<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: Forward Email<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('Forward Email<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: FORWARD EMAIL<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('FORWARD EMAIL<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: FORWARDEMAIL<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('FORWARDEMAIL<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: ForwardEmail Support<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('ForwardEmail Support<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: "forwardemail.net" <lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('"forwardemail.net" <lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name impersonation: "Forward Email Team" <lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('"Forward Email Team" <lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

//
// Test cases for IDN homograph attacks in display name
//

test('blocks IDN homograph attack: fоrwardemail (Cyrillic о)<lynnied@mhtc.net>', (t) => {
  // Using Cyrillic 'о' (U+043E) instead of Latin 'o'
  const headers = createMockHeaders('fоrwardemail<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks IDN homograph attack: fоrwаrdеmаil (multiple Cyrillic chars)<lynnied@mhtc.net>', (t) => {
  // Using multiple Cyrillic characters
  const headers = createMockHeaders('fоrwаrdеmаil<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks IDN homograph attack: Fоrward Еmail (Cyrillic with spaces)<lynnied@mhtc.net>', (t) => {
  // Cyrillic 'о' and 'Е' with space
  const headers = createMockHeaders('Fоrward Еmail<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks IDN homograph attack: ƒorwardemail (Latin small f with hook)<lynnied@mhtc.net>', (t) => {
  // Using Latin small f with hook (U+0192)
  const headers = createMockHeaders('ƒorwardemail<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

//
// Test cases that should NOT be blocked (legitimate emails)
//

test('allows legitimate email without display name: lynnied@mhtc.net', (t) => {
  const headers = createMockHeaders('lynnied@mhtc.net');
  const session = createMockSession();

  // Should not throw
  t.notThrows(() => isArbitrary(session, headers));
});

test('allows legitimate email without display name: <lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('<lynnied@mhtc.net>');
  const session = createMockSession();

  // Should not throw
  t.notThrows(() => isArbitrary(session, headers));
});

test('allows legitimate email with unrelated display name: John Doe<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('John Doe<lynnied@mhtc.net>');
  const session = createMockSession();

  // Should not throw
  t.notThrows(() => isArbitrary(session, headers));
});

test('allows legitimate email with company name: ACME Corp<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('ACME Corp<lynnied@mhtc.net>');
  const session = createMockSession();

  // Should not throw
  t.notThrows(() => isArbitrary(session, headers));
});

test('allows authenticated Forward Email sender with display name', (t) => {
  // Use env.WEB_HOST to match the authenticated session domain
  const headers = createMockHeaders(`Forward Email<support@${env.WEB_HOST}>`);
  const session = createAuthenticatedSession();

  // Should not throw because sender is authenticated as Forward Email
  t.notThrows(() => isArbitrary(session, headers));
});

//
// Edge cases
//

test('blocks display name with extra whitespace: "  Forward   Email  " <lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('"  Forward   Email  " <lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name with mixed case: fOrWaRdEmAiL<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('fOrWaRdEmAiL<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name containing brand: MyForwardEmailService<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders('MyForwardEmailService<lynnied@mhtc.net>');
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});

test('blocks display name containing domain: support@forwardemail.net<lynnied@mhtc.net>', (t) => {
  const headers = createMockHeaders(
    'support@forwardemail.net<lynnied@mhtc.net>'
  );
  const session = createMockSession();

  const error = t.throws(() => isArbitrary(session, headers));
  t.true(error.message.includes('Blocked display name spoofing'));
});
