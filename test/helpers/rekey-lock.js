/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const source = fs.readFileSync(
  path.join(__dirname, '../../helpers/rekey-lock.js'),
  'utf8'
);

test('rekey lock is environment- and alias-scoped', (t) => {
  t.regex(
    source,
    /function getRekeyLockKey\(aliasId\)\s*{\s*return `rekey_lock:\${config\.env}:\${aliasId}`/s
  );
});

test('rekey lock acquisition records the operation ID without a TTL', (t) => {
  const start = source.indexOf('async function acquireRekeyLock');
  const end = source.indexOf('async function releaseRekeyLock', start);
  const acquireSource = source.slice(start, end);

  t.regex(acquireSource, /client\.set\(getRekeyLockKey\(aliasId\), rekeyId\)/);
  t.notRegex(acquireSource, /'PX'/);
});

test('rekey lock release uses compare-and-delete semantics', (t) => {
  t.true(source.includes("redis.call('get', KEYS[1]) == ARGV[1]"));
  t.true(source.includes("redis.call('del', KEYS[1])"));
  t.true(source.includes('if (!rekeyId) return;'));
  t.true(source.includes('RELEASE_REKEY_LOCK_SCRIPT'));
});
