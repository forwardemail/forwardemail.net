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
const os = require('node:os');
const { parentPort, workerData } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const { Users, Domains } = require('#models');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const concurrency = os.cpus().length;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// (see `longRunning` in jobs/index.js)
const { longRunning, interval } = workerData?.job ?? {};
let isCancelled = false;
const cancelled = new AbortController();
if (parentPort)
  parentPort.on('message', (message) => {
    if (message !== 'cancel') return;
    isCancelled = true;
    cancelled.abort();
  });

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');

  // return early if user changed to free plan
  if (user.plan === 'free') return;

  // return early if user now has subscription
  if (
    isSANB(user[config.userFields.stripeSubscriptionID]) ||
    isSANB(user[config.userFields.paypalSubscriptionID])
  )
    return;

  // if the user does not have any domains
  // remove any free beta credits and downgrade them to free
  const count = await Domains.countDocuments({
    members: {
      $elemMatch: {
        user: user._id,
        group: 'admin'
      }
    },
    plan: { $in: ['enhanced_protection', 'team'] }
  });
  if (
    count === 0 &&
    _.isDate(user[config.userFields.planExpiresAt]) &&
    new Date(user[config.userFields.planExpiresAt]).getTime() < Date.now()
  ) {
    logger.info(`updating ${user.email} to free plan`);
    user.plan = 'free';
    user[config.userFields.planSetAt] = new Date();
    await user.save();
  }
}

async function run() {
  try {
    const ids = await Users.distinct('_id', {
      plan: { $in: ['enhanced_protection', 'team'] },
      [config.userFields.stripeSubscriptionID]: {
        $exists: false
      },
      [config.userFields.paypalSubscriptionID]: {
        $exists: false
      },
      [config.userFields.planExpiresAt]: {
        $exists: true,
        $lt: new Date()
      }
    });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  for (;;) {
    await run();
    if (!longRunning || !Number.isFinite(interval) || isCancelled) break;
    // (a cancel ends the wait, so bree stops without waiting out the interval)
    await delay(interval, undefined, { signal: cancelled.signal }).catch(
      () => {}
    );
    if (isCancelled) break;
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})().catch(async (err) => {
  // (otherwise the worker keeps running, holding its job slot, until bree
  // restarts)
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
