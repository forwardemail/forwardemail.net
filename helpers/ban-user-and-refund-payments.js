/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const pMapSeries = require('p-map-series');

const { paypalAgent } = require('./paypal');
const logger = require('#helpers/logger');
const stripe = require('#helpers/stripe');
const emailHelper = require('#helpers/email');
const config = require('#config');
const { Payments } = require('#models');

/**
 * Ban a user and refund their payments as fraudulent (following 30-day first-time customer policy)
 * Only refunds payments that are:
 * - Within 30 days of the user's first payment (plan_set_at)
 * - From first-time customers (no payments before plan_set_at)
 * - Not already refunded
 * - Not from users who have submitted denylist requests
 *
 * @param {Object} user - User document from MongoDB
 * @param {string} reason - Reason for banning (for logging and emails)
 * @returns {Object} Summary of actions taken
 */
async function banUserAndRefundPayments(user, reason = 'Fraud detected') {
  const summary = {
    userId: user._id,
    email: user.email,
    wasBanned: user[config.userFields.isBanned],
    paymentsRefunded: 0,
    paymentsSkipped: 0,
    stripeRefunds: 0,
    paypalRefunds: 0,
    subscriptionsCancelled: 0,
    totalRefundAmount: 0,
    isFirstTimeCustomer: false,
    hasDenylistRequests: false,
    errors: []
  };

  try {
    // Ban the user if not already banned
    if (user[config.userFields.isBanned]) {
      logger.info(`User ${user.email} already banned, processing refunds`);
    } else {
      user[config.userFields.isBanned] = true;
      await user.save();
      logger.info(`User ${user.email} banned: ${reason}`);
    }

    // Check if user has denylist requests (voids refund policy)
    if (user[config.userFields.hasDenylistRequests]) {
      summary.hasDenylistRequests = true;
      logger.info(
        `User ${user.email} has denylist requests - refund policy voided, skipping refunds`
      );
      return summary;
    }

    const planSetAt = new Date(user[config.userFields.planSetAt]);
    const thirtyDaysAfterPlanSet = dayjs(planSetAt).add(30, 'days').toDate();
    const now = new Date();

    // Check if we're within 30 days of first payment
    if (now > thirtyDaysAfterPlanSet) {
      logger.info(
        `User ${
          user.email
        } is outside 30-day refund window (plan set at ${planSetAt.toISOString()}), skipping refunds`
      );
      summary.paymentsSkipped = 'outside_30_day_window';
      return summary;
    }

    // Check if user is a first-time customer (no payments before plan_set_at)
    const previousPaymentCount = await Payments.countDocuments({
      user: user._id,
      invoice_at: {
        $lt: dayjs(planSetAt).subtract(1, 'day').toDate()
      }
    });

    if (previousPaymentCount > 0) {
      summary.isFirstTimeCustomer = false;
      logger.info(
        `User ${user.email} has ${previousPaymentCount} previous payments - not a first-time customer, skipping refunds`
      );
      summary.paymentsSkipped = 'not_first_time_customer';
      return summary;
    }

    summary.isFirstTimeCustomer = true;

    // Get eligible payments (within 30 days of plan_set_at, not refunded)
    const payments = await Payments.find({
      user: user._id,
      amount_refunded: { $eq: 0 }, // Only non-refunded payments
      method: {
        $nin: ['free_beta_program', 'plan_conversion'] // Exclude free/conversion payments
      },
      invoice_at: {
        $gte: planSetAt,
        $lte: thirtyDaysAfterPlanSet
      }
    })
      .lean()
      .exec();

    logger.info(
      `Found ${payments.length} eligible payments for refund (first-time customer, within 30 days) for user ${user.email}`
    );

    if (payments.length === 0) {
      logger.info(`No eligible payments to refund for ${user.email}`);
      return summary;
    }

    // Refund Stripe payments
    const stripePayments = payments.filter(
      (p) => p.stripe_payment_intent_id && !p.paypal_transaction_id
    );

    if (stripePayments.length > 0) {
      logger.info(
        `Refunding ${stripePayments.length} Stripe payments for ${user.email}`
      );

      await pMapSeries(stripePayments, async (payment) => {
        try {
          await stripe.refunds.create({
            payment_intent: payment.stripe_payment_intent_id,
            reason: 'fraudulent'
          });

          // Update payment record
          await Payments.findByIdAndUpdate(payment._id, {
            amount_refunded: payment.amount,
            currency_amount_refunded: payment.currency_amount
          });

          summary.stripeRefunds++;
          summary.paymentsRefunded++;
          summary.totalRefundAmount += payment.amount || 0;

          logger.info(
            `Refunded Stripe payment ${payment._id} for ${user.email}: $${payment.amount}`
          );
        } catch (err) {
          logger.error(
            `Error refunding Stripe payment ${payment._id} for ${user.email}:`,
            err
          );
          summary.errors.push({
            paymentId: payment._id,
            type: 'stripe',
            error: err.message
          });
        }
      });
    }

    // Refund PayPal payments
    const paypalPayments = payments.filter(
      (p) => p.paypal_transaction_id && !p.is_legacy_paypal
    );

    if (paypalPayments.length > 0) {
      logger.info(
        `Refunding ${paypalPayments.length} PayPal payments for ${user.email}`
      );

      await pMapSeries(paypalPayments, async (payment) => {
        try {
          const agent = await paypalAgent();
          await agent.post(
            `/v2/payments/captures/${payment.paypal_transaction_id}/refund`
          );

          // Update payment record
          await Payments.findByIdAndUpdate(payment._id, {
            amount_refunded: payment.amount,
            currency_amount_refunded: payment.currency_amount
          });

          summary.paypalRefunds++;
          summary.paymentsRefunded++;
          summary.totalRefundAmount += payment.amount || 0;

          logger.info(
            `Refunded PayPal payment ${payment._id} for ${user.email}: $${payment.amount}`
          );
        } catch (err) {
          logger.error(
            `Error refunding PayPal payment ${payment._id} for ${user.email}:`,
            err
          );
          summary.errors.push({
            paymentId: payment._id,
            type: 'paypal',
            error: err.message
          });
        }
      });
    }

    // Cancel Stripe subscription if exists
    if (isSANB(user[config.userFields.stripeSubscriptionID])) {
      try {
        await stripe.subscriptions.cancel(
          user[config.userFields.stripeSubscriptionID]
        );
        summary.subscriptionsCancelled++;
        logger.info(
          `Cancelled Stripe subscription for ${user.email}: ${
            user[config.userFields.stripeSubscriptionID]
          }`
        );

        // Clear subscription ID from user
        user[config.userFields.stripeSubscriptionID] = undefined;
        await user.save();
      } catch (err) {
        logger.error(
          `Error cancelling Stripe subscription for ${user.email}:`,
          err
        );
        summary.errors.push({
          type: 'stripe_subscription',
          error: err.message
        });
      }
    }

    // Cancel PayPal subscription if exists
    if (isSANB(user[config.userFields.paypalSubscriptionID])) {
      try {
        const agent = await paypalAgent();
        await agent.post(
          `/v1/billing/subscriptions/${
            user[config.userFields.paypalSubscriptionID]
          }/cancel`
        );
        summary.subscriptionsCancelled++;
        logger.info(
          `Cancelled PayPal subscription for ${user.email}: ${
            user[config.userFields.paypalSubscriptionID]
          }`
        );

        // Clear subscription ID from user
        user[config.userFields.paypalSubscriptionID] = undefined;
        await user.save();
      } catch (err) {
        logger.error(
          `Error cancelling PayPal subscription for ${user.email}:`,
          err
        );
        summary.errors.push({
          type: 'paypal_subscription',
          error: err.message
        });
      }
    }

    // Send admin notification email
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `User Banned and Refunded: ${user.email}`
      },
      locals: {
        message: `
<h3>User Banned and Payments Refunded</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>Field</th><th>Value</th></tr>
  <tr><td>Email</td><td>${user.email}</td></tr>
  <tr><td>User ID</td><td>${user._id}</td></tr>
  <tr><td>Reason</td><td>${reason}</td></tr>
  <tr><td>First-Time Customer</td><td>${
    summary.isFirstTimeCustomer ? 'Yes' : 'No'
  }</td></tr>
  <tr><td>Has Denylist Requests</td><td>${
    summary.hasDenylistRequests ? 'Yes (refunds voided)' : 'No'
  }</td></tr>
  <tr><td>Plan Set At</td><td>${new Date(
    user[config.userFields.planSetAt]
  ).toISOString()}</td></tr>
  <tr><td>Total Payments Refunded</td><td>${summary.paymentsRefunded}</td></tr>
  <tr><td>Payments Skipped</td><td>${
    typeof summary.paymentsSkipped === 'string'
      ? summary.paymentsSkipped
      : summary.paymentsSkipped
  }</td></tr>
  <tr><td>Stripe Refunds</td><td>${summary.stripeRefunds}</td></tr>
  <tr><td>PayPal Refunds</td><td>${summary.paypalRefunds}</td></tr>
  <tr><td>Total Refund Amount</td><td>$${(
    summary.totalRefundAmount / 100
  ).toFixed(2)}</td></tr>
  <tr><td>Subscriptions Cancelled</td><td>${
    summary.subscriptionsCancelled
  }</td></tr>
  <tr><td>Errors</td><td>${summary.errors.length}</td></tr>
</table>
<p><em>Note: Refunds follow the 30-day first-time customer policy. Only payments within 30 days of first payment from first-time customers are refunded.</em></p>
${
  summary.errors.length > 0
    ? `
<h4>Errors Encountered:</h4>
<ul>
${summary.errors
  .map(
    (e) =>
      `<li><strong>${e.type}</strong>: ${e.error}${
        e.paymentId ? ` (Payment ID: ${e.paymentId})` : ''
      }</li>`
  )
  .join('\n')}
</ul>
`
    : ''
}
        `.trim()
      }
    });

    logger.info(`Ban and refund complete for ${user.email}:`, summary);
  } catch (err) {
    logger.error(`Error in banUserAndRefundPayments for ${user.email}:`, err);
    summary.errors.push({
      type: 'general',
      error: err.message
    });
    throw err;
  }

  return summary;
}

module.exports = banUserAndRefundPayments;
