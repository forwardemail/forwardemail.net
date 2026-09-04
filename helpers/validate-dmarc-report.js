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
  /<\/?[a-z][a-z\d:-]*(?:[/\s][^<>]{0,1024})?\/?\s{0,1024}>|&(?:#x0*3c|#0*60|lt);?|(?:javascript|vbscript):|data:text\/html/i;

/**
 * Find the first DMARC report field containing active or markup-like content.
 * @param {unknown} value - A canonical parsed DMARC report value
 * @param {string} path - Field path for safe operational logging
 * @returns {string|null} Field path when unsafe content is found
 */
function findUnsafeDmarcContent(value, path = 'report') {
  if (typeof value === 'string') {
    const normalized = value.normalize('NFKC');
    return UNSAFE_DMARC_CONTENT_PATTERN.test(normalized) ? path : null;
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
