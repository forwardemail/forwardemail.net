/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const config = require('#config');
const disableAPIToken = require('#controllers/web/my-account/disable-api-token');
const resetAPIToken = require('#controllers/web/my-account/reset-api-token');

function createContext(user) {
  return {
    api: true,
    state: { user },
    accepts() {
      return false;
    }
  };
}

test('disables a token without changing its stored value', async (t) => {
  const user = {
    [config.userFields.apiToken]: 'existing-api-token',
    [config.userFields.apiTokenDisabled]: false,
    async save() {
      return this;
    }
  };
  const ctx = createContext(user);

  await disableAPIToken(ctx);

  t.true(user[config.userFields.apiTokenDisabled]);
  t.is(user[config.userFields.apiToken], 'existing-api-token');
  t.deepEqual(ctx.body, { [config.userFields.apiTokenDisabled]: true });
});

test('resets a disabled token as an explicit re-enable operation', async (t) => {
  const user = {
    [config.userFields.apiToken]: 'disabled-api-token',
    [config.userFields.apiTokenDisabled]: true,
    async save() {
      return this;
    }
  };
  const ctx = createContext(user);

  await resetAPIToken(ctx);

  t.false(user[config.userFields.apiTokenDisabled]);
  t.is(user[config.userFields.apiToken], undefined);
  t.deepEqual(ctx.body, { reloadPage: true });
});

test('security view exposes disable and explicit re-enable controls', (t) => {
  const view = fs.readFileSync(
    path.join(
      __dirname,
      '..',
      '..',
      'app',
      'views',
      'my-account',
      'security.pug'
    ),
    'utf8'
  );

  t.true(view.includes('config.userFields.apiTokenDisabled'));
  t.true(view.includes('Disable API Token'));
  t.true(view.includes('Enable and Create New API Token'));
  t.true(view.includes('action=l("/my-account/security/api-token")'));
});
