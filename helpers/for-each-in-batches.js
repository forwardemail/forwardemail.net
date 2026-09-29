/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pMap = require('p-map');

//
// Run `fn` over every item of an async iterable (a Mongoose query or
// aggregation cursor) a batch at a time, with limited concurrency inside
// each batch. Only one batch is held in memory, where loading the whole
// result into an array first grows with the collection (and every job worker
// that does it grows with it).
//
// Give a Mongoose cursor a `batchSize` equal to (or below) `batchSize` here, so
// the server is asked for the next batch as each one is processed: a cursor
// whose next fetch comes long after the last one (its default fetch is up to
// 16 MB of documents) is closed by the server once its session is idle.
//
// @param {AsyncIterable} iterable - Items to process
// @param {Object} [options]
// @param {number} [options.batchSize=100] - Items read before processing
// @param {number} [options.concurrency=10] - Items processed at once
// @param {Function} [options.shouldStop] - Returns true to stop early
//   (checked before each batch, e.g. when the job was cancelled)
// @param {Function} fn - Called with (item); its result is discarded
// @returns {Promise<number>} Number of items processed
//
async function forEachInBatches(iterable, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  const batchSize = Math.max(1, Number(options?.batchSize) || 100);
  const concurrency = Math.max(1, Number(options?.concurrency) || 10);
  const shouldStop =
    typeof options?.shouldStop === 'function'
      ? options.shouldStop
      : () => false;

  let count = 0;
  let batch = [];

  async function run() {
    const items = batch;
    batch = [];
    await pMap(items, fn, { concurrency });
    count += items.length;
  }

  try {
    for await (const item of iterable) {
      batch.push(item);
      if (batch.length < batchSize) continue;
      if (shouldStop()) {
        batch = [];
        break;
      }

      await run();
    }

    if (batch.length > 0 && !shouldStop()) await run();
  } finally {
    // a Mongoose query cursor is not closed on the server when the loop
    // stops early or throws (its cursor can outlive the job otherwise)
    if (typeof iterable?.close === 'function')
      await Promise.resolve(iterable.close()).catch(() => {});
  }

  return count;
}

module.exports = forEachInBatches;
