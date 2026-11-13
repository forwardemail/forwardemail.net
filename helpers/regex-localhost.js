/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ipaddr = require('ipaddr.js');

/**
 * Return true when an IP literal is not globally routable.  `ipaddr.process()`
 * canonicalizes IPv4-mapped IPv6 forms (including hexadecimal and expanded
 * forms) to IPv4 before range classification, which prevents textual IPv6
 * representations from bypassing private-address safeguards.
 *
 * @param {string} value IP literal, optionally enclosed in brackets
 * @returns {boolean} whether the address is private, reserved, or otherwise
 * non-public
 */
function isNonPublicIPAddress(value) {
  if (typeof value !== 'string') return false;

  const host = value.trim().replace(/^\[|]$/g, '');
  if (!host || !ipaddr.isValid(host)) return false;

  const address = ipaddr.process(host);

  // The deprecated IPv4-compatible form of an IPv4 address (::/96, e.g.
  // ::7f00:1 for 127.0.0.1) is not a public address either, and ipaddr.js
  // classifies it as unicast.
  if (
    address.kind() === 'ipv6' &&
    address.parts.slice(0, 6).every((part) => part === 0)
  )
    return true;

  // `unicast` is the only range accepted for outbound connections.  This
  // fail-closed policy blocks loopback, private, link-local, CGNAT,
  // benchmarking, documentation, multicast, unspecified, reserved, and
  // IPv4-mapped forms of those ranges.
  return address.range() !== 'unicast';
}

// Preserve the historic `.test(value)` interface for all existing consumers
// while making every check use canonical IP classification instead of regexes.
const regexLocalhost = {
  test: isNonPublicIPAddress,
  isNonPublicIPAddress
};

module.exports = Object.freeze(regexLocalhost);
