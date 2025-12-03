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
const pMap = require('p-map');

const mongoose = require('mongoose');
const Payments = require('#models/payments');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});
const props = [];
const $or = [];

graceful.listen();

async function mapper(id) {
  const payment = await Payments.findById(id);
  if (!payment) {
    throw new Error('payment does not exist');
  }

  for (const prop of props) {
    if (payment[prop] === null) {
      logger.info(`payment ${payment.id} had null prop of ${prop}`);
      payment[prop] = undefined;
    }
  }

  await payment.save();
}

(async () => {
  await setupMongoose(logger);

  try {
    for (const prop of Object.keys(Payments.prototype.schema.paths)) {
      if (Payments.prototype.schema.paths[prop].instance === 'String') {
        $or.push({
          [prop]: { $type: 10 }
        });
        props.push(prop);
      }
    }

    const count = await Payments.countDocuments({ $or });
    logger.info('count', count);

    const ids = await Payments.distinct('_id', { $or });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
