/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An admin of a domain on the team plan can give an alias to another member
// of the domain, or take it (see
// app/controllers/web/my-account/change-alias-owner.js): only an admin, only
// to a member, and not an alias a member may not own.
//

const { randomUUID } = require('node:crypto');
const timers = require('node:timers/promises');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const request = require('supertest');
const test = require('ava');

// (the emails sent, kept instead: before anything loads the email helper)
const emailPath = require.resolve('#helpers/email');
const sent = [];
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(data) {
    sent.push(data);
  }
};

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const {
  Aliases,
  Domains,
  Emails,
  PushTokens,
  SieveScripts,
  Users
} = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// a user on the team plan who can log in with `password`
async function teamUser(t, password = falso.randPassword()) {
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.plan = 'team';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  return user.save();
}

function createDomain(t, members, state = {}) {
  return t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members,
      plan: 'team',
      skip_verification: true,
      ...state
    })
    .create();
}

//
// a domain of the admin (who is logged in), another admin, and two members
// of the user group: `owner` has the alias, `member` has none
//
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  t.context.memberPassword = falso.randPassword();
  t.context.user = await teamUser(t, t.context.password);
  t.context.admin = await teamUser(t);
  t.context.owner = await teamUser(t);
  t.context.member = await teamUser(t, t.context.memberPassword);
  await utils.setupWebServer(t);
  await utils.loginUser(t);
  t.context.domain = await createDomain(t, [
    { user: t.context.user._id, group: 'admin' },
    { user: t.context.admin._id, group: 'admin' },
    { user: t.context.owner._id, group: 'user' },
    { user: t.context.member._id, group: 'user' }
  ]);
});
test.afterEach.always(utils.teardownWebServer);

function createAlias(
  t,
  name,
  user = t.context.owner,
  domain = t.context.domain
) {
  return t.context.aliasFactory
    .withState({
      name,
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();
}

// ask to give the alias to `user` (an id, or a body)
function change(t, alias, user, { web = t.context.web, domain } = {}) {
  return web
    .post(
      `/en/my-account/domains/${(domain || t.context.domain).name}/aliases/${
        alias.id
      }/owner`
    )
    .set('Accept', 'application/json')
    .send(typeof user === 'string' ? { user } : user);
}

async function ownerOf(alias) {
  const fresh = await Aliases.findById(alias._id).lean().exec();
  return String(fresh.user);
}

// the messages flashed to the next page
async function flashed(t) {
  const res = await t.context.web.get('/en/my-account/domains');
  const match = res.text.match(/window\._messages = (.*);/);
  t.truthy(match);
  return JSON.stringify(JSON.parse(match[1]));
}

// the emails sent to the users of this test (in the background, and the
// tests of this file run at once)
async function emails(t) {
  await timers.setTimeout(200);
  const addresses = new Set(
    ['user', 'admin', 'owner', 'member'].map((name) => t.context[name].email)
  );
  return sent
    .filter((data) => addresses.has(data.message.to))
    .map((data) => ({ to: data.message.to, message: data.locals.message }));
}

test('an admin gives an alias to another member, with what belongs to it', async (t) => {
  const alias = await createAlias(t, 'jane');
  await alias.createToken();
  await alias.save();
  const other = await createAlias(t, 'other');

  // a Sieve script, an email not sent yet and one sent, and the app tokens
  // registered by its owner
  const sieve = await SieveScripts.collection.insertOne({
    alias: alias._id,
    user: t.context.owner._id,
    domain: t.context.domain._id,
    name: 'filter'
  });
  const queued = await Emails.collection.insertOne({
    alias: alias._id,
    user: t.context.owner._id,
    domain: t.context.domain._id,
    id: randomUUID(),
    status: 'queued'
  });
  const wasSent = await Emails.collection.insertOne({
    alias: alias._id,
    user: t.context.owner._id,
    domain: t.context.domain._id,
    id: randomUUID(),
    status: 'sent'
  });
  await PushTokens.collection.insertOne({
    alias: alias._id,
    user: t.context.owner._id,
    token: randomUUID()
  });

  const res = await change(t, alias, t.context.member.id);
  t.is(res.status, 200);
  t.is(
    res.body.redirectTo,
    `/en/my-account/domains/${t.context.domain.name}/aliases`
  );

  t.is(await ownerOf(alias), t.context.member.id);
  // (and no other alias)
  t.is(await ownerOf(other), t.context.owner.id);

  const script = await SieveScripts.collection.findOne({
    _id: sieve.insertedId
  });
  t.is(String(script.user), t.context.member.id);
  const unsent = await Emails.collection.findOne({ _id: queued.insertedId });
  t.is(String(unsent.user), t.context.member.id);
  const past = await Emails.collection.findOne({ _id: wasSent.insertedId });
  t.is(String(past.user), t.context.owner.id);
  t.is(await PushTokens.countDocuments({ alias: alias._id }), 0);

  // its password is kept, which the admin is told
  const fresh = await Aliases.findById(alias._id).lean().exec();
  t.is(fresh.tokens.length, 1);
  const messages = await flashed(t);
  t.true(messages.includes(phrases.REQUEST_OK));
  t.true(messages.includes(phrases.REASSIGNED_ALIASES_HAVE_PASSWORDS));
  t.true(messages.includes('<li>jane</li>'));

  // its new owner and its past one are told, each only of this alias and
  // not of each other
  const mail = await emails(t);
  t.is(mail.length, 2);
  const address = `jane@${t.context.domain.name}`;
  const toNew = mail.find((m) => m.to === t.context.member.email);
  t.true(toNew.message.includes(phrases.REASSIGNED_ALIAS_OWNERSHIP));
  t.true(toNew.message.includes(address));
  t.true(toNew.message.includes(phrases.REASSIGNED_ALIASES_HAVE_PASSWORDS));
  t.false(toNew.message.includes(t.context.owner.email));
  const toPast = mail.find((m) => m.to === t.context.owner.email);
  t.true(toPast.message.includes(phrases.REASSIGNED_ALIASES_FROM_OWNER));
  t.true(toPast.message.includes(address));
  t.false(toPast.message.includes(phrases.REASSIGNED_ALIASES_HAVE_PASSWORDS));
  t.false(toPast.message.includes(t.context.member.email));
  t.false(JSON.stringify(mail).includes('other@'));
});

test('an admin takes an alias, and is not emailed about it', async (t) => {
  const alias = await createAlias(t, 'pat');
  const res = await change(t, alias, t.context.user.id);
  t.is(res.status, 200);
  t.is(await ownerOf(alias), t.context.user.id);

  const mail = await emails(t);
  t.deepEqual(
    mail.map((m) => m.to),
    [t.context.owner.email]
  );

  // (an alias without a password has none to replace)
  const messages = await flashed(t);
  t.false(messages.includes(phrases.REASSIGNED_ALIASES_HAVE_PASSWORDS));
});

test('the member who owns the alias already is not emailed', async (t) => {
  const alias = await createAlias(t, 'same');
  const res = await change(t, alias, t.context.owner.id);
  t.is(res.status, 200);
  t.is(await ownerOf(alias), t.context.owner.id);
  t.deepEqual(await emails(t), []);
});

test('the name of an alias is escaped in what is flashed and emailed', async (t) => {
  // (a regular expression alias name may hold any character)
  const alias = await createAlias(
    t,
    '/<img src=x onerror=alert(1)>/',
    t.context.user
  );
  const res = await change(t, alias, t.context.admin.id);
  t.is(res.status, 200);
  t.is(await ownerOf(alias), t.context.admin.id);
  const text = (await flashed(t)) + JSON.stringify(await emails(t));
  t.true(text.includes('&lt;img src=x onerror=alert(1)&gt;'));
  t.false(text.includes('<img'));
});

test('a catch-all, a regular expression or a reserved name stays with an admin', async (t) => {
  for (const name of ['*', '/^(support|help)$/', 'admin', 'postmaster']) {
    const alias = await createAlias(t, name, t.context.user);
    const res = await change(t, alias, t.context.member.id);
    t.is(res.status, 400, `${name}`);
    t.is(await ownerOf(alias), t.context.user.id, `${name}`);

    // (another admin may have it)
    const ok = await change(t, alias, t.context.admin.id);
    t.is(ok.status, 200, `${name}`);
    t.is(await ownerOf(alias), t.context.admin.id, `${name}`);
  }
});

test('only a member of the domain can be given an alias', async (t) => {
  const alias = await createAlias(t, 'kim');
  const stranger = await teamUser(t);
  // (an admin of another domain of the admin's is not one of this domain's)
  await createDomain(t, [
    { user: t.context.user._id, group: 'admin' },
    { user: stranger._id, group: 'admin' }
  ]);
  const banned = await teamUser(t);
  await Domains.updateOne(
    { _id: t.context.domain._id },
    { $push: { members: { user: banned._id, group: 'user' } } }
  );
  await Users.updateOne(
    { _id: banned._id },
    { $set: { [config.userFields.isBanned]: true } }
  );

  for (const user of [
    stranger.id,
    banned.id,
    new mongoose.Types.ObjectId().toString(),
    'not-an-id',
    '',
    t.context.member.email
  ]) {
    const res = await change(t, alias, user);
    t.true([400, 404].includes(res.status), `${user}`);
    t.is(res.body.message, phrases.INVALID_MEMBER, `${user}`);
  }

  // (nor a query in place of an id)
  for (const body of [
    {},
    { user: { $ne: null } },
    { user: [t.context.member.id] },
    { 'user[$ne]': '' }
  ]) {
    const res = await change(t, alias, body);
    t.is(res.status, 400, `${JSON.stringify(body)}`);
  }

  t.is(await ownerOf(alias), t.context.owner.id);
  t.deepEqual(await emails(t), []);
});

test('a member who is not an admin cannot change the owner of an alias', async (t) => {
  const own = await createAlias(t, 'mine', t.context.member);
  const alias = await createAlias(t, 'theirs');
  const web = request.agent(t.context._web.server);
  await web.post('/en/login').send({
    email: t.context.member.email,
    password: t.context.memberPassword
  });

  // (not of their own alias, nor to themselves of another's)
  for (const [target, user] of [
    [own, t.context.owner.id],
    [own, t.context.user.id],
    [alias, t.context.member.id]
  ]) {
    const res = await change(t, target, user, { web });
    t.is(res.status, 400);
    t.is(res.body.message, phrases.IS_NOT_ADMIN);
  }

  t.is(await ownerOf(own), t.context.member.id);
  t.is(await ownerOf(alias), t.context.owner.id);

  // nor does the list offer it to them
  const list = await web
    .get(`/en/my-account/domains/${t.context.domain.name}/aliases`)
    .set('Accept', 'text/html');
  t.is(list.status, 200);
  t.true(list.text.includes(`mine@${t.context.domain.name}`));
  t.false(list.text.includes('modal-alias-owner'));
  t.false(list.text.includes(`/aliases/${own.id}/owner`));

  // (signed out: to the login page)
  const anonymous = await change(t, alias, t.context.member.id, {
    web: request.agent(t.context._web.server)
  });
  t.true(anonymous.body.redirectTo.includes('/login'));
  t.is(await ownerOf(alias), t.context.owner.id);
  t.deepEqual(await emails(t), []);
});

test('an alias of another domain is not found through a domain of the admin', async (t) => {
  // (a domain the admin is only a member of, and an alias there)
  const domain = await createDomain(t, [
    { user: t.context.owner._id, group: 'admin' },
    { user: t.context.user._id, group: 'user' }
  ]);
  const alias = await createAlias(t, 'elsewhere', t.context.owner, domain);

  // through the admin's own domain
  const res = await change(t, alias, t.context.user.id);
  t.is(res.status, 404);

  // in its own domain
  const direct = await change(t, alias, t.context.user.id, { domain });
  t.is(direct.status, 400);
  t.is(direct.body.message, phrases.IS_NOT_ADMIN);
  t.is(await ownerOf(alias), t.context.owner.id);
});

test('not on a domain without the team plan, nor a global one', async (t) => {
  // (a domain with members is on the team plan when it is saved)
  for (const state of [{ plan: 'enhanced_protection' }, { is_global: true }]) {
    const domain = await createDomain(t, [
      { user: t.context.user._id, group: 'admin' },
      { user: t.context.owner._id, group: 'user' }
    ]);
    const alias = await createAlias(t, 'hello', t.context.owner, domain);
    await Domains.updateOne({ _id: domain._id }, { $set: state });
    const res = await change(t, alias, t.context.user.id, { domain });
    t.not(
      res.body.redirectTo,
      `/en/my-account/domains/${domain.name}/aliases`,
      `${Object.keys(state)}`
    );
    t.is(await ownerOf(alias), t.context.owner.id, `${Object.keys(state)}`);
  }
});

test('not while the password of the alias is being changed', async (t) => {
  const alias = await createAlias(t, 'rekey');
  await Aliases.updateOne({ _id: alias._id }, { $set: { is_rekey: true } });
  const res = await change(t, alias, t.context.member.id);
  t.is(res.status, 409);
  t.is(res.body.message, phrases.ALIAS_REKEY_IN_PROGRESS);
  t.is(await ownerOf(alias), t.context.owner.id);
});

test('the list of aliases offers it to an admin, with the members to choose from', async (t) => {
  const alias = await createAlias(t, 'listed');
  const list = await t.context.web
    .get(`/en/my-account/domains/${t.context.domain.name}/aliases`)
    .set('Accept', 'text/html');
  t.is(list.status, 200);
  t.true(list.text.includes('id="modal-alias-owner"'));
  t.true(
    list.text.includes(
      `data-action="/en/my-account/domains/${t.context.domain.name}/aliases/${alias.id}/owner"`
    )
  );
  t.true(list.text.includes(`data-owner="${t.context.owner.id}"`));
  for (const user of [
    t.context.user,
    t.context.admin,
    t.context.owner,
    t.context.member
  ])
    t.true(list.text.includes(`<option value="${user.id}">${user.email} (`));

  // (a domain of one member has no one to give an alias to)
  const single = await createDomain(t, [
    { user: t.context.user._id, group: 'admin' }
  ]);
  await createAlias(t, 'alone', t.context.user, single);
  const page = await t.context.web
    .get(`/en/my-account/domains/${single.name}/aliases`)
    .set('Accept', 'text/html');
  t.is(page.status, 200);
  t.true(page.text.includes(`alone@${single.name}`));
  t.false(page.text.includes('modal-alias-owner'));
});
