/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

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
const emailHelper = require('#helpers/email');
const setupMongoose = require('#helpers/setup-mongoose');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const getAllPayPalSubscriptions = require('#helpers/get-all-paypal-subscriptions');

const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

async function mapper(id) {
  // get all users with this paypal payer id
  // and active paypal subscription
  const users = await Users.find({
    [config.userFields.paypalPayerID]: id,
    [config.userFields.paypalSubscriptionID]: {
      $exists: true
    }
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

  console.log(`unique subscription ids`);
  console.log(payments.map((p) => p[config.userFields.paypalSubscriptionID]));

  // delete all of those payments and then sync paypal subscription payments by user
  // NOTE: this only works because the user has a current subscription id
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
      console.error(err);
    }
  }
}

(async () => {
  await setupMongoose();
  await pMapSeries(subscriptionIds, async (id) => {
    const distinctUsers = await Payments.distinct('user', {
      [config.userFields.paypalSubscriptionID]: id
    });
    if (distinctUsers.length > 1)
      throw new Error(
        `paypal subscription id ${id} had payments with different user ids`
      );
  });

  const ids = await Users.distinct(config.userFields.paypalPayerID, {
    [config.userFields.paypalPayerID]: { $exists: true }
  });
  await pMapSeries(ids, mapper);

  // check for payments that have the same paypal_subscription_id but different user
  const subscriptionIds = await Payments.distinct(
    config.userFields.paypalSubscriptionID,
    {
      [config.userFields.paypalSubscriptionID]: {
        $exists: true
      }
    }
  );

  // get all subscriptions from PayPal API and merge with database results
  try {
    const allSubscriptions = await getAllPayPalSubscriptions();
    // merge subscription IDs from API
    for (const sub of allSubscriptions) {
      if (!subscriptionIds.includes(sub.id)) {
        subscriptionIds.push(sub.id);
        console.log(
          `Found subscription ${sub.id} from PayPal API not in database`
        );
      }
    }

    console.log(
      `Total subscriptions to check: ${subscriptionIds.length} (${
        allSubscriptions.length
      } from API, ${
        subscriptionIds.length - allSubscriptions.length
      } from database only)`
    );
  } catch (err) {
    console.error('Failed to fetch subscriptions from PayPal API:', err);
    // Continue with database subscriptions only
  }

  process.exit(0);
})();
