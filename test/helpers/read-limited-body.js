/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const { Buffer } = require('node:buffer');

const test = require('ava');
const undici = require('undici');

const readLimitedBody = require('#helpers/read-limited-body');
const retryRequest = require('#helpers/retry-request');

// a server whose response body never ends (as a hostile webhook URL could)
async function endlessServer(t, statusCode = 200, interval = 0) {
  const server = http.createServer((req, res) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    const chunk = Buffer.alloc(64 * 1024, 'a');
    const timer = setInterval(
      () => res.write(interval ? 'a' : chunk),
      interval
    );
    res.on('close', () => clearInterval(timer));
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}/`;
}

test('reads only the start of an endless response body', async (t) => {
  const url = await endlessServer(t);
  const response = await undici.request(url);
  const text = await readLimitedBody(response.body);
  t.is(text.length, 1024);
  t.true(response.body.destroyed);
});

test('stops reading a slow response body at the time limit', async (t) => {
  const url = await endlessServer(t, 200, 50);
  const response = await undici.request(url);
  const start = Date.now();
  const text = await readLimitedBody(response.body, { timeout: 500 });
  t.true(Date.now() - start < 2000);
  t.true(text.length > 0 && text.length < 1024);
});

test('a non-200 response with an endless body still fails promptly', async (t) => {
  const url = await endlessServer(t, 500);
  const start = Date.now();
  const err = await t.throwsAsync(
    retryRequest(url, { retries: 1, timeout: 5000 })
  );
  t.is(err.statusCode, 500);
  t.true(Date.now() - start < 5000);
  t.true(err.body.length <= 64 * 1024);
});
