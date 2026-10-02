/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const DMARC_MAX_REPORT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB max report size
const DMARC_MAX_RECORDS_PER_REPORT = 10000; // Max records in a single report

// DMARC aggregate report fields are plain-text protocol data. A decoded HTML
// tag, encoded tag, or executable URI therefore has no valid use here. The
// parser converts XML entities before this bounded field-level check, so an
// encoded payload cannot bypass validation and arbitrary malformed XML is
// never processed by a pre-parser regular expression.
const UNSAFE_DMARC_CONTENT_PATTERN =
  /&(?:#x0*3c|#0*60|lt);?|(?:javascript|vbscript):|data:text\/html/i;

//
// A tag: "<" and an optional "/", a tag name, then (optionally) a "/" or a
// space and up to about 2 KB without "<" or ">", then ">".
//
// (scanned by hand, as the regular expression for it backtracked over its
// bounded repeats: "<a" followed by long runs of spaces took seconds per
// megabyte on the MX process; each scan here stops at the next "<", so the
// time is linear in the field length)
//
const RE_TAG_START = /<\/?[a-z][a-z\d:-]*/gi;
const MAX_TAG_REST = 2050;

function hasTag(value) {
  RE_TAG_START.lastIndex = 0;
  let match;
  while ((match = RE_TAG_START.exec(value)) !== null) {
    const restStart = match.index + match[0].length;
    const limit = Math.min(value.length, restStart + MAX_TAG_REST);
    for (let i = restStart; i < limit; i++) {
      const char = value[i];
      if (char === '>') {
        const first = value[restStart];
        if (i === restStart || first === '/' || /\s/.test(first)) return true;
        break;
      }

      if (char === '<') break;
    }

    // continue from the next "<" (anything before it was scanned above)
    const next = value.indexOf('<', restStart);
    if (next === -1) return false;
    RE_TAG_START.lastIndex = next;
  }

  return false;
}

/**
 * Find the first DMARC report field containing active or markup-like content.
 * @param {unknown} value - A canonical parsed DMARC report value
 * @param {string} path - Field path for safe operational logging
 * @returns {string|null} Field path when unsafe content is found
 */
function findUnsafeDmarcContent(value, path = 'report') {
  if (typeof value === 'string') {
    const normalized = value.normalize('NFKC');
    return hasTag(normalized) || UNSAFE_DMARC_CONTENT_PATTERN.test(normalized)
      ? path
      : null;
  }

  if (!value || typeof value !== 'object') return null;

  for (const [key, child] of Object.entries(value)) {
    const unsafePath = findUnsafeDmarcContent(child, `${path}.${key}`);
    if (unsafePath) return unsafePath;
  }

  return null;
}

/**
 * Validate DMARC report content for suspicious patterns.
 * @param {Object} report - Parsed DMARC report
 * @param {number} rawSize - Size of raw email in bytes
 * @returns {{valid: boolean, reason?: string}}
 */
function validateReportContent(report, rawSize) {
  if (rawSize > DMARC_MAX_REPORT_SIZE_BYTES) {
    return {
      valid: false,
      reason: `Report too large: ${rawSize} bytes (max: ${DMARC_MAX_REPORT_SIZE_BYTES})`
    };
  }

  if (report.records && report.records.length > DMARC_MAX_RECORDS_PER_REPORT) {
    return {
      valid: false,
      reason: `Too many records: ${report.records.length} (max: ${DMARC_MAX_RECORDS_PER_REPORT})`
    };
  }

  if (!report.report_metadata) {
    return {
      valid: false,
      reason: 'Missing report metadata'
    };
  }

  const unsafeField = findUnsafeDmarcContent(report);
  if (unsafeField) {
    return {
      valid: false,
      reason: `Unsafe markup or executable URI in ${unsafeField}`
    };
  }

  if (report.report_metadata.date_range) {
    const now = Date.now();
    const maxAge = ms('30d');
    const maxFuture = ms('1d');

    if (report.report_metadata.date_range.begin) {
      const beginTime = new Date(
        report.report_metadata.date_range.begin
      ).getTime();
      if (now - beginTime > maxAge) {
        return {
          valid: false,
          reason: 'Report date range too old (> 30 days)'
        };
      }

      if (beginTime - now > maxFuture) {
        return {
          valid: false,
          reason: 'Report date range in the future'
        };
      }
    }
  }

  if (report.summary) {
    const { total_messages } = report.summary;
    if (total_messages > 10_000_000) {
      return {
        valid: false,
        reason: `Suspicious message count: ${total_messages}`
      };
    }
  }

  return { valid: true };
}

module.exports = {
  findUnsafeDmarcContent,
  validateReportContent,
  DMARC_MAX_REPORT_SIZE_BYTES,
  DMARC_MAX_RECORDS_PER_REPORT
};
