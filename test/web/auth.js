/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const cryptoRandomString = require('crypto-random-string');
const falso = require('@ngneat/falso');
const request = require('supertest');
const test = require('ava');
// const { request, errors } = require('undici');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

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

test('a repeated reset request is answered the same and keeps the first token', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory.create();
  const { email } = user;

  await web.post('/en/forgot-password').send({ email });
  const first = await Users.findById(user._id).lean().exec();
  t.truthy(first[config.userFields.resetToken]);

  const res = await web
    .post('/en/forgot-password')
    .set('Accept', 'application/json')
    .send({ email });
  t.is(res.status, 200);
  t.deepEqual(res.body, { message: phrases.PASSWORD_RESET_SENT });

  // no new token (or email) is issued until the first one expires
  const second = await Users.findById(user._id).lean().exec();
  t.is(
    second[config.userFields.resetToken],
    first[config.userFields.resetToken]
  );
});

test('the reset form answers the same whether or not an account exists', async (t) => {
  const { web } = t.context;
  // an account with an outstanding reset, one without, and no account
  const pending = await t.context.userFactory
    .withState({
      [config.userFields.resetToken]: 'outstanding',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 60_000)
    })
    .create();
  const existing = await t.context.userFactory.create();
  const unknown = await t.context.userFactory.make();

  const responses = [];
  for (const { email } of [pending, existing, unknown]) {
    const res = await web
      .post('/en/forgot-password')
      .set('Accept', 'application/json')
      .send({ email });
    responses.push({ status: res.status, body: res.body });
  }

  t.deepEqual(responses[0], responses[2]);
  t.deepEqual(responses[1], responses[2]);
});

test('allows a new reset request once the prior token has expired', async (t) => {
  const { web } = t.context;

  // simulate a user whose previous reset token has already expired
  // (expiry in the past). previously the rate-limit guard compared the
  // expiry against `now - timeout`, which kept blocking new requests for a
  // full timeout window after the token had already expired. a new request
  // should now be allowed immediately once the token is expired.
  const user = await t.context.userFactory
    .withState({
      [config.userFields.resetToken]: 'expiredtoken',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() - 1000)
    })
    .create();
  const { email } = user;

  const res = await web
    .post('/en/forgot-password')
    .set({ Accept: 'text/html' })
    .send({ email });

  t.is(res.status, 302);
  t.is(res.header.location, '/en');
});

function getSetCookies(res) {
  const cookies = {};
  for (const header of res.headers['set-cookie'] || []) {
    const [pair] = header.split(';');
    const index = pair.indexOf('=');
    cookies[pair.slice(0, index)] = pair.slice(index + 1);
  }

  return cookies;
}

function toCookieHeader(cookies) {
  return Object.entries(cookies)
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

test('logging in issues a new session id and the previous one does not authenticate', async (t) => {
  const { _web } = t.context;
  const key = _web.config.cookiesKey;
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  await user.save();

  // an anonymous visit creates a session (it stores where to return to)
  const anonymous = await request(_web.server).get('/en/my-account/security');
  t.is(anonymous.status, 302);
  const before = getSetCookies(anonymous);
  t.truthy(before[key]);
  const beforeSession = {
    [key]: before[key],
    [`${key}.sig`]: before[`${key}.sig`]
  };

  const login = await request(_web.server)
    .post('/en/login')
    .set('Accept', 'application/json')
    .set('Cookie', toCookieHeader(beforeSession))
    .send({ email: user.email, password });
  t.is(login.status, 200);
  // session state such as the return path survives the new session id
  t.is(login.body.redirectTo, '/en/my-account/security');

  const after = { ...beforeSession, ...getSetCookies(login) };
  t.truthy(after[key]);
  t.not(after[key], before[key]);

  const current = await request(_web.server)
    .get('/en/my-account/security')
    .set('Cookie', toCookieHeader(after));
  t.is(current.status, 200);

  const previous = await request(_web.server)
    .get('/en/my-account/security')
    .set('Cookie', toCookieHeader(beforeSession));
  t.is(previous.status, 302);
  t.true(previous.header.location.startsWith('/en/login'));
});

test('a password reset of a never-verified account removes sign-ins someone else added', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  // e.g. an account created through the API for someone else's address,
  // with a passkey and two-factor added before the owner recovered it
  const user = await t.context.userFactory
    .withState({
      [config.userFields.hasVerifiedEmail]: false,
      [config.userFields.apiToken]: 'token-of-whoever-created-it',
      [config.passport.fields.otpEnabled]: true,
      [config.passport.fields.otpToken]: 'JBSWY3DPEHPK3PXP',
      [config.userFields.otpRecoveryKeys]: ['a-recovery-key'],
      passkeys: [
        {
          nickname: 'not yours',
          credentialId: 'credential-id',
          publicKey: 'public-key',
          sha256: 'sha256'
        }
      ],
      [config.userFields.resetToken]: 'unverified-reset-token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();

  const res = await web
    .post('/en/reset-password/unverified-reset-token')
    .set({ Accept: 'text/html' })
    .send({ email: user.email, password });
  t.is(res.status, 302);

  const fresh = await Users.findById(user._id)
    .select(`+${config.passport.fields.otpToken}`)
    .lean()
    .exec();
  t.deepEqual(fresh.passkeys, []);
  t.false(fresh[config.passport.fields.otpEnabled]);
  t.not(fresh[config.passport.fields.otpToken], 'JBSWY3DPEHPK3PXP');
  t.false(fresh[config.userFields.otpRecoveryKeys].includes('a-recovery-key'));
  t.truthy(fresh[config.userFields.apiToken]);
  t.not(fresh[config.userFields.apiToken], 'token-of-whoever-created-it');
});

test('a password reset of a verified account keeps its passkeys and API token', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  const user = await t.context.userFactory
    .withState({
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.apiToken]: 'the-owners-token',
      passkeys: [
        {
          nickname: 'mine',
          credentialId: 'credential-id-2',
          publicKey: 'public-key',
          sha256: 'sha256'
        }
      ],
      [config.userFields.resetToken]: 'verified-reset-token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();

  const res = await web
    .post('/en/reset-password/verified-reset-token')
    .set({ Accept: 'text/html' })
    .send({ email: user.email, password });
  t.is(res.status, 302);

  const fresh = await Users.findById(user._id).lean().exec();
  t.is(fresh.passkeys.length, 1);
  t.is(fresh[config.userFields.apiToken], 'the-owners-token');
});

test('passkeys and two-factor cannot be added before the email is verified', async (t) => {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = false;
  await user.save();
  const web = request.agent(t.context._web.server);
  await web.post('/en/login').send({ email: user.email, password });

  let res = await web
    .post('/en/my-account/passkeys')
    .set('Accept', 'application/json')
    .send({ response: {} });
  t.is(res.status, 403);
  t.is(res.body.message, phrases.EMAIL_VERIFICATION_REQUIRED);

  res = await web
    .post('/en/otp/setup')
    .set('Accept', 'application/json')
    .send({ password });
  t.is(res.status, 403);
  t.is(res.body.message, phrases.EMAIL_VERIFICATION_REQUIRED);

  res = await web.get('/en/otp/setup').set('Accept', 'text/html');
  t.is(res.status, 302);
  t.is(res.header.location, `/en${config.verifyRoute}`);

  const fresh = await Users.findById(user._id).lean().exec();
  t.deepEqual(fresh.passkeys, []);
  t.false(fresh[config.passport.fields.otpEnabled]);
});

test('GET /logout ignores a cross-site navigation (CSRF)', async (t) => {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  await user.save();

  const web = request.agent(t.context._web.server);
  await web.post('/en/login').send({ email: user.email, password });

  // a cross-site top-level navigation to the logout link does not sign out
  const crossSite = await web
    .get('/en/logout')
    .set('Sec-Fetch-Site', 'cross-site');
  t.is(crossSite.status, 302);
  // still authenticated: my-account renders (not bounced to login)
  const stillIn = await web.get('/en/my-account/security');
  t.is(stillIn.status, 200);

  // a same-site click still signs out
  const sameSite = await web
    .get('/en/logout')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(sameSite.status, 302);
  const loggedOut = await web.get('/en/my-account/security');
  t.is(loggedOut.status, 302);
  t.true(loggedOut.header.location.includes('/login'));
});
