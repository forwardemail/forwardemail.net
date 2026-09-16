/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const scanRedisKeys = require('#helpers/scan-redis-keys');

const { getRedisKeys } = scanRedisKeys;

function createClient(responses) {
  const calls = [];

  return {
    calls,
    async scan(...args) {
      calls.push(args);
      return responses.shift();
    }
  };
}

test('iterates Redis keys in bounded SCAN batches', async (t) => {
  const client = createClient([
    ['42', ['allowlist:first', 'allowlist:second']],
    ['0', ['allowlist:third']]
  ]);
  const batches = [];

  for await (const batch of scanRedisKeys(client, 'allowlist:*', {
    count: 250
  })) {
    batches.push(batch);
  }

  t.deepEqual(batches, [
    ['allowlist:first', 'allowlist:second'],
    ['allowlist:third']
  ]);
  t.deepEqual(client.calls, [
    ['0', 'MATCH', 'allowlist:*', 'COUNT', 250],
    ['42', 'MATCH', 'allowlist:*', 'COUNT', 250]
  ]);
});

test('deduplicates keys returned by Redis SCAN', async (t) => {
  const client = createClient([
    ['7', ['denylist:first', 'denylist:second']],
    ['0', ['denylist:second', 'denylist:third']]
  ]);

  t.deepEqual(await getRedisKeys(client, 'denylist:*'), [
    'denylist:first',
    'denylist:second',
    'denylist:third'
  ]);
});
