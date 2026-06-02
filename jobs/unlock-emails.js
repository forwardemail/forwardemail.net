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
const _ = require('#helpers/lodash');

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
      }
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
  // NOTE: replaced cursor-based iteration with batch .find().lean() to avoid
  // hanging on cursor.next() when MongoDB connection pool is under pressure.
  // Uses maxTimeMS to enforce a server-side timeout on the query.
  //
  try {
    const pendingEmails = await Emails.find({ status: 'pending' })
      .select('_id domain')
      .lean()
      .maxTimeMS(60000)
      .exec();

    for (const email of pendingEmails) {
      try {
        // delete emails that don't have domains that correspond to them
        const domain = await Domains.findById(email.domain).lean().exec();
        if (!domain) {
          await Emails.findByIdAndRemove(email._id);
          continue;
        }

        // otherwise check if `smtp_suspended_sent_at` does not exist
        if (!_.isDate(domain.smtp_suspended_sent_at)) {
          // TODO: check if we're rate limited, if so then keep it pending
          await Emails.findByIdAndUpdate(email._id, {
            $set: {
              is_locked: false,
              status: 'queued'
            },
            $unset: {
              locked_by: 1,
              locked_at: 1
            }
          });
        }
      } catch (emailErr) {
        // Log per-email errors but continue processing the rest
        console.error(
          '[ERROR:unlock-emails] failed to process pending email',
          JSON.stringify({
            emailId: email._id,
            errName: emailErr.name,
            errMessage: emailErr.message?.slice(0, 200)
          })
        );
      }
    }
  } catch (err) {
    console.error(
      '[ERROR:unlock-emails] failed to query pending emails',
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
