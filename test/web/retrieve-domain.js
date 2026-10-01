/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users, Aliases } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  // domains with more than one member are on the team plan
  const planExpiresAt = new Date(Date.now() + 86_400_000);
  let owner = await t.context.userFactory.make();
  owner = await Users.register(owner, falso.randPassword());
  owner.plan = 'team';
  owner[config.userFields.planExpiresAt] = planExpiresAt;
  t.context.owner = await owner.save();

  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.plan = 'team';
  user[config.userFields.planExpiresAt] = planExpiresAt;
  t.context.user = await user.save();

  await utils.setupWebServer(t);

  // the domain still has a legacy `forward-email=` TXT record
  const { resolver } = t.context._web.app.context;
  resolver.resolveTxt = async () => [
    [`forward-email=imported:${falso.randEmail()}`]
  ];
  resolver.resolveMx = async () => [];

  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

async function createDomain(t, group) {
  return t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [
        { user: t.context.owner._id, group: 'admin' },
        { user: t.context.user._id, group }
      ],
      plan: 'team',
      skip_verification: true
    })
    .create();
}

test('GET domain setup page does not import TXT aliases for a non-admin member', async (t) => {
  const { web } = t.context;
  const domain = await createDomain(t, 'user');

  await web.get(`/en/my-account/domains/${domain.name}`);

  t.is(await Aliases.countDocuments({ domain: domain._id }), 0);
});

test('GET domain setup page imports TXT aliases for a domain admin', async (t) => {
  const { web, user } = t.context;
  const domain = await createDomain(t, 'admin');

  await web.get(`/en/my-account/domains/${domain.name}`);

  const aliases = await Aliases.find({ domain: domain._id }).lean().exec();
  t.is(aliases.length, 1);
  t.is(aliases[0].name, 'imported');
  t.is(aliases[0].user.toString(), user.id);
});
