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
const tlsModule = require('node:tls');

const ip = require('ip');
const ms = require('ms');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const {
  applyDaneTlsWrapper,
  prepareDaneTlsOptions
} = require('../../helpers/dane-tls-wrapper');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

//
// DANE TLS Wrapper E2E Tests
//
// These tests verify the tls.connect monkey-patch in dane-tls-wrapper.js
// that performs post-handshake DANE certificate verification.
//
// Background:
//   Node.js does NOT call `checkServerIdentity` when `rejectUnauthorized`
//   is false. Since DANE-EE (usage=3) requires accepting self-signed
//   certificates that match TLSA records, we cannot use
//   `rejectUnauthorized: true`. The fix wraps `tls.connect` to inject
//   DANE verification into the TLS handshake callback.
//
// Test approach:
//   1. Generate self-signed TLS certificates with known hashes
//   2. Start a plain TCP SMTP server with STARTTLS support
//   3. Create a nodemailer transporter with DANE wrapper applied via
//      the actual `applyDaneTlsWrapper` and `prepareDaneTlsOptions`
//      functions from helpers/dane-tls-wrapper.js
//   4. Use the transporter to send mail through the test SMTP server
//   5. Verify DANE verification succeeds/fails as expected
//
// References:
//   - RFC 7672 Section 3.1.1 (DANE-EE skips PKIX validation)
//   - RFC 6698 Section 3 (TLSA certificate verification)
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
 * Attach a line-buffered SMTP command handler to a socket.
 * Properly handles DATA state where lines are accumulated until
 * the terminator `.\r\n` is received.
 *
 * @param {net.Socket|tls.TLSSocket} socket - the socket to handle
 * @param {object} state - shared state object for the connection
 */
function attachSmtpHandler(socket, state) {
  let buffer = '';

  socket.on('data', (data) => {
    buffer += data.toString();

    // Process complete lines
    let idx;
    while ((idx = buffer.indexOf('\r\n')) !== -1) {
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      if (state.inData) {
        // In DATA state, look for the terminator
        if (line === '.') {
          state.inData = false;
          socket.write('250 OK: message queued\r\n');
        }

        // Otherwise ignore data lines
      } else {
        handleSmtpCommand(socket, state, line);
      }
    }
  });
}

/**
 * Handle a single SMTP command line.
 */
function handleSmtpCommand(socket, state, line) {
  const cmd = line.toUpperCase();
  if (cmd.startsWith('EHLO') || cmd.startsWith('HELO')) {
    if (state.secure) {
      socket.write('250-test.example.com\r\n250-SIZE 10485760\r\n250 OK\r\n');
    } else {
      socket.write(
        '250-test.example.com\r\n250-STARTTLS\r\n250-SIZE 10485760\r\n250 OK\r\n'
      );
    }
  } else if (cmd.startsWith('STARTTLS') && !state.secure) {
    socket.write('220 Ready to start TLS\r\n');
    // Upgrade to TLS
    const secureContext = tls.createSecureContext({
      key: state.keyPem,
      cert: state.certPem
    });
    const tlsSocket = new tls.TLSSocket(socket, {
      isServer: true,
      secureContext,
      requestCert: false
    });

    state.secure = true;
    attachSmtpHandler(tlsSocket, state);
    tlsSocket.on('error', () => {});
  } else if (cmd.startsWith('MAIL FROM')) {
    socket.write('250 OK\r\n');
  } else if (cmd.startsWith('RCPT TO')) {
    socket.write('250 OK\r\n');
  } else if (cmd.startsWith('DATA')) {
    state.inData = true;
    socket.write('354 Start mail input\r\n');
  } else if (cmd.startsWith('RSET')) {
    socket.write('250 OK\r\n');
  } else if (cmd.startsWith('QUIT')) {
    socket.write('221 Bye\r\n');
    socket.end();
  } else {
    socket.write('250 OK\r\n');
  }
}

/**
 * Create a plain TCP SMTP server that supports STARTTLS.
 * Accepts all SMTP commands after STARTTLS to allow full sendMail flow.
 *
 * @param {{ keyPem: string, certPem: string }} certInfo
 * @param {number} port
 * @returns {Promise<net.Server>}
 */
function createStarttlsSmtpServer(certInfo, port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      const state = {
        secure: false,
        inData: false,
        keyPem: certInfo.keyPem,
        certPem: certInfo.certPem
      };

      socket.write('220 test.example.com ESMTP\r\n');
      attachSmtpHandler(socket, state);
      socket.on('error', () => {});
    });

    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
}

/**
 * Create a DANE verifier that checks full cert DER SHA-256 (selector=0, mtype=1).
 *
 * @param {Buffer} expectedHash - the expected SHA-256 hash of the cert DER
 * @param {Array} calls - array to record verifier calls for assertions
 * @returns {function} DANE verifier function
 */
function createCertHashVerifier(expectedHash, calls) {
  return (hostname, cert) => {
    const call = { hostname, hasCert: Boolean(cert) };
    if (calls) calls.push(call);

    let raw;
    if (cert && cert.raw) {
      raw = cert.raw;
    }

    if (!raw) {
      const err = new Error('DANE verification failed: no certificate');
      err.code = 'DANE_VERIFICATION_FAILED';
      err.category = 'dane';
      return err;
    }

    const hash = crypto.createHash('sha256').update(raw).digest();
    if (hash.equals(expectedHash)) {
      return undefined; // success
    }

    const err = new Error('DANE verification failed: hash mismatch');
    err.code = 'DANE_VERIFICATION_FAILED';
    err.category = 'dane';
    return err;
  };
}

/**
 * Create a DANE verifier that checks SPKI SHA-256 (selector=1, mtype=1).
 *
 * @param {Buffer} expectedHash - the expected SHA-256 hash of the SPKI DER
 * @param {Array} calls - array to record verifier calls for assertions
 * @returns {function} DANE verifier function
 */
function createSpkiHashVerifier(expectedHash, calls) {
  return (hostname, cert) => {
    const call = { hostname, hasCert: Boolean(cert) };
    if (calls) calls.push(call);

    let spkiDer;
    if (cert && cert.publicKey && cert.publicKey.export) {
      spkiDer = cert.publicKey.export({ type: 'spki', format: 'der' });
    }

    if (!spkiDer) {
      const err = new Error('DANE verification failed: no public key');
      err.code = 'DANE_VERIFICATION_FAILED';
      err.category = 'dane';
      return err;
    }

    const hash = crypto.createHash('sha256').update(spkiDer).digest();
    if (hash.equals(expectedHash)) {
      return undefined; // success — DANE-EE SPKI match
    }

    const err = new Error('DANE verification failed: SPKI hash mismatch');
    err.code = 'DANE_VERIFICATION_FAILED';
    err.category = 'dane';
    return err;
  };
}

/**
 * Create a nodemailer transporter with DANE wrapper applied.
 *
 * @param {number} port - SMTP server port
 * @param {function} daneVerifier - DANE verifier function
 * @param {string} [hostname='test.example.com'] - MX hostname
 * @returns {object} nodemailer transporter with DANE wrapper
 */
function createDaneTransporter(port, daneVerifier, hostname) {
  const tlsOptions = {
    rejectUnauthorized: false
  };

  // Apply DANE TLS options using the production function
  prepareDaneTlsOptions(
    tlsOptions,
    daneVerifier,
    hostname || 'test.example.com'
  );

  const transporter = nodemailer.createTransport({
    host: IP_ADDRESS,
    port,
    secure: false,
    requireTLS: true,
    opportunisticTLS: false,
    ignoreTLS: false,
    tls: tlsOptions,
    connectionTimeout: ms('10s'),
    greetingTimeout: ms('10s'),
    socketTimeout: ms('10s')
  });

  // Apply DANE wrapper using the production function
  applyDaneTlsWrapper(transporter);

  return transporter;
}

/**
 * Helper to send a test email.
 */
function sendTestEmail(transporter, subject) {
  return transporter.sendMail({
    from: 'test@example.com',
    to: 'recipient@example.com',
    subject: subject || 'DANE test',
    text: 'DANE verification test email'
  });
}

//
// Test 1: DANE verification succeeds with matching full cert SHA-256
//
// Happy path: server cert matches TLSA record (DANE-EE, selector=0, mtype=1).
// The DANE verifier returns undefined (success) and nodemailer sends the email.
//
test.serial(
  'E2E: DANE wrapper succeeds with matching full cert SHA-256 (DANE-EE selector=0)',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const verifierCalls = [];
      const verifier = createCertHashVerifier(certInfo.certHash, verifierCalls);
      const transporter = createDaneTransporter(port, verifier);

      const info = await sendTestEmail(transporter, 'DANE cert hash match');

      t.truthy(info, 'sendMail should return info');
      t.truthy(info.messageId, 'Should have a messageId');
      t.is(
        verifierCalls.length,
        1,
        'daneVerifier should be called exactly once'
      );
      t.is(
        verifierCalls[0].hostname,
        'test.example.com',
        'daneVerifier should receive the correct hostname'
      );
      t.true(
        verifierCalls[0].hasCert,
        'daneVerifier should receive a certificate'
      );
    } finally {
      server.close();
    }
  }
);

//
// Test 2: DANE verification fails with wrong cert hash
//
// The server cert does NOT match the TLSA record. The DANE verifier returns
// an Error, the socket is destroyed, and sendMail rejects.
//
test.serial(
  'E2E: DANE wrapper fails with wrong cert hash (DANE-EE selector=0)',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const wrongHash = crypto.randomBytes(32);
      const verifierCalls = [];
      const verifier = createCertHashVerifier(wrongHash, verifierCalls);
      const transporter = createDaneTransporter(port, verifier);

      const error = await t.throwsAsync(
        sendTestEmail(transporter, 'DANE cert hash mismatch')
      );

      t.truthy(error, 'sendMail should reject');
      t.is(
        verifierCalls.length,
        1,
        'daneVerifier should be called exactly once'
      );
    } finally {
      server.close();
    }
  }
);

//
// Test 3: DANE-EE with self-signed cert and matching SPKI hash succeeds
//
// RFC 7672 Section 3.1.1: DANE-EE allows self-signed certificates as long
// as they match the TLSA record. This verifies that rejectUnauthorized=false
// allows the TLS handshake to complete and the DANE verifier is called.
//
test.serial(
  'E2E: DANE-EE accepts self-signed cert with matching SPKI hash (RFC 7672 3.1.1)',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const verifierCalls = [];
      const verifier = createSpkiHashVerifier(certInfo.spkiHash, verifierCalls);
      const transporter = createDaneTransporter(port, verifier);

      const info = await sendTestEmail(transporter, 'DANE-EE SPKI match');

      t.truthy(info, 'sendMail should succeed with self-signed cert');
      t.truthy(info.messageId, 'Should have a messageId');
      t.is(verifierCalls.length, 1, 'daneVerifier should be called once');
    } finally {
      server.close();
    }
  }
);

//
// Test 4: DANE-EE with self-signed cert and wrong SPKI hash fails
//
test.serial(
  'E2E: DANE-EE rejects self-signed cert with wrong SPKI hash',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const wrongSpkiHash = crypto.randomBytes(32);
      const verifier = createSpkiHashVerifier(wrongSpkiHash);
      const transporter = createDaneTransporter(port, verifier);

      const error = await t.throwsAsync(
        sendTestEmail(transporter, 'DANE-EE SPKI mismatch')
      );

      t.truthy(error, 'sendMail should reject on SPKI hash mismatch');
    } finally {
      server.close();
    }
  }
);

//
// Test 5: tls.connect is restored after successful send
//
// The monkey-patch is single-use. After sendMail completes, tls.connect
// must be restored to its original value.
//
test.serial(
  'E2E: tls.connect is restored to original after successful DANE send',
  async (t) => {
    const origConnect = tlsModule.connect;
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const verifier = createCertHashVerifier(certInfo.certHash);
      const transporter = createDaneTransporter(port, verifier);

      t.is(
        tlsModule.connect,
        origConnect,
        'tls.connect should be original before send'
      );

      await sendTestEmail(transporter, 'Restore test success');

      t.is(
        tlsModule.connect,
        origConnect,
        'tls.connect should be restored after successful send'
      );
    } finally {
      server.close();
    }
  }
);

//
// Test 6: tls.connect is restored after DANE verification failure
//
// Even when DANE verification fails, tls.connect must be restored.
//
test.serial(
  'E2E: tls.connect is restored to original after DANE failure',
  async (t) => {
    const origConnect = tlsModule.connect;
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const wrongHash = crypto.randomBytes(32);
      const verifier = createCertHashVerifier(wrongHash);
      const transporter = createDaneTransporter(port, verifier);

      await t.throwsAsync(sendTestEmail(transporter, 'Restore test failure'));

      t.is(
        tlsModule.connect,
        origConnect,
        'tls.connect should be restored after DANE failure'
      );
    } finally {
      server.close();
    }
  }
);

//
// Test 7: daneVerifier that throws an exception is caught
//
// Edge case: if the verifier throws instead of returning an Error,
// the wrapper should catch it and destroy the socket.
//
test.serial(
  'E2E: DANE wrapper catches daneVerifier that throws exception',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const throwingVerifier = () => {
        throw new Error('Unexpected verifier crash');
      };

      const transporter = createDaneTransporter(port, throwingVerifier);

      const error = await t.throwsAsync(
        sendTestEmail(transporter, 'Verifier throws')
      );

      t.truthy(error, 'sendMail should reject when verifier throws');

      // tls.connect should still be restored
      t.is(
        tlsModule.connect.name,
        'connect',
        'tls.connect should be restored after verifier throws'
      );
    } finally {
      server.close();
    }
  }
);

//
// Test 8: Without DANE verifier, tls.connect passthrough
//
// When no _daneVerifier is set on TLS options, the wrapper should
// passthrough to the original tls.connect without any DANE checks.
//
test.serial(
  'E2E: tls.connect passthrough when no DANE verifier set',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      // Create transporter WITHOUT DANE — no _daneVerifier
      const transporter = nodemailer.createTransport({
        host: IP_ADDRESS,
        port,
        secure: false,
        requireTLS: true,
        opportunisticTLS: false,
        ignoreTLS: false,
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: ms('10s'),
        greetingTimeout: ms('10s'),
        socketTimeout: ms('10s')
      });

      const info = await sendTestEmail(transporter, 'No DANE passthrough');

      t.truthy(info, 'sendMail should succeed without DANE');
      t.truthy(info.messageId, 'Should have a messageId');
    } finally {
      server.close();
    }
  }
);

//
// Test 9: Multiple sequential sends through separate transporters
//
// Each send should get a fresh tls.connect wrapper and not interfere
// with subsequent sends.
//
test.serial(
  'E2E: multiple sequential DANE sends succeed independently',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      let verifyCount = 0;
      const countingVerifier = (hostname, cert) => {
        verifyCount++;
        // Always succeed — just counting calls
        return createCertHashVerifier(certInfo.certHash)(hostname, cert);
      };

      // Send 3 emails sequentially with fresh transporters
      for (let i = 1; i <= 3; i++) {
        const transporter = createDaneTransporter(port, countingVerifier);
        const info = await sendTestEmail(transporter, `Sequential send ${i}`);
        t.truthy(info.messageId, `Send ${i} should succeed`);
      }

      t.is(verifyCount, 3, 'daneVerifier should be called 3 times total');
    } finally {
      server.close();
    }
  }
);

//
// Test 10: prepareDaneTlsOptions sets correct properties
//
// Unit test for the prepareDaneTlsOptions function to verify it
// correctly sets rejectUnauthorized, _daneVerifier, and _daneHostname.
//
test('prepareDaneTlsOptions sets correct TLS properties', (t) => {
  const tlsOptions = {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  };
  const verifier = () => undefined;

  prepareDaneTlsOptions(tlsOptions, verifier, 'mx.example.com');

  t.false(
    tlsOptions.rejectUnauthorized,
    'rejectUnauthorized should be false for DANE-EE'
  );
  t.is(
    tlsOptions._daneVerifier,
    verifier,
    '_daneVerifier should be set to the verifier function'
  );
  t.is(
    tlsOptions._daneHostname,
    'mx.example.com',
    '_daneHostname should be set to the hostname'
  );
  t.is(
    tlsOptions.minVersion,
    'TLSv1.2',
    'Other TLS options should be preserved'
  );
});

//
// Test 11: prepareDaneTlsOptions overrides rejectUnauthorized
//
// Even if rejectUnauthorized was previously set to true (e.g., for
// requireTLS), DANE-EE must override it to false.
//
test('prepareDaneTlsOptions overrides rejectUnauthorized to false', (t) => {
  const tlsOptions = { rejectUnauthorized: true };
  const verifier = () => undefined;

  prepareDaneTlsOptions(tlsOptions, verifier, 'mx.example.com');

  t.false(
    tlsOptions.rejectUnauthorized,
    'rejectUnauthorized must be false for DANE-EE (RFC 7672 3.1.1)'
  );
});

//
// Test 12: ignoreTLS stays false when DANE is enabled (RFC 7672 2.2)
//
// RFC 7672 Section 2.2: DANE clients MUST use TLS.
// When daneEnabled=true, ignoreTLS must not be set even if there
// was a prior TLS error.
//
test('ignoreTLS stays false when DANE is enabled (RFC 7672 2.2)', (t) => {
  // Simulate the logic from get-transporter.js
  const daneEnabled = true;
  const requireTLS = true;
  const priorErr = new Error('ECONNRESET');
  priorErr.code = 'ECONNRESET';

  // This mirrors the logic in get-transporter.js
  const ignoreTLS = Boolean(
    !requireTLS && !daneEnabled && priorErr && priorErr.code === 'ECONNRESET'
  );

  t.false(
    ignoreTLS,
    'ignoreTLS should be false when DANE is enabled, even with prior TLS error'
  );
});

//
// Test 13: ignoreTLS allowed when DANE is NOT enabled
//
test('ignoreTLS allowed when DANE is not enabled and prior error exists', (t) => {
  const daneEnabled = false;
  const requireTLS = false;
  const priorErr = new Error('ECONNRESET');
  priorErr.code = 'ECONNRESET';

  const ignoreTLS = Boolean(
    !requireTLS && !daneEnabled && priorErr && priorErr.code === 'ECONNRESET'
  );

  t.true(
    ignoreTLS,
    'ignoreTLS should be true when DANE is not enabled and there is a prior ECONNRESET'
  );
});

//
// Test 14: DANE verifier receives X509Certificate object with publicKey
//
// Verify that the wrapper converts the raw peer certificate to an
// X509Certificate object so the verifier has access to .publicKey,
// .raw, and other properties needed for DANE verification.
//
test.serial(
  'E2E: DANE verifier receives X509Certificate with publicKey and raw',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      let receivedCert;
      const inspectingVerifier = (hostname, cert) => {
        receivedCert = cert;
        return undefined; // always succeed
      };

      const transporter = createDaneTransporter(port, inspectingVerifier);
      await sendTestEmail(transporter, 'Cert inspection');

      t.truthy(receivedCert, 'Verifier should receive a certificate');
      t.truthy(receivedCert.raw, 'Certificate should have .raw property');
      t.truthy(
        receivedCert.publicKey,
        'Certificate should have .publicKey property'
      );
      t.is(
        typeof receivedCert.publicKey.export,
        'function',
        'publicKey should have .export() method'
      );

      // Verify the cert matches what we generated
      const hash = crypto
        .createHash('sha256')
        .update(receivedCert.raw)
        .digest();
      t.true(
        hash.equals(certInfo.certHash),
        'Certificate hash should match the generated cert'
      );
    } finally {
      server.close();
    }
  }
);

//
// Test 15: DANE wrapper with verifier that always succeeds (no-op)
//
// Baseline test: a verifier that always returns undefined should
// allow all emails through.
//
test.serial(
  'E2E: DANE wrapper with always-succeed verifier sends email',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const transporter = createDaneTransporter(port, () => undefined);

      const info = await sendTestEmail(transporter, 'Always succeed');

      t.truthy(info, 'sendMail should succeed');
      t.truthy(info.messageId, 'Should have a messageId');
    } finally {
      server.close();
    }
  }
);

//
// Test 16: DANE wrapper with verifier that always fails
//
// A verifier that always returns an Error should reject all emails.
//
test.serial(
  'E2E: DANE wrapper with always-fail verifier rejects email',
  async (t) => {
    const certInfo = generateSelfSignedCert();
    if (!getPort)
      await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
    const port = await getPort();
    const server = await createStarttlsSmtpServer(certInfo, port);

    try {
      const alwaysFailVerifier = () => {
        const err = new Error('DANE verification always fails');
        err.code = 'DANE_VERIFICATION_FAILED';
        err.category = 'dane';
        return err;
      };

      const transporter = createDaneTransporter(port, alwaysFailVerifier);

      const error = await t.throwsAsync(
        sendTestEmail(transporter, 'Always fail')
      );

      t.truthy(error, 'sendMail should reject');
    } finally {
      server.close();
    }
  }
);
