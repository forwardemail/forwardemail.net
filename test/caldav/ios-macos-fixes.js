/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * iOS/macOS CalDAV Compliance Fixes — E2E Tests
 *
 * Validates:
 * - RFC 6578 Section 3.4: Initial sync-collection excludes tombstones
 * - RFC 4791 Section 9.9: Full VTODO time-range overlap table (7 rows)
 * - Legacy /cal/ to /dav/ href normalization
 * - X-APPLE-PROXIMITY VALARM preservation through PUT->GET roundtrip
 * - X-APPLE-STRUCTURED-LOCATION preservation
 */

const fsp = require('node:fs/promises');
const path = require('node:path');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const tsdav = require('tsdav');
const undici = require('undici');
const { Semaphore } = require('@shopify/semaphore');

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

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const semaphore = new Semaphore(2);
const {
  getBasicAuthHeaders,
  createAccount,
  fetchCalendars,
  createObject,
  deleteObject,
  davRequest,
  makeCalendar,
  DAVNamespaceShort
} = tsdav;

const IP_ADDRESS = ip.address();

// Helper: raw HTTP request via undici
async function rawRequest(url, options = {}) {
  const res = await undici.fetch(url, options);
  const body = await res.text();
  return { status: res.status, headers: res.headers, body };
}

// Helper: send a sync-collection REPORT
async function syncCollectionReport(url, syncToken, authHeaders) {
  const tokenXml = syncToken
    ? `<d:sync-token>${syncToken}</d:sync-token>`
    : '<d:sync-token/>';
  const body = `<?xml version="1.0" encoding="utf-8" ?>
<d:sync-collection xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  ${tokenXml}
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
  </d:prop>
</d:sync-collection>`;

  return rawRequest(url, {
    method: 'REPORT',
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      Depth: '1',
      ...authHeaders
    },
    body
  });
}

// Helper: send a calendar-query REPORT with time-range on VTODO
async function vtodoTimeRangeReport(url, start, end, authHeaders) {
  const timeRange = [];
  if (start) timeRange.push(`start="${start}"`);
  if (end) timeRange.push(`end="${end}"`);
  const timeRangeAttr = timeRange.join(' ');

  const body = `<?xml version="1.0" encoding="utf-8" ?>
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop>
    <d:getetag/>
    <c:calendar-data/>
  </d:prop>
  <c:filter>
    <c:comp-filter name="VCALENDAR">
      <c:comp-filter name="VTODO">
        <c:time-range ${timeRangeAttr}/>
      </c:comp-filter>
    </c:comp-filter>
  </c:filter>
</c:calendar-query>`;

  return rawRequest(url, {
    method: 'REPORT',
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      Depth: '1',
      ...authHeaders
    },
    body
  });
}

// Helper: find the dedicated Tasks calendar (VTODO-only)
function getTaskCalendar(t) {
  return t.context.calendars.find(
    (c) =>
      c.displayName === 'Tasks' ||
      c.displayName?.includes('Tasks') ||
      c.displayName?.includes('Reminders') ||
      (c.components && c.components.includes('VTODO'))
  );
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

test.beforeEach(async (t) => {
  t.context.permit = await semaphore.acquire();

  const client = new Redis();
  const subscriber = new Redis();
  client.setMaxListeners(0);
  subscriber.setMaxListeners(0);
  subscriber.channels.setMaxListeners(0);
  t.context.client = client;
  t.context.subscriber = subscriber;

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();

  const sqlite = new SQLite({ client, subscriber });
  await sqlite.listen(sqlitePort);
  t.context.sqlite = sqlite;

  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  t.context.wsp = wsp;

  const calDAV = new CalDAV(
    {
      ...calDAVConfig,
      wsp,
      port,
      client
    },
    Users
  );
  calDAV.app.server = calDAV.server;
  await calDAV.listen();
  t.context.calDAV = calDAV;
  t.context.serverUrl = `http://${IP_ADDRESS}:${port}/`;

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

  // spoof dns records
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

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  t.context.authHeaders = getBasicAuthHeaders({
    username: `${alias.name}@${domain.name}`,
    password: t.context.pass
  });

  t.context.account = await createAccount({
    account: {
      serverUrl: t.context.serverUrl,
      accountType: 'caldav'
    },
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

test.afterEach.always(async (t) => {
  const closeServerWithTimeout = (server, timeout = 1000) =>
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

  await t.context.permit.release();
});

// ============================================
// RFC 6578 Section 3.4: Initial sync-collection MUST NOT include tombstones
// ============================================

test('initial sync-collection (empty token) excludes deleted events', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '1.ics'),
    'utf8'
  );
  const objectUrl = new URL('1.ics', calendar.url).href;

  // Create event
  const createRes = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(createRes.ok, 'Create should succeed');

  // Delete event (creates a tombstone)
  const deleteRes = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });
  t.true(deleteRes.ok, 'Delete should succeed');

  // Initial sync-collection with empty token should NOT include tombstones
  const syncRes = await syncCollectionReport(
    calendar.url,
    null,
    t.context.authHeaders
  );
  t.is(syncRes.status, 207, 'sync-collection should return 207');

  // Parse the response - should NOT contain any 404 responses
  t.false(
    syncRes.body.includes('<d:status>HTTP/1.1 404'),
    'Initial sync must not include 404 tombstones (RFC 6578 Section 3.4)'
  );
  t.false(
    syncRes.body.includes('1.ics'),
    'Deleted event href must not appear in initial sync'
  );
});

test('incremental sync-collection (with token) includes deleted events as 404', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '2.ics'),
    'utf8'
  );
  const objectUrl = new URL('2.ics', calendar.url).href;

  // Get initial sync-token
  const [propfindRes] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: { 'xmlns:d': 'DAV:' },
          prop: { 'd:sync-token': {} }
        }
      }
    }
  });
  const initialToken =
    propfindRes.props?.syncToken?.value || propfindRes.props?.syncToken;
  t.truthy(initialToken, 'Should have an initial sync-token');

  // Create event
  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Delete event
  await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  // Incremental sync with the initial token should include the tombstone
  const syncRes = await syncCollectionReport(
    calendar.url,
    initialToken,
    t.context.authHeaders
  );
  t.is(syncRes.status, 207, 'sync-collection should return 207');

  // Should contain a 404 response for the deleted event
  t.true(
    syncRes.body.includes('2.ics'),
    'Deleted event href must appear in incremental sync'
  );
});

// ============================================
// RFC 4791 Section 9.9: VTODO time-range overlap table
// ============================================

test('VTODO time-range: Row 1 - DTSTART+DUE overlaps when range intersects', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-start-due.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-start-due.ics', calendar.url).href;

  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Query range that overlaps: DTSTART=2021-06-01, DUE=2021-06-15
  // Range: 2021-06-10 to 2021-06-20 (start <= DUE && end > DTSTART)
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '20210610T000000Z',
    '20210620T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-start-due@test'),
    'VTODO with DTSTART+DUE should match overlapping range'
  );

  // Query range that does NOT overlap: 2021-07-01 to 2021-07-31
  // (start > DUE, so no overlap)
  const res2 = await vtodoTimeRangeReport(
    calendar.url,
    '20210701T000000Z',
    '20210731T000000Z',
    t.context.authHeaders
  );
  t.is(res2.status, 207);
  t.false(
    res2.body.includes('todo-start-due@test'),
    'VTODO with DTSTART+DUE should NOT match non-overlapping range'
  );
});

test('VTODO time-range: Row 2 - DTSTART only overlaps when range intersects', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-start-only.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-start-only.ics', calendar.url).href;

  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // DTSTART=2021-06-01T09:00:00Z
  // Overlap: start <= DTSTART AND end > DTSTART
  // Range: 2021-05-01 to 2021-06-02 (includes DTSTART)
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '20210501T000000Z',
    '20210602T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-start-only@test'),
    'VTODO with DTSTART-only should match when range includes DTSTART'
  );

  // Range: 2021-06-02 to 2021-06-30 (start > DTSTART, no overlap)
  const res2 = await vtodoTimeRangeReport(
    calendar.url,
    '20210602T000000Z',
    '20210630T000000Z',
    t.context.authHeaders
  );
  t.is(res2.status, 207);
  t.false(
    res2.body.includes('todo-start-only@test'),
    'VTODO with DTSTART-only should NOT match when range is after DTSTART'
  );
});

test('VTODO time-range: Row 3 - DUE only overlaps when range includes DUE', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-due-only.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-due-only.ics', calendar.url).href;

  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // DUE=2021-06-15T17:00:00Z
  // Overlap: start < DUE AND end >= DUE
  // Range: 2021-06-01 to 2021-06-16 (includes DUE)
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '20210601T000000Z',
    '20210616T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-due-only@test'),
    'VTODO with DUE-only should match when range includes DUE'
  );

  // Range: 2021-06-16 to 2021-06-30 (start >= DUE, no overlap per RFC)
  const res2 = await vtodoTimeRangeReport(
    calendar.url,
    '20210616T000000Z',
    '20210630T000000Z',
    t.context.authHeaders
  );
  t.is(res2.status, 207);
  t.false(
    res2.body.includes('todo-due-only@test'),
    'VTODO with DUE-only should NOT match when range starts at/after DUE'
  );
});

test('VTODO time-range: Row 4 - COMPLETED+CREATED overlaps correctly', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-completed-created.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-completed-created.ics', calendar.url).href;

  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // CREATED=2021-03-01, COMPLETED=2021-04-01
  // Overlap: start <= COMPLETED AND end >= CREATED
  // Range: 2021-03-15 to 2021-04-15 (overlaps both)
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '20210315T000000Z',
    '20210415T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-completed-created@test'),
    'VTODO with COMPLETED+CREATED should match overlapping range'
  );

  // Range: 2021-05-01 to 2021-06-01 (start > COMPLETED, no overlap)
  const res2 = await vtodoTimeRangeReport(
    calendar.url,
    '20210501T000000Z',
    '20210601T000000Z',
    t.context.authHeaders
  );
  t.is(res2.status, 207);
  t.false(
    res2.body.includes('todo-completed-created@test'),
    'VTODO with COMPLETED+CREATED should NOT match when range is after COMPLETED'
  );
});

test('VTODO time-range: Row 5 - COMPLETED only overlaps correctly', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-completed-only.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-completed-only.ics', calendar.url).href;

  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // COMPLETED=2021-05-01T15:00:00Z
  // Overlap: start <= COMPLETED AND end >= COMPLETED
  // Range: 2021-04-01 to 2021-06-01 (includes COMPLETED)
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '20210401T000000Z',
    '20210601T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-completed-only@test'),
    'VTODO with COMPLETED-only should match when range includes COMPLETED'
  );

  // Range: 2021-06-01 to 2021-07-01 (start > COMPLETED, no overlap)
  const res2 = await vtodoTimeRangeReport(
    calendar.url,
    '20210601T000000Z',
    '20210701T000000Z',
    t.context.authHeaders
  );
  t.is(res2.status, 207);
  t.false(
    res2.body.includes('todo-completed-only@test'),
    'VTODO with COMPLETED-only should NOT match when range is after COMPLETED'
  );
});

test('VTODO time-range: Row 6 - CREATED only overlaps when end > CREATED', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-created-only.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-created-only.ics', calendar.url).href;

  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // CREATED=2021-03-01T10:00:00Z
  // Overlap: end > CREATED
  // Range: 2021-01-01 to 2021-04-01 (end > CREATED)
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '20210101T000000Z',
    '20210401T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-created-only@test'),
    'VTODO with CREATED-only should match when end > CREATED'
  );

  // Range: 2021-01-01 to 2021-02-01 (end < CREATED, no overlap)
  const res2 = await vtodoTimeRangeReport(
    calendar.url,
    '20210101T000000Z',
    '20210201T000000Z',
    t.context.authHeaders
  );
  t.is(res2.status, 207);
  t.false(
    res2.body.includes('todo-created-only@test'),
    'VTODO with CREATED-only should NOT match when end <= CREATED'
  );
});

test('VTODO time-range: Row 7 - no dates matches ALL time-range queries', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-dateless.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-dateless.ics', calendar.url).href;

  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Any time range should match a dateless VTODO
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '19700101T000000Z',
    '19700102T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-dateless-rfc4791@test'),
    'Dateless VTODO must match ANY time-range query (RFC 4791 Section 9.9)'
  );

  // Far future range should also match
  const res2 = await vtodoTimeRangeReport(
    calendar.url,
    '20990101T000000Z',
    '20990201T000000Z',
    t.context.authHeaders
  );
  t.is(res2.status, 207);
  t.true(
    res2.body.includes('todo-dateless-rfc4791@test'),
    'Dateless VTODO must match even far-future time-range queries'
  );
});

// ============================================
// X-APPLE-PROXIMITY VALARM roundtrip
// ============================================

test('X-APPLE-PROXIMITY VALARM survives PUT->GET roundtrip', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-location-reminder.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-location-reminder.ics', calendar.url).href;

  const createRes = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(createRes.ok, 'Create should succeed');

  // GET the event back
  const getRes = await rawRequest(objectUrl, {
    method: 'GET',
    headers: t.context.authHeaders
  });
  t.is(getRes.status, 200, 'GET should succeed');

  // Verify X-APPLE-PROXIMITY is preserved
  t.true(
    getRes.body.includes('X-APPLE-PROXIMITY:ARRIVE'),
    'X-APPLE-PROXIMITY must survive roundtrip'
  );
  // Verify sentinel trigger is preserved (not converted to duration)
  t.true(
    getRes.body.includes('19760401T005545Z'),
    'Sentinel trigger date must be preserved'
  );
  // Verify X-APPLE-STRUCTURED-LOCATION is preserved
  t.true(
    getRes.body.includes('X-APPLE-STRUCTURED-LOCATION'),
    'Structured location must survive roundtrip'
  );
});

test('location-based VTODO without dates appears in time-range query', async (t) => {
  const calendar = getTaskCalendar(t);
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-location-reminder.ics'),
    'utf8'
  );
  const objectUrl = new URL('vtodo-location-reminder2.ics', calendar.url).href;

  // Remove CREATED from the ICS to make it truly dateless (only has DTSTAMP)
  const datelessIcs = iCalString
    .replace(/^CREATED:.*\r?\n/m, '')
    .replace(/^LAST-MODIFIED:.*\r?\n/m, '');

  await createObject({
    url: objectUrl,
    data: datelessIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Any time-range query should include this dateless location-based VTODO
  const res = await vtodoTimeRangeReport(
    calendar.url,
    '20200101T000000Z',
    '20200201T000000Z',
    t.context.authHeaders
  );
  t.is(res.status, 207);
  t.true(
    res.body.includes('todo-location-reminder-arrive@test'),
    'Location-based VTODO without dates must appear in all time-range queries'
  );
});

// ============================================
// Legacy /cal/ to /dav/ href normalization
// ============================================

test('events with legacy /cal/ href are normalized to /dav/ in responses', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '3.ics'),
    'utf8'
  );
  const objectUrl = new URL('3.ics', calendar.url).href;

  // Create event normally (will store with /dav/ prefix)
  const createRes = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(createRes.ok, 'Create should succeed');

  // Do a sync-collection and verify all hrefs use /dav/ prefix
  const syncRes = await syncCollectionReport(
    calendar.url,
    null,
    t.context.authHeaders
  );
  t.is(syncRes.status, 207);

  // Extract hrefs from the response
  const hrefMatches = syncRes.body.match(/<d:href>([^<]+)<\/d:href>/g) || [];
  for (const hrefTag of hrefMatches) {
    const href = hrefTag.replace(/<\/?d:href>/g, '');
    if (href.endsWith('.ics')) {
      t.true(
        href.startsWith('/dav/'),
        `All event hrefs must use /dav/ prefix, got: ${href}`
      );
      t.false(
        href.startsWith('/cal/'),
        `No event hrefs should use legacy /cal/ prefix, got: ${href}`
      );
    }
  }
});
