/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const closeDatabase = require('#helpers/close-database');
const env = require('#config/env');
const logger = require('#helpers/logger');

//
// LRU Map for SQLite database connections with worker affinity.
//
// Features:
// - Max size limit (configurable via DATABASE_MAP_MAX_SIZE, default 3000)
// - Batch LRU eviction (10% at capacity to avoid per-request eviction overhead)
// - Dual idle TTL: shorter for databases without active WebSocket sessions,
//   longer for databases with active sessions (IMAP IDLE, etc.)
// - Active session refcounting: tracks which alias_ids have connected clients
// - Safe async close with transaction awareness
//
// Eviction cadence is intentionally LAX by default (longer sweep interval and
// longer idle TTLs). Aggressive eviction makes closeDatabase() (which runs
// PRAGMA optimize + db.close(), checkpointing/truncating the WAL) fire far more
// often, widening the window for a concurrent reader/writer to hit a torn page
// (SQLITE_IOERR_SHORT_READ / SQLITE_NOTADB). Every cadence knob is overridable
// via env so operators can tune without code changes.
//
class DatabaseLRUMap {
  constructor(options = {}) {
    this.maxSize = options.maxSize || Number(env.DATABASE_MAP_MAX_SIZE) || 3000;
    this.activeIdleTTL =
      options.activeIdleTTL ||
      (env.DATABASE_MAP_ACTIVE_IDLE_TTL
        ? ms(env.DATABASE_MAP_ACTIVE_IDLE_TTL)
        : ms('10m'));
    this.inactiveIdleTTL =
      options.inactiveIdleTTL ||
      (env.DATABASE_MAP_INACTIVE_IDLE_TTL
        ? ms(env.DATABASE_MAP_INACTIVE_IDLE_TTL)
        : ms('5m'));
    this.sweepInterval =
      options.sweepInterval ||
      (env.DATABASE_MAP_SWEEP_INTERVAL
        ? ms(env.DATABASE_MAP_SWEEP_INTERVAL)
        : ms('60s'));
    this.batchEvictPercent = options.batchEvictPercent || 0.1; // evict 10% at capacity
    this._map = new Map(); // alias_id -> { db, lastAccess }
    this._closing = new Set(); // alias_ids currently being closed
    this._activeSessions = new Map(); // alias_id -> refcount (number of connected WS clients)

    // Periodic sweep to close idle databases
    this._sweepInterval = setInterval(() => {
      this._sweepIdle();
    }, this.sweepInterval);
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

  set(key, db) {
    // If already exists, just update
    if (this._map.has(key)) {
      const entry = this._map.get(key);
      entry.db = db;
      entry.lastAccess = Date.now();
      return this;
    }

    // Batch evict LRU entries if at capacity
    if (this._map.size >= this.maxSize) {
      this._batchEvictLRU();
    }

    this._map.set(key, {
      db,
      lastAccess: Date.now()
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

  // For compatibility with Map iteration (used in graceful shutdown)
  keys() {
    return this._map.keys();
  }

  // For compatibility with graceful shutdown: get raw db by key without LRU touch
  getRaw(key) {
    const entry = this._map.get(key);
    return entry ? entry.db : undefined;
  }

  //
  // Active session tracking.
  // Called when a WebSocket client sends a request for an alias_id.
  // Databases with active sessions get a longer idle TTL.
  //
  addActiveSession(aliasId) {
    const current = this._activeSessions.get(aliasId) || 0;
    this._activeSessions.set(aliasId, current + 1);
  }

  removeActiveSession(aliasId) {
    const current = this._activeSessions.get(aliasId) || 0;
    if (current <= 1) {
      this._activeSessions.delete(aliasId);
    } else {
      this._activeSessions.set(aliasId, current - 1);
    }
  }

  hasActiveSession(aliasId) {
    return (this._activeSessions.get(aliasId) || 0) > 0;
  }

  //
  // Batch evict 10% of the map (least recently used entries).
  // This amortizes the cost of eviction vs evicting one at a time.
  //
  _batchEvictLRU() {
    const evictCount = Math.max(
      1,
      Math.ceil(this._map.size * this.batchEvictPercent)
    );

    // Build a sorted list of eviction candidates (skip in-transaction and active sessions)
    const candidates = [];
    for (const [key, entry] of this._map) {
      if (this._closing.has(key)) continue;
      if (entry.db && entry.db.inTransaction) continue;
      // Prefer evicting databases without active sessions
      candidates.push({
        key,
        lastAccess: entry.lastAccess,
        hasSession: this.hasActiveSession(key)
      });
    }

    // Sort: inactive first, then by oldest access time
    candidates.sort((a, b) => {
      if (a.hasSession !== b.hasSession) return a.hasSession ? 1 : -1;
      return a.lastAccess - b.lastAccess;
    });

    const toEvict = candidates.slice(0, evictCount);
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

    if (toEvict.length > 0) {
      logger.debug(
        `DatabaseLRUMap: batch evicted ${toEvict.length} databases (map size: ${this._map.size}/${this.maxSize})`
      );
    }
  }

  //
  // Sweep idle databases based on dual TTL (lax defaults):
  // - Databases with active WebSocket sessions: activeIdleTTL (default 10 min)
  // - Databases without active sessions: inactiveIdleTTL (default 5 min)
  //
  _sweepIdle() {
    const now = Date.now();
    const toEvict = [];
    for (const [key, entry] of this._map) {
      // Skip entries in transaction or currently being closed
      if (entry.db && entry.db.inTransaction) continue;
      if (this._closing.has(key)) continue;

      const ttl = this.hasActiveSession(key)
        ? this.activeIdleTTL
        : this.inactiveIdleTTL;
      if (now - entry.lastAccess > ttl) {
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
      logger.debug(
        `DatabaseLRUMap: swept ${toEvict.length} idle databases (map size: ${this._map.size})`
      );
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

    this._map.clear();
    this._activeSessions.clear();
    await Promise.allSettled(promises);
  }

  // Destroy the interval (for tests)
  destroy() {
    clearInterval(this._sweepInterval);
  }
}

module.exports = DatabaseLRUMap;
