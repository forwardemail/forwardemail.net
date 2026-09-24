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

const Emails = require('#models/emails');
const Users = require('#models/users');
const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const setupMongoose = require('#helpers/setup-mongoose');

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const seventyTwoHoursAgo = new Date(now - 72 * 60 * 60 * 1000);

    logger.info('Starting SMTP counter update job');

    // Get SMTP counts per user with time-based breakdowns
    const emailCounts = await Emails.aggregate([
      {
        $match: {
          // Only count delivered/sent emails (not failed/bounced)
          status: { $in: ['delivered', 'deferred', 'sent'] }
        }
      },
      {
        $group: {
          _id: '$user',
          totalEmails: { $sum: 1 },
          lastEmailAt: { $max: '$created_at' },
          // Count emails within time periods
          emailsLast1Hour: {
            $sum: {
              $cond: [{ $gte: ['$created_at', oneHourAgo] }, 1, 0]
            }
          },
          emailsLast24Hours: {
            $sum: {
              $cond: [{ $gte: ['$created_at', twentyFourHoursAgo] }, 1, 0]
            }
          },
          emailsLast72Hours: {
            $sum: {
              $cond: [{ $gte: ['$created_at', seventyTwoHoursAgo] }, 1, 0]
            }
          }
        }
      }
    ]);

    logger.info(`Found email counts for ${emailCounts.length} users`);

    // Create bulk operations to update all users
    const bulkOperations = [];

    // First, reset all counters to 0 for all users
    bulkOperations.push({
      updateMany: {
        filter: {},
        update: {
          $set: {
            smtp_emails_sent_1h: 0,
            smtp_emails_sent_24h: 0,
            smtp_emails_sent_72h: 0,
            smtp_emails_sent_total: 0,
            smtp_last_email_sent_at: null
          }
        }
      }
    });

    // Then update users who have email counts
    for (const count of emailCounts) {
      bulkOperations.push({
        updateOne: {
          filter: { _id: count._id },
          update: {
            $set: {
              smtp_emails_sent_1h: count.emailsLast1Hour,
              smtp_emails_sent_24h: count.emailsLast24Hours,
              smtp_emails_sent_72h: count.emailsLast72Hours,
              smtp_emails_sent_total: count.totalEmails,
              smtp_last_email_sent_at: count.lastEmailAt
            }
          }
        }
      });
    }

    if (bulkOperations.length > 0) {
      await Users.bulkWrite(bulkOperations, { ordered: false });
      logger.info(`Updated SMTP counters for all users`);
    }

    logger.info('SMTP counter update job completed successfully');
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
