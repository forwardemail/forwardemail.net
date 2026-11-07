/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');

const falso = require('@ngneat/falso');
const request = require('supertest');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownWebServer);

const {
  saltField,
  hashField,
  attemptsField,
  iterations: LEGACY_ITERATIONS,
  pbkdf2Iterations,
  pbkdf2Keylen,
  keylen,
  digestAlgorithm,
  encoding,
  saltlen
} = {
  saltField: 'salt',
  hashField: 'hash',
  ...config.passportLocalMongoose
};

// (a hash made before is 512 bytes, a new one is one SHA-256 block)
function pbkdf2(password, salt, iterations) {
  return crypto
    .pbkdf2Sync(
      password,
      salt,
      iterations,
      iterations === LEGACY_ITERATIONS ? keylen : pbkdf2Keylen,
      digestAlgorithm
    )
    .toString(encoding);
}

// an account whose password was hashed before salts recorded the iterations
async function makeLegacyUser(t, password) {
  let user = await t.context.userFactory.make();
  user = await Users.register(user, falso.randPassword());
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  await user.save();

  const salt = crypto.randomBytes(saltlen).toString(encoding);
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [saltField]: salt,
        [hashField]: pbkdf2(password, salt, LEGACY_ITERATIONS)
      }
    }
  );
  return { user, salt };
}

function getStored(user) {
  return Users.collection.findOne(
    { _id: user._id },
    { projection: { [saltField]: 1, [hashField]: 1, [attemptsField]: 1 } }
  );
}

// a failed login makes passport-local-mongoose refuse the next attempt for
// `interval` ms (AttemptTooSoonError, a 429), so wait it out before retrying
function waitForRetry() {
  return delay(config.passportLocalMongoose.interval + 50);
}

function login(t, email, password) {
  return request(t.context._web.server)
    .post('/en/login')
    .set('Accept', 'application/json')
    .send({ email, password });
}

test('a password hashed before keeps logging in and is rehashed once', async (t) => {
  const password = falso.randPassword();
  const { user, salt } = await makeLegacyUser(t, password);

  const first = await login(t, user.email, password);
  t.is(first.status, 200);

  const stored = await getStored(user);
  t.not(stored[saltField], salt);
  t.true(stored[saltField].startsWith(`${pbkdf2Iterations}$`));
  t.is(
    stored[hashField],
    pbkdf2(password, stored[saltField], pbkdf2Iterations)
  );

  // and the new hash logs in, and is left as it is
  const second = await login(t, user.email, password);
  t.is(second.status, 200);
  const again = await getStored(user);
  t.is(again[saltField], stored[saltField]);
  t.is(again[hashField], stored[hashField]);
});

test('a wrong password does not log in nor change a hash made before', async (t) => {
  const password = falso.randPassword();
  const { user, salt } = await makeLegacyUser(t, password);

  const res = await login(t, user.email, `${password}x`);
  t.not(res.status, 200);

  const stored = await getStored(user);
  t.is(stored[saltField], salt);
  t.is(stored[hashField], pbkdf2(password, salt, LEGACY_ITERATIONS));
  t.is(stored[attemptsField], 1);

  // the right one still does, after that
  await waitForRetry();
  const ok = await login(t, user.email, password);
  t.is(ok.status, 200);
});

test('a password set before today’s strength rules still logs in and is rehashed', async (t) => {
  // (the rehash does not run the password validator again)
  const password = 'password';
  const { user } = await makeLegacyUser(t, password);

  const res = await login(t, user.email, password);
  t.is(res.status, 200);
  const stored = await getStored(user);
  t.true(stored[saltField].startsWith(`${pbkdf2Iterations}$`));
});

test('a password changed from one hashed before is hashed with the new iterations', async (t) => {
  const password = falso.randPassword();
  const newPassword = falso.randPassword();
  const { user } = await makeLegacyUser(t, password);

  const doc = await Users.findById(user._id).select(
    `+${saltField} +${hashField}`
  );
  await doc.changePassword(password, newPassword);

  const stored = await getStored(user);
  t.true(stored[saltField].startsWith(`${pbkdf2Iterations}$`));
  t.is(
    stored[hashField],
    pbkdf2(newPassword, stored[saltField], pbkdf2Iterations)
  );

  const oldLogin = await login(t, user.email, password);
  t.not(oldLogin.status, 200);
  await waitForRetry();
  const newLogin = await login(t, user.email, newPassword);
  t.is(newLogin.status, 200);
});

test('a new password is hashed with the new iterations', async (t) => {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasVerifiedEmail] = true;
  await user.save();

  const stored = await getStored(user);
  t.true(stored[saltField].startsWith(`${pbkdf2Iterations}$`));
  t.is(
    stored[hashField],
    pbkdf2(password, stored[saltField], pbkdf2Iterations)
  );
  const res = await login(t, user.email, password);
  t.is(res.status, 200);
});
