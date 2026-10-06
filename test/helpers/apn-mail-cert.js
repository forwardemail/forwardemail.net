/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// iOS Mail push with the Apple-issued certificate for our own topic
// (APNS_MAIL_CERT_PATH, APNS_MAIL_KEY_PATH, APNS_MAIL_TOPIC).
//
// The certificates are generated here; pushes go over HTTP/2 to a local
// server standing in for api.push.apple.com.
//

const crypto = require('node:crypto');
const fs = require('node:fs');
const http2 = require('node:http2');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');

const Axe = require('axe');
const X509 = require('@peculiar/x509');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const env = require('#config/env');

X509.cryptoProvider.set(crypto);

const TOPIC = 'com.apple.mobilemail.push.net.example';
const ACCOUNT_ID = '0715A26B-CA09-4730-A419-793000CA982E';
const DAY = 24 * 60 * 60 * 1000;

const alg = {
  name: 'RSASSA-PKCS1-v1_5',
  hash: 'SHA-256',
  publicExponent: new Uint8Array([1, 0, 1]),
  modulusLength: 2048
};

const token = (i) => i.toString(16).padStart(64, '0');

function der(tag, value) {
  const length =
    value.length < 0x80
      ? Buffer.from([value.length])
      : value.length < 0x1_00
      ? Buffer.from([0x81, value.length])
      : Buffer.from([0x82, Math.floor(value.length / 256), value.length % 256]);
  return Buffer.concat([Buffer.from([tag]), length, value]);
}

const utf8 = (value) => der(0x0c, Buffer.from(value, 'utf8'));
const sequence = (...values) => der(0x30, Buffer.concat(values));

// Apple's topics extension: each topic followed by a SEQUENCE of options
function topicsExtension(topics) {
  return new X509.Extension(
    '1.2.840.113635.100.6.3.6',
    false,
    sequence(
      ...topics.flatMap(([topic, option]) => [
        utf8(topic),
        sequence(utf8(option))
      ])
    )
  );
}

const TOPICS = [
  [TOPIC, 'app'],
  [`${TOPIC}.voip`, 'voip'],
  [`${TOPIC}.complication`, 'complication']
];

async function createCert({ name, notBefore, notAfter, extensions = [] }) {
  const keys = await crypto.subtle.generateKey(alg, true, ['sign', 'verify']);
  const cert = await X509.X509CertificateGenerator.createSelfSigned({
    serialNumber: crypto.randomBytes(8).toString('hex'),
    name,
    notBefore: notBefore || new Date(Date.now() - DAY),
    notAfter: notAfter || new Date(Date.now() + 365 * DAY),
    signingAlgorithm: alg,
    keys,
    extensions
  });
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', keys.privateKey);
  return {
    certificate: cert.toString('pem'),
    privateKey: crypto
      .createPrivateKey({
        key: Buffer.from(pkcs8),
        format: 'der',
        type: 'pkcs8'
      })
      .export({ format: 'pem', type: 'pkcs8' })
  };
}

function writeFiles(dir, prefix, { certificate, privateKey }) {
  const certPath = path.join(dir, `${prefix}.pem`);
  const keyPath = path.join(dir, `${prefix}.key`);
  fs.writeFileSync(certPath, certificate);
  fs.writeFileSync(keyPath, privateKey);
  return { certPath, keyPath };
}

test.before(async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'apn-mail-cert-'));
  t.context.dir = dir;

  t.context.mail = writeFiles(
    dir,
    'mail',
    await createCert({
      name: `0.9.2342.19200300.100.1.1=${TOPIC}, CN=Apple Push Services: ${TOPIC}, C=US`,
      extensions: [topicsExtension(TOPICS)]
    })
  );

  t.context.other = writeFiles(
    dir,
    'other',
    await createCert({
      name: `0.9.2342.19200300.100.1.1=${TOPIC}, CN=Other, C=US`
    })
  );

  t.context.expired = writeFiles(
    dir,
    'expired',
    await createCert({
      name: `0.9.2342.19200300.100.1.1=${TOPIC}, CN=Expired, C=US`,
      notBefore: new Date(Date.now() - 400 * DAY),
      notAfter: new Date(Date.now() - DAY)
    })
  );

  // every test in this file runs with the Mail certificate configured
  env.APNS_MAIL_CERT_PATH = t.context.mail.certPath;
  env.APNS_MAIL_KEY_PATH = t.context.mail.keyPath;
  env.APNS_MAIL_TOPIC = TOPIC;
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

async function registrations(alias) {
  const { aps } = await Aliases.findById(alias._id)
    .select('+aps')
    .lean()
    .exec();
  return aps;
}

test('loads the certificate and takes the topic from its subject UID', (t) => {
  const { loadApnMailCert } = require('#helpers/get-apn-mail-cert');
  const { certPath, keyPath } = t.context.mail;

  const cert = loadApnMailCert({ certPath, keyPath, topic: '' });
  t.is(cert.topic, TOPIC);
  t.true(cert.certificate.includes('BEGIN CERTIFICATE'));
  t.true(cert.privateKey.includes('PRIVATE KEY'));

  // topics listed in the certificate's topics extension are accepted
  for (const [topic] of TOPICS)
    t.is(loadApnMailCert({ certPath, keyPath, topic }).topic, topic);

  // and nothing else, including DER tag and length bytes next to a topic
  for (const topic of [`${TOPIC}0`, `7${TOPIC}`, 'app', 'voip'])
    t.throws(() => loadApnMailCert({ certPath, keyPath, topic }), {
      message: /is not a topic of the APNs Mail certificate/
    });
});

test("reads the topics extension in Apple's nested layout", (t) => {
  const { parseTopicsExtension } = require('#helpers/get-apn-mail-cert');
  t.deepEqual(
    parseTopicsExtension(topicsExtension(TOPICS).value),
    TOPICS.map(([topic]) => topic)
  );
});

test('rejects a topic, key or validity that APNs would refuse', (t) => {
  const { loadApnMailCert } = require('#helpers/get-apn-mail-cert');
  const { mail, other, expired } = t.context;

  t.throws(
    () =>
      loadApnMailCert({
        certPath: mail.certPath,
        keyPath: mail.keyPath,
        topic: 'com.apple.mobilemail.push.net.elsewhere'
      }),
    { message: /is not a topic of the APNs Mail certificate/ }
  );

  t.throws(
    () =>
      loadApnMailCert({
        certPath: mail.certPath,
        keyPath: other.keyPath,
        topic: TOPIC
      }),
    { message: /does not hold the private key/ }
  );

  t.throws(
    () =>
      loadApnMailCert({
        certPath: expired.certPath,
        keyPath: expired.keyPath,
        topic: TOPIC
      }),
    { message: /expired/ }
  );

  t.is(loadApnMailCert({ certPath: '', keyPath: '' }), null);
});

test('XAPPLEPUSHSERVICE answers with the configured topic and stores the registration', async (t) => {
  const onXAPPLEPUSHSERVICE = require('#helpers/imap/on-xapplepushservice');
  const { alias } = t.context;
  const server = {
    logger: new Axe({ silent: true }),
    client: {},
    async refreshSession() {}
  };
  const session = { user: { alias_id: alias.id } };

  const reply = await new Promise((resolve) => {
    onXAPPLEPUSHSERVICE.call(
      server,
      ACCOUNT_ID,
      token(1),
      'com.apple.mobilemail',
      ['INBOX', 'Notes'],
      session,
      (err, topic) => resolve({ err, topic })
    );
  });

  t.is(reply.err, null);
  t.is(reply.topic, TOPIC);

  const aps = await registrations(alias);
  t.is(aps.length, 1);
  t.is(aps[0].account_id, ACCOUNT_ID);
  t.is(aps[0].device_token, token(1));
  t.is(aps[0].subtopic, 'com.apple.mobilemail');
  t.deepEqual(aps[0].mailboxes, ['INBOX', 'Notes']);
});

test('XAPPLEPUSHSERVICE refuses a malformed device token or account ID', async (t) => {
  const onXAPPLEPUSHSERVICE = require('#helpers/imap/on-xapplepushservice');
  const { alias } = t.context;
  const server = {
    logger: new Axe({ silent: true }),
    client: {},
    async refreshSession() {}
  };
  const session = { user: { alias_id: alias.id } };

  const call = (accountId, deviceToken) =>
    new Promise((resolve) => {
      onXAPPLEPUSHSERVICE.call(
        server,
        accountId,
        deviceToken,
        'com.apple.mobilemail',
        ['INBOX'],
        session,
        (err, topic) => resolve({ err, topic })
      );
    });

  const badToken = await call(ACCOUNT_ID, 'not-a-token');
  t.truthy(badToken.err);
  t.is(badToken.topic, undefined);

  const badAccount = await call('account\r\napns-topic: x', token(2));
  t.truthy(badAccount.err);
  t.is(badAccount.topic, undefined);

  t.deepEqual(await registrations(alias), []);
});

test('Mail pushes use the configured certificate and topic and handle token errors', async (t) => {
  const sendApn = require('#helpers/send-apn');
  const { providers } = sendApn._test;
  const { alias } = t.context;

  // three devices: delivered, registered under an older topic, bad token
  const ok = token(10);
  const notForTopic = token(11);
  const bad = token(12);
  await Aliases.updateOne(
    { _id: alias._id },
    {
      $set: {
        aps: [ok, notForTopic, bad].map((device_token) => ({
          account_id: ACCOUNT_ID,
          device_token,
          subtopic: 'com.apple.mobilemail',
          mailboxes: ['INBOX']
        }))
      }
    }
  );

  // local stand-in for api.push.apple.com
  const serverCert = await createCert({ name: 'CN=localhost' });
  const requests = [];
  const apns = http2.createSecureServer({
    key: serverCert.privateKey,
    cert: serverCert.certificate
  });
  apns.on('stream', (stream, headers) => {
    let body = '';
    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      body += chunk;
    });
    stream.on('end', () => {
      requests.push({ headers, body });
      const device = headers[':path'].split('/').pop();
      if (device === ok) {
        stream.respond({ ':status': 200 });
        stream.end();
        return;
      }

      stream.respond({
        ':status': 400,
        'content-type': 'application/json'
      });
      stream.end(
        JSON.stringify({
          reason: device === bad ? 'BadDeviceToken' : 'DeviceTokenNotForTopic'
        })
      );
    });
  });
  await new Promise((resolve) => {
    apns.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => apns.close());

  const store = new Map();
  const client = {
    async get(key) {
      return store.get(key) || null;
    },
    async set(key, value) {
      store.set(key, value);
      return 'OK';
    },
    async del(key) {
      store.delete(key);
      return 1;
    }
  };

  const pending = sendApn(client, alias.id, 'INBOX');

  // the provider is created before the coalescing delay; point its
  // connection at the local server (trusting the local certificate)
  const started = Date.now();
  while (!providers.Mail) {
    if (Date.now() - started > 5000) {
      t.fail('Mail provider was not created');
      return;
    }

    await new Promise((resolve) => {
      setImmediate(resolve);
    });
  }

  const provider = providers.Mail;
  t.true(
    provider.cert.includes(
      fs.readFileSync(t.context.mail.certPath, 'utf8').trim()
    )
  );
  provider.host = `127.0.0.1:${apns.address().port}`;
  const { connect } = provider;
  provider.connect = async function () {
    if (this.client && !this.client.closed && !this.client.destroyed)
      return this.client;
    this.client = http2.connect(`https://${this.host}`, {
      ca: serverCert.certificate,
      servername: 'localhost'
    });
    await new Promise((resolve, reject) => {
      this.client.once('connect', resolve);
      this.client.once('error', reject);
    });
    return this.client;
  };

  t.teardown(() => {
    provider.connect = connect;
    if (provider.client) provider.client.close();
  });

  await pending;

  t.is(requests.length, 3);
  for (const { headers, body } of requests) {
    t.is(headers['apns-topic'], TOPIC);
    t.is(headers['apns-push-type'], 'background');
    // no apns-priority, as in dovecot-xaps-daemon
    t.is(headers['apns-priority'], undefined);
    t.deepEqual(JSON.parse(body), {
      aps: {
        'account-id': ACCOUNT_ID,
        m: [crypto.createHash('md5').update('INBOX').digest('hex')]
      }
    });
  }

  // BadDeviceToken is removed; DeviceTokenNotForTopic is kept until the
  // device registers again with the new topic
  const aps = await registrations(alias);
  const remaining = aps.map((a) => a.device_token);
  t.deepEqual(remaining.sort(), [ok, notForTopic].sort());
});
