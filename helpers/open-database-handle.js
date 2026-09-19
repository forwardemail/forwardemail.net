/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Database = require('better-sqlite3-multiple-ciphers');
const { boolean } = require('boolean');

const config = require('#config');
const env = require('#config/env');
const setupPragma = require('#helpers/setup-pragma');
const { acquireDbFileLock } = require('#helpers/db-file-lock');

//
// Open a handle to a live (non-temporary) alias database.
//
// Every open of a live database file must go through here so that it holds
// the database file mutex (see helpers/db-file-lock.js) from `new Database()`
// until the handle is fully initialized.  A file swap (rekey / VACUUM) holds
// the same mutex around its exclusivity proof and rename, which is what makes
// "no -wal/-shm files exist" a proof that no connection exists AND that none
// can appear before the new file is in place.
//
// If the mutex had to be broken as stale by a swapper while we were opening
// (only possible if this process stalled for minutes), the handle may point
// at the replaced inode, so it is discarded and a retryable error is thrown.
//
async function openDatabaseHandle(dbFilePath, session, options = {}) {
  const { readonly = false, lock: lockOptions, ...databaseOptions } = options;

  const lock = await acquireDbFileLock(dbFilePath, {
    purpose: 'open',
    ...lockOptions
  });

  let handle;
  try {
    handle = new Database(dbFilePath, {
      readonly,
      fileMustExist: readonly,
      timeout: config.busyTimeout,
      // <https://github.com/WiseLibs/better-sqlite3/issues/217#issuecomment-456535384>
      verbose: boolean(env.SQLITE_VERBOSE) ? console.log : null,
      ...databaseOptions
    });

    await setupPragma(handle, session); // takes about 30ms

    if (!lock.isOwned()) {
      const err = new Error(
        `Database file lock was lost while opening ${dbFilePath}`
      );
      err.code = 'SQLITE_BUSY';
      err.isDbFileLock = true;
      throw err;
    }

    return handle;
  } catch (err) {
    // never leak a handle (nor its -wal/-shm files) on failure
    try {
      if (handle && handle.open) handle.close();
    } catch {}

    throw err;
  } finally {
    lock.release();
  }
}

module.exports = openDatabaseHandle;
