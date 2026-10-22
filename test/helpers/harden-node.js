/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Node.js v18 gets no security releases, so `helpers/harden-node` (loaded
// first by `config/env`, so by every process) applies the parts of later
// fixes that reach third-party input. These tests make real connections and
// lookups with the hardening loaded the way every process loads it.
//

const crypto = require('node:crypto');
const dns = require('node:dns');
const fs = require('node:fs');
const http = require('node:http');
const http2 = require('node:http2');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const tls = require('node:tls');
const { Buffer } = require('node:buffer');
const { Readable, pipeline } = require('node:stream');
const { execFileSync } = require('node:child_process');
const { promisify } = require('node:util');

const test = require('ava');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
const hardening = require('#helpers/harden-node');

const { BLOCKED_SPKI_SHA256 } = hardening;

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'harden-node-'));

function openssl(...args) {
  execFileSync('openssl', args, { cwd: dir, stdio: 'ignore' });
}

openssl(
  'req',
  '-x509',
  '-newkey',
  'rsa:2048',
  '-nodes',
  '-keyout',
  'ca.key',
  '-out',
  'ca.pem',
  '-subj',
  '/CN=Hardening Test CA',
  '-days',
  '2',
  '-addext',
  'basicConstraints=critical,CA:TRUE',
  '-addext',
  'keyUsage=critical,keyCertSign'
);

// a leaf the test CA issues for `san`
function issue(name, san) {
  fs.writeFileSync(
    path.join(dir, `${name}.ext`),
    `basicConstraints=CA:FALSE\nsubjectAltName=${san}\n`
  );
  openssl(
    'req',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-keyout',
    `${name}.key`,
    '-out',
    `${name}.csr`,
    '-subj',
    `/CN=${name}`
  );
  openssl(
    'x509',
    '-req',
    '-in',
    `${name}.csr`,
    '-CA',
    'ca.pem',
    '-CAkey',
    'ca.key',
    '-CAcreateserial',
    '-out',
    `${name}.pem`,
    '-days',
    '2',
    '-extfile',
    `${name}.ext`
  );
  return {
    key: fs.readFileSync(path.join(dir, `${name}.key`)),
    cert: fs.readFileSync(path.join(dir, `${name}.pem`))
  };
}

const ca = fs.readFileSync(path.join(dir, 'ca.pem'));
const LOCAL = issue('local', 'DNS:localhost,IP:127.0.0.1');

test.after.always(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

// (TLS 1.2, so that a session and a renegotiation are both possible)
async function listen(credentials, onConnection) {
  const server = tls.createServer(
    { ...credentials, maxVersion: 'TLSv1.2' },
    (socket) => {
      socket.on('error', () => {});
      if (onConnection) onConnection(socket);
      else socket.end('ok');
    }
  );
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  return server;
}

// (every host goes to 127.0.0.1, whatever its spelling)
function lookup(hostname, options, fn) {
  if (options.all) fn(null, [{ address: '127.0.0.1', family: 4 }]);
  else fn(null, '127.0.0.1', 4);
}

function connect(options) {
  return new Promise((resolve) => {
    const socket = tls.connect({ ca, lookup, ...options });
    let session;
    socket.on('session', (s) => {
      session = s;
    });
    socket.once('secureConnect', () => {
      const result = {
        authorized: socket.authorized,
        reused: socket.isSessionReused()
      };
      socket.resume();
      socket.once('close', () => {
        resolve({ ...result, session });
      });
    });
    socket.once('error', (err) => {
      resolve({ error: err });
    });
  });
}

test('a host that is an IP address only once normalized is refused', async (t) => {
  // (a certificate naming "0x7f.0.0.1" as a DNS name, for a host the
  //  resolver reads as 127.0.0.1)
  const server = await listen(issue('hex', 'DNS:0x7f.0.0.1'));
  const result = await connect({
    host: '0x7f.0.0.1',
    port: server.address().port
  });
  server.close();

  t.truthy(result.error);
  t.is(result.error.code, 'ERR_TLS_CERT_ALTNAME_INVALID');
  t.is(result.error.reason, 'Host is a non-canonical IP address');
});

test('a Unicode full stop does not hide a label from a wildcard', async (t) => {
  const server = await listen(issue('wildcard', 'DNS:*.wildcard.test'));
  const { port } = server.address();

  // (the resolver connects to foo.bar.wildcard.test, two labels deep)
  const deep = await connect({ host: 'foo。bar.wildcard.test', port });
  t.truthy(deep.error);
  t.is(deep.error.code, 'ERR_TLS_CERT_ALTNAME_INVALID');

  const shallow = await connect({ host: 'foo.wildcard.test', port });
  server.close();
  t.true(shallow.authorized);
});

test('a subjectAltName that could not be read is not replaced by the common name', (t) => {
  // (the certificate as Node.js v18 hands it over when the extension is
  //  present but cannot be converted: no `subjectaltname`, so its common
  //  name would be matched instead)
  const cert = {
    ...new crypto.X509Certificate(LOCAL.cert).toLegacyObject(),
    subject: { CN: 'victim.example' }
  };
  delete cert.subjectaltname;

  const err = tls.checkServerIdentity('victim.example', cert);
  t.truthy(err);
  t.is(err.code, 'ERR_TLS_CERT_ALTNAME_INVALID');

  // (a certificate without the extension still falls back to its common name)
  t.is(
    tls.checkServerIdentity('victim.example', {
      subject: { CN: 'victim.example' }
    }),
    undefined
  );
});

test('a chain through a blocked CA key is revoked', async (t) => {
  const spki = crypto
    .createHash('sha256')
    .update(
      new crypto.X509Certificate(ca).publicKey.export({
        type: 'spki',
        format: 'der'
      })
    )
    .digest('hex');
  const server = await listen(LOCAL);
  const { port } = server.address();

  const unblocked = await connect({ host: 'localhost', port });
  t.true(unblocked.authorized);

  BLOCKED_SPKI_SHA256.add(spki);
  try {
    const result = await connect({ host: 'localhost', port });
    t.truthy(result.error);
    t.is(result.error.code, 'CERT_REVOKED');

    // (also when the connection checks the name its own way)
    const custom = await connect({
      host: 'localhost',
      port,
      checkServerIdentity() {}
    });
    t.truthy(custom.error);
    t.is(custom.error.code, 'CERT_REVOKED');
  } finally {
    BLOCKED_SPKI_SHA256.delete(spki);
    server.close();
  }
});

test('a client never resumes a TLS session', async (t) => {
  const server = await listen(LOCAL);
  const { port } = server.address();
  const first = await connect({ host: 'localhost', port });
  t.true(first.authorized);
  t.truthy(first.session);

  // (a resumed session would skip the hostname check)
  const second = await connect({
    host: 'localhost',
    port,
    session: first.session
  });
  server.close();
  t.true(second.authorized);
  t.false(second.reused);
});

async function renegotiate(options) {
  let renegotiated;
  const serverError = new Promise((resolve) => {
    renegotiated = resolve;
  });
  const server = await listen(LOCAL, (socket) => {
    socket.on('error', (err) => {
      renegotiated(err);
    });
    socket.renegotiate({}, (err) => {
      renegotiated(err || null);
      socket.end('ok');
    });
  });

  await Promise.race([
    connect({ host: 'localhost', port: server.address().port, ...options }),
    serverError
  ]);
  const err = await serverError;
  server.close();
  return err;
}

test('a server cannot renegotiate a client connection', async (t) => {
  const err = await renegotiate();
  t.truthy(err);
  t.is(err.code, 'ERR_SSL_NO_RENEGOTIATION');

  // (also when the client brings its own secure context)
  const withContext = await renegotiate({
    secureContext: tls.createSecureContext({ ca })
  });
  t.truthy(withContext);
  t.is(withContext.code, 'ERR_SSL_NO_RENEGOTIATION');
});

test('a TLS server drops a client that stalls its handshake', async (t) => {
  const { tlsHandshakeTimeout } = hardening;
  hardening.tlsHandshakeTimeout = 300;
  let server;
  try {
    server = tls.createServer(LOCAL, () => {});
  } finally {
    hardening.tlsHandshakeTimeout = tlsHandshakeTimeout;
  }

  const clientError = new Promise((resolve) => {
    server.once('tlsClientError', resolve);
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  // (connects, and never sends a ClientHello)
  const socket = net.connect(server.address().port, '127.0.0.1');
  socket.on('error', () => {});
  const err = await Promise.race([
    clientError,
    new Promise((resolve) => {
      setTimeout(resolve, 3000, null);
    })
  ]);
  socket.destroy();
  server.close();
  t.truthy(err);
  t.is(err.code, 'ERR_TLS_HANDSHAKE_TIMEOUT');
});

async function listenHttp(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  return server;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test('a pipelined response queued behind another is closed when the client leaves', async (t) => {
  let closed = false;
  let requests = 0;
  const server = await listenHttp((req, res) => {
    requests++;
    // (the first response never finishes, so the second stays queued)
    if (requests === 1) {
      res.writeHead(200);
      res.write('start');
      return;
    }

    res.on('close', () => {
      closed = true;
    });
  });

  const socket = net.connect(server.address().port, '127.0.0.1');
  socket.on('error', () => {});
  socket.resume();
  socket.write(
    'GET /1 HTTP/1.1\r\nHost: example.test\r\n\r\nGET /2 HTTP/1.1\r\nHost: example.test\r\n\r\n'
  );
  await wait(200);
  t.is(requests, 2);
  socket.destroy();
  await wait(300);
  server.close();
  t.true(closed);
});

test('a stream sent to a queued response after the client left is destroyed', async (t) => {
  let requests = 0;
  let body;
  const server = await listenHttp(async (req, res) => {
    requests++;
    if (requests === 1) {
      res.writeHead(200);
      res.write('start');
      return;
    }

    // (an endless body, sent once the client has gone)
    await wait(300);
    body = new Readable({
      read() {
        this.push(Buffer.alloc(16 * 1024));
      }
    });
    pipeline(body, res, () => {});
  });

  const socket = net.connect(server.address().port, '127.0.0.1');
  socket.on('error', () => {});
  socket.resume();
  socket.write(
    'GET /1 HTTP/1.1\r\nHost: example.test\r\n\r\nGET /2 HTTP/1.1\r\nHost: example.test\r\n\r\n'
  );
  await wait(100);
  socket.destroy();
  await wait(600);
  server.close();
  t.is(requests, 2);
  t.true(body?.destroyed);
});

test('pipelined requests that are answered leave nothing behind', async (t) => {
  const sockets = new Set();
  const server = await listenHttp((req, res) => {
    sockets.add(req.socket);
    res.end('ok');
  });
  const socket = net.connect(server.address().port, '127.0.0.1');
  socket.on('error', () => {});
  let received = '';
  socket.on('data', (chunk) => {
    received += chunk;
  });
  socket.write('GET / HTTP/1.1\r\nHost: example.test\r\n\r\n'.repeat(200));
  await wait(1000);
  t.is(received.split('HTTP/1.1 200').length - 1, 200);
  const [serverSocket] = sockets;
  t.true(serverSocket.listenerCount('close') < 5);
  socket.destroy();
  server.close();
});

test('a TLS server made without options keeps its listener', (t) => {
  const listener = () => {};
  for (const server of [
    tls.createServer(undefined, listener),
    tls.createServer(null, listener),
    tls.createServer(listener)
  ])
    t.true(server.listeners('secureConnection').includes(listener));
});

test('a Connection value with a tab still closes the connection', async (t) => {
  const server = await listenHttp((req, res) => {
    res.end('ok');
  });
  const socket = net.connect(server.address().port, '127.0.0.1');
  socket.on('error', () => {});
  socket.resume();
  const ended = new Promise((resolve) => {
    socket.once('end', () => {
      resolve(true);
    });
  });
  socket.write(
    'GET / HTTP/1.1\r\nHost: example.test\r\nConnection: close\t\r\n\r\n'
  );
  const result = await Promise.race([ended, wait(1500).then(() => false)]);
  socket.destroy();
  server.close();
  t.true(result);
});

test('aborting a request whose response has fully arrived is quiet', async (t) => {
  const agent = new http.Agent({ keepAlive: true });
  const server = await listenHttp((req, res) => {
    res.end('done');
  });
  const controller = new AbortController();
  await new Promise((resolve, reject) => {
    http
      .get(
        {
          host: '127.0.0.1',
          port: server.address().port,
          agent,
          signal: controller.signal
        },
        async (res) => {
          // eslint-disable-next-line no-unreachable-loop
          for await (const chunk of res) {
            t.is(String(chunk), 'done');
            controller.abort();
            break;
          }

          resolve();
        }
      )
      .on('error', (err) => {
        if (err.name !== 'AbortError') reject(err);
      });
  });
  // (an error on the released socket would surface as uncaught here)
  await wait(300);
  agent.destroy();
  server.close();
  t.pass();
});

test('ORIGIN frames do not grow an HTTP/2 session without bound', async (t) => {
  const server = http2.createSecureServer(LOCAL);
  server.on('session', (session) => {
    session.origin(
      ...Array.from(
        { length: 200 },
        (_, i) => `https://origin-${i}.example.test`
      )
    );
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const session = http2.connect(`https://localhost:${server.address().port}`, {
    ca,
    lookup
  });
  session.on('error', () => {});
  const closed = await Promise.race([
    new Promise((resolve) => {
      session.once('close', () => {
        resolve(true);
      });
    }),
    wait(1500).then(() => false)
  ]);
  const size = session.originSet?.length;
  session.destroy();
  server.close();
  t.true(closed, `origins: ${size}`);
});

test('a name with a NUL byte is not looked up', async (t) => {
  // (the resolver would only see "localhost", and answer 127.0.0.1)
  const name = 'localhost\0.example.invalid';

  const err = await new Promise((resolve) => {
    dns.lookup(name, (err) => {
      resolve(err);
    });
  });
  t.is(err?.code, 'ERR_INVALID_ARG_VALUE');

  for (const fn of [
    () => dns.promises.lookup(name),
    () => dns.promises.resolve4(name),
    () => new dns.promises.Resolver().resolveMx(name)
  ]) {
    const err = await t.throwsAsync(fn());
    t.is(err.code, 'ERR_INVALID_ARG_VALUE');
  }

  const connectError = await new Promise((resolve) => {
    net.connect({ host: name, port: 1 }).once('error', resolve);
  });
  t.is(connectError.code, 'ERR_INVALID_ARG_VALUE');

  // (and a lookup without one still works, in both forms)
  t.deepEqual(await promisify(dns.lookup)('127.0.0.1'), {
    address: '127.0.0.1',
    family: 4
  });
});
