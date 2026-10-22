/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Behind a proxy (e.g. Cloudflare) the web server must key rate limiting and
// the allow/deny lists off the real visitor IP, which arrives in a forwarded
// header, not off the proxy's socket address -- and it must not trust an
// address a client forged in X-Forwarded-For. `WEB_PROXY_IP_HEADER` points
// `ctx.ip` at the header the proxy overwrites on every request.
//
const http = require('node:http');
const process = require('node:process');
const { once } = require('node:events');

const Koa = require('koa');
const test = require('ava');

const useProxyIpHeader = require('#helpers/use-proxy-ip-header');

// a running Koa app whose single route reports the IP the app resolved,
// configured the way web.js configures the web server behind a proxy
async function ipServer(t, { proxy = true } = {}) {
  const app = new Koa();
  app.proxy = proxy;
  useProxyIpHeader({ app });
  app.use((ctx) => {
    ctx.body = ctx.ip;
  });
  const server = http.createServer(app.callback());
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.teardown(() => server.close());
  return server.address().port;
}

async function getIp(port, headers) {
  const res = await fetch(`http://127.0.0.1:${port}/`, { headers });
  return res.text();
}

test.serial(
  'the helper sets proxyIpHeader only when the env var is set',
  (t) => {
    delete process.env.WEB_PROXY_IP_HEADER;
    const off = new Koa();
    useProxyIpHeader({ app: off });
    t.is(off.proxyIpHeader, 'X-Forwarded-For'); // koa default, untouched

    process.env.WEB_PROXY_IP_HEADER = 'CF-Connecting-IP';
    t.teardown(() => delete process.env.WEB_PROXY_IP_HEADER);
    const on = new Koa();
    const web = useProxyIpHeader({ app: on });
    t.is(on.proxyIpHeader, 'CF-Connecting-IP');
    t.is(web.app, on);
  }
);

test.serial(
  'ctx.ip reads the configured header and ignores a forged X-Forwarded-For',
  async (t) => {
    process.env.WEB_PROXY_IP_HEADER = 'CF-Connecting-IP';
    t.teardown(() => delete process.env.WEB_PROXY_IP_HEADER);
    const port = await ipServer(t);

    // the proxy sets CF-Connecting-IP to the visitor; the client also sent a
    // forged X-Forwarded-For, which must be ignored
    t.is(
      await getIp(port, {
        'cf-connecting-ip': '203.0.113.7',
        'x-forwarded-for': '1.2.3.4'
      }),
      '203.0.113.7'
    );
  }
);

test.serial(
  'without the env var the server keeps the default X-Forwarded-For behaviour',
  async (t) => {
    delete process.env.WEB_PROXY_IP_HEADER;
    const port = await ipServer(t);
    t.is(
      await getIp(port, { 'x-forwarded-for': '203.0.113.9' }),
      '203.0.113.9'
    );
  }
);
