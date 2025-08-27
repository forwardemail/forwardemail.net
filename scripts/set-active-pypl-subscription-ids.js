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

const mongoose = require('mongoose');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const { paypalAgent } = require('#helpers/paypal');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

const { PAYPAL_PLAN_MAPPING } = config.payments;
const PAYPAL_PLANS = {
  enhanced_protection: Object.values(PAYPAL_PLAN_MAPPING.enhanced_protection),
  team: Object.values(PAYPAL_PLAN_MAPPING.team),
  enterprise: Object.values(PAYPAL_PLAN_MAPPING.enterprise)
};

graceful.listen();

async function mapper(id) {
  try {
    // first check to see if the subscription ID is already assigned
    // to an active user, and if so, then ignore it
    const count = await Users.countDocuments({
      [config.userFields.paypalSubscriptionID]: id
    });
    if (count > 1) console.log(`count was > 1 for ${id}`);
    if (count === 1) return;

    console.log(`${id} was missing a user, performing lookups now`);

    // lookup the active subscription details
    const agent = await paypalAgent();
    const { body: subscription } = await agent.get(
      `/v1/billing/subscriptions/${id}`
    );

    // lookup the user by parsed subscription information
    let user = await Users.findOne({
      [config.userFields.paypalPayerID]: subscription.subscriber.payer_id,
      [config.userFields.paypalSubscriptionID]: { $exists: false }
    });

    if (!user)
      user = await Users.findOne({
        email: subscription.subscriber.email_address.toLowerCase(),
        [config.userFields.paypalSubscriptionID]: { $exists: false }
      });

    if (!user) {
      console.log('-------------------------------------------------------');
      console.log(`User could not be found for subscription ID ${id}`);
      console.log('subscription', subscription);
      console.log('-------------------------------------------------------');
      //
      // NOTE: cancel and refund and email subscriber email address and CC admins
      //
      if (subscription.status === 'ACTIVE') {
        try {
          const agent = await paypalAgent();
          await agent.post(
            `/v1/billing/subscriptions/${subscription.id}/cancel`
          );
        } catch (err) {
          logger.error(err);
        }
      }

      emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
          cc: subscription.subscriber.email_address.toLowerCase(),
          subject: `PayPal Subscription Issue (${subscription.id})`
        },
        locals: {
          message: `Your PayPal subscription could not be synchronized properly since your PayPal email address differs from your Forward Email account.  Please try to checkout again if necessary with PayPal and ensure that you proceed to our website after you have completed your PayPal transaction.  Visit <a target="_blank" rel="noopener noreferrer" href="${config.urls.web}/my-account/billing">${config.urls.web}/my-account/billing</a> to get your latest billing information.  We will automatically process your refund.`
        }
      })
        .then()
        .catch((err) => logger.fatal(err));

      return;
    }

    console.log(`found user ${user.email} for ${id}`);

    // save the subscription ID to the profile
    user[config.userFields.paypalSubscriptionID] = id;
    user[config.userFields.paypalPayerID] = subscription.subscriber.payer_id;

    const plan = Object.keys(PAYPAL_PLANS).find((plan) =>
      PAYPAL_PLANS[plan].includes(subscription.plan_id)
    );

    if (!plan) throw new Error('Plan does not exist');

    if (user.plan !== plan) {
      console.log(`setting user plan from ${user.plan} to ${plan}`);
      user.plan = plan;
    }

    await user.save();

    // create and sync payments
    const errorEmails = await syncPayPalSubscriptionPaymentsByUser([], user);

    if (errorEmails.length > 0) {
      try {
        await Promise.all(errorEmails.map((email) => emailHelper(email)));
      } catch (err) {
        logger.error(err);
      }
    }

    // TODO: we also need to do this for stripe and then also put both this in webhook
  } catch (err) {
    console.error(err.message);
  }
}

//
// NOTE: PayPal reports is now easier to generate a list of active ID's
//       (e.g. so this gist is no longer needed, but we're keeping it here for archive)
//       <https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4>
//
const ids = [
  // ...
];

(async () => {
  await setupMongoose(logger);

  await pMapSeries(ids, mapper);

  process.exit(0);
})();
