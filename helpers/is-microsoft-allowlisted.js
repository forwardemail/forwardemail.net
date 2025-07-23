/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { boolean } = require('boolean');

const config = require('#config');
const logger = require('#helpers/logger');

/**
 * Check if a Microsoft/onmicrosoft.com sender is allowlisted
 * This provides granular control for legitimate Microsoft senders
 * to bypass SPF/DMARC authentication failures
 *
 * @param {Object} session - SMTP session object
 * @param {Object} client - Redis client
 * @returns {Promise<boolean>} - True if allowlisted
 */
async function isMicrosoftAllowlisted(session, client) {
  if (
    !session.originalFromAddressRootDomain ||
    session.originalFromAddressRootDomain !== 'onmicrosoft.com'
  ) {
    return false;
  }

  const fromAddress = session.originalFromAddress;
  const fromDomain = session.originalFromAddressDomain;

  // Check static allowlist for known legitimate Microsoft tenants
  if (config.microsoftAllowlist.has(fromAddress.toLowerCase())) {
    logger.debug(`Microsoft sender allowlisted by email: ${fromAddress}`);
    return true;
  }

  if (config.microsoftAllowlist.has(fromDomain.toLowerCase())) {
    logger.debug(`Microsoft sender allowlisted by domain: ${fromDomain}`);
    return true;
  }

  // Check Redis for dynamic allowlist entries
  // Format: "microsoft:email@tenant.onmicrosoft.com" or "microsoft:tenant.onmicrosoft.com"
  try {
    const emailKey = `microsoft:${fromAddress.toLowerCase()}`;
    const domainKey = `microsoft:${fromDomain.toLowerCase()}`;

    const [emailResult, domainResult] = await Promise.all([
      client.get(emailKey),
      client.get(domainKey)
    ]);

    if (boolean(emailResult)) {
      logger.debug(
        `Microsoft sender allowlisted by Redis email: ${fromAddress}`
      );
      return true;
    }

    if (boolean(domainResult)) {
      logger.debug(
        `Microsoft sender allowlisted by Redis domain: ${fromDomain}`
      );
      return true;
    }

    // Check for wildcard tenant allowlisting
    // Extract tenant name from domain (e.g., "contoso" from "contoso.onmicrosoft.com")
    const tenantMatch = fromDomain.match(/^([^.]+)\.onmicrosoft\.com$/);
    if (tenantMatch) {
      const tenantName = tenantMatch[1];
      const wildcardKey = `microsoft:${tenantName}.*`;
      const wildcardResult = await client.get(wildcardKey);

      if (boolean(wildcardResult)) {
        logger.debug(
          `Microsoft sender allowlisted by tenant wildcard: ${tenantName}.*`
        );
        return true;
      }
    }
  } catch (err) {
    logger.error('Error checking Microsoft allowlist in Redis', err);
  }

  return false;
}

/**
 * Add a Microsoft sender to the dynamic allowlist
 *
 * @param {string} identifier - Email address, domain, or tenant pattern
 * @param {Object} client - Redis client
 * @param {number} ttl - TTL in seconds (optional, defaults to 30 days)
 * @returns {Promise<boolean>} - Success status
 */
async function addMicrosoftAllowlist(identifier, client, ttl = 2592000) {
  try {
    const key = `microsoft:${identifier.toLowerCase()}`;
    await client.setex(key, ttl, 'true');
    logger.info(`Added Microsoft allowlist entry: ${identifier}`);
    return true;
  } catch (err) {
    logger.error(`Failed to add Microsoft allowlist entry: ${identifier}`, err);
    return false;
  }
}

/**
 * Remove a Microsoft sender from the dynamic allowlist
 *
 * @param {string} identifier - Email address, domain, or tenant pattern
 * @param {Object} client - Redis client
 * @returns {Promise<boolean>} - Success status
 */
async function removeMicrosoftAllowlist(identifier, client) {
  try {
    const key = `microsoft:${identifier.toLowerCase()}`;
    const result = await client.del(key);
    logger.info(
      `Removed Microsoft allowlist entry: ${identifier} (existed: ${
        result > 0
      })`
    );
    return result > 0;
  } catch (err) {
    logger.error(
      `Failed to remove Microsoft allowlist entry: ${identifier}`,
      err
    );
    return false;
  }
}

module.exports = {
  isMicrosoftAllowlisted,
  addMicrosoftAllowlist,
  removeMicrosoftAllowlist
};
