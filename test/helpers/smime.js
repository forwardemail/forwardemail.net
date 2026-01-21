/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const test = require('ava');
const { Crypto } = require('@peculiar/webcrypto');
const x509 = require('@peculiar/x509');

const getCertInfo = require('../../helpers/get-cert-info');
const encryptMessageSMIME = require('../../helpers/encrypt-message-smime');

// Set up WebCrypto for x509
const webcrypto = new Crypto();
x509.cryptoProvider.set(webcrypto);

// Helper to generate test certificates
async function generateTestCertificate(options = {}) {
  const {
    algorithm = 'RSA',
    keySize = 2048,
    curve = 'P-256',
    notBefore = new Date(),
    notAfter = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    email = 'test@example.com'
  } = options;

  let keys;
  let signingAlgorithm;

  if (algorithm === 'RSA') {
    keys = await webcrypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: keySize,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['sign', 'verify']
    );
    signingAlgorithm = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
  } else if (algorithm === 'ECC') {
    keys = await webcrypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: curve
      },
      true,
      ['sign', 'verify']
    );
    signingAlgorithm = { name: 'ECDSA', hash: 'SHA-256' };
  }

  // Create certificate
  const cert = await x509.X509CertificateGenerator.createSelfSigned({
    serialNumber: crypto.randomBytes(16).toString('hex'),
    name: `CN=${email}, E=${email}`,
    notBefore,
    notAfter,
    keys,
    signingAlgorithm,
    extensions: [
      new x509.BasicConstraintsExtension(false, undefined, true),
      // keyEncipherment (32) | dataEncipherment (16) | digitalSignature (128) = 176
      new x509.KeyUsagesExtension(176, true),
      new x509.ExtendedKeyUsageExtension(
        ['1.3.6.1.5.5.7.3.4'], // emailProtection
        false
      ),
      await x509.SubjectKeyIdentifierExtension.create(keys.publicKey)
    ]
  });

  return cert.toString('pem');
}

// Tests for getCertInfo
test('getCertInfo - validates RSA-2048 certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const info = await getCertInfo(cert);
  t.is(info.keyType, 'RSA');
  t.is(info.keySize, 2048);
  t.truthy(info.fingerprint);
  t.truthy(info.notBefore);
  t.truthy(info.notAfter);
});

test('getCertInfo - validates RSA-4096 certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 4096
  });

  const info = await getCertInfo(cert);
  t.is(info.keyType, 'RSA');
  t.is(info.keySize, 4096);
});

test('getCertInfo - validates ECC P-256 certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'ECC',
    curve: 'P-256'
  });

  const info = await getCertInfo(cert);
  t.is(info.keyType, 'ECC');
  t.is(info.curve, 'P-256');
});

test('getCertInfo - validates ECC P-384 certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'ECC',
    curve: 'P-384'
  });

  const info = await getCertInfo(cert);
  t.is(info.keyType, 'ECC');
  t.is(info.curve, 'P-384');
});

test('getCertInfo - validates ECC P-521 certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'ECC',
    curve: 'P-521'
  });

  const info = await getCertInfo(cert);
  t.is(info.keyType, 'ECC');
  t.is(info.curve, 'P-521');
});

test('getCertInfo - rejects RSA key smaller than 2048 bits', async (t) => {
  // Generate a 1024-bit RSA key (too small)
  const keys = await webcrypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 1024,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );

  const cert = await x509.X509CertificateGenerator.createSelfSigned({
    serialNumber: crypto.randomBytes(16).toString('hex'),
    name: 'CN=test@example.com, E=test@example.com',
    notBefore: new Date(),
    notAfter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    keys,
    signingAlgorithm: { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    extensions: []
  });

  await t.throwsAsync(async () => getCertInfo(cert.toString('pem')), {
    message: /RSA key must be at least 2048 bits/
  });
});

test('getCertInfo - rejects expired certificate', async (t) => {
  const cert = await generateTestCertificate({
    notBefore: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    notAfter: new Date(Date.now() - 1000)
  });

  await t.throwsAsync(async () => getCertInfo(cert), {
    message: /certificate has expired/i
  });
});

test('getCertInfo - rejects not-yet-valid certificate', async (t) => {
  const cert = await generateTestCertificate({
    notBefore: new Date(Date.now() + 24 * 60 * 60 * 1000),
    notAfter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  });

  await t.throwsAsync(async () => getCertInfo(cert), {
    message: /certificate is not yet valid/i
  });
});

test('getCertInfo - rejects invalid PEM format', async (t) => {
  await t.throwsAsync(async () => getCertInfo('not a valid certificate'), {
    message: /Invalid S\/MIME certificate format/
  });
});

// Tests for encryptMessageSMIME
test('encryptMessageSMIME - encrypts simple message with RSA certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Test\r\n' +
      '\r\n' +
      'Hello, World!'
  );

  const encrypted = await encryptMessageSMIME(cert, message);

  t.true(Buffer.isBuffer(encrypted) || typeof encrypted === 'string');
  const encryptedStr = encrypted.toString();
  t.true(
    encryptedStr.includes('application/pkcs7-mime') ||
      encryptedStr.includes('application/x-pkcs7-mime')
  );
  t.true(encryptedStr.includes('enveloped-data'));
});

test('encryptMessageSMIME - encrypts message with ECC certificate', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'ECC',
    curve: 'P-256'
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Test\r\n' +
      '\r\n' +
      'Hello, World!'
  );

  const encrypted = await encryptMessageSMIME(cert, message);

  t.true(Buffer.isBuffer(encrypted) || typeof encrypted === 'string');
  const encryptedStr = encrypted.toString();
  t.true(
    encryptedStr.includes('application/pkcs7-mime') ||
      encryptedStr.includes('application/x-pkcs7-mime')
  );
});

test('encryptMessageSMIME - skips already encrypted message', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  // Create a message that looks like it's already S/MIME encrypted
  const alreadyEncrypted = Buffer.from(
    'Content-Type: application/pkcs7-mime; smime-type=enveloped-data\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' +
      'MIIBhgYJKoZIhvcNAQcDoIIBdzCCAXMCAQAxggE...'
  );

  const result = await encryptMessageSMIME(cert, alreadyEncrypted);

  // Should return the original message unchanged
  t.is(result.toString(), alreadyEncrypted.toString());
});

test('encryptMessageSMIME - handles multipart messages', async (t) => {
  const cert = await generateTestCertificate({
    algorithm: 'RSA',
    keySize: 2048
  });

  const message = Buffer.from(
    'From: sender@example.com\r\n' +
      'To: recipient@example.com\r\n' +
      'Subject: Test\r\n' +
      'MIME-Version: 1.0\r\n' +
      'Content-Type: multipart/mixed; boundary="boundary"\r\n' +
      '\r\n' +
      '--boundary\r\n' +
      'Content-Type: text/plain\r\n' +
      '\r\n' +
      'Hello, World!\r\n' +
      '--boundary\r\n' +
      'Content-Type: application/octet-stream\r\n' +
      'Content-Disposition: attachment; filename="test.txt"\r\n' +
      '\r\n' +
      'attachment content\r\n' +
      '--boundary--'
  );

  const encrypted = await encryptMessageSMIME(cert, message);

  t.true(Buffer.isBuffer(encrypted) || typeof encrypted === 'string');
  const encryptedStr = encrypted.toString();
  t.true(
    encryptedStr.includes('application/pkcs7-mime') ||
      encryptedStr.includes('application/x-pkcs7-mime')
  );
});
