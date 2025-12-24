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
const mongoose = require('mongoose');
const pMap = require('p-map');

const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

// concurrency for sending emails
const concurrency = 5;

async function mapper(user) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    // safeguard
    if (!user) return;

    // send email
    await email({
      template: 'holiday-2025',
      message: {
        to: user.email
      },
      locals: { user: user.toObject() }
    });

    // store that we sent this email
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        holiday_2025_email_sent_at: new Date()
      }
    });

    logger.info('sent holiday-2025 email', { email: user.email });
  } catch (err) {
    logger.error(err, { user: user.email });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    // find users who:
    // - are not banned
    // - have newsletter subscription enabled
    // - have verified email
    // - have not received this email yet
    const query = {
      [config.userFields.isBanned]: false,
      [config.userFields.hasVerifiedEmail]: true,
      has_newsletter: true,
      holiday_2025_email_sent_at: { $exists: false }
    };

    const count = await Users.countDocuments(query);
    logger.info('total users to send holiday-2025 email', { count });

    // process in batches using cursor for memory efficiency
    const users = [];
    // eslint-disable-next-line unicorn/no-array-callback-reference
    for await (const user of Users.find(query)
      .select('_id email')
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      // break if cancelled
      if (isCancelled) break;
      users.push(user);

      // process in batches
      if (users.length >= 100) {
        await pMap(users, mapper, { concurrency });
        users.length = 0;
      }
    }

    // process remaining users
    if (users.length > 0 && !isCancelled) {
      await pMap(users, mapper, { concurrency });
    }

    logger.info('finished sending holiday-2025 emails');
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
