/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Migration Script: Opt-out all users from daily-log-alert and weekly-dmarc-report
 *
 * This script updates all existing users to be opted out of:
 * - daily-log-alert
 * - weekly-dmarc-report
 *
 * These templates are now opted out by default for new users, but existing users
 * need to be migrated to match this new default behavior.
 *
 * Usage:
 *   node scripts/migrate-opt-out-daily-log-dmarc.js
 *
 * Options:
 *   DRY_RUN=true - Preview changes without applying them
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const { Users } = require('#models');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const TEMPLATES_TO_OPT_OUT = ['daily-log-alert', 'weekly-dmarc-report'];
const DRY_RUN = process.env.DRY_RUN === 'true';

(async () => {
  try {
    await setupMongoose(logger);

    console.log('='.repeat(60));
    console.log(
      'Migration: Opt-out users from daily-log-alert and weekly-dmarc-report'
    );
    console.log('='.repeat(60));
    console.log(
      `Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE'}`
    );
    console.log('');

    // Count users who need to be updated for each template
    for (const template of TEMPLATES_TO_OPT_OUT) {
      const countNotOptedOut = await Users.countDocuments({
        opt_out_templates: { $ne: template }
      });
      console.log(`Users NOT opted out of '${template}': ${countNotOptedOut}`);
    }

    // Count users who need at least one of the templates added
    const usersNeedingUpdate = await Users.countDocuments({
      $or: TEMPLATES_TO_OPT_OUT.map((template) => ({
        opt_out_templates: { $ne: template }
      }))
    });

    console.log('');
    console.log(`Total users needing update: ${usersNeedingUpdate}`);
    console.log('');

    if (DRY_RUN) {
      console.log(
        'DRY RUN: No changes made. Run without DRY_RUN=true to apply changes.'
      );
    } else {
      console.log('Applying updates...');

      // Use $addToSet to add templates without duplicates
      // This is done in a single bulk operation for efficiency
      const result = await Users.updateMany(
        {
          // Only update users who are missing at least one of the templates
          $or: TEMPLATES_TO_OPT_OUT.map((template) => ({
            opt_out_templates: { $ne: template }
          }))
        },
        {
          $addToSet: {
            opt_out_templates: { $each: TEMPLATES_TO_OPT_OUT }
          }
        }
      );

      console.log('');
      console.log('Update Results:');
      console.log(`  Matched: ${result.matchedCount}`);
      console.log(`  Modified: ${result.modifiedCount}`);
    }

    // Verify the update
    console.log('');
    console.log('Verification (users still NOT opted out after migration):');
    for (const template of TEMPLATES_TO_OPT_OUT) {
      const countNotOptedOut = await Users.countDocuments({
        opt_out_templates: { $ne: template }
      });
      console.log(`  '${template}': ${countNotOptedOut}`);
    }

    console.log('');
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
