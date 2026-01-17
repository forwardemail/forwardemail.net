/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// NOTE: DO NOT CHANGE THIS
// eslint-disable-next-line unicorn/prefer-node-protocol
const path = require('path');

const errors = require('@forwardemail/wildduck/lib/errors');

// eslint-disable-next-line n/prefer-global/process
const test = process.env.NODE_ENV === 'test';

// note that we had to specify absolute paths here bc
// otherwise tests run from the root folder wont work
const env = require('@ladjs/env')({
  path: path.join(__dirname, '..', test ? '.env.test' : '.env'),
  defaults: path.join(__dirname, '..', '.env.defaults'),
  schema: path.join(__dirname, '..', '.env.schema')
});

// always show full stack traces for debugging
Error.stackTraceLimit = Number.POSITIVE_INFINITY;

// https://github.com/zone-eu/wildduck/issues/768
if (errors)
  errors.setGelf({
    // emit(...args) {
    emit() {
      // do nothing (noop)
      // TODO: we may want to `logger.debug(...args)` here
    }
  });

module.exports = env;
