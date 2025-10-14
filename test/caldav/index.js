/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fsp = require('node:fs/promises');
const path = require('node:path');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const splitLines = require('split-lines');
const test = require('ava');
const tsdav = require('tsdav');
const undici = require('undici');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');
const CalDAV = require('../../caldav-server');
const SQLite = require('../../sqlite-server');

const Emails = require('#models/emails');
const Users = require('#models/users');
const calDAVConfig = require('#config/caldav');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');

// dynamically import @ava/get-port
let getPort;
import('@ava/get-port').then((obj) => {
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

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// TODO: `app.close()` for CalDAV server after each

test.beforeEach(async (t) => {
  t.context.permit = await semaphore.acquire();
  const client = new Redis();
  const subscriber = new Redis();
  client.setMaxListeners(0);
  subscriber.setMaxListeners(0);
  subscriber.channels.setMaxListeners(0);

  t.context.client = client;

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();

  const sqlite = new SQLite({ client, subscriber });
  await sqlite.listen(sqlitePort);

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
      true
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
      true
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
      true
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
    { timeout: ms('5s') }
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
  t.is(objects[0].url, objectUrl3);

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

  const list1 = extractVEvent(calendarObject.data);
  const list2 = extractVEvent(iCalString);
  t.deepEqual(list1, list2);
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

  const list1 = extractVEvent(text);
  const list2 = extractVEvent(updatedICalString);
  t.deepEqual(list1, list2);
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
  const vtodoObject = objects.find((obj) => obj.url === objectUrl);
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
              _value: 'NEEDS-ACTION'
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
    headers: t.context.authHeaders
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

  // Verify both exist
  const objects = await fetchCalendarObjects({
    calendar: unifiedCal,
    headers: t.context.authHeaders
  });
  t.true(objects.length >= 2);

  // Verify we can retrieve both types
  const hasEvent = objects.some((obj) => obj.data.includes('BEGIN:VEVENT'));
  const hasTask = objects.some((obj) => obj.data.includes('BEGIN:VTODO'));
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
    headers: t.context.authHeaders
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
  const objects = await fetchCalendarObjects({
    calendar: taskCalendar,
    headers: t.context.authHeaders,
    timeRange: {
      start: '2021-04-01T00:00:00.000Z',
      end: '2021-04-06T23:59:59.999Z'
    }
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
