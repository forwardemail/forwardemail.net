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

const Users = require('#models/users');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const sendVerificationEmail = require('#helpers/send-verification-email');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    // get all unverified and unpaid users
    // that were created within past 30+ days
    for await (const user of Users.find({
      plan: 'free',
      [config.userFields.isBanned]: false,
      [config.passport.fields.githubProfileID]: {
        $exists: false
      },
      [config.passport.fields.googleProfileID]: {
        $exists: false
      },
      [config.passport.fields.appleProfileID]: {
        $exists: false
      },
      [config.userFields.hasVerifiedEmail]: false,
      created_at: {
        $gte: dayjs().subtract(30, 'days').toDate()
      }
    })
      .sort({ created_at: 1 })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      try {
        // safeguards
        if (user[config.userFields.hasVerifiedEmail]) continue;
        if (user[config.userFields.isBanned]) continue;

        //
        // verificationPinSentAt (+14 days since or if it doesn't exist yet)
        //
        if (
          !_.isDate(user[config.userFields.verificationPinSentAt]) ||
          new Date(user[config.userFields.verificationPinSentAt]).getTime() <
            dayjs().subtract(14, 'day').toDate().getTime()
        ) {
          await sendVerificationEmail({
            state: {
              user
            },
            locale: user[config.lastLocaleField]
          });
        }
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
