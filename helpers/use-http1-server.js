/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const https = require('node:https');

//
// @ladjs/web serves HTTPS with `http2.createSecureServer`, and the HTTP/2
// server in Node.js v18 has use-after-free, crash and memory bugs that any
// client can reach and that were only fixed in later Node.js lines
// (CVE-2026-56848, CVE-2026-56846, CVE-2025-59465, CVE-2026-48937,
// CVE-2026-21714, the RST_STREAM use-after-free fixed in 22.23.3, and
// nghttp2 CVE-2026-27135). None of them can be fixed from JavaScript, and
// Node.js v18 is end-of-life so it will not be patched.
//
// This replaces that server, before it listens, with an HTTPS server on
// HTTP/1.1 for the same app and TLS options, which offers only "http/1.1"
// in ALPN, so no client can reach the HTTP/2 code at all. A proxy in front
// (e.g. Cloudflare) can still offer HTTP/2 to browsers and speak HTTP/1.1
// to this origin, so visitors keep HTTP/2 while the origin stays off it.
//
function useHttp1Server(web) {
  if (web?.config?.protocol !== 'https') return web;

  // (`allowHTTP1` is an HTTP/2 server option)
  const { allowHTTP1, ...ssl } = web.config.ssl || {};
  web.server = https.createServer(
    { ...ssl, ALPNProtocols: ['http/1.1'] },
    web.app.callback()
  );
  return web;
}

module.exports = useHttp1Server;
