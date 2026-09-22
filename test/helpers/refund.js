/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const sinon = require('sinon');
const ms = require('ms');

const utils = require('../utils');
const refund = require('#helpers/refund');
const stripe = require('#helpers/stripe');
const { Payments } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.afterEach.always(() => {
  sinon.restore();
});

async function createStripePayment(t) {
  const user = await t.context.userFactory.create();
  return Payments.create({
    user: user._id,
    amount: 1999,
    amount_refunded: 0,
    duration: ms('1y'),
    invoice_at: new Date(),
    method: 'visa',
    plan: 'enhanced_protection',
    kind: 'one-time',
    stripe_payment_intent_id: `pi_${String(user._id)}`
  });
}

test.serial('does not record a non-completed Stripe refund', async (t) => {
  const payment = await createStripePayment(t);
  const create = sinon
    .stub(stripe.refunds, 'create')
    .resolves({ status: 'pending' });

  const error = await t.throwsAsync(refund(payment._id));
  const pending = await Payments.findById(payment._id).lean().exec();

  t.is(error.message, 'Stripe refund was not completed: pending');
  t.is(create.callCount, 1);
  t.deepEqual(create.firstCall.args[1], {
    idempotencyKey: `refund-${payment._id}`
  });
  t.is(pending.amount_refunded, 0);
  t.falsy(pending.refunded_at);
});

test.serial(
  'completed Stripe refunds record amounts and completion time',
  async (t) => {
    const payment = await createStripePayment(t);
    const create = sinon
      .stub(stripe.refunds, 'create')
      .resolves({ status: 'succeeded' });

    await refund(payment._id);
    const refunded = await Payments.findById(payment._id).lean().exec();

    t.deepEqual(create.firstCall.args[1], {
      idempotencyKey: `refund-${payment._id}`
    });
    t.is(refunded.amount_refunded, payment.amount);
    t.truthy(refunded.refunded_at);
  }
);
