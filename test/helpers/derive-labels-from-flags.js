/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const deriveLabelsFromFlags = require('#helpers/derive-labels-from-flags');

test('keeps custom keywords and drops system flags', (t) => {
  t.deepEqual(deriveLabelsFromFlags(['\\Seen', '\\Flagged', 'heyo']), ['heyo']);
});

test('lowercases and de-duplicates keywords the way the Messages model stores labels', (t) => {
  t.deepEqual(deriveLabelsFromFlags(['Work', 'work', ' WORK ', 'Urgent']), [
    'work',
    'urgent'
  ]);
});

test('keeps $ keywords, matching STORE', (t) => {
  t.deepEqual(deriveLabelsFromFlags(['$label1', '$Forwarded']), [
    '$label1',
    '$forwarded'
  ]);
});

test('stops at the per-message label limit', (t) => {
  const flags = Array.from({ length: 15 }, (_, i) => `tag${i}`);
  t.is(deriveLabelsFromFlags(flags).length, 10);
});

test('treats anything but an array of strings as no labels', (t) => {
  t.deepEqual(deriveLabelsFromFlags(undefined), []);
  t.deepEqual(deriveLabelsFromFlags('heyo'), []);
  t.deepEqual(deriveLabelsFromFlags([null, 42, '', '  ']), []);
});

test('only counts valid keywords toward the label limit', (t) => {
  // (keywords the Messages model drops, e.g. with spaces or IMAP-UTF7 "&")
  const invalid = Array.from({ length: 10 }, (_, i) => `tag &${i}`);
  t.deepEqual(deriveLabelsFromFlags([...invalid, 'work', 'home']), [
    'work',
    'home'
  ]);
});

test('lists every label when asked for no limit (labels a STORE removes)', (t) => {
  const keywords = Array.from({ length: 15 }, (_, i) => `k${i}`);
  t.is(deriveLabelsFromFlags(keywords).length, 10);
  t.deepEqual(
    deriveLabelsFromFlags(keywords, { limit: Number.POSITIVE_INFINITY }),
    keywords
  );
});
