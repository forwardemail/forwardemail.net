/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

/**
 * Return an explicitly permitted single-field Mongoose sort expression.
 *
 * Mongoose accepts string sort specifications and forwards their field names to
 * MongoDB. Controllers must therefore constrain request-supplied sort keys to
 * the fields their UI/API explicitly supports.
 *
 * @param {unknown} value - Request `sort` parameter
 * @param {Set<string>} allowedFields - Permitted field names without direction
 * @param {string} fallback - Safe sort expression used for absent/invalid input
 * @returns {string} A permitted sort expression
 */
function getAllowedSort(value, allowedFields, fallback) {
  if (!isSANB(value)) return fallback;

  const field = value.startsWith('-') ? value.slice(1) : value;
  return allowedFields.has(field) ? value : fallback;
}

module.exports = getAllowedSort;
