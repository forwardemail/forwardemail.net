/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const pMap = require('p-map');
const parseErr = require('parse-err');
const mongoose = require('mongoose');
const safeStringify = require('fast-safe-stringify');

const syncStripePayments = require('./sync-stripe-payments');
const fraudCheck = require('./fraud-check');
const checkSubscriptionAccuracy = require('./check-subscription-accuracy');
const _ = require('#helpers/lodash');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Payments } = require('#models');
const stripe = require('#helpers/stripe');

const concurrency = os.cpus().length;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  // check for stripe fraud
  try {
    await fraudCheck();
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Error with job for Stripe fraud check'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  //
  // get all stripe customers and check for
  // users with multiple active subscriptions
  // (this also syncs emails, subscription ids, and resolves duplicate subscriptions)
  // (and it also extends trial for customers that were awarded free credit)
  //
  try {
    await checkSubscriptionAccuracy();
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Error with job for Stripe checking subscription accuracy'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  //
  // we should iterate over all users with stripeSubscriptionID
  // and if the subscription is canceled or cancelled then remove it
  //
  try {
    const subscriptionIds = await Users.distinct(
      config.userFields.stripeSubscriptionID,
      {}
    );
    await pMap(
      // remove null values
      _.compact(subscriptionIds),
      async function (id) {
        const subscription = await stripe.subscriptions.retrieve(id);
        if (!subscription)
          throw new Error(`Stripe subscription does not exist with ID ${id}`);
        if (['canceled', 'cancelled'].includes(subscription.status))
          await Users.findOneAndUpdate(
            {
              [config.userFields.stripeSubscriptionID]: subscription.id
            },
            {
              $unset: {
                [config.userFields.stripeSubscriptionID]: 1
              }
            }
          );
        // TODO: if user subscription was past due then email them
      },
      { concurrency }
    );
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Error with job for Stripe syncing of deleted subscriptions'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  //
  // we should check for duplicate stripe_payment_intent_id in payments model
  //
  try {
    const paymentIntentIds = await Payments.distinct(
      'stripe_payment_intent_id',
      {}
    );
    await pMap(
      // remove null values
      _.compact(paymentIntentIds),
      async function (id) {
        const count = await Payments.countDocuments({
          stripe_payment_intent_id: id
        });
        if (count > 1)
          await emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `Duplicate Stripe Payment Intent ID detected (${id})`
            },
            locals: {
              message: `Duplicate Stripe payment intent ID detected with ID ${id}`
            }
          });
      },
      { concurrency }
    );
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject:
          'Error with job for Stripe checking of duplicate payment intent IDs'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  // set an amount of errors that causes the script to bail out completely.
  // ex... if errorTolerance = 50, and there are 50 stripe error emails sent, the stripe function will stop looping and
  // send a final email that the script needs work or that the service is down - so as to not flood inboxes with thousands of emails
  // note that the tolerance applies to each payment provider not to the entire script
  try {
    await syncStripePayments();
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Error with job for Stripe syncing of payments'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
