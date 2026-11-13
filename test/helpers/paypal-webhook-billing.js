/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The PayPal webhook credits a one-time order only once it was paid (a
// declined capture leaves the order APPROVED), and assigns a subscription
// to the account it was created for (its `custom_id`) rather than to
// whichever account has the PayPal email address. PayPal is answered
// locally.
//

const { randomUUID } = require('node:crypto');

const Boom = require('@hapi/boom');
const Redis = require('ioredis-mock');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const sinon = require('sinon');
const superagent = require('superagent');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const webhook = require('#controllers/api/v1/paypal');
const { issuePayPalOrder } = require('#helpers/get-paypal-order-capture');
const { paypal } = require('#helpers/paypal');
const { Payments, Users } = require('#models');

const { PAYPAL_PLAN_MAPPING } = config.payments;
const PAYPAL_PLAN_ID = 'P-TEST-WEBHOOK-ENHANCED-30D';
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
test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
  // PayPal's signature verification, answered locally
  sinon
    .stub(paypal.notification.webhookEvent, 'verify')
    .callsFake((headers, body, webhookId, fn) =>
      fn(null, { verification_status: 'SUCCESS' })
    );
});
test.afterEach.always((t) => {
  sinon.restore();
  t.context.client.disconnect();
});

//
// PayPal's REST API, answered by `handler(request)` with `request` being
// e.g. "GET /v2/checkout/orders/ID" (it returns the response body, or
// throws the error of a failed request)
//
function mockPayPal(handler) {
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
}

function paypalError(status, name) {
  const err = new Error(name);
  err.status = status;
  err.response = { body: { name, details: [{ issue: name }] } };
  return err;
}

// deliver an event and collect what processing it logged
// (`extra` is merged into the context, e.g. `isProcessed` to skip the
// five minute wait for the checkout redirect)
function deliver(t, body, extra = {}) {
  const logs = { fatal: [], warn: [], info: [] };
  const ctx = {
    client: t.context.client,
    request: {
      headers: {},
      body: { id: `WH-${randomUUID()}`, ...body }
    },
    logger: {
      fatal(err) {
        logs.fatal.push(err);
      },
      error() {},
      warn(message) {
        logs.warn.push(message);
      },
      info(message) {
        logs.info.push(message);
      },
      debug() {}
    },
    translateError: (key) => Boom.badRequest(key),
    ...extra
  };
  return { ctx, logs, promise: webhook(ctx) };
}

// (an order for an item priced 3 US dollars, that charges `charged` to
// `payee`)
function order(
  user,
  id,
  { status, captureStatus, charged = '3.00', payee = 'MERCHANT-1' }
) {
  const unit = {
    reference_id: user.id,
    custom_id: 'ENHANCED_PROTECTION',
    invoice_id: `REF-${id}`,
    payee: { merchant_id: payee },
    amount: { currency_code: 'USD', value: charged },
    items: [
      { unit_amount: { currency_code: 'USD', value: '3.00' }, quantity: '1' }
    ]
  };
  if (captureStatus)
    unit.payments = {
      captures: [
        {
          id: `CAPTURE-${id}`,
          status: captureStatus,
          amount: { currency_code: 'USD', value: charged },
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

// an order as the billing page's checkout makes it for an account (see
// create-domain-billing)
async function makeOrder(t, user, madeFor = user) {
  const id = `ORDER-${user.id}`;
  await issuePayPalOrder(
    t.context.client,
    order(user, id, { status: 'CREATED' }),
    madeFor.id
  );
  return id;
}

test.serial(
  'an approved order whose capture is declined is not credited',
  async (t) => {
    const user = await t.context.userFactory.create();
    const id = await makeOrder(t, user);
    mockPayPal((request) => {
      if (request === `GET /v2/checkout/orders/${id}`)
        return order(user, id, { status: 'APPROVED' });
      if (request === `POST /v2/checkout/orders/${id}/capture`)
        throw paypalError(422, 'INSTRUMENT_DECLINED');
      throw new Error(`Unexpected ${request}`);
    });

    const { logs, promise } = deliver(t, {
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource: { id }
    });
    await promise;
    await pWaitFor(
      () =>
        logs.fatal.length > 0 ||
        logs.warn.includes('paypal order was not captured') ||
        logs.info.includes('paypal payment created'),
      { timeout: ms('10s') }
    );

    t.deepEqual(logs.fatal, []);
    const fresh = await Users.findById(user._id).lean().exec();
    t.is(fresh.plan, 'free');
    t.is(await Payments.countDocuments({ user: user._id }), 0);
  }
);

// (an order can be changed until it is captured, so also after it was
// looked up)
test.serial(
  'an order captured to pay someone else than it was to is not credited',
  async (t) => {
    const user = await t.context.userFactory.create();
    const id = await makeOrder(t, user);
    let captured = false;
    mockPayPal((request) => {
      const paid = order(user, id, {
        status: 'COMPLETED',
        captureStatus: 'COMPLETED',
        payee: 'MERCHANT-2'
      });
      if (request === `GET /v2/checkout/orders/${id}`)
        return captured ? paid : order(user, id, { status: 'APPROVED' });
      if (request === `POST /v2/checkout/orders/${id}/capture`) {
        captured = true;
        return paid;
      }

      throw new Error(`Unexpected ${request}`);
    });

    const { logs, promise } = deliver(t, {
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource: { id }
    });
    await promise;
    await pWaitFor(
      () =>
        logs.fatal.length > 0 ||
        logs.warn.includes('paypal order was not captured') ||
        logs.info.includes('paypal payment created'),
      { timeout: ms('10s') }
    );

    t.true(captured);
    t.deepEqual(logs.fatal, []);
    const fresh = await Users.findById(user._id).lean().exec();
    t.is(fresh.plan, 'free');
    t.is(await Payments.countDocuments({ user: user._id }), 0);
  }
);

//
// An order can be created or changed in the browser (with the PayPal SDK the
// billing page loads): what it charges is not what its item is priced at,
// and it pays whom it names.
//
for (const [title, options, made = 'for the account'] of [
  ['charges less than the price of its item', { charged: '0.01' }],
  ['was changed to pay someone else', { payee: 'MERCHANT-2' }],
  ['was not made here', {}, 'elsewhere'],
  ['was made for another account', {}, 'for another account']
])
  test.serial(`an order that ${title} is not captured`, async (t) => {
    const user = await t.context.userFactory.create();
    const id =
      made === 'elsewhere'
        ? `ORDER-${user.id}`
        : await makeOrder(
            t,
            user,
            made === 'for the account'
              ? user
              : await t.context.userFactory.create()
          );
    const requests = [];
    mockPayPal((request) => {
      requests.push(request);
      if (request === `GET /v2/checkout/orders/${id}`)
        return order(user, id, { status: 'APPROVED', ...options });
      if (request === `POST /v2/checkout/orders/${id}/capture`)
        return order(user, id, {
          status: 'COMPLETED',
          captureStatus: 'COMPLETED',
          ...options
        });
      throw new Error(`Unexpected ${request}`);
    });

    const { logs, promise } = deliver(t, {
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource: { id }
    });
    await promise;
    await pWaitFor(
      () =>
        logs.fatal.length > 0 || logs.info.includes('paypal payment created'),
      { timeout: ms('10s') }
    );

    t.deepEqual(requests, [`GET /v2/checkout/orders/${id}`]);
    const fresh = await Users.findById(user._id).lean().exec();
    t.is(fresh.plan, 'free');
    t.is(await Payments.countDocuments({ user: user._id }), 0);
  });

//
// A subscription is created in the browser, which can override the price of
// its plan: its payments are credited at the plan's price or more.
//
for (const [title, value, credited, status = 'COMPLETED'] of [
  ['of less than the price of its plan is not credited', '0.01', 0],
  ['of the price of its plan is credited', '3.00', 1],
  ['that was declined is not credited', '3.00', 0, 'DECLINED']
])
  test.serial(`a subscription payment ${title}`, async (t) => {
    const user = await t.context.userFactory.create();
    const id = `I-${user.id}`;
    const subscription = {
      id,
      status: 'ACTIVE',
      plan_id: PAYPAL_PLAN_ID,
      custom_id: user.id,
      create_time: new Date().toISOString(),
      start_time: new Date().toISOString(),
      subscriber: { payer_id: 'PAYER-1', email_address: 'payer@example.com' }
    };
    mockPayPal((request) => {
      if (request === `GET /v1/billing/subscriptions/${id}`)
        return subscription;
      // (the list of all subscriptions)
      if (request.startsWith('GET /v1/billing/subscriptions?')) return {};
      if (
        request.startsWith(`GET /v1/billing/subscriptions/${id}/transactions?`)
      )
        return {
          transactions: [
            {
              id: `TX-${id}`,
              status,
              time: new Date().toISOString(),
              amount_with_breakdown: {
                gross_amount: { currency_code: 'USD', value }
              }
            }
          ]
        };
      throw new Error(`Unexpected ${request}`);
    });

    const { logs, promise } = deliver(t, {
      event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
      resource: { id }
    });
    await promise;
    // (processing ends with the plan of the subscription saved, or with the
    // error of a subscription that has no payment)
    await pWaitFor(
      async () =>
        logs.fatal.length > 0 ||
        Boolean(
          await Users.exists({ _id: user._id, plan: 'enhanced_protection' })
        ),
      { timeout: ms('20s') }
    );

    t.is(logs.fatal.length, credited ? 0 : 1);
    const fresh = await Users.findById(user._id).lean().exec();
    t.is(fresh[config.userFields.paypalSubscriptionID], id);
    t.is(await Payments.countDocuments({ user: user._id }), credited);
    t.is(fresh.plan, credited ? 'enhanced_protection' : 'free');
    t.is(
      new Date(fresh[config.userFields.planExpiresAt]) > new Date(),
      Boolean(credited)
    );
  });

test.serial('a paid order is credited', async (t) => {
  const user = await t.context.userFactory.create();
  const id = await makeOrder(t, user);
  mockPayPal((request) => {
    if (request === `GET /v2/checkout/orders/${id}`)
      return order(user, id, { status: 'APPROVED' });
    if (request === `POST /v2/checkout/orders/${id}/capture`)
      return order(user, id, {
        status: 'COMPLETED',
        captureStatus: 'COMPLETED'
      });
    throw new Error(`Unexpected ${request}`);
  });

  const { logs, promise } = deliver(t, {
    event_type: 'CHECKOUT.ORDER.APPROVED',
    resource: { id }
  });
  await promise;
  await pWaitFor(
    () => logs.fatal.length > 0 || logs.info.includes('paypal payment created'),
    { timeout: ms('10s') }
  );

  t.deepEqual(logs.fatal, []);
  const fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.plan, 'enhanced_protection');
  const payments = await Payments.find({ user: user._id }).lean().exec();
  t.is(payments.length, 1);
  t.is(payments[0].paypal_order_id, id);
  t.is(payments[0].paypal_transaction_id, `CAPTURE-${id}`);
});

test.serial(
  'a subscription is assigned to the account it was created for',
  async (t) => {
    const user = await t.context.userFactory.create();
    // an account whose email is the PayPal email of the subscriber
    const other = await t.context.userFactory.create();
    const id = `I-${user.id}`;
    const subscription = {
      id,
      status: 'ACTIVE',
      plan_id: PAYPAL_PLAN_ID,
      custom_id: user.id,
      start_time: new Date().toISOString(),
      subscriber: { payer_id: 'PAYER-1', email_address: other.email }
    };
    mockPayPal((request) => {
      if (request === `GET /v1/billing/subscriptions/${id}`)
        return subscription;
      throw new Error(`Unexpected ${request}`);
    });

    const { logs, promise } = deliver(t, {
      event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
      resource: { id }
    });
    await promise;
    // (processing ends when the subscription's payments are synced, which
    // fails here since PayPal only answers for the subscription)
    await pWaitFor(() => logs.fatal.length > 0, { timeout: ms('20s') });

    const [fresh, freshOther] = await Promise.all([
      Users.findById(user._id).lean().exec(),
      Users.findById(other._id).lean().exec()
    ]);
    t.is(fresh[config.userFields.paypalSubscriptionID], id);
    t.is(fresh[config.userFields.paypalPayerID], 'PAYER-1');
    t.falsy(freshOther[config.userFields.paypalSubscriptionID]);
    t.falsy(freshOther[config.userFields.paypalPayerID]);
  }
);

test.serial(
  'an order whose capture is pending is credited (the payer was charged)',
  async (t) => {
    const user = await t.context.userFactory.create();
    const id = await makeOrder(t, user);
    mockPayPal((request) => {
      if (request === `GET /v2/checkout/orders/${id}`)
        return order(user, id, { status: 'APPROVED' });
      if (request === `POST /v2/checkout/orders/${id}/capture`)
        return order(user, id, {
          status: 'COMPLETED',
          captureStatus: 'PENDING'
        });
      throw new Error(`Unexpected ${request}`);
    });

    const { logs, promise } = deliver(t, {
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource: { id }
    });
    await promise;
    await pWaitFor(
      () =>
        logs.fatal.length > 0 ||
        logs.warn.includes('paypal order was not captured') ||
        logs.info.includes('paypal payment created'),
      { timeout: ms('10s') }
    );

    t.deepEqual(logs.fatal, []);
    const fresh = await Users.findById(user._id).lean().exec();
    t.is(fresh.plan, 'enhanced_protection');
    t.is(await Payments.countDocuments({ user: user._id }), 1);
  }
);

test.serial(
  "a subscription created with another account's id does not replace that account's subscription",
  async (t) => {
    // the victim already has a subscription
    const user = await t.context.userFactory
      .withState({
        [config.userFields.paypalSubscriptionID]: 'I-EXISTING',
        [config.userFields.paypalPayerID]: 'PAYER-VICTIM'
      })
      .create();
    // someone else's subscription, created with the victim's id
    const id = `I-OTHER-${user.id}`;
    const subscription = {
      id,
      status: 'ACTIVE',
      plan_id: PAYPAL_PLAN_ID,
      custom_id: user.id,
      start_time: new Date().toISOString(),
      subscriber: {
        payer_id: 'PAYER-ATTACKER',
        email_address: 'attacker@example.com'
      }
    };
    const requests = [];
    mockPayPal((request) => {
      requests.push(request);
      if (request === `GET /v1/billing/subscriptions/${id}`)
        return subscription;
      if (request.endsWith('/cancel')) return {};
      throw new Error(`Unexpected ${request}`);
    });

    const { promise } = deliver(
      t,
      {
        event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
        resource: { id }
      },
      { isProcessed: true }
    );
    await promise;
    // the unassigned subscription is cancelled
    await pWaitFor(
      () => requests.includes(`POST /v1/billing/subscriptions/${id}/cancel`),
      { timeout: ms('20s') }
    );

    const fresh = await Users.findById(user._id).lean().exec();
    t.is(fresh[config.userFields.paypalSubscriptionID], 'I-EXISTING');
    t.is(fresh[config.userFields.paypalPayerID], 'PAYER-VICTIM');
    t.false(
      requests.includes('POST /v1/billing/subscriptions/I-EXISTING/cancel')
    );
  }
);

//
// A subscription is made in the browser, which can ask for a later start
// (nothing is charged until then) and for other terms than its plan's.  An
// account with a subscription counts as paying, so such a subscription is
// not assigned to the account it names, and is cancelled like one that
// names none.
//
for (const [title, changes] of [
  [
    'starts later than now',
    { start_time: new Date(Date.now() + ms('1y')).toISOString() }
  ],
  ['is on other terms than its plan’s', { plan_overridden: true }]
])
  test.serial(`a subscription that ${title} is not assigned`, async (t) => {
    const user = await t.context.userFactory.create();
    const id = `I-${user.id}`;
    const subscription = {
      id,
      status: 'ACTIVE',
      plan_id: PAYPAL_PLAN_ID,
      custom_id: user.id,
      start_time: new Date().toISOString(),
      subscriber: { payer_id: 'PAYER-1', email_address: 'payer@example.com' },
      ...changes
    };
    const requests = [];
    mockPayPal((request) => {
      requests.push(request);
      if (request === `GET /v1/billing/subscriptions/${id}`)
        return subscription;
      if (request.endsWith('/cancel')) return {};
      throw new Error(`Unexpected ${request}`);
    });

    const { promise } = deliver(
      t,
      { event_type: 'BILLING.SUBSCRIPTION.ACTIVATED', resource: { id } },
      { isProcessed: true }
    );
    await promise;
    await pWaitFor(
      () => requests.includes(`POST /v1/billing/subscriptions/${id}/cancel`),
      { timeout: ms('20s') }
    );

    const fresh = await Users.findById(user._id).lean().exec();
    t.falsy(fresh[config.userFields.paypalSubscriptionID]);
    t.is(fresh.plan, 'free');
  });
