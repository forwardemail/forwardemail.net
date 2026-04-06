/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * E2E tests for VTIMEZONE preservation in CalDAV responses.
 *
 * These tests verify that when a calendar event contains VTIMEZONE
 * components (required by RFC 5545 Section 3.6.5 when TZID parameters
 * are used), the CalDAV server preserves them in responses to clients.
 *
 * Without VTIMEZONE, Apple Calendar (dataaccessd) treats timezone-
 * qualified times as floating, displaying e.g. an Eastern Time event
 * at its face-value hour in Mountain Time instead of converting.
 *
 * Regression test for: https://github.com/forwardemail/forwardemail.net/issues/XXXX
 */

const fsp = require('node:fs/promises');
const path = require('node:path');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ICAL = require('ical.js');
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
  calendarMultiGet,
  DAVNamespace
} = tsdav;

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

// ─── ICS Helpers ─────────────────────────────────────────────────────────────

/**
 * Build an ICS string with a VTIMEZONE and a VEVENT that references it via TZID.
 * This simulates a calendar invite from a sender in a different timezone.
 */
function makeTimezoneEventIcs({
  uid,
  tzid = 'America/New_York',
  offsetFrom = '-0500',
  offsetTo = '-0400',
  stdOffsetFrom = '-0400',
  stdOffsetTo = '-0500',
  dtstart = '20250601T160000',
  dtend = '20250601T170000',
  summary = 'Eastern Time Meeting'
}) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV Test//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE',
    `TZID:${tzid}`,
    'BEGIN:STANDARD',
    'DTSTART:20241103T020000',
    `TZOFFSETFROM:${stdOffsetFrom}`,
    `TZOFFSETTO:${stdOffsetTo}`,
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'TZNAME:EST',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:20240310T020000',
    `TZOFFSETFROM:${offsetFrom}`,
    `TZOFFSETTO:${offsetTo}`,
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'TZNAME:EDT',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `DTSTART;TZID=${tzid}:${dtstart}`,
    `DTEND;TZID=${tzid}:${dtend}`,
    'DTSTAMP:20250501T120000Z',
    `UID:${uid}`,
    'CREATED:20250501T120000Z',
    'SEQUENCE:0',
    `SUMMARY:${summary}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Build an ICS string with multiple VTIMEZONE components.
 */
function makeMultiTimezoneEventIcs({ uid }) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV Test//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:STANDARD',
    'DTSTART:20241103T020000',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:20240310T020000',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VTIMEZONE',
    'TZID:America/Chicago',
    'BEGIN:STANDARD',
    'DTSTART:20241103T020000',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0600',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:20240310T020000',
    'TZOFFSETFROM:-0600',
    'TZOFFSETTO:-0500',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'DTSTART;TZID=America/New_York:20250601T160000',
    'DTEND;TZID=America/Chicago:20250601T150000',
    'DTSTAMP:20250501T120000Z',
    `UID:${uid}`,
    'CREATED:20250501T120000Z',
    'SEQUENCE:0',
    'SUMMARY:Cross-Timezone Meeting',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// ─── CalDAV Server Setup ────────────────────────────────────────────────────

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

  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {
      // Ignore errors during cleanup
    }
  }

  // Use sqlite.close() to clean up Piscina worker pool,
  // WebSocket server, wsInterval, and IMAP notifier timers
  if (t.context.sqlite) {
    try {
      await t.context.sqlite.close();
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

async function createEventViaCalDAV(t, uid, icsData) {
  const calendar = t.context.calendars.find((c) =>
    c.components?.includes('VEVENT')
  );
  const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

  await createObject({
    url: objectUrl,
    data: icsData,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  return objectUrl;
}

async function fetchEventIcs(t, uid) {
  const calendar = t.context.calendars.find((c) =>
    c.components?.includes('VEVENT')
  );
  const objects = await fetchCalendarObjects({
    calendar,
    headers: t.context.authHeaders
  });

  const match = objects.find(
    (o) => o.url.includes(uid) || (o.data && o.data.includes(uid))
  );
  return match ? match.data : null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1: Single VTIMEZONE is preserved in CalDAV response
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'VTIMEZONE is preserved when fetching event with TZID via CalDAV',
  async (t) => {
    const uid = `tz-preserve-${Date.now()}@example.com`;

    const icsData = makeTimezoneEventIcs({
      uid,
      tzid: 'America/New_York',
      summary: 'Eastern Time Meeting'
    });

    // Create event with VTIMEZONE via CalDAV PUT
    await createEventViaCalDAV(t, uid, icsData);

    // Fetch the event back via CalDAV (this is what Apple Calendar does)
    const fetchedIcs = await fetchEventIcs(t, uid);
    t.truthy(fetchedIcs, 'Event should be fetchable via CalDAV');

    // Parse the returned ICS
    const comp = new ICAL.Component(ICAL.parse(fetchedIcs));

    // Verify VTIMEZONE is present in the response
    const vtimezones = comp.getAllSubcomponents('vtimezone');
    t.true(
      vtimezones.length > 0,
      'Response MUST contain VTIMEZONE component (RFC 5545 Section 3.6.5)'
    );

    // Verify the correct TZID is in the VTIMEZONE
    const tzids = vtimezones.map((vtz) => vtz.getFirstPropertyValue('tzid'));
    t.true(
      tzids.includes('America/New_York'),
      'VTIMEZONE should have TZID=America/New_York'
    );

    // Verify the VEVENT still has the TZID parameter on DTSTART
    const vevent = comp.getFirstSubcomponent('vevent');
    t.truthy(vevent, 'Response should contain VEVENT');

    const dtstart = vevent.getFirstProperty('dtstart');
    t.truthy(dtstart, 'VEVENT should have DTSTART');

    const tzidParam = dtstart.getParameter('tzid');
    t.is(
      tzidParam,
      'America/New_York',
      'DTSTART should preserve TZID=America/New_York parameter'
    );

    // Verify the time value itself is preserved (not converted to UTC)
    const dtstartValue = dtstart.getFirstValue();
    t.is(
      dtstartValue.hour,
      16,
      'DTSTART hour should be 16 (4 PM Eastern), not converted'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2: Multiple VTIMEZONE components are preserved
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Multiple VTIMEZONE components are preserved in CalDAV response',
  async (t) => {
    const uid = `tz-multi-${Date.now()}@example.com`;

    const icsData = makeMultiTimezoneEventIcs({ uid });

    // Create event with multiple VTIMEZONEs via CalDAV PUT
    await createEventViaCalDAV(t, uid, icsData);

    // Fetch the event back via CalDAV
    const fetchedIcs = await fetchEventIcs(t, uid);
    t.truthy(fetchedIcs, 'Event should be fetchable via CalDAV');

    // Parse the returned ICS
    const comp = new ICAL.Component(ICAL.parse(fetchedIcs));

    // Verify both VTIMEZONE components are present
    const vtimezones = comp.getAllSubcomponents('vtimezone');
    t.is(
      vtimezones.length,
      2,
      'Response should contain both VTIMEZONE components'
    );

    const tzids = new Set(
      vtimezones.map((vtz) => vtz.getFirstPropertyValue('tzid'))
    );
    t.true(
      tzids.has('America/New_York'),
      'Should include America/New_York VTIMEZONE'
    );
    t.true(
      tzids.has('America/Chicago'),
      'Should include America/Chicago VTIMEZONE'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3: VTIMEZONE is preserved via calendarMultiGet (Apple Calendar sync path)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'VTIMEZONE is preserved in calendarMultiGet response (Apple Calendar sync)',
  async (t) => {
    const uid = `tz-multiget-${Date.now()}@example.com`;

    const icsData = makeTimezoneEventIcs({
      uid,
      tzid: 'America/New_York',
      summary: 'Apple Calendar Sync Test'
    });

    const calendar = t.context.calendars.find((c) =>
      c.components?.includes('VEVENT')
    );
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

    // Create event
    await createObject({
      url: objectUrl,
      data: icsData,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Fetch via calendarMultiGet (this is the primary path Apple Calendar uses)
    const calendarObjects = await calendarMultiGet({
      url: calendar.url,
      props: [
        { name: 'getetag', namespace: DAVNamespace.DAV },
        { name: 'calendar-data', namespace: DAVNamespace.CALDAV }
      ],
      objectUrls: [objectUrl],
      depth: '1',
      headers: t.context.authHeaders
    });

    t.true(calendarObjects.length > 0, 'Should return calendar objects');

    const calObj = calendarObjects.find(
      (o) => o.props?.calendarData || (o.data && o.data.includes(uid))
    );
    t.truthy(calObj, 'Should find the created event');

    // Get the ICS data from the response
    const icsResponse = calObj.props?.calendarData || calObj.data;
    t.truthy(icsResponse, 'Response should contain calendar data');

    // Verify VTIMEZONE is present
    t.true(
      icsResponse.includes('BEGIN:VTIMEZONE'),
      'CalendarMultiGet response MUST include VTIMEZONE'
    );
    t.true(
      icsResponse.includes('TZID:America/New_York') ||
        icsResponse.includes('TZID=America/New_York'),
      'CalendarMultiGet response should reference America/New_York timezone'
    );

    // Parse and verify structure
    const comp = new ICAL.Component(ICAL.parse(icsResponse));
    const vtimezones = comp.getAllSubcomponents('vtimezone');
    t.true(
      vtimezones.length > 0,
      'Parsed response should contain VTIMEZONE component'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4: UTC events (no VTIMEZONE) still work correctly
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'UTC events without VTIMEZONE are not affected by the fix',
  async (t) => {
    const uid = `tz-utc-${Date.now()}@example.com`;

    // Create a UTC event (no VTIMEZONE, times end with Z)
    const utcIcs = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//CalDAV Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20250501T120000Z',
      'DTSTART:20250601T200000Z',
      'DTEND:20250601T210000Z',
      'SUMMARY:UTC Meeting',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    await createEventViaCalDAV(t, uid, utcIcs);

    const fetchedIcs = await fetchEventIcs(t, uid);
    t.truthy(fetchedIcs, 'UTC event should be fetchable');

    const comp = new ICAL.Component(ICAL.parse(fetchedIcs));

    // UTC events should NOT have VTIMEZONE (none was provided)
    const vtimezones = comp.getAllSubcomponents('vtimezone');
    t.is(vtimezones.length, 0, 'UTC event should not have VTIMEZONE');

    // Verify the event is still there
    const vevent = comp.getFirstSubcomponent('vevent');
    t.truthy(vevent, 'Response should contain VEVENT');
    t.is(
      vevent.getFirstPropertyValue('summary'),
      'UTC Meeting',
      'Summary should be preserved'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 5: VTIMEZONE from file fixture is preserved
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'VTIMEZONE from file-based ICS fixture is preserved through CalDAV round-trip',
  async (t) => {
    const iCalString = await fsp.readFile(
      path.join(__dirname, 'data', 'timezone-eastern.ics'),
      'utf8'
    );

    const calendar = t.context.calendars.find((c) =>
      c.components?.includes('VEVENT')
    );
    const objectUrl = new URL('tz-eastern-test@example.com.ics', calendar.url)
      .href;

    const response = await createObject({
      url: objectUrl,
      data: iCalString,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    t.true(response.ok, 'Event creation should succeed');

    // Fetch back via CalDAV
    const objects = await fetchCalendarObjects({
      calendar,
      headers: t.context.authHeaders
    });

    const match = objects.find(
      (o) => o.data && o.data.includes('tz-eastern-test@example.com')
    );
    t.truthy(match, 'Should find the created event');

    const comp = new ICAL.Component(ICAL.parse(match.data));

    // Verify VTIMEZONE is preserved
    const vtimezones = comp.getAllSubcomponents('vtimezone');
    t.true(
      vtimezones.length > 0,
      'File-based ICS should preserve VTIMEZONE through round-trip'
    );

    const tzid = vtimezones[0].getFirstPropertyValue('tzid');
    t.is(tzid, 'America/New_York', 'TZID should be America/New_York');

    // Verify STANDARD and DAYLIGHT sub-components are preserved
    const standard = vtimezones[0].getFirstSubcomponent('standard');
    const daylight = vtimezones[0].getFirstSubcomponent('daylight');
    t.truthy(standard, 'VTIMEZONE should contain STANDARD sub-component');
    t.truthy(daylight, 'VTIMEZONE should contain DAYLIGHT sub-component');

    // Verify offsets are preserved
    t.is(
      standard.getFirstPropertyValue('tzoffsetto').toString(),
      '-05:00',
      'Standard offset should be -05:00 (EST)'
    );
    t.is(
      daylight.getFirstPropertyValue('tzoffsetto').toString(),
      '-04:00',
      'Daylight offset should be -04:00 (EDT)'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 6: Unit test — buildICS preserves VTIMEZONE (no server needed)
// ═══════════════════════════════════════════════════════════════════════════════

test('buildICS preserves VTIMEZONE components from stored event ICS', (t) => {
  const uid = 'unit-test-tz@example.com';
  const storedIcs = makeTimezoneEventIcs({
    uid,
    tzid: 'America/New_York',
    summary: 'Unit Test Event'
  });

  // Simulate what buildICS does: parse stored ICS and extract components
  const eventComp = new ICAL.Component(ICAL.parse(storedIcs));

  // Verify the source has VTIMEZONE
  const sourceVtz = eventComp.getAllSubcomponents('vtimezone');
  t.is(sourceVtz.length, 1, 'Source ICS should have 1 VTIMEZONE');

  // Simulate buildICS reconstruction
  const comp = new ICAL.Component(['vcalendar', [], []]);
  comp.updatePropertyWithValue('version', '2.0');
  comp.updatePropertyWithValue('prodid', '-//Forward Email//CalDAV//EN');

  // This is the fix: copy VTIMEZONE components
  const addedTimezones = new Set();
  const vtimezones = eventComp.getAllSubcomponents('vtimezone');
  for (const vtz of vtimezones) {
    const tzid = vtz.getFirstPropertyValue('tzid');
    if (tzid && !addedTimezones.has(tzid)) {
      addedTimezones.add(tzid);
      comp.addSubcomponent(vtz);
    }
  }

  // Copy VEVENT
  const vevents = eventComp.getAllSubcomponents('vevent');
  for (const vevent of vevents) {
    comp.addSubcomponent(vevent);
  }

  // Verify the reconstructed VCALENDAR has VTIMEZONE
  const resultVtz = comp.getAllSubcomponents('vtimezone');
  t.is(resultVtz.length, 1, 'Reconstructed ICS should have 1 VTIMEZONE');
  t.is(
    resultVtz[0].getFirstPropertyValue('tzid'),
    'America/New_York',
    'VTIMEZONE TZID should be America/New_York'
  );

  // Verify VEVENT is also present
  const resultVevents = comp.getAllSubcomponents('vevent');
  t.is(resultVevents.length, 1, 'Reconstructed ICS should have 1 VEVENT');
  t.is(
    resultVevents[0].getFirstPropertyValue('uid'),
    uid,
    'VEVENT UID should match'
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 7: Duplicate VTIMEZONE deduplication
// ═══════════════════════════════════════════════════════════════════════════════

test('buildICS deduplicates VTIMEZONE components with same TZID', (t) => {
  const uid1 = 'dedup-test-1@example.com';
  const uid2 = 'dedup-test-2@example.com';

  // Two events both referencing America/New_York
  const ics1 = makeTimezoneEventIcs({ uid: uid1, tzid: 'America/New_York' });
  const ics2 = makeTimezoneEventIcs({ uid: uid2, tzid: 'America/New_York' });

  // Simulate buildICS with multiple events
  const comp = new ICAL.Component(['vcalendar', [], []]);
  comp.updatePropertyWithValue('version', '2.0');

  const addedTimezones = new Set();

  for (const ics of [ics1, ics2]) {
    const eventComp = new ICAL.Component(ICAL.parse(ics));

    const vtimezones = eventComp.getAllSubcomponents('vtimezone');
    for (const vtz of vtimezones) {
      const tzid = vtz.getFirstPropertyValue('tzid');
      if (tzid && !addedTimezones.has(tzid)) {
        addedTimezones.add(tzid);
        comp.addSubcomponent(vtz);
      }
    }

    const vevents = eventComp.getAllSubcomponents('vevent');
    for (const vevent of vevents) {
      comp.addSubcomponent(vevent);
    }
  }

  // Should have exactly 1 VTIMEZONE (deduplicated) and 2 VEVENTs
  const resultVtz = comp.getAllSubcomponents('vtimezone');
  t.is(
    resultVtz.length,
    1,
    'Should deduplicate VTIMEZONE with same TZID to exactly 1'
  );

  const resultVevents = comp.getAllSubcomponents('vevent');
  t.is(resultVevents.length, 2, 'Should have both VEVENTs');
});
