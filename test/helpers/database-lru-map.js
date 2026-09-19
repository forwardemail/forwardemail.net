/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const test = require('ava');

const DatabaseLRUMap = require('#helpers/database-lru-map');

function makeDb(opts = {}) {
  return { open: true, inTransaction: false, pragma() {}, close() {}, ...opts };
}

test.afterEach((t) => {
  if (t.context.map) t.context.map.destroy();
});

// --- Constructor ---

test('constructor > defaults maxSize from env (DATABASE_MAP_MAX_SIZE)', (t) => {
  const map = new DatabaseLRUMap();
  t.context.map = map;
  // DATABASE_MAP_MAX_SIZE=3000 in .env.defaults; fallback is 200
  t.is(map.maxSize, Number(process.env.DATABASE_MAP_MAX_SIZE) || 200);
});

test('constructor > accepts custom options', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  t.is(map.maxSize, 10);
});

// --- get/set/has/size/delete ---

test('set/get > stores and retrieves db', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeDb();
  map.set('key1', db);
  t.is(map.get('key1'), db);
});

test('get > returns undefined for missing key', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  t.is(map.get('missing'), undefined);
});

test('get > updates lastAccess (LRU touch)', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  map.set('key1', makeDb());
  // Set lastAccess to the past
  map._map.get('key1').lastAccess = Date.now() - 5000;
  // get() should refresh it to ~now
  map.get('key1');
  t.true(map._map.get('key1').lastAccess > Date.now() - 1000);
});

test('has > returns true for existing key', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  map.set('key1', makeDb());
  t.true(map.has('key1'));
});

test('has > returns false for missing key', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  t.false(map.has('missing'));
});

test('size > returns number of entries', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  map.set('a', makeDb());
  map.set('b', makeDb());
  t.is(map.size, 2);
});

test('delete > removes entry and closes db', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeDb();
  map.set('key1', db);
  const result = map.delete('key1');
  t.true(result);
  t.false(map.has('key1'));
  t.is(map.size, 0);
});

test('delete > returns false for missing key', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  t.false(map.delete('missing'));
});

// --- LRU eviction on capacity overflow ---

test('set > evicts single LRU entry when full', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  // Fill to capacity
  for (let i = 0; i < 10; i++) {
    map.set(`key${i}`, makeDb());
    // Make older entries have older lastAccess
    map._map.get(`key${i}`).lastAccess = Date.now() - (10 - i) * 1000;
  }

  t.is(map.size, 10);
  // Adding one more should evict the single oldest entry
  map.set('new', makeDb());
  t.true(map.has('new'));
  // key0 was the oldest, should be evicted
  t.false(map.has('key0'));
  t.is(map.size, 10);
});

test('set > does not evict entries in transaction', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 2 });
  t.context.map = map;
  map.set('a', makeDb({ inTransaction: true }));
  map.set('b', makeDb());
  // Make 'a' the oldest
  map._map.get('a').lastAccess = Date.now() - 2000;
  map._map.get('b').lastAccess = Date.now() - 1000;
  // 'a' is oldest but in transaction, so 'b' gets evicted
  map.set('c', makeDb());
  t.true(map.has('a'));
  t.false(map.has('b'));
  t.true(map.has('c'));
});

test('set > updates existing entry without eviction', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 2 });
  t.context.map = map;
  const db1 = makeDb();
  const db2 = makeDb();
  map.set('a', db1);
  map.set('a', db2);
  t.is(map.get('a'), db2);
  t.is(map.size, 1);
});

// --- Idle sweep ---

test('_sweepIdle > evicts idle entries past TTL', async (t) => {
  const map = new DatabaseLRUMap({
    maxSize: 10,
    idleTTL: 50
  });
  t.context.map = map;
  map.set('idle1', makeDb());
  map.set('idle2', makeDb());
  // Wait for TTL to expire
  await new Promise((resolve) => {
    setTimeout(resolve, 60);
  });
  map._sweepIdle();
  t.is(map.size, 0);
});

test('_sweepIdle > does not evict entries in transaction', async (t) => {
  const map = new DatabaseLRUMap({
    maxSize: 10,
    idleTTL: 50
  });
  t.context.map = map;
  map.set('active', makeDb({ inTransaction: true }));
  map.set('idle', makeDb());
  await new Promise((resolve) => {
    setTimeout(resolve, 60);
  });
  map._sweepIdle();
  t.true(map.has('active'));
  t.false(map.has('idle'));
});

test('_sweepIdle > does not evict recently accessed entries', (t) => {
  const map = new DatabaseLRUMap({
    maxSize: 10,
    idleTTL: 100
  });
  t.context.map = map;
  map.set('fresh', makeDb());
  map.set('stale', makeDb());
  // Make stale old, keep fresh recent
  map._map.get('stale').lastAccess = Date.now() - 200;
  map._sweepIdle();
  t.true(map.has('fresh'));
  t.false(map.has('stale'));
});

// --- closeAll ---

test('closeAll > closes all databases and clears map', async (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db1 = makeDb();
  const db2 = makeDb();
  map.set('a', db1);
  map.set('b', db2);
  await map.closeAll();
  t.is(map.size, 0);
});

// --- destroy ---

test('destroy > nullifies sweep interval', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  map.destroy();
  t.is(map._sweepInterval, null);
});

// --- keys ---

test('keys > returns iterator of all keys', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  map.set('a', makeDb());
  map.set('b', makeDb());
  const keys = [...map.keys()];
  t.deepEqual(keys, ['a', 'b']);
});

// --- Drop-in Map compatibility ---

test('drop-in > get() returns raw db object (not entry wrapper)', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeDb();
  map.set('key', db);
  const result = map.get('key');
  t.is(result, db);
  t.true(result.open);
});

test('drop-in > set() returns this for chaining', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const result = map.set('key', makeDb());
  t.is(result, map);
});
// --- evict (remove without close) ---
test('evict > removes entry from map without closing db', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeDb();
  map.set('key1', db);
  const result = map.evict('key1');
  t.true(result);
  t.false(map.has('key1'));
  t.is(map.size, 0);
  // db should still be open (not closed by evict)
  t.true(db.open);
});
test('evict > returns false for missing key', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  t.false(map.evict('missing'));
});

// --- evictAndClose / deferred close ---

function makeClosableDb() {
  const db = {
    open: true,
    inTransaction: false,
    busy: false,
    closeCalls: 0,
    pragma() {},
    close() {
      this.closeCalls++;
      if (this.busy)
        throw new TypeError(
          'This database connection is busy executing a query'
        );
      this.open = false;
    }
  };
  return db;
}

test('evictAndClose > closes an idle handle immediately', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeClosableDb();
  map.set('a', db);

  t.true(map.evictAndClose('a'));
  t.false(db.open);
  t.false(map.has('a'));
  t.is(map.pendingCloseSize, 0);
  // evicting again is a no-op that reports "nothing left"
  t.true(map.evictAndClose('a'));
});

test('evictAndClose > defers a handle a request still holds until it is released', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeClosableDb();
  map.set('a', db);
  map.acquire('a');

  t.false(map.evictAndClose('a'));
  t.true(db.open);
  t.false(map.has('a'));
  t.is(map.pendingCloseSize, 1);

  // the request finishes: the handle it used is closed
  map.release('a', db);
  t.false(db.open);
  t.is(map.pendingCloseSize, 0);
});

test('evictAndClose > a busy handle is closed once it is no longer busy', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeClosableDb();
  db.busy = true;
  map.set('a', db);

  t.false(map.evictAndClose('a'));
  t.true(db.open);
  t.is(map.pendingCloseSize, 1);

  db.busy = false;
  t.true(map.evictAndClose('a'));
  t.false(db.open);
  t.is(map.pendingCloseSize, 0);
});

test('release > a request releases the handle it holds, not the one now cached', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const first = makeClosableDb();
  map.set('a', first);
  map.acquire('a');

  // evicted while the request runs, then reopened by another request
  t.false(map.evictAndClose('a'));
  const second = makeClosableDb();
  map.set('a', second);
  map.acquire('a');

  // the first request finishes: only the evicted handle is closed
  map.release('a', first);
  t.false(first.open);
  t.true(second.open);
  t.is(map.pendingCloseSize, 0);
  t.is(map._map.get('a').refcount, 1);

  // a release for a handle that was never acquired changes nothing
  map.release('a', makeClosableDb());
  t.is(map._map.get('a').refcount, 1);
  t.true(second.open);

  map.release('a', second);
  t.is(map._map.get('a').refcount, 0);
});

test('evictAndClose > several evicted handles of one alias are all tracked', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const first = makeClosableDb();
  map.set('a', first);
  map.acquire('a');
  t.false(map.evictAndClose('a'));

  const second = makeClosableDb();
  map.set('a', second);
  map.acquire('a');
  t.false(map.evictAndClose('a'));
  t.is(map.pendingCloseSize, 2);

  map.release('a', second);
  t.false(second.open);
  t.true(first.open);
  t.is(map.pendingCloseSize, 1);

  map.release('a', first);
  t.false(first.open);
  t.is(map.pendingCloseSize, 0);
});

test('_closePending > force-closes a pending handle only after the grace period', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10, pendingCloseGraceMs: 50 });
  t.context.map = map;
  const db = makeClosableDb();
  map.set('a', db);
  map.acquire('a');
  t.false(map.evictAndClose('a'));

  // still referenced and within the grace period: left alone
  map._closePending();
  t.true(db.open);

  // the request never released its reference: closed after the grace period
  map._pendingClose.get('a')[0].since = Date.now() - 100;
  map._closePending();
  t.false(db.open);
  t.is(map.pendingCloseSize, 0);
});

test('evictAndClose > defers a handle the deferred maintenance is using', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10, pendingCloseGraceMs: 50 });
  t.context.map = map;
  const db = makeClosableDb();
  map.set('a', db);
  // `getDatabase` marks the entry while its deferred maintenance runs
  const entry = map._map.get('a');
  entry.maintenanceActive = true;

  t.false(map.evictAndClose('a'));
  t.true(db.open);
  t.false(map.has('a'));
  t.is(map.pendingCloseSize, 1);

  // a re-broadcast eviction and the sweep leave it alone while it is in use
  t.false(map.evictAndClose('a'));
  map._closePending();
  t.true(db.open);

  // the maintenance finished (it clears the flag on the entry it captured)
  entry.maintenanceActive = false;
  t.true(map.evictAndClose('a'));
  t.false(db.open);
  t.is(map.pendingCloseSize, 0);

  // a maintenance that never ends does not pin the handle past the grace
  const stuck = makeClosableDb();
  map.set('b', stuck);
  map._map.get('b').maintenanceActive = true;
  t.false(map.evictAndClose('b'));
  map._pendingClose.get('b')[0].since = Date.now() - 100;
  map._closePending();
  t.false(stuck.open);
  t.is(map.pendingCloseSize, 0);
});

test('maintenanceDone > closes an evicted handle the moment its maintenance ends', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const db = makeClosableDb();
  map.set('a', db);
  map._map.get('a').maintenanceActive = true;

  // evicted while the maintenance runs (a swap is waiting for its files)
  t.false(map.evictAndClose('a'));
  t.true(db.open);

  // the maintenance ends: closed right away, not at the next sweep
  map.maintenanceDone('a', db);
  t.false(db.open);
  t.is(map.pendingCloseSize, 0);

  // a handle a request still references stays open until it is released
  const held = makeClosableDb();
  map.set('b', held);
  map._map.get('b').maintenanceActive = true;
  t.is(map.acquire('b', held), held);
  t.false(map.evictAndClose('b'));
  map.maintenanceDone('b', held);
  t.true(held.open);
  map.release('b', held);
  t.false(held.open);

  // a handle that is still cached only has its flag cleared
  const cached = makeClosableDb();
  map.set('c', cached);
  map._map.get('c').maintenanceActive = true;
  map.maintenanceDone('c', cached);
  t.false(map._map.get('c').maintenanceActive);
  t.true(cached.open);

  // the flag belongs to the handle the maintenance ran on, not to a newer
  // handle of the same alias
  const older = makeClosableDb();
  const newer = makeClosableDb();
  map.set('d', older);
  map._map.get('d').maintenanceActive = true;
  t.false(map.evictAndClose('d'));
  map.set('d', newer);
  map._map.get('d').maintenanceActive = true;
  map.maintenanceDone('d', older);
  t.false(older.open);
  t.true(newer.open);
  t.true(map._map.get('d').maintenanceActive);
});

test('acquire > takes the reference on the handle the request holds', (t) => {
  const map = new DatabaseLRUMap({ maxSize: 10 });
  t.context.map = map;
  const first = makeClosableDb();
  map.set('a', first);

  // two requests obtained the cached handle; only the first has acquired it
  // when the alias is evicted (a rotation starts) and reopened
  t.is(map.acquire('a', first), first);
  t.false(map.evictAndClose('a'));
  const second = makeClosableDb();
  map.set('a', second);

  // the second request now acquires the handle it actually holds: the
  // evicted one, which stays open for it instead of being closed by the
  // first request's release
  t.is(map.acquire('a', first), first);
  t.is(map._map.get('a').refcount, 0);
  map.release('a', first);
  t.true(first.open);
  map.release('a', first);
  t.false(first.open);
  t.is(map.pendingCloseSize, 0);

  // a handle that is neither cached nor pending cannot be acquired: the
  // request does not record a reference it never got
  t.is(map.acquire('a', makeClosableDb()), undefined);
  t.is(map._map.get('a').refcount, 0);

  // without a handle the reference goes to whatever is cached
  t.is(map.acquire('a'), second);
  t.is(map._map.get('a').refcount, 1);
  map.release('a', second);
  t.is(map._map.get('a').refcount, 0);
});
