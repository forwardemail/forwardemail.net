/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Splits a string by comma characters, including full-width commas.
 * This handles cases where users may input full-width commas (，) instead of
 * standard ASCII commas (,), which is common with CJK input methods.
 *
 * Supported comma characters:
 * - U+002C: COMMA (,)
 * - U+FF0C: FULLWIDTH COMMA (，)
 * - U+FE50: SMALL COMMA (﹐)
 * - U+FE51: SMALL IDEOGRAPHIC COMMA (﹑)
 * - U+3001: IDEOGRAPHIC COMMA (、)
 *
 * @param {string} str - The string to split
 * @returns {string[]} - Array of substrings
 */
function splitByComma(str) {
  if (typeof str !== 'string') return [];
  return str.replace(/[，﹐﹑、]/g, ',').split(',');
}

module.exports = splitByComma;
