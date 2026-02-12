/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const parseEnhancedStatusCode = require('#helpers/parse-enhanced-status-code');

//
// === String input tests ===
//

test('parses enhanced status code from standard success response', (t) => {
  t.is(parseEnhancedStatusCode('250 2.0.0 Ok: queued as 12345'), '2.0.0');
});

test('parses enhanced status code from permanent failure response', (t) => {
  t.is(parseEnhancedStatusCode('550 5.1.1 User unknown'), '5.1.1');
});

test('parses enhanced status code from temporary failure response', (t) => {
  t.is(parseEnhancedStatusCode('421 4.7.0 Try again later'), '4.7.0');
});

test('parses enhanced status code with hyphen continuation', (t) => {
  t.is(parseEnhancedStatusCode('250-2.0.0 Ok'), '2.0.0');
});

test('parses enhanced status code with multi-digit subject and detail', (t) => {
  t.is(parseEnhancedStatusCode('550 5.11.123 Detailed error'), '5.11.123');
});

test('returns fallback for response without enhanced status code', (t) => {
  t.is(parseEnhancedStatusCode('250 Ok', 250), '2.0.0');
});

test('returns fallback for 4xx code without enhanced status', (t) => {
  t.is(parseEnhancedStatusCode('421 Service not available', 421), '4.0.0');
});

test('returns fallback for 5xx code without enhanced status', (t) => {
  t.is(parseEnhancedStatusCode('550 Mailbox not found', 550), '5.0.0');
});

test('returns 5.0.0 as ultimate fallback with no input', (t) => {
  t.is(parseEnhancedStatusCode(''), '5.0.0');
});

test('returns 5.0.0 as ultimate fallback for null input', (t) => {
  t.is(parseEnhancedStatusCode(null), '5.0.0');
});

test('returns 5.0.0 as ultimate fallback for undefined input', (t) => {
  t.is(parseEnhancedStatusCode(undefined), '5.0.0');
});

//
// === Error object input tests ===
//

test('parses enhanced status code from error.response', (t) => {
  const error = {
    response: '550 5.1.1 The email account does not exist',
    message: 'Some generic error message',
    responseCode: 550
  };
  t.is(parseEnhancedStatusCode(error), '5.1.1');
});

test('falls back to error.message when error.response has no enhanced code', (t) => {
  const error = {
    response: '550 Mailbox not found',
    message: 'Error 5.2.2 Mailbox full',
    responseCode: 550
  };
  // error.response has no enhanced code, so it falls back to error.message
  t.is(parseEnhancedStatusCode(error), '5.2.2');
});

test('falls back to error.responseCode when no enhanced code in response or message', (t) => {
  const error = {
    response: '421 Service not available',
    message: 'Connection timed out',
    responseCode: 421
  };
  t.is(parseEnhancedStatusCode(error), '4.0.0');
});

test('uses explicit fallbackCode over error.responseCode', (t) => {
  const error = {
    message: 'Connection refused',
    responseCode: 550
  };
  t.is(parseEnhancedStatusCode(error, 421), '4.0.0');
});

test('handles error object with only message property', (t) => {
  const error = { message: 'ECONNREFUSED' };
  t.is(parseEnhancedStatusCode(error, 421), '4.0.0');
});

test('handles error object with no relevant properties', (t) => {
  const error = { code: 'ECONNRESET' };
  t.is(parseEnhancedStatusCode(error), '5.0.0');
});

//
// === Real-world SMTP response tests ===
//

test('parses Google SMTP success response', (t) => {
  t.is(
    parseEnhancedStatusCode('250 2.0.0 OK 1234567890 abc123.456 - gsmtp'),
    '2.0.0'
  );
});

test('parses Microsoft 550 response', (t) => {
  t.is(
    parseEnhancedStatusCode(
      '550 5.1.10 RESOLVER.ADR.RecipientNotFound; Recipient not found'
    ),
    '5.1.10'
  );
});

test('parses Postfix queued response', (t) => {
  t.is(
    parseEnhancedStatusCode('250 2.0.0 Ok: queued as 4f58Js4ZWVzKs'),
    '2.0.0'
  );
});

test('parses greylisting temporary rejection', (t) => {
  t.is(
    parseEnhancedStatusCode(
      '450 4.2.0 <user@example.com>: Recipient address rejected: Greylisted'
    ),
    '4.2.0'
  );
});

test('parses rate limiting response', (t) => {
  t.is(
    parseEnhancedStatusCode('421 4.7.28 Too many connections from your IP'),
    '4.7.28'
  );
});
