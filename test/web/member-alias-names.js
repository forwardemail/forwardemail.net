/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A member's alias names appear in the message shown to the admin who
// removes or demotes them, so they are escaped there: a member must not be
// able to run script in an admin's session through an alias name. The
// message also says which of the aliases still have passwords.
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

// (a regular expression alias name may hold any character)
const NAME = '/<img src=x onerror=alert(1)>';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function teamUser(t, user) {
  user.plan = 'team';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  user[config.userFields.hasVerifiedEmail] = true;
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

test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  t.context.user = await teamUser(t, user);
  t.context.member = await teamUser(t, await t.context.userFactory.create());
  await utils.setupWebServer(t);
  await utils.loginUser(t);

  t.context.domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [
        { user: t.context.user._id, group: 'admin' },
        { user: t.context.member._id, group: 'admin' }
      ],
      plan: 'team',
      skip_verification: true
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

async function aliasOf(t, name) {
  const alias = await t.context.aliasFactory
    .withState({
      name,
      user: t.context.member._id,
      domain: t.context.domain._id,
      recipients: [t.context.member.email]
    })
    .create();
  t.is(alias.name, name);
}

// the messages flashed to the next page
async function flashed(t) {
  const res = await t.context.web.get('/en/my-account/domains');
  const match = res.text.match(/window\._messages = (.*);/);
  t.truthy(match);
  return JSON.stringify(JSON.parse(match[1]));
}

test('removing a member', async (t) => {
  await aliasOf(t, `${NAME}/`);
  const res = await t.context.web.delete(
    `/en/my-account/domains/${t.context.domain.name}/members/${t.context.member.id}`
  );
  t.is(res.status, 302);
  const messages = await flashed(t);
  t.true(messages.includes('&lt;img src=x onerror=alert(1)&gt;'));
  t.false(messages.includes('<img'));
});

test('demoting a member with a reserved alias name', async (t) => {
  await aliasOf(t, `${NAME}admin/`);
  const res = await t.context.web
    .put(
      `/en/my-account/domains/${t.context.domain.name}/members/${t.context.member.id}`
    )
    .send({ group: 'user' });
  t.is(res.status, 302);
  const messages = await flashed(t);
  t.true(messages.includes('&lt;img src=x onerror=alert(1)&gt;admin'));
  t.false(messages.includes('<img'));
});

//
// An alias keeps its generated passwords when it goes to another member
// (its mailbox is encrypted with them), so the admin it went to is told
// which aliases have one to replace.
//
async function aliasWithPassword(t, name, hasPassword = true) {
  const alias = await t.context.aliasFactory
    .withState({
      name,
      user: t.context.member._id,
      domain: t.context.domain._id,
      recipients: [t.context.member.email]
    })
    .create();
  if (!hasPassword) return;
  await alias.createToken();
  await alias.save();
}

test('removing a member lists their aliases that still have passwords', async (t) => {
  await aliasWithPassword(t, 'with-password');
  await aliasWithPassword(t, 'without-password', false);
  const res = await t.context.web.delete(
    `/en/my-account/domains/${t.context.domain.name}/members/${t.context.member.id}`
  );
  t.is(res.status, 302);
  const messages = await flashed(t);
  const [reassigned, withPasswords] = messages.split(
    phrases.REASSIGNED_ALIASES_HAVE_PASSWORDS
  );
  t.true(reassigned.includes('<li>with-password</li>'));
  t.true(reassigned.includes('<li>without-password</li>'));
  t.true(withPasswords.includes('<li>with-password</li>'));
  t.false(withPasswords.includes('without-password'));
});

test('demoting a member lists their reassigned aliases that still have passwords', async (t) => {
  await aliasWithPassword(t, 'admin');
  // (not reassigned: it is not a reserved name)
  await aliasWithPassword(t, 'with-password');
  const res = await t.context.web
    .put(
      `/en/my-account/domains/${t.context.domain.name}/members/${t.context.member.id}`
    )
    .send({ group: 'user' });
  t.is(res.status, 302);
  const messages = await flashed(t);
  const [, withPasswords] = messages.split(
    phrases.REASSIGNED_ALIASES_HAVE_PASSWORDS
  );
  t.true(withPasswords.includes('<li>admin</li>'));
  t.false(withPasswords.includes('with-password'));
});

test('removing a member whose aliases have no password says nothing of passwords', async (t) => {
  await aliasWithPassword(t, 'without-password', false);
  const res = await t.context.web.delete(
    `/en/my-account/domains/${t.context.domain.name}/members/${t.context.member.id}`
  );
  t.is(res.status, 302);
  const messages = await flashed(t);
  t.true(messages.includes('<li>without-password</li>'));
  t.false(messages.includes(phrases.REASSIGNED_ALIASES_HAVE_PASSWORDS));
});
