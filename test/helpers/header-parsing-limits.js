/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const test = require('ava');
const { Headers } = require('mailsplit');
const parseMimeTree = require('@zone-eu/wildduck/imap-core/lib/indexer/parse-mime-tree');
const { simpleParser } = require('mailparser');

const MessageSplitter = require('#helpers/message-splitter');

//
// Header blocks come from whoever sent the message, and every parser that
// reads them must stay linear in their size (patches/mailsplit@*.patch,
// patches/@zone-eu__mailsplit@*.patch and patches/@zone-eu__wildduck@*.patch).
//
const FOLDED = 'Subject: hi\r\n' + 'X-Fold: a\r\n b\r\n'.repeat(60_000);
const BARE_CR = 'Subject: a' + '\r'.repeat(200_000) + 'b\r\nTo: x@example.com';

test('mailsplit parses many folded header lines in linear time', (t) => {
  const start = Date.now();
  const headers = new Headers(Buffer.from(FOLDED + '\r\n\r\n'));
  t.is(headers.get('x-fold').length, 60_000);
  t.is(headers.getFirst('subject'), 'hi');
  const elapsed = Date.now() - start;
  t.true(elapsed < 3000, `took ${elapsed}ms`);
});

test('mailsplit parses a long run of bare CR characters in linear time', (t) => {
  const start = Date.now();
  const headers = new Headers(Buffer.from(BARE_CR + '\r\n\r\n'));
  t.is(headers.getFirst('to'), 'x@example.com');
  const elapsed = Date.now() - start;
  t.true(elapsed < 1000, `took ${elapsed}ms`);
});

test('mailsplit keeps a leading mbox line and rebuilds headers unchanged', (t) => {
  const raw =
    'From sender@example.com Mon Jan  1 00:00:00 2024\r\n' +
    'Subject: a\r\n folded\r\nTo: x@example.com\r\n\r\n';
  const headers = new Headers(Buffer.from(raw));
  // (parsed on first use)
  t.is(headers.getFirst('subject'), 'a folded');
  t.is(headers.mbox, 'From sender@example.com Mon Jan  1 00:00:00 2024');
  t.is(headers.build().toString(), raw);
});

test('mailparser (which uses mailsplit) parses many folded headers in linear time', async (t) => {
  const start = Date.now();
  const parsed = await simpleParser(
    Buffer.from(FOLDED + 'From: x@example.com\r\n\r\nhello\r\n')
  );
  const elapsed = Date.now() - start;
  t.is(parsed.subject, 'hi');
  t.is(parsed.text.trim(), 'hello');
  t.true(elapsed < 5000, `took ${elapsed}ms`);
});

test('the IMAP indexer parses many folded header lines in linear time', (t) => {
  const start = Date.now();
  const tree = parseMimeTree(
    Buffer.from(FOLDED + 'From: x@example.com\r\n\r\nhello\r\n')
  );
  const elapsed = Date.now() - start;
  t.is(tree.parsedHeader.subject, 'hi');
  t.is(tree.parsedHeader['x-fold'].length, 60_000);
  t.true(elapsed < 5000, `took ${elapsed}ms`);
});

test('the IMAP indexer parses many lines of one name in linear time', (t) => {
  const start = Date.now();
  const tree = parseMimeTree(
    Buffer.from(
      'X-A: b\r\n'.repeat(200_000) +
        'X-A: c\r\n d\r\nSubject: hi\r\n\r\nhello\r\n'
    )
  );
  const elapsed = Date.now() - start;
  const values = tree.parsedHeader['x-a'];
  t.is(values.length, 200_001);
  t.is(values[0], 'b');
  // (the last one is unfolded, as before)
  t.is(values.at(-1), 'c d');
  t.is(tree.parsedHeader.subject, 'hi');
  t.true(elapsed < 3000, `took ${elapsed}ms`);
});

test('the IMAP indexer unfolds a long whitespace run in linear time', (t) => {
  const start = Date.now();
  const tree = parseMimeTree(
    Buffer.from('Subject: a' + ' '.repeat(200_000) + 'b\r\n x\r\n\r\nhello\r\n')
  );
  const elapsed = Date.now() - start;
  t.is(tree.parsedHeader.subject, 'a' + ' '.repeat(200_000) + 'b x');
  t.true(elapsed < 1000, `took ${elapsed}ms`);
});

test('the IMAP indexer keeps folded headers and repeats as before', (t) => {
  const tree = parseMimeTree(
    Buffer.from(
      [
        'From: "A" <a@example.com>',
        'To: b@example.com,',
        ' c@example.com',
        'Received: one',
        'Received: two',
        'Subject: hello',
        '\tworld',
        // (a name that is also an Object property is a header like any other)
        'Constructor: x',
        '',
        'body',
        ''
      ].join('\r\n')
    )
  );
  t.is(tree.parsedHeader.subject, 'hello world');
  t.deepEqual(tree.parsedHeader.received, ['one', 'two']);
  t.is(tree.parsedHeader.constructor, 'x');
  t.deepEqual(
    tree.parsedHeader.to.map((a) => a.address),
    ['b@example.com', 'c@example.com']
  );
  t.true(tree.header.includes('Subject: hello\r\n\tworld'));
});

async function split(raw, options) {
  const splitter = new MessageSplitter(options);
  const chunks = [];
  splitter.on('data', (chunk) => chunks.push(chunk));
  // feed it in 64 KB chunks, as a socket would
  const parts = [];
  for (let i = 0; i < raw.length; i += 65_536)
    parts.push(raw.subarray(i, i + 65_536));
  await pipeline(Readable.from(parts), splitter);
  return { splitter, body: Buffer.concat(chunks) };
}

// (a header block of any size is accepted, as before: the message size
// limit is what bounds it, and it is parsed in linear time)
test('MessageSplitter accepts a header block over 1 MB', async (t) => {
  const raw = Buffer.from(
    'Subject: hi\r\n' +
      'X-Pad: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\r\n'.repeat(40_000) +
      '\r\nbody\r\n'
  );
  t.true(raw.length > 1024 * 1024);
  const { splitter, body } = await split(raw);
  t.is(splitter.headers.getFirst('subject'), 'hi');
  t.is(body.toString(), 'body\r\n');
});

test('MessageSplitter accepts a message without a blank line', async (t) => {
  const raw = Buffer.from('X-Pad: a\r\n'.repeat(200_000));
  const { splitter } = await split(raw);
  t.is(splitter.headers.get('x-pad').length, 200_000);
});

test('MessageSplitter accepts a large but ordinary header block', async (t) => {
  const raw = Buffer.from(
    'Subject: hi\r\n' +
      'Received: from mx.example.com by mx.example.net\r\n'.repeat(11_000) +
      '\r\nbody\r\n'
  );
  t.true(raw.length > 500 * 1024);
  const { splitter, body } = await split(raw);
  t.is(splitter.headers.getFirst('subject'), 'hi');
  t.is(splitter.headers.get('received').length, 11_000);
  t.is(body.toString(), 'body\r\n');
});

test('MessageSplitter still enforces the message size limit', async (t) => {
  const raw = Buffer.from('Subject: hi\r\n\r\n' + 'a'.repeat(2048));
  const err = await t.throwsAsync(split(raw, { maxBytes: 1024 }));
  t.is(err.responseCode, 552);
  t.regex(err.message, /email size/i);
});
