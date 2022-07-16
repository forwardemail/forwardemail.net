// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const { Users, Domains } = require('#models');
const config = require('#config');
const logger = require('#helpers/logger');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');

  // return early if user changed to free plan
  if (user.plan === 'free') return;

  // return early if user now has subscription
  if (
    isSANB(user[config.userFields.stripeSubscriptionID]) ||
    isSANB(user[config.userFields.paypalSubscriptionID])
  )
    return;

  // if the user does not have any domains
  // remove any free beta credits and downgrade them to free
  const count = await Domains.countDocuments({
    members: {
      $elemMatch: {
        user: user._id,
        group: 'admin'
      }
    },
    plan: { $ne: 'free' }
  });
  if (
    count === 0 &&
    _.isDate(user[config.userFields.planExpiresAt]) &&
    new Date(user[config.userFields.planExpiresAt]).getTime() < Date.now()
  ) {
    logger.info(`updating ${user.email} to free plan`);
    user.plan = 'free';
    user[config.userFields.planSetAt] = new Date();
    await user.save();
  }
}

(async () => {
  await mongoose.connect();

  const ids = await Users.distinct('_id', {
    plan: { $ne: 'free' },
    [config.userFields.stripeSubscriptionID]: {
      $exists: false
    },
    [config.userFields.paypalSubscriptionID]: {
      $exists: false
    },
    [config.userFields.planExpiresAt]: {
      $exists: true,
      $lt: new Date()
    }
  });

  await pMap(ids, mapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
