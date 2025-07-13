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
const ms = require('ms');
const _ = require('#helpers/lodash');

const Payments = require('#models/payments');
const Users = require('#models/users');
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

    if (_.isDate(user[config.userFields.pastDueReliefSentAt])) return;

    // NOTE: reset plan started date and give the user 1 year of free credit
    user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
    await user.save();
    await Payments.create({
      user: user._id,
      amount:
        user.plan === 'enhanced_protection'
          ? Math.round(300 * 12)
          : Math.round(900 * 12),
      amount_refunded:
        user.plan === 'enhanced_protection'
          ? Math.round(300 * 12)
          : Math.round(900 * 12),
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('1y'),
      plan: user.plan,
      kind: 'one-time'
    });

    // save the user so their plan expired at is updated
    await user.save();

    // send email
    await email({
      template: 'past-due-relief',
      message: {
        to: user.email
      },
      locals: { user }
    });

    // store that we sent this email
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.pastDueReliefSentAt]: new Date()
      }
    });
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    // filter for users that are more than 6 months past due
    for await (const user of Users.find({
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.isBanned]: false,
      plan: {
        $in: ['enhanced_protection', 'team', 'enterprise']
      },
      [config.userFields.planExpiresAt]: {
        $lte: dayjs().subtract(6, 'month').toDate()
      }
      // [config.userFields.pastDueReliefSentAt]: {
      //   $exists: false
      // }
    })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      // break if cancelled
      if (isCancelled) break;
      // send emails
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
