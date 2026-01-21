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
const isSANB = require('is-string-and-not-blank');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
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

  if (!isSANB(process.env.DOMAIN_ID)) throw new TypeError('DOMAIN_ID missing');

  if (!isSANB(process.env.NEW_USER_ID))
    throw new TypeError('NEW_USER_ID missing');

  const [domain, user] = await Promise.all([
    Domains.findOne({
      id: process.env.DOMAIN_ID
    }),
    Users.findOne({
      id: process.env.NEW_USER_ID
    })
  ]);

  if (!domain) throw new TypeError('Domain does not exist');
  if (!user) throw new TypeError('User does not exist');

  // replace all members of the domain with the single new user
  domain.members = [
    {
      user: user._id,
      group: 'admin'
    }
  ];

  // Set audit metadata for admin-initiated domain migration
  // (this script is run by admins to migrate domains between users)
  domain.__audit_metadata = {
    isAdmin: true
  };

  await domain.save();

  // update all existing aliases on the domain with the new user
  await Aliases.updateMany(
    {
      domain: domain._id
    },
    {
      $set: {
        user: user._id
      }
    }
  );

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
