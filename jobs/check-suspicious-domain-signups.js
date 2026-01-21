/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
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
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const setupMongoose = require('#helpers/setup-mongoose');

const Users = require('#models/users');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

// Create Tangerine DNS resolver
const resolver = createTangerine(client, logger);

//
// Configuration for detection thresholds
//
const DETECTION_CONFIG = {
  // Time windows to analyze
  // Adjusted based on real fraud patterns (yunextai.com, bojoyai.com)
  // These domains had 10-15 signups over 7-13 days (2-3 per day)
  timeWindows: [
    { hours: 1, threshold: 3, severity: 'critical' }, // 3+ signups in 1 hour (rapid automated)
    { hours: 6, threshold: 5, severity: 'high' }, // 5+ signups in 6 hours
    { hours: 24, threshold: 8, severity: 'high' }, // 8+ signups in 24 hours
    { hours: 72, threshold: 10, severity: 'medium' }, // 10+ signups in 3 days
    { hours: 168, threshold: 12, severity: 'medium' } // 12+ signups in 1 week (catches slower fraud)
  ],
  // Minimum threshold to report (lowered to catch smaller attacks)
  minThreshold: 3,
  // Concurrency for MX lookups
  concurrency: 10,
  // Pattern detection thresholds
  patterns: {
    highEntropyThreshold: 0.7, // Shannon entropy threshold (0-1)
    similarLengthThreshold: 0.7, // 70% of emails have similar length
    consistentStructureThreshold: 0.6, // 60% share same structure
    minSampleSize: 3 // Minimum emails needed for pattern analysis
  }
};

/**
 * Check if a domain's MX records resolve to a truth source
 * @param {string} domain - Domain to check
 * @returns {Promise<Object>} Result with isTruthSource flag and details
 */
async function checkDomainMXRecords(domain) {
  try {
    // Try to resolve MX records
    const mxRecords = await resolver.resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        isTruthSource: false,
        hasMX: false,
        reason: 'No MX records found'
      };
    }

    // Check if any MX record's root domain matches a truth source
    for (const mx of mxRecords) {
      const mxHostname = mx.exchange || mx;
      const rootDomain = parseRootDomain(mxHostname);

      // Check against truth sources
      if (config.truthSources.has(rootDomain)) {
        return {
          isTruthSource: true,
          hasMX: true,
          mxHostname,
          rootDomain,
          reason: `MX resolves to truth source: ${rootDomain}`
        };
      }
    }

    return {
      isTruthSource: false,
      hasMX: true,
      mxRecords: mxRecords.map((mx) => mx.exchange || mx),
      reason: 'MX records do not resolve to truth sources'
    };
  } catch (err) {
    logger.debug(`MX lookup failed for ${domain}:`, err.message);
    return {
      isTruthSource: false,
      hasMX: false,
      error: err.message,
      reason: 'MX lookup failed'
    };
  }
}

/**
 * Calculate Shannon entropy of a string (measure of randomness)
 * @param {string} str - String to analyze
 * @returns {number} Entropy value (0-1, higher = more random)
 */
function calculateEntropy(str) {
  if (!str || str.length === 0) return 0;

  const frequencies = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  const { length } = str;

  for (const count of Object.values(frequencies)) {
    const probability = count / length;
    entropy -= probability * Math.log2(probability);
  }

  // Normalize to 0-1 range (max entropy for alphanumeric is ~5.17 bits)
  return Math.min(entropy / 5.17, 1);
}

/**
 * Detect if email prefixes have high entropy (random-looking)
 * @param {Array<string>} prefixes - Email prefixes to analyze
 * @returns {Object} Analysis result
 */
function detectHighEntropyPrefixes(prefixes) {
  if (prefixes.length < DETECTION_CONFIG.patterns.minSampleSize) {
    return { detected: false, avgEntropy: 0, highEntropyCount: 0 };
  }

  const entropies = prefixes.map((p) => calculateEntropy(p));
  const avgEntropy =
    entropies.reduce((sum, e) => sum + e, 0) / entropies.length;

  const highEntropyCount = entropies.filter(
    (e) => e >= DETECTION_CONFIG.patterns.highEntropyThreshold
  ).length;

  const highEntropyRatio = highEntropyCount / prefixes.length;

  return {
    detected: highEntropyRatio >= 0.7, // 70% of prefixes are high entropy
    avgEntropy: Math.round(avgEntropy * 100) / 100,
    highEntropyCount,
    highEntropyRatio: Math.round(highEntropyRatio * 100) / 100,
    samples: prefixes.slice(0, 5) // Show first 5 as examples
  };
}

/**
 * Detect if email prefixes have similar lengths (automated generation)
 * @param {Array<string>} prefixes - Email prefixes to analyze
 * @returns {Object} Analysis result
 */
function detectSimilarLengths(prefixes) {
  if (prefixes.length < DETECTION_CONFIG.patterns.minSampleSize) {
    return { detected: false, lengthGroups: {} };
  }

  const lengthGroups = {};
  for (const prefix of prefixes) {
    const len = prefix.length;
    lengthGroups[len] = (lengthGroups[len] || 0) + 1;
  }

  // Find the most common length
  let maxCount = 0;
  let dominantLength = 0;
  for (const [len, count] of Object.entries(lengthGroups)) {
    if (count > maxCount) {
      maxCount = count;
      dominantLength = Number.parseInt(len, 10);
    }
  }

  const similarLengthRatio = maxCount / prefixes.length;

  return {
    detected:
      similarLengthRatio >= DETECTION_CONFIG.patterns.similarLengthThreshold,
    dominantLength,
    count: maxCount,
    ratio: Math.round(similarLengthRatio * 100) / 100,
    lengthGroups
  };
}

/**
 * Detect consistent character patterns (e.g., all have 4 digits at end)
 * @param {Array<string>} prefixes - Email prefixes to analyze
 * @returns {Object} Analysis result
 */
function detectConsistentStructure(prefixes) {
  if (prefixes.length < DETECTION_CONFIG.patterns.minSampleSize) {
    return { detected: false, patterns: [] };
  }

  const patterns = {
    endsWithDigits: 0, // Ends with 4 digits (e.g., user1234)
    allLowercase: 0, // All lowercase
    allAlphanumeric: 0, // Only letters and numbers
    hasDigitsEmbedded: 0, // Has digits in the middle
    noRealWords: 0 // Doesn't look like real words
  };

  for (const prefix of prefixes) {
    // Check if ends with 4 digits
    if (/\d{4}$/.test(prefix)) patterns.endsWithDigits++;

    // Check if all lowercase
    if (prefix === prefix.toLowerCase() && /[a-z]/.test(prefix))
      patterns.allLowercase++;

    // Check if alphanumeric only
    if (/^[a-z\d]+$/i.test(prefix)) patterns.allAlphanumeric++;

    // Check if has digits embedded (not just at start/end)
    if (/[a-z]\d|\d[a-z]/i.test(prefix)) patterns.hasDigitsEmbedded++;

    // Check if looks like random characters (not real words)
    // Real names/words typically have vowel patterns
    const vowelRatio = (prefix.match(/[aeiou]/gi) || []).length / prefix.length;
    if (vowelRatio < 0.2 || vowelRatio > 0.6) patterns.noRealWords++;
  }

  const detectedPatterns = [];
  const total = prefixes.length;

  if (patterns.endsWithDigits / total >= 0.6) {
    detectedPatterns.push(
      `${patterns.endsWithDigits}/${total} end with 4 digits`
    );
  }

  if (patterns.allLowercase / total >= 0.8) {
    detectedPatterns.push(`${patterns.allLowercase}/${total} all lowercase`);
  }

  if (patterns.allAlphanumeric / total >= 0.9) {
    detectedPatterns.push(
      `${patterns.allAlphanumeric}/${total} alphanumeric only`
    );
  }

  if (patterns.hasDigitsEmbedded / total >= 0.7) {
    detectedPatterns.push(
      `${patterns.hasDigitsEmbedded}/${total} have embedded digits`
    );
  }

  if (patterns.noRealWords / total >= 0.7) {
    detectedPatterns.push(
      `${patterns.noRealWords}/${total} don't resemble real words`
    );
  }

  return {
    detected: detectedPatterns.length >= 2, // At least 2 consistent patterns
    patterns: detectedPatterns,
    details: patterns
  };
}

/**
 * Analyze signup patterns for a domain
 * @param {string} domain - Domain to analyze
 * @param {Array} users - Users with this domain
 * @returns {Object} Analysis result
 */
function analyzeSignupPatterns(domain, users) {
  const analysis = {
    domain,
    totalUsers: users.length,
    patterns: [],
    riskIndicators: []
  };

  // Sort users by creation date
  const sortedUsers = users.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  // Analyze each time window
  for (const window of DETECTION_CONFIG.timeWindows) {
    const cutoffTime = dayjs().subtract(window.hours, 'hours').toDate();
    const recentUsers = sortedUsers.filter(
      (u) => new Date(u.created_at) >= cutoffTime
    );

    if (recentUsers.length >= window.threshold) {
      analysis.patterns.push({
        timeWindow: `${window.hours} hours`,
        userCount: recentUsers.length,
        threshold: window.threshold,
        severity: window.severity,
        exceeded: recentUsers.length - window.threshold
      });
    }
  }

  // Extract email prefixes for advanced pattern analysis
  const emailPrefixes = users.map((u) => u.email.split('@')[0]);

  // Advanced pattern detection
  const entropyAnalysis = detectHighEntropyPrefixes(emailPrefixes);
  if (entropyAnalysis.detected) {
    analysis.riskIndicators.push(
      `High entropy detected: ${entropyAnalysis.highEntropyCount}/${emailPrefixes.length} prefixes are random-looking (avg entropy: ${entropyAnalysis.avgEntropy})`,
      `Sample prefixes: ${entropyAnalysis.samples.join(', ')}`
    );
  }

  const lengthAnalysis = detectSimilarLengths(emailPrefixes);
  if (lengthAnalysis.detected) {
    analysis.riskIndicators.push(
      `Similar length pattern: ${lengthAnalysis.count}/${
        emailPrefixes.length
      } prefixes have length ${lengthAnalysis.dominantLength} (${Math.round(
        lengthAnalysis.ratio * 100
      )}%)`
    );
  }

  const structureAnalysis = detectConsistentStructure(emailPrefixes);
  if (structureAnalysis.detected) {
    analysis.riskIndicators.push(
      `Consistent structure patterns detected: ${structureAnalysis.patterns.join(
        '; '
      )}`
    );
  }

  // Keep simple checks for obvious patterns
  const numericPrefixes = emailPrefixes.filter((p) => /^\d+$/.test(p));
  if (numericPrefixes.length >= 3) {
    analysis.riskIndicators.push(
      `${numericPrefixes.length} numeric-only email prefixes`
    );
  }

  return analysis;
}

/**
 * Calculate overall risk score for a domain
 * @param {Object} analysis - Domain analysis
 * @param {Object} mxCheck - MX check result
 * @returns {number} Risk score (0-100)
 */
function calculateRiskScore(analysis, mxCheck) {
  let score = 0;

  // Base score from time-based patterns
  for (const pattern of analysis.patterns) {
    switch (pattern.severity) {
      case 'critical': {
        score += 40;
        break;
      }

      case 'high': {
        score += 30;
        break;
      }

      case 'medium': {
        score += 20;
        break;
      }

      case 'low': {
        score += 10;
        break;
      }
      // No default
    }
  }

  // Advanced pattern indicators are worth more
  const advancedIndicators = analysis.riskIndicators.filter(
    (i) =>
      i.includes('entropy') ||
      i.includes('Similar length') ||
      i.includes('Consistent structure')
  );

  score += Math.min(advancedIndicators.length * 15, 45); // Max 45 points for advanced patterns

  // Simple indicators worth less
  const simpleIndicators =
    analysis.riskIndicators.length - advancedIndicators.length;
  score += Math.min(simpleIndicators * 5, 15); // Max 15 points for simple patterns

  // Bonus points if no MX records (likely fake domain)
  if (!mxCheck.hasMX) {
    score += 20;
  }

  return Math.min(score, 100);
}

/**
 * Determine severity level based on risk score
 * @param {number} riskScore - Risk score
 * @returns {string} Severity level
 */
function getSeverityLevel(riskScore) {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
}

/**
 * Generate detailed report for a suspicious domain
 * @param {Object} analysis - Domain analysis
 * @param {Object} mxCheck - MX check result
 * @param {number} riskScore - Risk score
 * @param {Array} users - User list for the domain
 * @returns {Object} Report object
 */
function generateDomainReport(analysis, mxCheck, riskScore, users) {
  const severity = getSeverityLevel(riskScore);

  return {
    domain: analysis.domain,
    severity,
    riskScore,
    totalUsers: analysis.totalUsers,
    isTruthSource: mxCheck.isTruthSource,
    hasMX: mxCheck.hasMX,
    mxReason: mxCheck.reason,
    patterns: analysis.patterns,
    riskIndicators: analysis.riskIndicators,
    recommendation: getRecommendation(severity, riskScore),
    users: users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      created_at: u.created_at
    }))
  };
}

/**
 * Get recommended action based on severity
 * @param {string} severity - Severity level
 * @param {number} _riskScore - Risk score (reserved for future use)
 * @returns {string} Recommendation
 */
function getRecommendation(severity, _riskScore) {
  if (severity === 'critical') {
    return 'IMMEDIATE ACTION REQUIRED: Manually review and ban all users from this domain, refund payments, and add domain to denylist';
  }

  if (severity === 'high') {
    return 'HIGH PRIORITY: Manually review all accounts, check payment patterns, and consider banning';
  }

  if (severity === 'medium') {
    return 'MEDIUM PRIORITY: Monitor closely and review account activity';
  }

  return 'LOW PRIORITY: Continue monitoring for escalation';
}

/**
 * Send security alert email with suspicious domain reports
 * @param {string} severity - Alert severity
 * @param {Array} reports - Array of domain reports
 */
async function sendSecurityAlert(severity, reports) {
  if (reports.length === 0) return;

  try {
    const totalUsers = reports.reduce((sum, r) => sum + r.totalUsers, 0);

    const reportsHtml = reports
      .map((report, index) =>
        `
<div style="border: 1px solid #ccc; border-radius: 8px; padding: 20px; margin: 15px 0; background: ${
          report.severity === 'critical'
            ? '#fff5f5'
            : report.severity === 'high'
            ? '#fff8e1'
            : '#f9f9f9'
        };">
  <h3 style="margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${
    report.severity === 'critical'
      ? '#dc3545'
      : report.severity === 'high'
      ? '#fd7e14'
      : '#6c757d'
  };">
    ${index + 1}. ${report.domain}
    <span style="float: right; font-size: 14px; color: ${
      report.severity === 'critical'
        ? '#dc3545'
        : report.severity === 'high'
        ? '#fd7e14'
        : '#6c757d'
    }; text-transform: uppercase;">${report.severity}</span>
  </h3>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; width: 40%;"><strong>Risk Score</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">
        <span style="color: ${
          report.riskScore >= 80
            ? '#dc3545'
            : report.riskScore >= 60
            ? '#fd7e14'
            : '#212529'
        }; font-weight: bold; font-size: 18px;">${report.riskScore}/100</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Total Users</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${
        report.totalUsers
      }</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Has MX Records</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${
        report.hasMX ? '✅ Yes' : '❌ No'
      }</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;"><strong>MX Status</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${report.mxReason}</td>
    </tr>
  </table>

  ${
    report.patterns.length > 0
      ? `
  <div style="margin-bottom: 15px;">
    <h4 style="margin: 0 0 10px 0; color: #495057;">Suspicious Patterns</h4>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="background: #f8f9fa;">
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Time Window</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Signups</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Threshold</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Exceeded By</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Severity</th>
      </tr>
      ${report.patterns
        .map(
          (p) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.timeWindow}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${
          p.userCount
        }</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
          p.threshold
        }</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: #dc3545;">+${
          p.exceeded
        }</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
          <span style="color: ${
            p.severity === 'critical'
              ? '#dc3545'
              : p.severity === 'high'
              ? '#fd7e14'
              : '#6c757d'
          }; text-transform: uppercase; font-weight: bold;">${p.severity}</span>
        </td>
      </tr>`
        )
        .join('')}
    </table>
  </div>
  `
      : ''
  }

  ${
    report.riskIndicators.length > 0
      ? `
  <div style="margin-bottom: 15px;">
    <h4 style="margin: 0 0 10px 0; color: #495057;">Risk Indicators</h4>
    <ul style="margin: 0; padding-left: 20px;">
      ${report.riskIndicators
        .map((i) => `<li style="margin-bottom: 5px;">${i}</li>`)
        .join('')}
    </ul>
  </div>
  `
      : ''
  }

  <div style="background: ${
    report.severity === 'critical'
      ? '#f8d7da'
      : report.severity === 'high'
      ? '#fff3cd'
      : '#e2e3e5'
  }; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
    <strong>Recommendation:</strong> ${report.recommendation}
  </div>

  <div>
    <h4 style="margin: 0 0 10px 0; color: #495057;">Affected Users (${
      report.users.length
    })</h4>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <tr style="background: #f8f9fa;">
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">#</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Email</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Created</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Admin Link</th>
      </tr>
      ${report.users
        .map(
          (user, i) => `
      <tr>
        <td style="padding: 6px 8px; border: 1px solid #ddd;">${i + 1}</td>
        <td style="padding: 6px 8px; border: 1px solid #ddd; font-family: monospace;">${
          user.email
        }</td>
        <td style="padding: 6px 8px; border: 1px solid #ddd;">${dayjs(
          user.created_at
        ).format('YYYY-MM-DD HH:mm')}</td>
        <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: center;">
          <a href="${config.urls.web}/en/admin/users/${
            user.id
          }" style="color: #007bff; text-decoration: none;">View User</a>
        </td>
      </tr>`
        )
        .join('')}
    </table>
  </div>
</div>
    `.trim()
      )
      .join('\n\n');

    const summaryHtml = `
<h2 style="color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">
  🚨 Suspicious Domain Signup Detection Report
</h2>

<div style="background: ${
      severity === 'critical'
        ? '#f8d7da'
        : severity === 'high'
        ? '#fff3cd'
        : '#e2e3e5'
    }; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
  <strong>Alert Level:</strong>
  <span style="color: ${
    severity === 'critical'
      ? '#dc3545'
      : severity === 'high'
      ? '#fd7e14'
      : '#212529'
  }; font-weight: bold; text-transform: uppercase; font-size: 18px; margin-left: 10px;">${severity}</span>
</div>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
  <tr style="background: #343a40; color: white;">
    <th style="padding: 12px; text-align: left;" colspan="2">Summary</th>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa; width: 50%;"><strong>Suspicious Domains Detected</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">${
      reports.length
    }</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Total Users Affected</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">${totalUsers}</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Critical Severity</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">
      <span style="color: #dc3545; font-weight: bold;">${
        reports.filter((r) => r.severity === 'critical').length
      }</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>High Severity</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">
      <span style="color: #fd7e14; font-weight: bold;">${
        reports.filter((r) => r.severity === 'high').length
      }</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Medium Severity</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">${
      reports.filter((r) => r.severity === 'medium').length
    }</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Low Severity</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">${
      reports.filter((r) => r.severity === 'low').length
    }</td>
  </tr>
</table>

<h3 style="color: #212529; border-bottom: 1px solid #dee2e6; padding-bottom: 8px;">Detailed Reports</h3>
${reportsHtml}

<hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
<p style="color: #6c757d; font-size: 12px;">
  <em>This is an automated fraud detection alert. Please review and take appropriate action manually.</em>
</p>
    `.trim();

    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `🚨 ${severity.toUpperCase()} SECURITY ALERT: ${
          reports.length
        } Suspicious Domain(s) Detected - ${totalUsers} Users`
      },
      locals: {
        message: summaryHtml
      }
    });

    logger.info(
      `${severity.toUpperCase()} security alert sent: ${
        reports.length
      } domains, ${totalUsers} users`
    );
  } catch (err) {
    logger.error(`Error sending ${severity} security alert:`, err);
  }
}

/**
 * Main detection function
 */
(async () => {
  await setupMongoose(logger);

  const startTime = Date.now();

  try {
    logger.info('Starting suspicious domain signup detection...');

    //
    // Get all users created in the last week (to cover all time windows)
    //
    const cutoffDate = dayjs().subtract(168, 'hours').toDate(); // 1 week
    const recentUsers = await Users.find({
      created_at: { $gte: cutoffDate },
      [config.userFields.isBanned]: false
    })
      .select('_id email created_at')
      .lean()
      .exec();

    logger.info(
      `Found ${recentUsers.length} users created in the last week to analyze`
    );

    if (recentUsers.length === 0) {
      logger.info('No recent users to analyze');
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    //
    // Group users by domain
    //
    const domainGroups = {};
    for (const user of recentUsers) {
      const domain = parseHostFromDomainOrAddress(user.email);
      if (!domainGroups[domain]) {
        domainGroups[domain] = [];
      }

      domainGroups[domain].push(user);
    }

    logger.info(
      `Grouped users into ${Object.keys(domainGroups).length} domains`
    );

    //
    // Filter domains that meet minimum threshold
    //
    const suspiciousDomains = Object.entries(domainGroups).filter(
      ([, users]) => users.length >= DETECTION_CONFIG.minThreshold
    );

    logger.info(
      `Found ${suspiciousDomains.length} domains with ${DETECTION_CONFIG.minThreshold}+ signups`
    );

    if (suspiciousDomains.length === 0) {
      logger.info('No domains meet the minimum threshold for analysis');
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    //
    // Analyze each suspicious domain
    //
    const reports = [];

    await pMap(
      suspiciousDomains,
      async ([domain, users]) => {
        try {
          // Check if domain MX resolves to truth source
          const mxCheck = await checkDomainMXRecords(domain);

          // Skip if it's a truth source (legitimate provider)
          if (mxCheck.isTruthSource) {
            logger.debug(
              `Skipping ${domain} - resolves to truth source: ${mxCheck.rootDomain}`
            );
            return;
          }

          // Analyze signup patterns
          const analysis = analyzeSignupPatterns(domain, users);

          // Only report if patterns detected
          if (
            analysis.patterns.length === 0 &&
            analysis.riskIndicators.length === 0
          ) {
            logger.debug(`No suspicious patterns for ${domain}`);
            return;
          }

          // Calculate risk score
          const riskScore = calculateRiskScore(analysis, mxCheck);

          // Generate report
          const report = generateDomainReport(
            analysis,
            mxCheck,
            riskScore,
            users
          );
          reports.push(report);

          logger.warn(`Suspicious domain detected: ${domain}`, {
            riskScore,
            severity: report.severity,
            totalUsers: users.length
          });
        } catch (err) {
          logger.error(`Error analyzing domain ${domain}:`, err);
        }
      },
      { concurrency: DETECTION_CONFIG.concurrency }
    );

    const totalDuration = Date.now() - startTime;

    logger.info(
      `Analysis complete: ${reports.length} suspicious domains detected in ${totalDuration}ms`
    );

    //
    // Send alerts grouped by severity
    //
    if (reports.length > 0) {
      // Sort reports by risk score (highest first)
      reports.sort((a, b) => b.riskScore - a.riskScore);

      // Group by severity
      const criticalReports = reports.filter((r) => r.severity === 'critical');
      const highReports = reports.filter((r) => r.severity === 'high');
      const mediumReports = reports.filter((r) => r.severity === 'medium');
      const lowReports = reports.filter((r) => r.severity === 'low');

      // Send alerts
      if (criticalReports.length > 0) {
        await sendSecurityAlert('critical', criticalReports);
      }

      if (highReports.length > 0) {
        await sendSecurityAlert('high', highReports);
      }

      if (mediumReports.length > 0) {
        await sendSecurityAlert('medium', mediumReports);
      }

      if (lowReports.length > 0) {
        await sendSecurityAlert('low', lowReports);
      }

      logger.info(
        `Suspicious domain detection complete: ${reports.length} reports sent`
      );
    } else {
      logger.info('No suspicious domain patterns detected');
    }
  } catch (err) {
    await logger.error(err);

    // Send error email
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Suspicious Domain Signup Detection Job Failed'
      },
      locals: {
        message: `<p>The suspicious domain signup detection job encountered an error:</p><pre>${
          err.stack || err.message
        }</pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
