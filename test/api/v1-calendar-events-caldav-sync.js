/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Regression test: events created via the v1 REST API must be visible to a
 * subsequent CalDAV sync (REPORT / PROPFIND / GET) issued by clients such as
 * the iOS Calendar app.  The two write paths (REST API and CalDAV PUT) target
 * the same per-alias SQLite database via the same `wsp` socket; this test
 * pins that contract so future refactors cannot regress it silently.
 *
 * The reported symptom was: events created via the website / REST API never
 * showed up in iOS Calendar even after pull-to-refresh.  The expected fix is
 * a no-op for clients already working correctly, but this regression test
 * proves end-to-end visibility for the next iOS-shaped client.
 */

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const request = require('supertest');
const test = require('ava');
const tsdav = require('tsdav');
const { listen } = require('async-listen');

const utils = require('../utils');
const API = require('../../api-server');
const CalDAV = require('../../caldav-server');
const SQLite = require('../../sqlite-server');
const ApiWebSocketHandler = require('#helpers/api-websocket-handler');
const Users = require('#models/users');
const apiConfig = require('#config/api');
const calDAVConfig = require('#config/caldav');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');

const {
  getBasicAuthHeaders,
  createAccount,
  fetchCalendars,
  fetchCalendarObjects
} = tsdav;

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

function createAliasAuth(username, pass) {
  return `Basic ${Buffer.from(`${username}:${pass}`).toString('base64')}`;
}

function buildIcs({ uid, summary, organizer }) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//API->CalDAV Sync Test//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T100000Z',
    'DTSTART:20260601T100000Z',
    'DTEND:20260601T110000Z',
    `SUMMARY:${summary}`,
    'SEQUENCE:0',
    `ORGANIZER:mailto:${organizer}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

test.before(utils.setupMongoose);

test.before(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });

  // Shared infra: redis, sqlite-server (via wsp), api-server, caldav-server.
  const keyPrefix = randomUUID();
  const client = new Redis({ keyPrefix });
  const subscriber = new Redis({ keyPrefix });
  client.setMaxListeners(0);
  subscriber.setMaxListeners(0);
  subscriber.channels.setMaxListeners(0);
  t.context.client = client;
  t.context.subscriber = subscriber;

  const sqlitePort = await getPort();
  const sqlite = new SQLite({ client, subscriber });
  await sqlite.listen(sqlitePort);
  t.context.sqlite = sqlite;

  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  t.context.wsp = wsp;

  // API server (HTTP)
  const api = new API(
    {
      ...apiConfig,
      client,
      wsp,
      resolver: sqlite.resolver
    },
    Users
  );
  const apiPort = await getPort();
  t.context.apiURL = await listen(api.server, {
    host: '127.0.0.1',
    port: apiPort
  });
  t.context.apiURL = t.context.apiURL.toString().slice(0, -1);
  t.context.api = request.agent(api.server);
  t.context._api = api;
  t.context.wsHandler = new ApiWebSocketHandler({ server: api.server, client });

  // CalDAV server (HTTP)
  const calDAVPort = await getPort();
  const calDAV = new CalDAV(
    { ...calDAVConfig, wsp, port: calDAVPort, client },
    Users
  );
  calDAV.app.server = calDAV.server;
  await calDAV.listen();
  t.context.calDAV = calDAV;
  t.context.calDAVURL = `http://${IP_ADDRESS}:${calDAVPort}/`;

  // Alias setup (paid plan + DKIM/SPF spoof so create flows succeed).
  utils.setupFactories(t);
  t.context.resolver = sqlite.resolver;

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
  t.context.user = user;

  const resolver = createTangerine(client, logger);
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true,
      ignore_mx_check: true
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
  await alias.save();
  t.context.alias = alias;
  t.context.pass = pass;
  t.context.username = `${alias.name}@${domain.name}`;

  // DNS spoofing so paid-plan checks succeed
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      env.WEB_HOST,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  await resolver.options.cache.mset(map);
  await t.context.resolver.options.cache.mset(map);
});

test.after.always(utils.teardownMongoose);
test.after.always(async (t) => {
  const closeServerWithTimeout = (server, timeout = 3000) =>
    new Promise((resolve) => {
      if (!server) {
        resolve();
        return;
      }

      const timer = setTimeout(resolve, timeout);
      server.close(() => {
        clearTimeout(timer);
        resolve();
      });
    });

  if (t.context.calDAV) await closeServerWithTimeout(t.context.calDAV.server);
  if (t.context._api) await closeServerWithTimeout(t.context._api.server);
  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {}
  }

  if (t.context.sqlite) {
    try {
      await t.context.sqlite.close();
    } catch {}
  }

  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

test.serial(
  'event created via v1 API is returned by CalDAV fetchCalendarObjects (iOS read path)',
  async (t) => {
    const { api, username, pass } = t.context;
    const auth = createAliasAuth(username, pass);

    // 1) Create a calendar via the API
    const calendarRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Test Calendar', description: 'API->CalDAV sync test' });
    t.is(calendarRes.status, 200);
    const calendarId = calendarRes.body.id;

    // 2) Create the event via the API
    const uid = `api-caldav-sync-${Date.now()}@example.com`;
    const ical = buildIcs({
      uid,
      summary: 'API->CalDAV Sync Regression',
      organizer: username
    });
    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, event_id: uid, ical });
    t.is(createRes.status, 200);
    t.is(createRes.body.object, 'calendar_event');

    // 3) Discover and fetch via CalDAV (the same path iOS uses)
    const headers = getBasicAuthHeaders({ username, password: pass });
    const account = await createAccount({
      account: { serverUrl: t.context.calDAVURL, accountType: 'caldav' },
      headers
    });
    const calendars = await fetchCalendars({ account, headers });
    // find the calendar we just created (by displayname or by calendarId path)
    const cal = calendars.find(
      (c) =>
        c.url.includes(calendarId) ||
        c.displayName === 'Test Calendar' ||
        c.components?.includes('VEVENT')
    );
    t.truthy(cal, 'CalDAV must list the API-created calendar');

    const objects = await fetchCalendarObjects({ calendar: cal, headers });
    const found = objects.find(
      (o) => (o.url && o.url.includes(uid)) || (o.data && o.data.includes(uid))
    );

    t.truthy(
      found,
      'CalDAV fetchCalendarObjects MUST return the event created via the v1 API'
    );
    if (found) {
      t.true(
        found.data.includes('API->CalDAV Sync Regression'),
        'returned ICS must contain the original SUMMARY'
      );
    }
  }
);
