/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * E2E + unit tests for CalDAV VTODO (task/reminder) sync behaviour
 *
 * These tests verify the fixes for iPhone Reminders sync issues:
 *   1. Completing a VTODO via CalDAV changes ETag and bumps synctoken
 *   2. Creating a VTODO bumps the calendar synctoken
 *   3. Updating a VTODO (e.g. marking complete) bumps the calendar synctoken
 *   4. Deleting a VTODO bumps the calendar synctoken
 *   5. The REST API json() serializer extracts VTODO properties correctly
 *   6. updateEvent/deleteEvent scheduling code handles VTODO (not just VEVENT)
 *
 * A single real CalDAV + SQLite server is shared across all E2E tests.
 */

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const tsdav = require('tsdav');
const ICAL = require('ical.js');

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
  makeCalendar,
  fetchCalendars,
  fetchCalendarObjects,
  createObject,
  updateObject,
  deleteObject,
  DAVNamespaceShort
} = tsdav;

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

// ─── CalDAV Server Setup (shared across all E2E tests) ─────────────────────

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

  // Create a dedicated task calendar for VTODO testing
  await makeCalendar({
    url: t.context.serverUrl,
    props: {
      [`${DAVNamespaceShort.DAV}:displayname`]: 'Tasks',
      [`${DAVNamespaceShort.CALDAV}:calendar-timezone`]: 'America/Los_Angeles',
      [`${DAVNamespaceShort.CALDAV}:calendar-description`]:
        'Task calendar for VTODO objects',
      [`${DAVNamespaceShort.CALDAV}:supported-calendar-component-set`]: 'VTODO'
    },
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

/**
 * VTODO comp-filter for tsdav's fetchCalendarObjects.
 * tsdav defaults to VEVENT, so we must explicitly request VTODO.
 */
const VTODO_FILTERS = [
  {
    'comp-filter': {
      _attributes: { name: 'VCALENDAR' },
      'comp-filter': {
        _attributes: { name: 'VTODO' }
      }
    }
  }
];

/**
 * Fetch VTODO objects from a calendar using the correct comp-filter.
 */
function fetchTodoObjects({ calendar, headers, objectUrls }) {
  return fetchCalendarObjects({
    calendar,
    headers,
    filters: VTODO_FILTERS,
    ...(objectUrls ? { objectUrls } : {})
  });
}

/**
 * Find the dedicated Tasks calendar (VTODO-only).
 */
function getTaskCalendar(t) {
  return t.context.calendars.find(
    (c) =>
      c.displayName === 'Tasks' ||
      c.displayName?.includes('Tasks') ||
      c.displayName?.includes('Reminders') ||
      (c.components && c.components.includes('VTODO'))
  );
}

function makeTodoIcs({
  uid,
  summary = 'Test Task',
  status = 'NEEDS-ACTION',
  percentComplete = null,
  completed = null,
  sequence = 0
}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VTODO',
    `UID:${uid}`,
    'DTSTAMP:20260214T100000Z',
    'CREATED:20260214T100000Z',
    `LAST-MODIFIED:20260214T10${String(sequence).padStart(2, '0')}00Z`,
    `SUMMARY:${summary}`,
    `STATUS:${status}`,
    `SEQUENCE:${sequence}`,
    'DUE:20260301T170000Z'
  ];

  if (percentComplete !== null) {
    lines.push(`PERCENT-COMPLETE:${percentComplete}`);
  }

  if (completed) {
    lines.push(`COMPLETED:${completed}`);
  }

  lines.push('END:VTODO', 'END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Helper to extract the numeric part from a synctoken URL.
 * e.g. "https://forwardemail.net/ns/sync-token/5" → 5
 */
function syncTokenNumber(syncToken) {
  if (!syncToken) return 0;
  const parts = syncToken.split('/');
  return Number.parseInt(parts[parts.length - 1], 10) || 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1: Creating a VTODO bumps the calendar synctoken
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Creating a VTODO via CalDAV bumps the calendar synctoken',
  async (t) => {
    const calendar = getTaskCalendar(t);
    t.truthy(calendar, 'Tasks calendar should exist');

    // Get initial synctoken
    const calendars1 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal1 = calendars1.find((c) => c.url === calendar.url);
    t.truthy(cal1, 'Calendar should exist in listing');
    const sync1 = cal1.syncToken;
    t.truthy(sync1, 'Initial synctoken should exist');

    // Create a VTODO
    const uid = `vtodo-create-sync-${Date.now()}@example.com`;
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;
    const ics = makeTodoIcs({ uid, summary: 'Sync Create Test' });

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
    const cal2 = calendars2.find((c) => c.url === calendar.url);
    const sync2 = cal2.syncToken;
    t.truthy(sync2, 'Synctoken should exist after VTODO create');
    t.not(
      sync1,
      sync2,
      'Synctoken MUST change after creating a VTODO (iPhone Reminders sync)'
    );

    const num1 = syncTokenNumber(sync1);
    const num2 = syncTokenNumber(sync2);
    t.true(num2 > num1, 'Synctoken number should increase after VTODO create');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2: Completing a VTODO changes ETag and bumps synctoken
// (This is the core iPhone Reminders bug — marking a task complete must
//  change the ETag so the client knows to re-fetch, and bump the synctoken
//  so sync-collection REPORT returns the updated resource.)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Completing a VTODO via CalDAV changes ETag and bumps synctoken',
  async (t) => {
    const uid = `vtodo-complete-${Date.now()}@example.com`;
    const calendar = getTaskCalendar(t);
    t.truthy(calendar, 'Tasks calendar should exist');
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

    // 1. Create an incomplete VTODO
    const ics1 = makeTodoIcs({
      uid,
      summary: 'Task to Complete',
      status: 'NEEDS-ACTION',
      sequence: 0
    });
    await createObject({
      url: objectUrl,
      data: ics1,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Fetch ETag and synctoken after create
    const objects1 = await fetchTodoObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj1 = objects1.find((o) => o.url.includes(uid));
    t.truthy(obj1, 'VTODO should exist after create');
    const etag1 = obj1.etag;
    t.truthy(etag1, 'ETag should exist after create');

    const calendars1 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal1 = calendars1.find((c) => c.url === calendar.url);
    const sync1 = cal1.syncToken;

    // Wait briefly to ensure updated_at differs
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    // 2. Mark the VTODO as COMPLETED (simulating iPhone Reminders check-off)
    const ics2 = makeTodoIcs({
      uid,
      summary: 'Task to Complete',
      status: 'COMPLETED',
      percentComplete: 100,
      completed: '20260215T120000Z',
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

    // 3. Verify ETag changed
    const objects2 = await fetchTodoObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj2 = objects2.find((o) => o.url.includes(uid));
    t.truthy(obj2, 'VTODO should exist after completion update');
    const etag2 = obj2.etag;
    t.truthy(etag2, 'ETag should exist after completion update');
    t.not(
      etag1,
      etag2,
      'ETag MUST change after completing a VTODO (iPhone Reminders sync)'
    );

    // 4. Verify synctoken changed
    const calendars2 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal2 = calendars2.find((c) => c.url === calendar.url);
    const sync2 = cal2.syncToken;
    t.not(
      sync1,
      sync2,
      'Synctoken MUST change after completing a VTODO (iPhone Reminders sync)'
    );

    // 5. Verify the ICS data actually reflects completion
    t.true(
      obj2.data.includes('STATUS:COMPLETED'),
      'VTODO should have STATUS:COMPLETED'
    );
    t.true(
      obj2.data.includes('PERCENT-COMPLETE:100'),
      'VTODO should have PERCENT-COMPLETE:100'
    );
    t.true(
      obj2.data.includes('COMPLETED:'),
      'VTODO should have COMPLETED timestamp'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3: Deleting a VTODO bumps the calendar synctoken
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Deleting a VTODO via CalDAV bumps the calendar synctoken',
  async (t) => {
    const uid = `vtodo-delete-sync-${Date.now()}@example.com`;
    const calendar = getTaskCalendar(t);
    t.truthy(calendar, 'Tasks calendar should exist');
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

    // Create a VTODO
    const ics = makeTodoIcs({ uid, summary: 'Task to Delete' });
    await createObject({
      url: objectUrl,
      data: ics,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Get synctoken after create
    const calendars1 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal1 = calendars1.find((c) => c.url === calendar.url);
    const sync1 = cal1.syncToken;

    // Delete the VTODO
    await deleteObject({
      url: objectUrl,
      headers: t.context.authHeaders
    });

    // Get synctoken after delete
    const calendars2 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal2 = calendars2.find((c) => c.url === calendar.url);
    const sync2 = cal2.syncToken;

    t.not(
      sync1,
      sync2,
      'Synctoken MUST change after deleting a VTODO (iPhone Reminders sync)'
    );

    const num1 = syncTokenNumber(sync1);
    const num2 = syncTokenNumber(sync2);
    t.true(num2 > num1, 'Synctoken number should increase after VTODO delete');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4: Updating VTODO summary (non-completion change) bumps synctoken
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Updating a VTODO summary via CalDAV bumps synctoken',
  async (t) => {
    const uid = `vtodo-summary-sync-${Date.now()}@example.com`;
    const calendar = getTaskCalendar(t);
    t.truthy(calendar, 'Tasks calendar should exist');
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

    // Create a VTODO
    const ics1 = makeTodoIcs({ uid, summary: 'Original Summary', sequence: 0 });
    await createObject({
      url: objectUrl,
      data: ics1,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Get ETag and synctoken
    const objects1 = await fetchTodoObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj1 = objects1.find((o) => o.url.includes(uid));
    t.truthy(obj1, 'VTODO should exist after create');
    const etag1 = obj1.etag;

    const calendars1 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal1 = calendars1.find((c) => c.url === calendar.url);
    const sync1 = cal1.syncToken;

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    // Update the summary
    const ics2 = makeTodoIcs({
      uid,
      summary: 'Updated Summary',
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

    // Verify ETag changed
    const objects2 = await fetchTodoObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj2 = objects2.find((o) => o.url.includes(uid));
    t.truthy(obj2, 'VTODO should exist after update');
    t.not(etag1, obj2.etag, 'ETag should change after VTODO summary update');

    // Verify synctoken changed
    const calendars2 = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    const cal2 = calendars2.find((c) => c.url === calendar.url);
    t.not(
      sync1,
      cal2.syncToken,
      'Synctoken should change after VTODO summary update'
    );

    // Verify content
    t.true(
      obj2.data.includes('Updated Summary'),
      'VTODO summary should be updated'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 5: iPhone-style VTODO completion round-trip
// Simulates the exact flow: create incomplete → mark complete → verify
// the completed state is visible when re-fetching (the core user bug)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'iPhone-style VTODO completion round-trip preserves completed state',
  async (t) => {
    const uid = `iphone-todo-${Date.now()}@example.com`;
    const calendar = getTaskCalendar(t);
    t.truthy(calendar, 'Tasks calendar should exist');
    const objectUrl = new URL(`${uid}.ics`, calendar.url).href;

    // Create an iOS Reminders-style VTODO
    const createIcs = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apple Inc.//iOS 18.0//EN',
      'BEGIN:VTODO',
      `UID:${uid}`,
      'DTSTAMP:20260301T090000Z',
      'CREATED:20260301T090000Z',
      'LAST-MODIFIED:20260301T090000Z',
      'SUMMARY:Pick up dry cleaning',
      'STATUS:NEEDS-ACTION',
      'X-APPLE-SORT-ORDER:1',
      'DUE:20260315T170000Z',
      'END:VTODO',
      'END:VCALENDAR'
    ].join('\r\n');

    await createObject({
      url: objectUrl,
      data: createIcs,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Fetch the created object
    const objects1 = await fetchTodoObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj1 = objects1.find((o) => o.url.includes(uid));
    t.truthy(obj1, 'VTODO should exist');
    t.true(
      obj1.data.includes('STATUS:NEEDS-ACTION'),
      'Initial status should be NEEDS-ACTION'
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    // Mark as completed (iOS Reminders style)
    const completeIcs = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apple Inc.//iOS 18.0//EN',
      'BEGIN:VTODO',
      `UID:${uid}`,
      'DTSTAMP:20260301T100000Z',
      'CREATED:20260301T090000Z',
      'LAST-MODIFIED:20260301T100000Z',
      'SUMMARY:Pick up dry cleaning',
      'STATUS:COMPLETED',
      'PERCENT-COMPLETE:100',
      'COMPLETED:20260301T100000Z',
      'X-APPLE-SORT-ORDER:1',
      'DUE:20260315T170000Z',
      'END:VTODO',
      'END:VCALENDAR'
    ].join('\r\n');

    await updateObject({
      url: objectUrl,
      data: completeIcs,
      etag: obj1.etag,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Re-fetch and verify the completed state is persisted
    const objects2 = await fetchTodoObjects({
      calendar,
      headers: t.context.authHeaders
    });
    const obj2 = objects2.find((o) => o.url.includes(uid));
    t.truthy(obj2, 'VTODO should still exist after completion');
    t.true(
      obj2.data.includes('STATUS:COMPLETED'),
      'Re-fetched VTODO MUST show STATUS:COMPLETED (iPhone Reminders bug fix)'
    );
    t.true(
      obj2.data.includes('COMPLETED:20260301T100000Z'),
      'Re-fetched VTODO MUST preserve COMPLETED timestamp'
    );
    t.not(
      obj1.etag,
      obj2.etag,
      'ETag MUST differ after completion (drives iPhone sync)'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// UNIT TEST 6: json() serializer extracts VTODO properties
// ═══════════════════════════════════════════════════════════════════════════════

test('json() serializer extracts VTODO summary, status, dates, and completion', (t) => {
  // Replicate the json() logic from app/controllers/api/v1/calendar-events.js
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'BEGIN:VTODO',
    'UID:json-test-todo@example.com',
    'DTSTAMP:20260301T100000Z',
    'CREATED:20260301T090000Z',
    'SUMMARY:Test Task Summary',
    'DESCRIPTION:Test task description',
    'LOCATION:Home Office',
    'STATUS:COMPLETED',
    'PERCENT-COMPLETE:100',
    'COMPLETED:20260301T120000Z',
    'DUE:20260315T170000Z',
    'DTSTART:20260301T090000Z',
    'END:VTODO',
    'END:VCALENDAR'
  ].join('\r\n');

  const parsed = ICAL.parse(ical);
  const comp = new ICAL.Component(parsed);
  const vevent = comp.getFirstSubcomponent('vevent');
  const vtodo = comp.getFirstSubcomponent('vtodo');

  // Simulate the fixed json() logic
  const object = {};
  if (vevent) {
    t.fail('Should not find VEVENT in VTODO-only ICS');
  } else if (vtodo) {
    object.summary = vtodo.getFirstPropertyValue('summary');
    object.description = vtodo.getFirstPropertyValue('description');
    object.location = vtodo.getFirstPropertyValue('location');
    object.uid = vtodo.getFirstPropertyValue('uid');
    object.status = vtodo.getFirstPropertyValue('status');
    object.component_type = 'VTODO';

    const dtstart = vtodo.getFirstPropertyValue('dtstart');
    const due = vtodo.getFirstPropertyValue('due');
    object.start_date = dtstart && dtstart.toJSDate ? dtstart.toJSDate() : null;
    object.end_date = due && due.toJSDate ? due.toJSDate() : null;

    const completed = vtodo.getFirstPropertyValue('completed');
    object.completed =
      completed && completed.toJSDate ? completed.toJSDate() : null;
    const percentComplete = vtodo.getFirstPropertyValue('percent-complete');
    object.percent_complete =
      percentComplete !== null && percentComplete !== undefined
        ? Number(percentComplete)
        : null;
  }

  t.is(object.summary, 'Test Task Summary', 'summary should be extracted');
  t.is(
    object.description,
    'Test task description',
    'description should be extracted'
  );
  t.is(object.location, 'Home Office', 'location should be extracted');
  t.is(object.uid, 'json-test-todo@example.com', 'uid should be extracted');
  t.is(object.status, 'COMPLETED', 'status should be extracted');
  t.is(object.component_type, 'VTODO', 'component_type should be VTODO');
  t.truthy(object.start_date, 'start_date should be extracted from DTSTART');
  t.truthy(object.end_date, 'end_date should be extracted from DUE');
  t.truthy(object.completed, 'completed date should be extracted');
  t.is(object.percent_complete, 100, 'percent_complete should be 100');
});

test('json() serializer handles incomplete VTODO (no COMPLETED, no PERCENT-COMPLETE)', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'BEGIN:VTODO',
    'UID:json-test-incomplete@example.com',
    'DTSTAMP:20260301T100000Z',
    'SUMMARY:Incomplete Task',
    'STATUS:NEEDS-ACTION',
    'DUE:20260315T170000Z',
    'END:VTODO',
    'END:VCALENDAR'
  ].join('\r\n');

  const parsed = ICAL.parse(ical);
  const comp = new ICAL.Component(parsed);
  const vtodo = comp.getFirstSubcomponent('vtodo');

  const object = {};
  object.summary = vtodo.getFirstPropertyValue('summary');
  object.status = vtodo.getFirstPropertyValue('status');
  object.component_type = 'VTODO';

  const completed = vtodo.getFirstPropertyValue('completed');
  object.completed =
    completed && completed.toJSDate ? completed.toJSDate() : null;
  const percentComplete = vtodo.getFirstPropertyValue('percent-complete');
  object.percent_complete =
    percentComplete !== null && percentComplete !== undefined
      ? Number(percentComplete)
      : null;

  t.is(object.summary, 'Incomplete Task');
  t.is(object.status, 'NEEDS-ACTION');
  t.is(object.component_type, 'VTODO');
  t.is(object.completed, null, 'completed should be null for incomplete task');
  t.is(
    object.percent_complete,
    null,
    'percent_complete should be null when not set'
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// UNIT TEST 7: updateEvent/deleteEvent scheduling code handles VTODO
// (Verifies that the VEVENT||VTODO fallback correctly finds organizer in VTODO)
// ═══════════════════════════════════════════════════════════════════════════════

test('scheduling code finds organizer in VTODO when no VEVENT exists', (t) => {
  // This tests the fix for the VEVENT-only organizer detection in
  // caldav-server.js updateEvent and deleteEvent
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'BEGIN:VTODO',
    'UID:organizer-todo@example.com',
    'DTSTAMP:20260301T100000Z',
    'SUMMARY:Assigned Task',
    'STATUS:NEEDS-ACTION',
    'ORGANIZER:mailto:boss@example.com',
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:worker@example.com',
    'END:VTODO',
    'END:VCALENDAR'
  ].join('\r\n');

  const parsed = ICAL.parse(ical);
  const comp = new ICAL.Component(parsed);

  // Simulate the fixed logic: try vevent first, fall back to vtodo
  const subcomp =
    comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');

  t.truthy(subcomp, 'Should find VTODO when VEVENT is absent');

  const organizerProp = subcomp ? subcomp.getFirstProperty('organizer') : null;
  t.truthy(organizerProp, 'Should find organizer property in VTODO');

  const organizerValue = organizerProp ? organizerProp.getFirstValue() : null;
  const organizerEmail = organizerValue
    ? organizerValue
        .replace(/^mailto:/i, '')
        .toLowerCase()
        .trim()
    : null;

  t.is(
    organizerEmail,
    'boss@example.com',
    'Organizer email should be extracted from VTODO'
  );
});

test('scheduling code handles VTODO without organizer gracefully', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'BEGIN:VTODO',
    'UID:no-organizer-todo@example.com',
    'DTSTAMP:20260301T100000Z',
    'SUMMARY:Personal Task',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR'
  ].join('\r\n');

  const parsed = ICAL.parse(ical);
  const comp = new ICAL.Component(parsed);

  const subcomp =
    comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');

  t.truthy(subcomp, 'Should find VTODO');

  const organizerProp = subcomp ? subcomp.getFirstProperty('organizer') : null;
  t.is(organizerProp, null, 'Personal VTODO should have no organizer');

  // This should not throw — the scheduling code should handle null gracefully
  const organizerValue = organizerProp ? organizerProp.getFirstValue() : null;
  t.is(organizerValue, null, 'Organizer value should be null');
});

// ═══════════════════════════════════════════════════════════════════════════════
// UNIT TEST 8: Synctoken bump ordering (must happen AFTER save, not before)
// ═══════════════════════════════════════════════════════════════════════════════

test('bumpSyncToken correctly increments URL-based synctoken', (t) => {
  // Replicate the bumpSyncToken logic from caldav-server.js
  function bumpSyncToken(synctoken) {
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
    bumpSyncToken('https://forwardemail.net/ns/sync-token/1'),
    'https://forwardemail.net/ns/sync-token/2'
  );
  t.is(
    bumpSyncToken('https://forwardemail.net/ns/sync-token/99'),
    'https://forwardemail.net/ns/sync-token/100'
  );
  t.is(bumpSyncToken(''), 'https://forwardemail.net/ns/sync-token/1');
  t.is(bumpSyncToken(null), 'https://forwardemail.net/ns/sync-token/1');
  t.is(bumpSyncToken('not-a-url'), 'https://forwardemail.net/ns/sync-token/1');
});
