/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

/**
 * Parse TLS-Required header from raw message (RFC 8689 Section 5)
 * @param {Buffer|String} raw - Raw email message
 * @returns {Object} - { tlsOptional: boolean }
 */
function parseTLSRequiredHeader(raw) {
  const rawString = Buffer.isBuffer(raw) ? raw.toString('utf8') : raw;

  // Extract headers (everything before first blank line)
  const headerEnd = rawString.indexOf('\r\n\r\n');
  const headers = headerEnd === -1 ? rawString : rawString.slice(0, headerEnd);

  // Look for TLS-Required header (case-insensitive)
  const match = headers.match(/^tls-required:\s*(.+?)$/im);

  if (!match) {
    return { tlsOptional: false };
  }

  const value = match[1].trim();

  // RFC 8689 Section 5: Only valid value is "No"
  if (value.toLowerCase() === 'no') {
    return { tlsOptional: true };
  }

  return { tlsOptional: false };
}

module.exports = parseTLSRequiredHeader;
