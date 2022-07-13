const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const sharedConfig = require('@ladjs/shared-config');

const Payments = require('#models/payment');
const Users = require('#models/user');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const { paypalAgent } = require('#helpers/paypal');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const { PAYPAL_PLAN_MAPPING } = config.payments;
const PAYPAL_PLANS = {
  enhanced_protection: Object.values(PAYPAL_PLAN_MAPPING.enhanced_protection),
  team: Object.values(PAYPAL_PLAN_MAPPING.team)
};
const thresholdError = new Error('Error threshold has been met');

let updatedCount = 0;
let goodToGoCount = 0;
let createdCount = 0;
const errorEmails = [];

async function syncPaypalSubscriptionPayments({ errorThreshold }) {
  //
  // NOTE: this won't sync all payments because
  //       some users cancelled paypal subscriptions
  //       and sometimes webhooks and redirects weren't ever hit
  //
  //       and PayPal doesn't have a list subscriptions endpoint
  //       nor do they have a list orders endpoint (it says Partners only?)
  //
  //       so if we really want to fix this retroactively we need to
  //       download the entire TSV/CSV file and then run steps like here:
  //
  //       <https://github.com/paypal/PayPal-REST-API-issues/issues/5>
  //
  const paypalCustomers = await Users.find({
    $or: [
      {
        [config.userFields.paypalSubscriptionID]: { $exists: true, $ne: null }
      },
      {
        [config.userFields.paypalPayerID]: { $exists: true, $ne: null }
      }
    ]
  })
    // sort by newest customers first
    .sort('-created_at')
    .lean()
    .exec();

  logger.info(
    `Syncing payments for ${paypalCustomers.length} paypal customers`
  );

  async function mapper(customer) {
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
       *   const agent = await paypalAgent();
       *   const { body: order } = await agent.get(
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
          const { body: { transactions } = {} } = await agent.get(
            `/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${
              subscription.create_time
            }&end_time=${new Date().toISOString()}`
          );

          if (Array.isArray(transactions) && transactions.length > 0) {
            logger.info(`${transactions.length} transactions`);

            // eslint-disable-next-line no-inner-declarations
            async function transactionMapper(transaction) {
              try {
                // we need to have a payment for each transaction of a subscription
                logger.info(`transaction ${transaction.id}`);

                // try to find the payment
                const paymentCandidates = await Payments.find({
                  user: customer._id,
                  [config.userFields.paypalSubscriptionID]: subscription.id
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

                // NOTE: this is in cents
                let amountRefunded = 0;

                // if the transaction was refunded or partially
                // refunded then we need to check and update it
                /*
                transaction: '{\n' +
                  '  "status": "REFUNDED",\n' +
                  '  "id": "XXXXXXXXXXXXX",\n' +
                  '  "amount_with_breakdown": {\n' +
                  '    "gross_amount": {\n' +
                  '      "currency_code": "USD",\n' +
                  '      "value": "3.00"\n' +
                  '    },\n' +
                  '    "fee_amount": {\n' +
                  '      "currency_code": "USD",\n' +
                  '      "value": "0.64"\n' +
                  '    },\n' +
                  '    "net_amount": {\n' +
                  '      "currency_code": "USD",\n' +
                  '      "value": "2.36"\n' +
                  '    }\n' +
                  '  },\n' +
                  '  "payer_name": {\n' +
                  '    "given_name": "XXXXXXX",\n' +
                  '    "surname": "XXXXXXX"\n' +
                  '  },\n' +
                  '  "payer_email": "XXXXXXXXXXXXXXXXXX",\n' +
                  '  "time": "2022-01-01T00:00:00.000Z"\n' +
                  '}'
                */
                if (transaction.status === 'REFUNDED') {
                  amountRefunded = amount;
                } else if (transaction.status === 'PARTIALLY_REFUNDED') {
                  // NOTE: we do not support partial refunds right now
                  logger.info('partially refunded', { transaction });
                  // email admins here since we're not supposed to do this
                  emailHelper({
                    template: 'alert',
                    message: {
                      to: config.email.message.from,
                      subject: 'Partial PayPal Subscription Refund Detected'
                    },
                    locals: {
                      message: `We should not be giving partial refunds because our logic does not check for it.  The transaction response was: <pre><code>${JSON.stringify(
                        transaction,
                        null,
                        2
                      )}</code></pre>`
                    }
                  })
                    .then()
                    .catch((err) => logger.error(err));
                }

                if (payment) {
                  let shouldSave = false;

                  if (!payment.paypal_transaction_id) {
                    payment.paypal_transaction_id = transaction.id;
                    shouldSave = true;
                  }

                  // transaction time is different than invoice_at, which is used for plan expiry calculation
                  // (see jobs/fix-missing-invoice-at.js)
                  if (
                    new Date(payment.invoice_at).getTime() ===
                    new Date(payment.created_at).getTime()
                  ) {
                    logger.info(
                      `changing payment.invoice_at ${payment.invoice_at?.toISOString()} to match transaction or subscription`,
                      { subscription, transaction }
                    );
                    // if the payment's invoice_at was equal to created_at
                    // then this is a legacy bug and we need to update it
                    // if the create_time when formatted equals the transaction time
                    // then use that as it's probably when the subscription was started
                    payment.invoice_at =
                      dayjs(new Date(subscription.create_time)).format(
                        'MM/DD/YYYY'
                      ) ===
                      dayjs(new Date(transaction.time)).format('MM/DD/YYYY')
                        ? new Date(subscription.create_time)
                        : dayjs(new Date(transaction.time)).toDate();
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
                    updatedCount++;
                    await payment.save();
                  } else {
                    goodToGoCount++;
                    logger.info(
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
                    amount_refunded: amountRefunded,
                    [config.userFields.paypalSubscriptionID]: subscription.id,
                    paypal_transaction_id: transaction.id,
                    invoice_at: new Date(subscription.create_time)
                  };
                  createdCount++;
                  logger.info('creating new payment');
                  await Payments.create(payment);
                }

                // find and save the associated user
                // so that their plan_expires_at gets updated
                const user = await Users.findById(customer._id);
                if (!user) throw new Error('User does not exist');
                await user.save();
              } catch (err) {
                logger.error(err);
                hasError = true;
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

            await pMapSeries(transactions, transactionMapper);
          }

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
            const user = await Users.findById(customer._id);
            if (!user) throw new Error('User does not exist');
            user[config.userFields.paypalSubscriptionID] = undefined;
            await user.save();
          }
        } catch (err) {
          logger.error(err);

          if (err === thresholdError) throw err;

          if (err.status === 404)
            logger.fatal(new Error('paypal subscription does not exist'), {
              customer
            });
          else {
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

      await pMapSeries(subscriptionIds, subscriptionMapper);
    } catch (err) {
      logger.error(err, { customer });
      if (err === thresholdError) {
        try {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Sync PayPal payment histories hit ${errorThreshold} errors during the script`
            },
            locals: {
              message:
                'This may have occurred because of an error in the script, or the paypal service was down, or another error was causing an abnormal number of payment syncing failures'
            }
          });
        } catch (err) {
          logger.error(err);
        }

        throw err;
      }
    }
  }

  await pMapSeries(paypalCustomers, mapper);

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

(async () => {
  await mongoose.connect();

  // set an amount of errors that causes the script to bail out completely.
  // ex... if errorTolerance = 50, and there are 50 stripe error emails sent, the stripe function will stop looping and
  // send a final email that the script needs work or that the service is down - so as to not flood inboxes with thousands of emails
  // note that the tolerance applies to each payment provider not to the entire script
  try {
    await syncPaypalSubscriptionPayments({ errorThreshold: 5 });
  } catch (err) {
    logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
