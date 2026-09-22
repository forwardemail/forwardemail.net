/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The shutdown of a SQLite server (what `sqlite.js` runs when pm2 stops the
// process): new work is refused at once, the requests in flight get to
// finish, then no new connection is accepted and every mailbox is
// checkpointed and closed.  A request that never finishes does not hold the
// process up past the drain timeout.
//

const fs = require('node:fs');
const { setTimeout } = require('node:timers/promises');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');

const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getPathToDatabase = require('#helpers/get-path-to-database');
const getTemporaryDatabase = require('#helpers/get-temporary-database');
const { encrypt } = require('#helpers/encrypt-decrypt');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  t.context.sqlitePort = sqlitePort;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;

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
      resolver: sqlite.resolver,
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
  t.context.alias = await alias.save();

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
      owner_full_email: user.email
    }
  };

  t.context.storagePath = getPathToDatabase({
    id: alias.id,
    storage_location: alias.storage_location
  });

  // creates the mailbox (and caches its handle on the server)
  await wsp.request({ action: 'setup', session: t.context.session }, 0);
});

test.afterEach.always(async (t) => {
  try {
    await t.context.wsp?.close();
  } catch {}

  try {
    await t.context.sqlite?.close();
  } catch {}
});

// a request of the SQLite server that reads the mailbox
function list(t) {
  return t.context.wsp.request(
    {
      action: 'list',
      session: t.context.session,
      query: '',
      path: '*'
    },
    0
  );
}

async function refused(t) {
  const err = await t.throwsAsync(list(t));
  t.is(err.responseCode, 421);
  t.regex(err.message, /shutting down/i);
}

test('waits for the requests in flight, then refuses new work and closes the mailboxes', async (t) => {
  const { alias, sqlite, sqlitePort, storagePath, wsp } = t.context;
  const db = sqlite.databaseMap.get(alias.id);
  t.true(db.open);
  await list(t);

  // a request in flight holds a reference on the handle
  t.is(sqlite.databaseMap.acquire(alias.id), db);

  const shutdown = sqlite.shutdown({
    drainTimeout: ms('10s'),
    drainInterval: 50
  });

  // new work is refused at once ...
  await refused(t);
  // ... while the request in flight keeps its handle
  await setTimeout(500);
  t.true(db.open);
  t.true(sqlite.isClosing);

  // the request finishes: the shutdown completes
  sqlite.databaseMap.release(alias.id, db);
  await shutdown;

  t.false(db.open);
  t.is(sqlite.databaseMap.size, 0);
  t.is(sqlite.databaseMap.activeReferences, 0);
  // the WAL was folded into the main file
  t.false(fs.existsSync(`${storagePath}-wal`));
  // the peer was disconnected, and no new connection is accepted
  await pWaitFor(() => !wsp.isOpened, { timeout: ms('10s') });
  const late = createWebSocketAsPromised({ port: sqlitePort });
  await t.throwsAsync(late.open());
  try {
    await late.close();
  } catch {}
});

test('a request that never finishes does not hold the shutdown up past the drain timeout', async (t) => {
  const { alias, sqlite } = t.context;
  const db = sqlite.databaseMap.get(alias.id);
  t.is(sqlite.databaseMap.acquire(alias.id), db);

  const started = Date.now();
  await sqlite.shutdown({ drainTimeout: 500, drainInterval: 50 });
  const elapsed = Date.now() - started;
  t.true(elapsed >= 500 && elapsed < 5000, `${elapsed}ms`);

  t.false(db.open);
  t.is(sqlite.databaseMap.size, 0);
});

test('the temporary mailboxes are closed with the others', async (t) => {
  const { alias, session, sqlite, wsp } = t.context;
  const tmpDb = await getTemporaryDatabase.call(sqlite, session);
  t.true(tmpDb.open);
  t.is(sqlite.temporaryDatabaseMap.get(alias.id), tmpDb);

  await sqlite.shutdown({ drainTimeout: 500, drainInterval: 50 });

  t.false(tmpDb.open);
  t.is(sqlite.temporaryDatabaseMap.size, 0);
  await pWaitFor(() => !wsp.isOpened, { timeout: ms('10s') });
});
