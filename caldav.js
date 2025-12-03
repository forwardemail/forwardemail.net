/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// const crypto = require('node:crypto');
// const fs = require('node:fs');
// const os = require('node:os');
// const path = require('node:path');
const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
// const X509 = require('@peculiar/x509');
// const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
// const isCI = require('is-ci');
const mongoose = require('mongoose');

const CalDAV = require('./caldav-server');
const Users = require('#models/users');
const calDAVConfig = require('#config/caldav');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

(async () => {
  try {
    const wsp = createWebSocketAsPromised();

    //
    // NOTE: Apple does not send BasicAuth headers on HTTP non-TLS requests
    //       (therefore local development *REQUIRES* https with self-signed cert)
    //
    // <https://github.com/jshttp/basic-auth/blob/8117cc22d2deecb6bd62c42815f3286de06c8aa4/index.js#L107-L112>
    // <https://github.com/jobisoft/DAV-4-TbSync/issues/106#:~:text=org/dav/addressbooks/-,it%20returns,-HTTP/2%20207>
    // <https://stackoverflow.com/a/58022970>
    // <https://github.com/cyrusimap/cyrus-imapd/issues/2634#:~:text=I%20saw%20that%20that%20there%20is%20a%20change%20since%20iOS%2015%20that%20the%20credentials%20are%20not%20sent%20without%20TLS%20w/%20HTTP%20for%20security%20reason>
    // <https://github.com/jobisoft/DAV-4-TbSync/issues/106#:~:text=org/dav/addressbooks/-,it%20returns,-HTTP/2%20207>
    // <https://github.com/owncloud/core/issues/14510#issuecomment-82304870>
    // <https://datatracker.ietf.org/doc/rfc8144/#:~:text=2.1.%20%20Minimal%20PROPFIND,in%20its%20place%3A>
    //
    /*
    if (!calDAVConfig.ssl) {
      // <https://github.com/PeculiarVentures/x509/blob/master/README.md#create-a-self-signed-certificate>
      const alg = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        publicExponent: new Uint8Array([1, 0, 1]),
        modulusLength: 2048
      };
      const keys = await crypto.subtle.generateKey(alg, false, [
        'sign',
        'verify'
      ]);
      const cert = await X509.X509CertificateGenerator.createSelfSigned({
        serialNumber: '01',
        name: 'CN=localhost.dev',
        notBefore: dayjs().startOf('day').toDate(),
        notAfter: dayjs().startOf('day').add(1, 'year').toDate(),
        signingAlgorithm: alg,
        keys,
        extensions: [
          new X509.BasicConstraintsExtension(true, 2, true),
          new X509.ExtendedKeyUsageExtension(
            ['1.2.3.4.5.6.7', '2.3.4.5.6.7.8'],
            true
          ),
          new X509.KeyUsagesExtension(
            //
            // NOTE: these flags are required to be set in order for HTTPS to work in browser
            //
            // <https://support.google.com/chrome/thread/239508594/err-ssl-key-usage-incompatible-error-in-chrome-but-not-edge-for-all-google-sites-and-some-others?hl=en#:~:text=the%20solution%20is%20to%20create%20a%20new%20self%20signed%20certificate%20that%20has%20or%0Ais%20created%20with%20key%20usage%3A%C2%A0%20%22Digital%20Signature%2C%20Certificate%20Signing%2C%20Off%2Dline%20CRL%20Signing%2C%20CRL%20Signing%20(86)%22>
            //
            // > "Digital Signature, Certificate Signing, Off-line CRL Signing, CRL Signing (86)"
            //
            // > X509.KeyUsageFlags
            // {
            //   '1': 'digitalSignature',
            //   '2': 'nonRepudiation',
            //   '4': 'keyEncipherment',
            //   '8': 'dataEncipherment',
            //   '16': 'keyAgreement',
            //   '32': 'keyCertSign',
            //   '64': 'cRLSign',
            //   '128': 'encipherOnly',
            //   '256': 'decipherOnly',
            //   digitalSignature: 1,
            //   nonRepudiation: 2,
            //   keyEncipherment: 4,
            //   dataEncipherment: 8,
            //   keyAgreement: 16,
            //   keyCertSign: 32,
            //   cRLSign: 64,
            //   encipherOnly: 128,
            //   decipherOnly: 256
            // }
            //
            // eslint-disable-next-line no-bitwise
            X509.KeyUsageFlags.digitalSignature |
              X509.KeyUsageFlags.keyCertSign |
              X509.KeyUsageFlags.cRLSign,
            true
          ),
          await X509.SubjectKeyIdentifierExtension.create(keys.publicKey)
        ]
      });

      calDAVConfig.protocol = 'https';
      calDAVConfig.ssl = {
        key: crypto.KeyObject.from(keys.privateKey)
          .export({ format: 'pem', type: 'pkcs1' })
          .toString(),
        cert: cert.toString('pem')
      };

      // detect if macOS and alert via toast notification
      if (os.platform() === 'darwin' && !isCI) {
        // write to tmp file the certificate
        const certPath = path.join(os.tmpdir(), 'fe-caldav-certificate.pem');
        await fs.promises.writeFile(certPath, calDAVConfig.ssl.cert);
        console.log(
          '1. Ensure you add "127.0.0.1 localhost.dev" as a line to /etc/hosts file.'
        );
        console.log('2. Run the following command:');
        console.log(
          `sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" "${certPath}"`
        );
        //
        // NOTE: even this still doesn't seem to work in macOS...
        //       therefore we simply use tools like `ngrok` for local testing with macOS CalDAV
      }
    }
    */

    const calDAV = new CalDAV(
      {
        ...calDAVConfig,
        wsp
      },
      Users
    );
    const graceful = new Graceful({
      mongooses: [mongoose],
      servers: [calDAV.server],
      redisClients: [calDAV.client],
      logger,
      customHandlers: [
        // <https://github.com/vitalets/websocket-as-promised#wspclosecode-reason--promiseevent>
        () => {
          try {
            wsp.close();
          } catch (err) {
            logger.fatal(err);
          }
        }
      ]
    });
    graceful.listen();
    await calDAV.listen(calDAV.config.port);
    if (process.send) process.send('ready');
    const { port } = calDAV.server.address();
    logger.info(
      `CalDAV server listening on ${port} (LAN: ${
        calDAV.config.protocol
      }://${ip.address()}:${port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
