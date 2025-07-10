/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/* eslint-disable no-unreachable */

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
const Payments = require('#models/payments');
const Users = require('#models/users');
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

// Array of legacy PayPal subscription IDs to be cancelled
// Fill this array with subscription IDs that need to be cancelled
const LEGACY_PAYPAL_SUBSCRIPTION_IDS = [];

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
      {
        status: err.status,
        message: err.message,
        response: err.response ? err.response.text : 'No response text'
      }
    );
    return null;
  }
}

async function validatePayments() {
  try {
    console.log('Starting PayPal payment validation...');

    // Early return for deprecated legacy PayPal agent
    logger.debug('Legacy PayPal payment validation is deprecated - skipping');
    return;

    // Get all payments that have PayPal transaction IDs
    const payments = await Payments.find({
      paypal_transaction_id: { $exists: true, $ne: null }
    });

    console.log(
      `Found ${payments.length} payments with PayPal transaction IDs to validate`
    );

    const legacyAgent = await paypalAgentLegacy();
    const newAgent = await paypalAgent();
    let legacyCount = 0;
    let newCount = 0;
    let notFoundCount = 0;

    // Process each payment to determine if it's legacy or new
    await pMapSeries(payments, async (payment) => {
      try {
        const transactionId = payment.paypal_transaction_id;
        console.log(
          `Validating payment ${payment._id} with transaction ID ${transactionId}`
        );

        // First try with legacy PayPal agent
        const foundWithLegacy = await checkPaymentWithAgent(
          transactionId,
          legacyAgent,
          'legacy'
        );

        if (foundWithLegacy) {
          // Mark as legacy PayPal
          if (payment.is_legacy_paypal === true) {
            console.log(
              `Payment ${payment._id} already marked as legacy PayPal`
            );
          } else {
            payment.is_legacy_paypal = true;
            await payment.save();
            console.log(`Marked payment ${payment._id} as legacy PayPal`);
          }

          legacyCount++;
          return;
        }

        // If not found with legacy, try with new PayPal agent
        const foundWithNew = await checkPaymentWithAgent(
          transactionId,
          newAgent,
          'new'
        );

        if (foundWithNew) {
          // Mark as new PayPal (not legacy)
          if (payment.is_legacy_paypal === false) {
            console.log(`Payment ${payment._id} already marked as new PayPal`);
          } else {
            payment.is_legacy_paypal = false;
            await payment.save();
            console.log(`Marked payment ${payment._id} as new PayPal`);
          }

          newCount++;
          return;
        }

        // Not found with either agent
        console.log(
          `Payment ${payment._id} not found with either PayPal agent`
        );
        notFoundCount++;
      } catch (err) {
        console.error(`Error processing payment ${payment._id}:`, err.message);
      }
    });

    console.log(`Payment validation completed:`);
    console.log(`- Legacy PayPal payments: ${legacyCount}`);
    console.log(`- New PayPal payments: ${newCount}`);
    console.log(`- Not found: ${notFoundCount}`);
  } catch (err) {
    console.error('Payment validation failed:', err);
    throw err;
  }
}

async function cancelLegacySubscriptions() {
  // Early return for deprecated legacy PayPal agent
  logger.debug(
    'Legacy PayPal subscription cancellation is deprecated - skipping'
  );
  return;

  if (LEGACY_PAYPAL_SUBSCRIPTION_IDS.length === 0) {
    console.log('No legacy PayPal subscription IDs to cancel');
    return;
  }

  console.log(
    `Starting cancellation of ${LEGACY_PAYPAL_SUBSCRIPTION_IDS.length} legacy PayPal subscriptions...`
  );

  await pMapSeries(LEGACY_PAYPAL_SUBSCRIPTION_IDS, async (subscriptionId) => {
    try {
      console.log(`Processing legacy subscription ${subscriptionId}`);

      // Find the user with this subscription ID
      const user = await Users.findOne({
        [config.userFields.paypalSubscriptionID]: subscriptionId
      });

      if (!user) {
        console.log(`No user found with subscription ID ${subscriptionId}`);
        return;
      }

      console.log(
        `Found user ${user.email} with subscription ${subscriptionId}`
      );

      // Try to cancel the PayPal subscription using legacy agent
      let subscriptionCancelled = false;
      try {
        const legacyAgent = await paypalAgentLegacy();
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
          `No email sent to user ${user.email} - subscription was not successfully cancelled`
        );
      }
    } catch (err) {
      console.error(
        `Error processing subscription ${subscriptionId}:`,
        err.message
      );
    }
  });

  console.log('Legacy subscription cancellation completed');
}

(async () => {
  await setupMongoose(logger);

  // Validate all payments to determine if they're legacy or new
  await validatePayments();

  // Cancel legacy subscriptions if any are specified
  await cancelLegacySubscriptions();

  process.exit(0);
})();
