// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

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
  await setupMongoose();

  const count = await Payments.countDocuments({ method: 'unknown' });

  if (count > 0)
    await email({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `(${count}) Unknown Payment Methods Detected`
      },
      locals: {
        message: `${count} payments had an "unknown" payment method type.`
      }
    });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
