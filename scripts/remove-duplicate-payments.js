/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Removes payments stored more than once for one Stripe payment intent, then
// builds the unique indexes that stop it from happening again.
//
// For each duplicated payment intent:
// 1. keeps one payment (the one refunded the most, otherwise the oldest) and
//    deletes the others (each deleted payment is first written to a backup
//    file, one EJSON document per line)
// 2. syncs the kept payment from Stripe again
// 3. saves the user again so their plan expiry is recalculated (each extra
//    copy added another period to it)
//
// PayPal orders and transactions stored more than once are only listed
// unless `--paypal` is passed.  A unique index is only built for a field once
// it has no duplicates left.
//
// Usage:
//   node scripts/remove-duplicate-payments.js --dry-run  # report only
//   node scripts/remove-duplicate-payments.js            # apply
//
// Options:
//   --dry-run          report only, change nothing
//   --paypal           also remove duplicate PayPal orders and transactions
//   --skip-sync        don't sync kept Stripe payments from Stripe again
//   --backup=<path>    backup file (default: payments-removed-<time>.jsonl)
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const mongoose = require('mongoose');
const Graceful = require('@ladjs/graceful');

const config = require('#config');
const Payments = require('#models/payments');
const Users = require('#models/users');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const stripe = require('#helpers/stripe');
const syncStripePaymentIntent = require('#helpers/sync-stripe-payment-intent');
const {
  UNIQUE_FIELDS,
  removeDuplicates,
  ensureUniqueIndex
} = require('#helpers/remove-duplicate-payments');

const { EJSON } = mongoose.mongo.BSON;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const DRY_RUN = process.argv.includes('--dry-run');
const PAYPAL = process.argv.includes('--paypal');
const SKIP_SYNC = process.argv.includes('--skip-sync');
const backupArg = process.argv.find((arg) => arg.startsWith('--backup='));
const BACKUP_PATH = path.resolve(
  backupArg
    ? backupArg.slice('--backup='.length)
    : `payments-removed-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`
);

function backup(payments) {
  fs.appendFileSync(
    BACKUP_PATH,
    payments
      .map((payment) => EJSON.stringify(payment, { relaxed: false }))
      .join('\n') + '\n'
  );
}

// sync the kept payment from Stripe again (same as the webhooks do)
async function syncFromStripe(payment) {
  const user = await Users.findById(payment.user).lean().exec();
  if (!user) throw new Error(`User ${payment.user} does not exist`);

  const paymentIntent = await stripe.paymentIntents.retrieve(
    payment.stripe_payment_intent_id,
    { expand: ['charges'] }
  );
  if (!paymentIntent) throw new Error('Payment intent did not exist in Stripe');

  if (paymentIntent.customer !== user[config.userFields.stripeCustomerID])
    throw new Error(
      `Payment intent customer ${paymentIntent.customer} is not the customer of user ${user.email}`
    );

  const errorEmails = await syncStripePaymentIntent(user)([], paymentIntent);
  if (errorEmails.length > 0) throw errorEmails[0].err;
}

(async () => {
  await setupMongoose(logger);

  const problems = [];
  const userIds = new Map();
  let removed = 0;

  try {
    logger.info(
      `${DRY_RUN ? '[DRY RUN] ' : ''}removing duplicate payments${
        DRY_RUN ? '' : ` (backup: ${BACKUP_PATH})`
      }`
    );

    for (const field of UNIQUE_FIELDS) {
      const isStripe = field === 'stripe_payment_intent_id';
      const isReportOnly = !isStripe && !PAYPAL;

      const result = await removeDuplicates(Payments, field, {
        dryRun: DRY_RUN || isReportOnly,
        logger,
        onBeforeRemove: backup
      });

      if (isReportOnly && result.groups > 0)
        problems.push(
          `${result.groups} ${field} value(s) stored more than once (run with --paypal to remove)`
        );

      for (const skipped of result.skipped) {
        problems.push(
          `${field} ${JSON.stringify(skipped.value)} stored ${
            skipped.count
          } times: ${skipped.reason} (review manually)`
        );
      }

      if (!isReportOnly) {
        removed += result.removed.length;
        for (const id of result.userIds) {
          userIds.set(id.toString(), id);
        }
      }

      // sync the kept payments from Stripe
      if (isStripe && !DRY_RUN && !SKIP_SYNC) {
        for (const payment of result.kept) {
          try {
            await syncFromStripe(payment);
          } catch (err) {
            logger.error(err, { payment_id: payment._id });
            problems.push(
              `sync of payment ${payment._id} (${payment.stripe_payment_intent_id}) failed: ${err.message}`
            );
          }
        }
      }

      // build the unique index once no duplicates are left
      try {
        const { status, duplicates } = await ensureUniqueIndex(
          Payments,
          field,
          { dryRun: DRY_RUN, logger }
        );
        logger.info(`unique index ${field}_1: ${status}`);
        if (status === 'skipped' && !DRY_RUN)
          problems.push(
            `unique index ${field}_1 not built: ${duplicates.length} value(s) still stored more than once`
          );
      } catch (err) {
        logger.error(err);
        problems.push(`unique index ${field}_1 failed: ${err.message}`);
      }
    }

    // save each affected user again so their plan expiry is recalculated
    for (const id of userIds.values()) {
      const user = await Users.findById(id);
      if (!user) {
        problems.push(`user ${id} does not exist`);
        continue;
      }

      const before = user[config.userFields.planExpiresAt];
      if (DRY_RUN) {
        logger.info(`[DRY RUN] would save user ${user.email}`);
        continue;
      }

      try {
        await user.save();
        logger.info(
          `saved user ${user.email}: plan expiry ${
            before ? new Date(before).toISOString() : before
          } -> ${new Date(user[config.userFields.planExpiresAt]).toISOString()}`
        );
      } catch (err) {
        logger.error(err, { user_id: id });
        problems.push(`save of user ${user.email} failed: ${err.message}`);
      }
    }

    logger.info(
      `${DRY_RUN ? '[DRY RUN] ' : ''}${removed} duplicate payment(s) ${
        DRY_RUN ? 'would be ' : ''
      }removed for ${userIds.size} user(s)${
        removed > 0 && !DRY_RUN ? ` (backup: ${BACKUP_PATH})` : ''
      }`
    );

    for (const problem of problems) {
      logger.warn(problem);
    }
  } catch (err) {
    logger.error(err);
    problems.push(err.message);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(problems.length > 0 ? 1 : 0);
})();
