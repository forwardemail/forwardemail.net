/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const net = require('node:net');
const { Buffer } = require('node:buffer');

const Koa = require('koa');
const falso = require('@ngneat/falso');
const pWaitFor = require('p-wait-for');
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
// A field name is an object path, as deep as it has brackets, and a body
// nested deeper than a body may be is refused as it is set (see
// helpers/limit-body-depth.js): in a callback of multer's here, where what
// was thrown was caught by nothing, and the request was never answered.
//
test('a multipart field name nested too deep is a 400', async (t) => {
  const { api } = t.context;
  const name = (levels) => `a${'[b]'.repeat(levels)}`;

  // (read, and no email or password was sent)
  let res = await api.post('/v1/account').field(name(32), 'x');
  t.is(res.status, 400);
  t.notRegex(res.body.message, /nest/i);

  // (84 brackets are all that a name of 256 bytes holds)
  for (const levels of [33, 63, 64, 84]) {
    res = await api.post('/v1/account').field(name(levels), 'x');
    t.is(res.status, 400);
    t.is(res.body.message, `Field name nesting too deep: ${name(levels)}`);
  }
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

//
// multer 2.0.2 never settled a request whose client went away in the middle
// of a file upload, which kept the request and its context in memory.
//
// (an app whose upload middleware runs after `delay` ms of other work)
async function listenUpload(t, delay) {
  const state = { settled: 0 };
  const app = new Koa();
  app.use(async (ctx, next) => {
    try {
      await next();
    } finally {
      state.settled++;
    }
  });
  app.use(async (ctx, next) => {
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
    return next();
  });
  app.use(
    createMultipart(
      { limits: { files: 1, fileSize: 1024 * 1024 } },
      { rawErrors: true }
    ).fields([{ name: 'attachment', maxCount: 1 }])
  );
  app.use((ctx) => {
    ctx.body = 'ok';
  });
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());
  state.port = server.address().port;
  return state;
}

// starts an upload and leaves after `after` ms
async function abandonUpload(port, after) {
  const boundary = 'x-boundary';
  const req = http.request({
    host: '127.0.0.1',
    port,
    method: 'POST',
    headers: {
      'content-type': `multipart/form-data; boundary=${boundary}`,
      'content-length': 100_000
    }
  });
  req.on('error', () => {});
  req.write(
    `--${boundary}\r\nContent-Disposition: form-data; name="attachment"; filename="a.bin"\r\nContent-Type: application/octet-stream\r\n\r\n${'a'.repeat(
      1000
    )}`
  );
  await new Promise((resolve) => {
    setTimeout(resolve, after);
  });
  req.destroy();
}

test('an upload the client abandons is settled', async (t) => {
  // (while it is read, and before it is read)
  for (const [delay, after] of [
    [0, 200],
    [400, 100]
  ]) {
    const state = await listenUpload(t, delay);
    await abandonUpload(state.port, after);
    await new Promise((resolve) => {
      setTimeout(resolve, delay + 500);
    });
    t.is(state.settled, 1, `after ${delay} ms`);
  }
});

//
// Each field is limited (1 MB) but the body as a whole was not, so a body
// of 200 fields of 1 MB, sent before authentication and then held open,
// kept about 400 MB in memory per request.
//
function multipartBody(boundary, fields) {
  return Buffer.from(
    fields
      .map(
        ([name, value]) =>
          `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
      )
      .join('') + `--${boundary}--\r\n`
  );
}

test('a multipart body over the total size limit is refused before auth', async (t) => {
  const { api } = t.context;
  const big = 'a'.repeat(1000 * 1000);
  let req = api.post('/v1/account');
  for (let i = 0; i < 11; i++) req = req.field(`f${i}`, big);
  const res = await req;
  t.is(res.status, 413);
});

test('a chunked multipart body over the total size limit is cut off', async (t) => {
  const app = new Koa();
  let reached = false;
  // (and the request is settled, also when its body ends within the time
  // the rest of it is read after the 413)
  let settled = 0;
  app.use(async (ctx, next) => {
    try {
      await next();
    } finally {
      settled++;
    }
  });
  app.use(createMultipart().none());
  app.use((ctx) => {
    reached = true;
    ctx.body = 'ok';
  });
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());

  const boundary = 'x-boundary';
  const body = multipartBody(
    boundary,
    Array.from({ length: 12 }, (_, i) => [`f${i}`, 'a'.repeat(1000 * 1000)])
  );
  const outcome = await new Promise((resolve) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port: server.address().port,
        method: 'POST',
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary}`,
          'transfer-encoding': 'chunked'
        }
      },
      (res) => {
        res.resume();
        resolve(res.statusCode);
      }
    );
    req.on('error', () => resolve('closed'));
    // (written in 64 KB chunks, without a Content-Length)
    for (let i = 0; i < body.length; i += 65_536)
      req.write(body.subarray(i, i + 65_536));
    req.end();
  });
  t.false(reached);
  // (answered before the connection is closed)
  t.is(outcome, 413);
  await pWaitFor(() => settled === 1, { timeout: 3000 }).catch(() => {});
  t.is(settled, 1);
});

//
// Closing the connection while the client is still sending made the kernel
// answer with a reset, and a client that got the reset first (macOS) never
// read the 413. A client that goes on sending after the 413 must not get a
// reset, and the connection is closed once its body ends.
//
async function overLimitConnection(t) {
  const app = new Koa();
  app.use(createMultipart().none());
  app.use((ctx) => {
    ctx.body = 'ok';
  });
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());

  // (a raw connection: an HTTP client stops sending once it has the answer)
  const socket = net.connect({
    port: server.address().port,
    host: '127.0.0.1',
    allowHalfOpen: true
  });
  t.teardown(() => socket.destroy());
  const state = { response: '', error: null, closed: false };
  socket.on('data', (data) => {
    state.response += data;
  });
  socket.on('error', (err) => {
    state.error = err;
  });
  socket.on('close', () => {
    state.closed = true;
  });

  const part = '--x\r\nContent-Disposition: form-data; name="f"\r\n\r\n';
  socket.write(
    'POST / HTTP/1.1\r\nHost: localhost\r\n' +
      'Content-Type: multipart/form-data; boundary=x\r\n' +
      'Transfer-Encoding: chunked\r\n\r\n' +
      `${Buffer.byteLength(part).toString(16)}\r\n${part}\r\n`
  );
  const frame = Buffer.concat([
    Buffer.from('10000\r\n'),
    Buffer.alloc(65_536, 'a'),
    Buffer.from('\r\n')
  ]);
  const send = () => {
    if (!socket.destroyed) socket.write(frame);
  };

  // (send until the 413 arrives)
  while (!state.response.includes(' 413 ') && !state.closed) {
    for (let i = 0; i < 16; i++) send();
    await new Promise((resolve) => {
      setTimeout(resolve, 5);
    });
  }

  return { socket, state, send };
}

test('a chunked body still being sent after the 413 is read, not reset', async (t) => {
  const { socket, state, send } = await overLimitConnection(t);
  t.true(state.response.startsWith('HTTP/1.1 413 '));

  // (the client goes on sending for a while, then ends its body)
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 4; j++) send();
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }

  t.is(state.error, null);
  socket.end('9\r\n\r\n--x--\r\n\r\n0\r\n\r\n');
  await new Promise((resolve) => {
    if (state.closed) resolve();
    else socket.once('close', resolve);
  });
  t.is(state.error, null);
});

test('a chunked body that goes on after the 413 is cut off', async (t) => {
  const { socket, state, send } = await overLimitConnection(t);
  t.true(state.response.startsWith('HTTP/1.1 413 '));

  const timer = setInterval(() => {
    for (let i = 0; i < 4; i++) send();
  }, 10);
  t.teardown(() => clearInterval(timer));
  await new Promise((resolve) => {
    if (state.closed) resolve();
    else socket.once('close', resolve);
  });
  t.true(socket.destroyed);
});

// (as a client that asks to close the connection sends it, as supertest
// does: the connection was closed with the body still coming, so the client
// got a broken pipe, not the 413, on macOS)
test('a body declared over the limit and still being sent is read after the 413', async (t) => {
  const app = new Koa();
  let reached = false;
  app.use(createMultipart().none());
  app.use((ctx) => {
    reached = true;
    ctx.body = 'ok';
  });
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());

  const socket = net.connect({
    port: server.address().port,
    host: '127.0.0.1',
    allowHalfOpen: true
  });
  t.teardown(() => socket.destroy());
  const state = { response: '', error: null, closed: false };
  socket.on('data', (data) => {
    state.response += data;
  });
  socket.on('error', (err) => {
    state.error = err;
  });
  socket.on('close', () => {
    state.closed = true;
  });

  const length = 11 * 1024 * 1024;
  socket.write(
    'POST / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n' +
      'Content-Type: multipart/form-data; boundary=x\r\n' +
      `Content-Length: ${length}\r\n\r\n`
  );
  await pWaitFor(() => state.response.includes(' 413 ') || state.closed, {
    timeout: 3000
  });
  t.true(state.response.startsWith('HTTP/1.1 413 '));

  // (the client sends its body after the answer, as one sending it at once
  // would while the answer is on its way)
  const chunk = Buffer.alloc(65_536, 'a');
  for (let sent = 0; sent < length; sent += chunk.length) {
    socket.write(chunk.subarray(0, Math.min(chunk.length, length - sent)));
    if (sent % (1024 * 1024) === 0)
      await new Promise((resolve) => {
        setImmediate(resolve);
      });
  }

  socket.end();
  await new Promise((resolve) => {
    if (state.closed) resolve();
    else socket.once('close', resolve);
  });
  t.is(state.error, null);
  t.false(reached);
});

test('a multipart body under the total size limit is still parsed', async (t) => {
  const app = new Koa();
  app.use(createMultipart().none());
  app.use((ctx) => {
    ctx.body = { sizes: Object.values(ctx.request.body).map((v) => v.length) };
  });
  const server = http.createServer(app.callback());
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());

  const boundary = 'x-boundary';
  const res = await fetch(`http://127.0.0.1:${server.address().port}/`, {
    method: 'POST',
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
    body: multipartBody(
      boundary,
      Array.from({ length: 8 }, (_, i) => [`f${i}`, 'a'.repeat(1000 * 1000)])
    )
  });
  t.is(res.status, 200);
  const { sizes } = await res.json();
  t.deepEqual(sizes, Array.from({ length: 8 }).fill(1e6));
});
