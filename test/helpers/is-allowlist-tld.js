/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const config = fs.readFileSync(
  path.join(__dirname, '..', '..', 'config', 'index.js'),
  'utf8'
);

function hasGoodDomain(tld) {
  const start = config.indexOf('goodDomains: [');
  const end = config.indexOf('],\n\n  validDurations:', start);
  return new RegExp(`^\\s*'${tld}',?$`, 'm').test(config.slice(start, end));
}

test('includes the requested free-plan ccTLDs in goodDomains', (t) => {
  for (const tld of ['ae', 'ar', 'ee']) {
    t.true(hasGoodDomain(tld), `expected '${tld}' in goodDomains`);
  }
});

test('keeps explicitly excluded spam-prone ccTLDs out of goodDomains', (t) => {
  t.false(hasGoodDomain('ru'));
  t.false(hasGoodDomain('ua'));
});
