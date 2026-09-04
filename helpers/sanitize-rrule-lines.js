/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// rrule.js only accepts a restricted subset of RFC 5545 content lines and
// parameters.  iCalendar itself permits IANA and X- extension parameters, so
// this helper creates a parser-only representation for recurrence expansion.
// The caller MUST retain the original ICS for storage and CalDAV responses.
//

const RRULE_INPUT_ALLOWED_PROPS = new Set([
  'DTSTART',
  'RRULE',
  'EXRULE',
  'EXDATE',
  'RDATE'
]);
const DATE_PARAMETERS = new Set(['TZID', 'VALUE']);

function splitUnquoted(input, delimiter) {
  const out = [];
  let quote = false;
  let escaped = false;
  let start = 0;

  for (let index = 0; index < input.length; index++) {
    const character = input[index];
    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === '\\') {
      escaped = true;
      continue;
    }

    if (character === '"') {
      quote = !quote;
      continue;
    }

    if (!quote && character === delimiter) {
      out.push(input.slice(start, index));
      start = index + 1;
    }
  }

  out.push(input.slice(start));
  return out;
}

function findUnquoted(input, needle) {
  const [prefix] = splitUnquoted(input, needle);
  return prefix.length === input.length ? -1 : prefix.length;
}

function normalizeRruleLine(line) {
  const colon = findUnquoted(line, ':');
  if (colon === -1) return null;

  const header = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...parameters] = splitUnquoted(header, ';');
  const property = name.toUpperCase();
  if (!RRULE_INPUT_ALLOWED_PROPS.has(property)) return null;

  // RFC 5545 permits other-param (including X- parameters) on RRULE/EXRULE,
  // but rrule.js rejects all of them.  They are metadata/caches, not recurrence
  // semantics, so omit them only from the parser input.
  if (property === 'RRULE' || property === 'EXRULE') {
    return `${property}:${value}`;
  }

  // rrule.js understands TZID and VALUE on date properties.  Preserve those
  // standard parameters and drop IANA/X- extensions such as
  // X-ICAL-SYNC-SCHOOL-HOLIDAYS, which must remain in stored ICS but cannot be
  // evaluated by rrule.js.
  const supported = parameters.filter((parameter) => {
    const [parameterName] = splitUnquoted(parameter, '=');
    return DATE_PARAMETERS.has(parameterName.toUpperCase());
  });

  return `${property}${
    supported.length === 0 ? '' : `;${supported.join(';')}`
  }:${value}`;
}

function sanitizeRruleLines(lines) {
  const out = [];
  for (const original of lines) {
    if (typeof original !== 'string') continue;

    // RFC 5545 §3.1 folds a continued content line with leading whitespace.
    // A malformed exporter or parser round-trip can leak child VTIMEZONE
    // fragments here; keep one complete recurrence-input line only.
    for (const piece of original.split(/\r?\n/)) {
      const line = piece.trim();
      if (!line) continue;
      const normalized = normalizeRruleLine(line);
      if (normalized) out.push(normalized);
      break;
    }
  }

  return out;
}

function isRecoverableRruleParseError(error) {
  const message = error?.message;
  if (typeof message !== 'string') return false;

  return [
    'Unsupported RFC prop EXDATE in EXDATE',
    'Invalid UNTIL value',
    'Invalid RRULE',
    'Invalid DTSTART',
    'Unknown RRULE property',
    'unsupported property:',
    'unsupported RDATE/EXDATE parm:',
    'unsupported RRULE parm:'
  ].some((fragment) => message.includes(fragment));
}

module.exports = {
  isRecoverableRruleParseError,
  normalizeRruleLine,
  sanitizeRruleLines
};
