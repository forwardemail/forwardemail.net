/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The hourly cleanup (jobs/cleanup-database.js) deletes push tokens that are
// past their expiry, whose alias is gone, or that were registered while
// someone else owned the alias, against MongoDB. The collection is set up the
// way production has it: a plain index on `expires_at` (which keeps the TTL
// index from being built), and aliases deleted or reassigned before aliases
// took their tokens with them.
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const PushTokens = require('#models/push-tokens');
const config = require('#config');
const deleteStalePushTokens = require('#helpers/delete-stale-push-tokens');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function createAlias(t) {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();
  return t.context.aliasFactory
    .withState({ user: user._id, domain: domain._id, recipients: [user.email] })
    .create();
}

function createToken(
  alias,
  token,
  expiresAt = dayjs().add(1, 'year').toDate()
) {
  return PushTokens.create({
    alias: alias._id,
    user: alias.user,
    platform: 'apns',
    token,
    device_name: 'Test device',
    expires_at: expiresAt
  });
}

test.serial(
  'deletes expired tokens and tokens whose alias is gone or has another owner',
  async (t) => {
    // production: a plain index holds the name the TTL index needs
    // (after the model's own index build, which can create the collection
    // while this runs, and fails where the plain index is there already;
    // listing the indexes of a collection that does not exist yet fails)
    await PushTokens.init().catch(() => {});
    await PushTokens.createCollection();
    const indexes = await PushTokens.collection.indexes();
    if (indexes.some((index) => index.name === 'expires_at_1'))
      await PushTokens.collection.dropIndex('expires_at_1');
    await PushTokens.collection.createIndex({ expires_at: 1 });

    const alias = await createAlias(t);
    const deletedAlias = await createAlias(t);
    const reassignedAlias = await createAlias(t);
    const newOwner = await createAlias(t);

    const current = await createToken(alias, 'a'.repeat(64));
    const expired = await createToken(
      alias,
      'b'.repeat(64),
      dayjs().subtract(1, 'day').toDate()
    );
    const orphaned = await createToken(deletedAlias, 'c'.repeat(64));
    const previousOwners = await createToken(reassignedAlias, 'd'.repeat(64));

    // an alias deleted, and another given to someone else, without their
    // tokens being deleted (straight in the collection, as any change before
    // aliases took their tokens with them)
    await Aliases.collection.deleteOne({ _id: deletedAlias._id });
    await Aliases.collection.updateOne(
      { _id: reassignedAlias._id },
      { $set: { user: newOwner.user } }
    );
    // (the new owner registers a device of their own afterwards)
    const newOwners = await PushTokens.create({
      alias: reassignedAlias._id,
      user: newOwner.user,
      platform: 'apns',
      token: 'e'.repeat(64),
      device_name: 'Test device',
      expires_at: dayjs().add(1, 'year').toDate()
    });

    t.deepEqual(await deleteStalePushTokens(), {
      expired: 1,
      orphaned: 1,
      reassigned: 1
    });

    t.truthy(await PushTokens.exists({ _id: current._id }));
    t.truthy(await PushTokens.exists({ _id: newOwners._id }));
    t.falsy(await PushTokens.exists({ _id: expired._id }));
    t.falsy(await PushTokens.exists({ _id: orphaned._id }));
    t.falsy(await PushTokens.exists({ _id: previousOwners._id }));

    // a second run finds nothing left to delete
    t.deepEqual(await deleteStalePushTokens(), {
      expired: 0,
      orphaned: 0,
      reassigned: 0
    });
  }
);

test.serial(
  'leaves tokens alone when there are no aliases at all',
  async (t) => {
    const alias = await createAlias(t);
    const token = await createToken(alias, 'f'.repeat(64));
    await Aliases.collection.deleteMany({});

    t.deepEqual(await deleteStalePushTokens(), {
      expired: 0,
      orphaned: 0,
      reassigned: 0
    });
    t.truthy(await PushTokens.exists({ _id: token._id }));
  }
);
