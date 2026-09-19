/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// End-to-end behaviour of a large FETCH through the real IMAP server ->
// WebSocket -> SQLite server path: the response is streamed back in batches
// (`wss.broadcast`, see sqlite-server.js and helpers/imap/on-fetch.js) and
// every batch must reach the process that owns the IMAP connection and no
// other process connected to the SQLite server.
//

const { Buffer } = require('node:buffer');

const Axe = require('axe');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const { ImapFlow } = require('imapflow');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const { encrypt } = require('#helpers/encrypt-decrypt');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const logger = new Axe({ silent: true });
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

// the flush threshold of helpers/imap/on-fetch.js
const FLUSH_BYTES = 10 * 1024 * 1024;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  t.context.port = port;
  t.context.server = await imap.listen(port);
  t.context.imap = imap;

  //
  // A bystander: another process connected to the SQLite server (an MX or
  // POP3 process, another IMAP process).  It counts every streamed batch it
  // receives and, like every process, would acknowledge it.
  //
  const bystander = createWebSocketAsPromised({ port: sqlitePort });
  t.context.bystanderBatches = 0;
  bystander.onUnpackedMessage.addListener((data) => {
    if (typeof data?.uuid !== 'string') return;
    t.context.bystanderBatches++;
    bystander.send(data.uuid);
  });
  await bystander.open();
  t.context.bystander = bystander;
  await pWaitFor(() => sqlite.wss.clients.size === 2, { timeout: ms('10s') });

  const user = await t.context.userFactory
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

  t.context.user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: imap.resolver,
      has_smtp: true
    })
    .create();
  t.context.domain = domain;

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  t.context.pass = pass;

  await wsp.request(
    {
      action: 'setup',
      session: {
        remoteAddress: IP_ADDRESS,
        user: {
          id: alias.id,
          username: `${alias.name}@${domain.name}`,
          alias_id: alias.id,
          alias_name: alias.name,
          domain_id: domain.id,
          domain_name: domain.name,
          password: encrypt(pass),
          storage_location: alias.storage_location,
          alias_has_pgp: alias.has_pgp,
          alias_public_key: alias.public_key,
          locale: 'en',
          owner_full_email: user.email
        }
      }
    },
    0
  );
  t.context.alias = await alias.save();

  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await imap.resolver.options.cache.mset(map);

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port,
    secure: false,
    logger,
    tls,
    auth: { user: `${alias.name}@${domain.name}`, pass },
    commandTimeout: 120000
  });
  await imapFlow.connect();
  t.context.imapFlow = imapFlow;
});

test.afterEach.always(async (t) => {
  try {
    await t.context.imapFlow?.logout();
  } catch {}

  try {
    await t.context.imap?.close();
  } catch {}

  try {
    t.context.bystander?.close();
  } catch {}

  try {
    await t.context.wsp?.close();
  } catch {}

  try {
    await t.context.sqlite?.close();
  } catch {}

  try {
    await t.context.server?.close();
  } catch {}
});

test('a streamed FETCH reaches the requesting process only', async (t) => {
  t.timeout(ms('5m'));
  const { imapFlow, alias, domain, sqlite } = t.context;

  // enough mail for the FETCH response to be streamed in at least one batch
  const bodySize = Math.min(
    Math.floor(bytes(env.SMTP_MESSAGE_MAX_SIZE) * 0.5),
    300 * 1024
  );
  const messageCount = Math.ceil(FLUSH_BYTES / bodySize) + 2;
  for (let i = 0; i < messageCount; i++) {
    const raw = `Date: ${new Date().toISOString()}
MIME-Version: 1.0
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
Subject: streamed-${i}
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

${String(i % 10).repeat(bodySize)}`.trim();
    await imapFlow.append('INBOX', Buffer.from(raw), [], new Date());
  }

  // count the batches the SQLite server streams for this FETCH
  let streamed = 0;
  const { broadcast } = sqlite.wss;
  sqlite.wss.broadcast = async (session, payload) => {
    streamed++;
    // the session carries the socket the request arrived on
    t.truthy(session.ws);
    t.true(sqlite.wss.clients.has(session.ws));
    return broadcast(session, payload);
  };

  await imapFlow.mailboxOpen('INBOX');
  const fetched = [];
  for await (const message of imapFlow.fetch('1:*', {
    uid: true,
    source: true
  })) {
    fetched.push(message);
  }

  t.is(fetched.length, messageCount);
  for (const [index, message] of fetched.entries())
    t.true(
      message.source.length > bodySize,
      `message ${index + 1} arrived complete`
    );

  // the response was streamed, to the requesting process alone
  t.true(streamed >= 1, `${streamed} batches streamed`);
  t.is(t.context.bystanderBatches, 0);
  t.is(sqlite.uuidsReceived.size, 0);

  // and each message can still be read on its own
  const download = await imapFlow.download('1', undefined, { uid: true });
  const content = await getStream(download.content);
  t.true(content.length > bodySize);
});
