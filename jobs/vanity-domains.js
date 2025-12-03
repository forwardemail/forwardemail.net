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
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const mongoose = require('mongoose');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const config = require('#config');

const Users = require('#models/users');
const Domains = require('#models/domains');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    // get all admins
    const admins = await Users.find({
      group: 'admin'
    })
      .lean()
      .exec();
    if (admins.length === 0) {
      logger.info('No admins exist yet');
      return;
    }

    // go through all config.vanityDomains and create them assigned to admin
    await Promise.all(
      config.vanityDomains.map(async (vanityDomain) => {
        const domain = await Domains.findOne({
          name: vanityDomain
        });
        if (domain) {
          if (!domain.is_global) {
            domain.is_global = true;
            domain.skip_verification = true;
            await domain.save();
          }

          if (!domain.plan !== 'team') {
            domain.plan = 'team';
            domain.skip_verification = true;
            await domain.save();
          }

          return;
        }

        await Domains.create({
          name: vanityDomain,
          plan: 'team',
          members: admins.map((admin) => ({
            user: admin._id,
            group: 'admin'
          })),
          is_global: true,
          client
        });
      })
    );
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
