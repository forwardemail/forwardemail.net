/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const isGenericReverseHostname = require('#helpers/is-generic-reverse-hostname');
const isPrivateHost = require('#helpers/is-private-host');
const parseRootDomain = require('#helpers/parse-root-domain');
const {
  hasTrustedSenderIdentity
} = require('#helpers/is-high-confidence-php-hosting-spam');

// Matches the terminal "all" mechanism of an SPF record and captures its
// qualifier (RFC 7208 Section 4.6.2; a missing qualifier means "+")
const REGEX_SPF_ALL = /^([+\-~?])?all$/i;

/**
 * An SPF record whose "all" mechanism carries the "+" qualifier (or no
 * qualifier at all) designates every host on the Internet as a permitted
 * sender. A "pass" evaluated against such a record proves nothing about the
 * sender, so it is not treated as authentication here.
 *
 * @param {string} rr - raw SPF record as reported by mailauth (`spf.rr`)
 * @returns {boolean}
 */
function isPermissiveSpfRecord(rr) {
  if (!isSANB(rr)) return false;

  for (const term of rr.trim().split(/\s+/)) {
    const match = REGEX_SPF_ALL.exec(term);
    if (match) return !match[1] || match[1] === '+';
  }

  return false;
}

function hasMeaningfulSpfPass(result) {
  return (
    result?.status?.result === 'pass' && !isPermissiveSpfRecord(result?.rr)
  );
}

// A DNS failure during SPF, DKIM, or DMARC evaluation leaves the sender's
// authentication unknown rather than failed, so the message is not judged.
function hasInconclusiveAuthentication(session) {
  const results = [session.spf, session.spfFromHeader, session.dmarc];
  if (Array.isArray(session.dkim?.results))
    results.push(...session.dkim.results);
  return results.some((result) => result?.status?.result === 'temperror');
}

/**
 * Whether the HELO/EHLO identity asserts the From domain (relaxed alignment,
 * i.e. same organizational domain). The campaign greets as the impersonated
 * domain itself; a device or script that greets with its own name (or an IP
 * literal, "localhost", a reserved/internal name) is not judged by this rule.
 */
function isHeloAlignedWithFrom(session) {
  if (
    !isSANB(session.hostNameAppearsAs) ||
    !isSANB(session.originalFromAddressRootDomain)
  )
    return false;

  let helo = session.hostNameAppearsAs.trim().replace(/\.$/, '').toLowerCase();
  try {
    helo = punycode.toASCII(helo);
  } catch {
    return false;
  }

  if (!isFQDN(helo) || isPrivateHost(helo)) return false;

  return (
    parseRootDomain(helo) ===
    session.originalFromAddressRootDomain.toLowerCase()
  );
}

/**
 * The connection-level allowlist normally reflects the reputation of the
 * connecting host's root domain. For a provider-generated reverse hostname
 * that root domain (e.g. googleusercontent.com or amazonaws.com) is shared by
 * every customer of the provider, so an allowlist entry for it is not a
 * statement about this particular host. An explicit entry for the address
 * itself, for its exact hostname, or a hard-coded configuration entry for the
 * root domain is still honored.
 *
 * NOTE: `on-connect` records the first allowlist match in root domain, exact
 *       hostname, address order, so a Redis entry for the address or exact
 *       hostname is shadowed by the root domain match; `on-data-mx` looks
 *       those up before acting on this helper's result.
 */
function isExplicitlyAllowlistedHost(session) {
  if (!session?.isAllowlisted) return false;

  const value =
    typeof session.allowlistValue === 'string'
      ? session.allowlistValue.toLowerCase()
      : '';

  if (!value) return true;

  if (
    value === session.remoteAddress ||
    (isSANB(session.resolvedClientHostname) &&
      value === session.resolvedClientHostname.toLowerCase())
  )
    return true;

  return config.allowlist.has(value) || config.truthSources.has(value);
}

/**
 * Detects unauthenticated mail injected straight from a cloud or hosting
 * address that still carries the provider's generated reverse DNS hostname,
 * by a client that greets with the legacy "HELO" command *as the From domain*,
 * while neither SPF, DKIM, DMARC, nor a trusted ARC chain ties that domain to
 * the host.
 *
 * Every condition is required because each occurs legitimately on its own:
 *
 * - Generic reverse DNS (e.g. 60.140.196.35.bc.googleusercontent.com) is the
 *   default for every cloud VM, and legitimate mail servers are sometimes run
 *   without a custom PTR record.
 * - Unauthenticated mail (no From-aligned SPF/DKIM pass, no DMARC pass) is
 *   still accepted from senders that publish no enforcing DMARC policy.
 * - Legacy "HELO" (instead of "EHLO") is valid SMTP, although every current
 *   MTA and mail library has greeted with "EHLO" since ESMTP (RFC 1869, 1995).
 * - A HELO name in the From domain is exactly what a correctly configured
 *   server presents; it is only suspicious when nothing else backs it up.
 *   Requiring it keeps legacy devices and scripts that greet with their own
 *   hostname, an IP literal or "localhost" outside this rule.
 *
 * The From domain being allowlisted is intentionally not an exemption: the
 * message carries no authentication for that domain, so a reputable From
 * domain here is an impersonation target rather than a trust signal.
 *
 * Authentication inputs come only from mailauth-populated session fields, not
 * sender-supplied headers, and message content is intentionally ignored. Any
 * DNS error during authentication makes the message ineligible (fail open).
 *
 * @param {object} session - MX session populated by on-connect,
 *   update-session, and is-authenticated-message
 * @returns {boolean}
 */
function isHighConfidenceGenericRdnsSpam(session) {
  if (
    !session ||
    isExplicitlyAllowlistedHost(session) ||
    hasTrustedSenderIdentity(session) ||
    hasMeaningfulSpfPass(session.spfFromHeader) ||
    hasMeaningfulSpfPass(session.spf) ||
    hasInconclusiveAuthentication(session) ||
    session.hasSameHostnameAsFrom !== false ||
    session.openingCommand !== 'HELO' ||
    !isHeloAlignedWithFrom(session)
  )
    return false;

  return isGenericReverseHostname(
    session.resolvedClientHostname,
    session.remoteAddress
  );
}

module.exports = isHighConfidenceGenericRdnsSpam;
module.exports.isExplicitlyAllowlistedHost = isExplicitlyAllowlistedHost;
module.exports.isHeloAlignedWithFrom = isHeloAlignedWithFrom;
module.exports.isHighConfidenceGenericRdnsSpam =
  isHighConfidenceGenericRdnsSpam;
module.exports.isPermissiveSpfRecord = isPermissiveSpfRecord;
