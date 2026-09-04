/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const { rrulestr } = require('rrule');

const {
  isRecoverableRruleParseError,
  normalizeRruleLine,
  sanitizeRruleLines
} = require('#helpers/sanitize-rrule-lines');

test('normalizes supported recurrence fields without modifying recurrence values', (t) => {
  const lines = [
    'DTSTART;TZID=Europe/Berlin:20260101T090000',
    'RRULE;X-EVOLUTION-ENDDATE=20261231T090000Z:FREQ=WEEKLY;COUNT=4',
    'RDATE;X-ICAL-SYNC-SCHOOL-HOLIDAYS=TRUE;TZID=Europe/Berlin:20260105T090000',
    'EXDATE;X-CLIENT-FLAG="one;two";VALUE=DATE:20260112'
  ];

  t.deepEqual(sanitizeRruleLines(lines), [
    'DTSTART;TZID=Europe/Berlin:20260101T090000',
    'RRULE:FREQ=WEEKLY;COUNT=4',
    'RDATE;TZID=Europe/Berlin:20260105T090000',
    'EXDATE;VALUE=DATE:20260112'
  ]);
});

test('produces rrule.js-compatible parser input for extension parameters', (t) => {
  const lines = sanitizeRruleLines([
    'DTSTART:20260101T090000Z',
    'RRULE;X-EVOLUTION-ENDDATE=20261231T090000Z:FREQ=WEEKLY;COUNT=4',
    'RDATE;X-ICAL-SYNC-SCHOOL-HOLIDAYS=TRUE:20260105T090000Z'
  ]);

  t.notThrows(() => rrulestr(lines.join('\n')));
});

test('drops non-recurrence component fragments from parser input', (t) => {
  t.deepEqual(
    sanitizeRruleLines([
      'BEGIN:STANDARD',
      'TZNAME:EST',
      'X-WR-CALNAME:Calendar',
      'RRULE:FREQ=DAILY;COUNT=2',
      'END:STANDARD'
    ]),
    ['RRULE:FREQ=DAILY;COUNT=2']
  );
});

test('normalizes one content line at a time and tolerates case variation', (t) => {
  t.is(
    normalizeRruleLine(
      'rrule;X-EVOLUTION-ENDDATE=20261231T090000Z:FREQ=MONTHLY;COUNT=2'
    ),
    'RRULE:FREQ=MONTHLY;COUNT=2'
  );
  t.is(normalizeRruleLine('not-a-property'), null);
});

test('classifies known rrule parser limitations as recoverable', (t) => {
  t.true(
    isRecoverableRruleParseError(
      new Error('unsupported RDATE/EXDATE parm: X-ICAL-SYNC-SCHOOL-HOLIDAYS')
    )
  );
  t.true(
    isRecoverableRruleParseError(
      new Error('unsupported RRULE parm: X-EVOLUTION-ENDDATE')
    )
  );
  t.false(isRecoverableRruleParseError(new Error('database unavailable')));
});
