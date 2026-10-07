/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Push registrations made in a loop (IMAP XAPPLEPUSHSERVICE, DAV `/apns`)
// keep only the newest ones, so they can neither grow the alias document
// without limit nor fan every new message out to that many pushes.
//

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');

const Axe = require('axe');
const X509 = require('@peculiar/x509');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const env = require('#config/env');
const davApnsSubscribe = require('#helpers/dav-apns-subscribe');
const onXAPPLEPUSHSERVICE = require('#helpers/imap/on-xapplepushservice');
const { MAX_APS_REGISTRATIONS } = require('#helpers/push-aps-registration');

//
// A registration is refused when there is no topic to give the device, so
// IMAP registrations need a Mail push certificate; a self-signed one does.
//
test.before(async (t) => {
  X509.cryptoProvider.set(crypto);
  const alg = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength: 2048
  };
  const keys = await crypto.subtle.generateKey(alg, true, ['sign', 'verify']);
  const cert = await X509.X509CertificateGenerator.createSelfSigned({
    serialNumber: '01',
    name: '0.9.2342.19200300.100.1.1=com.apple.mobilemail.push.net.example, CN=test',
    notBefore: new Date(Date.now() - 86_400_000),
    notAfter: new Date(Date.now() + 86_400_000),
    signingAlgorithm: alg,
    keys
  });
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

  t.context.dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aps-limit-'));
  env.APNS_MAIL_CERT_PATH = path.join(t.context.dir, 'apns-mail.pem');
  env.APNS_MAIL_KEY_PATH = path.join(t.context.dir, 'apns-mail.key');
  fs.writeFileSync(env.APNS_MAIL_CERT_PATH, cert.toString('pem'));
  fs.writeFileSync(
    env.APNS_MAIL_KEY_PATH,
    crypto
      .createPrivateKey({
        key: Buffer.from(pkcs8),
        format: 'der',
        type: 'pkcs8'
      })
      .export({ format: 'pem', type: 'pkcs8' })
  );
});

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  fs.rmSync(t.context.dir, { recursive: true, force: true });
});
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const user = await t.context.userFactory.create();
  const domain = await t.context.domainFactory
    .withState({ members: [{ user: user._id, group: 'admin' }] })
    .create();
  t.context.alias = await t.context.aliasFactory
    .withState({ user: user._id, domain: domain._id, recipients: [user.email] })
    .create();
});

const token = (i) => i.toString(16).padStart(64, '0');
const accountId = (i) =>
  `00000000-0000-4000-8000-${i.toString(16).padStart(12, '0')}`;

async function registrations(alias) {
  const { aps } = await Aliases.findById(alias._id)
    .select('+aps')
    .lean()
    .exec();
  return aps;
}

test('DAV registrations keep only the newest', async (t) => {
  const { alias } = t.context;
  const total = MAX_APS_REGISTRATIONS + 50;
  for (let i = 0; i < total; i++) {
    const ctx = {
      request: { body: { token: token(i), key: `key-${i}` } },
      query: {},
      host: 'caldav.example.com',
      state: { session: { user: { alias_id: alias.id } } },
      set() {}
    };
    await davApnsSubscribe(ctx);
    t.is(ctx.status, 200);
  }

  const aps = await registrations(alias);
  t.is(aps.length, MAX_APS_REGISTRATIONS);
  t.is(aps.at(-1).key, `key-${total - 1}`);
  t.is(aps[0].key, `key-${total - MAX_APS_REGISTRATIONS}`);
});

test('IMAP registrations keep only the newest', async (t) => {
  const { alias } = t.context;
  const server = {
    logger: new Axe({ silent: true }),
    async refreshSession() {}
  };
  const session = { user: { alias_id: alias.id } };
  const total = MAX_APS_REGISTRATIONS + 50;
  for (let i = 0; i < total; i++) {
    await new Promise((resolve) => {
      onXAPPLEPUSHSERVICE.call(
        server,
        accountId(i),
        token(i),
        'com.apple.mobilemail',
        ['INBOX'],
        session,
        resolve
      );
    });
  }

  const aps = await registrations(alias);
  t.is(aps.length, MAX_APS_REGISTRATIONS);
  t.is(aps.at(-1).device_token, token(total - 1));
});
