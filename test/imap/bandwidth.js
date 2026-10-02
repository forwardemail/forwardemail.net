/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// IMAP downloads and uploads count toward the account's bandwidth limit, and
// FETCH and APPEND are refused (NO [LIMIT]) once it is used up.
//

const { Buffer } = require('node:buffer');
const Axe = require('axe');
const dayjs = require('dayjs-with-plugins');
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
const { DAILY_LIMIT } = require('#helpers/bandwidth-limiter');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const logger = new Axe({ silent: true });
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

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
  t.context.server = await imap.listen(port);
  t.context.imap = imap;

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
  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port,
    secure: false,
    logger,
    tls,
    auth: { user: `${alias.name}@${domain.name}`, pass }
  });
  imapFlow.on('error', () => {});
  await imapFlow.connect();
  t.context.imapFlow = imapFlow;

  const day = new Date().toISOString().split('T')[0];
  t.context.dailyKey = `bw_${config.env}:all:d:${day}:${user.id}`;
});

test.afterEach.always(async (t) => {
  try {
    await t.context.imapFlow?.logout();
  } catch {}

  for (const it of [t.context.imap, t.context.wsp, t.context.sqlite]) {
    try {
      await it?.close();
    } catch {}
  }
});

// (the response code of a tagged NO, e.g. "NO [LIMIT]")
const responseCode = (err) =>
  err?.response?.attributes?.[0]?.section?.[0]?.value;

const raw = 'Subject: Bandwidth\r\nFrom: a@example.com\r\n\r\nHello\r\n';

test('FETCH is counted and refused at the limit', async (t) => {
  const { imapFlow, client, dailyKey } = t.context;
  await imapFlow.append('INBOX', raw);
  await imapFlow.mailboxOpen('INBOX');

  const message = await imapFlow.fetchOne('1', { source: true });
  t.true(message.source.toString().includes('Subject: Bandwidth'));
  await pWaitFor(async () => Number(await client.get(dailyKey)) > 0, {
    timeout: ms('5s')
  });

  await client.set(dailyKey, DAILY_LIMIT);
  const err = await t.throwsAsync(
    imapFlow.exec('FETCH', [
      { type: 'SEQUENCE', value: '1' },
      { type: 'ATOM', value: 'FLAGS' }
    ])
  );
  t.is(err.responseStatus, 'NO');
  t.is(responseCode(err), 'LIMIT');
});

test('APPEND is counted and refused at the limit', async (t) => {
  const { imapFlow, client, dailyKey } = t.context;
  await imapFlow.append('INBOX', raw);
  t.is(Number(await client.get(dailyKey)), raw.length);

  await client.set(dailyKey, DAILY_LIMIT);
  const err = await t.throwsAsync(
    imapFlow.exec('APPEND', [
      { type: 'ATOM', value: 'INBOX' },
      { type: 'LITERAL', value: Buffer.from(raw) }
    ])
  );
  t.is(responseCode(err), 'LIMIT');
});
