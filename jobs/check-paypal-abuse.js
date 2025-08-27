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
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('p-map');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const setupMongoose = require('#helpers/setup-mongoose');
const Users = require('#models/users');
const Domains = require('#models/domains');

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
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

/**
 * Analyze shared PayPal payer ID patterns
 * @param {string} paypalPayerId - PayPal payer ID to analyze
 * @returns {Object} Analysis result with risk score and indicators
 */
async function analyzeSharedPayerID(paypalPayerId) {
  try {
    const users = await Users.find({
      paypal_payer_id: paypalPayerId,
      [config.userFields.isBanned]: false,
      has_passed_kyc: false
    })
      .lean()
      .exec();

    if (users.length <= 1) {
      return { riskScore: 0, indicators: [], users: [] };
    }

    let riskScore = 0;
    const indicators = [];

    // Base risk for shared payer ID
    riskScore += Math.min(users.length * 15, 60); // Max 60 points
    indicators.push(`${users.length} accounts sharing PayPal ID`);

    // Analyze account creation patterns
    const creationDates = users.map((u) => new Date(u.created_at));
    creationDates.sort((a, b) => a - b);

    // Check for rapid account creation (within 24 hours)
    for (let i = 1; i < creationDates.length; i++) {
      const timeDiff = creationDates[i] - creationDates[i - 1];
      if (timeDiff < 24 * 60 * 60 * 1000) {
        // 24 hours in milliseconds
        riskScore += 25;
        indicators.push('Rapid account creation detected (within 24 hours)');
        break;
      }
    }

    // Analyze email patterns
    const emailAnalysis = analyzeEmailPatterns(users);
    riskScore += emailAnalysis.riskScore;
    indicators.push(...emailAnalysis.indicators);

    // Analyze geographic patterns
    const geoAnalysis = analyzeGeographicPatterns(users);
    riskScore += geoAnalysis.riskScore;
    indicators.push(...geoAnalysis.indicators);

    return {
      riskScore: Math.min(riskScore, 100),
      indicators,
      users,
      details: {
        userCount: users.length,
        creationSpan:
          creationDates[creationDates.length - 1] - creationDates[0],
        emailAnalysis,
        geoAnalysis
      }
    };
  } catch (err) {
    logger.error('Error in analyzeSharedPayerID:', err);
    throw err;
  }
}

/**
 * Analyze email patterns for fraud indicators
 * @param {Array} users - Array of user objects
 * @returns {Object} Analysis result with risk score and indicators
 */
function analyzeEmailPatterns(users) {
  let riskScore = 0;
  const indicators = [];

  // Check for sequential email patterns
  const emails = users.map((u) => u.email.toLowerCase());
  const emailPrefixes = emails.map((email) => email.split('@')[0]);
  const emailDomains = emails.map((email) => email.split('@')[1]);

  // Sequential username patterns (user1, user2, user3, etc.)
  const sequentialPattern = /^(.+?)(\d+)$/;
  const sequentialGroups = {};

  for (const prefix of emailPrefixes) {
    const match = prefix.match(sequentialPattern);
    if (match) {
      const base = match[1];
      if (!sequentialGroups[base]) sequentialGroups[base] = [];
      sequentialGroups[base].push(Number.parseInt(match[2], 10));
    }
  }

  for (const numbers of Object.values(sequentialGroups)) {
    if (numbers.length >= 3) {
      numbers.sort((a, b) => a - b);
      let consecutive = 1;
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] === numbers[i - 1] + 1) {
          consecutive++;
        } else {
          consecutive = 1;
        }

        if (consecutive >= 3) {
          riskScore += 30;
          indicators.push(
            'Sequential email pattern detected (e.g., user1, user2, user3)'
          );
          break;
        }
      }
    }
  }

  // Same domain, multiple accounts
  const uniqueDomains = [...new Set(emailDomains)];
  if (uniqueDomains.length === 1 && users.length > 2) {
    riskScore += 20;
    indicators.push(
      `Multiple accounts (${users.length}) from same email domain: ${uniqueDomains[0]}`
    );
  }

  // Very similar email addresses
  const similarityThreshold = 0.8;
  for (let i = 0; i < emails.length; i++) {
    for (let j = i + 1; j < emails.length; j++) {
      const similarity = calculateStringSimilarity(emails[i], emails[j]);
      if (similarity > similarityThreshold) {
        riskScore += 15;
        indicators.push(
          `Highly similar email addresses detected: ${emails[i]} and ${emails[j]}`
        );
      }
    }
  }

  return { riskScore: Math.min(riskScore, 100), indicators };
}

/**
 * Analyze geographic patterns for anomalies
 * @param {Array} users - Array of user objects
 * @returns {Object} Analysis result with risk score and indicators
 */
function analyzeGeographicPatterns(users) {
  let riskScore = 0;
  const indicators = [];

  // Analyze timezone patterns
  const timezones = users.map((u) => u.timezone).filter(Boolean);
  const uniqueTimezones = [...new Set(timezones)];

  if (uniqueTimezones.length > 1 && timezones.length > 1) {
    // Calculate timezone spread (simplified - assumes timezone strings are comparable)
    const timezoneOffsets = uniqueTimezones.map((tz) => {
      // This is a simplified approach - in production, use a proper timezone library
      const match = tz.match(/([+-]\d{2}):?(\d{2})/);
      if (match) {
        return (
          Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10)
        );
      }

      return 0;
    });

    const maxOffset = Math.max(...timezoneOffsets);
    const minOffset = Math.min(...timezoneOffsets);
    const spread = Math.abs(maxOffset - minOffset);

    if (spread > 720) {
      // More than 12 hours apart
      riskScore += 25;
      indicators.push(
        `Accounts from widely different timezones (${spread / 60} hours apart)`
      );
    }
  }

  return { riskScore, indicators };
}

/**
 * Analyze individual user for fraud indicators
 * @param {Object} user - User object
 * @returns {Object} Analysis result with risk score and indicators
 */
async function analyzeUserAccount(user) {
  let riskScore = 0;
  const indicators = [];

  try {
    const now = dayjs();
    const accountAge = now.diff(user.created_at, 'days');

    // Plan expiration analysis
    if (user[config.userFields.planExpiresAt]) {
      const planExpiry = dayjs(user[config.userFields.planExpiresAt]);
      const daysPastDue = now.diff(planExpiry, 'days');

      // Account expired more than 3 months ago
      if (daysPastDue > 90) {
        riskScore += 40;
        indicators.push(`Plan expired ${daysPastDue} days ago`);
      }

      // Short-lived accounts with expired plans
      if (accountAge < 30 && daysPastDue > 7) {
        riskScore += 30;
        indicators.push(
          `Short-lived account (${accountAge} days) with expired plan`
        );
      }
    }

    // Email verification analysis
    if (!user.has_verified_email) {
      riskScore += 15;
      indicators.push('Unverified email address');
    }

    // Domain and alias analysis
    const verifiedDomains = await Domains.countDocuments({
      members: {
        $elemMatch: {
          user: user._id,
          group: 'admin'
        }
      },
      has_txt_record: true
    });

    // Paid plan with no verified domains
    if (
      verifiedDomains === 0 &&
      ['enhanced_protection', 'team', 'enterprise'].includes(user.plan)
    ) {
      riskScore += 35;
      indicators.push('Paid plan with zero verified domains');
    }

    // Old account with minimal activity
    if (accountAge > 30 && verifiedDomains === 0) {
      const totalDomains = await Domains.countDocuments({
        members: {
          $elemMatch: {
            user: user._id,
            group: 'admin'
          }
        }
      });

      if (totalDomains === 0) {
        riskScore += 20;
        indicators.push(
          `Old account (${accountAge} days) with no domains or activity`
        );
      }
    }

    return { riskScore: Math.min(riskScore, 100), indicators };
  } catch (err) {
    logger.error('Error in analyzeUserAccount:', err);
    return { riskScore: 0, indicators: ['Error analyzing user account'] };
  }
}

/**
 * Check if users are in grace period
 * @param {Array} users - Array of user objects
 * @returns {Object} Grace period status and reason
 */
function checkGracePeriod(users) {
  const now = dayjs();

  // New accounts get grace period
  const hasNewAccounts = users.some((u) => now.diff(u.created_at, 'days') < 7);
  if (hasNewAccounts) {
    return {
      inGracePeriod: true,
      reason: 'New account grace period (< 7 days)'
    };
  }

  // Recently verified accounts get grace period
  const hasRecentlyVerified = users.some(
    (u) =>
      u.has_verified_email &&
      u.email_verified_at &&
      now.diff(u.email_verified_at, 'days') < 3
  );

  if (hasRecentlyVerified) {
    return {
      inGracePeriod: true,
      reason: 'Recently verified email (< 3 days)'
    };
  }

  return { inGracePeriod: false, reason: null };
}

/**
 * Determine action based on risk score
 * @param {number} riskScore - Total risk score
 * @param {Object} gracePeriodStatus - Grace period check result
 * @returns {Object} Recommended action and priority
 */
function determineAction(riskScore, gracePeriodStatus) {
  // Reduce severity if in grace period
  if (gracePeriodStatus.inGracePeriod) {
    riskScore = Math.max(0, riskScore - 20);
  }

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
 * Generate detailed fraud analysis report
 * @param {Object} analysis - Complete analysis results
 * @returns {Object} Formatted report
 */
function generateFraudReport(analysis) {
  return {
    timestamp: new Date().toISOString(),
    paypalPayerId: analysis.paypalPayerId,
    totalRiskScore: analysis.totalRiskScore,
    severity: analysis.action.priority,
    recommendedAction: analysis.action.action,
    userCount: analysis.users.length,
    summary: {
      sharedPayerRisk: analysis.sharedPayerAnalysis.riskScore,
      individualRisks: analysis.individualAnalyses.map((a) => a.riskScore),
      averageIndividualRisk:
        analysis.individualAnalyses.reduce((sum, a) => sum + a.riskScore, 0) /
        analysis.individualAnalyses.length
    },
    indicators: analysis.allIndicators,
    affectedUsers: analysis.users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      createdAt: u.created_at,
      plan: u.plan,
      hasVerifiedEmail: u.has_verified_email,
      planExpiresAt: u[config.userFields.planExpiresAt]
    })),
    evidence: {
      sharedPayerAnalysis: analysis.sharedPayerAnalysis,
      individualAnalyses: analysis.individualAnalyses,
      emailPatterns: analysis.sharedPayerAnalysis.details?.emailAnalysis,
      geographicPatterns: analysis.sharedPayerAnalysis.details?.geoAnalysis
    },
    gracePeriodStatus: analysis.gracePeriodStatus,
    actionTaken: analysis.action
  };
}

/**
 * Calculate string similarity using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score between 0 and 1
 */
function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Main fraud detection function
 */
(async () => {
  await setupMongoose(logger);

  try {
    logger.info('Starting enhanced PayPal fraud detection analysis...');

    // Get all distinct PayPal payer IDs
    const paypalPayerIds = await Users.distinct('paypal_payer_id', {
      paypal_payer_id: { $exists: true, $ne: null },
      [config.userFields.isBanned]: false,
      has_passed_kyc: false
    });

    logger.info(
      `Found ${paypalPayerIds.length} unique PayPal payer IDs to analyze`
    );

    const suspiciousReports = [];
    let totalAnalyzed = 0;
    let totalSuspicious = 0;

    // Analyze each PayPal payer ID
    await pMap(
      paypalPayerIds,
      async (paypalPayerId) => {
        try {
          totalAnalyzed++;

          // Analyze shared payer ID patterns
          const sharedPayerAnalysis = await analyzeSharedPayerID(paypalPayerId);

          if (sharedPayerAnalysis.users.length <= 1) {
            return; // Skip single-user payer IDs
          }

          // Analyze each individual user
          const individualAnalyses = await pMap(
            sharedPayerAnalysis.users,
            analyzeUserAccount,
            { concurrency: 5 }
          );

          // Calculate total risk score
          const totalRiskScore = Math.min(
            sharedPayerAnalysis.riskScore +
              individualAnalyses.reduce(
                (sum, analysis) => sum + analysis.riskScore,
                0
              ) /
                individualAnalyses.length,
            100
          );

          // Collect all indicators
          const allIndicators = [
            ...sharedPayerAnalysis.indicators,
            ...individualAnalyses.flatMap((analysis) => analysis.indicators)
          ];

          // Check grace period
          const gracePeriodStatus = checkGracePeriod(sharedPayerAnalysis.users);

          // Determine action
          const action = determineAction(totalRiskScore, gracePeriodStatus);

          // Only report if action is needed
          if (action.action !== 'NO_ACTION') {
            totalSuspicious++;

            const analysis = {
              paypalPayerId,
              totalRiskScore,
              users: sharedPayerAnalysis.users,
              sharedPayerAnalysis,
              individualAnalyses,
              allIndicators,
              gracePeriodStatus,
              action
            };

            const report = generateFraudReport(analysis);
            suspiciousReports.push(report);

            logger.warn(
              `Suspicious PayPal activity detected: ${paypalPayerId}`,
              {
                riskScore: totalRiskScore,
                action: action.action,
                userCount: sharedPayerAnalysis.users.length,
                indicators: allIndicators.slice(0, 3) // Log first 3 indicators
              }
            );
          }
        } catch (err) {
          logger.error(
            `Error analyzing PayPal payer ID ${paypalPayerId}:`,
            err
          );
        }
      },
      { concurrency: config.concurrency || 10 }
    );

    logger.info(
      `Analysis complete: ${totalAnalyzed} payer IDs analyzed, ${totalSuspicious} suspicious cases found`
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
        await sendFraudAlert('critical', criticalReports);
      }

      // Send high priority alerts
      if (highReports.length > 0) {
        await sendFraudAlert('high', highReports);
      }

      // Send medium priority summary
      if (mediumReports.length > 0) {
        await sendFraudAlert('medium', mediumReports);
      }

      // Log low priority for monitoring
      if (lowReports.length > 0) {
        logger.info(
          `${lowReports.length} low-priority fraud indicators detected`,
          {
            payerIds: lowReports.map((r) => r.paypalPayerId)
          }
        );
      }

      logger.info(
        `Fraud detection complete: ${suspiciousReports.length} reports generated`
      );
    } else {
      logger.info('No suspicious PayPal activity detected');
    }
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'PayPal Fraud Alert Error'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();

/**
 * Send fraud alert email
 * @param {string} severity - Alert severity level
 * @param {Array} reports - Array of fraud reports
 */
async function sendFraudAlert(severity, reports) {
  try {
    const severityConfig = {
      critical: {
        subject: '🚨 CRITICAL: PayPal Fraud Detection Alert',
        emoji: '🚨',
        color: '#dc3545'
      },
      high: {
        subject: '⚠️ HIGH RISK: PayPal Account Review Required',
        emoji: '⚠️',
        color: '#fd7e14'
      },
      medium: {
        subject: '📊 PayPal Fraud Detection Report',
        emoji: '📊',
        color: '#ffc107'
      }
    };

    const config_severity = severityConfig[severity];
    const totalUsers = reports.reduce((sum, r) => sum + r.userCount, 0);
    // const avgRiskScore =
    //   reports.reduce((sum, r) => sum + r.totalRiskScore, 0) / reports.length;

    // Generate HTML report
    const htmlReport = generateHTMLReport(reports, severity, config_severity);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `${config_severity.subject} (${reports.length} cases, ${totalUsers} users)`
      },
      locals: {
        message: htmlReport
      }
    });

    logger.info(
      `${severity.toUpperCase()} fraud alert sent: ${
        reports.length
      } cases, ${totalUsers} users affected`
    );
  } catch (err) {
    logger.error(`Error sending ${severity} fraud alert:`, err);
  }
}

/**
 * Generate HTML report for email
 * @param {Array} reports - Array of fraud reports
 * @param {string} severity - Alert severity
 * @param {Object} severityConfig - Severity configuration
 * @returns {string} HTML report
 */
function generateHTMLReport(reports, severity, severityConfig) {
  const totalUsers = reports.reduce((sum, r) => sum + r.userCount, 0);
  const avgRiskScore = Math.round(
    reports.reduce((sum, r) => sum + r.totalRiskScore, 0) / reports.length
  );

  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: ${severityConfig.color};">
        ${
          severityConfig.emoji
        } PayPal Fraud Detection Alert - ${severity.toUpperCase()}
      </h2>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Summary</h3>
        <ul>
          <li><strong>Cases Detected:</strong> ${reports.length}</li>
          <li><strong>Total Users Affected:</strong> ${totalUsers}</li>
          <li><strong>Average Risk Score:</strong> ${avgRiskScore}/100</li>
          <li><strong>Detection Time:</strong> ${new Date().toISOString()}</li>
        </ul>
      </div>
  `;

  for (const [index, report] of reports.entries()) {
    html += `
      <div style="border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0; padding: 15px;">
        <h4 style="color: ${severityConfig.color}; margin-top: 0;">
          Case ${index + 1}: PayPal ID ${report.paypalPayerId}
        </h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
          <div>
            <strong>Risk Score:</strong> ${report.totalRiskScore}/100<br>
            <strong>Action Required:</strong> ${report.recommendedAction}<br>
            <strong>Users Affected:</strong> ${report.userCount}
          </div>
          <div>
            <strong>Shared Payer Risk:</strong> ${
              report.summary.sharedPayerRisk
            }/100<br>
            <strong>Avg Individual Risk:</strong> ${Math.round(
              report.summary.averageIndividualRisk
            )}/100
          </div>
        </div>

        <div style="margin: 15px 0;">
          <strong>Key Indicators:</strong>
          <ul style="margin: 5px 0;">
            ${report.indicators
              .slice(0, 5)
              .map((indicator) => `<li>${indicator}</li>`)
              .join('')}
            ${
              report.indicators.length > 5
                ? `<li><em>... and ${
                    report.indicators.length - 5
                  } more</em></li>`
                : ''
            }
          </ul>
        </div>

        <div style="margin: 15px 0;">
          <strong>Affected Users:</strong>
          <ul style="margin: 5px 0; font-size: 12px;">
            ${report.affectedUsers
              .map(
                (user) => `
              <li>
                ${user.email} (${user.plan}, Created: ${new Date(
                  user.createdAt
                ).toLocaleDateString()})
                ${
                  user.hasVerifiedEmail
                    ? ''
                    : ' <span style="color: #dc3545;">[Unverified]</span>'
                }
              </li>
            `
              )
              .join('')}
          </ul>
        </div>

        ${
          report.gracePeriodStatus.inGracePeriod
            ? `
          <div style="background: #fff3cd; color: #856404; padding: 10px; border-radius: 3px; margin: 10px 0;">
            <strong>Grace Period:</strong> ${report.gracePeriodStatus.reason}
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  html += `
      <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 12px;">
        <h4>Next Steps</h4>
        <ul>
          <li><strong>Critical/High:</strong> Review accounts immediately and consider temporary suspension</li>
          <li><strong>Medium:</strong> Monitor closely and investigate within 24 hours</li>
          <li><strong>Low:</strong> Add to monitoring list for pattern analysis</li>
        </ul>

        <p><strong>Note:</strong> This is an automated detection system. Please verify findings before taking action on user accounts.</p>
      </div>
    </div>
  `;

  return html;
}
