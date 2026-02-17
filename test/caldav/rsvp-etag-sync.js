/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * E2E Tests for RSVP ETag and Synctoken Behavior
 *
 * These tests verify that when an attendee RSVPs (via iMIP or web link),
 * the CalDAV server correctly:
 *   1. Updates the attendee's PARTSTAT in the real SQLite database
 *   2. Changes the ETag (via updated_at auto-injection) so CalDAV clients
 *      detect the change during sync-collection
 *   3. Bumps the calendar synctoken as a valid URL string (not $inc on a URL)
 *
 * A single real CalDAV + SQLite server is shared across all tests — no stubs.
 */

const { Buffer } = require('node:buffer');
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

const CalendarInvites = require('#models/calendar-invites');
const Users = require('#models/users');
const calDAVConfig = require('#config/caldav');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');

const { checkAndProcessImipMessage } = require('#helpers/process-imip-reply');
const {
  generateToken,
  hashToken,
  parseToken,
  responseToPartstat
} = require('#helpers/calendar-response');

const {
  getBasicAuthHeaders,
  createAccount,
  fetchCalendars,
  fetchCalendarObjects,
  createObject
} = tsdav;

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

// ─── ICS Helpers ─────────────────────────────────────────────────────────────

function makeStoredEventIcs({
  uid,
  organizer,
  attendees,
  summary = 'Team Meeting',
  sequence = 0
}) {
  const attendeeLines = attendees
    .map(
      (a) =>
        `ATTENDEE;PARTSTAT=${a.partstat || 'NEEDS-ACTION'};RSVP=TRUE:mailto:${
          a.email
        }`
    )
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T100000Z',
    'DTSTART:20260301T100000Z',
    'DTEND:20260301T110000Z',
    `SUMMARY:${summary}`,
    `SEQUENCE:${sequence}`,
    `ORGANIZER:mailto:${organizer}`,
    attendeeLines,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function makeReplyIcs({ uid, organizer, attendee, partstat, sequence = 0 }) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'METHOD:REPLY',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T120000Z',
    'DTSTART:20260301T100000Z',
    'DTEND:20260301T110000Z',
    `SEQUENCE:${sequence}`,
    `ORGANIZER:mailto:${organizer}`,
    `ATTENDEE;PARTSTAT=${partstat}:mailto:${attendee}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// ─── ICS Parsing Helpers ─────────────────────────────────────────────────────

function getPartstatFromIcs(icalStr, attendeeEmail) {
  const comp = new ICAL.Component(ICAL.parse(icalStr));
  const vevent = comp.getFirstSubcomponent('vevent');
  if (!vevent) return null;

  for (const att of vevent.getAllProperties('attendee')) {
    const email = att
      .getFirstValue()
      ?.replace(/^mailto:/i, '')
      .toLowerCase();
    if (email === attendeeEmail.toLowerCase()) {
      return att.getParameter('partstat');
    }
  }

  return null;
}

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
});

// Clean up CalendarInvites between tests
test.afterEach.always(async () => {
  await CalendarInvites.deleteMany({});
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

async function fetchEventETag(t, uid) {
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
  return match ? match.etag : null;
}

async function fetchCalendarSynctoken(t) {
  const calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
  const calendar = calendars.find((c) => c.components?.includes('VEVENT'));
  return calendar ? calendar.syncToken : null;
}

async function runProcessInvites(t) {
  // fetchCalendars triggers authentication which runs processCalendarInvites
  t.context.calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1: iMIP REPLY updates PARTSTAT and bumps synctoken as URL
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Outlook iMIP REPLY - updates PARTSTAT and bumps synctoken as URL',
  async (t) => {
    const uid = `rsvp-etag-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const attendee = 'attendee@example.com';

    // Create event in real CalDAV
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // Record ETag and synctoken before RSVP
    const etagBefore = await fetchEventETag(t, uid);
    const synctokenBefore = await fetchCalendarSynctoken(t);
    t.truthy(etagBefore, 'ETag should exist before RSVP');
    t.truthy(synctokenBefore, 'Synctoken should exist before RSVP');

    // Verify synctoken is a URL
    t.true(
      synctokenBefore.startsWith('http'),
      'Synctoken should be a URL string'
    );

    // Send iMIP REPLY
    const replyIcs = makeReplyIcs({
      uid,
      organizer,
      attendee,
      partstat: 'ACCEPTED'
    });

    await checkAndProcessImipMessage(
      {
        from: { value: [{ address: attendee }] },
        to: { value: [{ address: organizer }] },
        subject: 'Accepted',
        attachments: [
          {
            contentType: 'text/calendar; method=REPLY',
            filename: 'invite.ics',
            content: Buffer.from(replyIcs, 'utf8')
          }
        ]
      },
      { fromEmail: attendee, toEmail: organizer }
    );

    // Process invites (triggers real SQLite update)
    await runProcessInvites(t);

    // Verify PARTSTAT updated in real SQLite
    const afterIcs = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(afterIcs, attendee),
      'ACCEPTED',
      'PARTSTAT should be ACCEPTED'
    );

    // Verify ETag changed (updated_at auto-injection)
    const etagAfter = await fetchEventETag(t, uid);
    t.truthy(etagAfter, 'ETag should exist after RSVP');
    t.not(
      etagBefore,
      etagAfter,
      'ETag should change after PARTSTAT update (updated_at auto-injection)'
    );

    // Verify synctoken bumped and still a valid URL
    const synctokenAfter = await fetchCalendarSynctoken(t);
    t.truthy(synctokenAfter, 'Synctoken should exist after RSVP');
    t.true(
      synctokenAfter.startsWith('http'),
      'Synctoken should still be a URL string after bump'
    );
    t.not(
      synctokenBefore,
      synctokenAfter,
      'Synctoken should change after RSVP processing'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2: Web HTML REPLY updates PARTSTAT with correct fields
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Web HTML REPLY - updates PARTSTAT with method and source set',
  async (t) => {
    const uid = `web-reply-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const attendee = 'web-user@example.com';

    // Create event in real CalDAV
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // Create web-based RSVP invite
    const token = generateToken({
      eventUid: uid,
      organizerEmail: organizer,
      attendeeEmail: attendee
    });

    await CalendarInvites.create({
      eventUid: uid,
      organizerEmail: organizer,
      attendeeEmail: attendee,
      response: responseToPartstat('accept'),
      method: 'REPLY',
      source: 'web',
      tokenHash: hashToken(token),
      tokenExpiresAt: parseToken(token).expiresAt,
      processed: false,
      processAttempts: 0
    });

    // Verify invite has correct fields
    const invite = await CalendarInvites.findOne({ eventUid: uid });
    t.is(invite.method, 'REPLY', 'Web invite should have method REPLY');
    t.is(invite.source, 'web', 'Web invite should have source web');

    // Process invites
    await runProcessInvites(t);

    // Verify PARTSTAT updated in real SQLite
    const afterIcs = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(afterIcs, attendee),
      'ACCEPTED',
      'PARTSTAT should be ACCEPTED after web RSVP'
    );

    // Verify invite marked as processed
    const processedInvite = await CalendarInvites.findOne({ eventUid: uid });
    t.true(processedInvite.processed, 'Invite should be marked as processed');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3: REPLY only updates the responding attendee, not others
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'REPLY - only updates the responding attendee, not others',
  async (t) => {
    const uid = `selective-reply-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const alice = 'alice@example.com';
    const bob = 'bob@example.com';

    // Create event with two attendees
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [
        { email: alice, partstat: 'NEEDS-ACTION' },
        { email: bob, partstat: 'NEEDS-ACTION' }
      ]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // Alice accepts via iMIP
    const aliceReply = makeReplyIcs({
      uid,
      organizer,
      attendee: alice,
      partstat: 'ACCEPTED'
    });

    await checkAndProcessImipMessage(
      {
        from: { value: [{ address: alice }] },
        to: { value: [{ address: organizer }] },
        subject: 'Accepted',
        attachments: [
          {
            contentType: 'text/calendar; method=REPLY',
            filename: 'invite.ics',
            content: Buffer.from(aliceReply, 'utf8')
          }
        ]
      },
      { fromEmail: alice, toEmail: organizer }
    );

    // Process
    await runProcessInvites(t);

    // Verify: Alice is ACCEPTED, Bob is still NEEDS-ACTION
    const afterIcs = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(afterIcs, alice),
      'ACCEPTED',
      'Alice should be ACCEPTED'
    );
    t.is(
      getPartstatFromIcs(afterIcs, bob),
      'NEEDS-ACTION',
      'Bob should still be NEEDS-ACTION'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4: Sequential RSVPs - both attendees update correctly
// ═══════════════════════════════════════════════════════════════════════════════

test.serial('Sequential RSVPs - both attendees update correctly', async (t) => {
  const uid = `sequential-rsvp-${Date.now()}@example.com`;
  const organizer = t.context.username;
  const alice = 'alice@example.com';
  const bob = 'bob@example.com';

  const storedIcs = makeStoredEventIcs({
    uid,
    organizer,
    attendees: [
      { email: alice, partstat: 'NEEDS-ACTION' },
      { email: bob, partstat: 'NEEDS-ACTION' }
    ]
  });

  await createEventViaCalDAV(t, uid, storedIcs);

  // Alice accepts
  const aliceReply = makeReplyIcs({
    uid,
    organizer,
    attendee: alice,
    partstat: 'ACCEPTED'
  });

  await checkAndProcessImipMessage(
    {
      from: { value: [{ address: alice }] },
      to: { value: [{ address: organizer }] },
      subject: 'Accepted',
      attachments: [
        {
          contentType: 'text/calendar; method=REPLY',
          filename: 'invite.ics',
          content: Buffer.from(aliceReply, 'utf8')
        }
      ]
    },
    { fromEmail: alice, toEmail: organizer }
  );

  await runProcessInvites(t);

  // Bob declines
  const bobReply = makeReplyIcs({
    uid,
    organizer,
    attendee: bob,
    partstat: 'DECLINED'
  });

  await checkAndProcessImipMessage(
    {
      from: { value: [{ address: bob }] },
      to: { value: [{ address: organizer }] },
      subject: 'Declined',
      attachments: [
        {
          contentType: 'text/calendar; method=REPLY',
          filename: 'invite.ics',
          content: Buffer.from(bobReply, 'utf8')
        }
      ]
    },
    { fromEmail: bob, toEmail: organizer }
  );

  await runProcessInvites(t);

  // Verify both
  const afterIcs = await fetchEventIcs(t, uid);
  t.is(getPartstatFromIcs(afterIcs, alice), 'ACCEPTED', 'Alice ACCEPTED');
  t.is(getPartstatFromIcs(afterIcs, bob), 'DECLINED', 'Bob DECLINED');
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 5: REPLY TENTATIVE sets PARTSTAT to TENTATIVE
// ═══════════════════════════════════════════════════════════════════════════════

test.serial('REPLY TENTATIVE - sets PARTSTAT to TENTATIVE', async (t) => {
  const uid = `tentative-${Date.now()}@example.com`;
  const organizer = t.context.username;
  const attendee = 'tentative@example.com';

  const storedIcs = makeStoredEventIcs({
    uid,
    organizer,
    attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
  });

  await createEventViaCalDAV(t, uid, storedIcs);

  const replyIcs = makeReplyIcs({
    uid,
    organizer,
    attendee,
    partstat: 'TENTATIVE'
  });

  await checkAndProcessImipMessage(
    {
      from: { value: [{ address: attendee }] },
      to: { value: [{ address: organizer }] },
      subject: 'Tentative',
      attachments: [
        {
          contentType: 'text/calendar; method=REPLY',
          filename: 'invite.ics',
          content: Buffer.from(replyIcs, 'utf8')
        }
      ]
    },
    { fromEmail: attendee, toEmail: organizer }
  );

  await runProcessInvites(t);

  const afterIcs = await fetchEventIcs(t, uid);
  t.is(
    getPartstatFromIcs(afterIcs, attendee),
    'TENTATIVE',
    'PARTSTAT should be TENTATIVE'
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 6: Synctoken is always a valid URL (never $inc corruption)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial('bumpSyncToken produces valid URL-based synctoken', async (t) => {
  const uid = `synctoken-url-${Date.now()}@example.com`;
  const organizer = t.context.username;
  const attendee = 'sync-test@example.com';

  const storedIcs = makeStoredEventIcs({
    uid,
    organizer,
    attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
  });

  await createEventViaCalDAV(t, uid, storedIcs);

  // Get initial synctoken
  const syncBefore = await fetchCalendarSynctoken(t);
  t.truthy(syncBefore, 'Initial synctoken should exist');
  t.true(syncBefore.startsWith('http'), 'Initial synctoken should be a URL');

  // Extract the numeric part
  const numBefore = Number.parseInt(syncBefore.split('/').pop(), 10);
  t.false(Number.isNaN(numBefore), 'Synctoken should end with a number');

  // Process a REPLY to trigger bumpSyncToken
  const replyIcs = makeReplyIcs({
    uid,
    organizer,
    attendee,
    partstat: 'ACCEPTED'
  });

  await checkAndProcessImipMessage(
    {
      from: { value: [{ address: attendee }] },
      to: { value: [{ address: organizer }] },
      subject: 'Accepted',
      attachments: [
        {
          contentType: 'text/calendar; method=REPLY',
          filename: 'invite.ics',
          content: Buffer.from(replyIcs, 'utf8')
        }
      ]
    },
    { fromEmail: attendee, toEmail: organizer }
  );

  await runProcessInvites(t);

  // Verify synctoken bumped correctly
  const syncAfter = await fetchCalendarSynctoken(t);
  t.truthy(syncAfter, 'Synctoken should exist after bump');
  t.true(syncAfter.startsWith('http'), 'Synctoken should still be a URL');

  const numAfter = Number.parseInt(syncAfter.split('/').pop(), 10);
  t.false(Number.isNaN(numAfter), 'Bumped synctoken should end with number');
  t.true(
    numAfter > numBefore,
    `Synctoken should be incremented (${numBefore} → ${numAfter})`
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 7: REPLY when event not found - marks processed with error
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'REPLY when event not found - marks processed with error',
  async (t) => {
    const uid = `nonexistent-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const attendee = 'ghost@example.com';

    // Create REPLY invite for non-existent event
    const replyIcs = makeReplyIcs({
      uid,
      organizer,
      attendee,
      partstat: 'ACCEPTED'
    });

    await checkAndProcessImipMessage(
      {
        from: { value: [{ address: attendee }] },
        to: { value: [{ address: organizer }] },
        subject: 'Accepted',
        attachments: [
          {
            contentType: 'text/calendar; method=REPLY',
            filename: 'invite.ics',
            content: Buffer.from(replyIcs, 'utf8')
          }
        ]
      },
      { fromEmail: attendee, toEmail: organizer }
    );

    // Process
    await runProcessInvites(t);

    // Verify invite marked as processed with error
    const invite = await CalendarInvites.findOne({ eventUid: uid });
    t.true(invite.processed, 'Invite should be marked as processed');
    t.truthy(
      invite.processError,
      'Should have processError when event not found'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 8: REPLY when attendee not in event - marks processed with error
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'REPLY when attendee not in event - marks processed with error',
  async (t) => {
    const uid = `no-attendee-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const realAttendee = 'real@example.com';
    const unknownAttendee = 'unknown@example.com';

    // Create event with only realAttendee
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: realAttendee, partstat: 'NEEDS-ACTION' }]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // Send REPLY from unknownAttendee (not in the event)
    const replyIcs = makeReplyIcs({
      uid,
      organizer,
      attendee: unknownAttendee,
      partstat: 'ACCEPTED'
    });

    await checkAndProcessImipMessage(
      {
        from: { value: [{ address: unknownAttendee }] },
        to: { value: [{ address: organizer }] },
        subject: 'Accepted',
        attachments: [
          {
            contentType: 'text/calendar; method=REPLY',
            filename: 'invite.ics',
            content: Buffer.from(replyIcs, 'utf8')
          }
        ]
      },
      { fromEmail: unknownAttendee, toEmail: organizer }
    );

    // Process
    await runProcessInvites(t);

    // Verify invite marked as processed with error
    const invite = await CalendarInvites.findOne({
      eventUid: uid,
      attendeeEmail: unknownAttendee
    });
    t.true(invite.processed, 'Invite should be marked as processed');
    t.truthy(
      invite.processError,
      'Should have processError when attendee not found'
    );

    // Verify real attendee unchanged
    const afterIcs = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(afterIcs, realAttendee),
      'NEEDS-ACTION',
      'Real attendee should be unchanged'
    );
  }
);
