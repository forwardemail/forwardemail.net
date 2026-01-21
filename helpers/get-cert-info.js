/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const x509 = require('@peculiar/x509');
const { Crypto } = require('@peculiar/webcrypto');

const i18n = require('#helpers/i18n');

// Set up WebCrypto provider for x509
const crypto = new Crypto();
x509.cryptoProvider.set(crypto);

/**
 * Validate and extract information from an S/MIME certificate
 * @param {string} certPem - PEM-encoded X.509 certificate
 * @param {string} locale - Locale for error messages
 * @returns {Object|false} Certificate info or false if empty input
 */
async function getCertInfo(certPem, locale = i18n.config.defaultLocale) {
  if (!certPem || (typeof certPem === 'string' && certPem.trim() === '')) {
    return false;
  }

  let cert;
  try {
    cert = new x509.X509Certificate(certPem);
  } catch {
    throw Boom.badRequest(
      i18n.translateError('INVALID_SMIME_CERTIFICATE', locale)
    );
  }

  // Check certificate validity dates
  const now = new Date();
  if (now < cert.notBefore) {
    throw Boom.badRequest(
      i18n.translateError('SMIME_CERTIFICATE_NOT_YET_VALID', locale)
    );
  }

  if (now > cert.notAfter) {
    throw Boom.badRequest(
      i18n.translateError('SMIME_CERTIFICATE_EXPIRED', locale)
    );
  }

  // Extract public key info
  const publicKey = await cert.publicKey.export();
  const { algorithm } = publicKey;

  let keyType;
  let keySize;
  let curve;

  if (algorithm.name === 'RSASSA-PKCS1-v1_5' || algorithm.name === 'RSA-OAEP') {
    keyType = 'RSA';
    keySize = algorithm.modulusLength;

    // Validate minimum RSA key size (2048 bits)
    if (keySize < 2048) {
      throw Boom.badRequest(
        i18n.translateError('SMIME_RSA_KEY_TOO_SMALL', locale)
      );
    }
  } else if (algorithm.name === 'ECDSA' || algorithm.name === 'ECDH') {
    keyType = 'ECC';
    curve = algorithm.namedCurve;

    // Validate supported curves
    const supportedCurves = ['P-256', 'P-384', 'P-521'];
    if (!supportedCurves.includes(curve)) {
      throw Boom.badRequest(
        i18n.translateError('SMIME_UNSUPPORTED_CURVE', locale)
      );
    }
  } else {
    throw Boom.badRequest(
      i18n.translateError('SMIME_UNSUPPORTED_KEY_TYPE', locale)
    );
  }

  // Calculate fingerprint (SHA-256)
  const certDer = Buffer.from(cert.rawData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', certDer);
  const fingerprint = Buffer.from(hashBuffer)
    .toString('hex')
    .toUpperCase()
    .match(/.{2}/g)
    .join(':');

  // Extract subject info
  const { subject } = cert;

  return {
    keyType,
    keySize,
    curve,
    fingerprint,
    subject,
    notBefore: cert.notBefore,
    notAfter: cert.notAfter,
    serialNumber: cert.serialNumber
  };
}

module.exports = getCertInfo;
