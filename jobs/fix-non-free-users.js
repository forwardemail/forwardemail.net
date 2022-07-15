// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const { Users, Payments, Domains } = require('#models');
const config = require('#config');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose });
const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');

  // if the user does not have any domains
  // remove any free beta credits and downgrade them to free
  const count = await Domains.countDocuments({
    'members.user': user._id,
    plan: { $ne: 'free' }
  });
  const paymentsCount = await Payments.countDocuments({
    user: user._id,
    method: { $ne: 'free_beta_program' }
  });
  if (count === 0 && paymentsCount === 0) {
    console.log(`setting ${user.email} to free plan`);
    user.plan = 'free';
    await Payments.deleteMany({ user: user._id, method: 'free_beta_program' });
    user[config.userFields.planSetAt] = new Date(user.created_at || Date.now());
    await user.save();
  }
}

(async () => {
  await mongoose.connect();

  const ids = await Users.distinct('_id', {
    plan: { $ne: 'free' }
  });

  await pMap(ids, mapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
