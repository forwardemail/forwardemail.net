/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');

const { SMTP_LIMIT_USER_FIELDS, canLendSmtpLimit, getSmtpBaseLimit } =
  getUserSmtpLimit;

//
// Starting threshold for a domain whose admins cannot be resolved
// (the Team plan's for Team plan domains)
//
function getDomainBaseLimit(domain) {
  return getSmtpBaseLimit({ plan: domain && domain.plan });
}

/**
 * Get the effective SMTP limit for a domain by finding the highest
 * effective limit among ALL admin members of the domain.
 *
 * Each admin's effective limit is their reputation-based threshold
 * (with any manual `smtp_limit` applied, see `helpers/get-user-smtp-limit.js`).
 * The domain benefits from the highest admin threshold.
 * Falls back to the first reputation tier if no admin is found.
 *
 * @param {Object} domain - The domain object (must have members populated)
 * @returns {number} The effective SMTP limit for the domain
 */
function getDomainSmtpLimit(domain) {
  if (!domain || !domain.members || !Array.isArray(domain.members)) {
    return getDomainBaseLimit(domain);
  }

  const adminMembers = domain.members.filter((m) => m.group === 'admin');

  if (adminMembers.length === 0) {
    return getDomainBaseLimit(domain);
  }

  // Check if members.user is populated
  const populatedAdmins = adminMembers.filter(
    (m) => typeof m.user === 'object' && m.user !== null
  );

  if (populatedAdmins.length > 0) {
    // Find the highest effective limit among all admin members
    let highest = 0;
    for (const member of populatedAdmins) {
      // (only admins whose threshold can apply, see `canLendSmtpLimit`)
      if (!canLendSmtpLimit(member.user)) continue;
      const limit = getUserSmtpLimit(member.user);
      if (limit > highest) highest = limit;
    }

    return highest > 0 ? highest : getDomainBaseLimit(domain);
  }

  // If members are not populated, we cannot determine the limit synchronously.
  // Return the global default. Callers that need accuracy with unpopulated
  // members should use getDomainSmtpLimitAsync instead.
  return getDomainBaseLimit(domain);
}

/**
 * Async version that queries the Users collection directly to find the
 * highest effective limit among all admin members of a domain.
 * Always queries the database to ensure accuracy regardless of whether
 * members.user is populated (since partial populates may omit smtpLimit).
 *
 * @param {Object} domain - The domain object (members may or may not be populated)
 * @param {Object} Users - The Users mongoose model
 * @returns {Promise<number>} The effective SMTP limit for the domain
 */
async function getDomainSmtpLimitAsync(domain, Users) {
  if (!domain || !domain.members || !Array.isArray(domain.members)) {
    return getDomainBaseLimit(domain);
  }

  const adminMembers = domain.members.filter((m) => m.group === 'admin');

  if (adminMembers.length === 0) {
    return getDomainBaseLimit(domain);
  }

  // Query Users (not the populated members) to ensure we get the limit fields,
  // since populated members.user may not include them (partial select).
  // NOTE: After populate, m.user can be `null` if the referenced user was deleted.
  // Since `typeof null === 'object'`, we must explicitly guard against null.
  const adminUserIds = adminMembers
    .map((m) =>
      m.user !== null && typeof m.user === 'object'
        ? m.user._id || m.user.id || m.user
        : m.user
    )
    .filter(Boolean);

  if (adminUserIds.length === 0) {
    return getDomainBaseLimit(domain);
  }

  const adminUsers = await Users.find({
    _id: { $in: adminUserIds }
  })
    .select(SMTP_LIMIT_USER_FIELDS)
    .lean()
    .exec();

  if (!adminUsers || adminUsers.length === 0) {
    return getDomainBaseLimit(domain);
  }

  let highest = 0;
  for (const adminUser of adminUsers) {
    // (only admins whose threshold can apply, see `canLendSmtpLimit`)
    if (!canLendSmtpLimit(adminUser)) continue;
    const limit = getUserSmtpLimit(adminUser);
    if (limit > highest) highest = limit;
  }

  return highest > 0 ? highest : getDomainBaseLimit(domain);
}

/**
 * Get the daily outbound SMTP limit that applies to a user sending from a domain.
 *
 * On team plan domains this is the domain's limit (highest admin threshold),
 * unless an admin restricted the user, in which case the restriction applies.
 * On other plans this is the user's own limit.
 *
 * @param {Object} domain - The domain object (with `plan` and `members`)
 * @param {Object} user - User object with the SMTP limit fields
 * @param {Object} Users - The Users mongoose model
 * @returns {Promise<number>} The daily limit for the sender
 */
async function getSenderSmtpLimitAsync(domain, user, Users) {
  const userLimit = getUserSmtpLimit(user);
  if (!domain || domain.plan !== 'team') return userLimit;
  const domainLimit = await getDomainSmtpLimitAsync(domain, Users);
  // (restricted users, and users on hold after spam or virus reports, are
  // held to their own threshold)
  return getUserSmtpLimit.isSmtpRestricted(user) ||
    getUserSmtpLimit.isSmtpOnHold(user)
    ? Math.min(userLimit, domainLimit)
    : domainLimit;
}

/**
 * The daily outbound SMTP limit to show a user outside of a domain (e.g. on
 * the Emails page or `/v1/emails/limit` with user auth): their own, or the
 * highest that applies to them on a Team plan domain they are a member of.
 *
 * @param {Object} user - User object with the SMTP limit fields (and `_id`)
 * @param {Object} Domains - The Domains mongoose model
 * @param {Object} Users - The Users mongoose model
 * @returns {Promise<number>} The daily limit
 */
async function getUserSmtpLimitAcrossDomainsAsync(user, Domains, Users) {
  const userLimit = getUserSmtpLimit(user);
  // (restricted users, and users on hold after spam or virus reports, are
  // held to their own threshold)
  if (
    getUserSmtpLimit.isSmtpRestricted(user) ||
    getUserSmtpLimit.isSmtpOnHold(user)
  )
    return userLimit;
  const teamDomains = await Domains.find({
    plan: 'team',
    'members.user': user._id
  })
    .select('id plan members')
    .lean()
    .exec();
  return Math.max(
    userLimit,
    await getHighestDomainSmtpLimitAsync(teamDomains, Users)
  );
}

/**
 * The highest limit among several Team plan domains (see
 * `getDomainSmtpLimitAsync`), with one query for all of their admins.
 *
 * @param {Array<Object>} domains - Domains (with `plan` and `members`)
 * @param {Object} Users - The Users mongoose model
 * @returns {Promise<number>} The highest limit (0 without domains)
 */
async function getHighestDomainSmtpLimitAsync(domains, Users) {
  if (!Array.isArray(domains) || domains.length === 0) return 0;
  const ids = new Set();
  for (const domain of domains)
    for (const member of domain.members || [])
      if (member && member.group === 'admin' && member.user)
        ids.add(
          (typeof member.user === 'object' && member.user._id
            ? member.user._id
            : member.user
          ).toString()
        );
  const admins =
    ids.size > 0
      ? await Users.find({ _id: { $in: [...ids] } })
          .select(SMTP_LIMIT_USER_FIELDS)
          .lean()
          .exec()
      : [];
  const limits = new Map();
  for (const admin of admins)
    if (canLendSmtpLimit(admin))
      limits.set(admin._id.toString(), getUserSmtpLimit(admin));

  let highest = 0;
  for (const domain of domains) {
    let domainLimit = 0;
    for (const member of domain.members || []) {
      if (!member || member.group !== 'admin' || !member.user) continue;
      const id = (
        typeof member.user === 'object' && member.user._id
          ? member.user._id
          : member.user
      ).toString();
      domainLimit = Math.max(domainLimit, limits.get(id) || 0);
    }

    highest = Math.max(
      highest,
      domainLimit > 0 ? domainLimit : getDomainBaseLimit(domain)
    );
  }

  return highest;
}

module.exports = getDomainSmtpLimit;
module.exports.getDomainSmtpLimitAsync = getDomainSmtpLimitAsync;
module.exports.getUserSmtpLimitAcrossDomainsAsync =
  getUserSmtpLimitAcrossDomainsAsync;
module.exports.getSenderSmtpLimitAsync = getSenderSmtpLimitAsync;
module.exports.getHighestDomainSmtpLimitAsync = getHighestDomainSmtpLimitAsync;
