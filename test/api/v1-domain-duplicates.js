/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A domain is on a user's account once, also when it is sent again while the
// first one is still being added (its WHOIS/RDAP lookup is slow), or when it
// is added another way. Its WHOIS/RDAP lookup is cached beforehand (tests have
// no network).
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const { Domains } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
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
  t.context.user = await user.save();
});
test.afterEach.always(utils.teardownApiServer);

test('a domain sent several times at once is added once', async (t) => {
  const domain = `${randomUUID().slice(0, 8)}.com`;
  await t.context.client.set(
    `whois:${domain}`,
    JSON.stringify({
      found: true,
      status: [],
      registrar: { id: 1, name: 'Example Registrar, Inc.' },
      ts: {
        created: new Date(Date.now() - ms('5y')),
        expires: new Date(Date.now() + ms('1y'))
      }
    })
  );

  const responses = await Promise.all(
    Array.from({ length: 4 }, () =>
      t.context.api
        .post('/v1/domains')
        .auth(t.context.user[config.userFields.apiToken])
        .send({ domain, plan: 'free' })
    )
  );

  t.is(responses.filter((res) => res.status === 200).length, 1);
  for (const res of responses.filter((res) => res.status !== 200)) {
    t.is(res.status, 400);
    t.is(res.body.message, 'Domain already exists on your account.');
  }

  t.is(
    await Domains.countDocuments({
      name: domain,
      'members.user': t.context.user._id
    }),
    1
  );
});

test('a domain already on the account is not added again', async (t) => {
  const name = `${randomUUID().slice(0, 8)}.com`;
  const fields = {
    name,
    members: [{ user: t.context.user._id, group: 'admin' }],
    plan: 'free',
    skip_verification: true
  };
  await Domains.create(fields);
  const err = await t.throwsAsync(
    Domains.create({ ...fields, name: name.toUpperCase() })
  );
  t.is(err.message, 'Domain already exists on your account.');
  t.is(await Domains.countDocuments({ name }), 1);

  // (another user can still add it)
  const other = await t.context.userFactory.create();
  await Domains.create({
    ...fields,
    members: [{ user: other._id, group: 'admin' }]
  });
  t.is(await Domains.countDocuments({ name }), 2);
});
