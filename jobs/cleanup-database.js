/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const deleteStalePushTokens = require('#helpers/delete-stale-push-tokens');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { paypalAgent } = require('#helpers/paypal');
const stripe = require('#helpers/stripe');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const ORPHAN_BATCH_SIZE = 500;

//
// `field` is what the pipeline's `_id` values are matched against when
// deleting (e.g. the alias `user` ids found missing); the driver deletes
// them as found, since Mongoose would cast them to the schema type (a value
// that is not an ObjectId threw and ended the job)
//
async function deleteOrphans(Model, pipeline, message, field = '_id') {
  const ids = [];
  let deletedCount = 0;
  const cursor = Model.aggregate([
    ...pipeline,
    { $project: { _id: 1 } }
  ]).cursor({ batchSize: ORPHAN_BATCH_SIZE });

  async function flush() {
    if (ids.length === 0) return;
    const result = await Model.collection.deleteMany({
      [field]: { $in: ids }
    });
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

//
// the distinct values of an indexed alias field (`user` or `domain`) that
// have no document in `Model`: the sort and group read one index key per
// value (DISTINCT_SCAN) and look up each value once, where a `$lookup` from
// every alias read all of them (5M+ documents and 5M+ lookups, about four
// minutes of a CPU on the database server each, two every hour)
//
function missingValues(field, Model) {
  return [
    { $sort: { [field]: 1 } },
    { $group: { _id: '$' + field } },
    {
      $lookup: {
        from: Model.collection.name,
        localField: '_id',
        foreignField: '_id',
        pipeline: [{ $project: { _id: 1 } }],
        as: 'existing'
      }
    },
    { $match: { existing: { $eq: [] } } }
  ];
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
        missingValues('user', Users),
        'deleted aliases for users that did not exist',
        'user'
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
        missingValues('domain', Domains),
        'deleted aliases for domains that did not exist',
        'domain'
      );
    }

    // push tokens that are expired, whose alias is gone, or that were
    // registered while someone else owned the alias
    try {
      const results = await deleteStalePushTokens();
      logger.info('deleted stale push tokens', { results });
    } catch (err) {
      logger.error(err);
    }

    // cancel subscriptions for banned users
    // (only the banned users with a subscription: every banned user was
    // loaded, one at a time, every hour, to find the ones with one)
    for await (const user of Users.find({
      [config.userFields.isBanned]: true,
      $or: [
        { [config.userFields.paypalSubscriptionID]: { $nin: [null, ''] } },
        { [config.userFields.stripeSubscriptionID]: { $nin: [null, ''] } }
      ]
    })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
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
})().catch(async (err) => {
  // (otherwise the worker keeps running, holding its job slot, until bree
  // restarts)
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
