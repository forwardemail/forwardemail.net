/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { once } = require('node:events');
const net = require('node:net');
const { setTimeout } = require('node:timers/promises');

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const { WebSocketServer } = require('ws');

const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { encoder, decoder } = require('#helpers/encoder-decoder');

//
// A TCP server that accepts every connection and drops it at once, so the
// WebSocket handshake never completes: what a client sees while the SQLite
// host is down or overloaded.  Every attempt is counted.
//
async function startDroppingServer(t) {
  let attempts = 0;
  const server = net.createServer((socket) => {
    attempts++;
    socket.destroy();
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());
  return { port: server.address().port, attempts: () => attempts };
}

//
// ReconnectingWebSocket sets each socket it opens to "blob" (the browser
// default), which ws honours since 8.18: every binary answer from the SQLite
// server then arrived as a Blob that msgpackr could not decode
// <https://github.com/websockets/ws/issues/2239>.
//
test('binary answers are decoded, also after a reconnect', async (t) => {
  t.timeout(ms('1m'));
  let connections = 0;
  const wss = new WebSocketServer({ port: 0, host: '127.0.0.1' });
  await once(wss, 'listening');
  t.teardown(() => wss.close());
  wss.on('connection', (ws) => {
    connections++;
    ws.on('message', (data) => {
      const { id } = decoder.unpack(data);
      ws.send(encoder.pack({ id, data: { answer: connections } }));
      // (the first connection drops after its answer, so the second request
      // goes over a socket ReconnectingWebSocket opened again)
      if (connections === 1) ws.terminate();
    });
  });

  const wsp = createWebSocketAsPromised({
    host: '127.0.0.1',
    port: wss.address().port
  });
  t.teardown(() => wsp.close());

  t.deepEqual(await wsp.request({ action: 'size' }, 0), { answer: 1 });
  await pWaitFor(() => wsp.isOpened && connections === 2, {
    timeout: ms('15s')
  }).catch(() => {});
  t.deepEqual(await wsp.request({ action: 'size' }, 0), { answer: 2 });
});

test('close() stops a client that never managed to connect', async (t) => {
  t.timeout(ms('1m'));
  const { port, attempts } = await startDroppingServer(t);
  const wsp = createWebSocketAsPromised({ host: '127.0.0.1', port });

  // the request gives up after its open timeout; the socket underneath keeps
  // trying to connect in the meantime
  await t.throwsAsync(
    wsp.request(
      {
        action: 'size',
        session: { user: { alias_id: '6aaea73491eeee86a0c714f3' } },
        timeout: 2000
      },
      0
    )
  );
  t.true(attempts() > 1);
  t.false(wsp.isOpened);

  // a close, even of a socket that is not open right now, ends the
  // reconnection attempts for good (they used to go on once a second for
  // the lifetime of the process)
  wsp.close();
  await setTimeout(500);
  const after = attempts();
  await setTimeout(ms('4s'));
  t.is(attempts(), after);
});

test('reconnection attempts back off and never run in lockstep', async (t) => {
  t.timeout(ms('1m'));
  const { port } = await startDroppingServer(t);
  const wsp = createWebSocketAsPromised({ host: '127.0.0.1', port });
  t.teardown(() => wsp.close());

  // the reconnecting socket underneath is created on the first open
  await wsp.open().catch(() => {});
  const rws = wsp._ws;
  t.truthy(rws);

  const delaysAt = (retryCount, samples = 50) => {
    rws._retryCount = retryCount;
    return Array.from({ length: samples }, () => rws._getNextDelay());
  };

  // grows with every failed attempt, bounded, and never below the base
  const expected = [500, 750, 1125, 1687.5, 2531.25, 3000, 3000, 3000];
  for (const [index, base] of expected.entries()) {
    const delays = delaysAt(index + 1);
    t.true(
      delays.every((delay) => delay >= base && delay <= base * 1.5),
      `attempt ${index + 1}: ${Math.min(...delays)}..${Math.max(...delays)}`
    );
  }

  // the wait before a reconnect of a socket that was connected before
  const reconnect = delaysAt(-1);
  t.true(reconnect.every((delay) => delay >= 1000 && delay <= 1500));

  // jitter: a fleet of clients does not pick the same delay
  t.true(new Set(delaysAt(3, 100)).size > 10);
});

//
// A request whose connection drops before the response (e.g. the SQLite
// server restarted) is sent again once the client reconnects, as one that
// timed out is, instead of failing the delivery or command at once.
//
test('a request is sent again when the connection drops before the response', async (t) => {
  t.timeout(ms('1m'));
  const wss = new WebSocketServer({ host: '127.0.0.1', port: 0 });
  await once(wss, 'listening');
  t.teardown(() => wss.close());

  let requests = 0;
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      requests++;
      if (requests === 1) {
        ws.terminate();
        return;
      }

      const { id } = decoder.unpack(data);
      ws.send(encoder.pack({ id, data: { ok: true } }));
    });
  });

  const wsp = createWebSocketAsPromised({
    host: '127.0.0.1',
    port: wss.address().port
  });
  t.teardown(() => wsp.close());

  const result = await wsp.request({
    action: 'size',
    session: { user: { alias_id: '6aaea73491eeee86a0c714f3' } },
    timeout: ms('10s')
  });
  t.deepEqual(result, { ok: true });
  t.is(requests, 2);
});
