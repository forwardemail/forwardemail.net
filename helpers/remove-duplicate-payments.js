/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Payments for one Stripe payment intent (or PayPal order or transaction)
// must be stored once.  The unique indexes meant to enforce that were never
// built (see `app/models/payments.js`), so concurrent webhooks and syncs
// stored some payments twice.  Each extra copy added another period to the
// user's plan expiry and made every later sync of that payment fail.
//
// `findDuplicates` lists the IDs stored more than once.
// `removeDuplicates` keeps one payment of each ID and deletes the rest.
// `ensureUniqueIndex` replaces the plain index with the unique one.
//

// fields with a unique sparse index on payments
const UNIQUE_FIELDS = [
  'stripe_payment_intent_id',
  'paypal_order_id',
  'paypal_transaction_id'
];

function indexName(field) {
  return `${field}_1`;
}

// every value stored more than once (including null and empty string,
// which a unique sparse index also rejects as duplicates)
async function findDuplicates(Payments, field) {
  if (!UNIQUE_FIELDS.includes(field))
    throw new TypeError(`Unsupported field ${field}`);

  const groups = await Payments.collection
    .aggregate(
      [
        { $match: { [field]: { $exists: true } } },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 },
            ids: { $push: '$_id' },
            users: { $addToSet: '$user' }
          }
        },
        { $match: { count: { $gt: 1 } } },
        { $sort: { _id: 1 } }
      ],
      { allowDiskUse: true }
    )
    .toArray();

  return groups.map((group) => ({
    value: group._id,
    count: group.count,
    ids: group.ids,
    users: group.users
  }));
}

//
// keep one payment of each duplicated value and delete the others
// (the one refunded the most, otherwise the oldest, which is the one the
// user most likely got a receipt for)
//
// `options.onBeforeRemove(extra, keep)` is awaited before each delete
//
// values that are not a non-empty string, or that belong to more than one
// user, are skipped and returned for manual review
//
async function removeDuplicates(Payments, field, options = {}) {
  const { dryRun = false, logger = console } = options;

  const groups = await findDuplicates(Payments, field);

  const result = {
    field,
    groups: groups.length,
    kept: [],
    removed: [],
    skipped: [],
    userIds: []
  };

  const userIds = new Map();

  for (const group of groups) {
    if (typeof group.value !== 'string' || group.value.trim() === '') {
      result.skipped.push({
        value: group.value,
        count: group.count,
        reason: 'value is not a non-empty string'
      });
      continue;
    }

    if (group.users.length !== 1) {
      result.skipped.push({
        value: group.value,
        count: group.count,
        reason: 'payments belong to more than one user'
      });
      continue;
    }

    const payments = await Payments.find({
      _id: { $in: group.ids },
      [field]: group.value
    })
      .sort({ created_at: 1, _id: 1 })
      .lean()
      .exec();

    // (changed since the aggregate ran)
    if (payments.length < 2) continue;

    //
    // a refund was saved to one copy only, so the copy refunded the most
    // is kept, otherwise the oldest
    //
    let keepIndex = 0;
    for (const [i, payment] of payments.entries()) {
      if (
        (payment.amount_refunded || 0) >
        (payments[keepIndex].amount_refunded || 0)
      )
        keepIndex = i;
    }

    const keep = payments[keepIndex];
    const extra = payments.filter((payment, i) => i !== keepIndex);

    if (
      extra.some((payment) => payment.user.toString() !== keep.user.toString())
    ) {
      result.skipped.push({
        value: group.value,
        count: payments.length,
        reason: 'payments belong to more than one user'
      });
      continue;
    }

    logger.info(
      `${dryRun ? '[DRY RUN] ' : ''}${field} ${group.value}: keeping ${
        keep._id
      } (${keep.reference}), removing ${extra
        .map((payment) => `${payment._id} (${payment.reference})`)
        .join(', ')}`
    );

    let removed = extra;
    if (!dryRun) {
      // (e.g. to back up the payments before they are deleted)
      if (typeof options.onBeforeRemove === 'function')
        await options.onBeforeRemove(extra, keep);

      // (deleted by ID and value, so a document changed meanwhile is kept)
      await Payments.deleteMany({
        _id: { $in: extra.map((payment) => payment._id) },
        [field]: group.value
      });

      // (what was actually deleted)
      const left = await Payments.find({
        _id: { $in: extra.map((payment) => payment._id) }
      })
        .select('_id')
        .lean()
        .exec();
      const leftIds = new Set(left.map((payment) => payment._id.toString()));
      removed = extra.filter((payment) => !leftIds.has(payment._id.toString()));
    }

    result.kept.push(keep);
    result.removed.push(...removed);
    userIds.set(keep.user.toString(), keep.user);
  }

  result.userIds = [...userIds.values()];
  return result;
}

//
// replace the plain `<field>_1` index with a unique sparse one
//
// returns one of:
// - "exists"  the unique index is already in place
// - "created" the unique index was built
// - "skipped" duplicates remain, so it can't be built (see `duplicates`)
// - "dry-run" it would be built
//
// if the build fails (e.g. a duplicate was stored in the meantime)
// the plain index is restored and the error is thrown
//
async function ensureUniqueIndex(Payments, field, options = {}) {
  const { dryRun = false, logger = console } = options;

  if (!UNIQUE_FIELDS.includes(field))
    throw new TypeError(`Unsupported field ${field}`);

  const name = indexName(field);
  const indexes = await Payments.collection.indexes();
  const existing = indexes.find((index) => index.name === name);

  if (existing && existing.unique === true) return { status: 'exists' };

  if (
    existing &&
    (Object.keys(existing.key).length !== 1 || existing.key[field] !== 1)
  )
    throw new Error(
      `Index ${name} has an unexpected key ${JSON.stringify(existing.key)}`
    );

  const duplicates = await findDuplicates(Payments, field);
  if (duplicates.length > 0) return { status: 'skipped', duplicates };

  if (dryRun) {
    logger.info(`[DRY RUN] would build unique index ${name}`);
    return { status: 'dry-run' };
  }

  // (same options mongoose uses, so its own index sync is then a no-op)
  if (existing) await Payments.collection.dropIndex(name);

  try {
    await Payments.collection.createIndex(
      { [field]: 1 },
      { name, unique: true, sparse: true, background: true }
    );
  } catch (err) {
    if (existing) {
      try {
        await Payments.collection.createIndex(
          { [field]: 1 },
          { name, background: true }
        );
      } catch (err_) {
        logger.error(err_);
        err.message += ` (restoring the plain index ${name} also failed, so ${field} has no index: ${err_.message})`;
      }
    }

    throw err;
  }

  logger.info(`built unique index ${name}`);
  return { status: 'created' };
}

module.exports = {
  UNIQUE_FIELDS,
  findDuplicates,
  removeDuplicates,
  ensureUniqueIndex
};
