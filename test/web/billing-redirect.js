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
const ms = require('ms');
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

// the order PayPal answers the next checkout with (see `checkout`)
let created;

//
// PayPal's REST API, answered by `handler(request)` with `request` being
// e.g. "GET /v2/checkout/orders/ID" (it returns the response body, or
// throws the error of a failed request)
//
function mockPayPal(handler) {
  const requests = [];
  created = undefined;
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
        // (the order `checkout` has made, not one of the requests looked at)
        const isCheckout = request === 'POST /v2/checkout/orders' && created;
        if (!isCheckout) requests.push(request);
        const promise = (async () => {
          const body = isCheckout ? created : await handler(request);
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

//
// An order for an item priced `value`, that charges `charged` in `currency`
// to `payee` and of which `captured` was paid (all the same for an order as
// it is created, see create-domain-billing.js)
//
function order(
  t,
  {
    status,
    referenceId = t.context.user.id,
    captureStatus,
    value = '3.00',
    charged = value,
    captured = charged,
    currency = 'USD',
    payee = 'MERCHANT-1'
  }
) {
  const id = `ORDER-${t.context.id}`;
  const unit = {
    reference_id: referenceId,
    custom_id: 'ENHANCED_PROTECTION',
    invoice_id: `REF-${id}`,
    payee: { merchant_id: payee },
    amount: { currency_code: currency, value: charged },
    items: [{ unit_amount: { currency_code: currency, value }, quantity: '1' }]
  };
  if (captureStatus)
    unit.payments = {
      captures: [
        {
          id: `CAPTURE-${id}`,
          status: captureStatus,
          amount: { currency_code: currency, value: captured },
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
// Starts a checkout as the billing page does (PayPal answers with the order
// it made), so the order is one made here for this account
//
async function checkout(t) {
  created = order(t, { status: 'CREATED' });
  const res = await t.context.web.post('/en/my-account/billing/upgrade').send({
    plan: 'enhanced_protection',
    payment_method: 'paypal',
    payment_type: 'one-time',
    payment_duration: '30d'
  });
  t.is(res.status, 200);
  t.is(res.body.orderID, created.id);
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

    await checkout(t);
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

  await checkout(t);
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

    await checkout(t);
    const res = await upgrade(t, { paypal_order_id: orderId });
    t.is(res.status, 302);
    const { payment } = await assertCredited(t, t.context.user);
    t.is(payment.paypal_transaction_id, `CAPTURE-${orderId}`);
  }
);

//
// An order can be created or changed in the browser (with the PayPal SDK the
// billing page loads): what it charges is not what its item is priced at,
// and it pays whom it names.
//
for (const [title, options, made = true] of [
  ['charges less than the price of its item', { charged: '0.01' }],
  ['charges in another currency', { currency: 'JPY' }],
  ['charges for no price of the plan', { value: '1.50' }],
  ['was changed to pay someone else', { payee: 'MERCHANT-2' }],
  ['was not made here', {}, false]
])
  test.serial(
    `a PayPal order that ${title} is refused before it is captured`,
    async (t) => {
      const orderId = `ORDER-${t.context.id}`;
      const requests = mockPayPal((request) => {
        if (request === `GET /v2/checkout/orders/${orderId}`)
          return order(t, { status: 'APPROVED', ...options });
        if (request === `POST /v2/checkout/orders/${orderId}/capture`)
          return order(t, {
            status: 'COMPLETED',
            captureStatus: 'COMPLETED',
            ...options
          });
        throw new Error(`Unexpected ${request}`);
      });

      if (made) await checkout(t);
      const res = await upgrade(t, { paypal_order_id: orderId });
      t.is(res.status, 302);
      t.deepEqual(requests, [`GET /v2/checkout/orders/${orderId}`]);
      await assertNotCredited(t, t.context.user);
    }
  );

// (an order can be changed until it is captured, so also after it was
// looked up)
for (const [title, options] of [
  ['for less than it charged', { charged: '0.01' }],
  ['to pay someone else than it was to', { payee: 'MERCHANT-2' }]
])
  test.serial(`a PayPal order captured ${title} is not credited`, async (t) => {
    const orderId = `ORDER-${t.context.id}`;
    let captured = false;
    mockPayPal((request) => {
      const paid = order(t, {
        status: 'COMPLETED',
        captureStatus: 'COMPLETED',
        ...options
      });
      if (request === `GET /v2/checkout/orders/${orderId}`)
        return captured ? paid : order(t, { status: 'APPROVED' });
      if (request === `POST /v2/checkout/orders/${orderId}/capture`) {
        captured = true;
        return paid;
      }

      throw new Error(`Unexpected ${request}`);
    });

    await checkout(t);
    const res = await upgrade(t, { paypal_order_id: orderId });
    t.is(res.status, 302);
    t.true(captured);
    await assertNotCredited(t, t.context.user);
  });

test.serial(
  'a PayPal order is credited when its capture does not name its payee',
  async (t) => {
    const orderId = `ORDER-${t.context.id}`;
    let captured = false;
    const requests = mockPayPal((request) => {
      const paid = order(t, {
        status: 'COMPLETED',
        captureStatus: 'COMPLETED'
      });
      if (request === `GET /v2/checkout/orders/${orderId}`)
        return captured ? paid : order(t, { status: 'APPROVED' });
      if (request === `POST /v2/checkout/orders/${orderId}/capture`) {
        captured = true;
        delete paid.purchase_units[0].payee;
        return paid;
      }

      throw new Error(`Unexpected ${request}`);
    });

    await checkout(t);
    const res = await upgrade(t, { paypal_order_id: orderId });
    t.is(res.status, 302);
    // (so it was looked up again)
    t.is(requests.at(-1), `GET /v2/checkout/orders/${orderId}`);
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

// (`paid` is the amount of its last payment, if it had one, `extra` what
// else PayPal says of it, `becomes` its status once it was looked up, and
// `activated` its status once we asked PayPal to make it active)
function mockSubscription(
  t,
  {
    status = 'ACTIVE',
    becomes = status,
    activated = becomes,
    customId,
    startTime = new Date(),
    paid = '3.00',
    ...extra
  } = {}
) {
  const id = `I-${t.context.id}`;
  const subscription = {
    id,
    status,
    plan_id: PAYPAL_PLAN_ID,
    ...extra,
    ...(customId ? { custom_id: customId } : {}),
    start_time: startTime.toISOString(),
    subscriber: { payer_id: 'PAYER-1', email_address: 'payer@example.com' },
    billing_info: paid
      ? {
          last_payment: {
            amount: { currency_code: 'USD', value: paid },
            time: new Date().toISOString()
          }
        }
      : {}
  };
  t.context.requests = mockPayPal((request) => {
    if (request === `GET /v1/billing/subscriptions/${id}`) {
      const now = { ...subscription };
      subscription.status = becomes;
      return now;
    }

    if (request === `POST /v1/billing/subscriptions/${id}/activate`) {
      subscription.status = activated;
      becomes = activated;
      return {};
    }

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

//
// PayPal makes a subscription active once its payer agreed to it, as the
// billing page asks it to.  One made in the browser to wait for us instead
// stays approved and never charges, while an account with a subscription
// counts as paying: so an approved one is made active (when it is this
// account's and on our terms), and only an active one is given to an account.
//
const lookUp = (id) => `GET /v1/billing/subscriptions/${id}`;
const activate = (id) => `POST /v1/billing/subscriptions/${id}/activate`;

for (const [title, options, requests] of [
  ['is not approved', { status: 'APPROVAL_PENDING' }, [lookUp]],
  // (looked up a few times, in case PayPal is not done)
  [
    'does not become active',
    { status: 'APPROVED' },
    [lookUp, activate, lookUp, lookUp, lookUp]
  ],
  // (not made active for an account it does not name, or on other terms)
  [
    'is approved for no account',
    { status: 'APPROVED', customId: '' },
    [lookUp]
  ],
  [
    'is approved on other terms',
    { status: 'APPROVED', plan_overridden: true },
    [lookUp]
  ]
])
  test.serial(`a PayPal subscription that ${title} is refused`, async (t) => {
    const id = mockSubscription(t, { customId: t.context.user.id, ...options });

    const res = await upgrade(t, { paypal_subscription_id: id });
    t.is(res.status, 302);
    t.deepEqual(
      t.context.requests,
      requests.map((request) => request(id))
    );
    await assertSubscriptionNotCredited(t, t.context.user);
  });

for (const [title, options, requests] of [
  ['is made active', { activated: 'ACTIVE' }, [lookUp, activate, lookUp]],
  // (by PayPal, a moment after it was approved)
  [
    'is active once it is looked up again',
    { becomes: 'ACTIVE' },
    [lookUp, activate, lookUp]
  ]
])
  test.serial(
    `an approved PayPal subscription that ${title} credits the plan`,
    async (t) => {
      const { user } = t.context;
      const id = mockSubscription(t, {
        status: 'APPROVED',
        customId: user.id,
        ...options
      });

      const res = await upgrade(t, { paypal_subscription_id: id });
      t.is(res.status, 302);
      t.deepEqual(
        t.context.requests.slice(0, 3),
        requests.map((request) => request(id))
      );
      const { user: fresh } = await assertCredited(t, user);
      t.is(fresh[config.userFields.paypalSubscriptionID], id);
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

//
// A subscription is created in the browser, which can ask for a later start
// (nothing is charged until then) and for other terms than its plan's (a
// lower price).  An account with a subscription counts as paying, so one
// that does either is refused before anything is changed.
//
for (const [title, options] of [
  [
    'starts later than now',
    { startTime: dayjs().add(5, 'years').toDate(), paid: null }
  ],
  ['is on other terms than its plan’s', { plan_overridden: true }],
  ['was paid less than the price of its plan', { paid: '0.01' }]
])
  test.serial(`a PayPal subscription that ${title} is refused`, async (t) => {
    const { user } = t.context;
    const id = mockSubscription(t, { customId: user.id, ...options });

    const res = await upgrade(t, { paypal_subscription_id: id });
    t.is(res.status, 302);
    await assertSubscriptionNotCredited(t, user);
  });

//
// A plan that is paid for is renewed by a subscription that starts when it
// expires (the billing page asks PayPal for that), and no later.
//
async function enableAutoRenew(t, startsAfterExpiry) {
  const { user } = t.context;
  user.plan = 'enhanced_protection';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  await Payments.create({
    user: user._id,
    amount: 300,
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: 'enhanced_protection',
    kind: 'one-time',
    invoice_at: user[config.userFields.planSetAt]
  });
  await user.save();
  const expiresAt = new Date(user[config.userFields.planExpiresAt]);
  t.true(expiresAt > new Date());

  const id = mockSubscription(t, {
    customId: user.id,
    startTime: dayjs(expiresAt).add(startsAfterExpiry, 'days').toDate(),
    paid: null
  });
  const res = await t.context.web
    .get('/en/my-account/billing/enable-auto-renew')
    .query({ plan: 'enhanced_protection', paypal_subscription_id: id });
  t.is(res.status, 302);
  const fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'enhanced_protection');
  t.is(
    new Date(fresh[config.userFields.planExpiresAt]).getTime(),
    expiresAt.getTime()
  );
  return { id, subscriptionId: fresh[config.userFields.paypalSubscriptionID] };
}

test.serial(
  'a PayPal subscription that starts when the plan expires renews it',
  async (t) => {
    const { id, subscriptionId } = await enableAutoRenew(t, 0);
    t.is(subscriptionId, id);
  }
);

test.serial(
  'a PayPal subscription that starts after the plan expires is refused',
  async (t) => {
    const { subscriptionId } = await enableAutoRenew(t, 365);
    t.falsy(subscriptionId);
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

//
// The link back from a checkout carries its id and can be opened again at
// any time. Opened again after the plan changed (here to Team, with the
// remaining time converted), it moved the plan start back to that checkout's
// payment, counted the payment again and converted the time again: each
// round about doubled the paid time.
//
async function payThenConvertThenReplay(t, pay) {
  const { user } = t.context;
  // (an earlier payment, so that switching plans converts the time instead
  // of refunding the payment)
  await Payments.create({
    user: user._id,
    amount: 300,
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: 'enhanced_protection',
    kind: 'one-time',
    invoice_at: dayjs().subtract(2, 'years').toDate()
  });

  const res = await pay();
  t.is(res.status, 302);
  // (a year of it; the test prices all map to 30 days)
  await Payments.updateMany(
    { user: user._id, method: { $ne: 'free_beta_program' } },
    { $set: { duration: ms('1y') } }
  );
  const paid = await Users.findById(user._id);
  await paid.save();
  let fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'enhanced_protection');
  t.true(
    dayjs(fresh[config.userFields.planExpiresAt]).diff(dayjs(), 'months') >= 11
  );

  const switched = await t.context.web
    .get('/en/my-account/billing/upgrade')
    .set('Sec-Fetch-Site', 'same-origin')
    .query({ plan: 'team' });
  t.is(switched.status, 302);
  fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'team');
  const expiresAt = new Date(fresh[config.userFields.planExpiresAt]).getTime();
  const payments = await Payments.countDocuments({ user: user._id });

  const replayed = await pay();
  t.is(replayed.status, 302);
  fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'team');
  t.is(new Date(fresh[config.userFields.planExpiresAt]).getTime(), expiresAt);
  t.is(await Payments.countDocuments({ user: user._id }), payments);
}

test.serial(
  'a Stripe checkout opened again after the plan changed credits nothing',
  async (t) => {
    const { user } = t.context;
    const id = mockStripe(t, user[config.userFields.stripeCustomerID]);
    stripe.checkout.sessions.listLineItems.resolves({
      data: [
        {
          price: {
            id: STRIPE_MAPPING.enhanced_protection['one-time']['1y'],
            product: 'prod_ICStJG6fjZhEjl'
          }
        }
      ]
    });
    stripe.paymentIntents.retrieve.resolves({
      id: `pi_${id}`,
      status: 'succeeded',
      created: dayjs().subtract(2, 'days').unix(),
      payment_method: 'pm_1'
    });
    await payThenConvertThenReplay(t, () =>
      upgrade(t, { session_id: id }).set('Sec-Fetch-Site', 'same-origin')
    );
  }
);

test.serial(
  'a PayPal order opened again after the plan changed credits nothing',
  async (t) => {
    const orderId = `ORDER-${t.context.id}`;
    const paid = () => {
      const body = order(t, {
        status: 'COMPLETED',
        captureStatus: 'COMPLETED',
        value: '36.00'
      });
      body.create_time = dayjs().subtract(2, 'days').toISOString();
      return body;
    };

    mockPayPal((request) => {
      if (request === `GET /v2/checkout/orders/${orderId}`) return paid();
      if (request === `POST /v2/checkout/orders/${orderId}/capture`)
        throw paypalError(422, 'ORDER_ALREADY_CAPTURED');
      throw new Error(`Unexpected ${request}`);
    });
    await checkout(t);
    await payThenConvertThenReplay(t, () =>
      upgrade(t, { paypal_order_id: orderId }).set(
        'Sec-Fetch-Site',
        'same-origin'
      )
    );
  }
);

//
// Plan changes sent together each loaded the plan as it was before, so each
// one gave the conversion credit for the remaining time.
//
test.serial('plan changes sent together convert the time once', async (t) => {
  const { user } = t.context;
  await Payments.create({
    user: user._id,
    amount: 300,
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: 'enhanced_protection',
    kind: 'one-time',
    invoice_at: dayjs().subtract(2, 'years').toDate()
  });
  const id = mockStripe(t, user[config.userFields.stripeCustomerID]);
  stripe.paymentIntents.retrieve.resolves({
    id: `pi_${id}`,
    status: 'succeeded',
    created: dayjs().subtract(2, 'days').unix(),
    payment_method: 'pm_1'
  });
  const res = await upgrade(t, { session_id: id });
  t.is(res.status, 302);
  await Payments.updateMany(
    { user: user._id, method: { $ne: 'free_beta_program' } },
    { $set: { duration: ms('1y') } }
  );
  const paid = await Users.findById(user._id);
  await paid.save();

  const responses = await Promise.all(
    Array.from({ length: 5 }, () =>
      t.context.web
        .get('/en/my-account/billing/upgrade')
        .set('Sec-Fetch-Site', 'same-origin')
        .query({ plan: 'team' })
    )
  );
  for (const res of responses) t.is(res.status, 302);

  const fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'team');
  const conversions = await Payments.find({
    user: user._id,
    method: 'plan_conversion'
  }).lean();
  t.true(conversions.length > 0);
  // (one batch: they were all created at once)
  t.is(
    new Set(conversions.map((p) => new Date(p.invoice_at).getTime())).size,
    1
  );
});
