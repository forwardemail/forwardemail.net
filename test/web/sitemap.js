/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ip = require('ip');
// const isCI = require('is-ci');
// const ms = require('ms');
const test = require('ava');
// const undici = require('undici');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');

// const config = require('#config');
// const { useCases } = require('#config/utilities');

const IP_ADDRESS = ip.address();

const semaphore = new Semaphore(4);

// const USE_CASES = new Set(Object.keys(useCases));

test.before(utils.setupMongoose);
test.before(async (t) => {
  await utils.setupWebServer(t);
  t.context._web.config.rateLimit.allowlist.push(IP_ADDRESS, '127.0.0.1');
});
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

// <https://github.com/avajs/ava/discussions/3177#discussioncomment-6633346>
// <https://github.com/avajs/cooperate#semaphores> // <--- across worker threads
test.beforeEach('setup concurrency', async (t) => {
  t.context.permit = await semaphore.acquire();
});
test.afterEach.always(async (t) => {
  await t.context.permit.release();
});

// eslint-disable-next-line ava/no-todo-test
test.todo('finish me');

/*
// fetches all pages from sitemap
// TODO: if you change this then also change sitemap controller
const keys = Object.keys(config.meta).filter((key) => {
  // exclude certain pages from sitemap
  // (e.g. 401 not authorized)
  if (
    [
      '/admin',
      '/my-account',
      '/help',
      '/auth',
      '/logout',
      '/denylist',
      '/reset-password',
      config.verifyRoute,
      config.otpRoutePrefix
    ].includes(key)
  )
    return false;
  if (key.startsWith('/admin') || key.startsWith('/my-account')) return false;
  if (USE_CASES.has(key)) return false;
  return key;
});

if (!isCI) {
  // add all the alternatives (since it would be massive translation file addition otherwise)
  for (const alternative of config.alternatives) {
    keys.push(`/blog/best-${alternative.slug}-alternative`);
    for (const a of config.alternatives) {
      if (a.name === alternative.name) continue;
      keys.push(
        `/blog/${alternative.slug}-vs-${a.slug}-email-service-comparison`
      );
    }
  }
}

for (const key of keys) {
  // skip use cases for CI
  // if (isCI && USE_CASES.has(key)) continue;
  const route = `/en${key === '/' ? '' : key}`;
  const status = key === '/tti' ? 408 : 200;
  test(`GET ${route} should return 200`, async (t) => {
    t.timeout(ms('5m')); // FAQ takes 30s+ to render (the pug view is ~4000 LOC right now)
    const res = await undici.fetch(`${t.context.webURL}${route}`, {
      method: 'HEAD'
    });
    t.is(res.status, status);
  });
}
*/
