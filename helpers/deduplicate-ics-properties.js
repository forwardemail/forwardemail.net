/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Deduplicate ICS Properties Helper
 *
 * RFC 5545 specifies that certain properties MUST NOT appear more than
 * once in a VEVENT, VTODO, or VJOURNAL component (Sections 3.6.1–3.6.3).
 * This helper removes duplicate occurrences of single-instance properties,
 * keeping the last value (which matches "last writer wins" semantics used
 * by most CalDAV clients when encountering duplicates).
 *
 * It also deduplicates EXDATE date-time values across all EXDATE properties
 * in a component.  Per RFC 5545 Section 3.8.5.1, a single EXDATE property
 * can contain multiple comma-separated values (e.g., EXDATE:date1,date2),
 * and multiple EXDATE properties are allowed.  This helper collects ALL
 * values across all EXDATE properties, removes duplicate date-times, and
 * reconstructs the minimal set of EXDATE properties.
 *
 * @module helpers/deduplicate-ics-properties
 * @see https://tools.ietf.org/html/rfc5545#section-3.6.1
 * @see https://tools.ietf.org/html/rfc5545#section-3.6.2
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.5.1
 */

const ICAL = require('ical.js');

//
// Properties that MUST NOT appear more than once per RFC 5545.
//
// VEVENT (Section 3.6.1): dtstamp, uid, dtstart, class, created,
//   description, geo, last-modified, location, organizer, priority,
//   sequence, status, summary, transp, url, recurrence-id, dtend, duration
//
// VTODO (Section 3.6.2): dtstamp, uid, class, completed, created,
//   description, dtstart, geo, last-modified, location, organizer,
//   percent-complete, priority, recurrence-id, sequence, status,
//   summary, url, due, duration
//
// VJOURNAL (Section 3.6.3): dtstamp, uid, class, created, dtstart,
//   last-modified, organizer, recurrence-id, sequence, status,
//   summary, url, description (NOTE: description CAN repeat in VJOURNAL)
//
// We use the union of VEVENT + VTODO single-instance properties.
// For VJOURNAL, description is multi-instance so we handle it separately.
//
const SINGLE_INSTANCE_PROPS = new Set([
  'class',
  'completed',
  'created',
  'description',
  'dtstart',
  'dtend',
  'due',
  'duration',
  'geo',
  'last-modified',
  'location',
  'organizer',
  'percent-complete',
  'priority',
  'recurrence-id',
  'sequence',
  'status',
  'summary',
  'transp',
  'uid',
  'url',
  'dtstamp'
]);

// In VJOURNAL, description MAY occur more than once (Section 3.6.3)
const VJOURNAL_MULTI_INSTANCE = new Set(['description']);

/**
 * Deduplicate properties in VEVENT, VTODO, and VJOURNAL components.
 *
 * For single-instance properties: keeps the last occurrence (last-writer-wins).
 * For EXDATE: collects all date-time values across all EXDATE properties,
 *   removes duplicate values, and reconstructs with unique values only.
 *
 * @param {string} icsData - ICS calendar data
 * @returns {string} ICS data with duplicate properties removed
 */
function deduplicateIcsProperties(icsData) {
  if (!icsData || typeof icsData !== 'string') return icsData;

  try {
    const parsed = ICAL.parse(icsData);
    const comp = new ICAL.Component(parsed);

    // Collect all target subcomponents
    const vevents = comp.getAllSubcomponents('vevent');
    const vtodos = comp.getAllSubcomponents('vtodo');
    const vjournals = comp.getAllSubcomponents('vjournal');
    const components = [...vevents, ...vtodos, ...vjournals];

    if (components.length === 0) return icsData;

    let modified = false;

    for (const component of components) {
      const isJournal = component.name === 'vjournal';

      //
      // Deduplicate single-instance properties.
      // Strategy: iterate all properties in reverse order, track seen names,
      // mark earlier duplicates for removal (keeps last occurrence).
      //
      const allProps = component.getAllProperties();
      const toRemove = [];
      const seen = new Set();

      for (const prop of [...allProps].reverse()) {
        const { name } = prop;
        if (!SINGLE_INSTANCE_PROPS.has(name)) continue;

        // In VJOURNAL, some properties are allowed to repeat
        if (isJournal && VJOURNAL_MULTI_INSTANCE.has(name)) continue;

        if (seen.has(name)) {
          toRemove.push(prop);
        } else {
          seen.add(name);
        }
      }

      for (const prop of toRemove) {
        component.removeProperty(prop);
        modified = true;
      }

      //
      // Deduplicate EXDATE values.
      //
      // RFC 5545 Section 3.8.5.1 defines EXDATE as:
      //   exdate = "EXDATE" exdtparam ":" exdtval *("," exdtval) CRLF
      //
      // This means a single EXDATE property can hold multiple comma-separated
      // date-time values, AND multiple EXDATE properties are allowed.
      // We must collect ALL values across ALL EXDATE properties, deduplicate
      // by their serialized string form, and reconstruct.
      //
      const exdateProps = component.getAllProperties('exdate');
      if (exdateProps.length > 0) {
        // Collect all values with their parameters (TZID, VALUE=DATE, etc.)
        // Group by parameter signature so we don't mix DATE vs DATE-TIME
        const groups = new Map(); // paramKey -> Map<dateString, ICAL.Time>

        for (const prop of exdateProps) {
          // Build a parameter key to group compatible EXDATE values
          const tzid = prop.getParameter('tzid') || '';
          const valueType = prop.getParameter('value') || 'date-time';
          const paramKey = `${valueType}|${tzid}`;

          if (!groups.has(paramKey)) {
            groups.set(paramKey, { params: {}, values: new Map() });
          }

          const group = groups.get(paramKey);

          // Preserve parameters from the last property encountered
          if (tzid) group.params.tzid = tzid;
          if (prop.getParameter('value')) {
            group.params.value = prop.getParameter('value');
          }

          // getValues() returns all values from a multi-value property
          const values = prop.getValues();
          for (const val of values) {
            if (val) {
              const key = val.toICALString();
              // Last occurrence wins (overwrite)
              group.values.set(key, val);
            }
          }
        }

        // Calculate total unique values vs total original values
        let originalCount = 0;
        for (const prop of exdateProps) {
          originalCount += prop.getValues().length;
        }

        let uniqueCount = 0;
        for (const group of groups.values()) {
          uniqueCount += group.values.size;
        }

        // Only modify if we actually found duplicates
        if (uniqueCount < originalCount || exdateProps.length > groups.size) {
          // Remove all existing EXDATE properties
          for (const prop of exdateProps) {
            component.removeProperty(prop);
          }

          // Reconstruct one EXDATE property per parameter group
          for (const group of groups.values()) {
            const values = [...group.values.values()];
            if (values.length === 0) continue;

            const newProp = new ICAL.Property('exdate');
            if (group.params.tzid) {
              newProp.setParameter('tzid', group.params.tzid);
            }

            if (group.params.value) {
              newProp.setParameter('value', group.params.value);
            }

            // Set all unique values on the single property
            if (values.length === 1) {
              newProp.setValue(values[0]);
            } else {
              newProp.setValues(values);
            }

            component.addProperty(newProp);
          }

          modified = true;
        }
      }
    }

    if (!modified) return icsData;

    return comp.toString();
  } catch {
    // If parsing fails, return unchanged — don't corrupt data
    return icsData;
  }
}

module.exports = { deduplicateIcsProperties };
