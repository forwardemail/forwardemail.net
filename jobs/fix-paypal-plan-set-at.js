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
const config = require('#config');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

//
// RACE CONDITION FIX (batch job): This job corrects planSetAt for users
// whose planSetAt is after their earliest payment's invoice_at for their
// CURRENT plan.
//
// It uses the database (Payments collection) as the source of truth
// instead of the PayPal API, because:
// - The PayPal subscription create_time may be for an OLD plan if the
//   user changed plans (e.g. Enhanced Protection -> Team)
// - The Payments collection has a `plan` field that lets us filter
//   for only payments matching the user's current plan
//
// Safety: invoice_at < planSetAt only triggers for first-time plan setup
// scenarios. For existing users making subsequent payments, new payments
// always have invoice_at after planSetAt.
//
// Two guards prevent false positives:
//
// 1. Method filter: excludes free_beta_program and plan_conversion payments
//    because these represent intentional plan resets/grants where planSetAt
//    is deliberately set to the grant date (e.g. a user who paid via Stripe
//    then later received a plan conversion would have planSetAt wrongly
//    reset to the original Stripe payment date without this filter).
//
// 2. Time threshold (MAX_DRIFT_MS = 1 week): even after filtering methods,
//    users who originally paid years ago and later received free beta credits
//    that reset their planSetAt still have old real payments in the database.
//    The race condition only produces drifts of milliseconds to days (user
//    closes browser after checkout, returns later). Drifts of months/years
//    are never race conditions.
//

// Maximum allowed difference (1 week in milliseconds)
const MAX_DRIFT_MS = 7 * 24 * 60 * 60 * 1000;

async function mapper(id) {
  try {
    const user = await Users.findById(id);
    if (!user) throw new Error('User does not exist');

    // find the earliest REAL payment for this user's CURRENT plan
    // (exclude free_beta_program and plan_conversion since those are
    // intentional plan resets, not checkout payments that race with webhooks)
    const earliestPayment = await Payments.findOne(
      {
        user: user._id,
        plan: user.plan,
        method: { $nin: ['free_beta_program', 'plan_conversion'] }
      },
      null,
      { sort: { invoice_at: 1 } }
    );

    if (!earliestPayment) return;
    const planSetAtMs = new Date(user[config.userFields.planSetAt]).getTime();
    const invoiceAtMs = new Date(earliestPayment.invoice_at).getTime();
    const driftMs = planSetAtMs - invoiceAtMs;
    // Only correct if planSetAt is after invoice_at AND within the
    // 1-week threshold (race condition window). Larger differences
    // indicate intentional plan resets via free beta credits, not
    // race conditions.
    if (driftMs > 0 && driftMs <= MAX_DRIFT_MS) {
      logger.info(
        'user plan set at needs corrected',
        user.email,
        `plan=${user.plan}`,
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
  } catch (err) {
    logger.error(err, { user: id });
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    const ids = await Users.distinct('_id', {
      plan: { $ne: 'free' },
      [config.userFields.planSetAt]: { $exists: true }
    });

    logger.info(`Processing ${ids.length} paid users`);
    await pMapSeries(ids, mapper);
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
