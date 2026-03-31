/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for helpers/normalize-ics.js
 *
 * Verifies that the normalizeIcs function correctly adds missing EXDATE
 * entries for RECURRENCE-ID overrides (detached/moved instances) on
 * recurring events, as required by RFC 5545 Section 3.8.5.1.
 *
 * This addresses the M365/Exchange non-RFC ICS issue where recurring
 * series have detached instances but no matching EXDATE on the master.
 */

const test = require('ava');
const ICAL = require('ical.js');

const { normalizeIcs } = require('#helpers/normalize-ics');

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

// M365-style recurring event with override but NO EXDATE on master
const M365_MISSING_EXDATE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Microsoft Corporation//Outlook 16.0//EN',
  'BEGIN:VEVENT',
  'UID:m365-recurring@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=WEEKLY;COUNT=10',
  'SUMMARY:Weekly Team Standup',
  'ORGANIZER:mailto:boss@example.com',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:m365-recurring@example.com',
  'RECURRENCE-ID:20250205T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250205T140000Z',
  'DTEND:20250205T150000Z',
  'SUMMARY:Weekly Team Standup (moved to afternoon)',
  'ORGANIZER:mailto:boss@example.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Recurring event that already has the correct EXDATE
const CORRECT_EXDATE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:correct-exdate@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=WEEKLY;COUNT=10',
  'EXDATE:20250205T100000Z',
  'SUMMARY:Weekly Meeting',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:correct-exdate@example.com',
  'RECURRENCE-ID:20250205T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250205T140000Z',
  'DTEND:20250205T150000Z',
  'SUMMARY:Weekly Meeting (rescheduled)',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Non-recurring event (no RRULE) — should not be modified
const SIMPLE_EVENT_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:simple-event@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'SUMMARY:Simple Event',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Multiple overrides — all should get EXDATEs
const MULTIPLE_OVERRIDES_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Microsoft Corporation//Outlook 16.0//EN',
  'BEGIN:VEVENT',
  'UID:multi-override@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=DAILY;COUNT=10',
  'SUMMARY:Daily Standup',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:multi-override@example.com',
  'RECURRENCE-ID:20250130T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250130T140000Z',
  'DTEND:20250130T150000Z',
  'SUMMARY:Daily Standup (moved Jan 30)',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:multi-override@example.com',
  'RECURRENCE-ID:20250201T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250201T160000Z',
  'DTEND:20250201T170000Z',
  'SUMMARY:Daily Standup (moved Feb 1)',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:multi-override@example.com',
  'RECURRENCE-ID:20250203T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250203T090000Z',
  'DTEND:20250203T100000Z',
  'SUMMARY:Daily Standup (moved Feb 3)',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Recurring event with TZID on RECURRENCE-ID
const TZID_OVERRIDE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Microsoft Corporation//Outlook 16.0//EN',
  'BEGIN:VTIMEZONE',
  'TZID:America/New_York',
  'BEGIN:STANDARD',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11',
  'TZOFFSETFROM:-0400',
  'TZOFFSETTO:-0500',
  'END:STANDARD',
  'BEGIN:DAYLIGHT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0400',
  'END:DAYLIGHT',
  'END:VTIMEZONE',
  'BEGIN:VEVENT',
  'UID:tzid-override@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART;TZID=America/New_York:20250129T100000',
  'DTEND;TZID=America/New_York:20250129T110000',
  'RRULE:FREQ=WEEKLY;COUNT=10',
  'SUMMARY:NYC Team Meeting',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:tzid-override@example.com',
  'RECURRENCE-ID;TZID=America/New_York:20250205T100000',
  'DTSTAMP:20250129T100000Z',
  'DTSTART;TZID=America/New_York:20250205T140000',
  'DTEND;TZID=America/New_York:20250205T150000',
  'SUMMARY:NYC Team Meeting (rescheduled)',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Partial EXDATE — one override has EXDATE, another doesn't
const PARTIAL_EXDATE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Microsoft Corporation//Outlook 16.0//EN',
  'BEGIN:VEVENT',
  'UID:partial-exdate@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=DAILY;COUNT=10',
  'EXDATE:20250130T100000Z',
  'SUMMARY:Daily Standup',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:partial-exdate@example.com',
  'RECURRENCE-ID:20250130T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250130T140000Z',
  'DTEND:20250130T150000Z',
  'SUMMARY:Daily Standup (moved Jan 30)',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:partial-exdate@example.com',
  'RECURRENCE-ID:20250201T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250201T160000Z',
  'DTEND:20250201T170000Z',
  'SUMMARY:Daily Standup (moved Feb 1)',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// DATE-only (all-day) recurring event with override
const ALL_DAY_OVERRIDE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Microsoft Corporation//Outlook 16.0//EN',
  'BEGIN:VEVENT',
  'UID:allday-override@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART;VALUE=DATE:20250129',
  'DTEND;VALUE=DATE:20250130',
  'RRULE:FREQ=WEEKLY;COUNT=5',
  'SUMMARY:All-Day Weekly Review',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:allday-override@example.com',
  'RECURRENCE-ID;VALUE=DATE:20250205',
  'DTSTAMP:20250129T100000Z',
  'DTSTART;VALUE=DATE:20250206',
  'DTEND;VALUE=DATE:20250207',
  'SUMMARY:All-Day Weekly Review (moved)',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// RDATE-based recurrence (no RRULE) with override
const RDATE_OVERRIDE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:rdate-override@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RDATE:20250205T100000Z',
  'RDATE:20250212T100000Z',
  'SUMMARY:Ad-hoc Meeting',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:rdate-override@example.com',
  'RECURRENCE-ID:20250205T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250205T140000Z',
  'DTEND:20250205T150000Z',
  'SUMMARY:Ad-hoc Meeting (rescheduled)',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// ─── Helper ──────────────────────────────────────────────────────────────────

function getExdates(icsData) {
  const comp = new ICAL.Component(ICAL.parse(icsData));
  const vevents = comp.getAllSubcomponents('vevent');
  const master = vevents.find((v) => !v.getFirstPropertyValue('recurrence-id'));
  if (!master) return [];
  return master
    .getAllProperties('exdate')
    .map((p) => p.getFirstValue().toICALString());
}

function countVevents(icsData) {
  const comp = new ICAL.Component(ICAL.parse(icsData));
  return comp.getAllSubcomponents('vevent').length;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

test('adds missing EXDATE for single detached override (M365 pattern)', (t) => {
  const result = normalizeIcs(M365_MISSING_EXDATE_ICS);

  // Should have added an EXDATE for 20250205T100000Z
  const exdates = getExdates(result);
  t.is(exdates.length, 1, 'Should have exactly 1 EXDATE');
  t.is(
    exdates[0],
    '20250205T100000Z',
    'EXDATE should match RECURRENCE-ID date'
  );

  // VEVENT count should be unchanged
  t.is(countVevents(result), 2, 'Should still have 2 VEVENTs');
});

test('does not modify ICS that already has correct EXDATEs', (t) => {
  const result = normalizeIcs(CORRECT_EXDATE_ICS);

  // Should be unchanged (already has the EXDATE)
  const exdates = getExdates(result);
  t.is(exdates.length, 1, 'Should still have exactly 1 EXDATE');
  t.is(exdates[0], '20250205T100000Z', 'EXDATE should be unchanged');
});

test('does not modify simple non-recurring events', (t) => {
  const result = normalizeIcs(SIMPLE_EVENT_ICS);
  // Should return unchanged since there's no RECURRENCE-ID
  t.is(result, SIMPLE_EVENT_ICS, 'Simple event should be returned unchanged');
});

test('adds EXDATEs for all detached overrides in multi-override series', (t) => {
  const result = normalizeIcs(MULTIPLE_OVERRIDES_ICS);

  const exdates = getExdates(result);
  t.is(exdates.length, 3, 'Should have 3 EXDATEs for 3 overrides');

  // Sort for deterministic comparison
  const sorted = exdates.sort();
  t.is(sorted[0], '20250130T100000Z', 'First EXDATE should be Jan 30');
  t.is(sorted[1], '20250201T100000Z', 'Second EXDATE should be Feb 1');
  t.is(sorted[2], '20250203T100000Z', 'Third EXDATE should be Feb 3');

  // All 4 VEVENTs should still be present
  t.is(countVevents(result), 4, 'Should still have 4 VEVENTs');
});

test('preserves TZID parameter on added EXDATE', (t) => {
  const result = normalizeIcs(TZID_OVERRIDE_ICS);

  const comp = new ICAL.Component(ICAL.parse(result));
  const vevents = comp.getAllSubcomponents('vevent');
  const master = vevents.find((v) => !v.getFirstPropertyValue('recurrence-id'));
  const exdateProps = master.getAllProperties('exdate');

  t.is(exdateProps.length, 1, 'Should have 1 EXDATE');

  const tzid = exdateProps[0].getParameter('tzid');
  t.is(
    tzid,
    'America/New_York',
    'EXDATE should preserve TZID from RECURRENCE-ID'
  );
});

test('only adds missing EXDATEs when some already exist (partial fix)', (t) => {
  const result = normalizeIcs(PARTIAL_EXDATE_ICS);

  const exdates = getExdates(result);
  t.is(exdates.length, 2, 'Should have 2 EXDATEs (1 existing + 1 added)');

  const sorted = exdates.sort();
  t.is(sorted[0], '20250130T100000Z', 'First EXDATE (pre-existing) for Jan 30');
  t.is(sorted[1], '20250201T100000Z', 'Second EXDATE (added) for Feb 1');
});

test('handles all-day (DATE-only) recurring events with override', (t) => {
  const result = normalizeIcs(ALL_DAY_OVERRIDE_ICS);

  const exdates = getExdates(result);
  t.is(exdates.length, 1, 'Should have 1 EXDATE for the all-day override');
  // DATE-only values serialize as YYYYMMDD
  t.is(exdates[0], '20250205', 'EXDATE should be DATE-only format');
});

test('handles RDATE-based recurrence with override', (t) => {
  const result = normalizeIcs(RDATE_OVERRIDE_ICS);

  const exdates = getExdates(result);
  t.is(exdates.length, 1, 'Should have 1 EXDATE');
  t.is(exdates[0], '20250205T100000Z', 'EXDATE should match RECURRENCE-ID');
});

test('returns null/undefined/non-string input unchanged', (t) => {
  t.is(normalizeIcs(null), null, 'null should pass through');
  t.is(normalizeIcs(undefined), undefined, 'undefined should pass through');
  t.is(normalizeIcs(''), '', 'empty string should pass through');
  t.is(normalizeIcs(123), 123, 'non-string should pass through');
});

test('returns malformed ICS unchanged (does not throw)', (t) => {
  const malformed = 'BEGIN:VCALENDAR\r\nRECURRENCE-ID:garbage\r\nEND:VCALENDAR';
  t.notThrows(
    () => normalizeIcs(malformed),
    'Should not throw on malformed ICS'
  );
});

test('does not add EXDATE when override UID does not match master UID', (t) => {
  const mismatchedUid = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    'UID:master-uid@example.com',
    'DTSTAMP:20250129T100000Z',
    'DTSTART:20250129T100000Z',
    'DTEND:20250129T110000Z',
    'RRULE:FREQ=WEEKLY;COUNT=10',
    'SUMMARY:Master Event',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:different-uid@example.com',
    'RECURRENCE-ID:20250205T100000Z',
    'DTSTAMP:20250129T100000Z',
    'DTSTART:20250205T140000Z',
    'DTEND:20250205T150000Z',
    'SUMMARY:Different Event Override',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = normalizeIcs(mismatchedUid);

  // Master should NOT get an EXDATE since the override has a different UID
  const exdates = getExdates(result);
  t.is(exdates.length, 0, 'Should not add EXDATE for mismatched UID');
});

test('output has CRLF line endings per RFC 5545', (t) => {
  const result = normalizeIcs(M365_MISSING_EXDATE_ICS);

  // Check that output uses CRLF
  t.true(result.includes('\r\n'), 'Output should use CRLF line endings');
  // Check no bare LF (without preceding CR)
  const bareLF = result.replace(/\r\n/g, '').includes('\n');
  t.false(bareLF, 'Output should not have bare LF line endings');
});

test('idempotent — running normalizeIcs twice produces same result', (t) => {
  const first = normalizeIcs(M365_MISSING_EXDATE_ICS);
  const second = normalizeIcs(first);

  const exdates1 = getExdates(first);
  const exdates2 = getExdates(second);

  t.deepEqual(exdates1, exdates2, 'Running twice should produce same EXDATEs');
  t.is(
    countVevents(first),
    countVevents(second),
    'VEVENT count should be same'
  );
});

test('does not modify single VEVENT with RECURRENCE-ID but no master', (t) => {
  // This is a standalone override (orphaned) — no master to add EXDATE to
  const orphanOverride = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'BEGIN:VEVENT',
    'UID:orphan@example.com',
    'RECURRENCE-ID:20250205T100000Z',
    'DTSTAMP:20250129T100000Z',
    'DTSTART:20250205T140000Z',
    'DTEND:20250205T150000Z',
    'SUMMARY:Orphan Override',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = normalizeIcs(orphanOverride);
  // Only 1 VEVENT, so early return
  t.is(result, orphanOverride, 'Single VEVENT should be returned unchanged');
});
