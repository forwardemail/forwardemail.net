/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isFQDN = require('is-fqdn');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');

const _ = require('#helpers/lodash');
const config = require('#config');

//
// Core restricted TLDs that are always trusted regardless of config.restrictedDomains.
//
// NOTE: We intentionally do NOT use config.restrictedDomains here because that array
//       includes brandAndCorporateDomains (e.g. .bond, .click, .shop, .live, .icu,
//       .buzz, .loan, .work, .online, .amazon, .google, etc.) which are cheap/spammy
//       gTLDs that spammers can register freely and use to bypass allowlisting.
//       Only the four core IANA-restricted TLDs are unconditionally trusted.
//
const CORE_RESTRICTED_TLDS = new Set(['edu', 'gov', 'mil', 'int']);

/**
 * Check if a domain's TLD is in the allowlisted set of goodDomains or core restricted TLDs.
 * This prevents domains with obscure or cheap TLDs (e.g. .bond, .click, .shop, .live, .icu)
 * from being added to the allowlist via the sync-paid-alias-allowlist job or denylist removal.
 *
 * We use config.goodDomains (country codes, common gTLDs) plus the four core restricted TLDs
 * (edu, gov, mil, int). We explicitly exclude config.restrictedDomains because it includes
 * brandAndCorporateDomains which are not safe to allowlist unconditionally.
 *
 * @param {string} domain - The domain name or email address to check
 * @returns {boolean} - Returns true if the TLD is in the allowed set, false otherwise
 */
function isAllowlistTld(domain) {
  if (!isFQDN(domain)) return false;

  const parseResult = parseDomain(fromUrl(domain));

  if (
    parseResult.type !== ParseResultType.Listed ||
    !_.isObject(parseResult.icann) ||
    !_.isArray(parseResult.icann.topLevelDomains) ||
    _.isEmpty(parseResult.icann.topLevelDomains)
  )
    return false;

  const tld = parseResult.icann.topLevelDomains.at(-1);

  return (
    // Core restricted TLDs (edu, gov, mil, int) are always trusted
    CORE_RESTRICTED_TLDS.has(tld) ||
    // Common country-code and generic TLDs from goodDomains are trusted
    config.goodDomains.includes(tld) ||
    // Also allow multi-part TLDs that contain a core restricted component
    // (e.g. gov.uk, ac.uk, edu.au) by checking all parts of the TLD
    parseResult.icann.topLevelDomains.some((t) => CORE_RESTRICTED_TLDS.has(t))
  );
}

module.exports = isAllowlistTld;
