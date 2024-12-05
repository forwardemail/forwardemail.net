/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// NOTE: if you need to delete certs you created by mistake
//       <https://identity.apple.com/pushcert/>
//

// <https://github.com/nodemailer/wildduck/issues/711>
// <https://github.com/st3fan/dovecot-xaps-daemon/issues/46#issuecomment-428643406>
// <https://patsch.dev/2022/08/11/reverse-engineering-macos-server-apns-push-certificate-retrieval/>
// <https://github.com/macports/macports-ports/blob/8be4386f729abab37d25449c4f845289d0adbc3b/mail/dovecot/Portfile#L234-L243>
// <https://arstechnica.com/civis/threads/does-ios-mail-support-standard-idle-push.1485686/>
// <https://github.com/freswa/dovecot-xaps-daemon/issues/39>

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { isMainThread } = require('node:worker_threads');

const X509 = require('@peculiar/x509');
const _ = require('lodash');
const ms = require('ms');
const pEvent = require('p-event');
const pWaitFor = require('p-wait-for');
const plist = require('plist');
const splitLines = require('split-lines');

const env = require('#config/env');
const config = require('#config');
const logger = require('#helpers/logger');

// <https://github.com/JCMais/node-libcurl/issues/414>
let Curl;
if (config.env !== 'test' && isMainThread) Curl = require('node-libcurl').Curl;

X509.cryptoProvider.set(crypto);

const USER_AGENT =
  'Servermgrd%20Plugin/6.0 CFNetwork/811.11 Darwin/16.7.0 (x86_64)';

//
// NOTE: it does not appear that we need to add geo trust CA
//
// <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L26>
// const GEO_TRUST_CA =
//   '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjygAwIBAgIDAjRWMA0GCSqGSIb3DQEBBQUAMEIxCzAJBgNVBAYTAlVT\nMRYwFAYDVQQKEw1HZW9UcnVzdCBJbmMuMRswGQYDVQQDExJHZW9UcnVzdCBHbG9i\nYWwgQ0EwHhcNMDIwNTIxMDQwMDAwWhcNMjIwNTIxMDQwMDAwWjBCMQswCQYDVQQG\nEwJVUzEWMBQGA1UEChMNR2VvVHJ1c3QgSW5jLjEbMBkGA1UEAxMSR2VvVHJ1c3Qg\nR2xvYmFsIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2swYYzD9\n9BcjGlZ+W988bDjkcbd4kdS8odhM+KhDtgPpTSEHCIjaWC9mOSm9BXiLnTjoBbdq\nfnGk5sRgprDvgOSJKA+eJdbtg/OtppHHmMlCGDUUna2YRpIuT8rxh0PBFpVXLVDv\niS2Aelet8u5fa9IAjbkU+BQVNdnARqN7csiRv8lVK83Qlz6cJmTM386DGXHKTubU\n1XupGc1V3sjs0l44U+VcT4wt/lAjNvxm5suOpDkZALeVAjmRCw7+OC7RHQWa9k0+\nbw8HHa8sHo9gOeL6NlMTOdReJivbPagUvTLrGAMoUgRx5aszPeE4uwc2hGKceeoW\nMPRfwCvocWvk+QIDAQABo1MwUTAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTA\nephojYn7qwVkDBF9qn1luMrMTjAfBgNVHSMEGDAWgBTAephojYn7qwVkDBF9qn1l\nuMrMTjANBgkqhkiG9w0BAQUFAAOCAQEANeMpauUvXVSOKVCUn5kaFOSPeCpilKIn\nZ57QzxpeR+nBsqTP3UEaBU6bS+5Kb1VSsyShNwrrZHYqLizz/Tt1kL/6cdjHPTfS\ntQWVYrmm3ok9Nns4d0iXrKYgjy6myQzCsplFAMfOEVEiIuCl6rYVSAlk6l5PdPcF\nPseKUgzbFbS9bZvlxrFUaKnjaZC2mqUPuLk/IH2uSrW4nOQdtqvmlKXBx4Ot2/Un\nhw4EbNX/3aBd7YdStysVAq45pmp06drE57xNNB6pXE0zX5IJL4hmXXeXxx12E6nV\n5fEWCRE11azbJHFwLJhWC9kXtNHjUStedejV0NxPNO3CBWaAocvmMw==\n-----END CERTIFICATE-----';

// <https://github.com/scintill/macos-server-apns-certs/tree/master/vendorcerts>
const KEYS = ['Calendar', 'Contact', 'Mail', 'Mgmt', 'Alerts'];

const VENDOR_CERTS = [];
for (const file of fs.readdirSync(path.join(__dirname, 'vendorcerts'))) {
  if (file.includes('.')) continue;
  // file = 01, 02, 03, etc.
  // 01/chain and 01/key need read and added in-memory
  VENDOR_CERTS.push({
    name: file,
    chain: fs.readFileSync(path.join(__dirname, 'vendorcerts', file, 'chain')),
    // x509 pkcs1 private key in DER format
    key: crypto.createPrivateKey({
      key: fs.readFileSync(path.join(__dirname, 'vendorcerts', file, 'key')),
      format: 'der',
      type: 'pkcs1'
    })
  });
}

async function parseResponse(xml, certs) {
  const result = plist.parse(xml);
  // result {
  //   Response: {
  //     Status: { ErrorDescription: '', ErrorMessage: '', ErrorCode: 0 },
  //     Certificates: [ [Object], [Object], [Object], [Object], [Object] ]
  //   },
  //   Header: {
  //     ClientIPAddress: '1',
  //     LanguagePreference: '1',
  //     TransactionId: '1',
  //     ClientOSVersion: '2.1',
  //     ClientOSName: 'MAC OSX',
  //     ClientApplicationName: 'XServer',
  //     ClientApplicationCredential: '1'
  //   }
  // }

  // safeguard
  if (result?.Response?.Status?.ErrorCode !== 0) {
    const err = new TypeError('Invalid response');
    err.result = result;
    err.xml = xml;
    throw err;
  }

  for (const [i, key] of KEYS.entries()) {
    // <https://stackoverflow.com/a/71156085>
    // <https://stackoverflow.com/a/58724754>
    const cert = new crypto.X509Certificate(
      result.Response.Certificates[i].Certificate
    );

    // TODO: renew certificates 30 days before they expire using `cert.validTo`
    // console.log('cert.validTo', cert.validTo);

    certs[key].certificate = cert.toString();

    if (key === 'Mail') {
      // parse and validate topic from Mail certificate
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L197-L207>
      const parsedCert = new X509.X509Certificate(certs.Mail.certificate);

      if (
        !parsedCert.subject ||
        !parsedCert.subject.startsWith('0.9.2342.19200300.100.1.1')
      )
        throw new TypeError(
          'Subject must start with "0.9.2342.19200300.100.1.1"'
        );

      // <https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CommunicatingwithAPNs.html#//apple_ref/doc/uid/TP40008194-CH11-SW1>
      const extension = parsedCert.getExtension('1.2.840.113635.100.6.3.2');
      if (!extension)
        throw new TypeError(
          'Could not find Extension with type "1.2.840.113635.100.6.3.2" which indicates production use'
        );

      certs.Mail.topic = splitLines(cert.subject)[0].split('UID=')[1].trim();
    }
  }

  // cache the certs
  const obj = {};
  for (const key of KEYS) {
    const cert = certs[key];

    // eslint-disable-next-line no-await-in-loop
    const cryptoPublicKey = await crypto.subtle.importKey(
      'jwk',
      // eslint-disable-next-line no-await-in-loop
      await crypto.subtle.exportKey('jwk', cert.publicKey),
      { hash: 'SHA-1', name: 'RSASSA-PKCS1-v1_5' },
      true,
      ['verify']
    );

    cert.publicKey = crypto.KeyObject.from(cryptoPublicKey)
      .export({ format: 'pem', type: 'pkcs1' })
      .toString();

    // eslint-disable-next-line no-await-in-loop
    const cryptoPrivateKey = await crypto.subtle.importKey(
      'jwk',
      // eslint-disable-next-line no-await-in-loop
      await crypto.subtle.exportKey('jwk', cert.privateKey),
      { hash: 'SHA-1', name: 'RSASSA-PKCS1-v1_5' },
      true,
      ['sign']
    );
    cert.privateKey = crypto.KeyObject.from(cryptoPrivateKey)
      .export({ format: 'pem', type: 'pkcs1' })
      .toString();

    obj[key] = cert;
  }

  return obj;
}

async function createCsrs(certs, key) {
  const alg = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-1',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1])
  };
  const commonName =
    key === 'Alerts'
      ? 'com.apple.server.apns.alerts'
      : `com.apple.servermgrd.apns.${key.toLowerCase()}`;
  const csr = await X509.Pkcs10CertificateRequestGenerator.create({
    // TODO: pass `serialNumber` re-using existing if renewal occurring
    // const serialNumber = getCertSerialNumber(certs, key);
    default: 'SHA-1',
    name: `CN=${commonName}`,
    keys: {
      publicKey: certs[key].publicKey,
      privateKey: certs[key].privateKey
    },
    // TODO: country name 'US' <------------ required
    signingAlgorithm: alg,
    extensions: []
  });
  return csr.toString('base64');
}

// <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/pkg/apple_xserver_certs/request.go#L268-L277>
function getSignatureFromXML(xml, vendorSigningCert) {
  const sign = crypto.createSign('sha1');
  sign.write(xml);
  sign.end();
  const signature = sign.sign(vendorSigningCert.key);
  return signature;
}

function getCertSerialNumber(certs, key) {
  //
  // `certificate` is added to cached value after response from Apple
  // (so when we first create new certificates, they don't yet exist in the object)
  //
  if (!certs[key].certificate) return '';

  const x509 = new crypto.X509Certificate(certs[key].certificate);
  return x509.serialNumber;
}

async function getApnCerts(client) {
  // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L59C1-L60C26>
  //
  // appleId = your-developer-apple-id@yourdomain.com
  // appleIdHashedPassword = output from `xaps -pass`
  //
  // HOWEVER you don't need `xaps -pass` (so you don't need to download OS X server)
  // instead you can use this command `openssl dgst -sha256 -binary | xxd -p -c 32` (then hit CTRL+D CTRL+D)
  // as per <https://github.com/scintill/macos-server-apns-certs/tree/master?tab=readme-ov-file#download-and-configure>
  //
  // env.APPLE_ID
  // env.APPLE_ID_HASHED_PASSWORD
  //

  // generate private keys using apple ID (username) and apple ID hashed password (password)
  const certsCache = await client.get('aps_certs');
  if (certsCache) {
    try {
      return JSON.parse(certsCache);
    } catch (err) {
      logger.fatal(err);
    }
  }

  // lock cache so we don't generate two pairs at once
  const lock = await client.get('aps_lock');

  if (lock) {
    // wait 15s for cache to arrive
    await pWaitFor(
      async () => {
        const certsCache = await client.get('aps_certs');
        return Boolean(certsCache);
      },
      { timeout: ms('15s') }
    );
    // then recursively call this function once done
    return getApnCerts(client);
  }

  // if no lock then we can proceed to attempt to get new certs
  await client.set('aps_lock', true, 'PX', ms('1m'));

  // get a random signing cert from VENDOR_CERTS
  const vendorSigningCert = _.sample(VENDOR_CERTS);

  let certs = {};
  for (const key of KEYS) {
    const alg = {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-1',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1])
    };
    // eslint-disable-next-line no-await-in-loop
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      alg,
      true, // exportable
      ['sign', 'verify']
    );

    //
    // NOTE: we need to use this approach because `cert.sign` in `node-forge`
    //       looks for a `.sign` property in the passed arg, e.g. `cert.sign(key)` looks for `key.sign`
    //
    // generate a keypair or use one you have already
    // const keys = forge.pki.rsa.generateKeyPair(2048);
    certs[key] = {
      publicKey,
      privateKey
      // privateKeyPEM: forge.pki.privateKeyToPem(keys.privateKey),
      // publicKeyPEM: forge.pki.publicKeyToPem(keys.publicKey)
    };
  }

  const CertRequestList = [];
  for (const [i, key] of KEYS.entries()) {
    const serialNumber = getCertSerialNumber(certs, key);
    CertRequestList.push({
      // eslint-disable-next-line no-await-in-loop
      CSR: await createCsrs(certs, key),
      CertRequestNo: i,
      ...(serialNumber
        ? {
            CertificateSerialNumber: serialNumber
          }
        : {}),
      Description: `${
        config.env === 'production' ? env.IMAP_HOST : 'imap.forwardemail.net'
      } - apns:com.apple.${key.toLowerCase()}`,
      ServiceType: `Service_${key}`
    });
  }

  // generate plist XML
  const json = {
    Header: {
      ClientApplicationCredential: '1',
      ClientApplicationName: 'XServer',
      ClientIPAddress: '1',
      ClientOSName: 'MAC OSX',
      ClientOSVersion: '2.1',
      LanguagePreference: '1',
      TransactionId: '1',
      Version: '1'
    },
    Request: {
      CertRequestList,
      ProfileType: 'Production',
      RequesterType: 'XServer',
      User: {
        AccountName: env.APPLE_ID,
        PasswordHash: env.APPLE_ID_HASHED_PASSWORD
      }
    }
  };

  const xml = plist.build(json, { pretty: true });

  // each of these is base64 so we get <key> and <data>
  const bodyJson = {
    PushCertCertificateChain: vendorSigningCert.chain,
    PushCertRequestPlist: Buffer.from(xml),
    PushCertSignature: getSignatureFromXML(xml, vendorSigningCert),
    PushCertSignedRequest: true
  };
  const body = plist.build(bodyJson);

  if (!Curl) throw new TypeError('Cannot curl in test environment');

  //
  // due to HPE_INVALID_HEADER_TOKEN we must use `insecureHTTPParser: true`
  // <https://github.com/nodejs/undici/issues/2678>
  // <https://stackoverflow.com/a/72612851>
  //
  // however `insecureHTTPParser: true` doesn't seem to work anymore (node v18+)
  // so we rely on using cURL instead
  //
  const curl = new Curl();
  // curl.setOpt('HTTP_VERSION', CurlHttpVersion['2']);

  // NOTE: renew would be "https://identity.apple.com/pushcert/caservice/renew"
  curl.setOpt('URL', 'https://identity.apple.com/pushcert/caservice/new');

  // curl.setOpt('FOLLOWLOCATION', true);

  if (config.env !== 'production') curl.setOpt(Curl.option.VERBOSE, true);

  curl.setOpt(Curl.option.POST, true);

  curl.setOpt(Curl.option.HTTPHEADER, [
    'Content-Type: text/x-xml-plist',
    'Accept: */*',
    'Accept-Language: en-us'
  ]);

  curl.setOpt('USERAGENT', USER_AGENT);
  curl.setOpt(Curl.option.POSTFIELDS, body);

  let response;
  curl.on('end', function (statusCode, data, headers) {
    response = {
      statusCode,
      data,
      headers
    };
    this.close();
  });

  curl.on('error', curl.close.bind(curl));

  curl.perform();

  await pEvent(curl, 'end');

  // basic response validation
  if (!response || response.statusCode !== 200 || !response.data) {
    const err = new TypeError('Response was not valid');
    err.response = response;
    throw err;
  }

  // NOTE: this doesn't work due to the below error
  // <https://github.com/nodejs/undici/issues/2678#issuecomment-2263646999>
  // NOTE: renew would be "https://identity.apple.com/pushcert/caservice/renew"
  // const response = await retryRequest(
  //   'https://identity.apple.com/pushcert/caservice/new',
  //   {
  //     retries: 0,
  //     method: 'POST',
  //     headers: {
  //       'User-Agent': USER_AGENT,
  //       'Content-Type': 'text/x-xml-plist',
  //       Accept: '*/*',
  //       'Accept-Language': 'en-us'
  //     },
  //     body,
  //     resolver
  //   }
  // );
  // const data = await response.body.text();
  // console.log('data', data);

  // store which vendor signing cert we used
  await client.set('aps_ca', vendorSigningCert.name);

  // parse response body
  certs = await parseResponse(response.data, certs);

  // TODO: properly renew cert and store it to disk (?)
  // 5 days before renewal to expire
  await client.set('aps_certs', JSON.stringify(certs), 'PX', ms('360d'));

  // remove lock
  await client.del('aps_lock');

  return certs;
}

module.exports = getApnCerts;
