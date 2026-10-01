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

function order(user, id, { status, captureStatus }) {
  const unit = {
    reference_id: user.id,
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

test.serial(
  'an approved order whose capture is declined is not credited',
  async (t) => {
    const user = await t.context.userFactory.create();
    const id = `ORDER-${user.id}`;
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

test.serial('a paid order is credited', async (t) => {
  const user = await t.context.userFactory.create();
  const id = `ORDER-${user.id}`;
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
    const id = `ORDER-${user.id}`;
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
