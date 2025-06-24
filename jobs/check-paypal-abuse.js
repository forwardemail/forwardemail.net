/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('p-map');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const setupMongoose = require('#helpers/setup-mongoose');
const Users = require('#models/users');
const Domains = require('#models/domains');

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const paypalPayerIds = await Users.distinct('paypal_payer_id', {
      [config.userFields.isBanned]: false,
      plan: { $in: ['enhanced_protection', 'team'] },
      has_passed_kyc: false
    });

    const ids = [];

    await pMap(
      paypalPayerIds,
      async (id) => {
        const users = await Users.find({
          paypal_payer_id: id,
          [config.userFields.isBanned]: false,
          plan: { $in: ['enhanced_protection', 'team'] },
          has_passed_kyc: false
        })
          .lean()
          .exec();

        if (users.length === 1) return;

        // if the user had zero domains with has_txt_record then ban
        // or if their account is more than 3 months past due
        for (const user of users) {
          if (
            dayjs(user[config.userFields.planExpiresAt]).isBefore(
              dayjs().subtract(3, 'months')
            )
          ) {
            console.log(
              user.email,
              'banning user because plan expired more than 3 months ago',
              dayjs(user[config.userFields.planExpiresAt]).format('M/D/YYYY')
            );
          } else {
            // eslint-disable-next-line no-await-in-loop
            const verifiedDomains = await Domains.countDocuments({
              members: {
                $elemMatch: {
                  user: user._id,
                  group: 'admin'
                }
              },
              has_txt_record: true
            });
            if (verifiedDomains.length === 0) {
              console.log(
                user.email,
                'banning user because zero verified domains'
              );
            }
          }
        }

        console.log(
          id,
          `had ${users.length} email addresses`,
          users.map((u) => u.email)
        );
      },
      { concurrency: config.concurrency }
    );

    if (ids.length > 0) {
      logger.info(`found ${ids.length} users`);
      await emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `💳 Possible PayPal Payer ID Abuse (${ids.length})`
        },
        locals: {
          message: `<ul><li>${ids.join('</li><li>')}</li></ul>`
        }
      });
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
