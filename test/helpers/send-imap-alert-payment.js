/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The IMAP ALERT "Your account payment is past due" is only for a domain
// whose admins have all stopped paying: not while a renewal is still being
// processed for an active subscription, nor when another admin pays.
//

const test = require('ava');
const dayjs = require('dayjs-with-plugins');
const Redis = require('ioredis-mock');

const utils = require('../utils');

const config = require('#config');
const { checkPaymentAlert } = require('#helpers/imap/send-imap-alert');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

function admin(fields) {
  return {
    group: 'admin',
    user: {
      plan: 'enhanced_protection',
      [config.userFields.planExpiresAt]: dayjs().subtract(2, 'hour').toDate(),
      ...fields
    }
  };
}

async function alert(members, plan = 'enhanced_protection') {
  const client = new Redis();
  await client.flushall();
  return checkPaymentAlert(
    client,
    { plan, members },
    `alias-${Math.random()}`,
    'en'
  );
}

test('alerts when the only admin is past due', async (t) => {
  const message = await alert([admin({})]);
  t.regex(message, /past due/);
  t.regex(message, /\/my-account\/billing/);
});

test('does not alert while an active Stripe subscription renews', async (t) => {
  t.is(
    await alert([admin({ [config.userFields.stripeSubscriptionID]: 'sub_1' })]),
    null
  );
});

test('does not alert while an active PayPal subscription renews', async (t) => {
  t.is(
    await alert([
      admin({ [config.userFields.paypalSubscriptionID]: 'I-ABC123' })
    ]),
    null
  );
});

test('does not alert when another admin is paid up', async (t) => {
  t.is(
    await alert([
      admin({}),
      admin({
        [config.userFields.planExpiresAt]: dayjs().add(30, 'day').toDate()
      })
    ]),
    null
  );
});

test('an admin on a lower plan does not keep a Team domain in good standing', async (t) => {
  const message = await alert(
    [
      admin({ plan: 'team' }),
      admin({
        [config.userFields.planExpiresAt]: dayjs().add(30, 'day').toDate()
      })
    ],
    'team'
  );
  t.regex(message, /past due/);
});
