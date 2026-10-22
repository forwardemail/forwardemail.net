/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The web server serves HTTPS over HTTP/1.1 only: the HTTP/2 server in
// Node.js v18 has unpatched memory-safety bugs any client can reach (see
// helpers/use-http1-server.js), so a client that offers "h2" must still get
// HTTP/1.1, and the site must still work over it.
//

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const tls = require('node:tls');
const { execFileSync } = require('node:child_process');

const Redis = require('ioredis-mock');
const undici = require('undici');
const test = require('ava');
const Web = require('@ladjs/web');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Users = require('#models/users');
const useHttp1Server = require('#helpers/use-http1-server');
const webConfig = require('#config/web');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'http1-server-'));
execFileSync(
  'openssl',
  [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-keyout',
    'key.pem',
    '-out',
    'cert.pem',
    '-subj',
    '/CN=localhost',
    '-days',
    '2',
    '-addext',
    'subjectAltName=DNS:localhost,IP:127.0.0.1'
  ],
  { cwd: dir, stdio: 'ignore' }
);
const key = fs.readFileSync(path.join(dir, 'key.pem'));
const cert = fs.readFileSync(path.join(dir, 'cert.pem'));

test.before(async (t) => {
  const client = new Redis();
  // (the options @ladjs/shared-config gives an HTTPS server in production)
  const web = useHttp1Server(
    new Web(
      {
        ...webConfig(client),
        redis: client,
        protocol: 'https',
        ssl: { allowHTTP1: true, minVersion: 'TLSv1.2', key, cert }
      },
      Users
    )
  );
  await web.listen(0, '127.0.0.1');
  t.context.web = web;
  t.context.port = web.server.address().port;
});

test.after.always(async (t) => {
  await t.context.web?.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test('a client offering HTTP/2 gets HTTP/1.1', async (t) => {
  const socket = tls.connect({
    host: '127.0.0.1',
    port: t.context.port,
    servername: 'localhost',
    ca: cert,
    ALPNProtocols: ['h2', 'http/1.1']
  });
  await new Promise((resolve, reject) => {
    socket.once('secureConnect', resolve);
    socket.once('error', reject);
  });
  t.true(socket.authorized);
  t.is(socket.alpnProtocol, 'http/1.1');
  socket.destroy();

  // (and one that offers only HTTP/2 does not get it)
  const h2 = tls.connect({
    host: '127.0.0.1',
    port: t.context.port,
    servername: 'localhost',
    ca: cert,
    ALPNProtocols: ['h2']
  });
  await new Promise((resolve, reject) => {
    h2.once('secureConnect', resolve);
    h2.once('error', reject);
  });
  t.not(h2.alpnProtocol, 'h2');
  h2.destroy();
});

test('the site is served over HTTPS', async (t) => {
  const res = await undici.fetch(`https://127.0.0.1:${t.context.port}/`, {
    redirect: 'manual',
    dispatcher: new undici.Agent({
      connect: { ca: cert, servername: 'localhost' }
    })
  });
  t.is(res.status, 301);
  t.is(res.headers.get('location'), '/en');
});
