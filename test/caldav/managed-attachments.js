/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * RFC 8607: CalDAV Managed Attachments
 * End-to-end tests for attachment-add, attachment-update, attachment-remove,
 * and managed attachment retrieval via GET.
 */

const { Buffer } = require('node:buffer');
const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms-tiny');
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
  deleteObject
} = tsdav;

const IP_ADDRESS = ip.address();

// Helper to unfold ICS lines (RFC 5545 line folding: CRLF + space/tab)
function unfoldICS(ics) {
  return ics.replace(/\r?\n[ \t]/g, '');
}

// Simple ICS template for testing
const TEST_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//ForwardEmail//ManagedAttachments//EN',
  'CALSCALE:GREGORIAN',
  'BEGIN:VEVENT',
  'DTSTART:20250301T090000Z',
  'DTEND:20250301T100000Z',
  'DTSTAMP:20250301T080000Z',
  'UID:managed-attach-test-event-1',
  'CREATED:20250301T080000Z',
  'SEQUENCE:0',
  'SUMMARY:Managed Attachment Test Event',
  'STATUS:CONFIRMED',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

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

  await t.context.permit.release();
});

//
// Helper: create an event and return its URL
//
async function createTestEvent(t, icsData = TEST_ICS) {
  const objectUrl = new URL(
    'managed-attach-test.ics',
    t.context.calendars[0].url
  ).href;
  const result = await createObject({
    url: objectUrl,
    data: icsData,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(result.ok, 'Event creation should succeed');
  return objectUrl;
}

// ============================================================================
// OPTIONS / DAV Header Tests
// ============================================================================

test('OPTIONS response should include calendar-managed-attachments in DAV header', async (t) => {
  const response = await undici.fetch(t.context.serverUrl, {
    method: 'OPTIONS',
    headers: t.context.authHeaders
  });
  t.is(response.status, 200);
  const davHeader = response.headers.get('dav');
  t.truthy(davHeader, 'DAV header should be present');
  t.true(
    davHeader.includes('calendar-managed-attachments'),
    'DAV header should include calendar-managed-attachments'
  );
  t.true(
    davHeader.includes('calendar-managed-attachments-no-recurrence'),
    'DAV header should include calendar-managed-attachments-no-recurrence'
  );
});

test('OPTIONS response should include POST in Allow header', async (t) => {
  const response = await undici.fetch(t.context.serverUrl, {
    method: 'OPTIONS',
    headers: t.context.authHeaders
  });
  t.is(response.status, 200);
  const allowHeader = response.headers.get('allow');
  t.truthy(allowHeader, 'Allow header should be present');
  t.true(allowHeader.includes('POST'), 'Allow header should include POST');
});

// ============================================================================
// PROPFIND Tests for Managed Attachment Properties
// ============================================================================

test('PROPFIND should return max-attachment-size property', async (t) => {
  const calendar = t.context.calendars[0];
  const response = await undici.fetch(calendar.url, {
    method: 'PROPFIND',
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      Depth: '0',
      ...t.context.authHeaders
    },
    body: `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <C:max-attachment-size/>
  </D:prop>
</D:propfind>`
  });
  t.is(response.status, 207, 'PROPFIND should return 207 Multi-Status');
  const bodyText = await response.text();
  t.true(
    bodyText.includes('max-attachment-size') && bodyText.includes('10485760'),
    'max-attachment-size should be 10485760 (10 MB)'
  );
});

test('PROPFIND should return max-attachments-per-resource property', async (t) => {
  const calendar = t.context.calendars[0];
  const response = await undici.fetch(calendar.url, {
    method: 'PROPFIND',
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      Depth: '0',
      ...t.context.authHeaders
    },
    body: `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <C:max-attachments-per-resource/>
  </D:prop>
</D:propfind>`
  });
  t.is(response.status, 207, 'PROPFIND should return 207 Multi-Status');
  const bodyText = await response.text();
  t.true(
    bodyText.includes('max-attachments-per-resource'),
    'Response should contain max-attachments-per-resource property'
  );
});

// ============================================================================
// POST attachment-add Tests
// ============================================================================

test('POST attachment-add should add an attachment and return 201 with Cal-Managed-ID', async (t) => {
  const objectUrl = await createTestEvent(t);
  const attachmentData = Buffer.from('Hello, this is a test attachment!');

  const response = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="test.txt"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: attachmentData
  });

  t.is(response.status, 201, 'Should return 201 Created');
  const managedId = response.headers.get('cal-managed-id');
  t.truthy(managedId, 'Should return Cal-Managed-ID header');
  t.truthy(response.headers.get('etag'), 'Should return ETag header');

  // Verify the returned ICS contains the attachment
  const body = await response.text();
  const uf = unfoldICS(body);
  t.true(uf.includes('BEGIN:VCALENDAR'), 'Body should be valid ICS');
  t.true(uf.includes('ATTACH'), 'ICS should contain ATTACH property');
  t.true(
    uf.includes(`MANAGED-ID=${managedId}`),
    'ATTACH should have the MANAGED-ID parameter'
  );

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-add should store attachment data as base64 in ICS', async (t) => {
  const objectUrl = await createTestEvent(t);
  const testContent = 'Binary test content for attachment';
  const attachmentData = Buffer.from(testContent);

  const response = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="data.bin"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: attachmentData
  });

  t.is(response.status, 201);
  const body = await response.text();
  const base64Expected = attachmentData.toString('base64');
  t.true(
    unfoldICS(body).includes(base64Expected),
    'ICS should contain base64-encoded attachment data'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-add should support adding multiple attachments', async (t) => {
  const objectUrl = await createTestEvent(t);

  // Add first attachment
  const response1 = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="file1.txt"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: Buffer.from('First attachment')
  });
  t.is(response1.status, 201);
  const managedId1 = response1.headers.get('cal-managed-id');
  t.truthy(managedId1);

  // Add second attachment
  const response2 = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="image.png"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: Buffer.from('Fake PNG data')
  });
  t.is(response2.status, 201);
  const managedId2 = response2.headers.get('cal-managed-id');
  t.truthy(managedId2);
  t.not(
    managedId1,
    managedId2,
    'Each attachment should have a unique managed-id'
  );

  // Verify both attachments are in the ICS
  const body = unfoldICS(await response2.text());
  t.true(
    body.includes(`MANAGED-ID=${managedId1}`),
    'ICS should contain first attachment'
  );
  t.true(
    body.includes(`MANAGED-ID=${managedId2}`),
    'ICS should contain second attachment'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-add should reject empty body', async (t) => {
  const objectUrl = await createTestEvent(t);

  const response = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      ...t.context.authHeaders
    },
    body: Buffer.alloc(0)
  });

  t.is(response.status, 400, 'Should return 400 for empty body');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-add should reject oversized attachments', async (t) => {
  const objectUrl = await createTestEvent(t);
  // Create a buffer larger than MAX_ATTACHMENT_SIZE (10 MB)
  const oversizedData = Buffer.alloc(10 * 1024 * 1024 + 1, 'x');

  const response = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      ...t.context.authHeaders
    },
    body: oversizedData
  });

  t.is(response.status, 413, 'Should return 413 for oversized attachment');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// ============================================================================
// POST attachment-update Tests
// ============================================================================

test('POST attachment-update should update an existing attachment', async (t) => {
  const objectUrl = await createTestEvent(t);

  // First add an attachment
  const addResponse = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="original.txt"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: Buffer.from('Original content')
  });
  t.is(addResponse.status, 201);
  const originalManagedId = addResponse.headers.get('cal-managed-id');

  // Now update the attachment
  const updateResponse = await undici.fetch(
    `${objectUrl}?action=attachment-update&managed-id=${originalManagedId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="updated.txt"',
        Prefer: 'return=representation',
        ...t.context.authHeaders
      },
      body: Buffer.from('Updated content')
    }
  );

  t.is(updateResponse.status, 200, 'Should return 200 for update');
  const newManagedId = updateResponse.headers.get('cal-managed-id');
  t.truthy(newManagedId, 'Should return new Cal-Managed-ID');
  t.not(
    newManagedId,
    originalManagedId,
    'New managed-id should differ from original'
  );

  // Verify the ICS has the new attachment, not the old one
  const body = unfoldICS(await updateResponse.text());
  t.true(
    body.includes(`MANAGED-ID=${newManagedId}`),
    'ICS should contain new managed-id'
  );
  t.false(
    body.includes(`MANAGED-ID=${originalManagedId}`),
    'ICS should not contain old managed-id'
  );
  t.true(
    body.includes(Buffer.from('Updated content').toString('base64')),
    'ICS should contain updated base64 data'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-update should return 404 for non-existent managed-id', async (t) => {
  const objectUrl = await createTestEvent(t);

  // Add an attachment first
  const addResponse = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      ...t.context.authHeaders
    },
    body: Buffer.from('Some content')
  });
  t.is(addResponse.status, 201);

  // Try to update with a non-existent managed-id
  const response = await undici.fetch(
    `${objectUrl}?action=attachment-update&managed-id=non-existent-id`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        ...t.context.authHeaders
      },
      body: Buffer.from('New content')
    }
  );

  t.is(response.status, 404, 'Should return 404 for non-existent managed-id');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// ============================================================================
// POST attachment-remove Tests
// ============================================================================

test('POST attachment-remove should remove an attachment and return 204', async (t) => {
  const objectUrl = await createTestEvent(t);

  // Add an attachment
  const addResponse = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="to-remove.txt"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: Buffer.from('Content to be removed')
  });
  t.is(addResponse.status, 201);
  const managedId = addResponse.headers.get('cal-managed-id');

  // Remove the attachment
  const removeResponse = await undici.fetch(
    `${objectUrl}?action=attachment-remove&managed-id=${managedId}`,
    {
      method: 'POST',
      headers: t.context.authHeaders
    }
  );

  t.is(removeResponse.status, 204, 'Should return 204 No Content');

  // Verify the attachment is gone by fetching the event
  const getResponse = await undici.fetch(objectUrl, {
    headers: t.context.authHeaders
  });
  const icsBody = unfoldICS(await getResponse.text());
  t.false(
    icsBody.includes(`MANAGED-ID=${managedId}`),
    'Removed attachment should not be in ICS'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-remove with Prefer: return=representation should return updated ICS', async (t) => {
  const objectUrl = await createTestEvent(t);

  // Add an attachment
  const addResponse = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      ...t.context.authHeaders
    },
    body: Buffer.from('Content to be removed')
  });
  t.is(addResponse.status, 201);
  const managedId = addResponse.headers.get('cal-managed-id');

  // Remove with Prefer: return=representation
  const removeResponse = await undici.fetch(
    `${objectUrl}?action=attachment-remove&managed-id=${managedId}`,
    {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
        ...t.context.authHeaders
      }
    }
  );

  t.is(removeResponse.status, 200, 'Should return 200 with representation');
  const body = unfoldICS(await removeResponse.text());
  t.true(body.includes('BEGIN:VCALENDAR'), 'Should return valid ICS');
  t.false(
    body.includes('ATTACH'),
    'ICS should not contain any ATTACH property after removal'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-remove should return 404 for non-existent managed-id', async (t) => {
  const objectUrl = await createTestEvent(t);

  const response = await undici.fetch(
    `${objectUrl}?action=attachment-remove&managed-id=non-existent-id`,
    {
      method: 'POST',
      headers: t.context.authHeaders
    }
  );

  t.is(response.status, 404, 'Should return 404 for non-existent managed-id');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// ============================================================================
// GET Attachment Retrieval Tests
// ============================================================================

test('GET with managed-id query param should retrieve attachment binary data', async (t) => {
  const objectUrl = await createTestEvent(t);
  const originalContent = 'This is the attachment content for retrieval test';
  const attachmentData = Buffer.from(originalContent);

  // Add an attachment
  const addResponse = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="retrieve-me.txt"',
      ...t.context.authHeaders
    },
    body: attachmentData
  });
  t.is(addResponse.status, 201);
  const managedId = addResponse.headers.get('cal-managed-id');

  // Retrieve the attachment via GET
  const getResponse = await undici.fetch(
    `${objectUrl}?managed-id=${managedId}`,
    {
      headers: t.context.authHeaders
    }
  );

  t.is(getResponse.status, 200, 'Should return 200');
  t.is(
    getResponse.headers.get('content-type'),
    'text/plain',
    'Content-Type should match the original'
  );
  t.truthy(
    getResponse.headers.get('content-disposition'),
    'Content-Disposition should be present'
  );

  const retrievedBuffer = Buffer.from(await getResponse.arrayBuffer());
  t.is(
    retrievedBuffer.toString(),
    originalContent,
    'Retrieved content should match original'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('GET with non-existent managed-id should return 404', async (t) => {
  const objectUrl = await createTestEvent(t);

  const response = await undici.fetch(
    `${objectUrl}?managed-id=non-existent-id`,
    {
      headers: t.context.authHeaders
    }
  );

  t.is(response.status, 404, 'Should return 404 for non-existent managed-id');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

test('POST with invalid action should return 400', async (t) => {
  const objectUrl = await createTestEvent(t);

  const response = await undici.fetch(`${objectUrl}?action=invalid-action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      ...t.context.authHeaders
    },
    body: Buffer.from('test')
  });

  t.is(response.status, 400, 'Should return 400 for invalid action');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-update without managed-id should return 400', async (t) => {
  const objectUrl = await createTestEvent(t);

  const response = await undici.fetch(`${objectUrl}?action=attachment-update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      ...t.context.authHeaders
    },
    body: Buffer.from('test')
  });

  t.is(
    response.status,
    400,
    'Should return 400 when managed-id is missing for update'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST to non-existent event should return 404', async (t) => {
  const fakeUrl = new URL('non-existent-event.ics', t.context.calendars[0].url)
    .href;

  const response = await undici.fetch(`${fakeUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      ...t.context.authHeaders
    },
    body: Buffer.from('test')
  });

  t.is(response.status, 404, 'Should return 404 for non-existent event');
});

test('POST without authentication should return 401', async (t) => {
  const objectUrl = await createTestEvent(t);

  const response = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: Buffer.from('test')
  });

  t.is(response.status, 401, 'Should return 401 without auth');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// ============================================================================
// Full Lifecycle Test
// ============================================================================

test('full lifecycle: add, retrieve, update, retrieve, remove, verify gone', async (t) => {
  const objectUrl = await createTestEvent(t);

  // 1. Add attachment
  const addResponse = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: Buffer.from('Fake PDF content v1')
  });
  t.is(addResponse.status, 201, 'Add should return 201');
  const managedId1 = addResponse.headers.get('cal-managed-id');
  t.truthy(managedId1);

  // 2. Retrieve attachment
  const getResponse1 = await undici.fetch(
    `${objectUrl}?managed-id=${managedId1}`,
    { headers: t.context.authHeaders }
  );
  t.is(getResponse1.status, 200, 'Retrieve should return 200');
  const content1 = Buffer.from(await getResponse1.arrayBuffer());
  t.is(content1.toString(), 'Fake PDF content v1');

  // 3. Update attachment
  const updateResponse = await undici.fetch(
    `${objectUrl}?action=attachment-update&managed-id=${managedId1}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document-v2.pdf"',
        Prefer: 'return=representation',
        ...t.context.authHeaders
      },
      body: Buffer.from('Fake PDF content v2')
    }
  );
  t.is(updateResponse.status, 200, 'Update should return 200');
  const managedId2 = updateResponse.headers.get('cal-managed-id');
  t.truthy(managedId2);
  t.not(managedId2, managedId1, 'Updated managed-id should be different');

  // 4. Retrieve updated attachment (old managed-id should fail)
  const getOld = await undici.fetch(`${objectUrl}?managed-id=${managedId1}`, {
    headers: t.context.authHeaders
  });
  t.is(getOld.status, 404, 'Old managed-id should return 404');

  const getNew = await undici.fetch(`${objectUrl}?managed-id=${managedId2}`, {
    headers: t.context.authHeaders
  });
  t.is(getNew.status, 200, 'New managed-id should return 200');
  const content2 = Buffer.from(await getNew.arrayBuffer());
  t.is(content2.toString(), 'Fake PDF content v2');

  // 5. Remove attachment
  const removeResponse = await undici.fetch(
    `${objectUrl}?action=attachment-remove&managed-id=${managedId2}`,
    {
      method: 'POST',
      headers: t.context.authHeaders
    }
  );
  t.is(removeResponse.status, 204, 'Remove should return 204');

  // 6. Verify attachment is gone
  const getGone = await undici.fetch(`${objectUrl}?managed-id=${managedId2}`, {
    headers: t.context.authHeaders
  });
  t.is(getGone.status, 404, 'Removed attachment should return 404');

  // 7. Verify event still exists and is valid
  const eventResponse = await undici.fetch(objectUrl, {
    headers: t.context.authHeaders
  });
  t.is(eventResponse.status, 200);
  const finalIcs = unfoldICS(await eventResponse.text());
  t.true(finalIcs.includes('BEGIN:VCALENDAR'), 'Event should still be valid');
  t.false(finalIcs.includes('ATTACH'), 'No ATTACH properties should remain');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// ============================================================================
// Filename with Spaces Tests
// ============================================================================

test('POST attachment-add should handle filenames with spaces correctly', async (t) => {
  const objectUrl = await createTestEvent(t);
  const attachmentData = Buffer.from('Fake PDF content for Arch Tickets');

  // Add attachment with a filename that contains spaces
  const response = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Arch Tickets.pdf"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: attachmentData
  });

  t.is(response.status, 201, 'Should return 201 Created');
  const managedId = response.headers.get('cal-managed-id');
  t.truthy(managedId, 'Should return Cal-Managed-ID header');

  // Verify the returned ICS has the FILENAME properly quoted
  const body = await response.text();
  const uf = unfoldICS(body);

  // The FILENAME value must be double-quoted so parsers don't split on spaces
  t.regex(
    uf,
    /FILENAME="Arch Tickets\.pdf"/,
    'FILENAME should be double-quoted to prevent space-splitting'
  );

  // Must NOT contain an unquoted FILENAME=Arch (which would be the broken behavior)
  t.notRegex(
    uf,
    /FILENAME=Arch[^"]/,
    'FILENAME must not be unquoted (would cause duplicate attachment bug)'
  );

  // Verify only one ATTACH property exists (no duplicates)
  const attachCount = (uf.match(/ATTACH;/g) || []).length;
  t.is(
    attachCount,
    1,
    'Should have exactly one ATTACH property (no duplicates)'
  );

  // Retrieve the attachment and verify the Content-Disposition filename is correct
  const getResponse = await undici.fetch(
    `${objectUrl}?managed-id=${managedId}`,
    {
      headers: t.context.authHeaders
    }
  );
  t.is(getResponse.status, 200, 'GET should return 200');
  const cd = getResponse.headers.get('content-disposition');
  t.truthy(cd, 'Content-Disposition header should be present');
  t.true(
    cd.includes('Arch Tickets.pdf'),
    'Content-Disposition should contain the full filename with spaces'
  );

  // Verify the content is correct
  const content = Buffer.from(await getResponse.arrayBuffer());
  t.is(content.toString(), 'Fake PDF content for Arch Tickets');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-add should handle filenames with multiple spaces', async (t) => {
  const objectUrl = await createTestEvent(t);
  const attachmentData = Buffer.from('Multi space filename test');

  const response = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        'attachment; filename="My Important Document Draft.pdf"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: attachmentData
  });

  t.is(response.status, 201, 'Should return 201 Created');
  const managedId = response.headers.get('cal-managed-id');
  t.truthy(managedId);

  const body = await response.text();
  const uf = unfoldICS(body);

  // Verify the full filename is preserved and quoted
  t.regex(
    uf,
    /FILENAME="My Important Document Draft\.pdf"/,
    'Multi-space filename should be fully preserved and quoted'
  );

  // Retrieve and verify
  const getResponse = await undici.fetch(
    `${objectUrl}?managed-id=${managedId}`,
    {
      headers: t.context.authHeaders
    }
  );
  t.is(getResponse.status, 200);
  const cd = getResponse.headers.get('content-disposition');
  t.true(
    cd.includes('My Important Document Draft.pdf'),
    'Full multi-space filename should be in Content-Disposition'
  );

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('POST attachment-update should preserve filename with spaces', async (t) => {
  const objectUrl = await createTestEvent(t);

  // First add an attachment with spaces in the name
  const addResponse = await undici.fetch(`${objectUrl}?action=attachment-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Arch Tickets.pdf"',
      Prefer: 'return=representation',
      ...t.context.authHeaders
    },
    body: Buffer.from('Original content')
  });
  t.is(addResponse.status, 201);
  const managedId1 = addResponse.headers.get('cal-managed-id');
  t.truthy(managedId1);

  // Update the attachment, keeping the spaced filename
  const updateResponse = await undici.fetch(
    `${objectUrl}?action=attachment-update&managed-id=${managedId1}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Arch Tickets.pdf"',
        Prefer: 'return=representation',
        ...t.context.authHeaders
      },
      body: Buffer.from('Updated content')
    }
  );
  t.is(updateResponse.status, 200, 'Update should return 200');
  const managedId2 = updateResponse.headers.get('cal-managed-id');
  t.truthy(managedId2);

  const body = await updateResponse.text();
  const uf = unfoldICS(body);

  // Verify filename is still properly quoted after update
  t.regex(
    uf,
    /FILENAME="Arch Tickets\.pdf"/,
    'Updated FILENAME should still be double-quoted'
  );

  // Verify only one ATTACH property (no duplicates from update)
  const attachCount = (uf.match(/ATTACH;/g) || []).length;
  t.is(attachCount, 1, 'Should have exactly one ATTACH after update');

  // Retrieve updated content
  const getResponse = await undici.fetch(
    `${objectUrl}?managed-id=${managedId2}`,
    {
      headers: t.context.authHeaders
    }
  );
  t.is(getResponse.status, 200);
  const content = Buffer.from(await getResponse.arrayBuffer());
  t.is(content.toString(), 'Updated content');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});
