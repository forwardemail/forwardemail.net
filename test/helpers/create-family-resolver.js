/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const { Buffer } = require('node:buffer');
const { once } = require('node:events');

const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const createFamilyResolver = require('#helpers/create-family-resolver');
const createTangerine = require('#helpers/create-tangerine');

test.beforeEach(utils.setupRedisClient);
test.afterEach.always((t) => {
  t.context.client.disconnect();
  t.context.subscriber.disconnect();
  if (t.context.server) t.context.server.close();
});

//
// A DNS over HTTPS server that answers every A query with 0.0.0.0 (as
// Cloudflare Family DNS does for a blocked domain) and a TTL of one day.
//
async function blockingServer(t) {
  const server = http.createServer(async (req, res) => {
    let query;
    if (req.method === 'GET') {
      query = Buffer.from(
        new URL(req.url, 'http://localhost').searchParams.get('dns'),
        'base64url'
      );
    } else {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      query = Buffer.concat(chunks);
    }

    // the question section ends after the name (QNAME), QTYPE and QCLASS
    let end = 12;
    while (query[end] !== 0) end += query[end] + 1;
    end += 5;
    const header = Buffer.from(query.subarray(0, 12));
    header.writeUInt16BE(0x81_80, 2); // response, recursion available
    header.writeUInt16BE(1, 6); // one answer
    header.writeUInt16BE(0, 8);
    header.writeUInt16BE(0, 10);
    const answer = Buffer.alloc(16);
    answer.writeUInt16BE(0xc0_0c, 0); // the name in the question
    answer.writeUInt16BE(1, 2); // A
    answer.writeUInt16BE(1, 4); // IN
    answer.writeUInt32BE(86_400, 6); // TTL of one day
    answer.writeUInt16BE(4, 10); // 0.0.0.0
    res.writeHead(200, { 'Content-Type': 'application/dns-message' });
    res.end(Buffer.concat([header, query.subarray(12, end), answer]));
  });
  t.context.server = server;
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return `127.0.0.1:${server.address().port}`;
}

test('blocked answers are cached apart from other lookups, for at most 30 minutes', async (t) => {
  const server = await blockingServer(t);
  const familyResolver = createFamilyResolver(t.context.client);
  familyResolver.options.protocol = 'http';
  familyResolver.options.servers = new Set([server]);

  const name = 'blocked-domain.example.com';
  t.deepEqual(await familyResolver.resolve4(name), ['0.0.0.0']);

  // the default resolver does not get the filtered answer from the cache
  const resolver = createTangerine(t.context.client);
  t.falsy(await resolver.options.cache.get(`a:${name}`));

  // and the filtered answer expires in at most 30 minutes (not a day)
  const cached = await familyResolver.options.cache.get(`a:${name}`);
  t.truthy(cached);
  t.true(cached.ttl <= ms('30m') / 1000);
  const keys = await t.context.client.keys(
    `${t.context.client.options.keyPrefix}*${name}`
  );
  t.is(keys.length, 1);
  const pttl = await t.context.client.pttl(
    keys[0].slice(t.context.client.options.keyPrefix.length)
  );
  t.true(pttl > 0 && pttl <= ms('30m'));
});
