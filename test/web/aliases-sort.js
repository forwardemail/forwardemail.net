/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The aliases page of a domain sorts by the date each alias was created,
// newest or oldest first, from its "Created" column (see #286).
//

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const { Aliases, Users } = require('#models');

const resolver = createTangerine(new Redis());

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user.plan = 'enhanced_protection';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

test('aliases sort by the date they were created', async (t) => {
  const { web, user } = t.context;
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      ignore_mx_check: true
    })
    .create();

  // (created in an order unlike their names)
  const names = ['bravo', 'alpha', 'charlie'];
  for (const [i, name] of names.entries()) {
    const alias = await t.context.aliasFactory
      .withState({
        name,
        user: user._id,
        domain: domain._id,
        recipients: [user.email]
      })
      .create();
    await Aliases.collection.updateOne(
      { _id: alias._id },
      { $set: { created_at: dayjs('2026-01-01').add(i, 'day').toDate() } }
    );
  }

  const order = (text) =>
    names
      .map((name) => ({ name, index: text.indexOf(`${name}@${domain.name}`) }))
      .sort((a, b) => a.index - b.index)
      .map((a) => a.name);

  const path = `/en/my-account/domains/${domain.name}/aliases`;

  // (the column header sorts by it)
  const page = await web.get(path);
  t.is(page.status, 200);
  t.true(page.text.includes('name="sort" value="created_at"'));

  const newest = await web.get(`${path}?sort=-created_at`);
  t.is(newest.status, 200);
  t.deepEqual(order(newest.text), ['charlie', 'alpha', 'bravo']);

  const oldest = await web.get(`${path}?sort=created_at`);
  t.is(oldest.status, 200);
  t.deepEqual(order(oldest.text), ['bravo', 'alpha', 'charlie']);
});
