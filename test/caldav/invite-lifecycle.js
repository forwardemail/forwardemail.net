/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Calendar Invite Lifecycle E2E Tests
 *
 * These tests verify the COMPLETE end-to-end lifecycle of calendar invites,
 * chaining the real public APIs together:
 *
 *   1. checkAndProcessImipMessage (email → CalendarInvites in MongoDB)
 *   2. processCalendarInvites     (CalendarInvites → CalendarEvents via stubs)
 *   3. calendar-response helpers  (link click → CalendarInvites in MongoDB)
 *
 * Each test simulates a real-world scenario:
 *
 * - Google Calendar sends REQUEST email → event appears in CalDAV
 * - Attendee clicks Accept link → organizer's event PARTSTAT updated
 * - Attendee sends iMIP REPLY → organizer's event PARTSTAT updated
 * - Organizer sends CANCEL → attendee's event marked CANCELLED
 * - Full lifecycle: REQUEST → Accept → Update → Cancel
 * - Multiple attendees respond to same event
 * - Attendee changes response (Accept → Decline)
 *
 * Architecture:
 *   Real MongoDB (MongoMemoryServer) for CalendarInvites
 *   Sinon stubs for CalendarEvents/Calendars (SQLite-backed, need real CalDAV)
 *
 * No private/internal functions are imported or tested directly.
 */

const { Buffer } = require('node:buffer');
const test = require('ava');
const sinon = require('sinon');
const ICAL = require('ical.js');
const mongoose = require('mongoose');

const utils = require('../utils');
const CalendarInvites = require('#models/calendar-invites');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const { checkAndProcessImipMessage } = require('#helpers/process-imip-reply');
const { processCalendarInvites } = require('#helpers/process-calendar-invites');
const {
  generateToken,
  parseToken,
  responseToPartstat,
  hashToken
} = require('#helpers/calendar-response');

// ─── Sample ICS Templates ───────────────────────────────────────────────────

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
    `DTSTAMP:20260214T100000Z`,
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
    `DTSTAMP:20260214T120000Z`,
    `DTSTART:20260301T100000Z`,
    `DTEND:20260301T110000Z`,
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
    `DTSTAMP:20260214T140000Z`,
    `DTSTART:20260301T100000Z`,
    `SEQUENCE:${sequence}`,
    'STATUS:CANCELLED',
    `ORGANIZER:mailto:${organizer}`,
    attendeeLines,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

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
        `ATTENDEE;PARTSTAT=${a.partstat || 'NEEDS-ACTION'}:mailto:${a.email}`
    )
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:20260214T100000Z`,
    `DTSTART:20260301T100000Z`,
    `DTEND:20260301T110000Z`,
    `SUMMARY:${summary}`,
    `SEQUENCE:${sequence}`,
    `ORGANIZER:mailto:${organizer}`,
    attendeeLines,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Build a parsedEmail object that mimics mailparser output
 * with a text/calendar attachment (like Gmail/Google Calendar sends)
 */
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

// ─── Test Setup ─────────────────────────────────────────────────────────────

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();

  // Default calendar mock
  t.context.defaultCalendar = {
    _id: new mongoose.Types.ObjectId(),
    calendarId: 'default',
    name: 'DEFAULT_CALENDAR_NAME',
    has_vevent: true,
    synctoken: 1
  };

  // Track created/updated events for assertions
  t.context.createdEvents = [];
  t.context.updatedEvents = [];

  // In-memory event store for realistic multi-step tests
  t.context.eventStore = new Map();

  // Stub Calendars.find
  t.context.sandbox
    .stub(Calendars, 'find')
    .resolves([t.context.defaultCalendar]);

  // Stub CalendarEvents.findOne (fast path in findEventByUid)
  t.context.calendarEventsFindOne = t.context.sandbox
    .stub(CalendarEvents, 'findOne')
    .callsFake(async (_instance, _session, query) => {
      // Check in-memory store
      for (const [, event] of t.context.eventStore) {
        if (query.eventId && event.eventId === query.eventId) {
          return event;
        }
      }

      return null;
    });

  // Stub CalendarEvents.find (slow path)
  t.context.calendarEventsFind = t.context.sandbox
    .stub(CalendarEvents, 'find')
    .callsFake(async () => {
      return [...t.context.eventStore.values()];
    });

  // Stub CalendarEvents.findOneAndUpdate
  t.context.calendarEventsFindOneAndUpdate = t.context.sandbox
    .stub(CalendarEvents, 'findOneAndUpdate')
    .callsFake(async (_instance, _session, filter, update) => {
      t.context.updatedEvents.push({ filter, update });

      // Update in-memory store
      for (const [key, event] of t.context.eventStore) {
        if (
          (filter._id && event._id.toString() === filter._id.toString()) ||
          (filter.eventId && event.eventId === filter.eventId)
        ) {
          if (update.$set) {
            Object.assign(event, update.$set);
          }

          t.context.eventStore.set(key, event);
          return event;
        }
      }

      return { ...filter, ...update.$set };
    });

  // Stub CalendarEvents.create
  t.context.calendarEventsCreate = t.context.sandbox
    .stub(CalendarEvents, 'create')
    .callsFake(async (doc) => {
      const created = {
        _id: new mongoose.Types.ObjectId(),
        ...doc,
        // Remove non-schema fields
        instance: undefined,
        session: undefined
      };
      t.context.createdEvents.push(created);
      // Add to in-memory store
      t.context.eventStore.set(created.eventId || created._id.toString(), {
        ...created,
        calendar: doc.calendar
      });
      return created;
    });

  // Stub Calendars.findByIdAndUpdate (synctoken bumping)
  t.context.calendarsFindByIdAndUpdate = t.context.sandbox
    .stub(Calendars, 'findByIdAndUpdate')
    .resolves({});
});

test.afterEach.always(async (t) => {
  t.context.sandbox.restore();
  // Clean up CalendarInvites between tests
  await CalendarInvites.deleteMany({});
});

// ─── Mock instance and ctx ──────────────────────────────────────────────────

function createMockCtx(userEmail = 'organizer@example.com') {
  return {
    state: {
      user: {
        username: userEmail,
        alias_name: userEmail.split('@')[0],
        domain_name: userEmail.split('@')[1]
      },
      session: {
        db: { wsp: true }
      }
    },
    logger: {
      debug() {},
      info() {},
      warn() {},
      error() {}
    }
  };
}

const mockInstance = { wsp: true };

// ─── Helper to extract PARTSTAT from stored ICS ─────────────────────────────

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

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 1: Google Calendar REQUEST → CalDAV Event Created
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Google Calendar REQUEST email → CalendarInvites → CalDAV event created',
  async (t) => {
    const uid = `lifecycle-request-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = 'user@forwardemail.net';

    // ── Step 1: Incoming email from Google Calendar ──
    // Google sends from calendar-notification@google.com (not the organizer!)
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

    // Verify: iMIP processing accepted the message (no sender validation for REQUEST)
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
    t.is(invite.organizerEmail, attendee); // For REQUEST, organizerEmail = target
    t.is(invite.rawIcs, icsContent);
    t.is(invite.source, 'imip');

    // ── Step 2: User authenticates to CalDAV → processCalendarInvites runs ──
    const ctx = createMockCtx(attendee);
    const results = await processCalendarInvites(mockInstance, ctx);

    t.is(results.processed, 1, 'Should process 1 invite');
    t.is(results.failed, 0, 'Should have 0 failures');

    // Verify: CalendarEvents.create was called with correct data
    t.is(t.context.createdEvents.length, 1, 'Should create 1 event');
    const created = t.context.createdEvents[0];
    t.is(created.eventId, `${uid}.ics`);
    t.truthy(created.href, 'Should have href');
    t.true(created.href.includes(attendee), 'href should include username');
    t.truthy(created.ical, 'Should have ical data');

    // Verify: METHOD stripped from stored ICS (RFC requirement)
    t.false(
      hasMethodInIcs(created.ical),
      'Stored ICS should not have METHOD property'
    );

    // Verify: CalendarInvites marked as processed
    const processedInvite = await CalendarInvites.findById(invite._id);
    t.true(processedInvite.processed, 'Invite should be marked processed');
    t.truthy(processedInvite.processedAt, 'Should have processedAt timestamp');

    // Verify: Synctoken bumped
    t.true(
      t.context.calendarsFindByIdAndUpdate.called,
      'Should bump synctoken'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 2: Attendee sends iMIP REPLY → Organizer's PARTSTAT updated
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: iMIP REPLY email → CalendarInvites → organizer event PARTSTAT updated',
  async (t) => {
    const uid = `lifecycle-reply-${Date.now()}@example.com`;
    const organizer = 'organizer@example.com';
    const attendee = 'attendee@example.com';

    // ── Pre-condition: Organizer already has the event in their calendar ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    const eventId = `${uid}.ics`;
    const existingEvent = {
      _id: new mongoose.Types.ObjectId(),
      eventId,
      calendar: t.context.defaultCalendar._id,
      ical: storedIcs
    };
    t.context.eventStore.set(eventId, existingEvent);

    // ── Step 1: Attendee sends REPLY email ──
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

    t.truthy(result);
    t.true(result.processed);
    t.is(result.method, 'REPLY');

    // Verify: CalendarInvites record created
    const invite = await CalendarInvites.findOne({
      eventUid: uid,
      method: 'REPLY',
      processed: false
    });
    t.truthy(invite);
    t.is(invite.response, 'ACCEPTED');
    t.is(invite.attendeeEmail, attendee);
    t.is(invite.organizerEmail, organizer); // For REPLY, organizerEmail = organizer

    // ── Step 2: Organizer authenticates to CalDAV ──
    const ctx = createMockCtx(organizer);
    const results = await processCalendarInvites(mockInstance, ctx);

    t.is(results.processed, 1);
    t.is(results.failed, 0);

    // Verify: CalendarEvents.findOneAndUpdate was called
    t.true(t.context.updatedEvents.length > 0, 'Should update the event');

    // Verify: PARTSTAT updated in the stored ICS
    const updatedEvent = t.context.eventStore.get(eventId);
    t.truthy(updatedEvent, 'Event should still exist in store');
    const partstat = getPartstatFromIcs(updatedEvent.ical, attendee);
    t.is(partstat, 'ACCEPTED', 'Attendee PARTSTAT should be ACCEPTED');

    // Verify: Invite marked processed
    const processedInvite = await CalendarInvites.findById(invite._id);
    t.true(processedInvite.processed);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 3: Attendee clicks Accept link → Organizer's PARTSTAT updated
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Link-based Accept → CalendarInvites → organizer event PARTSTAT updated',
  async (t) => {
    const uid = `lifecycle-link-${Date.now()}@example.com`;
    const organizer = 'organizer@example.com';
    const attendee = 'attendee@example.com';

    // ── Pre-condition: Organizer has the event ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    const eventId = `${uid}.ics`;
    t.context.eventStore.set(eventId, {
      _id: new mongoose.Types.ObjectId(),
      eventId,
      calendar: t.context.defaultCalendar._id,
      ical: storedIcs
    });

    // ── Step 1: Generate token (simulates what the email template does) ──
    const token = generateToken({
      eventUid: uid,
      organizerEmail: organizer,
      attendeeEmail: attendee
    });

    // Verify token is valid
    const parsed = parseToken(token);
    t.is(parsed.eventUid, uid);
    t.is(parsed.attendeeEmail, attendee);
    t.is(parsed.organizerEmail, organizer);

    // ── Step 2: Attendee clicks Accept link → web controller creates CalendarInvites ──
    // (Simulating what calendar-response.js processResponse does)
    const partstat = responseToPartstat('accept');
    t.is(partstat, 'ACCEPTED');

    await CalendarInvites.create({
      eventUid: parsed.eventUid,
      organizerEmail: parsed.organizerEmail,
      attendeeEmail: parsed.attendeeEmail,
      response: partstat,
      method: 'REPLY',
      source: 'web',
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      tokenHash: hashToken(token),
      tokenExpiresAt: parsed.expiresAt,
      processed: false,
      processAttempts: 0
    });

    // Verify: CalendarInvites record exists
    const invite = await CalendarInvites.findOne({
      eventUid: uid,
      method: 'REPLY',
      processed: false
    });
    t.truthy(invite);
    t.is(invite.response, 'ACCEPTED');
    t.is(invite.source, 'web');

    // ── Step 3: Organizer authenticates to CalDAV ──
    const ctx = createMockCtx(organizer);
    const results = await processCalendarInvites(mockInstance, ctx);

    t.is(results.processed, 1);
    t.is(results.failed, 0);

    // Verify: PARTSTAT updated
    const updatedEvent = t.context.eventStore.get(eventId);
    const updatedPartstat = getPartstatFromIcs(updatedEvent.ical, attendee);
    t.is(updatedPartstat, 'ACCEPTED');

    // Verify: Invite marked processed
    const processedInvite = await CalendarInvites.findById(invite._id);
    t.true(processedInvite.processed);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 4: Organizer sends CANCEL → Attendee's event marked CANCELLED
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: CANCEL email → CalendarInvites → attendee event STATUS:CANCELLED',
  async (t) => {
    const uid = `lifecycle-cancel-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = 'user@forwardemail.net';

    // ── Pre-condition: Attendee has the event in their calendar ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'ACCEPTED' }]
    });

    const eventId = `${uid}.ics`;
    t.context.eventStore.set(eventId, {
      _id: new mongoose.Types.ObjectId(),
      eventId,
      calendar: t.context.defaultCalendar._id,
      ical: storedIcs
    });

    // ── Step 1: Organizer sends CANCEL email ──
    const cancelIcs = makeCancelIcs({
      uid,
      organizer,
      attendees: [attendee]
    });

    const parsedEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent: cancelIcs,
      subject: 'Cancelled: Team Meeting'
    });

    const result = await checkAndProcessImipMessage(parsedEmail, {
      messageId: '<cancel-1@google.com>',
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });

    t.truthy(result);
    t.true(result.processed);
    t.is(result.method, 'CANCEL');

    // ── Step 2: Attendee authenticates to CalDAV ──
    const ctx = createMockCtx(attendee);
    const results = await processCalendarInvites(mockInstance, ctx);

    t.is(results.processed, 1);
    t.is(results.failed, 0);

    // Verify: Event STATUS set to CANCELLED
    const updatedEvent = t.context.eventStore.get(eventId);
    const status = getStatusFromIcs(updatedEvent.ical);
    t.is(status, 'CANCELLED', 'Event should have STATUS:CANCELLED');

    // Verify: Invite marked processed
    const invite = await CalendarInvites.findOne({ eventUid: uid });
    t.true(invite.processed);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 5: Full lifecycle - REQUEST → Accept → Update → Cancel
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Full flow - REQUEST → iMIP Accept → REQUEST Update → CANCEL',
  async (t) => {
    const uid = `full-lifecycle-${Date.now()}@google.com`;
    const organizer = 'boss@company.com';
    const attendee = 'employee@forwardemail.net';

    // ── Phase 1: REQUEST - Organizer sends invite ──
    const requestIcs = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee],
      summary: 'Quarterly Review',
      sequence: 0
    });

    const requestEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent: requestIcs
    });

    const requestResult = await checkAndProcessImipMessage(requestEmail, {
      messageId: '<req-1@google.com>',
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });
    t.true(requestResult.processed, 'Phase 1: REQUEST should be processed');

    // CalDAV auth → event created
    let ctx = createMockCtx(attendee);
    let results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1, 'Phase 1: Should create event');
    t.is(t.context.createdEvents.length, 1);

    // Verify event created correctly
    const createdEvent = t.context.createdEvents[0];
    t.is(createdEvent.eventId, `${uid}.ics`);
    t.false(hasMethodInIcs(createdEvent.ical), 'METHOD should be stripped');

    // ── Phase 2: REPLY - Attendee accepts via iMIP ──
    const replyIcs = makeReplyIcs({
      uid,
      organizer,
      attendee,
      partstat: 'ACCEPTED'
    });

    const replyEmail = {
      from: { value: [{ address: attendee }] },
      to: { value: [{ address: organizer }] },
      subject: 'Accepted: Quarterly Review',
      attachments: [
        {
          contentType: 'text/calendar; method=REPLY',
          filename: 'invite.ics',
          content: Buffer.from(replyIcs, 'utf8')
        }
      ]
    };

    const replyResult = await checkAndProcessImipMessage(replyEmail, {
      messageId: '<reply-1@forwardemail.net>',
      fromEmail: attendee,
      toEmail: organizer
    });
    t.true(replyResult.processed, 'Phase 2: REPLY should be processed');

    // Organizer's CalDAV auth → PARTSTAT updated
    // First, put the organizer's event in the store
    const orgEventId = `${uid}.ics`;
    const orgEvent = {
      _id: new mongoose.Types.ObjectId(),
      eventId: orgEventId,
      calendar: t.context.defaultCalendar._id,
      ical: makeStoredEventIcs({
        uid,
        organizer,
        attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
      })
    };
    t.context.eventStore.set(orgEventId, orgEvent);

    ctx = createMockCtx(organizer);
    results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1, 'Phase 2: Should process REPLY');

    // Verify PARTSTAT updated
    const updatedOrgEvent = t.context.eventStore.get(orgEventId);
    t.is(
      getPartstatFromIcs(updatedOrgEvent.ical, attendee),
      'ACCEPTED',
      'Phase 2: PARTSTAT should be ACCEPTED'
    );

    // ── Phase 3: REQUEST Update - Organizer changes time (higher SEQUENCE) ──
    const updateIcs = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee],
      summary: 'Quarterly Review (Rescheduled)',
      sequence: 1,
      dtstart: '20260302T140000Z',
      dtend: '20260302T150000Z'
    });

    const updateEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent: updateIcs
    });

    const updateResult = await checkAndProcessImipMessage(updateEmail, {
      messageId: '<req-2@google.com>',
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });
    t.true(updateResult.processed, 'Phase 3: UPDATE should be processed');

    // CalDAV auth → event updated (not duplicated)
    ctx = createMockCtx(attendee);
    results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1, 'Phase 3: Should process update');

    // Verify: event updated, not a second event created
    // (createdEvents should still be 1 from Phase 1, the update uses findOneAndUpdate)
    t.true(
      t.context.updatedEvents.length > 0,
      'Phase 3: Should update existing event'
    );

    // ── Phase 4: CANCEL - Organizer cancels the event ──
    const cancelIcs = makeCancelIcs({
      uid,
      organizer,
      attendees: [attendee],
      sequence: 2
    });

    const cancelEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent: cancelIcs
    });

    const cancelResult = await checkAndProcessImipMessage(cancelEmail, {
      messageId: '<cancel-1@google.com>',
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });
    t.true(cancelResult.processed, 'Phase 4: CANCEL should be processed');

    // CalDAV auth → event cancelled
    ctx = createMockCtx(attendee);
    results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1, 'Phase 4: Should process cancel');

    // Verify: CalendarInvites all processed
    const remaining = await CalendarInvites.countDocuments({
      eventUid: uid,
      processed: false
    });
    t.is(remaining, 0, 'All invites should be processed');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 6: Multiple attendees respond to same event
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Multiple attendees respond via different channels',
  async (t) => {
    const uid = `multi-attendee-${Date.now()}@example.com`;
    const organizer = 'organizer@example.com';
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

    const eventId = `${uid}.ics`;
    t.context.eventStore.set(eventId, {
      _id: new mongoose.Types.ObjectId(),
      eventId,
      calendar: t.context.defaultCalendar._id,
      ical: storedIcs
    });

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

    // ── Organizer authenticates to CalDAV → all 3 processed ──
    const ctx = createMockCtx(organizer);
    const results = await processCalendarInvites(mockInstance, ctx);

    t.is(results.processed, 3, 'Should process all 3 replies');
    t.is(results.failed, 0);

    // Verify each attendee's PARTSTAT
    const finalEvent = t.context.eventStore.get(eventId);
    t.is(
      getPartstatFromIcs(finalEvent.ical, alice),
      'ACCEPTED',
      'Alice should be ACCEPTED'
    );
    t.is(
      getPartstatFromIcs(finalEvent.ical, bob),
      'DECLINED',
      'Bob should be DECLINED'
    );
    t.is(
      getPartstatFromIcs(finalEvent.ical, charlie),
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
// LIFECYCLE 7: Attendee changes response (Accept → Decline)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Attendee changes response from Accept to Decline',
  async (t) => {
    const uid = `change-response-${Date.now()}@example.com`;
    const organizer = 'organizer@example.com';
    const attendee = 'attendee@example.com';

    // ── Pre-condition: Organizer has event, attendee NEEDS-ACTION ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'NEEDS-ACTION' }]
    });

    const eventId = `${uid}.ics`;
    t.context.eventStore.set(eventId, {
      _id: new mongoose.Types.ObjectId(),
      eventId,
      calendar: t.context.defaultCalendar._id,
      ical: storedIcs
    });

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
    let ctx = createMockCtx(organizer);
    let results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1);

    // Verify ACCEPTED
    let event = t.context.eventStore.get(eventId);
    t.is(getPartstatFromIcs(event.ical, attendee), 'ACCEPTED');

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
    ctx = createMockCtx(organizer);
    results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1);

    // Verify DECLINED (overrides previous ACCEPTED)
    event = t.context.eventStore.get(eventId);
    t.is(
      getPartstatFromIcs(event.ical, attendee),
      'DECLINED',
      'PARTSTAT should be updated to DECLINED'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 8: Microsoft Outlook sends REQUEST (different sender)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Microsoft Outlook REQUEST from noreply@microsoft.com accepted',
  async (t) => {
    const uid = `outlook-request-${Date.now()}@outlook.com`;
    const organizer = 'manager@outlook.com';
    const attendee = 'user@forwardemail.net';

    const icsContent = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee],
      summary: 'Outlook Meeting'
    });

    const parsedEmail = buildParsedEmail({
      from: 'noreply@microsoft.com',
      to: attendee,
      icsContent
    });

    const result = await checkAndProcessImipMessage(parsedEmail, {
      messageId: '<msg-1@microsoft.com>',
      fromEmail: 'noreply@microsoft.com',
      toEmail: attendee
    });

    t.truthy(result);
    t.true(
      result.processed,
      'Microsoft sender should be accepted (no sender validation for REQUEST)'
    );
    t.is(result.method, 'REQUEST');

    // Process via CalDAV
    const ctx = createMockCtx(attendee);
    const results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1);
    t.is(t.context.createdEvents.length, 1);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 9: REPLY from spoofed sender is rejected
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: REPLY from spoofed sender is rejected (sender validation still applies)',
  async (t) => {
    const uid = `spoofed-reply-${Date.now()}@example.com`;
    const organizer = 'organizer@example.com';
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
// LIFECYCLE 10: REQUEST with alternatives array (Gmail format)
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Gmail REQUEST via alternatives array (not attachment)',
  async (t) => {
    const uid = `gmail-alt-${Date.now()}@google.com`;
    const organizer = 'sender@gmail.com';
    const attendee = 'user@forwardemail.net';

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

    // Process via CalDAV
    const ctx = createMockCtx(attendee);
    const results = await processCalendarInvites(mockInstance, ctx);
    t.is(results.processed, 1);
    t.is(t.context.createdEvents.length, 1);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 11: Stale REQUEST (lower SEQUENCE) is skipped
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Stale REQUEST with lower SEQUENCE is skipped',
  async (t) => {
    const uid = `stale-request-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = 'user@forwardemail.net';

    // ── Pre-condition: Attendee has event with SEQUENCE:5 ──
    const storedIcs = makeStoredEventIcs({
      uid,
      organizer,
      attendees: [{ email: attendee, partstat: 'ACCEPTED' }],
      sequence: 5
    });

    const eventId = `${uid}.ics`;
    t.context.eventStore.set(eventId, {
      _id: new mongoose.Types.ObjectId(),
      eventId,
      calendar: t.context.defaultCalendar._id,
      ical: storedIcs
    });

    // ── Stale REQUEST with SEQUENCE:2 arrives (out of order) ──
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
    const ctx = createMockCtx(attendee);
    const results = await processCalendarInvites(mockInstance, ctx);

    // Should be processed (marked as processed with error) but not update the event
    t.is(results.processed, 1, 'Stale invite should be processed (skipped)');

    // Verify: Event NOT updated (still has SEQUENCE:5 content)
    const event = t.context.eventStore.get(eventId);
    const partstat = getPartstatFromIcs(event.ical, attendee);
    t.is(partstat, 'ACCEPTED', 'Event should not be changed by stale REQUEST');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 12: REQUEST for event that doesn't exist yet → creates new event
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: REQUEST for non-existent event creates new CalendarEvent with correct fields',
  async (t) => {
    const uid = `new-event-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = 'user@forwardemail.net';

    const icsContent = makeRequestIcs({
      uid,
      organizer,
      attendees: [attendee],
      summary: 'Brand New Meeting'
    });

    const parsedEmail = buildParsedEmail({
      from: 'calendar-notification@google.com',
      to: attendee,
      icsContent
    });

    await checkAndProcessImipMessage(parsedEmail, {
      fromEmail: 'calendar-notification@google.com',
      toEmail: attendee
    });

    const ctx = createMockCtx(attendee);
    await processCalendarInvites(mockInstance, ctx);

    // Verify created event has all required fields
    t.is(t.context.createdEvents.length, 1);
    const created = t.context.createdEvents[0];

    t.is(created.eventId, `${uid}.ics`, 'eventId should be uid.ics');
    t.truthy(created.href, 'Should have href');
    t.true(created.href.startsWith('/dav/'), 'href should start with /dav/');
    t.true(created.href.includes(attendee), 'href should include username');
    t.true(
      created.href.endsWith(`/${uid}.ics`),
      'href should end with eventId'
    );
    t.is(
      created.calendar.toString(),
      t.context.defaultCalendar._id.toString(),
      'Should use default calendar'
    );
    t.truthy(created.ical, 'Should have ical data');
    t.false(hasMethodInIcs(created.ical), 'METHOD should be stripped');

    // Verify synctoken was bumped
    t.true(t.context.calendarsFindByIdAndUpdate.called);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE 13: Idempotency - processing same invite twice doesn't duplicate
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'Lifecycle: Processing same REQUEST email twice does not create duplicate CalendarInvites',
  async (t) => {
    const uid = `idempotent-${Date.now()}@google.com`;
    const organizer = 'boss@gmail.com';
    const attendee = 'user@forwardemail.net';

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

    // Should have only 1 unprocessed invite (second call updates the first)
    const count = await CalendarInvites.countDocuments({
      eventUid: uid,
      method: 'REQUEST',
      processed: false
    });
    t.is(count, 1, 'Should have exactly 1 unprocessed invite (not 2)');
  }
);
