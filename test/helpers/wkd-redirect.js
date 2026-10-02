/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const { Buffer } = require('node:buffer');
const { once } = require('node:events');

const test = require('ava');
const sinon = require('sinon');

const WKD = require('#helpers/wkd');

//
// Resolver used by the connect-time lookup; "localhost" is mapped to IPv4
// so the tests do not depend on the host's resolver configuration.
//
const resolver = {
  async lookup() {
    return { address: '127.0.0.1', family: 4 };
  }
};

async function listen(handler) {
  const hits = [];
  const server = http.createServer((req, res) => {
    hits.push(req.url);
    handler(req, res);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, hits, port: server.address().port };
}

test.afterEach.always(() => {
  sinon.restore();
});

test.serial(
  'redirect to a private target is re-validated and not followed',
  async (t) => {
    // Target that must never be reached (stands in for a private address)
    const target = await listen((req, res) => {
      res.end('internal');
    });
    const origin = await listen((req, res) => {
      res.writeHead(302, {
        location: `http://localhost:${target.port}/latest/meta-data/`
      });
      res.end();
    });

    // Treat "localhost" as private; the 127.0.0.1 origin is allowed so the
    // first hop succeeds and only the redirect target is refused.
    const stub = sinon
      .stub(WKD, 'isPrivateTarget')
      .callsFake(async (hostname) => hostname === 'localhost');

    const wkd = new WKD(resolver, null);
    const err = await t.throwsAsync(
      wkd._fetch(`http://127.0.0.1:${origin.port}/.well-known/openpgpkey/hu/x`)
    );
    t.true(err.isBoom);
    t.is(err.output.statusCode, 400);
    t.is(origin.hits.length, 1);
    t.is(target.hits.length, 0, 'redirect target must not be requested');
    t.true(stub.calledWith('localhost'));

    target.server.close();
    origin.server.close();
  }
);

test.serial('redirect to a non-http(s) scheme is refused', async (t) => {
  const origin = await listen((req, res) => {
    res.writeHead(302, { location: 'file:///etc/passwd' });
    res.end();
  });

  const wkd = new WKD(resolver, null);
  const err = await t.throwsAsync(
    wkd._fetch(`http://127.0.0.1:${origin.port}/`)
  );
  t.true(err.isBoom);
  t.is(err.output.statusCode, 400);
  origin.server.close();
});

test.serial('more than 3 redirects are refused', async (t) => {
  const origin = await listen((req, res) => {
    const n = Number(req.url.slice(1)) || 0;
    res.writeHead(302, { location: `/${n + 1}` });
    res.end();
  });

  const wkd = new WKD(resolver, null);
  const err = await t.throwsAsync(
    wkd._fetch(`http://127.0.0.1:${origin.port}/0`)
  );
  t.is(err.code, 'EWKDREDIRECT');
  // initial request plus three followed redirects
  t.deepEqual(origin.hits, ['/0', '/1', '/2', '/3']);
  origin.server.close();
});

test.serial('redirect to an allowed target is followed', async (t) => {
  const target = await listen((req, res) => {
    res.writeHead(200, { 'content-type': 'application/octet-stream' });
    res.end('key');
  });
  const origin = await listen((req, res) => {
    res.writeHead(301, { location: `http://127.0.0.1:${target.port}/key` });
    res.end();
  });

  const stub = sinon.stub(WKD, 'isPrivateTarget').resolves(false);

  const wkd = new WKD(resolver, null);
  const response = await wkd._fetch(`http://127.0.0.1:${origin.port}/`);
  t.is(response.status, 200);
  t.is(await response.text(), 'key');
  t.deepEqual(target.hits, ['/key']);
  // both hops validated before connecting
  t.is(stub.callCount, 2);

  target.server.close();
  origin.server.close();
});

test.serial('a response larger than any key is refused', async (t) => {
  // (the body never ends; it must not be buffered without limit)
  const origin = await listen((req, res) => {
    res.writeHead(200, { 'content-type': 'application/octet-stream' });
    const chunk = Buffer.alloc(64 * 1024, 1);
    const timer = setInterval(() => res.write(chunk), 0);
    res.on('close', () => clearInterval(timer));
  });
  sinon.stub(WKD, 'isPrivateTarget').resolves(false);

  const wkd = new WKD(resolver, null);
  const err = await t.throwsAsync(
    wkd._fetch(`http://127.0.0.1:${origin.port}/`)
  );
  t.is(err.code, 'EWKDTOOLARGE');
  origin.server.closeAllConnections();
  origin.server.close();
});
