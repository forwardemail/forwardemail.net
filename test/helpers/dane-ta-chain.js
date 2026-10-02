/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// DANE-TA (TLSA usage 2): the server's certificate is accepted only when the
// pinned trust anchor actually issued it and it names the MX host. The chain
// is whatever the server sends (and `rejectUnauthorized` is off for DANE), so
// a leaf of the attacker's own followed by the public trust anchor
// certificate must not pass.
//

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const tls = require('node:tls');
const { execFileSync } = require('node:child_process');

const test = require('ava');
const { dane } = require('@forwardemail/mx-connect');

const { prepareDaneTlsOptions } = require('#helpers/dane-tls-wrapper');

const HOST = 'mx.dane-victim.example';

function openssl(dir, ...args) {
  execFileSync('openssl', args, { cwd: dir, stdio: 'ignore' });
}

// a CA and a leaf it signs for `cn` (with a matching subjectAltName)
function leafFrom(dir, ca, name, cn) {
  fs.writeFileSync(
    path.join(dir, `${name}.ext`),
    `basicConstraints=CA:FALSE\nsubjectAltName=DNS:${cn}\n`
  );
  openssl(dir, 'genrsa', '-out', `${name}.key`, '2048');
  openssl(
    dir,
    'req',
    '-new',
    '-key',
    `${name}.key`,
    '-subj',
    `/CN=${cn}`,
    '-out',
    `${name}.csr`
  );
  openssl(
    dir,
    'x509',
    '-req',
    '-in',
    `${name}.csr`,
    '-CA',
    `${ca}.crt`,
    '-CAkey',
    `${ca}.key`,
    '-CAcreateserial',
    '-days',
    '2',
    '-extfile',
    `${name}.ext`,
    '-out',
    `${name}.crt`
  );
}

function ca(dir, name) {
  openssl(
    dir,
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-keyout',
    `${name}.key`,
    '-subj',
    '/CN=Victim Trust Anchor',
    '-days',
    '2',
    '-addext',
    'basicConstraints=critical,CA:TRUE',
    '-out',
    `${name}.crt`
  );
}

test.before((t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dane-ta-'));
  t.context.dir = dir;
  // the genuine trust anchor (pinned by the TLSA record)
  ca(dir, 'ta');
  // the attacker's own CA, with the same name as the trust anchor
  ca(dir, 'fake');
  leafFrom(dir, 'ta', 'genuine', HOST);
  leafFrom(dir, 'fake', 'forged', HOST);
  leafFrom(dir, 'ta', 'other', 'mx.someone-else.example');
  const anchor = new crypto.X509Certificate(
    fs.readFileSync(path.join(dir, 'ta.crt'))
  );
  t.context.tlsaRecords = [
    {
      usage: 2,
      selector: 0,
      mtype: 1,
      cert: crypto.createHash('sha256').update(anchor.raw).digest()
    }
  ];
});

test.after.always((t) => {
  fs.rmSync(t.context.dir, { recursive: true, force: true });
});

// connect with DANE to a server sending `leaf` followed by the trust anchor
async function connect(t, leaf) {
  const { dir, tlsaRecords } = t.context;
  const read = (file) => fs.readFileSync(path.join(dir, file), 'utf8');
  const server = tls.createServer(
    { key: read(`${leaf}.key`), cert: read(`${leaf}.crt`) + read('ta.crt') },
    (socket) => {
      socket.end('220 hello\r\n');
    }
  );
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());

  const options = {
    host: '127.0.0.1',
    port: server.address().port,
    servername: HOST
  };
  prepareDaneTlsOptions(
    options,
    dane.createDaneVerifier(tlsaRecords, {}),
    HOST,
    tlsaRecords
  );
  return new Promise((resolve) => {
    const socket = tls.connect(options, () => {
      socket.end();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
  });
}

test('accepts a certificate issued by the pinned trust anchor', async (t) => {
  t.true(await connect(t, 'genuine'));
});

test('rejects a certificate not signed by the trust anchor it is sent with', async (t) => {
  t.false(await connect(t, 'forged'));
});

test('rejects a certificate from the trust anchor for another host', async (t) => {
  t.false(await connect(t, 'other'));
});

test('other tls.connect call forms keep their options', async (t) => {
  // (installed by the tests above)
  const { dir } = t.context;
  const server = tls.createServer(
    {
      key: fs.readFileSync(path.join(dir, 'genuine.key')),
      cert: fs.readFileSync(path.join(dir, 'genuine.crt'))
    },
    (socket) => socket.end()
  );
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());
  const servername = await new Promise((resolve, reject) => {
    const socket = tls.connect(
      server.address().port,
      '127.0.0.1',
      { servername: HOST, rejectUnauthorized: false },
      () => {
        resolve(socket.servername);
        socket.end();
      }
    );
    socket.on('error', reject);
  });
  t.is(servername, HOST);
});
