/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// NOTE: DO NOT CHANGE THIS
// eslint-disable-next-line unicorn/prefer-node-protocol
const path = require('path');

const errors = require('@zone-eu/wildduck/lib/errors');

// eslint-disable-next-line n/prefer-global/process
const test = process.env.NODE_ENV === 'test';

// note that we had to specify absolute paths here bc
// otherwise tests run from the root folder wont work
const env = require('@ladjs/env')({
  path: path.join(__dirname, '..', test ? '.env.test' : '.env'),
  defaults: path.join(__dirname, '..', '.env.defaults'),
  schema: path.join(__dirname, '..', '.env.schema')
});

//
// NOTE: every configured secret is accepted by `helpers/api-secrets` (e.g. for
//       the restricted internal endpoints), so one strong secret is not
//       enough: a leftover weak value (such as the "secret" default) next to
//       it would stay valid; in production every non-empty secret must be at
//       least 32 bytes (empty entries are ignored the same way they are there)
//
if (env.NODE_ENV === 'production') {
  const apiSecrets = (
    Array.isArray(env.API_SECRETS)
      ? env.API_SECRETS
      : typeof env.API_SECRETS === 'string'
      ? env.API_SECRETS.split(',')
      : []
  ).filter((secret) => typeof secret === 'string' && secret);

  if (
    apiSecrets.length === 0 ||
    !apiSecrets.every(
      // eslint-disable-next-line n/prefer-global/buffer
      (secret) => Buffer.byteLength(secret) >= 32
    )
  ) {
    throw new TypeError(
      'API_SECRETS must contain only 32-byte (or longer) secrets in production'
    );
  }
}

// always show full stack traces for debugging
Error.stackTraceLimit = Number.POSITIVE_INFINITY;

// https://github.com/zone-eu/wildduck/issues/768
// (errors is shimmed to {} in browser bundles via the package.json `browser`
// field, so guard against the missing setGelf method to avoid TypeError)
if (errors && typeof errors.setGelf === 'function')
  errors.setGelf({
    // emit(...args) {
    emit() {
      // do nothing (noop)
      // TODO: we may want to `logger.debug(...args)` here
    }
  });

module.exports = env;
