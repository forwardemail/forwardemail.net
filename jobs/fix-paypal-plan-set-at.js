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
const dayjs = require('dayjs-with-plugins');
const pMapSeries = require('p-map-series');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users } = require('#models');
const { paypalAgent } = require('#helpers/paypal');
const config = require('#config');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');
  // if the user plan set at is AFTER their subscription start date
  // then correct the user's plan set at to be equal to the subscription start date
  const agent = await paypalAgent();
  const { body } = await agent.get(
    `/v1/billing/subscriptions/${user[config.userFields.paypalSubscriptionID]}`
  );
  if (!body.create_time) throw new Error('create time missing');
  if (
    new Date(user[config.userFields.planSetAt]).getTime() >
    new Date(body.create_time).getTime()
  ) {
    logger.info(
      'user plan set at needs corrected',
      user.email,
      'it was off by',
      dayjs(user[config.userFields.planSetAt]).diff(
        new Date(body.create_time),
        'minutes'
      ),
      'minutes'
    );
    user[config.userFields.planSetAt] = new Date(body.create_time);
    await user.save();
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    const ids = await Users.distinct('_id', {
      [config.userFields.paypalSubscriptionID]: {
        $exists: true
      }
    });

    // run serially to prevent API rate limiting
    await pMapSeries(ids, mapper);
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
