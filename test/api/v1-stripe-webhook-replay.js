/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Stripe may deliver an event more than once, and a signed event can be sent
// again by anyone who captured it (within the signature tolerance), so each
// event is only processed once.
//

const { randomUUID } = require('node:crypto');

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const stripe = require('#helpers/stripe');

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

function send(t, payload) {
  return t.context.api
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
}

test('a Stripe event delivered again is not processed again', async (t) => {
  const customer = `cus_${randomUUID()}`;
  await t.context.userFactory
    .withState({
      [config.userFields.stripeCustomerID]: customer,
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();

  // processing an event starts by looking up its payment intent in Stripe
  // (it then fails here since nothing else is answered, which is fine)
  let lookups = 0;
  stub(t, stripe.paymentIntents, 'retrieve', async () => {
    lookups++;
    throw new Error('stop');
  });

  const paymentIntent = {
    id: `pi_${randomUUID()}`,
    object: 'payment_intent',
    status: 'succeeded',
    customer
  };
  const payload = JSON.stringify({
    id: `evt_${randomUUID()}`,
    object: 'event',
    type: 'payment_intent.succeeded',
    data: { object: paymentIntent }
  });

  let res = await send(t, payload);
  t.is(res.status, 200);
  await pWaitFor(() => lookups === 1, { timeout: ms('10s') });

  // the same event again (a retry or a replay)
  res = await send(t, payload);
  t.is(res.status, 200);
  t.deepEqual(res.body, { received: true });
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  t.is(lookups, 1, 'the event may only be processed once');

  // another event is still processed
  res = await send(
    t,
    JSON.stringify({
      id: `evt_${randomUUID()}`,
      object: 'event',
      type: 'payment_intent.succeeded',
      data: { object: paymentIntent }
    })
  );
  t.is(res.status, 200);
  await pWaitFor(() => lookups === 2, { timeout: ms('10s') });
});
