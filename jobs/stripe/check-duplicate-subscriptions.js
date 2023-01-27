const os = require('os');

const Stripe = require('stripe');
const pMap = require('p-map');

const getAllStripeCustomers = require('./get-all-stripe-customers');
const getAllStripePaymentIntents = require('./get-all-stripe-payment-intents');

const env = require('#config/env');
const config = require('#config');
const logger = require('#helpers/logger');
const Users = require('#models/user');
const Payments = require('#models/payment');

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
  });
  if (!user) {
    console.log(`User does not exist for customer ID ${customer.id}`);
    return;
  }

  // if emails did not match
  if (user.email !== customer.email)
    console.log(
      `User email ${user.email} did not match customer email ${customer.email} (${customer.id})`
    );

  // check for payments by customer and ensure that all payments exist on our side
  const paymentIntents = await getAllStripePaymentIntents(customer.id);

  // ensure that all payment intents exist
  const count = await Payments.countDocuments({
    stripe_payment_intent_id: {
      $in: paymentIntents.map((pi) => pi.id)
    }
  });

  if (count !== paymentIntents.length)
    console.log(
      `User had missing payments ${user.email} (${customer.id}) (count: ${count}) (payment intents: ${paymentIntents.length})`
    );

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

  const subscriptions = [...activeSubscriptions, ...trialingSubscriptions];

  if (subscriptions.length > 1) {
    console.log(
      `User had multiple subscriptions ${user.email} (${customer.id})`
    );
  } else if (
    !user[config.userFields.stripeSubscriptionID] ||
    user[config.userFields.stripeSubscriptionID] !== subscriptions[0].id
  ) {
    // if subscription ID was not saved to the user then error
    console.log(
      `User subscription did not match ${user.email} (${customer.id})`
    );
  }

  // TODO: send email here
}

async function checkDuplicateSubscriptions() {
  logger.info('Fetching Stripe customers');
  const customers = await getAllStripeCustomers();
  logger.info(`Started checking ${customers.length} Stripe customers`);
  await pMap(customers, mapper, { concurrency });
  logger.info(`Finished checking ${customers.length} Stripe customers`);
}

module.exports = checkDuplicateSubscriptions;
