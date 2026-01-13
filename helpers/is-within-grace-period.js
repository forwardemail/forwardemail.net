/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const _ = require('#helpers/lodash');

const config = require('#config');

// 15-day grace period for paid users after plan expiration
const GRACE_PERIOD_DAYS = 15;

/**
 * Check if a paid user is within the grace period after plan expiration.
 * This applies to all paid users (both subscription and one-time payment users)
 * to ensure fair treatment across payment methods.
 *
 * The grace period is calculated from the plan expiration date.
 *
 * @param {Object} user - The user object
 * @returns {boolean} - True if the user is within the grace period
 */
function isWithinGracePeriod(user) {
  if (!user) return false;

  // Only applies to paid plan users
  if (user.plan === 'free') return false;

  // Check if plan has expired
  if (!_.isDate(user[config.userFields.planExpiresAt])) return false;

  const planExpiresAt = new Date(user[config.userFields.planExpiresAt]);
  const now = Date.now();

  // If plan hasn't expired yet, no grace period needed
  if (planExpiresAt.getTime() >= now) return false;

  // Calculate days since expiration
  const daysSinceExpiry = dayjs().diff(dayjs(planExpiresAt), 'day');

  // User is within grace period if less than GRACE_PERIOD_DAYS have passed
  return daysSinceExpiry < GRACE_PERIOD_DAYS;
}

/**
 * Get the number of days remaining in the grace period.
 *
 * @param {Object} user - The user object
 * @returns {number} - Days remaining in grace period, or 0 if not in grace period
 */
function getGracePeriodDaysRemaining(user) {
  if (!isWithinGracePeriod(user)) return 0;

  const planExpiresAt = new Date(user[config.userFields.planExpiresAt]);
  const daysSinceExpiry = dayjs().diff(dayjs(planExpiresAt), 'day');

  return Math.max(0, GRACE_PERIOD_DAYS - daysSinceExpiry);
}

module.exports = {
  isWithinGracePeriod,
  getGracePeriodDaysRemaining,
  GRACE_PERIOD_DAYS
};
