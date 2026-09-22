/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const getDomainNameRestrictions = require('#helpers/get-domain-name-restrictions');

//
// A free-plan domain must be "good" (a TLD on the allowlist), not
// restricted and not disposable.
//
test('domains under the allowlisted ccTLDs are good', (t) => {
  for (const tld of ['ae', 'ar', 'ee']) {
    const restrictions = getDomainNameRestrictions(`example.${tld}`);
    t.true(restrictions.isGood, `${tld}`);
    t.false(restrictions.isRestricted, `${tld}`);
    t.false(restrictions.isDisposable, `${tld}`);
    // (the classification is by root domain)
    t.true(
      getDomainNameRestrictions(`mail.sub.example.${tld}`).isGood,
      `${tld}`
    );
  }
});

test('domains under spam-prone ccTLDs are not', (t) => {
  for (const tld of ['ru', 'ua']) {
    t.false(getDomainNameRestrictions(`example.${tld}`).isGood, `${tld}`);
  }
});

test('government and registrar names are restricted', (t) => {
  t.true(getDomainNameRestrictions('example.gov').isRestricted);
  t.true(getDomainNameRestrictions('mail.example.edu').isRestricted);
  t.true(getDomainNameRestrictions('nic.gov').isRestricted);
  t.true(getDomainNameRestrictions('police.uk').isRestricted);
  t.false(getDomainNameRestrictions('example.ae').isRestricted);
});
