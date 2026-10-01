/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const sinon = require('sinon');
const test = require('ava');
const undici = require('undici');

const { respondsToHTTP } = require('#helpers/check-domain-reputation');

//
// Tangerine-compatible resolver with fixed answers (no network access)
//
function createResolver(a, aaaa = []) {
  return {
    resolve4: sinon.stub().resolves(a),
    resolve6: sinon.stub().resolves(aaaa),
    lookup: sinon.stub().resolves({ address: a[0], family: 4 })
  };
}

test.afterEach.always(() => {
  sinon.restore();
});

test.serial(
  'respondsToHTTP does not request a domain that resolves to a private address',
  async (t) => {
    const request = sinon.stub(undici, 'request').resolves({
      statusCode: 200,
      headers: {},
      body: { async dump() {}, text: async () => '' }
    });

    for (const resolver of [
      createResolver(['169.254.169.254']),
      createResolver(['10.0.0.1']),
      // any non-public answer blocks the domain
      createResolver(['93.184.216.34'], ['fd00::1'])
    ]) {
      t.false(await respondsToHTTP('private.example.com', resolver));
      t.is(request.callCount, 0, 'no request may be made');
      t.true(resolver.resolve4.calledWith('private.example.com'));
    }
  }
);

test.serial(
  'respondsToHTTP requests a public domain with a validating dispatcher',
  async (t) => {
    const request = sinon.stub(undici, 'request').resolves({
      statusCode: 200,
      headers: {},
      body: { async dump() {}, text: async () => '' }
    });

    const resolver = createResolver(['93.184.216.34']);
    await respondsToHTTP('public.example.com', resolver);

    t.true(request.called);
    const [url, opts] = request.firstCall.args;
    t.is(url, 'https://public.example.com');
    // the resolver is passed through so retryRequest creates an Agent whose
    // connect-time lookup validates the resolved address
    t.is(opts.resolver, resolver);
    t.true(opts.dispatcher instanceof undici.Agent);
  }
);
