/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isErrorConstructorName = require('./is-error-constructor-name');

const constructorNames = [
  'DivergentArrayError',
  'DocumentNotFoundError',
  'MissingSchemaError',
  'MongoAPIError',
  'MongoBatchReExecutionError',
  'MongoBulkWriteError',
  'MongoCompatibilityError',
  'MongoCursorExhaustedError',
  'MongoCursorInUseError',
  'MongoError',
  'MongoExpiredSessionError',
  'MongoInvalidArgumentError',
  'MongoMissingCredentialsError',
  'MongoMissingDependencyError',
  'MongoNetworkError',
  'MongoNetworkTimeoutError',
  'MongoNotConnectedError',
  'MongoParseError',
  'MongoPoolClearedError',
  'MongoRuntimeError',
  'MongoServerClosedError',
  'MongoServerError',
  'MongoTailableCursorError',
  'MongoTopologyClosedError',
  'MongoTransactionError',
  'MongoWriteConcernError',
  'MongoWriteError',
  'MongooseBulkSaveIncompleteError',
  'MongooseServerSelectionError',
  'ObjectExpectedError',
  'ObjectParameterError',
  'OverwriteModelError',
  'ParallelSaveError',
  'PoolClearedOnNetworkError',
  'StrictModeError',
  'StrictPopulateError',
  'ValidatorError',
  'VersionError'
];

function isMongoError(err) {
  if (typeof err !== 'object') return false;

  if (
    isErrorConstructorName(err, 'MongooseError') &&
    !isErrorConstructorName(err, 'ValidationError')
  )
    return true;

  if (
    isErrorConstructorName(err, 'ValidationError') &&
    typeof err.errors === 'object' &&
    Object.keys(err.errors).some((key) =>
      constructorNames.some((constructorName) =>
        isErrorConstructorName(err.errors[key], constructorName)
      )
    )
  )
    return true;

  for (const constructorName of constructorNames) {
    if (isErrorConstructorName(err, constructorName)) return true;
  }

  return false;
}

module.exports = isMongoError;
