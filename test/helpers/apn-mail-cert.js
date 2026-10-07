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

const mongoose = require('mongoose');
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

//
// Local stand-in for api.push.apple.com shared by the push tests.  Each
// test sets the response for its own device tokens (optionally per topic);
// `hang` never answers.  Push tests run serially since they share it and
// the send-apn timeouts, endpoint and XServer certificates.
//
const responses = new Map();
const requests = [];
let apns;
let serverCert;
let xserverBundle = null;

test.before(async () => {
  serverCert = await createCert({ name: 'CN=localhost' });
  apns = http2.createSecureServer({
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
      const device = headers[':path'].split('/').pop();
      const topic = headers['apns-topic'];
      requests.push({ device, topic, headers, body });
      const response = responses.get(`${device}|${topic}`) ||
        responses.get(device) || { status: 200 };
      if (response.hang) return;
      stream.respond({
        ':status': response.status,
        'apns-id': `apns-id-${requests.length}`,
        'content-type': 'application/json'
      });
      const { status, ...json } = response;
      stream.end(Object.keys(json).length > 0 ? JSON.stringify(json) : '');
    });
  });
  await new Promise((resolve) => {
    apns.listen(0, '127.0.0.1', resolve);
  });

  const { ORIGIN, TIMEOUTS, deps } = require('#helpers/send-apn')._test;
  ORIGIN.host = `127.0.0.1:${apns.address().port}`;
  ORIGIN.tls = { ca: serverCert.certificate, servername: 'localhost' };
  TIMEOUTS.coalesce = 300;
  TIMEOUTS.connect = 1000;
  TIMEOUTS.request = 1000;
  // XServer certificates come from Apple in production; tests supply them
  deps.getApnCerts = async () => xserverBundle;
});

// replace the XServer certificate bundle (null: none available); the same
// UUID is used for the Mail and Calendar topics, as Apple issues them
async function useXServer(uuid) {
  const xserverCert = (service) =>
    createCert({
      name: `0.9.2342.19200300.100.1.1=com.apple.${service}.XServer.${uuid}, CN=APSP:${uuid}, C=US`
    });
  xserverBundle = uuid
    ? {
        Mail: await xserverCert('mail'),
        Calendar: await xserverCert('calendar')
      }
    : null;
  require('#helpers/send-apn')._test.resetCerts();
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  fs.rmSync(t.context.dir, { recursive: true, force: true });
});
test.after.always(() => {
  const { providers } = require('#helpers/send-apn')._test;
  for (const provider of Object.values(providers))
    if (provider.client) provider.client.destroy();
  if (apns) apns.close();
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

test('XAPPLEPUSHSERVICE answers with the configured topic and replaces older registrations', async (t) => {
  const onXAPPLEPUSHSERVICE = require('#helpers/imap/on-xapplepushservice');
  const { alias } = t.context;
  const server = {
    logger: new Axe({ silent: true }),
    client: {},
    async refreshSession() {}
  };
  const session = { user: { alias_id: alias.id } };

  // a Mail registration stored before subtopics were recorded
  await Aliases.updateOne(
    { _id: alias._id },
    {
      $set: {
        aps: [
          {
            account_id: '11111111-1111-4111-8111-111111111111',
            device_token: token(1).toUpperCase(),
            mailboxes: ['INBOX']
          }
        ]
      }
    }
  );

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
  // the topic the device was given, so pushes go out on it
  t.is(aps[0].topic, TOPIC);
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

// in-memory Redis with the PX / NX / PTTL semantics send-apn relies on
function createRedis() {
  const store = new Map();
  const alive = (key) => {
    const entry = store.get(key);
    if (!entry) return null;
    if (entry.expires && entry.expires <= Date.now()) {
      store.delete(key);
      return null;
    }

    return entry;
  };

  return {
    async get(key) {
      return alive(key)?.value ?? null;
    },
    async set(key, value, ...args) {
      if (args.includes('NX') && alive(key)) return null;
      const px = args.indexOf('PX');
      store.set(key, {
        value,
        expires: px === -1 ? 0 : Date.now() + Number(args[px + 1])
      });
      return 'OK';
    },
    async del(key) {
      store.delete(key);
      return 1;
    },
    async pttl(key) {
      const entry = alive(key);
      if (!entry) return -2;
      return entry.expires ? entry.expires - Date.now() : -1;
    }
  };
}

async function setRegistrations(alias, rows) {
  await Aliases.updateOne(
    { _id: alias._id },
    {
      $set: {
        aps: rows.map((row) => ({
          account_id: ACCOUNT_ID,
          subtopic: 'com.apple.mobilemail',
          mailboxes: ['INBOX'],
          ...row
        }))
      }
    }
  );
}

const requestsFor = (device) => requests.filter((r) => r.device === device);

test.serial(
  'Mail pushes use the configured certificate and topic and handle token errors',
  async (t) => {
    const sendApn = require('#helpers/send-apn');
    const { providers } = sendApn._test;
    const { alias } = t.context;
    await useXServer(null);

    // three devices: delivered, registered under an older topic, bad token
    const ok = token(10);
    const notForTopic = token(11);
    const bad = token(12);
    responses.set(notForTopic, {
      status: 400,
      reason: 'DeviceTokenNotForTopic'
    });
    responses.set(bad, { status: 400, reason: 'BadDeviceToken' });
    await setRegistrations(
      alias,
      [ok, notForTopic, bad].map((device_token) => ({
        device_token,
        topic: TOPIC
      }))
    );

    await sendApn(createRedis(), alias.id, 'INBOX');

    t.true(
      providers.Mail.cert.includes(
        fs.readFileSync(t.context.mail.certPath, 'utf8').trim()
      )
    );

    for (const device of [ok, notForTopic, bad]) {
      const sent = requestsFor(device);
      t.is(sent.length, 1);
      const { headers, body } = sent[0];
      t.is(headers['apns-topic'], TOPIC);
      t.is(headers['apns-push-type'], 'background');
      // no apns-priority, as in dovecot-xaps-daemon
      t.is(headers['apns-priority'], undefined);
      // only the account ID, as in dovecot-xaps-daemon and WildDuck
      t.deepEqual(JSON.parse(body), { aps: { 'account-id': ACCOUNT_ID } });
    }

    // BadDeviceToken is removed; DeviceTokenNotForTopic is kept until the
    // device registers again with the new topic
    const aps = await registrations(alias);
    const remaining = aps.map((a) => a.device_token);
    t.deepEqual(remaining.sort(), [ok, notForTopic].sort());
  }
);

test.serial(
  'Mail pushes go out only on the Apple-issued topic, never on XServer',
  async (t) => {
    const sendApn = require('#helpers/send-apn');
    const getApnTopic = require('#helpers/get-apn-topic');
    const { alias } = t.context;
    const uuid = '11111111-2222-4333-8444-555555555555';
    const XSERVER = `com.apple.mail.XServer.${uuid}`;
    // XServer certificates are available (Calendar and Contacts use them)
    await useXServer(uuid);

    // the IMAP server only ever gives devices the Apple-issued topic
    t.is(await getApnTopic({}, 'Mail'), TOPIC);

    const onOurs = token(50);
    const onXServer = token(51);
    const legacy = token(52);
    await setRegistrations(alias, [
      { device_token: onOurs, topic: TOPIC },
      // registered on the XServer topic: skipped until it registers again
      { device_token: onXServer, topic: XSERVER },
      // registered before topics were stored
      { device_token: legacy }
    ]);

    await sendApn(createRedis(), alias.id, 'INBOX');

    const topics = (device) => requestsFor(device).map((r) => r.topic);
    t.deepEqual(topics(onOurs), [TOPIC]);
    t.deepEqual(topics(onXServer), []);
    t.deepEqual(topics(legacy), [TOPIC]);
    t.false(requests.some((r) => r.topic === XSERVER));

    await useXServer(null);
  }
);

test.serial(
  'a renewed XServer certificate is used for Calendar without a restart',
  async (t) => {
    const { sendApnCalendar, _test } = require('#helpers/send-apn');
    const { providers } = _test;
    const { alias } = t.context;
    const first = 'aaaaaaaa-0000-4000-8000-000000000001';
    const renewed = 'aaaaaaaa-0000-4000-8000-000000000002';
    const device = token(60);
    await setRegistrations(alias, [
      {
        device_token: device,
        subtopic: 'com.apple.mobilecal',
        key: 'calendar-1',
        mailboxes: []
      }
    ]);

    await useXServer(first);
    await sendApnCalendar(createRedis(), alias.id);
    const before = providers['Calendar:XServer'];

    await useXServer(renewed);
    await sendApnCalendar(createRedis(), alias.id);

    t.deepEqual(
      requestsFor(device).map((r) => r.topic),
      [
        `com.apple.calendar.XServer.${first}`,
        `com.apple.calendar.XServer.${renewed}`
      ]
    );
    t.not(providers['Calendar:XServer'], before);
    t.is(
      providers['Calendar:XServer'].cert,
      xserverBundle.Calendar.certificate
    );

    await useXServer(null);
  }
);

test.serial(
  'an unanswered push is retried on a new connection and does not hold up others',
  async (t) => {
    const sendApn = require('#helpers/send-apn');
    const { alias } = t.context;
    await useXServer(null);

    const hung = token(70);
    const fine = token(71);
    responses.set(hung, { hang: true });
    await setRegistrations(alias, [
      { device_token: hung, topic: TOPIC },
      { device_token: fine, topic: TOPIC }
    ]);

    const started = Date.now();
    await sendApn(createRedis(), alias.id, 'INBOX');

    // one try and one retry, each given up after TIMEOUTS.request
    t.is(requestsFor(hung).length, 2);
    t.is(requestsFor(fine).length, 1);
    t.true(Date.now() - started < 5000);
    // not refused by APNs, so the registration stays
    {
      const aps = await registrations(alias);
      t.is(aps.length, 2);
    }

    // the next push works on a new connection
    responses.delete(hung);
    await sendApn(createRedis(), alias.id, 'INBOX');
    t.is(requestsFor(hung).length, 3);
  }
);

test.serial(
  'a connection that never opens gives up after the connect timeout',
  async (t) => {
    const net = require('node:net');
    const sendApn = require('#helpers/send-apn');
    const { ORIGIN, providers } = sendApn._test;
    const { alias } = t.context;
    await useXServer(null);

    // accepts TCP and never answers the TLS handshake
    const sockets = new Set();
    const blackhole = net.createServer((socket) => {
      sockets.add(socket);
    });
    await new Promise((resolve) => {
      blackhole.listen(0, '127.0.0.1', resolve);
    });

    const { host } = ORIGIN;
    if (providers.Mail?.client) providers.Mail.client.destroy();
    ORIGIN.host = `127.0.0.1:${blackhole.address().port}`;
    t.teardown(() => {
      ORIGIN.host = host;
      for (const socket of sockets) socket.destroy();
      blackhole.close();
    });

    const device = token(80);
    await setRegistrations(alias, [{ device_token: device, topic: TOPIC }]);

    const started = Date.now();
    await sendApn(createRedis(), alias.id, 'INBOX');
    t.true(Date.now() - started < 5000);
    t.is(requestsFor(device).length, 0);
    {
      const aps = await registrations(alias);
      t.is(aps.length, 1);
    }
  }
);

test.serial(
  'a 410 removes only registrations older than the time APNs gives',
  async (t) => {
    const sendApn = require('#helpers/send-apn');
    const { alias } = t.context;
    await useXServer(null);

    const now = Date.now();
    const gone = token(90);
    const registeredAgain = token(91);
    responses.set(gone, {
      status: 410,
      reason: 'Unregistered',
      timestamp: now
    });
    responses.set(registeredAgain, {
      status: 410,
      reason: 'Unregistered',
      timestamp: now - 60_000
    });
    // written with the driver: Mongoose would set updated_at to now
    const row = (deviceToken, updatedAt) => ({
      _id: new mongoose.Types.ObjectId(),
      account_id: ACCOUNT_ID,
      device_token: deviceToken,
      subtopic: 'com.apple.mobilemail',
      mailboxes: ['INBOX'],
      topic: TOPIC,
      created_at: updatedAt,
      updated_at: updatedAt
    });
    await Aliases.collection.updateOne(
      { _id: alias._id },
      {
        $set: {
          aps: [
            // registered an hour before APNs saw the token become invalid
            row(gone, new Date(now - 3_600_000)),
            // registered again after that
            row(registeredAgain, new Date(now))
          ]
        }
      }
    );

    await sendApn(createRedis(), alias.id, 'INBOX');

    const aps = await registrations(alias);
    t.deepEqual(
      aps.map((a) => a.device_token),
      [registeredAgain]
    );
  }
);

test.serial(
  'changes within the window share one push and later mail still gets its own',
  async (t) => {
    const sendApn = require('#helpers/send-apn');
    const { alias } = t.context;
    await useXServer(null);
    const device = token(20);
    await setRegistrations(alias, [
      { device_token: device, topic: TOPIC, mailboxes: ['INBOX', 'Drafts'] }
    ]);
    const redis = createRedis();

    // a draft save, then new mail a moment later: one push covers both
    const first = sendApn(redis, alias.id, 'Drafts');
    await sendApn(redis, alias.id, 'INBOX');
    await first;
    t.is(requestsFor(device).length, 1);

    // new mail right after that push must still be pushed
    await sendApn(redis, alias.id, 'INBOX');
    t.is(requestsFor(device).length, 2);
  }
);

test.serial(
  'only subscribed mailboxes are pushed and INBOX matches in any case',
  async (t) => {
    const sendApn = require('#helpers/send-apn');
    const { alias } = t.context;
    await useXServer(null);
    const device = token(30);
    await setRegistrations(alias, [
      { device_token: device, topic: TOPIC, mailboxes: ['Inbox', 'Notes'] }
    ]);
    const redis = createRedis();

    await sendApn(redis, alias.id, 'Sent Messages');
    t.is(requestsFor(device).length, 0);

    await sendApn(redis, alias.id, 'INBOX');
    t.is(requestsFor(device).length, 1);
  }
);

test.serial(
  'APNS_DEBUG prints every step of a push without certificates or keys',
  async (t) => {
    const sendApn = require('#helpers/send-apn');
    const { maskToken } = require('#helpers/apns-debug');
    const { alias } = t.context;
    await useXServer(null);
    const device = token(40);
    await setRegistrations(alias, [{ device_token: device, topic: TOPIC }]);

    const lines = [];
    const { log } = console;
    console.log = (...args) => {
      lines.push(args.join(' '));
    };

    env.APNS_DEBUG = true;
    try {
      await sendApn(createRedis(), alias.id, 'INBOX');
    } finally {
      env.APNS_DEBUG = false;
      console.log = log;
    }

    const mine = lines.filter((line) => line.includes(maskToken(device)));
    t.true(mine.some((line) => line.startsWith('[APNs] queued')));
    t.true(
      mine.some(
        (line) => line.startsWith('[APNs] sending') && line.includes(TOPIC)
      )
    );
    t.true(
      mine.some(
        (line) => line.startsWith('[APNs] sent') && line.includes('apns-id-')
      )
    );
    t.false(lines.some((line) => line.includes(device)));
    t.false(lines.some((line) => /PRIVATE KEY|BEGIN CERTIFICATE/.test(line)));
  }
);
