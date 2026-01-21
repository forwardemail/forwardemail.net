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

const { setTimeout } = require('node:timers/promises');
const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');

const env = require('#config/env');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const getBlockedHashes = require('#helpers/get-blocked-hashes');
const Emails = require('#models/emails');
const Domains = require('#models/domains');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // NOTE: if you change this then also update `jobs/send-emails` if necessary
    //
    // get list of all suspended domains
    // and recently blocked emails to exclude
    //
    // Optimized to use cursor-based iteration instead of aggregation
    // to avoid MongoDB MaxTimeMSExpired errors on large datasets
    //
    const now = new Date();
    const suspendedDomainIds = [];
    const recentlyBlockedIds = [];

    await Promise.all([
      (async () => {
        for await (const domain of Domains.find({
          is_smtp_suspended: true
        })
          .select('_id')
          .lean()
          .cursor()
          .addCursorFlag('noCursorTimeout', true)) {
          suspendedDomainIds.push(domain._id);
        }
      })(),
      (async () => {
        for await (const email of Emails.find({
          updated_at: {
            $gte: dayjs().subtract(1, 'hour').toDate(),
            $lte: now
          },
          has_blocked_hashes: true,
          blocked_hashes: {
            $in: getBlockedHashes(env.SMTP_HOST)
          }
        })
          .select('_id')
          .lean()
          .cursor()
          .addCursorFlag('noCursorTimeout', true)) {
          recentlyBlockedIds.push(email._id);
        }
      })()
    ]);

    logger.info('%d suspended domain ids', suspendedDomainIds.length);

    logger.info('%d recently blocked ids', recentlyBlockedIds.length);
    //
    // check the unique ids for emails in the queue
    // if the list is still the same after 1 minute
    // then email admins and throw an error
    //

    // NOTE: if you change this then also update `jobs/send-emails` if necessary
    const query = {
      _id: { $nin: recentlyBlockedIds },
      status: 'queued',
      domain: {
        $nin: suspendedDomainIds
      }
    };

    const count = await Emails.countDocuments(query);

    // if the count is >= half of the queue threshold
    // then we can assume there's something wrong
    // (we can fine tune this in the future)
    if (count >= Math.round(config.smtpMaxQueue / 2)) {
      const err = new Error(
        `SMTP queue count is ${count} (exceeds 50% threshold)`
      );
      err.isCodeBug = true; // triggers sms
      throw err;
    }
  } catch (err) {
    await logger.error(err);
    // only send one of these emails every 15m
    // (this prevents the job from exiting)
    await setTimeout(ms('15m'));
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
