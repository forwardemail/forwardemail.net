/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Module = require('node:module');

const test = require('ava');

// Inline stubs so we don't need real SQLite connections or logger
const closedDbs = [];

const closeDatabaseStub = async function (db) {
  if (db && db._id) closedDbs.push(db._id);
  if (db) db.open = false;
  return true;
};

closeDatabaseStub.closedDbs = closedDbs;

const loggerStub = {
  debug() {},
  info() {},
  warn() {},
  error() {},
  fatal() {}
};

const envStub = {
  DATABASE_MAP_MAX_SIZE: '500'
};

// Override module resolution to inject stubs
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request === '#helpers/close-database') {
    return 'close-database-stub';
  }

  if (request === '#helpers/logger') {
    return 'logger-stub';
  }

  if (request === '#config/env') {
    return 'env-stub';
  }

  return originalResolveFilename.call(this, request, ...args);
};

// Patch require cache with our inline stubs
require.cache['close-database-stub'] = {
  id: 'close-database-stub',
  filename: 'close-database-stub',
  loaded: true,
  exports: closeDatabaseStub
};
require.cache['logger-stub'] = {
  id: 'logger-stub',
  filename: 'logger-stub',
  loaded: true,
  exports: loggerStub
};
require.cache['env-stub'] = {
  id: 'env-stub',
  filename: 'env-stub',
  loaded: true,
  exports: envStub
};

const DatabaseLRUMap = require('../../helpers/database-lru-map');

function createMockDb(id) {
  return { _id: id, open: true, inTransaction: false };
}

test.afterEach(() => {
  closedDbs.length = 0;
});

test('constructor uses default maxSize of 500', (t) => {
  const map = new DatabaseLRUMap();
  t.is(map.maxSize, 500);
  map.destroy();
});

test('constructor accepts custom options', (t) => {
  const map = new DatabaseLRUMap({
    maxSize: 100,
    activeIdleTTL: 10_000,
    inactiveIdleTTL: 5000,
    batchEvictPercent: 0.2
  });
  t.is(map.maxSize, 100);
  t.is(map.activeIdleTTL, 10_000);
  t.is(map.inactiveIdleTTL, 5000);
  t.is(map.batchEvictPercent, 0.2);
  map.destroy();
});

test('get/set/has/delete basic operations', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  const db = createMockDb('alias1');

  t.false(map.has('alias1'));
  map.set('alias1', db);
  t.true(map.has('alias1'));
  t.is(map.get('alias1'), db);
  t.is(map.size, 1);

  map.delete('alias1');
  t.false(map.has('alias1'));
  t.is(map.size, 0);
  map.destroy();
});

test('get returns undefined for missing keys', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.is(map.get('nonexistent'), undefined);
  map.destroy();
});

test('set updates existing entry without increasing size', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  const db1 = createMockDb('alias1');
  const db2 = createMockDb('alias1-v2');

  map.set('alias1', db1);
  t.is(map.size, 1);
  map.set('alias1', db2);
  t.is(map.size, 1);
  t.is(map.get('alias1'), db2);
  map.destroy();
});

test('batch eviction triggers when map reaches maxSize', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10, batchEvictPercent: 0.1 });

  // Fill to capacity
  for (let i = 0; i < 10; i++) {
    map.set(`alias${i}`, createMockDb(`alias${i}`));
  }

  t.is(map.size, 10);

  // Adding one more should trigger batch eviction (10% = 1 entry)
  map.set('alias_new', createMockDb('alias_new'));

  // After eviction of 1 + adding 1, size should be 10
  t.true(map.size <= 10);
  t.true(map.has('alias_new'));
  map.destroy();
});

test('batch eviction evicts LRU entries first', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 5, batchEvictPercent: 0.4 });

  // Add 5 entries
  map.set('oldest', createMockDb('oldest'));
  map.set('old', createMockDb('old'));
  map.set('mid', createMockDb('mid'));
  map.set('recent', createMockDb('recent'));
  map.set('newest', createMockDb('newest'));

  // Touch the newer ones to update lastAccess
  map.get('newest');
  map.get('recent');

  // Adding one more triggers eviction of 40% = 2 entries (oldest first)
  map.set('brand_new', createMockDb('brand_new'));

  t.true(map.has('brand_new'));
  t.true(map.has('newest'));
  t.true(map.has('recent'));
  // oldest and old should have been evicted
  t.false(map.has('oldest'));
  t.false(map.has('old'));
  map.destroy();
});

test('batch eviction prefers entries without active sessions', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 5, batchEvictPercent: 0.4 });

  map.set('a', createMockDb('a'));
  map.set('b', createMockDb('b'));
  map.set('c', createMockDb('c'));
  map.set('d', createMockDb('d'));
  map.set('e', createMockDb('e'));

  // Mark 'a' (oldest) as having an active session
  map.addActiveSession('a');

  // Trigger eviction
  map.set('f', createMockDb('f'));

  // 'a' should survive because it has an active session
  t.true(map.has('a'));
  t.true(map.has('f'));
  map.destroy();
});

test('batch eviction skips in-transaction databases', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 5, batchEvictPercent: 0.4 });

  const txDb = createMockDb('tx');
  txDb.inTransaction = true;

  map.set('tx', txDb);
  map.set('b', createMockDb('b'));
  map.set('c', createMockDb('c'));
  map.set('d', createMockDb('d'));
  map.set('e', createMockDb('e'));

  // Trigger eviction
  map.set('f', createMockDb('f'));

  // 'tx' should survive because it's in a transaction
  t.true(map.has('tx'));
  map.destroy();
});

test('active session tracking: add/remove/has', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });

  t.false(map.hasActiveSession('alias1'));

  map.addActiveSession('alias1');
  t.true(map.hasActiveSession('alias1'));

  map.addActiveSession('alias1'); // refcount = 2
  t.true(map.hasActiveSession('alias1'));

  map.removeActiveSession('alias1'); // refcount = 1
  t.true(map.hasActiveSession('alias1'));

  map.removeActiveSession('alias1'); // refcount = 0
  t.false(map.hasActiveSession('alias1'));

  // Removing below zero is safe
  map.removeActiveSession('alias1');
  t.false(map.hasActiveSession('alias1'));
  map.destroy();
});

test('idle sweep evicts inactive databases past TTL', async (t) => {
  const map = new DatabaseLRUMap({
    maxSize: 10,
    inactiveIdleTTL: 50, // 50ms for testing
    activeIdleTTL: 5000
  });

  map.set('idle1', createMockDb('idle1'));
  map.set('idle2', createMockDb('idle2'));

  // Wait for the TTL to expire
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  // Manually trigger sweep
  map._sweepIdle();

  t.is(map.size, 0);
  map.destroy();
});

test('idle sweep preserves databases with active sessions using longer TTL', async (t) => {
  const map = new DatabaseLRUMap({
    maxSize: 10,
    inactiveIdleTTL: 50, // 50ms
    activeIdleTTL: 5000 // 5s
  });

  map.set('active', createMockDb('active'));
  map.set('inactive', createMockDb('inactive'));
  map.addActiveSession('active');

  // Wait for inactive TTL to expire
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  map._sweepIdle();

  // Active session should survive, inactive should be evicted
  t.true(map.has('active'));
  t.false(map.has('inactive'));
  map.destroy();
});

test('keys() returns all keys for iteration', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  map.set('a', createMockDb('a'));
  map.set('b', createMockDb('b'));
  map.set('c', createMockDb('c'));

  const keys = [...map.keys()];
  t.deepEqual(keys.sort(), ['a', 'b', 'c']);
  map.destroy();
});

test('getRaw returns db without updating lastAccess', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  const db = createMockDb('alias1');
  map.set('alias1', db);

  const entry = map._map.get('alias1');
  const originalAccess = entry.lastAccess;

  // Wait a tiny bit
  const before = Date.now();
  while (Date.now() === before) {
    // spin
  }

  const result = map.getRaw('alias1');
  t.is(result, db);
  t.is(entry.lastAccess, originalAccess); // not updated
  map.destroy();
});

test('closeAll closes all databases and clears state', async (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  map.set('a', createMockDb('a'));
  map.set('b', createMockDb('b'));
  map.addActiveSession('a');

  await map.closeAll();

  t.is(map.size, 0);
  t.false(map.hasActiveSession('a'));
});
