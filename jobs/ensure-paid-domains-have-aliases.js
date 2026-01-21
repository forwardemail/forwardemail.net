/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const os = require('node:os');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const pMap = require('p-map');

const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains, Aliases } = require('#models');

const concurrency = config.env === 'development' ? 1 : os.cpus().length;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // - get all users, go through all their domains
    // - ensure that any domain on paid plan has at least one alias
    // - if count was zero, then make a global catch-all for them
    //
    const ids = await Domains.distinct('_id', {
      plan: { $in: ['enhanced_protection', 'team'] }
    });

    await pMap(
      ids,
      async (_id) => {
        // return early if the job was already cancelled
        if (isCancelled) return;

        const domain = await Domains.findOne({
          _id
        })
          .lean()
          .exec();

        if (!domain) return;

        // find the first admin of the domain
        const member = domain.members.find((m) => m.group === 'admin');

        if (!member) return;

        const user = await Users.findOne({
          _id: member.user,
          plan: { $in: ['enhanced_protection', 'team'] },
          [config.userFields.isBanned]: false,
          [config.userFields.hasVerifiedEmail]: true,
          [config.userFields.paymentReminderTerminationNoticeSentAt]: {
            $exists: false
          }
        });

        if (!user) return;

        const count = await Aliases.countDocuments({
          domain: domain._id
        });

        if (count === 0) {
          logger.info(`${domain.name} had zero aliases`, { domain });
          // const alias = await Aliases.create({
          //   is_api: true,
          //   user: user._id,
          //   domain: domain._id,
          //   name: '*',
          //   recipients: [user.email],
          //   locale: user[config.lastLocaleField],
          //   has_recipient_verification: domain.has_recipient_verification
          // });
          // emails.push();
          // // TODO: email the user
          // // (e.g. we noticed that your domain didn't have any aliases created - which may have been by accident)
          // // (in any case, we created a catch-all for you, and set it's forwarding address to $email)
          // // if you wish to disable this alias, then go to your domains page, click on aliases, and uncheck the checkbox for "Enabled"
          // logger.info('created alias', { alias, domain });
        }
      },
      { concurrency }
    );
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
