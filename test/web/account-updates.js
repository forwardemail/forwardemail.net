/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { collapseAuditChanges } = require('#helpers/audit-changes');
const { Users, Domains } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user = await user.save();

  const [first, second] = await Promise.all(
    [0, 1].map(() =>
      t.context.domainFactory
        .withState({
          members: [{ user: user._id, group: 'admin' }],
          plan: 'free',
          resolver: t.context.resolver
        })
        .create()
    )
  );
  t.context.domains = [first, second];

  // start from a saved default domain and an empty audit queue, loaded fresh
  // so the snapshot taken at load time is the stored value
  user[config.userFields.defaultDomain] = first._id;
  user[config.userFields.accountUpdates] = [];
  user[config.userFields.hasPendingAccountUpdates] = false;
  await user.save();
  t.context.user = await Users.findById(user._id);

  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

async function saveProfile(t, overrides = {}) {
  const { user, web } = t.context;
  return web
    .put('/en/my-account/profile')
    .set('Accept', 'application/json')
    .send({
      email: user.email,
      given_name: user[config.passport.fields.givenName] || '',
      family_name: user[config.passport.fields.familyName] || '',
      preferred_locale: '',
      default_domain: user[config.userFields.defaultDomain].toString(),
      ...overrides
    });
}

test('saving the profile without changes does not queue an account update', async (t) => {
  const res = await saveProfile(t);
  t.is(res.status, 200);
  t.true(res.body.reloadPage);

  const user = await Users.findById(t.context.user._id).lean();
  t.deepEqual(user[config.userFields.accountUpdates], []);
  t.false(user[config.userFields.hasPendingAccountUpdates]);
});

test('changing the default domain queues exactly one account update', async (t) => {
  const [first, second] = t.context.domains;
  const res = await saveProfile(t, { default_domain: second.id });
  t.is(res.status, 200);
  t.true(res.body.reloadPage);

  const user = await Users.findById(t.context.user._id).lean();
  const updates = user[config.userFields.accountUpdates];
  t.is(updates.length, 1);
  t.is(updates[0].fieldName, config.userFields.defaultDomain);
  t.is(updates[0].previous.toString(), first.id);
  t.is(updates[0].current.toString(), second.id);
  t.true(user[config.userFields.hasPendingAccountUpdates]);
});

test('enabling two-factor authentication queues an account update', async (t) => {
  const user = await Users.findById(t.context.user._id);
  t.false(user[config.passport.fields.otpEnabled]);
  user[config.passport.fields.otpEnabled] = true;
  await user.save();

  const saved = await Users.findById(user._id).lean();
  t.deepEqual(
    saved[config.userFields.accountUpdates].map((u) => [
      u.fieldName,
      u.previous,
      u.current
    ]),
    [[config.passport.fields.otpEnabled, false, true]]
  );
});

test('a field changed and changed back produces no email content', async (t) => {
  const [first, second] = t.context.domains;
  await saveProfile(t, { default_domain: second.id });
  await saveProfile(t, { default_domain: first.id });

  const user = await Users.findById(t.context.user._id).lean();
  // both changes are recorded, but together they amount to nothing
  t.is(user[config.userFields.accountUpdates].length, 2);
  t.deepEqual(collapseAuditChanges(user[config.userFields.accountUpdates]), []);
});

test('saving domain settings without changes does not queue a domain update', async (t) => {
  const domain = await Domains.findById(t.context.domains[0]._id);
  domain.custom_verification.subject = 'Verify {{EMAIL}}';
  await domain.save();

  const loaded = await Domains.findById(domain._id);
  loaded.domain_updates = [];
  loaded.has_pending_domain_updates = false;
  // re-assign the same values the settings form would re-submit
  loaded.custom_verification = { ...loaded.toObject().custom_verification };
  loaded.max_recipients_per_alias = loaded.max_recipients_per_alias; // eslint-disable-line no-self-assign
  await loaded.save();

  const saved = await Domains.findById(domain._id).lean();
  t.deepEqual(saved.domain_updates, []);
  t.false(saved.has_pending_domain_updates);
});
