/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const getIpBucket = require('#helpers/get-ip-bucket');

test('IPv4 addresses are their own bucket', (t) => {
  t.is(getIpBucket('192.0.2.1'), '192.0.2.1');
  t.not(getIpBucket('192.0.2.1'), getIpBucket('192.0.2.2'));
});

test('IPv4-mapped IPv6 is the same client as the IPv4 address', (t) => {
  t.is(getIpBucket('::ffff:192.0.2.1'), '192.0.2.1');
});

test('IPv6 addresses of one /64 share a bucket, whatever their spelling', (t) => {
  const bucket = '2a01:04f8:1234:5678::/64';
  for (const address of [
    '2a01:4f8:1234:5678::1',
    '2a01:4f8:1234:5678:ffff:ffff:ffff:ffff',
    '2A01:04F8:1234:5678:0:0:0:2',
    '2a01:4f8:1234:5678:abcd::'
  ])
    t.is(getIpBucket(address), bucket);

  t.is(getIpBucket('2a01:4f8:1234:5679::1'), '2a01:04f8:1234:5679::/64');
  t.is(getIpBucket('::1'), '0000:0000:0000:0000::/64');
});

test('anything that is not an IP address is returned unchanged', (t) => {
  for (const value of ['', 'localhost', 'not an ip', undefined, null])
    t.is(getIpBucket(value), value);
});
