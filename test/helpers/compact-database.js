/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { fork } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const { Buffer } = require('node:buffer');

const Database = require('better-sqlite3-multiple-ciphers');
const Redis = require('@ladjs/redis');
const pWaitFor = require('p-wait-for');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const compactDatabase = require('#helpers/compact-database');
const env = require('#config/env');
const logger = require('#helpers/logger');
const openDatabaseHandle = require('#helpers/open-database-handle');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { getRekeyLockKey } = require('#helpers/rekey-lock');

const PASSWORD = 'correct horse battery staple';
const imapSharedConfig = sharedConfig('IMAP');

const session = {
  user: { password: encrypt(PASSWORD), domain_name: 'example.com' }
};

test.before((t) => {
  t.context.client = new Redis(imapSharedConfig.redis, logger);
  t.context.env = {
    SQLITE_VACUUM_ENABLED: env.SQLITE_VACUUM_ENABLED,
    SQLITE_VACUUM_MAX_SIZE: env.SQLITE_VACUUM_MAX_SIZE,
    SQLITE_VACUUM_CONVERT_MAX_SIZE: env.SQLITE_VACUUM_CONVERT_MAX_SIZE
  };
});

test.after.always((t) => {
  t.context.client.disconnect();
});

test.afterEach.always((t) => {
  Object.assign(env, t.context.env);
});

function tmpDatabasePath(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'compact-database-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.join(dir, 'alias.sqlite');
}

const BODY = 'x'.repeat(4000);

function fill(db, rows) {
  db.exec(
    'CREATE TABLE IF NOT EXISTS "Messages" ("_id" TEXT PRIMARY KEY, "body" TEXT)'
  );
  const insert = db.prepare(
    'INSERT INTO "Messages" ("_id", "body") VALUES (?, ?)'
  );
  db.transaction(() => {
    for (let i = 0; i < rows; i++) insert.run(`m${i}`, `${i} ${BODY}`);
  })();
}

//
// A mailbox as every mailbox was created before the fix: the key and
// cipher that setupPragma uses, but journal_mode=WAL set before
// auto_vacuum=FULL, which leaves it at auto_vacuum=NONE.
//
function createLegacyMailbox(dbFilePath, rows = 2000) {
  const db = new Database(dbFilePath);
  db.pragma("cipher='chacha20'");
  db.key(Buffer.from(PASSWORD));
  db.pragma('journal_mode=WAL');
  db.pragma('auto_vacuum=FULL'); // too late: no effect
  fill(db, rows);
  db.close();
}

function fileSize(dbFilePath) {
  return fs.statSync(dbFilePath).size;
}

async function openAndDelete(dbFilePath, where) {
  const db = await openDatabaseHandle(dbFilePath, session);
  db.prepare(`DELETE FROM "Messages" WHERE ${where}`).run();
  db.pragma('wal_checkpoint(TRUNCATE)');
  return db;
}

test('a new mailbox is created with auto_vacuum=FULL and shrinks on delete', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  const db = await openDatabaseHandle(dbFilePath, session);
  t.is(db.pragma('auto_vacuum', { simple: true }), 1);
  t.is(db.pragma('journal_mode', { simple: true }), 'wal');

  fill(db, 2000);
  db.pragma('wal_checkpoint(TRUNCATE)');
  const full = fileSize(dbFilePath);

  db.exec('DELETE FROM "Messages"');
  db.pragma('wal_checkpoint(TRUNCATE)');
  t.is(db.pragma('freelist_count', { simple: true }), 0);
  t.true(
    fileSize(dbFilePath) < full / 10,
    `${fileSize(dbFilePath)} < ${full / 10}`
  );
  db.close();

  // nothing needs compacting
  const again = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => again.open && again.close());
  const result = await compactDatabase({
    db: again,
    dbFilePath,
    aliasId: randomUUID(),
    client: t.context.client
  });
  t.is(result.skipped, 'not-needed');
});

test('a legacy auto_vacuum=NONE mailbox is compacted and converted in place', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath);

  const db = await openAndDelete(dbFilePath, 'rowid % 2 = 0');
  t.teardown(() => db.open && db.close());
  t.is(db.pragma('auto_vacuum', { simple: true }), 0);
  t.true(db.pragma('freelist_count', { simple: true }) > 0);
  const before = fileSize(dbFilePath);
  const remaining = db
    .prepare('SELECT "_id", "body" FROM "Messages" ORDER BY "_id"')
    .all();

  const aliasId = randomUUID();
  const result = await compactDatabase({
    db,
    dbFilePath,
    aliasId,
    client: t.context.client
  });

  t.true(result.compacted);
  t.true(result.converted);
  t.is(db.pragma('auto_vacuum', { simple: true }), 1);
  t.is(db.pragma('freelist_count', { simple: true }), 0);
  t.true(
    fileSize(dbFilePath) < before * 0.6,
    `${fileSize(dbFilePath)} < ${before * 0.6}`
  );
  t.deepEqual(
    db.prepare('SELECT "_id", "body" FROM "Messages" ORDER BY "_id"').all(),
    remaining
  );
  // the lock is released
  t.is(await t.context.client.get(`vacuum_lock:${aliasId}`), null);

  // from now on SQLite gives space back by itself
  db.exec('DELETE FROM "Messages"');
  db.pragma('wal_checkpoint(TRUNCATE)');
  t.is(db.pragma('freelist_count', { simple: true }), 0);
  db.close();

  const reopened = await openDatabaseHandle(dbFilePath, session);
  t.is(reopened.pragma('integrity_check', { simple: true }), 'ok');
  t.is(reopened.pragma('auto_vacuum', { simple: true }), 1);
  reopened.close();
});

//
// Other processes keep the mailbox open and write to it while it is
// compacted: nothing is lost, nothing is corrupted, and no file is replaced.
//
const WRITER_SOURCE = `
const process = require('node:process');
const openDatabaseHandle = require(process.argv[2]);
const [dbFilePath, password] = process.argv.slice(3);
const session = { user: { password, domain_name: 'example.com' } };
(async () => {
  const db = await openDatabaseHandle(dbFilePath, session);
  const insert = db.prepare('INSERT INTO "Messages" ("_id", "body") VALUES (?, ?)');
  let committed = 0;
  let stop = false;
  process.on('message', () => { stop = true; });
  process.send({ ready: true });
  while (!stop) {
    insert.run('w' + committed, 'writer ' + committed);
    committed++;
    await new Promise((resolve) => setTimeout(resolve, 2));
  }
  db.close();
  process.send({ done: true, committed });
  process.exit(0);
})();
`;

test('compaction is safe with another process writing to the mailbox', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 3000);
  const inode = fs.statSync(dbFilePath).ino;

  const db = await openAndDelete(dbFilePath, 'rowid % 3 = 0');
  t.teardown(() => db.open && db.close());
  const kept = db.prepare('SELECT count(*) FROM "Messages"').pluck().get();

  // a reader in this process holds an open snapshot during the VACUUM
  const reader = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => reader.open && reader.close());
  const iterator = reader.prepare('SELECT "_id" FROM "Messages"').iterate();
  iterator.next();

  const script = path.join(path.dirname(dbFilePath), 'writer.js');
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
  const writer = { ready: false, committed: 0, done: false };
  child.on('message', (message) => {
    if (message.ready) writer.ready = true;
    if (message.done) {
      writer.done = true;
      writer.committed = message.committed;
    }
  });
  await pWaitFor(() => writer.ready, { timeout: 30_000 });

  const result = await compactDatabase({
    db,
    dbFilePath,
    aliasId: randomUUID(),
    client: t.context.client
  });
  t.true(result.compacted);

  iterator.return();
  child.send('stop');
  await pWaitFor(() => writer.done, { timeout: 30_000 });
  t.true(writer.committed > 0);

  // same file, every row the writer committed, and a sound database
  t.is(fs.statSync(dbFilePath).ino, inode);
  t.is(
    db.prepare('SELECT count(*) FROM "Messages"').pluck().get(),
    kept + writer.committed
  );
  t.is(db.pragma('integrity_check', { simple: true }), 'ok');
  t.is(db.pragma('auto_vacuum', { simple: true }), 1);
});

test('does not run alongside a rekey, a file swap or another VACUUM', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 200);
  const db = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => db.open && db.close());
  const { client } = t.context;

  for (const [key, reason] of [
    [(id) => getRekeyLockKey(id), 'busy'],
    [(id) => `db_swap_lock:${id}`, 'busy'],
    [(id) => `vacuum_lock:${id}`, 'locked']
  ]) {
    const aliasId = randomUUID();
    await client.set(key(aliasId), 'held', 'PX', 60_000);
    const result = await compactDatabase({
      db,
      dbFilePath,
      aliasId,
      client
    });
    t.is(result.skipped, reason);
    // still unconverted, still held by its owner
    t.is(db.pragma('auto_vacuum', { simple: true }), 0);
    t.is(await client.get(key(aliasId)), 'held');
    await client.del(key(aliasId));
  }
});

test('converts a legacy mailbox whatever its size, and honors the kill switch', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 500);
  const db = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => db.open && db.close());
  const options = {
    db,
    dbFilePath,
    aliasId: randomUUID(),
    client: t.context.client
  };

  env.SQLITE_VACUUM_ENABLED = 'false';
  let result = await compactDatabase(options);
  t.is(result.skipped, 'disabled');
  t.is(db.pragma('auto_vacuum', { simple: true }), 0);

  // an operator can hold back the conversion of the largest mailboxes
  env.SQLITE_VACUUM_ENABLED = 'true';
  env.SQLITE_VACUUM_CONVERT_MAX_SIZE = '1KB';
  result = await compactDatabase(options);
  t.is(result.skipped, 'too-large');
  t.is(db.pragma('auto_vacuum', { simple: true }), 0);

  // the reclaim size cap does not hold back the conversion
  env.SQLITE_VACUUM_CONVERT_MAX_SIZE = '';
  env.SQLITE_VACUUM_MAX_SIZE = '1KB';
  result = await compactDatabase(options);
  t.true(result.compacted);
  t.true(result.converted);
  t.is(db.pragma('auto_vacuum', { simple: true }), 1);
  t.is(db.pragma('integrity_check', { simple: true }), 'ok');
});

test('a space-reclaiming VACUUM respects the size cap', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  // a mailbox with free pages that is not at NONE (incremental keeps them;
  // opened directly, since setupPragma would switch it to FULL)
  const db = new Database(dbFilePath);
  t.teardown(() => db.open && db.close());
  db.pragma("cipher='chacha20'");
  db.key(Buffer.from(PASSWORD));
  db.pragma('auto_vacuum=INCREMENTAL');
  db.pragma('journal_mode=WAL');
  fill(db, 4000);
  db.exec('DELETE FROM "Messages" WHERE rowid % 4 != 0');
  t.is(db.pragma('auto_vacuum', { simple: true }), 2);
  t.true(db.pragma('freelist_count', { simple: true }) > 0);
  const options = {
    db,
    dbFilePath,
    aliasId: randomUUID(),
    client: t.context.client
  };

  env.SQLITE_VACUUM_MAX_SIZE = '1KB';
  let result = await compactDatabase(options);
  t.is(result.skipped, 'too-large');

  env.SQLITE_VACUUM_MAX_SIZE = '1GB';
  result = await compactDatabase(options);
  t.true(result.compacted);
  t.is(db.pragma('freelist_count', { simple: true }), 0);
  t.is(db.pragma('integrity_check', { simple: true }), 'ok');
});

test('FTS5 external-content indexes stay consistent after compaction', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 0);
  const db = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => db.open && db.close());

  db.exec(`
    CREATE TABLE "Notes" ("_id" TEXT PRIMARY KEY, "text" TEXT);
    CREATE VIRTUAL TABLE "Notes_fts" USING fts5(_id UNINDEXED, text, content="Notes", content_rowid=rowid);
    CREATE TRIGGER "Notes_ai" AFTER INSERT ON "Notes" BEGIN
      INSERT INTO "Notes_fts" (rowid, _id, text) VALUES (new.rowid, new._id, new.text);
    END;
    CREATE TRIGGER "Notes_ad" AFTER DELETE ON "Notes" BEGIN
      INSERT INTO "Notes_fts" ("Notes_fts", rowid, _id, text) VALUES ('delete', old.rowid, old._id, old.text);
    END;
  `);
  const insert = db.prepare(
    'INSERT INTO "Notes" ("_id", "text") VALUES (?, ?)'
  );
  db.transaction(() => {
    for (let i = 0; i < 400; i++)
      insert.run(`n${i}`, `word${i} ${'filler '.repeat(50)}`);
  })();
  // leave gaps in the rowids so VACUUM renumbers them
  // (rowid = i + 1, so this deletes the even-numbered notes)
  db.exec('DELETE FROM "Notes" WHERE rowid % 2 = 1');

  const result = await compactDatabase({
    db,
    dbFilePath,
    aliasId: randomUUID(),
    client: t.context.client
  });
  t.true(result.compacted);

  const match = (word) =>
    db
      .prepare(
        'SELECT "Notes"."_id" FROM "Notes_fts" JOIN "Notes" ON "Notes".rowid = "Notes_fts".rowid WHERE "Notes_fts" MATCH ?'
      )
      .pluck()
      .all(word);
  t.deepEqual(match('word11'), ['n11']);
  t.deepEqual(match('word399'), ['n399']);
  t.deepEqual(match('word10'), []);
  db.exec(`INSERT INTO "Notes_fts"("Notes_fts") VALUES('integrity-check')`);
  t.pass();
});

test('FTS5 external-content indexes stay consistent after compaction in a worker thread', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 0);
  const db = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => db.open && db.close());

  db.exec(`
    CREATE TABLE "Notes" ("_id" TEXT PRIMARY KEY, "text" TEXT);
    CREATE VIRTUAL TABLE "Notes_fts" USING fts5(_id UNINDEXED, text, content="Notes", content_rowid=rowid);
    CREATE TRIGGER "Notes_ai" AFTER INSERT ON "Notes" BEGIN
      INSERT INTO "Notes_fts" (rowid, _id, text) VALUES (new.rowid, new._id, new.text);
    END;
    CREATE TRIGGER "Notes_ad" AFTER DELETE ON "Notes" BEGIN
      INSERT INTO "Notes_fts" ("Notes_fts", rowid, _id, text) VALUES ('delete', old.rowid, old._id, old.text);
    END;
  `);
  const insert = db.prepare(
    'INSERT INTO "Notes" ("_id", "text") VALUES (?, ?)'
  );
  db.transaction(() => {
    for (let i = 0; i < 400; i++)
      insert.run(`n${i}`, `word${i} ${'filler '.repeat(50)}`);
  })();
  // leave gaps in the rowids so VACUUM renumbers them
  // (rowid = i + 1, so this deletes the even-numbered notes)
  db.exec('DELETE FROM "Notes" WHERE rowid % 2 = 1');

  const result = await compactDatabase({
    db,
    dbFilePath,
    aliasId: randomUUID(),
    client: t.context.client,
    session,
    threadMinBytes: 0
  });
  t.true(result.compacted);

  const match = (word) =>
    db
      .prepare(
        'SELECT "Notes"."_id" FROM "Notes_fts" JOIN "Notes" ON "Notes".rowid = "Notes_fts".rowid WHERE "Notes_fts" MATCH ?'
      )
      .pluck()
      .all(word);
  t.deepEqual(match('word11'), ['n11']);
  t.deepEqual(match('word399'), ['n399']);
  t.deepEqual(match('word10'), []);
  db.exec(`INSERT INTO "Notes_fts"("Notes_fts") VALUES('integrity-check')`);
  t.pass();
});

test('an interrupted FTS rebuild is completed by the next run', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 0);
  const db = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => db.open && db.close());
  const { client } = t.context;
  const aliasId = randomUUID();

  db.exec(`
    CREATE TABLE "Notes" ("_id" TEXT PRIMARY KEY, "text" TEXT);
    CREATE VIRTUAL TABLE "Notes_fts" USING fts5(_id UNINDEXED, text, content="Notes", content_rowid=rowid);
    CREATE TRIGGER "Notes_ai" AFTER INSERT ON "Notes" BEGIN
      INSERT INTO "Notes_fts" (rowid, _id, text) VALUES (new.rowid, new._id, new.text);
    END;
  `);
  db.prepare('INSERT INTO "Notes" ("_id", "text") VALUES (?, ?)').run(
    'n1',
    'needle'
  );

  let result = await compactDatabase({ db, dbFilePath, aliasId, client });
  t.true(result.compacted);
  t.is(await client.get(`fts_rebuild:${aliasId}`), null);

  // a VACUUM whose rebuild never ran (the process died in between)
  db.exec(`INSERT INTO "Notes_fts"("Notes_fts") VALUES('delete-all')`);
  await client.set(`fts_rebuild:${aliasId}`, 'true');
  const match = () =>
    db
      .prepare('SELECT "_id" FROM "Notes_fts" WHERE "Notes_fts" MATCH ?')
      .pluck()
      .all('needle');
  t.deepEqual(match(), []);

  // the mailbox needs no compaction now, and the rebuild still runs
  result = await compactDatabase({ db, dbFilePath, aliasId, client });
  t.is(result.skipped, 'not-needed');
  t.deepEqual(match(), ['n1']);
  t.is(await client.get(`fts_rebuild:${aliasId}`), null);
});

test('a second worker finds the mailbox already compacted', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 500);
  const handles = await Promise.all([
    openDatabaseHandle(dbFilePath, session),
    openDatabaseHandle(dbFilePath, session)
  ]);
  t.teardown(() => {
    for (const db of handles) if (db.open) db.close();
  });
  const aliasId = randomUUID();

  // (every sqlite-worker receives the job; each measures under the lock)
  const results = [];
  for (const db of handles)
    results.push(
      await compactDatabase({
        db,
        dbFilePath,
        aliasId,
        client: t.context.client
      })
    );

  t.true(results[0].compacted);
  t.is(results[1].skipped, 'not-needed');
});

test('a large mailbox is compacted in a worker thread without stalling the event loop', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 6000);
  const db = await openAndDelete(dbFilePath, 'rowid % 3 != 0');
  t.teardown(() => db.open && db.close());
  const before = fileSize(dbFilePath);

  // the event loop keeps turning while the VACUUM runs
  let ticks = 0;
  const timer = setInterval(() => {
    ticks++;
  }, 5);
  let result;
  try {
    result = await compactDatabase({
      db,
      dbFilePath,
      aliasId: randomUUID(),
      client: t.context.client,
      session,
      threadMinBytes: 0
    });
  } finally {
    clearInterval(timer);
  }

  t.true(result.compacted);
  t.true(result.converted);
  t.true(ticks > 0, `${ticks}`);
  t.is(db.pragma('auto_vacuum', { simple: true }), 1);
  t.is(db.pragma('integrity_check', { simple: true }), 'ok');
  t.is(db.prepare('SELECT count(*) FROM "Messages"').pluck().get(), 2000);
  t.true(fileSize(dbFilePath) < before / 2, `${fileSize(dbFilePath)}`);
});

//
// A process killed part way through the VACUUM (pm2 restart, OOM, deploy)
// leaves the mailbox exactly as it was: SQLite rolls the unfinished
// transaction back when the mailbox is next opened.
//
const KILLED_SOURCE = `
const path = require('node:path');
const process = require('node:process');
const { Worker } = require('node:worker_threads');
const [root, dbFilePath, password, mode] = process.argv.slice(2);
const openDatabaseHandle = require(path.join(root, 'helpers/open-database-handle.js'));
const session = { user: { password, domain_name: 'example.com' } };
(async () => {
  if (mode === 'thread') {
    process.send({ started: true });
    new Worker(path.join(root, 'helpers/compact-database-thread.js'), {
      workerData: { dbFilePath, session, autoVacuum: 'FULL' }
    });
    return;
  }

  const db = await openDatabaseHandle(dbFilePath, session);
  db.pragma('auto_vacuum=FULL');
  process.send({ started: true });
  db.exec('VACUUM');
  process.send({ finished: true });
})();
`;

function checksum(db) {
  return db
    .prepare(
      'SELECT count(*) AS "count", total(length("body")) AS "bytes", group_concat("_id") AS "ids" FROM (SELECT * FROM "Messages" ORDER BY "_id")'
    )
    .get();
}

for (const mode of ['in-process', 'thread']) {
  test(`a VACUUM killed part way (${mode}) leaves the mailbox intact`, async (t) => {
    t.timeout(120_000);
    const dbFilePath = tmpDatabasePath(t);
    createLegacyMailbox(dbFilePath, 8000);
    let db = await openAndDelete(dbFilePath, 'rowid % 2 = 0');
    const expected = checksum(db);
    db.close();

    const script = path.join(path.dirname(dbFilePath), 'killed.js');
    fs.writeFileSync(script, KILLED_SOURCE);

    let finishedBeforeKill = 0;
    for (const delay of [5, 20, 60, 120, 250]) {
      const child = fork(
        script,
        [path.join(__dirname, '../..'), dbFilePath, encrypt(PASSWORD), mode],
        {
          cwd: path.join(__dirname, '../..'),
          stdio: ['ignore', 'ignore', 'inherit', 'ipc']
        }
      );
      const state = { started: false, finished: false, exited: false };
      child.on('message', (message) => {
        if (message.started) state.started = true;
        if (message.finished) state.finished = true;
      });
      child.on('exit', () => {
        state.exited = true;
      });

      await pWaitFor(() => state.started || state.exited, {
        timeout: 30_000
      });

      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
      if (state.finished) finishedBeforeKill++;
      child.kill('SIGKILL');

      await pWaitFor(() => state.exited, { timeout: 30_000 });

      // after every kill the mailbox opens, is intact and holds the same mail

      db = await openDatabaseHandle(dbFilePath, session);
      t.is(db.pragma('integrity_check', { simple: true }), 'ok');
      t.deepEqual(checksum(db), expected);
      db.close();
    }

    t.log(`VACUUM finished before the kill ${finishedBeforeKill} of 5 times`);

    // and it is compacted normally afterwards
    db = await openDatabaseHandle(dbFilePath, session);
    t.teardown(() => db.open && db.close());
    const result = await compactDatabase({
      db,
      dbFilePath,
      aliasId: randomUUID(),
      client: t.context.client
    });
    t.true(result.compacted || result.skipped === 'not-needed');
    t.is(db.pragma('auto_vacuum', { simple: true }), 1);
    t.is(db.pragma('integrity_check', { simple: true }), 'ok');
    t.deepEqual(checksum(db), expected);
  });
}

test('an error in the worker thread keeps its code and leaves the mailbox as it was', async (t) => {
  const dbFilePath = tmpDatabasePath(t);
  createLegacyMailbox(dbFilePath, 500);
  const db = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => db.open && db.close());
  const expected = db.prepare('SELECT count(*) FROM "Messages"').pluck().get();

  // the job's password no longer opens the mailbox (it was rotated)
  const err = await t.throwsAsync(
    compactDatabase({
      db,
      dbFilePath,
      aliasId: randomUUID(),
      client: t.context.client,
      session: {
        user: {
          password: encrypt('not-the-password'),
          domain_name: 'example.com'
        }
      },
      threadMinBytes: 0
    })
  );
  t.is(err.code, 'SQLITE_NOTADB');
  t.is(err.responseCode, 535);
  t.falsy(err.vacuumed);

  t.is(db.pragma('auto_vacuum', { simple: true }), 0);
  t.is(db.pragma('integrity_check', { simple: true }), 'ok');
  t.is(db.prepare('SELECT count(*) FROM "Messages"').pluck().get(), expected);
});
