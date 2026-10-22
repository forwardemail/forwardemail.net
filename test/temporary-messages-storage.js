/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');
const zlib = require('node:zlib');

const Database = require('better-sqlite3-multiple-ciphers');
const test = require('ava');

const TemporaryMessages = require('#models/temporary-messages');
const migrateSchema = require('#helpers/migrate-schema');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

class SQLite {}

test.beforeEach((t) => {
  const db = new Database(':memory:');
  const session = { db, user: { password: 'test-password' } };
  // (the table as helpers/get-temporary-database.js creates it)
  for (const command of migrateSchema(new SQLite(), db, session, {
    TemporaryMessages
  }))
    db.prepare(command).run();
  t.context.db = db;
  t.context.session = session;
});

test.afterEach.always((t) => {
  t.context.db.close();
});

async function store(t, raw) {
  await TemporaryMessages.create({
    instance: new SQLite(),
    session: t.context.session,
    fingerprint: crypto.randomBytes(16).toString('hex'),
    date: new Date(),
    raw,
    remoteAddress: '192.0.2.1'
  });
  // (read back as helpers/sync-temporary-mailbox.js does)
  const row = t.context.db.prepare('SELECT * FROM TemporaryMessages').get();
  return syncConvertResult(TemporaryMessages, row).raw;
}

//
// A temporary message is stored without its length, so only the "FEBR"
// marker tells a compressed one from one stored as-is.  A message whose own
// first bytes are that marker (the sender, or a Sieve `addheader`, chooses
// them) must come back as received, and never be handed to the Brotli
// decoder.
//
test('returns a message that starts with the compression marker as received', async (t) => {
  const raw = Buffer.concat([
    Buffer.from('FEBR'),
    zlib.brotliCompressSync(crypto.randomBytes(4096))
  ]);
  const read = await store(t, raw);
  t.deepEqual(Buffer.from(read), raw);
});

test('returns messages that compress and that do not as received', async (t) => {
  const text = Buffer.from(
    'Subject: test\r\n\r\n' + 'Hello there.\r\n'.repeat(200)
  );
  t.deepEqual(Buffer.from(await store(t, text)), text);
  t.context.db.exec('DELETE FROM TemporaryMessages');

  const random = crypto.randomBytes(4096);
  t.deepEqual(Buffer.from(await store(t, random)), random);
});
