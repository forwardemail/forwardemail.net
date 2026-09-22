/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const test = require('ava');

const config = require('#config');
const {
  acquireRekeyLock,
  getRekeyLockKey,
  releaseRekeyLock
} = require('#helpers/rekey-lock');

test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
});

test('the lock of an alias is its own, in this environment', (t) => {
  const a = new mongoose.Types.ObjectId();
  const b = new mongoose.Types.ObjectId();
  t.not(getRekeyLockKey(a), getRekeyLockKey(b));
  // (an ObjectId and its string name the same lock)
  t.is(getRekeyLockKey(a), getRekeyLockKey(a.toString()));
  // (one Redis is shared by environments)
  t.true(getRekeyLockKey(a).includes(config.env));
});

test('acquiring the lock records the operation and never expires', async (t) => {
  const { client } = t.context;
  const aliasId = new mongoose.Types.ObjectId().toString();
  const rekeyId = randomUUID();

  await acquireRekeyLock(client, aliasId, rekeyId);
  t.is(await client.get(getRekeyLockKey(aliasId)), rekeyId);
  // a rotation is only ever settled by its owner or by recovery, never
  // by the clock
  t.is(await client.ttl(getRekeyLockKey(aliasId)), -1);
});

test('releasing the lock is a compare-and-delete on the operation', async (t) => {
  const { client } = t.context;
  const aliasId = new mongoose.Types.ObjectId().toString();
  const rekeyId = randomUUID();
  await acquireRekeyLock(client, aliasId, rekeyId);

  // another operation cannot release it
  await releaseRekeyLock(client, aliasId, randomUUID());
  t.is(await client.get(getRekeyLockKey(aliasId)), rekeyId);

  // a caller without an operation cannot either
  await releaseRekeyLock(client, aliasId);
  t.is(await client.get(getRekeyLockKey(aliasId)), rekeyId);

  // its owner can, once
  await releaseRekeyLock(client, aliasId, rekeyId);
  t.is(await client.get(getRekeyLockKey(aliasId)), null);
  await t.notThrowsAsync(releaseRekeyLock(client, aliasId, rekeyId));

  // and a lock that changed hands meanwhile is left to its new owner
  const newer = randomUUID();
  await acquireRekeyLock(client, aliasId, newer);
  await releaseRekeyLock(client, aliasId, rekeyId);
  t.is(await client.get(getRekeyLockKey(aliasId)), newer);
});
