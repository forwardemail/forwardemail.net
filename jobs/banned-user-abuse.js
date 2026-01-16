/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('p-map');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const isAllowlisted = require('#helpers/is-allowlisted');
const isDenylisted = require('#helpers/is-denylisted');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Users = require('#models/users');
const Domains = require('#models/domains');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

// Risk score thresholds for different actions
const RISK_THRESHOLDS = {
  LOW: 30, // Monitor only
  MEDIUM: 60, // Alert admins
  HIGH: 80, // Manual review required
  CRITICAL: 95 // Immediate action
};

// Common email providers to exclude from banned domain checks
const COMMON_EMAIL_PROVIDERS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'tutanota.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
  'fastmail.com',
  'yahoo.co.uk',
  'yahoo.ca',
  'yahoo.com.au',
  'googlemail.com',
  'me.com',
  'mac.com',
  'live.com',
  'msn.com',
  'hotmail.co.uk',
  'proton.me',
  'pm.me',
  'tuta.io',
  'zohomail.com',
  '163.com',
  'qq.com',
  'maildrop.cc',
  'airmail.cc',
  'riseup.net',
  'removed.forwardemail.net',
  'hotmail.es'
]);

/**
 * Get domains from banned users (excluding common email providers)
 * @returns {Set} Set of domains used by banned users
 */
async function getBannedUserDomains() {
  try {
    // Get all banned users (excluding self-deleted accounts)
    const bannedUsers = await Users.find({
      [config.userFields.isBanned]: true,
      email: { $not: { $regex: `@${config.removedEmailDomain}$` } }
    })
      .select('email')
      .lean()
      .exec();

    logger.info(
      `Found ${bannedUsers.length} banned users (excluding self-deleted accounts)`
    );

    // Extract domains from banned users' email addresses
    const bannedDomains = new Set();
    for (const user of bannedUsers) {
      if (user.email) {
        const domain = user.email.split('@')[1];
        if (domain && !COMMON_EMAIL_PROVIDERS.has(domain)) {
          bannedDomains.add(domain);
        }
      }
    }

    // Also get domains that banned users owned/managed
    const bannedUserIds = bannedUsers.map((user) => user._id);
    const bannedUserDomains = await Domains.find({
      'members.user': { $in: bannedUserIds }
    })
      .select('name')
      .lean()
      .exec();

    for (const domain of bannedUserDomains) {
      if (domain.name && !COMMON_EMAIL_PROVIDERS.has(domain.name)) {
        bannedDomains.add(domain.name);
      }
    }

    logger.info(
      `Collected ${bannedDomains.size} unique domains from banned users (excluding common email providers)`
    );
    return bannedDomains;
  } catch (err) {
    logger.error('Error getting banned user domains:', err);
    return new Set();
  }
}

/**
 * Check if domain should be flagged using banned domains and allowlist/denylist helpers
 * @param {string} domain - Domain to check
 * @param {Set} bannedDomains - Set of domains from banned users
 * @param {Object} client - Redis client
 * @param {Object} resolver - DNS resolver
 * @returns {Object} Check result with match type or null
 */
async function checkDomain(domain, bannedDomains, client, resolver) {
  try {
    // First check if domain is allowlisted (should be ignored)
    const isAllowed = await isAllowlisted(domain, client, resolver);
    if (isAllowed) {
      return null; // Domain is allowlisted, ignore it
    }

    // Check if domain was used by banned users
    if (bannedDomains.has(domain)) {
      return { matchType: 'banned', domain };
    }

    // Check if domain is denylisted
    try {
      await isDenylisted(domain, client, resolver);
      return null; // Not denylisted
    } catch (err) {
      if (err.name === 'DenylistError') {
        return { matchType: 'denylist', domain }; // Is denylisted
      }

      // Re-throw other errors
      throw err;
    }
  } catch (err) {
    logger.warn(`Error checking domain ${domain}:`, err.message);
    return null;
  }
}

/**
 * Get all domains for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of domain names
 */
async function getUserDomains(userId) {
  try {
    const domains = await Domains.find({
      'members.user': userId
    })
      .select('name')
      .lean()
      .exec();

    return domains.map((domain) => domain.name);
  } catch (err) {
    logger.error(`Error getting domains for user ${userId}:`, err);
    return [];
  }
}

/**
 * Analyze user account for fraud indicators
 * @param {Object} user - User object
 * @param {string} matchedDomain - Domain that matched banned/denylist
 * @param {string} matchType - Type of match ('banned' or 'denylist')
 * @returns {Object} Analysis result with risk score and indicators
 */
function analyzeUserAccount(user, matchedDomain, matchType) {
  let riskScore = 0;
  const indicators = [];

  try {
    const now = dayjs();
    const accountAge = now.diff(user.created_at, 'days');

    // Base risk scoring based on match type
    if (matchType === 'banned') {
      riskScore += 80; // Very high risk for domains used by banned users
      indicators.push(
        `User domain ${matchedDomain} was previously used by banned users`
      );
    } else if (matchType === 'denylist') {
      riskScore += 60; // High risk for user domains on denylist
      indicators.push(`User domain ${matchedDomain} is on the denylist`);
    }

    // Account age analysis
    if (accountAge < 7) {
      riskScore += 20;
      indicators.push(`New account (${accountAge} days old)`);
    } else if (accountAge < 30) {
      riskScore += 10;
      indicators.push(`Recent account (${accountAge} days old)`);
    }

    // Email verification analysis
    if (!user.has_verified_email) {
      riskScore += 15;
      indicators.push('Unverified email address');
    }

    // Plan analysis (all analyzed users are paid since free users are excluded)
    riskScore += 25;
    indicators.push(`Paid plan user (${user.plan}) with suspicious domain`);

    // Payment method analysis
    const paymentMethods = [];
    if (user.stripe_customer_id) {
      paymentMethods.push('Stripe');
    }

    if (user.paypal_payer_id) {
      paymentMethods.push('PayPal');
    }

    if (paymentMethods.length > 0) {
      riskScore += 15;
      indicators.push(`Has payment methods: ${paymentMethods.join(', ')}`);
    }

    // Plan expiration analysis
    if (user[config.userFields.planExpiresAt]) {
      const planExpiry = dayjs(user[config.userFields.planExpiresAt]);
      const daysPastDue = now.diff(planExpiry, 'days');

      if (daysPastDue > 0) {
        riskScore += 10;
        indicators.push(`Plan expired ${daysPastDue} days ago`);
      }
    }

    return {
      riskScore: Math.min(riskScore, 100),
      indicators,
      matchedDomain,
      matchType,
      paymentMethods
    };
  } catch (err) {
    logger.error('Error in analyzeUserAccount:', err);
    return {
      riskScore: 0,
      indicators: ['Error analyzing user account'],
      matchedDomain,
      matchType,
      paymentMethods: []
    };
  }
}

/**
 * Determine action based on risk score
 * @param {number} riskScore - Total risk score
 * @returns {Object} Recommended action and priority
 */
function determineAction(riskScore) {
  if (riskScore >= RISK_THRESHOLDS.CRITICAL) {
    return { action: 'IMMEDIATE_REVIEW', priority: 'critical' };
  }

  if (riskScore >= RISK_THRESHOLDS.HIGH) {
    return { action: 'MANUAL_REVIEW', priority: 'high' };
  }

  if (riskScore >= RISK_THRESHOLDS.MEDIUM) {
    return { action: 'ALERT_ADMINS', priority: 'medium' };
  }

  if (riskScore >= RISK_THRESHOLDS.LOW) {
    return { action: 'MONITOR', priority: 'low' };
  }

  return { action: 'NO_ACTION', priority: 'none' };
}

/**
 * Generate detailed abuse report
 * @param {Object} analysis - Complete analysis results
 * @returns {Object} Formatted report
 */
function generateAbuseReport(analysis) {
  return {
    timestamp: new Date().toISOString(),
    userId: analysis.user._id.toString(),
    email: analysis.user.email,
    domain: analysis.matchedDomain,
    matchType: analysis.matchType,
    riskScore: analysis.riskScore,
    severity: analysis.action.priority,
    recommendedAction: analysis.action.action,
    indicators: analysis.indicators,
    userDetails: {
      id: analysis.user._id.toString(),
      email: analysis.user.email,
      createdAt: analysis.user.created_at,
      plan: analysis.user.plan,
      hasVerifiedEmail: analysis.user.has_verified_email,
      planExpiresAt: analysis.user[config.userFields.planExpiresAt],
      stripeCustomerId: analysis.user.stripe_customer_id,
      paypalPayerId: analysis.user.paypal_payer_id
    },
    paymentMethods: analysis.paymentMethods,
    actionTaken: analysis.action
  };
}

/**
 * Send abuse alert email
 * @param {string} severity - Alert severity level
 * @param {Array} reports - Array of abuse reports
 */
async function sendAbuseAlert(severity, reports) {
  try {
    const severityConfig = {
      critical: {
        subject: '🚨 CRITICAL: User Domain Abuse Alert',
        emoji: '🚨',
        color: '#dc3545'
      },
      high: {
        subject: '⚠️ HIGH RISK: User Domain Review Required',
        emoji: '⚠️',
        color: '#fd7e14'
      },
      medium: {
        subject: '📊 User Domain Abuse Report',
        emoji: '📊',
        color: '#ffc107'
      }
    };

    const configSeverity = severityConfig[severity];

    // Generate HTML report
    const htmlReport = generateHTMLReport(reports, severity, configSeverity);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `${configSeverity.subject} (${reports.length} users)`
      },
      locals: {
        message: htmlReport
      }
    });

    logger.info(
      `${severity.toUpperCase()} user domain abuse alert sent: ${
        reports.length
      } users affected`
    );
  } catch (err) {
    logger.error(`Error sending ${severity} abuse alert:`, err);
  }
}

/**
 * Generate HTML report for email
 * @param {Array} reports - Array of abuse reports
 * @param {string} severity - Alert severity
 * @param {Object} severityConfig - Severity configuration
 * @returns {string} HTML report
 */
function generateHTMLReport(reports, severity, severityConfig) {
  const avgRiskScore = Math.round(
    reports.reduce((sum, r) => sum + r.riskScore, 0) / reports.length
  );

  const bannedDomainReports = reports.filter((r) => r.matchType === 'banned');
  const denylistReports = reports.filter((r) => r.matchType === 'denylist');

  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: ${severityConfig.color};">
        ${
          severityConfig.emoji
        } User Domain Abuse Alert - ${severity.toUpperCase()}
      </h2>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Summary</h3>
        <ul>
          <li><strong>Total Suspicious Users:</strong> ${reports.length}</li>
          <li><strong>Banned Domain Matches:</strong> ${
            bannedDomainReports.length
          }</li>
          <li><strong>Denylist Matches:</strong> ${denylistReports.length}</li>
          <li><strong>Average Risk Score:</strong> ${avgRiskScore}/100</li>
          <li><strong>Detection Time:</strong> ${new Date().toISOString()}</li>
        </ul>
      </div>
  `;

  for (const [index, report] of reports.entries()) {
    const adminUrl = `${config.urls.web}/admin/users?q=${encodeURIComponent(
      report.email
    )}`;

    html += `
      <div style="border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0; padding: 15px;">
        <h4 style="color: ${severityConfig.color}; margin-top: 0;">
          Case ${index + 1}: ${report.email}
        </h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
          <div>
            <strong>Risk Score:</strong> ${report.riskScore}/100<br>
            <strong>Action Required:</strong> ${report.recommendedAction}<br>
            <strong>Match Type:</strong> ${
              report.matchType === 'banned'
                ? 'Previously Banned Domain'
                : 'Denylisted Domain'
            }<br>
            <strong>Domain:</strong> ${report.domain}
          </div>
          <div>
            <strong>Plan:</strong> ${report.userDetails.plan}<br>
            <strong>Created:</strong> ${new Date(
              report.userDetails.createdAt
            ).toLocaleDateString()}<br>
            <strong>Verified:</strong> ${
              report.userDetails.hasVerifiedEmail ? 'Yes' : 'No'
            }<br>
            <strong>Payment Methods:</strong> ${
              report.paymentMethods.length > 0
                ? report.paymentMethods.join(', ')
                : 'None'
            }
          </div>
        </div>

        <div style="margin: 15px 0;">
          <strong>Key Indicators:</strong>
          <ul style="margin: 5px 0;">
            ${report.indicators
              .map((indicator) => `<li>${indicator}</li>`)
              .join('')}
          </ul>
        </div>

        <div style="margin: 15px 0;">
          <strong>Payment Information:</strong>
          <ul style="margin: 5px 0; font-size: 12px;">
            ${
              report.userDetails.stripeCustomerId
                ? `<li><strong>Stripe Customer ID:</strong> ${report.userDetails.stripeCustomerId}</li>`
                : ''
            }
            ${
              report.userDetails.paypalPayerId
                ? `<li><strong>PayPal Payer ID:</strong> ${report.userDetails.paypalPayerId}</li>`
                : ''
            }
            ${
              !report.userDetails.stripeCustomerId &&
              !report.userDetails.paypalPayerId
                ? '<li>No payment methods on file</li>'
                : ''
            }
          </ul>
        </div>

        <div style="background: #e7f3ff; padding: 10px; border-radius: 3px; margin: 10px 0;">
          <strong>Admin Actions:</strong>
          <a href="${adminUrl}" style="display: inline-block; background: #007bff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin: 5px 5px 5px 0;">
            View User in Admin Dashboard
          </a>
        </div>
      </div>
    `;
  }

  html += `
      <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 12px;">
        <h4>Next Steps</h4>
        <ul>
          <li><strong>Critical/High:</strong> Review accounts immediately and consider banning</li>
          <li><strong>Medium:</strong> Monitor closely and investigate within 24 hours</li>
          <li><strong>Low:</strong> Add to monitoring list for pattern analysis</li>
        </ul>

        <p><strong>Note:</strong> This job detects users with domains they own/manage that were previously used by banned users or are on the denylist. Domains on the allowlist are automatically excluded. Users who have passed KYC verification and free plan users are excluded from this analysis. Please verify findings before taking action on user accounts.</p>
      </div>
    </div>
  `;

  return html;
}

/**
 * Main banned user abuse detection function
 */
(async () => {
  await setupMongoose(logger);

  try {
    logger.info('Starting user domain abuse detection analysis...');

    // Get all unbanned users (excluding KYC-verified and free plan users)
    const unbannedUsers = await Users.find({
      [config.userFields.isBanned]: false,
      has_passed_kyc: { $ne: true },
      plan: { $in: ['enhanced_protection', 'team'] }
    })
      .select(
        `email created_at plan has_verified_email ${config.userFields.planExpiresAt} stripe_customer_id paypal_payer_id`
      )
      .lean()
      .exec();

    logger.info(
      `Analyzing ${unbannedUsers.length} unbanned paid users (excluding KYC-verified and free plan) for suspicious domains`
    );

    // Get domains from banned users
    const bannedDomains = await getBannedUserDomains();
    logger.info(
      `Will check against ${bannedDomains.size} banned domains and denylist`
    );

    const suspiciousReports = [];
    let totalAnalyzed = 0;
    let totalSuspicious = 0;

    // Check each unbanned user
    await pMap(
      unbannedUsers,
      async (user) => {
        try {
          totalAnalyzed++;
          const userDomains = await getUserDomains(user._id);

          // Check each user domain using banned domains and allowlist/denylist helpers
          for (const domain of userDomains) {
            const domainCheck = await checkDomain(
              domain,
              bannedDomains,
              client,
              resolver
            );

            if (domainCheck) {
              // Domain is flagged (denylisted and not allowlisted)
              const analysis = analyzeUserAccount(
                user,
                domainCheck.domain,
                domainCheck.matchType
              );
              const action = determineAction(analysis.riskScore);

              // Only report if action is needed
              if (action.action !== 'NO_ACTION') {
                totalSuspicious++;

                const fullAnalysis = {
                  user,
                  ...analysis,
                  action
                };

                const report = generateAbuseReport(fullAnalysis);
                suspiciousReports.push(report);

                logger.warn(`Suspicious user detected: ${user.email}`, {
                  domain: domainCheck.domain,
                  matchType: domainCheck.matchType,
                  riskScore: analysis.riskScore,
                  action: action.action
                });
              }

              // Break after first match to avoid duplicate reports for the same user
              break;
            }
          }
        } catch (err) {
          logger.error(`Error analyzing user ${user.email}:`, err);
        }
      },
      { concurrency: config.concurrency || 10 }
    );

    logger.info(
      `Analysis complete: ${totalAnalyzed} users analyzed, ${totalSuspicious} suspicious cases found`
    );

    // Send reports if suspicious activity found
    if (suspiciousReports.length > 0) {
      // Group reports by severity
      const criticalReports = suspiciousReports.filter(
        (r) => r.severity === 'critical'
      );
      const highReports = suspiciousReports.filter(
        (r) => r.severity === 'high'
      );
      const mediumReports = suspiciousReports.filter(
        (r) => r.severity === 'medium'
      );
      const lowReports = suspiciousReports.filter((r) => r.severity === 'low');

      // Send critical alerts immediately
      if (criticalReports.length > 0) {
        await sendAbuseAlert('critical', criticalReports);
      }

      // Send high priority alerts
      if (highReports.length > 0) {
        await sendAbuseAlert('high', highReports);
      }

      // Send medium priority summary
      if (mediumReports.length > 0) {
        await sendAbuseAlert('medium', mediumReports);
      }

      // Log low priority for monitoring
      if (lowReports.length > 0) {
        logger.info(
          `${lowReports.length} low-priority abuse indicators detected`,
          {
            users: lowReports.map((r) => r.email)
          }
        );
      }

      logger.info(
        `Banned user abuse detection complete: ${suspiciousReports.length} reports generated`
      );
    } else {
      logger.info('No suspicious user domain abuse detected');
    }
  } catch (err) {
    await logger.error(err);
    // Send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'User Domain Abuse Detection Error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
