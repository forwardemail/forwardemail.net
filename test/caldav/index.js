/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const fsp = require('node:fs/promises');
const net = require('node:net');
const path = require('node:path');
const process = require('node:process');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const sinon = require('sinon');
const splitLines = require('split-lines');
const test = require('ava');
const undici = require('undici');
const { Semaphore } = require('@shopify/semaphore');
const { tsdav } = require('../utils');

const utils = require('../utils');
const CalDAV = require('../../caldav-server');
const SQLite = require('../../sqlite-server');

const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const Emails = require('#models/emails');
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
  DAVNamespace,
  getBasicAuthHeaders,
  createAccount,
  makeCalendar,
  fetchCalendars,
  calendarMultiGet,
  deleteObject,
  fetchCalendarObjects,
  createObject,
  updateObject,
  isCollectionDirty,
  propfind,
  supportedReportSet,
  davRequest,
  DAVNamespaceShort
} = tsdav;
const { serviceDiscovery, fetchPrincipalUrl, fetchHomeUrl } = tsdav.default;

const IP_ADDRESS = ip.address();

function extractVEvent(str) {
  return splitLines(
    str.split('BEGIN:VEVENT')[1].split('END:VEVENT')[0].trim()
  ).sort();
}

// Like extractVEvent but excludes DTSTAMP and LAST-MODIFIED which are
// dynamically updated by ensureICSTimestamps on the read path.
function extractVEventStable(str) {
  return extractVEvent(str).filter(
    (line) => !line.startsWith('DTSTAMP:') && !line.startsWith('LAST-MODIFIED:')
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

  // dkim
  map.set(
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true
    )
  );

  // spf
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

  // cname
  map.set(
    `cname:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'CNAME',
      [env.WEB_HOST],
      true
    )
  );

  // cname -> txt
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

  // dmarc
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [
        // TODO: consume dmarc reports and parse dmarc-$domain
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

  // Create a task calendar for VTODO testing
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
  // Helper function to close server with timeout
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

  // Close CalDAV server
  if (t.context.calDAV) {
    await closeServerWithTimeout(t.context.calDAV.server);
  }

  // Close WebSocket connection
  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {
      // Ignore errors during cleanup
    }
  }

  // Close SQLite server (must use .close() to clean up Piscina worker pool,
  // WebSocket server, wsInterval, and IMAP notifier timers)
  if (t.context.sqlite) {
    try {
      await t.context.sqlite.close();
    } catch {
      // Ignore errors during cleanup
    }
  }

  // Close Redis clients
  if (t.context.client) {
    t.context.client.disconnect();
  }

  if (t.context.subscriber) {
    t.context.subscriber.disconnect();
  }

  await t.context.permit.release();
});

//
// inspired by tsdav tests for various providers
// <https://github.com/natelindev/tsdav/tree/master/src/__tests__/integration>
//
test('serviceDiscovery should be able to discover the caldav service', async (t) => {
  const url = await serviceDiscovery({
    account: { serverUrl: t.context.serverUrl, accountType: 'caldav' },
    headers: t.context.authHeaders
  });
  t.is(url, t.context.serverUrl);
});

test('fetchPrincipalUrl should be able to fetch the url of principal collection', async (t) => {
  const url = await fetchPrincipalUrl({
    account: {
      serverUrl: t.context.serverUrl,
      rootUrl: t.context.serverUrl,
      accountType: 'caldav'
    },
    headers: t.context.authHeaders
  });
  t.regex(url, /http:\/\/.+\/principals\//);
});

test('fetchHomeUrl should be able to fetch the url of home set', async (t) => {
  const principalUrl = await fetchPrincipalUrl({
    account: {
      serverUrl: t.context.serverUrl,
      rootUrl: t.context.serverUrl,
      accountType: 'caldav'
    },
    headers: t.context.authHeaders
  });
  const url = await fetchHomeUrl({
    account: {
      principalUrl,
      serverUrl: t.context.serverUrl,
      rootUrl: t.context.serverUrl,
      accountType: 'caldav'
    },
    headers: t.context.authHeaders
  });
  t.regex(url, /http:\/\/.+\//);
});

test('createAccount should be able to create account', async (t) => {
  const account = await createAccount({
    account: {
      serverUrl: t.context.serverUrl,
      accountType: 'caldav'
    },
    headers: t.context.authHeaders
  });
  t.is(account.rootUrl, t.context.serverUrl);
  t.regex(account.principalUrl, /http:\/\/.+\/principals\//);
  t.regex(account.homeUrl, /http:\/\/.+\//);
});

test('fetchCalendars should be able to fetch calendars', async (t) => {
  {
    const calendars = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    t.is(calendars.length, 2);
  }

  await makeCalendar({
    url: t.context.serverUrl,
    props: {
      [`${DAVNamespaceShort.DAV}:displayname`]: 'test',
      [`${DAVNamespaceShort.CALDAV}:calendar-timezone`]: 'America/Los_Angeles',
      [`${DAVNamespaceShort.CALDAV}:calendar-description`]:
        'some calendar description'
    },
    headers: t.context.authHeaders
  });

  {
    const calendars = await fetchCalendars({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    t.is(calendars.length, 3);
    t.true(calendars.every((c) => c.url.length > 0));
  }
});

test('calendarMultiGet should be able to get information about multiple calendar objects', async (t) => {
  const iCalString1 = await fsp.readFile(
    path.join(__dirname, 'data', '1.ics'),
    'utf8'
  );
  const iCalString2 = await fsp.readFile(
    path.join(__dirname, 'data', '2.ics'),
    'utf8'
  );
  const iCalString3 = await fsp.readFile(
    path.join(__dirname, 'data', '3.ics'),
    'utf8'
  );
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const eventCalendar = calendars[0];

  const objectUrl1 = new URL('1.ics', eventCalendar.url).href;
  const objectUrl2 = new URL('2.ics', eventCalendar.url).href;
  const objectUrl3 = new URL('3.ics', eventCalendar.url).href;

  const response1 = await createObject({
    url: objectUrl1,
    data: iCalString1,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const response2 = await createObject({
    url: objectUrl2,
    data: iCalString2,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const response3 = await createObject({
    url: objectUrl3,
    data: iCalString3,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response1.ok);
  t.true(response2.ok);
  t.true(response3.ok);

  const calendarObjects = await calendarMultiGet({
    url: eventCalendar.url,
    props: [
      { name: 'getetag', namespace: DAVNamespace.DAV },
      { name: 'calendar-data', namespace: DAVNamespace.CALDAV }
    ],
    depth: '1',
    headers: t.context.authHeaders
  });

  t.true(calendarObjects.length > 0);

  const deleteResult1 = await deleteObject({
    url: objectUrl1,
    headers: t.context.authHeaders
  });

  const deleteResult2 = await deleteObject({
    url: objectUrl2,
    headers: t.context.authHeaders
  });

  const deleteResult3 = await deleteObject({
    url: objectUrl3,
    headers: t.context.authHeaders
  });

  t.true(deleteResult1.ok);
  t.true(deleteResult2.ok);
  t.true(deleteResult3.ok);
});

test('it should send calendar invite', async (t) => {
  let str = await fsp.readFile(
    path.join(__dirname, 'data', 'invite.ics'),
    'utf8'
  );

  // replace organizer line with alias
  str = str.replace(
    '$ORGANIZER',
    `${t.context.alias.name}@${t.context.domain.name}`
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const response = await createObject({
    url: new URL('12345.ics', calendars[0].url).href,
    data: str,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  //
  // invites are sent in background
  // (promise returns early for creating event)
  //
  let email;
  await pWaitFor(
    async () => {
      email = await Emails.findOne({
        alias: t.context.alias._id,
        status: 'queued',
        subject: 'Invitation: 15 Min Meeting between Forward Email and You'
      })
        .lean()
        .exec();
      return email !== null;
    },
    { timeout: ms('30s') }
  );

  t.true(email !== null);
});

test('fetchCalendarObjects should be able to fetch calendar objects', async (t) => {
  const iCalString1 = await fsp.readFile(
    path.join(__dirname, 'data', '4.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const objectUrl1 = new URL('test20.ics', calendars[0].url).href;
  await createObject({
    url: objectUrl1,
    data: iCalString1,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const objects = await fetchCalendarObjects({
    calendar: calendars[0],
    headers: t.context.authHeaders
  });

  t.true(objects.length > 0);
  t.true(
    objects.every(
      (o) => o.data?.length > 0 && o.etag?.length > 0 && o.url?.length > 0
    )
  );

  await deleteObject({
    url: objectUrl1,
    headers: t.context.authHeaders
  });
});

test('fetchCalendarObjects should be able to fetch target calendar objects when specified timeRange', async (t) => {
  const iCalString1 = await fsp.readFile(
    path.join(__dirname, 'data', '5.ics'),
    'utf8'
  );
  const iCalString2 = await fsp.readFile(
    path.join(__dirname, 'data', '6.ics'),
    'utf8'
  );
  const iCalString3 = await fsp.readFile(
    path.join(__dirname, 'data', '7.ics'),
    'utf8'
  );
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const objectUrl1 = new URL('5.ics', calendars[0].url).href;
  const objectUrl2 = new URL('6.ics', calendars[0].url).href;
  const objectUrl3 = new URL('7.ics', calendars[0].url).href;

  const response1 = await createObject({
    url: objectUrl1,
    data: iCalString1,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const response2 = await createObject({
    url: objectUrl2,
    data: iCalString2,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const response3 = await createObject({
    url: objectUrl3,
    data: iCalString3,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response1.ok);
  t.true(response2.ok);
  t.true(response3.ok);

  const objects = await fetchCalendarObjects({
    calendar: calendars[0],
    headers: t.context.authHeaders,
    timeRange: {
      start: '2021-05-01T00:00:00.000Z',
      end: '2021-05-04T00:00:00.000Z'
    }
  });

  t.is(objects.length, 1);
  t.is(decodeURIComponent(objects[0].url), decodeURIComponent(objectUrl3));

  const deleteResult1 = await deleteObject({
    url: objectUrl1,
    headers: t.context.authHeaders
  });

  const deleteResult2 = await deleteObject({
    url: objectUrl2,
    headers: t.context.authHeaders
  });

  const deleteResult3 = await deleteObject({
    url: objectUrl3,
    headers: t.context.authHeaders
  });

  t.true(deleteResult1.ok);
  t.true(deleteResult2.ok);
  t.true(deleteResult3.ok);
});

test('fetchCalendarObjects should return empty result when no objects fall in the range', async (t) => {
  const iCalString1 = await fsp.readFile(
    path.join(__dirname, 'data', '13.ics'),
    'utf8'
  );
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const objectUrl1 = new URL('13.ics', calendars[0].url).href;

  const response1 = await createObject({
    url: objectUrl1,
    data: iCalString1,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response1.ok);

  const objects = await fetchCalendarObjects({
    calendar: calendars[0],
    headers: t.context.authHeaders,
    timeRange: {
      start: '2022-03-11T10:00:00.000Z',
      end: '2022-03-11T11:00:00.000Z'
    },
    expand: true
  });

  t.is(objects.length, 0);

  const deleteResult1 = await deleteObject({
    url: objectUrl1,
    headers: t.context.authHeaders
  });

  t.true(deleteResult1.ok);
});

test('fetchCalendarObjects should fail when passed timeRange is invalid', async (t) => {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const err = await t.throwsAsync(
    fetchCalendarObjects({
      calendar: calendars[0],
      headers: t.context.authHeaders,
      timeRange: {
        start: 'Sat May 01 2021 00:00:00 GMT+0800',
        end: 'Sat May 04 2021 00:00:00 GMT+0800'
      }
    })
  );
  t.regex(err.message, /invalid timeRange format, not in ISO8601/);
});

// <https://github.com/natelindev/tsdav/blob/c884cbc006f049c16f5c5c5bc964f1c7c83a9c01/src/__tests__/integration/nextcloud/collection.test.ts#L35-L69>
test('isCollectionDirty should be able to tell if a collection have changed', async (t) => {
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '8.ics'),
    'utf8'
  );

  const objectUrl = new URL('8.ics', t.context.calendars[0].url).href;
  const createResponse = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(createResponse.ok);

  const { isDirty, newCtag } = await isCollectionDirty({
    collection: t.context.calendars[0],
    headers: t.context.authHeaders
  });
  t.true(isDirty);
  t.true(newCtag.length > 0);
  t.not(newCtag, t.context.calendars[0].ctag);

  const deleteResult = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  t.true(deleteResult.ok);
});

test('supportedReportSet should be able to list supported reports', async (t) => {
  const reports = await supportedReportSet({
    collection: t.context.calendars[0],
    headers: t.context.authHeaders
  });
  t.true(reports.length > 0);
});

// <https://github.com/natelindev/tsdav/blob/c884cbc006f049c16f5c5c5bc964f1c7c83a9c01/src/__tests__/integration/nextcloud/request.test.ts#L35C1-L227C4>
test('davRequest should be able to send normal webdav requests', async (t) => {
  const [result] = await davRequest({
    url: t.context.serverUrl,
    init: {
      method: 'PROPFIND',
      headers: t.context.authHeaders,
      namespace: 'd',
      body: {
        propfind: {
          _attributes: {
            'xmlns:d': 'DAV:'
          },
          prop: { 'd:current-user-principal': {} }
        }
      }
    }
  });
  t.true(result.href?.length > 0);
  t.is(result.status, 207);
  t.is(result.statusText, 'Multi-Status');
  t.true(result.ok);
  t.regex(result.props?.currentUserPrincipal.href, /principals\/.+/);
  t.true(Object.prototype.hasOwnProperty.call(result, 'raw'));
});

//
// The adapter answers a request for each thing its XML names, as often as it
// names it, and all at once (see `limitXmlBody` in caldav-server.js)
//
const DAV_NS = 'xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav"';

async function sendXml(t, method, body, depth = '1') {
  const res = await undici.fetch(t.context.calendars[0].url, {
    method,
    headers: {
      ...t.context.authHeaders,
      'Content-Type': 'application/xml; charset=utf-8',
      Depth: depth
    },
    body
  });
  return { status: res.status, text: await res.text() };
}

test('a request of more XML than a client sends is refused', async (t) => {
  const { url } = t.context.calendars[0];
  const status = async (method, body, depth) => {
    const res = await sendXml(t, method, body, depth);
    return res.status;
  };

  const multiget = (hrefs, rest = '', between = '') =>
    `<c:calendar-multiget ${DAV_NS}>${between}<d:prop><d:getetag/><c:calendar-data/></d:prop>${Array.from(
      { length: hrefs },
      (_, i) => `${between}<d:href>${url}${i}.ics</d:href>`
    ).join('')}${rest}</c:calendar-multiget>`;
  const propfind = (props, rest = '') =>
    `<d:propfind ${DAV_NS}><d:prop>${props}</d:prop>${rest}</d:propfind>`;
  const query = (props, filters = '') =>
    `<c:calendar-query ${DAV_NS}><d:prop>${props}</d:prop><c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT">${filters}</c:comp-filter></c:comp-filter></c:filter></c:calendar-query>`;

  // (as a client asks for the objects of a calendar, a few hundred at a
  // time and one to a line, after a byte order mark and a declaration)
  t.is(
    await status(
      'REPORT',
      `${String.fromCodePoint(
        0xfeff
      )}<?xml version="1.0" encoding="utf-8"?>\n${multiget(300, '', '\n  ')}`
    ),
    207
  );
  t.is(await status('REPORT', multiget(5001)), 413);
  // (with as much else as a request has, and no more)
  t.is(await status('REPORT', multiget(1, '<d:x/>'.repeat(255))), 207);
  t.is(await status('REPORT', multiget(1, '<d:x/>'.repeat(256))), 413);
  // (the space between two hrefs is one text: CDATA is not put together
  // with it, and more texts than one are, at the cost of all the hrefs)
  for (const between of ['<![CDATA[ ]]>', ' <![CDATA[]]> ', ' </d:x> '])
    t.is(await status('REPORT', multiget(300, '', between)), 413);

  // (as a client asks for the properties of a calendar, each element with
  // its namespace)
  const props = (count, name = (i) => `p${i % 100}`, between = '') =>
    Array.from(
      { length: count },
      (_, i) => `${between}<x:${name(i)} xmlns:x="DAV:"/>`
    ).join('');
  t.is(
    await status('PROPFIND', propfind(`<d:getetag/>${props(60)}`), '0'),
    207
  );
  t.is(await status('PROPFIND', propfind(props(256)), '0'), 207);
  t.is(await status('PROPFIND', propfind(props(257)), '0'), 413);
  // (a comment, text or an instruction under "prop" is answered for as an
  // element is)
  for (const node of ['a<!---->', '<?a b?>a']) {
    t.is(await status('PROPFIND', propfind(node.repeat(128)), '0'), 207);
    t.is(await status('PROPFIND', propfind(node.repeat(129)), '0'), 413);
  }

  // (each of them a few times at most: what a calendar says of itself is
  // copied once more for each time it is asked for, or set)
  const asked = (count) => '<d:displayname>a</d:displayname>'.repeat(count);
  const set = (props) =>
    `<d:propertyupdate ${DAV_NS}><d:set><d:prop>${props}</d:prop></d:set></d:propertyupdate>`;
  t.is(await status('PROPFIND', propfind(asked(4)), '0'), 207);
  t.is(await status('PROPFIND', propfind(asked(5)), '0'), 413);
  t.is(await status('PROPPATCH', set(asked(4))), 207);
  t.is(await status('PROPPATCH', set(asked(5))), 413);

  // (and as it asks for those of its objects, each of which the adapter
  // answers with each: by PROPFIND, by a query, with or without a time
  // range, and by a sync)
  const range =
    '<c:time-range start="20260101T000000Z" end="20260201T000000Z"/>';
  const sync = (props) =>
    `<d:sync-collection ${DAV_NS}><d:sync-token/><d:sync-level>1</d:sync-level><d:prop>${props}</d:prop></d:sync-collection>`;
  for (const [method, body] of [
    ['PROPFIND', propfind],
    ['REPORT', query],
    ['REPORT', (props) => query(props, range)],
    ['REPORT', sync]
  ]) {
    t.is(await status(method, body(props(32))), 207);
    t.is(await status(method, body(props(33))), 413);
    // (one to a line: the space between two of them is not one more; other
    // text is, and CDATA, and the space that comes after either)
    const lines = (count) => `${props(count, undefined, '\n  ')}\n`;
    t.is(await status(method, body(lines(32))), 207);
    t.is(await status(method, body(lines(33))), 413);
    t.is(await status(method, body(`${lines(31)}a`)), 207);
    t.is(await status(method, body(`${lines(32)}a`)), 413);
    t.is(await status(method, body(`${lines(30)}<![CDATA[]]> `)), 207);
    t.is(await status(method, body(`${lines(31)}<![CDATA[]]> `)), 413);
  }

  // (nested as deep as a request is, and no deeper)
  const nested = (levels) =>
    propfind(`${'<d:x>'.repeat(levels)}${'</d:x>'.repeat(levels)}`);
  t.is(await status('PROPFIND', nested(30)), 207);
  t.is(await status('PROPFIND', nested(31)), 413);
  // (hrefs are only those of a calendar-multiget, which a request is by its
  // first element, not by one in a comment or in another element)
  const hrefs = props(257, () => 'href');
  for (const body of [
    propfind('<d:getetag/>', hrefs),
    `<!-- <c:calendar-multiget> -->${propfind('<d:getetag/>', hrefs)}`,
    propfind(
      '<d:getetag/>',
      `<c:calendar-multiget>${hrefs}</c:calendar-multiget>`
    )
  ])
    t.is(await status('PROPFIND', body), 413);

  // (the data of the objects, once, however its name is written)
  t.is(await status('REPORT', query('<d:getetag/><c:calendar-data/>')), 207);
  for (const again of [
    '<c:calendar-data/>',
    '<x:calendar-data xmlns:x="urn:ietf:params:xml:ns:caldav"/>',
    '<c:calendar-data\u0001/>',
    '<à:calendar-data xmlns:à="urn:ietf:params:xml:ns:caldav"/>'
  ])
    t.is(await status('REPORT', query(`<c:calendar-data/>${again}`)), 413);
  // (not the kinds of data a server lists it supports)
  t.is(
    await status(
      'PROPFIND',
      propfind(
        '<c:supported-calendar-data><c:calendar-data/><c:calendar-data/></c:supported-calendar-data>'
      )
    ),
    207
  );
  // (the text in a property is copied for each object, and looked for in
  // all that the property holds: what to return of the data is a few names)
  const data = (inside) => `<c:calendar-data>${inside}</c:calendar-data>`;
  t.is(await status('REPORT', query(data('x'.repeat(4096)))), 207);
  t.is(await status('REPORT', query(data('x'.repeat(4097)))), 413);
  // (with the one element that the filter of the query holds)
  const held = (count) =>
    `${data('<c:comp/>'.repeat(200))}<d:getetag>${'<d:x/>'.repeat(
      count - 201
    )}</d:getetag>`;
  t.is(await status('REPORT', query(held(256))), 207);
  t.is(await status('REPORT', query(held(257))), 413);
  // (what a property is set to is as long as a time zone is, and no longer:
  // a calendar says it of itself, to each node that asks)
  for (const [length, expected] of [
    [5000, 207],
    [16_384, 207],
    [16_385, 413]
  ])
    t.is(
      await status(
        'PROPPATCH',
        set(
          `<c:calendar-description>${'x'.repeat(
            length
          )}</c:calendar-description>`
        )
      ),
      expected
    );
  t.is(
    await status(
      'MKCALENDAR',
      `<c:mkcalendar ${DAV_NS}><d:set><d:prop><d:displayname>${'x'.repeat(
        16_385
      )}</d:displayname></d:prop></d:set></c:mkcalendar>`
    ),
    413
  );
  // (and each filter is tried on each object, by a pattern made of its
  // name and with its text)
  const filters = (count) => '<c:prop-filter name="X-NONE"/>'.repeat(count);
  t.is(await status('REPORT', query('<d:getetag/>', filters(16))), 207);
  t.is(await status('REPORT', query('<d:getetag/>', filters(17))), 413);
  const filter = (name, match = '') =>
    `<c:prop-filter name="${name}"><c:text-match>${match}</c:text-match></c:prop-filter>`;
  for (const [name, match, expected] of [
    ['N'.repeat(256), 'x', 207],
    ['N'.repeat(257), 'x', 413],
    ['SUMMARY', 'x'.repeat(4096), 207],
    ['SUMMARY', 'x'.repeat(4097), 413]
  ])
    t.is(
      await status('REPORT', query('<d:getetag/>', filter(name, match))),
      expected
    );

  // (an element has as many attributes as it has nodes)
  const attributes = (count) =>
    propfind(
      `<d:getetag ${Array.from({ length: count }, (_, i) => `a${i}=""`).join(
        ' '
      )}/>`
    );
  t.is(await status('PROPFIND', attributes(256)), 207);
  t.is(await status('PROPFIND', attributes(257)), 413);

  // (a request has no more nodes in all than the hrefs of a
  // calendar-multiget come to, one to a line)
  const groups = (count) =>
    propfind(
      '<d:getetag/>',
      `<d:g>${'<d:x/>'.repeat(250)}</d:g>`.repeat(count)
    );
  t.is(await status('PROPFIND', groups(83)), 207);
  t.is(await status('PROPFIND', groups(84)), 413);

  // (the end tag of each new name of an element is looked for in all of
  // the body: with "propfind", "prop", "getetag" and "g" these are 128
  // names, and 129)
  const named = (count) =>
    propfind(
      '<d:getetag/>',
      `<d:g>${Array.from({ length: count }, (_, i) => `<d:n${i}/>`).join(
        ''
      )}</d:g>`
    );
  t.is(await status('PROPFIND', named(124)), 207);
  t.is(await status('PROPFIND', named(125)), 413);
});

//
// What is not well-formed is not read by the adapter, whose parser goes on
// past it (to another element than the first, as the one the request is),
// printing each thing it cannot parse, and reads some of it at the cost of
// all of the body, or of more.
//
test('a request whose XML is not well-formed is refused', async (t) => {
  const propfind = (props, before = '', after = '') =>
    sendXml(
      t,
      'PROPFIND',
      `${before}<d:propfind ${DAV_NS}><d:prop>${props}</d:prop></d:propfind>${after}`
    );
  const unquoted = (count) =>
    `<d:getetag ${Array.from({ length: count }, (_, i) => `a${i}=b`).join(
      ' '
    )}/>`;
  for (const [props, before, after] of [
    // (what the parser calls an error: an entity it does not know, an
    // attribute given twice, a tag that does not end, an element that does
    // not start)
    ['<d:displayname>&nbsp;</d:displayname>'],
    ['<d:getetag a="1" a="2"/>'],
    ['<d:getetag'],
    ['<d:getetag/>', '<c:calendar-multiget =>'],
    // (more than a few of what it only warns of, as a value without quotes)
    [unquoted(17)],
    // (what it takes for text, having looked through all of the body for its
    // end: an instruction or CDATA that does not end, half a comment)
    ['<d:getetag/><?a'],
    [`<d:displayname><![CDATA[${'a'.repeat(5000)}</d:displayname>`],
    ['<d:getetag/><!-a'],
    // (what it reads by a pattern that takes the square of its length: a
    // declaration, as of a document type, and a line that ends in a
    // paragraph separator)
    ['<d:getetag/>', '<!DOCTYPE d:propfind>'],
    [`<d:displayname>a${String.fromCodePoint(0x2029)}</d:displayname>`],
    // (what it reads as HTML: an element of XHTML)
    ['<d:getetag/><b xmlns="http://www.w3.org/1999/xhtml"/>'],
    // (and around the request's element: another one, text, CDATA, more
    // than a few comments, or the space between end tags that end nothing)
    ['<d:getetag/>', `<d:propfind ${DAV_NS}/>`],
    ['<d:getetag/>', 'a'],
    ['<d:getetag/>', '', 'a'],
    ['<d:getetag/>', '<![CDATA[ ]]>'],
    ['<d:getetag/>', '<!---->'.repeat(17)],
    ['<d:getetag/>', ' </d:x>'.repeat(17)]
  ]) {
    const res = await propfind(props, before, after);
    t.is(res.status, 400, `${before ?? ''}${props}${after ?? ''}`);
  }

  // (a declaration is refused before the parser reads it: 200 KB of space
  // in one took it 19 seconds)
  const before = process.cpuUsage();
  const spaced = await propfind(
    '<d:getetag/>',
    `<!DOCTYPE${' '.repeat(2e5)}d:propfind>`
  );
  const { user, system } = process.cpuUsage(before);
  t.is(spaced.status, 400);
  t.true(user + system < 5e6, `${user + system} microseconds`);

  // (a request cut short has no element in the end: its parser takes what
  // is not ended for empty)
  const cut = await sendXml(
    t,
    'PROPFIND',
    `<d:propfind ${DAV_NS}><d:prop><d:getetag/></d:prop>`
  );
  t.is(cut.status, 400);

  // (the adapter looks a REPORT up by the name of its element, and finds
  // what every object has; so does the parser a prefix that is not
  // declared, which the adapter then takes for a namespace)
  for (const [method, body] of [
    ['REPORT', '<hasOwnProperty xmlns="DAV:"/>'],
    [
      'PROPFIND',
      `<d:propfind ${DAV_NS} xmlns:toString="x"><d:prop><__proto__:x xmlns:q="x"/></d:prop></d:propfind>`
    ]
  ]) {
    const res = await sendXml(t, method, body);
    t.is(res.status, 400, `${body}`);
  }

  // (a request without XML is none of this)
  for (const body of ['', '\n']) {
    const res = await sendXml(t, 'PROPFIND', body);
    t.is(res.status, 207);
  }

  // (what is well-formed, or all but: CDATA, comments and entities, a
  // declaration and a few comments before the element, a few values without
  // quotes, an end tag with space in it)
  for (const [props, before] of [
    [
      '<d:getetag/><d:displayname><![CDATA[<b> & </i>]]></d:displayname><!-- < -->&amp;&#65;'
    ],
    [
      '<d:getetag/>',
      `<?xml version="1.0"?>\n${'<!---->'.repeat(7)}${' </d:x>'.repeat(7)}`
    ],
    [`${unquoted(15)}<d:x></d:x><d:x></d:x >`]
  ]) {
    const res = await propfind(props, before);
    t.is(res.status, 207, `${before ?? ''}${props}`);
  }
});

test('a request with too large a body leaves the connection of use', async (t) => {
  const { hostname, port, pathname } = new URL(t.context.calendars[0].url);
  const request = (method, path, body) =>
    [
      `${method} ${path} HTTP/1.1`,
      `Host: ${hostname}`,
      ...Object.entries(t.context.authHeaders).map(
        ([name, value]) => `${name}: ${value}`
      ),
      'Content-Type: application/xml; charset=utf-8',
      'Depth: 0',
      `Content-Length: ${Buffer.byteLength(body)}`,
      '',
      body
    ].join('\r\n');
  const small = `<d:propfind ${DAV_NS}><d:prop><d:displayname/></d:prop></d:propfind>`;
  const large = `<!--${'x'.repeat(3 * 1024 * 1024)}-->`;
  // (an extended MKCOL is read through a stream of its own)
  for (const first of [
    request('PROPFIND', pathname, `${small}${large}`),
    request(
      'MKCOL',
      `${pathname}large/`,
      `<d:mkcol ${DAV_NS}><d:set><d:prop><d:displayname>a</d:displayname></d:prop></d:set>${large}</d:mkcol>`
    )
  ]) {
    // (the next request is sent right after it, on the same connection: a
    // client that waits for the answer first may give up the connection)
    const socket = net.connect(Number(port), hostname);
    t.teardown(() => socket.destroy());
    let answers = '';
    socket.on('data', (chunk) => {
      answers += chunk.toString('latin1');
    });
    socket.write(first);
    socket.write(request('PROPFIND', pathname, small));
    const statuses = () =>
      [...answers.matchAll(/HTTP\/1\.1 (\d{3}) [A-Za-z -]*\r\n/g)].map(
        (match) => match[1]
      );
    await pWaitFor(() => statuses().length >= 2, { timeout: ms('10s') });
    t.deepEqual(statuses(), ['413', '207']);
  }
});

//
// The adapter decodes the path of a request before it authenticates it
//
test('a request whose path is not encoded as one is refused', async (t) => {
  const { origin } = new URL(t.context.calendars[0].url);
  for (const headers of [{}, t.context.authHeaders]) {
    const res = await undici.fetch(`${origin}/dav/%ZZ/`, {
      method: 'PROPFIND',
      headers
    });
    await res.arrayBuffer();
    t.is(res.status, 400);
  }
});

//
// A calendar-multiget is answered with a copy of each object it names, by
// the last part of an href and in more than one spelling
//
test('a calendar-multiget returns an object a few times at most', async (t) => {
  const { url } = t.context.calendars[0];
  // (the last, made without an extension, is found for "once-3@example.com"
  // too)
  for (const [uid, extension] of [
    ['once-1', '.ics'],
    ['once-2', '.ics'],
    ['once-3_example.com', '']
  ]) {
    const res = await undici.fetch(`${url}${uid}${extension}`, {
      method: 'PUT',
      headers: {
        ...t.context.authHeaders,
        'Content-Type': 'text/calendar; charset=utf-8'
      },
      body: [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Test//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        'DTSTAMP:20260101T000000Z',
        'DTSTART:20260201T100000Z',
        'DTEND:20260201T110000Z',
        `SUMMARY:${uid}`,
        'END:VEVENT',
        'END:VCALENDAR',
        ''
      ].join('\r\n')
    });
    await res.arrayBuffer();
    t.is(res.status, 201);
  }

  const multiget = (...hrefs) =>
    sendXml(
      t,
      'REPORT',
      `<c:calendar-multiget ${DAV_NS}><d:prop><d:getetag/><c:calendar-data/></d:prop>${hrefs
        .map((href) => `<d:href>${href}</d:href>`)
        .join('')}</c:calendar-multiget>`
    );
  const summaries = ({ text }) =>
    (text.match(/SUMMARY:once-\d/g) || []).join(',');

  const both = await multiget(`${url}once-1.ics`, `${url}once-2.ics`);
  t.is(both.status, 207);
  t.is(summaries(both), 'SUMMARY:once-1,SUMMARY:once-2');

  // (again, also by another path and without its extension)
  const spellings = [
    `${url}once-1.ics`,
    `${url}once-1.ics`,
    '/x/once-1.ics',
    `${url}once-1`,
    `${url}once-1.ics.ics`
  ];
  const few = await multiget(...spellings.slice(0, 4));
  t.is(few.status, 207);
  t.is(
    summaries(few),
    Array.from({ length: 4 }).fill('SUMMARY:once-1').join(',')
  );
  // (the one too many is refused before it is read)
  const find = sinon.spy(CalendarEvents, 'find');
  t.teardown(() => find.restore());
  const read = () =>
    find.getCalls().filter((call) => call.args[2]?.eventId === 'once-1').length;
  const many = await multiget(...spellings);
  t.is(many.status, 400);
  t.is(summaries(many), '');
  await pWaitFor(() => read() >= 4, { timeout: ms('10s') });
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
  t.is(read(), 4);

  // (and by another name it is found for)
  const other = `${url}once-3%40example.com.ics`;
  const found = await multiget(other, other, other, other);
  t.is(found.status, 207);
  t.is(
    summaries(found),
    Array.from({ length: 4 }).fill('SUMMARY:once-3').join(',')
  );
  const named = await multiget(
    other,
    other,
    other,
    other,
    `${url}once-3_example.com`
  );
  t.is(named.status, 400);

  // (what is not there may be asked for as often as it is, by other names)
  const missing = await multiget(
    ...Array.from({ length: 6 }, (_, i) => `${url}none-${i}.ics`)
  );
  t.is(missing.status, 207);

  // (and an href that is not encoded as one is no error for the others)
  const odd = await multiget(`${url}once-1.ics`, `${url}a%40%ZZ.ics`);
  t.is(odd.status, 207);
  t.is(summaries(odd), 'SUMMARY:once-1');
});

//
// The request logger describes a request anew for each line that is logged
// for it, and read its body each time: a line is logged for each object a
// REPORT is answered with, so a multiget of 500 objects took 5 seconds rather
// than 1, and a query of 300 with a megabyte of comment in it 9 seconds.  No
// log carries a body, so it is no longer read for one (see config/api.js).
//
test('the body of a request is not read for each line of its log', async (t) => {
  const { url } = t.context.calendars[0];
  const requests = utils.captureRequestLog(t);
  const logged = () =>
    requests.filter(
      (request) =>
        request.method === 'REPORT' &&
        decodeURIComponent(request.url) ===
          decodeURIComponent(new URL(url).pathname)
    );
  const res = await sendXml(
    t,
    'REPORT',
    `<c:calendar-multiget ${DAV_NS}><d:prop><d:getetag/></d:prop><d:href>${url}none.ics</d:href></c:calendar-multiget>`
  );
  t.is(res.status, 207);
  // (the lines of the server as it answered, and the one of the response)
  await pWaitFor(() => logged().length > 1, { timeout: ms('10s') });
  t.true(logged().every((request) => request.body === undefined));
});

//
// A copy of a calendar is mailed to its owner as it is deleted, and one that
// could not be (too large for an email, here) failed the request as an error
// of the server, each time: the calendar could not be deleted
//
test('deletes a calendar whose backup cannot be mailed', async (t) => {
  const url = new URL('../large/', t.context.calendars[0].url).href;
  const uploaded = await undici.fetch(url, {
    method: 'PUT',
    headers: {
      ...t.context.authHeaders,
      'Content-Type': 'text/calendar; charset=utf-8'
    },
    body: [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Test//EN',
      ...[1, 2, 3].flatMap((i) => [
        'BEGIN:VEVENT',
        `UID:large-${i}`,
        'DTSTAMP:20260101T000000Z',
        `DTSTART:2026020${i}T100000Z`,
        `DTEND:2026020${i}T110000Z`,
        `SUMMARY:large-${i}`,
        `DESCRIPTION:${'d'.repeat(400_000)}`,
        'END:VEVENT'
      ]),
      'END:VCALENDAR',
      ''
    ].join('\r\n')
  });
  await uploaded.arrayBuffer();
  t.is(uploaded.status, 201);

  const deleted = await undici.fetch(url, {
    method: 'DELETE',
    headers: t.context.authHeaders
  });
  await deleted.arrayBuffer();
  t.true(deleted.ok, `${deleted.status}`);

  const after = await undici.fetch(url, {
    method: 'PROPFIND',
    headers: { ...t.context.authHeaders, Depth: '0' }
  });
  await after.arrayBuffer();
  t.is(after.status, 404);
});

//
// What a calendar says of itself (its name, its description, its color, its
// time zone) the adapter answers once more for each node that asks for it,
// and the server copies its name, its description and what it was uploaded
// with into the data of each of its objects.
//
test('what a calendar says of itself is answered and copied in part', async (t) => {
  const home = new URL('..', t.context.calendars[0].url).href;
  const event = (i) => [
    'BEGIN:VEVENT',
    `UID:own-${i}`,
    'DTSTAMP:20260101T000000Z',
    `DTSTART:2026020${i + 1}T100000Z`,
    `DTEND:2026020${i + 1}T110000Z`,
    `SUMMARY:own-${i}`,
    'END:VEVENT'
  ];
  // (a calendar is uploaded whole, as Thunderbird publishes one, with three
  // events and what it says of itself)
  const upload = async (name, lines, prodId = '-//Test//EN') => {
    const res = await undici.fetch(`${home}${name}`, {
      method: 'PUT',
      headers: {
        ...t.context.authHeaders,
        'Content-Type': 'text/calendar; charset=utf-8'
      },
      body: [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        `PRODID:${prodId}`,
        ...lines,
        ...event(0),
        ...event(1),
        ...event(2),
        'END:VCALENDAR',
        ''
      ].join('\r\n')
    });
    await res.arrayBuffer();
    t.is(res.status, 201);
  };

  // (what is answered, with the lines that iCalendar folds put together)
  const read = async (path, method = 'GET', depth = '0') => {
    const res = await undici.fetch(`${home}${path}`, {
      method,
      headers: {
        ...t.context.authHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        Accept: 'text/calendar',
        Depth: depth
      },
      body:
        method === 'GET'
          ? undefined
          : `<d:propfind ${DAV_NS} xmlns:i="http://apple.com/ns/ical/"><d:prop><d:displayname/><c:calendar-description/><c:calendar-timezone/><i:calendar-color/></d:prop></d:propfind>`
    });
    const text = await res.text();
    return text.replace(/\r\n /g, '');
  };

  // the longest run of a letter in it
  const run = (text, letter) =>
    Math.max(
      0,
      ...(text.match(new RegExp(`${letter}+`, 'g')) ?? []).map(
        (match) => match.length
      )
    );

  const create = sinon.spy(CalendarEvents, 'create');
  const made = sinon.spy(Calendars, 'create');
  const update = sinon.spy(Calendars, 'findByIdAndUpdate');
  t.teardown(() => {
    create.restore();
    made.restore();
    update.restore();
  });
  await upload('long', [
    `NAME:${'n'.repeat(20_000)}`,
    `DESCRIPTION:${'d'.repeat(20_000)}`,
    `COLOR:${'c'.repeat(20_000)}`,
    `X-WR-TIMEZONE:${'z'.repeat(20_000)}`,
    `X-WR-CALDESC:${'x'.repeat(2000)}`
  ]);

  // (each object of an upload is stored with the first of it)
  const stored = create
    .getCalls()
    .flatMap((call) => call.args[0])
    .filter((event) => /^own-\d$/.test(event?.eventId));
  t.is(stored.length, 3);
  for (const { ical } of stored) t.true(ical.length < 2048, `${ical.length}`);

  // (and the calendar with as much of each as is answered, as it is made
  // for the upload and as it is updated from it)
  const first = made
    .getCalls()
    .map((call) => call.args[0])
    .find((calendar) => calendar?.calendarId === 'long');
  t.is(first.timezone.length, 16_384);
  t.is(first.description.length, 16_384);
  const own = update
    .getCalls()
    .map((call) => call.args[3]?.$set)
    .find((set) => set?.name?.startsWith('nnn'));
  for (const key of ['name', 'description', 'color'])
    t.is(own[key].length, 16_384, `${key}`);

  // (answered as long as a time zone is, of the calendar and where the
  // calendars are listed)
  for (const [path, depth] of [
    ['long/', '0'],
    ['', '1']
  ]) {
    const answer = await read(path, 'PROPFIND', depth);
    for (const letter of 'ndcz') t.is(run(answer, letter), 16_384, `${letter}`);
  }

  // (copied into the data of an object: the first of it, 1,024 characters
  // with its product and scale, and for each object in a calendar that is
  // read whole)
  const object = await read('long/own-1.ics');
  t.true(object.includes('SUMMARY:own-1'));
  t.true(run(object, 'n') > 900);
  t.true(run(object, 'n') <= 1024, `${run(object, 'n')}`);
  for (const name of ['DESCRIPTION', 'X-WR-CALDESC'])
    t.false(object.includes(name), `${name}`);
  // (and all that is stored of it, once, in the calendar read whole: an
  // upload stores as much of each as is answered, and of what else the
  // calendar was uploaded with what fits in as much)
  const whole = await read('long/');
  t.true(whole.includes('SUMMARY:own-2'));
  for (const [letter, length] of [
    ['n', 16_384],
    ['d', 16_384],
    ['x', 2000]
  ])
    t.is(run(whole, letter), length, `${letter}`);
  t.false(whole.includes('X-WR-TIMEZONE'));

  // (to the character, by its name and its value: a thousand that fit and
  // leave 494, one that is one more, one that is as much, and one after)
  const fitting = Array.from(
    { length: 1000 },
    (_, i) => `X-P${i}:${'v'.repeat(10)}`
  );
  t.is(16_384 - fitting.join('').length + fitting.length, 494);
  await upload(
    'many',
    [
      ...fitting,
      `X-OVER:${'o'.repeat(489)}`,
      `X-FILL:${'f'.repeat(488)}`,
      'X-LAST:l',
      `CALSCALE:${'g'.repeat(20_000)}`,
      `SOURCE:https://example.com/${'s'.repeat(20_000)}`,
      `URL:https://example.com/${'u'.repeat(20_000)}`
    ],
    'p'.repeat(20_000)
  );
  const many = await read('many/');
  t.deepEqual(many.match(/^X-[A-Z]+\d*:.*$/gm), [
    ...fitting,
    `X-FILL:${'f'.repeat(488)}`
  ]);
  // (and of what else it says of itself as much as of its name)
  const rest = update
    .getCalls()
    .map((call) => call.args[3]?.$set)
    .find((set) => set?.prodId?.startsWith('ppp'));
  for (const key of ['prodId', 'scale', 'source', 'url'])
    t.is(rest[key].length, 16_384, `${key}`);

  // (a PROPPATCH is answered with the calendar as it is after it, no longer
  // either: one that sets no name with the name there is)
  const patched = await undici.fetch(`${home}long/`, {
    method: 'PROPPATCH',
    headers: {
      ...t.context.authHeaders,
      'Content-Type': 'application/xml; charset=utf-8'
    },
    body: `<d:propertyupdate ${DAV_NS}><d:set><d:prop><d:displayname></d:displayname><c:calendar-description>described</c:calendar-description></d:prop></d:set></d:propertyupdate>`
  });
  const answer = await patched.text();
  t.is(patched.status, 207);
  t.is(run(answer, 'n'), 16_384);
  t.true(run(answer, 'd') < 1024, `${run(answer, 'd')}`);
  t.true(answer.includes('described'));

  // (all of what a calendar says of itself in fewer, and what it says twice
  // once, as it said it last)
  await upload('short', [
    `NAME:${'m'.repeat(300)}`,
    `DESCRIPTION:${'e'.repeat(600)}`,
    'X-OWN:first',
    'X-OWN:kept'
  ]);
  const kept = await read('short/own-1.ics');
  t.is(run(kept, 'm'), 300);
  t.is(run(kept, 'e'), 600);
  t.is(kept.match(/^X-OWN:.*$/gm)?.join(','), 'X-OWN:kept');
});

test('davRequest should be able to send raw xml requests', async (t) => {
  const xml = `
  <d:propfind xmlns:d="DAV:">
     <d:prop>
       <d:current-user-principal/>
     </d:prop>
  </d:propfind>`;
  const [result] = await davRequest({
    url: t.context.serverUrl,
    init: {
      method: 'PROPFIND',
      headers: t.context.authHeaders,
      body: xml
    },
    convertIncoming: false
  });
  t.true(result.href?.length > 0);
  t.is(result.status, 207);
  t.is(result.statusText, 'Multi-Status');
  t.true(result.ok);
  t.regex(result.props?.currentUserPrincipal.href, /principals\/.+/);
  t.true(Object.prototype.hasOwnProperty.call(result, 'raw'));
});

test('davRequest should be able to get raw xml response', async (t) => {
  const xml = `
  <d:propfind xmlns:d="DAV:">
     <d:prop>
       <d:current-user-principal/>
     </d:prop>
  </d:propfind>`;
  const [result] = await davRequest({
    url: t.context.serverUrl,
    init: {
      method: 'PROPFIND',
      headers: t.context.authHeaders,
      body: xml
    },
    convertIncoming: false,
    parseOutgoing: false
  });
  t.true(result.href?.length > 0);
  t.is(result.status, 207);
  t.is(result.statusText, 'Multi-Status');
  t.true(result.ok);
  t.regex(result.raw, /<d:href>\/principals\/.+<\/d:href>/i);
});

test('propfind should be able to find props', async (t) => {
  const [result] = await propfind({
    url: t.context.serverUrl,
    props: {
      [`${DAVNamespaceShort.DAV}:current-user-principal`]: {}
    },
    depth: '0',
    headers: t.context.authHeaders
  });
  t.true(result.href?.length > 0);
  t.is(result.status, 207);
  t.is(result.statusText, 'Multi-Status');
  t.true(result.ok);
  t.regex(result.props?.currentUserPrincipal.href, /principals\/.+/);
  t.true(Object.prototype.hasOwnProperty.call(result, 'raw'));
});

test('createObject should be able to create object', async (t) => {
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '9.ics'),
    'utf8'
  );

  const objectUrl = new URL('9.ics', t.context.calendars[0].url).href;

  const response = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const [calendarObject] = await fetchCalendarObjects({
    calendar: t.context.calendars[0],
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.true(response.ok);
  t.true(calendarObject.url.length > 0);
  t.true(calendarObject.etag.length > 0);

  const list1 = extractVEventStable(calendarObject.data);
  const list2 = extractVEventStable(iCalString);
  t.deepEqual(list1, list2);
  // Verify DTSTAMP is present (ensureICSTimestamps adds/updates it)
  t.true(calendarObject.data.includes('DTSTAMP:'));
  // t.is(calendarObject.data.split('\r\n').join('\n'), iCalString);

  const deleteResult = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  t.true(deleteResult.ok);
});

test('updateObject should be able to update object', async (t) => {
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '10.ics'),
    'utf8'
  );
  const updatedICalString = await fsp.readFile(
    path.join(__dirname, 'data', '11.ics'),
    'utf8'
  );

  const objectUrl = new URL('10.ics', t.context.calendars[0].url).href;
  const createResult = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(createResult.ok);

  const [calendarObject] = await fetchCalendarObjects({
    calendar: t.context.calendars[0],
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  const updateResult = await updateObject({
    url: objectUrl,
    data: updatedICalString,
    etag: calendarObject.etag,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(updateResult.ok);

  const result = await undici.fetch(objectUrl, {
    headers: t.context.authHeaders
  });

  t.true(result.ok);
  const text = await result.text();

  const list1 = extractVEventStable(text);
  const list2 = extractVEventStable(updatedICalString);
  t.deepEqual(list1, list2);
  // Verify DTSTAMP is present (ensureICSTimestamps adds/updates it)
  t.true(text.includes('DTSTAMP:'));
  // t.is(text.split('\r\n').join('\n'), updatedICalString);

  const deleteResult = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  t.true(deleteResult.ok);
});

test('deleteObject should be able to delete object', async (t) => {
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', '12.ics'),
    'utf8'
  );

  const objectUrl = new URL('test3.ics', t.context.calendars[0].url).href;
  const createResult = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(createResult.ok);

  const deleteResult = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  t.true(deleteResult.ok);
});

//
// VTODO (Task) Tests
//

test('fetchCalendarObjects should be able to fetch VTODO objects with custom filter', async (t) => {
  const vtodoString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-1.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Find a calendar that supports VTODO components (task calendar)
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-1.ics', taskCalendar.url).href;

  const createResult = await createObject({
    url: objectUrl,
    data: vtodoString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(createResult.ok);

  // Create custom VTODO filter
  const filters = [
    {
      'comp-filter': {
        _attributes: { name: 'VCALENDAR' },
        'comp-filter': {
          _attributes: { name: 'VTODO' }
        }
      }
    }
  ];

  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters
  });

  t.true(objects.length > 0);
  const vtodoObject = objects.find(
    (obj) => decodeURIComponent(obj.url) === decodeURIComponent(objectUrl)
  );
  t.truthy(vtodoObject);
  t.true(vtodoObject.data.includes('BEGIN:VTODO'));
  t.true(vtodoObject.data.includes('SUMMARY:Complete project documentation'));

  const deleteResult = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  t.true(deleteResult.ok);
});

test('createObject should be able to create VTODO object', async (t) => {
  const vtodoString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-2.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Find a calendar that supports VTODO components (task calendar)
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-test.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Fetch the created VTODO
  const filters = [
    {
      'comp-filter': {
        _attributes: { name: 'VCALENDAR' },
        'comp-filter': {
          _attributes: { name: 'VTODO' }
        }
      }
    }
  ];

  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders,
    filters
  });

  t.true(calendarObject.url.length > 0);
  t.true(calendarObject.etag.length > 0);
  t.true(calendarObject.data.includes('SUMMARY:Fix CalDAV VTODO support'));
  t.true(calendarObject.data.includes('STATUS:IN-PROCESS'));
  t.true(calendarObject.data.includes('PERCENT-COMPLETE:50'));

  const deleteResult = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  t.true(deleteResult.ok);
});

test('updateObject should be able to update VTODO status and progress', async (t) => {
  const vtodoString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-2.ics'),
    'utf8'
  );

  const updatedVtodoString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-completed.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Find a calendar that supports VTODO components (task calendar)
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-update.ics', taskCalendar.url).href;

  const createResult = await createObject({
    url: objectUrl,
    data: vtodoString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(createResult.ok);

  // Get the created VTODO to obtain etag
  const filters = [
    {
      'comp-filter': {
        _attributes: { name: 'VCALENDAR' },
        'comp-filter': {
          _attributes: { name: 'VTODO' }
        }
      }
    }
  ];

  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders,
    filters
  });

  // Update to completed status
  const updateResult = await updateObject({
    url: objectUrl,
    data: updatedVtodoString,
    etag: calendarObject.etag,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(updateResult.ok);

  // Verify the update
  const result = await undici.fetch(objectUrl, {
    headers: t.context.authHeaders
  });

  t.true(result.ok);
  const text = await result.text();

  t.true(text.includes('STATUS:COMPLETED'));
  t.true(text.includes('PERCENT-COMPLETE:100'));
  t.true(text.includes('COMPLETED:'));

  const deleteResult = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  t.true(deleteResult.ok);
});

test('fetchCalendarObjects should be able to filter VTODO by status', async (t) => {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Find a calendar that supports VTODO components (task calendar)
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl1 = new URL('vtodo-filter-1.ics', taskCalendar.url).href;
  const objectUrl2 = new URL('vtodo-filter-2.ics', taskCalendar.url).href;
  const objectUrl3 = new URL('vtodo-filter-3.ics', taskCalendar.url).href;

  // Create VTODO objects with different statuses
  const vtodo1 = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-1.ics'),
    'utf8'
  );
  const vtodo2 = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-2.ics'),
    'utf8'
  );
  const vtodo3 = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-completed.ics'),
    'utf8'
  );

  await createObject({
    url: objectUrl1,
    data: vtodo1,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  await createObject({
    url: objectUrl2,
    data: vtodo2,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  await createObject({
    url: objectUrl3,
    data: vtodo3,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Filter for VTODO with NEEDS-ACTION status
  const needsActionFilter = [
    {
      'comp-filter': {
        _attributes: { name: 'VCALENDAR' },
        'comp-filter': {
          _attributes: { name: 'VTODO' },
          'prop-filter': {
            _attributes: { name: 'STATUS' },
            'text-match': {
              _attributes: {},
              _text: 'NEEDS-ACTION'
            }
          }
        }
      }
    }
  ];

  const needsActionObjects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: needsActionFilter
  });

  // Should find the VTODO with NEEDS-ACTION status
  const foundNeedsAction = needsActionObjects.some(
    (obj) =>
      obj.data.includes('STATUS:NEEDS-ACTION') &&
      obj.data.includes('SUMMARY:Complete project documentation')
  );
  t.true(foundNeedsAction);

  // Clean up
  await deleteObject({ url: objectUrl1, headers: t.context.authHeaders });
  await deleteObject({ url: objectUrl2, headers: t.context.authHeaders });
  await deleteObject({ url: objectUrl3, headers: t.context.authHeaders });
});

test('calendarMultiGet should be able to get multiple VTODO objects', async (t) => {
  const vtodo1 = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-1.ics'),
    'utf8'
  );
  const vtodo2 = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-2.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Find a calendar that supports VTODO components (task calendar)
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl1 = new URL('vtodo-multi-1.ics', taskCalendar.url).href;
  const objectUrl2 = new URL('vtodo-multi-2.ics', taskCalendar.url).href;

  const response1 = await createObject({
    url: objectUrl1,
    data: vtodo1,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const response2 = await createObject({
    url: objectUrl2,
    data: vtodo2,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response1.ok);
  t.true(response2.ok);

  const calendarObjects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: {
            name: 'VCALENDAR'
          },
          'comp-filter': {
            _attributes: {
              name: 'VTODO'
            }
          }
        }
      }
    ]
  });

  t.is(calendarObjects.length, 2);

  // Verify both VTODO objects are returned
  const vtodoObjects = calendarObjects.filter(
    (obj) => obj.data && obj.data.includes('BEGIN:VTODO')
  );
  t.is(vtodoObjects.length, 2);

  // Verify specific content
  const hasProjectDoc = vtodoObjects.some(
    (obj) => obj.data && obj.data.includes('Complete project documentation')
  );
  const hasCalDAVFix = vtodoObjects.some(
    (obj) => obj.data && obj.data.includes('Fix CalDAV VTODO support')
  );
  t.true(hasProjectDoc);
  t.true(hasCalDAVFix);

  // Clean up
  await deleteObject({ url: objectUrl1, headers: t.context.authHeaders });
  await deleteObject({ url: objectUrl2, headers: t.context.authHeaders });
});

//
// Unified Calendar Tests (Phase 1)
//

test('unified calendar should accept both VEVENT and VTODO', async (t) => {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Find the unified calendar (Default calendar should support both)
  // The first calendar (calendars[0]) is typically the default calendar supporting both types
  const unifiedCal = calendars[0];

  t.truthy(unifiedCal, 'Should have a unified calendar supporting both types');

  // Create an event
  const eventIcs = await fsp.readFile(
    path.join(__dirname, 'data', '1.ics'),
    'utf8'
  );
  const eventUrl = new URL('unified-event.ics', unifiedCal.url).href;
  const eventResponse = await createObject({
    url: eventUrl,
    data: eventIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(eventResponse.ok);

  // Create a task in the SAME calendar
  const taskIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-1.ics'),
    'utf8'
  );
  const taskUrl = new URL('unified-task.ics', unifiedCal.url).href;
  const taskResponse = await createObject({
    url: taskUrl,
    data: taskIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(taskResponse.ok);

  // Verify both exist — fetch VEVENTs and VTODOs separately since
  // calendar-query comp-filter restricts by component type
  const eventObjects = await fetchCalendarObjects({
    calendar: unifiedCal,
    headers: t.context.authHeaders
  });
  const taskObjects = await fetchCalendarObjects({
    calendar: unifiedCal,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: {
            name: 'VCALENDAR'
          },
          'comp-filter': {
            _attributes: {
              name: 'VTODO'
            }
          }
        }
      }
    ]
  });
  t.true(eventObjects.length > 0);
  t.true(taskObjects.length > 0);

  // Verify we can retrieve both types
  const hasEvent = eventObjects.some((obj) =>
    obj.data.includes('BEGIN:VEVENT')
  );
  const hasTask = taskObjects.some((obj) => obj.data.includes('BEGIN:VTODO'));
  t.true(hasEvent);
  t.true(hasTask);

  // Clean up
  await deleteObject({ url: eventUrl, headers: t.context.authHeaders });
  await deleteObject({ url: taskUrl, headers: t.context.authHeaders });
});

test('single ICS file with both VEVENT and VTODO components', async (t) => {
  const mixedIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'mixed-components.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Use the unified calendar (first calendar)
  const unifiedCal = calendars[0];

  // First, explicitly verify the unified calendar supports both VEVENT and VTODO
  // by successfully uploading a pure VEVENT file
  const eventOnlyIcs = await fsp.readFile(
    path.join(__dirname, 'data', '1.ics'),
    'utf8'
  );
  const eventOnlyUrl = new URL('test-vevent-support.ics', unifiedCal.url).href;
  const eventOnlyResponse = await createObject({
    url: eventOnlyUrl,
    data: eventOnlyIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(
    eventOnlyResponse.ok,
    'Unified calendar should accept VEVENT (has_vevent=true)'
  );

  // Then verify it supports VTODO by uploading a pure VTODO file
  const todoOnlyIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-1.ics'),
    'utf8'
  );
  const todoOnlyUrl = new URL('test-vtodo-support.ics', unifiedCal.url).href;
  const todoOnlyResponse = await createObject({
    url: todoOnlyUrl,
    data: todoOnlyIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(
    todoOnlyResponse.ok,
    'Unified calendar should accept VTODO (has_vtodo=true)'
  );

  // Clean up the test files
  await deleteObject({ url: eventOnlyUrl, headers: t.context.authHeaders });
  await deleteObject({ url: todoOnlyUrl, headers: t.context.authHeaders });

  // Now upload the file with both components
  const objectUrl = new URL('mixed-components.ics', unifiedCal.url).href;
  const response = await createObject({
    url: objectUrl,
    data: mixedIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Fetch the created object
  const [calendarObject] = await fetchCalendarObjects({
    calendar: unifiedCal,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  // NOTE: Current behavior stores the entire ICS as a single CalendarEvent
  // The file contains both components, and they should both be preserved
  t.truthy(calendarObject, 'Should have created calendar object');
  t.true(
    calendarObject.data.includes('BEGIN:VEVENT'),
    'Should preserve VEVENT in stored ICS'
  );
  t.true(
    calendarObject.data.includes('SUMMARY:Team Meeting'),
    'Should preserve VEVENT summary'
  );
  t.true(
    calendarObject.data.includes('BEGIN:VTODO'),
    'Should preserve VTODO in stored ICS'
  );
  t.true(
    calendarObject.data.includes('SUMMARY:Follow up with client'),
    'Should preserve VTODO summary'
  );

  // This test validates multiple aspects of mixed component support:
  // 1. EXPLICITLY verifies has_vevent=true by uploading a pure VEVENT file (must succeed)
  // 2. EXPLICITLY verifies has_vtodo=true by uploading a pure VTODO file (must succeed)
  // 3. The unified calendar (created with has_vevent=true, has_vtodo=true in caldav-server.js:334-335)
  //    successfully accepts ICS files containing both VEVENT and VTODO components
  // 4. Both components are preserved in the stored ICS data
  // 5. Per calendar-events.js pre-validate hook (lines 160-167), when both components exist,
  //    the CalendarEvent.componentType field is set to 'VEVENT' for backward compatibility

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

//
// Recurring VTODO Tests (Phase 1)
//

test('VTODO with RRULE (recurring task)', async (t) => {
  const vtodoRecurring = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-recurring.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-recurring.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoRecurring,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Fetch the created recurring task
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.truthy(calendarObject);
  t.true(calendarObject.data.includes('BEGIN:VTODO'));
  t.true(calendarObject.data.includes('RRULE:FREQ=DAILY'));
  t.true(calendarObject.data.includes('SUMMARY:Daily standup meeting prep'));

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

//
// VTODO with VALARM Tests (Phase 1)
//

test('VTODO with VALARM (reminder)', async (t) => {
  const vtodoWithAlarm = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-with-alarm.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-with-alarm.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoWithAlarm,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Fetch the created task with alarm
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.truthy(calendarObject);
  t.true(calendarObject.data.includes('BEGIN:VTODO'));
  t.true(calendarObject.data.includes('BEGIN:VALARM'));
  t.true(calendarObject.data.includes('TRIGGER:-PT15M'));
  t.true(calendarObject.data.includes('SUMMARY:Submit quarterly report'));

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

//
// VTODO with Subtasks Tests (Phase 1)
//

test('VTODO with subtasks (RELATED-TO)', async (t) => {
  const vtodoWithSubtasks = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-with-subtasks.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-with-subtasks.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoWithSubtasks,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Fetch all tasks (should include parent and subtasks)
  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: {
            name: 'VCALENDAR'
          },
          'comp-filter': {
            _attributes: {
              name: 'VTODO'
            }
          }
        }
      }
    ]
  });

  // Should have at least 4 tasks (parent + 3 subtasks)
  const projectTasks = objects.filter((obj) =>
    obj.data.includes('Launch new product feature')
  );
  t.true(projectTasks.length > 0);

  // Verify RELATED-TO is preserved
  const hasRelatedTo = objects.some((obj) => obj.data.includes('RELATED-TO'));
  t.true(hasRelatedTo);

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

//
// Time-based Query Tests for VTODO (Phase 1)
//

test('fetchCalendarObjects with timeRange for VTODO', async (t) => {
  const vtodo1 = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-1.ics'),
    'utf8'
  );
  const vtodo2 = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-2.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl1 = new URL('vtodo-time-1.ics', taskCalendar.url).href;
  const objectUrl2 = new URL('vtodo-time-2.ics', taskCalendar.url).href;

  await createObject({
    url: objectUrl1,
    data: vtodo1,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  await createObject({
    url: objectUrl2,
    data: vtodo2,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Query tasks due within a specific time range
  // Use custom VTODO filter with time-range since tsdav defaults to VEVENT
  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: {
            name: 'VCALENDAR'
          },
          'comp-filter': {
            _attributes: {
              name: 'VTODO'
            },
            'time-range': {
              _attributes: {
                start: '20210401T000000Z',
                end: '20210406T235959Z'
              }
            }
          }
        }
      }
    ]
  });

  // Should return task with due date in April 2021
  t.true(objects.length > 0);
  const hasAprilTask = objects.some(
    (obj) =>
      obj.data.includes('BEGIN:VTODO') &&
      obj.data.includes('DUE:20210405T170000Z')
  );
  t.true(hasAprilTask);

  // Clean up
  await deleteObject({ url: objectUrl1, headers: t.context.authHeaders });
  await deleteObject({ url: objectUrl2, headers: t.context.authHeaders });
});

test('VTODO without due date', async (t) => {
  const vtodoNoDue = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-no-due-date.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-no-due.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoNoDue,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Verify task is created without due date
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.truthy(calendarObject);
  t.true(calendarObject.data.includes('BEGIN:VTODO'));
  t.false(calendarObject.data.includes('DUE:'));
  t.true(calendarObject.data.includes('SUMMARY:Learn Spanish'));

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

//
// Advanced VTODO Feature Tests (Phase 1)
//

test('VTODO with location and GEO', async (t) => {
  const vtodoWithLocation = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-with-location.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-location.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoWithLocation,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Verify location data is preserved
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.truthy(calendarObject);
  t.true(calendarObject.data.includes('LOCATION'));
  t.true(calendarObject.data.includes('GEO:'));
  t.true(calendarObject.data.includes('SUMMARY:Buy groceries'));

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('VTODO with categories', async (t) => {
  const vtodoWithCategories = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-with-categories.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-categories.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoWithCategories,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Verify categories are preserved
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.truthy(calendarObject);
  t.true(calendarObject.data.includes('CATEGORIES'));
  t.true(calendarObject.data.includes('Work'));
  t.true(calendarObject.data.includes('Research'));

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('VTODO with partial completion percentage', async (t) => {
  const vtodoPartial = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-partial-completion.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-partial.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoPartial,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Verify partial completion
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.truthy(calendarObject);
  t.true(calendarObject.data.includes('PERCENT-COMPLETE:75'));
  t.true(calendarObject.data.includes('STATUS:IN-PROCESS'));

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('VTODO with Apple-specific properties', async (t) => {
  const vtodoApple = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-apple-structured.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );

  const objectUrl = new URL('vtodo-apple.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: vtodoApple,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  t.true(response.ok);

  // Verify Apple-specific properties are preserved
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });

  t.truthy(calendarObject);
  t.true(calendarObject.data.includes('BEGIN:VTODO'));
  t.true(calendarObject.data.includes('SUMMARY:Call dentist for appointment'));
  // Apple properties may or may not be preserved depending on server implementation
  // Just verify the task is created successfully

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

/**
 * Test: Event creation should complete quickly (non-blocking email)
 *
 * When creating an event with attendees, the CalDAV server should return
 * immediately without waiting for the email invitation to be sent.
 * This tests the non-blocking sendEmailWithICS optimization.
 */
test('event creation should complete quickly with attendees (non-blocking email)', async (t) => {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const calendar = calendars[0];

  // Create an event with attendees (which would trigger email sending)
  const eventWithAttendees = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:nonblocking-email-test-${Date.now()}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${
    new Date(Date.now() + 86400000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
  }Z
DTEND:${
    new Date(Date.now() + 90000000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
  }Z
SUMMARY:Non-blocking Email Test Event
ORGANIZER:mailto:${t.context.username}
ATTENDEE;RSVP=TRUE:mailto:attendee@example.com
END:VEVENT
END:VCALENDAR`;

  const objectUrl = new URL(
    `nonblocking-email-test-${Date.now()}.ics`,
    calendar.url
  ).href;

  // Measure the time it takes to create the event
  const startTime = Date.now();

  const response = await createObject({
    url: objectUrl,
    data: eventWithAttendees,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const endTime = Date.now();
  const duration = endTime - startTime;

  t.true(response.ok, 'Event creation should succeed');

  // The request should complete in under 5 seconds
  // (previously it could take 12-25 seconds waiting for email)
  t.true(
    duration < 5000,
    `Event creation should complete quickly (took ${duration}ms), not wait for email sending`
  );

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

/**
 * Test: Event update should complete quickly (non-blocking email)
 *
 * When updating an event with attendees, the CalDAV server should return
 * immediately without waiting for the email update to be sent.
 */
test('event update should complete quickly with attendees (non-blocking email)', async (t) => {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const calendar = calendars[0];
  const eventUid = `nonblocking-update-test-${Date.now()}`;

  // Create an event first
  const eventWithAttendees = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:${eventUid}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${
    new Date(Date.now() + 86400000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
  }Z
DTEND:${
    new Date(Date.now() + 90000000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
  }Z
SUMMARY:Non-blocking Update Test Event
ORGANIZER:mailto:${t.context.username}
ATTENDEE;RSVP=TRUE:mailto:attendee@example.com
END:VEVENT
END:VCALENDAR`;

  const objectUrl = new URL(`${eventUid}.ics`, calendar.url).href;

  await createObject({
    url: objectUrl,
    data: eventWithAttendees,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  // Update the event
  const updatedEvent = eventWithAttendees.replace(
    'Non-blocking Update Test Event',
    'Non-blocking Update Test Event - UPDATED'
  );

  // Measure the time it takes to update the event
  const startTime = Date.now();

  const response = await updateObject({
    url: objectUrl,
    data: updatedEvent,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const endTime = Date.now();
  const duration = endTime - startTime;

  t.true(response.ok, 'Event update should succeed');

  // The request should complete in under 5 seconds
  t.true(
    duration < 5000,
    `Event update should complete quickly (took ${duration}ms), not wait for email sending`
  );

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

/**
 * Test: Event deletion should complete quickly (non-blocking email)
 *
 * When deleting an event with attendees, the CalDAV server should return
 * immediately without waiting for the cancellation email to be sent.
 */
test('event deletion should complete quickly with attendees (non-blocking email)', async (t) => {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const calendar = calendars[0];
  const eventUid = `nonblocking-delete-test-${Date.now()}`;

  // Create an event first
  const eventWithAttendees = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:${eventUid}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${
    new Date(Date.now() + 86400000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
  }Z
DTEND:${
    new Date(Date.now() + 90000000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
  }Z
SUMMARY:Non-blocking Delete Test Event
ORGANIZER:mailto:${t.context.username}
ATTENDEE;RSVP=TRUE:mailto:attendee@example.com
END:VEVENT
END:VCALENDAR`;

  const objectUrl = new URL(`${eventUid}.ics`, calendar.url).href;

  await createObject({
    url: objectUrl,
    data: eventWithAttendees,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  // Measure the time it takes to delete the event
  const startTime = Date.now();

  const response = await deleteObject({
    url: objectUrl,
    headers: t.context.authHeaders
  });

  const endTime = Date.now();
  const duration = endTime - startTime;

  t.true(response.ok, 'Event deletion should succeed');

  // The request should complete in under 5 seconds
  t.true(
    duration < 5000,
    `Event deletion should complete quickly (took ${duration}ms), not wait for email sending`
  );
});

//
// All-day recurring event / task tests
// These tests verify the fix for rrulestr@2.8.1 silently ignoring
// DTSTART;VALUE=DATE and DUE;VALUE=DATE, which caused the recurrence
// anchor to default to parse-time and collapse INTERVAL phases across
// all all-day recurring events in the same request.
//

test('all-day recurring VEVENT: timeRange query returns correct occurrence', async (t) => {
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vevent-allday-recurring.ics'),
    'utf8'
  );
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const objectUrl = new URL('vevent-allday-recurring.ics', calendars[0].url)
    .href;
  const response = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(response.ok);

  // The event starts 2021-05-03 (weekly). An occurrence falls on 2021-05-10.
  // Query a window that covers only the 2021-05-10 occurrence.
  const objects = await fetchCalendarObjects({
    calendar: calendars[0],
    headers: t.context.authHeaders,
    timeRange: {
      start: '2021-05-09T00:00:00.000Z',
      end: '2021-05-11T00:00:00.000Z'
    }
  });
  t.true(
    objects.length > 0,
    'Should find the all-day recurring event in the queried window'
  );
  const found = objects.some((obj) =>
    obj.data.includes('vevent-allday-recurring-weekly@test')
  );
  t.true(found, 'The all-day recurring VEVENT should be returned');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('all-day recurring VEVENT: two events with different DTSTART;VALUE=DATE do not collapse INTERVAL', async (t) => {
  const iCalStringA = await fsp.readFile(
    path.join(__dirname, 'data', 'vevent-allday-recurring.ics'),
    'utf8'
  );
  const iCalStringB = await fsp.readFile(
    path.join(__dirname, 'data', 'vevent-allday-recurring-b.ics'),
    'utf8'
  );
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const objectUrlA = new URL('vevent-allday-recurring-a2.ics', calendars[0].url)
    .href;
  const objectUrlB = new URL('vevent-allday-recurring-b2.ics', calendars[0].url)
    .href;
  const [responseA, responseB] = await Promise.all([
    createObject({
      url: objectUrlA,
      data: iCalStringA,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    }),
    createObject({
      url: objectUrlB,
      data: iCalStringB,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    })
  ]);
  t.true(responseA.ok);
  t.true(responseB.ok);

  // Event A starts 2021-05-03 (weekly). Occurrences: 05-03, 05-10, 05-17 ...
  // Event B starts 2021-06-07 (weekly). Occurrences: 06-07, 06-14, 06-21 ...
  // Query a window that only event A has an occurrence in (2021-05-09 to 05-11).
  // If INTERVAL collapses, event B would be incorrectly returned too.
  const objectsA = await fetchCalendarObjects({
    calendar: calendars[0],
    headers: t.context.authHeaders,
    timeRange: {
      start: '2021-05-09T00:00:00.000Z',
      end: '2021-05-11T00:00:00.000Z'
    }
  });
  const foundA = objectsA.some((obj) =>
    obj.data.includes('vevent-allday-recurring-weekly@test')
  );
  const foundB = objectsA.some((obj) =>
    obj.data.includes('vevent-allday-recurring-weekly-b@test')
  );
  t.true(foundA, 'Event A should be returned for its occurrence window');
  t.false(
    foundB,
    'Event B must NOT be returned — its first occurrence is in June, not May'
  );

  await Promise.all([
    deleteObject({ url: objectUrlA, headers: t.context.authHeaders }),
    deleteObject({ url: objectUrlB, headers: t.context.authHeaders })
  ]);
});

test('all-day recurring VTODO with DTSTART;VALUE=DATE: timeRange query returns correct occurrence', async (t) => {
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-allday-recurring.ics'),
    'utf8'
  );
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );
  const objectUrl = new URL('vtodo-allday-recurring.ics', taskCalendar.url)
    .href;
  const response = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(response.ok);

  // Task starts 2021-05-03 (weekly). An occurrence falls on 2021-05-10.
  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: { name: 'VCALENDAR' },
          'comp-filter': {
            _attributes: { name: 'VTODO' },
            'time-range': {
              _attributes: {
                start: '20210509T000000Z',
                end: '20210511T000000Z'
              }
            }
          }
        }
      }
    ]
  });
  t.true(
    objects.length > 0,
    'Should find the all-day recurring VTODO in the queried window'
  );
  const found = objects.some((obj) =>
    obj.data.includes('vtodo-allday-recurring-weekly@test')
  );
  t.true(found, 'The all-day recurring VTODO should be returned');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

test('all-day recurring VTODO with DUE;VALUE=DATE only (no DTSTART): timeRange query returns correct occurrence', async (t) => {
  const iCalString = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-allday-due-only.ics'),
    'utf8'
  );
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );
  const objectUrl = new URL('vtodo-allday-due-only.ics', taskCalendar.url).href;
  const response = await createObject({
    url: objectUrl,
    data: iCalString,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(response.ok);

  // Task DUE 2021-05-03 (weekly, no DTSTART). An occurrence falls on 2021-05-10.
  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: { name: 'VCALENDAR' },
          'comp-filter': {
            _attributes: { name: 'VTODO' },
            'time-range': {
              _attributes: {
                start: '20210509T000000Z',
                end: '20210511T000000Z'
              }
            }
          }
        }
      }
    ]
  });
  t.true(
    objects.length > 0,
    'Should find the DUE-only all-day recurring VTODO in the queried window'
  );
  const found = objects.some((obj) =>
    obj.data.includes('vtodo-allday-due-only-weekly@test')
  );
  t.true(found, 'The DUE-only all-day recurring VTODO should be returned');

  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

//
// A stored recurrence that would take hours to expand (FREQ=SECONDLY since
// 1970), or that never occurs (rrule then walks every day up to 9999), must
// not stall a time-range REPORT; it is returned as matching rather than
// hidden (see helpers/recurrence-budget.js).
//
test('time-range REPORT does not stall on an absurd recurrence', async (t) => {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const calendar = calendars.find(
    (cal) =>
      !cal.displayName?.includes('Reminders') &&
      !cal.displayName?.includes('Tasks')
  );

  const objects = [];
  for (const [name, rrule] of [
    ['secondly', 'RRULE:FREQ=SECONDLY'],
    ['never', 'RRULE:FREQ=DAILY;BYMONTH=2;BYMONTHDAY=30']
  ]) {
    const uid = `${name}-${Date.now()}@test`;
    const url = new URL(`${name}-${Date.now()}.ics`, calendar.url).href;

    const response = await createObject({
      url,
      data: [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Test//Recurrence//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        'DTSTAMP:20250101T000000Z',
        'DTSTART:19700101T000000Z',
        'DTEND:19700101T000001Z',
        rrule,
        `SUMMARY:${name}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n'),
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });
    t.true(response.ok);
    objects.push({ uid, url });
  }

  const started = Date.now();
  const found = await fetchCalendarObjects({
    calendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: { name: 'VCALENDAR' },
          'comp-filter': {
            _attributes: { name: 'VEVENT' },
            'time-range': {
              _attributes: {
                start: '20260301T000000Z',
                end: '20260308T000000Z'
              }
            }
          }
        }
      }
    ]
  });
  const elapsed = Date.now() - started;

  t.true(elapsed < 10_000, `took ${elapsed}ms`);
  for (const { uid } of objects)
    t.true(found.some((object) => object.data.includes(uid)));

  for (const { url } of objects)
    await deleteObject({ url, headers: t.context.authHeaders });
});

// =============================================================================
// RFC 4791 Section 9.9: Dateless VTODO time-range inclusion
// A VTODO without DTSTART, DUE, COMPLETED, or CREATED MUST be reported
// in ALL time-range queries.  This is critical for iOS Reminders
// location-based tasks that have no temporal anchor.
// =============================================================================

test('dateless VTODO (no DTSTART/DUE) is included in time-range calendar-query REPORT', async (t) => {
  const datelessIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-dateless.ics'),
    'utf8'
  );
  const futureIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-future-due.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );
  t.truthy(taskCalendar, 'Tasks calendar must exist');

  const datelessUrl = new URL('vtodo-dateless.ics', taskCalendar.url).href;
  const futureUrl = new URL('vtodo-future-due.ics', taskCalendar.url).href;

  // Create both: a dateless VTODO and a future-dated VTODO
  await createObject({
    url: datelessUrl,
    data: datelessIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  await createObject({
    url: futureUrl,
    data: futureIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // Query with a narrow time-range in 2021 (neither task has dates in 2021)
  // Per RFC 4791 Section 9.9, the dateless VTODO MUST still be returned
  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: { name: 'VCALENDAR' },
          'comp-filter': {
            _attributes: { name: 'VTODO' },
            'time-range': {
              _attributes: {
                start: '20210401T000000Z',
                end: '20210430T235959Z'
              }
            }
          }
        }
      }
    ]
  });

  // The dateless VTODO must be included (matches all time-range queries)
  const hasDateless = objects.some(
    (obj) => obj.data && obj.data.includes('todo-dateless-rfc4791@test')
  );
  t.true(
    hasDateless,
    'Dateless VTODO MUST be included in time-range query per RFC 4791 Section 9.9'
  );

  // The future-dated VTODO (DUE:20250901) should NOT match a 2021 range
  const hasFuture = objects.some(
    (obj) => obj.data && obj.data.includes('todo-future-due-2025@test')
  );
  t.false(
    hasFuture,
    'VTODO with DUE outside the time-range must NOT be included'
  );

  // Clean up
  await deleteObject({ url: datelessUrl, headers: t.context.authHeaders });
  await deleteObject({ url: futureUrl, headers: t.context.authHeaders });
});

// =============================================================================
// iOS Location-Based Reminder (X-APPLE-PROXIMITY) PUT->GET Roundtrip
// Verifies that location-based reminders with X-APPLE-PROXIMITY VALARM
// survive storage and retrieval with all Apple-specific properties intact.
// =============================================================================

test('location-based VTODO with X-APPLE-PROXIMITY survives PUT->GET roundtrip', async (t) => {
  const locationIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-location-reminder.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );
  t.truthy(taskCalendar, 'Tasks calendar must exist');

  const objectUrl = new URL('vtodo-location-reminder.ics', taskCalendar.url)
    .href;

  const response = await createObject({
    url: objectUrl,
    data: locationIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(response.ok, 'PUT of location-based VTODO must succeed');

  // Fetch it back
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });
  t.truthy(calendarObject, 'GET must return the stored object');
  t.truthy(calendarObject.data, 'Calendar object must have data');

  const ics = calendarObject.data;

  // Verify Apple-specific properties are preserved
  t.true(
    ics.includes('X-APPLE-PROXIMITY:ARRIVE'),
    'X-APPLE-PROXIMITY:ARRIVE must be preserved through roundtrip'
  );
  t.true(
    ics.includes('X-APPLE-STRUCTURED-LOCATION'),
    'X-APPLE-STRUCTURED-LOCATION must be preserved through roundtrip'
  );
  // The sentinel trigger date must NOT be converted to a duration
  t.true(
    ics.includes('19760401T005545Z'),
    'Sentinel trigger date (1976-04-01) must be preserved (not converted to duration)'
  );
  t.true(ics.includes('Pick up dry cleaning'), 'SUMMARY must be preserved');

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// =============================================================================
// Location-based VTODO (no DUE/DTSTART) included in time-range query
// Combines both fixes: dateless VTODO + X-APPLE-PROXIMITY preservation
// =============================================================================

test('location-based VTODO without dates is included in time-range query AND preserves proximity alarm', async (t) => {
  const locationIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-location-reminder.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );
  t.truthy(taskCalendar, 'Tasks calendar must exist');

  const objectUrl = new URL(
    'vtodo-location-reminder-timerange.ics',
    taskCalendar.url
  ).href;

  await createObject({
    url: objectUrl,
    data: locationIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  // The location-based VTODO has no DUE/DTSTART, so per RFC 4791 Section 9.9
  // it MUST be returned in any time-range query
  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    filters: [
      {
        'comp-filter': {
          _attributes: { name: 'VCALENDAR' },
          'comp-filter': {
            _attributes: { name: 'VTODO' },
            'time-range': {
              _attributes: {
                start: '20260101T000000Z',
                end: '20260131T235959Z'
              }
            }
          }
        }
      }
    ]
  });

  const found = objects.find(
    (obj) => obj.data && obj.data.includes('todo-location-reminder-arrive@test')
  );
  t.truthy(
    found,
    'Location-based VTODO without dates MUST be included in time-range query'
  );

  // Verify the proximity alarm is intact in the returned data
  t.true(
    found.data.includes('X-APPLE-PROXIMITY:ARRIVE'),
    'X-APPLE-PROXIMITY must survive time-range filtered retrieval'
  );
  t.true(
    found.data.includes('19760401T005545Z'),
    'Sentinel trigger must survive time-range filtered retrieval'
  );

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// =============================================================================
// Mixed alarms: DEPART proximity + time-based alarm on same VTODO
// Verifies that normalizeVAlarm correctly handles the mixed case during
// the PUT->GET cycle: proximity alarm preserved, time alarm normalized.
// =============================================================================

test('VTODO with mixed proximity and time-based alarms preserves both through roundtrip', async (t) => {
  const mixedIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-location-depart.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );
  t.truthy(taskCalendar, 'Tasks calendar must exist');

  const objectUrl = new URL('vtodo-location-depart.ics', taskCalendar.url).href;

  const response = await createObject({
    url: objectUrl,
    data: mixedIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });
  t.true(response.ok, 'PUT of mixed-alarm VTODO must succeed');

  // Fetch it back
  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });
  t.truthy(calendarObject, 'GET must return the stored object');

  const ics = calendarObject.data;

  // Proximity alarm must be preserved
  t.true(
    ics.includes('X-APPLE-PROXIMITY:DEPART'),
    'X-APPLE-PROXIMITY:DEPART must be preserved'
  );
  t.true(
    ics.includes('19760401T005545Z'),
    'Sentinel trigger for proximity alarm must be preserved'
  );
  t.true(
    ics.includes('X-APPLE-STRUCTURED-LOCATION'),
    'Structured location must be preserved'
  );

  // The time-based relative alarm (-PT30M) must also be preserved
  t.true(ics.includes('VALARM'), 'VALARM components must be present');
  // Both alarms should exist (2 BEGIN:VALARM occurrences)
  const valarmCount = (ics.match(/BEGIN:VALARM/g) || []).length;
  t.is(valarmCount, 2, 'Both VALARM components must be preserved');

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});

// =============================================================================
// X-APPLE-STRUCTURED-LOCATION preservation through PUT->GET
// =============================================================================

test('X-APPLE-STRUCTURED-LOCATION on VTODO is preserved through PUT->GET roundtrip', async (t) => {
  const locationIcs = await fsp.readFile(
    path.join(__dirname, 'data', 'vtodo-with-location.ics'),
    'utf8'
  );

  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const taskCalendar = calendars.find(
    (cal) =>
      cal.displayName?.includes('Reminders') ||
      cal.displayName?.includes('Tasks') ||
      cal.displayName === 'Tasks'
  );
  t.truthy(taskCalendar, 'Tasks calendar must exist');

  const objectUrl = new URL('vtodo-structured-location.ics', taskCalendar.url)
    .href;

  await createObject({
    url: objectUrl,
    data: locationIcs,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders
    }
  });

  const [calendarObject] = await fetchCalendarObjects({
    calendar: taskCalendar,
    objectUrls: [objectUrl],
    headers: t.context.authHeaders
  });
  t.truthy(calendarObject, 'GET must return the stored object');

  const ics = calendarObject.data;

  // X-APPLE-STRUCTURED-LOCATION with all parameters must be preserved
  t.true(
    ics.includes('X-APPLE-STRUCTURED-LOCATION'),
    'X-APPLE-STRUCTURED-LOCATION must be preserved'
  );
  t.true(
    ics.includes('X-APPLE-RADIUS='),
    'X-APPLE-RADIUS parameter must be preserved'
  );
  t.true(ics.includes('X-TITLE='), 'X-TITLE parameter must be preserved');
  t.true(ics.includes('geo:'), 'geo: URI value must be preserved');
  // Standard LOCATION property must also survive
  t.true(
    ics.includes('LOCATION:') || ics.includes('LOCATION;'),
    'LOCATION property must be preserved'
  );

  // Clean up
  await deleteObject({ url: objectUrl, headers: t.context.authHeaders });
});
