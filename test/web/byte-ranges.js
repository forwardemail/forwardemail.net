/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const Web = require('@ladjs/web');
const request = require('supertest');
const test = require('ava');
const { listen } = require('async-listen');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const webConfig = require('#config/web');
const { Users } = require('#models');

// 1,000 bytes where each byte is its own offset (mod 256), so any slice can be
// checked against what it should be
const SIZE = 1000;
const BYTES = Buffer.from(Array.from({ length: SIZE }, (_, i) => i % 256));

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
// videos (one named like a revisioned build file), an image and a text file in
// the build directory the web server serves
test.before((t) => {
  const name = `byte-range-test-${randomUUID()}`;
  const dir = path.join(config.buildDir, 'img');
  fs.mkdirSync(dir, { recursive: true });
  t.context.name = name;
  t.context.files = [
    path.join(dir, `${name}.mp4`),
    path.join(dir, `${name}-0123abcdef.mp4`),
    path.join(dir, `${name}.webm`),
    path.join(dir, `${name}.png`),
    path.join(dir, `${name}.txt`)
  ];
  for (const file of t.context.files) fs.writeFileSync(file, BYTES);
});
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);
test.after.always((t) => {
  for (const file of t.context.files || []) fs.rmSync(file, { force: true });
});

// the response body as raw bytes, whatever its type
function get(agent, url, headers = {}, method = 'get') {
  return agent[method](url)
    .set(headers)
    .buffer(true)
    .parse((res, fn) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => fn(null, Buffer.concat(chunks)));
    });
}

//
// A web server with responses cached in Redis by koa-cash, as production runs
// it (CACHE_RESPONSES is set in ansible/playbooks/templates/env). `routes`
// replaces the cached routes, to put video in the cache as well.
//
async function cachedWebServer(t, routes) {
  const before = env.CACHE_RESPONSES;
  env.CACHE_RESPONSES = true;
  let web;
  try {
    const client = new Redis({ keyPrefix: randomUUID() });
    client.setMaxListeners(0);
    const options = webConfig(client);
    if (routes) options.cacheResponses = { routes };
    web = new Web({ ...options, redis: client }, Users);
  } finally {
    env.CACHE_RESPONSES = before;
  }

  await listen(web.server, { host: '127.0.0.1', port: 0 });
  t.teardown(
    () =>
      new Promise((resolve) => {
        web.server.close(() => resolve());
      })
  );
  return request.agent(web.server);
}

test('a video without a Range header is sent whole, with ranges offered', async (t) => {
  const res = await get(t.context.web, `/img/${t.context.name}.mp4`);
  t.is(res.status, 200);
  t.is(res.headers['accept-ranges'], 'bytes');
  t.is(res.headers['content-type'], 'video/mp4');
  t.is(res.headers['content-length'], String(SIZE));
  t.true(Buffer.compare(res.body, BYTES) === 0);
});

test('the first two bytes of a video, as Safari asks before playing', async (t) => {
  const res = await get(t.context.web, `/img/${t.context.name}.mp4`, {
    Range: 'bytes=0-1'
  });
  t.is(res.status, 206);
  t.is(res.headers['content-range'], `bytes 0-1/${SIZE}`);
  t.is(res.headers['content-length'], '2');
  t.is(res.headers['content-type'], 'video/mp4');
  t.is(res.headers['accept-ranges'], 'bytes');
  t.true(Buffer.compare(res.body, BYTES.subarray(0, 2)) === 0);
});

test('a range in the middle of a WebM video', async (t) => {
  const res = await get(t.context.web, `/img/${t.context.name}.webm`, {
    Range: 'bytes=300-555'
  });
  t.is(res.status, 206);
  t.is(res.headers['content-range'], `bytes 300-555/${SIZE}`);
  t.is(res.headers['content-type'], 'video/webm');
  t.true(Buffer.compare(res.body, BYTES.subarray(300, 556)) === 0);
});

test('open-ended, suffix and overlong ranges', async (t) => {
  const url = `/img/${t.context.name}.mp4`;

  const open = await get(t.context.web, url, { Range: 'bytes=990-' });
  t.is(open.status, 206);
  t.is(open.headers['content-range'], `bytes 990-999/${SIZE}`);
  t.true(Buffer.compare(open.body, BYTES.subarray(990)) === 0);

  const suffix = await get(t.context.web, url, { Range: 'bytes=-10' });
  t.is(suffix.status, 206);
  t.is(suffix.headers['content-range'], `bytes 990-999/${SIZE}`);
  t.true(Buffer.compare(suffix.body, BYTES.subarray(990)) === 0);

  // a suffix longer than the file is the whole file
  const all = await get(t.context.web, url, { Range: 'bytes=-5000' });
  t.is(all.status, 206);
  t.is(all.headers['content-range'], `bytes 0-999/${SIZE}`);
  t.true(Buffer.compare(all.body, BYTES) === 0);

  // an end past the file stops at its last byte
  const clamped = await get(t.context.web, url, { Range: 'bytes=900-5000' });
  t.is(clamped.status, 206);
  t.is(clamped.headers['content-range'], `bytes 900-999/${SIZE}`);
  t.true(Buffer.compare(clamped.body, BYTES.subarray(900)) === 0);
});

test('a range past the end is 416 with the size, and not cached', async (t) => {
  const res = await get(
    t.context.web,
    `/img/${t.context.name}-0123abcdef.mp4`,
    {
      Range: `bytes=${SIZE}-`
    }
  );
  t.is(res.status, 416);
  t.is(res.headers['content-range'], `bytes */${SIZE}`);
  t.is(res.headers['cache-control'], 'no-store');
  t.is(res.headers.etag, undefined);
  t.is(res.body.length, 0);
});

test('HEAD ignores a range (only GET has them) but offers ranges', async (t) => {
  const res = await get(
    t.context.web,
    `/img/${t.context.name}.mp4`,
    { Range: 'bytes=0-1' },
    'head'
  );
  t.is(res.status, 200);
  t.is(res.headers['accept-ranges'], 'bytes');
  t.is(res.headers['content-range'], undefined);
  t.is(res.headers['content-length'], String(SIZE));
});

test('several ranges, a malformed header or a stale If-Range get the whole video', async (t) => {
  const url = `/img/${t.context.name}.mp4`;
  // a weak ETag never matches an If-Range (RFC 9110, section 13.1.5)
  const first = await get(t.context.web, url);
  const { etag } = first.headers;
  t.true(etag.startsWith('W/'));
  for (const headers of [
    { Range: 'bytes=0-1,5-6' },
    { Range: 'bytes=5-2' },
    { Range: 'items=0-1' },
    { Range: 'bytes=0-1', 'If-Range': '"not-the-current-etag"' },
    { Range: 'bytes=0-1', 'If-Range': etag }
  ]) {
    const res = await get(t.context.web, url, headers);
    t.is(res.status, 200, `${JSON.stringify(headers)}`);
    t.is(res.headers['content-range'], undefined, `${JSON.stringify(headers)}`);
    t.true(Buffer.compare(res.body, BYTES) === 0, `${JSON.stringify(headers)}`);
  }
});

test('a matching If-Range still gets the range', async (t) => {
  const url = `/img/${t.context.name}.mp4`;
  const first = await get(t.context.web, url);
  const res = await get(t.context.web, url, {
    Range: 'bytes=0-1',
    'If-Range': first.headers['last-modified']
  });
  t.is(res.status, 206);
  t.is(res.headers['content-range'], `bytes 0-1/${SIZE}`);
});

test('files that are not audio or video are left alone', async (t) => {
  const res = await get(t.context.web, `/img/${t.context.name}.txt`, {
    Range: 'bytes=0-1'
  });
  t.is(res.status, 200);
  t.is(res.headers['accept-ranges'], undefined);
  t.is(res.headers['content-range'], undefined);
  t.is(res.body.length, SIZE);
});

test('a range of a revisioned video is cached like the whole file', async (t) => {
  const url = `/img/${t.context.name}-0123abcdef.mp4`;
  const whole = await get(t.context.web, url);
  const range = await get(t.context.web, url, { Range: 'bytes=0-1' });
  t.is(whole.status, 200);
  t.is(range.status, 206);
  t.is(whole.headers['cache-control'], 'public, max-age=31536000, immutable');
  t.is(range.headers['cache-control'], whole.headers['cache-control']);
});

test('with responses cached as in production, video streams from disk with ranges and images stay cached', async (t) => {
  const agent = await cachedWebServer(t);

  for (let i = 0; i < 2; i++) {
    const res = await get(agent, `/img/${t.context.name}.mp4`, {
      Range: 'bytes=0-1'
    });
    t.is(res.status, 206);
    t.is(res.headers['content-range'], `bytes 0-1/${SIZE}`);
    t.true(Buffer.compare(res.body, BYTES.subarray(0, 2)) === 0);
    // never put in Redis
    t.is(res.headers['x-cached-response'], undefined);
  }

  const url = `/img/${t.context.name}.png`;
  const first = await get(agent, url);
  t.is(first.headers['x-cached-response'], undefined);
  const again = await get(agent, url);
  t.is(again.status, 200);
  t.is(again.headers['x-cached-response'], 'HIT');
});

test('a video served from the response cache still gets ranges', async (t) => {
  const agent = await cachedWebServer(t, ['/img/(.*)']);
  const url = `/img/${t.context.name}.webm`;
  // media players ask for the file as it is, not compressed
  const headers = { Range: 'bytes=300-555', 'Accept-Encoding': 'identity' };

  const miss = await get(agent, url, headers);
  const hit = await get(agent, url, headers);
  t.is(miss.headers['x-cached-response'], undefined);
  t.is(hit.headers['x-cached-response'], 'HIT');
  for (const res of [miss, hit]) {
    t.is(res.status, 206);
    t.is(res.headers['content-range'], `bytes 300-555/${SIZE}`);
    t.true(Buffer.compare(res.body, BYTES.subarray(300, 556)) === 0);
  }
});
