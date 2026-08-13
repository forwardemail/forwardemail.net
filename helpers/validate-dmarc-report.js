/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const DMARC_MAX_REPORT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB max report size
const DMARC_MAX_RECORDS_PER_REPORT = 10000; // Max records in a single report

// DMARC aggregate report fields are plain-text protocol data. A decoded HTML
// tag, encoded tag, or executable URI therefore has no valid use here. Scan
// the canonical parsed values rather than raw XML so entity-encoded payloads
// (e.g. `&lt;script&gt;`) cannot bypass the check.
const UNSAFE_DMARC_CONTENT_PATTERN =
  /<\s*\/?\s*[a-z][a-z\d:-]*(?:\s|\/?>)|&(?:#x0*3c|#0*60|lt)\s*;?\s*\/?\s*[a-z][a-z\d:-]*|(?:javascript|vbscript)\s*:|data\s*:\s*text\s*\/\s*html/i;

// This stricter XML-level pattern intentionally names only active HTML/SVG
// elements and event-handler attributes. It does not match ordinary DMARC
// elements such as <feedback>, <record>, or <policy_published>.
const UNSAFE_DMARC_XML_CONTENT_PATTERN =
  /(?:<|&(?:#x0*3c|#0*60|lt)\s*;?)\s*\/?\s*(?:script|style|iframe|object|embed|svg|math|base|link|meta|form|img|video|audio|template)\b|(?:^|[<\s])on[\w-]+\s*=|(?:javascript|vbscript)\s*:|data\s*:\s*text\s*\/\s*html/i;

/**
 * Find active markup or executable URI content in raw DMARC XML.
 * @param {unknown} value - Decompressed DMARC XML text
 * @returns {string|null} A safe rejection reason, if found
 */
function findUnsafeDmarcXmlContent(value) {
  if (typeof value !== 'string') return null;

  const normalized = value.normalize('NFKC');
  return UNSAFE_DMARC_XML_CONTENT_PATTERN.test(normalized)
    ? 'Unsafe active markup or executable URI in DMARC XML'
    : null;
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
  findUnsafeDmarcXmlContent,
  validateReportContent,
  DMARC_MAX_REPORT_SIZE_BYTES,
  DMARC_MAX_RECORDS_PER_REPORT
};
