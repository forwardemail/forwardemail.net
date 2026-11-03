/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const net = require('node:net');

//
// The address an outbound connection to `hostname` is pinned to (see
// helpers/safe-fetch.js): the hostname itself when it is an IP literal (a URL
// keeps the brackets of an IPv6 one), otherwise its first A record, or its
// first AAAA record when it has no A record (a host on IPv6 only).
//
// The caller still checks the address is not private.
//
// (the answers for a host that has no records of the type asked for)
const NO_RECORDS = new Set(['ENODATA', 'ENOTFOUND', 'ENONAME']);

async function resolvePinnedAddress(hostname, resolver) {
  const host = String(hostname).replace(/^\[|]$/g, '');
  if (net.isIP(host)) return host;

  let addresses;
  try {
    addresses = await resolver.resolve4(host);
  } catch (err) {
    // (a host without A records may have AAAA ones; any other failure, such
    // as a timeout, fails as before rather than pinning to AAAA)
    if (!NO_RECORDS.has(err?.code)) throw err;
  }

  if (Array.isArray(addresses) && addresses.length > 0) return addresses[0];

  if (typeof resolver.resolve6 === 'function') {
    try {
      addresses = await resolver.resolve6(host);
    } catch (err) {
      if (!NO_RECORDS.has(err?.code)) throw err;
    }
  }

  if (Array.isArray(addresses) && addresses.length > 0) return addresses[0];

  throw new Error(`DNS resolution failed for ${host}`);
}

module.exports = resolvePinnedAddress;
