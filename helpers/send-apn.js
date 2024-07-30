/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// NOTE: if you need to delete certs you created by mistake
//       <https://identity.apple.com/pushcert/>
//

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');

const APNS = require('apns2');
const Redis = require('@ladjs/redis');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const forge = require('node-forge');
const pEvent = require('p-event');
// const pMap = require('p-map');
const pMapSeries = require('p-map-series');
const pem = require('pem');
const plist = require('plist');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const { Curl } = require('node-libcurl');

const Aliases = require('#models/aliases');
const config = require('#config');
const env = require('#config/env');
// TODO: put back logger once we done testing production
// const logger = require('#helpers/logger');

// <https://github.com/scintill/macos-server-apns-certs/tree/master/vendorcerts>
const KEYS = ['Calendar', 'Contact', 'Mail', 'Mgmt', 'Alerts'];
const VENDOR_CERTS = [];

const breeSharedConfig = sharedConfig('BREE');

// TODO: re-use existing connection from web
const client = new Redis(breeSharedConfig.redis, console);
client.setMaxListeners(0);

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

async function createCsrs(certs, key) {
  // Mhttps://github.com/Azure/azure-iot-sdk-node/blob/a85e280350a12954f46672761b0b516d08d374b5/provisioning/tools/create_test_cert.js#L67-L94>
  const options = {
    commonName:
      key === 'Alerts'
        ? 'com.apple.server.apns.alerts'
        : `com.apple.servermgrd.apns.${key.toLowerCase()}`,
    countryName: 'US',
    days: 30, // 30d is default
    // <https://github.com/scintill/macos-server-apns-certs/blob/master/openssl.cnf>
    config: [
      '[req]',
      'req_extensions = v3_req',
      'string_mask = utf8only',
      'distinguished_name = req_distinguished_name',
      '',
      '[req_distinguished_name]',
      '',
      '[v3_req]',
      'basicConstraints = critical,CA:TRUE'
    ].join('\n'),
    serviceKey: splitLines(
      forge.pki.privateKeyToPem(certs[key].privateKey)
    ).join('\n')
  };
  const keys = await new Promise((resolve, reject) => {
    pem.createCertificate(options, (err, keys) => {
      if (err) return reject(err);
      resolve(keys);
    });
  });
  return keys.csr;
}

/*
// openssl req -batch -new -key $< -sha1 -config openssl.cnf -subj /CN=$(shell basename $@)/C=US -out $@
// <https://stackoverflow.com/a/31624843>
function createCsrs(certs, key) {
  const cert = forge.pki.createCertificate();
  cert.publicKey = certs[key].publicKey;

  // NOTE: all of them are `servermgrd` except alerts
  // com.apple.servermgrd.apns.calendar
  // com.apple.servermgrd.apns.contact
  // com.apple.servermgrd.apns.mail
  // com.apple.servermgrd.apns.mgmt
  // com.apple.server.apns.alerts
  const attrs = [
    {
      name: 'commonName',
      value:
        key === 'Alerts'
          ? 'com.apple.server.apns.alerts'
          : `com.apple.servermgrd.apns.${key.toLowerCase()}`
    },
    {
      name: 'countryName',
      value: 'US'
    }
  ];
  cert.setExtensions([]);
  cert.setSubject(attrs);
  cert.sign(certs[key].privateKey, forge.md.sha1.create());
  const pem = splitLines(forge.pki.certificateToPem(cert)).join('\n');
  console.log('pem created', pem);
  return pem;
}
*/

async function parseResponse(xml, certs, fromCache = false) {
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
    if (fromCache) {
      await client.del('aps_response');
      return getCerts();
    }

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
    console.log('cert.validTo', cert.validTo);

    certs[key].certificate = cert.toString();

    if (key === 'Mail') {
      // TODO: parse and validate topic from Mail certificate
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L197-L207>
      /*
      if len(cert.Subject.Names) == 0 {
        return "", errors.New("Subject.Names is empty")
      }

      if !cert.Subject.Names[0].Type.Equal(oidUid) {
        return "", errors.New("did not find a Subject.Names[0] with type 0.9.2342.19200300.100.1.1")
      }

      if !cert.Extensions[7].Id.Equal(productionOID) {
        return "", errors.New("did not find an Extensions[7] with Id 1.2.840.113635.100.6.3.2 " +
          "which would label this certificate for production use")
      }
      */
      certs.Mail.topic = splitLines(cert.subject)[0].split('UID=')[1].trim();
    }
  }

  // cache the certs
  await client.set(
    'aps_certs',
    JSON.stringify(
      certs.map((cert) => ({
        ...cert,
        publicKey: forge.pki.publicKeyToPem(cert.publicKey),
        privateKey: forge.pki.privateKeyToPem(cert.privateKey)
      }))
    )
  );

  return certs;
}

async function getCerts() {
  // TODO: get certs from cache if available (using PTTL/expiry of certs)
  // TODO: pWaitFor response if HOSTNAME IMAP is caching
  // TODO: only attempt to generate if HOSTNAME is IMAP

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
  let certs;

  let certsCache = await client.get('aps_certs');
  if (certsCache) {
    try {
      certsCache = JSON.parse(certsCache);
      certs = certsCache.map((cert) => ({
        ...cert,
        publicKey: forge.pki.publicKeyFromPem(cert.publicKey),
        privateKey: forge.pki.privateKeyFromPem(cert.privateKey),
        certificate: new crypto.X509Certificate(cert.certificate)
      }));
      return certs;
    } catch (err) {
      console.debug(err);
    }
  }

  if (!certs) {
    certs = {};
    for (const key of KEYS) {
      // <https://nodejs.org/api/crypto.html#cryptogeneratekeypairsynctype-options>
      // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 2048,
      //   hashAlgorithm: 'sha1WithRSAEncryption',
      //   publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      //   privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
      // });

      //
      // NOTE: we need to use this approach because `cert.sign` in `node-forge`
      //       looks for a `.sign` property in the passed arg, e.g. `cert.sign(key)` looks for `key.sign`
      //
      // generate a keypair or use one you have already
      const keys = forge.pki.rsa.generateKeyPair(2048);
      certs[key] = {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
        // privateKeyPEM: forge.pki.privateKeyToPem(keys.privateKey),
        // publicKeyPEM: forge.pki.publicKeyToPem(keys.publicKey)
      };
    }
  }

  const cache = await client.get('aps');
  if (cache) return parseResponse(cache, certs, true);

  // get a random signing cert from VENDOR_CERTS
  const vendorSigningCert = _.sample(VENDOR_CERTS);

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

  /*
  // rewrite xml output to use tabs instead of 2 spaces
  xml = splitLines(xml)
    .map(
      (str) =>
        str
          .replace(/^ {2}<dict>/g, '<dict>')
          .replace(/^ {2}<\/dict>/g, '</dict>')
          .replace(/^ {6}/g, '\t\t')
          .replace(/^ {4}/g, '\t')
          .replace(/ {2}/g, '\t')
      // .replace(/&#xD;/g, '')
    )
    .join('\n');
  */

  // each of these is base64 so we get <key> and <data>
  const bodyJson = {
    PushCertCertificateChain: vendorSigningCert.chain,
    PushCertRequestPlist: Buffer.from(xml),
    PushCertSignature: getSignatureFromXML(xml, vendorSigningCert),
    PushCertSignedRequest: true
  };
  const body = plist.build(bodyJson);

  /*
  const PushCertCertificateChain = wordwrap
    .wrap(vendorSigningCert.chain.toString('base64'), {
      width: 68,
      break: true,
      eol: '\n\t'
    })
    .replace(/\n\t$/, '');
  // TODO: this is off
  const PushCertRequestPlist = wordwrap
    .wrap(Buffer.from(xml).toString('base64'), {
      width: 68,
      break: true,
      eol: '\n\t'
    })
    .replace(/\n\t$/, '');
  // openssl sha1 -sign helpers/vendorcerts/01/key -keyform der | base64
  const PushCertSignature = wordwrap
    .wrap(getSignatureFromXML(xml, vendorSigningCert).toString('base64'), {
      width: 68,
      break: true,
      eol: '\n\t'
    })
    .replace(/\n\t$/, '');

  console.log('PUSH CERT SIGNATURE');
  console.log(PushCertSignature);

  // wordwrap to 68 + wrap with \n + '\t'
  let body =
    '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
  body += '<plist version="1.0">\n<dict>\n';
  body += '\t<key>PushCertCertificateChain</key>\n	<data>\n\t';
  body += PushCertCertificateChain;
  body += '\n\t</data>\n	<key>PushCertRequestPlist</key>\n	<data>\n\t';
  body += PushCertRequestPlist;
  body += '\n\t</data>\n	<key>PushCertSignature</key>\n	<data>\n\t';
  body += PushCertSignature;
  body += '\n\t</data>\n	<key>PushCertSignedRequest</key>\n	<true/>\n';
  body += '</dict>\n</plist>\n';
  */

  // NOTE: renew would be "https://identity.apple.com/pushcert/caservice/renew"

  //
  // due to HPE_INVALID_HEADER_TOKEN we must use `insecureHTTPParser: true`
  // <https://github.com/nodejs/undici/issues/2678>
  // <https://stackoverflow.com/a/72612851>
  //
  const curl = new Curl();
  // curl.setOpt('HTTP_VERSION', CurlHttpVersion['2']);
  curl.setOpt('URL', 'https://identity.apple.com/pushcert/caservice/new');
  // curl.setOpt('FOLLOWLOCATION', true);

  if (config.env !== 'production') curl.setOpt(Curl.option.VERBOSE, true);

  // curl.enable(CurlFeature.Raw);

  curl.setOpt(Curl.option.POST, true);

  curl.setOpt(Curl.option.HTTPHEADER, [
    'Content-Type: text/x-xml-plist',
    'Accept: */*',
    'Accept-Language: en-us'
  ]);

  curl.setOpt(
    'USERAGENT',
    'Servermgrd%20Plugin/6.0 CFNetwork/811.11 Darwin/16.7.0 (x86_64)'
  );

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

  // cache response body
  await client.set('aps_response', response.data);

  // parse response body
  return parseResponse(response.data, certs);
}

// <https://github.com/nodemailer/wildduck/issues/711>
async function sendApn(id) {
  const alias = await Aliases.findOne({
    id
  })
    .lean()
    .select('+aps')
    .exec();

  if (!alias || !Array.isArray(alias.aps) || alias.aps.length === 0) return;

  await pMapSeries(alias.aps, async (obj) => {
    try {
      const certs = await getCerts();

      const apns = new APNS({
        cert: certs.Mail.certificate.toString(),
        key: forge.pki.privateKeyToPem(certs.Mail.privateKey)
      });

      const notification = new APNS.Notification(obj.device_token, {
        topic: certs.Mail.topic,
        expiration: dayjs().add(1, 'day').toDate(),
        data: {
          'account-id': obj.account_id
        }
      });

      const result = await apns.send(notification);
      console.log('result', result);

      //
      // NOTE: it's not as simple as setting topic to `com.apple.mobilemail`
      // <https://lists.andrew.cmu.edu/pipermail/info-cyrus/2017-August/039743.html#:~:text=aps_topic%3A%20com.apple.mail.XServer.xxxxxxxxxxxxxxx%0A%0Aaps_topic%20is%20the%20common%20name%20take%20from%20the%20certificate.%20It%E2%80%99s%20sent%20to%20the%20mobile%20device%20so%20that%20it%20will%20match%20the%20source%20of%20the%20push%20notification%20when%20it%20arrives.>
      // note.topic = 'com.apple.mobilemail';
      //
      // instead, the topic is extracted from the common name of the certificate:
      //
      // note.topic = 'com.apple.mail.XServer.xxxxxxxxxxxxxxx';
      //
      // to extract the <UUID> portion we need to follow similar process to this
      // (but in a more automated way)
      // <https://github.com/jcvernaleo/macports-ports/blob/72f6ba4623151b6171ed2262af0bcaba88d3dd93/mail/dovecot/Portfile#L216-L247>
      //

      // note they have commented out code at this below link for setting priority in note
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L162-L163>

      // TODO: if device returns 410 then unsubscribe on our side too
      /*
      if (Array.isArray(result.failed) && result.failed.length > 0) {
        const err = new TypeError(`APS failed`);
        err.isCodeBug = true;
        err.result = result;
        console.fatal(err);

        const unregisteredDeviceTokens = result.failed
          .filter((r) => Number.parseInt(r.status, 10) === 410)
          .map((r) => r.device);

        if (unregisteredDeviceTokens.length === 0) return;

        // since there's only one device token
        if (
          unregisteredDeviceTokens.length !== 1 ||
          unregisteredDeviceTokens[0] !== obj.device_token
        )
          throw new TypeError(
            `Device token mismatch ${
              obj.device_token
            } vs. ${unregisteredDeviceTokens.join(', ')}`
          );

        const aliases = await Aliases.find({
          // unsure of likelihood of apple having two of the same device tokens
          // however we have a safeguard below to filter out for pair matches
          'aps.device_token': obj.device_token
        })
          .select('+aps')
          .lean()
          .exec();

        await pMap(
          aliases.map(async (alias) => {
            await Aliases.findByIdAndUpdate(alias._id, {
              $set: {
                aps: alias.aps.filter(
                  (a) =>
                    // filter for pair safeguard
                    a.account_id !== obj.account_id &&
                    a.device_token !== obj.device_token
                )
              }
            });
          }),
          { concurrency: config.concurrency }
        );
      }
      */
    } catch (err) {
      console.fatal(err, { obj });
    }
  });
}

module.exports = sendApn;
