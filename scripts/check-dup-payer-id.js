// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const pMapSeries = require('p-map-series');
const pReduce = require('p-reduce');

const mongoose = require('mongoose');
const { Users, Payments } = require('#models');
const config = require('#config');
const logger = require('#helpers/logger');
const emailHelper = require('#helpers/email');
const setupMongoose = require('#helpers/setup-mongoose');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  // get all users with this paypal payer id
  const users = await Users.find({
    [config.userFields.paypalPayerID]: id
  })
    .lean()
    .exec();
  if (users.length === 1) return;
  console.log(`${users.length} found for payer ID ${id}`);

  // find all payments belonging to the users that had subscription ids associated
  const payments = await Payments.find({
    user: {
      $in: users.map((user) => user._id)
    },
    [config.userFields.paypalSubscriptionID]: {
      $exists: true
    }
  });

  // delete all of those payments and then sync paypal subscription payments by user
  console.log(
    `deleting ${payments.length} payments for ${users.length} users for payer ID ${id}`
  );
  await Promise.all(payments.map((payment) => payment.remove()));

  console.log(`re-syncing ${users.length} subscription payments`);
  const errorEmails = await pReduce(
    users,
    syncPayPalSubscriptionPaymentsByUser,
    []
  );

  if (errorEmails.length > 0) {
    try {
      await Promise.all(errorEmails.map((email) => emailHelper(email)));
    } catch (err) {
      logger.error(err);
    }
  }
}

(async () => {
  await setupMongoose(logger);
  const ids = await Users.distinct(config.userFields.paypalPayerID, {
    [config.userFields.paypalPayerID]: { $exists: true }
  });
  await pMapSeries(ids, mapper);
  process.exit(0);
})();
