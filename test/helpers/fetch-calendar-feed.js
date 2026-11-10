//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');
const { Readable } = require('node:stream');

const test = require('ava');
const sinon = require('sinon');
const undici = require('undici');

const fetchCalendarFeed = require('#helpers/fetch-calendar-feed');
const safeFetch = require('#helpers/safe-fetch');

const { normalizeFeedUrl, redactFeedUrl } = fetchCalendarFeed;

const ICS = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n';
const BOM = String.fromCodePoint(0xfe_ff);
const PUBLIC_IP = '93.184.216.34';

function respond(statusCode, headers = {}, body = '') {
  return {
    statusCode,
    headers,
    body: Readable.from(
      Array.isArray(body)
        ? body
        : [Buffer.isBuffer(body) ? body : Buffer.from(body)]
    )
  };
}

const noData = () =>
  Object.assign(new Error('queryA ENODATA'), { code: 'ENODATA' });

//
// URL normalization
//
test('normalizes webcal:// and webcals:// to https://', (t) => {
  t.is(
    normalizeFeedUrl('webcal://example.com/a.ics'),
    'https://example.com/a.ics'
  );
  t.is(
    normalizeFeedUrl('  WEBCAL://Example.com/a.ics  '),
    'https://example.com/a.ics'
  );
  t.is(
    normalizeFeedUrl('webcals://example.com/a.ics'),
    'https://example.com/a.ics'
  );
});

test('keeps https://, the query and an unprivileged port, drops the fragment', (t) => {
  t.is(
    normalizeFeedUrl('https://example.com:8443/a.ics?token=abc#frag'),
    'https://example.com:8443/a.ics?token=abc'
  );
});

test('refuses http:// unless allowed', (t) => {
  const error = t.throws(() => normalizeFeedUrl('http://example.com/a.ics'));
  t.is(error.code, 'FEED_HTTP_NOT_ALLOWED');
  t.is(
    normalizeFeedUrl('http://example.com/a.ics', { allowHttp: true }),
    'http://example.com/a.ics'
  );
});

test('refuses other schemes, credentials, privileged ports and junk', (t) => {
  for (const input of [
    'file:///etc/passwd',
    'ftp://example.com/a.ics',
    `${'java'}script:alert(1)`,
    'data:text/calendar,BEGIN:VCALENDAR',
    'gopher://example.com/',
    'https://user:pass@example.com/a.ics',
    'https://user@example.com/a.ics',
    'https://example.com:22/a.ics',
    'https://example.com:25/',
    'not a url',
    '',
    `https://example.com/${'a'.repeat(3000)}`,
    undefined,
    null,
    42
  ]) {
    const error = t.throws(() => normalizeFeedUrl(input, { allowHttp: true }));
    t.is(error.code, 'FEED_URL_INVALID', `${String(input).slice(0, 40)}`);
  }
});

test('errors never hold the feed URL', (t) => {
  const error = t.throws(() =>
    normalizeFeedUrl('https://user:secret-token@example.com/private-abc.ics')
  );
  t.false(error.message.includes('secret-token'));
  t.false(error.message.includes('private-abc'));
});

test('redacts a feed URL down to its scheme and host', (t) => {
  t.is(
    redactFeedUrl('webcal://example.com/private-abc/basic.ics?token=xyz'),
    'https://example.com/…'
  );
  t.is(redactFeedUrl('nonsense'), '(invalid URL)');
});

//
// SSRF: address literals (refused before any lookup or request)
//
test('refuses private, loopback, link-local, CGNAT and metadata literals', async (t) => {
  const request = sinon.stub();
  for (const url of [
    'https://127.0.0.1/a.ics',
    'https://127.1/a.ics',
    'https://2130706433/a.ics',
    'https://0x7f.0.0.1/a.ics',
    'https://0.0.0.0/a.ics',
    'https://10.0.0.1/a.ics',
    'https://172.16.0.1/a.ics',
    'https://192.168.1.1/a.ics',
    'https://169.254.169.254/latest/meta-data/',
    'https://100.64.0.1/a.ics',
    'https://[::1]/a.ics',
    'https://[fe80::1]/a.ics',
    'https://[fd00::1]/a.ics',
    'https://[fd00:ec2::254]/a.ics',
    'https://[::ffff:127.0.0.1]/a.ics',
    'https://[::ffff:169.254.169.254]/a.ics',
    'https://localhost/a.ics'
  ]) {
    const error = await t.throwsAsync(fetchCalendarFeed(url, { request }));
    t.is(error.code, 'FEED_PRIVATE_ADDRESS', `${url}`);
  }

  t.true(request.notCalled);
});

//
// SSRF: names that resolve to a blocked address (through the real transport,
// which refuses before it connects)
//
test('refuses a name that resolves to a blocked IPv4 address', async (t) => {
  for (const address of [
    '127.0.0.1',
    '10.1.2.3',
    '172.31.255.255',
    '192.168.0.10',
    '169.254.169.254',
    '100.100.100.200',
    '0.0.0.0'
  ]) {
    const resolver = { resolve4: sinon.stub().resolves([address]) };

    const error = await t.throwsAsync(
      fetchCalendarFeed('https://feed.example.com/a.ics', { resolver })
    );
    t.is(error.code, 'FEED_PRIVATE_ADDRESS', `${address}`);
    t.false(error.message.includes('feed.example.com'));
  }
});

test('refuses a name that resolves to a blocked IPv6 address', async (t) => {
  for (const address of ['::1', 'fe80::1', 'fd00::1', '::ffff:10.0.0.1']) {
    const resolver = {
      resolve4: sinon.stub().rejects(noData()),
      resolve6: sinon.stub().resolves([address])
    };

    const error = await t.throwsAsync(
      fetchCalendarFeed('https://feed.example.com/a.ics', { resolver })
    );
    t.is(error.code, 'FEED_PRIVATE_ADDRESS', `${address}`);
  }
});

test('a name that does not resolve is unreachable', async (t) => {
  const resolver = {
    resolve4: sinon.stub().rejects(noData()),
    resolve6: sinon.stub().rejects(noData())
  };
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://feed.example.com/a.ics', { resolver })
  );
  t.is(error.code, 'FEED_UNREACHABLE');
});

//
// DNS rebinding: the name is resolved once, and the connection is made to the
// address that was checked, so a second answer is never asked for
//
test('resolves a name once and pins the checked address', async (t) => {
  const resolver = {
    resolve4: sinon.stub().onFirstCall().resolves([PUBLIC_IP])
  };
  resolver.resolve4.onSecondCall().resolves(['127.0.0.1']);
  resolver.resolve6 = sinon.stub().resolves([]);

  // (capture the connection options the transport builds, without connecting)
  let connect;
  const agent = sinon.stub(undici, 'Agent').callsFake(function (options) {
    connect = options.connect;
    this.close = () => {};
  });
  const stub = sinon.stub(undici, 'request').resolves(respond(200, {}, ICS));
  t.teardown(() => {
    agent.restore();
    stub.restore();
  });

  const result = await fetchCalendarFeed('https://feed.example.com/a.ics', {
    resolver
  });
  t.is(result.body, ICS);
  t.is(resolver.resolve4.callCount, 1);

  // whatever the name answers now, the socket goes to the checked address
  const address = await new Promise((resolve, reject) => {
    connect.lookup('feed.example.com', {}, (err, value) =>
      err ? reject(err) : resolve(value)
    );
  });
  t.is(address, PUBLIC_IP);
  t.is(resolver.resolve4.callCount, 1);
});

//
// Redirects
//
test('follows redirects and reports where the feed was found', async (t) => {
  const request = sinon.stub();
  request
    .onCall(0)
    .resolves(respond(301, { location: 'https://b.example.com/b.ics' }));
  request.onCall(1).resolves(respond(308, { location: '/c.ics' }));
  request.onCall(2).resolves(respond(200, { etag: '"v1"' }, ICS));

  const result = await fetchCalendarFeed('webcal://a.example.com/a.ics', {
    request
  });
  t.is(request.args[0][0], 'https://a.example.com/a.ics');
  t.is(request.args[1][0], 'https://b.example.com/b.ics');
  t.is(request.args[2][0], 'https://b.example.com/c.ics');
  t.is(result.url, 'https://b.example.com/c.ics');
  t.true(result.permanentRedirect);
  t.is(result.etag, '"v1"');
});

test('a temporary hop is not a permanent redirect', async (t) => {
  const request = sinon.stub();
  request
    .onCall(0)
    .resolves(respond(302, { location: 'https://b.example.com/b.ics' }));
  request.onCall(1).resolves(respond(200, {}, ICS));
  const result = await fetchCalendarFeed('https://a.example.com/a.ics', {
    request
  });
  t.false(result.permanentRedirect);
});

test('refuses a redirect to a private address literal', async (t) => {
  for (const location of [
    'http://169.254.169.254/latest/meta-data/',
    'https://169.254.169.254/latest/meta-data/',
    'https://127.0.0.1:8080/',
    'https://[::1]/',
    'https://localhost/a.ics'
  ]) {
    const request = sinon.stub().resolves(respond(302, { location }));

    const error = await t.throwsAsync(
      fetchCalendarFeed('https://a.example.com/a.ics', {
        request,
        allowHttp: true
      })
    );
    t.is(error.code, 'FEED_PRIVATE_ADDRESS', `${location}`);
    t.is(request.callCount, 1);
  }
});

test('refuses a redirect to a name that resolves to a private address', async (t) => {
  const resolver = { resolve4: sinon.stub().resolves(['10.0.0.5']) };
  // (the first hop is answered here, the second goes through the transport)
  const request = sinon.stub().callsFake((url, options) => {
    if (request.callCount === 1)
      return respond(302, { location: 'https://backend.example.com/a.ics' });
    return safeFetch(url, options);
  });
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request, resolver })
  );
  t.is(error.code, 'FEED_PRIVATE_ADDRESS');
  t.true(resolver.resolve4.calledOnceWithExactly('backend.example.com'));
});

test('refuses a redirect from https:// to http://, another scheme or credentials', async (t) => {
  for (const [location, code] of [
    ['http://b.example.com/a.ics', 'FEED_HTTP_NOT_ALLOWED'],
    ['file:///etc/passwd', 'FEED_URL_INVALID'],
    ['https://user:pass@b.example.com/a.ics', 'FEED_URL_INVALID'],
    ['https://b.example.com:22/', 'FEED_URL_INVALID']
  ]) {
    const request = sinon.stub().resolves(respond(302, { location }));

    const error = await t.throwsAsync(
      fetchCalendarFeed('https://a.example.com/a.ics', { request })
    );
    t.is(error.code, code, `${location}`);
    t.is(request.callCount, 1);
  }
});

test('stops after the redirect limit', async (t) => {
  const request = sinon
    .stub()
    .callsFake(() =>
      respond(302, { location: 'https://a.example.com/again.ics' })
    );
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request })
  );
  t.is(error.code, 'FEED_TOO_MANY_REDIRECTS');
  // the first request and five redirects
  t.is(request.callCount, 6);
});

test('a redirect without a location is invalid', async (t) => {
  const request = sinon.stub().resolves(respond(302));
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request })
  );
  t.is(error.code, 'FEED_INVALID');
});

//
// Conditional requests
//
test('sends validators and reports an unchanged feed', async (t) => {
  const request = sinon.stub().resolves(respond(304));
  const result = await fetchCalendarFeed('https://a.example.com/a.ics', {
    request,
    etag: '"v1"',
    lastModified: 'Wed, 21 Oct 2026 07:28:00 GMT'
  });
  t.deepEqual(result, { notModified: true });
  const { headers } = request.args[0][1];
  t.is(headers['if-none-match'], '"v1"');
  t.is(headers['if-modified-since'], 'Wed, 21 Oct 2026 07:28:00 GMT');
});

test('sends no validators when it has none', async (t) => {
  const request = sinon
    .stub()
    .resolves(
      respond(200, { 'last-modified': 'Wed, 21 Oct 2026 07:28:00 GMT' }, ICS)
    );
  const result = await fetchCalendarFeed('https://a.example.com/a.ics', {
    request
  });
  const { headers } = request.args[0][1];
  t.false('if-none-match' in headers);
  t.false('if-modified-since' in headers);
  t.is(result.lastModified, 'Wed, 21 Oct 2026 07:28:00 GMT');
  t.false(result.notModified);
  t.false(result.permanentRedirect);
});

//
// Size and time limits
//
test('refuses a body over the limit by its declared length', async (t) => {
  const request = sinon
    .stub()
    .resolves(respond(200, { 'content-length': '2048' }, ICS));
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', {
      request,
      maxBytes: 1024
    })
  );
  t.is(error.code, 'FEED_TOO_LARGE');
});

test('refuses a body over the limit as it is read', async (t) => {
  let sent = 0;
  const body = new Readable({
    read() {
      sent++;
      this.push(Buffer.alloc(512, 'a'));
    }
  });
  const request = sinon.stub().resolves({ statusCode: 200, headers: {}, body });
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', {
      request,
      maxBytes: 4096
    })
  );
  t.is(error.code, 'FEED_TOO_LARGE');
  t.true(body.destroyed);
  // (it stopped reading soon after the limit rather than draining the body)
  t.true(sent < 100);
});

test('refuses a compressed body that expands over the limit', async (t) => {
  const bomb = zlib.gzipSync(Buffer.alloc(1024 * 1024, 'a'));
  t.true(bomb.length < 4096);
  const request = sinon
    .stub()
    .resolves(respond(200, { 'content-encoding': 'gzip' }, bomb));
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', {
      request,
      maxBytes: 4096
    })
  );
  t.is(error.code, 'FEED_TOO_LARGE');
});

test('reads gzip, deflate and brotli bodies', async (t) => {
  for (const [encoding, compress] of [
    ['gzip', zlib.gzipSync],
    ['deflate', zlib.deflateSync],
    ['br', zlib.brotliCompressSync]
  ]) {
    const request = sinon
      .stub()
      .resolves(
        respond(
          200,
          { 'content-encoding': encoding },
          compress(Buffer.from(ICS))
        )
      );

    const result = await fetchCalendarFeed('https://a.example.com/a.ics', {
      request
    });
    t.is(result.body, ICS, `${encoding}`);
  }
});

test('refuses an unknown content encoding and a damaged body', async (t) => {
  let request = sinon
    .stub()
    .resolves(respond(200, { 'content-encoding': 'zstd' }, ICS));
  let error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request })
  );
  t.is(error.code, 'FEED_INVALID');

  request = sinon
    .stub()
    .resolves(respond(200, { 'content-encoding': 'gzip' }, 'not gzip'));
  error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request })
  );
  t.is(error.code, 'FEED_INVALID');
});

test('times out a host that never answers', async (t) => {
  const request = sinon.stub().callsFake(
    (url, { signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener('abort', () =>
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
        );
      })
  );
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request, timeout: 50 })
  );
  t.is(error.code, 'FEED_TIMEOUT');
});

test('times out a body that never ends', async (t) => {
  // (sends the start of a calendar, then nothing)
  const body = new Readable({ read() {} });
  body.push(Buffer.from('BEGIN:VCALENDAR\r\n'));
  const request = sinon.stub().resolves({ statusCode: 200, headers: {}, body });
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request, timeout: 50 })
  );
  t.is(error.code, 'FEED_TIMEOUT');
  t.true(body.destroyed);
});

test('the deadline covers every hop together', async (t) => {
  const request = sinon.stub().callsFake(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 40);
    });
    return respond(302, { location: 'https://a.example.com/next.ics' });
  });
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', {
      request,
      timeout: 100,
      maxRedirects: 50
    })
  );
  t.is(error.code, 'FEED_TIMEOUT');
  t.true(request.callCount < 6);
});

//
// Statuses and content
//
test('reports the status and Retry-After of a failing host', async (t) => {
  let request = sinon.stub().resolves(respond(429, { 'retry-after': '120' }));
  let error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request })
  );
  t.is(error.code, 'FEED_HTTP_STATUS');
  t.is(error.statusCode, 429);
  t.is(error.retryAfter, 120_000);

  request = sinon.stub().resolves(respond(404));
  error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request })
  );
  t.is(error.statusCode, 404);
  t.is(error.retryAfter, undefined);
});

test('refuses a body that is not a calendar', async (t) => {
  const request = sinon
    .stub()
    .resolves(respond(200, {}, '<!doctype html><html>Sign in</html>'));
  const error = await t.throwsAsync(
    fetchCalendarFeed('https://a.example.com/a.ics', { request })
  );
  t.is(error.code, 'FEED_INVALID');
});

test('accepts a calendar that starts with a byte order mark or blank lines', async (t) => {
  const request = sinon.stub().resolves(respond(200, {}, `${BOM}\r\n${ICS}`));
  const result = await fetchCalendarFeed('https://a.example.com/a.ics', {
    request
  });
  t.true(result.body.includes('BEGIN:VCALENDAR'));
  t.false(result.body.startsWith(BOM));
});

test('no error message holds the feed URL', async (t) => {
  const secret = 'private-5f2c9a';
  const url = `https://a.example.com/${secret}/basic.ics?token=${secret}`;
  for (const request of [
    sinon.stub().resolves(respond(500)),
    sinon.stub().resolves(respond(200, {}, 'nope')),
    sinon.stub().rejects(new Error(`connect ECONNREFUSED ${url}`)),
    sinon
      .stub()
      .resolves(respond(302, { location: `http://b.example.com/${secret}` }))
  ]) {
    const error = await t.throwsAsync(fetchCalendarFeed(url, { request }));
    t.false(error.message.includes(secret));
    t.false(JSON.stringify(error).includes(secret));
  }
});
