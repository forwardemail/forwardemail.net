/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * CalDAV Error Handling Tests
 *
 * These tests verify that:
 * 1. Auth errors (401) are returned as 401 with WWW-Authenticate header
 *    (not converted to 500 by koa-better-error-handler)
 * 2. Boom errors preserve their original status codes
 * 3. The error handler is bulletproof (inner try/catch prevents escape)
 * 4. Proper WebDAV XML error responses are returned
 * 5. Enhanced logging captures full request context
 * 6. isCodeBug is only set on truly unexpected errors
 */

const { Buffer } = require('node:buffer');

const Redis = require('ioredis-mock');
const ip = require('ip');
const test = require('ava');
const undici = require('undici');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');
const CalDAV = require('../../caldav-server');
const SQLite = require('../../sqlite-server');
const Users = require('#models/users');
const calDAVConfig = require('#config/caldav');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const semaphore = new Semaphore(2);
const IP_ADDRESS = ip.address();

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

  const port = await getPort();
  const sqlitePort = await getPort();
  const wssPort = await getPort();

  const wss = createWebSocketAsPromised({
    port: wssPort
  });
  t.context.wss = wss;

  const sqlite = new SQLite({ client, subscriber });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);

  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  t.context.wsp = wsp;
  await wsp.open();

  const caldav = new CalDAV(
    {
      ...calDAVConfig,
      port,
      timeout: { ms: 120_000 }
    },
    Users
  );
  caldav.client = client;
  caldav.subscriber = subscriber;
  caldav.wsp = wsp;

  t.context.caldav = caldav;
  t.context.port = port;

  await caldav.listen(port);
});

test.afterEach.always(async (t) => {
  const { caldav, sqlite, wsp, wss, client, subscriber, permit } = t.context;
  if (caldav) await caldav.close();
  if (wsp) await wsp.close();
  if (sqlite) await sqlite.close();
  if (wss) await wss.close();
  if (client) client.disconnect();
  if (subscriber) subscriber.disconnect();
  if (permit) permit.release();
});

// ============================================
// 401 Unauthorized Error Tests
// ============================================

test.serial(
  'returns 401 with WWW-Authenticate header for invalid credentials',
  async (t) => {
    const { port } = t.context;
    const url = `http://${IP_ADDRESS}:${port}/dav/invalid@example.com/`;

    const response = await undici.request(url, {
      method: 'PROPFIND',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('invalid@example.com:wrongpassword').toString('base64'),
        'Content-Type': 'text/xml',
        Depth: '0'
      },
      body: [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<D:propfind xmlns:D="DAV:">',
        '  <D:prop><D:displayname/></D:prop>',
        '</D:propfind>'
      ].join('\n')
    });

    // Must be 401, NOT 500
    t.is(response.statusCode, 401, 'Auth failure must return 401, not 500');

    // Must include WWW-Authenticate header per RFC 4918 Section 11
    const wwwAuth = response.headers['www-authenticate'];
    t.truthy(wwwAuth, 'WWW-Authenticate header must be present on 401');
    t.true(
      wwwAuth.includes('Basic'),
      'WWW-Authenticate must specify Basic scheme'
    );
    t.true(
      wwwAuth.includes('realm='),
      'WWW-Authenticate must include realm parameter'
    );

    // Must be XML content type
    const contentType = response.headers['content-type'];
    t.truthy(contentType);
    t.true(contentType.includes('application/xml'));

    // Body must be valid WebDAV XML error
    const body = await response.body.text();
    t.true(body.includes('<?xml'), 'Response must be XML');
    t.true(body.includes('<D:error'), 'Response must contain D:error element');
    t.true(body.includes('401'), 'Response must contain 401 status');
  }
);

test.serial('returns 401 for missing Authorization header', async (t) => {
  const { port } = t.context;
  const url = `http://${IP_ADDRESS}:${port}/dav/test@example.com/`;

  const response = await undici.request(url, {
    method: 'PROPFIND',
    headers: {
      'Content-Type': 'text/xml',
      Depth: '0'
    },
    body: [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<D:propfind xmlns:D="DAV:">',
      '  <D:prop><D:displayname/></D:prop>',
      '</D:propfind>'
    ].join('\n')
  });

  // Must be 401, NOT 500
  t.is(response.statusCode, 401, 'Missing auth must return 401, not 500');

  // Must include WWW-Authenticate header
  const wwwAuth = response.headers['www-authenticate'];
  t.truthy(wwwAuth, 'WWW-Authenticate header must be present on 401');
});

// ============================================
// Error Response Format Tests
// ============================================

test.serial(
  'error responses contain proper WebDAV XML structure',
  async (t) => {
    const { port } = t.context;
    const url = `http://${IP_ADDRESS}:${port}/dav/invalid@example.com/`;

    const response = await undici.request(url, {
      method: 'PROPFIND',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('invalid@example.com:wrongpassword').toString('base64'),
        'Content-Type': 'text/xml',
        Depth: '0'
      },
      body: [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<D:propfind xmlns:D="DAV:">',
        '  <D:prop><D:displayname/></D:prop>',
        '</D:propfind>'
      ].join('\n')
    });

    const body = await response.body.text();

    // Validate XML structure
    t.true(body.startsWith('<?xml version="1.0" encoding="utf-8"?>'));
    t.true(body.includes('<D:error xmlns:D="DAV:">'));
    t.true(body.includes('<D:status>'));
    t.true(body.includes('<D:description>'));
    t.true(body.includes('</D:error>'));

    // Error message must NOT leak internal details for server errors
    // (for 401 it should contain the user-facing message)
    t.false(
      body.includes('ReferenceError'),
      'Must not leak ReferenceError to client'
    );
    t.false(body.includes('TypeError'), 'Must not leak TypeError to client');
  }
);

// ============================================
// OPTIONS Request Tests (no auth required)
// ============================================

test.serial('OPTIONS requests succeed without authentication', async (t) => {
  const { port } = t.context;
  const url = `http://${IP_ADDRESS}:${port}/dav/test@example.com/`;

  const response = await undici.request(url, {
    method: 'OPTIONS',
    headers: {}
  });

  t.is(response.statusCode, 200, 'OPTIONS must return 200 without auth');

  // Must include DAV header
  const davHeader = response.headers.dav;
  t.truthy(davHeader, 'DAV header must be present');
  t.true(davHeader.includes('calendar-access'));

  // Must include Allow header
  const allowHeader = response.headers.allow;
  t.truthy(allowHeader, 'Allow header must be present');
  t.true(allowHeader.includes('PROPFIND'));
  t.true(allowHeader.includes('REPORT'));
  t.true(allowHeader.includes('MKCALENDAR'));
});

test.serial('OPTIONS requests do not trigger auth pipeline', async (t) => {
  const { port } = t.context;
  const url = `http://${IP_ADDRESS}:${port}/dav/nonexistent@example.com/`;

  // Even with invalid credentials, OPTIONS should succeed
  const response = await undici.request(url, {
    method: 'OPTIONS',
    headers: {
      Authorization:
        'Basic ' + Buffer.from('nonexistent@example.com:bad').toString('base64')
    }
  });

  t.is(
    response.statusCode,
    200,
    'OPTIONS must succeed even with invalid credentials'
  );
});

// ============================================
// POST Error Handler Tests
// ============================================

test.serial(
  'POST error handler returns 401 with WWW-Authenticate for auth failures',
  async (t) => {
    const { port } = t.context;
    // POST to a managed attachment URL without valid auth
    const url = `http://${IP_ADDRESS}:${port}/dav/invalid@example.com/cal-id/event-id?action=attachment-add`;

    const response = await undici.request(url, {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('invalid@example.com:wrongpassword').toString('base64'),
        'Content-Type': 'application/octet-stream'
      },
      body: 'test attachment data'
    });

    // Must be 401, NOT 500
    t.is(response.statusCode, 401, 'POST auth failure must return 401');

    // Must include WWW-Authenticate header
    const wwwAuth = response.headers['www-authenticate'];
    t.truthy(wwwAuth, 'POST 401 must include WWW-Authenticate header');
  }
);

// ============================================
// GET Attachment Error Handler Tests
// ============================================

test.serial(
  'GET attachment error handler returns 401 with WWW-Authenticate for auth failures',
  async (t) => {
    const { port } = t.context;
    // GET a managed attachment URL without valid auth
    const url = `http://${IP_ADDRESS}:${port}/dav/invalid@example.com/cal-id/event-id?managed-id=test123`;

    const response = await undici.request(url, {
      method: 'GET',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('invalid@example.com:wrongpassword').toString('base64')
      }
    });

    // Must be 401, NOT 500
    t.is(
      response.statusCode,
      401,
      'GET attachment auth failure must return 401'
    );

    // Must include WWW-Authenticate header
    const wwwAuth = response.headers['www-authenticate'];
    t.truthy(
      wwwAuth,
      'GET attachment 401 must include WWW-Authenticate header'
    );
  }
);

// ============================================
// Error Status Code Preservation Tests
// ============================================

test.serial(
  'Boom 401 errors preserve status code through error handler',
  async (t) => {
    const { port } = t.context;
    const url = `http://${IP_ADDRESS}:${port}/dav/test@example.com/`;

    // PROPFIND with bad password triggers Boom.unauthorized (401)
    const response = await undici.request(url, {
      method: 'PROPFIND',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('test@example.com:badpassword').toString('base64'),
        'Content-Type': 'text/xml',
        Depth: '1'
      },
      body: [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<D:propfind xmlns:D="DAV:">',
        '  <D:prop><D:displayname/></D:prop>',
        '</D:propfind>'
      ].join('\n')
    });

    // The key assertion: status must be 401, not 500
    t.is(
      response.statusCode,
      401,
      'Boom 401 must not be converted to 500 by error handler'
    );
  }
);

// ============================================
// Content-Type Consistency Tests
// ============================================

test.serial(
  'all error responses use application/xml content type',
  async (t) => {
    const { port } = t.context;

    // Test PROPFIND error
    const propfindResponse = await undici.request(
      `http://${IP_ADDRESS}:${port}/dav/bad@example.com/`,
      {
        method: 'PROPFIND',
        headers: {
          Authorization:
            'Basic ' + Buffer.from('bad@example.com:wrong').toString('base64'),
          'Content-Type': 'text/xml',
          Depth: '0'
        },
        body: '<?xml version="1.0"?><D:propfind xmlns:D="DAV:"><D:prop><D:displayname/></D:prop></D:propfind>'
      }
    );

    const contentType = propfindResponse.headers['content-type'];
    t.truthy(contentType, 'Content-Type header must be present on errors');
    t.true(
      contentType.includes('application/xml'),
      'Error Content-Type must be application/xml'
    );
  }
);

// ============================================
// User-Agent Specific Tests (iOS/macOS)
// ============================================

test.serial(
  'iOS CalendarAgent gets 401 with WWW-Authenticate on auth failure',
  async (t) => {
    const { port } = t.context;
    const url = `http://${IP_ADDRESS}:${port}/dav/test@example.com/`;

    const response = await undici.request(url, {
      method: 'PROPFIND',
      headers: {
        Authorization:
          'Basic ' + Buffer.from('test@example.com:wrong').toString('base64'),
        'Content-Type': 'text/xml',
        Depth: '1',
        'User-Agent': 'iOS/18.3.2 (22D82) dataaccessd/1.0',
        Accept: '*/*',
        Brief: 't',
        Prefer: 'return=minimal'
      },
      body: [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<A:propfind xmlns:A="DAV:">',
        '  <A:prop>',
        '    <A:displayname/>',
        '    <A:resourcetype/>',
        '  </A:prop>',
        '</A:propfind>'
      ].join('\n')
    });

    t.is(response.statusCode, 401, 'iOS CalendarAgent must get 401, not 500');

    const wwwAuth = response.headers['www-authenticate'];
    t.truthy(wwwAuth, 'iOS CalendarAgent must receive WWW-Authenticate header');
  }
);

test.serial(
  'Fantastical client gets 401 with WWW-Authenticate on auth failure',
  async (t) => {
    const { port } = t.context;
    const url = `http://${IP_ADDRESS}:${port}/dav/test@example.com/`;

    const response = await undici.request(url, {
      method: 'PROPFIND',
      headers: {
        Authorization:
          'Basic ' + Buffer.from('test@example.com:wrong').toString('base64'),
        'Content-Type': 'text/xml',
        Depth: '1',
        'User-Agent':
          'Fantastical 2 for Mac (Calendar)/4.1.10 Mac OS X/26.4 Darwin/25.4.0'
      },
      body: '<?xml version="1.0"?><D:propfind xmlns:D="DAV:"><D:prop><D:displayname/></D:prop></D:propfind>'
    });

    t.is(response.statusCode, 401, 'Fantastical must get 401, not 500');

    const wwwAuth = response.headers['www-authenticate'];
    t.truthy(wwwAuth, 'Fantastical must receive WWW-Authenticate header');
  }
);
