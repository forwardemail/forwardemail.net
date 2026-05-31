/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * FWD-01-002, FWD-01-006: SSRF-safe HTTP fetch with DNS pinning.
 *
 * Resolves the hostname to an IP ONCE, validates it is not a private/internal
 * address, then makes the HTTP request using the pinned IP via a one-shot
 * undici Agent with a custom `connect.lookup` callback. This eliminates the
 * TOCTOU window between DNS validation and the actual connection.
 *
 * TLS certificate validation is preserved because undici still uses the
 * original hostname for SNI — only the underlying socket connection is
 * directed to the pinned IP.
 */

const dns = require('node:dns');
const net = require('node:net');

const undici = require('undici');

const { isPrivateHostResolved } = require('#helpers/is-private-host');

/**
 * Perform an HTTP request with DNS pinning to prevent SSRF via DNS rebinding.
 *
 * @param {string} url - The full URL to fetch
 * @param {object} [options] - undici request options (method, headers, bodyTimeout, etc.)
 * @returns {Promise<{statusCode: number, headers: object, body: object}>}
 * @throws {Error} If the hostname resolves to a private IP or DNS fails
 */
async function safeFetch(url, options = {}) {
  const parsed = new URL(url);
  const { hostname } = parsed;

  // Resolve DNS to get the actual IP
  let pinnedIP;
  if (net.isIPv4(hostname) || net.isIPv6(hostname)) {
    pinnedIP = hostname;
  } else {
    const resolver = new dns.promises.Resolver({ timeout: 5000, tries: 2 });
    const addresses = await resolver.resolve4(hostname);
    if (!addresses || addresses.length === 0) {
      throw new Error(`DNS resolution failed for ${hostname}`);
    }

    pinnedIP = addresses[0];
  }

  // Validate the resolved IP is not private/internal
  if (await isPrivateHostResolved(pinnedIP)) {
    throw new Error(`Resolved IP for ${hostname} is a private address`);
  }

  // Create a one-shot Agent with DNS pinned via connect.lookup.
  // undici v7 requires connect options to be passed via a dispatcher (Agent),
  // not directly to undici.request(). Node 22 calls lookup with {all:true}
  // expecting an array of [{address, family}].
  const family = net.isIPv6(pinnedIP) ? 6 : 4;
  const agent = new undici.Agent({
    connect: {
      lookup(_hostname, lookupOptions, cb) {
        if (lookupOptions.all) {
          cb(null, [{ address: pinnedIP, family }]);
        } else {
          cb(null, pinnedIP, family);
        }
      }
    },
    connections: 1
  });

  try {
    return await undici.request(url, {
      ...options,
      dispatcher: agent
    });
  } finally {
    // Close the agent after the request completes to avoid leaking sockets.
    // We don't await this — the response body stream is still readable.
    agent.close();
  }
}

module.exports = safeFetch;
