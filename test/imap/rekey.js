/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// End-to-end behaviour of a mailbox whose alias password is being rotated,
// through the real IMAP server -> WebSocket -> SQLite server path:
//
//  - the SQLite server refuses mailbox operations of the alias (the error
//    reaches the requester with its retryable code intact), at the latest
//    once its brief negative cache of the gate has expired
//  - inbound mail is written to the temporary mailbox instead of the live
//    file, even though the SQLite server holds a cached handle to it (an
//    IMAP session is open), so nothing can be lost when the worker swaps
//    the rekeyed copy over the live file
//  - the rotation's announcement (`sqlite_auth_reset`, published by the
//    controller) makes the SQLite server drop that cached handle
//  - once the rotation is over, the message is synced into the mailbox
//

const process = require('node:process');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

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
const Messages = require('#models/messages');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getDatabase = require('#helpers/get-database');
const getTemporaryDatabase = require('#helpers/get-temporary-database');
const { acquireRekeyLock, releaseRekeyLock } = require('#helpers/rekey-lock');
const { encrypt } = require('#helpers/encrypt-decrypt');

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
  t.context.port = port;
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
  t.context.domain = domain;

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  t.context.pass = pass;

  t.context.session = {
    remoteAddress: IP_ADDRESS,
    user: {
      id: alias.id,
      username: `${alias.name}@${domain.name}`,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      password: encrypt(pass),
      storage_location: alias.storage_location,
      alias_has_pgp: alias.has_pgp,
      alias_public_key: alias.public_key,
      locale: 'en',
      owner_full_email: `${alias.name}@${domain.name}`
    }
  };

  await wsp.request({ action: 'setup', session: t.context.session }, 0);
  t.context.alias = await alias.save();

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

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port,
    secure: false,
    logger,
    tls,
    auth: { user: `${alias.name}@${domain.name}`, pass },
    commandTimeout: 120000
  });
  await imapFlow.connect();
  t.context.imapFlow = imapFlow;

  await getDatabase(imap, alias, t.context.session);
});

test.afterEach.always(async (t) => {
  try {
    await t.context.imapFlow?.logout();
  } catch {}

  try {
    await t.context.imap?.close();
  } catch {}

  try {
    await t.context.wsp?.close();
  } catch {}

  try {
    await t.context.sqlite?.close();
  } catch {}

  try {
    await t.context.server?.close();
  } catch {}
});

function rawMessage(subject) {
  return Buffer.from(
    `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
To: foo@foo.com
From: beep@beep.com
Subject: ${subject}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim()
  );
}

async function deliver(t, subject) {
  return t.context.wsp.request(
    {
      action: 'tmp',
      aliases: [
        {
          address: `${t.context.alias.name}@${t.context.domain.name}`,
          id: t.context.alias.id
        }
      ],
      remoteAddress: IP_ADDRESS,
      date: new Date().toISOString(),
      raw: rawMessage(subject)
    },
    0
  );
}

test('inbound mail and mailbox operations while the alias is being rekeyed', async (t) => {
  t.timeout(ms('2m'));
  const { alias, client, imap, imapFlow, session, sqlite, wsp } = t.context;

  // an IMAP session is open, so the SQLite server has a cached handle to the
  // live mailbox and inbound mail normally goes straight into it
  await imapFlow.mailboxOpen('INBOX');
  t.truthy(sqlite.databaseMap.get(alias.id));

  const beforeSubject = randomUUID();
  t.deepEqual(await deliver(t, beforeSubject), {});
  const before = await Messages.findOne(imap, session, {
    subject: beforeSubject
  });
  t.truthy(before);
  // the delivery borrowed the cached handle with a reference and gave it
  // back, so a rotation can still close the handle once it is idle
  t.is(sqlite.databaseMap._map.get(alias.id).refcount, 0);

  //
  // the controller starts a rotation: is_rekey + the operation-scoped lock
  // (and it closes IMAP sessions, which is not needed for what is asserted
  // here: the point is that a cached handle still exists on the server)
  //
  const rekeyId = randomUUID();
  await Aliases.updateOne(
    { _id: alias._id },
    {
      $set: { is_rekey: true, rekey_id: rekeyId, rekey_started_at: new Date() }
    }
  );
  await acquireRekeyLock(client, alias.id, rekeyId);
  t.truthy(sqlite.databaseMap.get(alias.id));

  //
  // Mailbox operations are refused with a retryable error over the wire.
  // The announcement that normally follows the lock is deliberately not
  // published yet (it also drops the cached handle, which the delivery
  // below must still find): without it the server's brief negative answer
  // for this alias simply expires.
  //
  await setTimeout(ms('2.5s'));
  const err = await t.throwsAsync(
    wsp.request({ action: 'status', session }, 0)
  );
  t.is(err.code, 'SQLITE_BUSY');
  t.is(err.responseCode, 421);
  t.true(err.isRekeying);

  // inbound mail is accepted, but lands in the temporary mailbox, not in
  // the live file that is about to be replaced
  const duringSubject = randomUUID();
  t.deepEqual(await deliver(t, duringSubject), {});

  const tmpDb = await getTemporaryDatabase.call(sqlite, session);
  const queued = tmpDb
    .prepare('SELECT count(*) AS count FROM TemporaryMessages')
    .pluck()
    .get();
  t.is(queued, 1);

  const liveDb = sqlite.databaseMap.get(alias.id);
  t.truthy(liveDb);
  t.is(
    liveDb
      .prepare('SELECT count(*) AS count FROM Messages WHERE subject = ?')
      .pluck()
      .get(duringSubject),
    0
  );

  // the announcement of the rotation drops the cached handle everywhere
  // (IMAP sessions of the alias are closed as well)
  await client.publish('sqlite_auth_reset', alias.id);
  await pWaitFor(() => !sqlite.databaseMap.get(alias.id), {
    timeout: ms('10s')
  });
  // the alias is still refused right away (nothing to wait for now)
  const again = await t.throwsAsync(
    wsp.request({ action: 'status', session }, 0)
  );
  t.true(again.isRekeying);

  // the rotation ends (finalized by the worker): the message is synced in
  await Aliases.updateOne(
    { _id: alias._id },
    { $set: { is_rekey: false }, $unset: { rekey_id: 1, rekey_started_at: 1 } }
  );
  await releaseRekeyLock(client, alias.id, rekeyId);

  await wsp.request({ action: 'sync', session }, 0);
  const during = await Messages.findOne(imap, session, {
    subject: duringSubject
  });
  t.truthy(during);
  t.is(
    tmpDb
      .prepare('SELECT count(*) AS count FROM TemporaryMessages')
      .pluck()
      .get(),
    0
  );
  t.is(process.env.NODE_ENV, 'test');
});

//
// A login is refused while the alias is being rekeyed, whether it is checked
// against MongoDB or served from the authentication cache (a session that
// logged in a moment ago filled it), and the sessions the alias has open are
// closed when the rotation announces itself.
//
test('IMAP login is refused while the alias is being rekeyed', async (t) => {
  t.timeout(ms('2m'));
  const { alias, client, domain, imapFlow, pass, port } = t.context;

  const login = async () => {
    const flow = new ImapFlow({
      host: IP_ADDRESS,
      port,
      secure: false,
      logger,
      tls,
      auth: { user: `${alias.name}@${domain.name}`, pass },
      commandTimeout: 120000
    });
    await flow.connect();
    return flow;
  };

  // (the session of the setup filled the authentication cache)
  const before = await login();
  await before.logout();

  const rekeyId = randomUUID();
  await Aliases.updateOne(
    { _id: alias._id },
    {
      $set: { is_rekey: true, rekey_id: rekeyId, rekey_started_at: new Date() }
    }
  );
  await acquireRekeyLock(client, alias.id, rekeyId);

  const err = await t.throwsAsync(login());
  t.true(err.authenticationFailed);

  // the announcement closes the session that was open before the rotation
  t.true(imapFlow.usable);
  await client.publish('sqlite_auth_reset', alias.id);
  await pWaitFor(() => !imapFlow.usable, { timeout: ms('30s') });

  // the rotation ends
  await Aliases.updateOne(
    { _id: alias._id },
    { $set: { is_rekey: false }, $unset: { rekey_id: 1, rekey_started_at: 1 } }
  );
  await releaseRekeyLock(client, alias.id, rekeyId);
  const after = await login();
  await after.logout();
  t.pass();
});
