/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// End-to-end behaviour of a mailbox password reset through the real API ->
// controller -> WebSocket -> SQLite server path (helpers/reset-mailbox.js):
//
//  - the first password creates the mailbox, an override replaces it with a
//    fresh one, and in both cases the rotation is settled (no `is_rekey`
//    state or rekey lock left behind) with nothing else left on disk
//  - the previous password can no longer open the replaced mailbox, and the
//    new one can: the tokens in MongoDB and the key of the file never
//    disagree, so the corruption recovery of helpers/get-database.js (and
//    its "needs password reset" alert) can never be triggered by a reset
//  - a reset that cannot prove exclusivity (a connection to the mailbox is
//    open in another process) fails without touching the mailbox and
//    restores the previous tokens, so the previous password keeps working
//  - a reset is refused while another rotation of the alias is in progress
//

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { fork } = require('node:child_process');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const getPathToDatabase = require('#helpers/get-path-to-database');
const openDatabaseHandle = require('#helpers/open-database-handle');
const phrases = require('#config/phrases');
const workerConfig = require('#helpers/sqlite-worker-config');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { getRekeyLockKey } = require('#helpers/rekey-lock');

const client = new Redis();
client.setMaxListeners(0);
const resolver = createTangerine(client);

test.before(utils.setupMongoose);
test.before((t) => {
  t.context.quiesceTimeout = workerConfig.RESET_QUIESCE_TIMEOUT;
  // the SQLite server runs in this process: keep the refusal case quick
  workerConfig.RESET_QUIESCE_TIMEOUT = ms('4s');
});
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  workerConfig.RESET_QUIESCE_TIMEOUT = t.context.quiesceTimeout;
});
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

async function createUserDomainAlias(t) {
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
      resolver,
      has_smtp: true
    })
    .create();

  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({ name: 'test' });
  t.is(res.status, 200);

  const alias = await Aliases.findById(res.body.id).lean().exec();
  const storagePath = getPathToDatabase({
    id: alias.id,
    storage_location: alias.storage_location
  });

  return { user, domain, aliasId: res.body.id, storagePath };
}

function generatePassword(t, { user, domain, aliasId }, body) {
  return t.context.api
    .post(`/v1/domains/${domain.name}/aliases/${aliasId}/generate-password`)
    .auth(user[config.userFields.apiToken])
    .send(body);
}

async function getRotationState(aliasId) {
  const alias = await Aliases.findById(aliasId)
    .select(
      '+tokens.hash +tokens.salt +rekey_id +rekey_previous_tokens +rekey_processing +rekey_swap_ino +rekey_swapped_at'
    )
    .lean()
    .exec();
  return alias;
}

function assertSettled(t, alias) {
  t.false(alias.is_rekey);
  for (const field of [
    'rekey_started_at',
    'rekey_previous_tokens',
    'rekey_id',
    'rekey_processing',
    'rekey_claimed_at',
    'rekey_swap_ino',
    'rekey_swapped_at'
  ])
    t.false(field in alias, `${field} should be cleared`);
}

function session(aliasId, password) {
  return {
    user: {
      alias_id: aliasId,
      password: encrypt(password),
      domain_name: 'example.com'
    }
  };
}

//
// Whether `password` opens the mailbox (read-write: closing the last
// read-write connection removes the -wal/-shm files again).  Resolves with
// the names of the tables when it does, `false` when it is the wrong key.
//
async function opensWith(storagePath, aliasId, password) {
  try {
    const db = await openDatabaseHandle(
      storagePath,
      session(aliasId, password)
    );
    try {
      return db
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
        .pluck()
        .all();
    } finally {
      db.close();
    }
  } catch (err) {
    if (err.code === 'SQLITE_NOTADB') return false;
    throw err;
  }
}

// (the -wal/-shm files of the handle the SQLite server keeps cached are
//  normal; a copy, a quarantined file, a journal or a lock would not be)
function filesOf(storagePath) {
  const base = path.basename(storagePath, '.sqlite');
  return fs
    .readdirSync(path.dirname(storagePath))
    .filter(
      (name) =>
        name.startsWith(base) &&
        !name.endsWith('.sqlite-wal') &&
        !name.endsWith('.sqlite-shm')
    )
    .sort();
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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reset-holder-'));
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

test('the first password creates the mailbox and an override replaces it', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId, storagePath } = ctx;

  // first password: a mailbox that the password opens
  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  t.is(typeof first.body.password, 'string');
  const firstPassword = first.body.password;

  let alias = await getRotationState(aliasId);
  assertSettled(t, alias);
  t.is(alias.tokens.length, 1);
  t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);

  const before = fs.statSync(storagePath, { bigint: true });
  const tables = await opensWith(storagePath, aliasId, firstPassword);
  t.true(Array.isArray(tables) && tables.includes('Mailboxes'));
  t.deepEqual(filesOf(storagePath), [path.basename(storagePath)]);

  // override: a fresh mailbox that only the new password opens
  const second = await generatePassword(t, ctx, { is_override: true });
  t.is(second.status, 200);
  const secondPassword = second.body.password;
  t.not(secondPassword, firstPassword);

  alias = await getRotationState(aliasId);
  assertSettled(t, alias);
  t.is(alias.tokens.length, 1);
  t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  t.is(await t.context.client.get(`db_swap_lock:${aliasId}`), null);

  const after = fs.statSync(storagePath, { bigint: true });
  t.not(after.ino, before.ino);
  t.false(await opensWith(storagePath, aliasId, firstPassword));
  const freshTables = await opensWith(storagePath, aliasId, secondPassword);
  t.true(Array.isArray(freshTables) && freshTables.includes('Mailboxes'));

  // nothing else is left next to the mailbox: no copy, no quarantine, no lock
  t.deepEqual(filesOf(storagePath), [path.basename(storagePath)]);
});

test('a reset that cannot prove exclusivity leaves the mailbox and the previous password intact', async (t) => {
  t.timeout(ms('2m'));
  const ctx = await createUserDomainAlias(t);
  const { aliasId, storagePath } = ctx;

  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  const firstPassword = first.body.password;
  const before = fs.statSync(storagePath, { bigint: true });
  const state = await getRotationState(aliasId);
  const tokenHash = state.tokens[0].hash;

  // a connection to the mailbox in another process (its -wal proves it)
  const holder = startHolder(t, storagePath, firstPassword);
  await pWaitFor(() => holder.open, { timeout: ms('30s') });
  t.true(fs.existsSync(`${storagePath}-wal`));

  const failed = await generatePassword(t, ctx, { is_override: true });
  t.is(failed.status, 409);
  t.is(failed.body.message, phrases.MAILBOX_CREATION_FAILED);

  // the rotation was rolled back: same tokens, same file, no state left
  const alias = await getRotationState(aliasId);
  assertSettled(t, alias);
  t.is(alias.tokens.length, 1);
  t.is(alias.tokens[0].hash, tokenHash);
  t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  t.is(fs.statSync(storagePath, { bigint: true }).ino, before.ino);

  holder.child.send('stop');
  await pWaitFor(() => holder.exitCode !== null, { timeout: ms('30s') });
  t.is(holder.exitCode, 0);

  // the previous password still opens the (untouched) mailbox
  const tables = await opensWith(storagePath, aliasId, firstPassword);
  t.true(Array.isArray(tables) && tables.includes('holder'));
  t.deepEqual(filesOf(storagePath), [path.basename(storagePath)]);

  // and the reset goes through once the connection is gone
  const second = await generatePassword(t, ctx, { is_override: true });
  t.is(second.status, 200);
  assertSettled(t, await getRotationState(aliasId));
  t.false(await opensWith(storagePath, aliasId, firstPassword));
  t.true(
    Array.isArray(await opensWith(storagePath, aliasId, second.body.password))
  );
  t.deepEqual(filesOf(storagePath), [path.basename(storagePath)]);
});

test('a reset is refused while another rotation is in progress', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId, storagePath } = ctx;

  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  const before = fs.statSync(storagePath, { bigint: true });

  await Aliases.updateOne(
    { _id: aliasId },
    { $set: { is_rekey: true, rekey_started_at: new Date() } }
  );

  const res = await generatePassword(t, ctx, { is_override: true });
  t.is(res.status, 409);
  t.is(res.body.message, phrases.ALIAS_REKEY_IN_PROGRESS);

  // untouched
  t.is(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
  t.true(
    (await opensWith(storagePath, aliasId, first.body.password)) !== false
  );
});

test('a password change with the current password starts a rekey with a usable rollback snapshot', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId, storagePath } = ctx;

  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  const before = await getRotationState(aliasId);
  const before_ = fs.statSync(storagePath, { bigint: true });

  const res = await generatePassword(t, ctx, { password: first.body.password });
  t.is(res.status, 200);
  t.is(
    res.body.message,
    phrases.ALIAS_REKEY_STARTED.replace('%s', `test@${ctx.domain.name}`)
  );

  // the rotation is in progress: queued for the worker, auth refused
  const alias = await getRotationState(aliasId);
  t.true(alias.is_rekey);
  t.is(typeof alias.rekey_id, 'string');
  t.is(await t.context.client.get(getRekeyLockKey(aliasId)), alias.rekey_id);
  t.is(
    await t.context.client.llen(`rekey_queue:${config.env}`),
    1,
    'one rekey job queued'
  );

  // the rollback snapshot is the previous token, with everything a
  // rollback needs to make the previous password work again
  // (read raw: the token fields are `select: false` at every level)
  const raw = await Aliases.collection.findOne({
    _id: new mongoose.Types.ObjectId(aliasId)
  });
  t.log(JSON.stringify(raw.rekey_previous_tokens));
  t.is(raw.rekey_previous_tokens.length, 1);
  t.is(raw.rekey_previous_tokens[0].hash, before.tokens[0].hash);
  t.is(raw.rekey_previous_tokens[0].salt, before.tokens[0].salt);
  t.not(raw.tokens[0].hash, before.tokens[0].hash);

  // nothing happened to the mailbox (the worker does the work)
  t.is(fs.statSync(storagePath, { bigint: true }).ino, before_.ino);
});
