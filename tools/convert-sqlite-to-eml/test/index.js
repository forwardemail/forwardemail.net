import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import test from 'ava';
import Database from 'better-sqlite3-multiple-ciphers';
import {
  convert,
  countAttachments,
  openDatabase,
  decodeMetadata,
  decodeAttachmentBody,
  recursivelyParse,
  formatHeaders,
  parseArgs
} from '../index.js';

// ---------------------------------------------------------------
// decodeMetadata
// ---------------------------------------------------------------

test('decodeMetadata returns null/undefined as-is', (t) => {
  t.is(decodeMetadata(null), null);
  t.is(decodeMetadata(undefined), undefined);
});

test('decodeMetadata returns plain objects as-is', (t) => {
  const object = { header: ['Content-Type: text/plain'], body: 'hello' };
  t.deepEqual(decodeMetadata(object), object);
});

test('decodeMetadata returns plain arrays as-is', (t) => {
  const array = [1, 2, 3];
  t.deepEqual(decodeMetadata(array), array);
});

test('decodeMetadata decodes JSON string', (t) => {
  const data = { foo: 'bar', num: 42 };
  const result = decodeMetadata(JSON.stringify(data));
  t.deepEqual(result, data);
});

test('decodeMetadata decodes brotli-compressed buffer', (t) => {
  const data = { header: ['Subject: Test'], body: 'Hello world' };
  const json = JSON.stringify(data);
  const compressed = zlib.brotliCompressSync(Buffer.from(json, 'utf8'));
  const result = decodeMetadata(compressed);
  t.deepEqual(result, data);
});

test('decodeMetadata handles uncompressed buffer (JSON)', (t) => {
  const data = { key: 'value' };
  const buf = Buffer.from(JSON.stringify(data), 'utf8');
  const result = decodeMetadata(buf);
  t.deepEqual(result, data);
});

test('decodeMetadata restores Buffer objects from JSON', (t) => {
  const data = {
    content: { type: 'Buffer', data: [72, 101, 108, 108, 111] }
  };
  const json = JSON.stringify(data);
  const compressed = zlib.brotliCompressSync(Buffer.from(json, 'utf8'));
  const result = decodeMetadata(compressed);
  t.true(Buffer.isBuffer(result.content));
  t.is(result.content.toString(), 'Hello');
});

// ---------------------------------------------------------------
// decodeAttachmentBody
// ---------------------------------------------------------------

test('decodeAttachmentBody returns null for null/undefined', (t) => {
  t.is(decodeAttachmentBody(null), null);
  t.is(decodeAttachmentBody(undefined), null);
});

test('decodeAttachmentBody returns raw buffer as-is', (t) => {
  const buf = Buffer.from('raw attachment data');
  const result = decodeAttachmentBody(buf);
  t.true(Buffer.isBuffer(result));
  t.is(result.toString(), 'raw attachment data');
});

test('decodeAttachmentBody decodes brotli-compressed with magic header', (t) => {
  const body = Buffer.from('This is the attachment body content');
  const compressed = zlib.brotliCompressSync(body);
  const magic = Buffer.from([0x00, 0x42, 0x52, 0x00]);
  const stored = Buffer.concat([magic, compressed]);
  const result = decodeAttachmentBody(stored);
  t.true(Buffer.isBuffer(result));
  t.is(result.toString(), 'This is the attachment body content');
});

test('decodeAttachmentBody decodes hex-encoded string', (t) => {
  const body = Buffer.from('hex encoded');
  const hex = body.toString('hex');
  const result = decodeAttachmentBody(hex);
  t.true(Buffer.isBuffer(result));
  t.is(result.toString(), 'hex encoded');
});

test('decodeAttachmentBody handles Uint8Array', (t) => {
  const body = Buffer.from('uint8 test');
  const uint8 = new Uint8Array(body);
  const result = decodeAttachmentBody(uint8);
  t.true(Buffer.isBuffer(result));
  t.is(result.toString(), 'uint8 test');
});

// ---------------------------------------------------------------
// recursivelyParse
// ---------------------------------------------------------------

test('recursivelyParse converts Buffer-like objects to Buffers', (t) => {
  const input = { type: 'Buffer', data: [65, 66, 67] };
  const result = recursivelyParse(input);
  t.true(Buffer.isBuffer(result));
  t.is(result.toString(), 'ABC');
});

test('recursivelyParse handles nested objects', (t) => {
  const input = {
    a: { type: 'Buffer', data: [68] },
    b: { c: 'hello' }
  };
  const result = recursivelyParse(input);
  t.true(Buffer.isBuffer(result.a));
  t.is(result.a.toString(), 'D');
  t.is(result.b.c, 'hello');
});

test('recursivelyParse handles arrays', (t) => {
  const input = [{ type: 'Buffer', data: [69] }, 'text'];
  const result = recursivelyParse(input);
  t.true(Buffer.isBuffer(result[0]));
  t.is(result[0].toString(), 'E');
  t.is(result[1], 'text');
});

test('recursivelyParse returns primitives as-is', (t) => {
  t.is(recursivelyParse(42), 42);
  t.is(recursivelyParse('hello'), 'hello');
  t.is(recursivelyParse(null), null);
  t.is(recursivelyParse(true), true);
});

// ---------------------------------------------------------------
// formatHeaders
// ---------------------------------------------------------------

test('formatHeaders returns array as-is', (t) => {
  const headers = ['Content-Type: text/plain', 'Subject: Test'];
  t.deepEqual(formatHeaders(headers), headers);
});

test('formatHeaders wraps non-array in array', (t) => {
  t.deepEqual(formatHeaders('Content-Type: text/plain'), [
    'Content-Type: text/plain'
  ]);
});

test('formatHeaders handles null/undefined', (t) => {
  t.deepEqual(formatHeaders(null), []);
  t.deepEqual(formatHeaders(undefined), []);
});

// ---------------------------------------------------------------
// parseArgs
// ---------------------------------------------------------------

test('parseArgs parses --key value format', (t) => {
  const arguments_ = parseArgs([
    'node',
    'script',
    '--path',
    '/tmp/test.db',
    '--password',
    'secret'
  ]);
  t.is(arguments_.path, '/tmp/test.db');
  t.is(arguments_.password, 'secret');
});

test('parseArgs parses --key=value format', (t) => {
  const arguments_ = parseArgs([
    'node',
    'script',
    '--path=/tmp/test.db',
    '--password=secret'
  ]);
  t.is(arguments_.path, '/tmp/test.db');
  t.is(arguments_.password, 'secret');
});

test('parseArgs parses boolean flags', (t) => {
  const arguments_ = parseArgs(['node', 'script', '--help']);
  t.is(arguments_.help, true);
});

test('parseArgs returns empty object for no args', (t) => {
  const arguments_ = parseArgs(['node', 'script']);
  t.deepEqual(arguments_, {});
});

// ---------------------------------------------------------------
// openDatabase
// ---------------------------------------------------------------

test('openDatabase opens a chacha20-encrypted database', (t) => {
  const temporaryDirectory = os.tmpdir();
  const databasePath = path.join(
    temporaryDirectory,
    `test-${randomUUID()}.sqlite`
  );
  const password = 'test-password-123';

  // Create an encrypted database
  const database = new Database(databasePath);
  database.pragma("cipher='chacha20'");
  database.pragma(`key="${password}"`);
  database.pragma('journal_mode=WAL');
  database.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, value TEXT)');
  database.exec("INSERT INTO test VALUES (1, 'hello')");
  database.close();

  // Open with our function
  const opened = openDatabase(databasePath, password);
  const row = opened.prepare('SELECT value FROM test WHERE id = 1').get();
  t.is(row.value, 'hello');
  opened.close();

  fs.unlinkSync(databasePath);
});

test('openDatabase throws for wrong password', (t) => {
  const temporaryDirectory = os.tmpdir();
  const databasePath = path.join(
    temporaryDirectory,
    `test-${randomUUID()}.sqlite`
  );
  const password = 'correct-password';

  const database = new Database(databasePath);
  database.pragma("cipher='chacha20'");
  database.pragma(`key="${password}"`);
  database.pragma('journal_mode=WAL');
  database.exec('CREATE TABLE test (id INTEGER PRIMARY KEY)');
  database.close();

  t.throws(() => openDatabase(databasePath, 'wrong-password'), {
    message: /Failed to open database/
  });

  fs.unlinkSync(databasePath);
});

test('openDatabase throws for non-existent file', (t) => {
  const error = t.throws(
    () => openDatabase('/tmp/nonexistent-file.sqlite', 'pass'),
    { any: true }
  );
  t.truthy(error);
});

// ---------------------------------------------------------------
// Integration: convert
// ---------------------------------------------------------------

test('convert creates a ZIP from a test SQLite database', async (t) => {
  const temporaryDirectory = os.tmpdir();
  const databasePath = path.join(
    temporaryDirectory,
    `test-convert-${randomUUID()}.sqlite`
  );
  const outputPath = path.join(
    temporaryDirectory,
    `test-output-${randomUUID()}.zip`
  );
  const password = 'integration-test-pw';

  // Create a realistic encrypted database with Mailboxes, Messages, Attachments
  const database = new Database(databasePath);
  database.pragma("cipher='chacha20'");
  database.pragma(`key="${password}"`);
  database.pragma('journal_mode=WAL');

  database.exec(`
    CREATE TABLE Mailboxes (
      _id TEXT PRIMARY KEY,
      path TEXT NOT NULL
    )
  `);
  database.exec(`
    CREATE TABLE Messages (
      _id TEXT PRIMARY KEY,
      mailbox TEXT NOT NULL,
      uid INTEGER,
      mimeTree BLOB,
      FOREIGN KEY (mailbox) REFERENCES Mailboxes(_id)
    )
  `);
  database.exec(`
    CREATE TABLE Attachments (
      _id TEXT PRIMARY KEY,
      hash TEXT UNIQUE,
      body BLOB,
      counter INTEGER DEFAULT 1
    )
  `);

  // Insert mailboxes
  database.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('mb1', 'INBOX');
  database.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('mb2', 'Sent');

  // Create a simple mimeTree for a plain text message
  const mimeTree1 = {
    header: [
      'From: sender@example.com',
      'To: recipient@example.com',
      'Subject: Test Message 1',
      'Content-Type: text/plain; charset=utf-8',
      'Date: Mon, 01 Mar 2025 12:00:00 +0000',
      'MIME-Version: 1.0'
    ],
    body: Buffer.from('Hello, this is a test email message.\r\n'),
    lineCount: 3,
    childNodes: []
  };

  // Create a mimeTree with an attachment
  const attachmentBody = Buffer.from('This is the attachment content');
  const attachmentHash = 'abc123hash';

  const mimeTree2 = {
    header: [
      'From: sender@example.com',
      'To: recipient@example.com',
      'Subject: Test Message 2 with Attachment',
      'Content-Type: multipart/mixed; boundary="boundary123"',
      'Date: Mon, 01 Mar 2025 13:00:00 +0000',
      'MIME-Version: 1.0'
    ],
    boundary: 'boundary123',
    attachmentMap: { att1: attachmentHash },
    lineCount: 10,
    childNodes: [
      {
        header: ['Content-Type: text/plain; charset=utf-8'],
        body: Buffer.from('Email body text.\r\n'),
        childNodes: []
      },
      {
        header: [
          'Content-Type: application/octet-stream',
          'Content-Disposition: attachment; filename="test.txt"'
        ],
        attachmentId: 'att1',
        childNodes: []
      }
    ]
  };

  // Encode mimeTree as brotli-compressed JSON (new format)
  const encoded1 = zlib.brotliCompressSync(
    Buffer.from(JSON.stringify(mimeTree1), 'utf8')
  );
  const encoded2 = zlib.brotliCompressSync(
    Buffer.from(JSON.stringify(mimeTree2), 'utf8')
  );

  database
    .prepare('INSERT INTO Messages VALUES (?, ?, ?, ?)')
    .run('msg1', 'mb1', 1, encoded1);
  database
    .prepare('INSERT INTO Messages VALUES (?, ?, ?, ?)')
    .run('msg2', 'mb2', 2, encoded2);

  // Insert attachment (raw buffer, no compression)
  database
    .prepare('INSERT INTO Attachments VALUES (?, ?, ?, ?)')
    .run('att1', attachmentHash, attachmentBody, 1);

  database.close();

  // Run the conversion
  const logs = [];
  const result = await convert({
    dbPath: databasePath,
    password,
    outputPath,
    onProgress: (message) => logs.push(message)
  });

  t.is(result.messageCount, 2);
  t.is(result.folderCount, 2);
  t.is(result.attachmentCount, 1);
  t.is(result.skippedCount, 0);
  t.is(result.outputPath, outputPath);
  t.true(result.archiveSize > 0);
  t.true(fs.existsSync(outputPath));
  t.true(fs.statSync(outputPath).size > 0);

  // Verify logs mention the mailboxes and messages
  const logText = logs.join('\n');
  t.true(logText.includes('INBOX'));
  t.true(logText.includes('Sent'));
  t.true(logText.includes('2 message(s)'));
  t.true(logText.includes('Processed 2/2'));

  // Cleanup
  fs.unlinkSync(databasePath);
  fs.unlinkSync(outputPath);
});

test('convert handles empty database gracefully', async (t) => {
  const temporaryDirectory = os.tmpdir();
  const databasePath = path.join(
    temporaryDirectory,
    `test-empty-${randomUUID()}.sqlite`
  );
  const outputPath = path.join(
    temporaryDirectory,
    `test-empty-output-${randomUUID()}.zip`
  );
  const password = 'empty-test-pw';

  const database = new Database(databasePath);
  database.pragma("cipher='chacha20'");
  database.pragma(`key="${password}"`);
  database.pragma('journal_mode=WAL');
  database.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  database.exec(
    'CREATE TABLE Messages (_id TEXT PRIMARY KEY, mailbox TEXT, uid INTEGER, mimeTree BLOB)'
  );
  database.exec(
    'CREATE TABLE Attachments (_id TEXT PRIMARY KEY, hash TEXT UNIQUE, body BLOB, counter INTEGER)'
  );
  database.close();

  const result = await convert({
    dbPath: databasePath,
    password,
    outputPath,
    onProgress() {}
  });

  t.is(result.messageCount, 0);
  t.is(result.folderCount, 0);
  t.is(result.attachmentCount, 0);
  t.is(result.skippedCount, 0);
  t.true(fs.existsSync(outputPath));

  fs.unlinkSync(databasePath);
  fs.unlinkSync(outputPath);
});

test('convert throws for invalid file', async (t) => {
  const temporaryDirectory = os.tmpdir();
  const databasePath = path.join(
    temporaryDirectory,
    `test-invalid-${randomUUID()}.sqlite`
  );
  const outputPath = path.join(
    temporaryDirectory,
    `test-invalid-output-${randomUUID()}.zip`
  );

  // Create an empty file
  fs.writeFileSync(databasePath, '');

  await t.throwsAsync(
    () =>
      convert({
        dbPath: databasePath,
        password: 'test',
        outputPath,
        onProgress() {}
      }),
    { message: /empty or not a file/ }
  );

  fs.unlinkSync(databasePath);
});

test('convert handles messages with old JSON string mimeTree', async (t) => {
  const temporaryDirectory = os.tmpdir();
  const databasePath = path.join(
    temporaryDirectory,
    `test-oldfmt-${randomUUID()}.sqlite`
  );
  const outputPath = path.join(
    temporaryDirectory,
    `test-oldfmt-output-${randomUUID()}.zip`
  );
  const password = 'old-format-test';

  const database = new Database(databasePath);
  database.pragma("cipher='chacha20'");
  database.pragma(`key="${password}"`);
  database.pragma('journal_mode=WAL');
  database.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  database.exec(
    'CREATE TABLE Messages (_id TEXT PRIMARY KEY, mailbox TEXT, uid INTEGER, mimeTree TEXT)'
  );
  database.exec(
    'CREATE TABLE Attachments (_id TEXT PRIMARY KEY, hash TEXT UNIQUE, body BLOB, counter INTEGER)'
  );

  database.prepare('INSERT INTO Mailboxes VALUES (?, ?)').run('mb1', 'INBOX');

  // Store mimeTree as plain JSON string (old format)
  const mimeTree = {
    header: [
      'From: test@example.com',
      'Subject: Old Format',
      'Content-Type: text/plain'
    ],
    body: 'Old format body\r\n',
    lineCount: 2,
    childNodes: []
  };
  database
    .prepare('INSERT INTO Messages VALUES (?, ?, ?, ?)')
    .run('msg1', 'mb1', 1, JSON.stringify(mimeTree));
  database.close();

  const result = await convert({
    dbPath: databasePath,
    password,
    outputPath,
    onProgress() {}
  });

  t.is(result.messageCount, 1);
  t.is(result.folderCount, 1);
  t.is(result.attachmentCount, 0);
  t.is(result.skippedCount, 0);
  t.true(fs.existsSync(outputPath));

  fs.unlinkSync(databasePath);
  fs.unlinkSync(outputPath);
});

// ---------------------------------------------------------------
// countAttachments
// ---------------------------------------------------------------

test('countAttachments counts attachment references in a mimeTree', (t) => {
  const tree = {
    header: ['Content-Type: multipart/mixed'],
    boundary: 'b1',
    childNodes: [
      {
        header: ['Content-Type: text/plain'],
        body: 'text',
        childNodes: []
      },
      {
        header: ['Content-Type: application/pdf'],
        attachmentId: 'att1',
        childNodes: []
      },
      {
        header: ['Content-Type: image/png'],
        attachmentId: 'att2',
        childNodes: []
      }
    ]
  };

  t.is(countAttachments(tree), 2);
});

test('countAttachments returns 0 for no attachments', (t) => {
  const tree = {
    header: ['Content-Type: text/plain'],
    body: 'text',
    childNodes: []
  };

  t.is(countAttachments(tree), 0);
});
