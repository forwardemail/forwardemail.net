/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  t.context.token = randomUUID();
  t.context.newEmail = `change-email-${randomUUID()}@example.com`;
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user[config.userFields.changeEmailToken] = t.context.token;
  user[config.userFields.changeEmailTokenExpiresAt] = new Date(
    Date.now() + 60_000
  );
  user[config.userFields.changeEmailNewAddress] = t.context.newEmail;
  t.context.user = await user.save();

  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

test('renders only a valid pending change with both email addresses', async (t) => {
  const { newEmail, token, user, web } = t.context;
  const response = await web
    .get(`/en/my-account/change-email/${token}`)
    .set('Accept', 'text/html');

  t.is(response.status, 200);
  t.true(response.text.includes(user.email));
  t.true(response.text.includes(newEmail));
  t.false(response.text.includes('%s'));
  t.false(response.text.includes('name="email"'));
});

test('rejects an invalid change-email token before rendering', async (t) => {
  const { web } = t.context;
  const response = await web
    .get(`/en/my-account/change-email/${randomUUID()}`)
    .set('Accept', 'application/json');

  t.is(response.status, 400);
  t.is(response.body.message, phrases.LINK_EXPIRED_OR_INVALID);
});

test('rejects another account’s pending change link', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  const token = randomUUID();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user[config.userFields.changeEmailToken] = token;
  user[config.userFields.changeEmailTokenExpiresAt] = new Date(
    Date.now() + 60_000
  );
  user[
    config.userFields.changeEmailNewAddress
  ] = `change-email-${randomUUID()}@example.com`;
  await user.save();

  const response = await web
    .get(`/en/my-account/change-email/${token}`)
    .set('Accept', 'application/json');

  t.is(response.status, 400);
  t.is(response.body.message, phrases.LINK_EXPIRED_OR_INVALID);
});

test('confirms a pending change without a client-provided current email', async (t) => {
  const { newEmail, password, token, user, web } = t.context;
  const response = await web
    .post(`/en/my-account/change-email/${token}`)
    .set('Accept', 'application/json')
    .send({ password });

  t.is(response.status, 200);
  t.is(response.body.redirectTo, '/en');

  const updated = await Users.findById(user._id);
  t.is(updated.email, newEmail);
  t.is(updated[config.userFields.changeEmailToken], undefined);
  t.is(updated[config.userFields.changeEmailTokenExpiresAt], undefined);
  t.is(updated[config.userFields.changeEmailNewAddress], undefined);
});
