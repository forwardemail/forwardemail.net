/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A request body sent in Brotli must never reach the decoder bundled with
// Node.js v18 (CVE-2026-111497): the servers answer it with 415 before the
// body parser (which decodes Brotli through `inflation`) reads it.
//

const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

const test = require('ava');

const utils = require('../utils');

const JSON_BODY = Buffer.from(JSON.stringify({ email: 'test@example.com' }));

async function post(agent, url, body, encoding) {
  return (
    agent
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', encoding)
      // (the bytes as they are, not serialized as JSON)
      .serialize((data) => data)
      .send(body)
  );
}

test.serial('the web server refuses a Brotli request body', async (t) => {
  await utils.setupWebServer(t);
  try {
    const res = await post(
      t.context.web,
      '/en/login',
      zlib.brotliCompressSync(JSON_BODY),
      'br'
    );
    t.is(res.status, 415);
    t.is(res.headers['accept-encoding'], 'gzip, deflate, identity');
  } finally {
    await utils.teardownWebServer(t);
  }
});

test.serial('the API server refuses a Brotli request body', async (t) => {
  await utils.setupApiServer(t);
  try {
    const res = await post(
      t.context.api,
      '/v1/account',
      zlib.brotliCompressSync(JSON_BODY),
      'br'
    );
    t.is(res.status, 415);

    // (a gzip body is still read: it gets the same answer as the plain body)
    const gzip = await post(
      t.context.api,
      '/v1/account',
      zlib.gzipSync(JSON_BODY),
      'gzip'
    );
    const plain = await post(
      t.context.api,
      '/v1/account',
      JSON_BODY,
      'identity'
    );
    t.not(plain.status, 415);
    t.is(gzip.status, plain.status);
    t.deepEqual(gzip.body, plain.body);
  } finally {
    await utils.teardownApiServer(t);
  }
});
