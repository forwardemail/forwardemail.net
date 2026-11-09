/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The hourly PayPal order sync syncs each payment PayPal can still refund.
// A payment that failed to sync stopped the run, so the payments after it
// were not synced, and the next run stopped at it again.
//

const ms = require('ms');
const test = require('ava');

// (PayPal is not called: the payments synced are recorded, and the ones in
// `failing` throw; the emails are recorded instead of sent; first, so that
// the job loaded below gets these)
const synced = [];
const failing = new Set();
const syncPath = require.resolve(
  '#helpers/sync-paypal-order-payment-by-payment-id'
);
require.cache[syncPath] = {
  id: syncPath,
  filename: syncPath,
  loaded: true,
  async exports(id) {
    synced.push(id.toString());
    if (failing.has(id.toString()))
      throw new Error(`Capture does not exist for ${id}`);
  }
};

const sent = [];
const emailPath = require.resolve('#helpers/email');
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(options) {
    sent.push(options);
  }
};

const utils = require('../utils');

const syncPayPalOrderPayments = require('../../jobs/paypal/sync-paypal-order-payments');
const { Payments } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async () => {
  await Payments.deleteMany({});
  synced.length = 0;
  sent.length = 0;
  failing.clear();
});

// (the job's alerts, not ones other modules send)
function syncAlerts() {
  return sent.filter((options) =>
    options.message?.subject?.startsWith('Sync PayPal Orders')
  );
}

async function createPayments(t, count) {
  const user = await t.context.userFactory.create();
  const payments = [];
  for (let i = 0; i < count; i++)
    payments.push(
      await t.context.paymentFactory
        .withState({
          user: user._id,
          amount: 300,
          invoice_at: new Date(),
          method: 'paypal',
          duration: ms('30d'),
          plan: 'enhanced_protection',
          kind: 'one-time',
          paypal_order_id: `ORDER-${user.id}-${i}`
        })
        .create()
    );
  return payments;
}

test.serial(
  'a payment that fails to sync does not stop the others, and is emailed',
  async (t) => {
    const payments = await createPayments(t, 3);
    failing.add(payments[0].id);

    await syncPayPalOrderPayments();

    t.deepEqual(
      synced.sort(),
      payments.map((p) => p.id).sort(),
      'every payment was synced'
    );
    const alerts = syncAlerts();
    t.is(alerts.length, 1);
    t.regex(alerts[0].message.subject, /had 1 error$/);
    t.true(alerts[0].locals.message.includes(payments[0].id));
  }
);

test.serial('a run of failures stops the run, and is emailed', async (t) => {
  const payments = await createPayments(t, 12);
  for (const payment of payments) failing.add(payment.id);

  await syncPayPalOrderPayments();

  // (PayPal itself failing makes every payment fail)
  t.is(synced.length, 10);
  const alerts = syncAlerts();
  t.is(alerts.length, 1);
  t.true(alerts[0].locals.message.includes('Stopped after 10 payments'));
});
