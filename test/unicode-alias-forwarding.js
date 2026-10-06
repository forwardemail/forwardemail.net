/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Tests for aliases with a Unicode (non-ASCII) local part, e.g.
// "fællestest@example.com".
//
// The local part used to be converted to punycode ("xn--fllestest-g3a")
// before alias names and regular expressions were matched against it, so
// e.g. `/^.*llestest$/` never matched and the catch-all was used instead.
//
// The tests stub the DNS resolver (`this.resolver`) and Redis client
// (`this.client`) and override `#helpers/get-forwarding-configuration` in the
// require cache (the same approach as `test/wildcard-regex-forwarding.js`).
//

const test = require('ava');
const Redis = require('ioredis-mock');

// creates the mongoose connections the models require
// (no database is queried by these tests)
// eslint-disable-next-line import/no-unassigned-import
require('./utils');

//
// install the paid-plan mock BEFORE requiring the helper under test
//
const GFC_PATH = require.resolve('#helpers/get-forwarding-configuration');

let paidPlanHandler = async () => ({});

require.cache[GFC_PATH] = {
  id: GFC_PATH,
  filename: GFC_PATH,
  loaded: true,
  exports: (...args) => paidPlanHandler(...args)
};

const getForwardingAddresses = require('#helpers/get-forwarding-addresses');
const getUsernameVariants = require('#helpers/get-username-variants');
const parseUsername = require('#helpers/parse-username');

const ROOT = 'example.com';

// "fællestest" with "æ" (which has no decomposed form)
const FAELLES = 'fællestest';
// "blåtest" composed (NFC) and decomposed (NFD, "a" + U+030A)
const BLA_NFC = 'blåtest'.normalize('NFC');
const BLA_NFD = 'blåtest'.normalize('NFD');

function makeContext(txtRecords) {
  return {
    client: new Redis(),
    resolver: {
      async resolveTxt(host) {
        if (host === ROOT) return txtRecords.map((record) => [record]);
        const err = new Error(`queryTxt ENODATA ${host}`);
        err.code = 'ENODATA';
        throw err;
      },
      async resolveMx(host) {
        if (host === ROOT)
          return [
            { exchange: 'mx1.forwardemail.net', priority: 10 },
            { exchange: 'mx2.forwardemail.net', priority: 10 }
          ];
        return [];
      }
    }
  };
}

function run(ctx, address) {
  return getForwardingAddresses.call(ctx, address, [], true, {
    originalFromAddressRootDomain: 'example.net'
  });
}

test.beforeEach(() => {
  paidPlanHandler = async () => ({});
});

//
// helpers
//
test('parseUsername keeps Unicode local part (NFC, lowercase)', (t) => {
  t.is(parseUsername(`${FAELLES}@${ROOT}`), FAELLES);
  t.is(parseUsername(`FÆLLESTEST@${ROOT}`), FAELLES);
  t.is(parseUsername(`${BLA_NFD}@${ROOT}`), BLA_NFC);
  t.is(parseUsername(`${FAELLES}+tag@${ROOT}`), FAELLES);
  t.is(parseUsername(`${FAELLES}+tag@${ROOT}`, true), `${FAELLES}+tag`);
  t.is(parseUsername(`Hello@${ROOT}`), 'hello');
});

test('getUsernameVariants returns Unicode and punycode forms', (t) => {
  t.deepEqual(getUsernameVariants(FAELLES), [FAELLES, 'xn--fllestest-g3a']);
  t.deepEqual(getUsernameVariants('xn--fllestest-g3a'), [
    'xn--fllestest-g3a',
    FAELLES
  ]);
  t.deepEqual(getUsernameVariants(BLA_NFD), [BLA_NFC, 'xn--bltest-jua']);
  t.deepEqual(getUsernameVariants('hello'), ['hello']);
});

//
// free plan (TXT records)
//
test('regex matches Unicode local part instead of catch-all', async (t) => {
  const ctx = makeContext([
    'forward-email=/^.*llestest$/:regex@example.net,catchall@example.net'
  ]);
  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(addresses, ['regex@example.net']);
});

test('regex matches decomposed (NFD) recipient', async (t) => {
  const ctx = makeContext([
    `forward-email=/^${BLA_NFC}$/:regex@example.net,catchall@example.net`
  ]);
  const { addresses } = await run(ctx, `${BLA_NFD}@${ROOT}`);
  t.deepEqual(addresses, ['regex@example.net']);
});

test('regex $1 substitution keeps Unicode', async (t) => {
  const ctx = makeContext(['forward-email=/^(.*)$/:user+$1@example.net']);
  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(addresses, [`user+${FAELLES}@example.net`]);
});

test('exact Unicode alias name matches', async (t) => {
  const ctx = makeContext([
    `forward-email=${FAELLES}:exact@example.net,catchall@example.net`
  ]);
  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(addresses, ['exact@example.net']);
});

test('exact alias name matches regardless of NFC/NFD', async (t) => {
  const ctx = makeContext([
    `forward-email=${BLA_NFD}:exact@example.net,catchall@example.net`
  ]);
  const { addresses } = await run(ctx, `${BLA_NFC}@${ROOT}`);
  t.deepEqual(addresses, ['exact@example.net']);
});

test('legacy punycode alias name still matches', async (t) => {
  const ctx = makeContext([
    'forward-email=xn--fllestest-g3a:legacy@example.net,catchall@example.net'
  ]);
  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(addresses, ['legacy@example.net']);
});

test('ignored Unicode alias name is ignored', async (t) => {
  const ctx = makeContext([`forward-email=!${FAELLES},catchall@example.net`]);
  const result = await run(ctx, `${FAELLES}@${ROOT}`);
  t.true(result.ignored);
});

test('regression: ASCII regex and catch-all unchanged', async (t) => {
  const ctx = makeContext([
    'forward-email=/^(support|info)$/:user+$1@example.net,catchall@example.net'
  ]);
  const support = await run(ctx, `support@${ROOT}`);
  t.deepEqual(support.addresses, ['user+support@example.net']);
  const other = await run(ctx, `other@${ROOT}`);
  t.deepEqual(other.addresses, ['catchall@example.net']);
});

//
// paid plan (mapping from get-forwarding-configuration)
//
test('paid plan: regex mapping matches Unicode local part', async (t) => {
  const ctx = makeContext(['forward-email-site-verification=abc123']);
  let lookedUpUsername;
  paidPlanHandler = async ({ username }) => {
    lookedUpUsername = username;
    return {
      mapping: ['/^.*llestest$/:regex@example.net', 'catchall@example.net']
    };
  };

  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.is(lookedUpUsername, FAELLES);
  t.deepEqual(addresses, ['regex@example.net']);
});

test('paid plan: exact Unicode alias mapping matches', async (t) => {
  const ctx = makeContext(['forward-email-site-verification=abc123']);
  paidPlanHandler = async () => ({
    mapping: [`${FAELLES}:exact@example.net`, 'catchall@example.net']
  });

  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(addresses, ['exact@example.net']);
});
