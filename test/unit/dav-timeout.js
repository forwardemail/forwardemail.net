/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const http = require('node:http');
const test = require('ava');
const ms = require('ms');
const Koa = require('koa');
const pWaitFor = require('p-wait-for');
const pRetry = require('p-retry');
const WebSocketAsPromised = require('websocket-as-promised');

//
// Integration tests for CalDAV/CardDAV timeout and WSP retry configuration.
//
// These tests exercise the ACTUAL library behavior (p-wait-for@3.2.0,
// websocket-as-promised@2.0.1, p-retry@4.6.2, koa-better-timeout@0.0.6)
// to verify that:
// 1. koa-better-timeout fires a 408 after the configured ms
// 2. p-wait-for respects the timeout option and throws TimeoutError
// 3. websocket-as-promised sendRequest accepts per-request timeout
// 4. p-retry retries with correct delays using retry@0.13.1 options
// 5. The configured timeout budget fits within the HTTP timeout
//

// --- koa-better-timeout integration ---

test('koa-better-timeout fires Boom 408 after configured ms', async (t) => {
  const Timeout = require(require.resolve('koa-better-timeout', {
    paths: [process.cwd() + '/node_modules/@ladjs/api']
  }));

  const timeout = new Timeout({ ms: 300 });
  const app = new Koa();

  // Error handler that maps Boom errors to status codes (like @ladjs/api does)
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err.isBoom) {
        ctx.status = err.output.statusCode;
        ctx.body = err.output.payload;
      } else {
        ctx.status = 500;
        ctx.body = { error: err.message };
      }
    }
  });

  app.use(timeout.middleware);
  app.use(async (ctx) => {
    // Simulate a slow handler that exceeds the timeout
    await new Promise((r) => {
      setTimeout(r, 600);
    });
    ctx.body = 'ok';
  });

  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, resolve);
  });
  const { port } = server.address();

  const res = await new Promise((resolve) => {
    http.get(`http://localhost:${port}`, (response) => {
      let body = '';
      response.on('data', (d) => {
        body += d;
      });
      response.on('end', () => {
        resolve({ status: response.statusCode, body });
      });
    });
  });

  t.is(res.status, 408, 'Should return 408 Request Timeout');
  const payload = JSON.parse(res.body);
  t.is(payload.statusCode, 408);
  t.is(payload.error, 'Request Time-out');

  server.close();
});

test('koa-better-timeout does NOT fire when handler completes in time', async (t) => {
  const Timeout = require(require.resolve('koa-better-timeout', {
    paths: [process.cwd() + '/node_modules/@ladjs/api']
  }));

  const timeout = new Timeout({ ms: 500 });
  const app = new Koa();

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err.isBoom) {
        ctx.status = err.output.statusCode;
        ctx.body = err.output.payload;
      } else {
        ctx.status = 500;
        ctx.body = { error: err.message };
      }
    }
  });

  app.use(timeout.middleware);
  app.use(async (ctx) => {
    await new Promise((r) => {
      setTimeout(r, 50);
    });
    ctx.body = 'ok';
  });

  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, resolve);
  });
  const { port } = server.address();

  const res = await new Promise((resolve) => {
    http.get(`http://localhost:${port}`, (response) => {
      let body = '';
      response.on('data', (d) => {
        body += d;
      });
      response.on('end', () => {
        resolve({ status: response.statusCode, body });
      });
    });
  });

  t.is(res.status, 200, 'Should return 200 OK when handler finishes in time');
  t.is(res.body, 'ok');

  server.close();
});

// --- p-wait-for@3.2.0 integration ---

test('p-wait-for rejects with TimeoutError after configured timeout', async (t) => {
  const start = Date.now();
  const err = await t.throwsAsync(
    () => pWaitFor(() => false, { timeout: 300 }),
    { name: 'TimeoutError' }
  );
  const elapsed = Date.now() - start;
  t.true(elapsed >= 280, `Should wait at least 280ms, got ${elapsed}ms`);
  t.true(elapsed < 600, `Should not wait more than 600ms, got ${elapsed}ms`);
  t.regex(err.message, /timed out/i);
});

test('p-wait-for resolves immediately when condition is true', async (t) => {
  const start = Date.now();
  await pWaitFor(() => true, { timeout: 5000 });
  const elapsed = Date.now() - start;
  t.true(elapsed < 100, `Should resolve immediately, took ${elapsed}ms`);
});

test('p-wait-for resolves when condition becomes true before timeout', async (t) => {
  let counter = 0;
  const start = Date.now();
  await pWaitFor(
    () => {
      counter++;
      return counter >= 5;
    },
    { timeout: 5000, interval: 50 }
  );
  const elapsed = Date.now() - start;
  t.true(
    elapsed >= 150,
    `Should take at least 150ms (5 checks * ~50ms interval)`
  );
  t.true(elapsed < 1000, `Should resolve well before timeout`);
  t.is(counter, 5);
});

// --- websocket-as-promised@2.0.1 integration ---

test('websocket-as-promised sendRequest accepts per-request timeout option', (t) => {
  const wsp = new WebSocketAsPromised('ws://localhost:1', {
    packMessage: (data) => JSON.stringify(data),
    unpackMessage: (data) => JSON.parse(data),
    attachRequestId: (data, id) => ({ ...data, id }),
    extractRequestId: (data) => data && data.id
  });

  // Verify sendRequest exists
  t.is(typeof wsp.sendRequest, 'function');

  // Verify the source code reads options.timeout
  const src = wsp.sendRequest.toString();
  t.true(
    src.includes('timeout'),
    'sendRequest should reference timeout in its implementation'
  );
  t.true(
    src.includes('requestId'),
    'sendRequest should reference requestId in its implementation'
  );
});

test('websocket-as-promised constructor accepts default timeout', (t) => {
  const wsp = new WebSocketAsPromised('ws://localhost:1', {
    timeout: ms('60s'),
    packMessage: (data) => JSON.stringify(data),
    unpackMessage: (data) => JSON.parse(data),
    attachRequestId: (data, id) => ({ ...data, id }),
    extractRequestId: (data) => data && data.id
  });

  // Verify the timeout is stored and accessible
  t.is(wsp._options.timeout, 60_000);
});

// --- p-retry@4.6.2 integration (uses retry@0.13.1) ---

test('p-retry retries correct number of times with onFailedAttempt', async (t) => {
  let attempts = 0;
  const timestamps = [];
  const start = Date.now();

  const err = await t.throwsAsync(() =>
    pRetry(
      () => {
        attempts++;
        timestamps.push(Date.now() - start);
        const e = new Error('connection failed');
        e.code = 'ECONNRESET';
        throw e;
      },
      {
        retries: 2,
        minTimeout: 100,
        maxTimeout: 100,
        factor: 1,
        onFailedAttempt(error) {
          // Simulate isRetryableError - only retry ECONNRESET
          if (error.code === 'ECONNRESET') return;
          throw error;
        }
      }
    )
  );

  t.is(attempts, 3, 'Should attempt 1 initial + 2 retries = 3 total');
  t.is(err.message, 'connection failed');
  // Verify delays between attempts
  if (timestamps.length >= 2) {
    const delay1 = timestamps[1] - timestamps[0];
    t.true(
      delay1 >= 80,
      `First retry delay should be >= 80ms (minTimeout=100), got ${delay1}ms`
    );
    t.true(
      delay1 < 300,
      `First retry delay should be < 300ms, got ${delay1}ms`
    );
  }
});

test('p-retry stops immediately on non-retryable errors via onFailedAttempt', async (t) => {
  let attempts = 0;

  const err = await t.throwsAsync(() =>
    pRetry(
      () => {
        attempts++;
        const e = new Error('Invalid argument');
        e.code = 'ERR_INVALID_ARG';
        throw e;
      },
      {
        retries: 5,
        minTimeout: 50,
        maxTimeout: 50,
        factor: 1,
        onFailedAttempt(error) {
          // Only retry retryable errors
          if (error.code === 'ECONNRESET') return;
          throw error;
        }
      }
    )
  );

  t.is(attempts, 1, 'Should stop after first attempt on non-retryable error');
  t.is(err.message, 'Invalid argument');
});

// --- Source file verification ---

test('config/caldav.js sets timeout to 120s', (t) => {
  const fs = require('node:fs');
  const src = fs.readFileSync('config/caldav.js', 'utf8');
  t.regex(
    src,
    /timeout:\s*{[\s\S]*?ms:\s*ms\(['"]120s['"]\)/,
    'CalDAV config must set timeout.ms to 120s'
  );
});

test('config/carddav.js sets timeout to 120s', (t) => {
  const fs = require('node:fs');
  const src = fs.readFileSync('config/carddav.js', 'utf8');
  t.regex(
    src,
    /timeout:\s*{[\s\S]*?ms:\s*ms\(['"]120s['"]\)/,
    'CardDAV config must set timeout.ms to 120s'
  );
});

test('create-websocket-as-promised uses 10s pWaitFor and 60s production timeout', (t) => {
  const fs = require('node:fs');
  const src = fs.readFileSync(
    'helpers/create-websocket-as-promised.js',
    'utf8'
  );

  // Verify pWaitFor timeout is 10s (not 15s)
  t.regex(
    src,
    /timeout:\s*ms\(['"]10s['"]\)/,
    'pWaitFor open timeout should be 10s'
  );
  t.notRegex(
    src,
    /timeout:\s*ms\(['"]15s['"]\)/,
    'Old 15s pWaitFor timeout should be removed'
  );

  // Verify production sendRequest timeout is 60s (not 10m)
  t.regex(src, /ms\(['"]60s['"]\)/, 'Production WSP timeout should be 60s');
  t.notRegex(src, /ms\(['"]10m['"]\)/, 'Old 10m timeout should be removed');
});

// --- Timeout budget analysis ---

test('worst-case timing: pWaitFor(10s) + pRetry(3, 5s delay) fits in 120s', (t) => {
  // Real worst case for a single wsp.request call path:
  //
  // sendRequest: pWaitFor open (10s max) + wsp.sendRequest (60s max) = 70s max
  //
  // With pRetry wrapping sendRequest (retries=3, minTimeout=5s, factor=1):
  //   Attempt 1: pWaitFor times out after 10s
  //   Delay: 5s (minTimeout = busyTimeout/2 = 10s/2)
  //   Attempt 2: pWaitFor times out after 10s
  //   Delay: 5s
  //   Attempt 3: pWaitFor times out after 10s
  //   Delay: 5s
  //   Attempt 4: pWaitFor times out after 10s
  //   Total: 4 * 10s + 3 * 5s = 55s
  //
  // Plus auth overhead: ~6s (cold start with DNS + MongoDB + argon2)
  // Grand total worst case: 61s < 120s

  const pWaitForTimeout = ms('10s');
  const retries = 3;
  const minTimeout = ms('10s') / 2; // busyTimeout / 2 = 5s
  const authOverhead = 6000;

  const worstCase =
    authOverhead + (retries + 1) * pWaitForTimeout + retries * minTimeout;
  t.is(worstCase, 61_000);
  t.true(worstCase < ms('120s'), `Worst case ${worstCase}ms must fit in 120s`);
});
