//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const path = require('node:path');

const ICAL = require('ical.js');
const test = require('ava');

const parseCalendarFeed = require('#helpers/parse-calendar-feed');

const { signature } = parseCalendarFeed;

//
// NOTE: the fixtures are written after what each service sends (its PRODID,
//       time zone names, property order, line folding and extensions); they
//       are not exports of real calendars.
//
function fixture(name) {
  return fs.readFileSync(
    path.join(__dirname, '..', 'fixtures', 'calendar-feeds', `${name}.ics`),
    'utf8'
  );
}

function components(resource, name = 'vevent') {
  return new ICAL.Component(ICAL.parse(resource.ical)).getAllSubcomponents(
    name
  );
}

function byUid(feed, uid) {
  return feed.resources.find((r) => r.uid === uid);
}

test('every resource of every fixture is one the model can store', (t) => {
  for (const name of ['google', 'outlook', 'apple', 'fastmail', 'sports']) {
    const feed = parseCalendarFeed(fixture(name));
    t.is(feed.skipped, 0, `${name}`);
    t.true(feed.resources.length > 0, `${name}`);
    const eventIds = new Set();
    for (const resource of feed.resources) {
      t.regex(resource.eventId, /^[\w.-]{1,128}$/);
      t.false(eventIds.has(resource.eventId));
      eventIds.add(resource.eventId);
      t.true(resource.ical.startsWith('BEGIN:VCALENDAR\r\n'));
      t.true(resource.ical.trimEnd().endsWith('END:VCALENDAR'));
      // (CRLF only)
      t.notRegex(resource.ical, /[^\r]\n/);
      // (a resource is not a scheduling message)
      t.notRegex(resource.ical, /^METHOD:/m);
      const calendar = new ICAL.Component(ICAL.parse(resource.ical));
      const uids = new Set(
        [
          ...calendar.getAllSubcomponents('vevent'),
          ...calendar.getAllSubcomponents('vtodo')
        ].map((c) => c.getFirstPropertyValue('uid'))
      );
      t.deepEqual([...uids], [resource.uid]);
    }
  }
});

test('Google: calendar properties, an override with its event, all-day events', (t) => {
  const feed = parseCalendarFeed(fixture('google'));
  t.is(feed.name, 'Family');
  t.is(feed.description, 'Shared family calendar, kept by Sam');
  t.is(feed.timezone, 'America/New_York');
  t.is(feed.refreshInterval, undefined);
  t.is(feed.resources.length, 3);

  const recurring = byUid(feed, '4mkd0a1b2c3d4e5f6g7h8i9j0k@google.com');
  // (a UID that is not safe in a path is not used as one)
  t.regex(recurring.eventId, /^[\da-f]{40}$/);
  const [event, override] = components(recurring);
  t.truthy(event.getFirstProperty('rrule'));
  t.falsy(event.getFirstProperty('recurrence-id'));
  t.truthy(override.getFirstProperty('recurrence-id'));
  t.is(event.getAllProperties('exdate').length > 0, true);
  // (a folded line is put back together)
  t.true(
    event
      .getFirstPropertyValue('description')
      .includes('https://example.com/fields?id=12& view=full')
  );
  t.is(event.getFirstPropertyValue('location'), 'Riverside Park, Field 3');
  // (the time zone the event refers to comes with it)
  t.true(recurring.ical.includes('TZID:America/New_York'));

  const allDay = byUid(feed, '7aa1bb2cc3dd4ee5ff6gg7hh8i@google.com');
  t.true(components(allDay)[0].getFirstPropertyValue('dtstart').isDate);
  // (an event in UTC carries no time zone it does not need)
  const utc = byUid(feed, '0zz9yy8xx7ww6vv5uu4tt3ss2r@google.com');
  t.false(utc.ical.includes('BEGIN:VTIMEZONE'));
  t.is(components(utc)[0].getAllSubcomponents('valarm').length, 1);
});

test('Outlook: a folded UID, Windows time zone names, an override without EXDATE', (t) => {
  const feed = parseCalendarFeed(fixture('outlook'));
  t.is(feed.name, 'Calendar');
  t.is(feed.resources.length, 2);
  const uid =
    '040000008200E00074C5B7101A82E00800000000B0A1C2D3E4F5DB01000000000000000010000000A1B2C3D4E5F60718293A4B5C6D7E8F9';
  const recurring = byUid(feed, uid);
  t.truthy(recurring);
  t.is(recurring.eventId, uid);
  const [event, override] = components(recurring);
  t.is(override.getFirstPropertyValue('summary'), 'Team sync (retro)');
  t.truthy(event.getFirstProperty('rrule'));
  t.true(recurring.ical.includes('TZID:W. Europe Standard Time'));
});

test('Apple: REFRESH-INTERVAL before X-PUBLISHED-TTL, colour, text beyond ASCII', (t) => {
  const feed = parseCalendarFeed(fixture('apple'));
  t.is(feed.name, 'Club rides');
  t.is(feed.color, '#34AADC');
  t.is(feed.refreshInterval, 4 * 60 * 60 * 1000);
  const ride = byUid(feed, '6F1C2D3E-4A5B-4C6D-8E7F-9A0B1C2D3E4F');
  const [event] = components(ride);
  t.is(event.getFirstPropertyValue('summary'), 'Saturday club ride 🚴');
  t.is(event.getFirstPropertyValue('location'), 'Café Vélo\nHigh Street');
  t.is(event.getFirstPropertyValue('rrule').count, 6);
});

test('Fastmail: NAME and COLOR, DURATION, attendees, a task', (t) => {
  const feed = parseCalendarFeed(fixture('fastmail'));
  t.is(feed.name, 'Work');
  t.is(feed.color, '#0252D4');
  t.is(feed.refreshInterval, 30 * 60 * 1000);
  t.is(feed.resources.length, 2);
  const [event] = components(
    byUid(feed, '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
  );
  t.is(event.getAllProperties('attendee').length, 2);
  t.truthy(event.getFirstProperty('duration'));
  const task = byUid(feed, '1c9d2e3f-0000-4000-8000-00000000abcd');
  t.is(components(task, 'vtodo').length, 1);
});

test('a schedule of many recurring events, with LF line endings', (t) => {
  const feed = parseCalendarFeed(fixture('sports'));
  t.is(feed.name, 'Rovers 2026/27');
  t.is(feed.refreshInterval, 12 * 60 * 60 * 1000);
  t.is(feed.resources.length, 162);
  const recurring = feed.resources.filter((r) => r.ical.includes('RRULE:'));
  t.is(recurring.length, 42);
});

test('a malformed feed keeps what can be read and counts the rest', (t) => {
  const feed = parseCalendarFeed(fixture('malformed'));
  t.is(feed.name, 'Broken feed');
  // (neither is an interval)
  t.is(feed.refreshInterval, undefined);
  const uids = new Set(feed.resources.map((r) => r.uid));
  t.true(uids.has('good-1'));
  t.true(uids.has('good-2'));
  t.false(uids.has('bad-date'));
  t.false(uids.has('no-start'));
  t.false(uids.has('truncated'));
  t.false(uids.has('journal-1'));
  // (an event without a UID is given one)
  t.is(feed.resources.filter((r) => /^[\da-f]{40}$/.test(r.uid)).length, 1);
  // bad-date, no-start, truncated (and bad-rrule unless it could be mended)
  t.true(feed.skipped >= 3);
  t.is(feed.resources.length + feed.skipped, 7);
  // (a PRODID that is not plain text is not copied into every resource)
  for (const resource of feed.resources) t.false(resource.ical.includes('<b>'));
});

test('an event without a UID keeps the same one while it is unchanged', (t) => {
  const a = parseCalendarFeed(fixture('malformed'));
  const b = parseCalendarFeed(fixture('malformed'));
  t.deepEqual(
    a.resources.map((r) => r.eventId),
    b.resources.map((r) => r.eventId)
  );
});

test('refuses what is not a calendar, or one of which nothing can be read', (t) => {
  for (const input of [
    '',
    '<!doctype html><html></html>',
    'BEGIN:VCARD\r\nEND:VCARD',
    undefined,
    null,
    Buffer.from('BEGIN:VCALENDAR')
  ]) {
    const error = t.throws(() => parseCalendarFeed(input));
    t.is(error.code, 'FEED_INVALID');
  }

  const error = t.throws(() =>
    parseCalendarFeed(
      'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:x\nDTSTART:nope\nEND:VEVENT\nEND:VCALENDAR'
    )
  );
  t.is(error.code, 'FEED_INVALID');
});

test('an empty calendar is a calendar with no events', (t) => {
  const feed = parseCalendarFeed(
    'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n'
  );
  t.deepEqual(feed.resources, []);
  t.is(feed.skipped, 0);
});

test('refuses a feed with more events than the limit', (t) => {
  const error = t.throws(() =>
    parseCalendarFeed(fixture('sports'), { maxEvents: 100 })
  );
  t.is(error.code, 'FEED_TOO_MANY_EVENTS');
  t.is(parseCalendarFeed(fixture('sports'), { maxEvents: 162 }).skipped, 0);
});

test('leaves out an event over the size limit', (t) => {
  const big = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'UID:big',
    'DTSTART:20261110T100000Z',
    `DESCRIPTION:${'a'.repeat(5000)}`,
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:small',
    'DTSTART:20261110T100000Z',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  const feed = parseCalendarFeed(big, { maxResourceBytes: 1000 });
  t.deepEqual(
    feed.resources.map((r) => r.uid),
    ['small']
  );
  t.is(feed.skipped, 1);
});

test('reads several calendars in one file', (t) => {
  const one = (uid) =>
    `BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:${uid}\r\nDTSTART:20261110T100000Z\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
  const feed = parseCalendarFeed(one('a') + one('b'));
  t.deepEqual(
    feed.resources.map((r) => r.uid),
    ['a', 'b']
  );
});

//
// What makes a refresh leave an unchanged event (and its ETag) alone
//
test('the same feed gives the same resources, whatever its DTSTAMPs and order', (t) => {
  const text = fixture('google');
  const first = parseCalendarFeed(text);
  // (Google writes the time of the request into every DTSTAMP)
  const restamped = parseCalendarFeed(
    text.replace(/DTSTAMP:\d{8}T\d{6}Z/g, 'DTSTAMP:20270101T000000Z')
  );
  t.notDeepEqual(
    first.resources.map((r) => r.ical),
    restamped.resources.map((r) => r.ical)
  );
  t.deepEqual(
    first.resources.map((r) => signature(r.ical)),
    restamped.resources.map((r) => signature(r.ical))
  );

  // (the override sent before its event)
  const blocks = text.split(/(?=BEGIN:VEVENT)/);
  const reordered = parseCalendarFeed(
    [blocks[0], blocks[2], blocks[1], ...blocks.slice(3)].join('')
  );
  const uid = '4mkd0a1b2c3d4e5f6g7h8i9j0k@google.com';
  t.is(byUid(reordered, uid).ical, byUid(first, uid).ical);
});

test('a changed event has another signature', (t) => {
  const text = fixture('google');
  const a = byUid(
    parseCalendarFeed(text),
    '0zz9yy8xx7ww6vv5uu4tt3ss2r@google.com'
  );
  const b = byUid(
    parseCalendarFeed(text.replace('SUMMARY:Dentist', 'SUMMARY:Orthodontist')),
    '0zz9yy8xx7ww6vv5uu4tt3ss2r@google.com'
  );
  t.not(signature(a.ical), signature(b.ical));
});
