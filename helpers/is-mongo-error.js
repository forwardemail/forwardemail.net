/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isErrorConstructorName = require('./is-error-constructor-name');

function isMongoError(err) {
  if (typeof err !== 'object') return false;
  if (
    (isErrorConstructorName(err, 'MongooseError') &&
      !isErrorConstructorName(err, 'ValidationError')) ||
    isErrorConstructorName(err, 'MongoError') ||
    isErrorConstructorName(err, 'MongoServerError') ||
    isErrorConstructorName(err, 'MongoRuntimeError') ||
    isErrorConstructorName(err, 'MongoBulkWriteError') ||
    isErrorConstructorName(err, 'MongoNetworkError') ||
    isErrorConstructorName(err, 'MongoNotConnectedError') ||
    isErrorConstructorName(err, 'MongoNetworkTimeoutError') ||
    isErrorConstructorName(err, 'PoolClearedOnNetworkError') ||
    isErrorConstructorName(err, 'MongoPoolClearedError') ||
    isErrorConstructorName(err, 'MongooseServerSelectionError')
  )
    return true;
  return false;
}

module.exports = isMongoError;
