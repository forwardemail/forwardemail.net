/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The certificate signing requests for the APNs certificates (calendar,
// contacts, mail and alerts) are made from keys of `crypto.subtle`, whatever
// crypto the S/MIME helpers set `@peculiar/x509` to use.
//

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const X509 = require('@peculiar/x509');
const test = require('ava');

const getApnCerts = require('#helpers/get-apn-certs');

// (as in the API server: an S/MIME helper is loaded after the APNs ones)
// eslint-disable-next-line import/no-unassigned-import
require('#helpers/get-cert-info');

const alg = {
  name: 'RSASSA-PKCS1-v1_5',
  hash: 'SHA-1',
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1])
};

test('the global x509 crypto is not the one the keys are from', (t) => {
  t.not(X509.cryptoProvider.get(), crypto);
});

for (const [key, commonName] of [
  ['Calendar', 'com.apple.servermgrd.apns.calendar'],
  ['Contact', 'com.apple.servermgrd.apns.contact'],
  ['Mail', 'com.apple.servermgrd.apns.mail'],
  ['Mgmt', 'com.apple.servermgrd.apns.mgmt'],
  ['Alerts', 'com.apple.server.apns.alerts']
]) {
  test(`creates a signed request for ${key}`, async (t) => {
    // (as in getApnCerts)
    const certs = {
      [key]: await crypto.subtle.generateKey(alg, true, ['sign', 'verify'])
    };

    const csr = new X509.Pkcs10CertificateRequest(
      await getApnCerts.createCsrs(certs, key)
    );
    t.is(csr.subject, `CN=${commonName}`);
    t.true(await csr.verify(crypto));

    // (the request is for the key it is made from)
    const publicKey = await csr.publicKey.export(alg, ['verify'], crypto);
    t.deepEqual(
      Buffer.from(await crypto.subtle.exportKey('spki', publicKey)),
      Buffer.from(await crypto.subtle.exportKey('spki', certs[key].publicKey))
    );
  });
}
