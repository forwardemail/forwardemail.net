/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function isTimeoutError(err) {
  if (typeof err !== 'object') return false;

  if (err.name === 'TimeoutError' || err.name === 'AbortError') return true;

  // better-sqlite3 will return this error message as a TypeError
  if (err.message === 'This database connection is busy executing a query')
    return true;

  // in case database is locked, consider it a timeout error
  if (err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_LOCKED') return true;

  for (const key of ['message', 'response']) {
    if (typeof err[key] !== 'string') continue;
    if (
      err[key].includes('Request aborted') ||
      err[key].includes('Timeout') ||
      err[key].includes('Request Time-out') ||
      err[key].includes('Timeout - closing connection')
    )
      return true;
  }

  return false;
}

module.exports = isTimeoutError;
