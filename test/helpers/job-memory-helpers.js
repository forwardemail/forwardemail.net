/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout: delay } = require('node:timers/promises');

const test = require('ava');

const BoundedMap = require('#helpers/bounded-map');
const CappedList = require('#helpers/capped-list');
const forEachInBatches = require('#helpers/for-each-in-batches');

async function* numbers(count, reads) {
  for (let i = 0; i < count; i++) {
    reads.push(i);
    yield i;
  }
}

test('forEachInBatches processes every item and reads only a batch ahead', async (t) => {
  const reads = [];
  const seen = [];
  let running = 0;
  let peak = 0;
  let maxReadAhead = 0;

  const count = await forEachInBatches(
    numbers(250, reads),
    { batchSize: 50, concurrency: 5 },
    async (n) => {
      running++;
      peak = Math.max(peak, running);
      // items read but not yet processed never exceed one batch
      maxReadAhead = Math.max(maxReadAhead, reads.length - seen.length);
      await delay(1);
      seen.push(n);
      running--;
    }
  );

  t.is(count, 250);
  t.deepEqual(
    [...seen].sort((a, b) => a - b),
    Array.from({ length: 250 }, (_, i) => i)
  );
  t.is(peak, 5);
  t.true(maxReadAhead <= 50);
});

test('forEachInBatches stops reading when asked to', async (t) => {
  const reads = [];
  let stop = false;
  const count = await forEachInBatches(
    numbers(1000, reads),
    { batchSize: 10, concurrency: 2, shouldStop: () => stop },
    async (n) => {
      if (n === 25) stop = true;
    }
  );

  t.is(count, 30);
  t.true(reads.length <= 40);
});

test('forEachInBatches rejects when an item fails', async (t) => {
  await t.throwsAsync(
    forEachInBatches(numbers(5, []), async (n) => {
      if (n === 3) throw new Error('boom');
    }),
    { message: 'boom' }
  );
});

test('forEachInBatches closes a cursor it stops reading early', async (t) => {
  let closed = 0;
  const cursor = {
    [Symbol.asyncIterator]: () => numbers(1000, []),
    async close() {
      closed++;
    }
  };

  await forEachInBatches(
    cursor,
    { batchSize: 10, shouldStop: () => true },
    async () => {}
  );
  t.is(closed, 1);

  await t.throwsAsync(
    forEachInBatches(cursor, { batchSize: 10 }, async () => {
      throw new Error('boom');
    })
  );
  t.is(closed, 2);
});

test('CappedList counts everything and keeps the first items', (t) => {
  const list = new CappedList(3);
  for (let i = 0; i < 10; i++) list.push(i);
  t.is(list.count, 10);
  t.is(list.length, 10);
  t.deepEqual(list.items, [0, 1, 2]);
  t.is(list.omitted, 7);
});

test('BoundedMap drops the oldest entry past its limit', (t) => {
  const map = new BoundedMap(2);
  map.set('a', 1);
  map.set('b', 2);
  map.set('a', 3);
  t.is(map.size, 2);
  map.set('c', 4);
  t.is(map.size, 2);
  t.false(map.has('a'));
  t.is(map.get('b'), 2);
  t.is(map.get('c'), 4);
});
