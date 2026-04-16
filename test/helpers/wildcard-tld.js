/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

//
// matchesWildcardTLD is defined in get-recipients.js but not exported,
// so we replicate it here for unit testing. The implementation must
// stay in sync with helpers/get-recipients.js.
//
function matchesWildcardTLD(domain, list) {
  for (const entry of list) {
    if (entry.startsWith('*.') && domain.endsWith(entry.slice(1))) return true;
  }

  return false;
}

//
// *.uk should match all UK domains
//
test('*.uk matches example.uk', (t) => {
  t.true(matchesWildcardTLD('example.uk', ['*.uk']));
});

test('*.uk matches example.co.uk', (t) => {
  t.true(matchesWildcardTLD('example.co.uk', ['*.uk']));
});

test('*.uk matches example.org.uk', (t) => {
  t.true(matchesWildcardTLD('example.org.uk', ['*.uk']));
});

test('*.uk matches deeply.nested.co.uk', (t) => {
  t.true(matchesWildcardTLD('deeply.nested.co.uk', ['*.uk']));
});

test('*.uk matches mail.example.me.uk', (t) => {
  t.true(matchesWildcardTLD('mail.example.me.uk', ['*.uk']));
});

//
// *.uk should NOT match unrelated domains
//
test('*.uk does not match example.com', (t) => {
  t.false(matchesWildcardTLD('example.com', ['*.uk']));
});

test('*.uk does not match example.de', (t) => {
  t.false(matchesWildcardTLD('example.de', ['*.uk']));
});

test('*.uk does not match ukexample.com (partial suffix)', (t) => {
  t.false(matchesWildcardTLD('ukexample.com', ['*.uk']));
});

//
// Other wildcard TLDs
//
test('*.com matches example.com', (t) => {
  t.true(matchesWildcardTLD('example.com', ['*.com']));
});

test('*.de matches example.de', (t) => {
  t.true(matchesWildcardTLD('example.de', ['*.de']));
});

test('*.jp matches example.co.jp', (t) => {
  t.true(matchesWildcardTLD('example.co.jp', ['*.jp']));
});

test('*.au matches example.com.au', (t) => {
  t.true(matchesWildcardTLD('example.com.au', ['*.au']));
});

test('*.br matches example.com.br', (t) => {
  t.true(matchesWildcardTLD('example.com.br', ['*.br']));
});

//
// Multiple wildcard entries in the list
//
test('matches when list has multiple wildcards', (t) => {
  const list = ['*.uk', '*.de', '*.fr', '192.168.1.1', 'specific.com'];
  t.true(matchesWildcardTLD('example.co.uk', list));
  t.true(matchesWildcardTLD('example.de', list));
  t.true(matchesWildcardTLD('example.fr', list));
  t.false(matchesWildcardTLD('example.com', list));
});

//
// Non-wildcard entries in the list should not match
//
test('non-wildcard entries are ignored', (t) => {
  const list = ['example.com', '192.168.1.1', 'user@test.com'];
  t.false(matchesWildcardTLD('example.com', list));
  t.false(matchesWildcardTLD('anything.com', list));
});

//
// Empty list
//
test('empty list returns false', (t) => {
  t.false(matchesWildcardTLD('example.uk', []));
});

//
// Edge case: domain is exactly the TLD (should not match since *.uk means "something.uk")
// entry.slice(1) = '.uk', and 'uk'.endsWith('.uk') = false
//
test('bare TLD does not match *.uk', (t) => {
  t.false(matchesWildcardTLD('uk', ['*.uk']));
});

//
// Regression: ensure *.uk does not accidentally match a domain
// that merely contains "uk" as a substring (e.g. "dukeshire.com")
//
test('*.uk does not match dukeshire.com', (t) => {
  t.false(matchesWildcardTLD('dukeshire.com', ['*.uk']));
});

test('*.uk does not match spooky.net', (t) => {
  t.false(matchesWildcardTLD('spooky.net', ['*.uk']));
});
