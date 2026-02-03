/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * iOS/CalDAV Client Compliance Tests
 **
 * These tests verify that the RFC 6638 implementation is compatible with
 * iOS Calendar, macOS Calendar, and other CalDAV clients.
 *
 * Key requirements:
 * - PARTSTAT values must be uppercase
 * - DTSTAMP must be present and valid
 * - UID must be globally unique
 * - ORGANIZER and ATTENDEE must use mailto: URIs
 * - METHOD must be valid iTIP method
 */

const test = require('ava');
const ICAL = require('ical.js');

const {
  parseItip,
  generateRequest,
  generateReply,
  generateCancel,
  generateFreeBusy,
  ITIP_METHODS,
  PARTSTAT_VALUES
} = require('../../helpers/caldav-scheduling');

// ============================================
// iOS Calendar Compliance Tests
// ============================================

test('iOS: PARTSTAT values are uppercase', (t) => {
  const ical = generateReply({
    uid: 'ios-test@forwardemail.net',
    organizer: { email: 'org@test.com' },
    attendee: { email: 'att@test.com', partstat: 'ACCEPTED' }
  });

  // iOS requires uppercase PARTSTAT
  t.true(ical.includes('PARTSTAT=ACCEPTED'));
  t.false(ical.includes('partstat='));
  t.false(ical.includes('PARTSTAT=accepted'));
});

test('iOS: All PARTSTAT values are valid', (t) => {
  for (const partstat of PARTSTAT_VALUES) {
    t.true(partstat === partstat.toUpperCase());
  }
});

test('iOS: DTSTAMP is present in generated events', (t) => {
  const ical = generateRequest({
    uid: 'dtstamp-test@forwardemail.net',
    summary: 'DTSTAMP Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('DTSTAMP:'));
});

test('iOS: DTSTAMP is in valid format', (t) => {
  const ical = generateRequest({
    uid: 'dtstamp-utc-test@forwardemail.net',
    summary: 'DTSTAMP UTC Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  // DTSTAMP should be in ISO format (with or without Z suffix)
  const dtstampMatch = ical.match(/DTSTAMP:(\d{8}T\d{6}Z?)/);
  t.truthy(dtstampMatch);
});

test('iOS: UID is present and non-empty', (t) => {
  const ical = generateRequest({
    uid: 'uid-presence-test@forwardemail.net',
    summary: 'UID Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('UID:uid-presence-test@forwardemail.net'));
});

test('iOS: ORGANIZER uses mailto: URI', (t) => {
  const ical = generateRequest({
    uid: 'mailto-org-test@forwardemail.net',
    summary: 'Mailto Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'organizer@example.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('mailto:organizer@example.com'));
});

test('iOS: ATTENDEE uses mailto: URI', (t) => {
  const ical = generateRequest({
    uid: 'mailto-att-test@forwardemail.net',
    summary: 'Mailto Attendee Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  // Unfold lines (RFC 5545 line folding uses CRLF + space/tab)
  const unfolded = ical.replace(/\r\n[ \t]/g, '');
  // Check that mailto: is used
  t.true(unfolded.includes('mailto:att@test.com'));
});

test('iOS: METHOD is valid iTIP method', (t) => {
  const ical = generateRequest({
    uid: 'method-test@forwardemail.net',
    summary: 'Method Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('METHOD:REQUEST'));
});

test('iOS: All iTIP methods are uppercase', (t) => {
  for (const method of ITIP_METHODS) {
    t.true(method === method.toUpperCase());
  }
});

// ============================================
// macOS Calendar Compliance Tests
// ============================================

test('macOS: VERSION is 2.0', (t) => {
  const ical = generateRequest({
    uid: 'version-test@forwardemail.net',
    summary: 'Version Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('VERSION:2.0'));
});

test('macOS: PRODID is present', (t) => {
  const ical = generateRequest({
    uid: 'prodid-test@forwardemail.net',
    summary: 'PRODID Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('PRODID:'));
});

test('macOS: VCALENDAR contains VEVENT', (t) => {
  const ical = generateRequest({
    uid: 'vevent-test@forwardemail.net',
    summary: 'VEVENT Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('BEGIN:VCALENDAR'));
  t.true(ical.includes('BEGIN:VEVENT'));
  t.true(ical.includes('END:VEVENT'));
  t.true(ical.includes('END:VCALENDAR'));
});

test('macOS: REPLY contains single ATTENDEE', (t) => {
  const ical = generateReply({
    uid: 'single-att-test@forwardemail.net',
    organizer: { email: 'org@test.com' },
    attendee: { email: 'att@test.com', partstat: 'ACCEPTED' }
  });

  const attendeeCount = (ical.match(/ATTENDEE/g) || []).length;
  t.is(attendeeCount, 1);
});

// ============================================
// Thunderbird Compliance Tests
// ============================================

test('Thunderbird: CANCEL includes STATUS:CANCELLED', (t) => {
  const ical = generateCancel({
    uid: 'cancel-status-test@forwardemail.net',
    organizer: { email: 'org@test.com' }
  });

  t.true(ical.includes('STATUS:CANCELLED'));
});

test('Thunderbird: CANCEL includes METHOD:CANCEL', (t) => {
  const ical = generateCancel({
    uid: 'cancel-method-test@forwardemail.net',
    organizer: { email: 'org@test.com' }
  });

  t.true(ical.includes('METHOD:CANCEL'));
});

// ============================================
// Outlook Compliance Tests
// ============================================

test('Outlook: DTSTART is present', (t) => {
  const ical = generateRequest({
    uid: 'dtstart-test@forwardemail.net',
    summary: 'DTSTART Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('DTSTART'));
});

test('Outlook: CN parameter is included when provided', (t) => {
  const ical = generateRequest({
    uid: 'cn-test@forwardemail.net',
    summary: 'CN Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com', cn: 'Organizer Name' },
    attendees: [{ email: 'att@test.com', cn: 'Attendee Name' }]
  });

  t.true(ical.includes('CN=Organizer Name'));
  t.true(ical.includes('CN=Attendee Name'));
});

// ============================================
// RFC 5545 Compliance Tests
// ============================================

test('RFC 5545: Line folding at 75 octets', (t) => {
  // Generate an event with a long description
  const longDescription = 'A'.repeat(200);
  const ical = generateRequest({
    uid: 'line-fold-test@forwardemail.net',
    summary: 'Line Folding Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }],
    description: longDescription
  });

  // Lines should be folded (continuation lines start with space or tab)
  const lines = ical.split('\r\n');
  const longLines = lines.filter(
    (line) =>
      line.length > 75 && !line.startsWith(' ') && !line.startsWith('\t')
  );
  // ICAL.js handles line folding automatically - no long lines should exist
  t.is(longLines.length, 0);
});

test('RFC 5545: CRLF line endings', (t) => {
  const ical = generateRequest({
    uid: 'crlf-test@forwardemail.net',
    summary: 'CRLF Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  // ICAL.js uses \r\n for line endings
  t.true(ical.includes('\r\n'));
});

// ============================================
// RFC 6638 Compliance Tests
// ============================================

test('RFC 6638: REQUEST requires ORGANIZER', (t) => {
  const ical = generateRequest({
    uid: 'org-required-test@forwardemail.net',
    summary: 'Organizer Required Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('ORGANIZER'));
});

test('RFC 6638: REQUEST requires at least one ATTENDEE', (t) => {
  const ical = generateRequest({
    uid: 'att-required-test@forwardemail.net',
    summary: 'Attendee Required Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  t.true(ical.includes('ATTENDEE'));
});

test('RFC 6638: REPLY requires PARTSTAT', (t) => {
  const ical = generateReply({
    uid: 'partstat-required-test@forwardemail.net',
    organizer: { email: 'org@test.com' },
    attendee: { email: 'att@test.com', partstat: 'ACCEPTED' }
  });

  t.true(ical.includes('PARTSTAT='));
});

// ============================================
// ICAL.js Parsing Validation Tests
// ============================================

test('ICAL.js: Generated REQUEST is parseable', (t) => {
  const ical = generateRequest({
    uid: 'parse-request-test@forwardemail.net',
    summary: 'Parse Request Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  const jcal = ICAL.parse(ical);
  const comp = new ICAL.Component(jcal);
  t.is(comp.name, 'vcalendar');
});

test('ICAL.js: Generated REPLY is parseable', (t) => {
  const ical = generateReply({
    uid: 'parse-reply-test@forwardemail.net',
    organizer: { email: 'org@test.com' },
    attendee: { email: 'att@test.com', partstat: 'DECLINED' }
  });

  const jcal = ICAL.parse(ical);
  const comp = new ICAL.Component(jcal);
  t.is(comp.name, 'vcalendar');
});

test('ICAL.js: Generated CANCEL is parseable', (t) => {
  const ical = generateCancel({
    uid: 'parse-cancel-test@forwardemail.net',
    organizer: { email: 'org@test.com' }
  });

  const jcal = ICAL.parse(ical);
  const comp = new ICAL.Component(jcal);
  t.is(comp.name, 'vcalendar');
});

test('ICAL.js: Generated VFREEBUSY is parseable', (t) => {
  const ical = generateFreeBusy({
    attendee: 'att@test.com',
    dtstart: new Date('2025-02-01T00:00:00Z'),
    dtend: new Date('2025-02-28T23:59:59Z')
  });

  const jcal = ICAL.parse(ical);
  const comp = new ICAL.Component(jcal);
  t.is(comp.name, 'vcalendar');
});

// ============================================
// Round-trip Compliance Tests
// ============================================

test('Round-trip: REQUEST -> parse -> validate', (t) => {
  const original = {
    uid: 'roundtrip-request@forwardemail.net',
    summary: 'Round Trip Request',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    dtend: new Date('2025-02-01T11:00:00Z'),
    organizer: { email: 'organizer@example.com', cn: 'Organizer' },
    attendees: [
      { email: 'attendee1@example.com', cn: 'Attendee 1' },
      { email: 'attendee2@example.com', cn: 'Attendee 2' }
    ]
  };

  const ical = generateRequest(original);
  const parsed = parseItip(ical);

  t.is(parsed.method, 'REQUEST');
  t.is(parsed.uid, original.uid);
  t.is(parsed.summary, original.summary);
  t.is(parsed.organizer.email, original.organizer.email);
  t.is(parsed.attendees.length, 2);
});

test('Round-trip: REPLY -> parse -> validate', (t) => {
  const original = {
    uid: 'roundtrip-reply@forwardemail.net',
    organizer: { email: 'organizer@example.com' },
    attendee: { email: 'attendee@example.com', partstat: 'TENTATIVE' }
  };

  const ical = generateReply(original);
  const parsed = parseItip(ical);

  t.is(parsed.method, 'REPLY');
  t.is(parsed.uid, original.uid);
  t.is(parsed.attendees[0].email, original.attendee.email);
  t.is(parsed.attendees[0].partstat, 'TENTATIVE');
});

// ============================================
// Edge Case Tests
// ============================================

test('Edge case: Special characters in summary', (t) => {
  const ical = generateRequest({
    uid: 'special-chars@forwardemail.net',
    summary: 'Meeting: Q1 Review & Planning (Draft)',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [{ email: 'att@test.com' }]
  });

  // Should be parseable
  const jcal = ICAL.parse(ical);
  const comp = new ICAL.Component(jcal);
  const vevent = comp.getFirstSubcomponent('vevent');
  t.truthy(vevent.getFirstPropertyValue('summary'));
});

test('Edge case: Unicode in attendee name', (t) => {
  const ical = generateRequest({
    uid: 'unicode-name@forwardemail.net',
    summary: 'Unicode Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com', cn: 'Organizer' },
    attendees: [{ email: 'att@test.com', cn: 'José García' }]
  });

  // Should be parseable
  const jcal = ICAL.parse(ical);
  t.truthy(jcal);
});

test('Edge case: Multiple attendees with different PARTSTAT', (t) => {
  // Generate a REQUEST with multiple attendees
  const ical = generateRequest({
    uid: 'multi-partstat@forwardemail.net',
    summary: 'Multi PARTSTAT Test',
    dtstart: new Date('2025-02-01T10:00:00Z'),
    organizer: { email: 'org@test.com' },
    attendees: [
      { email: 'att1@test.com', partstat: 'ACCEPTED' },
      { email: 'att2@test.com', partstat: 'DECLINED' },
      { email: 'att3@test.com', partstat: 'TENTATIVE' },
      { email: 'att4@test.com' } // NEEDS-ACTION by default
    ]
  });

  const parsed = parseItip(ical);
  t.is(parsed.attendees.length, 4);
});
