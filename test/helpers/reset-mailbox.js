/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { fork } = require('node:child_process');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const openDatabaseHandle = require('#helpers/open-database-handle');
const resetMailbox = require('#helpers/reset-mailbox');
const workerConfig = require('#helpers/sqlite-worker-config');
const { encrypt } = require('#helpers/encrypt-decrypt');

const OLD_PASSWORD = 'correct horse battery staple';
const NEW_PASSWORD = 'brand new mailbox password';

test.before(utils.setupMongoose);
test.before((t) => {
  t.context.quiesceTimeout = workerConfig.RESET_QUIESCE_TIMEOUT;
  // keep the "connection still open" case quick
  workerConfig.RESET_QUIESCE_TIMEOUT = ms('4s');
});

test.after.always(utils.teardownMongoose);

test.after.always((t) => {
  workerConfig.RESET_QUIESCE_TIMEOUT = t.context.quiesceTimeout;
});

test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
});

function session(aliasId, password) {
  return {
    user: {
      alias_id: aliasId,
      password: encrypt(password),
      domain_name: 'example.com'
    }
  };
}

function tmpDatabasePath(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reset-mailbox-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const aliasId = new mongoose.Types.ObjectId().toString();
  return { storagePath: path.join(dir, `${aliasId}.sqlite`), aliasId, dir };
}

async function createMailbox(storagePath, aliasId, rows = 200) {
  const db = await openDatabaseHandle(
    storagePath,
    session(aliasId, OLD_PASSWORD)
  );
  db.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, value TEXT)');
  const insert = db.prepare('INSERT INTO t (value) VALUES (?)');
  db.transaction(() => {
    for (let i = 0; i < rows; i++) insert.run(`row ${i}`);
  })();
  db.close();
  return fs.statSync(storagePath, { bigint: true });
}

async function insertRotatingAlias(aliasId, overrides = {}) {
  const rekeyId = randomUUID();
  await Aliases.collection.insertOne({
    _id: new mongoose.Types.ObjectId(aliasId),
    id: aliasId,
    domain: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    name: 'alias',
    is_rekey: true,
    tokens: [{ description: 'new', salt: 'new-salt', hash: 'new-hash' }],
    rekey_previous_tokens: [
      { description: 'old', salt: 'old-salt', hash: 'old-hash' }
    ],
    rekey_id: rekeyId,
    rekey_started_at: new Date(),
    rekey_processing: false,
    ...overrides
  });
  return rekeyId;
}

// (read-write: closing the last read-write connection removes -wal/-shm)
async function opensWith(storagePath, aliasId, password) {
  try {
    const db = await openDatabaseHandle(
      storagePath,
      session(aliasId, password)
    );
    try {
      return db.prepare('SELECT count(*) AS c FROM sqlite_master').get().c;
    } finally {
      db.close();
    }
  } catch (err) {
    if (err.code === 'SQLITE_NOTADB') return false;
    throw err;
  }
}

// (the `tmp` directory is SQLite's temp store, created on every open)
function assertNothingLeftBehind(t, dir, storagePath) {
  const names = fs
    .readdirSync(dir)
    .filter((name) => name !== 'tmp')
    .sort();
  t.deepEqual(names, [path.basename(storagePath)], names.join(', '));
}

//
// A process that keeps a connection to the mailbox open until told to stop
// (its -wal/-shm files prove the connection).
//
const HOLDER_SOURCE = `
const process = require('node:process');
const openDatabaseHandle = require(process.argv[2]);
const [storagePath, password] = process.argv.slice(3);
(async () => {
  const db = await openDatabaseHandle(storagePath, {
    user: { password, domain_name: 'example.com' }
  });
  db.prepare('INSERT INTO t (value) VALUES (?)').run('holder');
  process.send({ open: true });
  process.on('message', (message) => {
    if (message !== 'stop') return;
    db.close();
    process.send({ closed: true });
    process.exit(0);
  });
})();
`;

function startHolder(t, storagePath) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reset-holder-'));
  const script = path.join(dir, 'holder.js');
  fs.writeFileSync(script, HOLDER_SOURCE);
  const child = fork(
    script,
    [
      path.join(__dirname, '../../helpers/open-database-handle.js'),
      storagePath,
      encrypt(OLD_PASSWORD)
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

test.serial(
  'replaces the mailbox with a fresh one encrypted with the new password and records the swap',
  async (t) => {
    const { client } = t.context;
    const { storagePath, aliasId, dir } = tmpDatabasePath(t);
    const before = await createMailbox(storagePath, aliasId);
    const rekeyId = await insertRotatingAlias(aliasId);

    const result = await resetMailbox({
      client,
      storagePath,
      session: session(aliasId, NEW_PASSWORD),
      rekeyId
    });
    t.true(result.swapped);

    const after = fs.statSync(storagePath, { bigint: true });
    t.not(after.ino, before.ino);
    t.is(result.ino, after.ino);

    // a fresh, empty mailbox for the new password; the old one is gone
    t.is(await opensWith(storagePath, aliasId, NEW_PASSWORD), 0);
    t.false(await opensWith(storagePath, aliasId, OLD_PASSWORD));
    assertNothingLeftBehind(t, dir, storagePath);

    // the swap is recorded on the rotation (finalizing is the caller's job)
    const alias = await Aliases.collection.findOne({
      _id: new mongoose.Types.ObjectId(aliasId)
    });
    t.true(alias.is_rekey);
    t.is(alias.rekey_swap_ino, after.ino.toString());
    t.true(alias.rekey_swapped_at instanceof Date);

    // the locks were released
    t.is(await client.get(`db_swap_lock:${aliasId}`), null);
  }
);

test.serial('creates the mailbox of an alias that has none yet', async (t) => {
  const { client } = t.context;
  const { storagePath, aliasId, dir } = tmpDatabasePath(t);
  const rekeyId = await insertRotatingAlias(aliasId, {
    rekey_previous_tokens: []
  });

  const result = await resetMailbox({
    client,
    storagePath,
    session: session(aliasId, NEW_PASSWORD),
    rekeyId
  });
  t.true(result.swapped);
  t.is(await opensWith(storagePath, aliasId, NEW_PASSWORD), 0);
  assertNothingLeftBehind(t, dir, storagePath);
});

test.serial(
  'works for a caller without an operation ID and without rotation state',
  async (t) => {
    const { client } = t.context;
    const { storagePath, aliasId, dir } = tmpDatabasePath(t);
    const before = await createMailbox(storagePath, aliasId);

    const result = await resetMailbox({
      client,
      storagePath,
      session: session(aliasId, NEW_PASSWORD)
    });
    t.true(result.swapped);
    t.not(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
    t.is(await opensWith(storagePath, aliasId, NEW_PASSWORD), 0);
    assertNothingLeftBehind(t, dir, storagePath);
  }
);

test.serial(
  'leaves the mailbox untouched while a connection in another process is open',
  async (t) => {
    t.timeout(ms('2m'));
    const { client } = t.context;
    const { storagePath, aliasId, dir } = tmpDatabasePath(t);
    const before = await createMailbox(storagePath, aliasId);
    const rekeyId = await insertRotatingAlias(aliasId);

    const holder = startHolder(t, storagePath);
    await pWaitFor(() => holder.open, { timeout: ms('30s') });
    t.true(fs.existsSync(`${storagePath}-wal`));

    const err = await t.throwsAsync(
      resetMailbox({
        client,
        storagePath,
        session: session(aliasId, NEW_PASSWORD),
        rekeyId
      })
    );
    t.is(err.code, 'SQLITE_BUSY');
    t.true(err.isResetRetryable);
    t.true(err.ignoreHook);

    // nothing changed: same file, same data, no copy, no swap recorded
    t.is(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
    t.false(
      fs.existsSync(path.join(dir, `${aliasId}-${rekeyId}-backup.sqlite`))
    );
    t.is(await client.get(`db_swap_lock:${aliasId}`), null);
    const alias = await Aliases.collection.findOne({
      _id: new mongoose.Types.ObjectId(aliasId)
    });
    t.false('rekey_swap_ino' in alias);

    // once the connection is closed the reset goes through
    holder.child.send('stop');
    await pWaitFor(() => holder.exitCode !== null, { timeout: ms('30s') });
    t.is(holder.exitCode, 0);

    const result = await resetMailbox({
      client,
      storagePath,
      session: session(aliasId, NEW_PASSWORD),
      rekeyId
    });
    t.true(result.swapped);
    t.is(await opensWith(storagePath, aliasId, NEW_PASSWORD), 0);
    assertNothingLeftBehind(t, dir, storagePath);
  }
);

test.serial(
  'aborts before the swap when the rotation was rolled back meanwhile',
  async (t) => {
    const { client } = t.context;
    const { storagePath, aliasId, dir } = tmpDatabasePath(t);
    const before = await createMailbox(storagePath, aliasId);
    // the alias no longer carries this operation
    await insertRotatingAlias(aliasId);
    const rekeyId = randomUUID();

    const err = await t.throwsAsync(
      resetMailbox({
        client,
        storagePath,
        session: session(aliasId, NEW_PASSWORD),
        rekeyId
      })
    );
    t.true(err.isRekeySuperseded);

    t.is(fs.statSync(storagePath, { bigint: true }).ino, before.ino);
    t.true((await opensWith(storagePath, aliasId, OLD_PASSWORD)) > 0);
    assertNothingLeftBehind(t, dir, storagePath);
    t.is(await client.get(`db_swap_lock:${aliasId}`), null);
  }
);

test.serial(
  'rejects an invalid operation ID and a missing alias',
  async (t) => {
    const { client } = t.context;
    const { storagePath, aliasId } = tmpDatabasePath(t);

    await t.throwsAsync(
      resetMailbox({
        client,
        storagePath,
        session: session(aliasId, NEW_PASSWORD),
        rekeyId: '../../etc/passwd'
      }),
      { instanceOf: TypeError }
    );
    await t.throwsAsync(
      resetMailbox({
        client,
        storagePath,
        session: { user: { password: encrypt(NEW_PASSWORD) } }
      }),
      { instanceOf: TypeError }
    );
    t.false(fs.existsSync(storagePath));
  }
);
