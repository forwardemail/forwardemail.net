/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ipaddr = require('ipaddr.js');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const i18n = require('#helpers/i18n');
const isForwardConfirmedRdns = require('#helpers/is-forward-confirmed-rdns');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');

/**
 * Extract hostname from Referer/Referrer header URL
 * @param {string} referer - The Referer header value
 * @returns {string|null} - Extracted hostname or null
 */
function extractRefererHostname(referer) {
  if (!isSANB(referer)) return null;

  try {
    const url = new URL(referer);
    return url.hostname.toLowerCase();
  } catch {
    // If not a valid URL, return null
    return null;
  }
}

/**
 * Create a Boom forbidden error with a translated, descriptive message for denylist blocks.
 * The message includes the blocked value and the support email address so users know
 * what was blocked and how to request removal.
 * @param {string} value - The denylisted value (IP, hostname, email, domain, referer)
 * @param {string} [locale] - BCP 47 locale string for translation (defaults to i18n default)
 * @returns {Boom.Boom}
 */
function createDenylistError(value, locale) {
  const message = i18n.translateError(
    'DENYLIST_BLOCKED_REQUEST',
    locale || i18n.config.defaultLocale,
    value,
    config.supportEmail
  );
  const err = Boom.forbidden(message);
  // Store the denylisted value for logging/debugging
  err.denylistValue = value.toLowerCase();
  return err;
}

/**
 * Check if a value is in the denylist
 * @param {string} value - Value to check
 * @returns {boolean}
 */
function isInDenylist(value) {
  return config.denylist.has(value);
}

/**
 * Check referer header against denylist
 * @param {Object} ctx - Koa context
 * @throws {Boom.Boom} if referer is denylisted
 */
function checkReferer(ctx) {
  const referer = ctx.get('referer') || ctx.get('referrer');
  if (!referer) return;

  const refererHostname = extractRefererHostname(referer);
  if (!refererHostname) return;

  const locale = ctx.locale || i18n.config.defaultLocale;

  // Check referer hostname against denylist
  if (isInDenylist(refererHostname)) {
    throw createDenylistError(refererHostname, locale);
  }

  // Check referer root domain against denylist
  const refererRootDomain = parseRootDomain(refererHostname);
  if (
    refererRootDomain !== refererHostname &&
    isInDenylist(refererRootDomain)
  ) {
    throw createDenylistError(refererRootDomain, locale);
  }
}

/**
 * Check IP address against denylist
 * @param {Object} ctx - Koa context
 * @throws {Boom.Boom} if IP is denylisted
 */
function checkIP(ctx) {
  if (isInDenylist(ctx.request.ip)) {
    const locale = ctx.locale || i18n.config.defaultLocale;
    throw createDenylistError(ctx.request.ip, locale);
  }
}

/**
 * Check user email against denylist (if authenticated)
 * @param {Object} ctx - Koa context
 * @throws {Boom.Boom} if user email or domain is denylisted
 */
function checkUserEmail(ctx) {
  if (!ctx.state?.user?.email) return;

  const userEmail = ctx.state.user.email.toLowerCase().trim();
  const locale = ctx.locale || i18n.config.defaultLocale;

  // Check email address
  if (isInDenylist(userEmail)) {
    throw createDenylistError(userEmail, locale);
  }

  // Check email domain and root domain
  try {
    const emailDomain = parseHostFromDomainOrAddress(userEmail);
    if (isInDenylist(emailDomain)) {
      throw createDenylistError(emailDomain, locale);
    }

    const emailRootDomain = parseRootDomain(emailDomain);
    if (emailRootDomain !== emailDomain && isInDenylist(emailRootDomain)) {
      throw createDenylistError(emailRootDomain, locale);
    }
  } catch (err) {
    // Only rethrow if it's a Boom error (our denylist error)
    if (err.isBoom) throw err;
    // Ignore other parsing errors
  }
}

/**
 * Check resolved client hostname against denylist
 * @param {string} clientHostname - Resolved client hostname from PTR lookup
 * @param {string} [locale] - BCP 47 locale string for translation
 * @throws {Boom.Boom} if hostname is denylisted
 * @returns {string|null} - Root client hostname if valid FQDN
 */
function checkClientHostname(clientHostname, locale) {
  if (!isFQDN(clientHostname)) return null;

  const resolvedLocale = locale || i18n.config.defaultLocale;

  // Check resolved client hostname against denylist
  if (isInDenylist(clientHostname)) {
    throw createDenylistError(clientHostname, resolvedLocale);
  }

  // Check resolved root client hostname against denylist
  const rootClientHostname = parseRootDomain(clientHostname);
  if (
    rootClientHostname !== clientHostname &&
    isInDenylist(rootClientHostname)
  ) {
    throw createDenylistError(rootClientHostname, resolvedLocale);
  }

  return rootClientHostname;
}

//
// Reverse (PTR) lookups for client IP addresses.
//
// A PTR lookup used to be awaited (for up to 3s) on every web request before
// anything rendered. Tangerine only caches NOERROR answers, so an IP with no
// PTR record (NXDOMAIN) or a broken reverse zone (SERVFAIL, timeouts) paid a
// fresh DNS-over-HTTPS round trip on every page view. That is the normal case
// for mobile carriers (CGNAT pools and IPv6 ranges rarely have PTR records),
// and it was the largest single contributor to mobile TTFB.
//
// Results are memoized per IP and concurrent lookups for the same IP are
// shared:
// - a PTR hostname is kept for an hour
// - "no PTR record" (ENOTFOUND/ENODATA) is kept for ten minutes
// - a transient failure (SERVFAIL, timeout) is kept for 30 seconds, and never
//   replaces a hostname the IP resolved to before (the last good answer is
//   served instead), so a DNS blip cannot drop an allowlisted host's FCrDNS
//   match and rate limit or deny our own servers
//
// The web app additionally passes `safeMethodBudgetMs`: GET/HEAD/OPTIONS then
// wait at most that long for an uncached answer, and the lookup keeps running
// in the background so the next request from that IP is answered from memory.
// Unsafe methods (POST/PUT/PATCH/DELETE) always wait for the full answer, so
// every state-changing request is checked against the denylist and the FCrDNS
// allowlist exactly as before. The API, CalDAV and CardDAV servers do not pass
// a budget, so they always wait (internal endpoints key off the allowlist).
//
const PTR_TIMEOUT_MS = 3000;
const PTR_SAFE_METHOD_BUDGET_MS = 150;
const PTR_POSITIVE_TTL_MS = 60 * 60 * 1000;
const PTR_NOT_FOUND_TTL_MS = 10 * 60 * 1000;
const PTR_TRANSIENT_TTL_MS = 30 * 1000;
const PTR_MEMO_MAX_ENTRIES = 50_000;
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const NOT_FOUND_CODES = new Set(['ENOTFOUND', 'ENODATA']);

const ptrMemo = new Map();
const ptrInflight = new Map();

// Returns the memoized hostname (string or null), or undefined when there is
// no fresh entry. Expired entries are kept (until evicted) so a transient
// failure can fall back to the last good hostname.
function getMemoizedPtr(ip) {
  const entry = ptrMemo.get(ip);
  if (!entry || entry.expires <= Date.now()) return undefined;
  return entry.hostname;
}

function setMemoizedPtr(ip, hostname, ttl) {
  // Map keeps insertion order: re-insert so the oldest entry is first
  ptrMemo.delete(ip);
  if (ptrMemo.size >= PTR_MEMO_MAX_ENTRIES)
    ptrMemo.delete(ptrMemo.keys().next().value);
  ptrMemo.set(ip, { hostname, expires: Date.now() + ttl });
}

/**
 * Resolve the first PTR hostname for an IP (or null), memoizing the result.
 * Never rejects: DNS errors and timeouts resolve to null (or to the last good
 * hostname for transient failures).
 * @param {Object} resolver - Tangerine instance (or anything with `reverse`)
 * @param {string} ip - Client IP address
 * @param {Object} [logger] - Logger for unexpected errors
 * @returns {Promise<string|null>}
 */
function reverseLookup(resolver, ip, logger) {
  const memoized = getMemoizedPtr(ip);
  if (memoized !== undefined) return Promise.resolve(memoized);

  const inflight = ptrInflight.get(ip);
  if (inflight) return inflight;

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), PTR_TIMEOUT_MS);
  const promise = (async () => {
    try {
      const [hostname] = await resolver.reverse(ip, abortController);
      if (isFQDN(hostname)) {
        setMemoizedPtr(ip, hostname, PTR_POSITIVE_TTL_MS);
        return hostname;
      }

      setMemoizedPtr(ip, null, PTR_NOT_FOUND_TTL_MS);
      return null;
    } catch (err) {
      if (err && NOT_FOUND_CODES.has(err.code)) {
        setMemoizedPtr(ip, null, PTR_NOT_FOUND_TTL_MS);
        return null;
      }

      // SERVFAIL, timeouts, aborts: expected occasionally, logged if odd
      if (logger && err && !err.code && err.name !== 'AbortError')
        logger.warn(err);
      const previous = ptrMemo.get(ip);
      const hostname = previous && previous.hostname ? previous.hostname : null;
      setMemoizedPtr(ip, hostname, PTR_TRANSIENT_TTL_MS);
      return hostname;
    } finally {
      clearTimeout(timeout);
      ptrInflight.delete(ip);
    }
  })();

  ptrInflight.set(ip, promise);
  return promise;
}

/**
 * Get the client hostname for a request.
 * With a `budgetMs`, safe methods resolve to `undefined` if the lookup is not
 * answered in time (it continues in the background and is memoized).
 * @param {Object} ctx - Koa context
 * @param {number} [budgetMs] - Max wait for GET/HEAD/OPTIONS
 * @returns {Promise<string|null|undefined>}
 */
async function getClientHostname(ctx, budgetMs) {
  const lookup = reverseLookup(ctx.resolver, ctx.request.ip, ctx.logger);
  if (!budgetMs || !SAFE_METHODS.has(ctx.method)) return lookup;

  let timer;
  const budget = new Promise((resolve) => {
    timer = setTimeout(resolve, budgetMs);
  });
  try {
    return await Promise.race([lookup, budget]);
  } finally {
    clearTimeout(timer);
  }
}

function clearPtrMemo() {
  ptrMemo.clear();
  ptrInflight.clear();
}

/**
 * Denylist middleware for Koa
 * Checks referer, IP, user email, and resolved hostname against denylist
 * Also handles IPv6 to IPv4 conversion and PTR lookup for allowlist
 *
 * @param {Array} ratelimitAllowlist - Array of hostnames to allowlist for rate limiting
 * @param {Object} [options]
 * @param {number} [options.safeMethodBudgetMs] - Max wait for the PTR lookup on
 *   GET/HEAD/OPTIONS (web only; omit to always wait for the full answer)
 * @returns {Function} Koa middleware function
 */
function denylistMiddleware(ratelimitAllowlist = [], options = {}) {
  const { safeMethodBudgetMs } = options;
  return async (ctx, next) => {
    // Convert local IPv6 addresses to IPv4 format
    // <https://blog.apify.com/ipv4-mapped-ipv6-in-nodejs/>
    if (ipaddr.isValid(ctx.request.ip)) {
      const addr = ipaddr.parse(ctx.request.ip);
      if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress())
        ctx.request.ip = addr.toIPv4Address().toString();
    }

    //
    // Check Referer header against denylist
    // (e.g. block requests from "https://fe-bounces.daxiaym.com/en")
    //
    checkReferer(ctx);

    //
    // Check IP address against denylist
    //
    checkIP(ctx);

    //
    // Check user email and email domain against denylist (if authenticated)
    //
    checkUserEmail(ctx);

    // If we need to allowlist certain IP which resolve to our hostnames
    if (ctx.resolver) {
      try {
        // Memoized; with a budget, safe methods do not wait on cold lookups
        const clientHostname = await getClientHostname(ctx, safeMethodBudgetMs);

        if (isFQDN(clientHostname)) {
          // Store resolved hostnames on context for downstream use
          ctx.resolvedClientHostname = clientHostname;
          const rootClientHostname = checkClientHostname(
            clientHostname,
            ctx.locale
          );
          ctx.resolvedRootClientHostname = rootClientHostname;

          //
          // Check allowlist for rate limiting -- only for a forward-confirmed
          // reverse hostname (FCrDNS). `ctx.allowlistValue` turns off rate
          // limiting entirely (`config.rateLimit.id` returns `false`) and
          // gates internal endpoints (e.g. API inquiries from our MX hosts),
          // and a bare PTR record is attacker-controlled. The denylist check
          // above intentionally still uses the raw PTR: a spoofed value there
          // can only hurt the party that spoofed it.
          //
          if (
            (ratelimitAllowlist.includes(clientHostname) ||
              ratelimitAllowlist.includes(rootClientHostname)) &&
            // Maximum of 3s for the forward lookup (same bound as the PTR lookup)
            (await isForwardConfirmedRdns(
              ctx.resolver,
              clientHostname,
              ctx.request.ip,
              { timeout: 3000 }
            ))
          )
            ctx.allowlistValue = ratelimitAllowlist.includes(clientHostname)
              ? clientHostname
              : rootClientHostname;
        }
      } catch (err) {
        // Rethrow Boom errors (denylist errors), warn on other errors
        if (err.isBoom) throw err;
        ctx.logger.warn(err);
      }
    }

    return next();
  };
}

module.exports = denylistMiddleware;
module.exports.extractRefererHostname = extractRefererHostname;
module.exports.checkReferer = checkReferer;
module.exports.checkIP = checkIP;
module.exports.checkUserEmail = checkUserEmail;
module.exports.checkClientHostname = checkClientHostname;
module.exports.createDenylistError = createDenylistError;
module.exports.isInDenylist = isInDenylist;
module.exports.reverseLookup = reverseLookup;
module.exports.getClientHostname = getClientHostname;
module.exports.clearPtrMemo = clearPtrMemo;
module.exports.PTR_SAFE_METHOD_BUDGET_MS = PTR_SAFE_METHOD_BUDGET_MS;
