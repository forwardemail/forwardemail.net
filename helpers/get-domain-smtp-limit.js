/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

/**
 * Get the effective SMTP limit for a domain by finding the highest
 * smtp_limit among ALL admin members of the domain.
 *
 * The domain's effective limit is the maximum smtp_limit value across
 * all admin members (since the domain benefits from the highest-tier admin).
 * Falls back to config.smtpLimitMessages if no admin has a custom limit.
 *
 * @param {Object} domain - The domain object (must have members populated)
 * @returns {number} The effective SMTP limit for the domain
 */
function getDomainSmtpLimit(domain) {
  if (!domain || !domain.members || !Array.isArray(domain.members)) {
    return config.smtpLimitMessages;
  }

  const adminMembers = domain.members.filter((m) => m.group === 'admin');

  if (adminMembers.length === 0) {
    return config.smtpLimitMessages;
  }

  // Check if members.user is populated (has the smtpLimit field available)
  const populatedAdmins = adminMembers.filter(
    (m) => typeof m.user === 'object' && m.user !== null
  );

  if (populatedAdmins.length > 0) {
    // Find the highest smtp_limit among all admin members
    let highest = 0;
    for (const member of populatedAdmins) {
      const limit = member.user[config.userFields.smtpLimit] || 0;
      if (limit > highest) highest = limit;
    }

    // If no admin has a custom limit set, use the global default
    return highest > 0 ? highest : config.smtpLimitMessages;
  }

  // If members are not populated, we cannot determine the limit synchronously.
  // Return the global default. Callers that need accuracy with unpopulated
  // members should use getDomainSmtpLimitAsync instead.
  return config.smtpLimitMessages;
}

/**
 * Async version that queries the Users collection directly to find the
 * highest smtp_limit among all admin members of a domain.
 * Always queries the database to ensure accuracy regardless of whether
 * members.user is populated (since partial populates may omit smtpLimit).
 *
 * @param {Object} domain - The domain object (members may or may not be populated)
 * @param {Object} Users - The Users mongoose model
 * @returns {Promise<number>} The effective SMTP limit for the domain
 */
async function getDomainSmtpLimitAsync(domain, Users) {
  if (!domain || !domain.members || !Array.isArray(domain.members)) {
    return config.smtpLimitMessages;
  }

  const adminMembers = domain.members.filter((m) => m.group === 'admin');

  if (adminMembers.length === 0) {
    return config.smtpLimitMessages;
  }

  // Always query Users directly to ensure we get the smtpLimit field,
  // since populated members.user may not include it (partial select).
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
    return config.smtpLimitMessages;
  }

  const adminUsers = await Users.find({
    _id: { $in: adminUserIds }
  })
    .select(config.userFields.smtpLimit)
    .lean()
    .exec();

  if (!adminUsers || adminUsers.length === 0) {
    return config.smtpLimitMessages;
  }

  let highest = 0;
  for (const adminUser of adminUsers) {
    const limit = adminUser[config.userFields.smtpLimit] || 0;
    if (limit > highest) highest = limit;
  }

  return highest > 0 ? highest : config.smtpLimitMessages;
}

module.exports = getDomainSmtpLimit;
module.exports.getDomainSmtpLimitAsync = getDomainSmtpLimitAsync;
