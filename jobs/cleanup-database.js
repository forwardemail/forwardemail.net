/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const sharedConfig = require('@ladjs/shared-config');
const mongoose = require('mongoose');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { paypalAgent } = require('#helpers/paypal');
const stripe = require('#helpers/stripe');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

const ORPHAN_BATCH_SIZE = 500;

async function deleteOrphans(Model, pipeline, message) {
  const ids = [];
  let deletedCount = 0;
  const cursor = Model.aggregate([
    ...pipeline,
    { $project: { _id: 1 } }
  ]).cursor({ batchSize: ORPHAN_BATCH_SIZE });

  async function flush() {
    if (ids.length === 0) return;
    const result = await Model.deleteMany({ _id: { $in: ids } });
    deletedCount += result.deletedCount;
    ids.length = 0;
  }

  for await (const document of cursor) {
    ids.push(document._id);
    if (ids.length >= ORPHAN_BATCH_SIZE) await flush();
  }

  await flush();
  logger.info(message, { deletedCount });
}

(async () => {
  await setupMongoose(logger);

  try {
    // delete unverified and unpaid users from 30+ days ago
    {
      const results = await Users.deleteMany({
        plan: 'free',
        [config.userFields.isBanned]: {
          $ne: true
        },
        [config.passport.fields.githubProfileID]: {
          $exists: false
        },
        [config.passport.fields.googleProfileID]: {
          $exists: false
        },
        [config.passport.fields.appleProfileID]: {
          $exists: false
        },
        [config.userFields.hasVerifiedEmail]: false,
        created_at: {
          $lte: dayjs().subtract(30, 'days').toDate()
        },
        [config.userFields.verificationPinSentAt]: {
          $exists: true
        }
      });

      logger.info('deleted unverified and unpaid users created 30+ days ago', {
        results
      });
    }

    // Cleanup orphaned records without loading every user or domain ID into
    // application memory or sending multi-megabyte `$nin` predicates.
    const hasUsers = await Users.exists({});
    if (hasUsers) {
      await deleteOrphans(
        Aliases,
        [
          {
            $lookup: {
              from: Users.collection.name,
              localField: 'user',
              foreignField: '_id',
              pipeline: [{ $limit: 1 }, { $project: { _id: 1 } }],
              as: 'existing_users'
            }
          },
          { $match: { existing_users: { $eq: [] } } }
        ],
        'deleted aliases for users that did not exist'
      );

      await deleteOrphans(
        Domains,
        [
          {
            $lookup: {
              from: Users.collection.name,
              localField: 'members.user',
              foreignField: '_id',
              pipeline: [{ $limit: 1 }, { $project: { _id: 1 } }],
              as: 'existing_users'
            }
          },
          { $match: { existing_users: { $eq: [] } } }
        ],
        'deleted domains for users that did not exist'
      );
    }

    const hasDomains = await Domains.exists({});
    if (hasDomains) {
      await deleteOrphans(
        Aliases,
        [
          {
            $lookup: {
              from: Domains.collection.name,
              localField: 'domain',
              foreignField: '_id',
              pipeline: [{ $limit: 1 }, { $project: { _id: 1 } }],
              as: 'existing_domains'
            }
          },
          { $match: { existing_domains: { $eq: [] } } }
        ],
        'deleted aliases for domains that did not exist'
      );
    }

    const bannedUserIdSet = await Users.getBannedUserIdSet(client);

    // cancel subscriptions for banned users
    for (const id of bannedUserIdSet) {
      const user = await Users.findById(id);
      if (!user) continue;
      if (
        !user[config.userFields.paypalSubscriptionID] &&
        !user[config.userFields.stripeSubscriptionID]
      )
        continue;
      // paypal
      if (user[config.userFields.paypalSubscriptionID]) {
        try {
          const agent = await paypalAgent();

          await agent.post(
            `/v1/billing/subscriptions/${
              user[config.userFields.paypalSubscriptionID]
            }/cancel`
          );
        } catch (err) {
          logger.error(err);
        }
      }

      // stripe
      if (user[config.userFields.stripeSubscriptionID]) {
        try {
          await stripe.subscriptions.del(
            user[config.userFields.stripeSubscriptionID]
          );
        } catch (err) {
          logger.error(err);
        }
      }

      // save user
      user[config.userFields.paypalSubscriptionID] = undefined;
      user[config.userFields.stripeSubscriptionID] = undefined;

      await user.save();
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
