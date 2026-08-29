/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dns = require('node:dns');
const { isIP } = require('node:net');

const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const config = require('#config');

/**
 * Check whether a hostname or IP literal is private/internal and must never be
 * used as an outbound connection target.
 *
 * IP literals are classified canonically by `regex-localhost`'s ipaddr.js
 * implementation.  This is deliberately not a textual regular-expression
 * check: IPv4-mapped IPv6 addresses have many equivalent spellings.
 *
 * @param {string} hostname hostname or IP literal
 * @returns {boolean} true if the value is private/internal/reserved
 */
function isPrivateHost(hostname) {
  if (typeof hostname !== 'string' || !hostname.trim()) return true;

  // Strip brackets from IPv6 literals and normalize a DNS trailing dot.
  const host = hostname
    .trim()
    .replace(/^\[|]$/g, '')
    .replace(/\.$/, '')
    .toLowerCase();

  // Canonically classify IPv4, IPv6, and IPv4-mapped IPv6 address literals.
  if (REGEX_LOCALHOST.test(host)) return true;

  // Block reserved/test domains and cloud metadata hostnames before resolution.
  const parts = host.split('.');
  const tld = parts.at(-1);
  if (config.testDomains.includes(tld)) return true;
  if (config.testDomains.includes(parts[0])) return true;

  return false;
}

/**
 * Async check which also resolves DNS answers to prevent SSRF through a public
 * hostname that resolves to a non-public address.  Callers should use this
 * before outbound HTTP, SMTP, and storage connections.
 *
 * @param {string} hostname hostname or IP literal
 * @param {object} [resolver] optional Tangerine-compatible resolver
 * @returns {Promise<boolean>} true when the target must be blocked
 */
async function isPrivateHostResolved(hostname, resolver) {
  if (isPrivateHost(hostname)) return true;

  const host = hostname
    .trim()
    .replace(/^\[|]$/g, '')
    .replace(/\.$/, '');

  // Any remaining valid IP literal is canonical public unicast because
  // isPrivateHost() above rejects every non-public range.  Use Node's parser
  // instead of a character-class regex so hostnames such as "face" cannot
  // evade DNS resolution and its fail-closed address validation.
  if (isIP(host)) return false;

  try {
    const r =
      resolver || new dns.promises.Resolver({ timeout: 5000, tries: 2 });
    const [addresses4, addresses6] = await Promise.all([
      r.resolve4(host).catch(() => []),
      r.resolve6(host).catch(() => [])
    ]);

    const addresses = [...addresses4, ...addresses6];
    // DNS lookup failure or an empty answer is fail-closed.  A target cannot be
    // safely connected when its complete address set has not been inspected.
    if (addresses.length === 0) return true;

    return addresses.some((address) => isPrivateHost(address));
  } catch {
    // DNS resolution errors must not turn into an outbound connection attempt.
    return true;
  }
}

module.exports = isPrivateHost;
module.exports.isPrivateHostResolved = isPrivateHostResolved;
