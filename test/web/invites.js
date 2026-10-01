/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Session cookies are sent with a GET from another site (SameSite=Lax), so
// opening an invite link only shows the invite, and it is accepted with a
// POST from that page.  The same goes for the newsletter link.
//

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const { Domains, Users } = require('#models');

const resolver = createTangerine(new Redis());

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

async function createInvite(t) {
  const admin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: admin._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: admin.plan,
      kind: 'one-time'
    })
    .create();
  await admin.save();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: admin._id, group: 'admin' }],
      plan: admin.plan,
      resolver,
      ignore_mx_check: true
    })
    .create();
  const token = randomUUID();
  domain.invites.push({
    email: t.context.user.email,
    group: 'user',
    token,
    expires_at: dayjs().add(1, 'day').toDate()
  });
  domain.skip_verification = true;
  await domain.save();
  return {
    domain,
    path: `/en/my-account/domains/${domain.id}/invites/${token}`
  };
}

async function isMember(domain, user) {
  const fresh = await Domains.findById(domain._id).lean().exec();
  return fresh.members.some(
    (member) => member.user.toString() === user._id.toString()
  );
}

test('opening an invite link shows the invite without accepting it', async (t) => {
  const { web, user } = t.context;
  const { domain, path } = await createInvite(t);

  // e.g. a link or redirect on another site
  const res = await web
    .get(path)
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'cross-site');
  t.is(res.status, 200);
  t.true(res.text.includes(domain.name));
  t.true(res.text.includes(`action="${path}"`));
  t.false(await isMember(domain, user));

  // accepting it is a POST from that page
  const accepted = await web.post(path).set('Accept', 'application/json');
  t.is(accepted.status, 200);
  t.true(await isMember(domain, user));
});

test('the newsletter link only subscribes from this site', async (t) => {
  const { web, user } = t.context;
  // (opted out)
  await Users.findByIdAndUpdate(user._id, { $set: { has_newsletter: false } });

  let res = await web
    .get('/en/my-account/profile?newsletter=true')
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'cross-site');
  t.is(res.status, 200);
  let fresh = await Users.findById(user._id).lean().exec();
  t.false(Boolean(fresh.has_newsletter));

  res = await web
    .get('/en/my-account/profile?newsletter=true')
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 302);
  fresh = await Users.findById(user._id).lean().exec();
  t.true(fresh.has_newsletter);
});
