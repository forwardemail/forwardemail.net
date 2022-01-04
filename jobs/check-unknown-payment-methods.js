// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const logger = require('#helpers/logger');
const Payments = require('#models/payment');
const email = require('#helpers/email');

const breeSharedConfig = sharedConfig('BREE');

const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

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
