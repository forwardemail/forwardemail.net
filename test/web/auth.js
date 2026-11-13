/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const cryptoRandomString = require('crypto-random-string');
const falso = require('@ngneat/falso');
const ms = require('ms');
const request = require('supertest');
const test = require('ava');
// const { request, errors } = require('undici');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const getGmailVariantsQuery = require('#helpers/get-gmail-variants-query');
const { hashToken } = require('#helpers/encrypt-decrypt');
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

test('signing in without an email address or a password is no error of the server', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory.create();
  await user.setPassword(falso.randPassword());
  await user.save();
  for (const [body, message] of [
    [{}, phrases.PASSPORT_MISSING_USERNAME_ERROR],
    [
      { password: falso.randPassword() },
      phrases.PASSPORT_MISSING_USERNAME_ERROR
    ],
    [{ email: falso.randEmail() }, phrases.PASSPORT_MISSING_PASSWORD_ERROR],
    // (nor with a number or `true` for one, which is read as one)
    [
      { email: 5, password: falso.randPassword() },
      phrases.PASSPORT_MISSING_USERNAME_ERROR
    ],
    [{ email: true, password: true }, phrases.PASSPORT_MISSING_USERNAME_ERROR],
    [
      { email: user.email, password: 5 },
      phrases.PASSPORT_MISSING_PASSWORD_ERROR
    ],
    [
      { email: user.email, password: true },
      phrases.PASSPORT_MISSING_PASSWORD_ERROR
    ]
  ]) {
    const res = await web.post('/en/login').timeout(ms('30s')).send(body);
    t.is(res.status, 400);
    t.is(JSON.parse(res.text).message, message);
  }
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

test('one Gmail account cannot sign up again with dots, a plus tag or googlemail.com', async (t) => {
  const { web } = t.context;
  const name = `gmailtest${cryptoRandomString({ length: 8, type: 'numeric' })}`;
  await t.context.userFactory
    .withState({ email: `${name.slice(0, 4)}.${name.slice(4)}@gmail.com` })
    .create();

  for (const email of [
    `${name}@gmail.com`,
    `${name.slice(0, 2)}.${name.slice(2, 6)}.${name.slice(6)}@gmail.com`,
    `${name}+signup@gmail.com`,
    `${name.slice(0, 3)}.${name.slice(3)}+1@googlemail.com`,
    `${name.toUpperCase()}@Gmail.com`
  ]) {
    const res = await web.post('/en/register').send({
      email,
      password: falso.randPassword()
    });
    t.is(res.status, 400, `${email} should be refused`);
    t.is(JSON.parse(res.text).message, phrases.GMAIL_ACCOUNT_ALREADY_EXISTS);
  }

  t.is(
    await Users.countDocuments(getGmailVariantsQuery(`${name}@gmail.com`)),
    1
  );

  // (another Gmail account can sign up)
  const other = await web.post('/en/register').send({
    email: `${name}0@gmail.com`,
    password: falso.randPassword()
  });
  t.is(other.status, 302);
  t.is(other.header.location, '/en/my-account');
});

test('dots and plus tags still make different accounts outside Gmail', async (t) => {
  const { web } = t.context;
  const name = `othertest${cryptoRandomString({ length: 8, type: 'numeric' })}`;
  await t.context.userFactory
    .withState({ email: `${name.slice(0, 4)}.${name.slice(4)}@example.com` })
    .create();

  for (const email of [`${name}@example.com`, `${name}+1@example.com`]) {
    const res = await web.post('/en/register').send({
      email,
      password: falso.randPassword()
    });
    t.is(res.status, 302, `${email} should sign up`);
  }
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

test('a reset token is stored only as a digest', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory.create();
  const { email } = user;

  await web.post('/en/forgot-password').send({ email });
  const stored = await Users.collection.findOne({ _id: user._id });
  const digest = stored[config.userFields.resetToken];
  t.regex(digest, /^[\da-f]{64}$/);

  // what is stored does not reset the password
  let res = await web
    .post(`/en/reset-password/${digest}`)
    .set('Accept', 'application/json')
    .send({ email, password: falso.randPassword() });
  t.is(res.status, 400);
  t.is(res.body.message, phrases.INVALID_RESET_PASSWORD);

  // the token it is the digest of does
  const token = cryptoRandomString({ length: 32 });
  await Users.collection.updateOne(
    { _id: user._id },
    { $set: { [config.userFields.resetToken]: hashToken(token) } }
  );
  res = await web
    .post(`/en/reset-password/${token}`)
    .set('Accept', 'application/json')
    .send({ email, password: falso.randPassword() });
  t.is(res.status, 200);
  const fresh = await Users.collection.findOne({ _id: user._id });
  t.falsy(fresh[config.userFields.resetToken]);
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

test('a reset link changes the password only once when used twice at once', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory
    .withState({
      password: falso.randPassword(),
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000)
    })
    .create();
  const { email } = user;

  // (the same link open in several tabs, each sent at the same moment)
  const passwords = Array.from({ length: 5 }, () => falso.randPassword());
  const responses = await Promise.all(
    passwords.map((password) =>
      web.post('/en/reset-password/token').send({ email, password })
    )
  );

  const changed = responses.filter((res) => res.status === 302);
  t.is(changed.length, 1);
  for (const res of responses.filter((res) => res.status !== 302)) {
    t.is(res.status, 400);
    t.is(JSON.parse(res.text).message, phrases.INVALID_RESET_PASSWORD);
  }

  // the password is the one the accepted request set
  const stored = await Users.findOne({ email });
  t.falsy(stored[config.userFields.resetToken]);
  const accepted = passwords.find((_, i) => responses[i].status === 302);
  const { user: authenticated } = await stored.authenticate(accepted);
  t.truthy(authenticated);
});

// (as before, a password that is refused leaves the link usable)
test('a reset link still works after a weak password was refused', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory
    .withState({
      password: falso.randPassword(),
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 100_000)
    })
    .create();
  const { email } = user;

  const weak = await web
    .post('/en/reset-password/token')
    .send({ email, password: 'password' });
  t.is(weak.status, 400);
  t.regex(JSON.parse(weak.text).message, /strength/i);

  const password = falso.randPassword();
  const res = await web
    .post('/en/reset-password/token')
    .send({ email, password });
  t.is(res.status, 302);
  const stored = await Users.findOne({ email });
  t.falsy(stored[config.userFields.resetToken]);
  const { user: authenticated } = await stored.authenticate(password);
  t.truthy(authenticated);
});

test('fails resetting password with an expired reset token', async (t) => {
  const { web } = t.context;
  const user = await t.context.userFactory
    .withState({
      password: falso.randPassword(),
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() - 1000)
    })
    .create();

  const res = await web
    .post('/en/reset-password/token')
    .send({ email: user.email, password: falso.randPassword() });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.RESET_TOKEN_EXPIRED);
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

test('a lockout from failed login attempts ends after the lockout window', async (t) => {
  const { _web } = t.context;
  const { attemptsField, lastLoginField, maxAttempts } =
    config.passportLocalMongoose;
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  await user.save();

  function login() {
    return request(_web.server)
      .post('/en/login')
      .set('Accept', 'application/json')
      .send({ email: user.email, password });
  }

  // locked ten minutes ago: past the wait between attempts, still locked
  await Users.updateOne(
    { _id: user._id },
    {
      $set: {
        [attemptsField]: maxAttempts,
        [lastLoginField]: new Date(Date.now() - ms('10m'))
      }
    }
  );
  let res = await login();
  t.is(res.status, 429);
  t.is(res.body.message, phrases.PASSPORT_TOO_MANY_ATTEMPTS_ERROR);

  // locked a day ago: the correct password logs in again
  await Users.updateOne(
    { _id: user._id },
    { $set: { [lastLoginField]: new Date(Date.now() - ms('1d')) } }
  );
  res = await login();
  t.is(res.status, 200);
  user = await Users.findById(user._id).lean().exec();
  t.is(user[attemptsField], 0);
});

test('a password reset ends a lockout from failed login attempts', async (t) => {
  const { web, _web } = t.context;
  const { attemptsField, lastLoginField, maxAttempts } =
    config.passportLocalMongoose;
  const password = falso.randPassword();
  const user = await t.context.userFactory
    .withState({
      [config.userFields.hasSetPassword]: true,
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.resetToken]: 'token',
      [config.userFields.resetTokenExpiresAt]: new Date(Date.now() + 10000),
      [attemptsField]: maxAttempts,
      [lastLoginField]: new Date(Date.now() - ms('10m'))
    })
    .create();

  const reset = await web
    .post('/en/reset-password/token')
    .send({ email: user.email, password });
  t.is(reset.status, 302);

  // (a client without the session the reset signed in to)
  const res = await request(_web.server)
    .post('/en/login')
    .set('Accept', 'application/json')
    .send({ email: user.email, password });
  t.is(res.status, 200);
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

//
// A paid plan counts the address as verified, but anyone can sign up with an
// address they do not own and pay; the account must still lose what they
// added once the owner takes it over, and get no passkey or two-factor first.
//
test('paying for a plan does not prove an address someone signed up with', async (t) => {
  const { web } = t.context;
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user[config.userFields.hasVerifiedEmail] = false;
  user = await Users.register(user, password);
  t.true(user[config.userFields.emailProofPending]);

  user.plan = 'enhanced_protection';
  user[config.userFields.apiToken] = 'token-of-whoever-created-it';
  user[config.userFields.resetToken] = 'paid-reset-token';
  user[config.userFields.resetTokenExpiresAt] = new Date(Date.now() + 10000);
  user = await user.save();
  // (still counted as verified for the plan, as before)
  t.true(user[config.userFields.hasVerifiedEmail]);

  // (no passkey before the address is verified with its code)
  const agent = request.agent(t.context._web.server);
  await agent.post('/en/login').send({ email: user.email, password });
  const passkey = await agent
    .post('/en/my-account/passkeys/confirm-password')
    .set('Accept', 'application/json')
    .set('Origin', t.context.webURL)
    .send({ password });
  t.is(passkey.status, 403);

  // (the owner of the address resets the password)
  const res = await web
    .post('/en/reset-password/paid-reset-token')
    .set({ Accept: 'text/html' })
    .send({ email: user.email, password: falso.randPassword() });
  t.is(res.status, 302);

  const fresh = await Users.findById(user._id).lean().exec();
  t.truthy(fresh[config.userFields.apiToken]);
  t.not(fresh[config.userFields.apiToken], 'token-of-whoever-created-it');
  t.falsy(fresh[config.userFields.emailProofPending]);
  t.true(fresh[config.userFields.hasVerifiedEmail]);
});

test('an address verified with its code is proven, also on a paid plan', async (t) => {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user[config.userFields.hasVerifiedEmail] = false;
  user = await Users.register(user, password);
  user.plan = 'enhanced_protection';
  user[config.userFields.verificationPin] = '123456';
  user[config.userFields.verificationPinExpiresAt] = new Date(
    Date.now() + 60_000
  );
  user[config.userFields.verificationPinSentAt] = new Date();
  user = await user.save();

  const agent = request.agent(t.context._web.server);
  await agent.post('/en/login').send({ email: user.email, password });
  const verified = await agent
    .post('/en/verify')
    .set('Accept', 'application/json')
    .set('Origin', t.context.webURL)
    .send({ pin: '123456' });
  t.is(verified.status, 200);

  const fresh = await Users.findById(user._id).lean().exec();
  t.true(fresh[config.userFields.hasVerifiedEmail]);
  t.falsy(fresh[config.userFields.emailProofPending]);

  // (and existing accounts, verified before this, are as they were)
  const older = await t.context.userFactory
    .withState({ [config.userFields.hasVerifiedEmail]: true })
    .create();
  t.falsy(older[config.userFields.emailProofPending]);
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

  const fresh = await Users.findById(user._id);
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

//
// A passkey signs in with neither the password nor two-factor, so a session
// someone else held for a moment could add one and keep a way back in;
// adding or removing one asks for the current password (as two-factor does).
//
const cbor = require(require.resolve('cbor', {
  paths: [require.resolve('@forwardemail/passport-fido2-webauthn')]
}));

// (a software authenticator: a "none" attestation of a new P-256 key)
async function createPasskeyResponse(web, origin, challenge) {
  if (!challenge) {
    const { body } = await web
      .post('/auth/webauthn/challenge')
      .set('Accept', 'application/json')
      .send({});
    challenge = body.challenge;
  }

  const clientDataJSON = Buffer.from(
    JSON.stringify({
      type: 'webauthn.create',
      challenge,
      origin,
      crossOrigin: false
    })
  );
  const { publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256'
  });
  const jwk = publicKey.export({ format: 'jwk' });
  const coseKey = new Map([
    [1, 2],
    [3, -7],
    [-1, 1],
    [-2, Buffer.from(jwk.x, 'base64url')],
    [-3, Buffer.from(jwk.y, 'base64url')]
  ]);
  const credentialId = crypto.randomBytes(16);
  const length = Buffer.alloc(2);
  length.writeUInt16BE(credentialId.length);
  const authData = Buffer.concat([
    crypto.createHash('sha256').update(new URL(origin).hostname).digest(),
    // (user present, attested credential data)
    Buffer.from([0x41]),
    Buffer.alloc(4),
    Buffer.alloc(16),
    length,
    credentialId,
    cbor.encode(coseKey)
  ]);
  return {
    clientDataJSON: clientDataJSON.toString('base64url'),
    attestationObject: cbor
      .encode({ fmt: 'none', attStmt: {}, authData })
      .toString('base64url'),
    transports: []
  };
}

test('adding or removing a passkey asks for the current password', async (t) => {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  await user.save();
  const web = request.agent(t.context._web.server);
  await web.post('/en/login').send({ email: user.email, password });
  const origin = t.context.webURL;

  for (const attempt of [{}, { password: 'not-the-password' }]) {
    const res = await web
      .post('/en/my-account/passkeys')
      .set('Accept', 'application/json')
      .set('Origin', origin)

      .send({ response: await createPasskeyResponse(web, origin), ...attempt });
    t.is(res.status, 400);
    t.is(res.body.message, phrases.INVALID_PASSWORD);
  }

  let fresh = await Users.findById(user._id).lean();
  t.deepEqual(fresh.passkeys, []);

  // (the password is checked before the browser is asked for a passkey)
  const wrong = await web
    .post('/en/my-account/passkeys/confirm-password')
    .set('Accept', 'application/json')
    .set('Origin', origin)
    .send({ password: 'not-the-password' });
  t.is(wrong.status, 400);
  t.is(wrong.body.message, phrases.INVALID_PASSWORD);
  // (a retry right after failed ones waits a moment, as at sign in)
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  const right = await web
    .post('/en/my-account/passkeys/confirm-password')
    .set('Accept', 'application/json')
    .set('Origin', origin)
    .send({ password });
  t.is(right.status, 200);
  // (with the challenge for the passkey, so the browser is asked right after)
  t.is(typeof right.body.challenge, 'string');

  const added = await web
    .post('/en/my-account/passkeys')
    .set('Accept', 'application/json')
    .set('Origin', origin)
    .send({
      response: await createPasskeyResponse(web, origin, right.body.challenge),
      password
    });
  t.is(added.status, 200);
  fresh = await Users.findById(user._id).lean();
  const [passkey] = fresh.passkeys;
  t.truthy(passkey);

  const notRemoved = await web
    .delete(`/en/my-account/passkeys/${passkey._id}`)
    .set('Accept', 'application/json')
    .send({});
  t.is(notRemoved.status, 400);
  fresh = await Users.findById(user._id).lean();
  t.is(fresh.passkeys.length, 1);

  const removed = await web
    .delete(`/en/my-account/passkeys/${passkey._id}`)
    .set('Accept', 'application/json')
    .send({ password });
  t.is(removed.status, 200);
  fresh = await Users.findById(user._id).lean();
  t.is(fresh.passkeys.length, 0);
});

//
// A request to change the email mails a link to any address, and its answer
// says whether an account already uses that address; cancelling it made
// room for the next one at once, so they were sent without any limit.
//
test('email change requests are rate limited', async (t) => {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  await user.save();
  const web = request.agent(t.context._web.server);
  await web.post('/en/login').send({ email: user.email, password });

  for (let i = 0; i < 10; i++) {
    const res = await web
      .put('/en/my-account/profile')
      .set('Accept', 'application/json')
      .send({
        email: `change-${i}-${cryptoRandomString({ length: 8 })}@example.com`,
        password
      });
    t.is(res.status, 200);

    const cancelled = await web
      .put('/en/my-account/profile/cancel-email-change')
      .set('Accept', 'application/json')
      .send({});
    t.is(cancelled.status, 200);
  }

  const res = await web
    .put('/en/my-account/profile')
    .set('Accept', 'application/json')
    .send({
      email: `change-${cryptoRandomString({ length: 8 })}@example.com`,
      password
    });
  t.is(res.status, 429);

  // (other profile changes are not limited by it)
  const named = await web
    .put('/en/my-account/profile')
    .set('Accept', 'application/json')
    .send({ given_name: 'Somebody' });
  t.is(named.status, 200);
});
