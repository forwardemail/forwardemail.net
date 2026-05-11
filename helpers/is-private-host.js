/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dns = require('node:dns');
const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const config = require('#config');

/**
 * Check if a hostname is private/internal and should be blocked.
 * Reuses the shared REGEX_LOCALHOST helper (covers RFC 1918, loopback,
 * link-local, 0.0.0.0/8, CGNAT, benchmarking, IPv6 ::1/fc00/fe80)
 * and config.testDomains (reserved TLDs + cloud metadata hostnames).
 * @param {string} hostname - The hostname to check
 * @returns {boolean} true if the hostname is private/internal
 */
function isPrivateHost(hostname) {
  if (!hostname) return true;

  // Strip brackets from IPv6
  const host = hostname.replace(/^\[|]$/g, '');

  // Check shared REGEX_LOCALHOST (all private/reserved IP ranges)
  if (REGEX_LOCALHOST.test(host)) return true;

  // Check if TLD (or bare hostname) is a reserved/test domain
  // Covers: localhost, local, internal, test, metadata, instance-data, etc.
  const parts = host.toLowerCase().split('.');
  const tld = parts[parts.length - 1];
  if (config.testDomains.includes(tld)) return true;

  // Check full hostname against testDomains (e.g. "metadata", "instance-data")
  if (config.testDomains.includes(parts[0])) return true;

  return false;
}

/**
 * Async version that also resolves the hostname via DNS and checks
 * whether any resolved IP is private/internal.
 * Use this for outbound HTTP requests to prevent DNS rebinding attacks.
 * @param {string} hostname - The hostname to check
 * @returns {Promise<boolean>} true if the hostname is private/internal
 */
async function isPrivateHostResolved(hostname) {
  // First do the synchronous checks
  if (isPrivateHost(hostname)) return true;

  // If it's already an IP literal, no need to resolve
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false;
  if (/^[\da-f:]+$/i.test(hostname)) return false;

  // Resolve the hostname and check all returned IPs
  try {
    const resolver = new dns.promises.Resolver({ timeout: 5000, tries: 2 });
    const addresses = await resolver.resolve4(hostname).catch(() => []);
    const addresses6 = await resolver.resolve6(hostname).catch(() => []);
    const allAddresses = [...addresses, ...addresses6];

    for (const addr of allAddresses) {
      if (REGEX_LOCALHOST.test(addr)) return true;
    }
  } catch {
    // DNS resolution failed - block by default for safety
    return true;
  }

  return false;
}

module.exports = isPrivateHost;
module.exports.isPrivateHostResolved = isPrivateHostResolved;
