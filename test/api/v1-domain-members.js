/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

async function createUser(t) {
  const user = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
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
  return user.save();
}

test('only admins of a domain see its members and pending invites', async (t) => {
  const { api } = t.context;
  const admin = await createUser(t);
  const member = await createUser(t);

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: admin._id, group: 'admin' }],
      plan: admin.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();
  domain.members.push({ user: member._id, group: 'user' });
  const token = randomUUID();
  domain.invites.push({
    email: 'invited@example.com',
    group: 'admin',
    token,
    expires_at: dayjs().add(1, 'day').toDate()
  });
  await domain.save();

  // the admin sees everyone and the pending invite
  let res = await api
    .get(`/v1/domains/${domain.name}`)
    .auth(admin[config.userFields.apiToken]);
  t.is(res.status, 200);
  t.is(res.body.members.length, 2);
  t.is(res.body.invites.length, 1);
  t.is(res.body.invites[0].token, token);

  // a member sees only their own membership and no invites
  res = await api
    .get(`/v1/domains/${domain.name}`)
    .auth(member[config.userFields.apiToken]);
  t.is(res.status, 200);
  t.is(res.body.members.length, 1);
  t.is(res.body.members[0].user.id, member.id);
  t.is(res.body.members[0].group, 'user');
  t.deepEqual(res.body.invites, []);
  t.false(JSON.stringify(res.body).includes(token));
  t.false(JSON.stringify(res.body).includes(admin.email));
});
