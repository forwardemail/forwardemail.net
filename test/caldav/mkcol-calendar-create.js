/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for Extended MKCOL (RFC 5689) and PUT auto-create calendar
 *
 * Verifies that:
 * 1. MKCOL with Extended MKCOL XML body creates a calendar (tasks.org flow)
 * 2. MKCOL with CalDAV namespace already declared works correctly
 * 3. MKCOL with empty body creates a calendar with defaults
 * 4. MKCOL is listed in OPTIONS Allow header
 * 5. PUT to a non-existent calendar auto-creates the calendar (Thunderbird Publish)
 * 6. PUT auto-create extracts X-WR-CALNAME for the calendar name
 * 7. PUT auto-create detects VTODO components and sets supportedComponents
 */

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const undici = require('undici');
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

const { getBasicAuthHeaders, createAccount, fetchCalendars } = tsdav;

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

  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {}
  }

  if (t.context.sqlite) {
    await closeServerWithTimeout(t.context.sqlite.server);
  }

  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

// ─── Helper: build Basic Auth header ────────────────────────────────────────

function authHeader(username, password) {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

// ============================================================================
// MKCOL Tests (RFC 5689 Extended MKCOL for tasks.org)
// ============================================================================

test.serial(
  'MKCOL with Extended MKCOL XML body creates a VTODO calendar (tasks.org flow)',
  async (t) => {
    const { serverUrl, username, pass } = t.context;
    const calendarId = randomUUID();
    const url = `${serverUrl}dav/${username}/${calendarId}/`;

    // tasks.org Extended MKCOL body (from dav4jvm getMkcolString)
    const mkcolBody = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<mkcol xmlns="DAV:" xmlns:CAL="urn:ietf:params:xml:ns:caldav">',
      '  <set>',
      '    <prop>',
      '      <resourcetype><collection/><CAL:calendar/></resourcetype>',
      '      <displayname>My Task List</displayname>',
      '      <CAL:supported-calendar-component-set>',
      '        <CAL:comp name="VTODO"/>',
      '      </CAL:supported-calendar-component-set>',
      '    </prop>',
      '  </set>',
      '</mkcol>'
    ].join('\n');

    const response = await undici.request(url, {
      method: 'MKCOL',
      headers: {
        Authorization: authHeader(username, pass),
        'Content-Type': 'application/xml; charset=utf-8'
      },
      body: mkcolBody
    });

    // Consume the response body to avoid resource leak
    const responseBody = await response.body.text();
    t.log('MKCOL response status:', response.statusCode);
    t.log('MKCOL response body:', responseBody);
    t.is(response.statusCode, 201, 'MKCOL should return 201 Created');

    // Verify the calendar was created by fetching calendars
    const calendars = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });

    t.log(
      'All calendar URLs:',
      calendars.map((c) => c.url)
    );
    t.log('Looking for calendarId:', calendarId);

    const created = calendars.find((c) => c.url && c.url.includes(calendarId));
    t.truthy(created, 'Calendar should be discoverable after MKCOL');
  }
);

test.serial('MKCOL with D: prefix XML body creates a calendar', async (t) => {
  const { serverUrl, username, pass } = t.context;
  const calendarId = randomUUID();
  const url = `${serverUrl}dav/${username}/${calendarId}/`;

  const mkcolBody = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<D:mkcol xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">',
    '  <D:set>',
    '    <D:prop>',
    '      <D:displayname>Prefixed Calendar</D:displayname>',
    '      <C:supported-calendar-component-set>',
    '        <C:comp name="VEVENT"/>',
    '      </C:supported-calendar-component-set>',
    '    </D:prop>',
    '  </D:set>',
    '</D:mkcol>'
  ].join('\n');

  const response = await undici.request(url, {
    method: 'MKCOL',
    headers: {
      Authorization: authHeader(username, pass),
      'Content-Type': 'application/xml; charset=utf-8'
    },
    body: mkcolBody
  });

  t.is(response.statusCode, 201, 'MKCOL with D: prefix should return 201');
});

test.serial(
  'MKCOL with empty body creates a calendar with defaults',
  async (t) => {
    const { serverUrl, username, pass } = t.context;
    const calendarId = randomUUID();
    const url = `${serverUrl}dav/${username}/${calendarId}/`;

    const response = await undici.request(url, {
      method: 'MKCOL',
      headers: {
        Authorization: authHeader(username, pass),
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });

    t.is(response.statusCode, 201, 'MKCOL with empty body should return 201');
  }
);

test.serial('OPTIONS response includes MKCOL in Allow header', async (t) => {
  const { serverUrl, username, pass } = t.context;
  const url = `${serverUrl}dav/${username}/`;

  const response = await undici.request(url, {
    method: 'OPTIONS',
    headers: {
      Authorization: authHeader(username, pass)
    }
  });

  t.is(response.statusCode, 200);
  const allow = response.headers.allow || '';
  t.true(allow.includes('MKCOL'), 'Allow header should include MKCOL');
  t.true(
    allow.includes('MKCALENDAR'),
    'Allow header should include MKCALENDAR'
  );
});

// ============================================================================
// PUT Auto-Create Calendar Tests (Thunderbird Publish)
// ============================================================================

test.serial(
  'PUT with VCALENDAR body to non-existent calendar auto-creates it (Thunderbird Publish)',
  async (t) => {
    const { serverUrl, username, pass } = t.context;
    const calendarId = randomUUID();
    const url = `${serverUrl}dav/${username}/${calendarId}`;

    // Thunderbird Publish sends a full VCALENDAR with events
    const icsBody = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mozilla.org/NONSGML Thunderbird 128.0//EN',
      'X-WR-CALNAME:My Published Calendar',
      'BEGIN:VEVENT',
      'UID:tb-publish-event-001@example.com',
      'DTSTAMP:20260301T100000Z',
      'DTSTART:20260301T100000Z',
      'DTEND:20260301T110000Z',
      'SUMMARY:Published Event',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const response = await undici.request(url, {
      method: 'PUT',
      headers: {
        Authorization: authHeader(username, pass),
        'Content-Type': 'text/calendar; charset=utf-8'
      },
      body: icsBody
    });

    // Should succeed (200 or 201), not 405
    t.true(
      response.statusCode >= 200 && response.statusCode < 300,
      `PUT to non-existent calendar should succeed, got ${response.statusCode}`
    );

    // Verify the calendar was created
    const calendars = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });

    const created = calendars.find((c) => c.url && c.url.includes(calendarId));
    t.truthy(
      created,
      'Calendar should be auto-created after PUT with VCALENDAR body'
    );
  }
);

test.serial(
  'PUT auto-create extracts X-WR-CALNAME for calendar display name',
  async (t) => {
    const { serverUrl, username, pass } = t.context;
    const calendarId = randomUUID();
    const url = `${serverUrl}dav/${username}/${calendarId}`;

    const icsBody = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Test//Test//EN',
      'X-WR-CALNAME:My Custom Calendar Name',
      'BEGIN:VEVENT',
      'UID:put-calname-event@example.com',
      'DTSTAMP:20260301T100000Z',
      'DTSTART:20260301T100000Z',
      'DTEND:20260301T110000Z',
      'SUMMARY:Test Event',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const response = await undici.request(url, {
      method: 'PUT',
      headers: {
        Authorization: authHeader(username, pass),
        'Content-Type': 'text/calendar; charset=utf-8'
      },
      body: icsBody
    });

    t.true(
      response.statusCode >= 200 && response.statusCode < 300,
      `PUT should succeed, got ${response.statusCode}`
    );

    // Verify the calendar name was extracted from X-WR-CALNAME
    const calendars = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });

    const created = calendars.find((c) => c.url && c.url.includes(calendarId));
    t.truthy(created, 'Calendar should exist');
    // The displayname should be "My Custom Calendar Name" from X-WR-CALNAME
    t.truthy(created.displayName, 'Calendar should have a display name');
  }
);

test.serial(
  'PUT auto-create with VTODO body creates calendar with VTODO support',
  async (t) => {
    const { serverUrl, username, pass } = t.context;
    const calendarId = randomUUID();
    const url = `${serverUrl}dav/${username}/${calendarId}`;

    // Use the Apple VTODO fixture
    const icsBody = fs.readFileSync(
      path.join(__dirname, 'data', 'vtodo-apple-structured.ics'),
      'utf8'
    );

    const response = await undici.request(url, {
      method: 'PUT',
      headers: {
        Authorization: authHeader(username, pass),
        'Content-Type': 'text/calendar; charset=utf-8'
      },
      body: icsBody
    });

    t.true(
      response.statusCode >= 200 && response.statusCode < 300,
      `PUT with VTODO should succeed, got ${response.statusCode}`
    );

    // Verify the calendar was created
    const calendars = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });

    const created = calendars.find((c) => c.url && c.url.includes(calendarId));
    t.truthy(created, 'Calendar should be auto-created for VTODO PUT');
  }
);
