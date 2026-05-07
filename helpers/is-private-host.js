/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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

module.exports = isPrivateHost;
