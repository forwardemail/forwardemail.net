const os = require('os');

const Stripe = require('stripe');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');
const _ = require('lodash');

const getAllStripeCustomers = require('./get-all-stripe-customers');

const env = require('#config/env');
const config = require('#config');
const logger = require('#helpers/logger');
const Users = require('#models/users');
const emailHelper = require('#helpers/email');

const concurrency = os.cpus().length;
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

//
// this gets all customers in stripe
// and ensures that the customer exists in our db
// and it also looks up subscriptions for them
// and if there is more than one active subscription or the subscription isn't stored on our side, then store it
// and it will email admins if any errors occur
//
async function mapper(customer) {
  // check for user on our side
  const user = await Users.findOne({
    [config.userFields.stripeCustomerID]: customer.id
  })
    .lean()
    .exec();

  if (!user) return;

  // if emails did not match
  if (user.email !== customer.email) {
    logger.info(
      `User email ${user.email} did not match customer email ${customer.email} (${customer.id})`
    );
    customer = await stripe.customers.update(customer.id, {
      email: user.email
    });
    logger.info(`Updated user email to match ${user.email}`);
  }

  // check for active subscriptions
  // (if there is more than one than error)
  // (otherwise if there is one then ensure it is set on user object)
  const [activeSubscriptions, trialingSubscriptions] = await Promise.all([
    stripe.subscriptions.list({
      customer: customer.id,
      status: 'active'
    }),
    stripe.subscriptions.list({
      customer: customer.id,
      status: 'trialing'
    })
  ]);

  if (activeSubscriptions.has_more || trialingSubscriptions.has_more)
    throw new Error(
      'Subscriptions has_more bug - this should not have pagination'
    );

  let subscriptions = [
    ...activeSubscriptions.data,
    ...trialingSubscriptions.data
  ];

  if (subscriptions.length > 1) {
    await logger.error(
      new Error(
        `We may need to refund: User had multiple subscriptions ${user.email} (${customer.id})`
      )
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `Customer had multiple subscriptions: ${user.email}`
      },
      locals: {
        message: `<p>Customer may have had duplicate subscription payments and may need some of them refunded.</p>
          <p>Subscriptions are already synced correctly to the latest trial or most recently active.</p>
          <p><a href="https://dashboard.stripe.com/customers/${customer.id}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
      }
    });

    // find the subscription that is trialing
    // and cancel all the other ones
    // otherwise if no trialing then cancel everything but newest
    // save to the user the trialing or newest
    const trialing = subscriptions.find((s) => s.status === 'trialing');
    if (trialing) {
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.stripeSubscriptionID]: trialing.id
        }
      });
      const subscriptionsToCancel = subscriptions.filter(
        (s) => s.id !== trialing.id
      );
      await pMapSeries(subscriptionsToCancel, async (subscription) => {
        await stripe.subscriptions.del(subscription.id);
      });
    } else {
      // sort subscriptions by `created` in reverse (gets newest timestamp first)
      subscriptions = _.sortBy(subscriptions, 'created').reverse();
      const [first, ...others] = subscriptions;
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.stripeSubscriptionID]: first.id
        }
      });
      await pMapSeries(others, async (subscription) => {
        await stripe.subscriptions.del(subscription.id);
      });
    }
  } else if (
    subscriptions.length === 1 &&
    (!user[config.userFields.stripeSubscriptionID] ||
      user[config.userFields.stripeSubscriptionID] !== subscriptions[0].id)
  ) {
    // if subscription ID was not saved to the user then error
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.stripeSubscriptionID]: subscriptions[0].id
      }
    });
  }
}

async function checkDuplicateSubscriptions() {
  logger.info('Fetching Stripe customers');
  const customers = await getAllStripeCustomers();
  logger.info(`Started checking ${customers.length} Stripe customers`);
  await pMap(customers, mapper, { concurrency });
  logger.info(`Finished checking ${customers.length} Stripe customers`);
}

module.exports = checkDuplicateSubscriptions;
