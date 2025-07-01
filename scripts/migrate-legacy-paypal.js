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
const Payments = require('#models/payments');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const { paypalAgent } = require('#helpers/paypal');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// July 1, 2025 cutoff date
const CUTOFF_DATE = Date.now();

async function migratePayments() {
  try {
    console.log('Starting PayPal legacy migration...');

    // Update all payments created before July 1, 2025 to set is_legacy_paypal = true
    const result = await Payments.updateMany(
      {
        created_at: { $lt: CUTOFF_DATE },
        is_legacy_paypal: { $ne: true }
      },
      {
        $set: { is_legacy_paypal: true }
      }
    );

    console.log(
      `Updated ${result.modifiedCount} payments to legacy PayPal status`
    );

    // Find all users with active PayPal subscriptions that need to be cancelled
    const usersWithPayPalSubscriptions = await Users.find({
      [config.userFields.paypalSubscriptionID]: { $exists: true, $ne: null }
    });

    console.log(
      `Found ${usersWithPayPalSubscriptions.length} users with PayPal subscriptions to process`
    );

    // Process each user with PayPal subscription
    await pMapSeries(usersWithPayPalSubscriptions, async (user) => {
      try {
        const subscriptionId = user[config.userFields.paypalSubscriptionID];
        console.log(
          `Processing user ${user.email} with subscription ${subscriptionId}`
        );

        // Try to cancel the PayPal subscription
        let subscriptionCancelled = false;
        try {
          const agent = await paypalAgent();
          await agent.post(
            `/v1/billing/subscriptions/${subscriptionId}/cancel`
          );
          subscriptionCancelled = true;
          console.log(
            `Successfully cancelled PayPal subscription ${subscriptionId} for user ${user.email}`
          );
        } catch (err) {
          // Check if subscription was already cancelled
          if (
            err.status === 422 ||
            (err.response &&
              err.response.body &&
              err.response.body.name === 'UNPROCESSABLE_ENTITY')
          ) {
            console.log(
              `PayPal subscription ${subscriptionId} was already cancelled for user ${user.email}`
            );
            subscriptionCancelled = false; // Don't send email for already cancelled subscriptions
          } else {
            console.error(
              `Failed to cancel PayPal subscription ${subscriptionId} for user ${user.email}:`,
              err.message
            );
            subscriptionCancelled = false;
          }
        }

        // Unset the PayPal subscription ID from user model
        user[config.userFields.paypalSubscriptionID] = undefined;
        await user.save();
        console.log(`Unset PayPal subscription ID for user ${user.email}`);

        // Send email notification only if subscription was successfully cancelled
        if (subscriptionCancelled) {
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: user.email,
                subject: 'PayPal Account Transition - Action Required'
              },
              locals: {
                user,
                message: `We have transitioned PayPal accounts from Niftylettuce, LLC. to Forward Email LLC. Both of these companies are from the owner/founder, and no transfer of the company was made, don't worry. We are simply keeping this tidy and ensuring all payments from July 1, 2025 onwards are with the correct account. Please log in at https://forwardemail.net/my-account/billing to set up Auto-Renew, which will use our new PayPal account. If you have any questions, just let us know by email, help requests, or hop our the Matrix chatroom! Thank you!`
              }
            });
            console.log(`Sent transition email to user ${user.email}`);
          } catch (emailErr) {
            console.error(
              `Failed to send email to user ${user.email}:`,
              emailErr.message
            );
          }
        } else {
          console.log(
            `No email sent to user ${user.email} - subscription was already cancelled`
          );
        }
      } catch (err) {
        console.error(`Error processing user ${user.email}:`, err.message);
      }
    });

    console.log('PayPal legacy migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);

  await migratePayments();

  process.exit(0);
})();
