/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ACTIVE_STRIPE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing']);

/**
 * Return subscriptions that currently provide service.
 *
 * Pending and unresolved payment states, including `incomplete`, `past_due`,
 * `unpaid`, and `paused`, do not prove that a customer has duplicate active
 * subscriptions and must not trigger fraud enforcement.
 *
 * @param   {Array<object>} subscriptions Stripe subscription records
 * @returns {Array<object>}
 */
function getActiveStripeSubscriptions(subscriptions) {
  if (!Array.isArray(subscriptions)) return [];

  return subscriptions.filter((subscription) =>
    ACTIVE_STRIPE_SUBSCRIPTION_STATUSES.has(subscription.status)
  );
}

module.exports = getActiveStripeSubscriptions;
module.exports.ACTIVE_STRIPE_SUBSCRIPTION_STATUSES =
  ACTIVE_STRIPE_SUBSCRIPTION_STATUSES;
