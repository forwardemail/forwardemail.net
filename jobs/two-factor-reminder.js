/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const os = require('node:os');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const pMap = require('p-map');
const mongoose = require('mongoose');

const Users = require('#models/users');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const email = require('#helpers/email');
const {
  getUserIdsToRemind,
  shouldRemind
} = require('#helpers/two-factor-reminder');

const concurrency = os.cpus().length;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

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

async function mapper(_id) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    const user = await Users.findById(_id).lean().exec();

    // user could have been deleted in the interim
    if (!user) return;

    // a one-time password or a passkey set up in the interim, or a
    // reminder sent within the past 3 months
    if (!shouldRemind(user)) return;

    // send email
    await email({
      template: 'two-factor-reminder',
      message: {
        to: user.email
      },
      locals: { user }
    });

    // store that we sent this email
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.twoFactorReminderSentAt]: new Date()
      }
    });
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    // users without two-factor authentication (a one-time password or a
    // passkey) set up yet
    const userIds = await getUserIdsToRemind();

    logger.info('sending reminders', { count: userIds.length });

    // send emails and update `two_factor_reminder_sent_at` date
    await pMap(userIds, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
