/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A backup decrypted with the alias password counts every wrong password
// toward the same daily limit as the other alias password forms, so the
// mailbox password cannot be guessed here without limit.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

test.before(utils.setupMongoose);
// (the limit is lifted in tests; a small one is used here)
const { smtpLimitAuth } = config;
test.before(() => {
  config.smtpLimitAuth = 3;
});
test.after.always(() => {
  config.smtpLimitAuth = smtpLimitAuth;
});
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.plan = 'enhanced_protection';
  user[config.userFields.planSetAt] = new Date();
  user[config.userFields.planExpiresAt] = new Date(Date.now() + 86_400_000);
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);

  t.context.domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: t.context.domain._id,
      recipients: [t.context.user.email],
      has_imap: true
    })
    .create();
  await alias.createToken();
  t.context.alias = await alias.save();
});
test.afterEach.always(utils.teardownWebServer);

test('wrong backup passwords count toward the limit', async (t) => {
  const { web, domain, alias } = t.context;
  const post = () =>
    web
      .post(
        `/en/my-account/domains/${domain.name}/aliases/${alias.id}/download-backup`
      )
      .set('Accept', 'application/json')
      .send({ password: 'not-the-password', format: 'sqlite' });

  for (let i = 0; i < config.smtpLimitAuth; i++) {
    const res = await post();
    t.is(res.status, 403);
    t.is(res.body.message, phrases.INVALID_PASSWORD);
  }

  const res = await post();
  t.is(res.status, 403);
  t.is(res.body.message, phrases.ALIAS_RATE_LIMITED);
});
