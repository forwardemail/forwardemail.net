/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const DEFAULT_COUNT = 1000;

/**
 * Iterate Redis keys matching a pattern in bounded SCAN batches.
 *
 * Unlike KEYS, SCAN allows Valkey to serve other clients between batches.
 * Redis may return a key more than once while the keyspace changes, so callers
 * that require a unique aggregate should use `getRedisKeys` below.
 *
 * @param   {object}                      client Redis-compatible client
 * @param   {string}                      pattern Redis glob pattern
 * @param   {object}                      [options]
 * @param   {number}                      [options.count=1000] SCAN hint
 * @returns {AsyncGenerator<string[]>}
 */
async function* scanRedisKeys(client, pattern, { count = DEFAULT_COUNT } = {}) {
  let cursor = '0';

  do {
    const [nextCursor, keys] = await client.scan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      count
    );

    cursor = String(nextCursor);
    if (Array.isArray(keys) && keys.length > 0) yield keys;
  } while (cursor !== '0');
}

/**
 * Return a deduplicated list of keys matching a pattern.
 *
 * This is for callers, such as the small admin allowlist and denylist views,
 * that need the complete collection before sorting and paginating it.
 *
 * @param   {object}                      client Redis-compatible client
 * @param   {string}                      pattern Redis glob pattern
 * @param   {object}                      [options]
 * @param   {number}                      [options.count=1000] SCAN hint
 * @returns {Promise<string[]>}
 */
async function getRedisKeys(client, pattern, options) {
  const keys = new Set();

  for await (const batch of scanRedisKeys(client, pattern, options)) {
    for (const key of batch) keys.add(key);
  }

  return [...keys];
}

module.exports = scanRedisKeys;
module.exports.DEFAULT_COUNT = DEFAULT_COUNT;
module.exports.getRedisKeys = getRedisKeys;
