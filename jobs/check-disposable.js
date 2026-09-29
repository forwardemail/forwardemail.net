/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

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
const env = require('#config/env');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');
const setupMongoose = require('#helpers/setup-mongoose');

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
      {
        resolver,
        headers: {
          'User-Agent': 'ForwardEmail/1.0',
          ...(env.GITHUB_OCTOKIT_TOKEN
            ? { Authorization: `Bearer ${env.GITHUB_OCTOKIT_TOKEN}` }
            : {})
        }
      }
    );

    const json = await response.body.json();

    const DISPOSABLE = new Set(json);

    //
    // Read free users from a cursor and keep only the ids of those with a
    // disposable address (loading every free user first held all of them)
    //
    const userIds = [];
    for await (const user of Users.find({ group: 'user', plan: 'free' })
      .select('_id email')
      .lean()
      .cursor({ batchSize: 1000 })
      .addCursorFlag('noCursorTimeout', true)) {
      const domain = user.email.split('@')[1];
      if (DISPOSABLE.has(domain)) userIds.push(user._id);
    }

    //
    // Count in chunks of users: a `$nin` of every member of every partially
    // verified domain (most of the domains) was larger than a query can be,
    // and fetching those member ids held them all in memory
    //
    const CHUNK_SIZE = 1000;
    const globalDomainIds = await Domains.distinct('_id', { is_global: true });
    let disposableCount = 0;
    let aliasCount = 0;
    // a domain can have members in more than one chunk, so count each once
    const domainIds = new Set();

    for (let i = 0; i < userIds.length; i += CHUNK_SIZE) {
      const chunk = userIds.slice(i, i + CHUNK_SIZE);

      const partiallyVerifiedDomainUserIds = await Domains.distinct(
        'members.user',
        {
          'members.user': { $in: chunk },
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
                $in: ['enhanced_protection', 'team']
              }
            }
          ]
        }
      );

      // TODO: we may want to ban or send upgrade notices to users using disposable addresses
      //       that do not have fully verified domain names
      const [chunkDisposableCount, chunkAliasCount, chunkDomainIds] =
        await Promise.all([
          Users.countDocuments({
            $and: [
              {
                _id: { $in: chunk }
              },
              {
                _id: { $nin: partiallyVerifiedDomainUserIds }
              }
            ]
          }),
          Aliases.countDocuments({
            user: { $in: chunk },
            domain: { $in: globalDomainIds }
          }),
          Domains.distinct('_id', {
            is_global: false,
            has_mx_record: false,
            has_txt_record: false,
            plan: 'free',
            'members.user': { $in: chunk }
          })
        ]);

      disposableCount += chunkDisposableCount;
      aliasCount += chunkAliasCount;
      for (const id of chunkDomainIds) domainIds.add(id.toString());
    }

    const domainCount = domainIds.size;

    logger.info('disposableCount', { disposableCount });
    logger.info('# of aliases for users with disposable email addresses', {
      aliasCount
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
