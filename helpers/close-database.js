/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');

const logger = require('#helpers/logger');

//
// SQLite error codes that indicate the on-disk file is being concurrently
// mutated by ANOTHER process (the legacy listener during a rolling deploy, or a
// fallback-rerouted worker) at the moment we run close-time maintenance. These
// are transient and MUST NOT crash the idle-sweep / eviction path. When we see
// one we skip the optional maintenance and still attempt a clean close.
//
// - SQLITE_IOERR_SHORT_READ: a read returned fewer bytes than requested, i.e. a
//   page was mid-write by another process (the exact error seen in production
//   from `PRAGMA optimize` during `_sweepIdle`).
// - SQLITE_NOTADB / SQLITE_CORRUPT: header/page read raced a concurrent
//   checkpoint/rewrite in another process.
// - SQLITE_BUSY / SQLITE_LOCKED / SQLITE_BUSY_SNAPSHOT: another connection holds
//   a lock; maintenance is not worth contending for.
//
const TRANSIENT_CLOSE_CODES = new Set([
  'SQLITE_IOERR_SHORT_READ',
  'SQLITE_IOERR',
  'SQLITE_NOTADB',
  'SQLITE_CORRUPT',
  'SQLITE_BUSY',
  'SQLITE_BUSY_SNAPSHOT',
  'SQLITE_LOCKED'
]);

function isTransientCloseError(err) {
  if (!err) return false;
  if (err.code && TRANSIENT_CLOSE_CODES.has(err.code)) return true;
  // better-sqlite3 sometimes surfaces the code only in the message
  return (
    typeof err.message === 'string' &&
    /sqlite_ioerr_short_read|disk i\/o error|not a database|database disk image is malformed/i.test(
      err.message
    )
  );
}

//
// Gracefully close a SQLite database connection.
//
// IMPORTANT (architecture): this runs from the per-worker DatabaseLRUMap idle
// sweep / eviction. Because legacy-port support and affinity fallback can mean
// the SAME alias file is transiently open in two processes, close-time work must
// be CONCURRENCY-SAFE:
//
//   1. `PRAGMA optimize` performs ANALYZE, which READS large portions of the
//      file/indexes. If another process is mid-write, that read fails with
//      SQLITE_IOERR_SHORT_READ. We therefore run it best-effort in its own
//      try/catch, swallow transient I/O errors, and NEVER let it abort the
//      close. It is pure optimization; skipping it is harmless.
//
//   2. `db.close()` is always attempted. better-sqlite3's close only performs a
//      checkpoint when this is the last connection in THIS process, and it is
//      WAL-safe across processes, so it will not corrupt a file another process
//      is using.
//
// The net effect: an idle sweep can no longer throw an unhandled
// SQLITE_IOERR_SHORT_READ (or related) error, which is what flooded the
// production logs and which (via repeated failed sweeps + reconnects) drove the
// WebSocket slowness.
//
async function closeDatabase(db) {
  if (!db || !db.open) return;

  if (db.inTransaction) {
    try {
      await pWaitFor(() => !db.inTransaction, {
        timeout: ms('30s')
      });
    } catch (err) {
      err.message = `Shutdown could not cancel transaction: ${err.message}`;
      err.isCodeBug = true;
      logger.error(err, { db });
    }
  }

  // Best-effort, concurrency-safe optimization. Never allow a transient
  // cross-process I/O error here to abort the close (or crash the sweep timer).
  try {
    db.pragma('analysis_limit=400');
    db.pragma('optimize');
  } catch (err) {
    if (isTransientCloseError(err)) {
      // Expected under cross-process concurrency (legacy/fallback). Downgrade to
      // debug so it does not spam error logs, and continue to close cleanly.
      logger.debug('skipped PRAGMA optimize on close (transient)', {
        code: err.code,
        message: err.message
      });
    } else {
      logger.error(err, { db });
    }
  }

  // Always attempt a clean close, tolerating the same transient errors.
  try {
    if (db.open) db.close();
  } catch (err) {
    if (isTransientCloseError(err)) {
      logger.debug('transient error during db.close()', {
        code: err.code,
        message: err.message
      });
    } else {
      logger.error(err, { db });
    }
  }
}

module.exports = closeDatabase;
module.exports.isTransientCloseError = isTransientCloseError;
module.exports.TRANSIENT_CLOSE_CODES = TRANSIENT_CLOSE_CODES;
