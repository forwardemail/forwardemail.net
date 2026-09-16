/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

process.env.NODE_ENV = 'test';

for (const key of [
  'PAYPAL_WEBHOOK_ID',
  'PAYPAL_ENHANCED_PLAN_30D',
  'PAYPAL_ENHANCED_PLAN_60D',
  'PAYPAL_ENHANCED_PLAN_90D',
  'PAYPAL_ENHANCED_PLAN_180D',
  'PAYPAL_ENHANCED_PLAN_1Y',
  'PAYPAL_TEAM_PLAN_30D',
  'PAYPAL_TEAM_PLAN_60D',
  'PAYPAL_TEAM_PLAN_90D',
  'PAYPAL_TEAM_PLAN_180D',
  'PAYPAL_TEAM_PLAN_1Y',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_SECRET',
  'PAYPAL_WEBHOOK_ID_LEGACY',
  'PAYPAL_ENHANCED_PLAN_30D_LEGACY',
  'PAYPAL_ENHANCED_PLAN_60D_LEGACY',
  'PAYPAL_ENHANCED_PLAN_90D_LEGACY',
  'PAYPAL_ENHANCED_PLAN_180D_LEGACY',
  'PAYPAL_ENHANCED_PLAN_1Y_LEGACY',
  'PAYPAL_TEAM_PLAN_30D_LEGACY',
  'PAYPAL_TEAM_PLAN_60D_LEGACY',
  'PAYPAL_TEAM_PLAN_90D_LEGACY',
  'PAYPAL_TEAM_PLAN_180D_LEGACY',
  'PAYPAL_TEAM_PLAN_1Y_LEGACY',
  'PAYPAL_CLIENT_ID_LEGACY',
  'PAYPAL_SECRET_LEGACY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_ENDPOINT_SECRET'
]) {
  process.env[key] = 'test';
}

process.env.SRS_SECRET = 'test-srs-secret';

const test = require('ava');

const getDomainNameRestrictions = require('#helpers/get-domain-name-restrictions');

test('allows the requested and established ccTLDs through the free-plan domain restriction gate', (t) => {
  for (const tld of ['ae', 'ar', 'ee', 'pl', 'ro']) {
    const restrictions = getDomainNameRestrictions(`example.${tld}`);
    t.true(
      restrictions.isGood,
      `expected example.${tld} to be free-plan eligible`
    );
    t.false(
      restrictions.isRestricted,
      `expected example.${tld} not to require a restricted plan`
    );
  }
});
