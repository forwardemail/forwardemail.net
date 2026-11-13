/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Senders blocked for an alias's forwarding address after its recipient
// reported them (helpers/arf-recipient-block.js) are listed on the alias's
// page, where they can be lifted.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Domains, Users } = require('#models');
const {
  blockFromReport,
  createHeader,
  isBlocked
} = require('#helpers/arf-recipient-block');

test.before(utils.setupMongoose);
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
  await Domains.findByIdAndUpdate(t.context.domain._id, {
    $set: { has_txt_record: true }
  });
  t.context.destination = `bob-${randomUUID()}@forward.example.org`;
  t.context.alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: t.context.domain._id,
      recipients: [t.context.destination]
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

test('lists the senders blocked for an alias’s forwarding address, and lifts one', async (t) => {
  const { web, domain, alias, destination } = t.context;
  const { client } = t.context._web;
  // (the DNS of each domain holds its verification record)
  const resolver = {
    async resolveTxt(name) {
      const found = await Domains.findOne({ name }).lean().exec();
      return found
        ? [[`${config.paidPrefix}${found.verification_record}`]]
        : [];
    }
  };
  const recipient = `${alias.name}@${domain.name}`;
  const sender = 'news@sender.example.net';
  // (the Message-ID of the copies reported, which each field is made for)
  const COPY = '<copy@sender.example.net>';
  t.true(
    await blockFromReport(
      client,
      resolver,
      createHeader({ recipient, destination, sender, messageId: COPY }),
      { messageId: COPY }
    )
  );

  // another user's alias that forwards to the same address, whose page
  // shows none of this alias's blocks, nor can lift them
  const other = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: new Date(),
      [config.userFields.planExpiresAt]: new Date(Date.now() + 86_400_000),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  const otherDomain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: other._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();
  await Domains.findByIdAndUpdate(otherDomain._id, {
    $set: { has_txt_record: true }
  });
  const otherAlias = await t.context.aliasFactory
    .withState({
      user: other._id,
      domain: otherDomain._id,
      recipients: [destination]
    })
    .create();
  const otherSender = 'deals@shop.example.net';
  t.true(
    await blockFromReport(
      client,
      resolver,
      createHeader({
        recipient: `${otherAlias.name}@${otherDomain.name}`,
        destination,
        sender: otherSender,
        messageId: COPY
      }),
      { messageId: COPY }
    )
  );

  const page = `/en/my-account/domains/${domain.name}/aliases/${alias.id}`;
  const res = await web.get(page);
  t.is(res.status, 200);
  t.true(res.text.includes('Senders blocked after spam reports'));
  t.true(res.text.includes(sender));
  t.false(res.text.includes(otherSender));

  // (only this alias's own blocks, for its own forwarding addresses)
  const refused = await web
    .post(`${page}/unblock-sender`)
    .set('Accept', 'application/json')
    .send({ destination: 'someone@else.example.org', sender });
  t.is(refused.status, 400);
  // (nor anything longer than an address, read at once)
  const started = Date.now();
  const long = await web
    .post(`${page}/unblock-sender`)
    .set('Accept', 'application/json')
    .send({ destination: `${'é'.repeat(100_000)}@x.example`, sender });
  t.is(long.status, 400);
  t.true(Date.now() - started < 2000, `took ${Date.now() - started}ms`);
  await web
    .post(`${page}/unblock-sender`)
    .set('Accept', 'application/json')
    .send({ destination, sender: otherSender });
  t.true(
    await isBlocked(client, {
      recipient: `${otherAlias.name}@${otherDomain.name}`,
      destination,
      sender: otherSender
    })
  );

  const lifted = await web
    .post(`${page}/unblock-sender`)
    .set('Accept', 'application/json')
    .send({ destination, sender });
  t.is(lifted.status, 200);
  t.false(await isBlocked(client, { recipient, destination, sender }));

  const after = await web.get(page);
  t.false(after.text.includes('Senders blocked after spam reports'));
});
