/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The PayPal subscription sync gives an account the subscriptions PayPal
// lists for its payer, and the plan of an active one.  A subscription is
// made in the browser, which can ask for a later start (nothing is charged
// until then) and for other terms than its plan's, and an account with a
// subscription counts as paying: so the sync only gives an account a
// subscription that is the one we offer, and only changes its plan once the
// subscription was paid for.  PayPal is answered locally.
//

const { randomUUID } = require('node:crypto');

const ms = require('ms');
const sinon = require('sinon');
const superagent = require('superagent');
const test = require('ava');

// (the emails are recorded instead of sent; first, so that the job loaded
// below gets this)
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

const syncPayPalSubscriptionPayments = require('../../jobs/paypal/sync-paypal-subscription-payments');
const config = require('#config');
const { paypal } = require('#helpers/paypal');
const { Payments, Users } = require('#models');

const { PAYPAL_PLAN_MAPPING } = config.payments;
const PAYPAL_PLAN_ID = 'P-TEST-SYNC-ENHANCED-30D';
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
test.beforeEach(async () => {
  await Users.deleteMany({});
  sent.length = 0;
});
test.afterEach.always(() => {
  sinon.restore();
});

//
// A free account whose PayPal payer has the subscription PayPal lists, with
// `changes` to it (`listed`: as the list has it, when that differs from
// looking it up) and the payments (`paid`, in US dollars) made for it
//
async function sync(t, changes = {}, paid = [], listed = {}) {
  const payerId = `PAYER-${randomUUID()}`;
  const user = await t.context.userFactory
    .withState({ [config.userFields.paypalPayerID]: payerId })
    .create();
  const id = `I-${user.id}`;
  const subscription = {
    id,
    status: 'ACTIVE',
    plan_id: PAYPAL_PLAN_ID,
    create_time: new Date().toISOString(),
    start_time: new Date().toISOString(),
    subscriber: { payer_id: payerId, email_address: 'payer@example.com' },
    ...changes
  };

  sinon
    .stub(paypal, 'generateToken')
    .callsFake((...args) => args.at(-1)(null, 'Bearer test'));
  sinon.stub(superagent, 'agent').callsFake(() => {
    const agent = {};
    for (const fn of ['use', 'set', 'timeout', 'retry'])
      agent[fn] = () => agent;
    for (const method of ['get', 'post']) {
      agent[method] = (url) => {
        const promise = (async () => {
          if (method === 'get' && url.startsWith('/v1/billing/subscriptions?'))
            return {
              body: { subscriptions: [{ ...subscription, ...listed }] }
            };
          if (method === 'get' && url === `/v1/billing/subscriptions/${id}`)
            return { body: subscription };
          if (
            method === 'get' &&
            url.startsWith(`/v1/billing/subscriptions/${id}/transactions?`)
          )
            return {
              body: {
                transactions: paid.map((value, i) => ({
                  id: `TX-${i}-${id}`,
                  status: 'COMPLETED',
                  time: new Date().toISOString(),
                  amount_with_breakdown: {
                    gross_amount: { currency_code: 'USD', value }
                  }
                }))
              }
            };
          throw new Error(`Unexpected ${method} ${url}`);
        })();
        promise.set = () => promise;
        promise.send = () => promise;
        return promise;
      };
    }

    return agent;
  });

  await syncPayPalSubscriptionPayments();

  return {
    id,
    user: await Users.findById(user._id).lean().exec(),
    payments: await Payments.countDocuments({ user: user._id })
  };
}

// the subscriptions the admins are told were given to no account
function unmatched() {
  return sent
    .filter((options) => options.message?.subject?.includes('could not be'))
    .map((options) => options.locals.message)
    .join('');
}

for (const [title, changes] of [
  [
    'starts later than now',
    { start_time: new Date(Date.now() + ms('1y')).toISOString() }
  ],
  ['is on other terms than its plan’s', { plan_overridden: true }]
])
  test.serial(
    `a subscription that ${title} is not given to an account`,
    async (t) => {
      const { id, user, payments } = await sync(t, changes);
      t.is(user.plan, 'free');
      t.falsy(user[config.userFields.paypalSubscriptionID]);
      t.is(payments, 0);
      t.true(unmatched().includes(id));
    }
  );

// (as it is when looked up: the list may not say)
test.serial(
  'a subscription listed without its terms is not given to an account on other terms',
  async (t) => {
    const { id, user } = await sync(t, { plan_overridden: true }, ['3.00'], {
      plan_overridden: undefined
    });
    t.is(user.plan, 'free');
    t.falsy(user[config.userFields.paypalSubscriptionID]);
    t.true(unmatched().includes(id));
  }
);

test.serial(
  'a subscription listed as active that is not when looked up is not given to an account',
  async (t) => {
    const { id, user } = await sync(t, { status: 'APPROVED' }, [], {
      status: 'ACTIVE'
    });
    t.is(user.plan, 'free');
    t.falsy(user[config.userFields.paypalSubscriptionID]);
    t.true(unmatched().includes(id));
  }
);

//
// A subscription is made in the browser, with any subscriber's address, and
// is not active before its payer agreed to it (nor ever, if it was made to
// wait for us): one that is not active is not given to an account, and is
// nothing to report.
//
for (const status of ['APPROVAL_PENDING', 'APPROVED'])
  test.serial(
    `a subscription that is ${status} is not given to an account`,
    async (t) => {
      const { user, payments } = await sync(t, { status });
      t.is(user.plan, 'free');
      t.falsy(user[config.userFields.paypalSubscriptionID]);
      t.is(payments, 0);
      t.is(unmatched(), '');
    }
  );

test.serial(
  'an active subscription that was not paid for does not change the plan',
  async (t) => {
    const { user, payments } = await sync(t);
    t.is(user.plan, 'free');
    t.is(payments, 0);
  }
);

test.serial(
  'an active subscription that was paid for changes the plan',
  async (t) => {
    const { id, user, payments } = await sync(t, {}, ['3.00']);
    t.is(user.plan, 'enhanced_protection');
    t.is(user[config.userFields.paypalSubscriptionID], id);
    t.is(payments, 1);
    t.true(new Date(user[config.userFields.planExpiresAt]) > new Date());
    t.is(unmatched(), '');
  }
);
