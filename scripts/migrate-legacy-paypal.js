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
const { paypalAgentLegacy } = require('#helpers/paypal-legacy');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// July 1, 2025 cutoff date
const CUTOFF_DATE = Date.now();

async function checkSubscriptionWithAgent(subscriptionId, agent, agentType) {
  try {
    const response = await agent.get(
      `/v1/billing/subscriptions/${subscriptionId}`
    );
    console.log(`Subscription ${subscriptionId} found with ${agentType} agent`);
    return response.body;
  } catch (err) {
    if (err.status === 404) {
      console.log(
        `Subscription ${subscriptionId} not found with ${agentType} agent`
      );
      return null;
    }

    console.error(
      `Error checking subscription ${subscriptionId} with ${agentType} agent:`,
      err.message
    );
    return null;
  }
}

async function checkPaymentWithAgent(transactionId, agent, agentType) {
  try {
    // For PayPal, transaction IDs are actually capture IDs, so we use the captures endpoint
    const response = await agent.get(`/v2/payments/captures/${transactionId}`);
    console.log(`Transaction ${transactionId} found with ${agentType} agent`);
    return response.body;
  } catch (err) {
    if (err.status === 404) {
      console.log(
        `Transaction ${transactionId} not found with ${agentType} agent`
      );
      return null;
    }

    console.error(
      `Error checking transaction ${transactionId} with ${agentType} agent:`,
      err.message
    );
    return null;
  }
}

async function isUserOnNewPayPal(user) {
  const subscriptionId = user[config.userFields.paypalSubscriptionID];

  if (!subscriptionId) {
    return false;
  }

  // Check if subscription exists with new PayPal agent
  const newAgent = await paypalAgent();
  const subscriptionWithNew = await checkSubscriptionWithAgent(
    subscriptionId,
    newAgent,
    'new'
  );

  if (subscriptionWithNew) {
    console.log(
      `User ${user.email} has valid subscription with new PayPal agent`
    );
    return true;
  }

  // Check user's payments to see if any are with the new PayPal API
  const userPayments = await Payments.find({ user: user._id })
    .sort({ created_at: -1 })
    .limit(10);

  for (const payment of userPayments) {
    if (payment.paypal_transaction_id) {
      // Check if this transaction exists with new PayPal agent
      // eslint-disable-next-line no-await-in-loop
      const transactionWithNew = await checkPaymentWithAgent(
        payment.paypal_transaction_id,
        newAgent,
        'new'
      );
      if (transactionWithNew) {
        console.log(
          `User ${user.email} has transaction ${payment.paypal_transaction_id} with new PayPal agent`
        );
        return true;
      }
    }
  }

  return false;
}

async function migratePayments() {
  try {
    console.log('Starting PayPal legacy migration...');

    // Find all payments created before July 1, 2025 that need to be checked
    const paymentsToCheck = await Payments.find({
      created_at: { $lt: CUTOFF_DATE },
      is_legacy_paypal: { $ne: true },
      paypal_transaction_id: { $exists: true, $ne: null }
    });

    console.log(
      `Found ${paymentsToCheck.length} payments to validate against PayPal APIs`
    );

    const newAgent = await paypalAgent();
    const legacyAgent = await paypalAgentLegacy();
    let legacyPaymentsCount = 0;

    // Process each payment individually to check which PayPal API it belongs to
    await pMapSeries(paymentsToCheck, async (payment) => {
      try {
        const transactionId = payment.paypal_transaction_id;
        console.log(
          `Checking payment ${payment._id} with transaction ID ${transactionId}`
        );

        // First check if transaction exists with new PayPal agent
        const transactionWithNew = await checkPaymentWithAgent(
          transactionId,
          newAgent,
          'new'
        );

        if (transactionWithNew) {
          console.log(
            `Payment ${payment._id} found with new PayPal agent - skipping legacy flag`
          );
          return;
        }

        // Check if transaction exists with legacy PayPal agent
        const transactionWithLegacy = await checkPaymentWithAgent(
          transactionId,
          legacyAgent,
          'legacy'
        );

        if (transactionWithLegacy) {
          console.log(
            `Payment ${payment._id} confirmed as legacy - setting flag`
          );
          payment.is_legacy_paypal = true;
          await payment.save();
          legacyPaymentsCount++;
        } else {
          console.log(
            `Payment ${payment._id} not found with either PayPal agent - skipping`
          );
        }
      } catch (err) {
        console.error(`Error processing payment ${payment._id}:`, err.message);
      }
    });

    console.log(
      `Updated ${legacyPaymentsCount} payments to legacy PayPal status`
    );

    // Find all users with active PayPal subscriptions that need to be checked
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

        // Check if user is already on new PayPal - if so, return early
        const isOnNewPayPal = await isUserOnNewPayPal(user);
        if (isOnNewPayPal) {
          console.log(
            `User ${user.email} is already on new PayPal - skipping migration`
          );
          return;
        }

        // Verify this is actually a legacy subscription by checking with legacy agent
        const legacyAgent = await paypalAgentLegacy();
        const subscriptionWithLegacy = await checkSubscriptionWithAgent(
          subscriptionId,
          legacyAgent,
          'legacy'
        );

        if (!subscriptionWithLegacy) {
          console.log(
            `Subscription ${subscriptionId} not found with legacy agent for user ${user.email} - skipping`
          );
          return;
        }

        console.log(
          `Confirmed user ${user.email} has legacy PayPal subscription - proceeding with migration`
        );

        // Try to cancel the PayPal subscription
        let subscriptionCancelled = false;
        try {
          await legacyAgent.post(
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

        // Set is_legacy_paypal flag and unset the PayPal subscription ID from user model
        user.is_legacy_paypal = true;
        user[config.userFields.paypalSubscriptionID] = undefined;
        await user.save();
        console.log(
          `Set legacy PayPal flag and unset subscription ID for user ${user.email}`
        );

        // Send email notification only if subscription was successfully cancelled
        if (subscriptionCancelled) {
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: user.email,
                subject: '⚠️ PayPal Account Transition - Action Required ⚠️'
              },
              locals: {
                user,
                message: `
<p>We’ve smoothly transitioned our PayPal accounts from Niftylettuce, LLC to Forward Email LLC. 🎉</p>
<p><strong>Good news!</strong> Both companies are under the same <a href="https://forwardemail.net/about" target="_blank" rel="noopener noreferrer">original owner/founder</a>—no ownership changes, so no worries! 😊</p>
<p>This update keeps our records clean, ensuring all payments from July 1, 2025, use the correct account.</p>
<p>Please visit <a href="https://forwardemail.net/my-account/billing" class="font-weight-bold" target="_blank" rel="noopener noreferrer">your billing page</a> to enable Auto-Renew with our new PayPal account. 🚀</p>
<p>Got questions? Reach out via email, help requests, or join our Matrix chatroom! 💬</p>
                `.trim()
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
