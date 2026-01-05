#!/usr/bin/env node

/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Preview Log Alert Email
 *
 * This script renders the daily-log-alert email template with prepopulated
 * sample data and opens it in your browser using preview-email.
 *
 * Usage:
 *   PREVIEW_EMAIL=true node scripts/preview-daily-log-alert.js
 *
 * Options:
 *   USER_EMAIL=user@example.com - Use real user data instead of sample data
 *   LOCALE=de - Override locale for date formatting (default: en)
 *   PRIORITY=high|low - Force high or low priority sample data (default: high)
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');

const Domains = require('#models/domains');
const Logs = require('#models/logs');
const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

// Frequency constants (in days)
const HIGH_PRIORITY_FREQUENCY_DAYS = 3;
const LOW_PRIORITY_FREQUENCY_DAYS = 4;

// High priority bounce categories
const HIGH_PRIORITY_CATEGORIES = [
  'blocklist',
  'dmarc',
  'recipient',
  'network',
  'policy',
  'content'
];

// Sample data for high priority preview (delivery issues)
const SAMPLE_STATS_HIGH_PRIORITY = {
  total: 1247,
  delivered: 1189,
  spam: 42,
  virus: 3,
  bounceCategories: {
    spam: 42,
    virus: 3,
    blocklist: 5,
    dmarc: 2,
    recipient: 4,
    network: 2
  },
  responseCodes: {
    421: 8,
    450: 3,
    451: 2,
    550: 12,
    552: 1,
    554: 4
  }
};

// Sample data for low priority preview (spam/virus only)
const SAMPLE_STATS_LOW_PRIORITY = {
  total: 856,
  delivered: 811,
  spam: 38,
  virus: 2,
  bounceCategories: {
    spam: 38,
    virus: 2
  },
  responseCodes: {}
};

const SAMPLE_DOMAINS = [
  { name: 'example.com', logCount: 847 },
  { name: 'mycompany.org', logCount: 312 },
  { name: 'personal-domain.net', logCount: 88 }
];

const SAMPLE_USER = {
  _id: new mongoose.Types.ObjectId(),
  email: 'preview@example.com',
  plan: 'enhanced_protection'
};

/**
 * Determine if stats have high priority issues
 */
function hasHighPriorityIssues(stats) {
  for (const category of HIGH_PRIORITY_CATEGORIES) {
    if (
      stats.bounceCategories[category] &&
      stats.bounceCategories[category] > 0
    ) {
      return true;
    }
  }

  for (const code of Object.keys(stats.responseCodes)) {
    const codeNum = Number.parseInt(code, 10);
    if (codeNum >= 400 && stats.responseCodes[code] > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Get frequency explanation
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
 */
function formatReportPeriod(startDate, endDate, locale = 'en') {
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
    const start = dayjs(startDate).format('MMM D, YYYY HH:mm');
    const end = dayjs(endDate).format('MMM D, YYYY HH:mm');
    return `${start} - ${end}`;
  }
}

/**
 * Get real stats for a user's domains
 */
async function getRealStats(domainIds, startDate, endDate, includeDelivered) {
  const baseQuery = {
    domains: { $in: domainIds },
    created_at: {
      $gte: startDate,
      $lte: endDate
    }
  };

  const total = await Logs.countDocuments(baseQuery);

  let delivered = 0;
  if (includeDelivered) {
    delivered = await Logs.countDocuments({
      ...baseQuery,
      bounce_category: 'none',
      'err.responseCode': { $exists: false }
    });
  }

  const spam = await Logs.countDocuments({
    ...baseQuery,
    bounce_category: 'spam'
  });

  const virus = await Logs.countDocuments({
    ...baseQuery,
    bounce_category: 'virus'
  });

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

  const responseCodeAggregation = await Logs.aggregate([
    {
      $match: {
        ...baseQuery,
        'err.responseCode': { $exists: true }
      }
    },
    {
      $group: {
        _id: '$err.responseCode',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const responseCodes = {};
  for (const item of responseCodeAggregation) {
    if (item._id) {
      responseCodes[item._id.toString()] = item.count;
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

(async () => {
  await setupMongoose(logger);

  try {
    const endDate = new Date();

    let user;
    let stats;
    let domains;
    let showDelivered;
    let locale;
    let frequencyDays;

    // Check if USER_EMAIL is provided for real data
    if (process.env.USER_EMAIL) {
      logger.info(`Loading real data for user: ${process.env.USER_EMAIL}`);

      user = await Users.findOne({
        email: process.env.USER_EMAIL.toLowerCase()
      }).lean();

      if (!user) {
        throw new Error(`User not found: ${process.env.USER_EMAIL}`);
      }

      // Get user's domains
      const userDomains = await Domains.find({
        members: {
          $elemMatch: {
            user: user._id,
            group: 'admin'
          }
        }
      })
        .select('_id name has_smtp')
        .lean();

      if (userDomains.length === 0) {
        throw new Error('User has no domains');
      }

      const domainIds = userDomains.map((d) => d._id);
      showDelivered = userDomains.some((d) => d.has_smtp);

      // Use max lookback for preview
      const startDate = dayjs(endDate)
        .subtract(LOW_PRIORITY_FREQUENCY_DAYS, 'day')
        .toDate();

      // Get real stats
      stats = await getRealStats(domainIds, startDate, endDate, showDelivered);

      // Determine frequency based on activity
      frequencyDays = hasHighPriorityIssues(stats)
        ? HIGH_PRIORITY_FREQUENCY_DAYS
        : LOW_PRIORITY_FREQUENCY_DAYS;

      // Get domain log counts
      domains = await Promise.all(
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

      // Use user's locale or override from env
      locale = process.env.LOCALE || user[config.lastLocaleField] || 'en';

      logger.info('Real stats loaded', {
        stats,
        domains: domains.length,
        locale,
        frequencyDays
      });
    } else {
      // Use sample data
      const priority = process.env.PRIORITY || 'high';
      const isHighPriority = priority.toLowerCase() === 'high';

      logger.info(`Using sample data for preview (priority: ${priority})`);

      user = SAMPLE_USER;
      stats = isHighPriority
        ? SAMPLE_STATS_HIGH_PRIORITY
        : SAMPLE_STATS_LOW_PRIORITY;
      domains = SAMPLE_DOMAINS;
      showDelivered = true;
      locale = process.env.LOCALE || 'en';
      frequencyDays = isHighPriority
        ? HIGH_PRIORITY_FREQUENCY_DAYS
        : LOW_PRIORITY_FREQUENCY_DAYS;
    }

    // Calculate start date based on frequency
    const startDate = dayjs(endDate).subtract(frequencyDays, 'day').toDate();

    // Format report period based on locale
    const reportPeriod = formatReportPeriod(startDate, endDate, locale);

    // Get frequency explanation
    const frequencyInfo = getFrequencyExplanation(stats, frequencyDays);

    // Send the email (will open in browser with PREVIEW_EMAIL=true)
    logger.info('Rendering email preview...', {
      locale,
      reportPeriod,
      frequencyDays,
      frequencyType: frequencyInfo.frequencyType
    });

    await email({
      template: 'daily-log-alert',
      message: {
        to: user.email
      },
      locals: {
        user,
        locale,
        stats,
        showDelivered,
        domains: domains.filter((d) => d.logCount > 0),
        reportPeriod,
        frequencyInfo
      }
    });

    logger.info('Email preview rendered successfully');
    logger.info('If browser did not open, ensure PREVIEW_EMAIL=true is set');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
})();
