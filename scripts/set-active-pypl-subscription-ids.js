// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const pMap = require('p-map');

const Users = require('#models/user');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const { paypalAgent } = require('#helpers/paypal');

const breeSharedConfig = sharedConfig('BREE');

const concurrency = os.cpus().length;
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
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
  // first check to see if the subscription ID is already assigned
  // to an active user, and if so, then ignore it
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

  if (user.plan === 'free') {
    const plan = Object.keys(PAYPAL_PLANS).find((plan) =>
      PAYPAL_PLANS[plan].includes(subscription.plan_id)
    );
    console.log(`setting user plan from ${user.plan} to ${plan}`);
    user.plan = plan;
  }

  await user.save();

  // create and sync payments
  const errorEmails = await syncPayPalSubscriptionPaymentsByUser(user);

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
  await mongoose.connect();

  await pMap(ids, mapper, { concurrency });

  process.exit(0);
})();
