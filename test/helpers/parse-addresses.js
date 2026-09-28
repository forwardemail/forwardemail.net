/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const test = require('ava');

const parseAddresses = require('#helpers/parse-addresses');

function timed(fn) {
  const start = process.hrtime.bigint();
  const result = fn();
  return { result, ms: Number(process.hrtime.bigint() - start) / 1e6 };
}

test('parses ordinary header values', (t) => {
  t.deepEqual(parseAddresses('foo@example.com'), ['foo@example.com']);
  t.deepEqual(parseAddresses('<foo@example.com>'), ['foo@example.com']);
  t.deepEqual(parseAddresses('"Foo" <foo@example.com>'), ['foo@example.com']);
  t.deepEqual(
    parseAddresses(
      '"foo@example.com" <foo@example.com>, "beep@example.org" <beep@example.org>'
    ),
    ['foo@example.com', 'beep@example.org']
  );
  t.deepEqual(parseAddresses('foo (comment) <foo@example.com>'), [
    'foo@example.com'
  ]);
  t.deepEqual(parseAddresses(''), []);
  t.deepEqual(parseAddresses('a@example.com,b@example.org'), [
    'a@example.com',
    'b@example.org'
  ]);
  // a run of junk too long to be an address does not swallow its neighbours
  t.deepEqual(
    parseAddresses(`a@example.com,${'x'.repeat(5000)},b@example.org`),
    ['a@example.com', 'b@example.org']
  );
});

test('parses a long recipient list in full', (t) => {
  const list = Array.from(
    { length: 500 },
    (_, i) => `"User ${i}" <user${i}@example.com>`
  );
  const { result, ms } = timed(() => parseAddresses(list.join(', ')));
  t.deepEqual(
    result,
    list.map((_, i) => `user${i}@example.com`)
  );
  t.true(ms < 1000, `${ms} ms`);
});

test('adversarial values are parsed quickly and do not throw', (t) => {
  for (const [name, input] of [
    ['nested comments', '('.repeat(50_000) + 'a@example.com'],
    ['commas', 'a@example.com,'.repeat(100_000)],
    ['atoms', 'a '.repeat(500_000) + '<'],
    ['comments', 'a(b)'.repeat(250_000) + '@'],
    ['dots', 'a.'.repeat(500_000) + '@b'],
    ['dotted words', ('a.'.repeat(511) + '@ ').repeat(1000)],
    ['dotted list', ('a.'.repeat(511) + '@, ').repeat(1000)]
  ]) {
    const { ms } = timed(() => parseAddresses(input));
    t.true(ms < 1000, `${name}: ${ms} ms`);
  }
});

test('an oversized value is cut after its last complete address', (t) => {
  const input = 'a@example.com,'.repeat(100_000) + 'last@example.com';
  const result = parseAddresses(input);
  t.true(result.length > 1000);
  t.true(
    result.length * 'a@example.com,'.length <= parseAddresses.MAX_INPUT_LENGTH
  );
  t.true(result.every((address) => address === 'a@example.com'));
});
