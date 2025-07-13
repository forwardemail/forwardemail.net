/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  const domains = await Domains.find({
    plan: { $ne: 'team' }
  })
    .lean()
    .exec();

  //
  // if the domain was on the free plan then
  // check each member and if there is more than one
  // that still exists then error otherwise re-assign aliases and members
  //
  // otherwise if domain was on a paid plan
  // then find the most recent user that is on a paid plan
  //
  for (const domain of domains) {
    if (domain.members.length <= 1) continue;
    const validMembers = [];
    for (const member of domain.members) {
      const user = await Users.findById(member.user).lean().exec();
      if (user[config.userFields.isBanned] || user[config.userFields.isRemoved])
        continue;
      if (domain.plan === 'free') {
        validMembers.push(user);
        continue;
      }

      if (
        domain.plan === user.plan ||
        user.plan === 'team' ||
        user.plan === 'enterprise'
      ) {
        validMembers.push(user);
        continue;
      }
    }

    // if domain is on free plan then delete domain
    if (domain.plan === 'free') {
      await Domains.findByIdAndRemove(domain._id);

      await Aliases.deleteMany({ domain: domain._id });
      continue;
    }

    // re-assign all aliases to the only member here
    // if there is more than one member then throw an error
    const reassignedUser = validMembers.length === 1 ? validMembers[0] : false;

    if (reassignedUser) {
      const aliases = await Aliases.find({
        domain: domain._id,
        user: { $ne: reassignedUser._id }
      }).populate('user', 'email');
      if (aliases.length > 0) {
        for (const alias of aliases) {
          const message = `We have automatically re-assigned ${alias.name}@${
            domain.name
          } from ${alias?.user?.email || '<inactive user>'} to ${
            reassignedUser.email
          } as part of our database integrity cleanup (since your domain is not on a team plan).`;

          await Aliases.findByIdAndUpdate(
            {
              _id: alias._id
            },
            {
              $set: {
                user: reassignedUser._id
              }
            }
          );

          await emailHelper({
            template: 'alert',
            message: {
              to: reassignedUser.email
            },
            locals: { user: reassignedUser, message }
          });
          console.log(message);
        }
      }
    } else {
      console.log(
        'domain %s has more than one valid member',
        domain.name,
        'validMembers',
        validMembers
      );
    }
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
