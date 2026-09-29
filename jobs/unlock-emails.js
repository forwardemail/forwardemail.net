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
  // This works per domain: pending emails are grouped by the (few) domains
  // they belong to, and each group is deleted or re-queued with one query
  // per chunk of domains. Loading every pending email id (emails of
  // suspended domains stay pending until they expire, so there can be
  // millions) held them all in memory and made `$in` lists larger than a
  // query can be.
  //
  try {
    const domainIds = await Emails.distinct('domain', { status: 'pending' })
      .maxTimeMS(60000)
      .exec();

    let deleted = 0;
    let requeued = 0;
    const CHUNK_SIZE = 500;

    for (let i = 0; i < domainIds.length; i += CHUNK_SIZE) {
      const chunk = domainIds.slice(i, i + CHUNK_SIZE);
      const domains = await Domains.find({
        _id: { $in: chunk.filter(Boolean) }
      })
        .select('_id smtp_suspended_sent_at')
        .lean()
        .exec();

      const domainMap = new Map();
      for (const domain of domains) {
        domainMap.set(domain._id.toString(), domain);
      }

      // Categorize domains into delete vs re-queue
      const deleteDomainIds = [];
      const requeueDomainIds = [];
      for (const id of chunk) {
        if (!id) continue;
        const domain = domainMap.get(id.toString());
        if (!domain) {
          // Domain no longer exists - delete its emails
          deleteDomainIds.push(id);
        } else if (
          !domain.smtp_suspended_sent_at ||
          !(domain.smtp_suspended_sent_at instanceof Date)
        ) {
          // Domain is not suspended - re-queue its emails
          requeueDomainIds.push(id);
        }
        // else: domain is suspended - leave emails as pending (no action)
      }

      // Batch delete orphaned emails
      if (deleteDomainIds.length > 0) {
        const result = await Emails.deleteMany(
          { status: 'pending', domain: { $in: deleteDomainIds } },
          { writeConcern: { w: 1 } }
        );
        deleted += result?.deletedCount || 0;
      }

      // Batch re-queue emails whose domains are not suspended
      if (requeueDomainIds.length > 0) {
        const result = await Emails.updateMany(
          { status: 'pending', domain: { $in: requeueDomainIds } },
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
        requeued += result?.modifiedCount || 0;
      }
    }

    if (deleted > 0 || requeued > 0) {
      logger.info('processed pending emails', {
        domains: domainIds.length,
        deleted,
        requeued
      });
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
