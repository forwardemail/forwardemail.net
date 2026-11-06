/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { execFileSync } = require('node:child_process');
const { Buffer } = require('node:buffer');

const Database = require('better-sqlite3-multiple-ciphers');
const test = require('ava');

const setupPragma = require('#helpers/setup-pragma');
const { encrypt } = require('#helpers/encrypt-decrypt');

function session(password) {
  return {
    user: {
      password: encrypt(password),
      domain_name: 'example.com'
    }
  };
}

//
// Mirror the worker's rekey pipeline: VACUUM INTO a copy of the live WAL
// database, switch the copy to a rollback journal, rekey it, and VACUUM so
// the new key is persisted.  The copy ends up in DELETE journal mode.
//
async function createRekeyedCopy(t, oldPassword, newPassword) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-pragma-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));

  const live = path.join(dir, 'live.sqlite');
  const tmp = path.join(dir, 'live-backup.sqlite');

  const db = new Database(live);
  await setupPragma(db, session(oldPassword));
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('1', 'INBOX');
  db.pragma('wal_checkpoint(PASSIVE)');
  db.exec(`VACUUM INTO '${tmp}'`);
  db.close();

  const backupDb = new Database(tmp);
  await setupPragma(backupDb, session(oldPassword));
  t.is(backupDb.pragma('journal_mode=DELETE', { simple: true }), 'delete');
  backupDb.prepare('VACUUM').run();
  backupDb.pragma(`rekey="${newPassword}"`);
  backupDb.prepare('VACUUM').run();
  t.is(backupDb.pragma('integrity_check', { simple: true }), 'ok');
  backupDb.close();

  return { dir, live, tmp };
}

test('setupPragma > verifies a rekeyed rollback-journal copy on a read-only handle', async (t) => {
  const { dir, tmp } = await createRekeyedCopy(
    t,
    'old-password',
    'new-password'
  );

  const verifyDb = new Database(tmp, { readonly: true, fileMustExist: true });
  try {
    await t.notThrowsAsync(setupPragma(verifyDb, session('new-password')));
    t.is(verifyDb.pragma('integrity_check', { simple: true }), 'ok');
    t.is(verifyDb.prepare('SELECT count(*) AS c FROM Mailboxes').get().c, 1);
    // a read-only handle must not touch the file that is about to be
    // renamed over the live database
    t.is(verifyDb.pragma('journal_mode', { simple: true }), 'delete');
    t.deepEqual(
      fs.readdirSync(dir).filter((name) => name.startsWith('live-backup')),
      ['live-backup.sqlite']
    );
  } finally {
    verifyDb.close();
  }
});

test('setupPragma > still rejects an invalid password on a read-only handle', async (t) => {
  const { tmp } = await createRekeyedCopy(t, 'old-password', 'new-password');

  const verifyDb = new Database(tmp, { readonly: true, fileMustExist: true });
  try {
    const err = await t.throwsAsync(
      setupPragma(verifyDb, session('old-password'))
    );
    t.is(err.code, 'SQLITE_NOTADB');
    t.is(err.responseCode, 535);
  } finally {
    verifyDb.close();
  }
});

test('setupPragma > still switches read-write handles to WAL mode', async (t) => {
  const { tmp } = await createRekeyedCopy(t, 'old-password', 'new-password');

  const db = new Database(tmp);
  try {
    await setupPragma(db, session('new-password'));
    t.is(db.pragma('journal_mode', { simple: true }), 'wal');
    t.is(db.pragma('auto_vacuum', { simple: true }), 1);
  } finally {
    db.close();
  }
});

//
// The durability settings every live mailbox runs with.  A power loss or a
// crash cannot corrupt a WAL database that is flushed with synchronous=FULL
// on storage that honours flushes; memory-mapped I/O is off so a stray
// write in the process cannot reach the file through the page cache; and
// every page is authenticated by the cipher, so damage on disk is detected
// the moment the page is read instead of being served silently.
//
test('setupPragma > keeps the durability settings of a live mailbox', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-pragma-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'live.sqlite');

  const db = new Database(file);
  await setupPragma(db, session('password'));
  try {
    t.is(db.pragma('journal_mode', { simple: true }), 'wal');
    // 2 = FULL
    t.is(db.pragma('synchronous', { simple: true }), 2);
    t.is(db.pragma('mmap_size', { simple: true }), 0);
    // a 16 MB page cache (SQLITE_CACHE_SIZE_KB), negative = KiB
    t.is(
      db.pragma('cache_size', { simple: true }),
      -(Number(process.env.SQLITE_CACHE_SIZE_KB) || 16_384)
    );
    t.is(db.pragma('cipher', { simple: true }), 'chacha20');
    db.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, value TEXT)');
    db.prepare('INSERT INTO t (value) VALUES (?)').run('x'.repeat(5000));
    db.pragma('wal_checkpoint(TRUNCATE)');
  } finally {
    db.close();
  }

  // one flipped bit in a data page is detected on read (Poly1305 tag)
  const fd = fs.openSync(file, 'r+');
  try {
    const byte = Buffer.alloc(1);
    fs.readSync(fd, byte, 0, 1, 4096 + 1000);
    // eslint-disable-next-line no-bitwise
    byte[0] ^= 0x01;
    fs.writeSync(fd, byte, 0, 1, 4096 + 1000);
  } finally {
    fs.closeSync(fd);
  }

  const damaged = new Database(file);
  try {
    const err = await t.throwsAsync(async () => {
      await setupPragma(damaged, session('password'));
      damaged.prepare('SELECT value FROM t').all();
    });
    t.true(
      ['SQLITE_CORRUPT', 'SQLITE_NOTADB'].includes(err.code),
      `${err.code}`
    );
  } finally {
    try {
      damaged.close();
    } catch {}
  }
});

//
// The optimize run on open analyzes tables whose indexes have no statistics
// (e.g. an index just added to every mailbox), and an unlimited ANALYZE of a
// large mailbox blocked the open, and every request waiting on it, for
// seconds; it samples at most 400 rows per index instead.
//
test('setupPragma > bounds the ANALYZE that optimize runs on open', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-pragma-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'live.sqlite');

  let db = new Database(file);
  await setupPragma(db, session('password'));
  db.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, value TEXT)');
  const insert = db.prepare('INSERT INTO t (value) VALUES (?)');
  db.transaction(() => {
    for (let i = 0; i < 20_000; i++) insert.run(`value-${i % 100}`);
  })();
  // a new index without statistics
  db.exec('CREATE INDEX t_value ON t (value)');
  db.close();

  db = new Database(file);
  try {
    await setupPragma(db, session('password'));
    t.is(db.pragma('analysis_limit', { simple: true }), 400);
    // the index was analyzed on open (from a sample of the table)
    const stat = db
      .prepare("SELECT stat FROM sqlite_stat1 WHERE idx = 't_value'")
      .pluck()
      .get();
    t.truthy(stat);
  } finally {
    db.close();
  }
});

//
// Opening a mailbox derived its key from the password on the event loop
// (`db.key()`, about 50ms), which held up every other request of the SQLite
// server.  The key is derived on the thread pool and given to SQLite as a
// raw key instead.
//
// (a password given to `db.key()`, which SQLite derives the key from; a
//  "raw:" key is used as is)
function countKeyDerivations(t) {
  const { key } = Database.prototype;
  let calls = 0;
  Database.prototype.key = function (...args) {
    if (!String(args[0]).startsWith('raw:')) calls++;
    return key.apply(this, args);
  };

  t.teardown(() => {
    Database.prototype.key = key;
  });
  return () => calls;
}

function tempFile(t, name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-pragma-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.join(dir, name);
}

test('setupPragma > opens a mailbox without deriving its key on the event loop', async (t) => {
  const file = tempFile(t, 'mailbox.sqlite');
  const derivations = countKeyDerivations(t);

  // a new file as well: it gets the salt the key was derived with
  let db = new Database(file);
  await setupPragma(db, session('a-password'));
  t.is(db.pragma('auto_vacuum', { simple: true }), 1);
  t.is(db.pragma('journal_mode', { simple: true }), 'wal');
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('1', 'INBOX');
  db.close();

  for (let i = 0; i < 2; i++) {
    db = new Database(file);
    await setupPragma(db, session('a-password'));
    t.is(db.prepare('SELECT path FROM Mailboxes').pluck().get(), 'INBOX');
    db.close();
  }

  t.is(derivations(), 0);

  // and the password opens it
  db = new Database(file);
  db.pragma("cipher='chacha20'");
  db.key(Buffer.from('a-password'));
  t.is(db.prepare('SELECT path FROM Mailboxes').pluck().get(), 'INBOX');
  db.close();

  // and a wrong password is still refused, each time
  for (let i = 0; i < 2; i++) {
    db = new Database(file);
    try {
      const err = await t.throwsAsync(setupPragma(db, session('wrong')));
      t.is(err.code, 'SQLITE_NOTADB');
    } finally {
      db.close();
    }
  }

  // while the right one still opens it
  db = new Database(file);
  await setupPragma(db, session('a-password'));
  t.is(db.prepare('SELECT path FROM Mailboxes').pluck().get(), 'INBOX');
  db.close();
});

test('setupPragma > a rekeyed mailbox opens with its new password, not the old', async (t) => {
  const file = tempFile(t, 'mailbox.sqlite');
  let db = new Database(file);
  await setupPragma(db, session('old-password'));
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('1', 'INBOX');
  db.close();

  // (opened once more, so the key of the old password is the one kept)
  db = new Database(file);
  await setupPragma(db, session('old-password'));
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.pragma('journal_mode=DELETE');
  db.rekey(Buffer.from('new-password'));
  db.close();

  db = new Database(file);
  try {
    const err = await t.throwsAsync(setupPragma(db, session('old-password')));
    t.is(err.code, 'SQLITE_NOTADB');
  } finally {
    db.close();
  }

  for (let i = 0; i < 2; i++) {
    db = new Database(file);
    await setupPragma(db, session('new-password'));
    t.is(db.prepare('SELECT path FROM Mailboxes').pluck().get(), 'INBOX');
    db.close();
  }
});

test('setupPragma > a mailbox written and vacuumed with the derived key still opens with its password', async (t) => {
  const file = tempFile(t, 'mailbox.sqlite');
  let db = new Database(file);
  await setupPragma(db, session('a-password'));
  db.exec('CREATE TABLE Messages (_id INTEGER PRIMARY KEY, body BLOB)');
  db.close();

  db = new Database(file);
  await setupPragma(db, session('a-password'));
  const insert = db.prepare('INSERT INTO Messages (body) VALUES (?)');
  for (let i = 0; i < 500; i++) insert.run(Buffer.alloc(4000, i % 251));
  db.exec('DELETE FROM Messages WHERE _id % 2 = 0');
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.exec('VACUUM');
  const copy = `${file}-copy`;
  db.exec(`VACUUM INTO '${copy}'`);
  db.close();

  for (const name of [file, copy]) {
    const check = new Database(name);
    check.pragma("cipher='chacha20'");
    check.key(Buffer.from('a-password'));
    t.is(check.prepare('SELECT count(*) FROM Messages').pluck().get(), 250);
    t.is(check.pragma('integrity_check', { simple: true }), 'ok');
    check.close();
  }
});

test('setupPragma > a file the derived key does not open is keyed with the password', async (t) => {
  // a legacy mailbox (aes256cbc) also starts with a salt, which the chacha20
  // key derived from it does not open
  const file = tempFile(t, 'legacy.sqlite');
  let db = new Database(file);
  db.pragma("cipher='aes256cbc'");
  db.key(Buffer.from('a-password'));
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('1', 'INBOX');
  db.close();

  // (and again, once it is known the derived key does not open it)
  for (let i = 0; i < 2; i++) {
    db = new Database(file);
    try {
      await setupPragma(db, session('a-password'));
      t.is(db.prepare('SELECT path FROM Mailboxes').pluck().get(), 'INBOX');
    } finally {
      db.close();
    }
  }
});

test('setupPragma > never puts the password or the key in SQL text', async (t) => {
  const file = tempFile(t, 'mailbox.sqlite');
  let db = new Database(file);
  await setupPragma(db, session('a-secret-password'));
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.close();

  // SQLITE_VERBOSE logs every statement a handle runs
  const statements = [];
  db = new Database(file, { verbose: (sql) => statements.push(sql) });
  try {
    await setupPragma(db, session('a-secret-password'));
    db.prepare('SELECT count(*) FROM Mailboxes').get();
  } finally {
    db.close();
  }

  t.true(statements.length > 0);
  for (const sql of statements) {
    t.false(sql.includes('a-secret-password'));
    t.notRegex(sql, /\bkey\b|raw:|rekey/i);
  }
});

test('setupPragma > opens of one mailbox at once all open it', async (t) => {
  const file = tempFile(t, 'mailbox.sqlite');
  const db = new Database(file);
  await setupPragma(db, session('a-password'));
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('1', 'INBOX');
  db.close();

  const handles = Array.from({ length: 8 }, () => new Database(file));
  t.teardown(() => {
    for (const handle of handles) handle.close();
  });
  await Promise.all(
    handles.map((handle) => setupPragma(handle, session('a-password')))
  );
  for (const handle of handles)
    t.is(handle.prepare('SELECT path FROM Mailboxes').pluck().get(), 'INBOX');
});

//
// SQLite locks a file with POSIX locks, which belong to the process: closing
// any descriptor of the file drops all of them, those of every connection
// open in the process included.  Another process then takes itself for the
// last connection, removes the WAL on close, and the writes after that are
// lost.  So the open must not open the file itself (e.g. to read its salt).
//
function writeFromAnotherProcess(file, value) {
  execFileSync(
    process.execPath,
    [
      '-e',
      `
const Database = require('better-sqlite3-multiple-ciphers');
const db = new Database(${JSON.stringify(file)});
db.pragma("cipher='chacha20'");
db.key(Buffer.from('a-password'));
db.prepare('INSERT INTO t VALUES (?)').run(${JSON.stringify(value)});
db.close();
`
    ],
    { cwd: path.join(__dirname, '..', '..') }
  );
}

test('setupPragma > keeps the locks of the connections open in this process', async (t) => {
  const file = tempFile(t, 'mailbox.sqlite');
  const live = new Database(file);
  t.teardown(() => live.open && live.close());
  await setupPragma(live, session('a-password'));
  live.exec('CREATE TABLE t (x TEXT)');
  live.prepare('INSERT INTO t VALUES (?)').run('first');

  // another open of the mailbox in this process, the first still open
  const other = new Database(file);
  t.teardown(() => other.open && other.close());
  await setupPragma(other, session('a-password'));

  writeFromAnotherProcess(file, 'second');
  // (it saw the connections here, so it left the WAL to them)
  t.true(fs.existsSync(`${file}-wal`));
  writeFromAnotherProcess(file, 'third');
  live.prepare('INSERT INTO t VALUES (?)').run('fourth');
  other.close();
  live.close();

  const check = new Database(file);
  check.pragma("cipher='chacha20'");
  check.key(Buffer.from('a-password'));
  t.deepEqual(check.prepare('SELECT x FROM t ORDER BY rowid').pluck().all(), [
    'first',
    'second',
    'third',
    'fourth'
  ]);
  t.is(check.pragma('integrity_check', { simple: true }), 'ok');
  check.close();
});
