/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { setTimeout } = require('node:timers/promises');
const net = require('node:net');

const test = require('ava');
const undici = require('undici');

//
// undici 7.30.x (patched in patches/undici@7.30.1.patch) asserted !paused in
// Parser.finish(), which runs from the socket "end" handler when a response has
// no Content-Length and is not chunked (its body ends when the peer closes).
// If the body had filled the response stream past its 64 KiB high water mark
// before the caller read it, the parser was paused when the peer closed, the
// assertion threw as an uncaughtException, and the request hung until its
// body timeout. The backported undici 8.6.0 finish() drains instead.
//
test('reads a close-delimited body that was paused by backpressure', async (t) => {
  const server = net.createServer((socket) => {
    socket.once('data', (data) => {
      const size = Number(/size=(\d+)/.exec(data.toString())[1]);
      socket.write(
        'HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nConnection: close\r\n\r\n'
      );
      socket.end(Buffer.alloc(size, 0x61));
    });
  });

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  t.teardown(() => server.close());

  const { port } = server.address();

  // sizes just over the high water mark pause on the last chunk; the small and
  // large bodies are controls
  for (const size of [1000, 65_536, 70_000, 131_072]) {
    for (let i = 0; i < 3; i++) {
      const { statusCode, body } = await undici.request(
        `http://127.0.0.1:${port}/?size=${size}`,
        { headersTimeout: 5000, bodyTimeout: 5000 }
      );
      t.is(statusCode, 200);

      // the peer has closed by the time the body is read
      await setTimeout(50);

      const buf = Buffer.from(await body.arrayBuffer());
      t.is(buf.length, size);
    }
  }
});
