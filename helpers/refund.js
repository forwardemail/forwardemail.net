/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { paypalAgent } = require('./paypal');
const logger = require('#helpers/logger');
const stripe = require('#helpers/stripe');
const { Payments } = require('#models');

// this function accepts a payment ID
// and refunds it appropriately in Stripe or PayPal
async function refund(id) {
  const payment = await Payments.findById(id);
  if (!payment) throw new Error('Payment does not exist');
  //
  // if it was stripe then we can attempt to refund by:
  // - stripe_payment_intent_id
  //
  if (payment.stripe_payment_intent_id) {
    await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id
    });
    payment.amount_refunded = payment.amount;
    payment.currency_amount_refunded = payment.currency_amount;
    await payment.save();
    return payment.toObject();
  }

  //
  // if it was paypal then we can attempt to refund by:
  // - paypal_transaction_id
  //
  if (payment.paypal_transaction_id) {
    // Early return for deprecated legacy PayPal agent
    if (payment.is_legacy_paypal) {
      logger.debug('Skipping legacy PayPal agent usage - deprecated');
      throw new Error('Legacy PayPal refunds are no longer supported');
    }

    const agent = await paypalAgent();
    // <https://developer.paypal.com/docs/api/payments/v2/#captures_refund>
    await agent.post(
      `/v2/payments/captures/${payment.paypal_transaction_id}/refund`
    );
    payment.amount_refunded = payment.amount;
    await payment.save();
    return payment.toObject();
  }

  // otherwise throw an error
  throw new Error(
    'Unknown payment to refund; no Stripe or PayPal necessary ID'
  );
}

module.exports = refund;
