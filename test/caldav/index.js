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

  const objectUrl1 = new URL('1.ics', calendars[0].url).href;
  const objectUrl2 = new URL('2.ics', calendars[0].url).href;
  const objectUrl3 = new URL('3.ics', calendars[0].url).href;

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
    url: calendars[0].url,
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
  const taskCalendar =
    calendars.find(
      (cal) =>
        cal.displayName?.includes('Reminders') ||
        cal.displayName?.includes('Tasks') ||
        cal.displayName === 'Tasks' ||
        cal.supportedComponents?.includes('VTODO')
    ) || calendars.find((cal) => cal.displayName === 'Tasks');

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
  const taskCalendar =
    calendars.find(
      (cal) =>
        cal.displayName?.includes('Reminders') ||
        cal.displayName?.includes('Tasks') ||
        cal.displayName === 'Tasks' ||
        cal.supportedComponents?.includes('VTODO')
    ) || calendars.find((cal) => cal.displayName === 'Tasks');

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
  const taskCalendar =
    calendars.find(
      (cal) =>
        cal.displayName?.includes('Reminders') ||
        cal.displayName?.includes('Tasks') ||
        cal.displayName === 'Tasks' ||
        cal.supportedComponents?.includes('VTODO')
    ) || calendars.find((cal) => cal.displayName === 'Tasks');

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
  const taskCalendar =
    calendars.find(
      (cal) =>
        cal.displayName?.includes('Reminders') ||
        cal.displayName?.includes('Tasks') ||
        cal.displayName === 'Tasks' ||
        cal.supportedComponents?.includes('VTODO')
    ) || calendars.find((cal) => cal.displayName === 'Tasks');

  const objectUrl1 = new URL('vtodo-filter-1.ics', taskCalendar.url).href;
  const objectUrl2 = new URL('vtodo-filter-2.ics', taskCalendar.url).href;
  const objectUrl3 = new URL('vtodo-filter-3.ics', taskCalendar.url).href;

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
  const taskCalendar =
    calendars.find(
      (cal) =>
        cal.displayName?.includes('Reminders') ||
        cal.displayName?.includes('Tasks') ||
        cal.displayName === 'Tasks' ||
        cal.supportedComponents?.includes('VTODO')
    ) || calendars.find((cal) => cal.displayName === 'Tasks');

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
