/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const process = require('node:process');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const ms = require('ms');

const logger = require('#helpers/logger');

//
// Filesystem mutex for a SQLite database file.
//
// Replacing a live WAL-mode database file (rekey, VACUUM swap) is only safe
// when no connection to the *old* inode exists and none can be opened until
// the new file is in place: a connection opened in that window creates
// `<db>-wal` / `<db>-shm` files BY NAME next to the freshly renamed file, and
// the next opener replays that WAL (pages encrypted with the old key) into the
// new database -- SQLITE_NOTADB / SQLITE_CORRUPT.
//
// The Redis `db_swap_lock` cannot close that window on its own: a process may
// check it, then have its event loop stall (an inline VACUUM, a large FETCH)
// for longer than the swapper's grace period before it reaches `new
// Database()`.  This mutex is taken *synchronously* around the open itself,
// so the swapper cannot proceed while an open is in progress and no open can
// start while the swapper holds it.
//
// `mkdir` is atomic on every filesystem this runs on (including NFS), which
// makes the lock directory the mutex.  An `owner` file inside it carries a
// lease (`expires_at`) that the holder keeps refreshing for as long as it
// holds the lock, so that:
//   - a lock left behind by a crashed process is broken once its lease
//     expires (an open leases seconds, a swap minutes)
//   - a live holder is never mistaken for a dead one, however long it holds
//     the lock (its lease keeps moving)
//   - a holder can verify it still owns the lock before doing anything
//     irreversible (a broken lock must never be released by its old owner)
//
// Breaking a stale lock renames the directory away first: `rename` is atomic,
// so of two processes breaking the same stale lock only one succeeds and
// neither can remove a lock that a third process just re-created.
//
// All SQLite files for one alias live next to each other, so the lock lives
// next to the database: `<db>.lock/`.
//
// The lease is compared with the clock of the process that reads it; every
// process that takes these locks runs on the SQLite host (one clock).  The
// owner file is best effort: a holder that cannot write it (a full disk)
// still holds a valid lock.  Every refresh also touches the directory's
// mtime, and a lock whose owner file cannot be read (a holder died between
// `mkdir` and writing it, a full disk, or it is being rewritten right now)
// is judged by that mtime with the longest lease instead.
//
// A holder refreshes its lease through the file descriptor it opened when it
// took the lock, never by path: once its lock was broken (renamed away) the
// descriptor points at the old file, so a refresh that races with the break
// can never overwrite the owner file of the process that took the lock over.
// Ownership itself is checked by the directory's inode (the directory a
// holder created moves away with its inode when the lock is broken) and,
// when an owner file is readable, by its token.
//
const LEASE_MS = {
  //
  // `new Database()` + `setupPragma`: milliseconds, seconds under load.  The
  // lease is nevertheless generous: an open is one synchronous block, so a
  // process that stalls inside it (an I/O stall on the volume) cannot
  // refresh its lease, and a swapper that breaks the lock of such a
  // stalled-but-alive open could swap the file underneath it.  Two minutes
  // of stall means the volume is unusable anyway, and a lock left by a
  // process that crashed while opening only delays that alias' opens (a
  // waiter gives up after DEFAULT_TIMEOUT_MS and the client retries).
  //
  open: ms('2m'),
  // an exclusivity proof (up to REKEY_QUIESCE_TIMEOUT), a rename, and the
  // MongoDB/Redis round-trips around them
  default: ms('2m')
};
const DEFAULT_TIMEOUT_MS = ms('2m');
// how much lease must remain for a holder to still trust its ownership
const SAFETY_MARGIN_MS = ms('2s');
const HOSTNAME = os.hostname();

function getDbFileLockPath(dbFilePath) {
  return `${dbFilePath}.lock`;
}

function getOwnerPath(lockPath) {
  return `${lockPath}/owner`;
}

//
// Read the owner file.  A read that overlaps a refresh (see `writeOwner`)
// may in theory see mixed old and new bytes, so a file that does not parse
// is read again a couple of times before giving up.  Returns `null` when
// there is no (readable) owner file.
//
function readOwner(lockPath) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let data;
    try {
      data = fs.readFileSync(getOwnerPath(lockPath), 'utf8');
    } catch {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch {
      // torn read: try again
    }
  }

  return null;
}

function getLeaseMs(purpose, leaseMs) {
  return leaseMs || LEASE_MS[purpose] || LEASE_MS.default;
}

//
// A lock is stale once its lease expired.  Without a readable owner file the
// directory's mtime (touched with every refresh) plus the longest lease is
// used.
//
function isStale(lockPath) {
  const owner = readOwner(lockPath);
  if (owner && typeof owner.expires_at === 'number')
    return Date.now() > owner.expires_at;

  let mtimeMs;
  try {
    mtimeMs = fs.statSync(lockPath).mtimeMs;
  } catch {
    // vanished between our attempt and now
    return false;
  }

  return Date.now() - mtimeMs > LEASE_MS.default;
}

function getInode(lockPath) {
  try {
    return fs.statSync(lockPath, { bigint: true }).ino;
  } catch {
    return null;
  }
}

//
// Remove a stale lock.  The directory is renamed away first so that only one
// of several racing breakers wins, and so that a lock that another process
// created in between (after the rename) can never be removed by mistake.
//
function breakStaleLock(lockPath) {
  const graveyard = `${lockPath}.stale-${randomUUID()}`;
  try {
    fs.renameSync(lockPath, graveyard);
  } catch {
    // somebody else broke (or released) it first
    return false;
  }

  try {
    fs.rmSync(graveyard, { recursive: true, force: true });
  } catch (err) {
    logger.debug(err);
  }

  return true;
}

//
// The owner file is rewritten in place through the descriptor: its content
// has a constant length for a given holder, so a single write at offset 0
// replaces it without ever exposing an empty or truncated file to a reader.
//
function writeOwner(fd, owner) {
  const data = JSON.stringify(owner);
  fs.writeSync(fd, data, 0);
  fs.ftruncateSync(fd, Buffer.byteLength(data));
}

function closeQuietly(fd) {
  try {
    fs.closeSync(fd);
  } catch {}
}

//
// Acquire the mutex.  Resolves with a lock object:
//
//   lock.token       unique owner token
//   lock.brokeStale  a stale lock had to be broken to acquire this one
//   lock.isOwned()   true while the lock directory is still the one we
//                    created (and our lease has not lapsed)
//   lock.release()   removes the lock only if we still own it
//
// Rejects with a retryable `SQLITE_BUSY` error after `timeoutMs` (also when
// a stale lock cannot be broken, e.g. on a read-only volume), and with
// `SQLITE_CANTOPEN` when the lock cannot be created at all.
//
async function acquireDbFileLock(
  dbFilePath,
  { purpose = 'open', timeoutMs = DEFAULT_TIMEOUT_MS, leaseMs, staleMs } = {}
) {
  const lockPath = getDbFileLockPath(dbFilePath);
  const token = randomUUID();
  const lease = getLeaseMs(purpose, leaseMs || staleMs);
  const started = Date.now();
  let attempt = 0;

  // the lease we last wrote successfully (by this process' clock)
  let expiresAt = 0;
  const owner = () => ({
    token,
    purpose,
    pid: process.pid,
    hostname: HOSTNAME,
    acquired_at: new Date(started).toISOString(),
    expires_at: Date.now() + lease
  });

  // descriptor of our owner file (see `writeOwner`), if it could be created
  let fd;

  // inode of the lock directory we created (its identity)
  let lockIno;

  // whether a stale lock had to be broken to get here
  let brokeStale = false;

  //
  // Extend the lease: the owner file (best effort) and the directory's
  // mtime (what other processes fall back to without an owner file).  The
  // lease counts as extended once the directory was touched.
  //
  const refresh = () => {
    const next = owner();
    if (fd !== undefined) {
      try {
        writeOwner(fd, next);
      } catch (err) {
        logger.debug(err);
      }
    }

    const now = new Date();
    fs.utimesSync(lockPath, now, now);
    expiresAt = next.expires_at;
  };

  const timedOut = () => {
    const busy = new Error(
      `Timed out waiting for database file lock ${lockPath}`
    );
    busy.code = 'SQLITE_BUSY';
    busy.isDbFileLock = true;
    return busy;
  };

  for (;;) {
    try {
      fs.mkdirSync(lockPath);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        //
        // The mailbox directory is missing, not writable or the volume is
        // read-only: the same failure `new Database()` reports when it
        // cannot create the file, classified the same way for callers.
        //
        err.code = 'SQLITE_CANTOPEN';
        err.isDbFileLock = true;
        throw err;
      }

      //
      // A lock whose lease expired belongs to a process that died while
      // holding it (a live holder keeps refreshing its lease).  Breaking it
      // can fail for good (a read-only volume), so it is bounded by the
      // same deadline as waiting for it.
      //
      if (isStale(lockPath)) {
        const previousOwner = readOwner(lockPath);
        if (breakStaleLock(lockPath)) {
          brokeStale = true;
          logger.warn('Broke stale database file lock', {
            lockPath,
            owner: previousOwner
          });
          continue;
        }
      }

      if (Date.now() - started > timeoutMs) throw timedOut();

      // opens hold the lock for milliseconds; back off gently with jitter
      attempt++;
      await setTimeout(Math.min(250, 10 * attempt) + Math.random() * 10);
      continue;
    }

    lockIno = getInode(lockPath);
    if (lockIno === null) {
      // vanished underneath us (only a stale break could do that): again
      continue;
    }

    //
    // The owner file is best effort: on a full disk the lock is held
    // without one (other processes then judge it by the directory's mtime,
    // which every refresh touches).
    //
    try {
      fd = fs.openSync(getOwnerPath(lockPath), 'w');
      writeOwner(fd, owner());
    } catch (err) {
      if (fd !== undefined) {
        closeQuietly(fd);
        fd = undefined;
      }

      // never leave an empty owner file behind
      try {
        fs.rmSync(getOwnerPath(lockPath), { force: true });
      } catch {}

      logger.warn('Database file lock held without an owner file', {
        err,
        lockPath
      });
    }

    try {
      refresh();
    } catch (err) {
      // the directory cannot even be touched: give the lock up
      if (fd !== undefined) closeQuietly(fd);
      try {
        fs.rmSync(lockPath, { recursive: true, force: true });
      } catch {}

      throw err;
    }

    break;
  }

  //
  // Keep the lease moving while the lock is held.  The timer is unref'd so
  // it never keeps the process alive; a process that dies stops refreshing
  // and its lock expires.
  //
  let refreshTimer = global.setInterval(() => {
    //
    // The lock directory is no longer ours (it was broken, which is only
    // possible after a stall past the lease): nothing to refresh any more.
    // A refresh only ever reaches our own owner file (see `writeOwner`)
    // and our own directory, so nothing of another holder is touched.
    //
    if (getInode(lockPath) !== lockIno) {
      stopRefreshing();
      return;
    }

    try {
      refresh();
    } catch (err) {
      logger.debug(err);
    }
  }, Math.max(1000, Math.floor(lease / 4)));
  refreshTimer.unref();

  function stopRefreshing() {
    if (fd !== undefined) {
      closeQuietly(fd);
      fd = undefined;
    }

    if (!refreshTimer) return;
    global.clearInterval(refreshTimer);
    refreshTimer = null;
  }

  //
  // Ownership is only trusted while our lease is comfortably valid: a
  // breaker only ever touches an EXPIRED lease, so as long as ours has more
  // than `SAFETY_MARGIN_MS` left nobody can have broken and re-created the
  // lock between an ownership check and the action that follows it.  Once
  // the lease has lapsed (this process stalled for longer than the lease)
  // the lock is treated as lost, whatever the owner file says.
  //
  const isOwned = () => {
    if (Date.now() + SAFETY_MARGIN_MS >= expiresAt) return false;
    if (getInode(lockPath) !== lockIno) return false;
    const current = readOwner(lockPath);
    return !current || current.token === token;
  };

  return {
    token,
    lockPath,
    // a broken lock may have belonged to a stalled (not dead) holder whose
    // connection can still appear; swappers double-check their proof then
    brokeStale,
    isOwned,
    release() {
      stopRefreshing();
      if (!isOwned()) return false;
      try {
        fs.rmSync(lockPath, { recursive: true, force: true });
      } catch (err) {
        logger.debug(err);
        return false;
      }

      return true;
    }
  };
}

//
// Run `fn(lock)` while holding the mutex, always releasing it afterwards.
//
async function withDbFileLock(dbFilePath, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  const lock = await acquireDbFileLock(dbFilePath, options);
  try {
    return await fn(lock);
  } finally {
    lock.release();
  }
}

module.exports = {
  DEFAULT_TIMEOUT_MS,
  LEASE_MS,
  acquireDbFileLock,
  getDbFileLockPath,
  withDbFileLock
};
