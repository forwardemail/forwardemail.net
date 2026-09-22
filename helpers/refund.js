/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { paypalAgent } = require('./paypal');

const logger = require('#helpers/logger');
const { canRefundPayment } = require('#helpers/payment-refund-status');
const stripe = require('#helpers/stripe');
const { Payments } = require('#models');

async function completeRefund(payment) {
  payment.amount_refunded = payment.amount;
  payment.currency_amount_refunded = payment.currency_amount;
  payment.refunded_at = new Date();
  await payment.save();
  return payment.toObject();
}

function getRefundRequestId(payment) {
  return `refund-${payment._id}`;
}

// this function accepts a payment ID
// and refunds it appropriately in Stripe or PayPal
async function refund(id) {
  const payment = await Payments.findById(id);
  if (!payment) throw new Error('Payment does not exist');

  if (!canRefundPayment(payment)) return false;

  const requestId = getRefundRequestId(payment);

  //
  // if it was stripe then we can attempt to refund by:
  // - stripe_payment_intent_id
  //
  if (payment.stripe_payment_intent_id) {
    const stripeRefund = await stripe.refunds.create(
      {
        payment_intent: payment.stripe_payment_intent_id
      },
      {
        idempotencyKey: requestId
      }
    );

    if (stripeRefund.status !== 'succeeded') {
      throw new Error(
        `Stripe refund was not completed: ${stripeRefund.status}`
      );
    }

    return completeRefund(payment);
  }

  //
  // if it was paypal then we can attempt to refund by:
  // - paypal_transaction_id
  //
  if (payment.paypal_transaction_id) {
    // Early return for deprecated legacy PayPal agent
    if (payment.is_legacy_paypal) {
      logger.debug('Skipping legacy PayPal agent usage - deprecated');
      return false;
    }

    const agent = await paypalAgent();
    // <https://developer.paypal.com/docs/api/payments/v2/captures-refund>
    const response = await agent
      .post(`/v2/payments/captures/${payment.paypal_transaction_id}/refund`)
      .set('PayPal-Request-Id', requestId);

    if (response.body?.status !== 'COMPLETED') {
      throw new Error(
        `PayPal refund was not completed: ${response.body?.status || 'unknown'}`
      );
    }

    return completeRefund(payment);
  }

  return false;
}

module.exports = refund;
