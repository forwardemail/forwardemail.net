/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const normalizeWildcardTLD = require('#helpers/normalize-wildcard-tld');

/**
 * Return true when a hostname is below any valid wildcard public-suffix rule.
 * A rule `*.gov.co` matches `example.gov.co` and deeper names, but not the
 * suffix itself or unrelated values such as `gov.co.example`.
 *
 * @param {string} domain hostname to test
 * @param {string[]} list custom allowlist or denylist entries
 * @returns {boolean} whether a valid wildcard suffix rule matches
 */
function matchesWildcardTLD(domain, list) {
  if (typeof domain !== 'string' || !Array.isArray(list)) return false;

  let normalizedDomain = domain.toLowerCase().trim();
  try {
    normalizedDomain = punycode.toASCII(normalizedDomain);
  } catch {
    return false;
  }

  for (const entry of list) {
    const wildcard = normalizeWildcardTLD(entry);
    if (
      wildcard &&
      normalizedDomain !== wildcard.slice(2) &&
      normalizedDomain.endsWith(wildcard.slice(1))
    )
      return true;
  }

  return false;
}

module.exports = matchesWildcardTLD;
