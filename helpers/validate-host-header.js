/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

//
// Reject requests whose Host (or, behind a trusted proxy, X-Forwarded-Host)
// is not a plain `host[:port]`.
//
// koa before 3.2.1 took everything before the first ":" as `ctx.hostname`,
// so `Host: evil.com:x@example.com` made ctx.hostname "evil.com" while a
// browser or cache would read the same value as example.com
// (GHSA-7gcc-r8m5-44qm).  koa is now overridden to 3.2.1 (package.json), and
// the header is still validated once, up front: nothing here builds URLs
// from the Host header today, but rate-limit keys, redirects and cache keys
// have in the past.
//
// A hostname is letters, digits, hyphens, underscores and dots; an IPv6
// literal is bracketed hex and colons (optionally with an embedded IPv4);
// a port is digits.
//
const RE_HOST =
  /^(?:[\da-z](?:[\w-]*[\da-z])?(?:\.[\da-z](?:[\w-]*[\da-z])?)*\.?|\[[\d:a-f.]+])(?::\d{1,5})?$/i;

function isValidHost(value) {
  return (
    typeof value === 'string' && value.length <= 261 && RE_HOST.test(value)
  );
}

function validateHostHeader() {
  return function (ctx, next) {
    const headers = [ctx.get('Host')];
    if (ctx.app.proxy) {
      const forwarded = ctx.get('X-Forwarded-Host');
      if (forwarded)
        headers.push(...forwarded.split(',').map((value) => value.trim()));
    }

    // (an HTTP/1.0 request may come without a Host header at all)
    for (const value of headers) {
      if (value === '' && headers.length === 1) continue;
      if (!isValidHost(value)) throw Boom.badRequest('Invalid Host header');
    }

    return next();
  };
}

module.exports = validateHostHeader;
module.exports.isValidHost = isValidHost;
