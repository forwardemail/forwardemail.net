/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
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

const Domains = require('#models/domains');
const Emails = require('#models/emails');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // unlock queued jobs that are frozen for more than 5m+
    // and switch deferred emails back into queue
    //
    // NOTE: reduced from 10m to 5m because the per-task timeout in
    // send-emails.js is 5 minutes. Any email locked longer than that
    // is definitely orphaned (process crash, pm2 restart, etc.).
    //
    const unlockResult = await Emails.updateMany(
      {
        is_locked: true,
        locked_at: {
          $exists: true,
          $lte: dayjs().subtract(5, 'minutes').toDate()
        },
        status: {
          $in: ['queued', 'deferred']
        }
      },
      {
        $set: {
          is_locked: false,
          status: 'queued'
        },
        $unset: {
          locked_by: 1,
          locked_at: 1
        }
      },
      { writeConcern: { w: 1 } }
    );

    // TODO: remove debug instrumentation once queue issue is resolved
    if (unlockResult?.modifiedCount > 0) {
      console.log(
        '[DEBUG:unlock-emails] unlocked frozen emails',
        JSON.stringify({
          modifiedCount: unlockResult.modifiedCount,
          matchedCount: unlockResult.matchedCount
        })
      );
    }
  } catch (err) {
    await logger.error(err);
  }

  //
  // go through all pending emails and check if they belong back in queue
  // (or if they need deleted because the domain doesn't exist anymore)
  //
  // Optimized: batch domain lookups with a single query + Map instead of
  // N+1 per-email Domains.findById calls.
  //
  try {
    const pendingEmails = await Emails.find({ status: 'pending' })
      .select('_id domain')
      .lean()
      .maxTimeMS(60000)
      .exec();

    if (pendingEmails.length > 0) {
      // Batch fetch all unique domains referenced by pending emails
      const uniqueDomainIds = [
        ...new Set(pendingEmails.map((e) => e.domain.toString()))
      ];
      const domains = await Domains.find({
        _id: { $in: uniqueDomainIds }
      })
        .select('_id smtp_suspended_sent_at')
        .lean()
        .exec();

      // Build a Map for O(1) lookups
      const domainMap = new Map();
      for (const domain of domains) {
        domainMap.set(domain._id.toString(), domain);
      }

      // Categorize emails into delete vs re-queue
      const deleteIds = [];
      const requeueIds = [];

      for (const email of pendingEmails) {
        const domain = domainMap.get(email.domain.toString());
        if (!domain) {
          // Domain no longer exists - delete the email
          deleteIds.push(email._id);
        } else if (
          !domain.smtp_suspended_sent_at ||
          !(domain.smtp_suspended_sent_at instanceof Date)
        ) {
          // Domain is not suspended - re-queue the email
          requeueIds.push(email._id);
        }
        // else: domain is suspended - leave email as pending (no action)
      }

      // Batch delete orphaned emails
      if (deleteIds.length > 0) {
        await Emails.deleteMany(
          { _id: { $in: deleteIds } },
          { writeConcern: { w: 1 } }
        );
      }

      // Batch re-queue emails whose domains are not suspended
      if (requeueIds.length > 0) {
        await Emails.updateMany(
          { _id: { $in: requeueIds } },
          {
            $set: {
              is_locked: false,
              status: 'queued'
            },
            $unset: {
              locked_by: 1,
              locked_at: 1
            }
          },
          { writeConcern: { w: 1 } }
        );
      }

      if (deleteIds.length > 0 || requeueIds.length > 0) {
        logger.info('processed pending emails', {
          total: pendingEmails.length,
          deleted: deleteIds.length,
          requeued: requeueIds.length
        });
      }
    }
  } catch (err) {
    console.error(
      '[ERROR:unlock-emails] failed to process pending emails',
      JSON.stringify({
        errName: err.name,
        errMessage: err.message?.slice(0, 200)
      })
    );
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
