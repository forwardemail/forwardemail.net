/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
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
const SMTP = require('../../smtp-server');

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
// DANE/TLSA Tests for SMTP Server
//
// These tests verify that the mx-connect v1.6.0 DANE/TLSA integration
// works correctly with the Forward Email SMTP server, including:
// - DANE option passthrough to mx-connect
// - Custom TLSA resolver using tangerine
// - DANE-EE (usage=3) verification flow
// - DANE logging
// - Edge cases (no records, lookup failures, disabled DANE)
//

test('mx-connect returns daneEnabled and tlsaRecords when DANE is enabled with TLSA records', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  //
  // Spoof TLSA records in tangerine's cache for the test target
  // The TLSA record format follows RFC 6698:
  //   usage=3 (DANE-EE), selector=1 (SPKI), mtype=1 (SHA-256)
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
      // Don't enforce verification since the cert hash won't match the test server
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

  // Verify DANE logging occurred
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

test('mx-connect with DANE disabled does not set daneEnabled', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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

test('mx-connect with DANE enabled but no TLSA records does not set daneEnabled', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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
      // Return empty array (no TLSA records published)
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

test('mx-connect with DANE enabled handles TLSA lookup ENODATA gracefully', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  //
  // ENODATA is a "no records" error per RFC 6698 Section 4.2.
  // The mx-connect callTlsaResolver catches ENODATA and returns []
  // (empty array), so the resolveDaneTlsa catch block is never reached
  // and no "TLSA lookup failed" log is emitted. This is correct behavior:
  // ENODATA means the domain has no DANE records, not a DNS failure.
  //
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

  // No DANE-related logs should be present since no records were found
  const daneEnabledLog = daneLog.find(
    (l) => l.msg === 'DANE enabled for connection'
  );
  t.falsy(daneEnabledLog, 'Should not log DANE enabled when no records exist');

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect with DANE verify=true rejects on TLSA lookup SERVFAIL', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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

test('mx-connect with DANE verify=false allows connection on TLSA lookup SERVFAIL', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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

test('mx-connect DANE with multiple TLSA records returns all records', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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

  // Verify first record (DANE-EE, SPKI, SHA-256)
  t.is(mx.tlsaRecords[0].usage, 3, 'First record usage should be 3');
  t.is(mx.tlsaRecords[0].selector, 1, 'First record selector should be 1');
  t.is(
    mx.tlsaRecords[0].mtype ?? mx.tlsaRecords[0].matchingType,
    1,
    'First record matching type should be 1'
  );

  // Verify second record (DANE-EE, Full cert, SHA-512)
  t.is(mx.tlsaRecords[1].usage, 3, 'Second record usage should be 3');
  t.is(mx.tlsaRecords[1].selector, 0, 'Second record selector should be 0');
  t.is(
    mx.tlsaRecords[1].mtype ?? mx.tlsaRecords[1].matchingType,
    2,
    'Second record matching type should be 2'
  );

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect DANE with pre-resolved MX entries and tlsaRecords', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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
  t.is(
    mx.tlsaRecords[0].usage,
    3,
    'Pre-resolved TLSA record usage should be 3'
  );

  mx.socket.destroy();
  await smtp.close();
});

test('mx-connect exports dane module with expected API', (t) => {
  t.truthy(mxConnect.dane, 'mx-connect should export dane module');
  t.is(
    typeof mxConnect.dane.resolveTlsaRecords,
    'function',
    'Should export resolveTlsaRecords'
  );
  t.is(
    typeof mxConnect.dane.verifyCertAgainstTlsa,
    'function',
    'Should export verifyCertAgainstTlsa'
  );
  t.is(
    typeof mxConnect.dane.createDaneVerifier,
    'function',
    'Should export createDaneVerifier'
  );
  t.is(
    typeof mxConnect.dane.extractSPKI,
    'function',
    'Should export extractSPKI'
  );
  t.is(
    typeof mxConnect.dane.getCertData,
    'function',
    'Should export getCertData'
  );
  t.is(
    typeof mxConnect.dane.hashCertData,
    'function',
    'Should export hashCertData'
  );
  t.is(
    typeof mxConnect.dane.isNoRecordsError,
    'function',
    'Should export isNoRecordsError'
  );
  t.truthy(mxConnect.dane.DANE_USAGE, 'Should export DANE_USAGE constants');
  t.truthy(
    mxConnect.dane.DANE_SELECTOR,
    'Should export DANE_SELECTOR constants'
  );
  t.truthy(
    mxConnect.dane.DANE_MATCHING_TYPE,
    'Should export DANE_MATCHING_TYPE constants'
  );
});

test('dane module DANE_USAGE constants are correct per RFC 6698', (t) => {
  const { DANE_USAGE } = mxConnect.dane;
  t.is(DANE_USAGE.PKIX_TA, 0, 'PKIX-TA should be 0');
  t.is(DANE_USAGE.PKIX_EE, 1, 'PKIX-EE should be 1');
  t.is(DANE_USAGE.DANE_TA, 2, 'DANE-TA should be 2');
  t.is(DANE_USAGE.DANE_EE, 3, 'DANE-EE should be 3');
});

test('dane module DANE_SELECTOR constants are correct per RFC 6698', (t) => {
  const { DANE_SELECTOR } = mxConnect.dane;
  t.is(DANE_SELECTOR.FULL_CERT, 0, 'FULL_CERT should be 0');
  t.is(DANE_SELECTOR.SPKI, 1, 'SPKI should be 1');
});

test('dane module DANE_MATCHING_TYPE constants are correct per RFC 6698', (t) => {
  const { DANE_MATCHING_TYPE } = mxConnect.dane;
  t.is(DANE_MATCHING_TYPE.FULL, 0, 'FULL should be 0');
  t.is(DANE_MATCHING_TYPE.SHA256, 1, 'SHA256 should be 1');
  t.is(DANE_MATCHING_TYPE.SHA512, 2, 'SHA512 should be 2');
});

test('dane module isNoRecordsError correctly classifies error codes', (t) => {
  const { isNoRecordsError } = mxConnect.dane;
  t.true(isNoRecordsError('ENODATA'), 'ENODATA should be a no-records error');
  t.true(
    isNoRecordsError('ENOTFOUND'),
    'ENOTFOUND should be a no-records error'
  );
  t.true(isNoRecordsError('ENOENT'), 'ENOENT should be a no-records error');
  t.false(
    isNoRecordsError('ESERVFAIL'),
    'ESERVFAIL should not be a no-records error'
  );
  t.false(
    isNoRecordsError('ETIMEDOUT'),
    'ETIMEDOUT should not be a no-records error'
  );
  t.false(
    isNoRecordsError('ECONNREFUSED'),
    'ECONNREFUSED should not be a no-records error'
  );
  t.false(
    isNoRecordsError(undefined),
    'undefined should not be a no-records error'
  );
  t.false(isNoRecordsError(null), 'null should not be a no-records error');
});

test('dane module verifyCertAgainstTlsa with no records returns valid', (t) => {
  const { verifyCertAgainstTlsa } = mxConnect.dane;
  const result = verifyCertAgainstTlsa({}, []);
  t.true(result.valid, 'Should be valid when no TLSA records exist');
  t.true(result.noRecords === true, 'Should indicate no records');
  t.is(result.matchedRecord, null, 'Should have no matched record');
});

test('dane module verifyCertAgainstTlsa with no certificate returns invalid', (t) => {
  const { verifyCertAgainstTlsa } = mxConnect.dane;
  const tlsaRecords = [
    { usage: 3, selector: 1, mtype: 1, cert: Buffer.alloc(32) }
  ];
  const result = verifyCertAgainstTlsa(null, tlsaRecords);
  t.false(result.valid, 'Should be invalid when no certificate is provided');
  t.truthy(result.error, 'Should have an error message');
});

test('dane module verifyCertAgainstTlsa with DANE-EE matching cert', (t) => {
  const {
    verifyCertAgainstTlsa,
    DANE_USAGE,
    DANE_SELECTOR,
    DANE_MATCHING_TYPE
  } = mxConnect.dane;

  // Create a mock certificate with raw DER data
  const certData = Buffer.from('test-certificate-data');
  const certHash = crypto.createHash('sha256').update(certData).digest();

  const mockCert = { raw: certData };
  const tlsaRecords = [
    {
      usage: DANE_USAGE.DANE_EE,
      selector: DANE_SELECTOR.FULL_CERT,
      mtype: DANE_MATCHING_TYPE.SHA256,
      cert: certHash
    }
  ];

  const result = verifyCertAgainstTlsa(mockCert, tlsaRecords);
  t.true(result.valid, 'Should be valid when DANE-EE cert matches');
  t.truthy(result.matchedRecord, 'Should have a matched record');
  t.is(result.usage, 'DANE-EE', 'Usage should be DANE-EE');
});

test('dane module verifyCertAgainstTlsa with hex string cert data', (t) => {
  const { verifyCertAgainstTlsa } = mxConnect.dane;

  const certData = Buffer.from('test-certificate-data');
  const certHash = crypto.createHash('sha256').update(certData).digest();

  const mockCert = { raw: certData };
  const tlsaRecords = [
    {
      usage: 3,
      selector: 0,
      mtype: 1,
      cert: certHash.toString('hex') // hex string instead of Buffer
    }
  ];

  const result = verifyCertAgainstTlsa(mockCert, tlsaRecords);
  t.true(result.valid, 'Should handle hex-encoded cert data');
});

test('dane module verifyCertAgainstTlsa with non-matching cert', (t) => {
  const { verifyCertAgainstTlsa } = mxConnect.dane;

  const certData = Buffer.from('test-certificate-data');
  const wrongHash = crypto.randomBytes(32);

  const mockCert = { raw: certData };
  const tlsaRecords = [
    {
      usage: 3,
      selector: 0,
      mtype: 1,
      cert: wrongHash
    }
  ];

  const result = verifyCertAgainstTlsa(mockCert, tlsaRecords);
  t.false(result.valid, 'Should be invalid when cert does not match');
});

test('dane module createDaneVerifier returns a function', (t) => {
  const { createDaneVerifier } = mxConnect.dane;
  const verifier = createDaneVerifier([], {});
  t.is(typeof verifier, 'function', 'Should return a function');
});

test('dane module createDaneVerifier with no records returns undefined (success)', (t) => {
  const { createDaneVerifier } = mxConnect.dane;
  const verifier = createDaneVerifier([], {});
  const result = verifier('example.com', {});
  t.is(result, undefined, 'Should return undefined (success) when no records');
});

test('dane module hashCertData with SHA-256', (t) => {
  const { hashCertData, DANE_MATCHING_TYPE } = mxConnect.dane;
  const testData = Buffer.from('test certificate data');
  const expected = crypto.createHash('sha256').update(testData).digest();
  const result = hashCertData(testData, DANE_MATCHING_TYPE.SHA256);
  t.true(Buffer.isBuffer(result), 'Result should be a Buffer');
  t.true(expected.equals(result), 'SHA-256 hash should match');
});

test('dane module hashCertData with SHA-512', (t) => {
  const { hashCertData, DANE_MATCHING_TYPE } = mxConnect.dane;
  const testData = Buffer.from('test certificate data');
  const expected = crypto.createHash('sha512').update(testData).digest();
  const result = hashCertData(testData, DANE_MATCHING_TYPE.SHA512);
  t.true(Buffer.isBuffer(result), 'Result should be a Buffer');
  t.true(expected.equals(result), 'SHA-512 hash should match');
});

test('dane module hashCertData with full data (no hash)', (t) => {
  const { hashCertData, DANE_MATCHING_TYPE } = mxConnect.dane;
  const testData = Buffer.from('test certificate data');
  const result = hashCertData(testData, DANE_MATCHING_TYPE.FULL);
  t.true(Buffer.isBuffer(result), 'Result should be a Buffer');
  t.true(testData.equals(result), 'Full data should be returned unchanged');
});

test('dane module hashCertData with null input', (t) => {
  const { hashCertData, DANE_MATCHING_TYPE } = mxConnect.dane;
  const result = hashCertData(null, DANE_MATCHING_TYPE.SHA256);
  t.is(result, null, 'Should return null for null input');
});

test('dane module EMPTY_DANE_HANDLER is disabled by default', async (t) => {
  const { EMPTY_DANE_HANDLER } = mxConnect.dane;
  t.false(EMPTY_DANE_HANDLER.enabled, 'Should be disabled by default');
  const records = await EMPTY_DANE_HANDLER.resolveTlsa('test.example.com');
  t.deepEqual(records, [], 'Should return empty array');
});

test('dane module verifyCertAgainstTlsa with DANE-TA without chain fails', (t) => {
  const { verifyCertAgainstTlsa, DANE_USAGE } = mxConnect.dane;

  const mockCert = { raw: Buffer.from('test-cert-data') };
  const tlsaRecords = [
    {
      usage: DANE_USAGE.DANE_TA,
      selector: 0,
      mtype: 1,
      cert: Buffer.alloc(32, 0xaa)
    }
  ];

  const result = verifyCertAgainstTlsa(mockCert, tlsaRecords);
  t.false(result.valid, 'Should be invalid when DANE-TA has no chain');
  t.truthy(result.error, 'Should have error message');
  t.true(
    result.error.includes('chain'),
    'Error should mention chain requirement'
  );
});

test('dane module verifyCertAgainstTlsa with malformed TLSA records', (t) => {
  const { verifyCertAgainstTlsa } = mxConnect.dane;

  const mockCert = { raw: Buffer.from('test-cert-data') };

  // Record missing cert field
  const recordsNoCert = [{ usage: 3, selector: 0, mtype: 1 }];
  let result = verifyCertAgainstTlsa(mockCert, recordsNoCert);
  t.false(result.valid, 'Should be invalid when record has no cert field');

  // Record with invalid usage (should not crash)
  const recordsInvalidUsage = [
    { usage: 99, selector: 0, mtype: 1, cert: Buffer.alloc(32) }
  ];
  result = verifyCertAgainstTlsa(mockCert, recordsInvalidUsage);
  t.false(result.valid, 'Should be invalid for unknown usage type');

  // Record with invalid selector (should not crash)
  const recordsInvalidSelector = [
    { usage: 3, selector: 99, mtype: 1, cert: Buffer.alloc(32) }
  ];
  result = verifyCertAgainstTlsa(mockCert, recordsInvalidSelector);
  t.false(result.valid, 'Should be invalid for unknown selector');
});

//
// E2E DANE/TLSA Tests
//
// These tests verify the full DANE certificate verification chain end-to-end:
// 1. Generate a self-signed TLS certificate
// 2. Compute cert hashes (full cert SHA-256 for selector=0)
// 3. Start a plain TCP SMTP server with STARTTLS using that cert
// 4. Call asyncMxConnect with DANE enabled and matching TLSA records
// 5. Perform STARTTLS upgrade and manually call daneVerifier with peer cert
// 6. Verify DANE verification succeeds/fails as expected
//
// Note: checkServerIdentity is not called by Node.js TLS when servername is
// an IP address (RFC 6066), so we manually invoke daneVerifier after TLS
// handshake to verify the full DANE chain. In production, nodemailer handles
// the STARTTLS upgrade and passes daneVerifier as checkServerIdentity.
//
// Note: selector=0 (full cert) is used for E2E tests because the peer cert
// from getPeerCertificate() has `raw` (DER Buffer) but not `publicKey`
// (KeyObject), so selector=1 (SPKI) extraction fails in the current
// mx-connect dane.js implementation. selector=0 works correctly.
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
 * Waits for a complete SMTP response (final line has space after 3-digit code).
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
 * Returns the TLS socket after upgrade.
 */
async function doStarttls(socket) {
  // Read greeting
  await readSmtpResponse(socket);
  // Send EHLO
  socket.write('EHLO test.local\r\n');
  await readSmtpResponse(socket);
  // Send STARTTLS
  socket.write('STARTTLS\r\n');
  await readSmtpResponse(socket);

  // Upgrade to TLS (rejectUnauthorized=false since self-signed)
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

test('E2E: full DANE verification succeeds with matching full cert SHA-256 after STARTTLS', async (t) => {
  const certInfo = generateSelfSignedCert();
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();

  const server = await createStarttlsSmtpServer(certInfo, port);

  const daneLog = [];
  try {
    // Step 1: asyncMxConnect to get TCP socket + daneVerifier
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

    // Step 2: Verify DANE is enabled on the connection
    t.true(mx.daneEnabled === true, 'DANE should be enabled');
    t.is(typeof mx.daneVerifier, 'function', 'Should have daneVerifier');
    t.true(mx.requireTls === true, 'DANE should require TLS');
    t.is(mx.tlsaRecords.length, 1, 'Should have 1 TLSA record');
    t.is(mx.tlsaRecords[0].usage, 3, 'TLSA record usage should be DANE-EE');

    // Step 3: Perform STARTTLS upgrade
    const tlsSocket = await doStarttls(mx.socket);
    t.true(tlsSocket.encrypted, 'Socket should be encrypted after STARTTLS');

    // Step 4: Get peer cert and manually call daneVerifier
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    // undefined means success (no error returned)
    t.is(
      verifyResult,
      undefined,
      'daneVerifier should return undefined (success)'
    );

    // Step 5: Verify DANE logs
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

test('E2E: DANE verification fails with wrong cert hash and verify=true after STARTTLS', async (t) => {
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
              cert: crypto.randomBytes(32), // Wrong
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

    // Get peer cert and manually call daneVerifier
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    // With verify=true, daneVerifier returns an Error on mismatch
    t.truthy(verifyResult, 'daneVerifier should return an error');
    t.true(verifyResult instanceof Error, 'Result should be an Error');
    t.is(
      verifyResult.code,
      'DANE_VERIFICATION_FAILED',
      'Error code should be DANE_VERIFICATION_FAILED'
    );
    t.is(verifyResult.category, 'dane', 'Error category should be dane');

    // Verify failure was logged
    const failLog = daneLog.find((l) => l.msg === 'DANE verification failed');
    t.truthy(failLog, 'Should log DANE verification failed');
    t.false(failLog.success, 'Failure log should have success=false');

    tlsSocket.destroy();
  } finally {
    server.close();
  }
});

test('E2E: DANE verification with wrong hash and verify=false logs failure but allows connection', async (t) => {
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
              cert: crypto.randomBytes(32), // Wrong
              ttl: 3600
            }
          ];
        },
        logger(results) {
          daneLog.push(results);
        },
        // verify=false: log failure but don't reject
        verify: false
      }
    });

    t.true(mx.daneEnabled === true, 'DANE should be enabled');

    // Perform STARTTLS upgrade
    const tlsSocket = await doStarttls(mx.socket);

    // Get peer cert and manually call daneVerifier
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    // With verify=false, daneVerifier returns undefined even on mismatch
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

test('E2E: DANE verification with multiple records where second matches after STARTTLS', async (t) => {
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
        // First record wrong, second correct (both selector=0 full cert)
        async resolveTlsa() {
          return [
            {
              usage: 3,
              selector: 0,
              mtype: 1,
              cert: crypto.randomBytes(32), // Wrong
              ttl: 3600
            },
            {
              usage: 3,
              selector: 0,
              mtype: 1,
              cert: certInfo.certHash, // Correct
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
    t.is(mx.tlsaRecords.length, 2, 'Should have 2 TLSA records');

    // Perform STARTTLS upgrade
    const tlsSocket = await doStarttls(mx.socket);

    // Get peer cert and manually call daneVerifier
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    // Should succeed (second record matches)
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

test('E2E: DANE verification with hex string cert data after STARTTLS', async (t) => {
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
        // Hex string (as tangerine returns after JSON round-trip)
        async resolveTlsa() {
          return [
            {
              usage: 3,
              selector: 0,
              mtype: 1,
              cert: certInfo.certHash.toString('hex'),
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

    // Get peer cert and manually call daneVerifier
    const peerCert = tlsSocket.getPeerCertificate(true);
    const verifyResult = mx.daneVerifier(IP_ADDRESS, peerCert);

    // Hex string should be converted to Buffer and match
    t.is(
      verifyResult,
      undefined,
      'daneVerifier should return undefined (success)'
    );

    const successLog = daneLog.find(
      (l) => l.msg === 'DANE verification succeeded'
    );
    t.truthy(successLog, 'Should log DANE verification succeeded');

    tlsSocket.destroy();
  } finally {
    server.close();
  }
});
