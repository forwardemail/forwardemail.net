/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The redirect back from Stripe and PayPal checkout
// (GET /my-account/billing/upgrade?plan=...&session_id=... or
// &paypal_order_id=... or &paypal_subscription_id=...): the plan is only
// credited for a payment the user made, and never for an unpaid PayPal
// order or for another account's checkout session, order or subscription.
// Stripe and PayPal are answered locally.
//

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const request = require('supertest');
const sinon = require('sinon');
const superagent = require('superagent');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const stripe = require('#helpers/stripe');
const { paypal } = require('#helpers/paypal');
const { Payments, Users } = require('#models');

const { PAYPAL_PLAN_MAPPING, STRIPE_MAPPING } = config.payments;
const PAYPAL_PLAN_ID = 'P-TEST-ENHANCED-30D';
const ORIGINAL_PLAN_ID = PAYPAL_PLAN_MAPPING.enhanced_protection['30d'];

test.before(utils.setupMongoose);
// (the plan IDs come from the environment, so a known one is used here)
test.before(() => {
  PAYPAL_PLAN_MAPPING.enhanced_protection['30d'] = PAYPAL_PLAN_ID;
});
test.after.always(() => {
  PAYPAL_PLAN_MAPPING.enhanced_protection['30d'] = ORIGINAL_PLAN_ID;
});
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user[config.userFields.stripeCustomerID] = `cus_${user.id}`;
  t.context.user = await user.save();
  // (payments are unique by their order, session and transaction IDs)
  t.context.id = user.id;
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(() => {
  sinon.restore();
});
test.afterEach.always(utils.teardownWebServer);

function upgrade(t, query) {
  return t.context.web
    .get('/en/my-account/billing/upgrade')
    .query({ plan: 'enhanced_protection', ...query });
}

async function createOtherUser(t) {
  const other = await t.context.userFactory.create();
  other[config.userFields.stripeCustomerID] = `cus_${other.id}`;
  return other.save();
}

async function assertNotCredited(t, user) {
  const fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'free');
  t.is(await Payments.countDocuments({ user: user._id }), 0);
  return fresh;
}

async function assertCredited(t, user) {
  const fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'enhanced_protection');
  const payments = await Payments.find({ user: user._id }).lean().exec();
  t.is(payments.length, 1);
  t.is(payments[0].plan, 'enhanced_protection');
  t.true(new Date(fresh[config.userFields.planExpiresAt]) > new Date());
  return { user: fresh, payment: payments[0] };
}

//
// PayPal's REST API, answered by `handler(request)` with `request` being
// e.g. "GET /v2/checkout/orders/ID" (it returns the response body, or
// throws the error of a failed request)
//
function mockPayPal(handler) {
  const requests = [];
  sinon
    .stub(paypal, 'generateToken')
    .callsFake((...args) => args.at(-1)(null, 'Bearer test'));
  sinon.stub(superagent, 'agent').callsFake(() => {
    const agent = {};
    for (const fn of ['use', 'set', 'timeout', 'retry'])
      agent[fn] = () => agent;
    for (const method of ['get', 'post']) {
      agent[method] = (url) => {
        const request = `${method.toUpperCase()} ${url}`;
        requests.push(request);
        const promise = (async () => {
          const body = await handler(request);
          return { body };
        })();
        promise.set = () => promise;
        promise.send = () => promise;
        return promise;
      };
    }

    return agent;
  });
  return requests;
}

function paypalError(status, name) {
  const err = new Error(name);
  err.status = status;
  err.response = { body: { name, details: [{ issue: name }] } };
  return err;
}

function order(t, { status, referenceId = t.context.user.id, captureStatus }) {
  const id = `ORDER-${t.context.id}`;
  const unit = {
    reference_id: referenceId,
    custom_id: 'ENHANCED_PROTECTION',
    invoice_id: `REF-${id}`,
    items: [{ unit_amount: { currency_code: 'USD', value: '3' } }]
  };
  if (captureStatus)
    unit.payments = {
      captures: [
        {
          id: `CAPTURE-${id}`,
          status: captureStatus,
          create_time: new Date().toISOString()
        }
      ]
    };
  return {
    id,
    intent: 'CAPTURE',
    status,
    create_time: new Date().toISOString(),
    payer: { payer_id: 'PAYER-1' },
    purchase_units: [unit]
  };
}

//
// PayPal one-time orders
//

test.serial(
  'a PayPal order whose capture is declined does not credit the plan',
  async (t) => {
    const orderId = `ORDER-${t.context.id}`;
    const requests = mockPayPal((request) => {
      if (request === `GET /v2/checkout/orders/${orderId}`)
        return order(t, { status: 'APPROVED' });
      if (request === `POST /v2/checkout/orders/${orderId}/capture`)
        throw paypalError(422, 'INSTRUMENT_DECLINED');
      throw new Error(`Unexpected ${request}`);
    });

    const res = await upgrade(t, { paypal_order_id: orderId });
    t.is(res.status, 302);
    t.true(requests.includes(`POST /v2/checkout/orders/${orderId}/capture`));
    await assertNotCredited(t, t.context.user);
  }
);

test.serial('another account’s PayPal order is refused', async (t) => {
  const other = await createOtherUser(t);
  const orderId = `ORDER-${t.context.id}`;
  const requests = mockPayPal((request) => {
    if (request === `GET /v2/checkout/orders/${orderId}`)
      return order(t, {
        status: 'COMPLETED',
        referenceId: other.id,
        captureStatus: 'COMPLETED'
      });
    if (request === `POST /v2/checkout/orders/${orderId}/capture`)
      throw paypalError(422, 'ORDER_ALREADY_CAPTURED');
    throw new Error(`Unexpected ${request}`);
  });

  const res = await upgrade(t, { paypal_order_id: orderId });
  t.is(res.status, 302);
  t.true(requests.length > 0);
  await assertNotCredited(t, t.context.user);
});

test.serial('a paid PayPal order credits the plan', async (t) => {
  const orderId = `ORDER-${t.context.id}`;
  mockPayPal((request) => {
    if (request === `GET /v2/checkout/orders/${orderId}`)
      return order(t, { status: 'APPROVED' });
    if (request === `POST /v2/checkout/orders/${orderId}/capture`)
      return order(t, { status: 'COMPLETED', captureStatus: 'COMPLETED' });
    throw new Error(`Unexpected ${request}`);
  });

  const res = await upgrade(t, { paypal_order_id: orderId });
  t.is(res.status, 302);
  const { payment } = await assertCredited(t, t.context.user);
  t.is(payment.paypal_order_id, orderId);
  t.is(payment.paypal_transaction_id, `CAPTURE-${orderId}`);
  t.is(payment.amount, 300);
});

test.serial(
  'a PayPal order already captured by the webhook still credits the plan',
  async (t) => {
    const orderId = `ORDER-${t.context.id}`;
    let captured = false;
    mockPayPal((request) => {
      if (request === `GET /v2/checkout/orders/${orderId}`)
        return captured
          ? order(t, { status: 'COMPLETED', captureStatus: 'COMPLETED' })
          : order(t, { status: 'APPROVED' });
      if (request === `POST /v2/checkout/orders/${orderId}/capture`) {
        // the webhook captured it in the meantime
        captured = true;
        throw paypalError(422, 'ORDER_ALREADY_CAPTURED');
      }

      throw new Error(`Unexpected ${request}`);
    });

    const res = await upgrade(t, { paypal_order_id: orderId });
    t.is(res.status, 302);
    const { payment } = await assertCredited(t, t.context.user);
    t.is(payment.paypal_transaction_id, `CAPTURE-${orderId}`);
  }
);

//
// Stripe checkout sessions
//

function mockStripe(t, customer) {
  const id = `cs_test_${t.context.id}`;
  sinon.stub(stripe.checkout.sessions, 'retrieve').resolves({
    id,
    customer,
    mode: 'payment',
    payment_status: 'paid',
    payment_intent: `pi_${id}`,
    client_reference_id: `REF-${id}`,
    amount_total: 300
  });
  sinon.stub(stripe.checkout.sessions, 'listLineItems').resolves({
    data: [
      {
        price: {
          id: STRIPE_MAPPING.enhanced_protection['one-time']['30d'],
          product: 'prod_ICStJG6fjZhEjl'
        }
      }
    ]
  });
  sinon.stub(stripe.paymentIntents, 'retrieve').resolves({
    id: `pi_${id}`,
    status: 'succeeded',
    created: dayjs().unix(),
    payment_method: 'pm_1'
  });
  sinon.stub(stripe.paymentMethods, 'retrieve').resolves({
    type: 'card',
    card: { brand: 'visa', exp_month: 1, exp_year: 2099, last4: '4242' }
  });
  return id;
}

test.serial(
  'another account’s Stripe checkout session is refused',
  async (t) => {
    const { user } = t.context;
    const other = await createOtherUser(t);
    const id = mockStripe(t, other[config.userFields.stripeCustomerID]);

    const res = await upgrade(t, { session_id: id });
    t.is(res.status, 302);
    const fresh = await assertNotCredited(t, user);
    // the user keeps their own Stripe customer
    t.is(fresh[config.userFields.stripeCustomerID], `cus_${user.id}`);
  }
);

test.serial(
  'the user’s own Stripe checkout session credits the plan',
  async (t) => {
    const { user } = t.context;
    const id = mockStripe(t, user[config.userFields.stripeCustomerID]);

    const res = await upgrade(t, { session_id: id });
    t.is(res.status, 302);
    const { user: fresh, payment } = await assertCredited(t, user);
    t.is(payment.stripe_session_id, id);
    t.is(fresh[config.userFields.stripeCustomerID], `cus_${user.id}`);
  }
);

test.serial(
  'a Stripe checkout session whose payment did not succeed is not credited',
  async (t) => {
    const { user } = t.context;
    const id = mockStripe(t, user[config.userFields.stripeCustomerID]);
    stripe.paymentIntents.retrieve.resolves({
      id: `pi_${id}`,
      status: 'requires_payment_method',
      created: dayjs().unix(),
      payment_method: 'pm_1'
    });

    const res = await upgrade(t, { session_id: id });
    t.is(res.status, 302);
    await assertNotCredited(t, user);
  }
);

//
// PayPal subscriptions
//

function mockSubscription(t, { status = 'ACTIVE', customId } = {}) {
  const id = `I-${t.context.id}`;
  const subscription = {
    id,
    status,
    plan_id: PAYPAL_PLAN_ID,
    ...(customId ? { custom_id: customId } : {}),
    start_time: new Date().toISOString(),
    subscriber: { payer_id: 'PAYER-1', email_address: 'payer@example.com' },
    billing_info: {
      last_payment: {
        amount: { currency_code: 'USD', value: '3.00' },
        time: new Date().toISOString()
      }
    }
  };
  mockPayPal((request) => {
    if (request === `GET /v1/billing/subscriptions/${id}`) return subscription;
    if (request.startsWith(`GET /v1/billing/subscriptions/${id}/transactions?`))
      return {
        transactions: [{ id: `TX-${id}`, time: new Date().toISOString() }]
      };
    throw new Error(`Unexpected ${request}`);
  });
  return id;
}

async function assertSubscriptionNotCredited(t, user) {
  const fresh = await assertNotCredited(t, user);
  t.falsy(fresh[config.userFields.paypalSubscriptionID]);
}

test.serial(
  'a PayPal subscription created for another account is refused',
  async (t) => {
    const other = await createOtherUser(t);
    const id = mockSubscription(t, { customId: other.id });

    const res = await upgrade(t, { paypal_subscription_id: id });
    t.is(res.status, 302);
    await assertSubscriptionNotCredited(t, t.context.user);
  }
);

test.serial(
  'a PayPal subscription already on another account is refused',
  async (t) => {
    // (an older subscription, created without `custom_id`)
    const id = mockSubscription(t);
    const other = await createOtherUser(t);
    other[config.userFields.paypalSubscriptionID] = id;
    await other.save();

    const res = await upgrade(t, { paypal_subscription_id: id });
    t.is(res.status, 302);
    await assertSubscriptionNotCredited(t, t.context.user);
  }
);

test.serial(
  'a PayPal subscription that is not approved or active is refused',
  async (t) => {
    const id = mockSubscription(t, {
      status: 'APPROVAL_PENDING',
      customId: t.context.user.id
    });

    const res = await upgrade(t, { paypal_subscription_id: id });
    t.is(res.status, 302);
    await assertSubscriptionNotCredited(t, t.context.user);
  }
);

test.serial(
  'the user’s own PayPal subscription credits the plan',
  async (t) => {
    const { user } = t.context;
    const id = mockSubscription(t, { customId: user.id });

    const res = await upgrade(t, { paypal_subscription_id: id });
    t.is(res.status, 302);
    const { user: fresh, payment } = await assertCredited(t, user);
    t.is(fresh[config.userFields.paypalSubscriptionID], id);
    t.is(payment.paypal_transaction_id, `TX-${id}`);
  }
);

test.serial(
  'one PayPal subscription is not credited to two accounts at once',
  async (t) => {
    // a second signed-in account
    const password = falso.randPassword();
    let other = await t.context.userFactory.make();
    other = await Users.register(other, password);
    other[config.userFields.hasSetPassword] = true;
    other[config.userFields.hasVerifiedEmail] = true;
    await other.save();
    const otherWeb = request.agent(t.context._web.server);
    await otherWeb.post('/en/login').send({ email: other.email, password });

    // (an older subscription, created without `custom_id`)
    const id = mockSubscription(t);

    // both accounts return from the same checkout at the same time
    const responses = await Promise.all(
      [t.context.web, otherWeb].map((web) =>
        web
          .get('/en/my-account/billing/upgrade')
          .query({ plan: 'enhanced_protection', paypal_subscription_id: id })
      )
    );
    for (const res of responses) t.is(res.status, 302);

    t.is(
      await Users.countDocuments({
        [config.userFields.paypalSubscriptionID]: id
      }),
      1
    );
    t.is(
      await Users.countDocuments({
        _id: { $in: [t.context.user._id, other._id] },
        plan: 'enhanced_protection'
      }),
      1
    );
  }
);
