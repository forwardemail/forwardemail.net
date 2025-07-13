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
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const Users = require('#models/users');
const Domains = require('#models/domains');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const email = require('#helpers/email');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});
const threeMonthsAgo = dayjs().subtract(3, 'months').toDate();

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

async function mapper(user) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    // safeguard
    if (!user) return;

    // if the email was sent within the past 3 months
    if (
      _.isDate(user[config.userFields.featureReminderSentAt]) &&
      dayjs(user[config.userFields.featureReminderSentAt]).isAfter(
        dayjs().subtract(3, 'months')
      )
    )
      return;

    // if the user is admin of a domain with smtp (and verified)
    // and if the user has an alias with imap
    // then return early since the user is already using new features
    const [domainExists, aliasExists] = await Promise.all([
      Domains.exists({
        has_smtp: true,
        smtp_verified_at: {
          $exists: true
        },
        members: {
          $elemMatch: {
            user: user._id,
            group: 'admin'
          }
        }
      }),
      Aliases.exists({
        user: user._id,
        has_imap: true
      })
    ]);

    if (domainExists && aliasExists) return;

    // send email
    await email({
      template: 'feature-reminder',
      message: {
        to: user.email
      },
      locals: { user, domainExists, aliasExists }
    });

    // store that we sent this email
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.featureReminderSentAt]: new Date()
      }
    });
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    // filter for users that do not have reminders sent yet
    for await (const user of Users.find({
      $and: [
        {
          [config.userFields.hasVerifiedEmail]: true,
          [config.userFields.isBanned]: false,
          plan: {
            $in: ['enhanced_protection', 'team', 'enterprise']
          }
        },
        {
          $or: [
            {
              [config.userFields.featureReminderSentAt]: {
                $exists: false
              }
            },
            {
              [config.userFields.featureReminderSentAt]: {
                $lte: threeMonthsAgo
              }
            }
          ]
        }
      ]
    })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      // break if cancelled
      if (isCancelled) break;
      // send emails and update `feature_reminder_sent_at` date
      try {
        await mapper(user);
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
