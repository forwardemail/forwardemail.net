/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const os = require('node:os');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');

const mongoose = require('mongoose');
const { Users, Payments } = require('#models');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const config = require('#config');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const arr = [];

async function mapper(id) {
  const user = await Users.findById(id).lean().exec();
  if (!user) throw new Error('User does not exist');
  const count1 = await Payments.countDocuments({
    user: user._id,
    invoice_at: {
      // safeguard in case migration didn't run
      // (note we have another issue for setting `planSetAt` in a user pre-validate hook)
      $gte: dayjs(new Date(user[config.userFields.planSetAt])).toDate()
    },
    // payments must match the user's current plan
    plan: user.plan
  });
  const count2 = await Payments.countDocuments({
    user: user._id,
    invoice_at: {
      // safeguard in case migration didn't run
      // (note we have another issue for setting `planSetAt` in a user pre-validate hook)
      $gte: dayjs(new Date(user[config.userFields.planSetAt]))
        // add a buffer due to second differences in historical `plan_set_at`
        // with comparison to Stripe/PayPal API's
        .subtract(1, 'day')
        .toDate()
    },
    // payments must match the user's current plan
    plan: user.plan
  });
  if (count1 !== count2) {
    arr.push(`${user.email} has a difference of ${count2 - count1}`);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const ids = await Users.distinct('_id', {});

    await pMap(ids, mapper, { concurrency });

    if (arr.length > 0) throw new Error('Expires at outliers');
  } catch (err) {
    await logger.error(err, { arr });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
