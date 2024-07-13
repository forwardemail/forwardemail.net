/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

function isLockingError(err) {
  if (typeof err !== 'object') return false;

  // for instances of IMAP_WRITE_LOCK_FAILED
  if (err.imapResponse === 'INUSE') return true;

  // better-sqlite3 will return this error message as a TypeError
  if (err.message === 'This database connection is busy executing a query')
    return true;

  // in case database is locked, consider it a timeout error
  if (err.code && config.LOCK_ERRORS.has(err.code)) return true;

  return false;
}

module.exports = isLockingError;
