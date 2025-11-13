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
const Domains = require('#models/domains');
const Users = require('#models/users');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const BATCH_SIZE = 1000;

// Priority levels constants
const PRIORITY_LEVELS = {
  HIGH: 2,      // Paid users, good reputation  
  NORMAL: 1,    // Regular users (new default)
  LOW: 0,       // Free tier, new accounts
  THROTTLED: -1 // Detected abuse/suspicious activity
};

async function migrateFairQueueFields() {
  try {
    logger.info('Starting fair queue migration...');

    // Get total count for progress tracking
    const totalCount = await Emails.countDocuments({});
    logger.info(`Total emails to migrate: ${totalCount}`);

    let migratedCount = 0;
    let batchCount = 0;

    // Process emails in batches using cursor
    const cursor = Emails.find({}).lean().cursor().addCursorFlag('noCursorTimeout', true);
    
    const batch = [];
    
    for (let email = await cursor.next(); email; email = await cursor.next()) {
      batch.push(email);
      
      // Process batch when it reaches BATCH_SIZE or at the end
      if (batch.length >= BATCH_SIZE || (!await cursor.next() && batch.length > 0)) {
        batchCount++;
        logger.info(`Processing batch ${batchCount} (${batch.length} emails)...`);
        
        const bulkOps = [];
        
        for (const email of batch) {
          const updateFields = {};
          let needsUpdate = false;

          // Set default priority to NORMAL (1) if currently 0 or missing
          if (email.priority === 0 || email.priority === undefined) {
            updateFields.priority = PRIORITY_LEVELS.NORMAL;
            needsUpdate = true;
          }

          // Set default abuse_score if missing
          if (email.abuse_score === undefined) {
            updateFields.abuse_score = 0;
            needsUpdate = true;
          }

          // Determine priority based on domain/user info
          if (email.domain && email.user) {
            try {
              const [domain, user] = await Promise.all([
                Domains.findById(email.domain).lean().populate('members.user', 'id group plan created_at'),
                Users.findById(email.user).lean().select('id plan created_at group')
              ]);

              if (domain && user) {
                let newPriority = PRIORITY_LEVELS.NORMAL;

                // Check if user is an admin or domain has admin users with premium plans
                const isAdmin = user.group === 'admin';
                const adminExists = domain.members.some(
                  m => m.user && m.user.group === 'admin' && 
                       ['enhanced_protection', 'team'].includes(m.user.plan)
                );

                if (isAdmin || adminExists) {
                  newPriority = PRIORITY_LEVELS.HIGH;
                } else if (dayjs().diff(user.created_at, 'days') < 7) {
                  // New accounts get lower priority
                  newPriority = PRIORITY_LEVELS.LOW;
                }

                if (email.priority !== newPriority) {
                  updateFields.priority = newPriority;
                  needsUpdate = true;
                }
              }
            } catch (err) {
              logger.warn(`Failed to lookup domain/user for email ${email._id}: ${err.message}`);
              // Continue with default priority
            }
          }

          if (needsUpdate) {
            bulkOps.push({
              updateOne: {
                filter: { _id: email._id },
                update: { $set: updateFields }
              }
            });
          }
        }

        // Execute batch updates
        if (bulkOps.length > 0) {
          const result = await Emails.bulkWrite(bulkOps, { ordered: false });
          logger.info(`Updated ${result.modifiedCount} emails in batch ${batchCount}`);
          migratedCount += result.modifiedCount;
        }

        batch.length = 0; // Clear batch
        
        // Progress update
        const processed = Math.min(batchCount * BATCH_SIZE, totalCount);
        const percentage = ((processed / totalCount) * 100).toFixed(1);
        logger.info(`Progress: ${processed}/${totalCount} (${percentage}%)`);
      }
    }

    logger.info(`Migration completed! Updated ${migratedCount} emails total.`);

    // Create indexes after migration (in case they don't exist)
    logger.info('Ensuring indexes exist...');
    
    await Promise.all([
      // Fair queue composite index
      Emails.collection.createIndex({
        status: 1,
        priority: -1,
        domain: 1, 
        user: 1,
        created_at: 1
      }, { background: true }),
      
      // Throttled emails index
      Emails.collection.createIndex(
        { throttled_until: 1, status: 1 },
        { 
          background: true,
          partialFilterExpression: { throttled_until: { $exists: true } }
        }
      ),
      
      // Abuse score index
      Emails.collection.createIndex(
        { abuse_score: 1, user: 1 },
        { background: true }
      )
    ]);

    logger.info('Indexes created successfully!');

    // Generate migration summary
    const priorityCounts = await Emails.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    logger.info('Priority distribution after migration:');
    for (const { _id, count } of priorityCounts) {
      const levelName = Object.keys(PRIORITY_LEVELS).find(k => PRIORITY_LEVELS[k] === _id) || 'UNKNOWN';
      logger.info(`  Priority ${_id} (${levelName}): ${count} emails`);
    }

    logger.info('Fair queue migration completed successfully!');

  } catch (err) {
    logger.error('Migration failed:', err);
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);
  
  try {
    await migrateFairQueueFields();
    process.exit(0);
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
})();