/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for helpers/stamp-ics.js — ensureICSTimestamps()
 *
 * Verifies that the read-path timestamp healing function correctly
 * updates stale DTSTAMP / LAST-MODIFIED using the record's updated_at,
 * preserves newer timestamps, handles edge cases, and works with both
 * VEVENT and VTODO components.
 *
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.7.2
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.7.3
 */

const test = require('ava');
const ICAL = require('ical.js');
const { ensureICSTimestamps } = require('#helpers/stamp-ics');

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

const STALE_VEVENT_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'DTSTART:20250101T100000Z',
  'DTEND:20250101T110000Z',
  'DTSTAMP:20240101T000000Z',
  'LAST-MODIFIED:20240101T000000Z',
  'SUMMARY:Stale Event',
  'UID:stale-vevent-1@test',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const STALE_VTODO_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VTODO',
  'DTSTART:20250601T090000Z',
  'DUE:20250601T170000Z',
  'DTSTAMP:20240101T000000Z',
  'LAST-MODIFIED:20240101T000000Z',
  'SUMMARY:Stale Task',
  'UID:stale-vtodo-1@test',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

const FRESH_VEVENT_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'DTSTART:20250101T100000Z',
  'DTEND:20250101T110000Z',
  'DTSTAMP:20260101T000000Z',
  'LAST-MODIFIED:20260101T000000Z',
  'SUMMARY:Fresh Event',
  'UID:fresh-vevent-1@test',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const NO_TIMESTAMPS_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'DTSTART:20250101T100000Z',
  'DTEND:20250101T110000Z',
  'SUMMARY:No Timestamps',
  'UID:no-ts-1@test',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const MULTI_COMPONENT_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'DTSTART:20250101T100000Z',
  'DTEND:20250101T110000Z',
  'DTSTAMP:20240101T000000Z',
  'LAST-MODIFIED:20240101T000000Z',
  'SUMMARY:Event One',
  'UID:multi-1@test',
  'END:VEVENT',
  'BEGIN:VTODO',
  'DTSTART:20250601T090000Z',
  'DUE:20250601T170000Z',
  'DTSTAMP:20240601T000000Z',
  'LAST-MODIFIED:20240601T000000Z',
  'SUMMARY:Task One',
  'UID:multi-2@test',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

// ─── Helper ──────────────────────────────────────────────────────────────────

function getTimestamps(icsData, componentType) {
  const comp = new ICAL.Component(ICAL.parse(icsData));
  const sub = comp.getFirstSubcomponent(componentType);
  if (!sub) return null;
  const dtstamp = sub.getFirstPropertyValue('dtstamp');
  const lastMod = sub.getFirstPropertyValue('last-modified');
  return {
    dtstamp: dtstamp ? dtstamp.toJSDate().toISOString() : null,
    lastModified: lastMod ? lastMod.toJSDate().toISOString() : null
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test('heals stale DTSTAMP and LAST-MODIFIED on VEVENT', (t) => {
  const updatedAt = new Date('2025-06-15T12:00:00Z');
  const result = ensureICSTimestamps(STALE_VEVENT_ICS, updatedAt);

  const ts = getTimestamps(result, 'vevent');
  t.is(ts.dtstamp, '2025-06-15T12:00:00.000Z');
  t.is(ts.lastModified, '2025-06-15T12:00:00.000Z');
});

test('heals stale DTSTAMP and LAST-MODIFIED on VTODO', (t) => {
  const updatedAt = new Date('2025-06-15T12:00:00Z');
  const result = ensureICSTimestamps(STALE_VTODO_ICS, updatedAt);

  const ts = getTimestamps(result, 'vtodo');
  t.is(ts.dtstamp, '2025-06-15T12:00:00.000Z');
  t.is(ts.lastModified, '2025-06-15T12:00:00.000Z');
});

test('preserves newer timestamps (does not downgrade)', (t) => {
  const updatedAt = new Date('2025-06-15T12:00:00Z');
  const result = ensureICSTimestamps(FRESH_VEVENT_ICS, updatedAt);

  const ts = getTimestamps(result, 'vevent');
  // Timestamps are 2026-01-01, which is newer than 2025-06-15
  t.is(ts.dtstamp, '2026-01-01T00:00:00.000Z');
  t.is(ts.lastModified, '2026-01-01T00:00:00.000Z');
});

test('adds timestamps when DTSTAMP and LAST-MODIFIED are missing', (t) => {
  const updatedAt = new Date('2025-06-15T12:00:00Z');
  const result = ensureICSTimestamps(NO_TIMESTAMPS_ICS, updatedAt);

  const ts = getTimestamps(result, 'vevent');
  // Missing timestamps have effective time 0 (epoch), so they should be updated
  t.is(ts.dtstamp, '2025-06-15T12:00:00.000Z');
  t.is(ts.lastModified, '2025-06-15T12:00:00.000Z');
});

test('heals all components in multi-component ICS', (t) => {
  const updatedAt = new Date('2025-09-01T00:00:00Z');
  const result = ensureICSTimestamps(MULTI_COMPONENT_ICS, updatedAt);

  const veventTs = getTimestamps(result, 'vevent');
  t.is(veventTs.dtstamp, '2025-09-01T00:00:00.000Z');
  t.is(veventTs.lastModified, '2025-09-01T00:00:00.000Z');

  const vtodoTs = getTimestamps(result, 'vtodo');
  t.is(vtodoTs.dtstamp, '2025-09-01T00:00:00.000Z');
  t.is(vtodoTs.lastModified, '2025-09-01T00:00:00.000Z');
});

test('accepts updatedAt as ISO string', (t) => {
  const result = ensureICSTimestamps(STALE_VEVENT_ICS, '2025-06-15T12:00:00Z');

  const ts = getTimestamps(result, 'vevent');
  t.is(ts.dtstamp, '2025-06-15T12:00:00.000Z');
  t.is(ts.lastModified, '2025-06-15T12:00:00.000Z');
});

test('returns original data for null/undefined input', (t) => {
  t.is(ensureICSTimestamps(null, new Date()), null);
  t.is(ensureICSTimestamps(undefined, new Date()), undefined);
  t.is(ensureICSTimestamps('', new Date()), '');
});

test('returns original data when updatedAt is null/undefined', (t) => {
  t.is(ensureICSTimestamps(STALE_VEVENT_ICS, null), STALE_VEVENT_ICS);
  t.is(ensureICSTimestamps(STALE_VEVENT_ICS, undefined), STALE_VEVENT_ICS);
});

test('returns original data for non-string input', (t) => {
  t.is(ensureICSTimestamps(42, new Date()), 42);
  const obj = {};
  t.is(ensureICSTimestamps(obj, new Date()), obj);
});

test('returns original data for malformed ICS', (t) => {
  const malformed = 'this is not valid ICS data';
  t.is(ensureICSTimestamps(malformed, new Date()), malformed);
});

test('returns original data for ICS with no VEVENT or VTODO', (t) => {
  const calOnly = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'END:VCALENDAR'
  ].join('\r\n');
  t.is(ensureICSTimestamps(calOnly, new Date()), calOnly);
});

test('is deterministic — same updatedAt produces same output', (t) => {
  const updatedAt = new Date('2025-06-15T12:00:00Z');
  const result1 = ensureICSTimestamps(STALE_VEVENT_ICS, updatedAt);
  const result2 = ensureICSTimestamps(STALE_VEVENT_ICS, updatedAt);
  t.is(result1, result2);
});

test('output is valid ICS parseable by ical.js', (t) => {
  const updatedAt = new Date('2025-06-15T12:00:00Z');
  const result = ensureICSTimestamps(STALE_VEVENT_ICS, updatedAt);

  t.notThrows(() => {
    const parsed = ICAL.parse(result);
    const comp = new ICAL.Component(parsed);
    t.truthy(comp.getFirstSubcomponent('vevent'));
  });
});
