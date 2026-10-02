/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A calendar object naming many TZIDs (as many distinct strings for one zone,
// or many zones) is handled quickly: missing VTIMEZONEs are generated for a
// bounded number of TZIDs, and each zone is only worked out once.
//

const test = require('ava');

const {
  ensureVTimezones,
  MAX_GENERATED_VTIMEZONES
} = require('#helpers/generate-vtimezone');

function ics(tzids) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//test//EN'];
  for (const [i, tzid] of tzids.entries()) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:event-${i}`,
      'DTSTAMP:20250101T000000Z',
      `DTSTART;TZID=${tzid}:20250301T090000`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

test('many TZIDs for one zone are handled quickly', (t) => {
  const tzids = Array.from(
    { length: 500 },
    (_, i) => `/citrix.com/${i}/America/Chicago`
  );
  const start = Date.now();
  const out = ensureVTimezones(ics(tzids));
  t.true(Date.now() - start < 2000);
  const count = out.split('BEGIN:VTIMEZONE').length - 1;
  t.is(count, MAX_GENERATED_VTIMEZONES);
});

test('the VTIMEZONEs an ordinary event needs are still added', (t) => {
  const out = ensureVTimezones(ics(['America/New_York', 'Europe/Berlin']));
  t.true(out.includes('TZID:America/New_York'));
  t.true(out.includes('TZID:Europe/Berlin'));
  t.true(out.includes('BEGIN:DAYLIGHT'));
});
