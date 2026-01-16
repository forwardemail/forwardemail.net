/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const emailHelper = require('#helpers/email');
const Payments = require('#models/payments');
const logger = require('#helpers/logger');
const config = require('#config');
const syncPayPalOrderPaymentByPaymentId = require('#helpers/sync-paypal-order-payment-by-payment-id');

async function syncPayPalOrderPayments() {
  //
  // NOTE: PayPal's Order list API endpoint is restricted to "Partners" only
  //       (so we can't retroactively get anyone that failed on redirect or webhook)
  //
  //       In order to get it, we'd have to traverse through all transactions
  //       and then parse out `invoice_id` because we only store `reference_id` and `custom_id` and
  //       `custom_id` is the plan in uppercase and `reference_id` is the user's ID in our system
  //       in the API response for transaction data (at least in PayPal's example)
  //       <https://developer.paypal.com/docs/api/transaction-search/v1/>
  //
  //       (we started actually storing paypal_transaction_id on orders on 7/13/22)
  //       (so it will only work for PayPal order payments made on or after that date)
  //
  //       (note we also started storing `invoice_id` on PayPal Orders created on 7/13/22)
  //
  try {
    const ids = await Payments.distinct('_id', {
      paypal_order_id: { $exists: true },
      paypal_subscription_id: { $exists: false }
    });

    await pMapSeries(ids, syncPayPalOrderPaymentByPaymentId);
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Sync PayPal Orders had an error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }
}

module.exports = syncPayPalOrderPayments;
