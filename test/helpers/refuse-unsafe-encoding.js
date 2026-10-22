/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Brotli from a third party must never reach the decoder bundled with
// Node.js v18 (CVE-2026-111497), and fetch must not set up a decoder per
// coding of a long chain (undici CVE-2026-22036): responses from hosts a
// third party chooses (WKD, RDAP) are refused before fetch decodes them
// (request bodies: see test/web/refuse-unsafe-encoding.js).
//

const http = require('node:http');
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');
const { once } = require('node:events');

const sinon = require('sinon');
const test = require('ava');

//
// (the RDAP servers here run on 127.0.0.1, which the connect-time check
//  would refuse as private; the WKD one is allowed through its own stub)
//
const isPrivateHost = require('#helpers/is-private-host');

const isPrivateHostPath = require.resolve('#helpers/is-private-host');
require.cache[isPrivateHostPath].exports = Object.assign(
  () => false,
  isPrivateHost
);

const WKD = require('#helpers/wkd');
const rdapFetch = require('#helpers/rdap-fetch');

const JSON_BODY = Buffer.from(JSON.stringify({ objectClassName: 'domain' }));

async function listen(handler) {
  const server = http.createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server;
}

// (answers with `body`, sent with `encoding` as its Content-Encoding)
function respondWith(body, encoding) {
  return (req, res) => {
    res.writeHead(200, {
      'content-type': 'application/octet-stream',
      ...(encoding ? { 'content-encoding': encoding } : {})
    });
    res.end(body);
  };
}

test.afterEach.always(() => {
  sinon.restore();
});

//
// responses
//
test.serial('an RDAP response in Brotli is not decoded', async (t) => {
  sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);
  const server = await listen(
    respondWith(zlib.brotliCompressSync(JSON_BODY), 'br')
  );
  const url = `http://127.0.0.1:${server.address().port}/domain/example.com`;
  try {
    const err = await t.throwsAsync(async () => {
      const response = await rdapFetch(url);
      await response.json();
    });
    t.is((err.cause || err).code, 'ERR_UNSUPPORTED_CONTENT_ENCODING');
  } finally {
    server.close();
  }
});

test.serial(
  'an RDAP response with a long coding chain is refused',
  async (t) => {
    sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);
    const server = await listen(
      respondWith(
        zlib.gzipSync(zlib.gzipSync(zlib.gzipSync(JSON_BODY))),
        'gzip, gzip, gzip'
      )
    );
    const url = `http://127.0.0.1:${server.address().port}/domain/example.com`;
    try {
      const err = await t.throwsAsync(async () => {
        const response = await rdapFetch(url);
        await response.json();
      });
      t.is((err.cause || err).code, 'ERR_UNSUPPORTED_CONTENT_ENCODING');
    } finally {
      server.close();
    }
  }
);

test.serial('an RDAP response in gzip is still decoded', async (t) => {
  sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);
  const server = await listen(respondWith(zlib.gzipSync(JSON_BODY), 'gzip'));
  const url = `http://127.0.0.1:${server.address().port}/domain/example.com`;
  try {
    const response = await rdapFetch(url);
    t.deepEqual(await response.json(), { objectClassName: 'domain' });
  } finally {
    server.close();
  }
});

const resolver = {
  async lookup() {
    return { address: '127.0.0.1', family: 4 };
  }
};

test.serial('a WKD key served in Brotli is not decoded', async (t) => {
  sinon.stub(WKD, 'isPrivateTarget').resolves(false);
  const key = Buffer.from('key bytes');
  const server = await listen(respondWith(zlib.brotliCompressSync(key), 'br'));
  const wkd = new WKD(resolver, null);
  try {
    const err = await t.throwsAsync(
      wkd._fetch(
        `http://127.0.0.1:${server.address().port}/.well-known/openpgpkey/hu/x`
      )
    );
    t.is((err.cause || err).code, 'ERR_UNSUPPORTED_CONTENT_ENCODING');

    // (and one served as-is still is)
    server.removeAllListeners('request');
    server.on('request', respondWith(key));
    const response = await wkd._fetch(
      `http://127.0.0.1:${server.address().port}/.well-known/openpgpkey/hu/x`
    );
    t.deepEqual(Buffer.from(await response.arrayBuffer()), key);
  } finally {
    server.close();
  }
});

//
// (GitHub's API is trusted, but its answers are not decoded from Brotli
//  either: the request is sent to a local server in its place)
//
test.serial('a GitHub API response in Brotli is not decoded', async (t) => {
  const undici = require('undici');
  const { fetchReleasesFromRepo } = require('#helpers/get-github-releases');
  const requests = [];
  const server = await listen((req, res) => {
    requests.push(req.headers);
    respondWith(zlib.brotliCompressSync(Buffer.from('[]')), 'br')(req, res);
  });
  const { fetch } = undici;
  sinon
    .stub(undici, 'fetch')
    .callsFake((url, options) =>
      fetch(
        `http://127.0.0.1:${server.address().port}${new URL(url).pathname}`,
        options
      )
    );
  try {
    const err = await t.throwsAsync(fetchReleasesFromRepo('example/repo', 1));
    t.is((err.cause || err).code, 'ERR_UNSUPPORTED_CONTENT_ENCODING');
    t.is(requests[0]['accept-encoding'], 'gzip, deflate');
  } finally {
    server.close();
  }
});
