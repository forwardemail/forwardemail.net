/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// `wss.broadcast` of the SQLite server streams part of a response (batches
// of compiled FETCH lines) to the IMAP connection that requested it:
//
//  - the batch is written to the socket the request arrived on, and to no
//    other connected process (every process used to receive every batch)
//  - when that socket is gone (the requesting process reconnected or was
//    restarted) the batch is offered to every connected process, until one
//    of them acknowledges it
//

const { randomUUID } = require('node:crypto');

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');

const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

test.beforeEach(async (t) => {
  await utils.setupRedisClient(t);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(port);
  t.context.port = port;
  t.context.clients = [];
});

test.afterEach.always(async (t) => {
  for (const wsp of t.context.clients) {
    try {
      wsp.close();
    } catch {}
  }

  try {
    await t.context.sqlite?.close();
  } catch {}
});

//
// Connect a client process: it records every streamed batch it receives
// and, like the IMAP server, acknowledges the ones it was sent.
//
async function connectClient(t) {
  const { sqlite, port } = t.context;
  const before = new Set(sqlite.wss.clients);
  const wsp = createWebSocketAsPromised({ port });
  t.context.clients.push(wsp);
  const client = { wsp, received: [] };
  wsp.onUnpackedMessage.addListener((data) => {
    if (typeof data?.uuid !== 'string') return;
    client.received.push(data);
    wsp.send(data.uuid);
  });
  await wsp.open();
  await pWaitFor(() => sqlite.wss.clients.size === before.size + 1, {
    timeout: ms('10s')
  });
  // the server-side socket of this client
  client.ws = [...sqlite.wss.clients].find((ws) => !before.has(ws));
  t.truthy(client.ws);
  return client;
}

function session(ws) {
  return {
    id: randomUUID(),
    user: { alias_id: '6aaea73491eeee86a0c714f3' },
    ws
  };
}

test('a streamed batch reaches the requesting process only', async (t) => {
  t.timeout(ms('1m'));
  const { sqlite } = t.context;
  const owner = await connectClient(t);
  const bystander = await connectClient(t);
  const other = await connectClient(t);

  const payload = [{ compiled: 'x'.repeat(1024) }];
  await sqlite.wss.broadcast(session(owner.ws), payload);

  t.is(owner.received.length, 1);
  t.deepEqual(owner.received[0].payload, payload);
  t.is(bystander.received.length, 0);
  t.is(other.received.length, 0);

  // nothing left behind once acknowledged
  t.is(sqlite.uuidsReceived.size, 0);
});

test('a batch whose requesting socket is gone is offered to every process', async (t) => {
  t.timeout(ms('1m'));
  const { sqlite } = t.context;
  const owner = await connectClient(t);
  const survivor = await connectClient(t);

  // the requesting process went away (a restart, a reconnect)
  owner.wsp.close();
  await pWaitFor(() => !sqlite.wss.clients.has(owner.ws), {
    timeout: ms('10s')
  });

  const payload = [{ compiled: 'y'.repeat(1024) }];
  await sqlite.wss.broadcast(session(owner.ws), payload);

  t.is(survivor.received.length, 1);
  t.deepEqual(survivor.received[0].payload, payload);
});

test('a batch without a known requesting socket is offered to every process', async (t) => {
  t.timeout(ms('1m'));
  const { sqlite } = t.context;
  const a = await connectClient(t);
  const b = await connectClient(t);

  const payload = [{ compiled: 'z'.repeat(1024) }];
  await sqlite.wss.broadcast(session(undefined), payload);

  // (whoever acknowledges first ends the round; both were candidates)
  t.true(a.received.length + b.received.length >= 1);
});
