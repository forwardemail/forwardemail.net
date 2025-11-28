/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const util = require('node:util');

const cryptoRandomString = require('crypto-random-string');
const falso = require('@ngneat/falso');
const test = require('ava');
// const { request, errors } = require('undici');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownWebServer);

test('creates new user', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory.make();

  const res = await web.post('/en/register').send({
    email: user.email,
    password: falso.randPassword()
  });

  t.is(res.status, 302);
  t.is(res.header.location, '/en/my-account');
});

/*
test('rejects new user with disposable email', async (t) => {
  const { web } = t.context;

  const response = await request(
    'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json',
    {
      throwOnError: true
    }
  );

  // the error code is between 200-400 (e.g. 302 redirect)
  // in order to mirror the behavior of `throwOnError` we will re-use the undici errors
  // <https://github.com/nodejs/undici/issues/2093>
  if (response.statusCode !== 200)
    throw new errors.ResponseStatusCodeError(
      `Response status code ${response.statusCode}`,
      response.statusCode,
      response.headers
    );

  const json = await response.body.json();

  const res = await web.post('/en/register').send({
    email: `test@${json[0]}`,
    password: falso.randPassword()
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.DISPOSABLE_EMAIL_NOT_ALLOWED);
});
*/

test('fails registering with easy password', async (t) => {
  const { web } = t.context;

  const res = await web.post('/en/register').send({
    email: 'emilydickinson@example.com',
    password: falso.randPassword({ size: 2 })
  });

  t.is(res.status, 400);
  t.regex(
    JSON.parse(res.text).message,
    new RegExp(phrases.INVALID_PASSWORD_STRENGTH, 'g')
  );
});

test('successfully registers with strong password', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory.make();

  const res = await web.post('/en/register').send({
    email: user.email,
    password: falso.randPassword()
  });

  t.is(res.body.message, undefined);
  t.is(res.header.location, '/en/my-account');
  t.is(res.status, 302);
});

test('successfully registers with stronger password', async (t) => {
  const { web } = t.context;

  const password = await cryptoRandomString.async({ length: 50 });
  const res = await web.post('/en/register').send({
    email: 'test123@example.com',
    password
  });

  t.is(res.body.message, undefined);
  t.is(res.header.location, '/en/my-account');
  t.is(res.status, 302);
});

test('fails registering invalid email', async (t) => {
  const { web } = t.context;

  const res = await web.post('/en/register').send({
    email: 'test123',
    password: falso.randPassword()
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_EMAIL);
});

test('if user exists then try to log them in if they were accidentally on the registration page', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory.create();

  const res = await web.post('/en/register').send({
    email: user.email,
    password: falso.randPassword()
  });

  t.is(res.status, 400);
  t.is(
    JSON.parse(res.text).message,
    phrases.PASSPORT_NO_SALT_VALUE_STORED_ERROR
  );
});

test('allows password reset for valid email (HTML)', async (t) => {
  const { web } = t.context;

  const user = await t.context.userFactory.make();

  const res = await web
    .post('/en/forgot-password')
    .set({ Accept: 'text/html' })
    .send({ email: user.email });

  t.is(res.status, 302);
  t.is(res.header.location, '/en');
});

test('allows password reset for valid email (JSON)', async (t) => {
  const { web } = t.context;

  const user = await t.context.userFactory.make();

  const res = await web.post('/en/forgot-password').send({ email: user.email });

  t.is(res.status, 302);
  t.is(res.header.location, '/en');
});

test('resets password with valid email and token (HTML)', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  const user = await t.context.userFactory
    .withState({
      password,
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();
  const { email } = user;

  const res = await web
    .post('/en/reset-password/token')
    .set({ Accept: 'text/html' })
    .send({ email, password });

  t.is(res.status, 302);
  t.is(res.header.location, '/en');
});

test('resets password with valid email and token (JSON)', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  const user = await t.context.userFactory
    .withState({
      password,
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();
  const { email } = user;

  const res = await web
    .post('/en/reset-password/token')
    .send({ email, password });

  t.is(res.status, 302);
  t.is(res.header.location, '/en');
});

test('fails resetting password for non-existent user', async (t) => {
  const { web } = t.context;
  const email = 'test7@example.com';
  const password = falso.randPassword();

  const res = await web
    .post('/en/reset-password/randomtoken')
    .send({ email, password });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RESET_PASSWORD);
});

test('fails resetting password with invalid reset token', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  const user = await t.context.userFactory
    .withState({
      password,
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();
  const { email } = user;

  const res = await web
    .post('/en/reset-password/wrongtoken')
    .send({ email, password });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RESET_PASSWORD);
});

test('fails resetting password with missing new password', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory
    .withState({
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();
  const { email } = user;

  const res = await web.post('/en/reset-password/token').send({ email });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD);
});

test('fails resetting password with invalid email', async (t) => {
  const { web } = t.context;
  await t.context.userFactory
    .withState({
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();

  const res = await web
    .post('/en/reset-password/token')
    .send({ email: 'wrongemail' });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_EMAIL);
});

test('fails resetting password with invalid email + reset token match', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  await t.context.userFactory
    .withState({
      password,
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();

  const res = await web
    .post('/en/reset-password/token')
    .send({ email: 'wrongemail@example.com', password });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RESET_PASSWORD);
});

test('fails resetting password if new password is too weak', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory
    .withState({
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();
  const { email } = user;

  const res = await web
    .post('/en/reset-password/token')
    .send({ email, password: falso.randPassword({ size: 2 }) });

  t.is(res.status, 400);
  t.regex(
    JSON.parse(res.text).message,
    new RegExp(phrases.INVALID_PASSWORD_STRENGTH)
  );
});

test('fails resetting password if reset was already tried in the last 30 mins', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory.create();
  const { email } = user;

  await web.post('/en/forgot-password').send({ email });

  const res = await web.post('/en/forgot-password').send({ email });

  t.is(res.status, 400);
  t.is(
    JSON.parse(res.text).message,
    util.format(phrases.PASSWORD_RESET_LIMIT, 'in 30 minutes')
  );
});
