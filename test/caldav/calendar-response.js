/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

// We'll test the functions that don't depend on encryption
// since the encryption key isn't available in test environment

test('responseToPartstat converts accept to ACCEPTED', (t) => {
  // Import after mocks are set up
  const { responseToPartstat } = require('#helpers/calendar-response');
  t.is(responseToPartstat('accept'), 'ACCEPTED');
});

test('responseToPartstat converts decline to DECLINED', (t) => {
  const { responseToPartstat } = require('#helpers/calendar-response');
  t.is(responseToPartstat('decline'), 'DECLINED');
});

test('responseToPartstat converts tentative to TENTATIVE', (t) => {
  const { responseToPartstat } = require('#helpers/calendar-response');
  t.is(responseToPartstat('tentative'), 'TENTATIVE');
});

test('responseToPartstat is case insensitive', (t) => {
  const { responseToPartstat } = require('#helpers/calendar-response');
  t.is(responseToPartstat('ACCEPT'), 'ACCEPTED');
  t.is(responseToPartstat('Accept'), 'ACCEPTED');
  t.is(responseToPartstat('DECLINE'), 'DECLINED');
  t.is(responseToPartstat('Tentative'), 'TENTATIVE');
});

test('responseToPartstat throws for invalid response', (t) => {
  const { responseToPartstat } = require('#helpers/calendar-response');
  t.throws(() => responseToPartstat('invalid'), {
    instanceOf: TypeError,
    message: /Invalid response type/
  });
});

test('responseToPartstat throws for null/undefined', (t) => {
  const { responseToPartstat } = require('#helpers/calendar-response');
  t.throws(() => responseToPartstat(null));
  t.throws(() => responseToPartstat(undefined));
});

test('hashToken returns consistent hash for same token', (t) => {
  const { hashToken } = require('#helpers/calendar-response');
  const token = 'test-token-123';
  const hash1 = hashToken(token);
  const hash2 = hashToken(token);
  t.is(hash1, hash2);
  t.is(hash1.length, 64); // SHA-256 produces 64 hex characters
});

test('hashToken returns different hash for different tokens', (t) => {
  const { hashToken } = require('#helpers/calendar-response');
  const hash1 = hashToken('token-1');
  const hash2 = hashToken('token-2');
  t.not(hash1, hash2);
});

test('TOKEN_EXPIRATION_MS is 30 days', (t) => {
  const { TOKEN_EXPIRATION_MS } = require('#helpers/calendar-response');
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  t.is(TOKEN_EXPIRATION_MS, thirtyDays);
});

test('TOKEN_VERSION is 1', (t) => {
  const { TOKEN_VERSION } = require('#helpers/calendar-response');
  t.is(TOKEN_VERSION, 1);
});
