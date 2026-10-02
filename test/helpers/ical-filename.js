/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  parseContentDispositionFilename,
  quoteICSFilenames
} = require('#helpers/ical-filename');

// =============================================================================
// parseContentDispositionFilename
// =============================================================================

test('parseContentDispositionFilename: returns "attachment" for empty input', (t) => {
  t.is(parseContentDispositionFilename(''), 'attachment');
  t.is(parseContentDispositionFilename(null), 'attachment');
  t.is(parseContentDispositionFilename(undefined), 'attachment');
});

test('parseContentDispositionFilename: parses quoted filename without spaces', (t) => {
  t.is(
    parseContentDispositionFilename('attachment; filename="report.pdf"'),
    'report.pdf'
  );
});

test('parseContentDispositionFilename: parses quoted filename with spaces', (t) => {
  t.is(
    parseContentDispositionFilename('attachment; filename="Arch Tickets.pdf"'),
    'Arch Tickets.pdf'
  );
});

test('parseContentDispositionFilename: parses quoted filename with multiple spaces', (t) => {
  t.is(
    parseContentDispositionFilename(
      'attachment; filename="My Important Document Draft.pdf"'
    ),
    'My Important Document Draft.pdf'
  );
});

test('parseContentDispositionFilename: parses RFC 5987 filename* with percent-encoded spaces', (t) => {
  t.is(
    parseContentDispositionFilename(
      "attachment; filename*=UTF-8''Arch%20Tickets.pdf"
    ),
    'Arch Tickets.pdf'
  );
});

test('parseContentDispositionFilename: parses unquoted filename without spaces', (t) => {
  t.is(
    parseContentDispositionFilename('attachment; filename=report.pdf'),
    'report.pdf'
  );
});

test('parseContentDispositionFilename: prefers filename* over filename', (t) => {
  t.is(
    parseContentDispositionFilename(
      'attachment; filename="fallback.pdf"; filename*=UTF-8\'\'Arch%20Tickets.pdf'
    ),
    'Arch Tickets.pdf'
  );
});

// =============================================================================
// quoteICSFilenames
// =============================================================================

test('quoteICSFilenames: quotes FILENAME with spaces', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'ATTACH;FILENAME=Arch Tickets.pdf;ENCODING=BASE64;VALUE=BINARY:AAAA',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = quoteICSFilenames(ics);
  t.true(
    result.includes('FILENAME="Arch Tickets.pdf"'),
    'FILENAME should be double-quoted'
  );
  t.false(
    result.includes('FILENAME=Arch Tickets.pdf'),
    'unquoted FILENAME with spaces should not remain'
  );
});

test('quoteICSFilenames: does not alter already-quoted FILENAME', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'ATTACH;FILENAME="Already Quoted.pdf";ENCODING=BASE64;VALUE=BINARY:AAAA',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = quoteICSFilenames(ics);
  t.true(
    result.includes('FILENAME="Already Quoted.pdf"'),
    'already-quoted FILENAME should be preserved'
  );
});

test('quoteICSFilenames: does not alter FILENAME without spaces', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'ATTACH;FILENAME=simple.pdf;ENCODING=BASE64;VALUE=BINARY:AAAA',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = quoteICSFilenames(ics);
  t.true(
    result.includes('FILENAME=simple.pdf'),
    'FILENAME without spaces should remain unquoted'
  );
});

test('quoteICSFilenames: handles multiple ATTACH properties', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'ATTACH;FILENAME=Arch Tickets.pdf;ENCODING=BASE64;VALUE=BINARY:AAAA',
    'ATTACH;FILENAME=My Doc Draft.pdf;ENCODING=BASE64;VALUE=BINARY:BBBB',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = quoteICSFilenames(ics);
  t.true(result.includes('FILENAME="Arch Tickets.pdf"'));
  t.true(result.includes('FILENAME="My Doc Draft.pdf"'));
});

test('quoteICSFilenames: handles folded lines containing FILENAME with spaces', (t) => {
  // Simulate a long line that was folded mid-FILENAME
  const longLine =
    'ATTACH;FILENAME=Arch Tickets.pdf;ENCODING=BASE64;VALUE=BINARY:' +
    'A'.repeat(100);
  // Fold at 75 octets
  const folded =
    longLine.slice(0, 75) +
    '\r\n ' +
    longLine.slice(75, 149) +
    '\r\n ' +
    longLine.slice(149);

  const ics = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    folded,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = quoteICSFilenames(ics);
  // After unfolding and re-quoting, FILENAME should be quoted
  t.true(
    result.includes('FILENAME="Arch Tickets.pdf"'),
    'FILENAME should be quoted even when original was folded'
  );
});

test('quoteICSFilenames: passes through ICS without FILENAME unchanged', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'SUMMARY:Test Event',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const result = quoteICSFilenames(ics);
  t.true(result.includes('SUMMARY:Test Event'));
});

test('a long run of unquoted FILENAME values is handled quickly', (t) => {
  // (a pattern requiring a space inside the value backtracked over this)
  const start = Date.now();
  quoteICSFilenames(`ATTACH;${'filename=a'.repeat(32_000)};:x`);
  t.true(Date.now() - start < 500);
});

test('a malformed filename* escape does not throw', (t) => {
  t.is(
    parseContentDispositionFilename("attachment; filename*=UTF-8''%E0%A4%A"),
    '%E0%A4%A'
  );
  t.is(
    parseContentDispositionFilename(
      "attachment; filename*=UTF-8''a%0D%0Ab.pdf"
    ),
    'ab.pdf'
  );
  t.is(
    parseContentDispositionFilename(
      "attachment; filename*=UTF-8''Arch%20Tickets.pdf"
    ),
    'Arch Tickets.pdf'
  );
});
