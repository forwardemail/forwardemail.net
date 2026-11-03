//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const test = require('ava');
const sinon = require('sinon');

const safeFetch = require('#helpers/safe-fetch');

test('requires a Tangerine resolver', async (t) => {
  const error = await t.throwsAsync(safeFetch('https://example.com'));

  t.true(error instanceof TypeError);
  t.is(error.message, 'safeFetch requires a Tangerine resolver');
});

test('rejects failed Tangerine DNS resolution', async (t) => {
  const resolver = { resolve4: sinon.stub().resolves([]) };
  const error = await t.throwsAsync(
    safeFetch('https://example.com', { resolver })
  );

  t.true(resolver.resolve4.calledOnceWithExactly('example.com'));
  t.is(error.message, 'DNS resolution failed for example.com');
});

test('rejects private addresses returned by Tangerine', async (t) => {
  const resolver = { resolve4: sinon.stub().resolves(['127.0.0.1']) };
  const error = await t.throwsAsync(
    safeFetch('https://example.com', { resolver })
  );

  t.true(resolver.resolve4.calledOnceWithExactly('example.com'));
  t.is(error.message, 'Resolved IP for example.com is a private address');
});

test('pins a host on IPv6 only to its AAAA record', async (t) => {
  const noData = Object.assign(new Error('queryA ENODATA example.com'), {
    code: 'ENODATA'
  });
  const resolver = {
    resolve4: sinon.stub().rejects(noData),
    resolve6: sinon.stub().resolves(['fd00::1'])
  };
  const error = await t.throwsAsync(
    safeFetch('https://example.com', { resolver })
  );

  // (the address it was pinned to is checked, so this one is refused)
  t.true(resolver.resolve6.calledWith('example.com'));
  t.is(error.message, 'Resolved IP for example.com is a private address');
});

test('pins an IPv6 literal without looking it up', async (t) => {
  const resolver = { resolve4: sinon.stub().resolves([]) };
  const error = await t.throwsAsync(
    safeFetch('https://[fd00::1]/', { resolver })
  );

  t.true(resolver.resolve4.notCalled);
  t.is(error.message, 'Resolved IP for [fd00::1] is a private address');
});

// (a failed A lookup, unlike a missing A record, is not a host on IPv6 only)
test('a failed A lookup fails as before', async (t) => {
  const timeout = Object.assign(new Error('queryA ETIMEOUT example.com'), {
    code: 'ETIMEOUT'
  });
  const resolver = {
    resolve4: sinon.stub().rejects(timeout),
    resolve6: sinon.stub().resolves(['2001:db8::1'])
  };
  const error = await t.throwsAsync(
    safeFetch('https://example.com', { resolver })
  );
  t.is(error, timeout);
  t.true(resolver.resolve6.notCalled);
});
