/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');
const { Worker } = require('node:worker_threads');

const bytes = require('@forwardemail/bytes');
const ms = require('ms');
const { boolean } = require('boolean');

const checkDiskSpace = require('#helpers/check-disk-space');
const env = require('#config/env');
const logger = require('#helpers/logger');
const { getRekeyLockKey } = require('#helpers/rekey-lock');

//
// Give the space of deleted mail back to the disk, in place.
//
// Mailboxes created before auto_vacuum was set in the right order (see
// helpers/setup-pragma.js) are at auto_vacuum=NONE: deleted pages go on the
// freelist and the file never shrinks.  One VACUUM with auto_vacuum=FULL
// pending both compacts the file and converts it, after which SQLite
// truncates the file on its own as mail is deleted.
//
// This is a plain in-place VACUUM on a normal handle, not a copy-and-rename:
//
//  - It is one write transaction under SQLite's own locking (WAL mode), so
//    other processes with the mailbox open keep working: readers see their
//    snapshot, writers wait up to their busy timeout.  Nothing ever replaces
//    the file, so the stale-handle / orphaned-WAL corruption that the
//    VACUUM INTO + rename migration guards against (helpers/safe-vacuum.js)
//    cannot happen here.
//  - A crash or kill part way through rolls back like any other transaction.
//  - It only runs when it frees enough space (or converts the mailbox), when
//    no rekey, file swap or other VACUUM holds the mailbox, when the volume
//    has room for the temporary copy and the WAL.
//  - Every mailbox still at auto_vacuum=NONE is converted, whatever its
//    size (once: afterwards SQLite gives space back at every commit).  A
//    VACUUM that only reclaims free pages of a mailbox already at FULL is
//    limited to mailboxes small enough that the write lock is held for a
//    few seconds at most.
//  - The mailbox is measured after the lock is taken: the job reaches every
//    sqlite-worker (pub/sub), and one that gets the lock after another has
//    finished must see the compacted file, not VACUUM it again.
//  - FTS5 external-content indexes are rebuilt after the VACUUM, which runs
//    outside any transaction.  A Redis marker set before the VACUUM and
//    cleared after the rebuild makes a rebuild that did not happen (crash,
//    error) run at the next job, even though the mailbox then needs no
//    compaction.
//
// Returns `{ skipped: <reason> }` or `{ compacted: true, ... }`.
//

// Largest mailbox (live data) a space-reclaiming VACUUM runs on (the one-time
// conversion from auto_vacuum=NONE has no limit).  VACUUM rewrites the live
// data at roughly 5-12s per GB and holds the write lock meanwhile; other
// writers wait `busyTimeout` (10s) before failing with a retryable BUSY,
// so the default keeps the lock well under it.
const DEFAULT_MAX_BYTES = bytes('512MB');

// Free space worth a VACUUM on a mailbox that is already auto_vacuum=FULL
// (normally none: FULL returns pages at every commit).
const MIN_FREE_BYTES = bytes('8MB');
const MIN_FREE_RATIO = 0.1;

// Headroom on the volume beyond the temporary copy and the WAL.
const DISK_MARGIN = bytes('256MB');

const LOCK_TTL = ms('30m');

// longest a final TRUNCATE checkpoint may hold writers back (ms), and how
// often it is tried while readers are in the way
const TRUNCATE_BUSY_TIMEOUT = 250;
const TRUNCATE_ATTEMPTS = 5;
const TRUNCATE_RETRY_DELAY = ms('2s');

// mailboxes (live data) at least this large are VACUUMed in a worker thread
// (see helpers/compact-database-thread.js) instead of on the caller's event
// loop, which a VACUUM of several seconds would otherwise stall
const THREAD_MIN_BYTES = bytes('64MB');

const RENEW_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('pexpire', KEYS[1], ARGV[2]) else return 0 end";

// marker of a VACUUM whose FTS rebuild has not completed yet
const FTS_REBUILD_TTL = ms('30d');

const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

// auto_vacuum values <https://www.sqlite.org/pragma.html#pragma_auto_vacuum>
const AUTO_VACUUM_NONE = 0;
const AUTO_VACUUM_FULL = 1;

// largest mailbox (live data) converted from auto_vacuum=NONE, when set
// (SQLITE_VACUUM_CONVERT_MAX_SIZE; unset: every mailbox is converted)
function getConvertMaxBytes() {
  if (env.SQLITE_VACUUM_CONVERT_MAX_SIZE) {
    const value = bytes(env.SQLITE_VACUUM_CONVERT_MAX_SIZE);
    if (Number.isFinite(value) && value > 0) return value;
  }

  return Number.POSITIVE_INFINITY;
}

function getMaxBytes() {
  if (env.SQLITE_VACUUM_MAX_SIZE) {
    const value = bytes(env.SQLITE_VACUUM_MAX_SIZE);
    if (Number.isFinite(value) && value > 0) return value;
  }

  return DEFAULT_MAX_BYTES;
}

/**
 * Page accounting of an open (keyed) handle.
 *
 * @param {Database} db
 * @returns {Object}
 */
function getPageStats(db) {
  const pageSize = db.pragma('page_size', { simple: true });
  const pageCount = db.pragma('page_count', { simple: true });
  const freelistCount = db.pragma('freelist_count', { simple: true });
  return {
    autoVacuum: db.pragma('auto_vacuum', { simple: true }),
    pageSize,
    pageCount,
    freelistCount,
    fileBytes: pageCount * pageSize,
    freeBytes: freelistCount * pageSize,
    liveBytes: (pageCount - freelistCount) * pageSize
  };
}

/**
 * Whether compacting would give space back (or convert the mailbox).
 *
 * @param {Object} stats - from getPageStats
 * @returns {boolean}
 */
function isCompactionNeeded(stats) {
  if (stats.autoVacuum === AUTO_VACUUM_NONE) return true;
  return (
    stats.freeBytes >= MIN_FREE_BYTES &&
    stats.freeBytes >= stats.fileBytes * MIN_FREE_RATIO
  );
}

//
// FTS5 external-content indexes (SQLITE_FTS5_ENABLED) map to the implicit
// rowid of their content table, and VACUUM may renumber the rowids of a
// table without an INTEGER PRIMARY KEY, so they are rebuilt afterwards.
//
function getExternalContentFtsTables(db) {
  return db
    .prepare(
      `SELECT "name" FROM "sqlite_master" WHERE "type" = 'table' AND "sql" LIKE 'CREATE VIRTUAL TABLE%USING fts5%content=%'`
    )
    .pluck()
    .all();
}

function isBusyError(err) {
  const code = typeof err?.code === 'string' ? err.code : '';
  // (and the extended codes: SQLITE_BUSY_SNAPSHOT, SQLITE_LOCKED_SHAREDCACHE …)
  return code.startsWith('SQLITE_BUSY') || code.startsWith('SQLITE_LOCKED');
}

//
// VACUUM, FTS rebuild and quick_check on a connection of its own in a worker
// thread (see above).  Resolves with `{ vacuumed, quickCheck }`; an error
// keeps the fields the caller acts on (code, responseCode …).
//
function vacuumInThread({ dbFilePath, session, ftsTables }) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let vacuumed = false;
    const worker = new Worker(
      path.join(__dirname, 'compact-database-thread.js'),
      { workerData: { dbFilePath, session, ftsTables } }
    );
    worker.on('message', (message) => {
      if (settled || !message) return;
      if (message.vacuumed) {
        vacuumed = true;
        return;
      }

      settled = true;
      if (message.ok)
        return resolve({ vacuumed, quickCheck: message.quickCheck });
      const err = new Error(message.error?.message || 'VACUUM failed');
      Object.assign(err, message.error, { vacuumed });
      reject(err);
    });
    worker.once('error', (err) => {
      if (settled) return;
      settled = true;
      err.vacuumed = vacuumed;
      reject(err);
    });
    //
    // (the thread exits once it has closed its handle; should anything keep
    // it alive after it answered, it is stopped rather than left behind)
    //
    let exited = false;
    const stopIfLingering = () => {
      const timer = setTimeout(() => {
        if (!exited) worker.terminate().catch(() => {});
      }, 30_000);
      timer.unref();
    };

    worker.on('message', (message) => {
      if (message && (message.ok || message.error)) stopIfLingering();
    });
    worker.once('exit', (code) => {
      exited = true;
      if (settled) return;
      settled = true;
      const err = new Error(`VACUUM thread exited with code ${code}`);
      err.vacuumed = vacuumed;
      reject(err);
    });
  });
}

function rebuildFtsTables(db, tables) {
  if (tables.length === 0) return;
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const table of tables) {
      const name = table.replace(/"/g, '""');
      db.exec(`INSERT INTO "${name}"("${name}") VALUES('rebuild')`);
    }

    db.exec('COMMIT');
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {}

    throw err;
  }
}

/**
 * Compact (and convert to auto_vacuum=FULL) a live mailbox in place.
 *
 * @param {Object} options
 * @param {Database} options.db - a writable handle opened with setupPragma
 *   (e.g. helpers/open-database-handle.js), not shared with other callers
 * @param {string} options.dbFilePath - path of the live mailbox file
 * @param {string} options.aliasId
 * @param {Redis} options.client
 * @param {Object} [options.session] - the alias session `db` was opened
 *   with; when given, a large mailbox is VACUUMed in a worker thread
 * @param {number} [options.threadMinBytes]
 * @returns {Promise<Object>}
 */
async function compactNow({
  db,
  dbFilePath,
  aliasId,
  client,
  session,
  threadMinBytes = THREAD_MIN_BYTES
}) {
  if (!db || !db.open) throw new TypeError('Database is not open');
  if (db.readonly) throw new TypeError('Database is read-only');
  if (db.inTransaction) throw new TypeError('Database is in a transaction');
  if (typeof dbFilePath !== 'string' || !dbFilePath)
    throw new TypeError('Database file path missing');
  if (!aliasId) throw new TypeError('Alias ID missing');
  if (!client) throw new TypeError('Redis client missing');

  if (!boolean(env.SQLITE_VACUUM_ENABLED)) return { skipped: 'disabled' };

  // never alongside a password rotation or a file swap of this mailbox
  const [rekeyLock, swapLock] = await client.mget(
    getRekeyLockKey(aliasId),
    `db_swap_lock:${aliasId}`
  );
  if (rekeyLock || swapLock) return { skipped: 'busy' };

  // one VACUUM of a mailbox at a time, across every worker and host
  // (shared with helpers/safe-vacuum.js)
  const lockKey = `vacuum_lock:${aliasId}`;
  const lockValue = randomUUID();
  const acquired = await client.set(lockKey, lockValue, 'PX', LOCK_TTL, 'NX');
  if (!acquired) return { skipped: 'locked' };

  const ftsKey = `fts_rebuild:${aliasId}`;

  try {
    // (again now that the lock is held: a rotation or swap may have started
    // between the check above and the lock)
    const [rekeyLockNow, swapLockNow] = await client.mget(
      getRekeyLockKey(aliasId),
      `db_swap_lock:${aliasId}`
    );
    if (rekeyLockNow || swapLockNow) return { skipped: 'busy' };

    // an earlier VACUUM whose FTS rebuild did not complete
    if (await client.get(ftsKey)) {
      rebuildFtsTables(db, getExternalContentFtsTables(db));
      await client.del(ftsKey);
    }

    // measured under the lock (see above)
    const before = getPageStats(db);
    if (!isCompactionNeeded(before)) return { skipped: 'not-needed', before };

    const maxBytes =
      before.autoVacuum === AUTO_VACUUM_NONE
        ? getConvertMaxBytes()
        : getMaxBytes();
    if (before.liveBytes > maxBytes)
      return { skipped: 'too-large', before, maxBytes };

    // the temporary copy VACUUM builds (temp_store_directory is on the same
    // volume, see setup-pragma.js) plus the WAL that carries the new pages
    const spaceRequired = before.liveBytes * 2 + DISK_MARGIN;
    const { free } = await checkDiskSpace(dbFilePath);
    if (free < spaceRequired)
      return { skipped: 'disk-space', before, spaceRequired, free };

    const start = Date.now();

    //
    // (setupPragma sets auto_vacuum=FULL on every open, which also turns an
    // INCREMENTAL mailbox into FULL; for NONE it takes effect at this VACUUM)
    //
    db.pragma('auto_vacuum=FULL');

    const ftsTables = getExternalContentFtsTables(db);
    if (ftsTables.length > 0)
      await client.set(ftsKey, 'true', 'PX', FTS_REBUILD_TTL);

    let quickCheck;
    if (session && before.liveBytes >= threadMinBytes) {
      // keep the lock while the thread runs, however long it takes
      const renew = setInterval(() => {
        client
          .eval(RENEW_LOCK_SCRIPT, 1, lockKey, lockValue, LOCK_TTL)
          .catch((err) => logger.debug(err, { alias_id: aliasId }));
      }, Math.floor(LOCK_TTL / 3));
      try {
        ({ quickCheck } = await vacuumInThread({
          dbFilePath,
          session,
          ftsTables
        }));
      } catch (err) {
        // another connection held the write lock longer than busy_timeout
        if (!err.vacuumed && isBusyError(err))
          return { skipped: 'busy', before };
        throw err;
      } finally {
        clearInterval(renew);
      }

      // start a new read transaction so this handle sees the new file
      db.prepare('SELECT count(*) FROM "sqlite_master"').get();
    } else {
      try {
        db.exec('VACUUM');
      } catch (err) {
        // another connection held the write lock longer than busy_timeout
        if (isBusyError(err)) return { skipped: 'busy', before };
        throw err;
      }

      rebuildFtsTables(db, ftsTables);
      quickCheck = db.pragma('quick_check', { simple: true });
    }

    if (ftsTables.length > 0) await client.del(ftsKey);

    //
    // Fold the WAL back so the main file is truncated now.  PASSIVE first:
    // RESTART/TRUNCATE hold the write lock while they wait for readers, so a
    // long read in another process (e.g. an IMAP FETCH) would block every
    // writer of the mailbox for up to busy_timeout.  Then TRUNCATE with a
    // short busy timeout, a few times apart, empties the WAL (which carries a
    // copy of every page after a VACUUM, and counts in storage used) once no
    // reader is in the way; otherwise it is reset at a later checkpoint.
    //
    let walTruncated = false;
    try {
      db.pragma('wal_checkpoint(PASSIVE)');
      for (let attempt = 0; attempt < TRUNCATE_ATTEMPTS; attempt++) {
        if (attempt > 0) await delay(TRUNCATE_RETRY_DELAY);
        if (!db.open) break;
        const busyTimeout = db.pragma('busy_timeout', { simple: true });
        let row;
        db.pragma(`busy_timeout=${TRUNCATE_BUSY_TIMEOUT}`);
        try {
          [row] = db.pragma('wal_checkpoint(TRUNCATE)');
        } finally {
          db.pragma(`busy_timeout=${Number(busyTimeout) || 0}`);
        }

        if (row && row.busy === 0) {
          walTruncated = true;
          break;
        }
      }
    } catch (err) {
      logger.debug(err, { alias_id: aliasId });
    }

    if (quickCheck !== 'ok') {
      const err = new Error(`quick_check after VACUUM returned ${quickCheck}`);
      err.isCodeBug = true;
      err.alias_id = aliasId;
      throw err;
    }

    const after = getPageStats(db);
    return {
      compacted: true,
      converted:
        before.autoVacuum === AUTO_VACUUM_NONE &&
        after.autoVacuum === AUTO_VACUUM_FULL,
      duration: Date.now() - start,
      walTruncated,
      before,
      after
    };
  } finally {
    try {
      await client.eval(RELEASE_LOCK_SCRIPT, 1, lockKey, lockValue);
    } catch (err) {
      logger.debug(err, { alias_id: aliasId });
    }
  }
}

//
// One compaction at a time per process: each needs free space for its own
// temporary copy and WAL (checked before it starts), which two at once on
// the same volume would share.
//
let queue = Promise.resolve();
function compactDatabase(options) {
  const run = queue.then(
    () => compactNow(options),
    () => compactNow(options)
  );
  queue = run.catch(() => {});
  return run;
}

module.exports = compactDatabase;
module.exports.getPageStats = getPageStats;
module.exports.isCompactionNeeded = isCompactionNeeded;
module.exports.AUTO_VACUUM_NONE = AUTO_VACUUM_NONE;
module.exports.AUTO_VACUUM_FULL = AUTO_VACUUM_FULL;
