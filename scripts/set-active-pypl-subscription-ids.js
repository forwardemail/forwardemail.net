// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const pMap = require('p-map');

const mongoose = require('mongoose');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const { paypalAgent } = require('#helpers/paypal');
const setupMongoose = require('#helpers/setup-mongoose');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

const { PAYPAL_PLAN_MAPPING } = config.payments;
const PAYPAL_PLANS = {
  enhanced_protection: Object.values(PAYPAL_PLAN_MAPPING.enhanced_protection),
  team: Object.values(PAYPAL_PLAN_MAPPING.team)
};

graceful.listen();

async function mapper(id) {
  throw new Error(
    'Cannot use this script because PayPal Payer ID is not unique'
  );

  // first check to see if the subscription ID is already assigned
  // to an active user, and if so, then ignore it
  // eslint-disable-next-line no-unreachable
  const count = await Users.countDocuments({
    [config.userFields.paypalSubscriptionID]: id
  });
  if (count > 1) console.log(`count was > 1 for ${id}`);
  if (count === 1) return;

  console.log(`${id} was missing a user, performing lookups now`);

  // lookup the active subscription details
  const agent = await paypalAgent();
  const { body: subscription } = await agent.get(
    `/v1/billing/subscriptions/${id}`
  );

  // lookup the user by parsed subscription information
  let user = await Users.findOne({
    [config.userFields.paypalPayerID]: subscription.subscriber.payer_id,
    [config.userFields.paypalSubscriptionID]: { $exists: false }
  });

  if (!user)
    user = await Users.findOne({
      email: subscription.subscriber.email_address.toLowerCase(),
      [config.userFields.paypalSubscriptionID]: { $exists: false }
    });

  if (!user) {
    console.log('-------------------------------------------------------');
    console.log(`User could not be found for subscription ID ${id}`);
    console.log('subscription', subscription);
    console.log('-------------------------------------------------------');
    return;
  }

  console.log(`found user ${user.email} for ${id}`);

  // save the subscription ID to the profile
  user[config.userFields.paypalSubscriptionID] = id;
  user[config.userFields.paypalPayerID] = subscription.subscriber.payer_id;

  const plan = Object.keys(PAYPAL_PLANS).find((plan) =>
    PAYPAL_PLANS[plan].includes(subscription.plan_id)
  );

  if (!plan) throw new Error('Plan does not exist');

  if (user.plan !== plan) {
    console.log(`setting user plan from ${user.plan} to ${plan}`);
    user.plan = plan;
  }

  await user.save();

  // create and sync payments
  const errorEmails = await syncPayPalSubscriptionPaymentsByUser([], user);

  if (errorEmails.length > 0) {
    try {
      await Promise.all(errorEmails.map((email) => emailHelper(email)));
    } catch (err) {
      logger.error(err);
    }
  }

  // TODO: we also need to do this for stripe and then also put both this in webhook
}

// TODO: paste in here from report export
// <https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4>
const ids = [];

(async () => {
  await setupMongoose(logger);

  await pMap(ids, mapper, { concurrency });

  process.exit(0);
})();
