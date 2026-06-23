/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// One-time migration script to backfill `refunded_at` for existing refunded
// payments using the actual refund timestamps from PayPal and Stripe APIs.
//
// Strategy:
// 1. For Stripe payments: retrieve the charge via the payment intent, then
//    use the earliest refund object's `created` timestamp from charge.refunds.data.
// 2. For PayPal order payments: fetch `/v2/checkout/orders/{order_id}` to get
//    the capture. If REFUNDED, use the capture's `update_time`. If
//    PARTIALLY_REFUNDED, call `/v2/payments/refunds/{capture_id}` and use
//    the refund response's `create_time`.
// 3. For PayPal subscription payments: fetch `/v2/payments/captures/{tx_id}`
//    and use `update_time` (reflects when the refund was processed).
// 4. Fallback: if the API call fails (e.g. 404 for deleted/legacy accounts),
//    use `refund_receipt_sent_at` if available, otherwise skip (do not guess).
//
// Usage:
//   node scripts/backfill-refunded-at.js            # apply
//   node scripts/backfill-refunded-at.js --dry-run  # report only
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout } = require('node:timers/promises');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const mongoose = require('mongoose');
const Graceful = require('@ladjs/graceful');
const ms = require('ms');
const _ = require('#helpers/lodash');

const Payments = require('#models/payments');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const stripe = require('#helpers/stripe');
const { paypalAgent } = require('#helpers/paypal');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const DRY_RUN = process.argv.includes('--dry-run');

// PayPal rate limit: ~30 requests/minute to be safe
const PAYPAL_DELAY = ms('2s');

async function getStripeRefundedAt(payment) {
  //
  // Retrieve the charge for this payment intent and inspect refunds.data
  // (same pattern used in sync-stripe-payment-intent.js)
  //
  const paymentIntent = await stripe.paymentIntents.retrieve(
    payment.stripe_payment_intent_id,
    { expand: ['charges.data.refunds'] }
  );

  const charges =
    paymentIntent.charges && _.isArray(paymentIntent.charges.data)
      ? paymentIntent.charges.data
      : [];

  for (const charge of charges) {
    if (
      charge.refunds &&
      _.isArray(charge.refunds.data) &&
      !_.isEmpty(charge.refunds.data)
    ) {
      // Find the earliest refund by `created` (unix timestamp)
      let earliest = charge.refunds.data[0];
      for (let i = 1; i < charge.refunds.data.length; i++) {
        if (charge.refunds.data[i].created < earliest.created)
          earliest = charge.refunds.data[i];
      }

      return new Date(earliest.created * 1000);
    }
  }

  return null;
}

async function getPayPalOrderRefundedAt(payment) {
  const agent = await paypalAgent();

  const { body: order } = await agent.get(
    `/v2/checkout/orders/${payment.paypal_order_id}`
  );

  const captures = order?.purchase_units?.[0]?.payments?.captures;
  if (!captures || captures.length === 0) return null;

  const [capture] = captures;

  if (capture.status === 'REFUNDED') {
    // update_time on a fully-refunded capture reflects when the refund occurred
    if (capture.update_time) return new Date(capture.update_time);
  } else if (capture.status === 'PARTIALLY_REFUNDED') {
    // Fetch the refund detail to get the exact create_time
    try {
      const { body: refund } = await agent.get(
        `/v2/payments/refunds/${capture.id}`
      );
      if (refund.create_time) return new Date(refund.create_time);
    } catch {
      // Fall through to null
    }
  }

  return null;
}

async function getPayPalSubscriptionRefundedAt(payment) {
  const agent = await paypalAgent();

  // For subscription payments, paypal_transaction_id is the capture ID
  const { body: capture } = await agent.get(
    `/v2/payments/captures/${payment.paypal_transaction_id}`
  );

  if (
    (capture.status === 'REFUNDED' ||
      capture.status === 'PARTIALLY_REFUNDED') && // update_time on the capture reflects when the refund was processed
    capture.update_time
  )
    return new Date(capture.update_time);

  return null;
}

(async () => {
  await setupMongoose(logger);

  try {
    // Find all refunded payments that don't yet have refunded_at set
    const payments = await Payments.find({
      amount_refunded: { $gt: 0 },
      $or: [{ refunded_at: { $exists: false } }, { refunded_at: null }]
    }).lean();

    logger.info(
      `Found ${payments.length} refunded payments without refunded_at`
    );

    let updated = 0;
    let apiResolved = 0;
    let fallbackUsed = 0;
    let skipped = 0;

    for (const payment of payments) {
      let refundedAt = null;
      let source = 'none';

      try {
        if (payment.stripe_payment_intent_id) {
          refundedAt = await getStripeRefundedAt(payment);
          if (refundedAt) source = 'stripe-api';
        } else if (payment.paypal_order_id && !payment.paypal_subscription_id) {
          // PayPal one-time order payment
          if (payment.is_legacy_paypal) {
            // Legacy PayPal accounts may be deleted; use receipt timestamp
            if (payment.refund_receipt_sent_at) {
              refundedAt = payment.refund_receipt_sent_at;
              source = 'refund_receipt_sent_at';
            }
          } else {
            refundedAt = await getPayPalOrderRefundedAt(payment);
            if (refundedAt) source = 'paypal-order-api';
            await setTimeout(PAYPAL_DELAY);
          }
        } else if (payment.paypal_transaction_id) {
          // PayPal subscription payment
          if (payment.is_legacy_paypal) {
            if (payment.refund_receipt_sent_at) {
              refundedAt = payment.refund_receipt_sent_at;
              source = 'refund_receipt_sent_at';
            }
          } else {
            refundedAt = await getPayPalSubscriptionRefundedAt(payment);
            if (refundedAt) source = 'paypal-capture-api';
            await setTimeout(PAYPAL_DELAY);
          }
        }
      } catch (err) {
        // API error (404, timeout, rate limit, etc.)
        logger.warn(
          `API error for payment ${payment._id} (${err.status || err.code}): ${
            err.message
          }`
        );
        // Use refund_receipt_sent_at as fallback only if available
        if (payment.refund_receipt_sent_at) {
          refundedAt = payment.refund_receipt_sent_at;
          source = 'refund_receipt_sent_at';
        }
      }

      // If API didn't resolve and no receipt timestamp, try fallback
      if (!refundedAt && payment.refund_receipt_sent_at) {
        refundedAt = payment.refund_receipt_sent_at;
        source = 'refund_receipt_sent_at';
      }

      if (refundedAt) {
        if (source.includes('api')) apiResolved++;
        else fallbackUsed++;

        if (DRY_RUN) {
          logger.info(
            `[DRY RUN] payment=${
              payment._id
            } source=${source} refunded_at=${refundedAt.toISOString()}`
          );
        } else {
          await Payments.updateOne(
            { _id: payment._id },
            { $set: { refunded_at: refundedAt } }
          );
        }

        updated++;
      } else {
        // No reliable timestamp available - skip rather than guess
        logger.warn(
          `Skipping payment ${payment._id}: no API data or refund_receipt_sent_at available`
        );
        skipped++;
      }
    }

    logger.info(
      [
        `Backfill complete:`,
        `${updated} payments ${DRY_RUN ? 'would be ' : ''}updated`,
        `(${apiResolved} from provider APIs, ${fallbackUsed} from refund_receipt_sent_at)`,
        `${skipped} skipped (no reliable timestamp)`
      ].join(' ')
    );
  } catch (err) {
    logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
