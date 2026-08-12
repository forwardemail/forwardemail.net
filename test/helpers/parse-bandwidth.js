/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const parseBandwidth = require('#helpers/parse-bandwidth');

test('parses decimal byte bandwidth units', (t) => {
  t.is(parseBandwidth('62.5MB/s'), 62_500_000);
  t.is(parseBandwidth('1GB/s'), 1_000_000_000);
  t.is(parseBandwidth(' 500KB/s '), 500_000);
  t.is(parseBandwidth('1.5MB/s'), 1_500_000);
});

test('parses numeric bytes per second', (t) => {
  t.is(parseBandwidth(125_000_000), 125_000_000);
  t.is(parseBandwidth(125.9), 125);
});

test('rejects invalid bandwidth values', (t) => {
  for (const value of [
    undefined,
    null,
    '',
    '125',
    '125MBps',
    '125MiB/s',
    '0MB/s',
    '-1MB/s',
    Number.NaN,
    0,
    -1
  ]) {
    t.throws(() => parseBandwidth(value), { instanceOf: TypeError });
  }
});
