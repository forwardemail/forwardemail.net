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

const mongoose = require('mongoose');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Users = require('#models/users');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const object = {
      created_at: {
        $lte: config.launchDate
      }
    };
    object[config.userFields.launchEmailSentAt] = { $exists: false };
    object[config.userFields.hasVerifiedEmail] = true;

    const _ids = await Users.distinct('_id', object);

    // send launch email (in serial)
    for (const _id of _ids) {
      try {
        const user = await Users.findById(_id);

        // in case user deleted their account or is banned
        if (!user || user[config.userFields.isBanned]) continue;

        // in case email was sent for whatever reason
        if (user[config.userFields.launchEmailSentAt]) continue;

        // send email

        await email({
          template: 'launch',
          message: {
            to: user.email
          },
          locals: { user: user.toObject() }
        });

        // store that we sent this email

        await Users.findByIdAndUpdate(user._id, {
          $set: {
            [config.userFields.launchEmailSentAt]: new Date()
          }
        });

        await user.save();
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
