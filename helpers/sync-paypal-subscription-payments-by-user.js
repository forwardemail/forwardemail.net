/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');

const emailHelper = require('./email');
const logger = require('./logger');
const { paypalAgent } = require('./paypal');
const ThresholdError = require('./threshold-error');
const getAllPayPalSubscriptionTransactions = require('./get-all-paypal-subscription-transactions');
const getAllPayPalSubscriptions = require('./get-all-paypal-subscriptions');
const config = require('#config');
const Users = require('#models/users');
const Payments = require('#models/payments');

const { PAYPAL_PLAN_MAPPING } = config.payments;
const PAYPAL_PLANS = {
  enhanced_protection: Object.values(PAYPAL_PLAN_MAPPING.enhanced_protection),
  team: Object.values(PAYPAL_PLAN_MAPPING.team)
};

async function syncPayPalSubscriptionPaymentsByUser(
  errorEmails,
  customer,
  allSubscriptions = null
) {
  try {
    logger.info(`Syncing paypal subscription payments for ${customer.email}`);
    // first we need to get the distinct paypal order Ids and validate them all
    // this really shouldn't be needed. So I am leaving it out for now unless
    // we want to specifically validate these in the future
    //
    // const orderIds = await Payments.distinct('paypal_order_id', {
    //   user: customer._id
    // });
    //
    // for (const orderId of orderIds) {
    //   const agent = await paypalAgent();
    //   const { body: order } = await agent.get(
    //     `/v2/checkout/orders/${orderId}`
    //   );
    //   ;
    // }

    // get all subscriptions for the user from database
    const subscriptionIds = await Payments.distinct(
      config.userFields.paypalSubscriptionID,
      {
        user: customer._id,
        is_legacy_paypal: false
      }
    );

    // push the user's subscription ID if it was set but not included
    if (
      isSANB(customer[config.userFields.paypalSubscriptionID]) &&
      !subscriptionIds.includes(
        customer[config.userFields.paypalSubscriptionID]
      )
    )
      subscriptionIds.push(customer[config.userFields.paypalSubscriptionID]);

    // get all subscriptions from PayPal API and merge with database results
    // If allSubscriptions was passed from job (Phase 1 or Phase 2), use it to avoid re-fetching
    // Otherwise fetch from API (fallback for standalone helper usage)
    if (allSubscriptions) {
      // Filter subscriptions that belong to this user from pre-fetched list
      const userSubscriptions = allSubscriptions.filter(
        (sub) =>
          sub.subscriber?.payer_id ===
            customer[config.userFields.paypalPayerID] ||
          sub.subscriber?.email_address === customer.email
      );
      // merge subscription IDs
      for (const sub of userSubscriptions) {
        if (!subscriptionIds.includes(sub.id)) {
          subscriptionIds.push(sub.id);
          logger.info(
            `Found subscription ${sub.id} from pre-fetched API list for user ${customer.email}`
          );
        }
      }
    } else {
      // Fallback: fetch from API if not provided (standalone helper usage)
      try {
        const fetchedSubscriptions = await getAllPayPalSubscriptions();
        // filter subscriptions that belong to this user
        const userSubscriptions = fetchedSubscriptions.filter(
          (sub) =>
            sub.subscriber?.payer_id ===
              customer[config.userFields.paypalPayerID] ||
            sub.subscriber?.email_address === customer.email
        );
        // merge subscription IDs
        for (const sub of userSubscriptions) {
          if (!subscriptionIds.includes(sub.id)) {
            subscriptionIds.push(sub.id);
            logger.info(
              `Found subscription ${sub.id} from PayPal API for user ${customer.email}`
            );
          }
        }
      } catch (err) {
        logger.error(err, {
          user_email: customer.email,
          message: 'Failed to fetch subscriptions from PayPal API'
        });
        // Continue with database subscriptions only
      }
    }

    // eslint-disable-next-line no-inner-declarations
    async function subscriptionMapper(subscriptionId) {
      let hasError = false;
      logger.info(`subscriptionId ${subscriptionId}`);
      try {
        const agent = await paypalAgent();
        const { body: subscription } = await agent.get(
          `/v1/billing/subscriptions/${subscriptionId}`
        );

        const plan = Object.keys(PAYPAL_PLANS).find((plan) =>
          PAYPAL_PLANS[plan].includes(subscription.plan_id)
        );

        const duration = ms(
          Object.entries(PAYPAL_PLAN_MAPPING[plan]).find(
            (mapping) => mapping[1] === subscription.plan_id
          )[0]
        );

        //
        // NOTE: this re-uses the auth token from `agent` created above
        // (so there should not be more than 30s delay between the two calls)
        //
        // this will either error - or it will return the current active subscriptions transactions.
        // https://developer.paypal.com/docs/subscriptions/full-integration/subscription-management/#list-transactions-for-a-subscription
        const transactions = await getAllPayPalSubscriptionTransactions(
          subscription,
          agent
        );

        logger.info(`${transactions.length} transactions`);

        // eslint-disable-next-line no-inner-declarations
        async function transactionMapper(transaction) {
          try {
            // we need to have a payment for each transaction of a subscription
            logger.info(`transaction ${transaction.id}`);

            // try to find the payment
            const paymentCandidates = await Payments.find({
              user: customer._id,
              [config.userFields.paypalSubscriptionID]: subscription.id,
              is_legacy_paypal: false
            });

            // then use it if its on the same day
            const payment = paymentCandidates.find(
              (p) =>
                transaction.id === p.paypal_transaction_id ||
                dayjs(transaction.time).format('MM/DD/YY') ===
                  dayjs(p.invoice_at).format('MM/DD/YY')
            );

            if (
              isSANB(
                transaction.amount_with_breakdown.gross_amount.currency_code
              ) &&
              transaction.amount_with_breakdown.gross_amount.currency_code !==
                'USD'
            )
              throw new Error(
                'Paypal transaction amount was not in USD and could not be saved by sync-payment-histories'
              );

            const amount =
              Number.parseInt(
                transaction.amount_with_breakdown.gross_amount.value,
                10
              ) * 100;

            let amountRefunded = 0;
            // if the transaction was refunded or partially
            // refunded then we need to check and update it
            if (transaction.status === 'REFUNDED') {
              amountRefunded = amount;
            } else if (transaction.status === 'PARTIALLY_REFUNDED') {
              // lookup the refund and parse the amount refunded
              const agent = await paypalAgent();
              const { body: refund } = await agent.get(
                `/v2/payments/refunds/${transaction.id}`
              );
              amountRefunded = Math.round(Number(refund.amount.value) * 100);
            }

            if (payment) {
              let shouldSave = false;

              if (!payment.paypal_transaction_id) {
                // Check if this transaction ID already exists for ANY user
                // (multiple users can share the same PayPal payer ID)
                const existingPayment = await Payments.findOne({
                  paypal_transaction_id: transaction.id,
                  _id: {
                    $ne: payment._id
                  }
                });

                if (existingPayment) {
                  // Transaction already exists for another user - skip gracefully
                  logger.info(
                    `Transaction ${transaction.id} already exists for user ${existingPayment.user} (payment ${existingPayment.id}), skipping for user ${customer.email} (shared payer ID)`
                  );
                  return; // Skip this transaction
                }

                // otherwise set the tx id
                payment.paypal_transaction_id = transaction.id;
                shouldSave = true;
              }

              // transaction time is different than invoice_at, which is used for plan expiry calculation
              // (see jobs/fix-missing-invoice-at.js)
              if (
                new Date(payment.invoice_at).getTime() !==
                new Date(transaction.time).getTime()
              ) {
                // if the payment's invoice_at was not equal to transaction time
                payment.invoice_at = new Date(transaction.time);
                shouldSave = true;
              }

              if (payment.plan !== plan)
                throw new Error('Paypal plan did not match');

              if (payment.amount_refunded !== amountRefunded) {
                payment.amount_refunded = amountRefunded;
                shouldSave = true;
              }

              if (payment.duration !== duration) {
                payment.duration = duration;
                shouldSave = true;
              }

              if (shouldSave) {
                logger.info(`Updating existing payment ${payment.id}`);
                await payment.save();
              } else {
                logger.info(
                  `payment ${payment.id} already up to date and good to go!`
                );
              }
            } else {
              // Check if this transaction ID already exists for ANY user
              // (multiple users can share the same PayPal payer ID)
              const existingPayment = await Payments.findOne({
                paypal_transaction_id: transaction.id
              });

              if (existingPayment) {
                // Transaction already exists for another user - skip gracefully
                logger.info(
                  `Transaction ${transaction.id} already exists for user ${existingPayment.user} (payment ${existingPayment.id}), skipping for user ${customer.email} (shared payer ID)`
                );
                return; // Skip this transaction
              }

              // otherwise create the payment
              const payment = {
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
                stack: new Error('stack').stack
              };
              logger.info('creating new payment');
              await Payments.create(payment);
            }

            // find and save the associated user
            // so that their plan_expires_at gets updated
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
                subject: `${customer.email} had an issue syncing a transaction from paypal subscription ${subscriptionId} and transaction ${transaction.id}`
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

            if (errorEmails.length >= config.paypalErrorThreshold)
              throw new ThresholdError(errorEmails.map((e) => e.err));
          }
        }

        await pMapSeries(transactions, transactionMapper);

        // after we have finished syncing subscriptions
        // if the subscription itself was cancelled
        // then we need to remove it from our system
        if (
          !hasError &&
          isSANB(subscription.status) &&
          ['SUSPENDED', 'CANCELLED', 'EXPIRED'].includes(subscription.status)
        ) {
          // attempt to cancel the subscription completely (if status was not "CANCELLED" explicitly)
          if (subscription.status !== 'CANCELLED') {
            try {
              const agent = await paypalAgent();
              await agent.post(
                `/v1/billing/subscriptions/${subscriptionId}/cancel`
              );
            } catch (err) {
              logger.error(err, { customer });
            }
          }

          // remove it from the user's account
          // (if and only if the subscription ID matched and was current)
          const user = await Users.findById(customer._id);
          if (!user) throw new Error('User does not exist');
          if (user[config.userFields.paypalSubscriptionID] === subscriptionId) {
            user[config.userFields.paypalSubscriptionID] = undefined;
            await user.save();
          }
        }
      } catch (err) {
        logger.error(err);

        if (err instanceof ThresholdError) throw err;

        if (err.status === 404) logger.error(err, { customer });
        else {
          errorEmails.push({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `${customer.email} has an issue syncing all payments from paypal subscription ${subscriptionId} that were not synced by the sync-payment-histories job`
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

          if (errorEmails.length >= config.paypalErrorThreshold)
            throw new ThresholdError(errorEmails.map((e) => e.err));
        }
      }
    }

    await pMapSeries(subscriptionIds, subscriptionMapper);
  } catch (err) {
    logger.error(err, { customer });
    if (err instanceof ThresholdError) {
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `Sync PayPal payment histories hit ${config.paypalErrorThreshold} errors during the script`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
        });
      } catch (err) {
        logger.error(err);
      }

      throw err;
    }
  }

  return errorEmails;
}

module.exports = syncPayPalSubscriptionPaymentsByUser;
