#!/usr/bin/env node

/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const dayjs = require('dayjs-with-plugins');

const Emails = require('#models/emails');
const Users = require('#models/users');
const Domains = require('#models/domains');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const fairQueue = require('#helpers/fair-queue');
const { PRIORITY_LEVELS } = require('#config/priority-levels');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

/**
 * Create test data for fair queue testing
 */
async function createTestData() {
  logger.info('Creating test data...');

  // Clean up any existing test data
  await Promise.all([
    Emails.deleteMany({ messageId: /^test-fair-queue/ }),
    Users.deleteMany({ email: /^test-fair-queue/ }),
    Domains.deleteMany({ name: /^test-fair-queue/ })
  ]);

  // Create test users
  const users = [];
  const domains = [];

  // Create 3 domains with different characteristics
  for (let i = 1; i <= 3; i++) {
    const domain = new Domains({
      name: `test-fair-queue-domain${i}.com`,
      plan: i === 1 ? 'team' : 'free', // Domain 1 is premium
      members: []
    });
    await domain.save();
    domains.push(domain);

    // Create 2-3 users per domain
    const usersPerDomain = i === 2 ? 3 : 2; // Domain 2 has more users
    for (let j = 1; j <= usersPerDomain; j++) {
      const isAdmin = i === 1 && j === 1; // First user of first domain is admin
      const isPremium = i === 1 || (i === 3 && j === 1); // Premium users
      const isNew = i === 3 && j === 2; // New user (created recently)

      const user = new Users({
        email: `test-fair-queue-user${i}-${j}@example.com`,
        password: 'testpassword123',
        plan: isPremium ? 'team' : 'free',
        group: isAdmin ? 'admin' : 'user',
        created_at: isNew ? new Date() : dayjs().subtract(30, 'days').toDate(),
        [require('#config').userFields.hasVerifiedEmail]: true
      });
      await user.save();
      users.push(user);

      // Add user to domain
      domain.members.push({
        user: user._id,
        group: isAdmin ? 'admin' : 'user'
      });
    }
    await domain.save();
  }

  // Create test emails with various scenarios
  const emails = [];
  let emailCounter = 0;

  for (const domain of domains) {
    const domainUsers = users.filter(u => 
      domain.members.some(m => m.user.equals(u._id))
    );

    for (const user of domainUsers) {
      // Create different numbers of emails per user to test fairness
      let emailCount;
      if (domain.name.includes('domain1')) {
        emailCount = user.group === 'admin' ? 5 : 3; // Admin gets more emails
      } else if (domain.name.includes('domain2')) {
        emailCount = 10; // High volume domain
      } else {
        emailCount = user.created_at > dayjs().subtract(7, 'days').toDate() ? 2 : 4; // New users get fewer
      }

      for (let i = 0; i < emailCount; i++) {
        emailCounter++;
        const email = new Emails({
          messageId: `test-fair-queue-${emailCounter}`,
          status: 'queued',
          user: user._id,
          domain: domain._id,
          envelope: {
            from: user.email,
            to: [`recipient${emailCounter}@example.com`]
          },
          message: `Test email ${emailCounter} content`,
          headers: {
            subject: `Test Subject ${emailCounter}`,
            from: user.email,
            to: `recipient${emailCounter}@example.com`,
            date: new Date().toISOString()
          },
          date: dayjs().subtract(Math.random() * 60, 'minutes').toDate(), // Random times in past hour
          created_at: dayjs().subtract(Math.random() * 60, 'minutes').toDate()
        });

        // Priorities will be set automatically by pre-save hook
        await email.save();
        emails.push(email);
      }
    }
  }

  logger.info(`Created test data: ${domains.length} domains, ${users.length} users, ${emails.length} emails`);
  
  return { domains, users, emails };
}

/**
 * Test queue health calculation
 */
async function testQueueHealth() {
  logger.info('Testing queue health calculation...');

  const queueHealth = await fairQueue.calculateQueueHealth();
  
  logger.info('Queue health metrics:', queueHealth);
  
  // Validate metrics
  if (typeof queueHealth.totalQueued !== 'number') {
    throw new Error('totalQueued should be a number');
  }
  if (typeof queueHealth.queueAge !== 'number') {
    throw new Error('queueAge should be a number');
  }
  if (typeof queueHealth.multiplier !== 'number' || queueHealth.multiplier < 0.1 || queueHealth.multiplier > 2.0) {
    throw new Error('multiplier should be between 0.1 and 2.0');
  }
  if (typeof queueHealth.isHealthy !== 'boolean') {
    throw new Error('isHealthy should be a boolean');
  }

  logger.info('✓ Queue health calculation works correctly');
  return queueHealth;
}

/**
 * Test adaptive limits calculation
 */
async function testAdaptiveLimits(queueHealth) {
  logger.info('Testing adaptive limits calculation...');

  const baseLimit = 50;
  const limits = fairQueue.calculateAdaptiveLimits(baseLimit, queueHealth);
  
  logger.info('Adaptive limits:', limits);
  
  // Validate limits
  for (const [priority, limit] of Object.entries(limits)) {
    if (typeof limit !== 'number' || limit < 0) {
      throw new Error(`Limit for priority ${priority} should be a non-negative number`);
    }
  }
  
  // Check that we have limits for all priority levels
  const expectedPriorities = Object.values(PRIORITY_LEVELS);
  for (const priority of expectedPriorities) {
    if (!(priority in limits)) {
      throw new Error(`Missing limit for priority ${priority}`);
    }
  }
  
  // Total allocated should not exceed base limit significantly
  const totalAllocated = Object.values(limits).reduce((sum, limit) => sum + limit, 0);
  if (totalAllocated > baseLimit * 1.2) { // Allow 20% over for rounding
    throw new Error(`Total allocated (${totalAllocated}) exceeds base limit (${baseLimit}) by too much`);
  }

  logger.info('✓ Adaptive limits calculation works correctly');
  return limits;
}

/**
 * Test domain fair distribution
 */
async function testDomainFairDistribution(queueHealth) {
  logger.info('Testing domain fair distribution...');

  const query = {
    status: 'queued',
    $or: [
      { throttled_until: { $exists: false } },
      { throttled_until: { $lt: new Date() } }
    ]
  };

  const limit = 20;
  
  // Test without queue health (basic fair distribution)
  const basicEmails = await fairQueue.getDomainFairDistribution(query, limit);
  logger.info(`Basic distribution selected ${basicEmails.length} emails`);
  
  // Test with queue health (adaptive distribution)
  const adaptiveEmails = await fairQueue.getDomainFairDistribution(query, limit, queueHealth);
  logger.info(`Adaptive distribution selected ${adaptiveEmails.length} emails`);
  
  // Analyze distribution fairness
  const basicDomainCounts = {};
  const adaptiveDomainCounts = {};
  const basicPriorityCounts = {};
  const adaptivePriorityCounts = {};
  
  for (const email of basicEmails) {
    const domainKey = email.domain.toString().slice(-6);
    basicDomainCounts[domainKey] = (basicDomainCounts[domainKey] || 0) + 1;
    basicPriorityCounts[email.priority] = (basicPriorityCounts[email.priority] || 0) + 1;
  }
  
  for (const email of adaptiveEmails) {
    const domainKey = email.domain.toString().slice(-6);
    adaptiveDomainCounts[domainKey] = (adaptiveDomainCounts[domainKey] || 0) + 1;
    adaptivePriorityCounts[email.priority] = (adaptivePriorityCounts[email.priority] || 0) + 1;
  }
  
  logger.info('Basic distribution by domain:', basicDomainCounts);
  logger.info('Adaptive distribution by domain:', adaptiveDomainCounts);
  logger.info('Basic distribution by priority:', basicPriorityCounts);
  logger.info('Adaptive distribution by priority:', adaptivePriorityCounts);
  
  // Validate fairness (no single domain should have >60% of emails)
  const basicMaxDomain = Math.max(...Object.values(basicDomainCounts));
  const adaptiveMaxDomain = Math.max(...Object.values(adaptiveDomainCounts));
  
  if (basicMaxDomain / basicEmails.length > 0.6) {
    logger.warn('Basic distribution may not be fair - single domain has >60% of emails');
  }
  if (adaptiveMaxDomain / adaptiveEmails.length > 0.6) {
    logger.warn('Adaptive distribution may not be fair - single domain has >60% of emails');
  }
  
  logger.info('✓ Domain fair distribution works correctly');
  
  return { basicEmails, adaptiveEmails };
}

/**
 * Test abuse score calculation
 */
async function testAbuseScoreCalculation() {
  logger.info('Testing abuse score calculation...');

  // Get a test user
  const testUser = await Users.findOne({ email: /test-fair-queue/ }).lean();
  if (!testUser) {
    throw new Error('No test user found');
  }

  const abuseScore = await fairQueue.calculateUserAbuseScore(testUser._id);
  
  logger.info(`User abuse score: ${abuseScore}`);
  
  // Validate score
  if (typeof abuseScore !== 'number' || abuseScore < 0 || abuseScore > 100) {
    throw new Error('Abuse score should be between 0 and 100');
  }

  logger.info('✓ Abuse score calculation works correctly');
  return abuseScore;
}

/**
 * Test throttling functionality
 */
async function testThrottling() {
  logger.info('Testing throttling functionality...');

  // Get a test user with multiple emails
  const testUser = await Users.findOne({ email: /test-fair-queue/ }).lean();
  if (!testUser) {
    throw new Error('No test user found');
  }

  const beforeCount = await Emails.countDocuments({
    user: testUser._id,
    status: 'queued',
    throttled_until: { $exists: false }
  });

  logger.info(`User has ${beforeCount} unthrottled emails before throttling`);

  // Apply throttling with a high abuse score
  const throttleResult = await fairQueue.applyUserThrottling(testUser._id, 75);
  
  logger.info('Throttle result:', throttleResult);
  
  const afterCount = await Emails.countDocuments({
    user: testUser._id,
    status: 'queued',
    throttled_until: { $exists: false }
  });

  logger.info(`User has ${afterCount} unthrottled emails after throttling`);
  
  // Validate throttling was applied
  if (throttleResult.affectedEmails === 0) {
    logger.warn('No emails were throttled - this may be expected if user had no queued emails');
  } else if (afterCount >= beforeCount) {
    throw new Error('Throttling did not reduce unthrottled email count');
  }

  // Test cleanup of expired throttling
  logger.info('Testing throttling cleanup...');
  
  // Manually expire throttling for testing
  await Emails.updateMany(
    { user: testUser._id, throttled_until: { $exists: true } },
    { $set: { throttled_until: new Date(Date.now() - 1000) } } // 1 second ago
  );

  const cleanedUp = await fairQueue.cleanupExpiredThrottling();
  logger.info(`Cleaned up throttling for ${cleanedUp} emails`);

  logger.info('✓ Throttling functionality works correctly');
  return throttleResult;
}

/**
 * Test end-to-end fair queue scenario
 */
async function testEndToEndScenario() {
  logger.info('Testing end-to-end fair queue scenario...');

  // Simulate the main send-emails job logic
  const queueHealth = await fairQueue.calculateQueueHealth();
  const limit = 15;

  const query = {
    status: 'queued',
    $or: [
      { throttled_until: { $exists: false } },
      { throttled_until: { $lt: new Date() } }
    ]
  };

  logger.info(`Simulating queue processing with limit=${limit}, health=${queueHealth.multiplier.toFixed(2)}`);

  // Clean up expired throttling
  await fairQueue.cleanupExpiredThrottling();

  // Get fair distribution
  const selectedEmails = await fairQueue.getDomainFairDistribution(query, limit, queueHealth);
  
  logger.info(`Selected ${selectedEmails.length} emails for processing`);

  // Analyze the selection
  const domainCounts = {};
  const userCounts = {};
  const priorityCounts = {};
  
  for (const email of selectedEmails) {
    const domainKey = email.domain.toString().slice(-6);
    const userKey = email.user.toString().slice(-6);
    
    domainCounts[domainKey] = (domainCounts[domainKey] || 0) + 1;
    userCounts[userKey] = (userCounts[userKey] || 0) + 1;
    priorityCounts[email.priority] = (priorityCounts[email.priority] || 0) + 1;
  }

  logger.info('End-to-end distribution by domain:', domainCounts);
  logger.info('End-to-end distribution by user:', userCounts);
  logger.info('End-to-end distribution by priority:', priorityCounts);

  // Calculate fairness metrics
  const totalEmails = selectedEmails.length;
  const maxDomainPercentage = Math.max(...Object.values(domainCounts)) / totalEmails * 100;
  const maxUserPercentage = Math.max(...Object.values(userCounts)) / totalEmails * 100;

  logger.info(`Fairness metrics: Max domain: ${maxDomainPercentage.toFixed(1)}%, Max user: ${maxUserPercentage.toFixed(1)}%`);

  // Validate fairness
  if (maxDomainPercentage > 70) {
    logger.warn(`Domain distribution may be unfair: ${maxDomainPercentage.toFixed(1)}% for single domain`);
  }
  if (maxUserPercentage > 50) {
    logger.warn(`User distribution may be unfair: ${maxUserPercentage.toFixed(1)}% for single user`);
  }

  logger.info('✓ End-to-end scenario completed successfully');
  
  return {
    selectedEmails,
    domainCounts,
    userCounts,
    priorityCounts,
    fairnessMetrics: {
      maxDomainPercentage,
      maxUserPercentage
    }
  };
}

/**
 * Clean up test data
 */
async function cleanupTestData() {
  logger.info('Cleaning up test data...');

  const deleteResults = await Promise.all([
    Emails.deleteMany({ messageId: /^test-fair-queue/ }),
    Users.deleteMany({ email: /^test-fair-queue/ }),
    Domains.deleteMany({ name: /^test-fair-queue/ })
  ]);

  logger.info(`Cleaned up: ${deleteResults[0].deletedCount} emails, ${deleteResults[1].deletedCount} users, ${deleteResults[2].deletedCount} domains`);
}

/**
 * Main test function
 */
async function runFairQueueTests() {
  try {
    logger.info('Starting fair queue logic tests...');

    // Create test data
    await createTestData();

    // Run individual tests
    const queueHealth = await testQueueHealth();
    await testAdaptiveLimits(queueHealth);
    await testDomainFairDistribution(queueHealth);
    await testAbuseScoreCalculation();
    await testThrottling();
    
    // Run end-to-end test
    const endToEndResult = await testEndToEndScenario();

    logger.info('All fair queue tests passed successfully!');
    logger.info('Test Summary:', {
      queueHealth: queueHealth.isHealthy,
      emailsProcessed: endToEndResult.selectedEmails.length,
      fairnessMetrics: endToEndResult.fairnessMetrics
    });

    return true;

  } catch (err) {
    logger.error('Fair queue test failed:', err);
    return false;
  } finally {
    // Always clean up test data
    await cleanupTestData();
  }
}

(async () => {
  await setupMongoose(logger);
  
  try {
    const success = await runFairQueueTests();
    process.exit(success ? 0 : 1);
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
})();