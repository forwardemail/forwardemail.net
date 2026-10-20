/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');
const { Headers } = require('mailsplit');

const getHeaders = require('#helpers/get-headers');

function parse(raw) {
  return new Headers(Buffer.from(raw));
}

test('unfolds folded headers into single spaces', (t) => {
  const headers = parse(
    [
      'From: "Jane Doe" <jane@example.com>',
      'Subject: a very long',
      '  subject that was',
      '\tfolded twice',
      'X-Spaces: keep   inner   runs',
      'X-Mixed: one \t',
      ' \t two',
      'References: <a@example.com>',
      ' <b@example.com>',
      '',
      ''
    ].join('\r\n')
  );

  const all = getHeaders(headers);
  t.is(all.From, '"Jane Doe" <jane@example.com>');
  t.is(all.Subject, 'a very long subject that was folded twice');
  t.is(all['X-Spaces'], 'keep   inner   runs');
  t.is(all['X-Mixed'], 'one two');
  t.is(all.References, '<a@example.com> <b@example.com>');
  t.is(
    getHeaders(headers, 'subject'),
    'a very long subject that was folded twice'
  );
});

test('unfolds bare LF line breaks too', (t) => {
  const headers = parse('Subject: hello\n   world\nTo: a@example.com\n\n');
  t.is(getHeaders(headers, 'subject'), 'hello world');
});

test('a header with a long whitespace run is processed in linear time', (t) => {
  const headers = parse(
    'X-Pad: a' +
      ' '.repeat(200_000) +
      'b\r\nFrom: x@example.com\r\nSubject: hi\r\n\r\n'
  );
  const start = Date.now();
  const all = getHeaders(headers);
  const elapsed = Date.now() - start;
  t.is(all.Subject, 'hi');
  t.is(all['X-Pad'], 'a' + ' '.repeat(200_000) + 'b');
  t.true(elapsed < 500, `took ${elapsed}ms`);
});

const DUPLICATES = [
  'DKIM-Signature: v=1; a=rsa-sha256; d=amazonses.com; s=one;',
  '  b=first',
  'From: sender@example.com',
  'Bcc: one@example.com',
  'DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=two; b=second',
  'Subject: =?UTF-8?Q?=F0=9F=8E=89_beep?=',
  'X-Header: one',
  'X-Header: two',
  'X-Header: three',
  'Bcc: two@example.com',
  'From: other@example.com',
  '',
  ''
].join('\r\n');

test('getHeadersWithRepeats keeps every value of a repeated header', (t) => {
  const { headers, repeated } = getHeaders.getHeadersWithRepeats(
    parse(DUPLICATES)
  );

  // `headers` is unchanged: one value per key
  t.deepEqual(headers, getHeaders(parse(DUPLICATES)));
  t.is(headers['X-Header'], 'three');
  t.is(headers.From, 'sender@example.com');

  t.deepEqual(repeated, {
    'DKIM-Signature': [
      'v=1; a=rsa-sha256; d=amazonses.com; s=one; b=first',
      'v=1; a=rsa-sha256; d=example.com; s=two; b=second'
    ],
    From: ['sender@example.com', 'other@example.com'],
    'X-Header': ['one', 'two', 'three']
  });
});

test('getHeadersWithRepeats has no repeats for a message without any', (t) => {
  const { headers, repeated } = getHeaders.getHeadersWithRepeats(
    parse('From: a@example.com\r\nSubject: hi\r\n\r\n')
  );
  t.is(headers.Subject, 'hi');
  t.deepEqual(repeated, {});
});

test('getHeadersWithRepeats never repeats Bcc', (t) => {
  const { headers, repeated } = getHeaders.getHeadersWithRepeats(
    parse(DUPLICATES)
  );
  t.is(headers.Bcc, 'two@example.com');
  t.false(Object.hasOwn(repeated, 'Bcc'));
});
