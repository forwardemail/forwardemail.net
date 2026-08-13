/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

const RELEASE_REKEY_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

function getRekeyLockKey(aliasId) {
  return `rekey_lock:${config.env}:${aliasId}`;
}

async function acquireRekeyLock(client, aliasId, rekeyId) {
  await client.set(getRekeyLockKey(aliasId), rekeyId);
}

async function releaseRekeyLock(client, aliasId, rekeyId) {
  if (!rekeyId) return;
  await client.eval(
    RELEASE_REKEY_LOCK_SCRIPT,
    1,
    getRekeyLockKey(aliasId),
    rekeyId
  );
}

module.exports = {
  acquireRekeyLock,
  getRekeyLockKey,
  releaseRekeyLock
};
