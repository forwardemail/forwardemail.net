const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const Database = require('better-sqlite3-multiple-ciphers');
const getStream = require('get-stream');
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
    storage.create(
      instance,
      session,
      createNode(
        'ATT00004',
        body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength)
      )
    )
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

test('retrieves attachment bodies and honors IMAP byte ranges', async (t) => {
  const body = Buffer.from('download this attachment exactly');
  const { instance, session, storage } = t.context;
  const created = await storage.create(
    instance,
    session,
    createNode('ATT00001', body)
  );

  const attachment = await storage.get({}, created.hash, instance, session);
  t.deepEqual(Buffer.from(attachment.body), body);
  t.is(attachment.length, body.length);

  const full = await getStream(
    storage.createReadStream(created.hash, attachment)
  );
  t.deepEqual(Buffer.from(full), body);

  const partial = await getStream(
    storage.createReadStream(created.hash, attachment, {
      startFrom: 9,
      maxLength: 4
    })
  );
  t.deepEqual(Buffer.from(partial), body.slice(9, 13));

  const empty = await getStream(
    storage.createReadStream(created.hash, attachment, {
      startFrom: body.length + 1,
      maxLength: 4
    })
  );
  t.deepEqual(Buffer.from(empty), Buffer.alloc(0));

  const missing = await t.throwsAsync(
    storage.get({}, 'sha256:missing', instance, session)
  );
  t.is(missing.code, 'FileNotFound');
});

test('releases every duplicate attachment reference from a message', async (t) => {
  const body = Buffer.from('same attachment used twice');
  const { db, instance, session, storage } = t.context;
  const first = await storage.create(
    instance,
    session,
    createNode('ATT00001', body)
  );
  const second = await storage.create(
    instance,
    session,
    createNode('ATT00002', Buffer.from(body))
  );

  await storage.deleteMany(instance, session, [first.hash, second.hash], 1);
  t.is(db.prepare('SELECT count(*) AS count FROM Attachments').get().count, 0);
});

test('does not delete an attachment reused during cleanup', async (t) => {
  const body = Buffer.from('attachment reused during cleanup');
  const { db, instance, session, storage } = t.context;
  const attachment = await storage.create(
    instance,
    session,
    createNode('ATT00001', body)
  );

  db.exec(`
    CREATE TRIGGER retain_attachment_after_decrement
    AFTER UPDATE OF counter ON Attachments
    WHEN NEW.counter = 0 AND NEW.magic = 0
    BEGIN
      UPDATE Attachments SET counter = 1, magic = 1 WHERE _id = NEW._id;
    END
  `);

  await storage.deleteMany(instance, session, [attachment.hash], 1);
  const stored = db
    .prepare('SELECT counter, magic FROM Attachments WHERE hash = ?')
    .get(attachment.hash);
  t.deepEqual(stored, { counter: 1, magic: 1 });
});

test('reads legacy attachment rows without reusing their short hash', async (t) => {
  const body = Buffer.from('legacy attachment body');
  const { db, instance, session, storage } = t.context;
  const legacyHash = 'legacy-rev-hash';
  const now = new Date().toISOString();
  db.prepare(
    `
      INSERT INTO Attachments
        (_id, hash, attachmentId, magic, contentType, transferEncoding,
         lineCount, counter, counterUpdated, size, body)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
  ).run(
    '000000000000000000000001',
    legacyHash,
    'ATT00001',
    1,
    'application/octet-stream',
    'base64',
    1,
    1,
    now,
    body.length,
    body
  );

  const legacy = await storage.get({}, legacyHash, instance, session);
  t.deepEqual(Buffer.from(legacy.body), body);

  const created = await storage.create(
    instance,
    session,
    createNode('ATT00002', body)
  );
  t.is(created.hash, getHash('sha256', body));
  t.is(db.prepare('SELECT count(*) AS count FROM Attachments').get().count, 2);
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

test('rejects an invalid attachment reference count before storage', async (t) => {
  const { db, instance, session, storage } = t.context;
  const error = await t.throwsAsync(
    storage.create(
      instance,
      session,
      createNode('ATT00001', Buffer.from('body'), Number.MAX_SAFE_INTEGER + 1)
    )
  );
  t.is(error.message, 'Invalid magic');
  t.is(db.prepare('SELECT count(*) AS count FROM Attachments').get().count, 0);
});
