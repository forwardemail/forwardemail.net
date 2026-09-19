/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// End-to-end behaviour of the corruption recovery in helpers/get-database.js
// through the real WebSocket -> SQLite server path, for a mailbox with a
// damaged page (a single flipped bit: every page is authenticated):
//
//  - the unreadable mailbox is quarantined next to the fresh one instead of
//    being deleted, so it can be recovered by hand
//  - nothing is touched while a connection to the mailbox is still open in
//    another process (a stale connection that closes later would unlink
//    the fresh mailbox's -wal/-shm files); the next request tries again
//  - nothing is touched while the alias' password is being rotated
//

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { fork } = require('node:child_process');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');

const Aliases = require('#models/aliases');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getPathToDatabase = require('#helpers/get-path-to-database');
const openDatabaseHandle = require('#helpers/open-database-handle');
const workerConfig = require('#helpers/sqlite-worker-config');
const { encrypt } = require('#helpers/encrypt-decrypt');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.before((t) => {
  t.context.quiesceTimeout = workerConfig.RECOVERY_QUIESCE_TIMEOUT;
  // the SQLite server runs in this process: keep the deferral case quick
  workerConfig.RECOVERY_QUIESCE_TIMEOUT = ms('3s');
});

test.after.always(utils.teardownMongoose);

test.after.always((t) => {
  workerConfig.RECOVERY_QUIESCE_TIMEOUT = t.context.quiesceTimeout;
});

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
  t.context.pass = pass;
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

  // creates the mailbox
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

// make the SQLite server drop its cached handle (as a rotation would)
async function dropCachedHandle(t) {
  await t.context.client.publish('sqlite_auth_reset', t.context.alias.id);
  await pWaitFor(() => !t.context.sqlite.databaseMap.get(t.context.alias.id), {
    timeout: ms('10s')
  });
  await pWaitFor(() => !fs.existsSync(`${t.context.storagePath}-wal`), {
    timeout: ms('10s')
  });
}

//
// One flipped bit in a page: every page is authenticated, so the mailbox
// reads as corrupted the moment the page is read (a damaged first page
// reads as "not a database", which is what a wrong password yields too; a
// mailbox this young is never recovered from that, see the 7-day guard in
// helpers/get-database.js, so a later page is damaged here).
//
function damagePage(storagePath, page = 2) {
  const fd = fs.openSync(storagePath, 'r+');
  try {
    const byte = Buffer.alloc(1);
    const position = (page - 1) * 4096 + 1000;
    fs.readSync(fd, byte, 0, 1, position);
    // eslint-disable-next-line no-bitwise
    byte[0] ^= 0x01;
    fs.writeSync(fd, byte, 0, 1, position);
  } finally {
    fs.closeSync(fd);
  }
}

function filesOf(storagePath) {
  const base = path.basename(storagePath, '.sqlite');
  return fs
    .readdirSync(path.dirname(storagePath))
    .filter((name) => name.startsWith(base))
    .sort();
}

function quarantinedFiles(storagePath) {
  return filesOf(storagePath).filter((name) => name.includes('.quarantine-'));
}

// a process that keeps a connection to the mailbox open until told to stop
const HOLDER_SOURCE = `
const process = require('node:process');
const openDatabaseHandle = require(process.argv[2]);
const [storagePath, password] = process.argv.slice(3);
(async () => {
  const db = await openDatabaseHandle(storagePath, {
    user: { password, domain_name: 'example.com' }
  });
  db.exec('CREATE TABLE IF NOT EXISTS holder (id INTEGER PRIMARY KEY)');
  db.prepare('INSERT INTO holder DEFAULT VALUES').run();
  process.send({ open: true });
  process.on('message', (message) => {
    if (message !== 'stop') return;
    db.close();
    process.exit(0);
  });
})();
`;

function startHolder(t, storagePath, password) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'recovery-holder-'));
  const script = path.join(dir, 'holder.js');
  fs.writeFileSync(script, HOLDER_SOURCE);
  const child = fork(
    script,
    [
      path.join(__dirname, '../../helpers/open-database-handle.js'),
      storagePath,
      encrypt(password)
    ],
    {
      cwd: path.join(__dirname, '../..'),
      stdio: ['ignore', 'ignore', 'inherit', 'ipc']
    }
  );
  const holder = { child, open: false, exitCode: null };
  child.on('message', (message) => {
    if (message.open) holder.open = true;
  });
  child.on('exit', (code) => {
    holder.exitCode = code;
  });
  t.teardown(() => {
    if (holder.exitCode === null) child.kill('SIGKILL');
    fs.rmSync(dir, { recursive: true, force: true });
  });
  return holder;
}

test('quarantines an unreadable mailbox instead of deleting it', async (t) => {
  const { storagePath, session, wsp } = t.context;
  await dropCachedHandle(t);
  const before = fs.statSync(storagePath, { bigint: true });
  t.true(before.size <= config.INITIAL_DB_SIZE);

  damagePage(storagePath);

  // the next request recovers: a fresh mailbox is created
  await wsp.request({ action: 'setup', session }, 0);

  const after = fs.statSync(storagePath, { bigint: true });
  t.not(after.ino, before.ino);

  // the damaged file was kept, under its quarantine name, with its inode
  const quarantined = quarantinedFiles(storagePath);
  t.is(quarantined.length, 1);
  t.regex(quarantined[0], /\.sqlite\.quarantine-\d+$/);
  const quarantinedPath = path.join(path.dirname(storagePath), quarantined[0]);
  t.is(fs.statSync(quarantinedPath, { bigint: true }).ino, before.ino);

  // and the fresh mailbox opens with the password
  await dropCachedHandle(t);
  const db = await openDatabaseHandle(storagePath, session);
  try {
    t.is(db.pragma('integrity_check', { simple: true }), 'ok');
  } finally {
    db.close();
  }
});

test('leaves the mailbox alone while a connection to it is open elsewhere', async (t) => {
  t.timeout(ms('2m'));
  const { storagePath, session, wsp, pass } = t.context;
  await dropCachedHandle(t);
  const before = fs.statSync(storagePath, { bigint: true });

  const holder = startHolder(t, storagePath, pass);
  await pWaitFor(() => holder.open, { timeout: ms('30s') });
  t.true(fs.existsSync(`${storagePath}-wal`));

  damagePage(storagePath);

  // the recovery is deferred: the request fails, nothing changes
  // (the message is sanitized for clients; the code survives)
  const err = await t.throwsAsync(wsp.request({ action: 'setup', session }, 0));
  t.is(err.code, 'SQLITE_CORRUPT');
  t.is(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
  t.deepEqual(quarantinedFiles(storagePath), []);
  // the cooldown was released so the next request can try again
  t.is(await t.context.client.get(`corrupt_reset:${t.context.alias.id}`), null);

  holder.child.send('stop');
  await pWaitFor(() => holder.exitCode !== null, { timeout: ms('30s') });
  t.is(holder.exitCode, 0);

  // once the connection is gone the next request recovers
  await wsp.request({ action: 'setup', session }, 0);
  t.not(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
  t.is(quarantinedFiles(storagePath).length, 1);
});

test('leaves the mailbox alone while the alias password is being rotated', async (t) => {
  const { storagePath, session, wsp, alias } = t.context;
  await dropCachedHandle(t);
  const before = fs.statSync(storagePath, { bigint: true });

  await Aliases.updateOne(
    { _id: alias._id },
    { $set: { is_rekey: true, rekey_started_at: new Date() } }
  );
  damagePage(storagePath);

  const err = await t.throwsAsync(wsp.request({ action: 'setup', session }, 0));
  t.is(err.code, 'SQLITE_CORRUPT');
  t.is(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
  t.deepEqual(quarantinedFiles(storagePath), []);
});
