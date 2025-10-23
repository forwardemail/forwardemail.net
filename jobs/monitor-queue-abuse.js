#!/usr/bin/env node

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
const mongoose = require('mongoose');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const Emails = require('#models/emails');
const Users = require('#models/users');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const emailHelper = require('#helpers/email');
const fairQueue = require('#helpers/fair-queue');
const { PRIORITY_CONFIG } = require('#config/priority-levels');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') {
      isCancelled = true;
    }
  });

graceful.listen();

/**
 * Monitor queue for abuse patterns and apply throttling
 */
async function monitorQueueAbuse() {
  if (isCancelled) return;

  try {
    logger.info('Starting queue abuse monitoring...');

    // Get users with high email volume in the past hour
    const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
    const suspiciousUsers = await Emails.aggregate([
      {
        $match: {
          created_at: { $gte: oneHourAgo },
          status: { $in: ['queued', 'sent', 'bounced', 'rejected'] }
        }
      },
      {
        $group: {
          _id: '$user',
          totalEmails: { $sum: 1 },
          queuedEmails: { $sum: { $cond: [{ $eq: ['$status', 'queued'] }, 1, 0] } },
          bouncedEmails: { $sum: { $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0] } },
          rejectedEmails: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          avgPriority: { $avg: '$priority' }
        }
      },
      {
        $match: {
          $or: [
            { totalEmails: { $gte: 100 } }, // High volume
            { queuedEmails: { $gte: 50 } },  // Many queued
            { $expr: { $gte: [{ $divide: ['$bouncedEmails', '$totalEmails'] }, 0.1] } }, // 10%+ bounce rate
            { $expr: { $gte: [{ $divide: ['$rejectedEmails', '$totalEmails'] }, 0.05] } }  // 5%+ reject rate
          ]
        }
      },
      { $sort: { totalEmails: -1 } },
      { $limit: 100 } // Check top 100 most active users
    ]);

    logger.info(`Found ${suspiciousUsers.length} users requiring abuse score analysis`);

    let throttledUsers = 0;
    let alertsSent = 0;

    // Analyze each suspicious user
    for (const userStats of suspiciousUsers) {
      if (isCancelled) break;

      try {
        const userId = userStats._id;
        const abuseScore = await fairQueue.calculateUserAbuseScore(userId);
        
        // Update the user's emails with current abuse score
        await Emails.updateMany(
          { user: userId, status: 'queued' },
          { $set: { abuse_score: abuseScore } }
        );

        logger.debug(
          `User ${userId.toString().slice(-6)} - Volume: ${userStats.totalEmails}, Abuse Score: ${abuseScore}`
        );

        // Apply throttling if abuse score is too high
        if (abuseScore >= PRIORITY_CONFIG.ABUSE_THRESHOLD) {
          const throttleResult = await fairQueue.applyUserThrottling(userId, abuseScore);
          
          if (throttleResult.affectedEmails > 0) {
            throttledUsers++;

            // Get user details for notification
            const user = await Users.findById(userId)
              .select(`id email ${config.lastLocaleField}`)
              .lean();

            if (user) {
              // Send alert to admins
              await emailHelper({
                template: 'alert',
                message: {
                  to: config.email.message.from,
                  subject: 'User automatically throttled for suspicious activity'
                },
                locals: {
                  message: `
                    <h3>User Throttled for Abuse</h3>
                    <p><strong>User:</strong> ${user.email} (${userId})</p>
                    <p><strong>Abuse Score:</strong> ${abuseScore}/100</p>
                    <p><strong>Throttled Until:</strong> ${throttleResult.throttledUntil.toISOString()}</p>
                    <p><strong>Affected Emails:</strong> ${throttleResult.affectedEmails}</p>
                    <p><strong>Duration:</strong> ${ms(throttleResult.duration, { long: true })}</p>
                    
                    <h4>Activity in Past Hour:</h4>
                    <ul>
                      <li>Total Emails: ${userStats.totalEmails}</li>
                      <li>Queued Emails: ${userStats.queuedEmails}</li>
                      <li>Bounced Emails: ${userStats.bouncedEmails}</li>
                      <li>Rejected Emails: ${userStats.rejectedEmails}</li>
                      <li>Bounce Rate: ${((userStats.bouncedEmails / userStats.totalEmails) * 100).toFixed(1)}%</li>
                      <li>Reject Rate: ${((userStats.rejectedEmails / userStats.totalEmails) * 100).toFixed(1)}%</li>
                    </ul>
                  `
                }
              });

              alertsSent++;
            }
          }
        }
      } catch (err) {
        logger.error(`Error analyzing user ${userStats._id}:`, err);
      }
    }

    // Monitor overall queue fairness
    const queueFairnessStats = await analyzeQueueFairness();
    
    if (!queueFairnessStats.isFair) {
      logger.warn('Queue fairness issue detected:', queueFairnessStats);
      
      // Send fairness alert if severe
      if (queueFairnessStats.maxDomainPercentage > 50) {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: 'Queue fairness issue detected'
          },
          locals: {
            message: `
              <h3>Queue Fairness Alert</h3>
              <p>A single domain is monopolizing the email queue.</p>
              <ul>
                <li>Max Domain Percentage: ${queueFairnessStats.maxDomainPercentage.toFixed(1)}%</li>
                <li>Total Queued: ${queueFairnessStats.totalQueued}</li>
                <li>Unique Domains: ${queueFairnessStats.uniqueDomains}</li>
                <li>Unique Users: ${queueFairnessStats.uniqueUsers}</li>
              </ul>
            `
          }
        });
      }
    }

    logger.info(
      `Abuse monitoring completed: ${throttledUsers} users throttled, ${alertsSent} alerts sent`
    );

  } catch (err) {
    logger.error('Queue abuse monitoring error:', err);
  }
}

/**
 * Analyze queue fairness metrics
 */
async function analyzeQueueFairness() {
  const now = new Date();
  
  // Get queue distribution by domain and user
  const [domainStats, userStats, totalQueued] = await Promise.all([
    Emails.aggregate([
      {
        $match: {
          status: 'queued',
          $or: [
            { throttled_until: { $exists: false } },
            { throttled_until: { $lt: now } }
          ]
        }
      },
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]),
    
    Emails.aggregate([
      {
        $match: {
          status: 'queued',
          $or: [
            { throttled_until: { $exists: false } },
            { throttled_until: { $lt: now } }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]),
    
    Emails.countDocuments({
      status: 'queued',
      $or: [
        { throttled_until: { $exists: false } },
        { throttled_until: { $lt: now } }
      ]
    })
  ]);

  const maxDomainCount = domainStats[0]?.count || 0;
  const maxUserCount = userStats[0]?.count || 0;
  
  const maxDomainPercentage = totalQueued > 0 ? (maxDomainCount / totalQueued) * 100 : 0;
  const maxUserPercentage = totalQueued > 0 ? (maxUserCount / totalQueued) * 100 : 0;

  // Consider queue unfair if single domain/user has >30% of queue
  const isFair = maxDomainPercentage <= 30 && maxUserPercentage <= 30;

  return {
    totalQueued,
    uniqueDomains: domainStats.length,
    uniqueUsers: userStats.length,
    maxDomainCount,
    maxUserCount,
    maxDomainPercentage,
    maxUserPercentage,
    isFair
  };
}

/**
 * Generate queue health report
 */
async function generateQueueHealthReport() {
  try {
    const queueHealth = await fairQueue.calculateQueueHealth();
    const fairnessStats = await analyzeQueueFairness();
    
    // Get priority distribution
    const priorityStats = await Emails.aggregate([
      { $match: { status: 'queued' } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          avgAbuseScore: { $avg: '$abuse_score' }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Get throttled users count
    const throttledCount = await Emails.countDocuments({
      status: 'queued',
      throttled_until: { $exists: true, $gt: new Date() }
    });

    const healthReport = {
      timestamp: new Date(),
      queueHealth,
      fairnessStats,
      priorityStats,
      throttledCount
    };

    logger.info('Queue Health Report:', healthReport);
    
    return healthReport;
  } catch (err) {
    logger.error('Error generating queue health report:', err);
    return null;
  }
}

(async () => {
  await setupMongoose(logger);

  // Main monitoring loop
  (async function startMonitoring() {
    if (isCancelled) {
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    try {
      // Run abuse monitoring every cycle
      await monitorQueueAbuse();
      
      // Generate health report (for debugging/monitoring)
      await generateQueueHealthReport();

    } catch (err) {
      logger.error('Queue monitoring error:', err);
    }

    // Wait 5 minutes before next check
    setTimeout(startMonitoring, ms('5m'));
  })();
})();