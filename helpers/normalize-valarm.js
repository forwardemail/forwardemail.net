/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Normalize VALARM Helper
 *
 * When a VTODO's DUE or DTSTART is updated, any VALARM with an absolute
 * trigger (VALUE=DATE-TIME) becomes inconsistent — it still points at
 * the old date/time.  This helper detects that scenario and converts
 * absolute triggers to duration-based triggers relative to the anchor
 * property (DUE or DTSTART), which is the RFC 5545 recommended form.
 *
 * RFC 5545 Section 3.8.6.3 (TRIGGER):
 *   "When the TRIGGER is specified as a DURATION, the alarm fires
 *    relative to the start or end of the calendar component."
 *
 *   "When the TRIGGER is specified as a DATE-TIME value, it specifies
 *    an absolute time for the alarm trigger."
 *
 * By converting absolute triggers to relative durations, we ensure
 * that future DUE/DTSTART changes automatically adjust the alarm time.
 *
 * @see https://tools.ietf.org/html/rfc5545#section-3.8.6.3
 */

const ICAL = require('ical.js');

/**
 * Normalize VALARM triggers in VTODO (and optionally VEVENT) components.
 *
 * For each VALARM with an absolute trigger (type === 'date-time'):
 *   1. Compute the offset from the component's anchor (DUE, DTSTART, or DTEND)
 *   2. Replace the absolute trigger with a DURATION trigger using that offset
 *
 * This is called on the API write path so that stored ICS always has
 * consistent, relative VALARM triggers.
 *
 * @param {string} icsData - Raw ICS calendar data
 * @returns {string} ICS data with normalized VALARM triggers
 */
function normalizeVAlarm(icsData) {
  if (!icsData || typeof icsData !== 'string') return icsData;

  try {
    const parsed = ICAL.parse(icsData);
    const comp = new ICAL.Component(parsed);

    const components = [
      ...comp.getAllSubcomponents('vtodo'),
      ...comp.getAllSubcomponents('vevent')
    ];

    if (components.length === 0) return icsData;

    let modified = false;

    for (const sub of components) {
      // Determine the anchor time for relative triggers
      // VTODO: prefer DUE, fall back to DTSTART
      // VEVENT: prefer DTSTART, fall back to DTEND
      const isVtodo = sub.name === 'vtodo';
      let anchor = null;

      if (isVtodo) {
        anchor =
          sub.getFirstPropertyValue('due') ||
          sub.getFirstPropertyValue('dtstart');
      } else {
        anchor =
          sub.getFirstPropertyValue('dtstart') ||
          sub.getFirstPropertyValue('dtend');
      }

      if (!anchor) continue;

      const anchorMs = anchor.toJSDate().getTime();

      const valarms = sub.getAllSubcomponents('valarm');
      for (const valarm of valarms) {
        const triggerProp = valarm.getFirstProperty('trigger');
        if (!triggerProp) continue;

        //
        // ical.js absorbs VALUE=DATE-TIME into the property type.
        // So `triggerProp.type` is 'date-time' for absolute triggers
        // and 'duration' for relative triggers.
        //
        if (triggerProp.type !== 'date-time') continue;

        // Get the absolute trigger time
        const triggerValue = triggerProp.getFirstValue();
        if (!triggerValue || !triggerValue.toJSDate) continue;

        const triggerMs = triggerValue.toJSDate().getTime();

        // Compute the offset in seconds (negative = before anchor)
        const offsetSec = Math.round((triggerMs - anchorMs) / 1000);

        // Convert to ICAL.Duration
        const duration = new ICAL.Duration();

        // Set the duration components
        const absSec = Math.abs(offsetSec);
        if (offsetSec < 0) {
          duration.isNegative = true;
        }

        // Break down into days, hours, minutes, seconds
        // (avoid weeks for clarity in the output)
        duration.days = Math.floor(absSec / 86_400);
        let remainder = absSec % 86_400;
        duration.hours = Math.floor(remainder / 3600);
        remainder %= 3600;
        duration.minutes = Math.floor(remainder / 60);
        duration.seconds = remainder % 60;

        //
        // Replace the trigger property entirely.
        // ical.js doesn't cleanly support changing a trigger's type
        // in-place, so we remove and re-add.
        //
        valarm.removeProperty(triggerProp);
        const newTrigger = new ICAL.Property('trigger');

        // For VTODO with DUE, set RELATED=END so the trigger is
        // relative to DUE (the default RELATED=START would be DTSTART)
        if (isVtodo && sub.getFirstPropertyValue('due')) {
          newTrigger.setParameter('related', 'END');
        }

        newTrigger.setValue(duration);
        valarm.addProperty(newTrigger);
        modified = true;
      }
    }

    if (!modified) return icsData;

    return comp.toString();
  } catch {
    return icsData;
  }
}

module.exports = { normalizeVAlarm };
