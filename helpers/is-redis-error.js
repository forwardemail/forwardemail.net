/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// this is ignored in browser config
const { CONNECTION_CLOSED_ERROR_MSG } = require('ioredis/built/utils');

const isErrorConstructorName = require('./is-error-constructor-name');

function isRedisError(err) {
  if (typeof err !== 'object') return false;
  if (
    CONNECTION_CLOSED_ERROR_MSG &&
    err.message === CONNECTION_CLOSED_ERROR_MSG
  )
    return true;
  if (isErrorConstructorName(err, 'RedisError')) return true;
  return false;
}

module.exports = isRedisError;
