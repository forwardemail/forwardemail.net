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
const sendWebSocketNotification = require('#helpers/send-websocket-notification');

const { VALID_EVENTS } = sendWebSocketNotification;

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
function connectWebSocket(wsURL, headers, useMsgpackr = false) {
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
    }, ms('10s'));
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
 * sendWebSocketNotification implementation).
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
        subject: 'Binary Test',
        eml: 'From: test@example.com\r\nSubject: Binary Test\r\n\r\nBody',
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.uid, 42);
  t.is(msg.data.message.subject, 'Binary Test');
  t.truthy(msg.data.message.eml);

  ws.close();
});

// ─── IMAP Event Tests with Enriched Payloads ────────────────────────────────

test('receives newMessage with full message object and eml', async (t) => {
  const { apiURL, client } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const wsURL = apiURL.replace(/^http/, 'ws') + '/v1/ws';

  const ws = await connectWebSocket(wsURL, {
    Authorization: createAliasAuth(`${alias.name}@${domain.name}`, pass)
  });

  await waitForMessage(ws); // consume connected

  const rawEml =
    'From: sender@example.com\r\nTo: user@example.com\r\nSubject: Hello World\r\n\r\nBody text';

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
        eml: rawEml,
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.truthy(msg.timestamp);
  // Verify enriched data
  t.is(msg.data.mailbox, 'INBOX');
  t.is(msg.data.message.id, '60d5f484f1a2c8b1f8e4e1a1');
  t.is(msg.data.message.uid, 42);
  t.is(msg.data.message.modseq, 100);
  t.is(msg.data.message.subject, 'Hello World');
  t.is(msg.data.message.size, 1234);
  t.is(msg.data.message.is_unread, true);
  t.is(msg.data.message.is_encrypted, false);
  t.is(msg.data.message.object, 'message');
  t.deepEqual(msg.data.message.flags, []);
  // Verify raw eml is included
  t.is(msg.data.message.eml, rawEml);
  t.true(msg.data.message.eml.includes('Subject: Hello World'));

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
        subject: 'API Token Test',
        eml: 'From: test@example.com\r\nSubject: API Token Test\r\n\r\nBody',
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.uid, 99);
  t.is(msg.data.message.subject, 'API Token Test');
  t.truthy(msg.data.message.eml);

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
        message: { uid: 1, eml: 'raw1', object: 'message' }
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

test('msgpackr mode delivers full message payload with eml', async (t) => {
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

  const rawEml =
    'From: alice@example.com\r\nTo: bob@example.com\r\nSubject: msgpackr Test\r\nContent-Type: text/plain\r\n\r\nHello from msgpackr!';

  publishNotification(client, alias.id, 'newMessage', {
    data: {
      mailbox: 'INBOX',
      message: {
        id: 'msg-mp-001',
        uid: 77,
        modseq: 200,
        flags: ['\\Recent'],
        subject: 'msgpackr Test',
        size: rawEml.length,
        is_unread: true,
        is_encrypted: false,
        eml: rawEml,
        object: 'message'
      }
    }
  });

  const msg = await waitForMessage(ws);
  t.is(msg.event, 'newMessage');
  t.is(msg.data.message.uid, 77);
  t.is(msg.data.message.subject, 'msgpackr Test');
  t.deepEqual(msg.data.message.flags, ['\\Recent']);
  t.is(msg.data.message.eml, rawEml);
  t.true(msg.data.message.eml.includes('Hello from msgpackr!'));
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

// ─── sendWebSocketNotification Helper Tests ─────────────────────────────────

test('sendWebSocketNotification publishes msgpackr to Redis', async (t) => {
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

  sendWebSocketNotification(client, 'test-alias-id', 'newMessage', {
    data: {
      mailbox: 'INBOX',
      message: { uid: 7, eml: 'raw email', object: 'message' }
    }
  });

  const received = await messagePromise;
  t.is(received.aliasId, 'test-alias-id');
  t.is(received.payload.event, 'newMessage');
  t.is(received.payload.data.message.uid, 7);
  t.is(received.payload.data.message.eml, 'raw email');
  t.truthy(received.payload.timestamp);

  await subscriber.unsubscribe(config.WS_REDIS_CHANNEL_NAME);
  subscriber.disconnect();
});

test('sendWebSocketNotification gracefully handles missing client', (t) => {
  t.notThrows(() => {
    sendWebSocketNotification(null, 'alias-id', 'newMessage', {});
    sendWebSocketNotification(undefined, 'alias-id', 'newMessage', {});
  });
});

test('sendWebSocketNotification gracefully handles missing aliasId', (t) => {
  const { client } = t.context;
  t.notThrows(() => {
    sendWebSocketNotification(client, null, 'newMessage', {});
    sendWebSocketNotification(client, '', 'newMessage', {});
  });
});

test('VALID_EVENTS contains all expected event types', (t) => {
  const expectedEvents = [
    // IMAP
    'newMessage',
    'messagesMoved',
    'messagesCopied',
    'flagsUpdated',
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
