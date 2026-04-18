/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const pMapSeries = require('p-map-series');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Payments } = require('#models');
const { paypalAgent } = require('#helpers/paypal');
const config = require('#config');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

//
// RACE CONDITION FIX (batch job): This job corrects planSetAt for users
// whose planSetAt is after their earliest payment's invoice_at.
//
// It handles BOTH subscription users (original behavior, using PayPal API)
// AND one-time payment users (new behavior, using database only).
//
// Safety: invoice_at < planSetAt only triggers for first-time plan setup
// scenarios. For existing users making subsequent payments, new payments
// always have invoice_at after planSetAt.
//

async function subscriptionMapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');
  // if the user plan set at is AFTER their subscription start date
  // then correct the user's plan set at to be equal to the subscription start date
  const agent = await paypalAgent();
  const { body } = await agent.get(
    `/v1/billing/subscriptions/${user[config.userFields.paypalSubscriptionID]}`
  );
  if (!body.create_time) throw new Error('create time missing');
  if (
    new Date(user[config.userFields.planSetAt]).getTime() >
    new Date(body.create_time).getTime()
  ) {
    logger.info(
      'user plan set at needs corrected (subscription)',
      user.email,
      'it was off by',
      dayjs(user[config.userFields.planSetAt]).diff(
        new Date(body.create_time),
        'minutes'
      ),
      'minutes'
    );
    user[config.userFields.planSetAt] = new Date(body.create_time);
    await user.save();
  }
}

async function oneTimeMapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');

  // find the earliest payment for this user's current plan
  const earliestPayment = await Payments.findOne(
    {
      user: user._id,
      plan: user.plan
    },
    null,
    { sort: { invoice_at: 1 } }
  );

  if (!earliestPayment) return;

  if (
    new Date(user[config.userFields.planSetAt]).getTime() >
    new Date(earliestPayment.invoice_at).getTime()
  ) {
    logger.info(
      'user plan set at needs corrected (one-time)',
      user.email,
      'it was off by',
      dayjs(user[config.userFields.planSetAt]).diff(
        new Date(earliestPayment.invoice_at),
        'minutes'
      ),
      'minutes'
    );
    user[config.userFields.planSetAt] = new Date(earliestPayment.invoice_at);
    await user.save();
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    // Phase 1: Fix subscription users (original behavior)
    const subscriptionIds = await Users.distinct('_id', {
      [config.userFields.paypalSubscriptionID]: {
        $exists: true
      }
    });

    logger.info(`Processing ${subscriptionIds.length} subscription users`);
    // run serially to prevent API rate limiting
    await pMapSeries(subscriptionIds, subscriptionMapper);

    // Phase 2: Fix one-time payment users (no subscription, but have payments)
    const oneTimeIds = await Users.distinct('_id', {
      plan: { $ne: 'free' },
      [config.userFields.planSetAt]: { $exists: true },
      [config.userFields.paypalSubscriptionID]: {
        $exists: false
      },
      [config.userFields.stripeSubscriptionID]: {
        $exists: false
      }
    });

    logger.info(`Processing ${oneTimeIds.length} one-time payment users`);
    await pMapSeries(oneTimeIds, oneTimeMapper);
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
