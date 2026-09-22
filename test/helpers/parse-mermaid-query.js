/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const { encrypt } = require('#helpers/encrypt-decrypt');
const parseMermaidQuery = require('#helpers/parse-mermaid-query');

function context(query) {
  return {
    query,
    translateError(key) {
      return key;
    }
  };
}

test('rejects malformed Mermaid image parameters before rendering', (t) => {
  for (const query of [
    {},
    { code: 'not-an-encrypted-payload' },
    { code: 'not-an-encrypted-payload', theme: 'light' },
    { code: 'not-an-encrypted-payload', theme: 'dark' }
  ]) {
    const err = t.throws(() => parseMermaidQuery(context(query)));
    t.is(err.output.statusCode, 400);
    t.is(err.output.payload.message, 'UNKNOWN_ERROR');
  }
});

test('accepts an authenticated Mermaid image query', (t) => {
  const code =
    'gantt\n  title Example\n  section Plan\n  Task :a1, 2025-01-01, 1d';
  t.deepEqual(
    parseMermaidQuery(context({ code: encrypt(code), theme: 'dark' })),
    { code, theme: 'dark' }
  );
});
