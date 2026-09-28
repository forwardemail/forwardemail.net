/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A customer on Team paid two outstanding months and then switched to
// Enhanced Protection with a one-time payment.  When the Stripe
// `payment_intent.succeeded` webhook recorded the switch, the plan kept
// Team's start date, so only Enhanced Protection payments since then
// counted: the plan showed as expired, with months "outstanding" that had
// been paid for under Team.
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const stripe = require('#helpers/stripe');
const { Payments, Users } = require('#models');

const { STRIPE_MAPPING, STRIPE_PRODUCTS } = config.payments;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

function stub(t, object, key, value) {
  const original = object[key];
  object[key] = value;
  t.teardown(() => {
    object[key] = original;
  });
}

test('a plan switch recorded by the payment_intent webhook starts the new plan', async (t) => {
  const customer = `cus_${randomUUID()}`;
  const planSetAt = dayjs().subtract(85, 'days').toDate();

  const user = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: planSetAt,
      [config.userFields.stripeCustomerID]: customer,
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();

  // Team since 85 days ago, with the two outstanding months paid today

  for (const invoiceAt of [
    planSetAt,
    dayjs().subtract(2, 'hours').toDate(),
    dayjs().subtract(1, 'hour').toDate()
  ])
    await t.context.paymentFactory
      .withState({
        user: user._id,
        amount: 900,
        invoice_at: invoiceAt,
        method: 'free_beta_program',
        duration: ms('30d'),
        plan: 'team',
        kind: 'one-time'
      })
      .create();
  await user.save();

  // the one-time Enhanced Protection payment in Stripe
  const created = dayjs().subtract(10, 'minutes').startOf('second');
  const paymentIntentId = `pi_${randomUUID()}`;
  const product = Object.keys(STRIPE_PRODUCTS).find(
    (id) => STRIPE_PRODUCTS[id] === 'enhanced_protection'
  );
  const price = STRIPE_MAPPING.enhanced_protection['one-time']['30d'];
  const paymentIntent = {
    id: paymentIntentId,
    object: 'payment_intent',
    status: 'succeeded',
    amount: 300,
    currency: 'usd',
    customer,
    created: created.unix(),
    charges: {
      data: [
        {
          id: `ch_${randomUUID()}`,
          paid: true,
          status: 'succeeded',
          refunded: false,
          amount: 300,
          currency: 'usd',
          balance_transaction: null,
          payment_method_details: { type: 'link' }
        }
      ]
    }
  };
  const session = { id: `cs_${randomUUID()}`, customer };
  stub(t, stripe.paymentIntents, 'retrieve', async () => paymentIntent);
  stub(t, stripe.checkout.sessions, 'list', async () => ({ data: [session] }));
  stub(t, stripe.checkout.sessions, 'listLineItems', async () => ({
    data: [{ price: { id: price, product } }]
  }));

  const payload = JSON.stringify({
    id: `evt_${randomUUID()}`,
    object: 'event',
    type: 'payment_intent.succeeded',
    data: { object: paymentIntent }
  });
  const res = await t.context.api
    .post('/v1/stripe')
    .set('Content-Type', 'application/json')
    .set(
      'stripe-signature',
      stripe.webhooks.generateTestHeaderString({
        payload,
        secret: env.STRIPE_ENDPOINT_SECRET
      })
    )
    .send(payload);
  t.is(res.status, 200);

  await pWaitFor(
    async () => {
      const doc = await Users.findById(user._id).lean();
      return doc.plan === 'enhanced_protection';
    },
    { timeout: ms('20s') }
  );

  const payment = await Payments.findOne({
    user: user._id,
    stripe_payment_intent_id: paymentIntentId
  }).lean();
  t.truthy(payment);
  t.is(payment.plan, 'enhanced_protection');

  const doc = await Users.findById(user._id).lean();
  // the new plan starts with its payment and runs for the month paid
  t.is(
    new Date(doc[config.userFields.planSetAt]).getTime(),
    created.toDate().getTime()
  );
  t.is(
    new Date(doc[config.userFields.planExpiresAt]).getTime(),
    created.add(1, 'month').toDate().getTime()
  );
});
