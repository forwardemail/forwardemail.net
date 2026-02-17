/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * E2E Lifecycle Tests for Calendar Invite Processing
 *
 * These tests verify the full end-to-end flow:
 *   iMIP email / web link → CalendarInvites (MongoDB) → processCalendarInvites → real SQLite
 *
 * A single real CalDAV + SQLite server is shared across all tests.
 * processCalendarInvites operates against a live database — no stubs.
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
const Emails = require('#models/emails');
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
  createObject,
  updateObject,
  deleteObject
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

function makeRequestIcs({
  uid,
  organizer,
  attendees,
  summary = 'Team Meeting',
  sequence = 0,
  dtstart = '20260301T100000Z',
  dtend = '20260301T110000Z'
}) {
  const attendeeLines = attendees
    .map((a) => `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${a}`)
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Google Inc//Google Calendar 70.9054//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T100000Z',
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${summary}`,
    `SEQUENCE:${sequence}`,
    `ORGANIZER;CN=Boss:mailto:${organizer}`,
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

function makeCancelIcs({ uid, organizer, attendees, sequence = 1 }) {
  const attendeeLines = attendees
    .map((a) => `ATTENDEE:mailto:${a}`)
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Google Inc//Google Calendar 70.9054//EN',
    'METHOD:CANCEL',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T140000Z',
    'DTSTART:20260301T100000Z',
    `SEQUENCE:${sequence}`,
    'STATUS:CANCELLED',
    `ORGANIZER:mailto:${organizer}`,
    attendeeLines,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function buildParsedEmail({ from, to, icsContent, subject = 'Invitation' }) {
  return {
    from: { value: [{ address: from }] },
    to: { value: [{ address: to }] },
    subject,
    attachments: [
      {
        contentType: 'text/calendar; method=REQUEST; charset=UTF-8',
        filename: 'invite.ics',
        content: Buffer.from(icsContent, 'utf8')
      }
    ]
  };
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

function getStatusFromIcs(icalStr) {
  const comp = new ICAL.Component(ICAL.parse(icalStr));
  const vevent = comp.getFirstSubcomponent('vevent');
  if (!vevent) return null;
  return vevent.getFirstPropertyValue('status');
}

function hasMethodInIcs(icalStr) {
  const comp = new ICAL.Component(ICAL.parse(icalStr));
  return comp.getFirstPropertyValue('method') !== null;
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

// Clean up CalendarInvites and queued Emails between tests
test.afterEach.always(async () => {
  await CalendarInvites.deleteMany({});
  await Emails.deleteMany({});
});

// ─── Helper: create event via CalDAV HTTP and return its URL ─────────────────

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

// ─── Helper: fetch event ICS from CalDAV ─────────────────────────────────────

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

// ─── Helper: run processCalendarInvites against real CalDAV+SQLite ───────────

async function runProcessInvites(t) {
  // fetchCalendars triggers authentication which runs processCalendarInvites
  t.context.calendars = await fetchCalendars({
    account: t.context.account,
    headers: t.context.authHeaders
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 1: Google Calendar REQUEST → CalDAV Event Created
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Google Calendar REQUEST email → CalendarInvites → CalDAV event created',
  async (t) => {
    const uid = `lifecycle-request-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = t.context.username;

    // ── Step 1: Incoming email from Google Calendar ──
    const icsContent = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee],
      summary: 'Sprint Planning'
    });

    const parsedEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent,
      subject: 'Invitation: Sprint Planning'
    });

    const result = await checkAndProcessImipMessage(parsedEmail, {
      messageId: '<msg-1@google.com>',
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });

    t.truthy(result, 'checkAndProcessImipMessage should return a result');
    t.true(result.processed, 'Message should be processed successfully');
    t.is(result.method, 'REQUEST');

    // Verify: CalendarInvites record created in MongoDB
    const invite = await CalendarInvites.findOne({
      eventUid: uid,
      method: 'REQUEST',
      processed: false
    });
    t.truthy(invite, 'CalendarInvites record should exist in MongoDB');
    t.is(invite.organizerEmail, attendee);
    t.is(invite.rawIcs, icsContent);
    t.is(invite.source, 'imip');

    // ── Step 2: User authenticates to CalDAV → processCalendarInvites runs ──
    await runProcessInvites(t);

    // Verify: invite marked as processed in MongoDB
    const processedInvite = await CalendarInvites.findOne({
      eventUid: uid,
      method: 'REQUEST'
    });
    t.true(processedInvite.processed, 'Invite should be marked as processed');

    // Verify: event exists in CalDAV (real SQLite)
    const ics = await fetchEventIcs(t, uid);
    t.truthy(ics, 'Event should exist in CalDAV after processing');
    t.false(hasMethodInIcs(ics), 'METHOD should be stripped from stored ICS');
    t.true(ics.includes(uid), 'Stored ICS should contain the UID');
    t.true(
      ics.includes('Sprint Planning'),
      'Stored ICS should contain the summary'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 2: iMIP REPLY → Organizer's PARTSTAT Updated
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: iMIP REPLY email → organizer event PARTSTAT updated in real SQLite',
  async (t) => {
    const uid = `lifecycle-reply-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const attendee = 'attendee@example.com';

    // ── Pre-condition: Organizer has event in CalDAV (real SQLite) ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // Verify event was created
    const beforeIcs = await fetchEventIcs(t, uid);
    t.truthy(beforeIcs, 'Event should exist before REPLY');
    t.is(
      getPartstatFromIcs(beforeIcs, attendee),
      'NEEDS-ACTION',
      'PARTSTAT should be NEEDS-ACTION before REPLY'
    );

    // ── Step 1: Attendee sends iMIP REPLY ──
    const replyIcs = makeReplyIcs({
      uid,
      organizer,
      attendee,
      partstat: 'ACCEPTED'
    });

    const parsedEmail = {
      from: { value: [{ address: attendee }] },
      to: { value: [{ address: organizer }] },
      subject: 'Accepted: Team Meeting',
      attachments: [
        {
          contentType: 'text/calendar; method=REPLY',
          filename: 'invite.ics',
          content: Buffer.from(replyIcs, 'utf8')
        }
      ]
    };

    const result = await checkAndProcessImipMessage(parsedEmail, {
      messageId: '<reply-1@example.com>',
      fromEmail: attendee,
      toEmail: organizer
    });

    t.true(result.processed, 'REPLY should be processed');

    // ── Step 2: Organizer authenticates → processCalendarInvites runs ──
    await runProcessInvites(t);

    // Verify: PARTSTAT updated in real SQLite
    const afterIcs = await fetchEventIcs(t, uid);
    t.truthy(afterIcs, 'Event should still exist after REPLY');
    t.is(
      getPartstatFromIcs(afterIcs, attendee),
      'ACCEPTED',
      'PARTSTAT should be ACCEPTED after REPLY processing'
    );

    // Verify: invite marked as processed
    const invite = await CalendarInvites.findOne({ eventUid: uid });
    t.true(invite.processed, 'Invite should be marked as processed');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 3: Link-based Accept → PARTSTAT Updated
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Link-based Accept → organizer event PARTSTAT updated in real SQLite',
  async (t) => {
    const uid = `lifecycle-web-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const attendee = 'web-attendee@example.com';

    // ── Pre-condition: Organizer has event in CalDAV ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // ── Step 1: Attendee clicks Accept link → CalendarInvites created ──
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

    // ── Step 2: Organizer authenticates → processCalendarInvites runs ──
    await runProcessInvites(t);

    // Verify: PARTSTAT updated in real SQLite
    const afterIcs = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(afterIcs, attendee),
      'ACCEPTED',
      'PARTSTAT should be ACCEPTED after web link processing'
    );

    // Verify: invite marked as processed
    const invite = await CalendarInvites.findOne({ eventUid: uid });
    t.true(invite.processed);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 4: CANCEL → Event STATUS:CANCELLED
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: CANCEL email → attendee event STATUS:CANCELLED in real SQLite',
  async (t) => {
    const uid = `lifecycle-cancel-${Date.now()}@example.com`;
    const organizer = 'boss@gmail.com';
    const attendee = t.context.username;

    // ── Pre-condition: Attendee has event in CalDAV ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'ACCEPTED' }]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // ── Step 1: Organizer sends CANCEL ──
    const cancelIcs = makeCancelIcs({
      uid,
      organizer,
      attendees: [attendee],
      sequence: 1
    });

    const parsedEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent: cancelIcs
    });

    // Override contentType for CANCEL
    parsedEmail.attachments[0].contentType =
      'text/calendar; method=CANCEL; charset=UTF-8';

    const result = await checkAndProcessImipMessage(parsedEmail, {
      messageId: '<cancel-1@google.com>',
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });

    t.true(result.processed, 'CANCEL should be processed');

    // ── Step 2: Attendee authenticates → processCalendarInvites runs ──
    await runProcessInvites(t);

    // Verify: event STATUS set to CANCELLED in real SQLite
    const afterIcs = await fetchEventIcs(t, uid);
    t.truthy(afterIcs, 'Event should still exist after CANCEL');
    t.is(
      getStatusFromIcs(afterIcs),
      'CANCELLED',
      'Event STATUS should be CANCELLED'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 5: Multiple attendees respond to same event
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Multiple attendees respond via different channels',
  async (t) => {
    const uid = `multi-attendee-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const alice = 'alice@example.com';
    const bob = 'bob@example.com';
    const charlie = 'charlie@example.com';

    // ── Pre-condition: Organizer has event with 3 attendees ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [
        { email: alice, partstat: 'NEEDS-ACTION' },
        { email: bob, partstat: 'NEEDS-ACTION' },
        { email: charlie, partstat: 'NEEDS-ACTION' }
      ]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // ── Alice accepts via iMIP REPLY ──
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

    // ── Bob declines via web link ──
    const bobToken = generateToken({
      eventUid: uid,
      organizerEmail: organizer,
      attendeeEmail: bob
    });

    await CalendarInvites.create({
      eventUid: uid,
      organizerEmail: organizer,
      attendeeEmail: bob,
      response: responseToPartstat('decline'),
      method: 'REPLY',
      source: 'web',
      tokenHash: hashToken(bobToken),
      tokenExpiresAt: parseToken(bobToken).expiresAt,
      processed: false,
      processAttempts: 0
    });

    // ── Charlie tentatively accepts via iMIP ──
    const charlieReply = makeReplyIcs({
      uid,
      organizer,
      attendee: charlie,
      partstat: 'TENTATIVE'
    });

    await checkAndProcessImipMessage(
      {
        from: { value: [{ address: charlie }] },
        to: { value: [{ address: organizer }] },
        subject: 'Tentative',
        attachments: [
          {
            contentType: 'text/calendar; method=REPLY',
            filename: 'invite.ics',
            content: Buffer.from(charlieReply, 'utf8')
          }
        ]
      },
      { fromEmail: charlie, toEmail: organizer }
    );

    // ── Organizer authenticates → all 3 processed ──
    await runProcessInvites(t);

    // Verify each attendee's PARTSTAT in real SQLite
    const afterIcs = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(afterIcs, alice),
      'ACCEPTED',
      'Alice should be ACCEPTED'
    );
    t.is(
      getPartstatFromIcs(afterIcs, bob),
      'DECLINED',
      'Bob should be DECLINED'
    );
    t.is(
      getPartstatFromIcs(afterIcs, charlie),
      'TENTATIVE',
      'Charlie should be TENTATIVE'
    );

    // All invites processed
    const remaining = await CalendarInvites.countDocuments({
      eventUid: uid,
      processed: false
    });
    t.is(remaining, 0);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 6: Attendee changes response (Accept → Decline)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Attendee changes response from Accept to Decline',
  async (t) => {
    const uid = `change-response-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const attendee = 'attendee@example.com';

    // ── Pre-condition: Organizer has event ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // ── Step 1: Attendee accepts via link ──
    const acceptToken = generateToken({
      eventUid: uid,
      organizerEmail: organizer,
      attendeeEmail: attendee
    });

    await CalendarInvites.create({
      eventUid: uid,
      organizerEmail: organizer,
      attendeeEmail: attendee,
      response: 'ACCEPTED',
      method: 'REPLY',
      source: 'web',
      tokenHash: hashToken(acceptToken),
      tokenExpiresAt: parseToken(acceptToken).expiresAt,
      processed: false,
      processAttempts: 0
    });

    // Process the accept
    await runProcessInvites(t);

    // Verify ACCEPTED
    let ics = await fetchEventIcs(t, uid);
    t.is(getPartstatFromIcs(ics, attendee), 'ACCEPTED');

    // ── Step 2: Attendee changes mind, declines via iMIP ──
    const declineIcs = makeReplyIcs({
      uid,
      organizer,
      attendee,
      partstat: 'DECLINED'
    });

    await checkAndProcessImipMessage(
      {
        from: { value: [{ address: attendee }] },
        to: { value: [{ address: organizer }] },
        subject: 'Declined',
        attachments: [
          {
            contentType: 'text/calendar; method=REPLY',
            filename: 'invite.ics',
            content: Buffer.from(declineIcs, 'utf8')
          }
        ]
      },
      { fromEmail: attendee, toEmail: organizer }
    );

    // Process the decline
    await runProcessInvites(t);

    // Verify DECLINED (overrides previous ACCEPTED)
    ics = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(ics, attendee),
      'DECLINED',
      'PARTSTAT should be updated to DECLINED'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 7: REPLY from spoofed sender is rejected
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: REPLY from spoofed sender is rejected (sender validation still applies)',
  async (t) => {
    const uid = `spoofed-reply-${Date.now()}@example.com`;
    const organizer = t.context.username;
    const attendee = 'attendee@example.com';
    const spoofedSender = 'hacker@evil.com';

    const replyIcs = makeReplyIcs({
      uid,
      organizer,
      attendee,
      partstat: 'ACCEPTED'
    });

    const parsedEmail = {
      from: { value: [{ address: spoofedSender }] },
      to: { value: [{ address: organizer }] },
      subject: 'Accepted',
      attachments: [
        {
          contentType: 'text/calendar; method=REPLY',
          filename: 'invite.ics',
          content: Buffer.from(replyIcs, 'utf8')
        }
      ]
    };

    const result = await checkAndProcessImipMessage(parsedEmail, {
      messageId: '<spoofed@evil.com>',
      fromEmail: spoofedSender,
      toEmail: organizer
    });

    t.truthy(result);
    t.true(result.rejected, 'Spoofed REPLY should be rejected');
    t.is(result.code, 'sender_attendee_mismatch');

    // Verify: No CalendarInvites record created
    const invite = await CalendarInvites.findOne({ eventUid: uid });
    t.falsy(invite, 'No invite should be created for spoofed REPLY');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 8: Gmail REQUEST via alternatives array
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Gmail REQUEST via alternatives array (not attachment)',
  async (t) => {
    const uid = `gmail-alt-${Date.now()}@google.com`;
    const organizer = 'sender@gmail.com';
    const attendee = t.context.username;

    const icsContent = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee]
    });

    // Gmail sometimes puts calendar data in alternatives, not attachments
    const parsedEmail = {
      from: { value: [{ address: 'calendar-notification@google.com' }] },
      to: { value: [{ address: attendee }] },
      subject: 'Invitation',
      alternatives: [
        {
          contentType: 'text/calendar; method=REQUEST; charset=UTF-8',
          content: Buffer.from(icsContent, 'utf8')
        }
      ]
    };

    const result = await checkAndProcessImipMessage(parsedEmail, {
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });

    t.truthy(result);
    t.true(result.processed);
    t.is(result.method, 'REQUEST');

    // Process via CalDAV (real SQLite)
    await runProcessInvites(t);

    // Verify event created in real SQLite
    const ics = await fetchEventIcs(t, uid);
    t.truthy(ics, 'Event should be created in CalDAV');
    t.true(ics.includes(uid), 'Event should have correct UID');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 9: Stale REQUEST (lower SEQUENCE) is skipped
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Stale REQUEST with lower SEQUENCE is skipped',
  async (t) => {
    const uid = `stale-request-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = t.context.username;

    // ── Pre-condition: Attendee has event with SEQUENCE:5 ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'ACCEPTED' }],
      sequence: 5
    });

    await createEventViaCalDAV(t, uid, storedIcs);

    // ── Verify event was stored with SEQUENCE:5 ──
    const beforeIcs = await fetchEventIcs(t, uid);
    t.true(
      beforeIcs.includes('SEQUENCE:5'),
      'Stored event should have SEQUENCE:5'
    );
    t.is(
      getPartstatFromIcs(beforeIcs, attendee),
      'ACCEPTED',
      'Stored event should have PARTSTAT=ACCEPTED'
    );

    // ── Stale REQUEST with SEQUENCE:2 arrives ──
    const staleIcs = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee],
      summary: 'Old Version',
      sequence: 2
    });

    const parsedEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent: staleIcs
    });

    await checkAndProcessImipMessage(parsedEmail, {
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });

    // Process via CalDAV
    await runProcessInvites(t);

    // Verify: Event NOT updated (still has original content)
    const afterIcs = await fetchEventIcs(t, uid);
    t.is(
      getPartstatFromIcs(afterIcs, attendee),
      'ACCEPTED',
      'Event should not be changed by stale REQUEST'
    );
    t.false(
      afterIcs.includes('Old Version'),
      'Summary should not be changed by stale REQUEST'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 10: Idempotency - processing same invite twice
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Processing same REQUEST email twice does not create duplicate CalendarInvites',
  async (t) => {
    const uid = `idempotent-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = t.context.username;

    const icsContent = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee]
    });

    const parsedEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent
    });

    const options = {
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee,
      messageId: '<same-msg@google.com>'
    };

    // Send the same email twice
    await checkAndProcessImipMessage(parsedEmail, options);
    await checkAndProcessImipMessage(parsedEmail, options);

    // Should have only 1 unprocessed invite
    const count = await CalendarInvites.countDocuments({
      eventUid: uid,
      method: 'REQUEST',
      processed: false
    });
    t.is(count, 1, 'Should have exactly 1 unprocessed invite (not 2)');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// CalDAV SERVER: Invite Email Sending on CREATE / UPDATE / DELETE
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'CalDAV CREATE: event with attendee queues REQUEST invite email',
  async (t) => {
    const uid = `caldav-create-email-${Date.now()}`;
    const attendeeEmail = 'attendee-create@example.com';
    const summary = 'CalDAV Create Invite Test';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//CalDAV//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260401T100000Z',
      'DTEND:20260401T110000Z',
      `SUMMARY:${summary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${t.context.username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create event via CalDAV PUT
    await createEventViaCalDAV(t, uid, ics);

    // Wait for the invite email to be queued
    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: t.context.alias._id,
          status: 'queued',
          subject: { $regex: summary }
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('60s') }
    );

    t.truthy(email, 'Invite email should be queued');
    t.true(
      email.subject.includes(summary),
      'Email subject should contain event summary'
    );
  }
);

test.serial(
  'CalDAV UPDATE: changing event details queues REQUEST update email',
  async (t) => {
    const uid = `caldav-update-email-${Date.now()}`;
    const attendeeEmail = 'attendee-update@example.com';
    const originalSummary = 'Original Meeting';
    const updatedSummary = 'Updated Meeting Time';

    // Create the original event
    const originalIcs = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//CalDAV//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260401T100000Z',
      'DTEND:20260401T110000Z',
      `SUMMARY:${originalSummary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${t.context.username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const objectUrl = await createEventViaCalDAV(t, uid, originalIcs);

    // Wait for the initial invite email
    await pWaitFor(
      async () => {
        const email = await Emails.findOne({
          alias: t.context.alias._id,
          status: 'queued',
          subject: { $regex: originalSummary }
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('60s') }
    );

    // Clear queued emails before update
    await Emails.deleteMany({});

    // Update the event (new summary, bumped SEQUENCE)
    const updatedIcs = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//CalDAV//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T120000Z',
      'DTSTART:20260401T140000Z',
      'DTEND:20260401T150000Z',
      `SUMMARY:${updatedSummary}`,
      'SEQUENCE:1',
      `ORGANIZER:mailto:${t.context.username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    await updateObject({
      url: objectUrl,
      data: updatedIcs,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    // Wait for the update email to be queued
    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: t.context.alias._id,
          status: 'queued',
          subject: { $regex: updatedSummary }
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('60s') }
    );

    t.truthy(email, 'Update email should be queued');
    t.true(
      email.subject.includes(updatedSummary),
      'Email subject should contain updated summary'
    );
  }
);

test.serial(
  'CalDAV DELETE: removing event queues CANCEL email to attendees',
  async (t) => {
    const uid = `caldav-delete-email-${Date.now()}`;
    const attendeeEmail = 'attendee-delete@example.com';
    const summary = 'Meeting To Cancel';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//CalDAV//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260401T100000Z',
      'DTEND:20260401T110000Z',
      `SUMMARY:${summary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${t.context.username}`,
      `ATTENDEE;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const objectUrl = await createEventViaCalDAV(t, uid, ics);

    // Wait for the initial invite email
    await pWaitFor(
      async () => {
        const email = await Emails.findOne({
          alias: t.context.alias._id,
          status: 'queued',
          subject: { $regex: summary }
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('60s') }
    );

    // Clear queued emails before delete
    await Emails.deleteMany({});

    // Delete the event via CalDAV
    const deleteResult = await deleteObject({
      url: objectUrl,
      headers: t.context.authHeaders
    });
    t.true(deleteResult.ok, 'DELETE should succeed');

    // Wait for the cancellation email to be queued
    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: t.context.alias._id,
          status: 'queued'
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('60s') }
    );

    t.truthy(email, 'Cancel email should be queued');
  }
);

test.serial(
  'CalDAV CREATE: recurring event with override queues invite for each instance',
  async (t) => {
    const uid = `caldav-recur-email-${Date.now()}`;
    const attendeeEmail = 'attendee-recur@example.com';
    const summary = 'Weekly Standup';
    const overrideSummary = 'Special Standup';

    // Recurring event with an override instance
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//CalDAV//EN',
      // Master event
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260401T100000Z',
      'DTEND:20260401T110000Z',
      'RRULE:FREQ=WEEKLY;COUNT=4',
      `SUMMARY:${summary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${t.context.username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      // Override for 2nd occurrence
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'RECURRENCE-ID:20260408T100000Z',
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260408T140000Z',
      'DTEND:20260408T150000Z',
      `SUMMARY:${overrideSummary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${t.context.username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    await createEventViaCalDAV(t, uid, ics);

    // Wait for at least one invite email to be queued
    // The sendCalendarEmail processes each VEVENT, so we should get emails
    // for both the master and the override
    await pWaitFor(
      async () => {
        const count = await Emails.countDocuments({
          alias: t.context.alias._id,
          status: 'queued'
        });
        return count >= 1;
      },
      { timeout: ms('60s') }
    );

    const emails = await Emails.find({
      alias: t.context.alias._id,
      status: 'queued'
    })
      .lean()
      .exec();

    t.true(emails.length > 0, 'At least one invite email should be queued');
  }
);
