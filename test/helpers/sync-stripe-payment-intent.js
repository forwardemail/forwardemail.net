/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Concurrent Stripe webhooks and syncs for one payment intent stored the
// payment more than once: the unique index on `stripe_payment_intent_id`
// was never built (a plain index took its name), so nothing rejected the
// second insert.  Each extra copy added another period to the plan expiry,
// and every later sync of that payment intent failed with "There are too
// many payments in the system with stripe_payment_intent_id".
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const stripe = require('#helpers/stripe');
const syncStripePaymentIntent = require('#helpers/sync-stripe-payment-intent');
const {
  findDuplicates,
  removeDuplicates,
  ensureUniqueIndex
} = require('#helpers/remove-duplicate-payments');
const { Payments, Users } = require('#models');

const { STRIPE_MAPPING, STRIPE_PRODUCTS } = config.payments;

const silent = { info() {}, warn() {}, error() {} };

test.before(utils.setupMongoose);
// (the unique indexes are built)
test.before(async () => {
  await Payments.init();
});
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

function stub(t, object, key, value) {
  const original = object[key];
  object[key] = value;
  t.teardown(() => {
    object[key] = original;
  });
}

async function createUser(t, planSetAt) {
  return t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: planSetAt,
      [config.userFields.stripeCustomerID]: `cus_${randomUUID()}`,
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
}

async function indexStatus() {
  const { status } = await ensureUniqueIndex(
    Payments,
    'stripe_payment_intent_id',
    { logger: silent }
  );
  return status;
}

function paymentDoc(user, fields = {}) {
  const now = new Date();
  // (inserted directly, so set the unique `id` the model sets on save)
  const _id = new mongoose.Types.ObjectId();
  return {
    _id,
    id: _id.toString(),
    user: user._id,
    reference: randomUUID(),
    amount: 300,
    method: 'link',
    duration: ms('30d'),
    plan: 'enhanced_protection',
    kind: 'one-time',
    invoice_at: now,
    created_at: now,
    updated_at: now,
    ...fields
  };
}

test.serial(
  'the database rejects a second payment for one payment ID',
  async (t) => {
    const user = await createUser(t, new Date());
    for (const field of [
      'stripe_payment_intent_id',
      'paypal_order_id',
      'paypal_transaction_id'
    ]) {
      const value = `${field}_${randomUUID()}`;
      // (inserted directly, so only the index stands in the way)
      await Payments.collection.insertOne(paymentDoc(user, { [field]: value }));
      const err = await t.throwsAsync(
        Payments.collection.insertOne(paymentDoc(user, { [field]: value }))
      );
      t.is(err.code, 11000, `${field} duplicate rejected`);
      t.is(
        await Payments.countDocuments({ [field]: value }),
        1,
        `${field} stored once`
      );
    }
  }
);

test.serial(
  'saving a second payment for one payment intent fails with a code',
  async (t) => {
    const user = await createUser(t, new Date());
    const id = `pi_${randomUUID()}`;
    await Payments.create(paymentDoc(user, { stripe_payment_intent_id: id }));
    const err = await t.throwsAsync(
      Payments.create(paymentDoc(user, { stripe_payment_intent_id: id }))
    );
    t.is(err.code, 'PAYMENT_ALREADY_EXISTS');
    t.true(err.isBoom);
  }
);

test.serial(
  'concurrent syncs of one payment intent store one payment',
  async (t) => {
    const planSetAt = dayjs().subtract(1, 'hour').startOf('second');
    const user = await createUser(t, planSetAt.toDate());

    const created = dayjs().subtract(10, 'minutes').startOf('second');
    const product = Object.keys(STRIPE_PRODUCTS).find(
      (id) => STRIPE_PRODUCTS[id] === 'enhanced_protection'
    );
    const price = STRIPE_MAPPING.enhanced_protection['one-time']['30d'];
    const paymentIntent = {
      id: `pi_${randomUUID()}`,
      object: 'payment_intent',
      status: 'succeeded',
      amount: 300,
      currency: 'usd',
      customer: user[config.userFields.stripeCustomerID],
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
    const session = { id: `cs_${randomUUID()}` };
    stub(t, stripe.checkout.sessions, 'list', async () => ({
      data: [session]
    }));
    stub(t, stripe.checkout.sessions, 'listLineItems', async () => ({
      data: [{ price: { id: price, product } }]
    }));

    // as when charge.succeeded, payment_intent.succeeded and the
    // sync job all handle the payment intent at once
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        syncStripePaymentIntent(user)([], paymentIntent)
      )
    );

    t.deepEqual(
      results.flat().map((e) => e.err.message),
      []
    );
    t.is(
      await Payments.countDocuments({
        stripe_payment_intent_id: paymentIntent.id
      }),
      1
    );

    // and a later sync of it still works
    t.deepEqual(await syncStripePaymentIntent(user)([], paymentIntent), []);

    const doc = await Users.findById(user._id).lean();
    t.is(
      new Date(doc[config.userFields.planExpiresAt]).getTime(),
      planSetAt.add(1, 'month').toDate().getTime()
    );
  }
);

test.serial(
  'removes duplicates stored before the fix and builds the unique index',
  async (t) => {
    // the plain index production has in place of the unique one
    await Payments.collection.dropIndex('stripe_payment_intent_id_1');
    await Payments.collection.createIndex(
      { stripe_payment_intent_id: 1 },
      { name: 'stripe_payment_intent_id_1', background: true }
    );
    t.teardown(async () => {
      const indexes = await Payments.collection.indexes();
      const index = indexes.find(
        (i) => i.name === 'stripe_payment_intent_id_1'
      );
      if (index?.unique) return;
      await Payments.deleteMany({
        stripe_payment_intent_id: { $regex: /^pi_dup_/ }
      });
      if (index)
        await Payments.collection.dropIndex('stripe_payment_intent_id_1');
      await Payments.collection.createIndex(
        { stripe_payment_intent_id: 1 },
        {
          name: 'stripe_payment_intent_id_1',
          unique: true,
          sparse: true,
          background: true
        }
      );
    });

    const planSetAt = dayjs().subtract(1, 'hour').startOf('second');
    const user = await createUser(t, planSetAt.toDate());
    const other = await createUser(t, planSetAt.toDate());

    const id = `pi_dup_${randomUUID()}`;
    const invoiceAt = dayjs().subtract(10, 'minutes').toDate();
    const first = paymentDoc(user, {
      stripe_payment_intent_id: id,
      invoice_at: invoiceAt,
      created_at: dayjs().subtract(3, 'minutes').toDate()
    });
    const second = paymentDoc(user, {
      stripe_payment_intent_id: id,
      invoice_at: invoiceAt,
      created_at: dayjs().subtract(2, 'minutes').toDate()
    });
    const third = paymentDoc(user, {
      stripe_payment_intent_id: id,
      invoice_at: invoiceAt,
      created_at: dayjs().subtract(1, 'minutes').toDate()
    });
    // (a refund saved to the newer copy only)
    const refundedId = `pi_dup_${randomUUID()}`;
    const unrefunded = paymentDoc(user, {
      stripe_payment_intent_id: refundedId,
      invoice_at: invoiceAt,
      created_at: dayjs().subtract(5, 'minutes').toDate()
    });
    const refunded = paymentDoc(user, {
      stripe_payment_intent_id: refundedId,
      invoice_at: invoiceAt,
      amount_refunded: 300,
      refunded_at: new Date(),
      created_at: dayjs().subtract(4, 'minutes').toDate()
    });
    // (payments for one intent stored for two users are left alone)
    const shared = `pi_dup_${randomUUID()}`;
    await Payments.collection.insertMany([
      second,
      first,
      third,
      unrefunded,
      refunded,
      paymentDoc(user, { stripe_payment_intent_id: shared }),
      paymentDoc(other, { stripe_payment_intent_id: shared })
    ]);

    // each unrefunded copy added another month
    await Users.findById(user._id).then((u) => u.save());
    let doc = await Users.findById(user._id).lean();
    t.is(
      new Date(doc[config.userFields.planExpiresAt]).getTime(),
      planSetAt.add(5, 'month').toDate().getTime()
    );

    // a dry run changes nothing
    const dry = await removeDuplicates(Payments, 'stripe_payment_intent_id', {
      dryRun: true,
      logger: silent
    });
    t.is(dry.removed.length, 3);
    t.is(await Payments.countDocuments({ stripe_payment_intent_id: id }), 3);
    t.is(await indexStatus(), 'skipped');

    const backedUp = [];
    const result = await removeDuplicates(
      Payments,
      'stripe_payment_intent_id',
      {
        logger: silent,
        onBeforeRemove(extra) {
          backedUp.push(...extra);
        }
      }
    );

    // the oldest is kept, or the refunded one
    t.is(result.kept.length, 2);
    t.deepEqual(
      result.kept.map((p) => p.reference).sort(),
      [first.reference, refunded.reference].sort()
    );
    t.deepEqual(
      backedUp.map((p) => p.reference).sort(),
      [second.reference, third.reference, unrefunded.reference].sort()
    );
    t.is(result.removed.length, 3);
    const left = await Payments.find({ stripe_payment_intent_id: id }).lean();
    t.deepEqual(
      left.map((p) => p.reference),
      [first.reference]
    );
    t.deepEqual(result.userIds.map(String), [String(user._id)]);
    t.is(result.skipped.length, 1);
    t.is(result.skipped[0].value, shared);

    // the shared one still blocks the index
    t.is(await indexStatus(), 'skipped');
    await Payments.deleteMany({ user: other._id });

    t.is(await indexStatus(), 'created');
    t.is(await indexStatus(), 'exists');
    t.deepEqual(await findDuplicates(Payments, 'stripe_payment_intent_id'), []);
    const err = await t.throwsAsync(
      Payments.collection.insertOne(
        paymentDoc(user, { stripe_payment_intent_id: id })
      )
    );
    t.is(err.code, 11000);

    // saving the user again gives back the month paid
    await Users.findById(user._id).then((u) => u.save());
    doc = await Users.findById(user._id).lean();
    t.is(
      new Date(doc[config.userFields.planExpiresAt]).getTime(),
      planSetAt.add(2, 'month').toDate().getTime()
    );
  }
);
