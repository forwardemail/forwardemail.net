/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const isGenericReverseHostname = require('#helpers/is-generic-reverse-hostname');

test('detects provider-generated reverse hostnames that embed the address', (t) => {
  // Google Cloud (reversed octets)
  t.true(
    isGenericReverseHostname(
      '60.140.196.35.bc.googleusercontent.com',
      '35.196.140.60'
    )
  );
  t.true(
    isGenericReverseHostname(
      '10.9.228.8.bc.googleusercontent.com',
      '8.228.9.10'
    )
  );
  // AWS EC2 (dashed forward octets)
  t.true(
    isGenericReverseHostname(
      'ec2-3-15-22-8.us-east-2.compute.amazonaws.com',
      '3.15.22.8'
    )
  );
  t.true(
    isGenericReverseHostname('ec2-54-1-2-3.compute-1.amazonaws.com', '54.1.2.3')
  );
  // Linode
  t.true(
    isGenericReverseHostname(
      '172-105-1-2.ip.linodeusercontent.com',
      '172.105.1.2'
    )
  );
  // Hetzner (reversed octets)
  t.true(
    isGenericReverseHostname(
      'static.130.235.21.65.clients.your-server.de',
      '65.21.235.130'
    )
  );
  // zero-padded octets and a trailing dot
  t.true(
    isGenericReverseHostname(
      'host-035-196-140-060.static.example.net.',
      '35.196.140.60'
    )
  );
  // IPv4-mapped IPv6 connecting address
  t.true(
    isGenericReverseHostname(
      '60.140.196.35.bc.googleusercontent.com',
      '::ffff:35.196.140.60'
    )
  );
});

test('does not match hostnames that are not derived from the address', (t) => {
  t.false(isGenericReverseHostname('mail.example.com', '35.196.140.60'));
  t.false(
    isGenericReverseHostname('mail-io1-xd48.google.com', '209.85.166.72')
  );
  t.false(
    isGenericReverseHostname('a8-45.smtp-out.amazonses.com', '54.240.8.45')
  );
  t.false(
    isGenericReverseHostname(
      'mta-out-24.mail.protection.outlook.com',
      '40.107.24.100'
    )
  );
  // a different address embedded in the hostname is not this address
  t.false(
    isGenericReverseHostname(
      '60.140.196.35.bc.googleusercontent.com',
      '35.196.140.61'
    )
  );
  // partial octet runs do not count (OVH-style three-octet names)
  t.false(isGenericReverseHostname('ip60.ip-35-196-140.eu', '35.196.140.60'));
  // octets must be whole labels
  t.false(
    isGenericReverseHostname('host135.196.140.601.example.net', '35.196.140.60')
  );
});

test('requires every octet to be a whole label', (t) => {
  // QQ Mail's outbound hosts embed the address with the first octet glued to
  // a prefix; the check deliberately does not stretch to cover that shape
  // (such senders are also excluded by their EHLO greeting and SPF/DKIM)
  t.false(
    isGenericReverseHostname(
      'out203-205-221-243.mail.qq.com',
      '203.205.221.243'
    )
  );
  // whereas a delimited prefix is fine
  t.true(
    isGenericReverseHostname(
      'out-203-205-221-243.mail.example.net',
      '203.205.221.243'
    )
  );
});

test('ignores invalid input and IPv6 addresses', (t) => {
  t.false(isGenericReverseHostname('', '35.196.140.60'));
  t.false(isGenericReverseHostname(undefined, '35.196.140.60'));
  t.false(isGenericReverseHostname('mail.example.com', ''));
  t.false(isGenericReverseHostname('mail.example.com', undefined));
  t.false(isGenericReverseHostname('mail.example.com', 'not-an-ip'));
  t.false(
    isGenericReverseHostname(
      '2600-3c00--f03c-93ff-fe00-0000.ip.linodeusercontent.com',
      '2600:3c00::f03c:93ff:fe00:0'
    )
  );
});
