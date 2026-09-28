/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const { Buffer } = require('node:buffer');

const Koa = require('koa');
const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const createMultipart = require('#helpers/multipart');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.afterEach.always(utils.teardownApiServer);

//
// `a[4294967294]` followed by `a[b]` used to make append-field walk a sparse
// array of 2^32-1 entries (minutes of blocked event loop) before any
// authentication, on every /v1 route.
//
test('multipart field names with huge array indices do not stall the API', async (t) => {
  const { api } = t.context;
  const start = Date.now();
  const res = await api
    .post('/v1/account')
    .field('a[4294967294]', 'x')
    .field('a[b]', 'y')
    .field('c[99999999]', 'x')
    .field('c[d]', 'y');
  const elapsed = Date.now() - start;

  // no email or password was sent
  t.is(res.status, 400);
  t.true(elapsed < 2000, `request took ${elapsed}ms`);
});

test('multipart forms are still parsed on /v1 routes', async (t) => {
  const { api } = t.context;
  const res = await api
    .post('/v1/account')
    .field('email', falso.randEmail())
    .field('password', falso.randPassword());
  t.is(res.status, 200);
  t.is(typeof res.body.email, 'string');
});

test('a file sent to a /v1 route that takes none is a 400, not a 500', async (t) => {
  const { api } = t.context;
  const res = await api
    .post('/v1/account')
    .field('email', falso.randEmail())
    .attach('file', Buffer.from('hello'), 'hello.txt');
  t.is(res.status, 400);
});

test('too many multipart fields is a 400', async (t) => {
  const { api } = t.context;
  let req = api.post('/v1/account');
  for (let i = 0; i < 1001; i++) req = req.field(`f${i}`, 'x');
  const res = await req;
  t.is(res.status, 400);
});

//
// The parsed body keeps the usual shape for ordinary names, and stores a
// name with an out-of-range index under its literal name.
//
test('parsed body shape', async (t) => {
  const app = new Koa();
  app.use(createMultipart().none());
  app.use((ctx) => {
    ctx.body = { body: ctx.request.body };
  });
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());

  const boundary = 'x-boundary';
  const parts = [
    ['to[0]', 'a@example.com'],
    ['to[1]', 'b@example.com'],
    ['headers[X-Test]', 'yes'],
    ['tags[]', 'one'],
    ['tags[]', 'two'],
    ['big[1001]', 'first'],
    ['big[1001]', 'second'],
    ['ok[1000]', 'kept']
  ];
  const payload = parts
    .map(
      ([name, value]) =>
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
    )
    .join('')
    .concat(`--${boundary}--\r\n`);

  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/`, {
    method: 'POST',
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
    body: payload
  });
  const { body } = await res.json();

  t.deepEqual(body.to, ['a@example.com', 'b@example.com']);
  t.deepEqual(body.headers, { 'X-Test': 'yes' });
  t.deepEqual(body.tags, ['one', 'two']);
  t.deepEqual(body['big[1001]'], ['first', 'second']);
  t.is(body.big, undefined);
  t.is(body.ok.length, 1001);
  t.is(body.ok[1000], 'kept');
});
