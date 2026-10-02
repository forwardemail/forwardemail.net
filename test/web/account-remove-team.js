/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Deleting an account must not delete a team domain (and every alias on it)
// that other admins still manage.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users, Domains, Aliases } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function makeUser(t) {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.plan = 'team';
  user[config.userFields.planSetAt] = new Date();
  user[config.userFields.planExpiresAt] = new Date(Date.now() + 86_400_000);
  user = await user.save();
  return { user, password };
}

test.beforeEach(async (t) => {
  const { user, password } = await makeUser(t);
  t.context.user = user;
  t.context.password = password;
  const other = await makeUser(t);
  t.context.other = other.user;
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

async function teamDomain(t, members) {
  const domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members,
      plan: 'team',
      skip_verification: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: t.context.other._id,
      domain: domain._id,
      recipients: [t.context.other.email]
    })
    .create();
  return { domain, alias };
}

function removeAccount(t) {
  return t.context.web
    .delete('/en/my-account')
    .set('Accept', 'application/json')
    .send({ password: t.context.password });
}

test('refuses while another admin manages a team domain', async (t) => {
  const { user, other } = t.context;
  const { domain, alias } = await teamDomain(t, [
    { user: user._id, group: 'admin' },
    { user: other._id, group: 'admin' }
  ]);

  const res = await removeAccount(t);
  t.is(res.status, 400);
  t.is(res.body.message, phrases.ACCOUNT_DELETE_HAS_DOMAINS);

  t.truthy(await Domains.exists({ _id: domain._id }));
  t.truthy(await Aliases.exists({ _id: alias._id }));
  const fresh = await Users.findById(user._id).lean().exec();
  t.falsy(fresh[config.userFields.isRemoved]);
});

test('a team domain with no other admin is still removed', async (t) => {
  const { user, other } = t.context;
  const { domain } = await teamDomain(t, [
    { user: user._id, group: 'admin' },
    { user: other._id, group: 'user' }
  ]);

  const res = await removeAccount(t);
  t.is(res.status, 200);
  t.falsy(await Domains.exists({ _id: domain._id }));
});
