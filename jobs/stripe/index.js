const process = require('process');
const { parentPort } = require('worker_threads');
const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const syncStripePayments = require('./sync-stripe-payments');
const logger = require('#helpers/logger');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

  // set an amount of errors that causes the script to bail out completely.
  // ex... if errorTolerance = 50, and there are 50 stripe error emails sent, the stripe function will stop looping and
  // send a final email that the script needs work or that the service is down - so as to not flood inboxes with thousands of emails
  // note that the tolerance applies to each payment provider not to the entire script
  try {
    await syncStripePayments({ errorThreshold: 15 });
  } catch (err) {
    logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
