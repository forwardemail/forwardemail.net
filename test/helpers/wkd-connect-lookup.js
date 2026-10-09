/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const { once } = require('node:events');

const test = require('ava');
const sinon = require('sinon');

const WKD = require('#helpers/wkd');

//
// Resolver that answers like Tangerine: an array of addresses when it is
// asked for all of them (as Node 20+ does for autoSelectFamily), otherwise
// the first address.
//
function createResolver(addresses) {
  const resolver = {
    calls: [],
    async lookup(hostname, options = {}) {
      resolver.calls.push({ hostname, options });
      if (options.all) return addresses;
      return addresses[0];
    }
  };
  return resolver;
}

async function listen() {
  const hits = [];
  const server = http.createServer((req, res) => {
    hits.push(req.url);
    res.writeHead(200, { 'content-type': 'application/octet-stream' });
    res.end('key');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, hits, port: server.address().port };
}

// The connect-time lookup is only used for hostnames, not for IP literals
async function fetchLocalhost(t, resolver) {
  const origin = await listen();
  t.teardown(() => origin.server.close());
  const wkd = new WKD(resolver, null);
  const promise = wkd._fetch(`http://localhost:${origin.port}/key`);
  return { origin, promise };
}

test.afterEach.always(() => {
  sinon.restore();
});

test.serial(
  'a hostname is fetched when the resolver returns every address',
  async (t) => {
    sinon.stub(WKD, 'isPrivateTarget').resolves(false);
    const resolver = createResolver([{ address: '127.0.0.1', family: 4 }]);

    const { origin, promise } = await fetchLocalhost(t, resolver);
    const response = await promise;
    t.is(response.status, 200);
    t.is(await response.text(), 'key');
    t.deepEqual(origin.hits, ['/key']);
    t.true(resolver.calls.some(({ options }) => options.all === true));
  }
);

test.serial(
  'a hostname is fetched when the resolver returns a single address',
  async (t) => {
    sinon.stub(WKD, 'isPrivateTarget').resolves(false);
    const resolver = {
      async lookup() {
        return { address: '127.0.0.1', family: 4 };
      }
    };

    const { origin, promise } = await fetchLocalhost(t, resolver);
    const response = await promise;
    t.is(response.status, 200);
    t.deepEqual(origin.hits, ['/key']);
  }
);

test.serial(
  'a hostname with any private address is not connected to',
  async (t) => {
    // The hostname passes the check made before connecting; one of the
    // addresses it resolves to at connection time is private.
    const stub = sinon
      .stub(WKD, 'isPrivateTarget')
      .callsFake(async (target) => target === '10.0.0.1');
    const resolver = createResolver([
      { address: '127.0.0.1', family: 4 },
      { address: '10.0.0.1', family: 4 }
    ]);

    const { origin, promise } = await fetchLocalhost(t, resolver);
    const err = await t.throwsAsync(promise);
    t.regex(
      `${err.message} ${err.cause?.message}`,
      /10\.0\.0\.1 is a private address/
    );
    t.is(origin.hits.length, 0, 'private address must not be requested');
    t.true(stub.calledWith('10.0.0.1'));
  }
);

test.serial('a hostname without addresses is not connected to', async (t) => {
  sinon.stub(WKD, 'isPrivateTarget').resolves(false);
  const resolver = createResolver([]);

  const { origin, promise } = await fetchLocalhost(t, resolver);
  const err = await t.throwsAsync(promise);
  t.regex(`${err.message} ${err.cause?.message}`, /No address found/);
  t.is(origin.hits.length, 0);
});
