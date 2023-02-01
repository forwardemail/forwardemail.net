// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Payments } = require('#models');
const config = require('#config');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');

  // what we need to do is get all payments for this user
  // sorted in reverse order, and iterate over those that match
  const payments = await Payments.find({ user: user._id })
    .sort('-invoice_at')
    .lean()
    .exec();

  if (payments.length === 0) {
    // const count = await Domains.countDocuments({
    //   has_mx_record: true,
    //   'members.user': user._id
    // });
    // if (count > 0)
    //   console.log('user is getting free service', user.email, 'count', count);
    // else console.log('user was beta', user.email);
    return;
  }

  let planSetAt;

  // if the most recent plan is not equal to the user's current, then change it
  if (user.plan !== payments[0].plan) {
    console.log(
      `switching ${user.email} from ${user.plan} to ${payments[0].plan}`
    );
    user.plan = payments[0].plan;
    await user.save();
  }

  // plan set at will be either the last payment here
  // or the last one detected before the `payment.plan` had changed
  for (const payment of payments) {
    if (payment.plan !== user.plan) break;
    planSetAt = payment.invoice_at;
  }

  if (!planSetAt) throw new Error(`No plan set for user ${user.email}`);

  if (planSetAt.getTime() !== user[config.userFields.planSetAt])
    console.log(
      `${user.email}: ${dayjs(user[config.userFields.planSetAt]).format(
        'M/D/YY h:mm:ss A'
      )} -> ${dayjs(planSetAt).format('M/D/YY h:mm:ss A')} `
    );

  user[config.userFields.planSetAt] = planSetAt;
  await user.save();
}

(async () => {
  await setupMongoose(logger);

  const ids = await Users.distinct('_id', {
    plan: { $ne: 'free' }
  });

  await pMap(ids, mapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
