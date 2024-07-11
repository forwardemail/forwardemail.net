/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// this is ignored in browser config
const { CONNECTION_CLOSED_ERROR_MSG } = require('ioredis/built/utils');

const { boolean } = require('boolean');

const isErrorConstructorName = require('./is-error-constructor-name');

// eslint-disable-next-line complexity
function isCodeBug(err) {
  const bool = boolean(
    err.isCodeBug === true ||
      err.babylonError || // pug-related
      err.component || // pug-related
      (CONNECTION_CLOSED_ERROR_MSG &&
        err.message === CONNECTION_CLOSED_ERROR_MSG) ||
      err.name === 'SqliteError' ||
      err.code === 'SQLITE_ERROR' ||
      err.name === 'MongooseServerSelectionError' ||
      err.name === 'MongoBulkWriteError' ||
      err.name === 'MongoNetworkError' ||
      err.name === 'MongoNetworkTimeoutError' ||
      err.name === 'PoolClearedOnNetworkError' ||
      err.name === 'MongoPoolClearedError' ||
      // <https://github.com/WiseLibs/better-sqlite3/blob/007d43e229190618884a9f976909c0b14a17d82c/docs/api.md?plain=1#L611>
      (typeof err.code === 'string' &&
        err.code.startsWith('UNKNOWN_SQLITE_ERROR_')) ||
      // safeguard in case of sqlite errors
      (typeof err.code === 'string' && err.code.startsWith('SQLITE_')) ||
      isErrorConstructorName(err, 'SqliteError') ||
      isErrorConstructorName(err, 'TypeError') ||
      isErrorConstructorName(err, 'SyntaxError') ||
      isErrorConstructorName(err, 'ReferenceError') ||
      isErrorConstructorName(err, 'RangeError') ||
      isErrorConstructorName(err, 'URIError') ||
      isErrorConstructorName(err, 'EvalError') ||
      (isErrorConstructorName(err, 'MongooseError') &&
        !isErrorConstructorName(err, 'ValidationError')) ||
      isErrorConstructorName(err, 'MongoError') ||
      isErrorConstructorName(err, 'MongoBulkWriteError') ||
      isErrorConstructorName(err, 'MongoNetworkError') ||
      isErrorConstructorName(err, 'MongoNetworkTimeoutError') ||
      isErrorConstructorName(err, 'PoolClearedOnNetworkError') ||
      isErrorConstructorName(err, 'MongoPoolClearedError') ||
      isErrorConstructorName(err, 'MongooseServerSelectionError') ||
      isErrorConstructorName(err, 'RedisError')
  );
  // safeguard
  err.isCodeBug = bool;
  return bool;
}

module.exports = isCodeBug;
