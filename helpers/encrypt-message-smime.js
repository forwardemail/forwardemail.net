/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const x509 = require('@peculiar/x509');
const pkijs = require('pkijs');
const asn1js = require('asn1js');
const { Crypto } = require('@peculiar/webcrypto');

const config = require('#config');

// Set up WebCrypto provider
const webcrypto = new Crypto();
x509.cryptoProvider.set(webcrypto);
pkijs.setEngine(
  'webcrypto',
  new pkijs.CryptoEngine({
    name: 'webcrypto',
    crypto: webcrypto,
    subtle: webcrypto.subtle
  })
);

/**
 * Encrypt a message using S/MIME (RFC 8551)
 * @param {string} certPem - PEM-encoded X.509 certificate
 * @param {Buffer} raw - Raw email message
 * @returns {Buffer} S/MIME encrypted message
 */
async function encryptMessageSMIME(certPem, raw) {
  if (!certPem) throw new TypeError('S/MIME certificate missing');

  if (typeof raw === 'string') raw = Buffer.from(raw);
  else if (typeof raw === 'object' && Array.isArray(raw.chunks) && raw.chunklen)
    raw = Buffer.concat(raw.chunks, raw.chunklen);

  if (!Buffer.isBuffer(raw)) throw new TypeError('Raw must be a Buffer');

  // Check if message is already S/MIME encrypted
  const headerStr = raw.slice(0, Math.min(raw.length, 2048)).toString('utf8');
  if (
    headerStr.includes('application/pkcs7-mime') ||
    headerStr.includes('application/x-pkcs7-mime')
  ) {
    return raw;
  }

  // Parse the certificate
  const cert = new x509.X509Certificate(certPem);
  const certDer = Buffer.from(cert.rawData);

  // Parse certificate for PKI.js
  const asn1 = asn1js.fromBER(certDer);
  const pkijsCert = new pkijs.Certificate({ schema: asn1.result });

  // Split message into header and body
  const lastBytes = [];
  let headerEnd = raw.length;
  let headerLength = 0;

  for (let i = 0, len = raw.length; i < len; i++) {
    lastBytes.unshift(raw[i]);
    if (lastBytes.length > 10) {
      lastBytes.length = 4;
    }

    if (lastBytes.length < 2) {
      continue;
    }

    let pos = 0;
    if (lastBytes[pos] !== 0x0a) {
      continue;
    }

    pos++;
    if (lastBytes[pos] === 0x0d) {
      pos++;
    }

    if (lastBytes[pos] !== 0x0a) {
      continue;
    }

    pos++;
    if (lastBytes[pos] === 0x0d) {
      pos++;
    }

    headerEnd = i + 1 - pos;
    headerLength = pos;
    break;
  }

  const header = raw.slice(0, headerEnd);
  const body =
    headerEnd + headerLength < raw.length
      ? raw.slice(headerEnd + headerLength)
      : Buffer.alloc(0);

  // Process headers
  const headers = [];
  const bodyHeaders = [];
  let lastHeader = false;

  const headerLines = header.toString('binary').split('\r\n');
  for (let i = 0, len = headerLines.length; i < len; i++) {
    const line = headerLines[i];
    if (!i || !lastHeader || !/^\s/.test(line)) {
      lastHeader = [line];
      if (/^content-type:/i.test(line)) {
        const parts = line.split(':');
        const value = parts.slice(1).join(':');
        if (
          value.split(';').shift().trim().toLowerCase() ===
          'application/pkcs7-mime'
        ) {
          return raw;
        }

        bodyHeaders.push(lastHeader);
      } else if (/^content-transfer-encoding:/i.test(line)) {
        bodyHeaders.push(lastHeader);
      } else {
        headers.push(lastHeader);
      }
    } else {
      lastHeader.push(line);
    }
  }

  // Build the content to encrypt
  const bodyHeadersStr = bodyHeaders
    .map((line) => line.join('\r\n'))
    .join('\r\n');
  const contentToEncrypt = Buffer.concat([
    Buffer.from(bodyHeadersStr + '\r\n\r\n'),
    body
  ]);

  // Create EnvelopedData structure
  const cmsEnveloped = new pkijs.EnvelopedData();

  // Add recipient
  cmsEnveloped.addRecipientByCertificate(pkijsCert, {
    oaepHashAlgorithm: 'SHA-256'
  });

  // Encrypt the content with AES-256-CBC
  await cmsEnveloped.encrypt(
    { name: 'AES-CBC', length: 256 },
    contentToEncrypt
  );

  // Create ContentInfo wrapper
  const cmsContentInfo = new pkijs.ContentInfo();
  cmsContentInfo.contentType = '1.2.840.113549.1.7.3'; // envelopedData OID
  cmsContentInfo.content = cmsEnveloped.toSchema();

  // Encode to DER
  const cmsEncoded = cmsContentInfo.toSchema().toBER(false);
  const encryptedBase64 = Buffer.from(cmsEncoded).toString('base64');

  // Format base64 with line breaks (76 chars per line)
  const formattedBase64 = encryptedBase64.match(/.{1,76}/g).join('\r\n');

  // Build S/MIME headers
  headers.push(
    ['Content-Type: application/pkcs7-mime; smime-type=enveloped-data;'],
    [' name="smime.p7m"'],
    ['Content-Transfer-Encoding: base64'],
    ['Content-Disposition: attachment; filename="smime.p7m"'],
    [
      `Content-Description: S/MIME Encrypted Message (Forward Email v${config.pkg.version})`
    ]
  );

  const headersStr = headers.map((line) => line.join('\r\n')).join('\r\n');

  return Buffer.concat([
    Buffer.from(headersStr + '\r\n\r\n'),
    Buffer.from(formattedBase64 + '\r\n')
  ]);
}

module.exports = encryptMessageSMIME;
