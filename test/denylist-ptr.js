/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout: delay } = require('node:timers/promises');

const sinon = require('sinon');
const test = require('ava');

const config = require('#config');
const denylistMiddleware = require('#helpers/denylist-request');

const { PTR_SAFE_METHOD_BUDGET_MS, reverseLookup } = denylistMiddleware;

// Each test uses its own IP so the module-level memo never crosses tests.
let ipCounter = 0;
function nextIp() {
  ipCounter++;
  return `198.51.100.${ipCounter}`;
}

function createResolver({ hostname, error, ms = 0 } = {}) {
  const resolver = {
    calls: 0,
    async reverse(ip, abortController) {
      resolver.calls++;
      if (ms) {
        try {
          await delay(ms, undefined, { signal: abortController.signal });
        } catch {
          const err = new Error('aborted');
          err.name = 'AbortError';
          throw err;
        }
      }

      if (error) throw error;
      return hostname ? [hostname] : [];
    }
  };
  return resolver;
}

function createCtx({ ip, method = 'GET', resolver }) {
  return {
    method,
    request: { ip },
    state: {},
    locale: 'en',
    resolver,
    logger: { warn() {} },
    get() {
      return '';
    }
  };
}

// The web app passes a safe-method budget; the API/CalDAV/CardDAV do not
const WEB_OPTIONS = { safeMethodBudgetMs: PTR_SAFE_METHOD_BUDGET_MS };

function runMiddleware(ctx, options = WEB_OPTIONS) {
  const middleware = denylistMiddleware([], options);
  let nextCalled = false;
  return middleware(ctx, async () => {
    nextCalled = true;
  }).then(() => nextCalled);
}

test('GET does not wait for a slow PTR lookup, and the answer is memoized for the next request', async (t) => {
  const ip = nextIp();
  const resolver = createResolver({ hostname: 'host.example.net', ms: 600 });

  const started = Date.now();
  const ctx = createCtx({ ip, resolver });
  t.true(await runMiddleware(ctx));
  const elapsed = Date.now() - started;

  t.true(
    elapsed < PTR_SAFE_METHOD_BUDGET_MS + 200,
    `GET waited ${elapsed}ms for PTR`
  );
  t.is(ctx.resolvedClientHostname, undefined);

  // lookup finishes in the background
  await delay(700);

  const ctx2 = createCtx({ ip, resolver });
  t.true(await runMiddleware(ctx2));
  t.is(ctx2.resolvedClientHostname, 'host.example.net');
  t.is(resolver.calls, 1);
});

test('POST waits for the PTR lookup and enforces the hostname denylist', async (t) => {
  const ip = nextIp();
  const hostname = 'mail.denylisted-ptr-test.example';
  const resolver = createResolver({ hostname, ms: 400 });
  config.denylist.add(hostname);
  try {
    const ctx = createCtx({ ip, method: 'POST', resolver });
    const err = await t.throwsAsync(runMiddleware(ctx));
    t.is(err.output.statusCode, 403);
    t.is(err.denylistValue, hostname);
  } finally {
    config.denylist.delete(hostname);
  }
});

test('GET is blocked once a denylisted PTR hostname is memoized', async (t) => {
  const ip = nextIp();
  const hostname = 'bad.denylisted-ptr-memo.example';
  const resolver = createResolver({ hostname });
  config.denylist.add(hostname);
  try {
    await reverseLookup(resolver, ip);
    const err = await t.throwsAsync(runMiddleware(createCtx({ ip, resolver })));
    t.is(err.output.statusCode, 403);
  } finally {
    config.denylist.delete(hostname);
  }
});

test('NXDOMAIN answers are memoized instead of queried on every request', async (t) => {
  const ip = nextIp();
  const error = new Error('getHostByAddr ENOTFOUND');
  error.code = 'ENOTFOUND';
  const resolver = createResolver({ error });

  for (let i = 0; i < 5; i++) {
    const ctx = createCtx({ ip, resolver });

    t.true(await runMiddleware(ctx));
    t.is(ctx.resolvedClientHostname, undefined);
  }

  t.is(resolver.calls, 1);
});

test('concurrent requests from one IP share a single PTR lookup', async (t) => {
  const ip = nextIp();
  const resolver = createResolver({ hostname: 'shared.example.org', ms: 50 });

  const results = await Promise.all(
    Array.from({ length: 10 }, () => reverseLookup(resolver, ip))
  );

  t.deepEqual(new Set(results), new Set(['shared.example.org']));
  t.is(resolver.calls, 1);
});

test('a PTR lookup that never answers resolves to null after the timeout', async (t) => {
  const ip = nextIp();
  const resolver = createResolver({ hostname: 'late.example.org', ms: 10000 });

  const started = Date.now();
  t.is(await reverseLookup(resolver, ip), null);
  const elapsed = Date.now() - started;
  t.true(elapsed >= 2900 && elapsed < 4000, `resolved after ${elapsed}ms`);
});

test('without a budget (API, CalDAV, CardDAV) GET waits for the full PTR answer', async (t) => {
  const ip = nextIp();
  const resolver = createResolver({ hostname: 'mx1.example.net', ms: 400 });

  const ctx = createCtx({ ip, resolver });
  t.true(await runMiddleware(ctx, {}));
  t.is(ctx.resolvedClientHostname, 'mx1.example.net');
});

test('a transient DNS failure keeps the last good hostname', async (t) => {
  const ip = nextIp();
  const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
  try {
    const good = createResolver({ hostname: 'mx2.example.net' });
    t.is(await reverseLookup(good, ip), 'mx2.example.net');

    // an hour later the positive entry is stale and the resolver fails
    clock.tick(61 * 60 * 1000);
    const servfail = new Error('queryPtr ESERVFAIL');
    servfail.code = 'ESERVFAIL';
    const failing = createResolver({ error: servfail });
    t.is(await reverseLookup(failing, ip), 'mx2.example.net');
    t.is(failing.calls, 1);

    // the fallback is only kept briefly, then the lookup is retried
    t.is(await reverseLookup(failing, ip), 'mx2.example.net');
    t.is(failing.calls, 1);
    clock.tick(31 * 1000);
    await reverseLookup(failing, ip);
    t.is(failing.calls, 2);
  } finally {
    clock.restore();
  }
});

test('a transient DNS failure for an unknown IP is retried after 30 seconds, not 10 minutes', async (t) => {
  const ip = nextIp();
  const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
  try {
    const servfail = new Error('queryPtr ESERVFAIL');
    servfail.code = 'ESERVFAIL';
    const failing = createResolver({ error: servfail });
    t.is(await reverseLookup(failing, ip), null);
    clock.tick(31 * 1000);
    t.is(await reverseLookup(failing, ip), null);
    t.is(failing.calls, 2);
  } finally {
    clock.restore();
  }
});
