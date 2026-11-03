/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The ICS storage pipeline (`prepareICSForStorage`, run on every CalDAV PUT
// and calendar event API write) must stay linear in the size of the body:
// a few hundred KB of duplicate properties, or of recurrence overrides
// sharing a UID with many masters, held the event loop for seconds to
// minutes and used gigabytes of memory.
//

const test = require('ava');
const ICAL = require('ical.js');

const {
  deduplicateIcsProperties
} = require('#helpers/deduplicate-ics-properties');
const { normalizeIcs } = require('#helpers/normalize-ics');
const { prepareICSForStorage } = require('#helpers/prepare-ics');

const HEAD = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//test//EN\r\n';
const TAIL = 'END:VCALENDAR\r\n';

function day(i) {
  return (
    new Date(Date.UTC(2025, 0, 1) + i * 86_400_000)
      .toISOString()
      .replaceAll(/[-:]/g, '')
      .slice(0, 15) + 'Z'
  );
}

test('duplicate single-instance properties are removed in linear time', (t) => {
  const ics =
    HEAD +
    'BEGIN:VEVENT\r\nUID:a\r\nDTSTAMP:20250101T000000Z\r\nDTSTART:20250101T000000Z\r\n' +
    'SUMMARY:x\r\n'.repeat(50_000) +
    'SUMMARY:last\r\nEND:VEVENT\r\n' +
    TAIL;
  const start = Date.now();
  const result = prepareICSForStorage(ics);
  const elapsed = Date.now() - start;
  const vevent = new ICAL.Component(ICAL.parse(result)).getFirstSubcomponent(
    'vevent'
  );
  t.is(vevent.getAllProperties('summary').length, 1);
  t.is(vevent.getFirstPropertyValue('summary'), 'last');
  t.true(elapsed < 2000, `took ${elapsed}ms`);
});

test('many duplicate EXDATE values are merged in linear time', (t) => {
  const exdates = Array.from(
    { length: 60_000 },
    (_, i) => `EXDATE:${day(i % 100)}\r\n`
  ).join('');
  const ics =
    HEAD +
    'BEGIN:VEVENT\r\nUID:a\r\nDTSTAMP:20250101T000000Z\r\nDTSTART:20250101T000000Z\r\nRRULE:FREQ=DAILY\r\n' +
    exdates +
    'END:VEVENT\r\n' +
    TAIL;
  const start = Date.now();
  const result = deduplicateIcsProperties(ics);
  const elapsed = Date.now() - start;
  const vevent = new ICAL.Component(ICAL.parse(result)).getFirstSubcomponent(
    'vevent'
  );
  const exdateProps = vevent.getAllProperties('exdate');
  t.is(exdateProps.length, 1);
  t.is(exdateProps[0].getValues().length, 100);
  t.true(elapsed < 3000, `took ${elapsed}ms`);
});

test('overrides sharing a UID with many masters are handled in linear time', (t) => {
  let ics = HEAD;
  for (let i = 0; i < 1000; i++)
    ics += 'BEGIN:VEVENT\r\nUID:a\r\nRRULE:FREQ=DAILY\r\nEND:VEVENT\r\n';
  for (let i = 0; i < 1000; i++)
    ics += `BEGIN:VEVENT\r\nUID:a\r\nRECURRENCE-ID:${day(i)}\r\nEND:VEVENT\r\n`;
  ics += TAIL;
  const start = Date.now();
  const result = normalizeIcs(ics);
  const elapsed = Date.now() - start;
  const masters = new ICAL.Component(ICAL.parse(result))
    .getAllSubcomponents('vevent')
    .filter((vevent) => !vevent.getFirstPropertyValue('recurrence-id'));
  // (each master gets them, up to a total far above any real calendar)
  t.is(
    masters.reduce(
      (sum, master) => sum + master.getAllProperties('exdate').length,
      0
    ),
    10_000
  );
  t.true(elapsed < 5000, `took ${elapsed}ms`);
});

// (as before, a duplicate master gets the EXDATE too)
test('each master of a UID gets the EXDATE of a moved instance', (t) => {
  let ics = HEAD;
  for (let i = 0; i < 2; i++)
    ics +=
      'BEGIN:VEVENT\r\nUID:a\r\nDTSTAMP:20250101T000000Z\r\nDTSTART:20250101T000000Z\r\nRRULE:FREQ=DAILY\r\nEND:VEVENT\r\n';
  ics += `BEGIN:VEVENT\r\nUID:a\r\nDTSTAMP:20250101T000000Z\r\nRECURRENCE-ID:${day(
    3
  )}\r\nDTSTART:${day(4)}\r\nEND:VEVENT\r\n`;
  ics += TAIL;
  const masters = new ICAL.Component(ICAL.parse(normalizeIcs(ics)))
    .getAllSubcomponents('vevent')
    .filter((vevent) => !vevent.getFirstPropertyValue('recurrence-id'));
  t.is(masters.length, 2);
  for (const master of masters)
    t.is(master.getAllProperties('exdate').length, 1);
});

test('a moved instance still gets its EXDATE on the master', (t) => {
  const ics =
    HEAD +
    'BEGIN:VEVENT\r\nUID:a\r\nDTSTART:20250101T100000Z\r\nRRULE:FREQ=DAILY;COUNT=5\r\nEND:VEVENT\r\n' +
    'BEGIN:VEVENT\r\nUID:b\r\nDTSTART:20250101T100000Z\r\nRRULE:FREQ=DAILY;COUNT=5\r\nEND:VEVENT\r\n' +
    'BEGIN:VEVENT\r\nUID:a\r\nRECURRENCE-ID:20250102T100000Z\r\nDTSTART:20250102T120000Z\r\nEND:VEVENT\r\n' +
    TAIL;
  const vevents = new ICAL.Component(
    ICAL.parse(normalizeIcs(ics))
  ).getAllSubcomponents('vevent');
  const exdate = (uid) =>
    vevents
      .find(
        (vevent) =>
          vevent.getFirstPropertyValue('uid') === uid &&
          !vevent.getFirstPropertyValue('recurrence-id')
      )
      .getAllProperties('exdate')
      .map((prop) => prop.getFirstValue().toICALString());
  t.deepEqual(exdate('a'), ['20250102T100000Z']);
  t.deepEqual(exdate('b'), []);
});
