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
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');

const Domains = require('#models/domains');
const Logs = require('#models/logs');
const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const forEachInBatches = require('#helpers/for-each-in-batches');
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

//
// MongoDB query timeout and index hints to prevent multiplanner timeout errors
// The multiplanner can timeout when evaluating many candidate indexes
// Using explicit hints forces MongoDB to use specific indexes
//
// NOTE: maxTimeMS applies to each individual getMore batch, not the total cursor lifetime.
// noCursorTimeout prevents the cursor from being killed for inactivity.
// 60s is generous enough for large result sets while still preventing runaway queries.
const MAX_TIME_MS = ms('60s');

const INDEX_HINTS = {
  // For queries on domains + created_at (base query pattern)
  domainsCreatedAt: { domains: 1, created_at: 1 },
  // For queries with bounce_category + domains + created_at
  bounceCategory: { bounce_category: 1, domains: 1, created_at: 1 },
  // For queries with err.responseCode
  responseCode: {
    domains: 1,
    created_at: 1,
    'err.responseCode': 1,
    'meta.app.hostname': 1
  }
};

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Get log statistics for a user's domains using cursor-based iteration
 *
 * Uses cursor with noCursorTimeout for better handling of large result sets.
 * This approach streams documents one at a time and accumulates statistics
 * incrementally, avoiding aggregation timeout errors.
 *
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
    },
    // Exclude transient timeout errors that are not actionable by users
    'err.message': {
      $ne: 'Message delivery was temporarily interrupted, please try again later.'
    }
  };

  // Initialize counters
  let total = 0;
  let delivered = 0;
  let spam = 0;
  let virus = 0;
  const bounceCategories = {};

  // Track response codes with unique error messages
  // Key: responseCode, Value: Map of message -> count
  //
  // Error messages often contain unique queue ids and addresses, so a busy
  // sender's bounces over the period can each be a different message; only
  // the first MAX_TRACKED_MESSAGES_PER_CODE distinct messages of a code are
  // counted by message, and the logs with any other message are counted
  // together (they are reported as additional messages below).
  //
  const MAX_TRACKED_MESSAGES_PER_CODE = 1000;
  const responseCodeMessages = new Map();
  const untrackedMessageCounts = new Map();

  //
  // Use cursor with noCursorTimeout for better handling of large result sets
  // This prevents aggregation timeout errors by streaming documents
  //
  // eslint-disable-next-line unicorn/no-array-callback-reference
  for await (const log of Logs.find(baseQuery)
    .hint(INDEX_HINTS.domainsCreatedAt)
    .maxTimeMS(MAX_TIME_MS)
    // only the fields counted below (`err` can be large)
    .select('message bounce_category err.responseCode err.message')
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    // Check for cancellation
    if (isCancelled) break;

    total++;

    // Count delivered messages
    if (log.message === 'delivered') {
      delivered++;
    }

    // Count bounce categories
    const category = log.bounce_category;
    if (category && category !== 'none') {
      bounceCategories[category] = (bounceCategories[category] || 0) + 1;
      if (category === 'spam') spam++;
      if (category === 'virus') virus++;
    }

    // Track response codes with error messages
    const responseCode = log.err?.responseCode;
    if (responseCode) {
      const code = responseCode.toString();
      if (!responseCodeMessages.has(code)) {
        responseCodeMessages.set(code, new Map());
      }

      const messageMap = responseCodeMessages.get(code);
      const errMessage = log.err?.message || null;
      const messageKey = errMessage || '__null__';
      if (
        messageMap.has(messageKey) ||
        messageMap.size < MAX_TRACKED_MESSAGES_PER_CODE
      ) {
        messageMap.set(messageKey, (messageMap.get(messageKey) || 0) + 1);
      } else {
        untrackedMessageCounts.set(
          code,
          (untrackedMessageCounts.get(code) || 0) + 1
        );
      }
    }
  }

  // Organize response codes with up to 5 unique messages per code
  const MAX_MESSAGES_PER_CODE = 5;
  const responseCodes = {};

  for (const [code, messageMap] of responseCodeMessages) {
    // Sort messages by count descending
    const sortedMessages = [...messageMap.entries()].sort(
      (a, b) => b[1] - a[1]
    );

    responseCodes[code] = {
      totalCount: 0,
      messages: [],
      additionalMessagesCount: 0,
      additionalMessagesLogCount: 0
    };

    for (const [messageKey, count] of sortedMessages) {
      responseCodes[code].totalCount += count;

      if (responseCodes[code].messages.length < MAX_MESSAGES_PER_CODE) {
        responseCodes[code].messages.push({
          text: messageKey === '__null__' ? null : messageKey,
          count
        });
      } else {
        responseCodes[code].additionalMessagesCount++;
        responseCodes[code].additionalMessagesLogCount += count;
      }
    }

    // logs whose message was not tracked (each counted as its own message,
    // so the number of additional messages is at most this)
    const untracked = untrackedMessageCounts.get(code) || 0;
    responseCodes[code].totalCount += untracked;
    responseCodes[code].additionalMessagesCount += untracked;
    responseCodes[code].additionalMessagesLogCount += untracked;
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

    // Build domains list with log counts using cursor-based iteration
    // This avoids aggregation timeout errors by streaming documents
    const logCountMap = new Map();
    const domainIdSet = new Set(domainIds.map((id) => id.toString()));

    for await (const log of Logs.find({
      domains: { $in: domainIds },
      created_at: {
        $gte: startDate,
        $lte: endDate
      },
      // Exclude transient timeout errors that are not actionable by users
      'err.message': {
        $ne: 'Message delivery was temporarily interrupted, please try again later.'
      }
    })
      .hint(INDEX_HINTS.domainsCreatedAt)
      .maxTimeMS(MAX_TIME_MS)
      .select('domains')
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      if (isCancelled) break;

      // Count each domain in this log that belongs to the user
      for (const domainId of log.domains || []) {
        const domainIdStr = domainId.toString();
        if (domainIdSet.has(domainIdStr)) {
          logCountMap.set(domainIdStr, (logCountMap.get(domainIdStr) || 0) + 1);
        }
      }
    }

    // Build domains with counts
    const domainsWithCounts = userDomains.map((domain) => ({
      name: domain.name,
      logCount: logCountMap.get(domain._id.toString()) || 0
    }));

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

      // Process eligible users with concurrency for better performance,
      // reading them from a cursor a batch at a time
      const userCount = await forEachInBatches(
        Users.find({ ...query })
          .select(
            `_id email plan ${config.lastLocaleField} ${config.userFields.dailyLogAlertSentAt}`
          )
          .lean()
          .cursor({ batchSize: 100 })
          .addCursorFlag('noCursorTimeout', true),
        {
          batchSize: 100,
          concurrency: config.concurrency,
          shouldStop: () => isCancelled
        },
        async (user) => {
          if (isCancelled) return;
          await processUser(user, endDate);
        }
      );

      logger.info('Processed log alerts', { userCount });
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
