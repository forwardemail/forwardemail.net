/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const isRdapRenewalGracePeriod = require('#helpers/is-rdap-renewal-grace-period');

test('recognizes normalized registrar auto-renewal statuses', (t) => {
  t.true(
    isRdapRenewalGracePeriod(['pending renew', 'auto renew period']),
    'domains in registrar renewal processing are not available for takeover'
  );
  t.true(isRdapRenewalGracePeriod([' AUTO RENEW PERIOD ']));
});

test('does not suppress confirmed abusive pending states', (t) => {
  t.false(isRdapRenewalGracePeriod(['pending delete']));
  t.false(isRdapRenewalGracePeriod(['pending transfer']));
  t.false(isRdapRenewalGracePeriod([]));
  t.false(isRdapRenewalGracePeriod(undefined));
});
