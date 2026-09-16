/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const getActiveStripeSubscriptions = require('#helpers/get-active-stripe-subscriptions');

test('returns only subscriptions that currently provide service', (t) => {
  const subscriptions = [
    { id: 'active', status: 'active' },
    { id: 'trialing', status: 'trialing' },
    { id: 'incomplete', status: 'incomplete' },
    { id: 'past-due', status: 'past_due' },
    { id: 'unpaid', status: 'unpaid' },
    { id: 'paused', status: 'paused' },
    { id: 'canceled', status: 'canceled' }
  ];

  t.deepEqual(
    getActiveStripeSubscriptions(subscriptions).map(
      (subscription) => subscription.id
    ),
    ['active', 'trialing']
  );
});

test('does not treat pending payment states as duplicate subscriptions', (t) => {
  t.deepEqual(
    getActiveStripeSubscriptions([
      { id: 'current-service', status: 'active' },
      { id: 'bank-payment-pending', status: 'incomplete' }
    ]).map((subscription) => subscription.id),
    ['current-service']
  );
});

test('handles an absent subscription collection safely', (t) => {
  t.deepEqual(getActiveStripeSubscriptions(), []);
});
