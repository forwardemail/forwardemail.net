/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Values a user can choose (a regex alias name, a custom alias password, an
// email address set by an admin) are escaped or refused where messages are
// shown as HTML.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Aliases, Payments, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownWebServer);

async function login(t, { plan = 'enhanced_protection', group = 'user' } = {}) {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.group = group;
  if (plan !== 'free') {
    const planSetAt = new Date(Date.now() - ms('60d'));
    await Payments.create({
      user: user._id,
      amount: 3600,
      amount_refunded: 0,
      duration: ms('1y'),
      invoice_at: planSetAt,
      method: 'unknown',
      plan,
      kind: 'one-time'
    });
    user.plan = plan;
    user[config.userFields.planSetAt] = planSetAt;
  }

  t.context.user = await user.save();
  t.context.password = password;
  t.context.webConfig = { turnstileEnabled: false };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
}

test('an invalid regex alias name is escaped in the error', async (t) => {
  await login(t);
  const domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();

  const err = await t.throwsAsync(
    Aliases.create({
      user: t.context.user._id,
      domain: domain._id,
      name: '/<img src=x onerror=alert(1)>(?!a)/',
      recipients: [t.context.user.email],
      locale: 'en'
    })
  );
  t.true(err.message.includes('&lt;img src=x onerror=alert(1)&gt;'));
  t.false(err.message.includes('<img'));
});

test('a custom alias password is escaped in the QR code dialog', async (t) => {
  await login(t);
  const domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();
  let alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: domain._id,
      name: 'hello',
      recipients: [t.context.user.email]
    })
    .create();
  alias = await Aliases.findById(alias._id)
    .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .exec();
  const password = 'Vr7<img src=x onerror=alert(1)>-kQ2-zL9-wP4';
  alias.locale = 'en';
  await alias.createToken('test', password);
  await alias.save();

  const res = await t.context.web
    .post(`/en/my-account/domains/${domain.name}/aliases/${alias.id}/qrcode`)
    .set('Accept', 'application/json')
    .set('Sec-Fetch-Site', 'same-origin')
    .send({ password });
  t.is(res.status, 200);

  // (the dialog is shown on the next page)
  const page = await t.context.web
    .get(res.body.redirectTo)
    .set('Accept', 'text/html');
  const match = page.text.match(/window\._messages = (.*);\s*$/m);
  t.truthy(match);
  const html = JSON.parse(match[1])
    .custom.map((m) => m.html || '')
    .join('\n');
  t.true(html.includes('Vr7'));
  t.false(html.includes('<img src=x'));
  t.true(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
});

test('an admin cannot set an email address that is not valid', async (t) => {
  await login(t, { plan: 'free', group: 'admin' });
  const target = await t.context.userFactory.create();

  const res = await t.context.web
    .put(`/en/admin/users/${target.id}`)
    .set('Accept', 'application/json')
    .send({ email: '"<img src=x onerror=alert(1)>"@example.com' });
  t.is(res.status, 400);
  const fresh = await Users.findById(target._id).lean().exec();
  t.is(fresh.email, target.email);
});

test('an admin can still edit a user whose email is unchanged', async (t) => {
  await login(t, { plan: 'free', group: 'admin' });
  const target = await t.context.userFactory.create();

  const res = await t.context.web
    .put(`/en/admin/users/${target.id}`)
    .set('Accept', 'application/json')
    .send({ email: target.email, group: 'user' });
  t.is(res.status, 200);
});

test('an admin can set the same email with other spacing or case', async (t) => {
  await login(t, { plan: 'free', group: 'admin' });
  const target = await t.context.userFactory.create();

  const res = await t.context.web
    .put(`/en/admin/users/${target.id}`)
    .set('Accept', 'application/json')
    .send({ email: `  ${target.email.toUpperCase()}  ` });
  t.is(res.status, 200);
  const fresh = await Users.findById(target._id).lean().exec();
  t.is(fresh.email, target.email);
});
