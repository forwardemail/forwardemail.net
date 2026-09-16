/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Database = require('better-sqlite3-multiple-ciphers');
const test = require('ava');

const appendContactsAndCalendarsToArchive = require('#helpers/append-contacts-and-calendars-to-archive');

function createArchive() {
  const entries = [];
  return {
    entries,
    append(content, options) {
      entries.push({ content, name: options.name });
    }
  };
}

function createDatabase() {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE AddressBooks (_id TEXT PRIMARY KEY, name TEXT);
    CREATE TABLE Contacts (
      _id TEXT PRIMARY KEY,
      address_book TEXT,
      contact_id TEXT,
      uid TEXT,
      content TEXT,
      deleted_at TEXT
    );
    CREATE TABLE Calendars (_id TEXT PRIMARY KEY, name TEXT);
    CREATE TABLE CalendarEvents (
      _id TEXT PRIMARY KEY,
      calendar TEXT,
      eventId TEXT,
      ical TEXT,
      deleted_at TEXT
    );
  `);
  return database;
}

test('exports active contacts and calendar resources into portable folders', (t) => {
  const database = createDatabase();
  const archive = createArchive();

  database
    .prepare('INSERT INTO AddressBooks VALUES (?, ?)')
    .run('book-1', 'Personal / Friends');
  database
    .prepare('INSERT INTO Contacts VALUES (?, ?, ?, ?, ?, ?)')
    .run(
      'contact-1',
      'book-1',
      '../alice.vcf',
      'alice',
      'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:Alice\r\nEND:VCARD\r\n',
      null
    );
  database
    .prepare('INSERT INTO Contacts VALUES (?, ?, ?, ?, ?, ?)')
    .run(
      'contact-2',
      'book-1',
      'deleted.vcf',
      'deleted',
      'BEGIN:VCARD\r\nFN:Deleted\r\nEND:VCARD\r\n',
      '2026-01-01T00:00:00.000Z'
    );
  database
    .prepare('INSERT INTO Calendars VALUES (?, ?)')
    .run('calendar-1', 'Work: Projects');
  database
    .prepare('INSERT INTO CalendarEvents VALUES (?, ?, ?, ?, ?)')
    .run(
      'event-1',
      'calendar-1',
      'planning.ics',
      'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:planning\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n',
      null
    );
  database
    .prepare('INSERT INTO CalendarEvents VALUES (?, ?, ?, ?, ?)')
    .run(
      'event-2',
      'calendar-1',
      'planning.ics',
      'BEGIN:VCALENDAR\r\nBEGIN:VTODO\r\nUID:task\r\nEND:VTODO\r\nEND:VCALENDAR\r\n',
      null
    );
  database
    .prepare('INSERT INTO CalendarEvents VALUES (?, ?, ?, ?, ?)')
    .run(
      'event-3',
      'calendar-1',
      'deleted.ics',
      'BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n',
      '2026-01-01T00:00:00.000Z'
    );

  const result = appendContactsAndCalendarsToArchive({ archive, database });
  const names = archive.entries.map((entry) => entry.name);

  t.deepEqual(result, {
    addressBookCount: 1,
    contactCount: 1,
    calendarCount: 1,
    calendarEventCount: 2,
    skippedContactCount: 0,
    skippedCalendarEventCount: 0
  });
  t.true(names.includes('Contacts/'));
  t.true(names.includes('Contacts/Personal _ Friends/'));
  t.true(names.includes('Contacts/Personal _ Friends/_alice.vcf'));
  t.false(names.some((name) => name.includes('..')));
  t.false(names.some((name) => name.includes('deleted.vcf')));
  t.true(names.includes('Calendars/'));
  t.true(names.includes('Calendars/Work_ Projects/'));
  t.true(names.includes('Calendars/Work_ Projects/planning.ics'));
  t.true(names.includes('Calendars/Work_ Projects/planning-2.ics'));
  t.false(names.some((name) => name.includes('deleted.ics')));
  t.true(
    archive.entries
      .find((entry) => entry.name.endsWith('planning-2.ics'))
      .content.includes('BEGIN:VTODO')
  );

  database.close();
});

test('exports legacy unfiled resources without parent collection tables', (t) => {
  const database = new Database(':memory:');
  const archive = createArchive();
  database.exec(`
    CREATE TABLE Contacts (
      _id TEXT PRIMARY KEY,
      address_book TEXT,
      contact_id TEXT,
      uid TEXT,
      content TEXT
    );
    CREATE TABLE CalendarEvents (
      _id TEXT PRIMARY KEY,
      calendar TEXT,
      eventId TEXT,
      ical TEXT
    );
  `);
  database
    .prepare('INSERT INTO Contacts VALUES (?, ?, ?, ?, ?)')
    .run(
      'contact-1',
      'missing-book',
      'legacy',
      'legacy-contact',
      'BEGIN:VCARD\r\nFN:Legacy\r\nEND:VCARD\r\n'
    );
  database
    .prepare('INSERT INTO CalendarEvents VALUES (?, ?, ?, ?)')
    .run(
      'event-1',
      'missing-calendar',
      'legacy-event',
      'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n'
    );

  const result = appendContactsAndCalendarsToArchive({ archive, database });
  const names = new Set(archive.entries.map((entry) => entry.name));

  t.is(result.contactCount, 1);
  t.is(result.calendarEventCount, 1);
  t.true(names.has('Contacts/Unfiled/legacy.vcf'));
  t.true(names.has('Calendars/Unfiled/legacy-event.ics'));

  database.close();
});
