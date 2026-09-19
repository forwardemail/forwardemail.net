/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const { acquireRekeyLock, getRekeyLockKey } = require('#helpers/rekey-lock');
const {
  REKEY_PROCESSING_LIST,
  REKEY_QUEUE,
  finalizeRekey,
  findRekeyJob,
  isRekeyQueued,
  recoverRekey,
  releaseRekeyClaim,
  resolveSwapState,
  rollbackRekey
} = require('#helpers/rekey-recovery');

const OLD_TOKENS = [{ description: 'old', salt: 'old-salt', hash: 'old-hash' }];
const NEW_TOKENS = [{ description: 'new', salt: 'new-salt', hash: 'new-hash' }];

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
});

//
// Insert the raw document a rekey leaves behind while the worker runs
// (validation is irrelevant here, only the update pipelines are exercised)
//
async function insertRekeyingAlias(overrides = {}) {
  const _id = new mongoose.Types.ObjectId();
  const domain = new mongoose.Types.ObjectId();
  const rekeyId = randomUUID();
  await Aliases.collection.insertOne({
    _id,
    id: _id.toString(),
    domain,
    user: new mongoose.Types.ObjectId(),
    name: 'alias',
    is_rekey: true,
    tokens: NEW_TOKENS,
    rekey_previous_tokens: OLD_TOKENS,
    rekey_id: rekeyId,
    rekey_started_at: new Date(),
    rekey_processing: true,
    rekey_claimed_at: new Date(),
    ...overrides
  });
  return { _id, domain, rekeyId };
}

function getAlias(_id) {
  return Aliases.collection.findOne({ _id });
}

function assertStateCleared(t, alias) {
  t.false(alias.is_rekey);
  for (const field of [
    'rekey_started_at',
    'rekey_previous_tokens',
    'rekey_id',
    'rekey_processing',
    'rekey_claimed_at',
    'rekey_swap_ino',
    'rekey_swapped_at'
  ])
    t.false(field in alias, `${field} should be cleared`);
}

test.serial(
  'rollbackRekey restores the token snapshot and releases the lock',
  async (t) => {
    const { client } = t.context;
    const { _id, rekeyId } = await insertRekeyingAlias();
    await acquireRekeyLock(client, _id, rekeyId);

    const result = await rollbackRekey(client, _id, { rekeyId });
    t.truthy(result);

    const alias = await getAlias(_id);
    t.deepEqual(alias.tokens, OLD_TOKENS);
    assertStateCleared(t, alias);
    t.is(await client.get(getRekeyLockKey(_id)), null);

    // a second rollback is a no-op
    t.is(await rollbackRekey(client, _id, { rekeyId }), null);
  }
);

test.serial(
  'rollbackRekey never releases the lock of a newer operation',
  async (t) => {
    const { client } = t.context;
    const { _id, rekeyId } = await insertRekeyingAlias();
    const newerRekeyId = randomUUID();
    await acquireRekeyLock(client, _id, newerRekeyId);

    t.truthy(await rollbackRekey(client, _id, { rekeyId }));
    t.is(await client.get(getRekeyLockKey(_id)), newerRekeyId);
  }
);

test.serial(
  'rollbackRekey keeps the current tokens when the snapshot is empty',
  async (t) => {
    const { client } = t.context;
    const { _id, rekeyId } = await insertRekeyingAlias({
      rekey_previous_tokens: []
    });

    t.truthy(await rollbackRekey(client, _id, { rekeyId }));

    const alias = await getAlias(_id);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    assertStateCleared(t, alias);
  }
);

test.serial(
  'rollbackRekey never restores tokens that cannot validate a password',
  async (t) => {
    const { client } = t.context;
    // a snapshot stripped of its salt and hash (what `toObject()` of a
    // token yields) must not replace the current tokens
    const { _id, rekeyId } = await insertRekeyingAlias({
      rekey_previous_tokens: [
        { description: 'old', has_pbkdf2_migration: false }
      ]
    });

    t.truthy(await rollbackRekey(client, _id, { rekeyId }));

    const alias = await getAlias(_id);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    assertStateCleared(t, alias);
  }
);

test.serial(
  'rollbackRekey restores the tokens a caller passes, even none at all',
  async (t) => {
    const { client } = t.context;
    const { _id, rekeyId } = await insertRekeyingAlias({
      rekey_previous_tokens: []
    });

    // the controller that started a first-password reset holds the
    // pre-rotation set in memory: an alias that had no password gets none
    t.truthy(await rollbackRekey(client, _id, { rekeyId, tokens: [] }));

    const alias = await getAlias(_id);
    t.deepEqual(alias.tokens, []);
    assertStateCleared(t, alias);
  }
);

test.serial(
  'rollbackRekey keeps the current tokens for legacy aliases without a snapshot',
  async (t) => {
    const { client } = t.context;
    const { _id } = await insertRekeyingAlias();
    await Aliases.collection.updateOne(
      { _id },
      {
        $unset: {
          rekey_previous_tokens: 1,
          rekey_id: 1,
          rekey_started_at: 1,
          rekey_processing: 1,
          rekey_claimed_at: 1
        }
      }
    );

    t.truthy(await rollbackRekey(client, _id));

    const alias = await getAlias(_id);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    assertStateCleared(t, alias);
  }
);

test.serial(
  'rollbackRekey is scoped to the operation in the filter',
  async (t) => {
    const { client } = t.context;
    const { _id, domain, rekeyId } = await insertRekeyingAlias();

    t.is(
      await rollbackRekey(client, _id, {
        filter: { domain, rekey_id: randomUUID() },
        rekeyId
      }),
      null
    );
    const untouchedAlias = await getAlias(_id);
    t.true(untouchedAlias.is_rekey);

    t.truthy(
      await rollbackRekey(client, _id, {
        filter: { domain, rekey_id: rekeyId },
        rekeyId
      })
    );
    const rolledBackAlias = await getAlias(_id);
    t.false(rolledBackAlias.is_rekey);
  }
);

test.serial(
  'rollbackRekey refuses to roll back a recorded swap unless allowed',
  async (t) => {
    const { client } = t.context;
    const { _id, rekeyId } = await insertRekeyingAlias({
      rekey_swap_ino: '123456',
      rekey_swapped_at: new Date()
    });

    // the mailbox may already use the new password: restoring the old
    // tokens could lock the user out
    t.is(await rollbackRekey(client, _id, { rekeyId }), null);
    const lockedAlias = await getAlias(_id);
    t.true(lockedAlias.is_rekey);

    // the worker proved the rename never happened and clears the record too
    t.truthy(await rollbackRekey(client, _id, { rekeyId, allowSwapped: true }));
    const alias = await getAlias(_id);
    t.deepEqual(alias.tokens, OLD_TOKENS);
    assertStateCleared(t, alias);
  }
);

test.serial(
  'finalizeRekey keeps the new tokens and releases the lock',
  async (t) => {
    const { client } = t.context;
    const { _id, rekeyId } = await insertRekeyingAlias({
      rekey_swap_ino: '123456',
      rekey_swapped_at: new Date()
    });
    await acquireRekeyLock(client, _id, rekeyId);

    t.truthy(await finalizeRekey(client, _id, { rekeyId }));

    const alias = await getAlias(_id);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    assertStateCleared(t, alias);
    t.is(await client.get(getRekeyLockKey(_id)), null);
    t.is(await finalizeRekey(client, _id, { rekeyId }), null);
  }
);

function loadAlias(_id) {
  return Aliases.findById(_id)
    .select('+rekey_id +rekey_swap_ino +rekey_swapped_at')
    .lean()
    .exec();
}

test.serial('resolveSwapState answers from the inode of the live file', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rekey-recovery-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const live = path.join(dir, 'live.sqlite');
  fs.writeFileSync(live, 'live');
  const { ino } = fs.statSync(live, { bigint: true });

  t.deepEqual(resolveSwapState({ rekey_swap_ino: ino.toString() }, live), {
    swapped: true,
    known: true
  });
  t.deepEqual(resolveSwapState({ rekey_swap_ino: '1' }, live), {
    swapped: false,
    known: true
  });
  t.deepEqual(resolveSwapState({}, live), { swapped: false, known: false });
  // no live file at all: nothing was swapped over it
  t.deepEqual(
    resolveSwapState(
      { rekey_swap_ino: ino.toString(), storage_used: 0 },
      path.join(dir, 'missing.sqlite')
    ),
    { swapped: false, known: true }
  );
  // ... unless the alias is known to hold data: the file is lost or
  // misplaced and neither outcome can be decided
  t.deepEqual(
    resolveSwapState(
      { rekey_swap_ino: ino.toString(), storage_used: 4096 },
      path.join(dir, 'missing.sqlite')
    ),
    { swapped: null, known: false }
  );
});

test.serial(
  'recoverRekey finalizes a rekey whose swap happened and rolls back the rest',
  async (t) => {
    const { client } = t.context;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rekey-recovery-'));
    t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
    const live = path.join(dir, 'live.sqlite');
    fs.writeFileSync(live, 'live');
    const { ino } = fs.statSync(live, { bigint: true });

    // the rename happened (the live file carries the recorded inode)
    const swapped = await insertRekeyingAlias({
      rekey_swap_ino: ino.toString(),
      rekey_swapped_at: new Date()
    });
    t.deepEqual(
      await recoverRekey(client, await loadAlias(swapped._id), {
        storagePath: live
      }),
      { recovered: true, swapped: true }
    );
    const finalizedAlias = await getAlias(swapped._id);
    t.deepEqual(finalizedAlias.tokens, NEW_TOKENS);
    assertStateCleared(t, finalizedAlias);

    // the swap was recorded but the live file is still the old one
    const marked = await insertRekeyingAlias({
      rekey_swap_ino: '1',
      rekey_swapped_at: new Date()
    });
    t.deepEqual(
      await recoverRekey(client, await loadAlias(marked._id), {
        storagePath: live
      }),
      { recovered: true, swapped: false }
    );
    const rolledBackAlias = await getAlias(marked._id);
    t.deepEqual(rolledBackAlias.tokens, OLD_TOKENS);
    assertStateCleared(t, rolledBackAlias);

    // without access to the file a recorded swap is never decided
    const undecidable = await insertRekeyingAlias({
      rekey_swap_ino: ino.toString(),
      rekey_swapped_at: new Date()
    });
    t.deepEqual(await recoverRekey(client, await loadAlias(undecidable._id)), {
      recovered: false,
      swapped: null
    });
    const untouchedAlias = await getAlias(undecidable._id);
    t.true(untouchedAlias.is_rekey);

    // no swap recorded: the previous tokens still open the mailbox
    const interrupted = await insertRekeyingAlias();
    const interruptedAlias = await loadAlias(interrupted._id);
    t.deepEqual(await recoverRekey(client, interruptedAlias), {
      recovered: true,
      swapped: false
    });
    const alias = await getAlias(interrupted._id);
    t.deepEqual(alias.tokens, OLD_TOKENS);
    assertStateCleared(t, alias);

    // already recovered
    t.deepEqual(await recoverRekey(client, interruptedAlias), {
      recovered: false,
      swapped: false
    });
  }
);

test.serial(
  'isRekeyQueued scans the queue and the processing list',
  async (t) => {
    const { client } = t.context;
    const aliasId = new mongoose.Types.ObjectId().toString();
    const rekeyId = randomUUID();
    const job = JSON.stringify({
      action: 'rekey',
      rekey_id: rekeyId,
      session: { user: { alias_id: aliasId } }
    });
    const legacyJob = JSON.stringify({
      action: 'rekey',
      session: { user: { alias_id: aliasId } }
    });

    t.false(await isRekeyQueued(client, { aliasId, rekeyId }));
    t.is(await findRekeyJob(client, { aliasId, rekeyId }), null);

    await client.rpush(REKEY_QUEUE, 'not json', job);
    t.true(await isRekeyQueued(client, { aliasId, rekeyId }));
    // the job itself (with its retry schedule) is available to callers
    t.deepEqual(
      await findRekeyJob(client, { aliasId, rekeyId }),
      JSON.parse(job)
    );
    t.false(await isRekeyQueued(client, { aliasId, rekeyId: randomUUID() }));
    // a legacy rekey (no id) is only matched by a legacy job
    t.false(await isRekeyQueued(client, { aliasId }));

    await client.del(REKEY_QUEUE);
    await client.rpush(REKEY_PROCESSING_LIST, legacyJob);
    t.true(await isRekeyQueued(client, { aliasId }));
    t.false(await isRekeyQueued(client, { aliasId, rekeyId }));
    await client.del(REKEY_PROCESSING_LIST);
  }
);

test.serial(
  'releaseRekeyClaim makes an interrupted rekey claimable again',
  async (t) => {
    const { _id, rekeyId } = await insertRekeyingAlias({
      rekey_swap_ino: '1',
      rekey_swapped_at: new Date()
    });

    t.false(await releaseRekeyClaim(_id, { rekeyId: randomUUID() }));
    t.true(await releaseRekeyClaim(_id, { rekeyId }));

    const alias = await getAlias(_id);
    t.true(alias.is_rekey);
    t.false(alias.rekey_processing);
    t.is(alias.rekey_id, rekeyId);
    for (const field of [
      'rekey_claimed_at',
      'rekey_swap_ino',
      'rekey_swapped_at'
    ])
      t.false(field in alias, `${field} should be cleared`);
    t.deepEqual(alias.tokens, NEW_TOKENS);
  }
);
