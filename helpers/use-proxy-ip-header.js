/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const isSANB = require('is-string-and-not-blank');

//
// Behind a proxy such as Cloudflare, the visitor's IP address is not the one
// on the socket (that is the proxy's) -- it arrives in a forwarded header.
// `@ladjs/web` turns on Koa's `app.proxy` when `TRUST_PROXY` is set, which
// makes `ctx.ip` read `X-Forwarded-For`; but any client can send an
// `X-Forwarded-For`, and a request that reaches the origin directly could
// put a forged address at the front of it, which `ctx.ip` would then trust.
//
// So `WEB_PROXY_IP_HEADER` names the header the proxy sets to the real
// visitor and overwrites on every request -- Cloudflare's `CF-Connecting-IP`
// -- and `ctx.ip` reads that instead, which no client can spoof through the
// proxy. Rate limiting, greylisting and the allow/deny lists then key off
// the visitor rather than the proxy.
//
// This is only trustworthy when the origin accepts connections solely from
// the proxy (its firewall allows only the proxy's addresses, and/or it
// requires the proxy's client certificate); otherwise a direct connection
// can still set the header to anything. The forwarded IP and the HTTP/2
// server both depend on that same origin lock.
//
function useProxyIpHeader(web) {
  if (web?.app && isSANB(process.env.WEB_PROXY_IP_HEADER))
    web.app.proxyIpHeader = process.env.WEB_PROXY_IP_HEADER;
  return web;
}

module.exports = useProxyIpHeader;
