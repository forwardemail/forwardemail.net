/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ipaddr = require('ipaddr.js');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
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
 * Create a Boom forbidden error with consistent message format for denylist
 * @param {string} type - Type of value (referer, IP, hostname, email, domain)
 * @param {string} value - The denylisted value
 * @returns {Boom.Boom}
 */
function createDenylistError(type, value) {
  const message = `The ${type} ${value} is denylisted by ${
    config.urls.web
  }. To request removal, please visit ${
    config.urls.web
  }/denylist?q=${encodeURIComponent(value)} or contact us at ${
    config.supportEmail
  }.`;
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

  // Check referer hostname against denylist
  if (isInDenylist(refererHostname)) {
    throw createDenylistError('referer', refererHostname);
  }

  // Check referer root domain against denylist
  const refererRootDomain = parseRootDomain(refererHostname);
  if (
    refererRootDomain !== refererHostname &&
    isInDenylist(refererRootDomain)
  ) {
    throw createDenylistError('referer', refererRootDomain);
  }
}

/**
 * Check IP address against denylist
 * @param {Object} ctx - Koa context
 * @throws {Boom.Boom} if IP is denylisted
 */
function checkIP(ctx) {
  if (isInDenylist(ctx.request.ip)) {
    throw createDenylistError('IP', ctx.request.ip);
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

  // Check email address
  if (isInDenylist(userEmail)) {
    throw createDenylistError('email', userEmail);
  }

  // Check email domain and root domain
  try {
    const emailDomain = parseHostFromDomainOrAddress(userEmail);
    if (isInDenylist(emailDomain)) {
      throw createDenylistError('domain', emailDomain);
    }

    const emailRootDomain = parseRootDomain(emailDomain);
    if (emailRootDomain !== emailDomain && isInDenylist(emailRootDomain)) {
      throw createDenylistError('domain', emailRootDomain);
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
 * @throws {Boom.Boom} if hostname is denylisted
 * @returns {string|null} - Root client hostname if valid FQDN
 */
function checkClientHostname(clientHostname) {
  if (!isFQDN(clientHostname)) return null;

  // Check resolved client hostname against denylist
  if (isInDenylist(clientHostname)) {
    throw createDenylistError('hostname', clientHostname);
  }

  // Check resolved root client hostname against denylist
  const rootClientHostname = parseRootDomain(clientHostname);
  if (
    rootClientHostname !== clientHostname &&
    isInDenylist(rootClientHostname)
  ) {
    throw createDenylistError('hostname', rootClientHostname);
  }

  return rootClientHostname;
}

/**
 * Denylist middleware for Koa
 * Checks referer, IP, user email, and resolved hostname against denylist
 * Also handles IPv6 to IPv4 conversion and PTR lookup for allowlist
 *
 * @param {Array} ratelimitAllowlist - Array of hostnames to allowlist for rate limiting
 * @returns {Function} Koa middleware function
 */
function denylistMiddleware(ratelimitAllowlist = []) {
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
        // Maximum of 3s before ac times out
        const abortController = new AbortController();
        const timeout = setTimeout(() => abortController.abort(), 3000);
        const [clientHostname] = await ctx.resolver.reverse(
          ctx.request.ip,
          abortController
        );
        clearTimeout(timeout);

        if (isFQDN(clientHostname)) {
          // Store resolved hostnames on context for downstream use
          ctx.resolvedClientHostname = clientHostname;
          const rootClientHostname = checkClientHostname(clientHostname);
          ctx.resolvedRootClientHostname = rootClientHostname;

          // Check allowlist for rate limiting
          if (ratelimitAllowlist.includes(clientHostname))
            ctx.allowlistValue = clientHostname;
          else if (ratelimitAllowlist.includes(rootClientHostname))
            ctx.allowlistValue = rootClientHostname;
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
