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
test('parseUnicodeUsername keeps Unicode local part (NFC, lowercase)', (t) => {
  const { parseUnicodeUsername } = parseUsername;
  t.is(parseUnicodeUsername(`${FAELLES}@${ROOT}`), FAELLES);
  t.is(parseUnicodeUsername(`FÆLLESTEST@${ROOT}`), FAELLES);
  t.is(parseUnicodeUsername(`${BLA_NFD}@${ROOT}`), BLA_NFC);
  t.is(parseUnicodeUsername(`${FAELLES}+tag@${ROOT}`), FAELLES);
  t.is(parseUnicodeUsername(`${FAELLES}+tag@${ROOT}`, true), `${FAELLES}+tag`);
  t.is(parseUnicodeUsername(`Hello@${ROOT}`), 'hello');
});

// (the addresses built from it are as they were)
test('parseUsername still gives the punycode local part', (t) => {
  t.is(parseUsername(`${FAELLES}@${ROOT}`), 'xn--fllestest-g3a');
  t.is(parseUsername(`${FAELLES}+tag@${ROOT}`), 'xn--fllestest-g3a');
  t.is(parseUsername(`Hello+x@${ROOT}`), 'hello');
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

// (a regular expression that matched before substitutes as before)
test('regex $1 substitution is as before when it matched before', async (t) => {
  const ctx = makeContext(['forward-email=/^(.*)$/:user+$1@example.net']);
  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(addresses, ['user+xn--fllestest-g3a@example.net']);
});

test('regex $1 substitution uses the Unicode name it matched', async (t) => {
  const ctx = makeContext([
    'forward-email=/^(.*)llestest$/:user+$1@example.net'
  ]);
  const { addresses } = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(addresses, ['user+fæ@example.net']);
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

// (the record that got the mail before still gets it, alone)
test('of records naming both forms, the punycode one is used, as before', async (t) => {
  const ctx = makeContext([
    `forward-email=${FAELLES}:exact@example.net,xn--fllestest-g3a:legacy@example.net`
  ]);
  const unicode = await run(ctx, `${FAELLES}@${ROOT}`);
  t.deepEqual(unicode.addresses, ['legacy@example.net']);
  const legacy = await run(ctx, `xn--fllestest-g3a@${ROOT}`);
  t.deepEqual(legacy.addresses, ['legacy@example.net']);
});

// (and a regular expression only tests the punycode form then, as before)
test('with a record naming the punycode form, a regex for the Unicode form gets nothing', async (t) => {
  const ctx = makeContext([
    `forward-email=xn--fllestest-g3a:legacy@example.net,/^fæ/:regex@example.net`
  ]);
  for (const address of [`${FAELLES}@${ROOT}`, `xn--fllestest-g3a@${ROOT}`]) {
    const { addresses } = await run(ctx, address);
    t.deepEqual(addresses, ['legacy@example.net']);
  }
});

test('a made-up punycode name is not decoded', async (t) => {
  t.deepEqual(getUsernameVariants('xn--admin-'), ['xn--admin-']);
  t.deepEqual(getUsernameVariants('xn--*-'), ['xn--*-']);
  t.deepEqual(getUsernameVariants('xn--a'), ['xn--a']);
  const ctx = makeContext(['forward-email=admin:admin@example.net']);
  const err = await t.throwsAsync(run(ctx, `xn--admin-@${ROOT}`));
  t.truthy(err);
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
  // (looked up as before, in punycode)
  t.is(lookedUpUsername, 'xn--fllestest-g3a');
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
