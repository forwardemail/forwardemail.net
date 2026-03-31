/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Deduplicate an array of calendar events by eventId, keeping the
 * most recently updated copy.  This is a safety net for databases
 * that may contain duplicate rows before the unique index backfill
 * has run.
 *
 * @param {Array} events - Array of CalendarEvent documents
 * @returns {Array} Deduplicated array preserving first-seen order
 */
function deduplicateCalendarEvents(events) {
  if (!Array.isArray(events) || events.length === 0) return events;

  const seen = new Map();
  for (const event of events) {
    const key = event.eventId;
    if (!key) continue;
    const prev = seen.get(key);
    if (prev) {
      // Keep the one with the latest updated_at
      const prevTime = prev.updated_at
        ? new Date(prev.updated_at).getTime()
        : 0;
      const currTime = event.updated_at
        ? new Date(event.updated_at).getTime()
        : 0;
      if (currTime > prevTime) {
        seen.set(key, event);
      }
    } else {
      seen.set(key, event);
    }
  }

  return [...seen.values()];
}

module.exports = deduplicateCalendarEvents;
