/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Tests for wildcard-subdomain forwarding with regex substitution.
//
// These cover the additive behaviors in helpers/get-forwarding-addresses.js:
//
//   1) %SUBDOMAIN% / %HOST% token interpolation inside the regex
//      substitution target.  these tokens are part of the regex substitution
//      grammar and work on whatever record is matched (exact host or, when the
//      wildcard fallback is enabled, the inherited root record).
//
//   2) the root-domain TXT fallback: when a recipient is on a subdomain and
//      the EXACT host has no `forward-email=` / `forward-email-site-verification=`
//      records, the registrable root domain's TXT records are consulted so a
//      single apex record can transparently cover every subdomain.
//
//      this fallback is OPT-IN and PAID-PLAN ONLY: it only fires when the
//      registrable root domain exists in our system on a paid plan
//      (enhanced_protection or team) AND has `allow_subdomain_forwarding`
//      enabled.  it NEVER fires for the free plan (no Domain document) or for
//      a paid domain that has not enabled the setting.
//
//      it is ALSO anti-hijack: inheritance is only granted when a paid, opt-in
//      Domain's UNIQUE `verification_record` matches a
//      `forward-email-site-verification=` value actually published at the apex.
//      a same-named "squatter" Domain document (whose verification_record does
//      not match the apex TXT) can never cause inheritance.
//
// The tests require the real helper module and exercise it with a stub DNS
// resolver (`this.resolver`) and a stub Redis client (`this.client`). The
// paid-plan forwarding configuration is exercised by overriding the
// `#helpers/get-forwarding-configuration` module in the require cache BEFORE
// the helper is required.  The opt-in/ownership gate itself is exercised
// against REAL (mongodb-memory-server) Domains documents, so the lookups are
// genuinely executed.
//
// NOTE on return shape:
//   getForwardingAddresses resolves to `{ addresses, hasIMAP, ... }`
//   (or `{ ignored }` / `{ softRejected }` / `{ hardRejected }`).
//
// NOTE on +tag handling:
//   the recipient local-part's `+tag` is stripped before regex matching, but
//   if the ORIGINAL recipient contained a `+tag`, that same filter is
//   re-appended to each (non-FQDN/non-URL) destination. e.g.
//     user.name+ignored@wildcard.testdomain.com  ->  dest "wildcard@example.com"
//     final: "wildcard+ignored@example.com"
//

const process = require('node:process');
const test = require('ava');
const ms = require('ms');
const Redis = require('ioredis-mock');
const { ObjectId } = require('mongoose').Types;

const utils = require('./utils');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const Domains = require('#models/domains');

//
// resolve the absolute path of the mocked module so we can install a fake into
// the CommonJS require cache (this mirrors how the helper resolves it via the
// `#helpers/*` imports map in package.json).
//
const GFC_PATH = require.resolve('#helpers/get-forwarding-configuration');

// the paid-plan mock is configured per-test via this mutable handler
let paidPlanHandler = async () => ({});

// install the fake BEFORE requiring the helper under test
require.cache[GFC_PATH] = {
  id: GFC_PATH,
  filename: GFC_PATH,
  loaded: true,
  exports: (...args) => paidPlanHandler(...args)
};

// now require the helper under test (it will pick up the mocked dependency)
const getForwardingAddresses = require('#helpers/get-forwarding-addresses');

const ROOT = 'testdomain.com';

//
// helper: build a stub `this` context with a programmable DNS resolver.
//
// `txtByHost` maps an exact host name -> array of TXT records, where each TXT
// record is itself an array of string chunks (matching Node's resolveTxt()
// return shape, i.e. string[][]).
//
// Only hosts that belong to "testdomain.com" advertise MX records so that the
// recursive lookup on external destinations (e.g. example.com) exits cleanly
// without resolving anything (it is caught as notConfigured and the original
// destination is preserved).
//
function makeContext(txtByHost, options = {}) {
  const client = new Redis();
  // records every host that an MX lookup was performed against, so tests can
  // assert the subdomain MX (e.g. a wildcard `*.testdomain.com`) was consulted
  const mxLookups = [];
  // when `wildcardMx` is false, ONLY the apex advertises MX (i.e. the customer
  // did NOT publish a wildcard / per-subdomain MX record)
  const wildcardMx = options.wildcardMx !== false;
  const ctx = {
    client,
    mxLookups,
    resolver: {
      async resolveTxt(host) {
        if (Object.prototype.hasOwnProperty.call(txtByHost, host))
          return txtByHost[host];
        const err = new Error(`queryTxt ENODATA ${host}`);
        err.code = 'ENODATA';
        throw err;
      },
      async resolveMx(host) {
        mxLookups.push(host);
        // the apex always advertises Forward Email's MX exchanges
        if (host === ROOT)
          return [
            { exchange: 'mx1.forwardemail.net', priority: 10 },
            { exchange: 'mx2.forwardemail.net', priority: 10 }
          ];
        // subdomains only advertise MX when a wildcard (or per-subdomain) MX
        // record has been published (`*.testdomain.com` -> mx1/mx2)
        if (host.endsWith(`.${ROOT}`) && wildcardMx)
          return [
            { exchange: 'mx1.forwardemail.net', priority: 10 },
            { exchange: 'mx2.forwardemail.net', priority: 10 }
          ];
        return [];
      }
    }
  };
  return ctx;
}

function run(ctx, address) {
  // ignoreBilling = true so the (mocked) paid-plan lookup is exercised without
  // requiring real billing state.
  return getForwardingAddresses.call(ctx, address, [], true, {
    originalFromAddressRootDomain: 'example.net'
  });
}

//
// directly insert a Domains document (bypassing save hooks / DNS verification)
// so the gate's lookups match.  the helper only `.select('id').lean()`s the
// document, so a minimal document is sufficient.  `verification_record` is
// unique + required in the schema, so we always provide one.
//
async function insertRootDomain({
  plan,
  allow_subdomain_forwarding,
  verification_record
}) {
  const _id = new ObjectId();
  await Domains.collection.insertOne({
    _id,
    // the collection has a unique `id_1` index (mongoose `id` alias); provide a
    // distinct value so multiple same-named documents can co-exist in a test
    id: _id.toString(),
    name: ROOT,
    plan,
    allow_subdomain_forwarding,
    verification_record
  });
}

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await utils.setupMongoose();
});

test.after.always(async () => {
  await Domains.collection.deleteMany({ name: ROOT });
  await utils.teardownMongoose();
});

test.beforeEach(async () => {
  // default: paid-plan lookup returns empty (i.e. nothing configured)
  paidPlanHandler = async () => ({});
  // ensure a clean slate for the root domain document(s) between tests
  await Domains.collection.deleteMany({ name: ROOT });
});

//
// ----------------------------------------------------------------------------
// exact-host token interpolation (no fallback involved; plan-independent)
// ----------------------------------------------------------------------------
//

//
// 1) EXACT-host wildcard record using %SUBDOMAIN%
//
test('%SUBDOMAIN% token on exact-host record', async (t) => {
  const ctx = makeContext({
    'wildcard.testdomain.com': [
      ['forward-email=/^.*$/:%SUBDOMAIN%@example.com']
    ]
  });
  const { addresses } = await run(ctx, 'someone@wildcard.testdomain.com');
  // %SUBDOMAIN% => "wildcard"
  t.deepEqual(addresses, ['wildcard@example.com']);
});

//
// 2) EXACT-host %HOST% token
//
test('%HOST% token on exact-host record', async (t) => {
  const ctx = makeContext({
    'mail.testdomain.com': [['forward-email=/^.*$/:postmaster@%HOST%']]
  });
  const { addresses } = await run(ctx, 'anyone@mail.testdomain.com');
  t.deepEqual(addresses, ['postmaster@mail.testdomain.com']);
});

//
// ----------------------------------------------------------------------------
// PAID-PLAN + OPT-IN ENABLED + VERIFIED OWNER: the root-domain fallback fires
// ----------------------------------------------------------------------------
//

//
// 3) PAID + opt-in + verified owner: root-domain fallback for an arbitrary
//    subdomain
//
test('paid + opt-in + verified: root-domain fallback for arbitrary subdomain', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'root123'
  });
  const ctx = makeContext({
    // NOTE: no record at "anything.testdomain.com"
    // the apex publishes the verification token that matches the Domain doc
    'testdomain.com': [['forward-email-site-verification=root123']]
  });
  paidPlanHandler = async ({ verificationRecord }) => ({
    mapping: [`/^.*$/:$&@example.com`],
    verificationRecord
  });
  const { addresses } = await run(ctx, 'jane.doe@anything.testdomain.com');
  // $& is the full match (the plus-stripped username "jane.doe")
  t.deepEqual(addresses, ['jane.doe@example.com']);
});

//
// 4) PAID + opt-in + verified: root fallback + %SUBDOMAIN% + preserved +tag
//    (the customer's exact use-case)
//
test('paid + opt-in + verified: root fallback + %SUBDOMAIN% preserves +tag', async (t) => {
  await insertRootDomain({
    plan: 'team',
    allow_subdomain_forwarding: true,
    verification_record: 'root456'
  });
  const ctx = makeContext({
    'testdomain.com': [['forward-email-site-verification=root456']]
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:%SUBDOMAIN%@example.com']
  });
  const { addresses } = await run(
    ctx,
    'user.name+ignored@wildcard.testdomain.com'
  );
  // %SUBDOMAIN% => "wildcard"; original +ignored is re-appended to the dest
  t.deepEqual(addresses, ['wildcard+ignored@example.com']);
});

//
// 5) PAID + opt-in + verified: root fallback resolves site-verification +
//    mapping; the matched verification token flows to getForwardingConfiguration
//
test('paid + opt-in + verified: root fallback resolves site-verification + mapping', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'abc123'
  });
  const ctx = makeContext({
    'testdomain.com': [['forward-email-site-verification=abc123']]
  });

  let receivedVerification;
  paidPlanHandler = async ({ verificationRecord }) => {
    receivedVerification = verificationRecord;
    return { mapping: ['/^.*$/:%SUBDOMAIN%@example.com'] };
  };

  const { addresses } = await run(ctx, 'team@sales.testdomain.com');

  t.is(receivedVerification, 'abc123');
  t.deepEqual(addresses, ['sales@example.com']);
});

//
// 6) PAID + opt-in + verified: %HOST% token via mapping
//
test('paid + opt-in + verified: %HOST% token via mapping', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'def456'
  });
  const ctx = makeContext({
    'testdomain.com': [['forward-email-site-verification=def456']]
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:hello@%HOST%']
  });
  const { addresses } = await run(ctx, 'x@deep.sub.testdomain.com');
  t.deepEqual(addresses, ['hello@deep.sub.testdomain.com']);
});

//
// 7) PAID + opt-in + verified: multi-label subdomain keeps all labels below
//    the root
//
test('paid + opt-in + verified: multi-label subdomain %SUBDOMAIN% keeps dotted labels', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'ghi789'
  });
  const ctx = makeContext({
    'testdomain.com': [['forward-email-site-verification=ghi789']]
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:%SUBDOMAIN%@example.com']
  });
  const { addresses } = await run(ctx, 'x@a.b.testdomain.com');
  // dots are valid in an email local-part
  t.deepEqual(addresses, ['a.b@example.com']);
});

//
// ----------------------------------------------------------------------------
// ANTI-HIJACK: inheritance requires a verification_record that matches the
// apex `forward-email-site-verification=` TXT value
// ----------------------------------------------------------------------------
//

//
// 8) HIJACK ATTEMPT: a same-named "squatter" Domain document is opt-in and paid
//    but its verification_record does NOT match the apex TXT.  The subdomain
//    MUST NOT inherit (rejects), because ownership is not proven.
//
test('hijack: same-named squatter (non-matching verification_record) does NOT inherit', async (t) => {
  // squatter added "testdomain.com" to their account and toggled the setting,
  // but they do NOT control the apex DNS, so their verification_record differs
  await insertRootDomain({
    plan: 'team',
    allow_subdomain_forwarding: true,
    verification_record: 'squatter-token-AAA'
  });
  const ctx = makeContext({
    // the REAL apex owner publishes a DIFFERENT verification value
    'testdomain.com': [['forward-email-site-verification=real-owner-token-BBB']]
  });
  // if inheritance wrongly fired, this mapping would forward the victim's mail
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:attacker@evil.example']
  });
  await t.throwsAsync(() => run(ctx, 'victim@private.testdomain.com'));
});

//
// 9) VERIFIED OWNER WINS over a co-existing squatter: when both a squatter
//    (non-matching) and the real owner (matching the apex TXT) exist with the
//    same name, only the verified owner's configuration is inherited.
//
test('anti-hijack: verified owner inherits even when a squatter shares the name', async (t) => {
  // squatter (non-matching) ...
  await insertRootDomain({
    plan: 'team',
    allow_subdomain_forwarding: true,
    verification_record: 'squatter-token-AAA'
  });
  // ... and the real, verified owner (matches the apex TXT)
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'real-owner-token-BBB'
  });
  const ctx = makeContext({
    'testdomain.com': [['forward-email-site-verification=real-owner-token-BBB']]
  });

  let receivedVerification;
  paidPlanHandler = async ({ verificationRecord }) => {
    receivedVerification = verificationRecord;
    return { mapping: ['/^.*$/:%SUBDOMAIN%@example.com'] };
  };

  const { addresses } = await run(ctx, 'sales@eu.testdomain.com');
  // the verification token passed downstream is the apex-published (verified) one
  t.is(receivedVerification, 'real-owner-token-BBB');
  t.deepEqual(addresses, ['eu@example.com']);
});

//
// ----------------------------------------------------------------------------
// OPT-OUT / FREE: the root-domain fallback MUST NOT fire
// ----------------------------------------------------------------------------
//

//
// 10) FREE plan (no Domain document): no fallback -> subdomain is "not
//     configured" and the helper rejects (preserving pre-feature behavior)
//
test('free plan: subdomain does NOT inherit root records (rejects)', async (t) => {
  // no Domains document inserted -> free
  const ctx = makeContext({
    'testdomain.com': [['forward-email=/^.*$/:$&@example.com']]
  });
  await t.throwsAsync(() => run(ctx, 'jane.doe@anything.testdomain.com'));
});

//
// 11) PAID plan but opt-in DISABLED: no fallback -> rejects
//
test('paid plan, opt-in disabled: subdomain does NOT inherit root records (rejects)', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: false,
    verification_record: 'nope'
  });
  const ctx = makeContext({
    'testdomain.com': [['forward-email-site-verification=nope']]
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:%SUBDOMAIN%@example.com']
  });
  await t.throwsAsync(() => run(ctx, 'team@sales.testdomain.com'));
});

//
// 12) PAID + opt-in + verified, but a per-subdomain record exists: the
//     exact-host record takes precedence and the root fallback does NOT fire
//
test('paid + opt-in: per-subdomain record beats root fallback', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'root999'
  });
  const ctx = makeContext({
    'shop.testdomain.com': [['forward-email=/^.*$/:specific@example.com']],
    'testdomain.com': [['forward-email-site-verification=root999']]
  });
  // if the (paid) fallback were used, this mapping would apply; assert it is NOT
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:apex@example.com']
  });
  const { addresses } = await run(ctx, 'anyone@shop.testdomain.com');
  t.true(addresses.includes('specific@example.com'));
  t.false(addresses.includes('apex@example.com'));
});

//
// ----------------------------------------------------------------------------
// REGRESSIONS: apex/root behavior is unchanged (fallback never applies there)
// ----------------------------------------------------------------------------
//

//
// 13) REGRESSION: existing $1 regex on an apex domain is unchanged
//
test('regression: apex $1 regex unchanged', async (t) => {
  const ctx = makeContext({
    'testdomain.com': [['forward-email=/^(support|info)$/:user+$1@example.net']]
  });
  const { addresses } = await run(ctx, 'support@testdomain.com');
  t.deepEqual(addresses, ['user+support@example.net']);
});

//
// 14) REGRESSION: static (non-regex) target on apex unchanged
//
test('regression: apex static target unchanged', async (t) => {
  const ctx = makeContext({
    'testdomain.com': [['forward-email=hello:user@example.net']]
  });
  const { addresses } = await run(ctx, 'hello@testdomain.com');
  t.deepEqual(addresses, ['user@example.net']);
});

//
// 15) REGRESSION: %SUBDOMAIN% expands to empty string on the apex
//
test('apex: %SUBDOMAIN% expands to empty string', async (t) => {
  const ctx = makeContext({
    'testdomain.com': [['forward-email=/^.*$/:prefix%SUBDOMAIN%@example.com']]
  });
  const { addresses } = await run(ctx, 'x@testdomain.com');
  t.deepEqual(addresses, ['prefix@example.com']);
});

//
// ----------------------------------------------------------------------------
// WILDCARD DNS (MX) FLOW: a paid + opt-in + verified root domain where the
// customer published a wildcard MX (`*.testdomain.com` -> mx1/mx2.forwardemail.net)
// so mail actually reaches Forward Email for every subdomain.
// ----------------------------------------------------------------------------
//

//
// 16) WILDCARD MX present on the subdomain: with a wildcard MX published
//     (`*.testdomain.com` -> mx1/mx2.forwardemail.net) mail physically reaches
//     Forward Email for the subdomain, and the recipient resolves via the
//     inherited apex configuration.
//
//     NOTE: when the exact subdomain has no TXT records (the common wildcard
//     case), the helper defers the "not configured" error and intentionally
//     SKIPS the per-subdomain MX probe (it is about to consult the root
//     instead), so `resolveMx` is not called for the subdomain on this path.
//     The wildcard MX still governs physical delivery at the SMTP layer; this
//     test asserts the resolution outcome.
//
test('wildcard MX: subdomain inherits apex config (MX governs delivery)', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'mxroot111'
  });
  // wildcardMx: true (default) -> `*.testdomain.com` advertises mx1/mx2
  const ctx = makeContext({
    'testdomain.com': [['forward-email-site-verification=mxroot111']]
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:%SUBDOMAIN%@example.com']
  });

  const { addresses } = await run(ctx, 'hello@news.testdomain.com');

  // the inherited apex mapping resolved the destination for the subdomain
  t.deepEqual(addresses, ['news@example.com']);
});

//
// 17) WILDCARD MX absent on the subdomain: inheritance does NOT depend on the
//     subdomain advertising MX (the helper gates on TXT records, plan, opt-in,
//     and verified ownership), so the apex config is still inherited.  In a real
//     deployment the wildcard MX is what makes mail physically arrive; this test
//     documents that the resolution logic itself is MX-independent.
//
test('wildcard MX absent: inheritance still resolves via verified apex config', async (t) => {
  await insertRootDomain({
    plan: 'team',
    allow_subdomain_forwarding: true,
    verification_record: 'mxroot222'
  });
  // wildcardMx: false -> only the apex advertises MX
  const ctx = makeContext(
    {
      'testdomain.com': [['forward-email-site-verification=mxroot222']]
    },
    { wildcardMx: false }
  );
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:%SUBDOMAIN%@example.com']
  });

  const { addresses } = await run(ctx, 'hello@blog.testdomain.com');
  t.deepEqual(addresses, ['blog@example.com']);
});

//
// ----------------------------------------------------------------------------
// REAL TANGERINE RESOLVER (no stubbed resolveTxt/resolveMx)
// ----------------------------------------------------------------------------
//
// The tests above drive the helper with a hand-rolled `resolver` stub.  The
// tests below instead exercise the SAME final semantics (paid plan + opt-in +
// verified apex ownership) through a REAL Tangerine resolver, seeding DNS via
// `resolver.spoofPacket(name, TYPE, answers, true)` into the resolver's cache
// (`resolver.options.cache.mset(...)`), mirroring how test/mx/index.js spoofs
// DNS.  Hosts that must look unconfigured are spoofed with an EMPTY answers
// array, which makes Tangerine throw `ENODATA` deterministically (so there is
// no live DoH fallback and the tests are hermetic).
//
// Cache-key convention (see tangerine): the lookup key is
// `${rrtype}:${name}`.toLowerCase(), e.g. `txt:news.testdomain.com`,
// `mx:testdomain.com`.  The `tangerine:` prefix is added automatically by the
// refix proxy in createTangerine, so we seed bare `txt:`/`mx:` keys.
//

//
// build a `this` context whose resolver is a genuine Tangerine instance.
//
// `txtByHost` : exact host -> array of TXT answer strings (each becomes one TXT
//               record).  A host present with an empty array is spoofed as
//               ENODATA (explicitly "no record").
// `mxByHost`  : exact host -> array of exchange hostnames (priority defaults to
//               0).  A host present with an empty array is spoofed as ENODATA.
//
async function makeTangerineContext({ txtByHost = {}, mxByHost = {} } = {}) {
  const client = new Redis();
  const resolver = createTangerine(client, logger);

  const map = new Map();
  for (const [host, answers] of Object.entries(txtByHost)) {
    map.set(
      `txt:${host}`.toLowerCase(),
      resolver.spoofPacket(host, 'TXT', answers, true, ms('10m'))
    );
  }

  for (const [host, exchanges] of Object.entries(mxByHost)) {
    map.set(
      `mx:${host}`.toLowerCase(),
      resolver.spoofPacket(host, 'MX', exchanges, true, ms('10m'))
    );
  }

  await resolver.options.cache.mset(map);

  return { client, resolver };
}

const FE_MX = ['mx1.forwardemail.net', 'mx2.forwardemail.net'];

//
// T1) free/exact-host %SUBDOMAIN% token via a real resolver (no fallback)
//
test('tangerine: %SUBDOMAIN% token on exact-host record', async (t) => {
  const ctx = await makeTangerineContext({
    txtByHost: {
      'wildcard.testdomain.com': [
        'forward-email=/^.*$/:%SUBDOMAIN%@example.com'
      ]
    },
    mxByHost: {
      'wildcard.testdomain.com': FE_MX,
      'example.com': []
    }
  });
  const { addresses } = await run(ctx, 'someone@wildcard.testdomain.com');
  t.deepEqual(addresses, ['wildcard@example.com']);
});

//
// T2) %HOST% token expands to the recipient host (interpolated into an external
//     destination so the one-level recursion exits cleanly)
//
test('tangerine: %HOST% token expands to recipient host', async (t) => {
  const ctx = await makeTangerineContext({
    txtByHost: {
      'mail.testdomain.com': ['forward-email=/^.*$/:%HOST%@external.example']
    },
    mxByHost: {
      'mail.testdomain.com': FE_MX,
      'external.example': []
    }
  });
  const { addresses } = await run(ctx, 'anyone@mail.testdomain.com');
  // %HOST% => "mail.testdomain.com"
  t.deepEqual(addresses, ['mail.testdomain.com@external.example']);
});

//
// T3) paid + opt-in + verified: root-domain fallback for an arbitrary subdomain
//     (exact host is spoofed ENODATA -> deferred -> apex consulted)
//
test('tangerine: paid + opt-in + verified root fallback for arbitrary subdomain', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'tng-root-1'
  });
  const ctx = await makeTangerineContext({
    txtByHost: {
      // the exact subdomain has NO records (ENODATA)
      'anything.testdomain.com': [],
      // apex publishes the matching verification token
      'testdomain.com': ['forward-email-site-verification=tng-root-1']
    },
    mxByHost: {
      'testdomain.com': FE_MX,
      'example.com': []
    }
  });
  paidPlanHandler = async ({ verificationRecord }) => ({
    mapping: ['/^.*$/:$&@example.com'],
    verificationRecord
  });
  const { addresses } = await run(ctx, 'jane.doe@anything.testdomain.com');
  t.deepEqual(addresses, ['jane.doe@example.com']);
});

//
// T4) paid + opt-in + verified: root fallback + %SUBDOMAIN% preserves +tag
//
test('tangerine: paid root fallback + %SUBDOMAIN% preserves +tag', async (t) => {
  await insertRootDomain({
    plan: 'team',
    allow_subdomain_forwarding: true,
    verification_record: 'tng-root-2'
  });
  const ctx = await makeTangerineContext({
    txtByHost: {
      'wildcard.testdomain.com': [],
      'testdomain.com': ['forward-email-site-verification=tng-root-2']
    },
    mxByHost: {
      'testdomain.com': FE_MX,
      'example.com': []
    }
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:%SUBDOMAIN%@example.com']
  });
  const { addresses } = await run(
    ctx,
    'user.name+ignored@wildcard.testdomain.com'
  );
  t.deepEqual(addresses, ['wildcard+ignored@example.com']);
});

//
// T5) paid + opt-in + verified: site-verification token flows to
//     getForwardingConfiguration and mapping resolves
//
test('tangerine: paid root fallback resolves site-verification + mapping', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'tng-abc'
  });
  const ctx = await makeTangerineContext({
    txtByHost: {
      'sales.testdomain.com': [],
      'testdomain.com': ['forward-email-site-verification=tng-abc']
    },
    mxByHost: {
      'testdomain.com': FE_MX,
      'example.com': []
    }
  });
  let receivedVerification;
  paidPlanHandler = async ({ verificationRecord }) => {
    receivedVerification = verificationRecord;
    return { mapping: ['/^.*$/:%SUBDOMAIN%@example.com'] };
  };

  const { addresses } = await run(ctx, 'team@sales.testdomain.com');
  t.is(receivedVerification, 'tng-abc');
  t.deepEqual(addresses, ['sales@example.com']);
});

//
// T6) free plan (no Domain document): subdomain does NOT inherit (rejects),
//     proven through the real resolver
//
test('tangerine: free plan subdomain does NOT inherit root records (rejects)', async (t) => {
  const ctx = await makeTangerineContext({
    txtByHost: {
      'anything.testdomain.com': [],
      'testdomain.com': ['forward-email=/^.*$/:$&@example.com']
    },
    mxByHost: {
      'testdomain.com': FE_MX
    }
  });
  await t.throwsAsync(() => run(ctx, 'jane.doe@anything.testdomain.com'));
});

//
// T7) paid + opt-in + verified: a per-subdomain record beats the root fallback
//
test('tangerine: per-subdomain record beats root fallback', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'tng-root-9'
  });
  const ctx = await makeTangerineContext({
    txtByHost: {
      'shop.testdomain.com': ['forward-email=/^.*$/:specific@example.com'],
      'testdomain.com': ['forward-email-site-verification=tng-root-9']
    },
    mxByHost: {
      'shop.testdomain.com': FE_MX,
      'testdomain.com': FE_MX,
      'example.com': []
    }
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:apex@example.com']
  });
  const { addresses } = await run(ctx, 'anyone@shop.testdomain.com');
  t.true(addresses.includes('specific@example.com'));
  t.false(addresses.includes('apex@example.com'));
});

//
// T8) wildcard MX at apex: with `*.testdomain.com` -> mx1/mx2 published, the
//     subdomain inherits the verified apex configuration through a real resolver
//
test('tangerine: wildcard MX at apex, subdomain inherits apex config', async (t) => {
  await insertRootDomain({
    plan: 'enhanced_protection',
    allow_subdomain_forwarding: true,
    verification_record: 'tng-mx-1'
  });
  const ctx = await makeTangerineContext({
    txtByHost: {
      'news.testdomain.com': [],
      'testdomain.com': ['forward-email-site-verification=tng-mx-1']
    },
    mxByHost: {
      // wildcard MX published: the subdomain advertises FE exchanges
      'news.testdomain.com': FE_MX,
      'testdomain.com': FE_MX,
      'example.com': []
    }
  });
  paidPlanHandler = async () => ({
    mapping: ['/^.*$/:%SUBDOMAIN%@example.com']
  });
  const { addresses } = await run(ctx, 'hello@news.testdomain.com');
  t.deepEqual(addresses, ['news@example.com']);
});

//
// T9) regression through the real resolver: apex $1 regex unchanged
//
test('tangerine: apex $1 regex unchanged', async (t) => {
  const ctx = await makeTangerineContext({
    txtByHost: {
      'testdomain.com': ['forward-email=/^(support|info)$/:user+$1@example.net']
    },
    mxByHost: {
      'testdomain.com': FE_MX,
      'example.net': []
    }
  });
  const { addresses } = await run(ctx, 'support@testdomain.com');
  t.deepEqual(addresses, ['user+support@example.net']);
});
