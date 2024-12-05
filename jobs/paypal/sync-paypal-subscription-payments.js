/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pReduce = require('p-reduce');

const Users = require('#models/users');
const config = require('#config');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');

async function syncPayPalSubscriptionPayments() {
  //
  // NOTE: this won't sync all payments because
  //       some users cancelled paypal subscriptions
  //       and sometimes webhooks and redirects weren't ever hit
  //
  //       and PayPal doesn't have a list subscriptions endpoint
  //       nor do they have a list orders endpoint (it says Partners only?)
  //
  //       so if we really want to fix this retroactively we need to
  //       download the entire TSV/CSV file and then run steps like here:
  //
  //       <https://github.com/paypal/PayPal-REST-API-issues/issues/5>
  //       (NOTE: PayPal for some reason completely disabled/deleted all issues...)
  //       (but here's a snapshot from Wayback <https://web.archive.org/web/20201019010837/https://github.com/paypal/PayPal-REST-API-issues/issues/5>)
  //
  const paypalCustomers = await Users.find({
    $or: [
      {
        [config.userFields.paypalSubscriptionID]: { $exists: true, $ne: null }
      },
      {
        [config.userFields.paypalPayerID]: { $exists: true, $ne: null }
      }
    ]
  })
    // sort by newest customers first
    .sort('-created_at')
    .lean()
    .exec();

  await logger.info(
    `Syncing payments for ${paypalCustomers.length} paypal customers`
  );

  const errorEmails = await pReduce(
    paypalCustomers,
    syncPayPalSubscriptionPaymentsByUser,
    []
  );

  if (errorEmails.length > 0)
    await Promise.all(errorEmails.map((email) => emailHelper(email)));

  await logger.info('Paypal subscriptions synced to payments');
}

module.exports = syncPayPalSubscriptionPayments;
