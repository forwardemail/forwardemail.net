/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isLockingError = require('./is-locking-error');
const isErrorConstructorName = require('./is-error-constructor-name');
const isRedisError = require('./is-redis-error');
const isMongoError = require('./is-mongo-error');

function isTimeoutError(err) {
  if (typeof err !== 'object') return false;

  if (
    isErrorConstructorName(err, 'SocketError') ||
    isErrorConstructorName(err, 'ServerShutdownError')
  )
    return true;

  if (
    isErrorConstructorName(err, 'TimeoutError') ||
    isErrorConstructorName(err, 'AbortError') ||
    isErrorConstructorName(err, 'KnexTimeoutError')
  )
    return true;

  if (isLockingError(err)) return true;

  // redis/mongo connection errors should retry
  // and be considered a timeout error
  if (isRedisError(err) || isMongoError(err)) return true;

  for (const key of ['message', 'response']) {
    if (typeof err[key] !== 'string') continue;
    const str = err[key].toLowerCase();
    if (
      str.includes('request aborted') ||
      str.includes('timeout') ||
      str.includes('request time-out') ||
      str.includes('timeout - closing connection') ||
      str.includes('connection timed out')
    )
      return true;
  }

  return false;
}

module.exports = isTimeoutError;
