/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Signing in with Google or GitHub uses the provider's email address only
// when the provider verified it: otherwise anyone could create a provider
// account with a victim's address and sign in to the victim's account.
//

const { randomUUID } = require('node:crypto');

const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.victim = await t.context.userFactory
    .withState({ email: `victim-${randomUUID()}@example.com` })
    .create();
  await utils.setupWebServer(t);
});
test.afterEach.always(utils.teardownWebServer);

// sign in through the web server's passport with a provider profile
function signIn(t, provider, emails) {
  const { passport } = t.context._web;
  const profile = { id: randomUUID(), provider, emails };
  return new Promise((resolve) => {
    passport.loginOrCreateProfile(Users, provider)(
      'access-token',
      'refresh-token',
      profile,
      (err, user) => {
        resolve({ err, user, profile });
      }
    );
  });
}

async function isLinked(t, provider, profile) {
  const user = await Users.findById(t.context.victim._id).lean().exec();
  return user[config.passport.fields[`${provider}ProfileID`]] === profile.id;
}

test('GitHub: an unverified primary address does not sign in', async (t) => {
  const { email } = t.context.victim;
  const { err, profile } = await signIn(t, 'github', [
    { value: email, primary: true, verified: false },
    { value: `other-${randomUUID()}@example.com`, verified: true }
  ]);
  t.is(err?.message, phrases.INVALID_EMAIL);
  t.false(await isLinked(t, 'github', profile));
});

test('GitHub: a verified primary address signs in', async (t) => {
  const { email } = t.context.victim;
  const { err, user, profile } = await signIn(t, 'github', [
    { value: email, primary: true, verified: true }
  ]);
  t.falsy(err);
  t.is(user.id, t.context.victim.id);
  t.true(await isLinked(t, 'github', profile));
});

test('Google: an unverified address does not sign in', async (t) => {
  const { email } = t.context.victim;
  const { err, profile } = await signIn(t, 'google', [
    { value: email, verified: false }
  ]);
  t.is(err?.message, phrases.INVALID_EMAIL);
  t.false(await isLinked(t, 'google', profile));
});

test('Google: a verified address signs in', async (t) => {
  const { email } = t.context.victim;
  const { err, user } = await signIn(t, 'google', [
    { value: email, verified: true }
  ]);
  t.falsy(err);
  t.is(user.id, t.context.victim.id);
});
