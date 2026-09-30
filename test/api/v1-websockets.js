/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const WebSocket = require('ws');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const { encoder, decoder } = require('#helpers/encoder-decoder');
const sendNotification = require('#helpers/send-notification');
const {
  CLOSE_CODE_REVOKED,
  revokeAccess
} = require('#helpers/credential-revocation');

const { VALID_EVENTS } = sendNotification;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.beforeEach((t) => {
  t.context._openWebSockets = [];
});
test.afterEach.always(async (t) => {
  // Properly close all WebSocket connections opened during this test
  // and wait for them to fully close before tearing down the server
  if (t.context._openWebSockets) {
    await Promise.all(
      t.context._openWebSockets.map(
        (ws) =>
          new Promise((resolve) => {
            if (
              ws.readyState === WebSocket.CLOSED ||
              ws.readyState === WebSocket.CLOSING
            ) {
              resolve();
              return;
            }

            ws.on('close', resolve);
            ws.close();
            // Force terminate after 1s if close handshake hangs
            setTimeout(() => {
              ws.terminate();
              resolve();
            }, 1000);
          })
      )
    );
  }
});
test.afterEach.always(utils.teardownApiServer);

// ─── Helpers ───────────────────────────────────────────────────────────────

function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

function createApiTokenAuth(apiToken) {
  return `Basic ${Buffer.from(`${apiToken}:`).toString('base64')}`;
}

async function createTestAlias(t) {
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  user = await user.save();

  // Use a unique domain name to prevent collisions across tests
  // (randDomainName has ~11% collision rate over 100 calls)
  const uniqueDomainName = `${randomUUID().slice(0, 8)}.example.com`;
  const domain = await t.context.domainFactory
    .withState({
      name: uniqueDomainName,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('30m')
    )
  );
  await t.context.resolver.options.cache.mset(map);

  return { user, domain, alias, pass };
}

/**
 * Connect a WebSocket and buffer incoming messages to avoid race conditions.
 * Supports both JSON and msgpackr modes.
 */
function connectWebSocket(
  wsURL,
  headers,
  useMsgpackr = false,
  timeoutMs = ms('10s')
) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsURL, { headers });
    ws._messageBuffer = [];
    ws._messageWaiters = [];
    ws._useMsgpackr = useMsgpackr;

    ws.on('message', (data, isBinary) => {
      const parsed =
        useMsgpackr && isBinary
          ? decoder.unpack(data)
          : JSON.parse(data.toString());

      if (ws._messageWaiters.length > 0) {
        const waiter = ws._messageWaiters.shift();
        waiter.resolve(parsed);
      } else {
        ws._messageBuffer.push(parsed);
      }
    });

    const timeout = setTimeout(() => {
      ws.terminate();
      reject(new Error('WebSocket connection timeout'));
    }, timeoutMs);
    ws.on('open', () => {
      clearTimeout(timeout);
      resolve(ws);
    });
    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function waitForMessage(ws, timeoutMs = 10_000) {
  if (ws._messageBuffer && ws._messageBuffer.length > 0) {
    return Promise.resolve(ws._messageBuffer.shift());
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timed out waiting for WebSocket message'));
    }, timeoutMs);

    const waiter = {
      resolve(msg) {
        clearTimeout(timeout);
        resolve(msg);
      }
    };

    if (!ws._messageWaiters) ws._messageWaiters = [];
    ws._messageWaiters.push(waiter);
  });
}

/**
 * Publish a notification via Redis using msgpackr (matching the real
 * sendNotification implementation).
 */
function publishNotification(client, aliasId, event, data = {}) {
  const packed = encoder.pack({
    aliasId,
    payload: {
      event,
      timestamp: Date.now(),
      ...data
    }
  });
  client.publishBuffer(config.WS_REDIS_CHANNEL_NAME, packed);
}

// ─── Connection & Auth Tests ────────────────────────────────────────────────

test('connects without auth in broadcast-only mode', async (t) => {
  const { apiURL } = t.context;
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {});
  t.context._openWebSockets.push(ws);

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'connected');
  t.is(msg.broadcastOnly, true);
  t.falsy(msg.aliasId);
  ws.close();
});

test('fails WebSocket connection with invalid API token', async (t) => {
  const { apiURL } = t.context;
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws?alias_id=fake123';

  await t.throwsAsync(
    () =>
      connectWebSocket(wsURL, {
        Authorization: createApiTokenAuth('invalid-token-123')
      }),
    { message: /Unexpected server response: 401/ }
  );
});

test('refuses a non-Basic Authorization header instead of connecting as broadcast-only', async (t) => {
  const { apiURL } = t.context;
  await t.throwsAsync(
    () =>
      connectWebSocket(apiURL.replace(/^http/, 'ws') + '/v1/ws', {
        Authorization: 'Bearer some-token'
      }),
    { message: /Unexpected server response: 401/ }
  );
});

test('fails WebSocket connection with an explicitly disabled API token', async (t) => {
  const { apiURL } = t.context;
  const { user, alias } = await createTestAlias(t);
  user[config.userFields.apiTokenDisabled] = true;
  await user.save();

  const wsURL = apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`;

  await t.throwsAsync(
    () =>
      connectWebSocket(wsURL, {
        Authorization: createApiTokenAuth(user[config.userFields.apiToken])
      }),
    { message: /Unexpected server response: 401/ }
  );
});

test('fails WebSocket connection with API token but no alias_id', async (t) => {
  const { apiURL } = t.context;
  const { user } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  await t.throwsAsync(
    () =>
      connectWebSocket(wsURL, {
        Authorization: createApiTokenAuth(user[config.userFields.apiToken])
      }),
    { message: /Unexpected server response: 400/ }
  );
});

test('rejects WebSocket credentials in query parameters', async (t) => {
  const { apiURL } = t.context;
  const { user, alias, domain, pass } = await createTestAlias(t);
  const baseURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  await t.throwsAsync(
    () =>
      connectWebSocket(
        `${baseURL}?alias_id=${alias.id}&token=${encodeURIComponent(
          user[config.userFields.apiToken]
        )}`,
        {}
      ),
    { message: /Unexpected server response: 400/ }
  );

  await t.throwsAsync(
    () =>
      connectWebSocket(
        `${baseURL}?username=${encodeURIComponent(
          `${alias.name}@${domain.name}`
        )}&password=${encodeURIComponent(pass)}`,
        {}
      ),
    { message: /Unexpected server response: 400/ }
  );
});

test('establishes WebSocket connection with alias auth', async (t) => {
  const { apiURL } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'connected');
  t.is(msg.aliasId, alias.id);

  ws.close();
});

test('establishes WebSocket connection with API token auth', async (t) => {
  const { apiURL } = t.context;
  const { user, alias } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`;

  const ws = await connectWebSocket(wsURL, {
    Authorization: createApiTokenAuth(user[config.userFields.apiToken])
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'connected');
  t.is(msg.aliasId, alias.id);

  ws.close();
});

function waitForClose(ws, timeoutMs = 10_000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Timed out waiting for close')),
      timeoutMs
    );
    ws.once('close', (code) => {
      clearTimeout(timeout);
      resolve(code);
    });
  });
}

// ─── First-Message Authentication (?auth=message) ─────────────────────────

// Open a `?auth=message` connection and send `message` (an object is sent
// as JSON, anything else as is) as soon as it opens.
async function connectMessageAuth(t, message, query = '') {
  const ws = await connectWebSocket(
    t.context.apiURL.replace(/^http/, 'ws') + `/v1/ws?auth=message${query}`,
    {}
  );
  t.context._openWebSockets.push(ws);
  if (message !== undefined)
    ws.send(
      typeof message === 'object' && !Buffer.isBuffer(message)
        ? JSON.stringify(message)
        : message
    );
  return ws;
}

test('first message: alias credentials open an authenticated socket', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: `${alias.name}@${domain.name}`,
    password: pass
  });
  const connected = await waitForMessage(ws);
  t.deepEqual(connected, { event: 'connected', aliasId: alias.id });

  // and it receives the alias's events
  publishNotification(t.context.client, alias.id, 'newMessage', { uid: 1 });
  const event = await waitForMessage(ws);
  t.is(event.event, 'newMessage');
});

test('first message: an API token with alias_id opens an authenticated socket', async (t) => {
  const { user, alias } = await createTestAlias(t);
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: user[config.userFields.apiToken],
    password: '',
    alias_id: alias.id
  });
  const connected = await waitForMessage(ws);
  t.is(connected.aliasId, alias.id);
});

test('first message: nothing is sent before the connection is authenticated', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  const ws = await connectMessageAuth(t);

  // no broadcast-only welcome, no broadcasts, no alias events
  t.context.wsHandler._broadcast({ event: 'newRelease', release: {} });
  publishNotification(t.context.client, alias.id, 'newMessage', { uid: 1 });
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
  t.deepEqual(ws._messageBuffer, []);

  ws.send(
    JSON.stringify({
      event: 'auth',
      username: `${alias.name}@${domain.name}`,
      password: pass
    })
  );
  const connected = await waitForMessage(ws);
  t.is(connected.aliasId, alias.id);
});

test('first message: wrong credentials close the socket with 4401', async (t) => {
  const { alias, domain } = await createTestAlias(t);
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: `${alias.name}@${domain.name}`,
    password: 'wrong password'
  });
  t.is(await waitForClose(ws), 4401);
  t.deepEqual(ws._messageBuffer, []);
});

test('first message: an alias the API token cannot reach closes with 4403', async (t) => {
  const { user } = await createTestAlias(t);
  const other = await createTestAlias(t);
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: user[config.userFields.apiToken],
    password: '',
    alias_id: other.alias.id
  });
  t.is(await waitForClose(ws), 4403);
});

test('first message: malformed messages close the socket with 4400', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  const username = `${alias.name}@${domain.name}`;
  for (const message of [
    'not json',
    '[]',
    'null',
    JSON.stringify({ event: 'pong' }),
    JSON.stringify({ event: 'auth' }),
    JSON.stringify({ event: 'auth', username: { $ne: null }, password: pass }),
    JSON.stringify({ event: 'auth', username, password: { $gt: '' } }),
    JSON.stringify({ event: 'auth', username, password: 'x'.repeat(129) }),
    JSON.stringify({
      event: 'auth',
      username: 'a'.repeat(321),
      password: pass
    }),
    JSON.stringify({
      event: 'auth',
      username: `${username}\n`,
      password: pass
    }),
    JSON.stringify({
      event: 'auth',
      username,
      password: '',
      alias_id: { $ne: null }
    }),
    JSON.stringify({ event: 'auth', username, password: '', alias_id: '1' }),
    // binary frames are not accepted
    Buffer.from(JSON.stringify({ event: 'auth', username, password: pass }))
  ]) {
    const ws = await connectMessageAuth(t, message);
    const code = await waitForClose(ws);
    t.is(code, 4400, `${String(message).slice(0, 60)}`);
  }
});

test('first message: a frame over the size limit is refused', async (t) => {
  const ws = await connectMessageAuth(
    t,
    JSON.stringify({ event: 'auth', username: 'a', password: 'x'.repeat(2048) })
  );
  // ws closes a connection whose frame exceeds maxPayload with 1009
  t.is(await waitForClose(ws), 1009);
});

test('first message: only the first message is used', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  const other = await createTestAlias(t);
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: `${alias.name}@${domain.name}`,
    password: pass
  });
  ws.send(
    JSON.stringify({
      event: 'auth',
      username: `${other.alias.name}@${other.domain.name}`,
      password: other.pass
    })
  );
  const connected = await waitForMessage(ws);
  t.is(connected.aliasId, alias.id);
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
  t.deepEqual(ws._messageBuffer, []);
  t.is(ws.readyState, WebSocket.OPEN);
});

test('first message: a connection that sends nothing is closed with 4408', async (t) => {
  t.context.wsHandler.authMessageTimeoutMs = 200;
  const ws = await connectMessageAuth(t);
  t.is(await waitForClose(ws), 4408);
});

test('first message: waiting connections are capped per address', async (t) => {
  const sockets = [];
  for (let i = 0; i < 5; i++) sockets.push(await connectMessageAuth(t));
  await t.throwsAsync(() => connectMessageAuth(t), {
    message: /Unexpected server response: 429/
  });

  // a slot frees up when one closes
  const closed = waitForClose(sockets[0]);
  sockets[0].close();
  await closed;
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  const ws = await connectMessageAuth(t);
  t.is(ws.readyState, WebSocket.OPEN);
});

test('first message: the per-alias connection limit applies', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);
  for (let i = 0; i < 10; i++) {
    const ws = await connectWebSocket(
      t.context.apiURL.replace(/^http/, 'ws') + '/v1/ws',
      { Authorization: auth }
    );
    t.context._openWebSockets.push(ws);
    await waitForMessage(ws);
  }

  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: `${alias.name}@${domain.name}`,
    password: pass
  });
  t.is(await waitForClose(ws), 4429);
});

test('repeated failed logins from one address are refused for a while', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  const username = `${alias.name}@${domain.name}`;
  // (API token guesses: the shared login's own limits cover passwords)
  for (let i = 0; i < 10; i++) {
    const ws = await connectMessageAuth(t, {
      event: 'auth',
      username: `not-a-token-${i}`,
      password: '',
      alias_id: alias.id
    });
    t.is(await waitForClose(ws), 4401);
  }

  // even correct credentials, either way
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username,
    password: pass
  });
  t.is(await waitForClose(ws), 4429);
  await t.throwsAsync(
    () =>
      connectWebSocket(t.context.apiURL.replace(/^http/, 'ws') + '/v1/ws', {
        Authorization: createAliasAuth(username, pass)
      }),
    { message: /Unexpected server response: 429/ }
  );
});

test('first message: auth=message cannot be combined with a header or other values', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  const baseURL = t.context.apiURL.replace(/^http/, 'ws') + '/v1/ws';
  await t.throwsAsync(
    () =>
      connectWebSocket(`${baseURL}?auth=message`, {
        Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
      }),
    { message: /Unexpected server response: 400/ }
  );
  await t.throwsAsync(() => connectWebSocket(`${baseURL}?auth=basic`, {}), {
    message: /Unexpected server response: 400/
  });
  await t.throwsAsync(
    () => connectWebSocket(`${baseURL}?auth=message&auth=message`, {}),
    { message: /Unexpected server response: 400/ }
  );
});

test('first message: a server outage closes with 1013 so clients retry', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  t.context._api.isClosing = true;
  try {
    const ws = await connectMessageAuth(t, {
      event: 'auth',
      username: `${alias.name}@${domain.name}`,
      password: pass
    });
    t.is(await waitForClose(ws), 1013);
  } finally {
    t.context._api.isClosing = false;
  }
});

test('first message: the shared login limit closes with 4429, not 4401', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  // the shared login (IMAP, SMTP, API) has refused this address
  await t.context.client.set(
    `auth_limit_${config.env}:127.0.0.1`,
    config.smtpLimitAuth,
    'PX',
    60_000
  );
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: `${alias.name}@${domain.name}`,
    password: pass
  });
  t.is(await waitForClose(ws), 4429);
  // (and it is not counted as a failed WebSocket login)
  t.is(
    await t.context.client.get(`ws_auth_fail:${config.env}:127.0.0.1`),
    null
  );
});

test.serial(
  'first message: waiting connections are capped per IPv6 /48 too',
  async (t) => {
    const original = config.WS_TRUST_PROXY;
    config.WS_TRUST_PROXY = true;
    try {
      const url =
        t.context.apiURL.replace(/^http/, 'ws') + '/v1/ws?auth=message';
      // a different /64 each time, all in one /48
      for (let i = 0; i < 20; i++) {
        const ws = await connectWebSocket(url, {
          'X-Forwarded-For': `2001:db8:1:${i.toString(16)}::1`
        });
        t.context._openWebSockets.push(ws);
      }

      await t.throwsAsync(
        () => connectWebSocket(url, { 'X-Forwarded-For': '2001:db8:1:ff::1' }),
        { message: /Unexpected server response: 429/ }
      );
      // another /48 is not affected
      const ws = await connectWebSocket(url, {
        'X-Forwarded-For': '2001:db8:2::1'
      });
      t.context._openWebSockets.push(ws);
      t.is(ws.readyState, WebSocket.OPEN);
    } finally {
      config.WS_TRUST_PROXY = original;
    }
  }
);

test.serial(
  'only the X-Forwarded-For entry added by the proxy is used',
  async (t) => {
    const original = config.WS_TRUST_PROXY;
    config.WS_TRUST_PROXY = true;
    try {
      const url =
        t.context.apiURL.replace(/^http/, 'ws') + '/v1/ws?auth=message';
      // the first entry is whatever the client sent
      const ws = await connectWebSocket(url, {
        'X-Forwarded-For': '203.0.113.9, 198.51.100.20'
      });
      t.context._openWebSockets.push(ws);
      const { pendingClients } = t.context.wsHandler;
      t.true(pendingClients.has('198.51.100.20'));
      t.false(pendingClients.has('203.0.113.9'));

      // not an address: the connection's own address
      const other = await connectWebSocket(url, {
        'X-Forwarded-For': '198.51.100.20, 1.2.3.4:1'
      });
      t.context._openWebSockets.push(other);
      t.true(pendingClients.has('127.0.0.1'));
    } finally {
      config.WS_TRUST_PROXY = original;
    }
  }
);

test('first message: when every waiting slot is taken the oldest idle one is dropped', async (t) => {
  t.context.wsHandler.maxPendingTotal = 2;
  const first = await connectMessageAuth(t);
  const second = await connectMessageAuth(t);
  const firstClosed = waitForClose(first);
  const third = await connectMessageAuth(t);
  t.is(third.readyState, WebSocket.OPEN);
  await firstClosed;
  t.is(second.readyState, WebSocket.OPEN);
  t.is(t.context.wsHandler.pendingCount, 2);
});

test('an API token member who is not an admin cannot connect to another alias', async (t) => {
  const { domain, alias } = await createTestAlias(t);
  const member = await t.context.userFactory
    .withState({ plan: 'enhanced_protection' })
    .create();
  // (updateOne: the model hooks would reject members on this test plan)
  const Domains = domain.constructor;
  await Domains.updateOne(
    { _id: domain._id },
    { $push: { members: { user: member._id, group: 'user' } } }
  );
  const wsURL =
    t.context.apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`;
  const auth = createApiTokenAuth(member[config.userFields.apiToken]);

  await t.throwsAsync(() => connectWebSocket(wsURL, { Authorization: auth }), {
    message: /Unexpected server response: 404/
  });

  // the same user as a domain admin can
  await Domains.updateOne(
    { _id: domain._id, 'members.user': member._id },
    { $set: { 'members.$.group': 'admin' } }
  );
  const ws = await connectWebSocket(wsURL, { Authorization: auth });
  t.context._openWebSockets.push(ws);
  const connected = await waitForMessage(ws);
  t.is(connected.aliasId, alias.id);
});

// ─── Revocation Tests ──────────────────────────────────────────────────────
// (serial: model hooks revoke through the client of the current test)

test.serial('changing an alias password closes its sockets', async (t) => {
  const { apiURL } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const ws = await connectWebSocket(apiURL.replace(/^http/, 'ws') + '/v1/ws', {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });
  t.context._openWebSockets.push(ws);
  const connected = await waitForMessage(ws);
  t.is(connected.aliasId, alias.id);

  const closed = waitForClose(ws);
  await alias.createToken();
  await alias.save();
  t.is(await closed, CLOSE_CODE_REVOKED);
});

test.serial(
  'regenerating an API token closes the sockets it opened',
  async (t) => {
    const { apiURL } = t.context;
    const { user, alias } = await createTestAlias(t);
    const ws = await connectWebSocket(
      apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`,
      { Authorization: createApiTokenAuth(user[config.userFields.apiToken]) }
    );
    t.context._openWebSockets.push(ws);
    const connected = await waitForMessage(ws);
    t.is(connected.aliasId, alias.id);

    const closed = waitForClose(ws);
    user[config.userFields.apiToken] = undefined;
    await user.save();
    t.is(await closed, CLOSE_CODE_REVOKED);
  }
);

test.serial(
  'a member who is no longer an admin loses sockets for other aliases',
  async (t) => {
    const { apiURL } = t.context;
    const { domain, alias } = await createTestAlias(t);
    const member = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    const Domains = domain.constructor;
    // (updateOne: set up a team domain without the plan checks)
    await Domains.updateOne(
      { _id: domain._id },
      {
        $set: { plan: 'team' },
        $push: { members: { user: member._id, group: 'admin' } }
      }
    );

    const ws = await connectWebSocket(
      apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`,
      { Authorization: createApiTokenAuth(member[config.userFields.apiToken]) }
    );
    t.context._openWebSockets.push(ws);
    const connected = await waitForMessage(ws);
    t.is(connected.aliasId, alias.id);

    const closed = waitForClose(ws);
    const doc = await Domains.findById(domain._id);
    const entry = doc.members.find(
      (m) => m.user.toString() === member._id.toString()
    );
    entry.group = 'user';
    await doc.save();
    t.is(await closed, CLOSE_CODE_REVOKED);

    // and it cannot reconnect
    await t.throwsAsync(
      () =>
        connectWebSocket(
          apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`,
          {
            Authorization: createApiTokenAuth(
              member[config.userFields.apiToken]
            )
          }
        ),
      { message: /Unexpected server response: 404/ }
    );
  }
);

test.serial(
  'a cached login is not reused after the alias is disabled',
  async (t) => {
    const { alias, domain, pass } = await createTestAlias(t);
    const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);

    const wsURL = t.context.apiURL.replace(/^http/, 'ws') + '/v1/ws';

    // the first connection checks the credentials and caches the login
    const ws = await connectWebSocket(wsURL, { Authorization: auth });
    t.context._openWebSockets.push(ws);
    const connected = await waitForMessage(ws);
    t.is(connected.aliasId, alias.id);

    // a write that skips document middleware
    await alias.constructor.updateOne(
      { _id: alias._id },
      { $set: { is_enabled: false } }
    );

    await t.throwsAsync(
      () => connectWebSocket(wsURL, { Authorization: auth }),
      { message: /Unexpected server response: 401/ }
    );
  }
);

test.serial(
  'a ban written with an update closes the account sockets',
  async (t) => {
    const { apiURL } = t.context;
    const { user, alias } = await createTestAlias(t);
    const ws = await connectWebSocket(
      apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`,
      { Authorization: createApiTokenAuth(user[config.userFields.apiToken]) }
    );
    t.context._openWebSockets.push(ws);
    const connected = await waitForMessage(ws);
    t.is(connected.aliasId, alias.id);

    const closed = waitForClose(ws);
    await user.constructor.findByIdAndUpdate(user._id, {
      $set: { [config.userFields.isBanned]: true }
    });
    t.is(await closed, CLOSE_CODE_REVOKED);
  }
);

test.serial(
  'regenerating the API token leaves alias password sockets open',
  async (t) => {
    const { apiURL } = t.context;
    const { user, alias, domain, pass } = await createTestAlias(t);
    const ws = await connectWebSocket(
      apiURL.replace(/^http/, 'ws') + '/v1/ws',
      {
        Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
      }
    );
    t.context._openWebSockets.push(ws);
    const connected = await waitForMessage(ws);
    t.is(connected.aliasId, alias.id);

    user[config.userFields.apiToken] = undefined;
    await user.save();
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    t.is(ws.readyState, WebSocket.OPEN);
  }
);

test('an API request during a server outage answers 503, not 401', async (t) => {
  const { alias, domain, pass } = await createTestAlias(t);
  t.context._api.isClosing = true;
  try {
    const res = await t.context.api
      .get('/v1/account')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      );
    t.is(res.status, 503);
  } finally {
    t.context._api.isClosing = false;
  }
});

test('a password change while the handshake is checking credentials closes the socket', async (t) => {
  const { apiURL, wsHandler, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // the change lands after the credentials were checked, before the socket
  // is registered (the revocation is published to no one)
  const original = wsHandler._authenticate.bind(wsHandler);
  wsHandler._authenticate = async (...args) => {
    const result = await original(...args);
    await revokeAccess(client, { aliasIds: [alias.id] });
    return result;
  };

  try {
    const ws = await connectWebSocket(
      apiURL.replace(/^http/, 'ws') + '/v1/ws',
      { Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass) }
    );
    t.context._openWebSockets.push(ws);
    t.is(await waitForClose(ws), CLOSE_CODE_REVOKED);
    // no connected event (nor any other) was sent
    t.deepEqual(ws._messageBuffer, []);
  } finally {
    wsHandler._authenticate = original;
  }
});

test('a password change while a first message is being checked closes the socket', async (t) => {
  const { wsHandler, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const original = wsHandler._checkCredentials.bind(wsHandler);
  wsHandler._checkCredentials = async (...args) => {
    const result = await original(...args);
    await revokeAccess(client, { aliasIds: [alias.id] });
    return result;
  };

  try {
    const ws = await connectMessageAuth(t, {
      event: 'auth',
      username: `${alias.name}@${domain.name}`,
      password: pass
    });
    t.is(await waitForClose(ws), CLOSE_CODE_REVOKED);
    t.deepEqual(ws._messageBuffer, []);
  } finally {
    wsHandler._checkCredentials = original;
  }
});

test('a banned account cannot connect with its API token', async (t) => {
  const { apiURL } = t.context;
  const { user, alias } = await createTestAlias(t);
  await user.constructor.updateOne(
    { _id: user._id },
    { $set: { [config.userFields.isBanned]: true } }
  );
  const auth = createApiTokenAuth(user[config.userFields.apiToken]);

  await t.throwsAsync(
    () =>
      connectWebSocket(
        apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`,
        { Authorization: auth }
      ),
    { message: /Unexpected server response: 403/ }
  );
  const ws = await connectMessageAuth(t, {
    event: 'auth',
    username: user[config.userFields.apiToken],
    password: '',
    alias_id: alias.id
  });
  t.is(await waitForClose(ws), 4403);
});

test('alias credentials go through the shared login (a disabled alias is refused)', async (t) => {
  const { apiURL } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  await alias.constructor.updateOne(
    { _id: alias._id },
    { $set: { is_enabled: false } }
  );

  await t.throwsAsync(
    () =>
      connectWebSocket(apiURL.replace(/^http/, 'ws') + '/v1/ws', {
        Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
      }),
    { message: /Unexpected server response: 401/ }
  );
});

test('the connection rate limit window does not slide', async (t) => {
  const { wsHandler, client } = t.context;
  const ip = '198.51.100.7';
  const key = `ws_rate:${config.env}:${ip}`;
  t.true(await wsHandler._checkRateLimit(ip));
  const first = await client.pttl(key);
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
  t.true(await wsHandler._checkRateLimit(ip));
  t.true((await client.pttl(key)) < first);
});

test('API message creation emits identity metadata in newMessage', async (t) => {
  const { apiURL, api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';
  const authorization = createAliasAuth(`${alias.name}@${domain.name}`, pass);

  const ws = await connectWebSocket(wsURL, {
    Authorization: authorization
  });
  t.context._openWebSockets.push(ws);

  const connected = await waitForMessage(ws);
  t.is(connected.event, 'connected');

  const from = 'API Sender <sender@example.com>';
  const to = `${alias.name}@${domain.name}`;
  const cc = 'cc@example.com';
  const bcc = 'bcc@example.com';
  const replyTo = 'replies@example.com';
  const raw = [
    `From: ${from}`,
    `To: ${to}`,
    `Cc: ${cc}`,
    `Bcc: ${bcc}`,
    `Reply-To: ${replyTo}`,
    'Subject: Production WebSocket Contract',
    '',
    'Contract body'
  ].join('\r\n');

  const response = await api
    .post('/v1/messages')
    .set('Authorization', authorization)
    .send({ raw, folder: 'INBOX' });
  t.is(response.status, 200);

  const frame = await waitForMessage(ws, 20_000);

  t.is(frame.event, 'newMessage');
  t.is(frame.mailbox, 'INBOX');
  t.truthy(frame.message);
  t.falsy(frame.data);
  t.deepEqual(frame.message.from, [
    { address: 'sender@example.com', name: 'API Sender' }
  ]);
  t.deepEqual(frame.message.to, [{ address: to, name: '' }]);
  t.deepEqual(frame.message.cc, [{ address: cc, name: '' }]);
  t.deepEqual(frame.message.bcc, [{ address: bcc, name: '' }]);
  t.deepEqual(frame.message.reply_to, [{ address: replyTo, name: '' }]);
  t.is(frame.message.subject, 'Production WebSocket Contract');
});

// ─── Channel Isolation & Security Tests ─────────────────────────────────────

test('does not receive notifications for other aliases', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');

  // Publish for a different alias — should NOT be received
  publishNotification(client, 'some-other-alias-id', 'newMessage', {
    data: { mailbox: 'INBOX' }
  });

  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Publish for our alias — should be received
  publishNotification(client, alias.id, 'newMessage', {
    data: { mailbox: 'INBOX', message: { uid: 2, object: 'message' } }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.uid, 2);

  ws.close();
});

test('fans out one logical event to an active WebSocket', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });
  t.context._openWebSockets.push(ws);
  await waitForMessage(ws);

  const notificationId = randomUUID();
  publishNotification(client, alias.id, 'newMessage', {
    notificationId,
    data: { mailbox: 'INBOX', message: { uid: 3, object: 'message' } }
  });

  const message = await waitForMessage(ws);
  t.is(message.notificationId, notificationId);
});

test('read-only channel: client messages are silently ignored', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');

  // Client sends data — should be silently ignored
  ws.send(JSON.stringify({ event: 'subscribe', channel: 'other-alias' }));

  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 300));

  publishNotification(client, alias.id, 'newMessage', {
    data: { mailbox: 'INBOX', message: { uid: 1, object: 'message' } }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');

  ws.close();
});

// ─── Keep-Alive Ping Tests ──────────────────────────────────────────────────

test('keep-alive sends application-level ping event to connected clients', async (t) => {
  const { apiURL, wsHandler } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });
  t.context._openWebSockets.push(ws);

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');

  // Manually trigger the keep-alive logic instead of waiting for the interval
  for (const client of wsHandler.wss.clients) {
    client.isAlive = false;
    client.ping();
    wsHandler._send(client, { event: 'ping' });
  }

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'ping');

  ws.close();
});

test('keep-alive sends application-level ping in msgpackr mode', async (t) => {
  const { apiURL, wsHandler } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws?msgpackr=true';

  const ws = await connectWebSocket(
    wsURL,
    {
      Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
    },
    true
  );
  t.context._openWebSockets.push(ws);

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');

  // Manually trigger the keep-alive logic
  for (const client of wsHandler.wss.clients) {
    client.isAlive = false;
    client.ping();
    wsHandler._send(client, { event: 'ping' });
  }

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'ping');

  ws.close();
});

test('unauthenticated clients also receive application-level ping', async (t) => {
  const { apiURL, wsHandler } = t.context;
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {});
  t.context._openWebSockets.push(ws);

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');
  t.is(connMsg.broadcastOnly, true);

  // Manually trigger the keep-alive logic
  for (const client of wsHandler.wss.clients) {
    client.isAlive = false;
    client.ping();
    wsHandler._send(client, { event: 'ping' });
  }

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'ping');

  ws.close();
});

// ─── msgpackr Encoding Tests ────────────────────────────────────────────────

test('receives JSON text frames by default (msgpackr=false)', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');

  publishNotification(client, alias.id, 'newMessage', {
    data: {
      mailbox: 'INBOX',
      message: { id: 'msg-1', uid: 1, subject: 'Test', object: 'message' }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.subject, 'Test');

  ws.close();
});

test('receives binary msgpackr frames when msgpackr=true', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws?msgpackr=true';

  const ws = await connectWebSocket(
    wsURL,
    {
      Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
    },
    true
  );

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');

  publishNotification(client, alias.id, 'newMessage', {
    data: {
      mailbox: 'INBOX',
      message: {
        id: 'msg-1',
        uid: 42,
        from: 'test@example.com',
        subject: 'Binary Test',
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.uid, 42);
  t.is(msg.data.message.subject, 'Binary Test');
  t.is(msg.data.message.from, 'test@example.com');

  ws.close();
});

// ─── IMAP Event Tests with Enriched Payloads ────────────────────────────────

test('receives newMessage with full message metadata (no eml)', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'newMessage', {
    data: {
      mailbox: 'INBOX',
      message: {
        id: '60d5f484f1a2c8b1f8e4e1a1',
        folder_id: '60d5f484f1a2c8b1f8e4e1a0',
        folder_path: 'INBOX',
        uid: 42,
        modseq: 100,
        flags: [],
        labels: [],
        from: 'sender@example.com',
        subject: 'Hello World',
        size: 1234,
        is_unread: true,
        is_flagged: false,
        is_deleted: false,
        is_draft: false,
        is_junk: false,
        is_encrypted: false,
        is_copied: false,
        is_searchable: true,
        is_expired: false,
        has_attachment: false,
        internal_date: new Date().toISOString(),
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.truthy(msg.timestamp);
  // Verify enriched metadata
  t.is(msg.data.mailbox, 'INBOX');
  t.is(msg.data.message.id, '60d5f484f1a2c8b1f8e4e1a1');
  t.is(msg.data.message.uid, 42);
  t.is(msg.data.message.modseq, 100);
  t.is(msg.data.message.from, 'sender@example.com');
  t.is(msg.data.message.subject, 'Hello World');
  t.is(msg.data.message.size, 1234);
  t.is(msg.data.message.is_unread, true);
  t.is(msg.data.message.is_encrypted, false);
  t.is(msg.data.message.object, 'message');
  t.deepEqual(msg.data.message.flags, []);
  // eml is intentionally omitted to prevent memory bloat
  t.is(msg.data.message.eml, undefined);

  ws.close();
});

test('receives newMessage via API token auth with enriched payload', async (t) => {
  const { apiURL, client } = t.context;
  const { user, alias } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + `/v1/ws?alias_id=${alias.id}`;

  const ws = await connectWebSocket(wsURL, {
    Authorization: createApiTokenAuth(user[config.userFields.apiToken])
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'newMessage', {
    data: {
      mailbox: 'INBOX',
      message: {
        id: 'msg-api-token',
        uid: 99,
        from: 'test@example.com',
        subject: 'API Token Test',
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.uid, 99);
  t.is(msg.data.message.subject, 'API Token Test');
  t.is(msg.data.message.from, 'test@example.com');

  ws.close();
});

test('receives messagesMoved with enriched payload', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'messagesMoved', {
    data: {
      sourceMailbox: '60d5f484f1a2c8b1f8e4e1a0',
      destinationMailbox: '60d5f484f1a2c8b1f8e4e1a2',
      destinationPath: 'Trash',
      sourceUid: [1, 2, 3],
      destinationUid: [10, 11, 12]
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'messagesMoved');
  t.is(msg.data.sourceMailbox, '60d5f484f1a2c8b1f8e4e1a0');
  t.is(msg.data.destinationMailbox, '60d5f484f1a2c8b1f8e4e1a2');
  t.is(msg.data.destinationPath, 'Trash');
  t.deepEqual(msg.data.sourceUid, [1, 2, 3]);
  t.deepEqual(msg.data.destinationUid, [10, 11, 12]);

  ws.close();
});

test('receives messagesCopied with enriched payload', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'messagesCopied', {
    data: {
      sourceMailbox: 'source-id',
      destinationMailbox: 'dest-id',
      destinationPath: 'Archive',
      sourceUid: [5],
      destinationUid: [1]
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'messagesCopied');
  t.is(msg.data.destinationPath, 'Archive');
  t.deepEqual(msg.data.sourceUid, [5]);
  t.deepEqual(msg.data.destinationUid, [1]);

  ws.close();
});

test('receives flagsUpdated with enriched payload', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'flagsUpdated', {
    data: {
      mailbox: 'inbox-id',
      uids: [1, 2],
      flags: { set: ['\\Seen', '\\Flagged'] }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'flagsUpdated');
  t.is(msg.data.mailbox, 'inbox-id');
  t.deepEqual(msg.data.uids, [1, 2]);
  t.deepEqual(msg.data.flags, { set: ['\\Seen', '\\Flagged'] });

  ws.close();
});

test('receives messagesExpunged notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'messagesExpunged', {
    data: { mailbox: 'expunge-mailbox-id' }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'messagesExpunged');
  t.is(msg.data.mailbox, 'expunge-mailbox-id');

  ws.close();
});

test('receives mailboxCreated notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'mailboxCreated', {
    data: { path: 'Projects/Work', mailbox: 'new-mailbox-id-001' }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'mailboxCreated');
  t.is(msg.data.path, 'Projects/Work');
  t.is(msg.data.mailbox, 'new-mailbox-id-001');

  ws.close();
});

test('receives mailboxDeleted notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'mailboxDeleted', {
    data: { path: 'Old Folder', mailbox: 'deleted-mailbox-id-002' }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'mailboxDeleted');
  t.is(msg.data.path, 'Old Folder');
  t.is(msg.data.mailbox, 'deleted-mailbox-id-002');

  ws.close();
});

test('receives mailboxRenamed notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'mailboxRenamed', {
    data: {
      oldPath: 'Old Name',
      newPath: 'New Name',
      mailbox: 'renamed-mailbox-id-003'
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'mailboxRenamed');
  t.is(msg.data.oldPath, 'Old Name');
  t.is(msg.data.newPath, 'New Name');
  t.is(msg.data.mailbox, 'renamed-mailbox-id-003');

  ws.close();
});

// ─── CalDAV Event Tests with Enriched Payloads ─────────────────────────────

test('receives calendarCreated with full calendar object', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'calendarCreated', {
    data: {
      calendar: {
        id: 'cal-001',
        calendarId: 'work-calendar',
        name: 'Work',
        description: 'Work events',
        color: '#FF5733',
        order: 0,
        object: 'calendar'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'calendarCreated');
  t.is(msg.data.calendar.id, 'cal-001');
  t.is(msg.data.calendar.calendarId, 'work-calendar');
  t.is(msg.data.calendar.name, 'Work');
  t.is(msg.data.calendar.description, 'Work events');
  t.is(msg.data.calendar.color, '#FF5733');
  t.is(msg.data.calendar.object, 'calendar');

  ws.close();
});

test('receives calendarUpdated with full calendar object', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'calendarUpdated', {
    data: {
      calendar: {
        id: 'cal-001',
        calendarId: 'work-calendar',
        name: 'Work (Updated)',
        object: 'calendar'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'calendarUpdated');
  t.is(msg.data.calendar.name, 'Work (Updated)');
  t.is(msg.data.calendar.object, 'calendar');

  ws.close();
});

test('receives calendarDeleted notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'calendarDeleted', {
    data: {
      calendar: {
        id: 'cal-001',
        calendarId: 'old-calendar',
        name: 'Old Calendar',
        object: 'calendar'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'calendarDeleted');
  t.is(msg.data.calendar.calendarId, 'old-calendar');
  t.is(msg.data.calendar.object, 'calendar');

  ws.close();
});

test('receives calendarEventCreated with full event object and ical', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  const ical =
    'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nSUMMARY:Team Meeting\r\nDTSTART:20260301T100000Z\r\nEND:VEVENT\r\nEND:VCALENDAR';

  publishNotification(client, alias.id, 'calendarEventCreated', {
    data: {
      calendarEvent: {
        id: 'evt-001',
        eventId: 'meeting-123.ics',
        calendarId: 'work-calendar',
        ical,
        href: '/dav/user@example.com/work-calendar/meeting-123.ics',
        object: 'calendar_event'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'calendarEventCreated');
  t.is(msg.data.calendarEvent.id, 'evt-001');
  t.is(msg.data.calendarEvent.eventId, 'meeting-123.ics');
  t.is(msg.data.calendarEvent.calendarId, 'work-calendar');
  t.is(msg.data.calendarEvent.object, 'calendar_event');
  // Verify ical data is present and parseable
  t.truthy(msg.data.calendarEvent.ical);
  t.true(msg.data.calendarEvent.ical.includes('BEGIN:VCALENDAR'));
  t.true(msg.data.calendarEvent.ical.includes('SUMMARY:Team Meeting'));

  ws.close();
});

test('receives calendarEventUpdated with full event object and ical', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  const ical =
    'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nSUMMARY:Team Meeting (Updated)\r\nEND:VEVENT\r\nEND:VCALENDAR';

  publishNotification(client, alias.id, 'calendarEventUpdated', {
    data: {
      calendarEvent: {
        id: 'evt-001',
        eventId: 'meeting-123.ics',
        calendarId: 'work-calendar',
        ical,
        object: 'calendar_event'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'calendarEventUpdated');
  t.is(msg.data.calendarEvent.eventId, 'meeting-123.ics');
  t.true(msg.data.calendarEvent.ical.includes('Updated'));

  ws.close();
});

test('receives calendarEventDeleted notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'calendarEventDeleted', {
    data: {
      calendarEvent: {
        id: 'evt-001',
        eventId: 'cancelled-event.ics',
        calendarId: 'default',
        object: 'calendar_event'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'calendarEventDeleted');
  t.is(msg.data.calendarEvent.eventId, 'cancelled-event.ics');
  t.is(msg.data.calendarEvent.object, 'calendar_event');

  ws.close();
});

// ─── CardDAV Event Tests with Enriched Payloads ────────────────────────────

test('receives contactCreated with full contact object and vCard', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  const vcard =
    'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nEMAIL:john@example.com\r\nTEL:+1234567890\r\nEND:VCARD';

  publishNotification(client, alias.id, 'contactCreated', {
    data: {
      contact: {
        id: 'contact-001',
        contactId: 'john-doe.vcf',
        addressBookId: 'ab-001',
        fullName: 'John Doe',
        content: vcard,
        etag: '"abc123"',
        object: 'contact'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'contactCreated');
  t.is(msg.data.contact.id, 'contact-001');
  t.is(msg.data.contact.contactId, 'john-doe.vcf');
  t.is(msg.data.contact.addressBookId, 'ab-001');
  t.is(msg.data.contact.fullName, 'John Doe');
  t.is(msg.data.contact.object, 'contact');
  // Verify vCard content is present and parseable
  t.truthy(msg.data.contact.content);
  t.true(msg.data.contact.content.includes('BEGIN:VCARD'));
  t.true(msg.data.contact.content.includes('FN:John Doe'));
  t.true(msg.data.contact.content.includes('EMAIL:john@example.com'));

  ws.close();
});

test('receives contactUpdated with full contact object and vCard', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  const vcard =
    'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe (Updated)\r\nEMAIL:john.new@example.com\r\nEND:VCARD';

  publishNotification(client, alias.id, 'contactUpdated', {
    data: {
      contact: {
        id: 'contact-001',
        contactId: 'john-doe.vcf',
        addressBookId: 'ab-001',
        fullName: 'John Doe (Updated)',
        content: vcard,
        etag: '"def456"',
        object: 'contact'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'contactUpdated');
  t.is(msg.data.contact.fullName, 'John Doe (Updated)');
  t.true(msg.data.contact.content.includes('john.new@example.com'));

  ws.close();
});

test('receives contactDeleted notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'contactDeleted', {
    data: {
      contact: {
        id: 'contact-001',
        contactId: 'removed-contact.vcf',
        addressBookId: 'ab-001',
        fullName: 'Removed Person',
        object: 'contact'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'contactDeleted');
  t.is(msg.data.contact.contactId, 'removed-contact.vcf');
  t.is(msg.data.contact.fullName, 'Removed Person');
  t.is(msg.data.contact.object, 'contact');

  ws.close();
});

test('receives addressBookCreated notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'addressBookCreated', {
    data: {
      addressBook: {
        addressBookId: 'work-contacts',
        name: 'Work Contacts',
        object: 'address_book'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'addressBookCreated');
  t.is(msg.data.addressBook.addressBookId, 'work-contacts');
  t.is(msg.data.addressBook.name, 'Work Contacts');
  t.is(msg.data.addressBook.object, 'address_book');

  ws.close();
});

test('receives addressBookDeleted notification', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'addressBookDeleted', {
    data: {
      addressBook: {
        id: 'ab-001',
        addressBookId: 'old-contacts',
        name: 'Old Contacts',
        object: 'address_book'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'addressBookDeleted');
  t.is(msg.data.addressBook.addressBookId, 'old-contacts');
  t.is(msg.data.addressBook.object, 'address_book');

  ws.close();
});

// ─── Multi-Device Sync Tests ────────────────────────────────────────────────

test('multiple WebSocket clients for same alias all receive notifications', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';
  const headers = {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  };

  const ws1 = await connectWebSocket(wsURL, headers);
  const ws2 = await connectWebSocket(wsURL, headers);

  await waitForMessage(ws1);
  await waitForMessage(ws2);

  publishNotification(client, alias.id, 'flagsUpdated', {
    data: {
      mailbox: 'inbox-id',
      uids: [1],
      flags: { add: ['\\Seen'] }
    }
  });

  const msg1 = await waitForMessage(ws1);
  const msg2 = await waitForMessage(ws2);

  t.is(msg1.event, 'flagsUpdated');
  t.is(msg2.event, 'flagsUpdated');
  t.deepEqual(msg1.data.flags, { add: ['\\Seen'] });
  t.deepEqual(msg2.data.flags, { add: ['\\Seen'] });

  ws1.close();
  ws2.close();
});

test('rapid sequential events are all delivered in order', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  const events = [
    {
      event: 'newMessage',
      data: {
        mailbox: 'INBOX',
        message: { uid: 1, from: 'test@example.com', object: 'message' }
      }
    },
    {
      event: 'flagsUpdated',
      data: { mailbox: 'inbox-id', uids: [1], flags: { add: ['\\Seen'] } }
    },
    {
      event: 'messagesMoved',
      data: {
        sourceMailbox: 'inbox-id',
        destinationMailbox: 'archive-id',
        sourceUid: [1],
        destinationUid: [10]
      }
    },
    {
      event: 'calendarEventCreated',
      data: {
        calendarEvent: {
          eventId: 'event.ics',
          ical: 'BEGIN:VCALENDAR\r\nEND:VCALENDAR',
          object: 'calendar_event'
        }
      }
    },
    {
      event: 'contactCreated',
      data: {
        contact: {
          contactId: 'new.vcf',
          content: 'BEGIN:VCARD\r\nEND:VCARD',
          object: 'contact'
        }
      }
    }
  ];

  for (const ev of events) {
    const { event, ...rest } = ev;
    publishNotification(client, alias.id, event, rest);
  }

  for (const expected of events) {
    const msg = await waitForMessage(ws);
    t.is(msg.event, expected.event);
  }

  ws.close();
});

// ─── msgpackr E2E with Enriched Payloads ────────────────────────────────────

test('msgpackr mode delivers full message metadata (no eml)', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws?msgpackr=true';

  const ws = await connectWebSocket(
    wsURL,
    {
      Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
    },
    true
  );

  await waitForMessage(ws); // consume connected

  publishNotification(client, alias.id, 'newMessage', {
    data: {
      mailbox: 'INBOX',
      message: {
        id: 'msg-mp-001',
        uid: 77,
        modseq: 200,
        flags: ['\\Recent'],
        from: 'alice@example.com',
        subject: 'msgpackr Test',
        size: 120,
        is_unread: true,
        is_encrypted: false,
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.uid, 77);
  t.is(msg.data.message.from, 'alice@example.com');
  t.is(msg.data.message.subject, 'msgpackr Test');
  t.deepEqual(msg.data.message.flags, ['\\Recent']);
  t.is(msg.data.message.eml, undefined);
  t.is(msg.data.message.is_encrypted, false);
  t.is(msg.data.message.object, 'message');

  ws.close();
});

test('msgpackr mode delivers full contact payload with vCard', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws?msgpackr=true';

  const ws = await connectWebSocket(
    wsURL,
    {
      Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
    },
    true
  );

  await waitForMessage(ws); // consume connected

  const vcard =
    'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Alice Smith\r\nEMAIL:alice@example.com\r\nORG:Acme Inc\r\nEND:VCARD';

  publishNotification(client, alias.id, 'contactCreated', {
    data: {
      contact: {
        id: 'ct-mp-001',
        contactId: 'alice.vcf',
        addressBookId: 'ab-001',
        fullName: 'Alice Smith',
        content: vcard,
        etag: '"mp-etag"',
        object: 'contact'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'contactCreated');
  t.is(msg.data.contact.fullName, 'Alice Smith');
  t.is(msg.data.contact.content, vcard);
  t.true(msg.data.contact.content.includes('ORG:Acme Inc'));
  t.is(msg.data.contact.object, 'contact');

  ws.close();
});

test('msgpackr mode delivers full calendar event payload with ical', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws?msgpackr=true';

  const ws = await connectWebSocket(
    wsURL,
    {
      Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
    },
    true
  );

  await waitForMessage(ws); // consume connected

  const ical =
    'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Test//Test//EN\r\nBEGIN:VEVENT\r\nSUMMARY:Lunch\r\nDTSTART:20260301T120000Z\r\nDTEND:20260301T130000Z\r\nEND:VEVENT\r\nEND:VCALENDAR';

  publishNotification(client, alias.id, 'calendarEventCreated', {
    data: {
      calendarEvent: {
        id: 'evt-mp-001',
        eventId: 'lunch.ics',
        calendarId: 'personal',
        ical,
        href: '/dav/user@example.com/personal/lunch.ics',
        object: 'calendar_event'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'calendarEventCreated');
  t.is(msg.data.calendarEvent.eventId, 'lunch.ics');
  t.is(msg.data.calendarEvent.ical, ical);
  t.true(msg.data.calendarEvent.ical.includes('SUMMARY:Lunch'));
  t.is(msg.data.calendarEvent.object, 'calendar_event');

  ws.close();
});

// ─── sendNotification Helper Tests ─────────────────────────────────

test('sendNotification publishes msgpackr to Redis', async (t) => {
  const { client } = t.context;
  const subscriber = client.duplicate();
  await subscriber.subscribe(config.WS_REDIS_CHANNEL_NAME);

  const messagePromise = new Promise((resolve) => {
    subscriber.on('messageBuffer', (channel, message) => {
      if (channel.toString() === config.WS_REDIS_CHANNEL_NAME) {
        resolve(decoder.unpack(message));
      }
    });
  });

  sendNotification(client, 'test-alias-id', 'newMessage', {
    notificationId: 'caller-controlled-id',
    data: {
      mailbox: 'INBOX',
      message: {
        uid: 7,
        from: 'test@example.com',
        subject: 'Test',
        object: 'message'
      }
    }
  });

  const received = await messagePromise;
  t.is(received.aliasId, 'test-alias-id');
  t.is(received.payload.event, 'newMessage');
  t.is(received.payload.data.message.uid, 7);
  t.is(received.payload.data.message.from, 'test@example.com');
  t.truthy(received.payload.timestamp);
  t.regex(
    received.payload.notificationId,
    /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i
  );
  t.not(received.payload.notificationId, 'caller-controlled-id');

  await subscriber.unsubscribe(config.WS_REDIS_CHANNEL_NAME);
  subscriber.disconnect();
});

test('sendNotification gracefully handles missing client', (t) => {
  t.notThrows(() => {
    sendNotification(null, 'alias-id', 'newMessage', {});
    sendNotification(undefined, 'alias-id', 'newMessage', {});
  });
});

test('sendNotification gracefully handles missing aliasId', (t) => {
  const { client } = t.context;
  t.notThrows(() => {
    sendNotification(client, null, 'newMessage', {});
    sendNotification(client, '', 'newMessage', {});
  });
});

// ─── Backpressure Tests ──────────────────────────────────────────────────────

test('terminates slow consumer when bufferedAmount exceeds limit', async (t) => {
  const { apiURL, wsHandler } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });
  t.context._openWebSockets.push(ws);

  const connMsg = await waitForMessage(ws);
  t.is(connMsg.event, 'connected');

  // Find the server-side ws for this client and stub bufferedAmount
  let serverWs;
  for (const client of wsHandler.wss.clients) {
    if (client.aliasId === alias.id) {
      serverWs = client;
      break;
    }
  }

  t.truthy(serverWs);

  // Stub bufferedAmount to exceed limit (> 1 MB)
  Object.defineProperty(serverWs, 'bufferedAmount', {
    get: () => 2 * 1024 * 1024
  });

  // _send should terminate the connection due to backpressure
  wsHandler._send(serverWs, { event: 'test' });

  // Wait for the close event on the client side
  await new Promise((resolve) => {
    ws.on('close', resolve);
    setTimeout(resolve, 2000);
  });

  t.not(ws.readyState, WebSocket.OPEN);
});

// ─── Redis Rate Limit Tests ─────────────────────────────────────────────────

test('rejects connection when Redis rate limit exceeded', async (t) => {
  const { apiURL, client } = t.context;

  // Pre-seed the Redis rate limit counter above the limit (30)
  const key = `ws_rate:${config.env}:127.0.0.1`;
  await client.set(key, '999');
  await client.pexpire(key, 60_000);

  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  await t.throwsAsync(() => connectWebSocket(wsURL, {}), {
    message: /Unexpected server response: 429/
  });

  // Clean up
  await client.del(key);
});

// ─── Payload Truncation Tests ───────────────────────────────────────────────

test('truncates oversized payload fields (content, ical)', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });
  t.context._openWebSockets.push(ws);

  await waitForMessage(ws); // consume connected

  // Create a 2 MB content string to exceed the 1 MB limit
  const largeContent = 'X'.repeat(2 * 1024 * 1024);

  sendNotification(client, alias.id, 'contactCreated', {
    data: {
      addressBook: 'contacts',
      contact: {
        id: 'contact-1',
        content: largeContent,
        object: 'contact'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'contactCreated');
  // content should be truncated
  t.deepEqual(msg.data.contact.content, { truncated: true });

  ws.close();
});

// ─── Auth Timeout Tests ─────────────────────────────────────────────────────

test('returns 504 when authentication times out', async (t) => {
  const { apiURL, wsHandler } = t.context;
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  // Monkey-patch _authenticate to never resolve
  const originalAuth = wsHandler._authenticate.bind(wsHandler);
  wsHandler._authenticate = () => new Promise(() => {});

  // Use a longer client-side timeout (30s) so the server's 10s auth
  // timeout fires first and returns the 504 before the client gives up.
  await t.throwsAsync(
    () =>
      connectWebSocket(
        wsURL,
        { Authorization: createApiTokenAuth('some-token') },
        false,
        ms('30s')
      ),
    { message: /Unexpected server response: 504/ }
  );

  // Restore original
  wsHandler._authenticate = originalAuth;
});

test('VALID_EVENTS contains all expected event types', (t) => {
  const expectedEvents = [
    // IMAP
    'newMessage',
    'messagesMoved',
    'messagesCopied',
    'flagsUpdated',
    'labelsUpdated',
    'messagesExpunged',
    'mailboxCreated',
    'mailboxDeleted',
    'mailboxRenamed',
    // CalDAV
    'calendarCreated',
    'calendarUpdated',
    'calendarDeleted',
    'calendarEventCreated',
    'calendarEventUpdated',
    'calendarEventDeleted',
    // CardDAV
    'contactCreated',
    'contactUpdated',
    'contactDeleted',
    'addressBookCreated',
    'addressBookDeleted',
    // Broadcast
    'newRelease'
  ];

  for (const event of expectedEvents) {
    t.true(VALID_EVENTS.has(event), `Missing event: ${event}`);
  }

  t.is(VALID_EVENTS.size, expectedEvents.length);
});
