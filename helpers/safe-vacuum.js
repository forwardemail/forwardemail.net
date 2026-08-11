/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const fs = require('node:fs');
const os = require('node:os');

const { setTimeout } = require('node:timers/promises');

const Database = require('better-sqlite3-multiple-ciphers');
const ms = require('ms');
const { boolean } = require('boolean');

const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const setupPragma = require('#helpers/setup-pragma');

const HOSTNAME = os.hostname();

// Lua script to atomically release a Redis lock only if we still own it.
// Prevents releasing a lock that expired and was re-acquired by another worker.
const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

//
// Shared safe VACUUM INTO + atomic swap implementation.
//
// Replaces a live SQLite database file with a freshly vacuumed copy.
//
// SAFETY: This operation replaces the database file on disk while other
// PM2 cluster workers may hold open handles to it.  Without cross-process
// quiesce, stale handles keep writing to the old inode and the orphaned
// encrypted -wal file gets replayed onto the new file, causing mass
// SQLITE_NOTADB / SQLITE_CORRUPT corruption.  Prevention:
//  1. Kill switch via SQLITE_AUTO_VACUUM_MIGRATION_ENABLED (default off)
//  2. `vacuum_lock:<aliasId>` (NX) prevents concurrent VACUUM across workers
//  3. `db_swap_lock:<aliasId>` (NX) makes getDatabase() throw a retryable
//     SQLITE_BUSY error so no new handles are opened during the swap
//  4. `db_cache_evict` pub/sub broadcast + local databaseMap eviction and a
//     1s grace period closes stale handles in every other worker
//  5. wal_checkpoint(TRUNCATE) result is parsed fail-closed; if any reader
//     or writer is still active (busy !== 0) the swap is aborted
//  6. The new file is verified (reopen + setupPragma + quick_check) BEFORE
//     the atomic rename commits it
//  7. After close, the absence of -wal/-shm files proves exclusivity; if
//     they exist the swap is aborted (a stale handle is still writing)
//
// All abort paths leave `vacuum_check` unset so the migration naturally
// retries on the next request.
//
// Returns { skipped: true } when disabled or locks are held elsewhere,
// and { swapped: true } on success (in which case `db` has been closed
// and the caller must reopen a new handle if it still needs one).
//
async function safeVacuum({
  db,
  dbFilePath,
  aliasId,
  client,
  databaseMap,
  session
}) {
  // Kill switch: the auto-vacuum migration is opt-in via env
  if (!boolean(env.SQLITE_AUTO_VACUUM_MIGRATION_ENABLED)) {
    return { skipped: true };
  }

  // Unique lock owner token (hostname + PID + timestamp) so different
  // PM2 workers on the same host don't collide and stale locks from a
  // previous run of this process can't be confused with the current one.
  const lockOwner = `${HOSTNAME}:${process.pid}:${Date.now()}`;
  const vacuumLockKey = `vacuum_lock:${aliasId}`;
  const swapLockKey = `db_swap_lock:${aliasId}`;
  const tmpPath = `${dbFilePath}.vacuum-tmp-${process.pid}`;

  //
  // Acquire a distributed lock to prevent concurrent VACUUM
  // across multiple workers on the same alias database.
  // Uses Redis SET NX with 5-minute expiry as a safety net.
  //
  const vacuumAcquired = await client.set(
    vacuumLockKey,
    lockOwner,
    'PX',
    ms('5m'),
    'NX'
  );
  if (!vacuumAcquired) {
    return { skipped: true };
  }

  let swapped = false;
  let swapAcquired = false;
  try {
    //
    // Acquire the swap lock so that getDatabase() calls in other workers
    // throw a retryable SQLITE_BUSY error instead of opening (or keeping)
    // handles to the file that is about to be replaced.
    //
    swapAcquired = await client.set(
      swapLockKey,
      lockOwner,
      'PX',
      ms('5m'),
      'NX'
    );
    if (!swapAcquired) {
      return { skipped: true };
    }

    //
    // Broadcast cache eviction to ALL workers via Redis pub/sub so stale
    // handles to the about-to-be-replaced file are closed everywhere,
    // then wait a grace period for the eviction to propagate.
    //
    try {
      await client.publish('db_cache_evict', aliasId);
    } catch (err) {
      logger.debug(err);
    }

    if (databaseMap) databaseMap.evict(aliasId);

    await setTimeout(ms('1s'));

    //
    // Checkpoint WAL so all committed data is in the main DB file.
    // The result is parsed fail-closed: an unexpected shape is treated
    // as busy so we never swap while another connection is active.
    //
    const checkpointResult = db.pragma('wal_checkpoint(TRUNCATE)');
    let busy = 1;
    if (
      Array.isArray(checkpointResult) &&
      checkpointResult.length > 0 &&
      typeof checkpointResult[0].busy === 'number'
    ) {
      busy = checkpointResult[0].busy;
    }

    if (busy !== 0) {
      const err = new Error(
        `VACUUM aborted, checkpoint busy for ${dbFilePath} (another connection is still reading or writing)`
      );
      err.code = 'SQLITE_BUSY';
      throw err;
    }

    // Clean up any stale tmp file from a previous failed attempt
    try {
      fs.unlinkSync(tmpPath);
    } catch {}

    // Set auto_vacuum mode to FULL and VACUUM INTO the temp file
    db.pragma('auto_vacuum=FULL');
    db.exec(`VACUUM INTO '${tmpPath.replace(/'/g, "''")}';`);

    //
    // SAFETY: Verify the new file is a valid encrypted database
    // BEFORE replacing the original. This prevents SQLITE_NOTADB
    // if VACUUM produced a corrupt or incomplete file.
    //
    let verifyDb;
    try {
      verifyDb = new Database(tmpPath, {
        timeout: config.busyTimeout,
        verbose: boolean(env.SQLITE_VERBOSE) ? console.log : null
      });
      await setupPragma(verifyDb, session);
      // Quick integrity check — reads first page + schema
      const integrityResult = verifyDb.pragma('quick_check', {
        simple: true
      });
      if (integrityResult !== 'ok') {
        throw new Error(
          `VACUUM INTO integrity check failed: ${integrityResult}`
        );
      }
    } finally {
      if (verifyDb && verifyDb.open) verifyDb.close();
    }

    // Close our handle directly — better-sqlite3 transactions are
    // synchronous, so no transaction can be in-flight at this point.
    // (Avoid closeDatabase()'s `optimize` write inside the swap.)
    try {
      if (db.open) db.close();
    } catch {
      const err = new Error(
        `VACUUM aborted, failed to close handle for ${dbFilePath}`
      );
      err.code = 'SQLITE_BUSY';
      throw err;
    }

    //
    // Exclusivity proof: after our handle is closed and every other
    // worker has evicted theirs, no -wal/-shm files may exist.  If they
    // do, a stale handle somewhere is still writing to the old inode and
    // swapping would orphan its encrypted -wal onto the new file.
    //
    if (
      fs.existsSync(`${dbFilePath}-wal`) ||
      fs.existsSync(`${dbFilePath}-shm`)
    ) {
      const err = new Error(
        `VACUUM aborted, exclusivity proof failed for ${dbFilePath} (-wal/-shm still exist after close)`
      );
      err.code = 'SQLITE_BUSY';
      throw err;
    }

    //
    // Ownership re-check: if our locks expired during a long VACUUM and
    // were re-acquired (or force-deleted by corruption recovery), abort
    // rather than rename a possibly-stale snapshot over the live file.
    //
    const [vacuumOwner, swapOwner] = await client.mget(
      vacuumLockKey,
      swapLockKey
    );
    if (vacuumOwner !== lockOwner || swapOwner !== lockOwner) {
      const err = new Error(
        `VACUUM aborted, lost lock ownership for ${dbFilePath}`
      );
      err.code = 'SQLITE_BUSY';
      throw err;
    }

    // Atomic rename (same filesystem, so this is atomic on Linux)
    fs.renameSync(tmpPath, dbFilePath);

    // Best-effort removal of any -wal/-shm recreated between close and rename
    for (const suffix of ['-wal', '-shm']) {
      try {
        fs.unlinkSync(`${dbFilePath}${suffix}`);
      } catch {}
    }

    //
    // Second eviction broadcast: closes any handle that was opened and
    // cached in the proof→rename gap, before waiting contenders unblock.
    //
    try {
      await client.publish('db_cache_evict', aliasId);
    } catch (err) {
      logger.debug(err);
    }

    swapped = true;
    return { swapped: true };
  } finally {
    //
    // Release the distributed locks (only if we still own them).
    // On failure also clean up the tmp file if it still exists.
    //
    if (swapAcquired) {
      await client
        .eval(RELEASE_LOCK_SCRIPT, 1, swapLockKey, lockOwner)
        .catch((err) => logger.debug(err));
    }

    await client
      .eval(RELEASE_LOCK_SCRIPT, 1, vacuumLockKey, lockOwner)
      .catch((err) => logger.debug(err));

    if (!swapped) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {}
    }
  }
}

module.exports = safeVacuum;
