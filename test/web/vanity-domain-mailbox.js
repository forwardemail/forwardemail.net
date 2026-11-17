/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A vanity domain (one we provide, shared by every account) only forwards
// mail. Someone on a paid plan who asked for storage on one was told "Cannot
// use IMAP on global domain." and nothing else: not that storage needs a
// domain of their own, nor where to add it.
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');
const { Aliases, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function paidUser(t, user, plan) {
  user.plan = plan;
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  user[config.userFields.hasVerifiedEmail] = true;
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan,
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
  t.context.user = await paidUser(t, user, 'enhanced_protection');
  await utils.setupWebServer(t);
  await utils.loginUser(t);

  // (a vanity domain belongs to an admin of ours; an account is its member)
  const owner = await paidUser(
    t,
    await t.context.userFactory.withState({ group: 'admin' }).create(),
    'team'
  );
  t.context.vanity = await t.context.domainFactory
    .withState({
      name: `vanity-${randomUUID()}.example.com`,
      members: [
        { user: owner._id, group: 'admin' },
        { user: t.context.user._id, group: 'user' }
      ],
      plan: 'team',
      is_global: true,
      has_mx_record: true,
      has_txt_record: true,
      skip_verification: true
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

test('asking for storage on a vanity domain says it needs a domain of your own', async (t) => {
  const { web, vanity, user } = t.context;
  const res = await web
    .post(`/en/my-account/domains/${vanity.name}/aliases/new`)
    .set('Accept', 'application/json')
    .send({ name: 'hello', recipients: user.email, has_imap: 'true' });
  t.is(res.status, 400);
  t.regex(res.body.message, /Vanity domains only forward mail/);
  t.regex(res.body.message, /href="\/my-account\/domains\/new"/);
  t.regex(res.body.message, /add your own domain name/);
  t.notRegex(res.body.message, /global/i);
  t.is(await Aliases.countDocuments({ domain: vanity._id, name: 'hello' }), 0);

  // (forwarding only, as the message says, works)
  const forward = await web
    .post(`/en/my-account/domains/${vanity.name}/aliases/new`)
    .set('Accept', 'application/json')
    .send({ name: 'hello', recipients: user.email });
  t.true(forward.status < 400);
  t.is(await Aliases.countDocuments({ domain: vanity._id, name: 'hello' }), 1);
});

test('a catch-all or a regular expression on a vanity domain says the same', async (t) => {
  const { web, vanity, user } = t.context;
  for (const name of ['*', '/^(support|info)$/']) {
    const res = await web
      .post(`/en/my-account/domains/${vanity.name}/aliases/new`)
      .set('Accept', 'application/json')
      .send({ name, recipients: user.email, is_enabled: 'true' });
    t.is(res.status, 400, `${name}`);
    t.regex(res.body.message, /Vanity domains are shared/, `${name}`);
    t.regex(res.body.message, /href="\/my-account\/domains\/new"/, `${name}`);
  }
});

test('the new mailbox form greys out storage only while a vanity domain is picked', async (t) => {
  const { web, vanity } = t.context;
  const own = await t.context.domainFactory
    .withState({
      name: `own-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      has_mx_record: true,
      has_txt_record: true,
      skip_verification: true
    })
    .create();

  async function formFor(name) {
    const res = await web.get(
      `/en/my-account/domains/aliases/new?domain=${name}`
    );
    t.is(res.status, 200);
    const { document } = new JSDOM(res.text).window;
    const select = document.querySelector('#select-alias-domain');
    return {
      picked: select.options[select.selectedIndex],
      storage: document.querySelector('#input-has-imap'),
      hint: document.querySelector('#vanity-storage-hint')
    };
  }

  // a vanity domain: no storage, and the reason beside the option
  const onVanity = await formFor(vanity.name);
  t.is(onVanity.picked.textContent.includes(vanity.name), true);
  t.is(onVanity.picked.dataset.isGlobal, 'true');
  t.true(onVanity.storage.disabled);
  t.false(onVanity.storage.checked);
  t.false(onVanity.hint.classList.contains('d-none'));
  t.regex(onVanity.hint.textContent, /Vanity domains only forward mail/);
  t.is(onVanity.hint.parentElement, onVanity.storage.parentElement);

  // a domain of your own: storage as before, and nothing said about vanity
  // domains until one is picked
  const onOwn = await formFor(own.name);
  t.is(onOwn.picked.dataset.isGlobal, undefined);
  t.false(onOwn.storage.disabled);
  t.true(onOwn.hint.classList.contains('d-none'));
});
