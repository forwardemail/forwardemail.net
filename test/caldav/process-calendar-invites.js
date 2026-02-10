/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const ICAL = require('ical.js');

const {
  eventHasUid,
  updateAttendeePartstat,
  getUidVariants,
  setCancelledStatus,
  setCancelledStatusForInstance,
  mergeAddComponents,
  stripMethodFromIcs,
  getSequenceFromIcal,
  getRecurrenceIdFromIcs,
  MAX_INVITES_PER_BATCH,
  MAX_PROCESS_ATTEMPTS
} = require('#helpers/process-calendar-invites');

// ─── Constants ───────────────────────────────────────────────────────────────

test('MAX_INVITES_PER_BATCH is 10', (t) => {
  t.is(MAX_INVITES_PER_BATCH, 10);
});

test('MAX_PROCESS_ATTEMPTS is 3', (t) => {
  t.is(MAX_PROCESS_ATTEMPTS, 3);
});

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

const sampleIcal = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:test-event-uid-123',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'SUMMARY:Test Event',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const multiAttendeeIcal = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:multi-attendee-event',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'SUMMARY:Multi-Attendee Event',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@example.com',
  'ATTENDEE;PARTSTAT=ACCEPTED:mailto:attendee3@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const icalWithMethod = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'METHOD:REQUEST',
  'BEGIN:VEVENT',
  'UID:method-test-uid',
  'DTSTART:20250201T100000Z',
  'DTEND:20250201T110000Z',
  'SUMMARY:Event With Method',
  'SEQUENCE:3',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const recurringIcal = [
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

const vtodoIcal = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VTODO',
  'UID:todo-uid-456',
  'SUMMARY:Test Task',
  'STATUS:NEEDS-ACTION',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

// ─── eventHasUid Tests ───────────────────────────────────────────────────────

test('eventHasUid returns true for matching UID', (t) => {
  t.true(eventHasUid(sampleIcal, ['test-event-uid-123']));
});

test('eventHasUid returns false for non-matching UID', (t) => {
  t.false(eventHasUid(sampleIcal, ['different-uid']));
});

test('eventHasUid returns false for invalid iCal', (t) => {
  t.false(eventHasUid('invalid ical data', ['test-uid']));
});

test('eventHasUid returns false for empty string', (t) => {
  t.false(eventHasUid('', ['test-uid']));
});

test('eventHasUid returns false for iCal without VEVENT', (t) => {
  const noEvent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'END:VCALENDAR'
  ].join('\r\n');
  t.false(eventHasUid(noEvent, ['test-uid']));
});

test('eventHasUid handles case-insensitive matching', (t) => {
  t.true(eventHasUid(sampleIcal, ['TEST-EVENT-UID-123']));
});

test('eventHasUid does not match raw .ics suffix without expansion', (t) => {
  // Without getUidVariants, .ics suffix won't match
  t.false(eventHasUid(sampleIcal, ['test-event-uid-123.ics']));
});

test('eventHasUid matches with .ics suffix via getUidVariants', (t) => {
  // eventHasUid expects pre-expanded variants from getUidVariants()
  const variants = getUidVariants('test-event-uid-123.ics');
  t.true(eventHasUid(sampleIcal, variants));
});

test('eventHasUid matches VTODO components', (t) => {
  t.true(eventHasUid(vtodoIcal, ['todo-uid-456']));
});

test('eventHasUid with multi-attendee event', (t) => {
  t.true(eventHasUid(multiAttendeeIcal, ['multi-attendee-event']));
  t.false(eventHasUid(multiAttendeeIcal, ['wrong-uid']));
});

// ─── getUidVariants Tests ────────────────────────────────────────────────────

test('getUidVariants returns variants for plain UID', (t) => {
  const variants = getUidVariants('test-uid');
  t.true(variants.includes('test-uid'));
  t.true(variants.includes('test-uid.ics'));
});

test('getUidVariants returns variants for UID with .ics suffix', (t) => {
  const variants = getUidVariants('test-uid.ics');
  t.true(variants.includes('test-uid.ics'));
  t.true(variants.includes('test-uid'));
});

test('getUidVariants handles non-string input', (t) => {
  const variants = getUidVariants(null);
  t.deepEqual(variants, [null]);
});

// ─── updateAttendeePartstat Tests ────────────────────────────────────────────

test('updateAttendeePartstat updates PARTSTAT for matching attendee', (t) => {
  const result = updateAttendeePartstat(
    sampleIcal,
    'attendee@example.com',
    'ACCEPTED'
  );

  t.truthy(result);
  t.true(result.includes('ACCEPTED'));
});

test('updateAttendeePartstat is case insensitive for email', (t) => {
  const result = updateAttendeePartstat(
    sampleIcal,
    'ATTENDEE@EXAMPLE.COM',
    'DECLINED'
  );

  t.truthy(result);
  t.true(result.includes('DECLINED'));
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
  t.true(result.includes('TENTATIVE'));
});

test('updateAttendeePartstat updates only the specified attendee', (t) => {
  const result = updateAttendeePartstat(
    multiAttendeeIcal,
    'attendee2@example.com',
    'DECLINED'
  );

  t.truthy(result);
  // Parse the result and verify only attendee2 was changed
  const comp = new ICAL.Component(ICAL.parse(result));
  const vevent = comp.getFirstSubcomponent('vevent');
  const attendees = vevent.getAllProperties('attendee');

  for (const att of attendees) {
    const email = att
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase();
    const partstat = att.getParameter('partstat');
    switch (email) {
      case 'attendee2@example.com': {
        t.is(partstat, 'DECLINED');

        break;
      }

      case 'attendee1@example.com': {
        t.is(partstat, 'NEEDS-ACTION');

        break;
      }

      case 'attendee3@example.com': {
        t.is(partstat, 'ACCEPTED');

        break;
      }
      // No default
    }
  }
});

test('updateAttendeePartstat updates DTSTAMP when present', (t) => {
  // Use ICS with DTSTAMP
  const icsWithDtstamp = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    'UID:dtstamp-test-uid',
    'DTSTAMP:20250101T000000Z',
    'DTSTART:20250129T100000Z',
    'DTEND:20250129T110000Z',
    'SUMMARY:Test Event',
    'ORGANIZER:mailto:organizer@example.com',
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = updateAttendeePartstat(
    icsWithDtstamp,
    'attendee@example.com',
    'ACCEPTED'
  );

  t.truthy(result);
  const comp = new ICAL.Component(ICAL.parse(result));
  const vevent = comp.getFirstSubcomponent('vevent');
  const dtstamp = vevent.getFirstPropertyValue('dtstamp');
  t.truthy(dtstamp);
  // DTSTAMP should be updated to a recent time (not the original 2025-01-01)
  t.not(dtstamp.toString(), '2025-01-01T00:00:00Z');
});

test('updateAttendeePartstat does not add DTSTAMP when absent', (t) => {
  // sampleIcal has no DTSTAMP
  const result = updateAttendeePartstat(
    sampleIcal,
    'attendee@example.com',
    'ACCEPTED'
  );

  t.truthy(result);
  const comp = new ICAL.Component(ICAL.parse(result));
  const vevent = comp.getFirstSubcomponent('vevent');
  const dtstamp = vevent.getFirstPropertyValue('dtstamp');
  // DTSTAMP was not present in original, so it should still be null
  t.is(dtstamp, null);
});

// ─── setCancelledStatus Tests ────────────────────────────────────────────────

test('setCancelledStatus sets STATUS:CANCELLED on VEVENT', (t) => {
  const result = setCancelledStatus(sampleIcal);
  t.truthy(result);

  const comp = new ICAL.Component(ICAL.parse(result));
  const vevent = comp.getFirstSubcomponent('vevent');
  t.is(vevent.getFirstPropertyValue('status'), 'CANCELLED');
});

test('setCancelledStatus updates DTSTAMP', (t) => {
  const result = setCancelledStatus(sampleIcal);
  t.truthy(result);

  const comp = new ICAL.Component(ICAL.parse(result));
  const vevent = comp.getFirstSubcomponent('vevent');
  const dtstamp = vevent.getFirstPropertyValue('dtstamp');
  t.truthy(dtstamp);
});

test('setCancelledStatus works on VTODO', (t) => {
  const result = setCancelledStatus(vtodoIcal);
  t.truthy(result);

  const comp = new ICAL.Component(ICAL.parse(result));
  const vtodo = comp.getFirstSubcomponent('vtodo');
  t.is(vtodo.getFirstPropertyValue('status'), 'CANCELLED');
});

test('setCancelledStatus returns null for invalid iCal', (t) => {
  t.is(setCancelledStatus('invalid'), null);
});

test('setCancelledStatus returns null for empty iCal', (t) => {
  const noEvent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'END:VCALENDAR'].join(
    '\r\n'
  );
  t.is(setCancelledStatus(noEvent), null);
});

// ─── setCancelledStatusForInstance Tests ──────────────────────────────────────

test('setCancelledStatusForInstance adds EXDATE for missing recurrence instance', (t) => {
  const result = setCancelledStatusForInstance(
    recurringIcal,
    '20250108T100000Z'
  );
  t.truthy(result);
  // Should contain an EXDATE
  t.true(result.includes('EXDATE'));
});

test('setCancelledStatusForInstance returns null for invalid iCal', (t) => {
  t.is(setCancelledStatusForInstance('invalid', '20250108T100000Z'), null);
});

// ─── mergeAddComponents Tests ────────────────────────────────────────────────

test('mergeAddComponents merges new recurrence override', (t) => {
  const addIcal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
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

  const result = mergeAddComponents(recurringIcal, addIcal);
  t.truthy(result);

  // Parse and verify the override was added
  const comp = new ICAL.Component(ICAL.parse(result));
  const vevents = comp.getAllSubcomponents('vevent');
  // Should have the original + the override
  t.true(vevents.length >= 2);
});

test('mergeAddComponents replaces existing override', (t) => {
  // First add an override
  const withOverride = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:recurring-event-uid',
    'DTSTART:20250101T100000Z',
    'DTEND:20250101T110000Z',
    'RRULE:FREQ=WEEKLY;COUNT=10',
    'SUMMARY:Weekly Meeting',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:recurring-event-uid',
    'RECURRENCE-ID:20250108T100000Z',
    'DTSTART:20250108T140000Z',
    'DTEND:20250108T150000Z',
    'SUMMARY:Old Override',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const addIcal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'METHOD:ADD',
    'BEGIN:VEVENT',
    'UID:recurring-event-uid',
    'RECURRENCE-ID:20250108T100000Z',
    'DTSTART:20250108T160000Z',
    'DTEND:20250108T170000Z',
    'SUMMARY:New Override',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = mergeAddComponents(withOverride, addIcal);
  t.truthy(result);
  t.true(result.includes('New Override'));
});

test('mergeAddComponents returns null for invalid iCal', (t) => {
  t.is(mergeAddComponents('invalid', 'also invalid'), null);
});

test('mergeAddComponents skips components without RECURRENCE-ID', (t) => {
  const addIcal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'METHOD:ADD',
    'BEGIN:VEVENT',
    'UID:recurring-event-uid',
    'DTSTART:20250108T140000Z',
    'DTEND:20250108T150000Z',
    'SUMMARY:No Recurrence ID',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = mergeAddComponents(recurringIcal, addIcal);
  t.truthy(result);

  // Should still only have the original VEVENT
  const comp = new ICAL.Component(ICAL.parse(result));
  const vevents = comp.getAllSubcomponents('vevent');
  t.is(vevents.length, 1);
});

// ─── stripMethodFromIcs Tests ────────────────────────────────────────────────

test('stripMethodFromIcs removes METHOD property', (t) => {
  const result = stripMethodFromIcs(icalWithMethod);
  t.truthy(result);
  t.false(result.includes('METHOD'));
});

test('stripMethodFromIcs preserves other properties', (t) => {
  const result = stripMethodFromIcs(icalWithMethod);
  t.truthy(result);
  t.true(result.includes('method-test-uid'));
  t.true(result.includes('Event With Method'));
});

test('stripMethodFromIcs handles ICS without METHOD', (t) => {
  const result = stripMethodFromIcs(sampleIcal);
  t.truthy(result);
  // Should return the same content (no METHOD to strip)
  const comp = new ICAL.Component(ICAL.parse(result));
  t.falsy(comp.getFirstPropertyValue('method'));
});

test('stripMethodFromIcs returns original for invalid iCal', (t) => {
  const result = stripMethodFromIcs('invalid ical');
  t.is(result, 'invalid ical');
});

// ─── getSequenceFromIcal Tests ───────────────────────────────────────────────

test('getSequenceFromIcal returns sequence number', (t) => {
  t.is(getSequenceFromIcal(icalWithMethod), 3);
});

test('getSequenceFromIcal returns 0 for missing sequence', (t) => {
  t.is(getSequenceFromIcal(sampleIcal), 0);
});

test('getSequenceFromIcal returns 0 for invalid iCal', (t) => {
  t.is(getSequenceFromIcal('invalid'), 0);
});

test('getSequenceFromIcal works with VTODO', (t) => {
  t.is(getSequenceFromIcal(vtodoIcal), 0);
});

// ─── getRecurrenceIdFromIcs Tests ────────────────────────────────────────────

test('getRecurrenceIdFromIcs returns null for non-recurring event', (t) => {
  t.is(getRecurrenceIdFromIcs(sampleIcal), null);
});

test('getRecurrenceIdFromIcs returns recurrence ID when present', (t) => {
  const withRecurrenceId = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:test-uid',
    'RECURRENCE-ID:20250108T100000Z',
    'DTSTART:20250108T140000Z',
    'SUMMARY:Override Instance',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = getRecurrenceIdFromIcs(withRecurrenceId);
  t.truthy(result);
  // ical.js v2 returns ISO format: 2025-01-08T10:00:00Z
  t.true(result.includes('2025-01-08') || result.includes('20250108'));
});

test('getRecurrenceIdFromIcs returns null for invalid iCal', (t) => {
  t.is(getRecurrenceIdFromIcs('invalid'), null);
});

// ─── Integration: Full workflow tests ────────────────────────────────────────

test('full workflow: cancel then check status', (t) => {
  // Start with an active event
  const active = sampleIcal;

  // Cancel it
  const cancelled = setCancelledStatus(active);
  t.truthy(cancelled);

  // Verify it's cancelled
  const comp = new ICAL.Component(ICAL.parse(cancelled));
  const vevent = comp.getFirstSubcomponent('vevent');
  t.is(vevent.getFirstPropertyValue('status'), 'CANCELLED');

  // UID should still be findable
  t.true(eventHasUid(cancelled, ['test-event-uid-123']));
});

test('full workflow: strip method then update partstat', (t) => {
  // Start with a REQUEST
  const stripped = stripMethodFromIcs(icalWithMethod);
  t.truthy(stripped);
  t.false(stripped.includes('METHOD'));

  // Update attendee partstat
  const updated = updateAttendeePartstat(
    stripped,
    'attendee@example.com',
    'ACCEPTED'
  );
  t.truthy(updated);
  t.true(updated.includes('ACCEPTED'));
});

test('full workflow: add override then cancel specific instance', (t) => {
  // Add an override instance
  const addIcal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'METHOD:ADD',
    'BEGIN:VEVENT',
    'UID:recurring-event-uid',
    'RECURRENCE-ID:20250108T100000Z',
    'DTSTART:20250108T140000Z',
    'DTEND:20250108T150000Z',
    'SUMMARY:Rescheduled',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const merged = mergeAddComponents(recurringIcal, addIcal);
  t.truthy(merged);

  // Now cancel a different instance
  const cancelled = setCancelledStatusForInstance(merged, '20250115T100000Z');
  t.truthy(cancelled);
});
