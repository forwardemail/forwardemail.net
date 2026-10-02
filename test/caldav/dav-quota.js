/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Calendar events and contacts are stored in the alias's mailbox, so CalDAV
// and CardDAV refuse new ones once it is over quota (as IMAP and the API do)
// instead of letting it grow without limit.
//

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const tsdav = require('tsdav');
const undici = require('undici');
const utils = require('../utils');
const CalDAV = require('../../caldav-server');
const CardDAV = require('../../carddav-server');
const SQLite = require('../../sqlite-server');

const Aliases = require('#models/aliases');
const Users = require('#models/users');
const calDAVConfig = require('#config/caldav');
const cardDAVConfig = require('#config/carddav');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { DAILY_LIMIT } = require('#helpers/bandwidth-limiter');
const logger = require('#helpers/logger');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

function ics(uid) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Quota//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20250301T080000Z',
    'DTSTART:20250301T090000Z',
    'DTEND:20250301T100000Z',
    'SUMMARY:Quota',
    'END:VEVENT',
    'END:VCALENDAR',
    ''
  ].join('\r\n');
}

function vcard(uid) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `UID:${uid}`,
    'FN:Quota Test',
    'N:Test;Quota;;;',
    'EMAIL:quota@example.com',
    'END:VCARD',
    ''
  ].join('\r\n');
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const client = new Redis();
  const subscriber = new Redis();
  client.setMaxListeners(0);
  subscriber.setMaxListeners(0);
  subscriber.channels.setMaxListeners(0);
  t.context.client = client;

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const [calPort, cardPort, sqlitePort] = await Promise.all([
    getPort(),
    getPort(),
    getPort()
  ]);

  const sqlite = new SQLite({ client, subscriber });
  await sqlite.listen(sqlitePort);
  t.context.sqlite = sqlite;
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  t.context.wsp = wsp;

  const calDAV = new CalDAV(
    { ...calDAVConfig, wsp, port: calPort, client },
    Users
  );
  calDAV.app.server = calDAV.server;
  await calDAV.listen();
  t.context.calDAV = calDAV;

  const cardDAV = new CardDAV(
    { ...cardDAVConfig, wsp, port: cardPort, client },
    Users
  );
  cardDAV.app.server = cardDAV.server;
  await cardDAV.listen();
  t.context.cardDAV = cardDAV;

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
  await user.save();

  const resolver = createTangerine(client, logger);
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
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
  t.context.alias = await alias.save();

  await resolver.options.cache.mset(
    new Map([
      [
        `txt:${domain.name}`,
        resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );

  const username = `${alias.name}@${domain.name}`;
  t.context.username = username;
  t.context.authorization = `Basic ${Buffer.from(
    `${username}:${pass}`
  ).toString('base64')}`;
  t.context.calURL = `http://${IP_ADDRESS}:${calPort}`;
  t.context.cardURL = `http://${IP_ADDRESS}:${cardPort}`;

  const headers = { authorization: t.context.authorization };
  const account = await tsdav.createAccount({
    account: { serverUrl: `${t.context.calURL}/`, accountType: 'caldav' },
    headers
  });
  const [calendar] = await tsdav.fetchCalendars({ account, headers });
  t.context.calendarURL = calendar.url;
});

test.afterEach.always(async (t) => {
  for (const server of [t.context.calDAV?.server, t.context.cardDAV?.server]) {
    if (server)
      await new Promise((resolve) => {
        server.close(resolve);
      });
  }

  for (const it of [t.context.wsp, t.context.sqlite]) {
    try {
      await it?.close();
    } catch {}
  }
});

function put(t, url, body, type) {
  return undici.request(url, {
    method: 'PUT',
    headers: {
      authorization: t.context.authorization,
      'content-type': type
    },
    body
  });
}

function putEvent(t) {
  const uid = randomUUID();
  return put(
    t,
    new URL(`${uid}.ics`, t.context.calendarURL).href,
    ics(uid),
    'text/calendar; charset=utf-8'
  );
}

function putContact(t) {
  const uid = randomUUID();
  return put(
    t,
    `${t.context.cardURL}/dav/${t.context.username}/addressbooks/default/${uid}.vcf`,
    vcard(uid),
    'text/vcard; charset=utf-8'
  );
}

async function overQuota(t) {
  await Aliases.updateOne(
    { _id: t.context.alias._id },
    { $set: { storage_used: Number.MAX_SAFE_INTEGER } }
  );
}

test('CalDAV refuses new events over quota', async (t) => {
  let res = await putEvent(t);
  await res.body.dump();
  t.true(res.statusCode < 300, `status ${res.statusCode}`);

  await overQuota(t);
  res = await putEvent(t);
  await res.body.dump();
  t.is(res.statusCode, 507);
});

test('CardDAV refuses new contacts over quota', async (t) => {
  let res = await putContact(t);
  await res.body.dump();
  t.true(res.statusCode < 300, `status ${res.statusCode}`);

  await overQuota(t);
  res = await putContact(t);
  await res.body.dump();
  t.is(res.statusCode, 507);
});

test('CalDAV and CardDAV are counted and refused at the bandwidth limit', async (t) => {
  const { client, alias } = t.context;
  const day = new Date().toISOString().split('T')[0];
  const dailyKey = `bw_${config.env}:all:d:${day}:${alias.user.toString()}`;

  let res = await putEvent(t);
  await res.body.dump();
  t.true(res.statusCode < 300);
  await pWaitFor(async () => Number(await client.get(dailyKey)) > 0, {
    timeout: ms('5s')
  });

  await client.set(dailyKey, DAILY_LIMIT);
  res = await putEvent(t);
  await res.body.dump();
  t.is(res.statusCode, 429);
  res = await putContact(t);
  await res.body.dump();
  t.is(res.statusCode, 429);
});
