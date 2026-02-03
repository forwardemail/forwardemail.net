/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * RFC 6638 Scheduling Extensions E2E Tests
 **
 * These tests verify the complete RFC 6638 implementation including:
 * - caldav-scheduling.js helper functions
 * - CalendarEvents model scheduling fields
 * - iTIP message parsing and generation
 * - Schedule tag generation
 */

const test = require('ava');
const ICAL = require('ical.js');

const {
  ITIP_METHODS,
  PARTSTAT_VALUES,
  parseItip,
  validateItip,
  generateRequest,
  generateReply,
  generateCancel,
  generateFreeBusy,
  generateScheduleTag,
  extractSchedulingMetadata,
  updateAttendeePartstat,
  eventHasUid
} = require('../../helpers/caldav-scheduling');

// Sample iCalendar data for testing
const SAMPLE_REQUEST = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:test-event-123@forwardemail.net
DTSTAMP:20250129T120000Z
DTSTART:20250201T100000Z
DTEND:20250201T110000Z
SUMMARY:Team Meeting
ORGANIZER;CN=John Doe:mailto:john@example.com
ATTENDEE;CN=Jane Smith;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:jane@example.com
ATTENDEE;CN=Bob Wilson;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:bob@example.com
END:VEVENT
END:VCALENDAR`;

const SAMPLE_REPLY = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:REPLY
BEGIN:VEVENT
UID:test-event-123@forwardemail.net
DTSTAMP:20250129T130000Z
DTSTART:20250201T100000Z
ORGANIZER;CN=John Doe:mailto:john@example.com
ATTENDEE;CN=Jane Smith;PARTSTAT=ACCEPTED:mailto:jane@example.com
END:VEVENT
END:VCALENDAR`;

const SAMPLE_CANCEL = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:CANCEL
BEGIN:VEVENT
UID:test-event-123@forwardemail.net
DTSTAMP:20250129T140000Z
DTSTART:20250201T100000Z
SUMMARY:Team Meeting
STATUS:CANCELLED
ORGANIZER;CN=John Doe:mailto:john@example.com
ATTENDEE;CN=Jane Smith:mailto:jane@example.com
END:VEVENT
END:VCALENDAR`;

// ============================================
// ITIP_METHODS and PARTSTAT_VALUES Constants
// ============================================

test('ITIP_METHODS contains all RFC 5546 methods', (t) => {
  t.deepEqual(ITIP_METHODS, [
    'PUBLISH',
    'REQUEST',
    'REPLY',
    'ADD',
    'CANCEL',
    'REFRESH',
    'COUNTER',
    'DECLINECOUNTER'
  ]);
});

test('PARTSTAT_VALUES contains all valid participation statuses', (t) => {
  t.deepEqual(PARTSTAT_VALUES, [
    'NEEDS-ACTION',
    'ACCEPTED',
    'DECLINED',
    'TENTATIVE',
    'DELEGATED'
  ]);
});

// ============================================
// parseItip Tests
// ============================================

test('parseItip extracts method from REQUEST', (t) => {
  const result = parseItip(SAMPLE_REQUEST);
  t.is(result.method, 'REQUEST');
});

test('parseItip extracts UID', (t) => {
  const result = parseItip(SAMPLE_REQUEST);
  t.is(result.uid, 'test-event-123@forwardemail.net');
});

test('parseItip extracts summary', (t) => {
  const result = parseItip(SAMPLE_REQUEST);
  t.is(result.summary, 'Team Meeting');
});

test('parseItip extracts organizer', (t) => {
  const result = parseItip(SAMPLE_REQUEST);
  t.is(result.organizer.email, 'john@example.com');
  t.is(result.organizer.cn, 'John Doe');
});

test('parseItip extracts attendees', (t) => {
  const result = parseItip(SAMPLE_REQUEST);
  t.is(result.attendees.length, 2);
  t.is(result.attendees[0].email, 'jane@example.com');
  t.is(result.attendees[0].cn, 'Jane Smith');
  t.is(result.attendees[0].partstat, 'NEEDS-ACTION');
  t.is(result.attendees[1].email, 'bob@example.com');
});

test('parseItip extracts REPLY method', (t) => {
  const result = parseItip(SAMPLE_REPLY);
  t.is(result.method, 'REPLY');
  t.is(result.attendees[0].partstat, 'ACCEPTED');
});

test('parseItip extracts CANCEL method', (t) => {
  const result = parseItip(SAMPLE_CANCEL);
  t.is(result.method, 'CANCEL');
});

test('parseItip throws for invalid iCalendar', (t) => {
  t.throws(() => parseItip('invalid data'), { instanceOf: TypeError });
});

test('parseItip throws for null input', (t) => {
  t.throws(() => parseItip(null), { instanceOf: TypeError });
});

test('parseItip throws for empty string', (t) => {
  t.throws(() => parseItip(''), { instanceOf: TypeError });
});

test('parseItip throws for iCalendar without VEVENT', (t) => {
  const noEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
END:VCALENDAR`;
  t.throws(() => parseItip(noEvent), { instanceOf: TypeError });
});

test('parseItip throws for invalid iTIP method', (t) => {
  const invalidMethod = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
METHOD:INVALID
BEGIN:VEVENT
UID:test@test.com
DTSTAMP:20250129T120000Z
END:VEVENT
END:VCALENDAR`;
  t.throws(() => parseItip(invalidMethod), { instanceOf: TypeError });
});

// ============================================
// validateItip Tests
// ============================================

test('validateItip returns valid for proper REQUEST', (t) => {
  const itipData = parseItip(SAMPLE_REQUEST);
  const result = validateItip(itipData);
  t.true(result.valid);
  t.is(result.errors.length, 0);
});

test('validateItip returns valid for proper REPLY', (t) => {
  const itipData = parseItip(SAMPLE_REPLY);
  const result = validateItip(itipData);
  t.true(result.valid);
});

test('validateItip returns error for REQUEST without organizer', (t) => {
  const itipData = {
    method: 'REQUEST',
    uid: 'test@test.com',
    organizer: null,
    attendees: [{ email: 'test@test.com', partstat: 'NEEDS-ACTION' }]
  };
  const result = validateItip(itipData);
  t.false(result.valid);
  t.true(result.errors.includes('ORGANIZER is required for REQUEST'));
});

test('validateItip returns error for REQUEST without attendees', (t) => {
  const itipData = {
    method: 'REQUEST',
    uid: 'test@test.com',
    organizer: { email: 'org@test.com' },
    attendees: []
  };
  const result = validateItip(itipData);
  t.false(result.valid);
  t.true(
    result.errors.includes('At least one ATTENDEE is required for REQUEST')
  );
});

test('validateItip returns error for REPLY with multiple attendees', (t) => {
  const itipData = {
    method: 'REPLY',
    uid: 'test@test.com',
    organizer: { email: 'org@test.com' },
    attendees: [
      { email: 'a@test.com', partstat: 'ACCEPTED' },
      { email: 'b@test.com', partstat: 'ACCEPTED' }
    ]
  };
  const result = validateItip(itipData);
  t.false(result.valid);
  t.true(result.errors.includes('Exactly one ATTENDEE is required for REPLY'));
});

test('validateItip returns error for missing UID', (t) => {
  const itipData = {
    method: 'REQUEST',
    uid: null,
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'a@test.com', partstat: 'NEEDS-ACTION' }]
  };
  const result = validateItip(itipData);
  t.false(result.valid);
  t.true(result.errors.includes('UID is required'));
});

test('validateItip returns error for invalid PARTSTAT', (t) => {
  const itipData = {
    method: 'REQUEST',
    uid: 'test@test.com',
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'a@test.com', partstat: 'INVALID' }]
  };
  const result = validateItip(itipData);
  t.false(result.valid);
  t.true(result.errors.some((e) => e.includes('Invalid PARTSTAT')));
});

// ============================================
// generateRequest Tests
// ============================================

test('generateRequest creates valid iCalendar', (t) => {
  const ical = generateRequest({
    uid: 'gen-test-123@forwardemail.net',
    summary: 'Generated Meeting',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    dtend: new Date('2025-02-01T11:00:00Z'),
    organizer: { email: 'organizer@example.com', cn: 'Organizer' },
    attendees: [{ email: 'attendee@example.com', cn: 'Attendee' }]
  });

  t.true(ical.includes('METHOD:REQUEST'));
  t.true(ical.includes('UID:gen-test-123@forwardemail.net'));
  t.true(ical.includes('SUMMARY:Generated Meeting'));
  t.true(ical.includes('ORGANIZER'));
  t.true(ical.includes('ATTENDEE'));
});

test('generateRequest includes description and location', (t) => {
  const ical = generateRequest({
    uid: 'gen-test-456@forwardemail.net',
    summary: 'Meeting with Details',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'organizer@example.com' },
    attendees: [{ email: 'attendee@example.com' }],
    description: 'This is a test meeting',
    location: 'Conference Room A'
  });

  t.true(ical.includes('DESCRIPTION:This is a test meeting'));
  t.true(ical.includes('LOCATION:Conference Room A'));
});

test('generateRequest throws for missing required fields', (t) => {
  t.throws(() => generateRequest({}), { instanceOf: TypeError });
  t.throws(() => generateRequest({ uid: 'test' }), { instanceOf: TypeError });
});

// ============================================
// generateReply Tests
// ============================================

test('generateReply creates valid REPLY', (t) => {
  const ical = generateReply({
    uid: 'test-event-123@forwardemail.net',
    organizer: { email: 'organizer@example.com', cn: 'Organizer' },
    attendee: {
      email: 'attendee@example.com',
      cn: 'Attendee',
      partstat: 'ACCEPTED'
    }
  });

  t.true(ical.includes('METHOD:REPLY'));
  t.true(ical.includes('UID:test-event-123@forwardemail.net'));
  t.true(ical.includes('PARTSTAT=ACCEPTED'));
});

test('generateReply supports DECLINED', (t) => {
  const ical = generateReply({
    uid: 'test@test.com',
    organizer: { email: 'org@test.com' },
    attendee: { email: 'att@test.com', partstat: 'DECLINED' }
  });

  t.true(ical.includes('PARTSTAT=DECLINED'));
});

test('generateReply supports TENTATIVE', (t) => {
  const ical = generateReply({
    uid: 'test@test.com',
    organizer: { email: 'org@test.com' },
    attendee: { email: 'att@test.com', partstat: 'TENTATIVE' }
  });

  t.true(ical.includes('PARTSTAT=TENTATIVE'));
});

test('generateReply throws for missing partstat', (t) => {
  t.throws(
    () =>
      generateReply({
        uid: 'test@test.com',
        organizer: { email: 'org@test.com' },
        attendee: { email: 'att@test.com' }
      }),
    { instanceOf: TypeError }
  );
});

// ============================================
// generateCancel Tests
// ============================================

test('generateCancel creates valid CANCEL', (t) => {
  const ical = generateCancel({
    uid: 'test-event-123@forwardemail.net',
    organizer: { email: 'organizer@example.com', cn: 'Organizer' },
    attendees: [{ email: 'attendee@example.com' }],
    summary: 'Cancelled Meeting'
  });

  t.true(ical.includes('METHOD:CANCEL'));
  t.true(ical.includes('STATUS:CANCELLED'));
  t.true(ical.includes('UID:test-event-123@forwardemail.net'));
});

test('generateCancel works without attendees', (t) => {
  const ical = generateCancel({
    uid: 'test@test.com',
    organizer: { email: 'org@test.com' }
  });

  t.true(ical.includes('METHOD:CANCEL'));
});

// ============================================
// generateFreeBusy Tests
// ============================================

test('generateFreeBusy creates valid VFREEBUSY', (t) => {
  const ical = generateFreeBusy({
    attendee: 'attendee@example.com',
    dtstart: new Date('2025-02-01T00:00:00Z'),
    dtend: new Date('2025-02-28T23:59:59Z')
  });

  t.true(ical.includes('VFREEBUSY'));
  t.true(ical.includes('METHOD:REPLY'));
  t.true(ical.includes('mailto:attendee@example.com'));
});

test('generateFreeBusy includes busy periods', (t) => {
  const ical = generateFreeBusy({
    attendee: 'attendee@example.com',
    dtstart: new Date('2025-02-01T00:00:00Z'),
    dtend: new Date('2025-02-28T23:59:59Z'),
    busyPeriods: [
      {
        start: new Date('2025-02-05T10:00:00Z'),
        end: new Date('2025-02-05T11:00:00Z')
      }
    ]
  });

  t.true(ical.includes('FREEBUSY'));
});

test('generateFreeBusy throws for missing required fields', (t) => {
  t.throws(() => generateFreeBusy({}), { instanceOf: TypeError });
});

// ============================================
// generateScheduleTag Tests
// ============================================

test('generateScheduleTag returns consistent hash', (t) => {
  const tag1 = generateScheduleTag('test-uid', 0, new Date('2025-01-01'));
  const tag2 = generateScheduleTag('test-uid', 0, new Date('2025-01-01'));
  t.is(tag1, tag2);
});

test('generateScheduleTag returns different hash for different UIDs', (t) => {
  const tag1 = generateScheduleTag('uid-1', 0);
  const tag2 = generateScheduleTag('uid-2', 0);
  t.not(tag1, tag2);
});

test('generateScheduleTag returns different hash for different sequences', (t) => {
  const tag1 = generateScheduleTag('test-uid', 0);
  const tag2 = generateScheduleTag('test-uid', 1);
  t.not(tag1, tag2);
});

test('generateScheduleTag returns 16 character hex string', (t) => {
  const tag = generateScheduleTag('test-uid', 0);
  t.is(tag.length, 16);
  t.regex(tag, /^[a-f\d]+$/);
});

// ============================================
// extractSchedulingMetadata Tests
// ============================================

test('extractSchedulingMetadata extracts all fields from REQUEST', (t) => {
  const metadata = extractSchedulingMetadata(SAMPLE_REQUEST);
  t.truthy(metadata.scheduleTag);
  t.is(metadata.itipMethod, 'REQUEST');
  t.is(metadata.organizerEmail, 'john@example.com');
  t.is(metadata.attendees.length, 2);
  t.is(metadata.sequence, 0);
});

test('extractSchedulingMetadata handles invalid iCal gracefully', (t) => {
  const metadata = extractSchedulingMetadata('invalid');
  t.is(metadata.scheduleTag, null);
  t.is(metadata.itipMethod, null);
  t.is(metadata.organizerEmail, null);
  t.deepEqual(metadata.attendees, []);
});

test('extractSchedulingMetadata handles empty string', (t) => {
  const metadata = extractSchedulingMetadata('');
  t.is(metadata.scheduleTag, null);
});

// ============================================
// updateAttendeePartstat Tests
// ============================================

test('updateAttendeePartstat updates PARTSTAT correctly', (t) => {
  const updated = updateAttendeePartstat(
    SAMPLE_REQUEST,
    'jane@example.com',
    'ACCEPTED'
  );
  t.truthy(updated);
  t.true(updated.includes('PARTSTAT=ACCEPTED'));
});

test('updateAttendeePartstat is case insensitive for email', (t) => {
  const updated = updateAttendeePartstat(
    SAMPLE_REQUEST,
    'JANE@EXAMPLE.COM',
    'DECLINED'
  );
  t.truthy(updated);
  t.true(updated.includes('PARTSTAT=DECLINED'));
});

test('updateAttendeePartstat returns null for non-existent attendee', (t) => {
  const updated = updateAttendeePartstat(
    SAMPLE_REQUEST,
    'nonexistent@example.com',
    'ACCEPTED'
  );
  t.is(updated, null);
});

test('updateAttendeePartstat returns null for invalid iCal', (t) => {
  const updated = updateAttendeePartstat(
    'invalid',
    'test@test.com',
    'ACCEPTED'
  );
  t.is(updated, null);
});

test('updateAttendeePartstat throws for invalid PARTSTAT', (t) => {
  t.throws(
    () => updateAttendeePartstat(SAMPLE_REQUEST, 'jane@example.com', 'INVALID'),
    {
      instanceOf: TypeError
    }
  );
});

// ============================================
// eventHasUid Tests
// ============================================

test('eventHasUid returns true for matching UID', (t) => {
  t.true(eventHasUid(SAMPLE_REQUEST, 'test-event-123@forwardemail.net'));
});

test('eventHasUid returns false for non-matching UID', (t) => {
  t.false(eventHasUid(SAMPLE_REQUEST, 'wrong-uid@forwardemail.net'));
});

test('eventHasUid returns false for invalid iCal', (t) => {
  t.false(eventHasUid('invalid', 'test@test.com'));
});

test('eventHasUid returns false for null input', (t) => {
  t.false(eventHasUid(null, 'test@test.com'));
});

// ============================================
// Round-trip Tests
// ============================================

test('generated REQUEST can be parsed back', (t) => {
  const ical = generateRequest({
    uid: 'roundtrip-test@forwardemail.net',
    summary: 'Round Trip Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    dtend: new Date('2025-02-01T11:00:00Z'),
    organizer: { email: 'organizer@example.com', cn: 'Organizer' },
    attendees: [
      { email: 'attendee1@example.com', cn: 'Attendee 1' },
      { email: 'attendee2@example.com', cn: 'Attendee 2' }
    ]
  });

  const parsed = parseItip(ical);
  t.is(parsed.method, 'REQUEST');
  t.is(parsed.uid, 'roundtrip-test@forwardemail.net');
  t.is(parsed.summary, 'Round Trip Test');
  t.is(parsed.organizer.email, 'organizer@example.com');
  t.is(parsed.attendees.length, 2);
});

test('generated REPLY can be parsed back', (t) => {
  const ical = generateReply({
    uid: 'reply-test@forwardemail.net',
    organizer: { email: 'organizer@example.com' },
    attendee: { email: 'attendee@example.com', partstat: 'ACCEPTED' }
  });

  const parsed = parseItip(ical);
  t.is(parsed.method, 'REPLY');
  t.is(parsed.attendees[0].partstat, 'ACCEPTED');
});

// ============================================
// iOS/macOS Compatibility Tests
// ============================================

test('generated iCalendar is valid per ICAL.js', (t) => {
  const ical = generateRequest({
    uid: 'ical-valid-test@forwardemail.net',
    summary: 'Validity Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@example.com' },
    attendees: [{ email: 'att@example.com' }]
  });

  // Should not throw
  const jcal = ICAL.parse(ical);
  const comp = new ICAL.Component(jcal);
  t.truthy(comp);
  t.is(comp.name, 'vcalendar');
});

test('PARTSTAT values are uppercase (iOS requirement)', (t) => {
  const ical = generateReply({
    uid: 'test@test.com',
    organizer: { email: 'org@test.com' },
    attendee: { email: 'att@test.com', partstat: 'ACCEPTED' }
  });

  // iOS requires uppercase PARTSTAT values
  t.true(ical.includes('PARTSTAT=ACCEPTED'));
  t.false(ical.includes('PARTSTAT=accepted'));
});
