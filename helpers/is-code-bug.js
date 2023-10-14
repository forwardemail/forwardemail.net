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
