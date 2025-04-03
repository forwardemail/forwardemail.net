/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');
const ms = require('ms');

const logger = require('./logger');
const { paypalAgent } = require('./paypal');
const _ = require('#helpers/lodash');
const Payments = require('#models/payments');

const FIVE_SECONDS = ms('5s');

// eslint-disable-next-line complexity
async function syncPayPalOrderPaymentByPaymentId(id) {
  const payment = await Payments.findById(id);

  if (!payment) throw new Error('Payment does not exist');

  const agent = await paypalAgent();

  //
  // if the payment was missing its transaction ID then we can
  // call the capture endpoint again which will return the ID
  //
  // (regardless we have to call this in order to get refund information)
  //
  logger.info('fetching transaction id', { payment });

  try {
    const response = await agent.get(
      `/v2/checkout/orders/${payment.paypal_order_id}`
    );

    if (
      !_.isArray(response.body.purchase_units) ||
      _.isEmpty(response.body.purchase_units)
    )
      throw new Error('Capture does not exist');

    if (
      !_.isObject(response.body.purchase_units[0]) ||
      !_.isObject(response.body.purchase_units[0].payments) ||
      !_.isArray(response.body.purchase_units[0].payments.captures) ||
      _.isEmpty(response.body.purchase_units[0].payments.captures)
    )
      throw new Error('Capture does not exist');

    // find the initial transaction
    const [capture] = response.body.purchase_units[0].payments.captures;
    if (!capture) throw new Error('Capture does not exist');

    let shouldSave = false;

    if (
      payment.paypal_transaction_id &&
      payment.paypal_transaction_id !== capture.id
    )
      shouldSave = true;

    let invoiceAt;
    if (response.body.create_time) {
      invoiceAt = new Date(response.body.create_time);
    } else if (
      response.body?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time
    ) {
      invoiceAt = new Date(
        response.body.purchase_units[0].payments.captures[0].create_time
      );
    }

    if (
      invoiceAt &&
      new Date(payment.invoice_at).getTime() !== invoiceAt.getTime()
    ) {
      shouldSave = true;
    }

    let amountRefunded = 0;
    if (capture.status === 'REFUNDED') {
      amountRefunded = payment.amount;
      logger.info('amount refunded detected', {
        amountRefunded,
        payment,
        capture
      });
    } else if (capture.status === 'PARTIALLY_REFUNDED') {
      // lookup the refund and parse the amount refunded
      const agent = await paypalAgent();
      const { body: refund } = await agent.get(
        `/v2/payments/refunds/${capture.id}`
      );
      amountRefunded = Math.round(Number(refund.amount.value) * 100);
    }

    if (payment.amount_refunded !== amountRefunded) shouldSave = true;

    if (shouldSave) {
      // prevent double tx id save
      if (payment.paypal_transaction_id !== capture.id) {
        const count = await Payments.countDocuments({
          paypal_transaction_id: capture.id,
          _id: {
            $ne: payment._id
          }
        });

        if (count > 0)
          throw new Error(
            `Capture ID ${capture.id} was attempting to be duplicated for payment ID ${payment.id}`
          );

        // otherwise set the tx id
        payment.paypal_transaction_id = capture.id;
      }

      payment.amount_refunded = amountRefunded;
      if (invoiceAt) payment.invoice_at = invoiceAt;
      await payment.save();
    }

    //
    // the mapper makes a max of ~4 requests per ID call
    // therefore if the limit on the PayPal API side is 50 requests per minute
    // we can do 50/4=~12.5 ids in 1 minute
    // therefore we need a delay of ~5 seconds in between each
    // 60/5 = 12 (and 12*4 = 48)
    //
    await setTimeout(FIVE_SECONDS);
  } catch (err) {
    // if a paypal account is deleted/removed then history is erased
    if (err.status === 404) {
      logger.error(err, { payment });
      return;
    }

    throw err;
  }
}

module.exports = syncPayPalOrderPaymentByPaymentId;
