/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Node 20 and later connect with `autoSelectFamily`, which calls the
// connect-time lookup with `all: true`; the resolver then gives an array of
// addresses. The WKD lookup read `.address` of that array, so every WKD
// fetch failed with ERR_INVALID_IP_ADDRESS and the private address check
// was skipped (#617).
//

const http = require('node:http');
const net = require('node:net');
const { once } = require('node:events');

const test = require('ava');
const sinon = require('sinon');

const createValidatingLookup = require('#helpers/create-validating-lookup');
const WKD = require('#helpers/wkd');

//
// Resolver that answers like Tangerine: an array of addresses when it is
// asked for all of them, otherwise the first address.
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

// (the connect-time lookup is only used for host names, not IP literals)
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
  'a host name is fetched when the resolver returns every address',
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
  'a host name is fetched when the resolver returns a single address',
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
  'a host name that resolves to a private address is not connected to',
  async (t) => {
    // (the host name passes the check made before connecting; the address
    // it resolves to at connection time is private)
    const stub = sinon
      .stub(WKD, 'isPrivateTarget')
      .callsFake(async (target) => target === '10.0.0.1');
    const resolver = createResolver([
      { address: '10.0.0.1', family: 4 },
      { address: '127.0.0.1', family: 4 }
    ]);

    const { origin, promise } = await fetchLocalhost(t, resolver);
    const err = await t.throwsAsync(promise);
    t.regex(`${err.message} ${err.cause?.message}`, /10\.0\.0\.1 is a private/);
    t.is(origin.hits.length, 0);
    t.true(stub.calledWith('10.0.0.1'));
  }
);

//
// A self-hosted install checked the host name before connecting, then
// connected wherever the system resolver sent it (a host that rebinds to an
// internal address in between was fetched).
//
test.serial(
  'a self-hosted install does not connect to a private address either',
  async (t) => {
    const config = require('#config');
    const { isSelfHosted } = config;
    config.isSelfHosted = true;
    t.teardown(() => {
      config.isSelfHosted = isSelfHosted;
    });
    // ("localhost" passes the check made before connecting; it resolves to
    // a loopback address when connecting)
    sinon
      .stub(WKD, 'isPrivateTarget')
      .callsFake(async (target) => target !== 'localhost');

    const { origin, promise } = await fetchLocalhost(t, createResolver([]));
    const err = await t.throwsAsync(promise);
    t.regex(`${err.message} ${err.cause?.message}`, /is a private/);
    t.is(origin.hits.length, 0);
  }
);

test.serial('a host name without addresses is not connected to', async (t) => {
  sinon.stub(WKD, 'isPrivateTarget').resolves(false);
  const resolver = createResolver([]);

  const { origin, promise } = await fetchLocalhost(t, resolver);
  const err = await t.throwsAsync(promise);
  t.regex(`${err.message} ${err.cause?.message}`, /No address found/);
  t.is(origin.hits.length, 0);
});

//
// The lookup itself, with a connection made the way Node 20 makes one
// (Node 18 can be asked to with `autoSelectFamily`)
//
async function connectWith(lookup, port, autoSelectFamily) {
  const socket = net.connect({
    host: 'localhost',
    port,
    lookup,
    autoSelectFamily
  });
  try {
    await once(socket, 'connect');
    return socket.remoteAddress;
  } finally {
    socket.destroy();
  }
}

for (const autoSelectFamily of [false, true]) {
  test(`a connection ${
    autoSelectFamily ? 'with' : 'without'
  } autoSelectFamily is made to an address that is allowed`, async (t) => {
    const origin = await listen();
    t.teardown(() => origin.server.close());
    const resolver = createResolver([
      { address: '127.0.0.1', family: 4 },
      // (a resolver may answer with plain strings, or with junk)
      { address: undefined, family: 4 }
    ]);
    const lookup = createValidatingLookup({
      lookup: resolver.lookup,
      isBlocked: () => false
    });
    t.is(await connectWith(lookup, origin.port, autoSelectFamily), '127.0.0.1');
  });

  //
  // (with autoSelectFamily any address may be connected to, so every one is
  // checked; without it the first is, as before)
  //
  test(`a connection ${
    autoSelectFamily ? 'with' : 'without'
  } autoSelectFamily is refused when ${
    autoSelectFamily ? 'any' : 'its'
  } address is not allowed`, async (t) => {
    const origin = await listen();
    t.teardown(() => origin.server.close());
    const resolver = createResolver(
      autoSelectFamily
        ? [
            { address: '127.0.0.1', family: 4 },
            { address: '10.0.0.1', family: 4 }
          ]
        : [
            { address: '10.0.0.1', family: 4 },
            { address: '127.0.0.1', family: 4 }
          ]
    );
    const lookup = createValidatingLookup({
      lookup: resolver.lookup,
      isBlocked: async (address) => address === '10.0.0.1'
    });
    const err = await t.throwsAsync(
      connectWith(lookup, origin.port, autoSelectFamily)
    );
    t.is(err.code, 'EPRIVATEADDR');
    t.is(err.address, '10.0.0.1');
  });
}

test('the lookup gives back what the caller asked for', async (t) => {
  const lookup = createValidatingLookup({
    lookup: async () => ['192.0.2.1', { address: '2001:db8::1', family: 6 }],
    isBlocked: () => false
  });
  const call = (options) =>
    new Promise((resolve, reject) => {
      lookup('example.com', options, (err, ...args) =>
        err ? reject(err) : resolve(args)
      );
    });
  t.deepEqual(await call({ all: true }), [
    [
      { address: '192.0.2.1', family: 4 },
      { address: '2001:db8::1', family: 6 }
    ]
  ]);
  t.deepEqual(await call({}), ['192.0.2.1', 4]);
  t.deepEqual(await call(4), ['192.0.2.1', 4]);
});

test('a failed resolution is passed on', async (t) => {
  const failure = Object.assign(new Error('queryA ENOTFOUND'), {
    code: 'ENOTFOUND'
  });
  const lookup = createValidatingLookup({
    async lookup() {
      throw failure;
    },
    isBlocked: () => false
  });
  const err = await new Promise((resolve) => {
    lookup('example.com', {}, resolve);
  });
  t.is(err, failure);
});
