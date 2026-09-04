/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');
const getStream = require('get-stream');
const intoStream = require('into-stream');

const getEmailMessageStream = require('#helpers/get-email-message-stream');

test('preserves a Nodemailer-style readable stream', (t) => {
  const stream = intoStream('Subject: stream\r\n\r\nBody');
  t.is(getEmailMessageStream(stream), stream);
});

test('converts a Sieve-generated RFC 822 string to a readable stream', async (t) => {
  const stream = getEmailMessageStream('Subject: notification\r\n\r\nBody');
  t.is(await getStream(stream), 'Subject: notification\r\n\r\nBody');
});

test('converts a binary message buffer to a readable stream', async (t) => {
  const source = Buffer.from('Subject: buffer\r\n\r\nBody');
  const stream = getEmailMessageStream(source);
  t.deepEqual(await getStream.buffer(stream), source);
});

test('rejects unsupported transport message shapes', (t) => {
  const error = t.throws(() => getEmailMessageStream({}));
  t.is(error.output.statusCode, 500);
});
