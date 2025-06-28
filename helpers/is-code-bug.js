/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { boolean } = require('boolean');

const isErrorConstructorName = require('./is-error-constructor-name');
const isMongoError = require('./is-mongo-error');
const isRedisError = require('./is-redis-error');

function isCodeBug(err) {
  const bool = boolean(
    // it was already marked as a code bug
    err.isCodeBug === true ||
      // syscalls
      // <https://github.com/Alex-D/check-disk-space/issues/33>
      typeof err.syscall === 'string' ||
      // pug related
      err.babylonError ||
      err.component ||
      //
      // sqlite related
      //
      err.name === 'SqliteError' ||
      err.code === 'SQLITE_ERROR' ||
      // <https://github.com/WiseLibs/better-sqlite3/blob/007d43e229190618884a9f976909c0b14a17d82c/docs/api.md?plain=1#L611>
      (typeof err.code === 'string' &&
        err.code.startsWith('UNKNOWN_SQLITE_ERROR_')) ||
      // safeguard in case of sqlite errors
      (typeof err.code === 'string' && err.code.startsWith('SQLITE_')) ||
      isErrorConstructorName(err, 'SqliteError') ||
      //
      // javascript errors
      //
      isErrorConstructorName(err, 'TypeError') ||
      isErrorConstructorName(err, 'SyntaxError') ||
      isErrorConstructorName(err, 'ReferenceError') ||
      isErrorConstructorName(err, 'RangeError') ||
      isErrorConstructorName(err, 'URIError') ||
      isErrorConstructorName(err, 'EvalError') ||
      // redis error
      isRedisError(err) ||
      // mongo error
      isMongoError(err)
  );
  // safeguard
  err.isCodeBug = bool;
  return bool;
}

module.exports = isCodeBug;
