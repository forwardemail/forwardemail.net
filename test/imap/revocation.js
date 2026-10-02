/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An open IMAP session only re-checks its alias once a day, so disabling or
// deleting the alias, or banning its owner, has to close the session right
// away. PGP and S/MIME changes reach open sessions of that alias only.
//

const Axe = require('axe');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const { ImapFlow } = require('imapflow');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const Aliases = require('#models/aliases');
const Users = require('#models/users');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { useRevocationClient } = require('#helpers/credential-revocation');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const logger = new Axe({ silent: true });
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
  // (model changes revoke through this client, as the servers' own do)
  useRevocationClient(t.context.client);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  t.context.server = await imap.listen(port);
  t.context.imap = imap;

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

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: imap.resolver,
      has_smtp: true
    })
    .create();

  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await imap.resolver.options.cache.mset(map);

  // the alias whose sessions are tested, and another one that is left alone
  const login = async () => {
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
    const imapFlow = new ImapFlow({
      host: IP_ADDRESS,
      port,
      secure: false,
      logger,
      tls,
      auth: { user: `${alias.name}@${domain.name}`, pass }
    });
    imapFlow.on('error', () => {});
    await imapFlow.connect();
    // (a command, so the alias was checked and the check is cached)
    await imapFlow.status('INBOX', { messages: true });
    t.true(Boolean(await t.context.client.get(`refresh_check:${alias.id}`)));
    const closed = new Promise((resolve) => {
      imapFlow.once('close', resolve);
    });
    return { alias, imapFlow, closed };
  };

  t.context.target = await login();
  t.context.bystander = await login();
});

test.afterEach.always(async (t) => {
  for (const { imapFlow } of [t.context.target, t.context.bystander]) {
    try {
      imapFlow?.close();
    } catch {}
  }

  for (const it of [t.context.imap, t.context.wsp, t.context.sqlite]) {
    try {
      await it?.close();
    } catch {}
  }
});

async function assertClosed(t) {
  const { target, bystander } = t.context;
  await Promise.race([
    target.closed,
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('session was not closed')), ms('10s'));
    })
  ]);
  t.pass();
  t.falsy(await t.context.client.get(`refresh_check:${target.alias.id}`));
  // the other alias's session is still usable
  const status = await bystander.imapFlow.status('INBOX', { messages: true });
  t.is(status.messages, 0);
}

test('disabling the alias closes its open sessions', async (t) => {
  const alias = await Aliases.findById(t.context.target.alias._id);
  alias.is_enabled = false;
  await alias.save();
  await assertClosed(t);
});

test('deleting the alias closes its open sessions', async (t) => {
  await Aliases.findByIdAndRemove(t.context.target.alias._id);
  await assertClosed(t);
});

test("banning the alias's owner closes its sessions", async (t) => {
  // (the bystander is moved to another owner first)
  const other = await t.context.userFactory.create();
  await Aliases.updateOne(
    { _id: t.context.bystander.alias._id },
    { $set: { user: other._id } }
  );
  // (moving an alias revokes it, so the bystander is not checked here)
  await t.context.bystander.closed;
  const user = await Users.findById(t.context.user._id);
  user[config.userFields.isBanned] = true;
  await user.save();
  await Promise.race([
    t.context.target.closed,
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('session was not closed')), ms('10s'));
    })
  ]);
  t.falsy(
    await t.context.client.get(`refresh_check:${t.context.target.alias.id}`)
  );
});

test('PGP and S/MIME changes reach open sessions of that alias only', async (t) => {
  const { target, bystander, imap, client } = t.context;
  await Aliases.updateOne(
    { _id: target.alias._id },
    { $set: { has_pgp: true, public_key: 'key', has_smime: true } }
  );
  await client.publish('pgp_reload', target.alias.id);
  await client.publish('smime_reload', target.alias.id);
  const sessions = (alias) =>
    [...imap.server.connections].filter(
      (connection) => connection?.session?.user?.alias_id === alias.id
    );
  await pWaitFor(
    () =>
      sessions(target.alias).every(
        (c) =>
          c.session.user.alias_has_pgp === true &&
          c.session.user.alias_public_key === 'key' &&
          c.session.user.alias_has_smime === true
      ),
    { timeout: ms('10s') }
  );
  t.is(sessions(target.alias).length, 1);
  for (const c of sessions(bystander.alias)) {
    t.falsy(c.session.user.alias_has_pgp);
    t.falsy(c.session.user.alias_public_key);
    t.falsy(c.session.user.alias_has_smime);
  }
});
