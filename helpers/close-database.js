/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');

const logger = require('#helpers/logger');

async function closeDatabase(db) {
  if (!db.open) return;

  if (db.inTransaction) {
    try {
      await pWaitFor(() => !db.inTransaction, {
        timeout: ms('30s')
      });
    } catch (err) {
      err.message = `Shutdown could not cancel transaction: ${err.message}`;
      // TODO: remove later
      console.error(err);
      err.isCodeBug = true;
      logger.error(err, { db });
    }
  }

  //
  // NOTE: `optimize` may run ANALYZE and therefore can throw (e.g. SQLITE_BUSY
  //       past the busy timeout, SQLITE_FULL, SQLITE_READONLY).  It must never
  //       prevent the handle from being closed, otherwise the handle leaks and
  //       keeps -wal/-shm files alive (and callers that reuse `session.db`
  //       while it is still open would operate on the wrong database).
  //
  if (!db.readonly) {
    try {
      db.pragma('analysis_limit=400');
      db.pragma('optimize');
    } catch (err) {
      // TODO: remove later
      console.error(err);
      logger.error(err, { db });
    }
  }

  try {
    db.close();
  } catch (err) {
    // TODO: remove later
    console.error(err);
    logger.error(err, { db });
  }
}

module.exports = closeDatabase;
