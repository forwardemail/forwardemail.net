/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const getPaidSince = require('#helpers/get-paid-since');
const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');
const {
  getHighestDomainSmtpLimitAsync
} = require('#helpers/get-domain-smtp-limit');

const { getPaidDays } = getPaidSince;
const {
  getBaseTierIndex,
  getEffectiveTierIndex,
  getSmtpBaseLimit,
  getSmtpManualFloor,
  isSmtpOnHold,
  isSmtpRestricted
} = getUserSmtpLimit;

/**
 * Summarize a user's outbound SMTP reputation for display
 * (My Account → Billing and My Account → Emails).
 *
 * Uses the same rules as enforcement (`helpers/get-user-smtp-limit.js`) and
 * the reputation job (`helpers/update-smtp-reputation.js`).  Paid time is
 * computed live; the busiest recent day is as of the job's last evaluation.
 *
 * @param {Object} user - Full user document
 * @returns {Promise<Object>} Reputation summary
 */
async function getSmtpReputationSummary(user) {
  const tiers = config.smtpReputationTiers;
  // (a manual floor places the user on the tier it covers)
  const tier = getEffectiveTierIndex(user);
  // (an approved minimum only matters above the plan's starting threshold)
  const manualFloor =
    getSmtpManualFloor(user) > getSmtpBaseLimit(user)
      ? getSmtpManualFloor(user)
      : 0;
  const threshold = getUserSmtpLimit(user);
  const cleanDays = user[config.userFields.smtpReputationCleanDays] || 0;
  // (busiest recent day in recipients outside the user's own domains)
  const peak = user[config.userFields.smtpReputationPeak] || 0;
  const peakDomains = user[config.userFields.smtpReputationPeakDomains] || 0;
  // (the busiest recent day with the next tier's recipient domains, since
  // moving up needs both on the same day; users not evaluated since it was
  // recorded fall back to the busiest day)
  const nextPeak =
    typeof user[config.userFields.smtpReputationNextPeak] === 'number'
      ? user[config.userFields.smtpReputationNextPeak]
      : peak;
  const holdUntil = user[config.userFields.smtpReputationHoldUntil];
  const lendHoldUntil = user[config.userFields.smtpReputationLendHoldUntil];
  const isRestricted = isSmtpRestricted(user);

  const [paidSince, teamDomains] = await Promise.all([
    getPaidSince(user),
    Domains.find({ plan: 'team', 'members.user': user._id })
      .select('id plan members')
      .lean()
      .exec()
  ]);

  //
  // on team plan domains the highest admin threshold applies to every member
  // (restricted users and users on hold keep their own)
  //
  let teamThreshold = 0;
  if (!isRestricted && !isSmtpOnHold(user)) {
    const highest = await getHighestDomainSmtpLimitAsync(teamDomains, Users);
    if (highest > threshold) teamThreshold = highest;
  }

  const paidDays = getPaidDays(paidSince);
  const next = tiers[tier + 1];
  const neededPeak = Math.ceil(threshold * config.smtpReputationMinUtilization);

  const throttledAt = user[config.userFields.smtpThrottledAt];
  const isRecentlyThrottled = Boolean(
    throttledAt &&
      new Date(throttledAt).getTime() >= Date.now() - 24 * 60 * 60 * 1000
  );

  // (tiers are numbered from the plan's starting threshold, since the Team
  // plan starts above the first tiers)
  const baseTier = getBaseTierIndex(user);

  return {
    tier: tier - baseTier + 1,
    tierCount: tiers.length - baseTier,
    threshold,
    teamThreshold,
    cleanDays,
    paidDays,
    peak,
    peakDomains,
    lookbackDays: config.smtpReputationLookbackDays,
    holdUntil:
      holdUntil && new Date(holdUntil).getTime() > Date.now()
        ? new Date(holdUntil)
        : null,
    // (why: spam or virus reports, or a high bounce rate)
    holdReason:
      user[config.userFields.smtpReputationHoldReason] === 'bounces'
        ? 'bounces'
        : 'reports',
    // (until when members of the user's Team plan domains cannot use their
    // threshold, see `helpers/record-smtp-reputation-report.js`)
    lendHoldUntil:
      lendHoldUntil && new Date(lendHoldUntil).getTime() > Date.now()
        ? new Date(lendHoldUntil)
        : null,
    manualFloor,
    isRestricted,
    isRecentlyThrottled,
    isTopTier: !next,
    next:
      next && !isRestricted && user.plan !== 'free'
        ? {
            limit: next.limit,
            minPaidDays: next.minPaidDays,
            minCleanDays: next.minCleanDays,
            neededPeak,
            minRecipientDomains: next.minRecipientDomains || 0,
            hasPaidDays: paidDays >= next.minPaidDays,
            hasCleanDays: cleanDays >= next.minCleanDays,
            hasPeak: nextPeak >= neededPeak,
            hasRecipientDomains: peakDomains >= (next.minRecipientDomains || 0)
          }
        : null
  };
}

/**
 * Whether a user can send outbound SMTP (and so has a reputation to show):
 * users on a paid plan, and members of paid plan domains.
 *
 * @param {Object} user - User document
 * @returns {Promise<boolean>} True if the user can send
 */
async function canSendSmtp(user) {
  if (!user) return false;
  if (user.plan && user.plan !== 'free') return true;
  return Boolean(
    await Domains.exists({
      'members.user': user._id,
      plan: { $in: ['enhanced_protection', 'team'] }
    })
  );
}

module.exports = getSmtpReputationSummary;
module.exports.canSendSmtp = canSendSmtp;
