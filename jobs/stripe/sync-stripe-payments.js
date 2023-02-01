const os = require('os');

const Stripe = require('stripe');
const isSANB = require('is-string-and-not-blank');
const pReduce = require('p-reduce');
const pMap = require('p-map');
const parseErr = require('parse-err');

const getAllStripePaymentIntents = require('./get-all-stripe-payment-intents');
const env = require('#config/env');
const config = require('#config');
const emailHelper = require('#helpers/email');
const syncStripePaymentIntent = require('#helpers/sync-stripe-payment-intent');
const logger = require('#helpers/logger');
const Users = require('#models/users');
const Payments = require('#models/payments');

const concurrency = os.cpus().length;
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function syncStripePayments() {
  const errorEmails = [];

  const stripeCustomers = await Users.find({
    [config.userFields.stripeCustomerID]: { $exists: true, $ne: null }
  })
    // sort by newest customers first
    .sort('-created_at')
    .lean()
    .exec();

  logger.info(
    `Syncing payments for ${stripeCustomers.length} stripe customers.`
  );

  async function mapper(user) {
    logger.info(
      `Syncing payments for customer ${user.email} ${
        user[config.userFields.stripeCustomerID]
      }`
    );
    // stripe payment_intents are source of truth for stripe payments as one is created
    // for each time a customer is charged for both one-time and subscriptions
    // we go through each successful charge and ensure there is an existing payment and
    // that if there is - all the information is correct with the invoice
    let stripePaymentIntents;
    try {
      stripePaymentIntents = await getAllStripePaymentIntents(
        user[config.userFields.stripeCustomerID]
      );
      logger.info(`syncing ${stripePaymentIntents.length} payment intents`);
    } catch (err) {
      // if we couldn't get the customers payments
      // send an alert and try the next customer
      logger.error(err, { user });
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Problem syncing billing history for ${user.email} - could not retrieve customer payments`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      });

      if (errorEmails.length >= config.stripeErrorThreshold)
        throw new Error('Error threshold has been met');

      return;
    }

    const otherErrorEmails = await pReduce(
      stripePaymentIntents,
      syncStripePaymentIntent(user),
      []
    );

    for (const errorEmail of otherErrorEmails) {
      errorEmails.push(errorEmail);
    }

    // if there were any errors then return early
    if (otherErrorEmails.length > 0) return;

    // after we have finished syncing subscriptions
    // if the subscription itself was cancelled
    // then we need to remove it from our system
    if (isSANB(user[config.userFields.stripeSubscriptionID])) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          user[config.userFields.stripeSubscriptionID]
        );
        // subscription.status is enumerable field and must be one of the following:
        // - incomplete
        // - incomplete_expired
        // - trialing
        // - active
        // - past_due
        // - canceled
        // - unpaid
        if (subscription.status !== 'active') {
          // if the status was not a trial and wasn't cancelled then attempt to cancel it
          if (
            !['trialing', 'canceled', 'cancelled'].includes(subscription.status)
          )
            await stripe.subscriptions.del(
              user[config.userFields.stripeSubscriptionID]
            );

          // remove it from the user's account
          if (subscription.status !== 'trialing') {
            const existingUser = await Users.findById(user._id);
            // eslint-disable-next-line max-depth
            if (!existingUser) throw new Error('User does not exist');
            existingUser[config.userFields.stripeSubscriptionID] = undefined;
            await existingUser.save();
          }
        }
      } catch (err) {
        logger.error(err, { user });
      }
    }

    // check the db to see if there is any payments this script couldn't handle
    // we skip this if we had an error saving above because if we did
    // then this will send a duplicate email for this user
    try {
      const missed = await Payments.find({
        user: user._id,
        method: {
          $nin: ['unknown', 'paypal', 'free_beta_program', 'plan_conversion']
        },
        stripe_payment_intent_id: { $exists: false }
      })
        .lean()
        .exec();

      if (missed.length > 0)
        throw new Error(
          `${user.email} has some stripe payments that were not found and synced, please fix manually.`.concat(
            // eslint-disable-next-line unicorn/no-array-reduce
            missed.reduce(
              (acc, miss) =>
                // eslint-disable-next-line unicorn/prefer-spread
                acc.concat(miss.id + '<br />'),
              'The Payment ids are listed below: <br />'
            )
          )
        );

      const stripePaymentCount = await Payments.countDocuments({
        user: user._id,
        stripe_payment_intent_id: { $exists: true, $ne: null }
      });

      if (
        stripePaymentIntents.filter((pi) => pi.status === 'succeeded')
          .length !== stripePaymentCount
      )
        throw new Error(
          'The number of payment_intents from stripe does not match the number of stripe payments in the db. Please review manually.'
        );
    } catch (err) {
      logger.error(err, { user });
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `${user.email} has stripe payments that were not synced by the sync-payment-histories job`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      });

      if (errorEmails.length >= config.stripeErrorThreshold) {
        logger.info(`Sending ${errorEmails.length} error emails`);
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Sync Stripe payment histories hit ${config.stripeErrorThreshold} errors during the script`
          },
          locals: {
            message:
              'This may have occurred because of an error in the script, or the stripe service was down, or another error was causing an abnormal number of payment syncing failures'
          }
        });

        logger.error(JSON.stringify(errorEmails, null, 2));
        throw new Error('Error threshold has been met');
      }
    }
  }

  await pMap(stripeCustomers, mapper, { concurrency });

  if (errorEmails.length > 0) {
    try {
      await Promise.all(errorEmails.map((email) => emailHelper(email)));
    } catch (err) {
      logger.error(err);
    }
  }

  logger.info('Stripe payments synced successfully');
}

module.exports = syncStripePayments;
