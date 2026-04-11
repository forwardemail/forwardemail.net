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
 * to the current UTC time.
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

module.exports = { stampICS };
