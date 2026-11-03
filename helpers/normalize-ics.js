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
const { ensureVTimezones } = require('#helpers/generate-vtimezone');

// (far more than any calendar has overrides)
const MAX_ADDED_EXDATES = 10_000;

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
    const vevents = [
      ...comp.getAllSubcomponents('vevent'),
      ...comp.getAllSubcomponents('vtodo')
    ];

    if (vevents.length < 2) return icsData;

    // Separate master events/tasks (no RECURRENCE-ID) from overrides
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

    //
    // Group the overrides by UID in one pass, so the work below is linear in
    // the number of components instead of masters x overrides, and add at
    // most so many EXDATEs in all (a UID has a single master per RFC 5545;
    // repeating the same EXDATEs on thousands of duplicate masters let a
    // small body add millions of properties and use gigabytes of memory,
    // while a calendar with a few duplicate masters gets them on each, as
    // before) (and each RECURRENCE-ID of a UID once, the first override with
    // it, so many overrides of one instance are not each checked against
    // each master)
    //
    const overridesByUid = new Map();
    for (const override of overrides) {
      const overrideUid = override.getFirstPropertyValue('uid');
      if (!overrideUid) continue;
      const recurrenceId = override.getFirstProperty('recurrence-id');
      if (!recurrenceId) continue;
      const recIdValue = recurrenceId.getFirstValue();
      if (!recIdValue) continue;
      const recIdIcs = recIdValue.toICALString();
      if (!overridesByUid.has(overrideUid))
        overridesByUid.set(overrideUid, new Map());
      const byRecId = overridesByUid.get(overrideUid);
      if (!byRecId.has(recIdIcs))
        byRecId.set(recIdIcs, {
          recIdValue,
          tzid: recurrenceId.getParameter('tzid'),
          valueType: recurrenceId.getParameter('value')
        });
    }

    let modified = false;
    let added = 0;

    for (const master of masters) {
      if (added >= MAX_ADDED_EXDATES) break;
      const masterUid = master.getFirstPropertyValue('uid');
      if (!masterUid) continue;
      const uidOverrides = overridesByUid.get(masterUid);
      if (!uidOverrides) continue;

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
      for (const [recIdIcs, { recIdValue, tzid, valueType }] of uidOverrides) {
        if (added >= MAX_ADDED_EXDATES) break;

        // Check if this RECURRENCE-ID date already has an EXDATE
        if (!existingExdates.has(recIdIcs)) {
          // Add the missing EXDATE to the master
          // Preserve the TZID from the RECURRENCE-ID if present
          const exdateProp = new ICAL.Property('exdate');
          if (tzid) {
            exdateProp.setParameter('tzid', tzid);
          }

          // Match the value type (DATE vs DATE-TIME)
          if (valueType) {
            exdateProp.setParameter('value', valueType);
          }

          exdateProp.setValue(recIdValue.clone());
          master.addProperty(exdateProp);
          existingExdates.add(recIdIcs);
          added++;
          modified = true;
        }
      }
    }

    if (!modified) return icsData;

    // Serialize back to ICS
    let result = comp.toString();

    // Inject missing VTIMEZONE components (RFC 5545 Section 3.6.5)
    result = ensureVTimezones(result);

    // Ensure CRLF line endings (RFC 5545 Section 3.1)
    result = result.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

    return result;
  } catch {
    // If parsing fails, return the original data unchanged
    return icsData;
  }
}

module.exports = { normalizeIcs };
