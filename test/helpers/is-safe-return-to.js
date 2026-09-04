/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const isSafeReturnTo = require('#helpers/is-safe-return-to');

const WEB_URL = 'https://forwardemail.net';

test('allows safe relative and trusted absolute return URLs', (t) => {
  for (const value of ['/my-account', '/my-account?tab=security']) {
    t.true(isSafeReturnTo(value, WEB_URL), `expected safe URL: ${value}`);
  }

  t.true(
    isSafeReturnTo('https://forwardemail.net/my-account?tab=security', WEB_URL)
  );
});

test('rejects every unsafe redirect form before URL parsing', (t) => {
  const unsafeValues = [
    '//evil.example',
    '/\\evil.example',
    'https://forwardemail.net\\@evil.example',
    'https://forwardemail.net/%0d%0aSet-Cookie:%20a=b',
    'https://forwardemail.net/%250d%250aSet-Cookie:%20a=b',
    '/my-account\r\nSet-Cookie: a=b',
    ['java', 'script:alert(1)'].join(''),
    'https://evil.example/my-account'
  ];

  for (const value of unsafeValues) {
    t.false(isSafeReturnTo(value, WEB_URL), `expected unsafe URL: ${value}`);
  }
});

test('rejects malformed percent encoding without throwing', (t) => {
  t.false(isSafeReturnTo('/my-account%ZZ', WEB_URL));
});
