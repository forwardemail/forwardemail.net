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

  // accepting the same link again says they are a member (the invite is gone)
  res = await api
    .get(`/v1/domains/${domain.id}/invites/${invites[0].token}`)
    .auth(member[config.userFields.apiToken]);
  t.is(res.status, 200);
  t.is(res.text, phrases.INVITE_ALREADY_ACCEPTED);

  // and someone who is not a member gets "not found"
  const stranger = await createUser(t);
  res = await api
    .get(`/v1/domains/${domain.id}/invites/${invites[0].token}`)
    .auth(stranger[config.userFields.apiToken]);
  t.is(res.status, 404);
  t.is(res.body.message, phrases.INVITE_DOES_NOT_EXIST);
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

test('a member creating an alias does not get the other members, invites or admin settings', async (t) => {
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
      ignore_mx_check: true,
      denylist: ['blocked-sender.example.com'],
      restricted_alias_names: ['ceo']
    })
    .create();
  const token = randomUUID();
  domain.invites.push({
    email: 'invited@example.com',
    group: 'user',
    token,
    expires_at: dayjs().add(1, 'day').toDate()
  });
  await domain.save();

  // the member's response only holds their own membership
  let res = await api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(member[config.userFields.apiToken])
    .send({ name: 'member-alias', recipients: member.email });
  t.is(res.status, 200);
  t.is(res.body.name, 'member-alias');
  t.is(res.body.domain.members.length, 1);
  t.is(res.body.domain.members[0].user.id, member.id);
  t.deepEqual(res.body.domain.invites, []);
  t.is(res.body.domain.denylist, undefined);
  t.is(res.body.domain.restricted_alias_names, undefined);
  const body = JSON.stringify(res.body);
  t.false(body.includes(admin.email));
  t.false(body.includes(token));
  t.false(body.includes('invited@example.com'));

  // the admin still gets everything
  res = await api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(admin[config.userFields.apiToken])
    .send({ name: 'admin-alias', recipients: admin.email });
  t.is(res.status, 200);
  t.is(res.body.domain.members.length, 2);
  t.is(res.body.domain.invites.length, 1);
  t.is(res.body.domain.invites[0].token, token);
  t.deepEqual(res.body.domain.denylist, ['blocked-sender.example.com']);
});

test('only admins of a domain see its admin settings', async (t) => {
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
      ignore_mx_check: true,
      allowlist: ['trusted-sender.example.com'],
      denylist: ['blocked-sender.example.com'],
      restricted_alias_names: ['ceo']
    })
    .create();

  for (const path of ['/v1/domains', `/v1/domains/${domain.name}`]) {
    let res = await api.get(path).auth(member[config.userFields.apiToken]);
    t.is(res.status, 200);
    let data = Array.isArray(res.body)
      ? res.body.find((d) => d.name === domain.name)
      : res.body;
    t.is(data.name, domain.name);
    t.is(data.allowlist, undefined);
    t.is(data.denylist, undefined);
    t.is(data.restricted_alias_names, undefined);

    res = await api.get(path).auth(admin[config.userFields.apiToken]);
    t.is(res.status, 200);
    data = Array.isArray(res.body)
      ? res.body.find((d) => d.name === domain.name)
      : res.body;
    t.deepEqual(data.allowlist, ['trusted-sender.example.com']);
    t.deepEqual(data.denylist, ['blocked-sender.example.com']);
    t.deepEqual(data.restricted_alias_names, ['ceo']);
  }
});

test('a member cannot create a restricted or reserved name in another form', async (t) => {
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
      ignore_mx_check: true,
      restricted_alias_names: ['billing-team', 'first.last']
    })
    .create();

  for (const name of [
    // restricted by the admin (with punctuation, and without it)
    'billing-team',
    'billingteam',
    'first.last',
    // reserved, with a Cyrillic "а" / "о", or fullwidth letters
    'аdmin',
    'pоstmaster',
    'ｓｕｐｐｏｒｔ'
  ]) {
    const res = await api
      .post(`/v1/domains/${domain.name}/aliases`)
      .auth(member[config.userFields.apiToken])
      .send({ name, recipients: member.email });
    t.is(res.status, 400, `name: ${name}`);
    t.regex(res.body.message, /admin/i, `name: ${name}`);
  }

  // other names are fine
  const res = await api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(member[config.userFields.apiToken])
    .send({ name: 'jane-doe', recipients: member.email });
  t.is(res.status, 200);
});
