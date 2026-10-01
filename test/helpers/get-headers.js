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
