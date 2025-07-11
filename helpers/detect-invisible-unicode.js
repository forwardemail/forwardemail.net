/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { detect } = require('out-of-character');

/**
 * Detects invisible Unicode characters in a string
 * @param {string} str - The string to check
 * @returns {boolean} - True if invisible Unicode characters are found
 */
function detectInvisibleUnicode(str) {
  if (typeof str !== 'string') return false;

  try {
    const invisibleChars = detect(str);
    return invisibleChars !== null && invisibleChars.length > 0;
  } catch {
    // If out-of-character fails, assume no invisible characters
    return false;
  }
}

/**
 * Gets details about invisible Unicode characters in a string
 * @param {string} str - The string to check
 * @returns {Array} - Array of invisible character details
 */
function getInvisibleUnicodeDetails(str) {
  if (typeof str !== 'string') return [];

  try {
    const invisibleChars = detect(str);
    return invisibleChars || [];
  } catch {
    // If out-of-character fails, return empty array
    return [];
  }
}

module.exports = {
  detectInvisibleUnicode,
  getInvisibleUnicodeDetails
};
