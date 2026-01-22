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
 * - Redis-based deduplication to prevent duplicate emails (atomic SETNX)
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
const pMap = require('p-map');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const Domains = require('#models/domains');
const Logs = require('#models/logs');
const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const redis = new Redis(breeSharedConfig.redis, logger);
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

    // FIX: Read from the correct nested path (summary object)
    // The data is stored as meta.dmarc_report.summary.* not meta.dmarc_report.*
    const summary = dmarcMeta.summary || {};

    // Aggregate message counts from the summary object
    const msgCount = summary.total_messages || 0;
    totalMessages += msgCount;
    spfAligned += summary.spf_aligned || 0;
    dkimAligned += summary.dkim_aligned || 0;
    accepted += summary.accepted || 0;
    quarantined += summary.quarantined || 0;
    rejected += summary.rejected || 0;

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
      stats.spfAligned += summary.spf_aligned || 0;
      stats.dkimAligned += summary.dkim_aligned || 0;
    }

    // FIX: Read org_name from the correct path (report_metadata object)
    const reportMetadata = dmarcMeta.report_metadata || {};
    const orgName = reportMetadata.org_name || 'Unknown';
    if (!reporterStats.has(orgName)) {
      reporterStats.set(orgName, { reports: 0, messages: 0 });
    }

    const reporter = reporterStats.get(orgName);
    reporter.reports++;
    reporter.messages += msgCount;

    // Track source IPs with alignment issues (for actionable insights)
    // FIX: Use correct field names from the stored record structure
    const records = dmarcMeta.records || [];
    for (const record of records.slice(0, 10)) {
      // Limit to first 10 records
      // The record structure has policy_evaluated.spf and policy_evaluated.dkim
      // not spf_result/spf_aligned fields
      const policyEvaluated = record.policy_evaluated || {};
      const spfPass = policyEvaluated.spf === 'pass';
      const dkimPass = policyEvaluated.dkim === 'pass';

      if (!spfPass || !dkimPass) {
        sourceIpIssues.push({
          ip: record.source_ip,
          count: record.count || 1,
          // Store the actual policy_evaluated values for display
          spfResult: policyEvaluated.spf || 'fail',
          spfAligned: policyEvaluated.spf || 'fail',
          dkimResult: policyEvaluated.dkim || 'fail',
          dkimAligned: policyEvaluated.dkim || 'fail',
          disposition: policyEvaluated.disposition || 'none'
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
 * Atomically acquire a lock for sending the weekly report
 * Uses Redis SETNX (SET if Not eXists) to prevent race conditions
 *
 * @param {string} userId - User ID
 * @returns {boolean} True if lock was acquired (report not yet sent), false otherwise
 */
async function acquireReportLock(userId) {
  const weekKey = dayjs().startOf('week').format('YYYY-WW');
  const redisKey = `${REDIS_KEY_PREFIX}${userId}:${weekKey}`;

  // Use SET with NX (only set if not exists) and EX (expiration) atomically
  // This prevents race conditions where multiple job instances could
  // all check, find no key, and then all send emails
  const result = await redis.set(redisKey, '1', 'EX', REDIS_KEY_TTL, 'NX');

  // Returns 'OK' if the key was set (we acquired the lock), null if key already existed
  return result === 'OK';
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
    // FIX: Use atomic SETNX to prevent duplicate emails from race conditions
    // This atomically checks AND sets the lock in one operation
    const lockAcquired = await acquireReportLock(user._id.toString());
    if (!lockAcquired) {
      logger.debug('DMARC report already sent this week (lock not acquired)', {
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

    // Note: Lock was already acquired atomically at the start via SETNX
    // No need to mark as sent again - the lock IS the sent marker

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
    // Do not send any emails until January 25, 2026 or later
    // This allows time for the Redis fix to be deployed and stabilize
    const launchDate = dayjs('2026-01-25', 'YYYY-MM-DD').startOf('day');
    if (dayjs().isBefore(launchDate)) {
      logger.info(
        'Weekly DMARC report job skipped (before launch date 2026-01-25)'
      );
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
    }

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

      // Process single user (uses same atomic lock mechanism)
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
