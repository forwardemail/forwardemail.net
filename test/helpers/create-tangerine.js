/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The app's resolver takes Cloudflare and Google in turn: each lookup starts
// with Cloudflare, from the next pair of servers each time (so lookups are
// spread evenly), and goes on to Google when Cloudflare does not answer, or
// cannot (it rate limits us, or answers SERVFAIL).
//

const path = require('node:path');
const { Buffer } = require('node:buffer');

const Redis = require('ioredis-mock');
const test = require('ava');

const createTangerine = require('#helpers/create-tangerine');
const { isTemporaryDnsError } = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');

// (Tangerine's own DNS message encoder)
const dnsPacket = require(require.resolve('dns-packet', {
  paths: [path.dirname(require.resolve('tangerine'))]
}));

//
// A resolver whose DNS-over-HTTPS servers are answered here: `answer(server,
// name)` returns the TXT records to answer with, null for a name that does
// not exist, 'SERVFAIL' for a server that cannot answer, an HTTP status code
// (e.g. 429), or undefined for a server that never answers (until the lookup
// is given up on)
//
function createResolver(answer) {
  const resolver = createTangerine(new Redis(), logger);
  const asked = [];
  resolver.request = async (url, options) => {
    const { hostname, searchParams } = new URL(url);
    const query = dnsPacket.decode(
      Buffer.from(searchParams.get('dns'), 'base64url')
    );
    const [{ name }] = query.questions;
    asked.push(hostname);
    const records = answer(hostname, name);
    if (records === undefined)
      return new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          const err = new Error('The operation was aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    if (typeof records === 'number')
      return { statusCode: records, headers: {}, body: Buffer.alloc(0) };
    return {
      statusCode: 200,
      headers: {},
      body: dnsPacket.encode({
        type: 'response',
        id: query.id,
        questions: query.questions,
        // (its response code, in its flags: SERVFAIL 2, NXDOMAIN 3)
        ...(records === null || records === 'SERVFAIL'
          ? { flags: records ? 2 : 3, answers: [] }
          : {
              answers: [{ type: 'TXT', name, ttl: 60, data: records }]
            })
      })
    };
  };

  return { resolver, asked };
}

test('each lookup starts with Cloudflare, from the next pair of servers', async (t) => {
  const { resolver, asked } = createResolver(() => ['v=spf1 -all']);
  for (let i = 0; i < 4; i++) {
    t.deepEqual(await resolver.resolveTxt(`${i}.example.com`), [
      ['v=spf1 -all']
    ]);
  }

  t.deepEqual(asked, ['1.1.1.1', '1.0.0.1', '1.1.1.1', '1.0.0.1']);
});

test('a lookup Cloudflare does not answer goes on to Google, and the next still starts with Cloudflare', async (t) => {
  const { resolver, asked } = createResolver((server, name) =>
    server === '1.1.1.1' && name === 'down.example.org' ? undefined : [server]
  );
  // (each try waits this long)
  resolver.options.timeout = 50;
  t.deepEqual(await resolver.resolveTxt('down.example.org'), [['8.8.8.8']]);
  t.deepEqual(asked, ['1.1.1.1', '1.1.1.1', '8.8.8.8']);

  asked.length = 0;
  t.deepEqual(await resolver.resolveTxt('up.example.org'), [['1.0.0.1']]);
  t.deepEqual(await resolver.resolveTxt('again.example.org'), [['1.1.1.1']]);
  t.deepEqual(asked, ['1.0.0.1', '1.1.1.1']);
});

test('a lookup Cloudflare rate limits, or answers SERVFAIL for, goes straight on to Google', async (t) => {
  for (const failure of [429, 'SERVFAIL']) {
    const { resolver, asked } = createResolver((server) =>
      server === '1.1.1.1' ? failure : [server]
    );

    t.deepEqual(await resolver.resolveTxt(`${failure}.example.org`), [
      ['8.8.8.8']
    ]);
    t.deepEqual(asked, ['1.1.1.1', '8.8.8.8'], `${failure}`);
  }
});

test('a name that does not exist is still answered as such', async (t) => {
  const { resolver } = createResolver(() => null);
  const err = await t.throwsAsync(resolver.resolveTxt('missing.example.net'));
  t.is(err.code, 'ENOTFOUND');
  t.false(isTemporaryDnsError(err));
});
