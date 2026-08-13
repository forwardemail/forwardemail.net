/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const matchesWildcardTLD = require('#helpers/matches-wildcard-tld');
const normalizeWildcardTLD = require('#helpers/normalize-wildcard-tld');

test('normalizes ICANN public-suffix wildcard rules', (t) => {
  t.is(normalizeWildcardTLD('*.gov.co'), '*.gov.co');
  t.is(normalizeWildcardTLD('*.gov.br'), '*.gov.br');
  t.is(normalizeWildcardTLD('*.co.uk'), '*.co.uk');
  t.is(normalizeWildcardTLD('*.UK'), '*.uk');
});

test('normalizes private and internationalized public-suffix wildcard rules', (t) => {
  t.is(normalizeWildcardTLD('*.github.io'), '*.github.io');
  t.is(normalizeWildcardTLD('*.blogspot.com'), '*.blogspot.com');
  t.is(normalizeWildcardTLD('*.公司.cn'), '*.xn--55qx5d.cn');
});

test('rejects non-suffix and malformed wildcard rules', (t) => {
  for (const value of [
    'gov.co',
    '*.example.com',
    '*.not-a-real-tld',
    '*.localhost',
    '*.www.ck',
    '*.*.gov.co',
    '*.gov.co.example'
  ])
    t.is(normalizeWildcardTLD(value), undefined);
});

test('one-label wildcard TLDs retain their existing broad suffix behavior', (t) => {
  t.true(matchesWildcardTLD('example.uk', ['*.uk']));
  t.true(matchesWildcardTLD('example.co.uk', ['*.uk']));
  t.true(matchesWildcardTLD('deeply.nested.co.uk', ['*.uk']));
  t.true(matchesWildcardTLD('example.com.br', ['*.br']));
  t.false(matchesWildcardTLD('uk', ['*.uk']));
  t.false(matchesWildcardTLD('ukexample.com', ['*.uk']));
});

test('compound government public suffix rules match only their own suffix', (t) => {
  const list = ['*.gov.co', '*.gov.br'];

  t.true(matchesWildcardTLD('agency.gov.co', list));
  t.true(matchesWildcardTLD('mail.agency.gov.co', list));
  t.true(matchesWildcardTLD('agency.gov.br', list));
  t.false(matchesWildcardTLD('gov.co', list));
  t.false(matchesWildcardTLD('agency.co', list));
  t.false(matchesWildcardTLD('agency.gov.com', list));
  t.false(matchesWildcardTLD('gov.co.example', list));
});

test('private, exception, and internationalized suffix rules match safely', (t) => {
  t.true(matchesWildcardTLD('project.github.io', ['*.github.io']));
  t.false(matchesWildcardTLD('github.io', ['*.github.io']));
  t.true(matchesWildcardTLD('www.ck', ['*.ck']));
  t.true(matchesWildcardTLD('shop.xn--55qx5d.cn', ['*.公司.cn']));
  t.true(matchesWildcardTLD('shop.公司.cn', ['*.公司.cn']));
});

test('ignores invalid wildcard entries even if they have a matching string suffix', (t) => {
  t.false(matchesWildcardTLD('mail.example.com', ['*.example.com']));
  t.false(matchesWildcardTLD('mail.gov.co', ['*.not-a-real-tld']));
  t.false(matchesWildcardTLD('mail.gov.co', []));
});
