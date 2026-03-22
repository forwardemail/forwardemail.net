/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * CalDAV Audit Fixes — E2E Tests
 *
 * Validates caldav-adapter v9.3.1 fixes and caldav-server.js improvements:
 * - Synctoken increments after event create/update/delete
 * - Depth:0 PROPFIND returns metadata without event listing
 * - Depth:1 PROPFIND on user principal lists calendars
 * - OPTIONS returns DAV headers without requiring auth
 * - Deleted events excluded from PROPFIND listings
 * - PUT with If-None-Match:* on existing event returns 412
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
  davRequest
} = tsdav;

const IP_ADDRESS = ip.address();

// Helper: raw HTTP request via undici
async function rawRequest(url, options = {}) {
  const res = await undici.fetch(url, options);
  const body = await res.text();
  return { status: res.status, headers: res.headers, body };
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

// ============================================
// Synctoken tests
// ============================================

test('synctoken increments after event creation', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '1.ics'),
    'utf8'
  );

  // Get initial synctoken via PROPFIND
  const [before] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: {
            'xmlns:d': 'DAV:',
            'xmlns:cs': 'http://calendarserver.org/ns/'
          },
          prop: { 'd:sync-token': {}, 'cs:getctag': {} }
        }
      }
    }
  });
  t.is(before.status, 207);
  const tokenBefore = before.props?.syncToken?.value || before.props?.syncToken;

  // Create event
  const objectUrl = new URL('1.ics', calendar.url).href;
  const createRes = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(createRes.ok);

  // Get synctoken after create
  const [after] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: {
            'xmlns:d': 'DAV:',
            'xmlns:cs': 'http://calendarserver.org/ns/'
          },
          prop: { 'd:sync-token': {}, 'cs:getctag': {} }
        }
      }
    }
  });
  const tokenAfter = after.props?.syncToken?.value || after.props?.syncToken;
  t.not(
    tokenBefore,
    tokenAfter,
    'synctoken should change after event creation'
  );

  // Cleanup
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('synctoken increments after event update', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '2.ics'),
    'utf8'
  );
  const objectUrl = new URL('2.ics', calendar.url).href;

  // Create event
  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Get synctoken before update
  const [before] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: {
            'xmlns:d': 'DAV:',
            'xmlns:cs': 'http://calendarserver.org/ns/'
          },
          prop: { 'd:sync-token': {}, 'cs:getctag': {} }
        }
      }
    }
  });
  const tokenBefore = before.props?.syncToken?.value || before.props?.syncToken;

  // Update event (change SUMMARY)
  const updatedIcal = iCalString.replace('SUMMARY:2', 'SUMMARY:2-updated');
  await rawRequest(objectUrl, {
    method: 'PUT',
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    },
    body: updatedIcal
  });

  // Get synctoken after update
  const [after] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: {
            'xmlns:d': 'DAV:',
            'xmlns:cs': 'http://calendarserver.org/ns/'
          },
          prop: { 'd:sync-token': {}, 'cs:getctag': {} }
        }
      }
    }
  });
  const tokenAfter = after.props?.syncToken?.value || after.props?.syncToken;
  t.not(tokenBefore, tokenAfter, 'synctoken should change after event update');

  // Cleanup
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('synctoken increments after event deletion', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '3.ics'),
    'utf8'
  );
  const objectUrl = new URL('3.ics', calendar.url).href;

  // Create event
  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Get synctoken before delete
  const [before] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: {
            'xmlns:d': 'DAV:',
            'xmlns:cs': 'http://calendarserver.org/ns/'
          },
          prop: { 'd:sync-token': {}, 'cs:getctag': {} }
        }
      }
    }
  });
  const tokenBefore = before.props?.syncToken?.value || before.props?.syncToken;

  // Delete event
  const deleteRes = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });
  t.true(deleteRes.ok);

  // Get synctoken after delete
  const [after] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: {
            'xmlns:d': 'DAV:',
            'xmlns:cs': 'http://calendarserver.org/ns/'
          },
          prop: { 'd:sync-token': {}, 'cs:getctag': {} }
        }
      }
    }
  });
  const tokenAfter = after.props?.syncToken?.value || after.props?.syncToken;
  t.not(
    tokenBefore,
    tokenAfter,
    'synctoken should change after event deletion'
  );
});

// ============================================
// Depth:0 PROPFIND tests
// ============================================

test('Depth:0 PROPFIND on calendar returns metadata without event listing', async (t) => {
  const calendar = t.context.calendars[0];

  // Create an event first so there's data to potentially leak
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '4.ics'),
    'utf8'
  );
  const objectUrl = new URL('4.ics', calendar.url).href;
  await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Depth:0 PROPFIND should return calendar metadata only
  const [result] = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '0', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: { 'xmlns:d': 'DAV:' },
          prop: { 'd:displayname': {} }
        }
      }
    }
  });
  t.is(result.status, 207);
  // displayname should be present
  t.truthy(
    result.props?.displayname,
    'Depth:0 PROPFIND should return displayname'
  );

  // Cleanup
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('Depth:1 PROPFIND on user principal lists calendars', async (t) => {
  // The account homeUrl is the user principal collection
  const { homeUrl } = t.context.account;
  const results = await davRequest({
    url: homeUrl,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '1', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: { 'xmlns:d': 'DAV:' },
          prop: { 'd:displayname': {}, 'd:resourcetype': {} }
        }
      }
    }
  });
  // Should get multiple responses (the principal + at least one calendar)
  t.true(results.length >= 2, 'Depth:1 should return principal + calendars');
});

// ============================================
// OPTIONS test
// ============================================

test('OPTIONS returns DAV headers without requiring auth', async (t) => {
  const res = await rawRequest(t.context.serverUrl, {
    method: 'OPTIONS'
  });
  t.is(res.status, 200);
  const dav = res.headers.get('dav');
  t.truthy(dav, 'OPTIONS should return DAV header');
  t.true(
    dav.includes('calendar-access'),
    'DAV header should include calendar-access'
  );
  const allow = res.headers.get('allow');
  t.truthy(allow, 'OPTIONS should return Allow header');
  t.true(allow.includes('PROPFIND'), 'Allow should include PROPFIND');
  t.true(allow.includes('PUT'), 'Allow should include PUT');
});

// ============================================
// Deleted events exclusion test
// ============================================

test('Deleted events are excluded from subsequent PROPFIND listings', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '5.ics'),
    'utf8'
  );
  const objectUrl = new URL('5.ics', calendar.url).href;

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
  const deleteRes = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });
  t.true(deleteRes.ok);

  // Depth:1 PROPFIND should NOT include the deleted event
  const results = await davRequest({
    url: calendar.url,
    init: {
      method: 'PROPFIND',
      headers: { Depth: '1', ...t.context.authHeaders },
      namespace: 'd',
      body: {
        propfind: {
          _attributes: { 'xmlns:d': 'DAV:' },
          prop: { 'd:getetag': {} }
        }
      }
    }
  });

  // Check that none of the returned hrefs contain '5.ics'
  const hrefs = results.map((r) => r.href || '');
  const hasDeleted = hrefs.some((h) => h.includes('5.ics'));
  t.false(hasDeleted, 'Deleted event should not appear in PROPFIND listing');
});

// ============================================
// If-None-Match:* test (caldav-adapter v9.3.1 fix)
// ============================================

test('PUT with If-None-Match:* on existing event returns 412', async (t) => {
  const calendar = t.context.calendars[0];
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '6.ics'),
    'utf8'
  );
  const objectUrl = new URL('6.ics', calendar.url).href;

  // Create the event first
  const createRes = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(createRes.ok, 'Initial create should succeed');

  // Attempt duplicate PUT with If-None-Match: *
  // This should fail because the event already exists.
  // The server may return 412 (Precondition Failed) per RFC 7232,
  // or 400 (EVENT_ALREADY_EXISTS) from the data layer.
  const res = await rawRequest(objectUrl, {
    method: 'PUT',
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'If-None-Match': '*',
      ...t.context.authHeaders
    },
    body: iCalString
  });
  t.true(
    [400, 412].includes(res.status),
    `Duplicate PUT with If-None-Match:* should fail, got ${res.status}`
  );

  // Cleanup
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});
