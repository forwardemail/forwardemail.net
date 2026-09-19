/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const Database = require('better-sqlite3-multiple-ciphers');
const test = require('ava');

const openDatabaseHandle = require('#helpers/open-database-handle');
const { encrypt } = require('#helpers/encrypt-decrypt');
const {
  acquireDbFileLock,
  getDbFileLockPath,
  withDbFileLock
} = require('#helpers/db-file-lock');

function tmpDatabasePath(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'db-file-lock-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.join(dir, 'alias.sqlite');
}

test('the lock is exclusive and released only by its owner', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);

  const first = await acquireDbFileLock(dbFilePath, { purpose: 'test' });
  t.true(fs.existsSync(lockPath));
  t.true(first.isOwned());

  // a second acquisition waits for the first one and times out
  const err = await t.throwsAsync(
    acquireDbFileLock(dbFilePath, { timeoutMs: 300 })
  );
  t.is(err.code, 'SQLITE_BUSY');
  t.true(err.isDbFileLock);
  t.true(first.isOwned());

  t.true(first.release());
  t.false(fs.existsSync(lockPath));
  t.false(first.isOwned());
  // releasing twice is a no-op
  t.false(first.release());

  const second = await acquireDbFileLock(dbFilePath);
  t.true(second.isOwned());
  second.release();
});

test('a lock left behind by a dead process is broken once its lease expires', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);

  // (a short lease so the "dead" holder's refresh timer fires during the
  //  test: a stalled process comes back to life after its lock was broken)
  const dead = await acquireDbFileLock(dbFilePath, {
    purpose: 'open',
    leaseMs: 4000
  });
  // the holder "died": its lease is no longer refreshed and has run out
  const owner = JSON.parse(fs.readFileSync(`${lockPath}/owner`, 'utf8'));
  t.is(owner.purpose, 'open');
  t.true(owner.expires_at > Date.now());
  owner.expires_at = Date.now() - 1000;
  fs.writeFileSync(`${lockPath}/owner`, JSON.stringify(owner));

  const fresh = await acquireDbFileLock(dbFilePath, { timeoutMs: 2000 });
  t.true(fresh.isOwned());
  // the previous owner must notice it no longer owns the lock and must not
  // be able to remove the new owner's lock
  t.false(dead.isOwned());
  t.false(dead.release());
  t.true(fresh.isOwned());

  // a refresh of the previous owner (it refreshes through the descriptor of
  // its own, renamed-away owner file) can never overwrite the new owner's
  // file
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
  t.is(
    JSON.parse(fs.readFileSync(`${lockPath}/owner`, 'utf8')).token,
    fresh.token
  );
  t.true(fresh.isOwned());
  t.false(dead.isOwned());

  t.true(fresh.release());
  t.false(fs.existsSync(lockPath));
});

test('a live holder keeps its lease moving and is never broken', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);

  // a very short lease with a refresh every second
  const lock = await acquireDbFileLock(dbFilePath, {
    purpose: 'open',
    leaseMs: 4000
  });
  const first = JSON.parse(fs.readFileSync(`${lockPath}/owner`, 'utf8'));
  await new Promise((resolve) => {
    setTimeout(resolve, 2500);
  });
  const later = JSON.parse(fs.readFileSync(`${lockPath}/owner`, 'utf8'));
  t.true(later.expires_at > first.expires_at);
  t.is(later.token, first.token);

  // a contender does not get to break it
  const err = await t.throwsAsync(
    acquireDbFileLock(dbFilePath, { timeoutMs: 500 })
  );
  t.is(err.code, 'SQLITE_BUSY');
  t.true(lock.isOwned());
  t.true(lock.release());
});

test('an ownerless lock (holder died before writing its owner) is broken by age', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);
  fs.mkdirSync(lockPath);
  const past = new Date(Date.now() - 10 * 60 * 1000);
  fs.utimesSync(lockPath, past, past);

  const lock = await acquireDbFileLock(dbFilePath, { timeoutMs: 2000 });
  t.true(lock.isOwned());
  t.true(lock.release());
});

test('two contenders breaking the same stale lock cannot both win', async (t) => {
  //
  // Two acquisitions in one process race to break the same expired lock.
  // The mutual exclusion does not rely on a shared event loop: the winner is
  // decided by `rename` (breakStaleLock renames the directory away before
  // removing it, and only one rename of a given directory can succeed), which
  // is atomic across processes on every filesystem this runs on, so the
  // single-process race here exercises the same guarantee two PM2 cluster
  // workers rely on.
  //
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);
  fs.mkdirSync(lockPath);
  fs.writeFileSync(
    `${lockPath}/owner`,
    JSON.stringify({ token: 'dead', purpose: 'open', expires_at: 1 })
  );

  const [a, b] = await Promise.all([
    acquireDbFileLock(dbFilePath, { timeoutMs: 3000 }).then(
      (lock) => lock,
      (err) => err
    ),
    acquireDbFileLock(dbFilePath, { timeoutMs: 3000 }).then(
      (lock) => lock,
      (err) => err
    )
  ]);
  const winners = [a, b].filter(
    (result) => typeof result.release === 'function' && result.isOwned()
  );
  const losers = [a, b].filter((result) => result instanceof Error);
  t.is(winners.length, 1);
  t.is(losers.length, 1);
  t.is(losers[0].code, 'SQLITE_BUSY');
  t.true(winners[0].release());
});

test('withDbFileLock releases the lock even when the callback throws', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);

  await t.throwsAsync(
    withDbFileLock(dbFilePath, async () => {
      t.true(fs.existsSync(lockPath));
      throw new Error('boom');
    }),
    { message: 'boom' }
  );
  t.false(fs.existsSync(lockPath));

  const result = await withDbFileLock(dbFilePath, { purpose: 'x' }, () => 42);
  t.is(result, 42);
  t.false(fs.existsSync(lockPath));
});

test('openDatabaseHandle waits for the file lock and never leaks a handle', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const session = {
    user: { password: encrypt('password'), domain_name: 'example.com' }
  };

  // create the encrypted database
  const created = await openDatabaseHandle(dbFilePath, session);
  created.exec('CREATE TABLE t (id INTEGER PRIMARY KEY)');
  created.close();
  t.false(fs.existsSync(getDbFileLockPath(dbFilePath)));

  // an open must wait while a swapper holds the lock
  const swapper = await acquireDbFileLock(dbFilePath, { purpose: 'rekey' });
  const err = await t.throwsAsync(
    openDatabaseHandle(dbFilePath, session, { lock: { timeoutMs: 300 } })
  );
  t.is(err.code, 'SQLITE_BUSY');
  swapper.release();

  // a wrong password closes the handle it opened (no -wal/-shm left behind)
  const bad = await t.throwsAsync(
    openDatabaseHandle(dbFilePath, {
      user: { password: encrypt('wrong'), domain_name: 'example.com' }
    })
  );
  t.is(bad.code, 'SQLITE_NOTADB');
  t.false(fs.existsSync(`${dbFilePath}-wal`));
  t.false(fs.existsSync(`${dbFilePath}-shm`));
  t.false(fs.existsSync(getDbFileLockPath(dbFilePath)));

  // read-only opens work too
  const readonly = await openDatabaseHandle(dbFilePath, session, {
    readonly: true
  });
  t.true(readonly.readonly);
  t.is(readonly.prepare('SELECT count(*) AS c FROM t').get().c, 0);
  readonly.close();

  // sanity: the file is a real encrypted database
  const raw = new Database(dbFilePath, { readonly: true });
  t.throws(() => raw.pragma('journal_mode'), { code: 'SQLITE_NOTADB' });
  raw.close();
});

test('breaking a stale lock reports it and never spins when it cannot be broken', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);

  // a stale lock that can be broken: the new holder is told about it
  fs.mkdirSync(lockPath);
  fs.writeFileSync(
    `${lockPath}/owner`,
    JSON.stringify({ token: 'dead', purpose: 'open', expires_at: 1 })
  );
  const lock = await acquireDbFileLock(dbFilePath, { timeoutMs: 2000 });
  t.true(lock.brokeStale);
  t.true(lock.release());

  const fresh = await acquireDbFileLock(dbFilePath);
  t.false(fresh.brokeStale);
  t.true(fresh.release());

  // a stale lock on a volume that went read-only: `rename` keeps failing,
  // so the wait must end with the usual timeout instead of looping forever
  fs.mkdirSync(lockPath);
  fs.writeFileSync(
    `${lockPath}/owner`,
    JSON.stringify({ token: 'dead', purpose: 'open', expires_at: 1 })
  );
  const { renameSync } = fs;
  fs.renameSync = () => {
    const err = new Error('EROFS: read-only file system');
    err.code = 'EROFS';
    throw err;
  };

  try {
    const started = Date.now();
    const err = await t.throwsAsync(
      acquireDbFileLock(dbFilePath, { timeoutMs: 500 })
    );
    t.is(err.code, 'SQLITE_BUSY');
    t.true(err.isDbFileLock);
    t.true(Date.now() - started >= 500);
    t.true(Date.now() - started < 5000);
  } finally {
    fs.renameSync = renameSync;
  }

  // a lock that cannot be created at all fails like an unopenable database
  const missing = await t.throwsAsync(
    acquireDbFileLock(path.join(os.tmpdir(), 'missing-dir', 'x', 'y.sqlite'))
  );
  t.is(missing.code, 'SQLITE_CANTOPEN');
});

test('a lock is held and refreshed even when its owner file cannot be written (full disk)', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);

  // the owner file cannot be written (ENOSPC)
  const { writeSync } = fs;
  fs.writeSync = () => {
    const err = new Error('ENOSPC: no space left on device');
    err.code = 'ENOSPC';
    throw err;
  };

  let lock;
  try {
    lock = await acquireDbFileLock(dbFilePath, {
      purpose: 'open',
      leaseMs: 4000
    });
  } finally {
    fs.writeSync = writeSync;
  }

  // held, without an owner file
  t.true(fs.existsSync(lockPath));
  t.true(lock.isOwned());
  t.false(fs.existsSync(`${lockPath}/owner`));

  // a contender cannot take it
  const err = await t.throwsAsync(
    acquireDbFileLock(dbFilePath, { timeoutMs: 300 })
  );
  t.is(err.code, 'SQLITE_BUSY');

  // the lease keeps moving through the directory's mtime
  const before = fs.statSync(lockPath).mtimeMs;
  await new Promise((resolve) => {
    setTimeout(resolve, 2500);
  });
  t.true(fs.statSync(lockPath).mtimeMs > before);
  t.true(lock.isOwned());

  // and it is released like any other lock
  t.true(lock.release());
  t.false(fs.existsSync(lockPath));
  const next = await acquireDbFileLock(dbFilePath);
  t.true(next.isOwned());
  t.true(next.release());
});

test('a lock that was broken and re-created is not mistaken for our own', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const lockPath = getDbFileLockPath(dbFilePath);

  const lock = await acquireDbFileLock(dbFilePath, { purpose: 'open' });
  t.true(lock.isOwned());

  // a breaker renames our directory away and another holder creates a new
  // one at the same path (without an owner file, as on a full disk)
  fs.renameSync(lockPath, `${lockPath}.stale-test`);
  fs.mkdirSync(lockPath);
  t.false(lock.isOwned());
  // we must not remove the new holder's lock
  t.false(lock.release());
  t.true(fs.existsSync(lockPath));
  fs.rmSync(`${lockPath}.stale-test`, { recursive: true, force: true });
  fs.rmSync(lockPath, { recursive: true, force: true });
});
