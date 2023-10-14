/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const Redis = require('ioredis-mock');

const createTangerine = require('#helpers/create-tangerine');

// <https://github.com/luin/ioredis/issues/1179>
Redis.Command.setArgumentTransformer('set', (args) => {
  if (typeof args[1] === 'object') args[1] = JSON.stringify(args[1]);
  return args;
});

Redis.Command.setReplyTransformer('get', (value) => {
  if (value && typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {}
  }

  return value;
});

test('throws error', (t) => {
  const err = t.throws(createTangerine);
  t.is(err.message, 'Client required');
});

test('creates instance', async (t) => {
  const client = new Redis();
  const tangerine = createTangerine(client);
  await tangerine.resolve('forwardemail.net');
  const result = await client.get('tangerine:a:forwardemail.net');
  t.true(typeof result === 'object');
  t.true(result.answers.length > 0);
  t.true(result.answers[0].name === 'forwardemail.net');
});
