/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// How a domain is categorised from what Cloudflare Family DNS answers for
// it (the resolver is injected: jobs/check-domains-cloudflare-family.js and
// the Domains model hand in one that queries 1.1.1.3 and 1.0.0.3): a domain
// the family filter blocks resolves to 0.0.0.0, a parked domain to a
// parking IP, and a resolver failure is reported rather than treated as
// either.
//

const test = require('ava');

const getDomainCategorization = require('#helpers/get-domain-categorization');

// (the content fetch of the domain is not the point here: every domain
//  below is unroutable, so it fails fast)
const DOMAIN = 'categorised-domain.invalid';
const OPTIONS = {
  timeout: 1000,
  logger: { debug() {}, error() {}, warn() {} }
};

function resolverAnswering(answer) {
  return {
    async resolve(name) {
      if (name !== DOMAIN) throw new Error(`unexpected lookup of ${name}`);
      if (answer instanceof Error) throw answer;
      return answer;
    }
  };
}

test('a domain the family filter blocks is blocked', async (t) => {
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0'])
  });
  t.true(result.blocked);
  t.true(result.categories.includes('blocked_by_cloudflare_family'));

  // even when the block answer comes with other records
  const mixed = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['93.184.216.34', '0.0.0.0'])
  });
  t.true(mixed.blocked);
});

test('a domain that resolves normally is not', async (t) => {
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['93.184.216.34'])
  });
  t.false(result.blocked);
  t.false(result.categories.includes('blocked_by_cloudflare_family'));
  t.true(result.hasLegitimateHosting);
});

test('a resolver failure is reported, not taken for an answer', async (t) => {
  const err = new Error('query timed out');
  err.code = 'ETIMEOUT';
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(err)
  });
  t.false(result.blocked);
  t.true(result.categories.includes('dns_error'));
  t.is(result.dnsError, 'ETIMEOUT');

  // and without a family resolver at all the DNS check is simply skipped
  const none = await getDomainCategorization(DOMAIN, OPTIONS);
  t.false(none.blocked);
  t.false(none.categories.includes('dns_error'));
});
