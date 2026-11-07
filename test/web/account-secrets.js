/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Account secrets are encrypted (or stored as a digest) at rest, and are
// still shown and sent as before: the two-factor setup pages, the recovery
// keys download, the Security page, and the email change, verification and
// password reset emails.
//

const test = require('ava');

//
// (the emails are captured: the email helper is replaced before the app
// loads it, so the links and codes they carry can be followed)
//
const sent = [];
const emailPath = require.resolve('#helpers/email');
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(data) {
    sent.push(data);
    return { info: {} };
  }
};

const falso = require('@ngneat/falso');
const request = require('supertest');
const { authenticator } = require('otplib');

const utils = require('../utils');
const config = require('#config');
const { Users } = require('#models');

const { otpToken } = config.passport.fields;
const { otpRecoveryKeys } = config.userFields;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user[config.passport.fields.otpEnabled] = true;
  t.context.user = await user.save();
  t.context.webConfig = { passport: { providers: { otp: true } } };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
  // (two-factor is set up in the tests)
  t.context.user[config.passport.fields.otpEnabled] = false;
  await t.context.user.save();
  sent.length = 0;
});
test.afterEach.always(utils.teardownWebServer);

// (the locals of the last email sent with a template)
async function emailLocals(template) {
  for (let i = 0; i < 100; i++) {
    const found = sent.findLast((data) => data.template === template);
    if (found) return found.locals;

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }

  throw new Error(`No ${template} email was sent`);
}

function stored(user) {
  return Users.collection.findOne({ _id: user._id });
}

// (a field as it is stored)
async function storedValue(user, field) {
  const raw = await stored(user);
  return raw[field];
}

test('two-factor setup shows the secret and recovery keys', async (t) => {
  const { web, user, password } = t.context;
  const doc = await Users.findById(user._id);
  const raw = await stored(user);
  const keys = [...doc[otpRecoveryKeys]];
  const secret = doc[otpToken];
  t.is(keys.length, 10);

  // the recovery keys, as shown and copied
  let res = await web.get(`/en${config.otpRoutePrefix}/setup`);
  t.is(res.status, 200);
  for (const key of keys) t.true(res.text.includes(key));
  t.true(res.text.includes(`data-clipboard-text="${keys.join('\r\n')}"`));
  for (const value of [raw[otpToken], ...raw[otpRecoveryKeys]])
    t.false(res.text.includes(value));

  // the secret, as shown to type in
  res = await web
    .post(`/en${config.otpRoutePrefix}/setup`)
    .send({ token: null, password });
  t.is(res.status, 200);
  t.true(res.text.includes(`value="${secret}"`));
  t.false(res.text.includes(raw[otpToken]));

  // and a passcode from it enables two-factor
  res = await web
    .post(`/en${config.otpRoutePrefix}/setup`)
    .set('Accept', 'text/html')
    .send({ token: authenticator.generate(secret), password });
  t.is(res.status, 302);
  const enabled = await Users.findById(user._id);
  t.true(enabled[config.passport.fields.otpEnabled]);

  // the recovery keys download
  res = await web
    .post('/en/my-account/recovery-keys')
    .buffer(true)
    .parse((response, fn) => {
      let text = '';
      response.on('data', (chunk) => {
        text += chunk;
      });
      response.on('end', () => fn(null, text));
    });
  t.is(res.status, 200);
  t.is(res.body, keys.join('\n'));
});

test('the Security page and API token work with two-factor on', async (t) => {
  const { web, user } = t.context;
  const doc = await Users.findById(user._id);
  doc[config.passport.fields.otpEnabled] = true;
  doc[otpRecoveryKeys] = ['1111111111', '2222222222'];
  await doc.save();
  const raw = await stored(user);

  let res = await web
    .post(`/en${config.loginOtpRoute}`)
    .send({ passcode: authenticator.generate(doc[otpToken]) });
  t.is(res.status, 200);

  res = await web.get('/en/my-account/security').set('Accept', 'text/html');
  t.is(res.status, 200);
  for (const value of [
    raw[config.userFields.apiToken],
    raw[config.userFields.apiTokenHash],
    raw[otpToken],
    ...raw[otpRecoveryKeys]
  ])
    t.false(res.text.includes(value));

  res = await web
    .get('/en/my-account/security/api-token')
    .set('Accept', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Sec-Fetch-Site', 'same-origin');
  t.deepEqual(res.body, { api_token: doc[config.userFields.apiToken] });
});

test('the email change link is sent, sent again, and works', async (t) => {
  const { web, user, password } = t.context;
  const email = falso.randEmail().toLowerCase();

  let res = await web
    .put('/en/my-account/profile')
    .set('Accept', 'application/json')
    .send({ email, password });
  t.is(res.status, 200);
  const { link } = await emailLocals('change-email');
  const token = link.split('/').pop();
  t.not(await storedValue(user, config.userFields.changeEmailToken), token);

  // sent again, with the same link
  sent.length = 0;
  res = await web
    .put('/en/my-account/profile/resend-email-change')
    .set('Accept', 'application/json')
    .send({});
  t.is(res.status, 200);
  const resent = await emailLocals('change-email');
  t.is(resent.link, link);

  res = await web
    .post(`/en/my-account/change-email/${token}`)
    .set('Accept', 'application/json')
    .send({ password });
  t.is(res.status, 200);
  t.is(await storedValue(user, 'email'), email);
});

test('the verification code is sent and works', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    { $set: { [config.userFields.hasVerifiedEmail]: false } }
  );

  await web.get('/en/verify').set('Accept', 'text/html');
  const { pin } = await emailLocals('verify');
  t.regex(pin, /^\d{6}$/);
  t.not(await storedValue(user, config.userFields.verificationPin), pin);

  const res = await web
    .post('/en/verify')
    .set('Accept', 'application/json')
    .send({ pin });
  t.is(res.status, 200);
  t.true(await storedValue(user, config.userFields.hasVerifiedEmail));
});

test('the password reset link is sent and works', async (t) => {
  const { user } = t.context;
  // (signed out)
  const web = request.agent(t.context._web.server);

  let res = await web
    .post('/en/forgot-password')
    .set('Accept', 'application/json')
    .send({ email: user.email });
  t.is(res.status, 200);
  const { link } = await emailLocals('reset-password');
  const token = link.split('/').pop();
  t.not(await storedValue(user, config.userFields.resetToken), token);

  res = await web
    .post(`/en/reset-password/${token}`)
    .set('Accept', 'application/json')
    .send({ email: user.email, password: falso.randPassword() });
  t.is(res.status, 200);
  t.falsy(await storedValue(user, config.userFields.resetToken));
});
