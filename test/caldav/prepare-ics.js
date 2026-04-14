/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const ICAL = require('ical.js');

const { prepareICSForStorage } = require('../../helpers/prepare-ics');

//
// Fixtures
//

const SIMPLE_VEVENT = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'UID:test-prepare-ics-1',
  'DTSTART;TZID=America/New_York:20250315T100000',
  'DTEND;TZID=America/New_York:20250315T110000',
  'SUMMARY:Test Event',
  'DTSTAMP:20250301T120000Z',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\n');

const M365_RECURRING_WITH_OVERRIDE = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'UID:m365-recur-1',
  'DTSTART;TZID=America/Chicago:20250101T090000',
  'DTEND;TZID=America/Chicago:20250101T100000',
  'RRULE:FREQ=WEEKLY;COUNT=10',
  'SUMMARY:Weekly Meeting',
  'DTSTAMP:20250101T000000Z',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:m365-recur-1',
  'RECURRENCE-ID;TZID=America/Chicago:20250108T090000',
  'DTSTART;TZID=America/Chicago:20250108T140000',
  'DTEND;TZID=America/Chicago:20250108T150000',
  'SUMMARY:Weekly Meeting (moved)',
  'DTSTAMP:20250101T000000Z',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\n');

const VTODO_WITH_ABSOLUTE_ALARM = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VTODO',
  'UID:todo-alarm-1',
  'DUE:20250320T170000Z',
  'SUMMARY:Task with absolute alarm',
  'DTSTAMP:20250301T120000Z',
  'BEGIN:VALARM',
  'ACTION:DISPLAY',
  'DESCRIPTION:Reminder',
  'TRIGGER;VALUE=DATE-TIME:20250320T163000Z',
  'END:VALARM',
  'END:VTODO',
  'END:VCALENDAR'
].join('\n');

const VEVENT_WITH_UNQUOTED_FILENAME = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'UID:attach-1',
  'DTSTART:20250315T100000Z',
  'DTEND:20250315T110000Z',
  'SUMMARY:Event with attachment',
  'DTSTAMP:20250301T120000Z',
  'ATTACH;FILENAME=My Document.pdf;FMTTYPE=application/pdf:https://example.com/doc.pdf',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\n');

// Helper: parse ICS and extract a component
function getComponent(ics, type) {
  const comp = new ICAL.Component(ICAL.parse(ics));
  return comp.getFirstSubcomponent(type);
}

//
// Tests: Default options (CalDAV PUT path — stages 1-3, 6 only)
//

test('default options: returns CRLF-normalized output', (t) => {
  const result = prepareICSForStorage(SIMPLE_VEVENT);
  t.true(result.includes('\r\n'), 'output should have CRLF line endings');
  t.false(
    result.replace(/\r\n/g, '').includes('\n'),
    'output should not have bare LF'
  );
});

test('default options: injects missing VTIMEZONE for referenced TZID', (t) => {
  const result = prepareICSForStorage(SIMPLE_VEVENT);
  t.true(
    result.includes('BEGIN:VTIMEZONE'),
    'should inject VTIMEZONE for America/New_York'
  );
  t.true(
    result.includes('America/New_York'),
    'VTIMEZONE should reference America/New_York'
  );
});

test('default options: adds missing EXDATE for M365 recurring overrides', (t) => {
  const result = prepareICSForStorage(M365_RECURRING_WITH_OVERRIDE);
  const comp = new ICAL.Component(ICAL.parse(result));
  const vevents = comp.getAllSubcomponents('vevent');
  const master = vevents.find(
    (v) =>
      v.getFirstProperty('rrule') && !v.getFirstPropertyValue('recurrence-id')
  );
  t.truthy(master, 'should have a master VEVENT');
  const exdates = master.getAllProperties('exdate');
  t.true(exdates.length > 0, 'master should have EXDATE added');
});

test('default options: does NOT stamp DTSTAMP (CalDAV clients set their own)', (t) => {
  const result = prepareICSForStorage(SIMPLE_VEVENT);
  const vevent = getComponent(result, 'vevent');
  const dtstamp = vevent.getFirstPropertyValue('dtstamp');
  t.is(
    dtstamp.toICALString(),
    '20250301T120000Z',
    'DTSTAMP should be preserved from original'
  );
});

test('default options: does NOT normalize VALARM triggers', (t) => {
  const result = prepareICSForStorage(VTODO_WITH_ABSOLUTE_ALARM);
  const vtodo = getComponent(result, 'vtodo');
  const valarm = vtodo.getFirstSubcomponent('valarm');
  const trigger = valarm.getFirstProperty('trigger');
  t.is(trigger.type, 'date-time', 'trigger should remain absolute');
});

//
// Tests: API options (stamp + normalizeAlarms — all stages)
//

test('API options: stamps DTSTAMP and LAST-MODIFIED to current time', (t) => {
  const before = Date.now();
  const result = prepareICSForStorage(SIMPLE_VEVENT, {
    stamp: true,
    normalizeAlarms: true
  });
  const after = Date.now();

  const vevent = getComponent(result, 'vevent');
  const dtstamp = vevent.getFirstPropertyValue('dtstamp');
  const lastMod = vevent.getFirstPropertyValue('last-modified');

  t.truthy(dtstamp, 'should have DTSTAMP');
  t.truthy(lastMod, 'should have LAST-MODIFIED');

  // ICS timestamps are truncated to seconds, so allow 2s tolerance
  const dtstampMs = dtstamp.toJSDate().getTime();
  t.true(
    dtstampMs >= before - 2000 && dtstampMs <= after + 2000,
    'DTSTAMP should be approximately now'
  );
  // Verify it's NOT the original 2025-03-01 timestamp
  t.not(
    dtstamp.toICALString(),
    '20250301T120000Z',
    'DTSTAMP should be updated from original'
  );
});

test('API options: normalizes absolute VALARM to relative duration', (t) => {
  const result = prepareICSForStorage(VTODO_WITH_ABSOLUTE_ALARM, {
    stamp: true,
    normalizeAlarms: true
  });
  const vtodo = getComponent(result, 'vtodo');
  const valarm = vtodo.getFirstSubcomponent('valarm');
  const trigger = valarm.getFirstProperty('trigger');
  t.is(trigger.type, 'duration', 'trigger should be converted to duration');
});

test('API options: quotes FILENAME params with spaces', (t) => {
  const result = prepareICSForStorage(VEVENT_WITH_UNQUOTED_FILENAME, {
    stamp: true,
    normalizeAlarms: true
  });
  // After quoting, the FILENAME value should be wrapped in double quotes
  // (the exact format depends on quoteICSFilenames + line folding)
  t.true(
    result.includes('FILENAME="My Document.pdf"'),
    'FILENAME should be quoted'
  );
});

//
// Tests: Edge cases
//

test('returns non-string input unchanged', (t) => {
  t.is(prepareICSForStorage(null), null);
  t.is(prepareICSForStorage(undefined), undefined);
  t.is(prepareICSForStorage(''), '');
  t.is(prepareICSForStorage(42), 42);
});

test('handles malformed ICS gracefully', (t) => {
  const malformed = 'this is not valid ICS data';
  const result = prepareICSForStorage(malformed);
  t.is(typeof result, 'string', 'should return a string');
});

test('output is parseable by ical.js', (t) => {
  const result = prepareICSForStorage(SIMPLE_VEVENT, {
    stamp: true,
    normalizeAlarms: true
  });
  t.notThrows(() => {
    const parsed = ICAL.parse(result);
    const comp = new ICAL.Component(parsed);
    t.truthy(comp.getFirstSubcomponent('vevent'));
  });
});

test('pipeline is idempotent (running twice gives same result)', (t) => {
  const first = prepareICSForStorage(M365_RECURRING_WITH_OVERRIDE, {
    normalizeAlarms: true
  });
  const second = prepareICSForStorage(first, { normalizeAlarms: true });
  // EXDATE and VTIMEZONE should not be duplicated
  const comp = new ICAL.Component(ICAL.parse(second));
  const vevents = comp.getAllSubcomponents('vevent');
  const master = vevents.find(
    (v) =>
      v.getFirstProperty('rrule') && !v.getFirstPropertyValue('recurrence-id')
  );
  const exdates = master.getAllProperties('exdate');
  t.is(exdates.length, 1, 'should not duplicate EXDATEs on second pass');
});
