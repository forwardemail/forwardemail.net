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

const Emails = require('#models/emails');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { PRIORITY_LEVELS } = require('#config/priority-levels');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function testSchemaChanges() {
  try {
    logger.info('Testing fair queue schema changes...');

    // Test 1: Validate schema fields exist and have correct defaults
    logger.info('Test 1: Schema validation...');
    
    const schema = Emails.schema;
    const paths = schema.paths;
    
    // Check priority field
    if (!paths.priority) {
      throw new Error('Priority field missing from schema');
    }
    if (paths.priority.options.default !== PRIORITY_LEVELS.NORMAL) {
      throw new Error(`Priority default should be ${PRIORITY_LEVELS.NORMAL}, got ${paths.priority.options.default}`);
    }
    logger.info('✓ Priority field configured correctly');

    // Check abuse_score field
    if (!paths.abuse_score) {
      throw new Error('abuse_score field missing from schema');
    }
    if (paths.abuse_score.options.default !== 0) {
      throw new Error('abuse_score default should be 0');
    }
    if (paths.abuse_score.options.min !== 0 || paths.abuse_score.options.max !== 100) {
      throw new Error('abuse_score should have min: 0, max: 100');
    }
    logger.info('✓ abuse_score field configured correctly');

    // Check throttled_until field
    if (!paths.throttled_until) {
      throw new Error('throttled_until field missing from schema');
    }
    if (paths.throttled_until.instance !== 'Date') {
      throw new Error('throttled_until should be Date type');
    }
    logger.info('✓ throttled_until field configured correctly');

    // Test 2: Check indexes exist
    logger.info('Test 2: Index validation...');
    
    const indexes = await Emails.collection.getIndexes();
    logger.info(`Found ${Object.keys(indexes).length} indexes`);
    
    // Check for fair queue composite index
    const fairQueueIndex = Object.keys(indexes).find(key => 
      indexes[key].some(field => 
        typeof field === 'object' && 
        field.status === 1 && 
        field.priority === -1 && 
        field.domain === 1 && 
        field.user === 1 && 
        field.created_at === 1
      )
    );
    
    if (fairQueueIndex) {
      logger.info('✓ Fair queue composite index exists');
    } else {
      logger.warn('Fair queue composite index not found - may need to run migration');
    }

    // Test 3: Test creating email with new fields
    logger.info('Test 3: Email creation test...');
    
    // Note: We'll do a dry run without actually saving to avoid dependencies
    const testEmail = new Emails({
      priority: PRIORITY_LEVELS.HIGH,
      abuse_score: 25,
      throttled_until: new Date(Date.now() + 60000), // 1 minute from now
      status: 'queued',
      envelope: { from: 'test@example.com', to: ['recipient@example.com'] },
      message: 'Test message content',
      messageId: 'test-message-id',
      headers: { subject: 'Test Subject', from: 'test@example.com' },
      date: new Date(),
      user: new mongoose.Types.ObjectId(),
      domain: new mongoose.Types.ObjectId()
    });

    // Validate without saving
    await testEmail.validate();
    logger.info('✓ Email creation with new fields validates successfully');

    // Test 4: Test priority validation
    logger.info('Test 4: Priority validation test...');
    
    const testPriorities = [
      PRIORITY_LEVELS.THROTTLED,
      PRIORITY_LEVELS.LOW, 
      PRIORITY_LEVELS.NORMAL,
      PRIORITY_LEVELS.HIGH,
      5 // Custom high priority
    ];

    for (const priority of testPriorities) {
      const email = new Emails({
        priority,
        status: 'queued',
        envelope: { from: 'test@example.com', to: ['recipient@example.com'] },
        message: 'Test message',
        messageId: `test-${priority}`,
        headers: { subject: 'Test', from: 'test@example.com' },
        date: new Date(),
        user: new mongoose.Types.ObjectId(),
        domain: new mongoose.Types.ObjectId()
      });
      
      await email.validate();
      if (email.priority !== priority) {
        throw new Error(`Priority validation failed for ${priority}`);
      }
    }
    logger.info('✓ Priority validation works for all levels');

    // Test 5: Test abuse score validation
    logger.info('Test 5: Abuse score validation test...');
    
    // Valid abuse scores
    for (const score of [0, 25, 50, 75, 100]) {
      const email = new Emails({
        abuse_score: score,
        status: 'queued',
        envelope: { from: 'test@example.com', to: ['recipient@example.com'] },
        message: 'Test message',
        messageId: `test-abuse-${score}`,
        headers: { subject: 'Test', from: 'test@example.com' },
        date: new Date(),
        user: new mongoose.Types.ObjectId(),
        domain: new mongoose.Types.ObjectId()
      });
      
      await email.validate();
      if (email.abuse_score !== score) {
        throw new Error(`Abuse score validation failed for ${score}`);
      }
    }
    logger.info('✓ Abuse score validation works for valid ranges');

    // Test invalid abuse scores should fail
    try {
      const invalidEmail = new Emails({
        abuse_score: 150, // Invalid: > 100
        status: 'queued',
        envelope: { from: 'test@example.com', to: ['recipient@example.com'] },
        message: 'Test message',
        messageId: 'test-invalid-abuse',
        headers: { subject: 'Test', from: 'test@example.com' },
        date: new Date(),
        user: new mongoose.Types.ObjectId(),
        domain: new mongoose.Types.ObjectId()
      });
      
      await invalidEmail.validate();
      throw new Error('Should have failed validation for abuse_score > 100');
    } catch (err) {
      if (err.message.includes('validation failed')) {
        logger.info('✓ Invalid abuse score properly rejected');
      } else {
        throw err;
      }
    }

    // Test 6: Sample queries that would be used by fair queue
    logger.info('Test 6: Sample fair queue queries...');
    
    const sampleQuery = {
      status: 'queued',
      $or: [
        { throttled_until: { $exists: false } },
        { throttled_until: { $lt: new Date() } }
      ]
    };

    // This query should work with our new indexes
    await Emails.find(sampleQuery)
      .sort({ priority: -1, created_at: 1 })
      .limit(10)
      .explain(sampleQuery);
      
    logger.info('✓ Fair queue query execution plan generated successfully');

    logger.info('All tests passed! Schema changes are working correctly.');

  } catch (err) {
    logger.error('Schema test failed:', err);
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);
  
  try {
    await testSchemaChanges();
    logger.info('Schema testing completed successfully!');
    process.exit(0);
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
})();