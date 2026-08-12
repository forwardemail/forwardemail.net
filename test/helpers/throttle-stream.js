/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { Readable } = require('node:stream');

const test = require('ava');

const createThrottleStream = require('#helpers/throttle-stream');

test('throttles stream throughput', async (t) => {
  const payload = Buffer.alloc(300, 1);
  const throttle = createThrottleStream(1000, { burstWindow: 100 });
  const chunks = [];
  const started = Date.now();

  throttle.on('data', (chunk) => chunks.push(chunk));

  await new Promise((resolve, reject) => {
    throttle.once('error', reject);
    throttle.once('end', resolve);
    Readable.from([payload]).pipe(throttle);
  });

  const elapsed = Date.now() - started;
  t.true(elapsed >= 200, `expected throttling, finished in ${elapsed}ms`);
  t.true(elapsed < 2000, `throttle stalled for ${elapsed}ms`);
  t.deepEqual(Buffer.concat(chunks), payload);
});

test('rejects invalid throughput', (t) => {
  for (const value of [undefined, 0, -1, Number.NaN]) {
    t.throws(() => createThrottleStream(value), { instanceOf: TypeError });
  }
});
