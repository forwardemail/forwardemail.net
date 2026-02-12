/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * E2E tests for processCalendarInvites
 *
 * These tests verify the end-to-end flow of processing pending CalendarInvites
 * from MongoDB through the public processCalendarInvites entry point.
 *
 * Architecture:
 *   CalendarInvites (real MongoDB) → processCalendarInvites → CalendarEvents/Calendars (sinon stubs)
 *
 * The CalendarEvents and Calendars models are SQLite-backed and require a real
 * CalDAV server instance + session. We stub their methods with sinon so that
 * processCalendarInvites exercises all its real internal logic (parsing, method
 * dispatch, iCal manipulation, PARTSTAT updates, SEQUENCE checks, etc.) while
 * the I/O boundary is mocked.
 *
 * No private/internal functions are imported or tested directly.
 */

const test = require('ava');
const sinon = require('sinon');
const ICAL = require('ical.js');
const mongoose = require('mongoose');

const utils = require('../utils');
const CalendarInvites = require('#models/calendar-invites');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const { processCalendarInvites } = require('#helpers/process-calendar-invites');

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

const ORGANIZER_EVENT_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:test-event-uid-123',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'SUMMARY:Test Event',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const REQUEST_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'METHOD:REQUEST',
  'BEGIN:VEVENT',
  'UID:request-event-uid',
  'DTSTAMP:20250201T100000Z',
  'DTSTART:20250201T100000Z',
  'DTEND:20250201T110000Z',
  'SUMMARY:Requested Event',
  'SEQUENCE:2',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const CANCEL_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'METHOD:CANCEL',
  'BEGIN:VEVENT',
  'UID:cancel-event-uid',
  'DTSTAMP:20250201T100000Z',
  'DTSTART:20250201T100000Z',
  'STATUS:CANCELLED',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE:mailto:attendee@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const RECURRING_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:recurring-event-uid',
  'DTSTART:20250101T100000Z',
  'DTEND:20250101T110000Z',
  'RRULE:FREQ=WEEKLY;COUNT=10',
  'SUMMARY:Weekly Meeting',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=ACCEPTED:mailto:attendee@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const ADD_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'METHOD:ADD',
  'BEGIN:VEVENT',
  'UID:recurring-event-uid',
  'RECURRENCE-ID:20250108T100000Z',
  'DTSTART:20250108T140000Z',
  'DTEND:20250108T150000Z',
  'SUMMARY:Rescheduled Instance',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const CANCEL_INSTANCE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'METHOD:CANCEL',
  'BEGIN:VEVENT',
  'UID:recurring-event-uid',
  'RECURRENCE-ID:20250115T100000Z',
  'DTSTAMP:20250201T100000Z',
  'STATUS:CANCELLED',
  'ORGANIZER:mailto:organizer@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// ─── Test Setup ──────────────────────────────────────────────────────────────

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// Stub CalendarEvents and Calendars before each test, restore after
test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();

  // Default calendar
  t.context.defaultCalendar = {
    _id: new mongoose.Types.ObjectId(),
    calendarId: 'default',
    name: 'Default'
  };

  // Track created/updated events
  t.context.createdEvents = [];
  t.context.updatedEvents = [];

  // Stub Calendars.find to return a default calendar
  t.context.sandbox
    .stub(Calendars, 'find')
    .resolves([t.context.defaultCalendar]);

  // Stub CalendarEvents.find to return empty by default (no existing events)
  t.context.calendarEventsFind = t.context.sandbox
    .stub(CalendarEvents, 'find')
    .resolves([]);

  // Stub CalendarEvents.findOneAndUpdate to track updates
  t.context.calendarEventsFindOneAndUpdate = t.context.sandbox
    .stub(CalendarEvents, 'findOneAndUpdate')
    .callsFake(async (_instance, _session, filter, update) => {
      t.context.updatedEvents.push({ filter, update });
      return { ...filter, ...update.$set };
    });

  // Stub CalendarEvents.create to track creations
  t.context.calendarEventsCreate = t.context.sandbox
    .stub(CalendarEvents, 'create')
    .callsFake(async (_instance, _session, doc) => {
      const created = { _id: new mongoose.Types.ObjectId(), ...doc };
      t.context.createdEvents.push(created);
      return created;
    });
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

// ─── Mock instance and ctx ───────────────────────────────────────────────────

function createMockCtx(userEmail = 'organizer@example.com') {
  return {
    state: {
      user: {
        username: userEmail,
        alias_name: userEmail.split('@')[0],
        domain_name: userEmail.split('@')[1]
      },
      session: {
        db: { wsp: true } // Minimal session mock
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

// ─── Helper to seed a CalendarInvites record ─────────────────────────────────

async function seedInvite(overrides = {}) {
  const defaults = {
    eventUid: `test-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`,
    organizerEmail: 'organizer@example.com',
    attendeeEmail: 'attendee@example.com',
    response: 'ACCEPTED',
    method: 'REPLY',
    source: 'imip',
    processed: false,
    processAttempts: 0
  };

  return CalendarInvites.create({ ...defaults, ...overrides });
}

// ─── REPLY Processing ──────────────────────────────────────────────────────

test('REPLY - updates attendee PARTSTAT in organizer event', async (t) => {
  // Seed a REPLY invite
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123',
    attendeeEmail: 'attendee@example.com',
    response: 'ACCEPTED',
    method: 'REPLY'
  });

  // Stub CalendarEvents.find to return an existing event
  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: ORGANIZER_EVENT_ICS,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  t.is(results.failed, 0);

  // Verify CalendarEvents.findOneAndUpdate was called with updated iCal
  t.is(t.context.updatedEvents.length, 1);
  const updatedIcal = t.context.updatedEvents[0].update.$set.ical;
  t.truthy(updatedIcal);
  t.true(updatedIcal.includes('ACCEPTED'));

  // Verify the invite was marked as processed in MongoDB
  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('REPLY - returns null when event not found', async (t) => {
  const invite = await seedInvite({
    eventUid: 'nonexistent-event@example.com',
    method: 'REPLY',
    response: 'ACCEPTED'
  });

  // CalendarEvents.find returns empty (no events)
  t.context.calendarEventsFind.resolves([]);

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  // Should still count as processed (marked with error)
  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);
  t.truthy(processedInvite.processError);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('REPLY - returns null when attendee not found in event', async (t) => {
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123',
    attendeeEmail: 'unknown@example.com',
    method: 'REPLY',
    response: 'ACCEPTED'
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: ORGANIZER_EVENT_ICS,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('REPLY - updates only the specified attendee in multi-attendee event', async (t) => {
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123',
    attendeeEmail: 'attendee2@example.com',
    method: 'REPLY',
    response: 'DECLINED'
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: ORGANIZER_EVENT_ICS,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx();
  await processCalendarInvites(mockInstance, ctx);

  t.is(t.context.updatedEvents.length, 1);
  const updatedIcal = t.context.updatedEvents[0].update.$set.ical;

  // Parse and verify only attendee2 was changed
  const comp = new ICAL.Component(ICAL.parse(updatedIcal));
  const vevent = comp.getFirstSubcomponent('vevent');
  const attendees = vevent.getAllProperties('attendee');

  for (const att of attendees) {
    const email = att
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase();
    const partstat = att.getParameter('partstat');
    if (email === 'attendee2@example.com') {
      t.is(partstat, 'DECLINED');
    } else if (email === 'attendee@example.com') {
      t.is(partstat, 'NEEDS-ACTION');
    }
  }

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── REQUEST Processing ────────────────────────────────────────────────────

test('REQUEST - creates new event when not found', async (t) => {
  const invite = await seedInvite({
    eventUid: 'request-event-uid',
    organizerEmail: 'attendee@example.com',
    method: 'REQUEST',
    response: 'NEEDS-ACTION',
    rawIcs: REQUEST_ICS,
    sequence: 2
  });

  // No existing events
  t.context.calendarEventsFind.resolves([]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  t.is(t.context.createdEvents.length, 1);

  // Verify the created event has METHOD stripped
  const createdIcal = t.context.createdEvents[0].ical;
  t.truthy(createdIcal);
  t.false(createdIcal.includes('METHOD'));
  t.true(createdIcal.includes('request-event-uid'));

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('REQUEST - updates existing event when found', async (t) => {
  const existingEventIcs = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:request-event-uid',
    'DTSTAMP:20250101T100000Z',
    'DTSTART:20250101T100000Z',
    'SUMMARY:Old Event',
    'SEQUENCE:1',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const invite = await seedInvite({
    eventUid: 'request-event-uid',
    organizerEmail: 'attendee@example.com',
    method: 'REQUEST',
    response: 'NEEDS-ACTION',
    rawIcs: REQUEST_ICS,
    sequence: 2
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: existingEventIcs,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  t.is(t.context.updatedEvents.length, 1);

  // Verify updated ICS has METHOD stripped
  const updatedIcal = t.context.updatedEvents[0].update.$set.ical;
  t.false(updatedIcal.includes('METHOD'));

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('REQUEST - skips stale update (lower sequence)', async (t) => {
  const existingEventIcs = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:request-event-uid',
    'DTSTAMP:20250101T100000Z',
    'DTSTART:20250101T100000Z',
    'SUMMARY:Current Event',
    'SEQUENCE:5',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const invite = await seedInvite({
    eventUid: 'request-event-uid',
    organizerEmail: 'attendee@example.com',
    method: 'REQUEST',
    response: 'NEEDS-ACTION',
    rawIcs: REQUEST_ICS,
    sequence: 2 // Lower than existing sequence 5
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: existingEventIcs,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  // No updates should have been made (stale)
  t.is(t.context.updatedEvents.length, 0);
  t.is(t.context.createdEvents.length, 0);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── CANCEL Processing ─────────────────────────────────────────────────────

test('CANCEL - sets STATUS:CANCELLED on existing event', async (t) => {
  const invite = await seedInvite({
    eventUid: 'cancel-event-uid',
    organizerEmail: 'attendee@example.com',
    method: 'CANCEL',
    response: 'CANCELLED',
    rawIcs: CANCEL_ICS
  });

  const existingIcs = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:cancel-event-uid',
    'DTSTAMP:20250101T100000Z',
    'DTSTART:20250101T100000Z',
    'SUMMARY:Active Event',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: existingIcs,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  t.is(t.context.updatedEvents.length, 1);

  const updatedIcal = t.context.updatedEvents[0].update.$set.ical;
  const comp = new ICAL.Component(ICAL.parse(updatedIcal));
  const vevent = comp.getFirstSubcomponent('vevent');
  t.is(vevent.getFirstPropertyValue('status'), 'CANCELLED');

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('CANCEL - handles already-deleted event gracefully', async (t) => {
  const invite = await seedInvite({
    eventUid: 'already-deleted@example.com',
    organizerEmail: 'attendee@example.com',
    method: 'CANCEL',
    response: 'CANCELLED'
  });

  // No events found
  t.context.calendarEventsFind.resolves([]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('CANCEL with RECURRENCE-ID - cancels single instance', async (t) => {
  const invite = await seedInvite({
    eventUid: 'recurring-event-uid',
    organizerEmail: 'attendee@example.com',
    method: 'CANCEL',
    response: 'CANCELLED',
    rawIcs: CANCEL_INSTANCE_ICS
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: RECURRING_ICS,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  t.is(t.context.updatedEvents.length, 1);

  // Should have added an EXDATE for the cancelled instance
  const updatedIcal = t.context.updatedEvents[0].update.$set.ical;
  t.true(updatedIcal.includes('EXDATE'));

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── ADD Processing ────────────────────────────────────────────────────────

test('ADD - merges recurrence override into existing event', async (t) => {
  const invite = await seedInvite({
    eventUid: 'recurring-event-uid',
    organizerEmail: 'attendee@example.com',
    method: 'ADD',
    response: 'NEEDS-ACTION',
    rawIcs: ADD_ICS
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: RECURRING_ICS,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  t.is(t.context.updatedEvents.length, 1);

  // Verify the override was merged
  const updatedIcal = t.context.updatedEvents[0].update.$set.ical;
  const comp = new ICAL.Component(ICAL.parse(updatedIcal));
  const vevents = comp.getAllSubcomponents('vevent');
  t.true(vevents.length >= 2); // Original + override

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('ADD - falls back to REQUEST when event not found', async (t) => {
  const invite = await seedInvite({
    eventUid: 'nonexistent-recurring@example.com',
    organizerEmail: 'attendee@example.com',
    method: 'ADD',
    response: 'NEEDS-ACTION',
    rawIcs: ADD_ICS
  });

  // No existing events
  t.context.calendarEventsFind.resolves([]);

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  // Should have created a new event (fallback to REQUEST behavior)
  t.is(t.context.createdEvents.length, 1);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── REFRESH Processing ────────────────────────────────────────────────────

test('REFRESH - marks as processed when event found', async (t) => {
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123',
    attendeeEmail: 'attendee@example.com',
    method: 'REFRESH',
    response: 'NEEDS-ACTION'
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: ORGANIZER_EVENT_ICS,
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('REFRESH - marks as processed with error when event not found', async (t) => {
  const invite = await seedInvite({
    eventUid: 'nonexistent@example.com',
    method: 'REFRESH',
    response: 'NEEDS-ACTION'
  });

  t.context.calendarEventsFind.resolves([]);

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── COUNTER Processing ────────────────────────────────────────────────────

test('COUNTER - marks as processed (logged for organizer review)', async (t) => {
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123',
    attendeeEmail: 'attendee@example.com',
    method: 'COUNTER',
    response: 'NEEDS-ACTION'
  });

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── DECLINECOUNTER Processing ─────────────────────────────────────────────

test('DECLINECOUNTER - marks as processed', async (t) => {
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123',
    organizerEmail: 'attendee@example.com',
    method: 'DECLINECOUNTER',
    response: 'NEEDS-ACTION'
  });

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── No Pending Invites ────────────────────────────────────────────────────

test('no pending invites - returns zero counts', async (t) => {
  const ctx = createMockCtx('nobody@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 0);
  t.is(results.failed, 0);
  t.is(results.skipped, 0);
});

// ─── No User Emails ────────────────────────────────────────────────────────

test('no user emails in context - returns zero counts', async (t) => {
  const ctx = {
    state: {
      user: {},
      session: { db: { wsp: true } }
    },
    logger: {
      debug() {},
      info() {},
      warn() {},
      error() {}
    }
  };

  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 0);
  t.is(results.failed, 0);
  t.is(results.skipped, 0);
});

// ─── Error Handling ────────────────────────────────────────────────────────

test('processing error - increments processAttempts', async (t) => {
  const invite = await seedInvite({
    eventUid: 'error-event@example.com',
    method: 'REPLY',
    response: 'ACCEPTED'
  });

  // Make CalendarEvents.find throw an error
  t.context.calendarEventsFind.rejects(new Error('SQLite connection failed'));

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.failed, 1);

  const failedInvite = await CalendarInvites.findById(invite._id);
  t.false(failedInvite.processed);
  t.is(failedInvite.processAttempts, 1);
  t.truthy(failedInvite.processError);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('invite exceeding max attempts is not picked up', async (t) => {
  const invite = await seedInvite({
    eventUid: 'max-attempts@example.com',
    method: 'REPLY',
    response: 'ACCEPTED',
    processAttempts: 3 // Already at max
  });

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  // Should not be picked up (processAttempts >= MAX_PROCESS_ATTEMPTS)
  t.is(results.processed, 0);
  t.is(results.failed, 0);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── Batch Processing ──────────────────────────────────────────────────────

test('processes multiple invites in a single batch', async (t) => {
  const invite1 = await seedInvite({
    eventUid: 'batch-1@example.com',
    method: 'COUNTER',
    response: 'NEEDS-ACTION'
  });

  const invite2 = await seedInvite({
    eventUid: 'batch-2@example.com',
    method: 'DECLINECOUNTER',
    response: 'NEEDS-ACTION'
  });

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 2);

  const p1 = await CalendarInvites.findById(invite1._id);
  const p2 = await CalendarInvites.findById(invite2._id);
  t.true(p1.processed);
  t.true(p2.processed);

  await CalendarInvites.deleteMany({
    _id: { $in: [invite1._id, invite2._id] }
  });
});

// ─── UID Matching with .ics Suffix ─────────────────────────────────────────

test('REPLY - matches event UID with .ics suffix variant', async (t) => {
  // Invite has UID without .ics, but event in calendar has UID without .ics too
  // This tests the getUidVariants logic inside findEventByUid
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123.ics',
    attendeeEmail: 'attendee@example.com',
    method: 'REPLY',
    response: 'ACCEPTED'
  });

  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: ORGANIZER_EVENT_ICS, // UID is test-event-uid-123 (no .ics)
      deleted_at: null
    }
  ]);

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  t.is(t.context.updatedEvents.length, 1);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── REQUEST without rawIcs ────────────────────────────────────────────────

test('REQUEST without rawIcs - marks as processed with error', async (t) => {
  const invite = await seedInvite({
    eventUid: 'no-raw-ics@example.com',
    organizerEmail: 'attendee@example.com',
    method: 'REQUEST',
    response: 'NEEDS-ACTION'
    // No rawIcs
  });

  const ctx = createMockCtx('attendee@example.com');
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);

  const processedInvite = await CalendarInvites.findById(invite._id);
  t.true(processedInvite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── Already Processed Invites ─────────────────────────────────────────────

test('already processed invites are not picked up', async (t) => {
  const invite = await seedInvite({
    eventUid: 'already-processed@example.com',
    method: 'REPLY',
    response: 'ACCEPTED',
    processed: true
  });

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 0);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

// ─── Deleted Events Filtered Out ───────────────────────────────────────────

test('REPLY - skips deleted events (deleted_at set)', async (t) => {
  const invite = await seedInvite({
    eventUid: 'test-event-uid-123',
    attendeeEmail: 'attendee@example.com',
    method: 'REPLY',
    response: 'ACCEPTED'
  });

  // Return event with deleted_at set
  t.context.calendarEventsFind.resolves([
    {
      _id: new mongoose.Types.ObjectId(),
      calendar: t.context.defaultCalendar._id,
      ical: ORGANIZER_EVENT_ICS,
      deleted_at: new Date() // Deleted!
    }
  ]);

  const ctx = createMockCtx();
  const results = await processCalendarInvites(mockInstance, ctx);

  t.is(results.processed, 1);
  // Event was not found (deleted), so no update
  t.is(t.context.updatedEvents.length, 0);

  await CalendarInvites.deleteOne({ _id: invite._id });
});
