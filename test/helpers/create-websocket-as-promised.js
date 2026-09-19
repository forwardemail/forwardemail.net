/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const net = require('node:net');
const { setTimeout } = require('node:timers/promises');

const ms = require('ms');
const test = require('ava');

const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');

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
