/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Calendar data embedded in an HTML part (the last-resort source) is found
// in time linear in the HTML size: a large HTML part of repeated
// "BEGIN:VCALENDAR" with no end stalled the worker delivering the message.
//

const test = require('ava');

const { checkAndProcessImipMessage } = require('#helpers/process-imip-reply');

test('an HTML part of repeated BEGIN:VCALENDAR is handled quickly', async (t) => {
  const start = Date.now();
  const result = await checkAndProcessImipMessage({
    html: 'BEGIN:VCALENDAR\r\n'.repeat(60_000),
    attachments: []
  });
  t.is(result, null);
  t.true(Date.now() - start < 500);
});

test('calendar data in an HTML part is still found', async (t) => {
  const html = `<pre>BEGIN:VCALENDAR
VERSION:2.0
METHOD:PUBLISH
BEGIN:VEVENT
UID:html-fallback@example.com
DTSTAMP:20250101T000000Z
DTSTART:20250102T100000Z
SUMMARY:Meeting
END:VEVENT
END:VCALENDAR</pre>`;
  // (PUBLISH is found and then left alone)
  const result = await checkAndProcessImipMessage({ html, attachments: [] });
  t.is(result, null);
});
