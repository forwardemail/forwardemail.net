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

const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains, Payments } = require('#models');
const config = require('#config');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

(async () => {
  await setupMongoose();

  let owed = 0;
  let predicted = 0;

  const users = await Users.find({
    plan: { $ne: 'free' },
    plan_expires_at: { $lt: new Date() }
  })
    .lean()
    .exec();

  async function mapper(user) {
    let months = dayjs().diff(user[config.userFields.planExpiresAt], 'months');
    const paymentCount = await Payments.countDocuments({ user: user._id });
    if (paymentCount === 0) months -= 12;
    if (months < 0) {
      console.log(`returning early for ${user.email} with ${months}`);
      return;
    }

    const sum = Math.round(months * (user.plan === 'team' ? 9 : 3));
    owed += sum;
    const count = await Domains.countDocuments({
      'members.user': user._id,
      has_mx_record: true,
      has_txt_record: true
    });
    if (count > 0) predicted += sum;
    console.log(
      `${user.email} owes $${sum} for ${months} months past due ${
        count > 0 ? '(predicted)' : ''
      }`
    );
  }

  await pMap(users, mapper, { concurrency });

  console.log('amounts', { owed, predicted });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
