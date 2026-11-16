/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');

const _ = require('#helpers/lodash');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const stripe = require('#helpers/stripe');
const { paypalAgent } = require('#helpers/paypal');

// billing frequency of an enterprise account and the unit of its periods
const UNITS = { monthly: 'month', annual: 'year' };

// the most a billing period or a payment can be (cents, $10,000,000)
const MAX_AMOUNT = 1_000_000_000;

/**
 * Start of the next billing period an enterprise account has not paid for.
 *
 * Billing periods start on the account's start date and repeat with its
 * frequency.  `enterprise_last_paid_at` is a date in the period last paid
 * for, so the next payment is due at the start of the period after it (and
 * on the start date itself when nothing was paid yet).
 *
 * Each period is the start date plus a number of months or years, added at
 * once and in UTC, so a start on the 31st is due on the last day of a
 * shorter month and on the 31st again after it.
 *
 * @param {Object} user - User with the `enterprise_*` fields
 * @returns {Date|null} Due date, or null without a start date and frequency
 */
function getNextDueAt(user) {
  if (!user || !user.is_enterprise) return null;
  const unit = UNITS[user.enterprise_billing_frequency];
  if (!unit || !_.isDate(user.enterprise_start_date)) return null;

  const start = dayjs.utc(user.enterprise_start_date);
  if (!start.isValid()) return null;

  const lastPaid = _.isDate(user.enterprise_last_paid_at)
    ? dayjs.utc(user.enterprise_last_paid_at)
    : null;
  if (!lastPaid || !lastPaid.isValid() || lastPaid.isBefore(start))
    return start.toDate();

  // (the difference in whole periods is an estimate at the end of a month)
  let index = Math.max(1, lastPaid.diff(start, unit) + 1);
  while (index > 1 && start.add(index - 1, unit).isAfter(lastPaid)) index--;
  while (!start.add(index, unit).isAfter(lastPaid)) index++;

  return start.add(index, unit).toDate();
}

/**
 * Cancel the Stripe and PayPal subscriptions of an enterprise account, which
 * is billed by invoice (one it had before it became enterprise, or one that
 * a checkout started earlier added since).
 *
 * As when a user cancels their own: an error is logged and emailed to
 * admins, and the subscription is taken off the account either way.
 *
 * @param {Object} user - User with its subscription IDs
 * @returns {Promise<Object>} `fields` to unset on the user, and what `failed`
 */
async function cancelSubscriptions(user) {
  const fields = [];
  const failed = [];

  const stripeID = user[config.userFields.stripeSubscriptionID];
  if (isSANB(stripeID)) {
    try {
      await stripe.subscriptions.del(stripeID);
    } catch (err) {
      logger.fatal(err);
      failed.push(`Stripe subscription ${stripeID}`);
    }

    fields.push(config.userFields.stripeSubscriptionID);
  }

  const paypalID = user[config.userFields.paypalSubscriptionID];
  if (isSANB(paypalID)) {
    try {
      const agent = await paypalAgent();
      await agent.post(`/v1/billing/subscriptions/${paypalID}/cancel`);
    } catch (err) {
      logger.fatal(err);
      failed.push(`PayPal subscription ${paypalID}`);
    }

    fields.push(config.userFields.paypalSubscriptionID);
  }

  if (failed.length > 0)
    emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `Error canceling ${failed.join(
          ' and '
        )} for enterprise account ${user.email}`
      },
      locals: {
        message: `<p>${_.escape(
          user.email
        )} is an enterprise account, but ${_.escape(
          failed.join(' and ')
        )} could not be canceled. Cancel it with the payment provider so the customer is not charged.</p>`
      }
    })
      .then()
      .catch((err) => logger.fatal(err));

  return { fields, failed };
}

module.exports = {
  getNextDueAt,
  cancelSubscriptions,
  FREQUENCIES: Object.keys(UNITS),
  MAX_AMOUNT
};
