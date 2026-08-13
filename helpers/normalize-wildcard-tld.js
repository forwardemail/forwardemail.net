/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const { parse } = require('tldts');
const tlds = require('tlds');

const LEGACY_TOP_LEVEL_DOMAINS = new Set(
  tlds.map((tld) => punycode.toASCII(tld))
);
const PSL_OPTIONS = Object.freeze({ allowPrivateDomains: true });

/**
 * Normalize a wildcard public-suffix rule for custom domain allowlists and
 * denylists. The public suffix can contain one or more labels (for example,
 * `*.gov.co`, `*.co.uk`, or the PSL private suffix `*.github.io`).
 *
 * @param {string} value candidate wildcard rule
 * @returns {string | undefined} normalized ASCII rule or undefined
 */
function normalizeWildcardTLD(value) {
  if (typeof value !== 'string') return;

  const normalized = value.toLowerCase().trim();
  if (!normalized.startsWith('*.') || normalized.length <= 2) return;

  let suffix;
  try {
    suffix = punycode.toASCII(normalized.slice(2));
  } catch {
    return;
  }

  // Preserve the intentionally broad behavior of the previous tlds-based
  // implementation for every existing one-label rule (including PSL wildcard
  // entries such as *.ck), while tldts supplies strict multi-label support.
  if (LEGACY_TOP_LEVEL_DOMAINS.has(suffix)) return `*.${suffix}`;

  const result = parse(suffix, PSL_OPTIONS);
  if (!(result.isIcann || result.isPrivate) || result.publicSuffix !== suffix)
    return;

  // The input must itself be the exact effective public suffix. This rejects
  // arbitrary wildcard subdomains such as `*.example.com`, while accepting
  // ICANN and private rules from tldts' complete bundled Public Suffix List.

  return `*.${suffix}`;
}

module.exports = normalizeWildcardTLD;
