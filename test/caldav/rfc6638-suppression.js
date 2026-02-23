/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */
/**
 * RFC 6638 Scheduling Suppression E2E Tests (CalDAV)
 *
 * These tests verify that the CalDAV server correctly suppresses outbound
 * scheduling emails when any of the following suppression mechanisms are used:
 *
 *   1. ORGANIZER;SCHEDULE-AGENT=NONE  (RFC 6638 §7.1)
 *   2. ORGANIZER;SCHEDULE-AGENT=CLIENT (RFC 6638 §7.1)
 *   3. ATTENDEE;SCHEDULE-AGENT=NONE   (RFC 6638 §7.1)
 *   4. Schedule-Reply: F header        (RFC 6638 §8.1)
 *   5. ATTENDEE;RSVP=FALSE            (RFC 5546 §3.2.2)
 *
 * A single real CalDAV + SQLite server is shared across all tests.
 * All tests use the real CalDAV PUT / DELETE paths (not the REST API).
 */
const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const tsdav = require('tsdav');
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

const {
  getBasicAuthHeaders,
  createAccount,
  fetchCalendars,
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

/**
 * Build an organizer-side event ICS.
 * `scheduleAgent` is an optional value like 'NONE' or 'CLIENT' to add
 * SCHEDULE-AGENT to the ORGANIZER property.
 */
function makeOrganizerIcs({
  uid,
  organizer,
  attendees,
  summary = 'Test Meeting',
  sequence = 0,
  scheduleAgent = null
}) {
  const organizerLine = scheduleAgent
    ? `ORGANIZER;SCHEDULE-AGENT=${scheduleAgent}:mailto:${organizer}`
    : `ORGANIZER:mailto:${organizer}`;
  const attendeeLines = attendees
    .map(
      (a) =>
        `ATTENDEE;PARTSTAT=${a.partstat || 'NEEDS-ACTION'};RSVP=${
          a.rsvp === false ? 'FALSE' : 'TRUE'
        }:mailto:${a.email}`
    )
    .join('\r\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T100000Z',
    'DTSTART:20260401T100000Z',
    'DTEND:20260401T110000Z',
    `SUMMARY:${summary}`,
    `SEQUENCE:${sequence}`,
    organizerLine,
    attendeeLines,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Build an attendee-side event ICS (the authenticated user is an attendee,
 * not the organizer).  `scheduleAgent` adds SCHEDULE-AGENT to the ORGANIZER
 * property; `attendeeScheduleAgent` adds it to the attendee's own property.
 */
function makeAttendeeIcs({
  uid,
  organizer,
  attendeeEmail,
  partstat = 'ACCEPTED',
  summary = 'Test Meeting',
  sequence = 0,
  scheduleAgent = null,
  attendeeScheduleAgent = null,
  rsvp = true
}) {
  const organizerLine = scheduleAgent
    ? `ORGANIZER;SCHEDULE-AGENT=${scheduleAgent}:mailto:${organizer}`
    : `ORGANIZER:mailto:${organizer}`;
  let attendeeLine = `ATTENDEE;PARTSTAT=${partstat};RSVP=${
    rsvp ? 'TRUE' : 'FALSE'
  }`;
  if (attendeeScheduleAgent) {
    attendeeLine += `;SCHEDULE-AGENT=${attendeeScheduleAgent}`;
  }

  attendeeLine += `:mailto:${attendeeEmail}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260214T120000Z',
    'DTSTART:20260401T100000Z',
    'DTEND:20260401T110000Z',
    `SUMMARY:${summary}`,
    `SEQUENCE:${sequence}`,
    organizerLine,
    attendeeLine,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// ─── CalDAV Server Setup (shared across all tests) ───────────────────────────

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
  const closeWithTimeout = (server, timeout = 3000) =>
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
  if (t.context.calDAV) await closeWithTimeout(t.context.calDAV.server);
  if (t.context.sqlite) await closeWithTimeout(t.context.sqlite.server);
  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {
      // ignore
    }
  }

  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

test.afterEach.always(async () => {
  await Emails.deleteMany({});
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function createEventViaCalDAV(t, uid, icsData, extraHeaders = {}) {
  const calendar = t.context.calendars.find((c) =>
    c.components?.includes('VEVENT')
  );
  const objectUrl = new URL(`${uid}.ics`, calendar.url).href;
  await createObject({
    url: objectUrl,
    data: icsData,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      ...t.context.authHeaders,
      ...extraHeaders
    }
  });
  return objectUrl;
}

// Wait up to `timeout` ms for at least one queued email, return null if none.
async function waitForQueuedEmail(t, timeout = ms('15s')) {
  let email = null;
  try {
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
      { timeout }
    );
  } catch {
    // pWaitFor throws on timeout — email stays null
  }

  return email;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION: Normal CalDAV CREATE still queues REQUEST invite
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 regression — normal CREATE still queues REQUEST invite email',
  async (t) => {
    const uid = `caldav-rfc6638-regression-${Date.now()}`;
    const attendeeEmail = 'attendee-normal@example.com';
    const summary = 'Normal Invite';
    const ics = makeOrganizerIcs({
      uid,
      organizer: t.context.username,
      attendees: [{ email: attendeeEmail }],
      summary
    });
    await createEventViaCalDAV(t, uid, ics);
    const email = await waitForQueuedEmail(t, ms('60s'));
    t.truthy(email, 'REQUEST invite email should be queued for a normal event');
    t.true(
      email.subject.includes(summary),
      'Email subject should contain event summary'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses REQUEST on CREATE
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses REQUEST invite on CREATE',
  async (t) => {
    const uid = `caldav-org-sa-none-create-${Date.now()}`;
    const attendeeEmail = 'attendee-sa-none@example.com';
    const summary = 'SA=NONE Create Test';
    const ics = makeOrganizerIcs({
      uid,
      organizer: t.context.username,
      attendees: [{ email: attendeeEmail }],
      summary,
      scheduleAgent: 'NONE'
    });
    await createEventViaCalDAV(t, uid, ics);
    const email = await waitForQueuedEmail(t);
    t.is(
      email,
      null,
      'No REQUEST email should be queued when ORGANIZER;SCHEDULE-AGENT=NONE'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=CLIENT suppresses REQUEST on CREATE
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=CLIENT suppresses REQUEST invite on CREATE',
  async (t) => {
    const uid = `caldav-org-sa-client-create-${Date.now()}`;
    const attendeeEmail = 'attendee-sa-client@example.com';
    const summary = 'SA=CLIENT Create Test';
    const ics = makeOrganizerIcs({
      uid,
      organizer: t.context.username,
      attendees: [{ email: attendeeEmail }],
      summary,
      scheduleAgent: 'CLIENT'
    });
    await createEventViaCalDAV(t, uid, ics);
    const email = await waitForQueuedEmail(t);
    t.is(
      email,
      null,
      'No REQUEST email should be queued when ORGANIZER;SCHEDULE-AGENT=CLIENT'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses REPLY on attendee PUT
//
// Scenario: the authenticated user is an ATTENDEE (not the organizer).
// The organizer is an external address.  The user changes their PARTSTAT from
// NEEDS-ACTION to ACCEPTED via a CalDAV PUT.  Because ORGANIZER;SCHEDULE-AGENT=NONE
// is set, the server must NOT send a REPLY email back to the organizer.
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses REPLY on attendee PUT',
  async (t) => {
    const uid = `caldav-org-sa-none-reply-${Date.now()}`;
    const organizer = 'organizer-external@example.com';
    const attendeeEmail = t.context.username;
    const summary = 'SA=NONE Reply Test';

    // Step 1: create the event as if it was delivered to the attendee
    // (organizer is external, attendee is the authenticated user)
    const initialIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'NEEDS-ACTION',
      summary,
      scheduleAgent: 'NONE'
    });
    const objectUrl = await createEventViaCalDAV(t, uid, initialIcs);

    // No email should be queued on create (attendee-side create, no REQUEST)
    await Emails.deleteMany({});

    // Step 2: attendee updates PARTSTAT to ACCEPTED via CalDAV PUT
    const acceptedIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'ACCEPTED',
      summary,
      scheduleAgent: 'NONE'
    });
    await updateObject({
      url: objectUrl,
      data: acceptedIcs,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    const email = await waitForQueuedEmail(t);
    t.is(
      email,
      null,
      'No REPLY email should be sent when ORGANIZER;SCHEDULE-AGENT=NONE'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §8.1 — Schedule-Reply: F header suppresses REPLY on attendee PUT
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §8.1 — Schedule-Reply: F header suppresses REPLY on attendee PUT',
  async (t) => {
    const uid = `caldav-schedule-reply-f-put-${Date.now()}`;
    const organizer = 'organizer-sr@example.com';
    const attendeeEmail = t.context.username;
    const summary = 'Schedule-Reply F PUT Test';

    // Step 1: create the event (no suppression on create)
    const initialIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'NEEDS-ACTION',
      summary
    });
    const objectUrl = await createEventViaCalDAV(t, uid, initialIcs);
    await Emails.deleteMany({});

    // Step 2: attendee updates PARTSTAT with Schedule-Reply: F header
    const acceptedIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'ACCEPTED',
      summary
    });
    await updateObject({
      url: objectUrl,
      data: acceptedIcs,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        'schedule-reply': 'F',
        ...t.context.authHeaders
      }
    });

    const email = await waitForQueuedEmail(t);
    t.is(
      email,
      null,
      'No REPLY email should be sent when Schedule-Reply: F header is present'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §8.1 — Schedule-Reply: F header suppresses DECLINED REPLY on DELETE
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §8.1 — Schedule-Reply: F header suppresses DECLINED REPLY on DELETE',
  async (t) => {
    const uid = `caldav-schedule-reply-f-delete-${Date.now()}`;
    const organizer = 'organizer-sr-del@example.com';
    const attendeeEmail = t.context.username;
    const summary = 'Schedule-Reply F DELETE Test';

    // Step 1: create the event
    const initialIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'ACCEPTED',
      summary
    });
    const objectUrl = await createEventViaCalDAV(t, uid, initialIcs);
    await Emails.deleteMany({});

    // Step 2: attendee deletes the event with Schedule-Reply: F
    const deleteResult = await deleteObject({
      url: objectUrl,
      headers: {
        'schedule-reply': 'F',
        ...t.context.authHeaders
      }
    });
    t.true(deleteResult.ok, 'DELETE should succeed');

    const email = await waitForQueuedEmail(t);
    t.is(
      email,
      null,
      'No DECLINED REPLY email should be sent when Schedule-Reply: F header is present on DELETE'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses DECLINED REPLY on DELETE
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses DECLINED REPLY on DELETE',
  async (t) => {
    const uid = `caldav-org-sa-none-delete-${Date.now()}`;
    const organizer = 'organizer-sa-none-del@example.com';
    const attendeeEmail = t.context.username;
    const summary = 'SA=NONE DELETE Test';

    // Step 1: create the event
    const initialIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'ACCEPTED',
      summary,
      scheduleAgent: 'NONE'
    });
    const objectUrl = await createEventViaCalDAV(t, uid, initialIcs);
    await Emails.deleteMany({});

    // Step 2: attendee deletes the event (ORGANIZER;SCHEDULE-AGENT=NONE is in the stored ICS)
    const deleteResult = await deleteObject({
      url: objectUrl,
      headers: t.context.authHeaders
    });
    t.true(deleteResult.ok, 'DELETE should succeed');

    const email = await waitForQueuedEmail(t);
    t.is(
      email,
      null,
      'No DECLINED REPLY email should be sent when ORGANIZER;SCHEDULE-AGENT=NONE'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §7.1 — ATTENDEE;SCHEDULE-AGENT=NONE suppresses REPLY on attendee PUT
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §7.1 — ATTENDEE;SCHEDULE-AGENT=NONE suppresses REPLY on attendee PUT',
  async (t) => {
    const uid = `caldav-att-sa-none-reply-${Date.now()}`;
    const organizer = 'organizer-att-sa@example.com';
    const attendeeEmail = t.context.username;
    const summary = 'ATTENDEE SA=NONE Reply Test';

    const initialIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'NEEDS-ACTION',
      summary,
      attendeeScheduleAgent: 'NONE'
    });
    const objectUrl = await createEventViaCalDAV(t, uid, initialIcs);
    await Emails.deleteMany({});

    const acceptedIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'ACCEPTED',
      summary,
      attendeeScheduleAgent: 'NONE'
    });
    await updateObject({
      url: objectUrl,
      data: acceptedIcs,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    const email = await waitForQueuedEmail(t);
    t.is(
      email,
      null,
      'No REPLY email should be sent when ATTENDEE;SCHEDULE-AGENT=NONE'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 5546 §3.2.2 — ATTENDEE;RSVP=FALSE suppresses REPLY on attendee PUT
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 5546 §3.2.2 — ATTENDEE;RSVP=FALSE suppresses REPLY on attendee PUT',
  async (t) => {
    const uid = `caldav-rsvp-false-reply-${Date.now()}`;
    const organizer = 'organizer-rsvp@example.com';
    const attendeeEmail = t.context.username;
    const summary = 'RSVP=FALSE Reply Test';

    const initialIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'NEEDS-ACTION',
      summary,
      rsvp: false
    });
    const objectUrl = await createEventViaCalDAV(t, uid, initialIcs);
    await Emails.deleteMany({});

    const acceptedIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'ACCEPTED',
      summary,
      rsvp: false
    });
    await updateObject({
      url: objectUrl,
      data: acceptedIcs,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        ...t.context.authHeaders
      }
    });

    const email = await waitForQueuedEmail(t);
    t.is(email, null, 'No REPLY email should be sent when ATTENDEE;RSVP=FALSE');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// RFC 6638 §8.1 — Schedule-Reply: T (explicit true) still sends REPLY
// ═══════════════════════════════════════════════════════════════════════════════
test.serial(
  'CalDAV RFC 6638 §8.1 — Schedule-Reply: T header still sends REPLY on attendee PUT',
  async (t) => {
    const uid = `caldav-schedule-reply-t-${Date.now()}`;
    const organizer = 'organizer-sr-t@example.com';
    const attendeeEmail = t.context.username;
    const summary = 'Schedule-Reply T Test';

    const initialIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'NEEDS-ACTION',
      summary
    });
    const objectUrl = await createEventViaCalDAV(t, uid, initialIcs);
    await Emails.deleteMany({});

    const acceptedIcs = makeAttendeeIcs({
      uid,
      organizer,
      attendeeEmail,
      partstat: 'ACCEPTED',
      summary
    });
    await updateObject({
      url: objectUrl,
      data: acceptedIcs,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        'schedule-reply': 'T',
        ...t.context.authHeaders
      }
    });

    const email = await waitForQueuedEmail(t, ms('60s'));
    t.truthy(
      email,
      'REPLY email should still be sent when Schedule-Reply: T is present'
    );
  }
);
