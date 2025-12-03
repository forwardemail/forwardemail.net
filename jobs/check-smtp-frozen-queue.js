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

const { setTimeout } = require('node:timers/promises');
const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');

const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const getBlockedHashes = require('#helpers/get-blocked-hashes');
const Emails = require('#models/emails');
const Domains = require('#models/emails');

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
      is_locked: false,
      status: 'queued',
      domain: {
        $nin: suspendedDomainIds
      },
      date: {
        $lte: now
      }
    };

    let ids = await Emails.aggregate([
      { $match: query },
      { $group: { _id: '$id' } }
    ])
      .allowDiskUse(true)
      .exec();
    ids = ids.map((v) => v.id);

    // if no ids then return early
    if (ids.length === 0) {
      logger.info('No ids found');
      process.exit(0);
      return;
    }

    // wait 1 minute
    await setTimeout(ms('1m'));

    // check if ids is the same
    let newIds = await Emails.aggregate([
      {
        $match: {
          ...query,
          date: {
            $lte: new Date()
          }
        }
      },
      { $group: { _id: '$id' } }
    ])
      .allowDiskUse(true)
      .exec();

    newIds = newIds.map((v) => v.id);

    // if no ids then return early
    if (newIds.length === 0) {
      logger.info('No new ids found');
      process.exit(0);
      return;
    }

    if (ids.sort().join(',') === newIds.sort().join(',')) {
      const err = new Error('Queue is frozen');
      err.isCodeBug = true; // triggers sms
      throw err;
    }
  } catch (err) {
    await logger.error(err);
    // only send one of these emails every 1 hour
    // (this prevents the job from exiting)
    await setTimeout(ms('1h'));
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
