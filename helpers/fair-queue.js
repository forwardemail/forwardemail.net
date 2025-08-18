/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const Emails = require('#models/emails');
const Users = require('#models/users');
const config = require('#config');
const logger = require('#helpers/logger');
const { PRIORITY_LEVELS, PRIORITY_CONFIG } = require('#config/priority-levels');

/**
 * Calculate queue health metrics and adaptive multipliers
 * @returns {Object} Queue health information
 */
async function calculateQueueHealth() {
  const now = new Date();
  
  // Count total queued emails
  const totalQueued = await Emails.countDocuments({ 
    status: 'queued',
    $or: [
      { throttled_until: { $exists: false } },
      { throttled_until: { $lt: now } }
    ]
  });
  
  // Find oldest queued email
  const oldestQueued = await Emails.findOne(
    { 
      status: 'queued',
      $or: [
        { throttled_until: { $exists: false } },
        { throttled_until: { $lt: now } }
      ]
    },
    { created_at: 1 },
    { sort: { created_at: 1 } }
  );
  
  const queueAge = oldestQueued ? 
    dayjs().diff(oldestQueued.created_at, 'minutes') : 0;
  
  // Calculate health multiplier (0.1 to 2.0)
  let multiplier = 1.0;
  
  // Reduce throughput if queue is too full
  if (totalQueued > config.smtpMaxQueue * 0.8) {
    multiplier *= 0.7;
  }
  
  // Reduce throughput if emails are waiting too long
  if (queueAge > 30) {
    multiplier *= 0.5;
  }
  
  // Increase throughput if queue is light
  if (totalQueued < config.smtpMaxQueue * 0.3) {
    multiplier *= 1.5;
  }
  
  // Clamp between min and max values
  multiplier = Math.max(0.1, Math.min(2.0, multiplier));
  
  return {
    totalQueued,
    queueAge,
    multiplier,
    isHealthy: multiplier >= 0.8
  };
}

/**
 * Calculate adaptive limits for each priority level
 * @param {number} baseLimit - Base queue limit
 * @param {Object} queueHealth - Queue health metrics
 * @returns {Object} Priority-based limits
 */
function calculateAdaptiveLimits(baseLimit, queueHealth) {
  const limits = {};
  
  // Adjust multipliers based on queue health
  let adjustedMultipliers = { ...PRIORITY_CONFIG.QUEUE_MULTIPLIERS };
  
  // If queue is unhealthy, favor high priority more
  if (!queueHealth.isHealthy) {
    adjustedMultipliers[PRIORITY_LEVELS.HIGH] *= 2.0;      // Boost high priority
    adjustedMultipliers[PRIORITY_LEVELS.NORMAL] *= 0.7;    // Reduce normal
    adjustedMultipliers[PRIORITY_LEVELS.LOW] *= 0.3;       // Significantly reduce low
    adjustedMultipliers[PRIORITY_LEVELS.THROTTLED] *= 0.1; // Minimal throttled
  }
  
  // If queue age is very high, prioritize clearing backlog
  if (queueHealth.queueAge > 60) { // Over 1 hour old
    adjustedMultipliers[PRIORITY_LEVELS.HIGH] *= 1.5;
    adjustedMultipliers[PRIORITY_LEVELS.NORMAL] *= 1.2;
  }
  
  for (const [priority, multiplier] of Object.entries(adjustedMultipliers)) {
    limits[priority] = Math.max(
      priority === PRIORITY_LEVELS.THROTTLED ? 0 : 1, // Throttled can be 0
      Math.floor(baseLimit * queueHealth.multiplier * multiplier)
    );
  }
  
  // Ensure we don't exceed total limit
  const totalAllocated = Object.values(limits).reduce((sum, limit) => sum + limit, 0);
  if (totalAllocated > baseLimit) {
    const ratio = baseLimit / totalAllocated;
    for (const priority of Object.keys(limits)) {
      limits[priority] = Math.floor(limits[priority] * ratio);
    }
  }
  
  return limits;
}

/**
 * Get domain-based email distribution for fair queuing with adaptive priority limits
 * @param {Object} query - Base MongoDB query
 * @param {number} limit - Maximum emails to process
 * @param {Object} queueHealth - Queue health metrics (optional)
 * @returns {Array} Selected emails for processing
 */
async function getDomainFairDistribution(query, limit, queueHealth = null) {
  // Calculate adaptive limits if queue health provided
  let priorityLimits = null;
  if (queueHealth) {
    priorityLimits = calculateAdaptiveLimits(limit, queueHealth);
    logger.debug('Adaptive priority limits:', priorityLimits);
  }

  // Get domain distribution with priority breakdown
  const domainEmailCounts = await Emails.aggregate([
    { $match: query },
    { 
      $group: { 
        _id: { domain: '$domain', priority: '$priority' },
        count: { $sum: 1 }
      } 
    },
    {
      $group: {
        _id: '$_id.domain',
        totalCount: { $sum: '$count' },
        priorityBreakdown: {
          $push: {
            priority: '$_id.priority',
            count: '$count'
          }
        }
      }
    },
    { $sort: { totalCount: 1 } } // Least busy domains first
  ]);
  
  if (domainEmailCounts.length === 0) {
    return [];
  }
  
  logger.info(`Fair queue: Processing ${domainEmailCounts.length} domains`);
  
  const selectedEmails = [];
  const priorityUsed = {};
  
  // Initialize priority usage tracking
  if (priorityLimits) {
    for (const priority of Object.keys(priorityLimits)) {
      priorityUsed[priority] = 0;
    }
  }
  
  // Calculate base max per domain
  const baseMaxPerDomain = Math.max(1, Math.floor(limit / domainEmailCounts.length));
  
  // Process each domain fairly
  for (const { _id: domainId, totalCount, priorityBreakdown } of domainEmailCounts) {
    if (selectedEmails.length >= limit) break;
    
    const remainingLimit = limit - selectedEmails.length;
    const domainLimit = Math.min(baseMaxPerDomain, totalCount, remainingLimit);
    
    let domainSelected = 0;
    
    // Process by priority levels (high to low)
    const sortedPriorities = priorityBreakdown.sort((a, b) => b.priority - a.priority);
    
    for (const { priority, count } of sortedPriorities) {
      if (domainSelected >= domainLimit) break;
      
      let priorityLimit = domainLimit - domainSelected;
      
      // Apply adaptive priority limits if available
      if (priorityLimits && priorityLimits[priority] !== undefined) {
        const remainingForPriority = priorityLimits[priority] - (priorityUsed[priority] || 0);
        priorityLimit = Math.min(priorityLimit, remainingForPriority);
      }
      
      if (priorityLimit <= 0) continue;
      
      // Get emails for this domain and priority
      const priorityEmails = await Emails.find({
        ...query,
        domain: domainId,
        priority: priority
      })
      .sort({ created_at: 1 }) // FIFO within same priority
      .limit(priorityLimit)
      .lean();
      
      selectedEmails.push(...priorityEmails);
      domainSelected += priorityEmails.length;
      
      if (priorityLimits) {
        priorityUsed[priority] = (priorityUsed[priority] || 0) + priorityEmails.length;
      }
      
      logger.debug(
        `Fair queue: Domain ${domainId.toString().slice(-6)} Priority ${priority} - selected ${priorityEmails.length}/${count} emails`
      );
    }
  }
  
  // Log priority usage summary
  if (priorityLimits) {
    logger.info('Priority usage:', priorityUsed);
  }
  
  return selectedEmails;
}

/**
 * Get user-based email distribution within a domain for fair queuing
 * @param {Object} query - Base MongoDB query  
 * @param {string} domainId - Domain ID
 * @param {number} domainLimit - Maximum emails for this domain
 * @returns {Array} Selected emails for processing
 */
async function getUserFairDistribution(query, domainId, domainLimit) {
  // Get user distribution within domain
  const userEmailCounts = await Emails.aggregate([
    { 
      $match: {
        ...query,
        domain: domainId
      }
    },
    { 
      $group: { 
        _id: '$user', 
        count: { $sum: 1 },
        avgPriority: { $avg: '$priority' }
      } 
    },
    { $sort: { count: 1 } } // Least busy users first
  ]);
  
  if (userEmailCounts.length === 0) {
    return [];
  }
  
  const maxPerUser = Math.max(1, Math.floor(domainLimit / userEmailCounts.length));
  const selectedEmails = [];
  
  // Process each user fairly within domain
  for (const { _id: userId, count } of userEmailCounts) {
    if (selectedEmails.length >= domainLimit) break;
    
    const userLimit = Math.min(maxPerUser, count, domainLimit - selectedEmails.length);
    
    // Get emails for this user, prioritized
    const userEmails = await Emails.find({
      ...query,
      domain: domainId,
      user: userId
    })
    .sort({ 
      priority: -1,
      created_at: 1
    })
    .limit(userLimit)
    .lean();
    
    selectedEmails.push(...userEmails);
  }
  
  return selectedEmails;
}

/**
 * Calculate abuse score for a user based on recent activity
 * @param {string} userId - User ID
 * @returns {number} Abuse score (0-100)
 */
async function calculateUserAbuseScore(userId) {
  const window = dayjs().subtract(24, 'hours').toDate();
  
  const stats = await Emails.aggregate([
    {
      $match: {
        user: userId,
        created_at: { $gte: window }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        bounced: { $sum: { $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
      }
    }
  ]);

  if (!stats[0] || stats[0].total === 0) return 0;

  const { total, bounced, rejected } = stats[0];
  const bounceRate = bounced / total;
  const rejectRate = rejected / total;
  
  let score = 0;
  
  // High bounce/reject rates
  if (bounceRate > 0.1) score += 30;    // 10%+ bounce rate
  if (rejectRate > 0.05) score += 20;   // 5%+ reject rate
  
  // Get user info for additional checks
  const user = await Users.findById(userId).select('created_at').lean();
  if (!user) return score;
  
  // Get average daily volume for comparison
  const avgDaily = await getAverageDailyVolume(userId);
  
  // Volume spike detection  
  if (total > avgDaily * 5) score += 25; // 5x normal volume
  
  // New account sending high volume
  if (dayjs().diff(user.created_at, 'days') < 7 && total > 100) {
    score += 40;
  }
  
  return Math.min(score, 100);
}

/**
 * Get average daily email volume for a user over past 30 days
 * @param {string} userId - User ID
 * @returns {number} Average daily volume
 */
async function getAverageDailyVolume(userId) {
  const thirtyDaysAgo = dayjs().subtract(30, 'days').toDate();
  
  const total = await Emails.countDocuments({
    user: userId,
    created_at: { $gte: thirtyDaysAgo }
  });
  
  return Math.max(1, Math.floor(total / 30));
}

/**
 * Apply throttling to a user's emails based on abuse score
 * @param {string} userId - User ID
 * @param {number} abuseScore - Calculated abuse score
 */
async function applyUserThrottling(userId, abuseScore) {
  if (abuseScore < PRIORITY_CONFIG.ABUSE_THRESHOLD) return;
  
  // Calculate throttle duration (exponential backoff)
  const throttleDuration = Math.min(
    ms('1h') * Math.pow(2, Math.floor(abuseScore / 20)),
    PRIORITY_CONFIG.MAX_THROTTLE_DURATION
  );
  
  const throttledUntil = new Date(Date.now() + throttleDuration);
  
  // Update all queued emails for this user
  const result = await Emails.updateMany(
    { 
      user: userId, 
      status: 'queued',
      $or: [
        { throttled_until: { $exists: false } },
        { throttled_until: { $lt: new Date() } }
      ]
    },
    {
      $set: {
        priority: PRIORITY_LEVELS.THROTTLED,
        throttled_until: throttledUntil,
        abuse_score: abuseScore
      }
    }
  );
  
  logger.warn(
    `User ${userId} throttled for ${ms(throttleDuration, { long: true })} - abuse score: ${abuseScore}, affected emails: ${result.modifiedCount}`
  );
  
  return {
    throttledUntil,
    affectedEmails: result.modifiedCount,
    duration: throttleDuration
  };
}

/**
 * Clean up expired throttling
 */
async function cleanupExpiredThrottling() {
  const now = new Date();
  
  const result = await Emails.updateMany(
    {
      status: 'queued',
      throttled_until: { $exists: true, $lt: now },
      priority: PRIORITY_LEVELS.THROTTLED
    },
    {
      $set: { priority: PRIORITY_LEVELS.NORMAL },
      $unset: { throttled_until: 1 }
    }
  );
  
  if (result.modifiedCount > 0) {
    logger.info(`Cleaned up throttling for ${result.modifiedCount} emails`);
  }
  
  return result.modifiedCount;
}

module.exports = {
  calculateQueueHealth,
  calculateAdaptiveLimits,
  getDomainFairDistribution,
  getUserFairDistribution,
  calculateUserAbuseScore,
  applyUserThrottling,
  cleanupExpiredThrottling,
  getAverageDailyVolume
};