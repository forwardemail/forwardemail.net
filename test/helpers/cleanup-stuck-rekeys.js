/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The scheduled backstop for rotations the sqlite-worker did not settle
// (jobs/cleanup-stuck-rekeys.js), against MongoDB and the rekey queue: a
// rotation that is certainly lost is rolled back (the previous password
// works again and the owner is told), a rotation the worker is handling or
// may still handle is left alone, and a recorded file swap is never decided
// here (only the worker can) -- the admins are alerted instead.
//

// the emails the backstop sends are captured (the module is wrapped before
// anything binds to it)
const sentEmails = [];
const emailModulePath = require.resolve('#helpers/email');
const emailHelper = require(emailModulePath);
require.cache[emailModulePath].exports = (data) => {
  sentEmails.push(data);
  return emailHelper(data);
};

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const striptags = require('striptags');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const cleanupStuckRekeys = require('#helpers/cleanup-stuck-rekeys');
const config = require('#config');
const i18n = require('#helpers/i18n');
const { REKEY_QUEUE } = require('#helpers/rekey-recovery');
const { acquireRekeyLock, getRekeyLockKey } = require('#helpers/rekey-lock');
const {
  REKEY_PROCESSING_STALE_THRESHOLD,
  REKEY_QUEUED_MAX_AGE,
  REKEY_STALE_THRESHOLD
} = require('#helpers/sqlite-worker-config');

const OLD_TOKENS = [{ description: 'old', salt: 'old-salt', hash: 'old-hash' }];
const NEW_TOKENS = [{ description: 'new', salt: 'new-salt', hash: 'new-hash' }];

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
  sentEmails.length = 0;
});
test.afterEach.always((t) => {
  t.context.client.disconnect();
});

// an alias of a real owner, in the middle of a rotation
async function createRekeyingAlias(t, state = {}) {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true
    })
    .create();

  const _id = new mongoose.Types.ObjectId();
  const rekeyId = randomUUID();
  await Aliases.collection.insertOne({
    _id,
    id: _id.toString(),
    domain: domain._id,
    user: user._id,
    name: 'rotating',
    is_rekey: true,
    tokens: NEW_TOKENS,
    rekey_previous_tokens: OLD_TOKENS,
    rekey_id: rekeyId,
    rekey_started_at: new Date(),
    rekey_processing: false,
    ...state
  });
  await acquireRekeyLock(t.context.client, _id, rekeyId);
  // (the backstop sweeps every rotation in progress)
  t.teardown(() => Aliases.collection.deleteOne({ _id }));

  return { _id, rekeyId, user, domain, username: `rotating@${domain.name}` };
}

function getAlias(_id) {
  return Aliases.collection.findOne({ _id });
}

function queueJob(client, { _id, rekeyId }, extra = {}) {
  return client.rpush(
    REKEY_QUEUE,
    JSON.stringify({
      action: 'rekey',
      rekey_id: rekeyId,
      session: { user: { alias_id: _id.toString() } },
      ...extra
    })
  );
}

async function assertUntouched(t, { _id, rekeyId }) {
  const alias = await getAlias(_id);
  t.true(alias.is_rekey);
  t.is(alias.rekey_id, rekeyId);
  t.like(alias.tokens[0], NEW_TOKENS[0]);
  t.is(await t.context.client.get(getRekeyLockKey(_id)), rekeyId);
}

async function assertRolledBack(t, { _id, user, username }) {
  const alias = await getAlias(_id);
  t.false(alias.is_rekey);
  t.is(alias.tokens.length, 1);
  t.like(alias.tokens[0], OLD_TOKENS[0]);
  for (const field of [
    'rekey_id',
    'rekey_previous_tokens',
    'rekey_started_at',
    'rekey_processing',
    'rekey_claimed_at',
    'rekey_swap_ino',
    'rekey_swapped_at'
  ])
    t.false(field in alias, `${field} should be cleared`);
  t.is(await t.context.client.get(getRekeyLockKey(_id)), null);

  // the owner is told, in their language, that the rotation did not go
  // through
  const notice = sentEmails.find((data) => data.message.to === user.email);
  t.truthy(notice);
  t.is(
    notice.message.subject,
    striptags(
      i18n.translate(
        'ALIAS_REKEY_INTERRUPTED_SUBJECT',
        notice.locals.locale,
        username
      )
    )
  );
  t.true(notice.locals.message.includes(username));
}

test.serial(
  'a rotation that was never claimed and whose job is gone is rolled back once it is stale',
  async (t) => {
    const { client } = t.context;
    const alias = await createRekeyingAlias(t);
    const startedAt = Date.now();

    // too young to be called lost
    t.deepEqual(
      await cleanupStuckRekeys(client, {
        now: startedAt + REKEY_STALE_THRESHOLD - ms('1m')
      }),
      { cleared: 0, alerted: 0 }
    );
    await assertUntouched(t, alias);

    t.deepEqual(
      await cleanupStuckRekeys(client, {
        now: startedAt + REKEY_STALE_THRESHOLD + ms('1m')
      }),
      { cleared: 1, alerted: 0 }
    );
    await assertRolledBack(t, alias);

    // settled: nothing to do any more
    t.deepEqual(
      await cleanupStuckRekeys(client, {
        now: startedAt + REKEY_STALE_THRESHOLD + ms('2m')
      }),
      { cleared: 0, alerted: 0 }
    );
  }
);

test.serial('a queued rotation is left to the worker', async (t) => {
  const { client } = t.context;
  const alias = await createRekeyingAlias(t);
  const startedAt = Date.now();
  await queueJob(client, alias);

  // well past the point where an unqueued one would be lost
  t.deepEqual(
    await cleanupStuckRekeys(client, {
      now: startedAt + REKEY_QUEUED_MAX_AGE - ms('1m')
    }),
    { cleared: 0, alerted: 0 }
  );
  await assertUntouched(t, alias);

  // ... until it has waited longer than the worker's complete retry schedule
  t.deepEqual(
    await cleanupStuckRekeys(client, {
      now: startedAt + REKEY_QUEUED_MAX_AGE + ms('1m')
    }),
    { cleared: 1, alerted: 0 }
  );
  await assertRolledBack(t, alias);
});

test.serial(
  'a rotation waiting out the backoff of a transient error is not stuck',
  async (t) => {
    const { client } = t.context;
    const alias = await createRekeyingAlias(t);
    const startedAt = Date.now();
    const now = startedAt + REKEY_QUEUED_MAX_AGE + ms('1h');
    await queueJob(client, alias, {
      rekey_attempts: 3,
      rekey_not_before: now + ms('10m')
    });

    t.deepEqual(await cleanupStuckRekeys(client, { now }), {
      cleared: 0,
      alerted: 0
    });
    await assertUntouched(t, alias);
  }
);

test.serial(
  'a rotation the worker claimed is left alone until it is very old',
  async (t) => {
    const { client } = t.context;
    const claimedAt = new Date();
    const alias = await createRekeyingAlias(t, {
      rekey_processing: true,
      rekey_claimed_at: claimedAt
    });

    t.deepEqual(
      await cleanupStuckRekeys(client, {
        now: claimedAt.getTime() + REKEY_PROCESSING_STALE_THRESHOLD - ms('1m')
      }),
      { cleared: 0, alerted: 0 }
    );
    await assertUntouched(t, alias);

    t.deepEqual(
      await cleanupStuckRekeys(client, {
        now: claimedAt.getTime() + REKEY_PROCESSING_STALE_THRESHOLD + ms('1m')
      }),
      { cleared: 1, alerted: 0 }
    );
    await assertRolledBack(t, alias);
  }
);

test.serial(
  'a recorded file swap is never decided here: the admins are alerted instead',
  async (t) => {
    const { client } = t.context;
    const swappedAt = new Date();
    const alias = await createRekeyingAlias(t, {
      rekey_processing: true,
      rekey_claimed_at: swappedAt,
      rekey_swap_ino: '123456',
      rekey_swapped_at: swappedAt
    });

    // a swap that was just recorded is about to be finalized by the worker
    t.deepEqual(
      await cleanupStuckRekeys(client, {
        now: swappedAt.getTime() + ms('1m')
      }),
      { cleared: 0, alerted: 0 }
    );
    await assertUntouched(t, alias);
    t.is(sentEmails.length, 0);

    // one left alone for a day is alerted about, once a day, and still
    // never rolled back
    const late = swappedAt.getTime() + REKEY_PROCESSING_STALE_THRESHOLD;
    t.deepEqual(await cleanupStuckRekeys(client, { now: late }), {
      cleared: 0,
      alerted: 1
    });
    await assertUntouched(t, alias);
    const alert = sentEmails.find(
      (data) =>
        data.message.to === config.alertsEmail &&
        data.message.subject.includes(alias.username)
    );
    t.truthy(alert);
    t.true(alert.locals.message.includes(alias.rekeyId));

    t.deepEqual(await cleanupStuckRekeys(client, { now: late + ms('1h') }), {
      cleared: 0,
      alerted: 0
    });
    await assertUntouched(t, alias);
  }
);
