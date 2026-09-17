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

const Domains = require('#models/domains');
const Users = require('#models/users');
const logger = require('#helpers/logger');
const { transferDomain } = require('#helpers/transfer-domain');
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

  if (!isSANB(process.env.ORIGINAL_OWNER_ID))
    throw new TypeError('ORIGINAL_OWNER_ID missing');

  if (!isSANB(process.env.NEW_USER_ID))
    throw new TypeError('NEW_USER_ID missing');

  const [sourceUser, user] = await Promise.all([
    Users.findOne({ id: process.env.ORIGINAL_OWNER_ID }),
    Users.findOne({ id: process.env.NEW_USER_ID })
  ]);

  if (!sourceUser) throw new TypeError('Original owner does not exist');
  if (!user) throw new TypeError('New user does not exist');

  const domain = await Domains.findOne({
    id: process.env.DOMAIN_ID,
    members: {
      $elemMatch: { user: sourceUser._id, group: 'admin' }
    }
  });

  if (!domain) {
    throw new TypeError(
      'Domain does not exist or is not owned by ORIGINAL_OWNER_ID'
    );
  }

  const result = await transferDomain({
    domain,
    sourceUser,
    user,
    admin: null
  });

  logger.info('Domain migration completed', {
    domain: domain._id,
    originalOwner: sourceUser._id,
    user: user._id,
    aliasCount: result.aliasCount,
    pendingEmailCount: result.pendingEmailCount,
    sieveScriptCount: result.sieveScriptCount,
    isAdmin: true
  });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
