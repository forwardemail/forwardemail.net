/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { fork } = require('node:child_process');
const { randomUUID } = require('node:crypto');

const Redis = require('@ladjs/redis');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const env = require('#config/env');
const logger = require('#helpers/logger');
const openDatabaseHandle = require('#helpers/open-database-handle');
const safeVacuum = require('#helpers/safe-vacuum');
const { encrypt } = require('#helpers/encrypt-decrypt');

const PASSWORD = 'correct horse battery staple';
const imapSharedConfig = sharedConfig('IMAP');

test.before((t) => {
  t.context.client = new Redis(imapSharedConfig.redis, logger);
  t.context.enabled = env.SQLITE_AUTO_VACUUM_MIGRATION_ENABLED;
  env.SQLITE_AUTO_VACUUM_MIGRATION_ENABLED = 'true';
});

test.after.always((t) => {
  env.SQLITE_AUTO_VACUUM_MIGRATION_ENABLED = t.context.enabled;
  t.context.client.disconnect();
});

function tmpDatabasePath(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'safe-vacuum-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.join(dir, 'alias.sqlite');
}

const session = {
  user: { password: encrypt(PASSWORD), domain_name: 'example.com' }
};

async function createMailbox(dbFilePath, rows = 500) {
  const db = await openDatabaseHandle(dbFilePath, session);
  db.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, value TEXT)');
  const insert = db.prepare('INSERT INTO t (value) VALUES (?)');
  db.transaction(() => {
    for (let i = 0; i < rows; i++) insert.run(`row ${i} ${'x'.repeat(200)}`);
  })();
  db.close();
}

//
// A writer in another process (see test/helpers/worker-rekey.js): it opens
// the mailbox through the shared file mutex, commits a row, closes, and
// repeats until told to stop.
//
const WRITER_SOURCE = `
const { setTimeout } = require('node:timers/promises');
const process = require('node:process');
const openDatabaseHandle = require(process.argv[2]);
const [dbFilePath, password] = process.argv.slice(3);
const session = { user: { password, domain_name: 'example.com' } };
let stop = false;
let committed = 0;
process.on('message', (message) => {
  if (message === 'stop') stop = true;
});
(async () => {
  while (!stop) {
    let db;
    try {
      db = await openDatabaseHandle(dbFilePath, session, {
        lock: { timeoutMs: 60000 }
      });
    } catch (err) {
      if (err.code === 'SQLITE_NOTADB' || err.code === 'SQLITE_BUSY') break;
      throw err;
    }

    try {
      db.prepare('INSERT INTO t (value) VALUES (?)').run(
        'writer ' + committed
      );
      committed++;
      process.send({ committed });
    } finally {
      db.close();
    }

    await setTimeout(5);
  }

  process.send({ done: true, committed });
  process.exit(0);
})();
`;

function startWriter(t, dbFilePath) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vacuum-writer-'));
  const script = path.join(dir, 'writer.js');
  fs.writeFileSync(script, WRITER_SOURCE);
  const child = fork(
    script,
    [
      path.join(__dirname, '../../helpers/open-database-handle.js'),
      dbFilePath,
      encrypt(PASSWORD)
    ],
    {
      cwd: path.join(__dirname, '../..'),
      stdio: ['ignore', 'ignore', 'inherit', 'ipc']
    }
  );
  const writer = { child, committed: 0, done: false, exitCode: null };
  child.on('message', (message) => {
    if (typeof message.committed === 'number')
      writer.committed = message.committed;
    if (message.done) writer.done = true;
  });
  child.on('exit', (code) => {
    writer.exitCode = code;
  });
  t.teardown(() => {
    if (writer.exitCode === null) child.kill('SIGKILL');
    fs.rmSync(dir, { recursive: true, force: true });
  });
  return writer;
}

test.serial(
  'the inline VACUUM swaps a verified copy over the mailbox',
  async (t) => {
    const { client } = t.context;
    const dbFilePath = tmpDatabasePath(t);
    const aliasId = randomUUID();
    await createMailbox(dbFilePath);

    const before = fs.statSync(dbFilePath, { bigint: true });
    const db = await openDatabaseHandle(dbFilePath, session);
    const result = await safeVacuum({
      db,
      dbFilePath,
      aliasId,
      client,
      session
    });
    t.deepEqual(result, { swapped: true });
    t.false(db.open);

    // a new file with the same content, no companions or locks left behind
    const after = fs.statSync(dbFilePath, { bigint: true });
    t.not(after.ino, before.ino);
    for (const suffix of ['-wal', '-shm', '-journal', '.lock'])
      t.false(fs.existsSync(`${dbFilePath}${suffix}`));
    t.false(fs.existsSync(`${dbFilePath}.vacuum-tmp-${process.pid}`));
    const reopened = await openDatabaseHandle(dbFilePath, session);
    try {
      t.is(reopened.pragma('integrity_check', { simple: true }), 'ok');
      t.is(reopened.prepare('SELECT count(*) AS c FROM t').get().c, 500);
      t.is(reopened.pragma('auto_vacuum', { simple: true }), 1);
    } finally {
      reopened.close();
    }

    // the locks were released
    t.is(await client.get(`vacuum_lock:${aliasId}`), null);
    t.is(await client.get(`db_swap_lock:${aliasId}`), null);
  }
);

test.serial(
  'the inline VACUUM never loses a commit of a writer in another process',
  async (t) => {
    t.timeout(ms('3m'));
    const { client } = t.context;
    const dbFilePath = tmpDatabasePath(t);
    const aliasId = randomUUID();
    await createMailbox(dbFilePath, 20_000);

    const writer = startWriter(t, dbFilePath);
    await pWaitFor(() => writer.committed > 0 || writer.done, {
      timeout: ms('60s')
    });
    t.false(writer.done);

    // while the writer keeps committing, every attempt must give way
    let aborted = 0;
    for (let attempt = 0; attempt < 5; attempt++) {
      const db = await openDatabaseHandle(dbFilePath, session);

      const err = await safeVacuum({
        db,
        dbFilePath,
        aliasId,
        client,
        session
      }).then(
        (result) => (result.swapped ? new Error('swapped') : null),
        (err_) => err_
      );
      if (db.open) db.close();
      t.truthy(err, 'an attempt with a concurrent writer must not swap');
      t.is(err.code, 'SQLITE_BUSY', `busy: ${err.message}`);
      t.log(err.message);
      aborted++;
    }

    t.is(aborted, 5);
    t.false(writer.done);

    // the writer stops: whatever it committed must survive the swap
    writer.child.send('stop');
    await pWaitFor(() => writer.exitCode !== null, { timeout: ms('60s') });
    t.is(writer.exitCode, 0);
    const { committed } = writer;
    t.true(committed > 0);

    let swapped = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      const db = await openDatabaseHandle(dbFilePath, session);

      const result = await safeVacuum({
        db,
        dbFilePath,
        aliasId,
        client,
        session
      }).catch((err) => {
        if (db.open) db.close();
        t.is(err.code, 'SQLITE_BUSY', `busy: ${err.message}`);
        return { swapped: false };
      });
      if (result.swapped) {
        swapped = true;
        break;
      }
    }

    t.true(swapped);

    const vacuumed = await openDatabaseHandle(dbFilePath, session);
    try {
      t.is(vacuumed.pragma('integrity_check', { simple: true }), 'ok');
      t.is(
        vacuumed.prepare('SELECT count(*) AS c FROM t').get().c,
        20_000 + committed
      );
      t.deepEqual(
        vacuumed
          .prepare(
            "SELECT value FROM t WHERE value LIKE 'writer %' ORDER BY id"
          )
          .pluck()
          .all(),
        Array.from({ length: committed }, (_, i) => `writer ${i}`)
      );
    } finally {
      vacuumed.close();
    }
  }
);
