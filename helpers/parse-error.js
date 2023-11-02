/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ErrorStackParser = require('error-stack-parser');
const prepareStackTrace = require('prepare-stack-trace');

//
// taken from our other project but should be in its own package
// <https://github.com/cabinjs/parse-logs/blob/b2ecb3f9331c40546309a542e313238dd9897f0c/index.js#L18-L43>
//
function parseError(error) {
  const err = new Error(error.message);
  const { stack } = err;

  for (const prop in error) {
    if (Object.prototype.hasOwnProperty.call(error, prop))
      err[prop] = error[prop];
  }

  if (!err.name && err.constructor.name) err.name = err.constructor.name;

  // <https://github.com/tjmehta/error-to-json/blob/f8c293395c71d157ac96eb83657da9c47d7dadb2/src/index.ts#L55-L56>
  if (err.stack === stack) err.stack = stack.slice(0, stack.indexOf('\n'));

  //
  // Note we could use `stackTrace.parse(err)`
  // however we shouldn't assume that everyone
  // will be sending us Node-like stack traces
  // (e.g. ones converted using StackTrace.JS `fromError`)
  //
  // const stackTrace = require('stack-trace');
  //
  err.stack = prepareStackTrace(err, ErrorStackParser.parse(err));

  return err;
}

module.exports = parseError;
