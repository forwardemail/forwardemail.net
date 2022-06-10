/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const dayjs = require('dayjs-with-plugins');

const config = require('#config');
const emailHelper = require('#helpers/email');
const { paypalAgent } = require('#helpers/paypal');
const logger = require('#helpers/logger');
const Users = require('#models/user');
const Payments = require('#models/payment');

const { PAYPAL_PLAN_MAPPING } = config.payments;

const PAYPAL_PLANS = {
  enhanced_protection: Object.values(PAYPAL_PLAN_MAPPING.enhanced_protection),
  team: Object.values(PAYPAL_PLAN_MAPPING.team)
};

const thresholdError = new Error('Error threshold has been met');

// eslint-disable-next-line complexity
async function syncPaypalSubscriptionPayments({ errorThreshold }) {
  const errorEmails = [];

  const paypalCustomers = await Users.find({
    [config.userFields.paypalPayerID]: { $exists: true, $ne: null }
  })
    .lean()
    .exec();

  logger.info(
    `Syncing payments for ${paypalCustomers.length} paypal customers`
  );

  let updatedCount = 0;
  let goodToGoCount = 0;
  let createdCount = 0;

  for (const customer of paypalCustomers) {
    try {
      logger.info(`Syncing paypal subscription payments for ${customer.email}`);
      /**
       * first we need to get the distinct paypal order Ids and validate them all
       * this really shouldn't be needed. So I am leaving it out for now unless
       * we want to specifically validate these in the future
       *
       * const orderIds = await Payments.distinct('paypal_order_id', {
       *   user: customer._id
       * });
       *
       * for (const orderId of orderIds) {
       *   const { body: order } = await paypalAgent.get(
       *     `/v2/checkout/orders/${orderId}`
       *   );
       *   ;
       * }
       */

      // then we need to get all the subscription ids and validate that the one that
      // works is the subscription id set on the user. Assuming that is good, that will
      // be the only subscription we have access to I think...
      // This kind of sucks, but it is the best we can do right now I beleive.
      const subscriptionIds = await Payments.distinct(
        config.userFields.paypalSubscriptionID,
        {
          user: customer._id
        }
      );

      for (const subscriptionId of subscriptionIds) {
        try {
          logger.debug(`subscriptionId ${subscriptionId}`);
          const { body: subscription } = await paypalAgent.get(
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

          // this will either error - or it will return the current active subscriptions transactions.
          // https://developer.paypal.com/docs/subscriptions/full-integration/subscription-management/#list-transactions-for-a-subscription
          const { body: { transactions } = {} } = await paypalAgent.get(
            `/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${
              subscription.create_time
            }&end_time=${new Date().toISOString()}`
          );

          if (transactions.length > 0) {
            logger.debug(`${transactions.length} transactions`);
            for (const transaction of transactions) {
              try {
                // we need to have a payment for each transaction of a subscription
                logger.debug(`transaction ${transaction.id}`);

                // try to find the payment
                const paymentCandidates = await Payments.find({
                  [config.userFields.paypalSubscriptionID]: subscription.id
                });

                // TODO: need to fix this to actually add the
                //       invoice_at field in the redirect - although
                //       it won't matter as long as we have fixed it
                //       to add transaction id there need to double check that there

                // then use it if its on the same day
                // we use created_at here because when these were
                // originally created it was the only date
                // field and the only we can even attempt to match up,
                // after the first time this is ran, transaction ids will be saved.
                const payment = paymentCandidates.find(
                  (p) =>
                    transaction.id === p.paypal_transaction_id ||
                    dayjs(transaction.time).format('MM/DD/YY') ===
                      dayjs(p.created_at).format('MM/DD/YY')
                );

                if (
                  isSANB(
                    transaction.amount_with_breakdown.gross_amount.currency_code
                  ) &&
                  transaction.amount_with_breakdown.gross_amount
                    .currency_code !== 'USD'
                )
                  throw new Error(
                    'Paypal transaction amount was not in USD and could not be saved by sync-payment-histories'
                  );

                const amount =
                  Number.parseInt(
                    transaction.amount_with_breakdown.gross_amount.value,
                    10
                  ) * 100;

                if (payment) {
                  let shouldSave = false;

                  if (!payment.paypal_transaction_id) {
                    payment.paypal_transaction_id = transaction.id;
                    shouldSave = true;
                  }

                  if (transaction.time !== payment?.invoice_at?.toISOString()) {
                    logger.debug(
                      `changing payment.invoice_at ${payment.invoice_at?.toISOString()} to match transaction.time ${
                        transaction.time
                      }`
                    );
                    payment.invoice_at = dayjs(transaction.time).toDate();
                    shouldSave = true;
                  }

                  if (payment.plan !== plan)
                    throw new Error('Paypal plan did not match');

                  // currently problem with durations - skip this validation for now
                  // if (payment.duration !== duration)
                  //   throw new Error('Paypal duration did not match');

                  if (shouldSave) {
                    logger.debug(`Updating existing payment ${payment.id}`);
                    updatedCount++;
                    await payment.save();
                  } else {
                    goodToGoCount++;
                    logger.debug(
                      `payment ${payment.id} already up to date and good to go!`
                    );
                  }
                } else {
                  const payment = {
                    user: customer._id,
                    method: 'paypal',
                    kind: 'subscription',
                    amount,
                    plan,
                    duration,
                    [config.userFields.paypalSubscriptionID]: subscription.id,
                    paypal_transaction_id: transaction.id,
                    invoice_at: dayjs(transaction.time).toDate()
                  };
                  createdCount++;
                  logger.debug('creating new payment');
                  await Payments.create(payment);
                }
              } catch (err) {
                logger.error(err);
                errorEmails.push({
                  template: 'alert',
                  message: {
                    to: config.email.message.from,
                    subject: `${customer.email} had an issue syncing a transaction from paypal subscription ${subscriptionId} and transaction ${transaction.id}`
                  },
                  locals: { message: err.message }
                });

                if (errorEmails.length >= errorThreshold) throw thresholdError;
              }
            }
          }
        } catch (err) {
          if (err === thresholdError) throw err;

          if (err.status === 404)
            logger.error(
              new Error('subscription is cancelled or no longer exists')
            );
          else {
            logger.error(err);
            errorEmails.push({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `${customer.email} has an issue syncing all payments from paypal subscription ${subscriptionId} that were not synced by the sync-payment-histories job`
              },
              locals: { message: err.message }
            });

            if (errorEmails.length >= errorThreshold) throw thresholdError;
          }
        }
      }
    } catch (err) {
      if (err === thresholdError) {
        try {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Sync payment histories hit ${errorThreshold} errors during the script`
            },
            locals: {
              message:
                'This may have occurred because of an error in the script, or the paypal service was down, or another error was causing an abnormal number of payment syncing failures'
            }
          });
        } catch (err) {
          logger.error(err);
        }

        logger.error(err);

        throw err;
      }
    }
  }

  if (errorEmails.length > 0) {
    try {
      await Promise.all(errorEmails.map((email) => emailHelper(email)));
    } catch (err) {
      logger.error(err);
    }
  }

  logger.info(
    `Paypal subscriptions synced to payments: ${createdCount} created, ${updatedCount} updated, ${goodToGoCount} good`
  );
}

module.exports = syncPaypalSubscriptionPayments;
