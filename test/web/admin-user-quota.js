/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A new per-alias quota an admin sets for a user applies at once: the
// cached quota of that user's aliases is cleared (not the admin's own).
//

const crypto = require('node:crypto');

const falso = require('@ngneat/falso');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const password = falso.randPassword();
  let admin = await t.context.userFactory.make();
  admin = await Users.register(admin, password);
  admin.group = 'admin';
  admin[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await admin.save();
  t.context.password = password;
  t.context.target = await t.context.userFactory.create();

  const domain = await t.context.domainFactory
    .withState({
      name: `quota-${crypto.randomUUID().slice(0, 8)}.example.com`,
      plan: 'free',
      members: [{ user: t.context.target._id, group: 'admin' }]
    })
    .create();
  t.context.alias = await t.context.aliasFactory
    .withState({
      user: t.context.target._id,
      domain: domain._id,
      recipients: [t.context.target.email]
    })
    .create();
  t.context.webConfig = { turnstileEnabled: false };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

test("clears the quota cached for the user's aliases", async (t) => {
  const { web, target, alias } = t.context;
  const { client } = t.context._web;
  const key = `alias_quota_v2:${alias.id}`;
  await client.set(key, JSON.stringify({ maxQuotaPerAlias: 1 }));

  const res = await web
    .put(`/en/admin/users/${target.id}`)
    .set('Accept', 'application/json')
    .send({ max_quota_per_alias: '2GB' });
  t.is(res.status, 200);

  await pWaitFor(async () => !(await client.get(key)), { timeout: 10_000 });
  t.pass();
});
