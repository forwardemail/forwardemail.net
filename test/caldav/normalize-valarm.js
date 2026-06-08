/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for helpers/normalize-valarm.js
 *
 * Verifies that absolute VALARM triggers (VALUE=DATE-TIME) are correctly
 * converted to relative duration triggers, preserving the offset from the
 * component's anchor property (DUE/DTSTART for VTODO, DTSTART/DTEND for
 * VEVENT).  Also verifies that relative triggers are left unchanged.
 *
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.6.3
 */

const test = require('ava');
const ICAL = require('ical.js');
const { normalizeVAlarm } = require('#helpers/normalize-valarm');

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

// VTODO with absolute trigger 1 hour before DUE
const VTODO_ABS_TRIGGER_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VTODO',
  'DTSTART:20250601T090000Z',
  'DUE:20250601T170000Z',
  'SUMMARY:Task with absolute alarm',
  'UID:vtodo-abs-1@test',
  'BEGIN:VALARM',
  'TRIGGER;VALUE=DATE-TIME:20250601T160000Z',
  'ACTION:DISPLAY',
  'DESCRIPTION:1 hour before DUE',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

// VTODO with relative trigger (should be unchanged)
const VTODO_REL_TRIGGER_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VTODO',
  'DTSTART:20250601T090000Z',
  'DUE:20250601T170000Z',
  'SUMMARY:Task with relative alarm',
  'UID:vtodo-rel-1@test',
  'BEGIN:VALARM',
  'TRIGGER:-PT15M',
  'ACTION:DISPLAY',
  'DESCRIPTION:15 minutes before',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

// VEVENT with absolute trigger 30 minutes before DTSTART
const VEVENT_ABS_TRIGGER_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'DTSTART:20250601T100000Z',
  'DTEND:20250601T110000Z',
  'SUMMARY:Event with absolute alarm',
  'UID:vevent-abs-1@test',
  'BEGIN:VALARM',
  'TRIGGER;VALUE=DATE-TIME:20250601T093000Z',
  'ACTION:DISPLAY',
  'DESCRIPTION:30 minutes before start',
  'END:VALARM',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// VTODO with absolute trigger AFTER DUE (positive offset)
const VTODO_AFTER_DUE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VTODO',
  'DTSTART:20250601T090000Z',
  'DUE:20250601T170000Z',
  'SUMMARY:Task with alarm after DUE',
  'UID:vtodo-after-1@test',
  'BEGIN:VALARM',
  'TRIGGER;VALUE=DATE-TIME:20250601T180000Z',
  'ACTION:DISPLAY',
  'DESCRIPTION:1 hour after DUE',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

// VTODO with multiple alarms (one absolute, one relative)
const VTODO_MULTI_ALARM_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VTODO',
  'DTSTART:20250601T090000Z',
  'DUE:20250601T170000Z',
  'SUMMARY:Task with multiple alarms',
  'UID:vtodo-multi-1@test',
  'BEGIN:VALARM',
  'TRIGGER;VALUE=DATE-TIME:20250601T160000Z',
  'ACTION:DISPLAY',
  'DESCRIPTION:Absolute alarm',
  'END:VALARM',
  'BEGIN:VALARM',
  'TRIGGER:-PT30M',
  'ACTION:DISPLAY',
  'DESCRIPTION:Relative alarm',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

// VTODO without DUE or DTSTART (no anchor)
const VTODO_NO_ANCHOR_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VTODO',
  'SUMMARY:Task with no dates',
  'UID:vtodo-noanchor-1@test',
  'BEGIN:VALARM',
  'TRIGGER;VALUE=DATE-TIME:20250601T160000Z',
  'ACTION:DISPLAY',
  'DESCRIPTION:Alarm with no anchor',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

// ─── Helper ──────────────────────────────────────────────────────────────────

function getTriggerInfo(icsData, componentType) {
  const comp = new ICAL.Component(ICAL.parse(icsData));
  const sub = comp.getFirstSubcomponent(componentType);
  if (!sub) return null;
  const valarms = sub.getAllSubcomponents('valarm');
  return valarms.map((valarm) => {
    const triggerProp = valarm.getFirstProperty('trigger');
    if (!triggerProp) return null;
    return {
      type: triggerProp.type,
      value: triggerProp.getFirstValue(),
      related: triggerProp.getParameter('related')
    };
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test('converts absolute VTODO trigger to relative duration with RELATED=END', (t) => {
  const result = normalizeVAlarm(VTODO_ABS_TRIGGER_ICS);

  // Should no longer contain VALUE=DATE-TIME
  t.false(result.includes('VALUE=DATE-TIME'));

  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 1);
  t.is(triggers[0].type, 'duration');
  t.is(triggers[0].related, 'END');

  // Trigger was 1 hour before DUE (17:00 - 16:00 = -1h)
  const dur = triggers[0].value;
  t.true(dur.isNegative);
  t.is(dur.hours, 1);
  t.is(dur.minutes, 0);
});

test('converts absolute VEVENT trigger to relative duration', (t) => {
  const result = normalizeVAlarm(VEVENT_ABS_TRIGGER_ICS);

  t.false(result.includes('VALUE=DATE-TIME'));

  const triggers = getTriggerInfo(result, 'vevent');
  t.is(triggers.length, 1);
  t.is(triggers[0].type, 'duration');

  // Trigger was 30 minutes before DTSTART (10:00 - 09:30 = -30m)
  const dur = triggers[0].value;
  t.true(dur.isNegative);
  t.is(dur.minutes, 30);
  // VEVENT should NOT have RELATED=END (default is START)
  t.falsy(triggers[0].related);
});

test('preserves relative triggers unchanged', (t) => {
  const result = normalizeVAlarm(VTODO_REL_TRIGGER_ICS);

  // Should still contain the original relative trigger
  t.true(result.includes('-PT15M'));

  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 1);
  t.is(triggers[0].type, 'duration');
});

test('handles positive offset (trigger after anchor)', (t) => {
  const result = normalizeVAlarm(VTODO_AFTER_DUE_ICS);

  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 1);
  t.is(triggers[0].type, 'duration');

  // Trigger was 1 hour AFTER DUE (18:00 - 17:00 = +1h)
  const dur = triggers[0].value;
  t.false(dur.isNegative);
  t.is(dur.hours, 1);
});

test('normalizes only absolute alarms in multi-alarm component', (t) => {
  const result = normalizeVAlarm(VTODO_MULTI_ALARM_ICS);

  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 2);

  // Both should now be duration type
  t.is(triggers[0].type, 'duration');
  t.is(triggers[1].type, 'duration');
});

test('skips components without anchor date', (t) => {
  const result = normalizeVAlarm(VTODO_NO_ANCHOR_ICS);

  // Should still contain the absolute trigger since there's no anchor
  t.true(result.includes('VALUE=DATE-TIME'));
});

test('returns original data for null/undefined input', (t) => {
  t.is(normalizeVAlarm(null), null);
  t.is(normalizeVAlarm(undefined), undefined);
  t.is(normalizeVAlarm(''), '');
});

test('returns original data for non-string input', (t) => {
  t.is(normalizeVAlarm(42), 42);
});

test('returns original data for malformed ICS', (t) => {
  const malformed = 'this is not valid ICS data';
  t.is(normalizeVAlarm(malformed), malformed);
});

test('returns original data for ICS with no VEVENT or VTODO', (t) => {
  const calOnly = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'END:VCALENDAR'
  ].join('\r\n');
  t.is(normalizeVAlarm(calOnly), calOnly);
});

test('output is valid ICS parseable by ical.js', (t) => {
  const result = normalizeVAlarm(VTODO_ABS_TRIGGER_ICS);

  t.notThrows(() => {
    const parsed = ICAL.parse(result);
    const comp = new ICAL.Component(parsed);
    t.truthy(comp.getFirstSubcomponent('vtodo'));
  });
});

test('VTODO without DUE falls back to DTSTART as anchor', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'BEGIN:VTODO',
    'DTSTART:20250601T090000Z',
    'SUMMARY:Task with only DTSTART',
    'UID:vtodo-dtstart-only@test',
    'BEGIN:VALARM',
    'TRIGGER;VALUE=DATE-TIME:20250601T083000Z',
    'ACTION:DISPLAY',
    'DESCRIPTION:30 min before DTSTART',
    'END:VALARM',
    'END:VTODO',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = normalizeVAlarm(ics);
  t.false(result.includes('VALUE=DATE-TIME'));

  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 1);
  const dur = triggers[0].value;
  t.true(dur.isNegative);
  t.is(dur.minutes, 30);
  // Without DUE, RELATED should NOT be END
  t.falsy(triggers[0].related);
});

// --- X-APPLE-PROXIMITY Tests (location-based alarms) -------------------------
// Apple Reminders uses X-APPLE-PROXIMITY=ARRIVE|DEPART inside VALARM for
// location-based triggers.  These use a sentinel trigger date
// (1976-04-01T00:55:45Z -- Apple's founding date) that is NOT a real alarm
// time.  normalizeVAlarm must skip these entirely to preserve the
// location-based trigger semantics.

const VTODO_PROXIMITY_ARRIVE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Apple Inc.//iOS 17.0//EN',
  'BEGIN:VTODO',
  'DUE:20250601T170000Z',
  'SUMMARY:Pick up dry cleaning',
  'UID:vtodo-proximity-arrive@test',
  'BEGIN:VALARM',
  'ACTION:DISPLAY',
  'DESCRIPTION:Reminder',
  'TRIGGER;VALUE=DATE-TIME:19760401T005545Z',
  'X-APPLE-PROXIMITY:ARRIVE',
  'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=456 Oak Ave:geo:37.3230,-122.0322',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

const VTODO_PROXIMITY_DEPART_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Apple Inc.//iOS 17.0//EN',
  'BEGIN:VTODO',
  'DUE:20250601T170000Z',
  'SUMMARY:Mail package',
  'UID:vtodo-proximity-depart@test',
  'BEGIN:VALARM',
  'ACTION:DISPLAY',
  'DESCRIPTION:Reminder',
  'TRIGGER;VALUE=DATE-TIME:19760401T005545Z',
  'X-APPLE-PROXIMITY:DEPART',
  'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=789 Elm St:geo:37.3220,-122.0310',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

const VTODO_PROXIMITY_MIXED_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Apple Inc.//iOS 17.0//EN',
  'BEGIN:VTODO',
  'DUE:20250601T170000Z',
  'SUMMARY:Task with mixed alarms',
  'UID:vtodo-proximity-mixed@test',
  'BEGIN:VALARM',
  'ACTION:DISPLAY',
  'DESCRIPTION:Location alarm',
  'TRIGGER;VALUE=DATE-TIME:19760401T005545Z',
  'X-APPLE-PROXIMITY:ARRIVE',
  'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=Home:geo:37.0,-122.0',
  'END:VALARM',
  'BEGIN:VALARM',
  'ACTION:DISPLAY',
  'DESCRIPTION:Time alarm 1 hour before',
  'TRIGGER;VALUE=DATE-TIME:20250601T160000Z',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

const VTODO_PROXIMITY_NO_DUE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Apple Inc.//iOS 17.0//EN',
  'BEGIN:VTODO',
  'SUMMARY:Location-only reminder no dates',
  'UID:vtodo-proximity-nodue@test',
  'BEGIN:VALARM',
  'ACTION:DISPLAY',
  'DESCRIPTION:Reminder',
  'TRIGGER;VALUE=DATE-TIME:19760401T005545Z',
  'X-APPLE-PROXIMITY:ARRIVE',
  'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=Office:geo:37.0,-122.0',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

test('preserves X-APPLE-PROXIMITY ARRIVE alarm (does not convert sentinel trigger)', (t) => {
  const result = normalizeVAlarm(VTODO_PROXIMITY_ARRIVE_ICS);
  // The sentinel trigger 1976-04-01T00:55:45Z must remain as-is
  t.true(
    result.includes('19760401T005545Z'),
    'Sentinel trigger date must be preserved'
  );
  t.true(
    result.includes('X-APPLE-PROXIMITY:ARRIVE'),
    'X-APPLE-PROXIMITY property must be preserved'
  );
  t.true(
    result.includes('X-APPLE-STRUCTURED-LOCATION'),
    'Structured location must be preserved'
  );
  // The trigger should still be VALUE=DATE-TIME (not converted to duration)
  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 1);
  t.is(triggers[0].type, 'date-time', 'Trigger type must remain date-time');
});

test('preserves X-APPLE-PROXIMITY DEPART alarm (does not convert sentinel trigger)', (t) => {
  const result = normalizeVAlarm(VTODO_PROXIMITY_DEPART_ICS);
  t.true(
    result.includes('19760401T005545Z'),
    'Sentinel trigger date must be preserved'
  );
  t.true(
    result.includes('X-APPLE-PROXIMITY:DEPART'),
    'X-APPLE-PROXIMITY DEPART must be preserved'
  );
  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 1);
  t.is(triggers[0].type, 'date-time', 'Trigger type must remain date-time');
});

test('mixed alarms: converts time-based absolute trigger but preserves proximity alarm', (t) => {
  const result = normalizeVAlarm(VTODO_PROXIMITY_MIXED_ICS);
  // Proximity alarm sentinel must be preserved
  t.true(
    result.includes('19760401T005545Z'),
    'Sentinel trigger for proximity alarm must be preserved'
  );
  t.true(
    result.includes('X-APPLE-PROXIMITY:ARRIVE'),
    'Proximity property must be preserved'
  );
  // The time-based absolute trigger (20250601T160000Z) should be converted
  // to a relative duration (-PT1H relative to DUE 17:00)
  t.false(
    result.includes('20250601T160000Z'),
    'Time-based absolute trigger should be converted'
  );
  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 2, 'Both alarms must be present');
  // Find the proximity alarm (still date-time)
  const proximityTrigger = triggers.find((tr) => tr.type === 'date-time');
  t.truthy(proximityTrigger, 'Proximity alarm must retain date-time type');
  // Find the converted time alarm (now duration)
  const timeTrigger = triggers.find((tr) => tr.type === 'duration');
  t.truthy(timeTrigger, 'Time-based alarm must be converted to duration');
  t.true(timeTrigger.value.isNegative);
  t.is(timeTrigger.value.hours, 1);
});

test('proximity alarm with no DUE/DTSTART is preserved unchanged', (t) => {
  const result = normalizeVAlarm(VTODO_PROXIMITY_NO_DUE_ICS);
  // No anchor means normalizeVAlarm cannot convert anything, but the
  // proximity alarm must still be preserved regardless
  t.true(
    result.includes('19760401T005545Z'),
    'Sentinel trigger must be preserved when no anchor date exists'
  );
  t.true(
    result.includes('X-APPLE-PROXIMITY:ARRIVE'),
    'Proximity property must be preserved'
  );
  t.true(
    result.includes('X-APPLE-STRUCTURED-LOCATION'),
    'Structured location must be preserved'
  );
  const triggers = getTriggerInfo(result, 'vtodo');
  t.is(triggers.length, 1);
  t.is(triggers[0].type, 'date-time');
});
