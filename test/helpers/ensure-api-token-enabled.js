/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const config = require('#config');
const phrases = require('#config/phrases');
const ensureApiTokenEnabled = require('#helpers/ensure-api-token-enabled');

test('returns the user when API-token access is enabled', (t) => {
  const user = {
    [config.userFields.apiTokenDisabled]: false
  };

  const userWithoutDisabledState = {};

  t.is(ensureApiTokenEnabled(user), user);
  t.is(
    ensureApiTokenEnabled(userWithoutDisabledState),
    userWithoutDisabledState
  );
});

test('rejects explicitly disabled API keys with the configured error phrase', (t) => {
  const user = {
    [config.userFields.apiTokenDisabled]: true
  };
  const ctx = {
    translateError(key) {
      t.is(key, 'API_TOKEN_DISABLED');
      return phrases[key];
    }
  };

  const error = t.throws(() => ensureApiTokenEnabled(user, ctx));

  t.true(error.isBoom);
  t.is(error.output.statusCode, 401);
  t.is(error.statusCode, 401);
  t.is(error.message, phrases.API_TOKEN_DISABLED);
});

test('uses the configured error phrase when no Koa context is available', (t) => {
  const error = t.throws(() =>
    ensureApiTokenEnabled({ [config.userFields.apiTokenDisabled]: true })
  );

  t.is(error.message, phrases.API_TOKEN_DISABLED);
});
