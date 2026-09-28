/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { createRequire } = require('node:module');

const request = require('supertest');
const test = require('ava');

//
// The koa that the web and API servers run (a dependency of @ladjs/web and
// @ladjs/api, overridden to 3.2.1 in package.json) reads a Host header with
// userinfo as the host after the "@" (GHSA-7gcc-r8m5-44qm).
//
for (const name of ['@ladjs/web', '@ladjs/api']) {
  test(`${name} runs a koa that parses Host userinfo correctly`, async (t) => {
    const Koa = createRequire(require.resolve(name))('koa');
    const app = new Koa();
    app.use((ctx) => {
      ctx.body = { host: ctx.host, hostname: ctx.hostname };
    });

    const res = await request(app.callback())
      .get('/')
      .set('Host', 'evil.com:x@example.com');
    t.is(res.status, 200);
    t.deepEqual(res.body, { host: 'example.com', hostname: 'example.com' });
  });
}
