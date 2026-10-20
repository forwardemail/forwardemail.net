/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');
const { Headers } = require('mailsplit');

const utils = require('../utils');

const createTangerine = require('#helpers/create-tangerine');
const updateSession = require('#helpers/update-session');

test.beforeEach(utils.setupRedisClient);
test.afterEach.always((t) => {
  t.context.client.disconnect();
  t.context.subscriber.disconnect();
});

function parse(raw) {
  return new Headers(Buffer.from(raw));
}

function newSession() {
  return {
    remoteAddress: '127.0.0.1',
    resolvedClientHostname: 'localhost',
    resolvedRootClientHostname: 'localhost',
    envelope: {
      mailFrom: { address: 'sender@example.com' },
      rcptTo: [{ address: 'alice@example.com' }]
    }
  };
}

test('keeps every value of a repeated header for the log', async (t) => {
  const ctx = {
    client: t.context.client,
    resolver: createTangerine(t.context.client)
  };
  const session = newSession();
  const body = Buffer.from('hello\r\n');

  await updateSession.call(
    ctx,
    body,
    parse(
      [
        'DKIM-Signature: v=1; d=amazonses.com; b=first',
        'From: sender@example.com',
        'DKIM-Signature: v=1; d=example.com; b=second',
        'Subject: hi',
        '',
        ''
      ].join('\r\n')
    ),
    session
  );

  t.is(session.headers['DKIM-Signature'], 'v=1; d=example.com; b=second');
  t.deepEqual(session.repeatedHeaders, {
    'DKIM-Signature': [
      'v=1; d=amazonses.com; b=first',
      'v=1; d=example.com; b=second'
    ]
  });

  // the next message of the same connection has no repeated headers
  await updateSession.call(
    ctx,
    body,
    parse('From: sender@example.com\r\nSubject: hi again\r\n\r\n'),
    session
  );
  t.is(session.headers.Subject, 'hi again');
  t.false(Object.hasOwn(session, 'repeatedHeaders'));
});
