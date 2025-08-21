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
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');

const mongoose = require('mongoose');
const Payments = require('#models/payments');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const { paypalAgent } = require('#helpers/paypal');
const getAllPayPalSubscriptionTransactions = require('#helpers/get-all-paypal-subscription-transactions');
const ThresholdError = require('#helpers/threshold-error');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// Arrays of subscription IDs to sync
// Fill these arrays with subscription IDs that need to be synced
const LEGACY_PAYPAL_SUBSCRIPTION_IDS = [];
const NEW_PAYPAL_SUBSCRIPTION_IDS = [];

const { PAYPAL_PLAN_MAPPING, PAYPAL_PLAN_MAPPING_LEGACY } = config.payments;
const PAYPAL_PLANS = {
  enhanced_protection: Object.values(PAYPAL_PLAN_MAPPING.enhanced_protection),
  team: Object.values(PAYPAL_PLAN_MAPPING.team)
};
const PAYPAL_PLANS_LEGACY = {
  enhanced_protection: Object.values(
    PAYPAL_PLAN_MAPPING_LEGACY.enhanced_protection
  ),
  team: Object.values(PAYPAL_PLAN_MAPPING_LEGACY.team)
};

async function syncSubscriptionPayments(
  subscriptionId,
  agent,
  agentType,
  errorEmails
) {
  // Early return for deprecated legacy PayPal agent
  if (agentType === 'legacy') {
    logger.debug('Skipping legacy PayPal agent usage - deprecated');
    return;
  }

  let hasError = false;
  console.log(`Syncing subscription ${subscriptionId} with ${agentType} agent`);

  try {
    // Find the user associated with this subscription
    const payment = await Payments.findOne({
      [config.userFields.paypalSubscriptionID]: subscriptionId
    });

    if (!payment) {
      console.log(`No payment found for subscription ${subscriptionId}`);
      return;
    }

    const customer = await Users.findById(payment.user);
    if (!customer) {
      console.log(`No user found for subscription ${subscriptionId}`);
      return;
    }

    console.log(
      `Found user ${customer.email} for subscription ${subscriptionId}`
    );

    // Get subscription details
    const { body: subscription } = await agent.get(
      `/v1/billing/subscriptions/${subscriptionId}`
    );

    let plan;

    if (agentType === 'legacy') {
      plan = Object.keys(PAYPAL_PLANS_LEGACY).find((plan) =>
        PAYPAL_PLANS_LEGACY[plan].includes(subscription.plan_id)
      );
    } else {
      plan = Object.keys(PAYPAL_PLANS).find((plan) =>
        PAYPAL_PLANS[plan].includes(subscription.plan_id)
      );
    }

    if (!plan) {
      throw new Error(`Unknown plan ID: ${subscription.plan_id}`);
    }

    const duration = ms(
      Object.entries(
        agentType === 'legacy'
          ? PAYPAL_PLAN_MAPPING_LEGACY[plan]
          : PAYPAL_PLAN_MAPPING[plan]
      ).find((mapping) => mapping[1] === subscription.plan_id)[0]
    );

    // Get all transactions for this subscription
    const transactions = await getAllPayPalSubscriptionTransactions(
      subscription,
      agent
    );

    console.log(
      `Found ${transactions.length} transactions for subscription ${subscriptionId}`
    );

    // Process each transaction
    await pMapSeries(transactions, async (transaction) => {
      try {
        console.log(`Processing transaction ${transaction.id}`);

        // Try to find existing payment
        const paymentCandidates = await Payments.find({
          user: customer._id,
          [config.userFields.paypalSubscriptionID]: subscription.id
        });

        // Find payment by transaction ID or same day
        const existingPayment = paymentCandidates.find(
          (p) =>
            transaction.id === p.paypal_transaction_id ||
            dayjs(transaction.time).format('MM/DD/YY') ===
              dayjs(p.invoice_at).format('MM/DD/YY')
        );

        // Validate currency
        if (
          isSANB(
            transaction.amount_with_breakdown.gross_amount.currency_code
          ) &&
          transaction.amount_with_breakdown.gross_amount.currency_code !== 'USD'
        ) {
          throw new Error(
            'PayPal transaction amount was not in USD and could not be saved'
          );
        }

        const amount =
          Number.parseInt(
            transaction.amount_with_breakdown.gross_amount.value,
            10
          ) * 100;

        let amountRefunded = 0;
        // Check for refunds
        if (transaction.status === 'REFUNDED') {
          amountRefunded = amount;
        } else if (transaction.status === 'PARTIALLY_REFUNDED') {
          // Lookup the refund details
          const { body: refund } = await agent.get(
            `/v2/payments/refunds/${transaction.id}`
          );
          amountRefunded = Math.round(Number(refund.amount.value) * 100);
        }

        if (existingPayment) {
          // Update existing payment
          let shouldSave = false;

          if (!existingPayment.paypal_transaction_id) {
            // Prevent duplicate transaction ID
            const count = await Payments.countDocuments({
              paypal_transaction_id: transaction.id,
              _id: {
                $ne: existingPayment._id
              }
            });

            if (count > 0) {
              throw new Error(
                `Transaction ID ${transaction.id} was attempting to be duplicated for payment ID ${existingPayment.id}`
              );
            }

            existingPayment.paypal_transaction_id = transaction.id;
            shouldSave = true;
          }

          // Update invoice_at if different
          if (
            new Date(existingPayment.invoice_at).getTime() !==
            new Date(transaction.time).getTime()
          ) {
            existingPayment.invoice_at = new Date(transaction.time);
            shouldSave = true;
          }

          // Validate plan matches
          if (existingPayment.plan !== plan) {
            throw new Error('PayPal plan did not match existing payment');
          }

          // Update refund amount if different
          if (existingPayment.amount_refunded !== amountRefunded) {
            existingPayment.amount_refunded = amountRefunded;
            shouldSave = true;
          }

          // Update duration if different
          if (existingPayment.duration !== duration) {
            existingPayment.duration = duration;
            shouldSave = true;
          }

          // Set legacy flag based on agent type
          const isLegacy = agentType === 'legacy';
          if (existingPayment.is_legacy_paypal !== isLegacy) {
            existingPayment.is_legacy_paypal = isLegacy;
            shouldSave = true;
          }

          if (shouldSave) {
            console.log(`Updating existing payment ${existingPayment.id}`);
            await existingPayment.save();
          } else {
            console.log(`Payment ${existingPayment.id} already up to date`);
          }
        } else {
          // Create new payment
          // Prevent duplicate transaction ID
          const count = await Payments.countDocuments({
            paypal_transaction_id: transaction.id
          });

          if (count > 0) {
            throw new Error(
              `Transaction ID ${transaction.id} was attempting to be duplicated for customer ${customer.email}`
            );
          }

          const newPayment = {
            user: customer._id,
            method: 'paypal',
            kind: 'subscription',
            amount,
            plan,
            duration,
            amount_refunded: amountRefunded,
            [config.userFields.paypalSubscriptionID]: subscription.id,
            paypal_transaction_id: transaction.id,
            invoice_at: new Date(transaction.time),
            is_legacy_paypal: agentType === 'legacy',
            stack: new Error('stack').stack
          };

          console.log(`Creating new payment for transaction ${transaction.id}`);
          await Payments.create(newPayment);
        }

        // Update user to refresh plan_expires_at
        const user = await Users.findById(customer._id);
        if (!user) throw new Error('User does not exist');
        await user.save();
      } catch (err) {
        err.transaction = transaction;
        err.isCodeBug = true;
        logger.error(err);
        hasError = true;
        errorEmails.push({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `${customer.email} had an issue syncing transaction ${transaction.id} from PayPal subscription ${subscriptionId}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          },
          err
        });

        if (errorEmails.length >= config.paypalErrorThreshold) {
          throw new ThresholdError(errorEmails.map((e) => e.err));
        }
      }
    });

    // Handle cancelled/expired subscriptions
    if (
      !hasError &&
      isSANB(subscription.status) &&
      ['SUSPENDED', 'CANCELLED', 'EXPIRED'].includes(subscription.status)
    ) {
      console.log(`Subscription ${subscriptionId} is ${subscription.status}`);

      // Attempt to cancel if not already cancelled
      if (subscription.status !== 'CANCELLED') {
        try {
          await agent.post(
            `/v1/billing/subscriptions/${subscriptionId}/cancel`
          );
          console.log(`Cancelled subscription ${subscriptionId}`);
        } catch (err) {
          console.error(
            `Failed to cancel subscription ${subscriptionId}:`,
            err.message
          );
        }
      }

      // Remove from user's account if it matches current subscription
      const user = await Users.findById(customer._id);
      if (!user) throw new Error('User does not exist');
      if (user[config.userFields.paypalSubscriptionID] === subscriptionId) {
        user[config.userFields.paypalSubscriptionID] = undefined;
        await user.save();
        console.log(
          `Removed subscription ${subscriptionId} from user ${customer.email}`
        );
      }
    }
  } catch (err) {
    console.error(`Error syncing subscription ${subscriptionId}:`, err.message);
    logger.error(err);

    if (err instanceof ThresholdError) throw err;

    if (err.status === 404) {
      console.log(
        `Subscription ${subscriptionId} not found with ${agentType} agent`
      );
    } else {
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Error syncing PayPal subscription ${subscriptionId} with ${agentType} agent`
        },
        locals: {
          message: `<pre><code>${safeStringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        },
        err
      });

      if (errorEmails.length >= config.paypalErrorThreshold) {
        throw new ThresholdError(errorEmails.map((e) => e.err));
      }
    }
  }
}

async function syncAllSubscriptions() {
  try {
    console.log('Starting PayPal subscription payments sync...');

    const errorEmails = [];

    // Sync legacy subscriptions
    if (LEGACY_PAYPAL_SUBSCRIPTION_IDS.length > 0) {
      logger.debug('Skipping legacy PayPal subscription sync - deprecated');
    } else {
      console.log('No legacy subscription IDs to sync');
    }

    // Sync new subscriptions
    if (NEW_PAYPAL_SUBSCRIPTION_IDS.length > 0) {
      console.log(
        `Syncing ${NEW_PAYPAL_SUBSCRIPTION_IDS.length} new subscriptions...`
      );
      const newAgent = await paypalAgent();

      await pMapSeries(NEW_PAYPAL_SUBSCRIPTION_IDS, async (subscriptionId) => {
        await syncSubscriptionPayments(
          subscriptionId,
          newAgent,
          'new',
          errorEmails
        );
      });
    } else {
      console.log('No new subscription IDs to sync');
    }

    // Send error emails if any
    if (errorEmails.length > 0) {
      console.log(`Sending ${errorEmails.length} error emails...`);
      await Promise.all(errorEmails.map((email) => emailHelper(email)));
    }

    console.log('PayPal subscription payments sync completed successfully');
  } catch (err) {
    console.error('Subscription sync failed:', err);

    if (err instanceof ThresholdError) {
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `PayPal subscription sync hit ${config.paypalErrorThreshold} errors`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
        });
      } catch (emailErr) {
        console.error(
          'Failed to send threshold error email:',
          emailErr.message
        );
      }
    }

    throw err;
  }
}

(async () => {
  await setupMongoose(logger);

  await syncAllSubscriptions();

  process.exit(0);
})();
