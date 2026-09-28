/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ipaddr = require('ipaddr.js');

//
// The key an IP address is counted under for per-client limits (request
// rate limits, failed authentication lockouts, concurrent connections).
//
// An IPv6 client is normally given a whole /64 (a home connection, a phone,
// a VM), and every address in it is its own: keying a limit on the full
// /128 lets one client take 2^64 fresh buckets simply by changing the low
// bits of its source address.  So IPv6 addresses count per /64, and IPv4
// addresses (including IPv4-mapped IPv6 such as ::ffff:192.0.2.1, which is
// the same client) count per address.  Anything that is not an IP address
// is returned unchanged.
//
function getIpBucket(address) {
  if (typeof address !== 'string' || address === '') return address;

  let parsed;
  try {
    parsed = ipaddr.process(address);
  } catch {
    return address;
  }

  if (parsed.kind() === 'ipv4') return parsed.toString();

  const parts = parsed.toNormalizedString().split(':').slice(0, 4);
  return `${parts.map((part) => part.padStart(4, '0')).join(':')}::/64`;
}

module.exports = getIpBucket;
