const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const Database = require('better-sqlite3-multiple-ciphers');
const test = require('ava');

const AttachmentStorage = require('#helpers/attachment-storage');
const Attachments = require('#models/attachments');
const { decoder, encoder } = require('#helpers/encoder-decoder');

class SQLite {}

function createNode(attachmentId, body, magic = 1) {
  return {
    attachmentId,
    body,
    contentType: 'application/octet-stream',
    lineCount: 1,
    magic,
    transferEncoding: 'base64'
  };
}

function getHash(algorithm, body) {
  return `${algorithm}:${crypto
    .createHash(algorithm)
    .update(body)
    .digest('hex')}`;
}

function createWspInstance(db) {
  return {
    wsp: {
      async request(payload) {
        const { stmt } = decoder.decode(encoder.encode(payload));
        const statement = db.prepare(stmt[0][1]);
        return stmt[1][0] === 'get'
          ? statement.get(stmt[1][1])
          : statement.all(stmt[1][1]);
      }
    }
  };
}

test.beforeEach((t) => {
  const db = new Database(':memory:');
  db.exec(Attachments.createStatement);
  db.exec(Attachments.mapping.hash.indexStatement);
  t.context.db = db;
  t.context.instance = new SQLite();
  t.context.session = {
    db,
    user: { password: 'test-password' }
  };
  t.context.storage = new AttachmentStorage();
});

test.afterEach.always((t) => {
  t.context.db.close();
});

test('atomically deduplicates concurrent identical attachment bodies', async (t) => {
  const body = Buffer.from('concurrent attachment body');
  const { instance, session, storage } = t.context;

  const attachments = await Promise.all([
    storage.create(instance, session, createNode('ATT00001', body)),
    storage.create(
      instance,
      session,
      createNode('ATT00002', new Uint8Array(body))
    ),
    storage.create(
      instance,
      session,
      createNode('ATT00003', { type: 'Buffer', data: [...body] })
    ),
    storage.create(instance, session, createNode('ATT00004', Buffer.from(body)))
  ]);

  const hashes = new Set(attachments.map((attachment) => attachment.hash));
  t.deepEqual(hashes, new Set([getHash('sha256', body)]));

  const rows = t.context.db
    .prepare('SELECT hash, body, counter, magic FROM Attachments')
    .all();
  t.is(rows.length, 1);
  t.is(rows[0].hash, getHash('sha256', body));
  t.deepEqual(rows[0].body, body);
  t.is(rows[0].counter, attachments.length);
  t.is(rows[0].magic, attachments.length);
});

test('deduplicates concurrent attachments through the worker transport', async (t) => {
  const body = Buffer.from('worker transport attachment body');
  const { db, session, storage } = t.context;
  const instance = createWspInstance(db);
  session.db = Object.create(db, {
    readonly: { value: true }
  });

  const attachments = await Promise.all([
    storage.create(instance, session, createNode('ATT00001', body)),
    storage.create(instance, session, createNode('ATT00002', Buffer.from(body)))
  ]);

  t.deepEqual(
    new Set(attachments.map((attachment) => attachment.hash)),
    new Set([getHash('sha256', body)])
  );
  const row = db
    .prepare('SELECT counter, magic FROM Attachments WHERE hash = ?')
    .get(getHash('sha256', body));
  t.deepEqual(row, { counter: attachments.length, magic: attachments.length });
});

test('separates a different body occupying a SHA-256 key', async (t) => {
  const originalBody = Buffer.from('existing body');
  const collidingBody = Buffer.from('different body');
  const { db, instance, session, storage } = t.context;
  const original = await storage.create(
    instance,
    session,
    createNode('ATT00001', originalBody)
  );
  const collidingHash = getHash('sha256', collidingBody);

  db.prepare('UPDATE Attachments SET hash = ? WHERE hash = ?').run(
    collidingHash,
    original.hash
  );

  const attachment = await storage.create(
    instance,
    session,
    createNode('ATT00002', collidingBody)
  );
  t.is(attachment.hash, getHash('sha512', collidingBody));

  const rows = db
    .prepare('SELECT hash, body, counter, magic FROM Attachments ORDER BY hash')
    .all();
  t.is(rows.length, 2);
  t.deepEqual(
    new Set(rows.map((row) => row.hash)),
    new Set([collidingHash, getHash('sha512', collidingBody)])
  );
  t.true(rows.every((row) => row.counter === 1 && row.magic === 1));
});

test('rejects unsupported attachment body values before any insert', async (t) => {
  const { db, instance, session, storage } = t.context;
  const error = await t.throwsAsync(
    storage.create(instance, session, createNode('ATT00001', 'not binary'))
  );

  t.true(error.isCodeBug);
  t.is(
    error.message,
    'Attachment body must be a Buffer, an ArrayBuffer view, or a serialized Buffer'
  );
  t.is(db.prepare('SELECT count(*) AS count FROM Attachments').get().count, 0);
});
