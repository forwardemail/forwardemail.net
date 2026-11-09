/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const CappedList = require('#helpers/capped-list');
const _ = require('#helpers/lodash');
const emailHelper = require('#helpers/email');
const Payments = require('#models/payments');
const logger = require('#helpers/logger');
const config = require('#config');
const syncPayPalOrderPaymentByPaymentId = require('#helpers/sync-paypal-order-payment-by-payment-id');

// (with PayPal itself failing every payment fails, each after its retries)
const MAX_ERRORS_IN_A_ROW = 10;

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
  //
  // each payment's error is kept and the run goes on, and the errors are sent
  // in one email (the first error stopped the run, so the payments after it
  // waited for the next run, which stopped at it again)
  //
  const errors = new CappedList(100);
  try {
    // (only payments PayPal can still refund, up to 180 days after capture,
    // with a few days to spare: every order payment ever made was fetched
    // from PayPal again, one at a time, every hour; a later refund still
    // comes in through the PAYMENT.CAPTURE.REFUNDED webhook)
    const ids = await Payments.distinct('_id', {
      paypal_order_id: { $exists: true },
      paypal_subscription_id: { $exists: false },
      created_at: { $gte: dayjs().subtract(190, 'days').toDate() }
    });

    let errorsInARow = 0;
    await pMapSeries(ids, async (id) => {
      try {
        await syncPayPalOrderPaymentByPaymentId(id);
        errorsInARow = 0;
      } catch (err) {
        logger.error(err, { payment_id: id });
        errors.push({ id, err });
        errorsInARow++;
        if (errorsInARow >= MAX_ERRORS_IN_A_ROW)
          throw new Error(
            `Stopped after ${MAX_ERRORS_IN_A_ROW} payments in a row failed to sync`
          );
      }
    });
  } catch (err) {
    await logger.error(err);
    errors.push({ err });
  }

  if (errors.count === 0) return;

  await emailHelper({
    template: 'alert',
    message: {
      to: config.alertsEmail,
      subject: `Sync PayPal Orders had ${errors.count} error${
        errors.count === 1 ? '' : 's'
      }`
    },
    locals: {
      message: [
        ...errors.items.map(
          ({ id, err }) =>
            `${
              id ? `<p>Payment <code>${encode(String(id))}</code></p>` : ''
            }<pre><code>${encode(
              // (PayPal's response body, not the whole response object)
              safeStringify(
                {
                  ..._.omit(parseErr(err), ['response']),
                  body: err.response?.body
                },
                null,
                2
              )
            )}</code></pre>`
        ),
        errors.omitted > 0
          ? `<p>${errors.omitted} more errors are not listed.</p>`
          : ''
      ].join('\n')
    }
  });
}

module.exports = syncPayPalOrderPayments;
