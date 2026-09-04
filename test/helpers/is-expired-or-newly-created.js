/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const normalizeRdapUrl = require('#helpers/normalize-rdap-url');

test('normalizes a scheme-less registrar RDAP endpoint', (t) => {
  t.is(
    normalizeRdapUrl('rdap.dynadot.com/v1/').toString(),
    'https://rdap.dynadot.com/v1/'
  );
});

test('preserves HTTP(S) RDAP endpoint URLs', (t) => {
  t.is(
    normalizeRdapUrl('https://rdap.example.com/domain/example.com').toString(),
    'https://rdap.example.com/domain/example.com'
  );
});

test('rejects malformed and non-HTTP RDAP endpoint URLs', (t) => {
  t.throws(() => normalizeRdapUrl(''));
  t.throws(() => normalizeRdapUrl('file:///etc/passwd'));
});
