/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
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
