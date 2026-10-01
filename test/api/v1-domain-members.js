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
const phrases = require('#config/phrases');

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
  domain.invites.push(
    {
      email: 'invited@example.com',
      group: 'user',
      token,
      expires_at: dayjs().add(1, 'day').toDate()
    },
    {
      email: 'admin-invited@example.com',
      group: 'admin',
      token: randomUUID(),
      expires_at: dayjs().add(1, 'day').toDate()
    }
  );
  await domain.save();

  // the admin sees everyone and the pending invite
  let res = await api
    .get(`/v1/domains/${domain.name}`)
    .auth(admin[config.userFields.apiToken]);
  t.is(res.status, 200);
  t.is(res.body.members.length, 2);
  t.is(res.body.invites.length, 2);
  t.is(res.body.invites[0].token, token);
  // (the link of an invite as an admin is only sent to the invitee)
  t.is(res.body.invites[1].email, 'admin-invited@example.com');
  t.is(res.body.invites[1].token, undefined);

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

test('only admins of a domain can verify its records and SMTP', async (t) => {
  const { api } = t.context;
  const admin = await createUser(t);
  const member = await createUser(t);

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: admin._id, group: 'admin' }],
      plan: admin.plan,
      resolver: t.context.resolver,
      ignore_mx_check: true
    })
    .create();
  domain.members.push({ user: member._id, group: 'user' });
  await domain.save();

  for (const path of ['verify-records', 'verify-smtp']) {
    // a member cannot run the checks (or trigger SMTP auto-approval)
    let res = await api
      .get(`/v1/domains/${domain.name}/${path}`)
      .auth(member[config.userFields.apiToken]);
    t.is(res.status, 400);
    t.is(res.body.message, phrases.IS_NOT_ADMIN);

    // the admin still gets the verification result
    res = await api
      .get(`/v1/domains/${domain.name}/${path}`)
      .auth(admin[config.userFields.apiToken]);
    t.not(res.body.message, phrases.IS_NOT_ADMIN);
  }
});

test('an invite as admin is never accepted on the invitee’s behalf', async (t) => {
  const { api } = t.context;
  const admin = await createUser(t);
  const invitee = await createUser(t);

  // the invitee is already a member of one of the admin's Team plan domains
  const shared = await t.context.domainFactory
    .withState({
      members: [{ user: admin._id, group: 'admin' }],
      plan: admin.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();
  shared.members.push({ user: invitee._id, group: 'user' });
  await shared.save();

  const createDomain = () =>
    t.context.domainFactory
      .withState({
        members: [{ user: admin._id, group: 'admin' }],
        plan: admin.plan,
        resolver: t.context.resolver,
        has_smtp: true,
        ignore_mx_check: true
      })
      .create();

  // (as an admin, the invite is left for the invitee to accept)
  const other = await createDomain();
  let res = await api
    .post(`/v1/domains/${other.name}/invites`)
    .auth(admin[config.userFields.apiToken])
    .send({ email: invitee.email, group: 'admin' });
  t.is(res.status, 200);
  t.false(
    res.body.members.some((member) => member.user.id === invitee.id),
    'the invitee is not an admin until they accept'
  );
  t.is(res.body.invites.length, 1);

  // (as a member, it is still accepted right away)
  const third = await createDomain();
  res = await api
    .post(`/v1/domains/${third.name}/invites`)
    .auth(admin[config.userFields.apiToken])
    .send({ email: invitee.email, group: 'user' });
  t.is(res.status, 200);
  t.true(res.body.members.some((member) => member.user.id === invitee.id));
});

test('promoting a member to admin takes them accepting it', async (t) => {
  const { api } = t.context;
  const admin = await createUser(t);
  const member = await createUser(t);
  const domain = await t.context.domainFactory
    .withState({
      members: [
        { user: admin._id, group: 'admin' },
        { user: member._id, group: 'user' }
      ],
      plan: admin.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  let res = await api
    .put(`/v1/domains/${domain.name}/members/${member.id}`)
    .auth(admin[config.userFields.apiToken])
    .send({ group: 'admin' });
  t.is(res.status, 200);
  const isAdmin = (body) =>
    body.members.some((m) => m.user.id === member.id && m.group === 'admin');
  t.false(isAdmin(res.body), 'the member is not an admin until they accept');
  t.is(res.body.invites.length, 1);
  t.is(res.body.invites[0].group, 'admin');

  // (promoting them again does not send the invite again)
  const { Domains } = require('#models');
  const { invites: sent } = await Domains.findById(domain._id).lean().exec();
  res = await api
    .put(`/v1/domains/${domain.name}/members/${member.id}`)
    .auth(admin[config.userFields.apiToken])
    .send({ group: 'admin' });
  t.is(res.status, 200);
  const { invites: again } = await Domains.findById(domain._id).lean().exec();
  t.is(again.length, 1);
  t.is(again[0].token, sent[0].token);

  // (setting them back to a user withdraws it)
  res = await api
    .put(`/v1/domains/${domain.name}/members/${member.id}`)
    .auth(admin[config.userFields.apiToken])
    .send({ group: 'user' });
  t.is(res.status, 200);
  t.is(res.body.invites.length, 0);
  res = await api
    .put(`/v1/domains/${domain.name}/members/${member.id}`)
    .auth(admin[config.userFields.apiToken])
    .send({ group: 'admin' });
  t.is(res.status, 200);

  // (the member accepts the invite sent to them)
  const { invites } = await Domains.findById(domain._id).lean().exec();
  res = await api
    .get(`/v1/domains/${domain.id}/invites/${invites[0].token}`)
    .auth(member[config.userFields.apiToken]);
  t.is(res.status, 200);

  const updated = await Domains.findById(domain._id).lean().exec();
  t.true(
    updated.members.some(
      (m) => m.user.toString() === member.id && m.group === 'admin'
    )
  );
  t.is(updated.invites.length, 0);
});

test('removing a member withdraws their pending invites', async (t) => {
  const { api } = t.context;
  const admin = await createUser(t);
  const member = await createUser(t);
  const domain = await t.context.domainFactory
    .withState({
      members: [
        { user: admin._id, group: 'admin' },
        { user: member._id, group: 'user' }
      ],
      plan: admin.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  let res = await api
    .put(`/v1/domains/${domain.name}/members/${member.id}`)
    .auth(admin[config.userFields.apiToken])
    .send({ group: 'admin' });
  t.is(res.status, 200);
  t.is(res.body.invites.length, 1);

  res = await api
    .delete(`/v1/domains/${domain.name}/members/${member.id}`)
    .auth(admin[config.userFields.apiToken]);
  t.is(res.status, 200);
  t.is(res.body.invites.length, 0);
  t.false(res.body.members.some((m) => m.user.id === member.id));
});
