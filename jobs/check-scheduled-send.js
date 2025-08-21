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
const monitorServer = require('#helpers/monitor-server');

monitorServer();

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
    // (filtered from the past 24 hours)
    //
    let results = await Emails.aggregate([
      {
        $match: {
          created_at: {
            $gte: dayjs().subtract(1, 'week').toDate()
          }
        }
      },
      {
        $project: {
          _id: 1,
          user: 1,
          created_at: 1,
          date: 1,
          duration: {
            $dateDiff: {
              startDate: '$created_at',
              endDate: '$date',
              unit: 'minute'
            }
          }
        }
      }
    ]).option({
      maxTimeMS: 30000
    });

    // sort results by duration (reversed) and filtered for duration >= 2m
    results = _.sortBy(results, 'duration').reverse();

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
