/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { execSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const tls = require('node:tls');
const util = require('node:util');

const Redis = require('ioredis-mock');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('mx-connect');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');

const utils = require('../utils');
const MX = require('../../mx-server');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const client = new Redis();
client.setMaxListeners(0);

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

//
// DANE/TLSA Tests for MX Server
//
// These tests verify that the mx-connect v1.6.0 DANE/TLSA integration
// works correctly with the Forward Email MX server, including:
// - DANE option passthrough to mx-connect
// - Custom TLSA resolver using tangerine
// - DANE-EE (usage=3) verification flow
// - DANE logging
// - Edge cases (no records, lookup failures, disabled DANE)
//

test('mx-connect returns daneEnabled and tlsaRecords when DANE is enabled with MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  //
  // Spoof TLSA records in tangerine's cache for the test target
  //
  const certHash = crypto.randomBytes(32);
  const tlsaName = `_${smtp.server.address().port}._tcp.${IP_ADDRESS}`;
  const packet = {
    id: 0,
    type: 'response',
    flags: 384,
    flag_qr: true,
    opcode: 'QUERY',
    flag_aa: false,
    flag_tc: false,
    flag_rd: true,
    flag_ra: true,
    flag_z: false,
    flag_ad: false,
    flag_cd: false,
    rcode: 'NOERROR',
    questions: [{ name: tlsaName, type: 'TLSA', class: 'IN' }],
    answers: [
      {
        name: tlsaName,
        type: 'TLSA',
        ttl: 3600,
        class: 'IN',
        flush: false,
        data: {
          usage: 3,
          selector: 1,
          matchingType: 1,
          certificate: certHash.toString('hex')
        }
      }
    ],
    authorities: [],
    additionals: [],
    ttl: 3600,
    expires: Date.now() + 3600000
  };

  await resolver.options.cache.set(`tlsa:${tlsaName}`, packet, 'PX', 3600000);

  const daneLog = [];
  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      enabled: true,
      async resolveTlsa(name) {
        return resolver.resolve(name, 'TLSA');
      },
      logger(results) {
        daneLog.push(results);
      },
      verify: false
    }
  });

  t.truthy(mx, 'mx-connect should return a connection');
  t.truthy(mx.socket, 'Connection should have a socket');

  // Verify DANE properties are set on the connection
  t.true(mx.daneEnabled === true, 'Connection should have daneEnabled=true');
  t.truthy(mx.tlsaRecords, 'Connection should have tlsaRecords');
  t.is(mx.tlsaRecords.length, 1, 'Should have 1 TLSA record');
  t.is(mx.tlsaRecords[0].usage, 3, 'TLSA record usage should be 3 (DANE-EE)');
  t.is(
    mx.tlsaRecords[0].selector,
    1,
    'TLSA record selector should be 1 (SPKI)'
  );
  t.is(
    mx.tlsaRecords[0].mtype ?? mx.tlsaRecords[0].matchingType,
    1,
    'TLSA record matching type should be 1 (SHA-256)'
  );
  t.is(
    typeof mx.daneVerifier,
    'function',
    'Connection should have daneVerifier function'
  );
  t.true(mx.requireTls === true, 'DANE should require TLS');

  // Verify DANE logging
  const tlsaFoundLog = daneLog.find((l) => l.msg === 'TLSA records found');
  t.truthy(tlsaFoundLog, 'Should log TLSA records found');
  t.is(tlsaFoundLog.recordCount, 1, 'Log should show 1 TLSA record');

  const daneEnabledLog = daneLog.find(
    (l) => l.msg === 'DANE enabled for connection'
  );
  t.truthy(daneEnabledLog, 'Should log DANE enabled for connection');

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect with DANE disabled does not set daneEnabled on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      enabled: false
    }
  });

  t.truthy(mx, 'mx-connect should return a connection');
  t.truthy(mx.socket, 'Connection should have a socket');
  t.falsy(
    mx.daneEnabled,
    'daneEnabled should not be set when DANE is disabled'
  );
  t.falsy(
    mx.daneVerifier,
    'daneVerifier should not be set when DANE is disabled'
  );

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect with DANE enabled but no TLSA records on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      enabled: true,
      async resolveTlsa() {
        return [];
      },
      logger() {},
      verify: false
    }
  });

  t.truthy(mx, 'mx-connect should return a connection');
  t.truthy(mx.socket, 'Connection should have a socket');
  t.falsy(
    mx.daneEnabled,
    'daneEnabled should not be set when no TLSA records exist'
  );

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect with DANE handles ENODATA gracefully on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const daneLog = [];
  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      enabled: true,
      async resolveTlsa() {
        const err = new Error('queryTlsa ENODATA');
        err.code = 'ENODATA';
        throw err;
      },
      logger(results) {
        daneLog.push(results);
      },
      verify: false
    }
  });

  t.truthy(
    mx,
    'Connection should succeed even when TLSA lookup returns ENODATA'
  );
  t.truthy(mx.socket, 'Connection should have a socket');
  t.falsy(mx.daneEnabled, 'daneEnabled should not be set for ENODATA');

  // ENODATA is silently treated as "no records" by callTlsaResolver,
  // so no "TLSA lookup failed" log should be emitted
  const failLog = daneLog.find((l) => l.msg === 'TLSA lookup failed');
  t.falsy(
    failLog,
    'Should not log TLSA lookup failure for ENODATA (treated as no records)'
  );

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect with DANE verify=true rejects on SERVFAIL on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const err = await t.throwsAsync(
    asyncMxConnect({
      target: IP_ADDRESS,
      port: smtp.server.address().port,
      dnsOptions: {
        resolve: util.callbackify(resolver.resolve.bind(resolver))
      },
      dane: {
        enabled: true,
        async resolveTlsa() {
          const err = new Error('queryTlsa SERVFAIL');
          err.code = 'ESERVFAIL';
          throw err;
        },
        logger() {},
        verify: true
      }
    })
  );

  t.truthy(err, 'Should reject connection on SERVFAIL with verify=true');
  t.true(
    err.message.includes('DANE') || err.category === 'dane',
    'Error should be DANE-related'
  );

  await smtp.close();
});

test('mx-connect with DANE verify=false allows connection on SERVFAIL on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      enabled: true,
      async resolveTlsa() {
        const err = new Error('queryTlsa SERVFAIL');
        err.code = 'ESERVFAIL';
        throw err;
      },
      logger() {},
      verify: false
    }
  });

  t.truthy(mx, 'Connection should succeed with verify=false even on SERVFAIL');
  t.truthy(mx.socket, 'Connection should have a socket');

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect DANE with multiple TLSA records on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const certHash1 = crypto.randomBytes(32);
  const certHash2 = crypto.randomBytes(64);
  const tlsaName = `_${smtp.server.address().port}._tcp.${IP_ADDRESS}`;

  const packet = {
    id: 0,
    type: 'response',
    flags: 384,
    flag_qr: true,
    opcode: 'QUERY',
    flag_aa: false,
    flag_tc: false,
    flag_rd: true,
    flag_ra: true,
    flag_z: false,
    flag_ad: false,
    flag_cd: false,
    rcode: 'NOERROR',
    questions: [{ name: tlsaName, type: 'TLSA', class: 'IN' }],
    answers: [
      {
        name: tlsaName,
        type: 'TLSA',
        ttl: 3600,
        class: 'IN',
        flush: false,
        data: {
          usage: 3,
          selector: 1,
          matchingType: 1,
          certificate: certHash1.toString('hex')
        }
      },
      {
        name: tlsaName,
        type: 'TLSA',
        ttl: 3600,
        class: 'IN',
        flush: false,
        data: {
          usage: 3,
          selector: 0,
          matchingType: 2,
          certificate: certHash2.toString('hex')
        }
      }
    ],
    authorities: [],
    additionals: [],
    ttl: 3600,
    expires: Date.now() + 3600000
  };

  await resolver.options.cache.set(`tlsa:${tlsaName}`, packet, 'PX', 3600000);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      enabled: true,
      async resolveTlsa(name) {
        return resolver.resolve(name, 'TLSA');
      },
      logger() {},
      verify: false
    }
  });

  t.truthy(mx, 'mx-connect should return a connection');
  t.true(mx.daneEnabled === true, 'Connection should have daneEnabled=true');
  t.is(mx.tlsaRecords.length, 2, 'Should have 2 TLSA records');
  t.is(mx.tlsaRecords[0].usage, 3, 'First record usage should be 3');
  t.is(mx.tlsaRecords[0].selector, 1, 'First record selector should be 1');
  t.is(mx.tlsaRecords[1].usage, 3, 'Second record usage should be 3');
  t.is(mx.tlsaRecords[1].selector, 0, 'Second record selector should be 0');

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect DANE with pre-resolved MX entries and tlsaRecords on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const certHash = crypto.randomBytes(32);
  const mockTlsaRecords = [
    {
      usage: 3,
      selector: 1,
      mtype: 1,
      cert: certHash,
      ttl: 3600
    }
  ];

  const mx = await asyncMxConnect({
    target: 'test.example.com',
    port: smtp.server.address().port,
    mx: [
      {
        exchange: IP_ADDRESS,
        priority: 10,
        A: [IP_ADDRESS],
        AAAA: [],
        tlsaRecords: mockTlsaRecords
      }
    ],
    dane: {
      enabled: true,
      verify: false,
      logger() {}
    }
  });

  t.truthy(mx, 'mx-connect should return a connection');
  t.truthy(mx.socket, 'Connection should have a socket');
  t.true(mx.daneEnabled === true, 'Connection should have daneEnabled=true');
  t.truthy(mx.tlsaRecords, 'Connection should have tlsaRecords');
  t.is(
    mx.tlsaRecords.length,
    1,
    'Should have 1 TLSA record from pre-resolved MX'
  );

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect DANE with ENOTFOUND is treated as no records on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const daneLog = [];
  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      enabled: true,
      async resolveTlsa() {
        const err = new Error('queryTlsa ENOTFOUND');
        err.code = 'ENOTFOUND';
        throw err;
      },
      logger(results) {
        daneLog.push(results);
      },
      verify: true
    }
  });

  t.truthy(mx, 'Connection should succeed when TLSA lookup returns ENOTFOUND');
  t.truthy(mx.socket, 'Connection should have a socket');
  t.falsy(mx.daneEnabled, 'daneEnabled should not be set for ENOTFOUND');

  // ENOTFOUND is silently treated as "no records" by callTlsaResolver,
  // so no "TLSA lookup failed" log should be emitted
  const failLog = daneLog.find((l) => l.msg === 'TLSA lookup failed');
  t.falsy(
    failLog,
    'Should not log TLSA lookup failure for ENOTFOUND (treated as no records)'
  );

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect DANE without explicit enabled does not resolve TLSA on MX server', async (t) => {
  const smtp = new MX({ client: t.context.client });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  let tlsaLookupCalled = false;
  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    },
    dane: {
      // enabled not set - should default to false
      async resolveTlsa() {
        tlsaLookupCalled = true;
        return [];
      },
      logger() {}
    }
  });

  t.truthy(mx, 'mx-connect should return a connection');
  t.truthy(mx.socket, 'Connection should have a socket');
  t.false(
    tlsaLookupCalled,
    'resolveTlsa should not be called when enabled is not set'
  );
  t.falsy(
    mx.daneEnabled,
    'daneEnabled should not be set when enabled is not set'
  );

  mx.socket.destroy();
  await smtp.close();
});

//
// E2E DANE/TLSA Tests for MX Server
//
// These tests verify the full DANE certificate verification chain end-to-end:
// 1. Generate a self-signed TLS certificate
// 2. Compute cert hashes (full cert SHA-256 for selector=0)
// 3. Start a plain TCP SMTP server with STARTTLS using that cert
// 4. Call asyncMxConnect with DANE enabled and matching TLSA records
// 5. Perform STARTTLS upgrade and manually call daneVerifier with peer cert
// 6. Verify DANE verification succeeds/fails as expected
//
// See test/smtp/dane.js for detailed notes on why selector=0 is used
// and why daneVerifier is called manually.
//

/**
 * Generate a self-signed TLS certificate via openssl.
 *
 * @returns {{ keyPem: string, certPem: string, spkiHash: Buffer, certHash: Buffer }}
 */
function generateSelfSignedCert() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dane-e2e-'));
  const keyPath = path.join(tmpDir, 'key.pem');
  const certPath = path.join(tmpDir, 'cert.pem');

  try {
    execSync(
      `openssl req -new -newkey rsa:2048 -days 1 -nodes -x509 ` +
        `-keyout ${keyPath} -out ${certPath} ` +
        `-subj "/CN=test.example.com" ` +
        `-addext "subjectAltName=IP:${IP_ADDRESS}" 2>/dev/null`
    );

    const keyPem = fs.readFileSync(keyPath, 'utf8');
    const certPem = fs.readFileSync(certPath, 'utf8');

    // Compute SPKI SHA-256 (DANE-EE, selector=1, mtype=1)
    const x509 = new crypto.X509Certificate(certPem);
    const spkiDer = x509.publicKey.export({ type: 'spki', format: 'der' });
    const spkiHash = crypto.createHash('sha256').update(spkiDer).digest();

    // Compute full cert DER SHA-256 (DANE-EE, selector=0, mtype=1)
    const certHash = crypto.createHash('sha256').update(x509.raw).digest();

    return { keyPem, certPem, spkiHash, certHash };
  } finally {
    try {
      fs.unlinkSync(keyPath);
    } catch {}

    try {
      fs.unlinkSync(certPath);
    } catch {}

    try {
      fs.rmdirSync(tmpDir);
    } catch {}
  }
}

/**
 * Create a plain TCP SMTP server that supports STARTTLS.
 *
 * @param {{ keyPem: string, certPem: string }} certInfo
 * @param {number} port
 * @returns {Promise<net.Server>}
 */
function createStarttlsSmtpServer(certInfo, port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      socket.write('220 test.example.com ESMTP\r\n');
      socket.on('data', (data) => {
        const line = data.toString().trim();
        if (line.startsWith('EHLO') || line.startsWith('HELO')) {
          socket.write('250-test.example.com\r\n250-STARTTLS\r\n250 OK\r\n');
        } else if (line.startsWith('STARTTLS')) {
          socket.write('220 Ready to start TLS\r\n');
          const secureContext = tls.createSecureContext({
            key: certInfo.keyPem,
            cert: certInfo.certPem
          });
          const tlsSocket = new tls.TLSSocket(socket, {
            isServer: true,
            secureContext,
            requestCert: false
          });
          tlsSocket.on('data', (d) => {
            const l = d.toString().trim();
            if (l.startsWith('EHLO') || l.startsWith('HELO')) {
              tlsSocket.write('250-test.example.com\r\n250 OK\r\n');
            } else if (l.startsWith('QUIT')) {
              tlsSocket.write('221 Bye\r\n');
              tlsSocket.end();
            } else {
              tlsSocket.write('250 OK\r\n');
            }
          });
          tlsSocket.on('error', () => {});
        } else if (line.startsWith('QUIT')) {
          socket.write('221 Bye\r\n');
          socket.end();
        } else {
          socket.write('250 OK\r\n');
        }
      });
      socket.on('error', () => {});
    });

    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
}

/**
 * Helper: read an SMTP response line from a socket.
 */
function readSmtpResponse(socket) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = (chunk) => {
      buf += chunk.toString();
      const lines = buf.split('\r\n');
      for (const line of lines) {
        if (line.length >= 4 && line[3] === ' ') {
          socket.removeListener('data', onData);
          resolve(buf.trim());
          return;
        }
      }
    };

    socket.on('data', onData);
    socket.once('error', reject);
    setTimeout(() => {
      socket.removeListener('data', onData);
      reject(new Error('Timeout reading SMTP response'));
    }, 10_000);
  });
}

/**
 * Helper: perform STARTTLS upgrade on a plain TCP socket.
 */
async function doStarttls(socket) {
  await readSmtpResponse(socket);
  socket.write('EHLO test.local\r\n');
  await readSmtpResponse(socket);
  socket.write('STARTTLS\r\n');
  await readSmtpResponse(socket);

  const tlsSocket = tls.connect({
    socket,
    rejectUnauthorized: false
  });

  await new Promise((resolve, reject) => {
    tlsSocket.once('secureConnect', resolve);
    tlsSocket.once('error', reject);
    setTimeout(() => reject(new Error('TLS handshake timeout')), 10_000);
  });

  return tlsSocket;
}

test('E2E: full DANE verification succeeds with matching full cert SHA-256 after STARTTLS on MX server', async (t) => {
  const certInfo = generateSelfSignedCert();
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();

  const server = await createStarttlsSmtpServer(certInfo, port);

  const daneLog = [];
  try {
    const mx = await asyncMxConnect({
      target: IP_ADDRESS,
      port,
      dnsOptions: {
        blockLocalAddresses: false,
        resolve(name, type, cb) {
          if (typeof type === 'function') {
            cb = type;
            type = 'A';
          }

          if (type === 'A' || !type) {
            cb(null, [IP_ADDRESS]);
          } else if (type === 'AAAA') {
            cb(null, []);
          } else if (type === 'MX') {
            cb(null, [{ exchange: IP_ADDRESS, priority: 10 }]);
          } else {
            cb(null, []);
          }
        }
      },
      dane: {
        enabled: true,
        // DANE-EE (usage=3), Full cert (selector=0), SHA-256 (mtype=1)
        async resolveTlsa() {
          return [
            {
              usage: 3,
              selector: 0,
              mtype: 1,
              cert: certInfo.certHash,
              ttl: 3600
            }
          ];
        },
        logger(results) {
          daneLog.push(results);
        },
        verify: true
      }
    });

    // Verify DANE is enabled
    t.true(mx.daneEnabled === true, 'DANE should be enabled');
    t.is(typeof mx.daneVerifier, 'function', 'Should have daneVerifier');
    t.true(mx.requireTls === true, 'DANE should require TLS');
    t.is(mx.tlsaRecords.length, 1, 'Should have 1 TLSA record');

    // Perform STARTTLS upgrade
    const tlsSocket = await doStarttls(mx.socket);
    t.true(tlsSocket.encrypted, 'Socket should be encrypted after STARTTLS');

    // Manually call daneVerifier with peer cert
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    t.is(
      verifyResult,
      undefined,
      'daneVerifier should return undefined (success)'
    );

    const successLog = daneLog.find(
      (l) => l.msg === 'DANE verification succeeded'
    );
    t.truthy(successLog, 'Should log DANE verification succeeded');
    t.true(successLog.success, 'Success log should have success=true');
    t.is(successLog.usage, 'DANE-EE', 'Matched usage should be DANE-EE');

    tlsSocket.destroy();
  } finally {
    server.close();
  }
});

test('E2E: DANE verification fails with wrong hash and verify=true after STARTTLS on MX server', async (t) => {
  const certInfo = generateSelfSignedCert();
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();

  const server = await createStarttlsSmtpServer(certInfo, port);

  const daneLog = [];
  try {
    const mx = await asyncMxConnect({
      target: IP_ADDRESS,
      port,
      dnsOptions: {
        blockLocalAddresses: false,
        resolve(name, type, cb) {
          if (typeof type === 'function') {
            cb = type;
            type = 'A';
          }

          if (type === 'A' || !type) {
            cb(null, [IP_ADDRESS]);
          } else if (type === 'AAAA') {
            cb(null, []);
          } else if (type === 'MX') {
            cb(null, [{ exchange: IP_ADDRESS, priority: 10 }]);
          } else {
            cb(null, []);
          }
        }
      },
      dane: {
        enabled: true,
        // Wrong hash (selector=0 full cert)
        async resolveTlsa() {
          return [
            {
              usage: 3,
              selector: 0,
              mtype: 1,
              cert: crypto.randomBytes(32),
              ttl: 3600
            }
          ];
        },
        logger(results) {
          daneLog.push(results);
        },
        verify: true
      }
    });

    t.true(mx.daneEnabled === true, 'DANE should be enabled');

    // Perform STARTTLS upgrade
    const tlsSocket = await doStarttls(mx.socket);

    // Manually call daneVerifier with peer cert
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    // With verify=true, should return an Error
    t.truthy(verifyResult, 'daneVerifier should return an error');
    t.true(verifyResult instanceof Error, 'Result should be an Error');
    t.is(
      verifyResult.code,
      'DANE_VERIFICATION_FAILED',
      'Error code should be DANE_VERIFICATION_FAILED'
    );
    t.is(verifyResult.category, 'dane', 'Error category should be dane');

    const failLog = daneLog.find((l) => l.msg === 'DANE verification failed');
    t.truthy(failLog, 'Should log DANE verification failed');
    t.false(failLog.success, 'Failure log should have success=false');

    tlsSocket.destroy();
  } finally {
    server.close();
  }
});

test('E2E: DANE verification with wrong hash and verify=false logs failure but allows connection on MX server', async (t) => {
  const certInfo = generateSelfSignedCert();
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();

  const server = await createStarttlsSmtpServer(certInfo, port);

  const daneLog = [];
  try {
    const mx = await asyncMxConnect({
      target: IP_ADDRESS,
      port,
      dnsOptions: {
        blockLocalAddresses: false,
        resolve(name, type, cb) {
          if (typeof type === 'function') {
            cb = type;
            type = 'A';
          }

          if (type === 'A' || !type) {
            cb(null, [IP_ADDRESS]);
          } else if (type === 'AAAA') {
            cb(null, []);
          } else if (type === 'MX') {
            cb(null, [{ exchange: IP_ADDRESS, priority: 10 }]);
          } else {
            cb(null, []);
          }
        }
      },
      dane: {
        enabled: true,
        // Wrong hash (selector=0 full cert)
        async resolveTlsa() {
          return [
            {
              usage: 3,
              selector: 0,
              mtype: 1,
              cert: crypto.randomBytes(32),
              ttl: 3600
            }
          ];
        },
        logger(results) {
          daneLog.push(results);
        },
        verify: false
      }
    });

    t.true(mx.daneEnabled === true, 'DANE should be enabled');

    // Perform STARTTLS upgrade
    const tlsSocket = await doStarttls(mx.socket);

    // Manually call daneVerifier with peer cert
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    // With verify=false, should return undefined (no rejection)
    t.is(
      verifyResult,
      undefined,
      'daneVerifier should return undefined (no rejection)'
    );

    // But failure should still be logged
    const failLog = daneLog.find((l) => l.msg === 'DANE verification failed');
    t.truthy(failLog, 'Should log DANE verification failed');
    t.false(failLog.success, 'Failure log should have success=false');

    tlsSocket.destroy();
  } finally {
    server.close();
  }
});
