/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const sharedConfig = require('@ladjs/shared-config');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const Emails = require('#models/emails');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

// 2 minutes in milliseconds
const TWO_MINUTES_MS = 2 * 60 * 1000;

(async () => {
  await setupMongoose(logger);

  try {
    //
    // the users with emails from the past hour whose Date is 2 minutes or
    // more after they were created, and the longest of those for each user
    //
    // (the past hour, twelve runs of the job: with the past week, every
    // email was read on each of some 2,000 runs, for a warning a user gets at
    // most once a month; and grouped by user in MongoDB, where the matches
    // were read into memory, then sorted and deduplicated here)
    //
    const results = await Emails.aggregate([
      {
        $match: {
          created_at: { $gte: dayjs().subtract(1, 'hour').toDate() },
          date: { $exists: true }
        }
      },
      {
        $project: {
          user: 1,
          duration: { $subtract: ['$date', '$created_at'] }
        }
      },
      { $match: { duration: { $gte: TWO_MINUTES_MS } } },
      { $group: { _id: '$user', duration: { $max: '$duration' } } },
      { $sort: { duration: -1 } }
    ]).allowDiskUse(true);

    for (const { _id: userId, duration: durationMs } of results) {
      if (!userId) continue;
      const duration = Math.round(durationMs / (1000 * 60));
      // difference must be at least 2 minutes to be worthwhile to notify
      // (otherwise users might get annoyed)
      if (duration < 2) continue;

      const user = await Users.findById(userId).lean().exec();
      if (!user) continue;
      // if it has been more than 1 month since the
      // last reminder that was sent (or if they were never sent one yet)
      if (
        _.isDate(user.scheduled_send_sent_at) &&
        new Date(user.scheduled_send_sent_at).getTime() >=
          dayjs().subtract(1, 'month').toDate().getTime()
      )
        continue;

      const subject =
        config.views.locals.emoji('warning') +
        ' ' +
        i18n.translate(
          'SCHEDULED_SEND_SUBJECT',
          user[config.lastLocaleField],
          duration
        );
      const message = i18n.translate(
        'SCHEDULED_SEND_MESSAGE',
        user[config.lastLocaleField],
        duration
      );

      await emailHelper({
        template: 'alert',
        message: {
          to: user.email,
          // bcc: config.email.message.from,
          subject
        },
        locals: {
          message,
          locale: user[config.lastLocaleField]
        }
      });

      await Users.findByIdAndUpdate(user._id, {
        $set: {
          scheduled_send_sent_at: new Date()
        }
      });
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})().catch(async (err) => {
  // (otherwise the worker keeps running, holding its job slot, until bree
  // restarts)
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
