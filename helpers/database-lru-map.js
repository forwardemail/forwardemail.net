/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const closeDatabase = require('#helpers/close-database');
const env = require('#config/env');
const logger = require('#helpers/logger');

//
// LRU Map for SQLite database connections.
//
// The databaseMap previously used a plain Map() with no eviction,
// causing unbounded memory growth (1.8-3.8 GB per worker) as every
// IMAP user's database was opened and never closed until process restart.
//
// This class provides:
// - Max size limit (configurable, default 200 per worker)
// - Idle TTL (close databases not accessed for 5 minutes)
// - LRU eviction (when max size reached, close least recently used)
// - Safe async close with transaction awareness
// - Reference counting to prevent closing databases with in-flight requests
//
class DatabaseLRUMap {
  constructor(options = {}) {
    this.maxSize = options.maxSize || Number(env.DATABASE_MAP_MAX_SIZE) || 200;
    this.idleTTL = options.idleTTL || ms('5m');
    this._map = new Map(); // alias_id -> { db, lastAccess, refcount }
    this._closing = new Set(); // alias_ids currently being closed
    //
    // Handles that were removed from the map (a cross-process cache
    // eviction, a file swap) while a request was still using them.  They
    // are closed as soon as their last reference is released, and retried
    // by the periodic sweep in case the request never released them.
    //
    // Without this a handle whose `close()` threw "busy executing a query"
    // at eviction time would leak forever, keeping its -wal/-shm files
    // alive and blocking every rekey/VACUUM swap of that alias.
    //
    // An alias can have several such handles at once (evicted, reopened,
    // evicted again), so they are kept per handle.  A request that never
    // releases its reference (a crash inside the handler) must not pin the
    // handle forever either: the sweep force-closes a pending handle after
    // `pendingCloseGraceMs`.  The same goes for a handle that the deferred
    // maintenance of `getDatabase` is still using (`maintenanceActive` on
    // the evicted entry, which is kept for that reason).
    //
    this._pendingClose = new Map(); // alias_id -> [{ db, entry, refcount, since }]
    this.pendingCloseGraceMs = options.pendingCloseGraceMs || ms('5m');

    // Periodic sweep to close idle databases
    this._sweepInterval = setInterval(() => {
      this._sweepIdle();
      this._closePending();
    }, ms('1m'));
    this._sweepInterval.unref();
  }

  get size() {
    return this._map.size;
  }

  has(key) {
    return this._map.has(key);
  }

  get(key) {
    const entry = this._map.get(key);
    if (!entry) return undefined;
    // Update last access time (LRU touch)
    entry.lastAccess = Date.now();
    return entry.db;
  }

  //
  // Acquire a reference to the database handle.
  // Increments refcount so eviction/sweep will not close it.
  // Caller MUST call release(key, db) when the request is done.
  //
  // `db` is the handle the request is going to use.  The alias may have
  // been evicted (and reopened) between the moment the request obtained the
  // handle and this call, in which case the reference belongs to the
  // evicted handle -- which is then kept open until it is released -- and
  // not to whatever handle is in the map now.  Returns the handle the
  // reference was taken on, or `undefined` when none was taken (the handle
  // is not cached at all: an eviction already closed it).
  //
  acquire(key, db) {
    const entry = this._map.get(key);
    if (entry && (!db || entry.db === db)) {
      entry.lastAccess = Date.now();
      entry.refcount = (entry.refcount || 0) + 1;
      return entry.db;
    }

    if (!db) return undefined;

    const pending = (this._pendingClose.get(key) || []).find(
      (candidate) => candidate.db === db
    );
    if (!pending) return undefined;
    pending.refcount = (pending.refcount || 0) + 1;
    return pending.db;
  }

  //
  // Release a reference to the database handle.
  // Decrements refcount. If the entry was marked for deferred close
  // (removed from map while refcount > 0), close it now.
  //
  // `db` is the handle the releasing request was actually using: the alias
  // may have been evicted and reopened since the request acquired it, in
  // which case the reference belongs to the evicted (pending) handle and not
  // to the one now in the map.
  //
  release(key, db) {
    const entry = this._map.get(key);
    const pendings = this._pendingClose.get(key);

    if (entry && (!db || entry.db === db)) {
      entry.refcount = Math.max(0, (entry.refcount || 0) - 1);
      return;
    }

    if (!pendings) return;

    // The handle was evicted while this request was using it: close it now
    // that the request is done (a swap may be waiting for its -wal/-shm).
    const pending = db
      ? pendings.find((candidate) => candidate.db === db)
      : pendings.find((candidate) => candidate.refcount > 0);
    if (!pending) return;
    pending.refcount = Math.max(0, (pending.refcount || 0) - 1);
    if (!this._isPendingInUse(pending)) this._closePendingEntry(key, pending);
  }

  //
  // The deferred maintenance of `getDatabase` is done with the handle.  If
  // the handle was evicted meanwhile (a file swap may be waiting for its
  // -wal/-shm files to disappear) it is closed now rather than at the next
  // sweep, provided no request still references it.
  //
  maintenanceDone(key, db) {
    const entry = this._map.get(key);
    if (entry && (!db || entry.db === db)) {
      entry.maintenanceActive = false;
      return;
    }

    for (const pending of this._pendingClose.get(key) || []) {
      if (db && pending.db !== db) continue;
      if (pending.entry) pending.entry.maintenanceActive = false;
      if (!this._isPendingInUse(pending)) this._closePendingEntry(key, pending);
    }
  }

  // Whether a request or the deferred maintenance still uses the handle
  _isPendingInUse(pending) {
    return (
      pending.refcount > 0 ||
      Boolean(pending.entry && pending.entry.maintenanceActive)
    );
  }

  //
  // Remove an entry from the map and close its handle as soon as it is no
  // longer in use.  Returns true when the handle was closed immediately.
  //
  // Used for cross-process cache eviction broadcasts (`db_cache_evict`) and
  // before a file swap, where the handle MUST end up closed even if a request
  // is mid-query right now.
  //
  evictAndClose(key) {
    const entry = this._map.get(key);
    if (!entry) {
      // maybe some are already pending: retry the idle ones
      let closedAll = true;
      for (const pending of this._pendingClose.get(key) || []) {
        if (
          this._isPendingInUse(pending) ||
          !this._closePendingEntry(key, pending)
        )
          closedAll = false;
      }

      return closedAll && !this._pendingClose.has(key);
    }

    this._map.delete(key);
    if (!entry.db || !entry.db.open) return true;

    if (
      (entry.refcount || 0) === 0 &&
      !entry.maintenanceActive &&
      !entry.db.inTransaction
    ) {
      try {
        entry.db.close();
        return true;
      } catch (err) {
        // busy executing a query: fall through to deferred close
        logger.debug(err);
      }
    }

    const pendings = this._pendingClose.get(key) || [];
    pendings.push({
      db: entry.db,
      entry,
      refcount: entry.refcount || 0,
      since: Date.now()
    });
    this._pendingClose.set(key, pendings);
    return false;
  }

  //
  // Close a handle deferred by `evictAndClose`.  Returns true when closed.
  //
  _closePendingEntry(key, pending) {
    const forget = () => {
      const pendings = (this._pendingClose.get(key) || []).filter(
        (candidate) => candidate !== pending
      );
      if (pendings.length === 0) this._pendingClose.delete(key);
      else this._pendingClose.set(key, pendings);
    };

    if (!pending.db || !pending.db.open) {
      forget();
      return true;
    }

    if (pending.db.inTransaction) return false;

    try {
      pending.db.close();
      forget();
      return true;
    } catch (err) {
      // still busy: the sweep will retry
      logger.debug(err);
      return false;
    }
  }

  //
  // Retry every deferred close.  A handle still in use (referenced by a
  // request, or used by the deferred maintenance) is left alone until the
  // grace period has passed (a request that crashed without releasing its
  // reference must not pin the handle forever).
  //
  _closePending() {
    const now = Date.now();
    for (const [key, pendings] of this._pendingClose) {
      for (const pending of pendings) {
        if (
          this._isPendingInUse(pending) &&
          now - pending.since < this.pendingCloseGraceMs
        )
          continue;
        this._closePendingEntry(key, pending);
      }
    }
  }

  // Number of evicted handles still waiting to be closed (for tests/metrics)
  get pendingCloseSize() {
    let size = 0;
    for (const pendings of this._pendingClose.values()) size += pendings.length;
    return size;
  }

  // Number of references requests currently hold on handles (cached or
  // evicted): the work in flight a shutdown waits for.
  get activeReferences() {
    let count = 0;
    for (const entry of this._map.values()) count += entry.refcount || 0;
    for (const pendings of this._pendingClose.values())
      for (const pending of pendings) count += pending.refcount || 0;
    return count;
  }

  set(key, db) {
    // If already exists, just update
    if (this._map.has(key)) {
      const entry = this._map.get(key);
      entry.db = db;
      entry.lastAccess = Date.now();
      return this;
    }

    // Evict LRU entries if at capacity
    if (this._map.size >= this.maxSize) {
      this._evictLRU();
    }

    this._map.set(key, {
      db,
      lastAccess: Date.now(),
      refcount: 0
    });
    return this;
  }

  delete(key) {
    const entry = this._map.get(key);
    if (!entry) return false;
    this._map.delete(key);
    // Close the database asynchronously (fire-and-forget)
    if (entry.db && entry.db.open) {
      closeDatabase(entry.db).catch((err) => {
        logger.error(err);
      });
    }

    return true;
  }

  // Remove entry from the map WITHOUT closing the database.
  // Use this when the caller will close the db handle itself
  // (e.g. VACUUM INTO path that does close + rename + reopen).
  evict(key) {
    const entry = this._map.get(key);
    if (!entry) return false;
    this._map.delete(key);
    return true;
  }

  // For compatibility with Map iteration (used in graceful shutdown)
  keys() {
    return this._map.keys();
  }

  // For compatibility with graceful shutdown: get raw db by key without LRU touch
  getRaw(key) {
    const entry = this._map.get(key);
    return entry ? entry.db : undefined;
  }

  // Evict the least recently used entry
  _evictLRU() {
    let oldestKey = null;
    let oldestTime = Number.POSITIVE_INFINITY;
    for (const [key, entry] of this._map) {
      // Skip entries currently being closed or in transaction
      if (this._closing.has(key)) continue;
      if (entry.db && entry.db.inTransaction) continue;
      // Skip entries with active references (in-flight requests)
      if (entry.refcount > 0) continue;
      // Skip entries with active deferred maintenance (trash cleanup, etc.)
      if (entry.maintenanceActive) continue;
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey !== null) {
      const entry = this._map.get(oldestKey);
      this._map.delete(oldestKey);
      if (entry && entry.db && entry.db.open) {
        this._closing.add(oldestKey);
        closeDatabase(entry.db)
          .catch((err) => {
            logger.error(err);
          })
          .finally(() => {
            this._closing.delete(oldestKey);
          });
      }
    }
  }

  // Sweep idle databases that haven't been accessed within TTL
  _sweepIdle() {
    const now = Date.now();
    const toEvict = [];
    for (const [key, entry] of this._map) {
      if (now - entry.lastAccess > this.idleTTL) {
        // Skip entries in transaction
        if (entry.db && entry.db.inTransaction) continue;
        // Skip entries currently being closed
        if (this._closing.has(key)) continue;
        // Skip entries with active references (in-flight requests)
        if (entry.refcount > 0) continue;
        // Skip entries with active deferred maintenance (trash cleanup, etc.)
        if (entry.maintenanceActive) continue;
        toEvict.push(key);
      }
    }

    for (const key of toEvict) {
      const entry = this._map.get(key);
      this._map.delete(key);
      if (entry && entry.db && entry.db.open) {
        this._closing.add(key);
        closeDatabase(entry.db)
          .catch((err) => {
            logger.error(err);
          })
          .finally(() => {
            this._closing.delete(key);
          });
      }
    }

    if (toEvict.length > 0) {
      logger.debug(`DatabaseLRUMap: swept ${toEvict.length} idle databases`);
    }
  }

  // Graceful shutdown - close all databases
  async closeAll() {
    clearInterval(this._sweepInterval);
    const promises = [];
    for (const entry of this._map.values()) {
      if (entry.db && entry.db.open) {
        promises.push(closeDatabase(entry.db));
      }
    }

    for (const pendings of this._pendingClose.values()) {
      for (const pending of pendings) {
        if (pending.db && pending.db.open) {
          promises.push(closeDatabase(pending.db));
        }
      }
    }

    this._map.clear();
    this._pendingClose.clear();
    await Promise.allSettled(promises);
  }

  // Destroy the interval (for tests)
  destroy() {
    clearInterval(this._sweepInterval);
    this._sweepInterval = null;
  }
}

module.exports = DatabaseLRUMap;
