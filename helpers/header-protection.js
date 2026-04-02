/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * RFC 9788 - Header Protection for Cryptographically Protected Email
 *
 * This module provides utilities for protecting email headers
 * within S/MIME and PGP/MIME encrypted messages per RFC 9788.
 *
 * @see https://www.rfc-editor.org/rfc/rfc9788.html
 * @see https://www.rfc-editor.org/rfc/rfc9787.html
 */

//
// Structural Header Fields per RFC 9787 Section 1.1.1
// These are NOT copied into the inner header section and are
// NOT subject to HP-Outer treatment.
//
const STRUCTURAL_HEADERS = new Set([
  'content-type',
  'content-transfer-encoding',
  'content-disposition',
  'content-description',
  'content-id',
  'content-language',
  'content-location',
  'mime-version'
]);

//
// User-Facing Header Fields per RFC 9787 Section 1.1.2
// These are the headers that users see and that should be
// protected and optionally made confidential.
//
const USER_FACING_HEADERS = new Set([
  'subject',
  'from',
  'to',
  'cc',
  'date',
  'reply-to',
  'message-id',
  'in-reply-to',
  'references',
  'keywords',
  'comments',
  'sender'
]);

//
// Default Header Confidentiality Policy (hcp_baseline)
// per RFC 9788 Section 3.1.
// These headers are obscured or removed from the outer envelope
// when encrypting with hp="cipher".
//
const HCP_BASELINE_CONFIDENTIAL = new Set([
  'subject',
  'keywords',
  'comments',
  'in-reply-to',
  'references'
]);

//
// Placeholder for obscured Subject header per RFC 9788 Section 5.2.1
//
const OBSCURED_SUBJECT = '...';

/**
 * Determine if a header field name is structural (RFC 9787 Section 1.1.1).
 *
 * @param {string} name - Header field name (case-insensitive)
 * @returns {boolean}
 */
function isStructuralHeader(name) {
  return STRUCTURAL_HEADERS.has(name.toLowerCase().trim());
}

/**
 * Determine if a header field name is user-facing (RFC 9787 Section 1.1.2).
 *
 * @param {string} name - Header field name (case-insensitive)
 * @returns {boolean}
 */
function isUserFacingHeader(name) {
  return USER_FACING_HEADERS.has(name.toLowerCase().trim());
}

/**
 * Determine if a header should be made confidential under hcp_baseline.
 *
 * @param {string} name - Header field name (case-insensitive)
 * @returns {boolean}
 */
function isConfidentialHeader(name) {
  return HCP_BASELINE_CONFIDENTIAL.has(name.toLowerCase().trim());
}

/**
 * Parse raw header lines into structured objects.
 * Each object has { name, value, raw } where raw is the original line(s).
 *
 * @param {string} headerBlock - Raw header block (CRLF-separated)
 * @returns {Array<{name: string, value: string, raw: string}>}
 */
function parseHeaderLines(headerBlock) {
  const result = [];
  const lines = headerBlock.split('\r\n');
  let current = null;

  for (const line of lines) {
    if (line === '') continue;

    // Continuation line (starts with whitespace)
    if (/^\s/.test(line) && current) {
      current.raw += '\r\n' + line;
      current.value += '\r\n' + line;
    } else {
      // New header
      if (current) result.push(current);
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) {
        current = { name: '', value: line, raw: line };
      } else {
        const name = line.slice(0, colonIdx);
        const value = line.slice(colonIdx + 1);
        current = { name, value, raw: line };
      }
    }
  }

  if (current) result.push(current);
  return result;
}

/**
 * Build the inner (protected) header section for an encrypted message.
 * Per RFC 9788 Section 5.2, this copies Non-Structural headers into
 * the Cryptographic Payload and generates HP-Outer entries.
 *
 * @param {Array<{name: string, value: string, raw: string}>} parsedHeaders - Parsed original headers
 * @param {object} options
 * @param {boolean} [options.isEncrypted=true] - Whether the message is encrypted (hp="cipher") or signed-only (hp="clear")
 * @param {Set<string>} [options.confidentialHeaders] - Headers to make confidential (defaults to HCP_BASELINE_CONFIDENTIAL)
 * @returns {{innerHeaders: string, outerHeaders: Array<{name: string, value: string, raw: string}>, hpValue: string}}
 */
function buildProtectedHeaders(parsedHeaders, options = {}) {
  const {
    isEncrypted = true,
    confidentialHeaders = HCP_BASELINE_CONFIDENTIAL
  } = options;

  const hpValue = isEncrypted ? 'cipher' : 'clear';

  //
  // Separate structural from non-structural headers
  //
  const nonStructural = [];
  const structural = [];

  for (const header of parsedHeaders) {
    if (isStructuralHeader(header.name)) {
      structural.push(header);
    } else if (header.name !== '') {
      nonStructural.push(header);
    }
  }

  //
  // Build inner header lines (all non-structural headers are copied as-is)
  //
  const innerLines = [];
  for (const header of nonStructural) {
    innerLines.push(header.raw);
  }

  //
  // For encrypted messages, generate HP-Outer entries
  // per RFC 9788 Section 5.2
  //
  const hpOuterLines = [];
  const outerHeaders = [];

  if (isEncrypted) {
    for (const header of nonStructural) {
      const lowerName = header.name.toLowerCase().trim();
      if (confidentialHeaders.has(lowerName)) {
        //
        // This header is confidential - it will be obscured or
        // removed from the outer envelope.
        // For Subject, we use the obscured placeholder.
        // For others, we remove them entirely.
        //
        if (lowerName === 'subject') {
          const outerValue = ` ${OBSCURED_SUBJECT}`;
          outerHeaders.push({
            name: header.name,
            value: outerValue,
            raw: `${header.name}:${outerValue}`
          });
          hpOuterLines.push(`HP-Outer: ${header.name}:${outerValue}`);
        } else {
          // Removed from outer - no HP-Outer needed per RFC 9788 Section 2.2
          // (absence from HP-Outer means it was made confidential)
        }
      } else {
        //
        // Non-confidential header - copied as-is to outer
        //
        outerHeaders.push(header);
        hpOuterLines.push(`HP-Outer: ${header.raw}`);
      }
    }
  } else {
    //
    // Signed-only: all non-structural headers are copied as-is
    // No HP-Outer needed per RFC 9788 Section 2.2
    //
    for (const header of nonStructural) {
      outerHeaders.push(header);
    }
  }

  //
  // Assemble the inner header section
  //
  const allInnerLines = [...innerLines];
  if (hpOuterLines.length > 0) {
    for (const line of hpOuterLines) {
      allInnerLines.push(line);
    }
  }

  return {
    innerHeaders: allInnerLines.join('\r\n'),
    outerHeaders,
    hpValue
  };
}

/**
 * Build a Legacy Display Element for text/plain per RFC 9788 Section 5.2.2.
 * This allows legacy MUAs to display the protected header values.
 *
 * @param {Array<{name: string, value: string, raw: string}>} parsedHeaders - Parsed original headers
 * @param {Set<string>} [confidentialHeaders] - Headers that were made confidential
 * @returns {string} The legacy display text to prepend to the body
 */
function buildLegacyDisplayText(parsedHeaders, confidentialHeaders) {
  const displayHeaders = confidentialHeaders || HCP_BASELINE_CONFIDENTIAL;
  const lines = [];

  for (const header of parsedHeaders) {
    const lowerName = header.name.toLowerCase().trim();
    if (displayHeaders.has(lowerName) && isUserFacingHeader(lowerName)) {
      lines.push(`${header.name}:${header.value}`);
    }
  }

  if (lines.length === 0) return '';
  // Legacy display element: headers followed by blank line
  return lines.join('\r\n') + '\r\n';
}

module.exports = {
  STRUCTURAL_HEADERS,
  USER_FACING_HEADERS,
  HCP_BASELINE_CONFIDENTIAL,
  OBSCURED_SUBJECT,
  isStructuralHeader,
  isUserFacingHeader,
  isConfidentialHeader,
  parseHeaderLines,
  buildProtectedHeaders,
  buildLegacyDisplayText
};
