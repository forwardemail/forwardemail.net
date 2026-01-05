/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Log Alert Email Job
 *
 * Sends email activity reports to domain admins based on activity level.
 *
 * Frequency Algorithm:
 * - High priority issues (blocklist, DMARC, recipient, network errors, 4xx/5xx codes)
 *   → Every 3 days (SMTP retries for 5 days, so users need time to fix)
 * - Lower priority (spam/virus blocked only)
 *   → Every 4 days (informational, less urgent)
 * - No significant activity
 *   → No email sent
 *
 * Usage:
 *   node jobs/daily-log-alert.js
 *
 * Options:
 *   USER_EMAIL=user@example.com - Run for a single user only (useful for testing)
 *   PREVIEW_EMAIL=true - Open email in browser instead of sending
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

const Domains = require('#models/domains');
const Logs = require('#models/logs');
const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// Frequency constants (in days)
const HIGH_PRIORITY_FREQUENCY_DAYS = 3; // Issues that need user action
const LOW_PRIORITY_FREQUENCY_DAYS = 4; // Informational only (spam/virus blocked)

// High priority bounce categories that require user attention
const HIGH_PRIORITY_CATEGORIES = [
  'blocklist',
  'dmarc',
  'recipient',
  'network',
  'policy',
  'content'
];

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Get log statistics for a user's domains
 * @param {Array} domainIds - Array of domain ObjectIds
 * @param {Date} startDate - Start of the period
 * @param {Date} endDate - End of the period
 * @returns {Object} Statistics object
 */
async function getLogStats(domainIds, startDate, endDate) {
  const baseQuery = {
    domains: { $in: domainIds },
    created_at: {
      $gte: startDate,
      $lte: endDate
    }
  };

  // Get total count
  const total = await Logs.countDocuments(baseQuery);

  // Get delivered count (always, to show in email with guidance if 0)
  // This matches the analytics page logic: message: 'delivered'
  const delivered = await Logs.countDocuments({
    ...baseQuery,
    message: 'delivered'
  });

  // Get spam count
  const spam = await Logs.countDocuments({
    ...baseQuery,
    bounce_category: 'spam'
  });

  // Get virus count
  const virus = await Logs.countDocuments({
    ...baseQuery,
    bounce_category: 'virus'
  });

  // Get bounce categories breakdown
  const bounceAggregation = await Logs.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: '$bounce_category',
        count: { $sum: 1 }
      }
    }
  ]);

  const bounceCategories = {};
  for (const item of bounceAggregation) {
    if (item._id && item._id !== 'none') {
      bounceCategories[item._id] = item.count;
    }
  }

  // Get response codes breakdown with unique error messages (only for errors)
  // Group by response code and error message to get distinct messages per code
  const responseCodeAggregation = await Logs.aggregate([
    {
      $match: {
        ...baseQuery,
        'err.responseCode': { $exists: true }
      }
    },
    {
      // First group by code + message to get unique messages and their counts
      $group: {
        _id: {
          code: '$err.responseCode',
          message: '$err.message'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.code': 1, count: -1 } }
  ]);

  // Organize by response code with up to 5 unique messages per code
  const MAX_MESSAGES_PER_CODE = 5;
  const responseCodes = {};

  for (const item of responseCodeAggregation) {
    if (item._id?.code) {
      const code = item._id.code.toString();
      if (!responseCodes[code]) {
        responseCodes[code] = {
          totalCount: 0,
          messages: [],
          additionalMessagesCount: 0,
          additionalMessagesLogCount: 0
        };
      }

      responseCodes[code].totalCount += item.count;

      if (responseCodes[code].messages.length < MAX_MESSAGES_PER_CODE) {
        responseCodes[code].messages.push({
          text: item._id.message || null,
          count: item.count
        });
      } else {
        responseCodes[code].additionalMessagesCount++;
        responseCodes[code].additionalMessagesLogCount += item.count;
      }
    }
  }

  return {
    total,
    delivered,
    spam,
    virus,
    bounceCategories,
    responseCodes
  };
}

/**
 * Determine if user has high priority issues that need attention
 * @param {Object} stats - Statistics object from getLogStats
 * @returns {boolean} True if high priority issues exist
 */
function hasHighPriorityIssues(stats) {
  // Check for high priority bounce categories
  for (const category of HIGH_PRIORITY_CATEGORIES) {
    if (
      stats.bounceCategories[category] &&
      stats.bounceCategories[category] > 0
    ) {
      return true;
    }
  }

  // Check for 4xx or 5xx response codes (delivery failures)
  for (const code of Object.keys(stats.responseCodes)) {
    const codeNum = Number.parseInt(code, 10);
    const codeData = stats.responseCodes[code];
    const count =
      codeData?.totalCount || (typeof codeData === 'number' ? codeData : 0);
    if (codeNum >= 400 && count > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Determine if user has any significant activity worth reporting
 * @param {Object} stats - Statistics object from getLogStats
 * @returns {boolean} True if there's activity worth reporting
 */
function hasSignificantActivity(stats) {
  // High priority issues always count
  if (hasHighPriorityIssues(stats)) {
    return true;
  }

  // Spam or virus blocked is also worth reporting
  if (stats.spam > 0 || stats.virus > 0) {
    return true;
  }

  return false;
}

/**
 * Get the appropriate frequency in days based on activity type
 * @param {Object} stats - Statistics object from getLogStats
 * @returns {number} Number of days between reports
 */
function getReportFrequencyDays(stats) {
  if (hasHighPriorityIssues(stats)) {
    return HIGH_PRIORITY_FREQUENCY_DAYS;
  }

  return LOW_PRIORITY_FREQUENCY_DAYS;
}

/**
 * Get user-friendly explanation of the report frequency
 * @param {Object} stats - Statistics object from getLogStats
 * @param {number} frequencyDays - The frequency in days
 * @returns {Object} Object with frequencyType and explanation
 */
function getFrequencyExplanation(stats, frequencyDays) {
  if (hasHighPriorityIssues(stats)) {
    return {
      frequencyType: 'high_priority',
      frequencyDays,
      explanation:
        'We noticed some emails had delivery issues. We send these reports every 3 days so you have time to fix any problems before email servers stop trying to deliver (they usually retry for about 5 days).'
    };
  }

  return {
    frequencyType: 'low_priority',
    frequencyDays,
    explanation:
      'Good news! We only found spam or viruses that we blocked for you. Since there are no urgent issues, we send these reports every 4 days to keep you informed without flooding your inbox.'
  };
}

/**
 * Format date range based on locale using Intl.DateTimeFormat
 * @param {Date} startDate - Start of the period
 * @param {Date} endDate - End of the period
 * @param {string} locale - Locale code (e.g., 'en', 'de', 'fr')
 * @returns {string} Formatted date range
 */
function formatReportPeriod(startDate, endDate, locale = 'en') {
  // Use Intl.DateTimeFormat for reliable locale-based formatting
  const dateTimeOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  try {
    const formatter = new Intl.DateTimeFormat(locale, dateTimeOptions);
    const start = formatter.format(startDate);
    const end = formatter.format(endDate);
    return `${start} - ${end}`;
  } catch {
    // Fallback to dayjs with simple format if Intl fails
    const start = dayjs(startDate).format('MMM D, YYYY HH:mm');
    const end = dayjs(endDate).format('MMM D, YYYY HH:mm');
    return `${start} - ${end}`;
  }
}

/**
 * Process a single user and send their log alert if appropriate
 * @param {Object} user - User document
 * @param {Date} endDate - End of the period (now)
 */
async function processUser(user, endDate) {
  if (isCancelled) return;

  try {
    // Get all domains where user is admin
    const userDomains = await Domains.find({
      members: {
        $elemMatch: {
          user: user._id,
          group: 'admin'
        }
      }
    })
      .select('_id name')
      .lean();

    if (userDomains.length === 0) return;

    const domainIds = userDomains.map((d) => d._id);

    // First, get a quick preview of stats to determine frequency
    // Use the maximum lookback period (LOW_PRIORITY_FREQUENCY_DAYS) for initial check
    const maxLookbackDate = dayjs(endDate)
      .subtract(LOW_PRIORITY_FREQUENCY_DAYS, 'day')
      .toDate();

    const previewStats = await getLogStats(domainIds, maxLookbackDate, endDate);

    // Skip if no significant activity
    if (!hasSignificantActivity(previewStats)) {
      return;
    }

    // Determine the appropriate frequency based on activity type
    const frequencyDays = getReportFrequencyDays(previewStats);

    // Check if enough time has passed since last report
    const lastSentAt = user[config.userFields.dailyLogAlertSentAt];
    if (lastSentAt) {
      const hoursSinceLastSent = dayjs(endDate).diff(dayjs(lastSentAt), 'hour');
      const requiredHours = frequencyDays * 24 - 1; // Subtract 1 hour for timing flexibility

      if (hoursSinceLastSent < requiredHours) {
        // Not enough time has passed
        return;
      }
    }

    // Now get the actual stats for the report period
    const startDate = dayjs(endDate).subtract(frequencyDays, 'day').toDate();
    const stats = await getLogStats(domainIds, startDate, endDate);

    // Double-check there's still significant activity in the actual period
    if (!hasSignificantActivity(stats)) {
      return;
    }

    // Build domains list with log counts
    const domainsWithCounts = await Promise.all(
      userDomains.map(async (domain) => {
        const logCount = await Logs.countDocuments({
          domains: domain._id,
          created_at: {
            $gte: startDate,
            $lte: endDate
          }
        });
        return {
          name: domain.name,
          logCount
        };
      })
    );

    // Filter domains with logs and limit to 25 for email rendering
    const MAX_DOMAINS_IN_EMAIL = 25;
    const domainsWithLogs = domainsWithCounts.filter((d) => d.logCount > 0);
    const displayDomains = domainsWithLogs.slice(0, MAX_DOMAINS_IN_EMAIL);
    const additionalDomainsCount =
      domainsWithLogs.length - displayDomains.length;
    const additionalDomainsLogCount = domainsWithLogs
      .slice(MAX_DOMAINS_IN_EMAIL)
      .reduce((sum, d) => sum + d.logCount, 0);

    // Get user's locale (from user preferences or domain majority locale)
    const locale = user[config.lastLocaleField] || 'en';

    // Format report period based on user's locale
    const reportPeriod = formatReportPeriod(startDate, endDate, locale);

    // Get frequency explanation for the email
    const frequencyInfo = getFrequencyExplanation(stats, frequencyDays);

    // Send the email
    await email({
      template: 'daily-log-alert',
      message: {
        to: user.email
      },
      locals: {
        user,
        locale,
        stats,
        domains: displayDomains,
        additionalDomainsCount,
        additionalDomainsLogCount,
        reportPeriod,
        frequencyInfo
      }
    });

    // Update the user's last log alert sent timestamp
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.dailyLogAlertSentAt]: new Date()
      }
    });

    logger.info('Log alert sent', {
      userId: user._id,
      email: user.email,
      locale,
      frequencyDays,
      frequencyType: frequencyInfo.frequencyType,
      stats
    });
  } catch (err) {
    logger.error(err, { userId: user._id });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const endDate = new Date();

    // Check if running for a single user (manual testing)
    if (process.env.USER_EMAIL) {
      logger.info(`Running for single user: ${process.env.USER_EMAIL}`);

      const user = await Users.findOne({
        email: process.env.USER_EMAIL.toLowerCase()
      })
        .select(
          `_id email plan ${config.lastLocaleField} ${config.userFields.dailyLogAlertSentAt}`
        )
        .lean();

      if (!user) {
        throw new Error(`User not found: ${process.env.USER_EMAIL}`);
      }

      // Process single user (skip eligibility checks for manual runs)
      await processUser(user, endDate);
      logger.info('Single user processing complete');
    } else {
      // Find eligible users:
      // - Non-banned
      // - Verified email
      // - Paid plan (enhanced_protection or team)
      // Note: We don't filter by last sent time here because frequency varies by activity
      const query = {
        [config.userFields.hasVerifiedEmail]: true,
        [config.userFields.isBanned]: false,
        plan: { $in: ['enhanced_protection', 'team'] }
      };

      // Get all eligible users
      const users = await Users.find({ ...query })
        .select(
          `_id email plan ${config.lastLocaleField} ${config.userFields.dailyLogAlertSentAt}`
        )
        .lean();

      logger.info('Processing log alerts', { userCount: users.length });

      // Process users with concurrency for better performance
      await pMap(
        users,
        async (user) => {
          if (isCancelled) return;
          await processUser(user, endDate);
        },
        { concurrency: config.concurrency }
      );
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
