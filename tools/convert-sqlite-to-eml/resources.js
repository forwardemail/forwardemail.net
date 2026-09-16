/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'node:path';

const RESOURCE_FOLDERS = {
  contacts: 'Contacts',
  calendars: 'Calendars'
};

function hasTable(database, table) {
  return Boolean(
    database
      .prepare(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
      )
      .get(table)
  );
}

function hasColumn(database, table, column) {
  return database
    .prepare(`PRAGMA table_info(${table})`)
    .all()
    .some((row) => row.name === column);
}

function sanitizeArchiveSegment(value, fallback) {
  const segment = String(value || '')
    .normalize('NFKC')
    // eslint-disable-next-line no-control-regex
    .replaceAll(/[\u0000-\u001F\u007F/\\:]/g, '_')
    .replaceAll(/^\.+|\.+$/g, '')
    .trim()
    .slice(0, 200);

  return segment || fallback;
}

function ensureExtension(value, extension) {
  return value.toLowerCase().endsWith(extension)
    ? value
    : `${value}${extension}`;
}

function getUniquePath(usedPaths, directory, filename) {
  const extension = path.posix.extname(filename);
  const basename = extension ? filename.slice(0, -extension.length) : filename;
  let index = 1;
  let candidate = `${directory}/${filename}`;

  while (usedPaths.has(candidate)) {
    index++;
    candidate = `${directory}/${basename}-${index}${extension}`;
  }

  usedPaths.add(candidate);
  return candidate;
}

function appendDirectory(archive, directory, directories) {
  if (directories.has(directory)) return;
  directories.add(directory);
  archive.append(null, { name: `${directory}/` });
}

function getResourceRows(database, table, query) {
  if (!hasTable(database, table)) return [];
  return database.prepare(query).all();
}

function getActiveCondition(database, table) {
  return hasColumn(database, table, 'deleted_at')
    ? `WHERE ${table}.deleted_at IS NULL`
    : '';
}

// Handles independently optional legacy and current CardDAV and CalDAV tables.
// eslint-disable-next-line complexity
function appendContactsAndCalendarsToArchive({
  archive,
  database,
  onProgress
}) {
  if (!archive || typeof archive.append !== 'function') {
    throw new TypeError('Archive is required');
  }

  if (!database || typeof database.prepare !== 'function') {
    throw new TypeError('Database is required');
  }

  const log = onProgress || (() => {});
  const directories = new Set();
  const usedPaths = new Set();
  const summary = {
    addressBookCount: 0,
    contactCount: 0,
    calendarCount: 0,
    calendarEventCount: 0,
    skippedContactCount: 0,
    skippedCalendarEventCount: 0
  };

  const hasAddressBooks = hasTable(database, 'AddressBooks');
  const hasContacts = hasTable(database, 'Contacts');
  if (hasContacts) {
    const addressBooks = hasAddressBooks
      ? database
          .prepare('SELECT _id, name FROM AddressBooks ORDER BY name, _id')
          .all()
      : [];
    const addressBookDirectories = new Map();
    const usedDirectories = new Set();

    if (addressBooks.length > 0) {
      appendDirectory(archive, RESOURCE_FOLDERS.contacts, directories);
    }

    for (const addressBook of addressBooks) {
      const base = sanitizeArchiveSegment(
        addressBook.name,
        `Address Book ${sanitizeArchiveSegment(addressBook._id, 'Unknown')}`
      );
      let directory = `${RESOURCE_FOLDERS.contacts}/${base}`;
      let index = 1;
      while (usedDirectories.has(directory)) {
        index++;
        directory = `${RESOURCE_FOLDERS.contacts}/${base}-${index}`;
      }

      usedDirectories.add(directory);
      addressBookDirectories.set(addressBook._id, directory);
      appendDirectory(archive, directory, directories);
      summary.addressBookCount++;
    }

    const contacts = getResourceRows(
      database,
      'Contacts',
      `SELECT Contacts._id, Contacts.address_book, Contacts.contact_id, Contacts.uid, Contacts.content
         FROM Contacts
         ${getActiveCondition(database, 'Contacts')}
         ORDER BY Contacts.address_book, Contacts.contact_id, Contacts._id`
    );

    for (const contact of contacts) {
      if (
        typeof contact.content !== 'string' ||
        contact.content.trim() === ''
      ) {
        summary.skippedContactCount++;
        continue;
      }

      let directory = addressBookDirectories.get(contact.address_book);
      if (!directory) {
        directory = `${RESOURCE_FOLDERS.contacts}/Unfiled`;
        appendDirectory(archive, RESOURCE_FOLDERS.contacts, directories);
        appendDirectory(archive, directory, directories);
      }

      const filename = ensureExtension(
        sanitizeArchiveSegment(
          contact.contact_id || contact.uid || contact._id,
          'contact'
        ),
        '.vcf'
      );
      const name = getUniquePath(usedPaths, directory, filename);
      archive.append(contact.content, { name });
      summary.contactCount++;
    }
  }

  const hasCalendars = hasTable(database, 'Calendars');
  const hasCalendarEvents = hasTable(database, 'CalendarEvents');
  if (hasCalendarEvents) {
    const calendars = hasCalendars
      ? database
          .prepare('SELECT _id, name FROM Calendars ORDER BY name, _id')
          .all()
      : [];
    const calendarDirectories = new Map();
    const usedDirectories = new Set();

    if (calendars.length > 0) {
      appendDirectory(archive, RESOURCE_FOLDERS.calendars, directories);
    }

    for (const calendar of calendars) {
      const base = sanitizeArchiveSegment(
        calendar.name,
        `Calendar ${sanitizeArchiveSegment(calendar._id, 'Unknown')}`
      );
      let directory = `${RESOURCE_FOLDERS.calendars}/${base}`;
      let index = 1;
      while (usedDirectories.has(directory)) {
        index++;
        directory = `${RESOURCE_FOLDERS.calendars}/${base}-${index}`;
      }

      usedDirectories.add(directory);
      calendarDirectories.set(calendar._id, directory);
      appendDirectory(archive, directory, directories);
      summary.calendarCount++;
    }

    const calendarEvents = getResourceRows(
      database,
      'CalendarEvents',
      `SELECT CalendarEvents._id, CalendarEvents.calendar, CalendarEvents.eventId, CalendarEvents.ical
         FROM CalendarEvents
         ${getActiveCondition(database, 'CalendarEvents')}
         ORDER BY CalendarEvents.calendar, CalendarEvents.eventId, CalendarEvents._id`
    );

    for (const calendarEvent of calendarEvents) {
      if (
        typeof calendarEvent.ical !== 'string' ||
        calendarEvent.ical.trim() === ''
      ) {
        summary.skippedCalendarEventCount++;
        continue;
      }

      let directory = calendarDirectories.get(calendarEvent.calendar);
      if (!directory) {
        directory = `${RESOURCE_FOLDERS.calendars}/Unfiled`;
        appendDirectory(archive, RESOURCE_FOLDERS.calendars, directories);
        appendDirectory(archive, directory, directories);
      }

      const filename = ensureExtension(
        sanitizeArchiveSegment(
          calendarEvent.eventId || calendarEvent._id,
          'event'
        ),
        '.ics'
      );
      const name = getUniquePath(usedPaths, directory, filename);
      archive.append(calendarEvent.ical, { name });
      summary.calendarEventCount++;
    }
  }

  if (summary.contactCount > 0) {
    log(
      `  Contacts: ${summary.contactCount} in ${summary.addressBookCount} address book(s)`
    );
  }

  if (summary.calendarEventCount > 0) {
    log(
      `  Calendar resources: ${summary.calendarEventCount} in ${summary.calendarCount} calendar(s)`
    );
  }

  return summary;
}

export {
  appendContactsAndCalendarsToArchive,
  ensureExtension,
  getUniquePath,
  sanitizeArchiveSegment
};
