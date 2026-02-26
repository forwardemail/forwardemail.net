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

  if (!whois)
    throw Boom.serverUnavailable(ctx.translateError('WHOIS_UNAVAILABLE'));

  try {
    const result = await pTimeout(whois(name), WHOIS_TIMEOUT);
    // result.found = true  means the domain IS registered (not available)
    // result.found = false means the domain IS available
    // However, if the WHOIS lookup returned an error (e.g. statusCode >= 400
    // or an error property), treat the domain as taken to avoid false positives
    const hasError =
      result.error || (result.statusCode && result.statusCode >= 400);
    const isAvailable = !hasError && !result.found;
    ctx.body = {
      found: hasError ? true : result.found,
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
