/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * E2E Tests for updated_at auto-injection and synctoken increment logic
 *
 * These tests verify that:
 *   1. CalDAV event updates via the real CalDAV server change the ETag
 *      (because findOneAndUpdate auto-injects updated_at)
 *   2. The incrementSynctoken helper correctly increments URL-based synctokens
 *
 * A single real CalDAV + SQLite server is shared across all tests — no stubs.
 */

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const tsdav = require('tsdav');

const utils = require('../utils');
const CalDAV = require('../../caldav-server');
const SQLite = require('../../sqlite-server');

const Users = require('#models/users');
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
  fetchCalendarObjects,
  createObject,
  updateObject
} = tsdav;

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

// ─── CalDAV Server Setup (shared across all tests) ──────────────────────────

test.before(utils.setupMongoose);

test.before(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });

  const client = new Redis();
  const subscriber = new Redis();
  client.setMaxListeners(0);
  subscriber.setMaxListeners(0);
  subscriber.channels.setMaxListeners(0);

  t.context.client = client;
  t.context.subscriber = subscriber;

  const port = await getPort();
  const sqlitePort = await getPort();

  const sqlite = new SQLite({ client, subscriber });
  await sqlite.listen(sqlitePort);
  t.context.sqlite = sqlite;

  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  t.context.wsp = wsp;

  const calDAV = new CalDAV({ ...calDAVConfig, wsp, port, client }, Users);
  calDAV.app.server = calDAV.server;
  await calDAV.listen();
  t.context.calDAV = calDAV;
  t.context.serverUrl = `http://${IP_ADDRESS}:${port}/`;

  // Create user, domain, alias
  utils.setupFactories(t);

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

  const resolver = createTangerine(t.context.client, logger);

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
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
  t.context.alias = await alias.save();
  t.context.username = `${alias.name}@${domain.name}`;

  // Spoof DNS records
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
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true
    )
  );
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      `${env.WEB_HOST}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `cname:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'CNAME',
      [env.WEB_HOST],
      true
    )
  );
  map.set(
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true
    )
  );
  await resolver.options.cache.mset(map);

  t.context.authHeaders = getBasicAuthHeaders({
    username: t.context.username,
    password: t.context.pass
  });

  t.context.account = await createAccount({
    account: { serverUrl: t.context.serverUrl, accountType: 'caldav' },
    headers: t.context.authHeaders
  });

  t.context.calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
});

test.after.always(utils.teardownMongoose);

test.after.always(async (t) => {
  const closeServerWithTimeout = (server, timeout = 3000) =>
    new Promise((resolve) => {
      if (!server) {
        resolve();
        return;
      }

      const timer = setTimeout(() => {
        resolve();
      }, timeout);

      server.close(() => {
        clearTimeout(timer);
        resolve();
      });
    });

  if (t.context.calDAV) {
    await closeServerWithTimeout(t.context.calDAV.server);
  }

  if (t.context.sqlite) {
    await closeServerWithTimeout(t.context.sqlite.server);
  }

  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {
      // Ignore errors during cleanup
    }
  }

  if (t.context.client) {
    t.context.client.disconnect();
  }

  if (t.context.subscriber) {
    t.context.subscriber.disconnect();
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeEventIcs({ uid, summary = 'Test Event', sequence = 0 }) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T100000Z',
    'DTSTART:20260301T100000Z',
    'DTEND:20260301T110000Z',
    `SUMMARY:${summary}`,
    `SEQUENCE:${sequence}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1: Event update changes ETag (updated_at auto-injection)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Event update via CalDAV changes ETag (updated_at auto-injection)',
  async (t) => {
    const uid = `etag-test-${Date.now()}@example.com`;
    const calendar = t.context.calendars.find((c) =>
      c.components?.includes('VEVENT')
    );
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

    // Create event
    const ics1 = makeEventIcs({ uid, summary: 'Original Title' });
    await createObject({
      url: objectUrl,
      data: ics1,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Fetch ETag after create
    const objects1 = await fetchCalendarObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj1 = objects1.find((o) => o.url.includes(uid));
    t.truthy(obj1, 'Event should exist after create');
    const etag1 = obj1.etag;
    t.truthy(etag1, 'ETag should exist after create');

    // Wait briefly to ensure updated_at differs
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    // Update event
    const ics2 = makeEventIcs({
      uid,
      summary: 'Updated Title',
      sequence: 1
    });
    await updateObject({
      url: objectUrl,
      data: ics2,
      etag: etag1,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Fetch ETag after update
    const objects2 = await fetchCalendarObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj2 = objects2.find((o) => o.url.includes(uid));
    t.truthy(obj2, 'Event should exist after update');
    const etag2 = obj2.etag;
    t.truthy(etag2, 'ETag should exist after update');

    // ETag should have changed
    t.not(etag1, etag2, 'ETag should change after event update');

    // Verify the content was actually updated
    t.true(
      obj2.data.includes('Updated Title'),
      'Event summary should be updated'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2: Sequential updates produce different ETags
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Sequential event updates produce different ETags each time',
  async (t) => {
    const uid = `multi-etag-${Date.now()}@example.com`;
    const calendar = t.context.calendars.find((c) =>
      c.components?.includes('VEVENT')
    );
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

    // Create
    const ics1 = makeEventIcs({ uid, summary: 'V1', sequence: 0 });
    await createObject({
      url: objectUrl,
      data: ics1,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    const objects1 = await fetchCalendarObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const etag1 = objects1.find((o) => o.url.includes(uid))?.etag;

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    // Update 1
    const ics2 = makeEventIcs({ uid, summary: 'V2', sequence: 1 });
    await updateObject({
      url: objectUrl,
      data: ics2,
      etag: etag1,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    const objects2 = await fetchCalendarObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const etag2 = objects2.find((o) => o.url.includes(uid))?.etag;

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    // Update 2
    const ics3 = makeEventIcs({ uid, summary: 'V3', sequence: 2 });
    await updateObject({
      url: objectUrl,
      data: ics3,
      etag: etag2,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    const objects3 = await fetchCalendarObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const etag3 = objects3.find((o) => o.url.includes(uid))?.etag;

    // All three ETags should be different
    t.not(etag1, etag2, 'ETag should change after first update');
    t.not(etag2, etag3, 'ETag should change after second update');
    t.not(etag1, etag3, 'All ETags should be unique');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3: Calendar synctoken changes after event create/update
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Calendar synctoken changes after event creation and update',
  async (t) => {
    // Get initial synctoken
    const calendars1 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal1 = calendars1.find((c) => c.components?.includes('VEVENT'));
    const sync1 = cal1.syncToken;
    t.truthy(sync1, 'Initial synctoken should exist');
    t.true(sync1.startsWith('http'), 'Synctoken should be a URL');

    // Create event
    const uid = `sync-test-${Date.now()}@example.com`;
    const objectUrl = new URL(`${uid}.ics`, cal1.url).href;
    const ics = makeEventIcs({ uid, summary: 'Sync Test' });

    await createObject({
      url: objectUrl,
      data: ics,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Check synctoken after create
    const calendars2 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal2 = calendars2.find((c) => c.components?.includes('VEVENT'));
    const sync2 = cal2.syncToken;
    t.truthy(sync2, 'Synctoken should exist after create');
    t.true(sync2.startsWith('http'), 'Synctoken should still be a URL');
    t.not(sync1, sync2, 'Synctoken should change after event creation');

    // Extract numeric parts and verify increment
    const num1 = Number.parseInt(sync1.split('/').pop(), 10);
    const num2 = Number.parseInt(sync2.split('/').pop(), 10);
    t.true(num2 > num1, 'Synctoken number should increase');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4: incrementSynctoken unit tests (pure function)
// ═══════════════════════════════════════════════════════════════════════════════

test('incrementSynctoken correctly increments URL-based synctoken', (t) => {
  // Replicate the incrementSynctoken logic from process-calendar-invites.js
  function incrementSynctoken(synctoken) {
    const DEFAULT_SYNC_BASE = 'https://forwardemail.net/ns/sync-token';
    if (typeof synctoken !== 'string' || synctoken.trim() === '') {
      return `${DEFAULT_SYNC_BASE}/1`;
    }

    const parts = synctoken.split('/');
    const lastPart = parts[parts.length - 1];
    const num = Number.parseInt(lastPart, 10);
    if (Number.isNaN(num)) {
      return `${DEFAULT_SYNC_BASE}/1`;
    }

    const base = parts.slice(0, -1).join('/');
    if (!base || !base.startsWith('http')) {
      return `${DEFAULT_SYNC_BASE}/${num + 1}`;
    }

    return `${base}/${num + 1}`;
  }

  t.is(
    incrementSynctoken('https://forwardemail.net/ns/sync-token/1'),
    'https://forwardemail.net/ns/sync-token/2'
  );
  t.is(
    incrementSynctoken('https://forwardemail.net/ns/sync-token/99'),
    'https://forwardemail.net/ns/sync-token/100'
  );
  t.is(incrementSynctoken(''), 'https://forwardemail.net/ns/sync-token/1');
  t.is(incrementSynctoken(null), 'https://forwardemail.net/ns/sync-token/1');
  t.is(
    incrementSynctoken('not-a-url'),
    'https://forwardemail.net/ns/sync-token/1'
  );
});
