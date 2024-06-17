/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const Payments = require('#models/payments');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  const payments = await Payments.find({});
  console.log(`${payments.length} payments`);
  await pMap(
    payments,
    async (payment) => {
      await payment.save();
      console.log(`saved ${payment.reference}`);
    },
    { concurrency: config.concurrency }
  );

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
