/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const { boolean } = require('boolean');
const Database = require('better-sqlite3-multiple-ciphers');
const ms = require('ms');

const getPathToDatabase = require('./get-path-to-database');
const logger = require('./logger');
const migrateSchema = require('./migrate-schema');
const setupPragma = require('./setup-pragma');
const { encrypt } = require('./encrypt-decrypt');
const config = require('#config');
const env = require('#config/env');

const ServerShutdownError = require('#helpers/server-shutdown-error');
const TemporaryMessages = require('#models/temporary-messages');

// Unique lock owner identifier for Redis distributed locks (hostname + PID)
// so that different PM2 workers on the same host don't collide.
const LOCK_OWNER = `${os.hostname()}:${process.pid}`;

// Lua script to atomically release a Redis lock only if we still own it.
// Prevents releasing a lock that expired and was re-acquired by another worker.
const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

// Guard to prevent concurrent database opens for the same alias.
// When the first open is in-flight (setupPragma is async and yields the
// event loop), subsequent callers await the same promise instead of opening
// a second handle — which would waste another 100-200ms on SQLCipher keying
// and risk SQLITE_NOTADB on brand-new encrypted databases.
const _tmpDbOpenInflight = new Map();

async function getTemporaryDatabase(session) {
  // if server is shutting down then don't bother getting database
  if (this.isClosing) throw new ServerShutdownError();

  const cacheKey = session.user.alias_id;

  //
  // Check the LRU cache first — avoids re-opening the same temp DB file
  // on every inbound message when the main DB is unavailable.
  //
  if (this.temporaryDatabaseMap && this.temporaryDatabaseMap.has(cacheKey)) {
    const cached = this.temporaryDatabaseMap.get(cacheKey);
    if (cached && cached.open) return cached;
    // If the cached DB was closed externally, remove stale entry
    this.temporaryDatabaseMap.delete(cacheKey);
  }

  //
  // If another call is already opening this temp database (setupPragma is
  // async and yields the event loop), await the same promise to avoid
  // opening a second handle — saves ~100-200ms of SQLCipher key derivation.
  //
  if (_tmpDbOpenInflight.has(cacheKey)) {
    return _tmpDbOpenInflight.get(cacheKey);
  }

  //
  // Distributed lock: prevent multiple PM2 cluster workers from
  // simultaneously initializing the same brand-new temp database.
  // The per-process _tmpDbOpenInflight guard above only prevents intra-process
  // races; this Redis NX lock prevents inter-process races that cause
  // SQLITE_CORRUPT on newly created temp databases.
  //
  // NOTE: Only acquire the lock when the file does NOT exist yet.
  // Existing temp databases are safe to open concurrently (SQLite WAL mode
  // handles multiple readers/writers).  Locking every cache miss causes
  // massive SQLITE_BUSY contention after restarts when caches are cold.
  //
  const tmpStoragePath = getPathToDatabase({
    id: session.user.alias_id,
    storage_location: session.user.storage_location
  });
  const tmpFilePath = path.join(
    path.dirname(tmpStoragePath),
    `${session.user.alias_id}-tmp.sqlite`
  );
  const tmpFileExists = fs.existsSync(tmpFilePath);

  if (this.client && !tmpFileExists) {
    const openLockKey = `db_tmp_open_lock:${cacheKey}`;
    const lockAcquired = await this.client.set(
      openLockKey,
      LOCK_OWNER,
      'PX',
      ms('30s'),
      'NX'
    );

    if (!lockAcquired) {
      // Another worker is initializing this temp database right now.
      // Throw a retryable error so pRetry waits 1s and tries again
      // (by then the DB will be initialized and cached or on disk).
      const err = new Error(
        `Temp database open in progress by another worker for alias ${cacheKey}`
      );
      err.code = 'SQLITE_BUSY';
      throw err;
    }
  }

  const openPromise = (async () => {
    const storagePath = getPathToDatabase({
      id: session.user.alias_id,
      storage_location: session.user.storage_location
    });
    const filePath = path.join(
      path.dirname(storagePath),
      `${session.user.alias_id}-tmp.sqlite`
    );

    const tmpDb = new Database(filePath, {
      // if the db wasn't found it means there wasn't any mail
      // fileMustExist: true,
      timeout: config.busyTimeout,
      // <https://github.com/WiseLibs/better-sqlite3/issues/217#issuecomment-456535384>
      verbose: boolean(env.SQLITE_VERBOSE) ? console.log : null
    });

    const tmpSession = {
      ...session,
      user: {
        ...session.user,
        password: encrypt(
          Array.isArray(env.API_SECRETS) ? env.API_SECRETS[0] : env.API_SECRETS
        )
      }
    };

    try {
      await setupPragma(tmpDb, tmpSession);
    } catch (pragmaErr) {
      // Close the handle to prevent file descriptor leak
      try {
        tmpDb.close();
      } catch {}

      throw pragmaErr;
    }

    //
    // Override cache_size for temporary databases (2MB instead of 64MB).
    // Temp DBs are small and short-lived; 2MB is more than sufficient.
    //
    tmpDb.pragma('cache_size = -2048');

    //
    // Override synchronous to NORMAL for temporary databases.
    // Temp DBs hold ephemeral data that will be re-delivered by the MX server
    // on crash — the durability guarantee of FULL is unnecessary here and the
    // per-commit fsync adds ~5-10ms latency per write that compounds across
    // many aliases (e.g. 50 aliases × 10ms = 500ms wasted).
    //
    tmpDb.pragma('synchronous=NORMAL');

    // migrate schema
    const commands = migrateSchema(this, tmpDb, tmpSession, {
      TemporaryMessages
    });

    if (commands.length > 0) {
      tmpDb.transaction(() => {
        for (const command of commands) {
          try {
            tmpDb.prepare(command).run();
          } catch (err) {
            // duplicate column errors are expected when migration was already applied
            if (err.message.startsWith('duplicate column name:')) {
              logger.debug(err, { command });
            } else {
              err.isCodeBug = true;
              logger.fatal(err, { command });
            }

            // migration support in case existing rows
            if (
              err.message.includes(
                'Cannot add a NOT NULL column with default value NULL'
              ) &&
              command.endsWith(' NOT NULL')
            ) {
              try {
                tmpDb.prepare(command.replace(' NOT NULL', '')).run();
              } catch (err) {
                err.isCodeBug = true;
                logger.fatal(err, { command });
              }
            }
          }
        }
      })();
    }

    // Store in the LRU cache so subsequent calls reuse this connection
    if (this.temporaryDatabaseMap) {
      this.temporaryDatabaseMap.set(cacheKey, tmpDb);
    }

    return tmpDb;
  })();

  _tmpDbOpenInflight.set(cacheKey, openPromise);
  try {
    return await openPromise;
  } finally {
    _tmpDbOpenInflight.delete(cacheKey);
    // Release the distributed lock (only if we acquired it)
    if (this.client && !tmpFileExists) {
      await this.client
        .eval(
          RELEASE_LOCK_SCRIPT,
          1,
          `db_tmp_open_lock:${cacheKey}`,
          LOCK_OWNER
        )
        .catch(() => {});
    }
  }
}

module.exports = getTemporaryDatabase;
