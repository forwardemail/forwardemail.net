/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const Database = require('better-sqlite3-multiple-ciphers');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const getPathToDatabase = require('#helpers/get-path-to-database');
const getRekeyTmpPath = require('#helpers/get-rekey-tmp-path');
const logger = require('#helpers/logger');
const setupPragma = require('#helpers/setup-pragma');
const { acquireRekeyLock, getRekeyLockKey } = require('#helpers/rekey-lock');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { rekey } = require('#helpers/worker');
const {
  REKEY_PROCESSING_LIST,
  REKEY_QUEUE
} = require('#helpers/rekey-recovery');
const {
  getRekeyKey,
  recoverAbandonedRekeys,
  recoverRekeys,
  requeueInterruptedRekeys
} = require('#helpers/recover-rekeys');

const OLD_PASSWORD = 'correct horse battery staple';
const NEW_PASSWORD = 'staple battery horse correct';
const OLD_TOKENS = [{ description: 'old', salt: 'old-salt', hash: 'old-hash' }];
const NEW_TOKENS = [{ description: 'new', salt: 'new-salt', hash: 'new-hash' }];
const STORAGE_LOCATION = 'storage_do_1';

const imapSharedConfig = sharedConfig('IMAP');

test.before(async (t) => {
  await utils.setupMongoose();
  t.context.client = new Redis(imapSharedConfig.redis, logger);
});

test.after.always(async (t) => {
  t.context.client.disconnect();
  await utils.teardownMongoose();
});

test.beforeEach(async (t) => {
  await t.context.client.del(REKEY_QUEUE, REKEY_PROCESSING_LIST);
});

//
// Persist the state a rekey leaves behind, create the live encrypted
// mailbox and build the queue payload (mirrors the controller + worker).
//
async function setupRekey(t, overrides = {}) {
  const aliasId = new mongoose.Types.ObjectId();
  const domainId = new mongoose.Types.ObjectId();
  const rekeyId = randomUUID();

  await Aliases.collection.insertOne({
    _id: aliasId,
    id: aliasId.toString(),
    domain: domainId,
    user: new mongoose.Types.ObjectId(),
    name: 'alias',
    storage_location: STORAGE_LOCATION,
    is_rekey: true,
    tokens: NEW_TOKENS,
    rekey_previous_tokens: OLD_TOKENS,
    rekey_id: rekeyId,
    rekey_started_at: new Date(),
    rekey_processing: false,
    ...overrides
  });

  await acquireRekeyLock(t.context.client, aliasId, rekeyId);

  const storagePath = getPathToDatabase({
    id: aliasId.toString(),
    storage_location: STORAGE_LOCATION
  });

  const session = {
    user: {
      id: aliasId.toString(),
      username: 'alias@example.com',
      alias_id: aliasId.toString(),
      alias_name: 'alias',
      domain_id: domainId.toString(),
      domain_name: 'example.com',
      password: encrypt(OLD_PASSWORD),
      storage_location: STORAGE_LOCATION,
      locale: 'en',
      owner_full_email: 'owner@example.com'
    }
  };

  const db = new Database(storagePath);
  await setupPragma(db, session);
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.exec('CREATE TABLE rekey_test (id INTEGER PRIMARY KEY, value TEXT)');
  const insert = db.prepare('INSERT INTO rekey_test (value) VALUES (?)');
  for (let i = 0; i < 200; i++) insert.run(`message ${i} ${'x'.repeat(100)}`);
  db.close();

  const payload = {
    id: randomUUID(),
    action: 'rekey',
    rekey_id: rekeyId,
    new_password: encrypt(NEW_PASSWORD),
    session
  };
  const payloadStr = JSON.stringify(payload);

  t.teardown(() => {
    for (const suffix of ['', '-wal', '-shm'])
      fs.rmSync(`${storagePath}${suffix}`, { force: true });
    fs.rmSync(getRekeyTmpPath(storagePath, payload), { force: true });
  });

  return { aliasId, rekeyId, storagePath, payload, payloadStr };
}

async function opensWith(storagePath, password) {
  const db = new Database(storagePath, { readonly: true, fileMustExist: true });
  try {
    await setupPragma(db, {
      user: { password: encrypt(password), domain_name: 'example.com' }
    });
    return db.pragma('quick_check', { simple: true }) === 'ok';
  } catch {
    return false;
  } finally {
    db.close();
  }
}

test.serial(
  'a job left in the processing list by a dead worker is run again',
  async (t) => {
    t.timeout(120000);
    const { client } = t.context;
    const { aliasId, rekeyId, storagePath, payload, payloadStr } =
      await setupRekey(t, {
        // the dead worker had claimed the operation and even recorded a swap
        // that never happened (its copy is still lying around)
        rekey_processing: true,
        rekey_claimed_at: new Date(),
        rekey_swap_ino: '1',
        rekey_swapped_at: new Date()
      });
    fs.writeFileSync(getRekeyTmpPath(storagePath, payload), 'partial copy');
    await client.rpush(REKEY_PROCESSING_LIST, payloadStr);

    // a swap recorded moments ago is left alone: the worker that recorded
    // it may be about to rename the copy over the live file
    await recoverRekeys(client, { activeKeys: new Set() });
    t.deepEqual(await client.lrange(REKEY_QUEUE, 0, -1), []);
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), [
      payloadStr
    ]);
    const untouched = await Aliases.collection.findOne({ _id: aliasId });
    t.true(untouched.rekey_processing);

    // once it is clearly not, the job is run again
    await Aliases.collection.updateOne(
      { _id: aliasId },
      { $set: { rekey_swapped_at: new Date(Date.now() - 10 * 60 * 1000) } }
    );
    await recoverRekeys(client, { activeKeys: new Set() });

    // the job is back at the head of the queue and the claim is released
    t.deepEqual(await client.lrange(REKEY_QUEUE, 0, -1), [payloadStr]);
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), []);
    const claimable = await Aliases.collection.findOne({ _id: aliasId });
    t.true(claimable.is_rekey);
    t.false(claimable.rekey_processing);
    t.false('rekey_swap_ino' in claimable);
    t.is(claimable.rekey_id, rekeyId);

    // ... and running it completes the rotation with no user-visible error
    await t.notThrowsAsync(rekey(payload));
    t.true(await opensWith(storagePath, NEW_PASSWORD));
    t.false(await opensWith(storagePath, OLD_PASSWORD));
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    t.is(await client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'a job whose swap already happened is finalized instead of re-run',
  async (t) => {
    t.timeout(120000);
    const { client } = t.context;
    const { aliasId, storagePath, payloadStr } = await setupRekey(t, {
      rekey_processing: true,
      rekey_claimed_at: new Date()
    });
    // the dead worker renamed its rekeyed copy over the live file: simulate
    // by re-encrypting in place and recording the live inode as the swap
    {
      const db = new Database(storagePath);
      await setupPragma(db, {
        user: { password: encrypt(OLD_PASSWORD), domain_name: 'example.com' }
      });
      db.pragma('journal_mode=DELETE');
      db.rekey(Buffer.from(NEW_PASSWORD));
      db.prepare('VACUUM').run();
      db.close();
    }

    const { ino } = fs.statSync(storagePath, { bigint: true });
    await Aliases.collection.updateOne(
      { _id: aliasId },
      { $set: { rekey_swap_ino: ino.toString(), rekey_swapped_at: new Date() } }
    );
    await client.rpush(REKEY_PROCESSING_LIST, payloadStr);

    await recoverRekeys(client, { activeKeys: new Set() });

    t.deepEqual(await client.lrange(REKEY_QUEUE, 0, -1), []);
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), []);
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    t.true(await opensWith(storagePath, NEW_PASSWORD));
    t.is(await client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'jobs of rekeys running in this process and settled jobs are left alone / dropped',
  async (t) => {
    const { client } = t.context;
    const running = await setupRekey(t, {
      rekey_processing: true,
      rekey_claimed_at: new Date()
    });
    await client.rpush(REKEY_PROCESSING_LIST, running.payloadStr);

    // the alias of this job was already settled (rolled back by a controller)
    const settled = await setupRekey(t);
    await Aliases.collection.updateOne(
      { _id: settled.aliasId },
      { $set: { is_rekey: false }, $unset: { rekey_id: 1 } }
    );
    await client.rpush(REKEY_PROCESSING_LIST, settled.payloadStr);

    const activeKeys = new Set([
      getRekeyKey({ rekeyId: running.rekeyId, aliasId: running.aliasId })
    ]);
    await requeueInterruptedRekeys(client, { activeKeys });

    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), [
      running.payloadStr
    ]);
    t.deepEqual(await client.lrange(REKEY_QUEUE, 0, -1), []);
    const alias = await Aliases.collection.findOne({ _id: running.aliasId });
    t.true(alias.is_rekey);
    t.true(alias.rekey_processing);
  }
);

test.serial(
  'a claimed rekey with no job anywhere is settled from the file',
  async (t) => {
    const { client } = t.context;

    // claimed by a worker from before the reliable queue, never swapped
    const lost = await setupRekey(t, {
      rekey_processing: true,
      rekey_claimed_at: new Date(Date.now() - ms('1h'))
    });

    // fresh and unclaimed: the controller may still be queueing it
    const fresh = await setupRekey(t);

    // claimed moments ago with no job: left alone for now
    const freshClaim = await setupRekey(t, {
      rekey_processing: true,
      rekey_claimed_at: new Date()
    });

    // claimed long ago, but a swap was recorded moments ago and the live
    // file does not carry its inode (yet): the rename may still follow
    const swapping = await setupRekey(t, {
      rekey_processing: true,
      rekey_claimed_at: new Date(Date.now() - ms('1h')),
      rekey_swap_ino: '1',
      rekey_swapped_at: new Date()
    });

    // unclaimed, old and its job is gone
    const stale = await setupRekey(t, {
      rekey_started_at: new Date(Date.now() - ms('1h'))
    });

    // unclaimed and old, but its job is still waiting in the queue
    const queued = await setupRekey(t, {
      rekey_started_at: new Date(Date.now() - ms('1h'))
    });
    await client.rpush(REKEY_QUEUE, queued.payloadStr);

    await recoverAbandonedRekeys(client, { activeKeys: new Set() });

    const lostAlias = await Aliases.collection.findOne({ _id: lost.aliasId });
    t.false(lostAlias.is_rekey);
    t.deepEqual(lostAlias.tokens, OLD_TOKENS);
    t.true(await opensWith(lost.storagePath, OLD_PASSWORD));

    const freshAlias = await Aliases.collection.findOne({ _id: fresh.aliasId });
    t.true(freshAlias.is_rekey);

    const freshClaimAlias = await Aliases.collection.findOne({
      _id: freshClaim.aliasId
    });
    t.true(freshClaimAlias.is_rekey);
    t.true(freshClaimAlias.rekey_processing);

    const swappingAlias = await Aliases.collection.findOne({
      _id: swapping.aliasId
    });
    t.true(swappingAlias.is_rekey);
    t.is(swappingAlias.rekey_swap_ino, '1');

    const staleAlias = await Aliases.collection.findOne({ _id: stale.aliasId });
    t.false(staleAlias.is_rekey);
    t.deepEqual(staleAlias.tokens, OLD_TOKENS);

    const queuedAlias = await Aliases.collection.findOne({
      _id: queued.aliasId
    });
    t.true(queuedAlias.is_rekey);
    t.deepEqual(await client.lrange(REKEY_QUEUE, 0, -1), [queued.payloadStr]);
  }
);
