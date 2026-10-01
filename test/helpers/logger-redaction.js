/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const logger = require('#helpers/logger');

// capture what the logger hands to its post hooks (the same `err`/`meta`
// that the Mongo log hook stores) after the redaction pre hooks ran
const captured = [];
for (const level of ['error', 'fatal']) {
  logger.post(level, (err, message, meta) => {
    captured.push({ err, meta });
  });
}

async function logAndCapture(level, err, meta) {
  const before = captured.length;
  logger[level](err, meta);
  for (let i = 0; i < 50 && captured.length === before; i++) {
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }

  return captured.at(-1);
}

// shaped like the request/response metadata parse-request attaches
function requestMeta() {
  return {
    // do not persist this test log to Mongo
    ignore_hook: true,
    request: {
      method: 'GET',
      url: 'https://example.com/my-account',
      headers: {
        authorization: 'Basic ********',
        cookie: 'forward_email.sid=abc123; forward_email.sid.sig=def456',
        'user-agent': 'test'
      },
      cookies: {
        'forward_email.sid': 'abc123',
        'forward_email.sid.sig': 'def456'
      }
    },
    response: {
      status_code: 500,
      headers: {
        'set-cookie': ['forward_email.sid=abc123; path=/; httponly']
      }
    }
  };
}

for (const level of ['error', 'fatal']) {
  test.serial(
    `${level} logs redact cookie headers and parsed cookies`,
    async (t) => {
      const err = new Error('boom');
      err.headers = { cookie: 'forward_email.sid=abc123' };
      const { err: loggedErr, meta } = await logAndCapture(
        level,
        err,
        requestMeta()
      );

      t.is(meta.request.headers.cookie, 'REDACTED');
      t.is(meta.request.cookies, 'REDACTED');
      t.is(meta.response.headers['set-cookie'], 'REDACTED');
      t.is(loggedErr.headers.cookie, 'REDACTED');

      // unrelated fields are kept
      t.is(meta.request.headers['user-agent'], 'test');
      t.is(meta.request.url, 'https://example.com/my-account');
      t.is(meta.response.status_code, 500);

      const serialized = JSON.stringify({ loggedErr, meta });
      t.false(serialized.includes('abc123'));
      t.false(serialized.includes('def456'));
    }
  );
}
