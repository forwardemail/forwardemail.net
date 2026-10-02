/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Deleting an account, a domain or an alias deletes the push tokens the
// apps registered for its aliases (POST /v1/push-tokens), as the privacy
// policy says. Tokens are registered through the API with the alias's own
// password, the way the apps do it, and the deletions go through the web
// server and the API.
//
// Removing a member hands the member's aliases to an admin, and the
// member's devices stop getting notifications for them.
//
// The account record stays after deletion (for its payment records), but
// without its password or passkeys.
//
// An admin of a team domain that has other admins cannot delete their
// account, since that would delete the domain and the other admins' aliases.
//

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const request = require('supertest');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const PushTokens = require('#models/push-tokens');
const { Aliases, Domains, Payments, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  t.context.user = await createUser(t, { password: t.context.password });
  await utils.setupWebServer(t);
  await utils.loginUser(t);
  await utils.setupApiServer(t);
});
test.afterEach.always(utils.teardownWebServer);
test.afterEach.always(utils.teardownApiServer);

// A paid user whose first payment is older than the five days account and
// domain deletion wait for (helpers/abuse-prevention-by-user-id.js).
async function createUser(t, { password, plan = 'enhanced_protection' } = {}) {
  const tenDaysAgo = dayjs().startOf('day').subtract(10, 'days').toDate();
  let user = await t.context.userFactory
    .withState({
      plan,
      [config.userFields.planSetAt]: tenDaysAgo,
      [config.userFields.hasVerifiedEmail]: true
    })
    .make();
  user = await Users.register(user, password || falso.randPassword());
  user[config.userFields.hasSetPassword] = true;
  user = await user.save();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: tenDaysAgo,
      method: 'free_beta_program',
      duration: ms('30d'),
      plan,
      kind: 'one-time'
    })
    .create();
  return user.save();
}

async function createDomain(t, members, plan = 'enhanced_protection') {
  const domain = await t.context.domainFactory
    .withState({
      members,
      plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  // the alias password only signs in on a verified domain
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);

  return domain;
}

async function createAlias(t, user, domain) {
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();
  const pass = await alias.createToken();
  await alias.save();
  return { alias, email: `${alias.name}@${domain.name}`, pass };
}

// Register a push token the way the apps do: with the alias's own password.
async function registerPushToken(t, { email, pass }, platform, token) {
  const res = await t.context.api
    .post('/v1/push-tokens')
    .set(
      'Authorization',
      `Basic ${Buffer.from(`${email}:${pass}`).toString('base64')}`
    )
    .send({ platform, token, device_name: 'Test device' });
  t.is(res.status, 201);
  return res.body.id;
}

function countTokens(alias) {
  return PushTokens.countDocuments({ alias: alias._id }).exec();
}

// Sign in to the website as another user, in a session of its own.
async function signInAs(t, user) {
  t.context.user = user;
  t.context.web = request.agent(t.context._web.server);
  await utils.loginUser(t);
  return t.context.web;
}

test('deleting the account deletes the push tokens of its aliases', async (t) => {
  const { user, password, web } = t.context;
  const domain = await createDomain(t, [{ user: user._id, group: 'admin' }]);
  const mine = await createAlias(t, user, domain);
  await registerPushToken(t, mine, 'apns', 'a'.repeat(64));
  await registerPushToken(t, mine, 'fcm', 'f'.repeat(152));

  // someone else's alias and token are not touched
  const other = await createUser(t);
  const otherDomain = await createDomain(t, [
    { user: other._id, group: 'admin' }
  ]);
  const theirs = await createAlias(t, other, otherDomain);
  await registerPushToken(t, theirs, 'apns', 'b'.repeat(64));

  t.is(await countTokens(mine.alias), 2);

  const res = await web
    .delete('/en/my-account')
    .set('Accept', 'application/json')
    .send({ password });
  t.is(res.status, 200);
  t.truthy(res.body.redirectTo);

  const removed = await Users.findById(user._id).lean().exec();
  t.true(removed[config.userFields.isRemoved]);
  t.is(await Aliases.countDocuments({ _id: mine.alias._id }), 0);
  t.is(await countTokens(mine.alias), 0);
  t.is(await PushTokens.countDocuments({ user: user._id }), 0);
  t.is(await countTokens(theirs.alias), 1);
});

test('deleting the account removes its password and passkeys', async (t) => {
  const { user, password, web } = t.context;
  await Users.updateOne(
    { _id: user._id },
    {
      $set: {
        passkeys: [
          {
            nickname: 'Laptop',
            credentialId: 'credential-id',
            publicKey: 'public-key',
            sha256: 'public-key-sha256'
          }
        ],
        [config.userFields.resetToken]: 'reset-token',
        [config.userFields.resetTokenExpiresAt]: dayjs()
          .add(30, 'minutes')
          .toDate()
      }
    }
  );

  // (read raw: the password fields are `select: false`)
  const before = await Users.collection.findOne({ _id: user._id });
  t.is(before.passkeys.length, 1);
  t.is(typeof before.hash, 'string');
  t.is(typeof before.salt, 'string');

  const res = await web
    .delete('/en/my-account')
    .set('Accept', 'application/json')
    .send({ password });
  t.is(res.status, 200);

  const removed = await Users.collection.findOne({ _id: user._id });
  t.true(removed[config.userFields.isRemoved]);
  t.deepEqual(removed.passkeys, []);
  t.false('hash' in removed);
  t.false('salt' in removed);
  t.false(removed[config.userFields.hasSetPassword]);
  t.false(config.userFields.resetToken in removed);
  t.false(config.userFields.resetTokenExpiresAt in removed);

  // the payment records stay, for refunds and accounting
  t.is(await Payments.countDocuments({ user: user._id }), 1);
});

test('deleting an alias deletes its push tokens', async (t) => {
  const { user, api } = t.context;
  const domain = await createDomain(t, [{ user: user._id, group: 'admin' }]);
  const deleted = await createAlias(t, user, domain);
  const kept = await createAlias(t, user, domain);
  await registerPushToken(t, deleted, 'apns', 'c'.repeat(64));
  await registerPushToken(t, kept, 'apns', 'd'.repeat(64));

  const res = await api
    .delete(`/v1/domains/${domain.name}/aliases/${deleted.alias.id}`)
    .auth(user[config.userFields.apiToken]);
  t.is(res.status, 200);

  t.is(await countTokens(deleted.alias), 0);
  t.is(await countTokens(kept.alias), 1);
});

test('deleting a domain deletes the push tokens of its aliases', async (t) => {
  const { user, api } = t.context;
  const domain = await createDomain(t, [{ user: user._id, group: 'admin' }]);
  const first = await createAlias(t, user, domain);
  const second = await createAlias(t, user, domain);
  await registerPushToken(t, first, 'apns', 'e'.repeat(64));
  await registerPushToken(t, second, 'fcm', 'g'.repeat(152));

  const otherDomain = await createDomain(t, [
    { user: user._id, group: 'admin' }
  ]);
  const elsewhere = await createAlias(t, user, otherDomain);
  await registerPushToken(t, elsewhere, 'apns', '9'.repeat(64));

  const res = await api
    .delete(`/v1/domains/${domain.name}`)
    .auth(user[config.userFields.apiToken]);
  t.is(res.status, 200);

  t.is(await countTokens(first.alias), 0);
  t.is(await countTokens(second.alias), 0);
  t.is(await countTokens(elsewhere.alias), 1);
});

test('an admin of a team domain with other admins cannot delete the account', async (t) => {
  const { password } = t.context;
  const user = await createUser(t, { password, plan: 'team' });
  const web = await signInAs(t, user);

  const otherAdmin = await createUser(t, { plan: 'team' });
  const domain = await createDomain(
    t,
    [
      { user: user._id, group: 'admin' },
      { user: otherAdmin._id, group: 'admin' }
    ],
    'team'
  );
  const theirs = await createAlias(t, otherAdmin, domain);
  await registerPushToken(t, theirs, 'apns', '8'.repeat(64));

  const res = await web
    .delete('/en/my-account')
    .set('Accept', 'application/json')
    .send({ password });
  t.is(res.status, 400);
  t.is(res.body.message, phrases.ACCOUNT_DELETE_HAS_DOMAINS);

  // nothing was deleted
  const kept = await Users.findById(user._id).lean().exec();
  t.false(Boolean(kept[config.userFields.isRemoved]));
  t.is(await Domains.countDocuments({ _id: domain._id }), 1);
  t.is(await Aliases.countDocuments({ _id: theirs.alias._id }), 1);
  t.is(await countTokens(theirs.alias), 1);
});

test('the only admin of a team domain can delete the account', async (t) => {
  const { password } = t.context;
  const user = await createUser(t, { password, plan: 'team' });
  const web = await signInAs(t, user);

  const member = await createUser(t, { plan: 'team' });
  const domain = await createDomain(
    t,
    [
      { user: user._id, group: 'admin' },
      { user: member._id, group: 'user' }
    ],
    'team'
  );
  const mine = await createAlias(t, user, domain);
  await registerPushToken(t, mine, 'apns', '7'.repeat(64));

  const res = await web
    .delete('/en/my-account')
    .set('Accept', 'application/json')
    .send({ password });
  t.is(res.status, 200);

  t.is(await Domains.countDocuments({ _id: domain._id }), 0);
  t.is(await countTokens(mine.alias), 0);
});

test('removing a member deletes the push tokens of the aliases the admin takes over', async (t) => {
  const { api } = t.context;
  const admin = await createUser(t, { plan: 'team' });
  const member = await createUser(t, { plan: 'team' });
  const domain = await createDomain(
    t,
    [
      { user: admin._id, group: 'admin' },
      { user: member._id, group: 'user' }
    ],
    'team'
  );
  const theirs = await createAlias(t, member, domain);
  const mine = await createAlias(t, admin, domain);
  await registerPushToken(t, theirs, 'apns', '6'.repeat(64));
  await registerPushToken(t, mine, 'apns', '5'.repeat(64));

  const res = await api
    .delete(`/v1/domains/${domain.name}/members/${member.id}`)
    .auth(admin[config.userFields.apiToken]);
  t.is(res.status, 200);

  // the member's alias is the admin's now, and the member's devices are
  // no longer notified for it
  const reassigned = await Aliases.findById(theirs.alias._id).lean().exec();
  t.is(reassigned.user.toString(), admin.id);
  t.is(await countTokens(theirs.alias), 0);
  t.is(await countTokens(mine.alias), 1);
});

test('moving one alias to another owner keeps the tokens of the others', async (t) => {
  const first = await createUser(t, { plan: 'team' });
  const second = await createUser(t, { plan: 'team' });
  const third = await createUser(t, { plan: 'team' });
  const domain = await createDomain(
    t,
    [
      { user: first._id, group: 'admin' },
      { user: second._id, group: 'user' },
      { user: third._id, group: 'user' }
    ],
    'team'
  );
  const moved = await createAlias(t, first, domain);
  const kept = await createAlias(t, second, domain);
  await registerPushToken(t, moved, 'apns', '4'.repeat(64));
  await registerPushToken(t, kept, 'apns', '3'.repeat(64));

  // (the filter matches both aliases; updateOne changes the first)
  await Aliases.updateOne(
    { domain: domain._id },
    { $set: { user: third._id } }
  );

  const movedAlias = await Aliases.findById(moved.alias._id).lean().exec();
  const keptAlias = await Aliases.findById(kept.alias._id).lean().exec();
  t.is(movedAlias.user.toString(), third.id);
  t.is(keptAlias.user.toString(), second.id);
  t.is(await countTokens(moved.alias), 0);
  t.is(await countTokens(kept.alias), 1);
});
