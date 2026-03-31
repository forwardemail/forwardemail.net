/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Normalize ICS Helper
 *
 * Fixes common non-RFC-5545 issues in ICS data, particularly from
 * Microsoft Exchange / M365 which generates recurring series with
 * detached (moved) instances (RECURRENCE-ID overrides) but omits
 * the corresponding EXDATE on the master VEVENT.
 *
 * Per RFC 5545 Section 3.8.5.1, when a recurrence instance is
 * overridden via RECURRENCE-ID, the original occurrence date should
 * appear as an EXDATE on the master event so that clients don't
 * render both the original and the moved instance.
 *
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.5.1
 */

const ICAL = require('ical.js');

/**
 * Normalize ICS data by adding missing EXDATEs for detached instances.
 *
 * When a VCALENDAR contains multiple VEVENTs with the same UID where
 * some have RECURRENCE-ID (overrides) but the master lacks corresponding
 * EXDATE entries, this function adds the missing EXDATEs.
 *
 * @param {string} icsData - Raw ICS calendar data
 * @returns {string} Normalized ICS data (unchanged if no fixes needed)
 */
function normalizeIcs(icsData) {
  if (!icsData || typeof icsData !== 'string') return icsData;
  if (!icsData.includes('RECURRENCE-ID')) return icsData;

  try {
    const parsed = ICAL.parse(icsData);
    const comp = new ICAL.Component(parsed);
    const vevents = comp.getAllSubcomponents('vevent');

    if (vevents.length < 2) return icsData;

    // Separate master events (no RECURRENCE-ID) from overrides
    const masters = [];
    const overrides = [];

    for (const vevent of vevents) {
      if (vevent.getFirstPropertyValue('recurrence-id')) {
        overrides.push(vevent);
      } else if (
        vevent.getFirstProperty('rrule') ||
        vevent.getFirstProperty('rdate')
      ) {
        masters.push(vevent);
      }
    }

    if (masters.length === 0 || overrides.length === 0) return icsData;

    let modified = false;

    for (const master of masters) {
      const masterUid = master.getFirstPropertyValue('uid');
      if (!masterUid) continue;

      // Collect existing EXDATE values from the master
      const existingExdates = new Set();
      for (const prop of master.getAllProperties('exdate')) {
        const val = prop.getFirstValue();
        if (val) {
          // Normalize to ISO string for comparison
          existingExdates.add(val.toICALString());
        }
      }

      // Find overrides for this master's UID
      for (const override of overrides) {
        const overrideUid = override.getFirstPropertyValue('uid');
        if (overrideUid !== masterUid) continue;

        const recurrenceId = override.getFirstProperty('recurrence-id');
        if (!recurrenceId) continue;

        const recIdValue = recurrenceId.getFirstValue();
        if (!recIdValue) continue;

        const recIdIcs = recIdValue.toICALString();

        // Check if this RECURRENCE-ID date already has an EXDATE
        if (!existingExdates.has(recIdIcs)) {
          // Add the missing EXDATE to the master
          // Preserve the TZID from the RECURRENCE-ID if present
          const exdateProp = new ICAL.Property('exdate');
          const tzid = recurrenceId.getParameter('tzid');
          if (tzid) {
            exdateProp.setParameter('tzid', tzid);
          }

          // Match the value type (DATE vs DATE-TIME)
          const valueType = recurrenceId.getParameter('value');
          if (valueType) {
            exdateProp.setParameter('value', valueType);
          }

          exdateProp.setValue(recIdValue.clone());
          master.addProperty(exdateProp);
          existingExdates.add(recIdIcs);
          modified = true;
        }
      }
    }

    if (!modified) return icsData;

    // Serialize back to ICS
    let result = comp.toString();

    // Ensure CRLF line endings (RFC 5545 Section 3.1)
    result = result.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

    return result;
  } catch {
    // If parsing fails, return the original data unchanged
    return icsData;
  }
}

module.exports = { normalizeIcs };
