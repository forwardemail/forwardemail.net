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

const emailHelper = require('#helpers/email');
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
// DRY_RUN mode:
//   Set `DRY_RUN=true` (or `DRY_RUN=1`) to run the full scan without
//   calling user.save() or sending emails. The job will output to console
//   what it would have done, including the rendered email body.
//
//   Usage:  DRY_RUN=true NODE_ENV=production node jobs/fix-paypal-plan-set-at.js
//

const isDryRun = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';

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
// Six guards prevent false positives:
//
// 1. Method filter: excludes free_beta_program and plan_conversion payments
//    because these represent intentional plan resets/grants where planSetAt
//    is deliberately set to the grant date (e.g. a user who paid via Stripe
//    then later received a plan conversion would have planSetAt wrongly
//    reset to the original Stripe payment date without this filter).
//
// 2. Refund exclusion: excludes fully refunded payments (amount_refunded > 0
//    and is_refund_credit_allowed is not true). This mirrors the User model
//    pre-save hook logic — refunded payments do not contribute to
//    planExpiresAt, so they must not be used to determine the earliest
//    payment date either.
//
// 3. Time threshold (MAX_DRIFT_MS = 1 week): even after filtering methods
//    and refunds, users who originally paid years ago and later received
//    free beta credits that reset their planSetAt still have old real
//    payments in the database. The race condition only produces drifts of
//    milliseconds to days (user closes browser after checkout, returns
//    later). Drifts of months/years are never race conditions.
//
// 4. Intentional reset detection: if a free_beta_program, plan_conversion,
//    or different-plan payment exists between the earliest real payment and
//    the current planSetAt, then planSetAt was deliberately reset by a
//    grant or plan change — not by a race condition. Examples:
//    - User bought EP, upgraded to Team, downgraded back to EP
//    - User paid, then received a free beta grant that reset planSetAt
//
// 5. Duplicate payment detection: if more than one real payment exists in
//    the drift window (between earliest payment and planSetAt), this
//    indicates the user made duplicate payments (e.g. retried checkout
//    multiple times), not a race condition. The race condition only
//    affects a single payment.
//
// 6. Duplicate duration already counted: if a payment with the same
//    duration as the excluded earliest payment already exists at or after
//    planSetAt (and is being counted toward planExpiresAt), then the
//    excluded payment is a duplicate — either the user retried checkout
//    and a second payment succeeded, or a free credit was issued to
//    compensate. Moving planSetAt would double-count the duration.
//

// Maximum allowed difference (1 week in milliseconds)
const MAX_DRIFT_MS = 7 * 24 * 60 * 60 * 1000;

async function mapper(id) {
  try {
    const user = await Users.findById(id);
    if (!user) throw new Error('User does not exist');

    // find the earliest REAL payment for this user's CURRENT plan
    // (exclude free_beta_program and plan_conversion since those are
    // intentional plan resets, not checkout payments that race with webhooks;
    // also exclude fully refunded payments since the User model pre-save
    // hook skips them when computing planExpiresAt)
    const earliestPayment = await Payments.findOne(
      {
        user: user._id,
        plan: user.plan,
        method: { $nin: ['free_beta_program', 'plan_conversion'] },
        $or: [
          { amount_refunded: { $exists: false } },
          { amount_refunded: 0 },
          { is_refund_credit_allowed: true }
        ]
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
    if (driftMs <= 0 || driftMs > MAX_DRIFT_MS) return;

    // Guard 4: skip if planSetAt was intentionally reset between the
    // earliest real payment and the current planSetAt (plan change,
    // free beta grant, or plan conversion in that window)
    const intentionalReset = await Payments.findOne({
      user: user._id,
      invoice_at: {
        $gt: new Date(earliestPayment.invoice_at),
        $lte: new Date(user[config.userFields.planSetAt])
      },
      $or: [
        { method: { $in: ['free_beta_program', 'plan_conversion'] } },
        { plan: { $ne: user.plan } }
      ]
    });

    if (intentionalReset) return;

    // Guard 5: skip if multiple real payments exist in the drift window
    // (indicates duplicate payments from repeated checkout attempts,
    // not a single race condition event)
    const paymentsInDriftWindow = await Payments.countDocuments({
      user: user._id,
      plan: user.plan,
      method: { $nin: ['free_beta_program', 'plan_conversion'] },
      $or: [
        { amount_refunded: { $exists: false } },
        { amount_refunded: 0 },
        { is_refund_credit_allowed: true }
      ],
      invoice_at: {
        $gte: new Date(earliestPayment.invoice_at),
        $lt: new Date(user[config.userFields.planSetAt])
      }
    });

    if (paymentsInDriftWindow > 1) return;

    // Guard 6: skip if a payment with the same duration as the excluded
    // earliest payment already exists at or after planSetAt (meaning
    // the excluded payment is a duplicate whose duration is already
    // being counted toward planExpiresAt)
    const duplicateDurationCounted = await Payments.findOne({
      user: user._id,
      plan: user.plan,
      duration: earliestPayment.duration,
      invoice_at: { $gte: new Date(user[config.userFields.planSetAt]) },
      $or: [
        { amount_refunded: { $exists: false } },
        { amount_refunded: 0 },
        { is_refund_credit_allowed: true },
        { method: { $in: ['free_beta_program', 'plan_conversion'] } }
      ]
    });

    if (duplicateDurationCounted) return;

    {
      const driftMinutes = dayjs(user[config.userFields.planSetAt]).diff(
        new Date(earliestPayment.invoice_at),
        'minutes'
      );

      const oldPlanSetAt = new Date(user[config.userFields.planSetAt]);
      const newPlanSetAt = new Date(earliestPayment.invoice_at);

      // Compute the old planExpiresAt (before correction) by simulating
      // the same logic as the User model pre-save hook
      const paymentsForPlan = await Payments.find({
        user: user._id,
        invoice_at: { $gte: oldPlanSetAt },
        plan: user.plan
      })
        .sort('invoice_at')
        .lean()
        .exec();

      let oldExpiresAt = new Date(oldPlanSetAt);
      for (const payment of paymentsForPlan) {
        if (
          !payment.is_refund_credit_allowed &&
          payment.amount_refunded > 0 &&
          !['free_beta_program', 'plan_conversion'].includes(payment.method)
        ) {
          continue;
        }

        if (config.durationMapping[payment.duration.toString()]) {
          oldExpiresAt = dayjs(oldExpiresAt)
            .add(...config.durationMapping[payment.duration.toString()])
            .toDate();
        }
      }

      // Compute the new planExpiresAt (after correction)
      const paymentsAfterCorrection = await Payments.find({
        user: user._id,
        invoice_at: { $gte: newPlanSetAt },
        plan: user.plan
      })
        .sort('invoice_at')
        .lean()
        .exec();

      let newExpiresAt = new Date(newPlanSetAt);
      for (const payment of paymentsAfterCorrection) {
        if (
          !payment.is_refund_credit_allowed &&
          payment.amount_refunded > 0 &&
          !['free_beta_program', 'plan_conversion'].includes(payment.method)
        ) {
          continue;
        }

        if (config.durationMapping[payment.duration.toString()]) {
          newExpiresAt = dayjs(newExpiresAt)
            .add(...config.durationMapping[payment.duration.toString()])
            .toDate();
        }
      }

      // Calculate the time credit added
      const creditMs =
        new Date(newExpiresAt).getTime() - new Date(oldExpiresAt).getTime();
      const creditDays = Math.round(creditMs / (1000 * 60 * 60 * 24));

      // Format the plan name for display
      const planName = user.plan
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const locale = user[config.lastLocaleField] || 'en';

      logger.info(
        isDryRun ? '[DRY RUN]' : '',
        'user plan set at needs corrected',
        user.email,
        `plan=${user.plan}`,
        'it was off by',
        driftMinutes,
        'minutes',
        `(+${creditDays} days credit)`
      );

      // Build the email HTML body
      const emailBody = [
        '<p>We recently identified and fixed a billing synchronization issue that affected your account.</p>',
        '<p><strong>What happened:</strong> During the initial setup of your plan, a brief timing issue between our payment processor and our servers caused your plan start date to be recorded slightly later than your actual payment date. As a result, your account may not have reflected the full duration of service you paid for.</p>',
        `<p><strong>What we fixed:</strong> We corrected your <strong>${planName}</strong> plan start date from <strong>${dayjs(
          oldPlanSetAt
        ).format('MMM D, YYYY h:mm A')}</strong> to <strong>${dayjs(
          newPlanSetAt
        ).format(
          'MMM D, YYYY h:mm A'
        )}</strong>, which adds approximately <strong>${creditDays} day${
          creditDays === 1 ? '' : 's'
        }</strong> to your account.</p>`,
        '<p><strong>Technical details:</strong> When you completed your payment, both our redirect handler and webhook processor attempted to record the transaction simultaneously. This race condition caused your plan start date to be set to the redirect time rather than the actual payment time. We have deployed a permanent fix to prevent this from happening to any accounts going forward.</p>',
        `<p>Your updated plan expiration date is now <strong>${dayjs(
          newExpiresAt
        ).format('MMM D, YYYY')}</strong>.</p>`,
        "<p>We sincerely apologize for the inconvenience. If you have any questions or concerns, please don't hesitate to reply to this email.</p>",
        `<p class="text-center mb-0"><a href="${config.urls.web}/${locale}/my-account/billing" class="btn btn-md btn-dark">Manage Billing</a></p>`
      ].join('\n');

      if (isDryRun) {
        logger.info('[DRY RUN] Would send email to:', user.email);
        logger.info('[DRY RUN] Email body:', emailBody);
        logger.info(
          '[DRY RUN] Would set planSetAt from',
          oldPlanSetAt,
          'to',
          newPlanSetAt
        );
        logger.info(
          '[DRY RUN] planExpiresAt would change from',
          oldExpiresAt,
          'to',
          newExpiresAt,
          `(+${creditDays} days)`
        );
      } else {
        // Correct planSetAt and save
        user[config.userFields.planSetAt] = newPlanSetAt;
        await user.save();

        // Send notification email to user, BCC support
        try {
          await emailHelper({
            template: 'alert',
            message: {
              to: user[config.userFields.receiptEmail] || user.email,
              ...(user[config.userFields.receiptEmail]
                ? { cc: user.email }
                : {}),
              bcc: config.supportEmail,
              subject: `Your ${planName} plan has been credited with ${creditDays} additional day${
                creditDays === 1 ? '' : 's'
              }`
            },
            locals: {
              message: emailBody,
              locale
            }
          });
          logger.info(`Sent billing correction email to ${user.email}`);
        } catch (err) {
          logger.error(err, { user: user.email });
        }
      }
    } // end block
  } catch (err) {
    logger.error(err, { user: id });
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    if (isDryRun)
      logger.info(
        '[DRY RUN] Mode enabled — no changes will be saved and no emails will be sent'
      );

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
