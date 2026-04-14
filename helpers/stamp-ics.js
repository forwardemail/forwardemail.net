/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Stamp ICS Helper
 *
 * Updates DTSTAMP and LAST-MODIFIED properties in VEVENT/VTODO
 * components to the current UTC time.
 *
 * CalDAV clients (Apple Calendar, iOS Reminders) rely on DTSTAMP and
 * LAST-MODIFIED inside the ICS to decide whether their cached copy is
 * stale.  When events are created or updated via the REST API (as
 * opposed to CalDAV PUT, where the client sets these correctly), the
 * caller may supply ICS with outdated timestamps.  Without stamping,
 * a subsequent CalDAV sync delivers the event with old timestamps and
 * the client silently ignores the update.
 *
 * RFC 5545 Section 3.8.7.2 (DTSTAMP):
 *   "In the case of an iCalendar object that specifies a METHOD
 *    property, this property specifies the date and time that the
 *    instance of the iCalendar object was created."
 *
 * RFC 5545 Section 3.8.7.3 (LAST-MODIFIED):
 *   "This property specifies the date and time that the information
 *    associated with the calendar component was last revised."
 *
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.7.2
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.7.3
 */

const ICAL = require('ical.js');

/**
 * Update DTSTAMP and LAST-MODIFIED in all VEVENT and VTODO components
 * to the current UTC time.  Used on the **write path** (API create/update).
 *
 * @param {string} icsData - Raw ICS calendar data
 * @param {Date}   [now]   - Optional timestamp (defaults to current time)
 * @returns {string} ICS data with updated timestamps
 */
function stampICS(icsData, now) {
  if (!icsData || typeof icsData !== 'string') return icsData;

  try {
    const parsed = ICAL.parse(icsData);
    const comp = new ICAL.Component(parsed);

    const stamp = ICAL.Time.fromJSDate(now || new Date(), true); // UTC

    const components = [
      ...comp.getAllSubcomponents('vevent'),
      ...comp.getAllSubcomponents('vtodo')
    ];

    if (components.length === 0) return icsData;

    for (const sub of components) {
      // Update DTSTAMP (required by RFC 5545 for VEVENT/VTODO)
      sub.updatePropertyWithValue('dtstamp', stamp);

      // Update LAST-MODIFIED so CalDAV clients see the change
      sub.updatePropertyWithValue('last-modified', stamp);
    }

    // Serialize back; caller is responsible for CRLF normalization
    return comp.toString();
  } catch {
    // If parsing fails, return the original data unchanged
    return icsData;
  }
}

/**
 * Ensure DTSTAMP and LAST-MODIFIED are consistent with the record's
 * `updated_at` timestamp.  Used on the **read path** (CalDAV GET/REPORT,
 * API retrieve) to heal existing records that were stored with stale
 * or missing ICS-level timestamps.
 *
 * Unlike `stampICS()` (which always sets "now"), this function uses
 * the authoritative `updated_at` from the database record so that:
 *   - Existing stale records get corrected timestamps on read
 *   - Timestamps are deterministic (same updated_at → same output)
 *   - CalDAV clients see LAST-MODIFIED that matches the actual
 *     modification time, not the time the response was generated
 *
 * @param {string} icsData   - Raw ICS calendar data
 * @param {Date}   updatedAt - The record's updated_at timestamp
 * @returns {string} ICS data with corrected timestamps
 */
function ensureICSTimestamps(icsData, updatedAt) {
  if (!icsData || typeof icsData !== 'string') return icsData;
  if (!updatedAt) return icsData;

  try {
    const parsed = ICAL.parse(icsData);
    const comp = new ICAL.Component(parsed);

    const stamp = ICAL.Time.fromJSDate(
      updatedAt instanceof Date ? updatedAt : new Date(updatedAt),
      true // UTC
    );

    const components = [
      ...comp.getAllSubcomponents('vevent'),
      ...comp.getAllSubcomponents('vtodo')
    ];

    if (components.length === 0) return icsData;

    let modified = false;

    for (const sub of components) {
      const existingDtstamp = sub.getFirstPropertyValue('dtstamp');
      const existingLastMod = sub.getFirstPropertyValue('last-modified');

      // Only update if the existing value is older than updated_at.
      // This avoids overwriting correctly-stamped records from CalDAV PUT.
      const stampMs = stamp.toJSDate().getTime();

      const dtstampMs = existingDtstamp
        ? existingDtstamp.toJSDate().getTime()
        : 0;
      const lastModMs = existingLastMod
        ? existingLastMod.toJSDate().getTime()
        : 0;

      if (dtstampMs < stampMs) {
        sub.updatePropertyWithValue('dtstamp', stamp);
        modified = true;
      }

      if (lastModMs < stampMs) {
        sub.updatePropertyWithValue('last-modified', stamp);
        modified = true;
      }
    }

    if (!modified) return icsData;

    return comp.toString();
  } catch {
    return icsData;
  }
}

module.exports = { stampICS, ensureICSTimestamps };
