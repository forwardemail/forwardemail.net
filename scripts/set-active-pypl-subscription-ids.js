// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const pMap = require('p-map');

const config = require('#config');
const logger = require('#helpers/logger');
const { paypalAgent } = require('#helpers/paypal');

const Users = require('#models/user');

const breeSharedConfig = sharedConfig('BREE');

const concurrency = os.cpus().length;
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  // first check to see if the subscription ID is already assigned
  // to an active user, and if so, then ignore it
  const count = await Users.countDocuments({
    [config.userFields.paypalSubscriptionID]: id
  });
  if (count > 1) console.log(`count was > 1 for ${id}`);
  if (count === 1) return;
  console.log(`${id} was missing a user`);
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
  await user.save();
  console.log('saved user');
}

const ids = [
  // TODO: paste in here from report export
];

(async () => {
  await mongoose.connect();

  await pMap(ids, mapper, { concurrency });

  process.exit(0);
})();
