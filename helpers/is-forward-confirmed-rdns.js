/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ipaddr = require('ipaddr.js');

//
// Forward-confirmed reverse DNS (FCrDNS).
//
// A PTR record is controlled by whoever owns the IP address, so on its own it
// proves nothing about the host: anyone who can set reverse DNS on their
// address (every major VPS and cloud provider allows this) can point it at any
// hostname they like. Several trust decisions key off the connecting client's
// reverse hostname -- the client IP passthrough and hostname allowlist in
// `on-connect.js` (which turns off greylisting, denylist and spam checks for
// the session), the reverse-DNS branch of `is-allowlisted.js` (which also
// exempts a value from the denylist), skipping the per-IP authentication
// brute-force limiter for "our own servers" (`on-auth.js`), skipping web/API
// rate limiting for allowlisted hostnames (`denylist-request.js`), and spam
// scoring that treats mail as more trustworthy when the sending host matches
// the From domain (`update-session.js`). Each of those was reachable by
// spoofing a PTR.
//
// The forward-confirmation step resolves the claimed hostname and requires the
// connecting address to be among its address records (A for an IPv4 client,
// AAAA for an IPv6 client), which the attacker cannot arrange for a hostname
// they do not control. Any lookup failure -- including the timeout below -- is
// treated as unconfirmed: this helper only ever grants privilege, so it fails
// closed.
//

//
// Default bound on the forward lookup: a legitimate sender's A/AAAA lookup
// completes in milliseconds (and is cached by Tangerine), while a slow or dead
// nameserver behind a spoofed PTR must not be able to delay connection setup
// (Tangerine's own timeout is 10s x 4 tries in production).
//
const DEFAULT_TIMEOUT_MS = 5000;

function parseIp(value) {
  if (typeof value !== 'string' || value.length === 0) return null;
  try {
    // `process()` collapses IPv4-mapped IPv6 (::ffff:1.2.3.4) to IPv4 so both
    // notations compare equal.
    return ipaddr.process(value);
  } catch {
    return null;
  }
}

//
// `options.abortController` is passed through to the resolver (Tangerine
// accepts it as the third argument); when omitted one is created that aborts
// after `options.timeout` milliseconds (default 5s).
//
async function isForwardConfirmedRdns(resolver, hostname, ip, options = {}) {
  if (
    !resolver ||
    typeof resolver.resolve4 !== 'function' ||
    typeof resolver.resolve6 !== 'function' ||
    typeof hostname !== 'string' ||
    hostname.length === 0
  )
    return false;

  const parsed = parseIp(ip);
  if (!parsed) return false;

  const target = parsed.toString();
  const resolve = parsed.kind() === 'ipv6' ? 'resolve6' : 'resolve4';

  let { abortController } = options;
  let timer;
  if (!abortController) {
    const timeout = Number.isFinite(options.timeout)
      ? options.timeout
      : DEFAULT_TIMEOUT_MS;
    if (timeout > 0) {
      abortController = new AbortController();
      timer = setTimeout(() => abortController.abort(), timeout);
    }
  }

  let addresses;
  try {
    addresses = await resolver[resolve](hostname, undefined, abortController);
  } catch {
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }

  if (!Array.isArray(addresses)) return false;

  for (const address of addresses) {
    const candidate = parseIp(
      typeof address === 'string' ? address : address?.address
    );
    if (candidate && candidate.toString() === target) return true;
  }

  return false;
}

module.exports = isForwardConfirmedRdns;
