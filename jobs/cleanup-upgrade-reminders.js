/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const sharedConfig = require('@ladjs/shared-config');
const Redis = require('@ladjs/redis');

const mongoose = require('mongoose');
const config = require('#config');
const emailHelper = require('#helpers/email');
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

  try {
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
      const domains = await UpgradeReminders.distinct('domain', {
        pending_recipients: email
      });
      // if the user is not on a paid plan and paid to date
      // then ban the user email and ban all the domains

      const user = await Users.findOne({ email });
      let shouldBan = true;
      let banReason;
      if (user) {
        if (user.plan === 'free') {
          banReason = `Automated ban: ${emails[email]} upgrade reminders across ${domains.length} domains on free plan`;
          user.is_banned = true;
          user[config.userFields.banReason] = banReason;
          await user.save();
        } else if (
          new Date(user[config.userFields.planExpiresAt]) < Date.now()
        ) {
          banReason = `Automated ban: ${emails[email]} upgrade reminders across ${domains.length} domains with expired plan`;
          user.is_banned = true;
          user[config.userFields.banReason] = banReason;
          await user.save();
        } else {
          // don't ban
          shouldBan = false;
        }
      } else {
        banReason = `Automated ban: ${emails[email]} upgrade reminders across ${domains.length} domains (no user account found)`;
      }

      if (shouldBan) {
        logger.info('banning email', email);
        pipeline.set(`denylist:${email}`, 'true');
        for (const domain of domains) {
          logger.info('banning domain', domain);
          pipeline.set(`denylist:${domain}`, 'true');
        }

        emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `Banned for Upgrade Reminder Abuse: ${email}`
          },
          locals: {
            message: `<p><strong>Email:</strong> ${email}</p><p><strong>Ban reason:</strong> ${banReason}</p><p><strong>Domains (${
              domains.length
            }):</strong> ${domains.join(', ')}</p>`
          }
        })
          .then()
          .catch((err) => logger.fatal(err));
      }
    }

    logger.info('executing pipeline');
    await pipeline.exec();

    // clear banned cache
    await client.del('banned_user_ids');

    logger.info(JSON.stringify(emails, null, 2));
  } catch (err) {
    await logger.error(err);
  }

  process.exit(0);
})();
