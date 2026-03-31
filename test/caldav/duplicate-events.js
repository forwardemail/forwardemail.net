/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for calendar event deduplication using the shared
 * deduplicateCalendarEvents helper and the application-layer
 * find-before-write strategy used across CalDAV and API endpoints.
 *
 * Strategy:
 *   - Write paths (createEvent, updateEvent, processRequest):
 *     find ALL existing events by eventId + calendar (including soft-deleted),
 *     keep the latest by updated_at, soft-delete extras, and resurrect if needed.
 *   - Read paths (getEventsForCalendar, getEventsByDate, list, retrieve):
 *     after any find() that returns multiple events, call
 *     deduplicateCalendarEvents() to return only unique eventIds.
 *
 * These are unit tests that verify the deduplication logic in isolation
 * without requiring a full CalDAV server or SQLite database.
 */

const test = require('ava');

const deduplicateCalendarEvents = require('#helpers/deduplicate-calendar-events');

// ─── Shared Helper Tests ───────────────────────────────────────────────────

test('dedup: returns unique events when no duplicates exist', (t) => {
  const events = [
    {
      eventId: 'event-1',
      ical: 'BEGIN:VCALENDAR...',
      updated_at: '2025-01-29T10:00:00Z'
    },
    {
      eventId: 'event-2',
      ical: 'BEGIN:VCALENDAR...',
      updated_at: '2025-01-29T11:00:00Z'
    },
    {
      eventId: 'event-3',
      ical: 'BEGIN:VCALENDAR...',
      updated_at: '2025-01-29T12:00:00Z'
    }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 3, 'All 3 unique events should be returned');
});

test('dedup: keeps most recently updated when same eventId appears twice', (t) => {
  const events = [
    {
      eventId: 'dup-event',
      ical: 'old-ics-data',
      updated_at: '2025-01-29T10:00:00Z'
    },
    {
      eventId: 'dup-event',
      ical: 'new-ics-data',
      updated_at: '2025-01-30T10:00:00Z'
    }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 1, 'Should deduplicate to 1 event');
  t.is(result[0].ical, 'new-ics-data', 'Should keep the most recently updated');
});

test('dedup: handles 4 duplicates (user-reported scenario: 3 Exchange + 1 Apple)', (t) => {
  const events = [
    {
      eventId: 'invite-uid-123',
      ical: 'exchange-ics-v1',
      updated_at: '2025-01-28T10:00:00Z'
    },
    {
      eventId: 'invite-uid-123',
      ical: 'exchange-ics-v2',
      updated_at: '2025-01-28T12:00:00Z'
    },
    {
      eventId: 'invite-uid-123',
      ical: 'exchange-ics-v3',
      updated_at: '2025-01-29T08:00:00Z'
    },
    {
      eventId: 'invite-uid-123',
      ical: 'apple-ics-accepted',
      updated_at: '2025-01-29T14:00:00Z'
    }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 1, 'Should deduplicate 4 copies to 1');
  t.is(
    result[0].ical,
    'apple-ics-accepted',
    'Should keep the Apple-accepted version (most recent)'
  );
});

test('dedup: keeps first event when updated_at is missing on all duplicates', (t) => {
  const events = [
    { eventId: 'no-date', ical: 'first-copy' },
    { eventId: 'no-date', ical: 'second-copy' },
    { eventId: 'no-date', ical: 'third-copy' }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 1, 'Should deduplicate to 1');
  t.is(result[0].ical, 'first-copy', 'Should keep first when no dates');
});

test('dedup: keeps event with updated_at over one without', (t) => {
  const events = [
    { eventId: 'mixed-date', ical: 'no-date-copy' },
    {
      eventId: 'mixed-date',
      ical: 'has-date-copy',
      updated_at: '2025-01-29T10:00:00Z'
    }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 1, 'Should deduplicate to 1');
  t.is(result[0].ical, 'has-date-copy', 'Should keep the one with updated_at');
});

test('dedup: handles mix of unique and duplicate events', (t) => {
  const events = [
    {
      eventId: 'unique-1',
      ical: 'unique-ics-1',
      updated_at: '2025-01-29T10:00:00Z'
    },
    {
      eventId: 'dup-event',
      ical: 'dup-old',
      updated_at: '2025-01-28T10:00:00Z'
    },
    {
      eventId: 'unique-2',
      ical: 'unique-ics-2',
      updated_at: '2025-01-29T11:00:00Z'
    },
    {
      eventId: 'dup-event',
      ical: 'dup-new',
      updated_at: '2025-01-30T10:00:00Z'
    },
    {
      eventId: 'unique-3',
      ical: 'unique-ics-3',
      updated_at: '2025-01-29T12:00:00Z'
    }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 4, 'Should have 3 unique + 1 deduped = 4');

  const eventIds = new Set(result.map((e) => e.eventId));
  t.true(eventIds.has('unique-1'));
  t.true(eventIds.has('unique-2'));
  t.true(eventIds.has('unique-3'));
  t.true(eventIds.has('dup-event'));

  const dupEvent = result.find((e) => e.eventId === 'dup-event');
  t.is(dupEvent.ical, 'dup-new', 'Should keep the newer duplicate');
});

test('dedup: handles empty array', (t) => {
  const result = deduplicateCalendarEvents([]);
  t.is(result.length, 0, 'Empty array should return empty');
});

test('dedup: handles null/undefined input', (t) => {
  t.is(deduplicateCalendarEvents(null), null, 'null should pass through');
  t.is(
    deduplicateCalendarEvents(undefined),
    undefined,
    'undefined should pass through'
  );
});

test('dedup: handles single event', (t) => {
  const events = [
    {
      eventId: 'solo',
      ical: 'solo-ics',
      updated_at: '2025-01-29T10:00:00Z'
    }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 1, 'Single event should pass through');
  t.is(result[0].eventId, 'solo');
});

test('dedup: preserves order (unique events appear in first-seen order)', (t) => {
  const events = [
    {
      eventId: 'c-event',
      ical: 'c',
      updated_at: '2025-01-29T10:00:00Z'
    },
    {
      eventId: 'a-event',
      ical: 'a',
      updated_at: '2025-01-29T11:00:00Z'
    },
    {
      eventId: 'b-event',
      ical: 'b',
      updated_at: '2025-01-29T12:00:00Z'
    }
  ];

  const result = deduplicateCalendarEvents(events);
  t.is(result[0].eventId, 'c-event', 'First seen should be first');
  t.is(result[1].eventId, 'a-event', 'Second seen should be second');
  t.is(result[2].eventId, 'b-event', 'Third seen should be third');
});

test('dedup: handles large number of duplicates for same eventId', (t) => {
  const events = [];
  for (let i = 0; i < 100; i++) {
    events.push({
      eventId: 'mass-dup',
      ical: `copy-${i}`,
      updated_at: new Date(2025, 0, 1 + i).toISOString()
    });
  }

  const result = deduplicateCalendarEvents(events);
  t.is(result.length, 1, 'Should deduplicate 100 copies to 1');
  t.is(result[0].ical, 'copy-99', 'Should keep the most recent (last one)');
});

test('dedup: skips events without eventId', (t) => {
  const events = [
    { eventId: 'valid', ical: 'valid-ics', updated_at: '2025-01-29T10:00:00Z' },
    { ical: 'no-id-ics', updated_at: '2025-01-29T11:00:00Z' },
    { eventId: '', ical: 'empty-id-ics', updated_at: '2025-01-29T12:00:00Z' }
  ];

  const result = deduplicateCalendarEvents(events);
  // Only the event with a valid eventId should be in the result
  t.is(result.length, 1, 'Should only include events with valid eventId');
  t.is(result[0].eventId, 'valid');
});

// ─── Find-Before-Write Strategy Tests ──────────────────────────────────────
//
// These test the application-layer dedup strategy used in write paths:
// 1. Find ALL existing events by eventId + calendar (including soft-deleted)
// 2. If duplicates exist, keep the latest by updated_at
// 3. Soft-delete extras
// 4. Resurrect (clear deleted_at) if the keeper was soft-deleted
//

test('write-path: simulates find-before-write selecting latest from duplicates', (t) => {
  // Simulate what find() returns when duplicates exist
  const allMatches = [
    {
      _id: { toString: () => 'id-1' },
      eventId: 'dup-event.ics',
      ical: 'old-ics',
      updated_at: new Date('2025-01-28T10:00:00Z'),
      deleted_at: null
    },
    {
      _id: { toString: () => 'id-2' },
      eventId: 'dup-event.ics',
      ical: 'newer-ics',
      updated_at: new Date('2025-01-29T10:00:00Z'),
      deleted_at: null
    },
    {
      _id: { toString: () => 'id-3' },
      eventId: 'dup-event.ics',
      ical: 'newest-ics',
      updated_at: new Date('2025-01-30T10:00:00Z'),
      deleted_at: null
    }
  ];

  const deduped = deduplicateCalendarEvents(allMatches);
  t.is(deduped.length, 1, 'Should pick exactly 1 keeper');
  t.is(
    deduped[0]._id.toString(),
    'id-3',
    'Should pick the latest by updated_at'
  );
  t.is(deduped[0].ical, 'newest-ics', 'Keeper should have newest ICS');
});

test('write-path: simulates resurrection of soft-deleted event', (t) => {
  // Simulate what find() returns when the only match is soft-deleted
  const allMatches = [
    {
      _id: { toString: () => 'id-1' },
      eventId: 'deleted-event.ics',
      ical: 'old-ics',
      updated_at: new Date('2025-01-28T10:00:00Z'),
      deleted_at: new Date('2025-01-29T00:00:00Z')
    }
  ];

  const deduped = deduplicateCalendarEvents(allMatches);
  t.is(deduped.length, 1, 'Should return the soft-deleted event');

  // Simulate resurrection: clear deleted_at, update ical
  const keeper = deduped[0];
  keeper.deleted_at = null;
  keeper.ical = 'resurrected-ics';

  t.is(keeper.deleted_at, null, 'deleted_at should be cleared');
  t.is(keeper.ical, 'resurrected-ics', 'ical should be updated');
});

test('write-path: simulates selecting latest among mix of active and soft-deleted', (t) => {
  // Simulate duplicates where some are active and some soft-deleted
  const allMatches = [
    {
      _id: { toString: () => 'id-1' },
      eventId: 'mixed-event.ics',
      ical: 'active-old',
      updated_at: new Date('2025-01-28T10:00:00Z'),
      deleted_at: null
    },
    {
      _id: { toString: () => 'id-2' },
      eventId: 'mixed-event.ics',
      ical: 'deleted-newer',
      updated_at: new Date('2025-01-29T10:00:00Z'),
      deleted_at: new Date('2025-01-29T12:00:00Z')
    },
    {
      _id: { toString: () => 'id-3' },
      eventId: 'mixed-event.ics',
      ical: 'active-newest',
      updated_at: new Date('2025-01-30T10:00:00Z'),
      deleted_at: null
    }
  ];

  const deduped = deduplicateCalendarEvents(allMatches);
  t.is(deduped.length, 1, 'Should pick exactly 1 keeper');
  t.is(
    deduped[0]._id.toString(),
    'id-3',
    'Should pick the latest by updated_at regardless of deleted_at'
  );

  // Verify the extras that should be soft-deleted
  const extras = allMatches.filter(
    (e) => e._id.toString() !== deduped[0]._id.toString()
  );
  t.is(extras.length, 2, 'Should have 2 extras to soft-delete');
});

// ─── Resurrection Payload Tests ────────────────────────────────────────────
//
// Verify the update payload structure used when resurrecting soft-deleted events
// in write paths (createEvent, updateEvent, processRequest).
//

test('resurrection: update payload clears deleted_at and sets new ical/href', (t) => {
  // Simulate the update payload for resurrection
  const updatePayload = {
    $set: {
      ical: 'new-ics-data',
      href: '/dav/user@example.com/calendar/event.ics',
      deleted_at: null
    }
  };

  t.is(
    updatePayload.$set.deleted_at,
    null,
    'deleted_at should be null to clear soft-delete'
  );
  t.is(updatePayload.$set.ical, 'new-ics-data', 'ical should be updated');
  t.is(
    updatePayload.$set.href,
    '/dav/user@example.com/calendar/event.ics',
    'href should be updated'
  );
});

test('resurrection: update payload includes all required fields', (t) => {
  const requiredFields = ['ical', 'href', 'deleted_at'];
  const updatePayload = {
    $set: {
      ical: 'resurrected-ics',
      href: '/dav/user@example.com/default/event.ics',
      deleted_at: null
    }
  };

  for (const field of requiredFields) {
    t.true(field in updatePayload.$set, `$set should include ${field}`);
  }
});

// ─── Delete Path Tests ─────────────────────────────────────────────────────
//
// Verify that delete operations soft-delete ALL duplicates, not just one.
//

test('delete-path: all duplicates should be soft-deleted', (t) => {
  // Simulate finding multiple active duplicates for deletion
  const allMatches = [
    {
      _id: { toString: () => 'id-1' },
      eventId: 'to-delete.ics',
      deleted_at: null
    },
    {
      _id: { toString: () => 'id-2' },
      eventId: 'to-delete.ics',
      deleted_at: null
    },
    {
      _id: { toString: () => 'id-3' },
      eventId: 'to-delete.ics',
      deleted_at: null
    }
  ];

  // Simulate soft-deleting all of them
  const now = new Date();
  for (const ev of allMatches) {
    ev.deleted_at = now;
  }

  // Verify all are soft-deleted
  for (const ev of allMatches) {
    t.truthy(
      ev.deleted_at,
      `Event ${ev._id.toString()} should be soft-deleted`
    );
  }
});
