/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');

const { Users } = require('#models');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

/**
 * Migration script to add enterprise plan support
 *
 * This script:
 * 1. Adds compound indexes for optimized enterprise queries
 * 2. Validates that all existing user plans are still valid
 * 3. Provides infrastructure for future enterprise user migrations
 */

(async () => {
  try {
    await setupMongoose();

    console.log('🚀 Starting enterprise plan migration...\n');

    // 1. Add compound indexes for optimized enterprise queries
    console.log('📊 Adding compound indexes for enterprise queries...');

    // Index for enterprise admin queries
    await Users.collection.createIndex(
      { plan: 1, is_banned: 1, has_verified_email: 1 },
      {
        name: 'enterprise_admin_query_idx',
        background: true
      }
    );

    // Index for plan-based filtering with creation date
    await Users.collection.createIndex(
      { plan: 1, created_at: -1 },
      {
        name: 'plan_created_idx',
        background: true
      }
    );

    console.log('✅ Compound indexes created successfully');

    // 2. Validate existing user plans
    console.log('\n📋 Validating existing user plans...');

    const planStats = await Users.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('📈 Current plan distribution:');
    for (const stat of planStats) {
      console.log(`  - ${stat._id}: ${stat.count.toLocaleString()} users`);
    }

    // Check for any invalid plans
    const invalidPlans = await Users.countDocuments({
      plan: {
        $nin: ['free', 'enhanced_protection', 'team', 'enterprise']
      }
    });

    if (invalidPlans > 0) {
      console.log(
        `⚠️  Warning: Found ${invalidPlans} users with invalid plans`
      );

      const invalidPlanUsers = await Users.find({
        plan: {
          $nin: ['free', 'enhanced_protection', 'team', 'enterprise']
        }
      })
        .select('email plan')
        .limit(5);

      console.log('📋 Sample users with invalid plans:');
      for (const user of invalidPlanUsers) {
        console.log(`  - ${user.email}: ${user.plan}`);
      }
    } else {
      console.log('✅ All existing user plans are valid');
    }

    // 3. Prepare for future enterprise migrations
    console.log('\n🏢 Preparing enterprise migration infrastructure...');

    // Count potential enterprise candidates (team users with high activity)
    const enterpriseCandidates = await Users.aggregate([
      {
        $match: {
          plan: 'team',
          is_banned: false,
          has_verified_email: true
        }
      },
      {
        $lookup: {
          from: 'domains',
          localField: '_id',
          foreignField: 'members.user',
          as: 'domains'
        }
      },
      {
        $addFields: {
          domainCount: { $size: '$domains' }
        }
      },
      {
        $match: {
          domainCount: { $gte: 5 } // Users with 5+ domains might be enterprise candidates
        }
      },
      {
        $count: 'total'
      }
    ]);

    const candidateCount = enterpriseCandidates[0]?.total || 0;
    console.log(
      `📊 Found ${candidateCount} potential enterprise candidates (team users with 5+ domains)`
    );

    console.log('\n✅ Enterprise plan migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('  1. Create Stripe products and prices for enterprise plan');
    console.log('  2. Create PayPal subscription plans for enterprise');
    console.log('  3. Set environment variables for payment provider IDs');
    console.log('  4. Update admin interface to show enterprise users');
    console.log('  5. Test payment flows with enterprise plan');

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();
