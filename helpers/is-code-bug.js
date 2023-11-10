/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { CONNECTION_CLOSED_ERROR_MSG } = require('ioredis/built/utils');
const { boolean } = require('boolean');

const isErrorConstructorName = require('./is-error-constructor-name');

function isCodeBug(err) {
  const bool = boolean(
    err.isCodeBug === true ||
      err.message === CONNECTION_CLOSED_ERROR_MSG ||
      err.name === 'SqliteError' ||
      err.code === 'SQLITE_ERROR' ||
      // <https://github.com/WiseLibs/better-sqlite3/blob/007d43e229190618884a9f976909c0b14a17d82c/docs/api.md?plain=1#L611>
      (typeof err.code === 'string' &&
        err.code.startsWith('UNKNOWN_SQLITE_ERROR_')) ||
      // safeguard in case of sqlite errors
      (typeof err.code === 'string' && err.code.startsWith('SQLITE_')) ||
      isErrorConstructorName(err, 'SqliteError') ||
      isErrorConstructorName(err, 'TypeError') ||
      isErrorConstructorName(err, 'TypeError') ||
      isErrorConstructorName(err, 'SyntaxError') ||
      isErrorConstructorName(err, 'ReferenceError') ||
      isErrorConstructorName(err, 'RangeError') ||
      isErrorConstructorName(err, 'URIError') ||
      isErrorConstructorName(err, 'EvalError') ||
      (isErrorConstructorName(err, 'MongooseError') &&
        !isErrorConstructorName(err, 'ValidationError')) ||
      isErrorConstructorName(err, 'MongoError') ||
      isErrorConstructorName(err, 'RedisError')
  );
  // safeguard
  err.isCodeBug = bool;
  return bool;
}

module.exports = isCodeBug;
