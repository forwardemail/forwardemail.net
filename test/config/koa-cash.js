/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Koa = require('koa');
const Redis = require('ioredis-mock');
const request = require('supertest');
const test = require('ava');

const koaCash = require(require.resolve('koa-cash', {
  paths: [require.resolve('@ladjs/web')]
}));

const koaCashConfig = require('#config/koa-cash');

//
// Every spelling of one static path is cached once, under one key.
//
test('spellings of one path share one cache entry', async (t) => {
  const client = new Redis();
  t.teardown(() => client.disconnect());

  let served = 0;
  const app = new Koa();
  app.use(koaCash(koaCashConfig(client)));
  app.use(async (ctx) => {
    if (await ctx.cashed()) return;
    served++;
    ctx.type = 'text/plain';
    ctx.body = 'a'.repeat(2048);
  });

  const server = app.listen();
  t.teardown(() => server.close());

  const spellings = [
    '/img/a.png',
    '/img//a.png',
    '//img///a.png',
    '/img/./a.png',
    '/img/%61.png',
    '/img/../img/a.png',
    '/img/%2e%2e/img/a.png',
    '/img/a.png?x=1'
  ];
  for (const spelling of spellings) {
    const res = await request(server).get(spelling);
    t.is(res.status, 200, `${spelling}`);
    t.is(res.text.length, 2048, `${spelling}`);
  }

  t.is(served, 1);
  const keys = await client.keys('koa-cash:*');
  t.deepEqual(keys, ['koa-cash:/img/a.png']);

  // a different path is its own entry, and malformed escapes do not throw
  const other = await request(server).get('/img/b.png');
  t.is(other.status, 200);
  const malformed = await request(server).get('/img/%E0%A4%A.png');
  t.is(malformed.status, 200);
  t.is(served, 3);
});
