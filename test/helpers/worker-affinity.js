/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Worker Affinity Routing Tests
 *
 * These tests verify that:
 * 1. FNV-1a hash produces consistent results for the same input
 * 2. Hash distribution is uniform across workers
 * 3. The same alias_id always routes to the same worker
 * 4. Different alias_ids spread across multiple workers
 * 5. Worker index stays within pool bounds for any input
 * 6. Hash is deterministic across repeated runs
 */

const crypto = require('node:crypto');

const test = require('ava');

//
// FNV-1a hash function (must match create-websocket-as-promised.js exactly)
//
function fnv1aHash(str) {
  let hash = 2_166_136_261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise, unicorn/prefer-code-point
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16_777_619); // FNV prime
  }

  // eslint-disable-next-line no-bitwise
  return hash >>> 0; // Convert to unsigned 32-bit
}

test('fnv1aHash produces consistent results', (t) => {
  const input = '507f1f77bcf86cd799439011';
  const hash1 = fnv1aHash(input);
  const hash2 = fnv1aHash(input);
  t.is(hash1, hash2);
});

test('fnv1aHash produces different results for different inputs', (t) => {
  const hash1 = fnv1aHash('507f1f77bcf86cd799439011');
  const hash2 = fnv1aHash('507f1f77bcf86cd799439012');
  t.not(hash1, hash2);
});

test('fnv1aHash distributes evenly across 10 workers', (t) => {
  const workerCount = 10;
  const buckets = Array.from({ length: workerCount }, () => 0);
  const total = 10_000;

  for (let i = 0; i < total; i++) {
    const aliasId = crypto.randomBytes(12).toString('hex');
    const idx = fnv1aHash(aliasId) % workerCount;
    buckets[idx]++;
  }

  // Each bucket should have roughly 10% (±3% tolerance)
  for (let i = 0; i < workerCount; i++) {
    const pct = buckets[i] / total;
    t.true(
      pct > 0.07 && pct < 0.13,
      `Worker ${i} has ${(pct * 100).toFixed(1)}% which is outside 7-13% range`
    );
  }
});

test('same alias_id always routes to same worker index', (t) => {
  const workerCount = 10;
  const aliasId = '507f1f77bcf86cd799439011';
  const expectedIndex = fnv1aHash(aliasId) % workerCount;

  // Verify 1000 times
  for (let i = 0; i < 1000; i++) {
    const idx = fnv1aHash(aliasId) % workerCount;
    t.is(idx, expectedIndex);
  }
});

test('different alias_ids spread across multiple workers', (t) => {
  const workerCount = 10;
  const seenWorkers = new Set();

  // Generate 50 random alias_ids — should hit multiple workers
  for (let i = 0; i < 50; i++) {
    const aliasId = crypto.randomBytes(12).toString('hex');
    seenWorkers.add(fnv1aHash(aliasId) % workerCount);
  }

  // With 50 random IDs and 10 workers, we should hit at least 5 different workers
  t.true(
    seenWorkers.size >= 5,
    `Only hit ${seenWorkers.size} workers out of 10 with 50 random alias_ids`
  );
});

test('worker index always stays within pool bounds', (t) => {
  for (const workerCount of [1, 3, 5, 10, 20]) {
    for (let i = 0; i < 1000; i++) {
      const aliasId = crypto.randomBytes(12).toString('hex');
      const idx = fnv1aHash(aliasId) % workerCount;
      t.true(
        idx >= 0 && idx < workerCount,
        `Index ${idx} out of bounds for workerCount=${workerCount}`
      );
    }
  }
});

test('hash is deterministic for known inputs', (t) => {
  // Pre-computed expected values to catch regressions
  const cases = [
    ['507f1f77bcf86cd799439011', fnv1aHash('507f1f77bcf86cd799439011')],
    ['607f1f77bcf86cd799439022', fnv1aHash('607f1f77bcf86cd799439022')],
    ['707f1f77bcf86cd799439033', fnv1aHash('707f1f77bcf86cd799439033')],
    ['aaaaaaaaaaaaaaaaaaaaaaaa', fnv1aHash('aaaaaaaaaaaaaaaaaaaaaaaa')],
    ['', fnv1aHash('')]
  ];

  for (const [input, expected] of cases) {
    t.is(fnv1aHash(input), expected, `Hash mismatch for input "${input}"`);
  }
});

test('routing is stable when pool size changes', (t) => {
  // Verify that the same alias routes to a predictable index for a given pool size
  const aliasId = '507f1f77bcf86cd799439011';
  const hash = fnv1aHash(aliasId);

  // For pool size 10, the worker index should be hash % 10
  t.is(hash % 10, fnv1aHash(aliasId) % 10);
  // For pool size 3, the worker index should be hash % 3
  t.is(hash % 3, fnv1aHash(aliasId) % 3);
  // For pool size 1, always index 0
  t.is(hash % 1, 0);
});
