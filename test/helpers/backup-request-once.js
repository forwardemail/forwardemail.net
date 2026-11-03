/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// One backup of a mailbox at a time: the 30 minute claim was read and then
// set, so backup requests sent at once (sign ins on several devices) each
// found none and each queued a backup.
//

const ip = require('ip');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { encrypt } = require('#helpers/encrypt-decrypt');

const IP_ADDRESS = ip.address();
const CHANNEL = `sqlite_backup_queue:${config.env}`;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

test('backups requested at once queue one backup', async (t) => {
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
  await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();
  const pass = await alias.createToken();
  await alias.save();

  const username = `${alias.name}@${domain.name}`;
  const session = {
    remoteAddress: IP_ADDRESS,
    user: {
      id: alias.id,
      username,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      password: encrypt(pass),
      storage_location: alias.storage_location,
      alias_has_pgp: alias.has_pgp,
      alias_public_key: alias.public_key,
      locale: 'en',
      owner_full_email: username
    }
  };
  await t.context.wsp.request({ action: 'setup', session }, 0);

  // (the backups queued for the worker)
  const queued = [];
  const { client } = t.context.sqlite;
  const { publish } = client;
  client.publish = function (channel, message) {
    if (channel === CHANNEL) {
      queued.push(message);
      return Promise.resolve(0);
    }

    return publish.call(this, channel, message);
  };

  t.teardown(() => {
    client.publish = publish;
  });

  const results = await Promise.allSettled(
    Array.from({ length: 5 }, () =>
      t.context.wsp.request(
        {
          action: 'backup',
          backup_at: new Date().toISOString(),
          session
        },
        0
      )
    )
  );

  t.is(queued.length, 1);
  t.is(results.filter((r) => r.status === 'fulfilled').length, 1);
});
