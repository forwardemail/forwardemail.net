// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const { Users, Payments } = require('#models');
const logger = require('#helpers/logger');
const config = require('#config');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

  const ids = await Users.distinct('_id', {});
  const arr = [];

  async function mapper(id) {
    const user = await Users.findById(id).lean().exec();
    if (!user) throw new Error('User does not exist');
    const count1 = await Payments.countDocuments({
      user: user._id,
      invoice_at: {
        // safeguard in case migration didn't run
        // (note we have another issue for setting `planSetAt` in a user pre-validate hook)
        $gte: dayjs(new Date(user[config.userFields.planSetAt])).toDate()
      },
      // payments must match the user's current plan
      plan: user.plan
    });
    const count2 = await Payments.countDocuments({
      user: user._id,
      invoice_at: {
        // safeguard in case migration didn't run
        // (note we have another issue for setting `planSetAt` in a user pre-validate hook)
        $gte: dayjs(new Date(user[config.userFields.planSetAt]))
          // add a buffer due to second differences in historical `plan_set_at`
          // with comparison to Stripe/PayPal API's
          .subtract(1, 'day')
          .toDate()
      },
      // payments must match the user's current plan
      plan: user.plan
    });
    if (count1 !== count2) {
      arr.push(`${user.email} has a difference of ${count2 - count1}`);
    }
  }

  await pMap(ids, mapper, { concurrency });

  logger.info('arr', { arr });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
