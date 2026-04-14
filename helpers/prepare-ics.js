/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Unified ICS Preparation Helper
 *
 * Single entry point for all ICS transformations on the **write path**
 * (API create/update and CalDAV PUT).  Replaces the previous anti-pattern
 * of deeply nested calls:
 *
 *   stampICS(normalizeVAlarm(ensureVTimezones(quoteICSFilenames(normalizeIcs(ical)))))
 *
 * Each of those helpers independently parsed and serialized the ICS,
 * resulting in up to 5 redundant ical.js parse/serialize cycles per write.
 * This wrapper calls each transform sequentially in a well-defined pipeline
 * with a single, documented order of operations.
 *
 * Pipeline stages (in order):
 *
 *   1. normalizeIcs       — add missing EXDATEs for detached recurrence
 *                           overrides (internally calls ensureVTimezones
 *                           when it modifies the ICS)
 *   2. ensureVTimezones   — inject missing VTIMEZONE components for any
 *                           referenced TZIDs (idempotent; safe to call
 *                           even if normalizeIcs already ran it)
 *   3. normalizeVAlarm    — convert absolute VALARM triggers to relative
 *                           duration triggers (API only)
 *   4. stampICS           — set DTSTAMP and LAST-MODIFIED to current
 *                           time (API only)
 *   5. quoteICSFilenames  — regex post-pass to quote FILENAME params
 *                           (must run AFTER ical.js serialization because
 *                           ical.js strips quotes during parse/serialize)
 *   6. CRLF normalization — ensure RFC 5545 Section 3.1 line endings
 *
 * Not every caller needs every stage.  The `options` parameter controls
 * which optional stages are enabled:
 *
 *   - CalDAV PUT:  stages 1-2, 5-6 (clients set their own timestamps
 *                  and VALARM triggers)
 *   - API create:  all stages 1-6
 *   - API update:  all stages 1-6
 *
 * @module helpers/prepare-ics
 * @see https://tools.ietf.org/html/rfc5545
 */

const { quoteICSFilenames } = require('#helpers/ical-filename');
const { normalizeIcs } = require('#helpers/normalize-ics');
const { ensureVTimezones } = require('#helpers/generate-vtimezone');
const { normalizeVAlarm } = require('#helpers/normalize-valarm');
const { stampICS } = require('#helpers/stamp-ics');

/**
 * Prepare ICS data for storage by running it through the normalization
 * pipeline.
 *
 * @param {string} icsData - Raw ICS calendar data from the client
 * @param {Object} [options={}] - Pipeline options
 * @param {boolean} [options.stamp=false]          - Run stampICS (set DTSTAMP/LAST-MODIFIED to now)
 * @param {boolean} [options.normalizeAlarms=false] - Run normalizeVAlarm (convert absolute triggers)
 * @returns {string} Normalized ICS data ready for database storage
 */
function prepareICSForStorage(icsData, options = {}) {
  if (!icsData || typeof icsData !== 'string') return icsData;

  const { stamp = false, normalizeAlarms = false } = options;

  //
  // Stage 1: Add missing EXDATEs for detached recurrence overrides.
  // Microsoft Exchange / M365 omits EXDATE when creating RECURRENCE-ID
  // overrides, causing duplicate display of moved instances.
  // (normalizeIcs internally calls ensureVTimezones when it modifies.)
  //
  let ics = normalizeIcs(icsData);

  //
  // Stage 2: Inject missing VTIMEZONE components.
  // Idempotent — safe even if normalizeIcs already ran it.
  // Needed because normalizeIcs only calls ensureVTimezones when it
  // actually modifies the ICS (i.e., when RECURRENCE-ID overrides exist).
  //
  ics = ensureVTimezones(ics);

  //
  // Stage 3 (optional): Normalize VALARM triggers.
  // Converts absolute VALUE=DATE-TIME triggers to relative durations
  // so that future DUE/DTSTART changes automatically adjust alarm times.
  // Only needed on the API path — CalDAV clients manage their own alarms.
  //
  if (normalizeAlarms) {
    ics = normalizeVAlarm(ics);
  }

  //
  // Stage 4 (optional): Stamp DTSTAMP and LAST-MODIFIED.
  // Sets both to the current UTC time so CalDAV clients detect the change.
  // Only needed on the API path — CalDAV clients set their own timestamps.
  //
  if (stamp) {
    ics = stampICS(ics);
  }

  //
  // Stage 5: Quote FILENAME parameter values (regex, post-parse).
  // RFC 5545 Section 3.2 requires DQUOTE-wrapping for param values
  // containing special characters.  ical.js does not auto-quote and
  // actually strips quotes during parse/serialize, so this MUST run
  // after all ical.js-based transforms.
  //
  ics = quoteICSFilenames(ics);

  //
  // Stage 6: Normalize line endings to CRLF (RFC 5545 Section 3.1).
  // Some clients send bare LF; ical.js preserves whatever line endings
  // the input has.  This two-step approach avoids doubling \r\n to \r\r\n.
  // Note: quoteICSFilenames already does its own refolding with \r\n,
  // but we normalize here unconditionally for consistency.
  //
  ics = ics.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

  return ics;
}

module.exports = { prepareICSForStorage };
