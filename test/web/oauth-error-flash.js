/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An OAuth provider reports a failed sign in with `error_description` in
// the callback URL, which anyone can link to; passport-oauth2 turns it into
// the flash message (rendered as HTML), so it must arrive escaped.
//

const http = require('node:http');
const process = require('node:process');

const Koa = require('koa');
const Passport = require('@ladjs/passport');
const test = require('ava');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

const PAYLOAD =
  '<form method="POST" action="/en/my-account"><button>OK</button></form>';

async function listen(t) {
  // (the GitHub strategy reads its credentials from the environment)
  const env = { ...process.env };
  process.env.GITHUB_CLIENT_ID = 'test-client-id';
  process.env.GITHUB_CLIENT_SECRET = 'test-client-secret';
  process.env.GITHUB_CALLBACK_URL = 'http://127.0.0.1/auth/github/ok';
  t.teardown(() => {
    for (const key of [
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET',
      'GITHUB_CALLBACK_URL'
    ]) {
      if (key in env) process.env[key] = env[key];
      else delete process.env[key];
    }
  });

  const router = require('../../routes/web/auth');
  const passport = new Passport(
    { providers: { github: true, local: false } },
    { findOne() {}, findById() {} }
  );
  const flashes = [];
  const app = new Koa();
  app.use(async (ctx, next) => {
    ctx.session = {};
    ctx.passport = passport;
    ctx.flash = (type, message) => {
      if (message !== undefined) flashes.push({ type, message });
    };

    ctx.state.l = (path = '/') => '/en' + path;
    ctx.translate = (key) => key;
    ctx.translateError = (key) => new Error(key);
    ctx.logger = {
      error() {},
      warn() {},
      info() {},
      debug() {},
      fatal() {}
    };
    await next();
  });
  app.use(passport.initialize());
  app.use(router.routes());
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());
  return { port: server.address().port, flashes };
}

for (const error of ['server_error', 'access_denied']) {
  test(`the provider's error_description is escaped (${error})`, async (t) => {
    const { port, flashes } = await listen(t);
    const res = await fetch(
      `http://127.0.0.1:${port}/auth/github/ok?error=${error}&error_description=${encodeURIComponent(
        PAYLOAD
      )}`,
      { redirect: 'manual', headers: { accept: 'text/html' } }
    );
    t.is(res.status, 302);
    const messages = flashes
      .filter((flash) => flash.type === 'error')
      .map((flash) => String(flash.message));
    t.true(messages.length > 0);
    for (const message of messages) {
      t.false(message.includes('<'), `${message}`);
      t.false(message.includes('>'), `${message}`);
    }

    t.true(messages.some((message) => message.includes('&lt;form')));
  });
}
