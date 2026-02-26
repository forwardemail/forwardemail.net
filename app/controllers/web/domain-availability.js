/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isFQDN = require('is-fqdn');
const ms = require('ms');
const pTimeout = require('p-timeout');

// dynamically import @forwardemail/whois-rdap (ESM package)
// <https://github.com/cleandns-inc/tool-whois>
let whois;
import('@forwardemail/whois-rdap').then((obj) => {
  whois = obj.whois;
});

const WHOIS_TIMEOUT = ms('30s');

// TLDs whose WHOIS servers are frequently unreachable or return unreliable
// results.  Availability checks for these TLDs will be skipped and the domain
// will be conservatively reported as "not available" to avoid false results.
const UNRELIABLE_TLDS = new Set([
  'co', // whois.nic.co — DNS resolution frequently fails
  'co.in' // whois.registry.in — DNS resolution frequently fails
]);

/**
 * Extract the effective TLD from a domain name.
 * e.g. "example.co.in" → "co.in", "example.com" → "com"
 */
function getTld(domain) {
  const parts = domain.split('.');
  if (parts.length >= 3) {
    const twoLevel = parts.slice(-2).join('.');
    if (UNRELIABLE_TLDS.has(twoLevel)) return twoLevel;
  }

  return parts.slice(-1)[0];
}

/**
 * Detect when the whois library returns found=true but the domain is actually
 * available.  This happens with certain ccTLD WHOIS servers (.io, .me, .com.au)
 * whose port-43 responses don't match the library's "not found" patterns.
 *
 * A genuinely registered domain always has at least one of:
 *   - a non-empty status array
 *   - one or more nameservers
 *   - a registrar name
 *   - at least one timestamp (created, updated, or expires)
 *
 * If ALL of these are empty/null the WHOIS response is a "thin shell" and the
 * domain is almost certainly available for registration.
 */
function isEmptyWhoisResult(result) {
  const hasStatus = Array.isArray(result.status) && result.status.length > 0;
  const hasNameservers =
    Array.isArray(result.nameservers) && result.nameservers.length > 0;
  const hasRegistrar =
    result.registrar &&
    (result.registrar.name ||
      (result.registrar.id && result.registrar.id !== 0));
  const hasTimestamp =
    result.ts && (result.ts.created || result.ts.updated || result.ts.expires);

  return !hasStatus && !hasNameservers && !hasRegistrar && !hasTimestamp;
}

// POST /domain-availability
// body: { domainName: 'example.com' }
// response: { found: boolean, available: boolean, domain: string, message: string }
//   found: true  = domain is registered (not available)
//   found: false = domain is available for registration
module.exports = async (ctx) => {
  const { domainName } = ctx.request.body;

  if (!domainName)
    throw Boom.badRequest(ctx.translateError('DOMAIN_NAME_REQUIRED'));

  const name = domainName.trim().toLowerCase();

  if (!isFQDN(name))
    throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));

  // Skip TLDs with unreliable WHOIS servers
  if (UNRELIABLE_TLDS.has(getTld(name))) {
    ctx.body = {
      found: true,
      available: false,
      domain: name,
      message: ctx.translate('DOMAIN_NOT_AVAILABLE', name)
    };
    return;
  }

  if (!whois)
    throw Boom.serverUnavailable(ctx.translateError('WHOIS_UNAVAILABLE'));

  try {
    const result = await pTimeout(whois(name), WHOIS_TIMEOUT);

    // 1. Server errors (5xx) → conservatively treat as registered.
    //    Note: 404 is the normal RDAP response for an available domain.
    const hasServerError = result.statusCode && result.statusCode >= 500;

    // 2. Some ccTLD WHOIS servers (.io, .me, .com.au) return found=true even
    //    for unregistered domains.  Detect this by checking whether the
    //    response is completely empty (no status, nameservers, registrar, or
    //    timestamps).  A genuinely registered domain always has at least one
    //    of these fields populated.
    const emptyResult = result.found && isEmptyWhoisResult(result);

    const isAvailable = !hasServerError && (!result.found || emptyResult);

    ctx.body = {
      found: hasServerError ? true : emptyResult ? false : result.found,
      available: isAvailable,
      domain: name,
      message: isAvailable
        ? ctx.translate('DOMAIN_AVAILABLE', name)
        : ctx.translate('DOMAIN_NOT_AVAILABLE', name)
    };
  } catch (err) {
    // if WHOIS lookup fails or times out, we conservatively assume the domain is taken
    ctx.body = {
      found: true,
      available: false,
      domain: name,
      message: err.message
    };
  }
};
