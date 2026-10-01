/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');
const { isWithinGracePeriod } = require('#helpers/is-within-grace-period');

//
// Fields that must be selected on a user to compute their SMTP limit
//
// (`plan` decides the first tier, so it must be selected too, and `group`
// and the banned field decide whether an admin can lend their threshold)
const SMTP_LIMIT_USER_FIELDS = `plan group ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`;

function getTierIndex(tier) {
  if (typeof tier !== 'number' || !Number.isFinite(tier) || tier < 0) return 0;
  return Math.min(Math.floor(tier), config.smtpReputationTiers.length - 1);
}

/**
 * Get the daily threshold for a reputation tier.
 *
 * @param {number} tier - Reputation tier index
 * @returns {number} Daily threshold for the tier
 */
function getSmtpReputationLimit(tier) {
  return config.smtpReputationTiers[getTierIndex(tier)].limit;
}

function getManualLimit(user) {
  if (!user || typeof user !== 'object') return 0;
  const manual = user[config.userFields.smtpLimit];
  return typeof manual === 'number' && Number.isFinite(manual) && manual > 0
    ? manual
    : 0;
}

/**
 * Whether an admin restricted this user below the first reputation tier.
 *
 * @param {Object} user - User object with `smtp_limit`
 * @returns {boolean} True if the user is restricted
 */
function isSmtpRestricted(user) {
  const manual = getManualLimit(user);
  return manual > 0 && manual < config.smtpReputationTiers[0].limit;
}

/**
 * Whether moving up is paused for this user after spam or virus reports or
 * a suspension (see `helpers/record-smtp-reputation-report.js`).  A user on
 * hold is held to their own threshold, even on a Team plan domain.
 *
 * @param {Object} user - User object with `smtp_reputation_hold_until`
 * @param {Date} [now] - Current time
 * @returns {boolean} True if the user is on hold
 */
function isSmtpOnHold(user, now = new Date()) {
  if (!user || typeof user !== 'object') return false;
  const holdUntil = user[config.userFields.smtpReputationHoldUntil];
  return Boolean(holdUntil && new Date(holdUntil).getTime() > now.getTime());
}

/**
 * The manual floor an admin approved for this user (0 if none).
 *
 * Every user has `smtp_limit` set to the first tier by default, so only a
 * value above it is an approval.  It does not apply while the user is on
 * hold after spam or virus reports.
 *
 * @param {Object} user - User object with `smtp_limit`
 * @returns {number} Manual floor (daily messages)
 */
function getSmtpManualFloor(user) {
  // (a minimum an admin approved does not apply while the user is on hold
  // after spam or virus reports, until an admin reviews them, but still does
  // after a severe bounce rate)
  if (
    isSmtpOnHold(user) &&
    user[config.userFields.smtpReputationHoldReason] !== 'bounces'
  )
    return 0;
  const manual = getManualLimit(user);
  return manual > config.smtpReputationTiers[0].limit ? manual : 0;
}

/**
 * The first daily threshold for the user's plan: senders on the Team plan
 * start at `config.smtpTeamLimitMessages` instead of the first tier's
 * threshold (and are never reset below it).
 *
 * @param {Object} user - User object with `plan`
 * @returns {number} Starting daily threshold for the user's plan
 */
function getSmtpBaseLimit(user) {
  const base = config.smtpReputationTiers[0].limit;
  if (!user || typeof user !== 'object' || user.plan !== 'team') return base;
  return Math.max(base, config.smtpTeamLimitMessages);
}

//
// The higher of the manual floor and the plan's starting threshold
// (0 when neither is above the first tier)
//
function getFloor(user) {
  const floor = Math.max(getSmtpManualFloor(user), getSmtpBaseLimit(user));
  return floor > config.smtpReputationTiers[0].limit ? floor : 0;
}

//
// Highest tier whose threshold a floor covers
//
function getCoveredTierIndex(floor) {
  let covered = 0;
  for (const [index, tier] of config.smtpReputationTiers.entries()) {
    if (tier.limit <= floor) covered = index;
  }

  return covered;
}

/**
 * The tier a plan's starting threshold covers (0 unless on the Team plan).
 *
 * @param {Object} user - User object with `plan`
 * @returns {number} Tier index
 */
function getBaseTierIndex(user) {
  return getCoveredTierIndex(getSmtpBaseLimit(user));
}

/**
 * Get the reputation tier that applies to a user.
 *
 * This is the user's earned tier, raised to the highest tier covered by a
 * manual floor or their plan's starting threshold (so a sender an admin
 * approved for e.g. 1,000 per day is on the 1,000 tier, and their next tier
 * is the first one above it).
 *
 * @param {Object} user - User object with `smtp_limit` and `smtp_reputation_tier`
 * @returns {number} Effective tier index
 */
function getEffectiveTierIndex(user) {
  if (!user || typeof user !== 'object') return 0;
  const earned = getTierIndex(user[config.userFields.smtpReputationTier]);
  const floor = getFloor(user);
  if (floor === 0) return earned;
  return Math.max(earned, getCoveredTierIndex(floor));
}

/**
 * Get the effective daily outbound SMTP limit for a user.
 *
 * Outbound SMTP is unlimited and reputation-based: the daily threshold is the
 * limit of the user's reputation tier (see `jobs/update-smtp-reputation.js`).
 *
 * A manual `smtp_limit` set by an admin acts as a floor when it is at or above
 * the first tier (e.g. a customer approved for higher volume at once), and
 * as a restriction when it is below the first tier (e.g. a throttled sender).
 * Senders on the Team plan never go below their plan's starting threshold.
 *
 * @param {Object} user - User object with `smtp_limit` and `smtp_reputation_tier`
 * @returns {number} Effective daily outbound SMTP limit
 */
function getUserSmtpLimit(user) {
  const base = config.smtpReputationTiers[0].limit;
  if (!user || typeof user !== 'object') return base;

  // manual restriction (admin throttled this sender below the first tier)
  if (isSmtpRestricted(user)) return getManualLimit(user);

  // manual floor, plan starting threshold, or the earned tier (whichever is
  // higher)
  return Math.max(
    getFloor(user),
    getSmtpReputationLimit(getEffectiveTierIndex(user))
  );
}

/**
 * Whether a domain admin's threshold can apply to a domain (as its account,
 * the threshold a Team plan domain borrows, or a minimum an admin approved):
 * a paying customer who is not banned and not a system admin.  So free
 * co-admins cannot split an account into one threshold per domain, and a
 * banned user or a system admin added to a customer domain cannot raise it.
 * (Fields that were not selected do not disqualify.)
 *
 * @param {Object} user - User object with `plan`, `group` and the banned field
 * @returns {boolean} True if the admin's threshold can apply
 */
function canLendSmtpLimit(user, now = new Date()) {
  if (!canBeSmtpAccount(user, now)) return false;
  // (not while lending is paused after reports about members who borrowed it)
  const lendHoldUntil = user[config.userFields.smtpReputationLendHoldUntil];
  return !(lendHoldUntil && new Date(lendHoldUntil).getTime() > now.getTime());
}

/**
 * Whether a domain admin can be the account of a domain (see
 * `helpers/get-smtp-sending-limits.js`): a paying customer who is not banned
 * and not a system admin.  Unlike lending their threshold (see
 * `canLendSmtpLimit`), this does not stop while lending is paused, so the
 * domains of an admin whose lending is paused are still held to their one
 * account-wide threshold.
 *
 * @param {Object} user - User object with `plan`, `group` and the banned field
 * @param {Date} [now] - Current time
 * @returns {boolean} True if the admin can be the account
 */
function canBeSmtpAccount(user, now = new Date()) {
  return Boolean(
    user &&
      typeof user === 'object' &&
      user.plan !== 'free' &&
      user.group !== 'admin' &&
      user[config.userFields.isBanned] !== true &&
      isPlanActive(user, now)
  );
}

//
// Whether a user's paid plan is active: not expired, on a subscription, or
// within the grace period after expiring (a plan expiry that was not selected
// does not disqualify)
//
function isPlanActive(user, now = new Date()) {
  const expiresAt = user[config.userFields.planExpiresAt];
  if (!expiresAt) return true;
  return (
    new Date(expiresAt).getTime() >= now.getTime() ||
    Boolean(user[config.userFields.stripeSubscriptionID]) ||
    Boolean(user[config.userFields.paypalSubscriptionID]) ||
    isWithinGracePeriod(user)
  );
}

module.exports = getUserSmtpLimit;
module.exports.canLendSmtpLimit = canLendSmtpLimit;
module.exports.canBeSmtpAccount = canBeSmtpAccount;
module.exports.getSmtpReputationLimit = getSmtpReputationLimit;
module.exports.getTierIndex = getTierIndex;
module.exports.getEffectiveTierIndex = getEffectiveTierIndex;
module.exports.getSmtpManualFloor = getSmtpManualFloor;
module.exports.getSmtpBaseLimit = getSmtpBaseLimit;
module.exports.getBaseTierIndex = getBaseTierIndex;
module.exports.isSmtpRestricted = isSmtpRestricted;
module.exports.isSmtpOnHold = isSmtpOnHold;
module.exports.SMTP_LIMIT_USER_FIELDS = SMTP_LIMIT_USER_FIELDS;
