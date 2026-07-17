/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const { boolean } = require('boolean');
const ms = require('ms');

const closeDatabase = require('#helpers/close-database');
const env = require('#config/env');
const logger = require('#helpers/logger');

//
// LRU Map for SQLite database connections.
//
// Drop-in replacement for Map() with:
// - Max size limit (configurable, default 1000 per worker)
// - Idle TTL (close databases not accessed within idleTTL)
// - Batch eviction (10% of capacity when full)
// - Transaction awareness (never evicts a DB mid-transaction)
// - Safe async close via closeDatabase helper
//
// Protection against evicting active databases:
// 1. get() updates lastAccess — any DB being actively used stays fresh
// 2. inTransaction check — any DB mid-write is never evicted
// 3. idleTTL (5m default) — only DBs untouched for 5 minutes are candidates
//
class DatabaseLRUMap {
  constructor(options = {}) {
    this.maxSize = options.maxSize || Number(env.DATABASE_MAP_MAX_SIZE) || 1000;
    this.idleTTL = options.idleTTL || ms('5m');
    // shrinkTTL: after this idle period, release page cache but keep connection open
    this.shrinkTTL = options.shrinkTTL || ms('2m');
    this._map = new Map(); // key -> { db, lastAccess, shrunk }
    this._closing = new Set(); // keys currently being closed

    // Periodic sweep to close idle databases (every 30s)
    this._sweepInterval = setInterval(() => {
      this._sweepIdle();
    }, ms('30s'));
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
    // Update last access time (LRU touch) — this is what prevents
    // eviction of actively-used databases without needing ref/unref.
    entry.lastAccess = Date.now();
    entry.shrunk = false;
    return entry.db;
  }

  set(key, db) {
    // If already exists, just update
    if (this._map.has(key)) {
      const entry = this._map.get(key);
      entry.db = db;
      entry.lastAccess = Date.now();
      return this;
    }

    // Evict 10% of capacity when full (batch eviction)
    if (this._map.size >= this.maxSize) {
      this._evictBatch();
    }

    this._map.set(key, {
      db,
      lastAccess: Date.now(),
      shrunk: false
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

  // Evict 10% of capacity (batch eviction when map is full)
  _evictBatch() {
    const count = Math.max(1, Math.ceil(this.maxSize * 0.1));
    const candidates = [];
    for (const [key, entry] of this._map) {
      // Skip entries currently being closed
      if (this._closing.has(key)) continue;
      // Skip entries mid-transaction (never evict during a write)
      if (entry.db && entry.db.inTransaction) continue;
      if (entry.db && entry.db.open) {
        candidates.push({ key, lastAccess: entry.lastAccess });
      }
    }

    // Sort by lastAccess ascending (oldest first)
    candidates.sort((a, b) => a.lastAccess - b.lastAccess);

    const toEvict = candidates.slice(0, count);
    for (const { key } of toEvict) {
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
  }

  // Sweep idle databases that haven't been accessed within TTL.
  // Also release page cache (shrink_memory) for semi-idle DBs to
  // prevent unbounded native memory growth from SQLite page caches.
  _sweepIdle() {
    const now = Date.now();
    const toEvict = [];
    let shrunkCount = 0;
    for (const [key, entry] of this._map) {
      if (!entry.db || !entry.db.open) continue;
      if (this._closing.has(key)) continue;
      if (entry.db.inTransaction) continue;

      const idleMs = now - entry.lastAccess;

      if (idleMs > this.idleTTL) {
        // Fully idle — close the connection
        toEvict.push(key);
      } else if (idleMs > this.shrinkTTL && !entry.shrunk) {
        // Semi-idle — release page cache but keep connection open.
        // This reclaims native memory (up to 16MB per DB) without
        // the TTI penalty of reopening the connection on next access.
        try {
          entry.db.pragma('shrink_memory');
          entry.shrunk = true;
          shrunkCount++;
        } catch (err) {
          // Non-fatal: DB may have been closed concurrently
          logger.debug(err);
        }
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

    if (
      (toEvict.length > 0 || shrunkCount > 0) &&
      boolean(env.SQLITE_DEBUG_TIMERS)
    ) {
      console.debug('DatabaseLRUMap sweep', {
        evicted: toEvict.length,
        shrunk: shrunkCount,
        duration_ms: Date.now() - now,
        remaining: this._map.size
      });
    }
  }

  // Graceful shutdown — close all databases within a time budget.
  //
  // The previous implementation fired every closeDatabase() at once; the
  // synchronous wal_checkpoint(PASSIVE) calls serialize on the event loop
  // anyway, and with 1000+ open DBs shutdown exceeded pm2's kill_timeout
  // (30s) so pm2 SIGKILLed the worker mid-close — leaving un-checkpointed
  // WAL files behind. Checkpoint while the budget lasts, then fast-close
  // the rest (their WAL is replayed on next open, same as after SIGKILL,
  // but the fds and process exit cleanly).
  async closeAll(budgetMs = ms('15s')) {
    clearInterval(this._sweepInterval);
    const t0 = Date.now();
    const deadline = t0 + budgetMs;
    const entries = [...this._map.values()];
    this._map.clear();
    let checkpointed = 0;
    let fastClosed = 0;
    for (const entry of entries) {
      if (!entry.db || !entry.db.open) continue;
      if (Date.now() < deadline) {
        await closeDatabase(entry.db).catch((err) => logger.error(err));
        checkpointed++;
      } else {
        try {
          entry.db.close();
        } catch (err) {
          logger.error(err);
        }

        fastClosed++;
      }
    }

    if (checkpointed > 0 || fastClosed > 0)
      console.warn(
        '[CLOSE_ALL] pid=%d checkpointed=%d fastClosed=%d duration=%dms',
        process.pid,
        checkpointed,
        fastClosed,
        Date.now() - t0
      );
  }

  // Destroy the interval (for tests and graceful shutdown)
  destroy() {
    clearInterval(this._sweepInterval);
    this._sweepInterval = null;
  }
}

module.exports = DatabaseLRUMap;
