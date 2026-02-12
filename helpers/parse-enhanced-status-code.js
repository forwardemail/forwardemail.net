/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');

//
// RFC 3463 Enhanced Mail System Status Codes
//
// Enhanced status codes have the form "class.subject.detail" where:
//   class   = "2" / "4" / "5"
//   subject = 1*3DIGIT
//   detail  = 1*3DIGIT
//
// They typically appear right after the 3-digit SMTP reply code:
//   "250 2.0.0 Ok: queued as 12345"
//   "550 5.1.1 User unknown"
//   "421 4.7.0 Try again later"
//
// Some servers use a hyphen continuation:
//   "250-2.0.0 Ok"
//

// Matches enhanced status code at the start of an SMTP response
// (after the 3-digit code and a space or hyphen)
const REGEX_ENHANCED_AFTER_CODE = new RE2(
  /^\d{3}[\s-]+([245](?:\.\d{1,3}){2})\b/
);

// Matches enhanced status code anywhere in a string (fallback)
const REGEX_ENHANCED_ANYWHERE = new RE2(/\b([245](?:\.\d{1,3}){2})\b/);

/**
 * Try to extract an enhanced status code from a string.
 *
 * @param {string} str - The string to parse
 * @returns {string|null} The enhanced status code or null
 */
function parseFromString(str) {
  if (typeof str !== 'string' || str.length === 0) return null;

  // First try: right after the 3-digit SMTP code (most common position)
  const match = REGEX_ENHANCED_AFTER_CODE.exec(str);
  if (match) return match[1];

  // Fallback: anywhere in the string
  const anyMatch = REGEX_ENHANCED_ANYWHERE.exec(str);
  if (anyMatch) return anyMatch[1];

  return null;
}

/**
 * Parse an RFC 3463 enhanced status code from an SMTP response string
 * or an error object.
 *
 * When given a string, it extracts the enhanced status code directly.
 * When given an error object, it checks `err.response` first, then `err.message`,
 * then falls back to deriving a generic code from `err.responseCode`.
 *
 * @param {string|object} input - An SMTP response string or an error object
 * @param {number} [fallbackCode] - A 3-digit SMTP code to derive a generic enhanced code from
 * @returns {string} The enhanced status code (e.g. "2.0.0", "5.1.1", "4.7.0")
 */
function parseEnhancedStatusCode(input, fallbackCode) {
  // Handle error objects (from nodemailer / SMTP errors)
  if (input && typeof input === 'object') {
    // Try err.response first (the raw SMTP response line)
    if (typeof input.response === 'string') {
      const result = parseFromString(input.response);
      if (result) return result;
    }

    // Try err.message as fallback
    if (typeof input.message === 'string') {
      const result = parseFromString(input.message);
      if (result) return result;
    }

    // Use err.responseCode as the fallback 3-digit code
    if (typeof input.responseCode === 'number' && fallbackCode === undefined) {
      fallbackCode = input.responseCode;
    }
  } else if (typeof input === 'string') {
    // Direct string parsing
    const result = parseFromString(input);
    if (result) return result;
  }

  // Derive a generic enhanced status code from the 3-digit SMTP code
  if (typeof fallbackCode === 'number') {
    if (fallbackCode >= 200 && fallbackCode < 300) return '2.0.0';
    if (fallbackCode >= 400 && fallbackCode < 500) return '4.0.0';
    if (fallbackCode >= 500 && fallbackCode < 600) return '5.0.0';
  }

  // Ultimate fallback: permanent failure
  return '5.0.0';
}

module.exports = parseEnhancedStatusCode;
