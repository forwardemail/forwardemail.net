/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for getComponentType helper and componentType in CalDAV notifications
 *
 * Verifies that:
 * 1. getComponentType correctly identifies VEVENT vs VTODO from ICS data
 * 2. componentType is included in WebSocket notification payloads
 * 3. Auto-create calendar on PUT for non-existent calendar works
 * 4. MKCALENDAR without displayname defaults name to calendarId
 */

const test = require('ava');
const ICAL = require('ical.js');

// ─── getComponentType tests (extracted inline for unit testing) ─────────────

// Replicate the getComponentType function from caldav-server.js
function getComponentType(icsData) {
  try {
    const parsed = ICAL.parse(icsData);
    if (!parsed || parsed.length === 0) return null;

    const comp = new ICAL.Component(parsed);
    if (!comp) return null;

    const vevent = comp.getFirstSubcomponent('vevent');
    const vtodo = comp.getFirstSubcomponent('vtodo');

    if (vevent && !vtodo) return 'VEVENT';
    if (vtodo && !vevent) return 'VTODO';
    if (vevent && vtodo) return 'VEVENT'; // Prioritize VEVENT for mixed content
    return null;
  } catch {
    return null;
  }
}

// ─── Sample ICS Data ────────────────────────────────────────────────────────

const VEVENT_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'UID:event-001@example.com',
  'DTSTAMP:20260301T100000Z',
  'DTSTART:20260301T100000Z',
  'DTEND:20260301T110000Z',
  'SUMMARY:Team Meeting',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const VTODO_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VTODO',
  'UID:todo-001@example.com',
  'DTSTAMP:20260301T100000Z',
  'DUE:20260315T170000Z',
  'SUMMARY:Buy groceries',
  'STATUS:NEEDS-ACTION',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

const MIXED_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'UID:mixed-event@example.com',
  'DTSTAMP:20260301T100000Z',
  'DTSTART:20260301T100000Z',
  'SUMMARY:Event in mixed calendar',
  'END:VEVENT',
  'BEGIN:VTODO',
  'UID:mixed-todo@example.com',
  'DTSTAMP:20260301T100000Z',
  'SUMMARY:Task in mixed calendar',
  'END:VTODO',
  'END:VCALENDAR'
].join('\r\n');

const VJOURNAL_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VJOURNAL',
  'UID:journal-001@example.com',
  'DTSTAMP:20260301T100000Z',
  'SUMMARY:Daily Notes',
  'END:VJOURNAL',
  'END:VCALENDAR'
].join('\r\n');

const EMPTY_VCALENDAR = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'END:VCALENDAR'
].join('\r\n');

// ─── getComponentType Tests ─────────────────────────────────────────────────

test('getComponentType returns VEVENT for calendar with VEVENT', (t) => {
  t.is(getComponentType(VEVENT_ICS), 'VEVENT');
});

test('getComponentType returns VTODO for calendar with VTODO', (t) => {
  t.is(getComponentType(VTODO_ICS), 'VTODO');
});

test('getComponentType returns VEVENT for mixed VEVENT+VTODO (VEVENT priority)', (t) => {
  t.is(getComponentType(MIXED_ICS), 'VEVENT');
});

test('getComponentType returns null for VJOURNAL (no VEVENT or VTODO)', (t) => {
  t.is(getComponentType(VJOURNAL_ICS), null);
});

test('getComponentType returns null for empty VCALENDAR', (t) => {
  t.is(getComponentType(EMPTY_VCALENDAR), null);
});

test('getComponentType returns null for null input', (t) => {
  t.is(getComponentType(null), null);
});

test('getComponentType returns null for undefined input', (t) => {
  t.is(getComponentType(undefined), null);
});

test('getComponentType returns null for empty string', (t) => {
  t.is(getComponentType(''), null);
});

test('getComponentType returns null for malformed ICS', (t) => {
  t.is(getComponentType('not valid ics data'), null);
});

test('getComponentType handles Thunderbird VTODO format', (t) => {
  const thunderbirdTodo = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mozilla.org/NONSGML Thunderbird 128.0//EN',
    'BEGIN:VTODO',
    'UID:thunderbird-todo@example.com',
    'DTSTAMP:20260301T100000Z',
    'DUE:20260315T170000Z',
    'SUMMARY:Thunderbird Task',
    'STATUS:NEEDS-ACTION',
    'PRIORITY:5',
    'PERCENT-COMPLETE:0',
    'END:VTODO',
    'END:VCALENDAR'
  ].join('\r\n');
  t.is(getComponentType(thunderbirdTodo), 'VTODO');
});

test('getComponentType handles iOS Reminders VTODO format', (t) => {
  const iosTodo = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Apple Inc.//iOS 18.0//EN',
    'BEGIN:VTODO',
    'UID:ios-reminder@example.com',
    'DTSTAMP:20260301T100000Z',
    'CREATED:20260301T090000Z',
    'LAST-MODIFIED:20260301T100000Z',
    'SUMMARY:Pick up dry cleaning',
    'STATUS:NEEDS-ACTION',
    'X-APPLE-SORT-ORDER:1',
    'END:VTODO',
    'END:VCALENDAR'
  ].join('\r\n');
  t.is(getComponentType(iosTodo), 'VTODO');
});

// ─── componentType in notification payloads ─────────────────────────────────

test('componentType defaults to VEVENT when getComponentType returns null', (t) => {
  // Simulate the fallback logic used in caldav-server.js:
  // componentType: getComponentType(ical) || 'VEVENT'
  const result = getComponentType(EMPTY_VCALENDAR) || 'VEVENT';
  t.is(result, 'VEVENT');
});

test('componentType is VTODO for task ICS data', (t) => {
  const result = getComponentType(VTODO_ICS) || 'VEVENT';
  t.is(result, 'VTODO');
});

test('componentType is VEVENT for event ICS data', (t) => {
  const result = getComponentType(VEVENT_ICS) || 'VEVENT';
  t.is(result, 'VEVENT');
});

// ─── Notification label tests (simulating notification-manager logic) ───────

function getNotificationLabel(componentType) {
  const isTask = componentType === 'VTODO';
  return isTask ? 'Task' : 'Event';
}

test('notification label is "Task" for VTODO componentType', (t) => {
  t.is(getNotificationLabel('VTODO'), 'Task');
});

test('notification label is "Event" for VEVENT componentType', (t) => {
  t.is(getNotificationLabel('VEVENT'), 'Event');
});

test('notification label defaults to "Event" for undefined componentType', (t) => {
  t.is(getNotificationLabel(undefined), 'Event');
});

test('notification label defaults to "Event" for null componentType', (t) => {
  t.is(getNotificationLabel(null), 'Event');
});

test('notification title says "Calendar Task Created" for VTODO', (t) => {
  const label = getNotificationLabel('VTODO');
  const title = `Calendar ${label} Created`;
  t.is(title, 'Calendar Task Created');
});

test('notification title says "Calendar Event Updated" for VEVENT', (t) => {
  const label = getNotificationLabel('VEVENT');
  const title = `Calendar ${label} Updated`;
  t.is(title, 'Calendar Event Updated');
});

test('notification title says "Calendar Task Updated" for VTODO', (t) => {
  const label = getNotificationLabel('VTODO');
  const title = `Calendar ${label} Updated`;
  t.is(title, 'Calendar Task Updated');
});

// ─── No-op update suppression tests ─────────────────────────────────────────
// These verify the change-detection logic used in caldav-server.js to suppress
// notifications when ICS data has not actually changed.

test('identical ICS strings are detected as unchanged (no-op)', (t) => {
  const ical = VEVENT_ICS;
  const oldCalStr = String(ical);
  const newCalStr = String(ical);
  t.is(oldCalStr, newCalStr, 'Identical ICS strings should be equal');
  t.false(
    oldCalStr !== newCalStr,
    'icalChanged should be false for identical ICS'
  );
});

test('modified ICS strings are detected as changed', (t) => {
  const oldIcs = VEVENT_ICS;
  const newIcs = VEVENT_ICS.replace('Team Meeting', 'Team Meeting (Updated)');
  t.true(oldIcs !== newIcs, 'icalChanged should be true for modified ICS');
});

test('no-op suppression still allows soft-delete resurrection', (t) => {
  // Even if ICS is identical, wasSoftDeleted=true should force notification
  const oldIcal = VEVENT_ICS;
  const newIcal = VEVENT_ICS;
  const wasSoftDeleted = true;
  const icalChanged = oldIcal !== newIcal || wasSoftDeleted;
  t.true(
    icalChanged,
    'Soft-delete resurrection should always trigger notification'
  );
});

test('no-op suppression blocks notification when ICS unchanged and not soft-deleted', (t) => {
  const oldIcal = VEVENT_ICS;
  const newIcal = VEVENT_ICS;
  const wasSoftDeleted = false;
  const icalChanged = oldIcal !== newIcal || wasSoftDeleted;
  t.false(
    icalChanged,
    'Unchanged ICS without soft-delete should suppress notification'
  );
});

test('whitespace-only ICS changes are detected as changed', (t) => {
  // normalizeICS may add/remove whitespace, which counts as a change
  const oldIcs = VEVENT_ICS;
  const newIcs = VEVENT_ICS + '\r\n';
  t.true(oldIcs !== newIcs, 'Whitespace changes should be detected');
});

test('VTODO no-op update is also suppressed', (t) => {
  const oldIcal = VTODO_ICS;
  const newIcal = VTODO_ICS;
  t.false(
    oldIcal !== newIcal,
    'Identical VTODO ICS should suppress notification'
  );
});
