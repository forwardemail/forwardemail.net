// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const sharedConfig = require('@ladjs/shared-config');

const { Users, Domains } = require('#models');
const config = require('#config');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose });
const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

(async () => {
  await mongoose.connect();

  let owed = 0;
  let predicted = 0;

  const users = await Users.find({
    plan: { $ne: 'free' },
    plan_expires_at: { $lt: new Date() }
  })
    .lean()
    .exec();

  for (const user of users) {
    const months = dayjs().diff(
      user[config.userFields.planExpiresAt],
      'months'
    );
    const sum = Math.round(months * (user.plan === 'team' ? 9 : 3));
    owed += sum;
    // eslint-disable-next-line no-await-in-loop
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

  console.log('amounts', { owed, predicted });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
