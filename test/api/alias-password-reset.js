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
//  - the state of a rotation and the secrets of the tokens never leave the
//    server, authentication follows the rotation (refused while it runs,
//    cached credentials included), and the sqlite server only serves the
//    reset of the rotation in progress
//

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');
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
const isValidPassword = require('#helpers/is-valid-password');
const openDatabaseHandle = require('#helpers/open-database-handle');
const phrases = require('#config/phrases');
const workerConfig = require('#helpers/sqlite-worker-config');
const { encrypt } = require('#helpers/encrypt-decrypt');
const {
  acquireRekeyLock,
  getRekeyLockKey,
  releaseRekeyLock
} = require('#helpers/rekey-lock');

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
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  // the domain is verified for the API server (alias authentication)
  await t.context.resolver.options.cache.mset(
    new Map([
      [
        `txt:${domain.name}`,
        t.context.resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );

  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({ name: 'test', has_imap: true });
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

// the status of a request of the alias itself (mailbox credentials)
async function statusAs(t, { domain }, password) {
  const res = await t.context.api
    .get('/v1/contacts')
    .set(
      'Authorization',
      `Basic ${Buffer.from(`test@${domain.name}:${password}`).toString(
        'base64'
      )}`
    );
  return res.status;
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

  // the (generated) new password is returned, it is never emailed
  t.is(res.body.username, `test@${ctx.domain.name}`);
  t.true(typeof res.body.password === 'string' && res.body.password.length > 0);
  t.not(res.body.password, first.body.password);

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
  // the job the worker will take is the rotation that is persisted: its
  // operation ID (which the worker claims by compare-and-set) and the alias
  const job = JSON.parse(
    await t.context.client.lindex(`rekey_queue:${config.env}`, 0)
  );
  t.is(job.action, 'rekey');
  t.is(job.rekey_id, alias.rekey_id);
  t.is(job.session.user.alias_id, aliasId);
  t.is(typeof job.new_password, 'string');

  // the rollback snapshot is the previous token, with everything a
  // rollback needs to make the previous password work again
  // (read raw: the token fields are `select: false` at every level)
  const raw = await Aliases.collection.findOne({
    _id: new mongoose.Types.ObjectId(aliasId)
  });
  t.is(raw.rekey_previous_tokens.length, 1);
  t.is(raw.rekey_previous_tokens[0].hash, before.tokens[0].hash);
  t.is(raw.rekey_previous_tokens[0].salt, before.tokens[0].salt);
  t.not(raw.tokens[0].hash, before.tokens[0].hash);

  // nothing happened to the mailbox (the worker does the work)
  t.is(fs.statSync(storagePath, { bigint: true }).ino, before_.ino);
});

//
// A token without a salt or a hash cannot validate any password.  Aliases
// carry such tokens from rollbacks of the old code, whose snapshots were
// stripped of both: their owners must still be able to set a new password,
// and a rotation must not preserve tokens that could never work.
//
test('an alias whose tokens cannot validate a password can still be reset', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId, storagePath } = ctx;

  // a mailbox exists, keyed with a password that is no longer known
  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  t.true(fs.existsSync(storagePath));

  // the legacy damage: the token lost its salt and hash
  await Aliases.collection.updateOne(
    { _id: new mongoose.Types.ObjectId(aliasId) },
    {
      $set: {
        tokens: [
          {
            _id: new mongoose.Types.ObjectId(),
            description: 'legacy',
            has_pbkdf2_migration: false
          }
        ]
      }
    }
  );
  // (the key of the file did not change; the password just cannot be
  //  validated any more, which is what locks the owner out)
  const damaged = await getRotationState(aliasId);
  t.false(await isValidPassword(damaged.tokens, first.body.password));
  t.true(
    Array.isArray(await opensWith(storagePath, aliasId, first.body.password))
  );

  const reset = await generatePassword(t, ctx, { is_override: true });
  t.is(reset.status, 200, `${JSON.stringify(reset.body)}`);
  t.is(typeof reset.body.password, 'string');

  const alias = await getRotationState(aliasId);
  assertSettled(t, alias);
  t.is(alias.tokens.length, 1);
  t.is(typeof alias.tokens[0].salt, 'string');
  t.is(typeof alias.tokens[0].hash, 'string');
  const tables = await opensWith(storagePath, aliasId, reset.body.password);
  t.true(Array.isArray(tables) && tables.includes('Mailboxes'));
  t.deepEqual(filesOf(storagePath), [path.basename(storagePath)]);
});

test('a rekey drops tokens that cannot validate a password from its snapshot', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId } = ctx;

  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  const before = await getRotationState(aliasId);

  // a legacy token next to the usable one
  await Aliases.collection.updateOne(
    { _id: new mongoose.Types.ObjectId(aliasId) },
    {
      $push: {
        tokens: {
          _id: new mongoose.Types.ObjectId(),
          description: 'legacy',
          has_pbkdf2_migration: false
        }
      }
    }
  );

  const res = await generatePassword(t, ctx, { password: first.body.password });
  t.is(res.status, 200, `${JSON.stringify(res.body)}`);

  // the snapshot holds the usable token only
  const raw = await Aliases.collection.findOne({
    _id: new mongoose.Types.ObjectId(aliasId)
  });
  t.true(raw.is_rekey);
  t.is(raw.rekey_previous_tokens.length, 1);
  t.is(raw.rekey_previous_tokens[0].hash, before.tokens[0].hash);
  t.is(raw.rekey_previous_tokens[0].salt, before.tokens[0].salt);
  t.is(raw.tokens.length, 1);
  t.is(typeof raw.tokens[0].salt, 'string');
});

test('the state of a rotation and the secrets of the tokens never leave the server', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { user, domain, aliasId } = ctx;

  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  const res = await generatePassword(t, ctx, { password: first.body.password });
  t.is(res.status, 200);

  const raw = await Aliases.collection.findOne({
    _id: new mongoose.Types.ObjectId(aliasId)
  });
  t.true(raw.is_rekey);
  const secrets = [
    raw.tokens[0].hash,
    raw.tokens[0].salt,
    raw.rekey_previous_tokens[0].hash,
    raw.rekey_previous_tokens[0].salt,
    raw.rekey_id
  ];
  const hidden = [
    'is_rekey',
    'rekey_id',
    'rekey_previous_tokens',
    'rekey_started_at',
    'rekey_processing',
    'rekey_claimed_at',
    'rekey_swap_ino',
    'rekey_swapped_at',
    'tokens'
  ];

  // the owner's view of the alias
  for (const url of [
    `/v1/domains/${domain.name}/aliases/${aliasId}`,
    `/v1/domains/${domain.name}/aliases`
  ]) {
    const view = await t.context.api
      .get(url)
      .auth(user[config.userFields.apiToken]);
    t.is(view.status, 200);
    const body = JSON.stringify(view.body);
    for (const field of hidden)
      t.false(body.includes(`"${field}"`), `${field} is exposed by ${url}`);
    for (const secret of secrets) t.false(body.includes(secret));
  }

  // and what the code gets unless it asks for them: the flag (checked on
  // every authentication) but neither the operation nor the secrets
  const alias = await Aliases.findById(aliasId).lean().exec();
  t.true(alias.is_rekey);
  for (const field of [
    'rekey_id',
    'rekey_previous_tokens',
    'rekey_processing',
    'rekey_claimed_at',
    'rekey_swap_ino',
    'rekey_swapped_at'
  ])
    t.false(field in alias, `${field} is selected by default`);
  t.is(alias.tokens.length, 1);
  for (const field of ['hash', 'salt', 'description'])
    t.false(field in alias.tokens[0], `tokens.${field} is selected by default`);
});

test('alias authentication follows the rotation: refused while it runs, cached or not, and the previous password once it is over', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId } = ctx;

  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  const { password } = first.body;
  // the entry of the authentication cache (helpers/on-auth.js) the second
  // request is served from
  const cacheKey = `auth_cache:test@${ctx.domain.name}:${crypto
    .createHash('sha256')
    .update(password)
    .digest('hex')
    .slice(0, 16)}`;

  t.is(await t.context.client.get(cacheKey), null);
  t.is(await statusAs(t, ctx, password), 200);
  t.truthy(await t.context.client.get(cacheKey));
  t.is(await statusAs(t, ctx, password), 200);
  t.is(await statusAs(t, ctx, 'wrong password'), 401);

  // the controller starts a rotation: the flag and the operation-scoped
  // lock, which cache hits are checked against
  const rekeyId = crypto.randomUUID();
  await Aliases.updateOne(
    { _id: aliasId },
    {
      $set: { is_rekey: true, rekey_id: rekeyId, rekey_started_at: new Date() }
    }
  );
  await acquireRekeyLock(t.context.client, aliasId, rekeyId);
  t.truthy(await t.context.client.get(cacheKey));
  t.is(await statusAs(t, ctx, password), 401);

  // the rotation is over
  await Aliases.updateOne(
    { _id: aliasId },
    { $set: { is_rekey: false }, $unset: { rekey_id: 1, rekey_started_at: 1 } }
  );
  await releaseRekeyLock(t.context.client, aliasId, rekeyId);
  t.is(await statusAs(t, ctx, password), 200);

  // a reset replaces the password: the previous one is refused right away,
  // although it was cached a moment ago
  const second = await generatePassword(t, ctx, { is_override: true });
  t.is(second.status, 200);
  t.is(await t.context.client.get(cacheKey), null);
  t.is(await statusAs(t, ctx, password), 401);
  t.is(await statusAs(t, ctx, second.body.password), 200);
});

test('the sqlite server only serves the reset of the rotation in progress', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId, storagePath } = ctx;
  const { wsp } = t.context;

  const first = await generatePassword(t, ctx, {});
  t.is(first.status, 200);
  const before = fs.statSync(storagePath, { bigint: true });
  const alias = await Aliases.findById(aliasId).lean().exec();
  const reset = (rekeyId) =>
    wsp.request(
      {
        action: 'reset',
        rekey_id: rekeyId,
        session: {
          user: {
            id: aliasId,
            username: `test@${ctx.domain.name}`,
            alias_id: aliasId,
            alias_name: 'test',
            domain_id: ctx.domain.id,
            domain_name: ctx.domain.name,
            storage_location: alias.storage_location,
            password: encrypt('another password'),
            locale: 'en',
            owner_full_email: ctx.user.email
          }
        }
      },
      0
    );

  // a rotation is in progress: a reset of another operation is refused
  const rekeyId = crypto.randomUUID();
  await acquireRekeyLock(t.context.client, aliasId, rekeyId);
  let err = await t.throwsAsync(reset(crypto.randomUUID()));
  t.is(err.code, 'SQLITE_BUSY');
  t.is(err.responseCode, 421);
  t.true(err.isRekeying);

  // no rotation is in progress: a reset that claims to be one was rolled
  // back meanwhile and is refused as well
  await releaseRekeyLock(t.context.client, aliasId, rekeyId);
  err = await t.throwsAsync(reset(crypto.randomUUID()));
  t.is(err.responseCode, 409);
  t.true(err.isRekeySuperseded);

  // the mailbox was not touched either time
  t.is(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
  t.true(
    Array.isArray(await opensWith(storagePath, aliasId, first.body.password))
  );
  t.deepEqual(filesOf(storagePath), [path.basename(storagePath)]);
});

test('a custom password with characters that break SQL still opens the mailbox, quotes are refused', async (t) => {
  const ctx = await createUserDomainAlias(t);
  const { aliasId, storagePath } = ctx;

  const refused = await generatePassword(t, ctx, {
    new_password: "correct horse battery 'staple' 2026"
  });
  t.is(refused.status, 400);
  t.is(refused.body.message, phrases.INVALID_PASSWORD_CHARACTERS);
  t.false(fs.existsSync(storagePath));

  // spaces, a semicolon, a backslash, a backtick, a percent sign and
  // non-ASCII letters: none of them is escaped anywhere, the password is
  // handed to SQLite as bytes
  const password = 'Sp;ace\\Back`tick %Perc Ünïcödé-9f2';
  const res = await generatePassword(t, ctx, { new_password: password });
  t.is(res.status, 200, `${JSON.stringify(res.body)}`);
  t.is(res.body.password, password);
  const tables = await opensWith(storagePath, aliasId, password);
  t.true(Array.isArray(tables) && tables.includes('Mailboxes'));
  t.is(await statusAs(t, ctx, password), 200);
});
