/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Spreadsheet apps (Excel, LibreOffice, Google Sheets) run a cell as a
// formula when it starts with one of these characters, so a subject line or
// SMTP response such as `=HYPERLINK(...)` from an external sender would run
// when the CSV is opened. A leading single quote makes the cell plain text.
// <https://owasp.org/www-community/attacks/CSV_Injection>
//
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

function neutralizeCsvFormula(value) {
  const str = String(value);
  return FORMULA_PREFIX.test(str) ? `'${str}` : str;
}

// quote a single cell (always quoted so commas and newlines are kept)
function csvEscape(value) {
  if (value === null || value === undefined) return '""';
  return `"${neutralizeCsvFormula(value).replaceAll('"', '""')}"`;
}

module.exports = csvEscape;
module.exports.neutralizeCsvFormula = neutralizeCsvFormula;
