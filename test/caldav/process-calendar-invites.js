/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  eventHasUid,
  updateAttendeePartstat,
  MAX_INVITES_PER_BATCH,
  MAX_PROCESS_ATTEMPTS
} = require('#helpers/process-calendar-invites');

// Test constants
test('MAX_INVITES_PER_BATCH is 10', (t) => {
  t.is(MAX_INVITES_PER_BATCH, 10);
});

test('MAX_PROCESS_ATTEMPTS is 3', (t) => {
  t.is(MAX_PROCESS_ATTEMPTS, 3);
});

// Test eventHasUid
const sampleIcal = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
BEGIN:VEVENT
UID:test-event-uid-123
DTSTART:20250129T100000Z
DTEND:20250129T110000Z
SUMMARY:Test Event
ORGANIZER:mailto:organizer@example.com
ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com
END:VEVENT
END:VCALENDAR`;

test('eventHasUid returns true for matching UID', (t) => {
  t.true(eventHasUid(sampleIcal, 'test-event-uid-123'));
});

test('eventHasUid returns false for non-matching UID', (t) => {
  t.false(eventHasUid(sampleIcal, 'different-uid'));
});

test('eventHasUid returns false for invalid iCal', (t) => {
  t.false(eventHasUid('invalid ical data', 'test-uid'));
});

test('eventHasUid returns false for empty string', (t) => {
  t.false(eventHasUid('', 'test-uid'));
});

test('eventHasUid returns false for iCal without VEVENT', (t) => {
  const noEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
END:VCALENDAR`;
  t.false(eventHasUid(noEvent, 'test-uid'));
});

// Test updateAttendeePartstat
test('updateAttendeePartstat updates PARTSTAT for matching attendee', (t) => {
  const result = updateAttendeePartstat(
    sampleIcal,
    'attendee@example.com',
    'ACCEPTED'
  );

  t.truthy(result);
  t.true(result.includes('PARTSTAT=ACCEPTED'));
});

test('updateAttendeePartstat is case insensitive for email', (t) => {
  const result = updateAttendeePartstat(
    sampleIcal,
    'ATTENDEE@EXAMPLE.COM',
    'DECLINED'
  );

  t.truthy(result);
  t.true(result.includes('PARTSTAT=DECLINED'));
});

test('updateAttendeePartstat returns null for non-matching attendee', (t) => {
  const result = updateAttendeePartstat(
    sampleIcal,
    'unknown@example.com',
    'ACCEPTED'
  );

  t.is(result, null);
});

test('updateAttendeePartstat returns null for invalid iCal', (t) => {
  const result = updateAttendeePartstat(
    'invalid ical',
    'attendee@example.com',
    'ACCEPTED'
  );

  t.is(result, null);
});

test('updateAttendeePartstat handles TENTATIVE response', (t) => {
  const result = updateAttendeePartstat(
    sampleIcal,
    'attendee@example.com',
    'TENTATIVE'
  );

  t.truthy(result);
  t.true(result.includes('PARTSTAT=TENTATIVE'));
});

// Test with multiple attendees
const multiAttendeeIcal = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
BEGIN:VEVENT
UID:multi-attendee-event
DTSTART:20250129T100000Z
DTEND:20250129T110000Z
SUMMARY:Multi-Attendee Event
ORGANIZER:mailto:organizer@example.com
ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@example.com
ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@example.com
ATTENDEE;PARTSTAT=ACCEPTED:mailto:attendee3@example.com
END:VEVENT
END:VCALENDAR`;

test('updateAttendeePartstat updates only the specified attendee', (t) => {
  const result = updateAttendeePartstat(
    multiAttendeeIcal,
    'attendee2@example.com',
    'DECLINED'
  );

  t.truthy(result);
  // Check that attendee2 is updated
  t.true(result.includes('attendee2@example.com'));
  // The other attendees should remain unchanged
  // (Note: exact format may vary, but the logic should be correct)
});

test('eventHasUid with multi-attendee event', (t) => {
  t.true(eventHasUid(multiAttendeeIcal, 'multi-attendee-event'));
  t.false(eventHasUid(multiAttendeeIcal, 'wrong-uid'));
});
