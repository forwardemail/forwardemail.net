/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const revHash = require('rev-hash');
const _ = require('#helpers/lodash');
const retryRequest = require('#helpers/retry-request');
const config = require('#config');
const logger = require('#helpers/logger');
const emailHelper = require('#helpers/email');
const { emoji } = require('#config/utilities');

const { fields } = config.passport;

/**
 * Real-time verification of Ubuntu team membership using Launchpad API
 * This provides double-verification against the cached map data
 *
 * @param {Object} user - User object with ubuntuUsername
 * @param {string} teamName - Team name (e.g., '~ubuntumembers')
 * @param {Object} resolver - DNS resolver instance
 * @returns {Promise<boolean>} - True if user is a member of the team
 */
async function verifyUbuntuMembership(user, teamName, resolver) {
  // Validate inputs
  if (!_.isObject(user) || !isSANB(user[fields.ubuntuUsername])) {
    throw new TypeError('Invalid user object or missing ubuntuUsername');
  }

  if (!isSANB(teamName)) {
    throw new TypeError('Invalid team name');
  }

  // Get user's membership details from Launchpad API
  const url = `https://api.launchpad.net/devel/~${
    user[fields.ubuntuUsername]
  }/memberships_details`;
  const response = await retryRequest(url, { resolver });
  const json = await response.body.json();

  // Validate response structure
  if (!_.isObject(json) || !_.isArray(json.entries)) {
    throw new TypeError('Invalid API response structure');
  }

  // Check if user is a member of the specified team
  const isMember = json.entries.some((membership) => {
    // Extract team name from team_link (e.g., "https://api.launchpad.net/devel/~ubuntumembers" -> "~ubuntumembers")
    const membershipTeamName = membership.team_link
      ? membership.team_link.split('/').pop()
      : null;

    return membershipTeamName === teamName && membership.status === 'Approved';
  });

  return isMember;
}

/**
 * Enhanced membership check that combines map data with real-time verification
 * This provides double-verification and dummy-proofing
 *
 * @param {Object} user - User object with ubuntuUsername
 * @param {string} domainName - Domain name (e.g., 'ubuntu.com')
 * @param {Map} map - Cached membership map
 * @param {Object} resolver - DNS resolver instance
 * @param {Array} adminEmails - Admin email addresses for notifications
 * @param {Object} client - Redis client for caching
 * @returns {Promise<Object>} - Verification result with details
 */
// eslint-disable-next-line max-params
async function enhancedMembershipCheck(
  user,
  domainName,
  map,
  resolver,
  adminEmails,
  client
) {
  // Get team name from domain mapping
  const teamName = config.ubuntuTeamMapping[domainName];
  if (!teamName) {
    throw new TypeError(`No team mapping found for domain: ${domainName}`);
  }

  // Check cached map data
  const mapResult =
    map.get(domainName)?.has(user[fields.ubuntuUsername]) || false;

  // Perform real-time verification (this will throw if it fails)
  const realtimeResult = await verifyUbuntuMembership(user, teamName, resolver);

  // Check for discrepancies
  if (mapResult !== realtimeResult) {
    const discrepancyMessage = `Ubuntu membership discrepancy detected for ${
      user[fields.ubuntuUsername]
    } in ${teamName}: map says ${mapResult}, real-time says ${realtimeResult}`;

    // Log the discrepancy
    await logger.error(discrepancyMessage, {
      user_id: user.id,
      domain: domainName,
      team: teamName,
      map_result: mapResult,
      realtime_result: realtimeResult,
      ubuntu_username: user[fields.ubuntuUsername]
    });

    // Email admins about the discrepancy (with rate limiting)
    if (adminEmails && adminEmails.length > 0) {
      const emailKey = `discrepancy_email:${revHash(
        [user.id, domainName, mapResult, realtimeResult].join(':')
      )}`;
      const emailCache = await client.get(emailKey);

      if (!emailCache) {
        try {
          await emailHelper({
            template: 'alert',
            message: {
              to: adminEmails,
              bcc: config.email.message.from,
              subject: `${emoji(
                'warning'
              )} Ubuntu membership discrepancy detected for ${
                user[fields.ubuntuUsername]
              }@${domainName}`
            },
            locals: {
              message: `<p><strong>Ubuntu Membership Discrepancy Alert</strong></p>
                <p>A discrepancy was detected between cached data and real-time verification for user <strong>${
                  user[fields.ubuntuUsername]
                }</strong> in team <strong>${teamName}</strong>:</p>
                <ul>
                  <li><strong>Cached map result:</strong> ${
                    mapResult ? 'Member' : 'Not a member'
                  }</li>
                  <li><strong>Real-time API result:</strong> ${
                    realtimeResult ? 'Member' : 'Not a member'
                  }</li>
                  <li><strong>Domain:</strong> ${domainName}</li>
                  <li><strong>User ID:</strong> ${user.id}</li>
                  <li><strong>Ubuntu Username:</strong> ${
                    user[fields.ubuntuUsername]
                  }</li>
                </ul>
                <p>The real-time result will be used for this operation. Please investigate the cause of this discrepancy.</p>`
            }
          });

          // Cache the email notification for 6 hours to prevent spam
          await client.set(emailKey, true, 'PX', ms('6h'));
        } catch (emailErr) {
          await logger.error(
            'Failed to send discrepancy email notification',
            emailErr
          );
        }
      }
    }
  }

  return {
    isMember: realtimeResult, // Always use real-time result
    mapResult,
    realtimeResult,
    discrepancy:
      mapResult === realtimeResult
        ? null
        : {
            map: mapResult,
            realtime: realtimeResult,
            message: `Discrepancy detected: map says ${mapResult}, real-time says ${realtimeResult}`
          },
    teamName,
    domainName,
    username: user[fields.ubuntuUsername]
  };
}

module.exports = {
  verifyUbuntuMembership,
  enhancedMembershipCheck
};
