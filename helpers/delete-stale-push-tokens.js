/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');
const PushTokens = require('#models/push-tokens');

const BATCH_SIZE = 500;

//
// Deletes push tokens that should no longer exist (run by
// jobs/cleanup-database.js):
//
//   - tokens past their expiry: the TTL index on `expires_at` cannot be built
//     where an older plain index on the same field holds its name, so expired
//     tokens would otherwise stay
//   - tokens whose alias no longer exists, or that were registered while
//     someone else owned the alias (a token records the alias owner when it
//     is registered or refreshed): aliases deleted or reassigned before
//     app/models/aliases.js cleaned up after them, or by a path its hooks do
//     not cover
//
async function deleteStalePushTokens() {
  const { deletedCount: expired } = await PushTokens.deleteMany({
    expires_at: { $lte: new Date() }
  });

  // (an empty aliases collection means something is wrong with the database,
  // not that every token is stale)
  if (!(await Aliases.exists({})))
    return { expired, orphaned: 0, reassigned: 0 };

  const counts = { orphaned: 0, reassigned: 0 };
  const batch = [];
  async function flush() {
    if (batch.length === 0) return;
    await PushTokens.deleteMany({
      _id: { $in: batch.map((token) => token._id) }
    });
    for (const token of batch)
      counts[token.orphaned ? 'orphaned' : 'reassigned']++;
    batch.length = 0;
  }

  const cursor = PushTokens.aggregate([
    {
      $lookup: {
        from: Aliases.collection.name,
        localField: 'alias',
        foreignField: '_id',
        pipeline: [{ $limit: 1 }, { $project: { _id: 0, user: 1 } }],
        as: 'aliases'
      }
    },
    {
      $match: {
        $expr: {
          $or: [
            { $eq: [{ $size: '$aliases' }, 0] },
            { $ne: [{ $arrayElemAt: ['$aliases.user', 0] }, '$user'] }
          ]
        }
      }
    },
    { $project: { _id: 1, orphaned: { $eq: [{ $size: '$aliases' }, 0] } } }
  ]).cursor({ batchSize: BATCH_SIZE });

  for await (const token of cursor) {
    batch.push(token);
    if (batch.length >= BATCH_SIZE) await flush();
  }

  await flush();

  return { expired, ...counts };
}

module.exports = deleteStalePushTokens;
