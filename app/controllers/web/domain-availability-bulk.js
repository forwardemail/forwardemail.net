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

const MAX_BULK = 50;
const WHOIS_TIMEOUT = ms('30s');

// POST /domain-availability/bulk
// body: { domains: ['example.com', 'example.net', ...] }
// response: { results: [{ domain, found, available, message }, ...] }
module.exports = async (ctx) => {
  const { domains } = ctx.request.body;

  if (!Array.isArray(domains) || domains.length === 0)
    throw Boom.badRequest(ctx.translateError('DOMAINS_REQUIRED'));

  if (domains.length > MAX_BULK)
    throw Boom.badRequest(ctx.translateError('TOO_MANY_DOMAINS', MAX_BULK));

  if (!whois)
    throw Boom.serverUnavailable(ctx.translateError('WHOIS_UNAVAILABLE'));

  const results = await Promise.all(
    domains.map(async (domainName) => {
      const name = String(domainName).trim().toLowerCase();
      if (!isFQDN(name)) {
        return {
          domain: name,
          found: true,
          available: false,
          message: ctx.translate('INVALID_DOMAIN')
        };
      }

      try {
        const result = await pTimeout(whois(name), WHOIS_TIMEOUT);
        return {
          domain: name,
          found: result.found,
          available: !result.found,
          message: result.found
            ? ctx.translate('DOMAIN_NOT_AVAILABLE', name)
            : ctx.translate('DOMAIN_AVAILABLE', name)
        };
      } catch (err) {
        return {
          domain: name,
          found: true,
          available: false,
          message: err.message
        };
      }
    })
  );

  ctx.body = { results };
};
