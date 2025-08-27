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
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const retryRequest = require('#helpers/retry-request');
const setupMongoose = require('#helpers/setup-mongoose');

monitorServer();

// TODO: re-use existing connection from web
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);
const resolver = createTangerine(client, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const response = await retryRequest(
      'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json',
      { resolver }
    );

    const json = await response.body.json();

    const DISPOSABLE = new Set(json);

    const users = await Users.find({ group: 'user', plan: 'free' })
      .select('_id email')
      .lean()
      .exec();
    const userIds = [];

    for (const user of users) {
      const domain = user.email.split('@')[1];
      if (DISPOSABLE.has(domain)) userIds.push(user._id);
    }

    const partiallyVerifiedDomainUserIds = await Domains.distinct(
      'members.user',
      {
        $or: [
          {
            is_global: false,
            has_mx_record: true
          },
          {
            is_global: false,
            has_txt_record: true
          },
          {
            is_global: false,
            plan: {
              $in: ['enhanced_protection', 'team', 'enterprise']
            }
          }
        ]
      }
    );

    // TODO: we may want to ban or send upgrade notices to users using disposable addresses
    //       that do not have fully verified domain names
    const disposableCount = await Users.count({
      $and: [
        {
          _id: { $in: userIds }
        },
        {
          _id: { $nin: partiallyVerifiedDomainUserIds }
        }
      ]
    });
    logger.info('disposableCount', { disposableCount });

    const globalDomainIds = await Domains.distinct('_id', { is_global: true });

    const aliasCount = await Aliases.count({
      user: { $in: userIds },
      domain: { $in: globalDomainIds }
    });
    logger.info('# of aliases for users with disposable email addresses', {
      aliasCount
    });

    const domainCount = await Domains.count({
      is_global: false,
      has_mx_record: false,
      has_txt_record: false,
      plan: 'free',
      'members.user': { $in: userIds }
    });
    logger.info('# of domains for users with disposable email addresses', {
      domainCount
    });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
