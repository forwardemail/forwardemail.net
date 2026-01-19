/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Weekly DMARC Report Email Job
 *
 * Sends weekly DMARC report summaries to domain admins.
 * Aggregates DMARC reports across all domains for a given user.
 *
 * Features:
 * - Redis-based deduplication to prevent duplicate emails
 * - Aggregates reports across all user's domains
 * - Weekly frequency (runs once per week)
 * - Similar to daily-log-alert but for DMARC reports
 *
 * Usage:
 *   node jobs/weekly-dmarc-report.js
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
const Redis = require('ioredis-mock');

const Domains = require('#models/domains');
const Logs = require('#models/logs');
const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

// Use real Redis in production, mock for testing
const redis = config.redis
  ? new (require('ioredis'))(config.redis)
  : new Redis();

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [redis],
  logger
});

graceful.listen();

// Constants
const REPORT_FREQUENCY_DAYS = 7; // Weekly reports
const REDIS_KEY_PREFIX = 'dmarc_report_sent:';
const REDIS_KEY_TTL = 60 * 60 * 24 * 8; // 8 days TTL (slightly more than a week)

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Get DMARC report statistics for a user's domains
 *
 * @param {Array} domainIds - Array of domain ObjectIds
 * @param {Date} startDate - Start of the period
 * @param {Date} endDate - End of the period
 * @returns {Object} Statistics object with aggregated DMARC data
 */
async function getDmarcStats(domainIds, startDate, endDate) {
  const baseQuery = {
    is_dmarc_report: true,
    domains: { $in: domainIds },
    created_at: {
      $gte: startDate,
      $lte: endDate
    }
  };

  // Initialize counters
  let totalReports = 0;
  let totalMessages = 0;
  let spfAligned = 0;
  let dkimAligned = 0;
  let accepted = 0;
  let quarantined = 0;
  let rejected = 0;

  // Track per-domain stats
  const domainStats = new Map();

  // Track top reporters (organizations sending DMARC reports)
  const reporterStats = new Map();

  // Track source IPs with alignment issues
  const sourceIpIssues = [];

  // Use cursor for efficient iteration

  for await (const log of Logs.find({ ...baseQuery })
    .hint({ is_dmarc_report: 1, domains: 1, created_at: -1 })
    .select('meta domains')
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    if (isCancelled) break;

    totalReports++;

    const meta = log.meta || {};
    const dmarcMeta = meta.dmarc_report || {};

    // Aggregate message counts
    const msgCount = dmarcMeta.total_messages || 0;
    totalMessages += msgCount;
    spfAligned += dmarcMeta.spf_aligned || 0;
    dkimAligned += dmarcMeta.dkim_aligned || 0;
    accepted += dmarcMeta.accepted || 0;
    quarantined += dmarcMeta.quarantined || 0;
    rejected += dmarcMeta.rejected || 0;

    // Track per-domain stats
    for (const domainId of log.domains || []) {
      const domainIdStr = domainId.toString();
      if (!domainStats.has(domainIdStr)) {
        domainStats.set(domainIdStr, {
          reports: 0,
          messages: 0,
          spfAligned: 0,
          dkimAligned: 0
        });
      }

      const stats = domainStats.get(domainIdStr);
      stats.reports++;
      stats.messages += msgCount;
      stats.spfAligned += dmarcMeta.spf_aligned || 0;
      stats.dkimAligned += dmarcMeta.dkim_aligned || 0;
    }

    // Track reporter organizations
    const orgName = dmarcMeta.org_name || 'Unknown';
    if (!reporterStats.has(orgName)) {
      reporterStats.set(orgName, { reports: 0, messages: 0 });
    }

    const reporter = reporterStats.get(orgName);
    reporter.reports++;
    reporter.messages += msgCount;

    // Track source IPs with alignment issues (for actionable insights)
    const records = dmarcMeta.records || [];
    for (const record of records.slice(0, 10)) {
      // Limit to first 10 records
      const spfPass =
        record.spf_result === 'pass' && record.spf_aligned === 'pass';
      const dkimPass =
        record.dkim_result === 'pass' && record.dkim_aligned === 'pass';

      if (!spfPass || !dkimPass) {
        sourceIpIssues.push({
          ip: record.source_ip,
          count: record.count || 1,
          spfResult: record.spf_result,
          spfAligned: record.spf_aligned,
          dkimResult: record.dkim_result,
          dkimAligned: record.dkim_aligned,
          disposition: record.disposition
        });
      }
    }
  }

  // Calculate percentages
  const spfAlignedPct =
    totalMessages > 0 ? ((spfAligned / totalMessages) * 100).toFixed(1) : 0;
  const dkimAlignedPct =
    totalMessages > 0 ? ((dkimAligned / totalMessages) * 100).toFixed(1) : 0;
  const passRate =
    totalMessages > 0 ? ((accepted / totalMessages) * 100).toFixed(1) : 0;

  // Sort reporters by message count
  const topReporters = [...reporterStats.entries()]
    .sort((a, b) => b[1].messages - a[1].messages)
    .slice(0, 10)
    .map(([name, stats]) => ({ name, ...stats }));

  // Aggregate source IP issues by IP
  const ipIssueMap = new Map();
  for (const issue of sourceIpIssues) {
    if (ipIssueMap.has(issue.ip)) {
      ipIssueMap.get(issue.ip).count += issue.count;
    } else {
      ipIssueMap.set(issue.ip, { ...issue });
    }
  }

  const topIpIssues = [...ipIssueMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalReports,
    totalMessages,
    spfAligned,
    dkimAligned,
    spfAlignedPct,
    dkimAlignedPct,
    accepted,
    quarantined,
    rejected,
    passRate,
    domainStats,
    topReporters,
    topIpIssues
  };
}

/**
 * Check if a weekly report was already sent for this user
 * Uses Redis for deduplication
 *
 * @param {string} userId - User ID
 * @returns {boolean} True if report was already sent this week
 */
async function wasReportSentThisWeek(userId) {
  const weekKey = dayjs().startOf('week').format('YYYY-WW');
  const redisKey = `${REDIS_KEY_PREFIX}${userId}:${weekKey}`;

  const exists = await redis.exists(redisKey);
  return exists === 1;
}

/**
 * Mark that a weekly report was sent for this user
 *
 * @param {string} userId - User ID
 */
async function markReportSent(userId) {
  const weekKey = dayjs().startOf('week').format('YYYY-WW');
  const redisKey = `${REDIS_KEY_PREFIX}${userId}:${weekKey}`;

  await redis.setex(redisKey, REDIS_KEY_TTL, '1');
}

/**
 * Format date range based on locale
 *
 * @param {Date} startDate - Start of the period
 * @param {Date} endDate - End of the period
 * @param {string} locale - Locale code
 * @returns {string} Formatted date range
 */
function formatReportPeriod(startDate, endDate, locale = 'en') {
  const dateTimeOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  try {
    const formatter = new Intl.DateTimeFormat(locale, dateTimeOptions);
    const start = formatter.format(startDate);
    const end = formatter.format(endDate);
    return `${start} - ${end}`;
  } catch {
    const start = dayjs(startDate).format('MMM D, YYYY');
    const end = dayjs(endDate).format('MMM D, YYYY');
    return `${start} - ${end}`;
  }
}

/**
 * Process a single user and send their DMARC report if appropriate
 *
 * @param {Object} user - User document
 * @param {Date} endDate - End of the period (now)
 */
async function processUser(user, endDate) {
  if (isCancelled) return;

  try {
    // Check Redis to prevent duplicate emails
    const alreadySent = await wasReportSentThisWeek(user._id.toString());
    if (alreadySent) {
      logger.debug('DMARC report already sent this week', {
        userId: user._id,
        email: user.email
      });
      return;
    }

    // Get all domains where user is admin
    const userDomains = await Domains.find({
      members: {
        $elemMatch: {
          user: user._id,
          group: 'admin'
        }
      },
      plan: { $ne: 'free' } // Only paid plans get DMARC reports
    })
      .select('_id name')
      .lean();

    if (userDomains.length === 0) return;

    const domainIds = userDomains.map((d) => d._id);
    const startDate = dayjs(endDate)
      .subtract(REPORT_FREQUENCY_DAYS, 'day')
      .toDate();

    // Get DMARC statistics
    const stats = await getDmarcStats(domainIds, startDate, endDate);

    // Skip if no DMARC reports received
    if (stats.totalReports === 0) {
      logger.debug('No DMARC reports for user', {
        userId: user._id,
        email: user.email
      });
      return;
    }

    // Skip if less than 3 days of data collected
    // This prevents sending empty/sparse reports to new users
    const MIN_DAYS_OF_DATA = 3;
    const oldestReportDate = await Logs.findOne({
      is_dmarc_report: true,
      domains: { $in: domainIds }
    })
      .hint({ is_dmarc_report: 1, domains: 1, created_at: -1 })
      .sort({ created_at: 1 })
      .select('created_at')
      .lean();

    if (oldestReportDate) {
      const daysSinceFirstReport = dayjs(endDate).diff(
        dayjs(oldestReportDate.created_at),
        'day'
      );
      if (daysSinceFirstReport < MIN_DAYS_OF_DATA) {
        logger.debug('Not enough days of DMARC data collected', {
          userId: user._id,
          email: user.email,
          daysSinceFirstReport,
          minRequired: MIN_DAYS_OF_DATA
        });
        return;
      }
    }

    // Build domains list with stats
    const domainsWithStats = userDomains
      .map((domain) => {
        const domainStat = stats.domainStats.get(domain._id.toString());
        if (!domainStat || domainStat.reports === 0) return null;

        const spfPct =
          domainStat.messages > 0
            ? ((domainStat.spfAligned / domainStat.messages) * 100).toFixed(1)
            : 0;
        const dkimPct =
          domainStat.messages > 0
            ? ((domainStat.dkimAligned / domainStat.messages) * 100).toFixed(1)
            : 0;

        return {
          name: domain.name,
          reports: domainStat.reports,
          messages: domainStat.messages,
          spfAlignedPct: spfPct,
          dkimAlignedPct: dkimPct
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.messages - a.messages);

    // Limit domains in email
    const MAX_DOMAINS_IN_EMAIL = 25;
    const displayDomains = domainsWithStats.slice(0, MAX_DOMAINS_IN_EMAIL);
    const additionalDomainsCount =
      domainsWithStats.length - displayDomains.length;

    // Get user's locale
    const locale = user[config.lastLocaleField] || 'en';

    // Format report period
    const reportPeriod = formatReportPeriod(startDate, endDate, locale);

    // Determine if there are issues that need attention
    const hasIssues =
      stats.quarantined > 0 ||
      stats.rejected > 0 ||
      Number.parseFloat(stats.spfAlignedPct) < 90 ||
      Number.parseFloat(stats.dkimAlignedPct) < 90;

    // Send the email
    await email({
      template: 'weekly-dmarc-report',
      message: {
        to: user.email
      },
      locals: {
        user,
        locale,
        stats,
        domains: displayDomains,
        additionalDomainsCount,
        reportPeriod,
        hasIssues,
        topReporters: stats.topReporters.slice(0, 5),
        topIpIssues: stats.topIpIssues.slice(0, 5)
      }
    });

    // Mark as sent in Redis
    await markReportSent(user._id.toString());

    logger.info('DMARC report sent', {
      userId: user._id,
      email: user.email,
      locale,
      totalReports: stats.totalReports,
      totalMessages: stats.totalMessages,
      domainsCount: domainsWithStats.length
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
        .select(`_id email plan ${config.lastLocaleField}`)
        .lean();

      if (!user) {
        throw new Error(`User not found: ${process.env.USER_EMAIL}`);
      }

      // Process single user (skip Redis check for manual runs)
      await processUser(user, endDate);
      logger.info('Single user processing complete');
    } else {
      // Find eligible users:
      // - Non-banned
      // - Verified email
      // - Paid plan (enhanced_protection or team)
      const query = {
        [config.userFields.hasVerifiedEmail]: true,
        [config.userFields.isBanned]: false,
        plan: { $in: ['enhanced_protection', 'team'] }
      };

      const users = await Users.find({ ...query })
        .select(`_id email plan ${config.lastLocaleField}`)
        .lean();

      logger.info('Processing weekly DMARC reports', {
        userCount: users.length
      });

      // Process users with concurrency
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
