// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const sharedConfig = require('@ladjs/shared-config');
const Redis = require('@ladjs/redis');

const mongoose = require('mongoose');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, UpgradeReminders } = require('#models');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  redisClients: [client],
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  // group together emails by domain count
  const upgradeReminders = await UpgradeReminders.find({}).lean().exec();

  const emails = {};

  for (const upgradeReminder of upgradeReminders) {
    for (const email of upgradeReminder.pending_recipients) {
      if (!emails[email]) emails[email] = 0;
      emails[email] += 1;
    }
  }

  for (const key of Object.keys(emails)) {
    if (emails[key] < 10) delete emails[key];
  }

  // get all the domains for each email
  // and probably should ban them for spam/abuse
  const pipeline = client.pipeline();
  for (const email of Object.keys(emails)) {
    // eslint-disable-next-line no-await-in-loop
    const domains = await UpgradeReminders.distinct('domain', {
      pending_recipients: email
    });
    // if the user is not on a paid plan and paid to date
    // then ban the user email and ban all the domains
    // eslint-disable-next-line no-await-in-loop
    const user = await Users.findOne({ email });
    let shouldBan = true;
    if (user) {
      if (user.plan === 'free') {
        user.is_banned = true;
        // eslint-disable-next-line no-await-in-loop
        await user.save();
      } else if (new Date(user[config.userFields.planExpiresAt]) < Date.now()) {
        user.is_banned = true;
        // eslint-disable-next-line no-await-in-loop
        await user.save();
      } else {
        // don't ban
        shouldBan = false;
      }
    }

    if (shouldBan) {
      console.log('banning email', email);
      pipeline.set(`denylist:${email}`, 'true');
      for (const domain of domains) {
        console.log('banning domain', domain);
        pipeline.set(`denylist:${domain}`, 'true');
      }
    }
  }

  console.log('executing pipeline');
  await pipeline.exec();

  console.log(JSON.stringify(emails, null, 2));

  process.exit(0);
})();
