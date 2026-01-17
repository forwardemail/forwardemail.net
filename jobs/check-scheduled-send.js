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

(async () => {
  await setupMongoose(logger);

  try {
    //
    // find any email ids that are scheduled in the future
    // (filtered from the past week)
    //
    // Optimized to use cursor-based iteration instead of aggregation
    // to avoid MongoDB MaxTimeMSExpired errors on large datasets
    //
    const results = [];
    const oneWeekAgo = dayjs().subtract(1, 'week').toDate();

    for await (const email of Emails.find({
      created_at: {
        $gte: oneWeekAgo
      },
      status: { $ne: 'scheduled' }
    })
      .select('_id user created_at date status')
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      // Calculate duration in minutes between created_at and date
      if (email.date && email.created_at) {
        const duration = Math.round(
          (new Date(email.date).getTime() -
            new Date(email.created_at).getTime()) /
            (1000 * 60)
        );
        if (duration >= 2) {
          results.push({
            _id: email._id,
            user: email.user,
            created_at: email.created_at,
            date: email.date,
            duration
          });
        }
      }
    }

    // sort results by duration (reversed)
    results.sort((a, b) => b.duration - a.duration);

    const set = new Set();

    for (const result of results) {
      // difference must be at least 2 minutes to be worthwhile to notify
      // (otherwise users might get annoyed)
      if (result.duration < 2) continue;
      if (set.has(result.user.toString())) continue;
      set.add(result.user.toString());

      const user = await Users.findOne({ id: result.user.toString() })
        .lean()
        .exec();
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
          result.duration
        );
      const message = i18n.translate(
        'SCHEDULED_SEND_MESSAGE',
        user[config.lastLocaleField],
        result.duration
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
})();
