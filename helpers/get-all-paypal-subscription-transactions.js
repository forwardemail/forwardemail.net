/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pWhilst = require('p-whilst');
const safeStringify = require('fast-safe-stringify');

const { paypalAgent } = require('./paypal');
const logger = require('./logger');

// subscription is PayPal subscription object
async function getAllPayPalSubscriptionTransactions(subscription, agent) {
  const transactions = [];
  let currentPage = 1;
  let totalPages = 1;

  if (!agent) agent = await paypalAgent();

  // res.body.transactions = [ ... ]
  // res.body.total_pages = 3

  await pWhilst(
    () => currentPage === 1 || currentPage < totalPages,
    async () => {
      const url = `/v1/billing/subscriptions/${
        subscription.id
      }/transactions?start_time=${
        subscription.create_time
      }&end_time=${new Date().toISOString()}`;
      const res = await agent.get(url);
      currentPage++;
      if (Array.isArray(res.body.transactions)) {
        transactions.push(...res.body.transactions);
      } else if (res.body && Object.keys(res.body).length === 0) {
        // Empty response {} means no transactions in the time range - this is valid
        // PayPal API returns empty object instead of {transactions: []} when there are no transactions
        // Do nothing, just continue
      } else {
        // Unexpected response format (not an array and not empty object)
        const err = new Error('PayPal transactions missing from response body');
        err.url = url;
        err.res = safeStringify(res, null, 2);
        err.text = res.text;
        err._body = res.body;
        err.isCodeBug = true;
        await logger.error(err, { ignore_hook: false });
      }

      if (Number.isFinite(res.body.total_pages) && res.body.total_pages > 0)
        totalPages = res.body.total_pages;
      if (totalPages > 1)
        throw new Error(
          'PayPal transactions endpoint had pagination but does not support it'
        );
    }
  );

  return transactions;
}

module.exports = getAllPayPalSubscriptionTransactions;
