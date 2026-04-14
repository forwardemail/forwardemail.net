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
