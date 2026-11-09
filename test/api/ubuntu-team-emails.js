/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// On the Ubuntu team domains (the TXT verified team plan domains of
// `config.ubuntuTeamMapping`) an email about a member goes to that member
// only: the addresses of the team admins (and the team's other members) are
// not in it, and they are not sent the email either.
//

const test = require('ava');

//
// (emails are captured: the email helper is replaced before the app loads it)
//
const sent = [];
const emailPath = require.resolve('#helpers/email');
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(data) {
    sent.push(data);
    return { info: {} };
  }
};

//
// (and Launchpad, which the sync asks about the member, is replaced too)
//
let launchpad = { is_valid: true, is_ubuntu_coc_signer: true };
const launchpadPath = require.resolve('#helpers/retry-launchpad-request');
require.cache[launchpadPath] = {
  id: launchpadPath,
  filename: launchpadPath,
  loaded: true,
  async exports() {
    return { body: { json: async () => launchpad } };
  }
};

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const utils = require('../utils');
const config = require('#config');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');
const { Domains } = require('#models');

const { fields } = config.passport;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.beforeEach(() => {
  sent.length = 0;
  launchpad = { is_valid: true, is_ubuntu_coc_signer: true };
});
test.afterEach.always(utils.teardownApiServer);

//
// A team plan domain with an admin and a member who has an alias on it,
// named `name`, and TXT verified (or not) as `isVerified`.
//
async function setup(t, { name = 'ubuntu.com', isVerified = true } = {}) {
  const admin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: admin._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  await admin.save();

  const member = await t.context.userFactory
    .withState({ [config.userFields.hasVerifiedEmail]: true })
    .create();

  const domain = await t.context.domainFactory
    .withState({
      members: [
        { user: admin._id, group: 'admin' },
        { user: member._id, group: 'user' }
      ],
      plan: 'team',
      has_smtp: true,
      ignore_mx_check: true,
      resolver: t.context.resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: member._id,
      domain: domain._id,
      recipients: [member.email]
    })
    .create();

  // (as the domain is in production, verified or not)
  await Domains.collection.updateOne(
    { _id: domain._id },
    { $set: { name, has_txt_record: isVerified } }
  );

  return { admin, member, domain: { ...domain.toObject(), name }, alias };
}

function generatePassword(t, user, domain, alias) {
  return t.context.api
    .post(`/v1/domains/${domain.name}/aliases/${alias.id}/generate-password`)
    .auth(user[config.userFields.apiToken])
    .send({});
}

// the "New password generated" email
function generatedEmail(alias, domain) {
  return sent.find((data) =>
    data.message.subject.includes(`${alias.name}@${domain.name}`)
  );
}

function recipients(data) {
  return [data.message.to, data.message.cc].flat().filter(Boolean);
}

test('a member is emailed alone about their password', async (t) => {
  const { admin, member, domain, alias } = await setup(t);

  const res = await generatePassword(t, member, domain, alias);
  t.is(res.status, 200);

  const data = generatedEmail(alias, domain);
  t.truthy(data);
  t.deepEqual(recipients(data), [member.email]);
  t.false(JSON.stringify(data).includes(admin.email));
});

test('an admin is still emailed about their own changes', async (t) => {
  const { admin, domain, alias } = await setup(t);

  const res = await generatePassword(t, admin, domain, alias);
  t.is(res.status, 200);

  const data = generatedEmail(alias, domain);
  t.truthy(data);
  t.deepEqual(recipients(data), [admin.email]);
});

for (const [title, options] of [
  ['a domain of the same name that is not verified', { isVerified: false }],
  ['any other domain', { name: 'example-team.com' }]
]) {
  test(`${title} still emails its admins about a member`, async (t) => {
    const { admin, member, domain, alias } = await setup(t, options);

    const res = await generatePassword(t, member, domain, alias);
    t.is(res.status, 200);

    const data = generatedEmail(alias, domain);
    t.truthy(data);
    t.deepEqual(data.message.to, [admin.email]);
    t.is(data.message.cc, member.email);
  });
}

//
// The emails of the Ubuntu membership sync about a member
//
async function syncMember(t, username) {
  const { admin, member } = await setup(t);
  member[fields.ubuntuUsername] = username;
  member[fields.ubuntuProfileID] = `profile-${username}`;
  await member.save();

  const map = new Map([['ubuntu.com', new Set([username])]]);
  map[Symbol.for('createdAt')] = new Date();
  // (a member Launchpad says is invalid is removed, and the error thrown)
  if (launchpad.is_valid) await syncUbuntuUser(member, map);
  else
    await t.throwsAsync(syncUbuntuUser(member, map), {
      message: 'Property "is_valid" was false'
    });

  return { admin, member };
}

test('a member is emailed alone when their alias cannot be created', async (t) => {
  // (a reserved name)
  const { admin, member } = await syncMember(t, 'postmaster');

  const data = sent.find((data) =>
    data.message.subject.includes('could not be created')
  );
  t.truthy(data);
  t.deepEqual(recipients(data), [member.email]);
  t.false(JSON.stringify(data).includes(admin.email));
  // (nor the other members of the team)
  t.false(data.locals.message.includes('"map"'));
});

test('a member is emailed alone when they are removed', async (t) => {
  launchpad = { is_valid: false, is_ubuntu_coc_signer: true };
  const { admin, member } = await syncMember(t, 'invalidmember');

  const data = sent.find((data) =>
    data.message.subject.includes('due to invalidity')
  );
  t.truthy(data);
  t.deepEqual(recipients(data), [member.email]);
  t.false(JSON.stringify(data).includes(admin.email));
  t.false(data.locals.message.includes('"map"'));
});
