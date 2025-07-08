/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout } = require('node:timers/promises');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const ms = require('ms');
const pMapSeries = require('p-map-series');

const mongoose = require('mongoose');
const Payments = require('#models/payments');
const Users = require('#models/users');
const { paypalAgent } = require('#helpers/paypal');
const { paypalAgentLegacy } = require('#helpers/paypal-legacy');
const setupMongoose = require('#helpers/setup-mongoose');
const _ = require('#helpers/lodash');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger: console
});

graceful.listen();

const FIVE_SECONDS = ms('5s');

/**
 * Looks up PayPal order by order ID and extracts transaction information
 * @param {Object} payment - Payment document
 * @param {Object} agent - PayPal agent (legacy or new)
 * @param {string} agentType - Type of agent ('legacy' or 'new')
 * @returns {Object|null} - Transaction data or null if not found
 */
async function lookupPayPalOrder(payment, agent, agentType) {
  try {
    console.log(
      `Looking up PayPal order ${payment.paypal_order_id} for payment ${payment._id} using ${agentType} agent`
    );

    const response = await agent.get(
      `/v2/checkout/orders/${payment.paypal_order_id}`
    );

    if (
      !_.isArray(response.body.purchase_units) ||
      _.isEmpty(response.body.purchase_units)
    ) {
      console.log(
        `No purchase units found for order ${payment.paypal_order_id}`
      );
      return null;
    }

    if (
      !_.isObject(response.body.purchase_units[0]) ||
      !_.isObject(response.body.purchase_units[0].payments) ||
      !_.isArray(response.body.purchase_units[0].payments.captures) ||
      _.isEmpty(response.body.purchase_units[0].payments.captures)
    ) {
      console.log(`No captures found for order ${payment.paypal_order_id}`);
      return null;
    }

    // Find the initial transaction
    const [capture] = response.body.purchase_units[0].payments.captures;
    if (!capture) {
      console.log(`No capture data found for order ${payment.paypal_order_id}`);
      return null;
    }

    console.log(
      `Found transaction ID ${capture.id} for order ${payment.paypal_order_id}`
    );

    // Extract invoice date
    let invoiceAt;
    if (response.body.create_time) {
      invoiceAt = new Date(response.body.create_time);
    } else if (
      response.body?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time
    ) {
      invoiceAt = new Date(
        response.body.purchase_units[0].payments.captures[0].create_time
      );
    }

    // Calculate refund amount
    let amountRefunded = 0;
    if (capture.status === 'REFUNDED') {
      amountRefunded = payment.amount;
      console.log(
        `Full refund detected for transaction ${capture.id}, amount: ${amountRefunded}`
      );
    } else if (capture.status === 'PARTIALLY_REFUNDED') {
      try {
        // Lookup the refund and parse the amount refunded
        const { body: refund } = await agent.get(
          `/v2/payments/refunds/${capture.id}`
        );
        amountRefunded = Math.round(Number(refund.amount.value) * 100);
        console.log(
          `Partial refund detected for transaction ${capture.id}, amount: ${amountRefunded}`
        );
      } catch (refundErr) {
        console.error(
          `Error fetching refund details for ${capture.id}:`,
          refundErr.message
        );
      }
    }

    return {
      transactionId: capture.id,
      invoiceAt,
      amountRefunded,
      status: capture.status
    };
  } catch (err) {
    if (err.status === 404) {
      console.log(
        `Order ${payment.paypal_order_id} not found with ${agentType} agent (account may be deleted)`
      );
      return null;
    }

    console.error(
      `Error looking up order ${payment.paypal_order_id} with ${agentType} agent:`,
      {
        status: err.status,
        message: err.message,
        response: err.response ? err.response.text : 'No response text'
      }
    );
    throw err;
  }
}

/**
 * Syncs a payment with PayPal transaction data
 * @param {Object} payment - Payment document
 * @returns {boolean} - Whether the payment was updated
 */
async function syncPaymentTransaction(payment) {
  try {
    console.log(`\n=== Processing Payment ${payment._id} ===`);
    console.log(`PayPal Order ID: ${payment.paypal_order_id}`);
    console.log(`User ID: ${payment.user}`);
    console.log(`Amount: ${payment.amount}`);
    console.log(`Currency: ${payment.currency}`);
    console.log(`Is Legacy PayPal: ${payment.is_legacy_paypal}`);
    console.log(`Created: ${payment.created_at}`);

    // Determine which agent to use
    const agent = payment.is_legacy_paypal
      ? await paypalAgentLegacy()
      : await paypalAgent();
    const agentType = payment.is_legacy_paypal ? 'legacy' : 'new';

    // Look up the PayPal order
    const transactionData = await lookupPayPalOrder(payment, agent, agentType);

    if (!transactionData) {
      console.log(
        `Could not retrieve transaction data for payment ${payment._id} - deleting payment and syncing user`
      );

      // If order was not found or transaction data was not found,
      // delete the payment and save the user
      const user = await Users.findById(payment.user._id);
      if (user) {
        console.log(`Found user ${user.email} for payment ${payment._id}`);

        // Delete the payment
        await Payments.findByIdAndRemove(payment._id);
        console.log(
          `Deleted payment ${payment._id} with missing transaction data`
        );

        // Save the user to trigger any necessary updates
        await user.save();
        console.log(
          `Synced user ${user.email} after deleting payment ${payment._id}`
        );
      } else {
        console.error(`User not found for payment ${payment._id}`);
        // Still delete the payment even if user not found
        await Payments.findByIdAndRemove(payment._id);
        console.log(`Deleted orphaned payment ${payment._id} (user not found)`);
      }

      return false;
    }

    // Check if we need to update the payment
    let shouldSave = false;
    const updates = [];

    // Check transaction ID
    if (!payment.paypal_transaction_id) {
      // Check for duplicates before setting transaction ID
      const existingPayment = await Payments.findOne({
        paypal_transaction_id: transactionData.transactionId,
        _id: { $ne: payment._id }
      });

      if (existingPayment) {
        console.error(
          `Transaction ID ${transactionData.transactionId} already exists for payment ${existingPayment._id}. Skipping payment ${payment._id}.`
        );
        return false;
      }

      payment.paypal_transaction_id = transactionData.transactionId;
      shouldSave = true;
      updates.push(`Set transaction ID: ${transactionData.transactionId}`);
    } else if (
      payment.paypal_transaction_id !== transactionData.transactionId
    ) {
      console.log(
        `Transaction ID mismatch: existing ${payment.paypal_transaction_id}, found ${transactionData.transactionId}`
      );
      updates.push(
        `Transaction ID mismatch: ${payment.paypal_transaction_id} -> ${transactionData.transactionId}`
      );
    }

    // Check invoice date
    if (
      transactionData.invoiceAt &&
      new Date(payment.invoice_at).getTime() !==
        transactionData.invoiceAt.getTime()
    ) {
      payment.invoice_at = transactionData.invoiceAt;
      shouldSave = true;
      updates.push(`Updated invoice date: ${transactionData.invoiceAt}`);
    }

    // Check refund amount
    if (payment.amount_refunded !== transactionData.amountRefunded) {
      payment.amount_refunded = transactionData.amountRefunded;
      shouldSave = true;
      updates.push(`Updated refund amount: ${transactionData.amountRefunded}`);
    }

    if (shouldSave) {
      await payment.save();
      console.log(`Payment ${payment._id} updated successfully:`);
      for (const update of updates) {
        console.log(`  - ${update}`);
      }

      return true;
    }

    console.log(`Payment ${payment._id} is already up to date`);
    return false;
  } catch (err) {
    console.error(`Error syncing payment ${payment._id}:`, err.message);
    console.error(err, { payment: payment._id });
    return false;
  }
}

/**
 * Syncs user data after payment updates
 * @param {string} userId - User ID
 * @returns {boolean} - Whether the user was updated
 */
async function syncUser(userId) {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return false;
    }

    console.log(`Syncing user ${user.email} (${userId})`);

    // Save the user to trigger any necessary updates
    await user.save();
    console.log(`User ${user.email} synced successfully`);
    return true;
  } catch (err) {
    console.error(`Error syncing user ${userId}:`, err.message);
    console.error(err, { userId });
    return false;
  }
}

/**
 * Main function to process all payments missing transaction IDs
 */
async function main() {
  try {
    await setupMongoose(console);

    console.log('Starting PayPal transaction ID sync script...\n');

    console.log('Querying for payments with missing transaction IDs...');
    const payments = await Payments.find({
      paypal_order_id: { $exists: true, $ne: null },
      paypal_transaction_id: { $exists: false }
    }).populate('user', 'email _id id');

    console.log(`Found ${payments.length} payments to process\n`);

    if (payments.length === 0) {
      console.log('No payments found that need transaction ID sync. Exiting.');
      process.exit(0);
    }

    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const processedUsers = new Set();

    // Process each payment sequentially to respect API rate limits
    await pMapSeries(payments, async (payment, index) => {
      try {
        console.log(`\n--- Processing ${index + 1}/${payments.length} ---`);

        const wasUpdated = await syncPaymentTransaction(payment);
        processedCount++;

        if (wasUpdated) {
          updatedCount++;
          // Track users that need syncing
          processedUsers.add(payment.user._id.toString());
        }

        // Add delay between API calls to respect rate limits
        if (index < payments.length - 1) {
          console.log(
            `Waiting ${FIVE_SECONDS / 1000} seconds before next request...`
          );
          await setTimeout(FIVE_SECONDS);
        }
      } catch (err) {
        errorCount++;
        console.error(`Failed to process payment ${payment._id}:`, err.message);
      }
    });

    console.log('\n=== Payment Processing Complete ===');
    console.log(`Total payments processed: ${processedCount}`);
    console.log(`Payments updated: ${updatedCount}`);
    console.log(`Errors encountered: ${errorCount}`);

    // Sync users for updated payments
    if (processedUsers.size > 0) {
      console.log(`\n=== Syncing ${processedUsers.size} Users ===`);
      let usersSynced = 0;
      let userErrors = 0;

      await pMapSeries([...processedUsers], async (userId) => {
        try {
          const synced = await syncUser(userId);
          if (synced) usersSynced++;
        } catch (err) {
          userErrors++;
          console.error(`Failed to sync user ${userId}:`, err.message);
        }
      });

      console.log(`\n=== User Sync Complete ===`);
      console.log(`Users synced: ${usersSynced}`);
      console.log(`User sync errors: ${userErrors}`);
    }

    console.log('\n=== Script Complete ===');
    console.log('PayPal transaction ID sync finished successfully.');
  } catch (err) {
    console.error('Script failed:', err);
    console.error(err);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('Unhandled error:', err);
      process.exit(1);
    });
}

module.exports = main;
