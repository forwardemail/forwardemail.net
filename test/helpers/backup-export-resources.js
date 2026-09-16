/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const ROOT = path.join(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

test('production EML and MBOX backups include portable contacts and calendars', (t) => {
  const worker = read('helpers/worker.js');
  const archiveSwitchStart = worker.indexOf(
    '// create a password protected zip file in-memory using streams'
  );
  const mboxStart = worker.indexOf("case 'mbox':", archiveSwitchStart);
  const emlStart = worker.indexOf("case 'eml':", mboxStart);
  const emlEnd = worker.indexOf('// No default', emlStart);

  t.true(
    worker.includes(
      "require('#helpers/append-contacts-and-calendars-to-archive')"
    )
  );
  t.true(mboxStart > -1);
  t.true(emlStart > mboxStart);
  t.true(
    worker
      .slice(mboxStart, emlStart)
      .includes('appendContactsAndCalendarsToArchive({')
  );
  t.true(
    worker
      .slice(emlStart, emlEnd)
      .includes('appendContactsAndCalendarsToArchive({')
  );
  const mbox = worker.slice(mboxStart, emlStart);
  const eml = worker.slice(emlStart, emlEnd);
  for (const source of [mbox, eml]) {
    t.true(source.includes('Contacts: ${'));
    t.true(source.includes('resourceSummary.contactCount'));
    t.true(source.includes('Calendar resources: ${'));
    t.true(source.includes('resourceSummary.calendarEventCount'));
  }
});

test('internal SQLite conversion includes portable contacts and calendars', (t) => {
  const script = read('scripts/convert-sqlite-to-eml.js');

  t.true(
    script.includes(
      "require('#helpers/append-contacts-and-calendars-to-archive')"
    )
  );
  t.true(script.includes('appendContactsAndCalendarsToArchive({'));
  t.true(script.includes('Contacts: ${'));
  t.true(script.includes('resourceSummary.contactCount'));
  t.true(script.includes('Calendar resources: ${'));
  t.true(script.includes('resourceSummary.calendarEventCount'));
});

test('SQLite format remains the encrypted database snapshot', (t) => {
  const worker = read('helpers/worker.js');
  const mboxStart = worker.lastIndexOf("case 'mbox':");
  const sqliteStart = worker.lastIndexOf("case 'sqlite':", mboxStart);

  t.true(sqliteStart > -1);
  t.true(mboxStart > sqliteStart);
  t.true(worker.slice(sqliteStart, mboxStart).includes('VACUUM INTO'));
  t.false(
    worker
      .slice(sqliteStart, mboxStart)
      .includes('appendContactsAndCalendarsToArchive({')
  );
});
