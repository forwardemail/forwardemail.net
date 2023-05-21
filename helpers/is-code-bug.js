const { CONNECTION_CLOSED_ERROR_MSG } = require('ioredis/built/utils');
const { boolean } = require('boolean');

const isErrorConstructorName = require('./is-error-constructor-name');

function isCodeBug(err) {
  return boolean(
    err.isCodeBug === true ||
      err.message === CONNECTION_CLOSED_ERROR_MSG ||
      isErrorConstructorName(err, 'TypeError') ||
      isErrorConstructorName(err, 'SyntaxError') ||
      isErrorConstructorName(err, 'ReferenceError') ||
      isErrorConstructorName(err, 'RangeError') ||
      isErrorConstructorName(err, 'URIError') ||
      isErrorConstructorName(err, 'EvalError') ||
      isErrorConstructorName(err, 'MongooseError') ||
      isErrorConstructorName(err, 'MongoError') ||
      isErrorConstructorName(err, 'RedisError')
  );
}

module.exports = isCodeBug;
