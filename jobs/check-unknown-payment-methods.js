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
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Payments = require('#models/payments');
const email = require('#helpers/email');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const count = await Payments.countDocuments({ method: 'unknown' });

    if (count > 0)
      await email({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `(${count}) Unknown Payment Methods Detected`
        },
        locals: {
          message: `${count} payments had an "unknown" payment method type.`
        }
      });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
