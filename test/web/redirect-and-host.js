/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);

//
// In the web app `koa-redirect-loop` (@ladjs/web) resolves redirect('back')
// before the polyfill does: to the referrer's path, and only for a referrer
// on the request's own origin.  The request is sent with the site's Host
// header so the two origins can match.
//
const { host } = new URL(config.urls.web);

function forgotPassword(web, referrer) {
  const req = web
    .post('/en/forgot-password')
    .set('Host', host)
    .set('Accept', 'text/html')
    .type('form')
    .send({ email: 'nobody-here@example.com' });
  if (referrer) req.set('Referer', referrer);
  return req;
}

test('redirect back follows a same-origin referrer', async (t) => {
  const res = await forgotPassword(
    t.context.web,
    `${config.urls.web}/en/login?x=1`
  );
  t.is(res.status, 302);
  t.is(res.headers.location, '/en/login');
});

test('redirect back never follows a referrer on another site', async (t) => {
  for (const referrer of [
    'https://evil.example/phish',
    ['javascript', 'alert(1)'].join(':'),
    `${config.urls.web}.evil.example/`,
    `//evil.example/`
  ]) {
    const res = await forgotPassword(t.context.web, referrer);
    t.is(res.status, 302);
    t.is(res.headers.location, '/en', `${referrer}`);
  }
});

test('redirect back without a referrer goes to the localized fallback', async (t) => {
  const res = await forgotPassword(t.context.web);
  t.is(res.status, 302);
  t.is(res.headers.location, '/en');
});

test('rejects a malformed Host header', async (t) => {
  for (const host of [
    'evil.example:x@example.com',
    'evil.example@example.com',
    'example.com/path',
    'exa mple.com',
    'example.com:port'
  ]) {
    const res = await t.context.web.get('/en/about').set('Host', host);
    t.is(res.status, 400, `${host}`);
  }

  for (const host of [
    'example.com',
    'example.com:3000',
    '127.0.0.1:3000',
    '[::1]:3000'
  ]) {
    const res = await t.context.web.get('/en/about').set('Host', host);
    t.is(res.status, 200, `${host}`);
  }
});

//
// The polyfill on its own (the API app has no koa-redirect-loop).
//
test('the redirect back polyfill only follows referrers on allowed origins', async (t) => {
  const http = require('node:http');
  const Koa = require('koa');
  const koaRedirectBackPolyfill = require('#helpers/koa-redirect-back-polyfill');

  const app = new Koa();
  app.use(
    koaRedirectBackPolyfill({
      fallbackUrl: '/fallback',
      allowedOrigins: ['https://example.com']
    })
  );
  app.use((ctx) => {
    ctx.redirect('back');
  });
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());
  const { port } = server.address();

  async function back(referrer) {
    const res = await fetch(`http://127.0.0.1:${port}/`, {
      redirect: 'manual',
      headers: referrer ? { Referer: referrer } : {}
    });
    return res.headers.get('location');
  }

  t.is(await back('https://example.com/a?b=c'), 'https://example.com/a?b=c');
  t.is(await back('https://evil.example/'), '/fallback');
  t.is(await back('https://example.com.evil.example/'), '/fallback');
  t.is(await back('http://example.com/'), '/fallback');
  t.is(await back(['javascript', 'alert(1)'].join(':')), '/fallback');
  t.is(await back(), '/fallback');
});

test('bulk domain availability checks are rate limited per client', async (t) => {
  const { web } = t.context;
  for (let i = 0; i < 60; i++) {
    const res = await web
      .post('/en/domain-availability/bulk')
      .set('Accept', 'application/json')
      .send({});
    t.not(res.status, 429);
  }

  const res = await web
    .post('/en/domain-availability/bulk')
    .set('Accept', 'application/json')
    .send({});
  t.is(res.status, 429);
});
