/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// WHOIS/RDAP lookups of user-supplied domains follow URLs and redirects
// chosen by remote servers, so every hop must be a public http(s) host and
// the connection must go to a public address.
//

const http = require('node:http');

const sinon = require('sinon');
const test = require('ava');

const rdapFetch = require('#helpers/rdap-fetch');

async function listen(handler) {
  const hits = [];
  const server = http.createServer((req, res) => {
    hits.push(req.url);
    handler(req, res);
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  return { server, hits, port: server.address().port };
}

test.afterEach.always(() => {
  sinon.restore();
});

test.serial('a private RDAP URL is not requested', async (t) => {
  for (const url of [
    'http://169.254.169.254/latest/meta-data/',
    'http://127.0.0.1/domain/example.com',
    'http://[::ffff:127.0.0.1]/domain/example.com',
    '10.0.0.1/domain/example.com'
  ]) {
    const err = await t.throwsAsync(rdapFetch(url));
    t.is(err.code, 'EPRIVATEADDR', `${url}`);
  }
});

test.serial('a redirect to a private target is not followed', async (t) => {
  const target = await listen((req, res) => {
    res.end('internal');
  });
  const origin = await listen((req, res) => {
    res.writeHead(302, {
      location: `http://localhost:${target.port}/latest/meta-data/`
    });
    res.end();
  });

  // the 127.0.0.1 origin stands in for a public RDAP server and "localhost"
  // for an internal one
  sinon
    .stub(rdapFetch, 'isPrivateTarget')
    .callsFake(async (hostname) => hostname === 'localhost');
  // (connect directly in this test, the connect-time check is tested below)
  sinon.stub(rdapFetch, 'dispatcher').value(undefined);

  const err = await t.throwsAsync(
    rdapFetch(`http://127.0.0.1:${origin.port}/domain/example.com`)
  );
  t.is(err.code, 'EPRIVATEADDR');
  t.deepEqual(origin.hits, ['/domain/example.com']);
  t.is(target.hits.length, 0, 'the redirect target must not be requested');

  origin.server.close();
  target.server.close();
});

test.serial('a redirect to another scheme is not followed', async (t) => {
  const origin = await listen((req, res) => {
    res.writeHead(302, { location: 'file:///etc/passwd' });
    res.end();
  });
  sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);
  sinon.stub(rdapFetch, 'dispatcher').value(undefined);

  const err = await t.throwsAsync(
    rdapFetch(`http://127.0.0.1:${origin.port}/domain/example.com`)
  );
  t.is(err.code, 'EPRIVATEADDR');
  origin.server.close();
});

test.serial('a long redirect chain is refused', async (t) => {
  const origin = await listen((req, res) => {
    const n = Number(req.url.slice(1)) || 0;
    res.writeHead(302, { location: `/${n + 1}` });
    res.end();
  });
  sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);
  sinon.stub(rdapFetch, 'dispatcher').value(undefined);

  const err = await t.throwsAsync(
    rdapFetch(`http://127.0.0.1:${origin.port}/0`)
  );
  t.regex(err.message, /redirects/);
  t.deepEqual(origin.hits, ['/0', '/1', '/2', '/3', '/4', '/5']);
  origin.server.close();
});

test.serial(
  'a host that resolves to a private address when connecting is refused',
  async (t) => {
    const target = await listen((req, res) => {
      res.end('internal');
    });
    // passes the first check (e.g. DNS rebinding between check and connect)
    sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);

    await t.throwsAsync(
      rdapFetch(`http://localhost:${target.port}/domain/example.com`)
    );
    t.is(target.hits.length, 0);
    target.server.close();
  }
);

test.serial('redirects between public RDAP servers are followed', async (t) => {
  const target = await listen((req, res) => {
    res.writeHead(200, { 'content-type': 'application/rdap+json' });
    res.end(JSON.stringify({ objectClassName: 'domain' }));
  });
  const origin = await listen((req, res) => {
    res.writeHead(302, {
      location: `http://127.0.0.1:${target.port}${req.url}`
    });
    res.end();
  });
  sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);
  sinon.stub(rdapFetch, 'dispatcher').value(undefined);

  const response = await rdapFetch(
    `http://127.0.0.1:${origin.port}/domain/example.com`
  );
  t.is(response.status, 200);
  t.deepEqual(await response.json(), { objectClassName: 'domain' });
  t.deepEqual(target.hits, ['/domain/example.com']);

  origin.server.close();
  target.server.close();
});
