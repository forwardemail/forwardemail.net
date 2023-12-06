/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Aliases, Users, Domains } = require('#models');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// new logic will inform users to upgrade
(async () => {
  await setupMongoose(logger);

  const globalDomainIds = await Domains.distinct('_id', {
    is_global: true
  });

  const aliasUsersOnVanityDomains = await Aliases.distinct('user', {
    domain: { $in: globalDomainIds }
  });

  const results = await Users.updateMany(
    {
      plan: 'free',
      [config.userFields.isBanned]: true,
      [config.userFields.hasVerifiedEmail]: true,
      _id: { $in: aliasUsersOnVanityDomains }
    },
    {
      $set: {
        [config.userFields.isBanned]: false
      }
    }
  );

  logger.info('unban results', { results });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
