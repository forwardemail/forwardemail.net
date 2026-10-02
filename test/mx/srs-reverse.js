/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Mail to an SRS address on our domain reverses to the original sender
// elsewhere and is relayed there, but only in reply to a message we
// forwarded or sent with that SRS address (a few replies per destination),
// so a signed SRS address cannot be used to relay any number of messages.
//

const net = require('node:net');
const util = require('node:util');
const { randomUUID } = require('node:crypto');
const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { SRS } = require('sender-rewriting-scheme');

const utils = require('../utils');
const MX = require('../../mx-server');

const _ = require('#helpers/lodash');
const config = require('#config');
const env = require('#config/env');
const checkSRS = require('#helpers/check-srs');
const createTangerine = require('#helpers/create-tangerine');
const getFingerprint = require('#helpers/get-fingerprint');
const getFingerprintKey = require('#helpers/get-fingerprint-key');
const getGreylistKey = require('#helpers/get-greylist-key');
const getRecipients = require('#helpers/get-recipients');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const { Emails } = require('#models');
const {
  grantSrsReverse,
  grantSrsReverseOnce,
  hasSrsReverse,
  restoreSrsReverses,
  spendSrsReverse
} = require('#helpers/srs-reverse');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const srs = new SRS(config.srs);
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

//
// A sender on a domain that does not use our service, with its DNS records
// spoofed: a domain of its own (so DMARC never falls back to a real
// organizational domain) and not under WEB_HOST (example.com in CI, so a
// sender under it would be blocked as impersonating us).
//
function createSender(resolver, map) {
  const sender = `victim@srs-sender-${randomUUID()}.com`;
  const senderDomain = sender.split('@')[1];
  map.set(
    `txt:${senderDomain}`,
    resolver.spoofPacket(senderDomain, 'TXT', ['v=spf1 ?all'], true)
  );
  map.set(
    `mx:${senderDomain}`,
    resolver.spoofPacket(
      senderDomain,
      'MX',
      [{ exchange: `mx.${senderDomain}`, priority: 0 }],
      true
    )
  );
  map.set(
    `txt:_dmarc.${senderDomain}`,
    resolver.spoofPacket(`_dmarc.${senderDomain}`, 'TXT', [], true)
  );
  return sender;
}

// send a message to the MX on a new connection
async function sendToMx(mx, envelope, raw) {
  const connection = await asyncMxConnect({
    target: IP_ADDRESS,
    port: mx.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(mx.resolver.resolve.bind(mx.resolver))
    }
  });
  return nodemailer
    .createTransport({
      logger,
      host: connection.host,
      port: connection.port,
      connection: connection.socket,
      ignoreTLS: true,
      secure: false,
      tls
    })
    .sendMail({ envelope, raw });
}

// how `helpers/on-data` passes an SRS recipient on after reversing it
function resolve(mx, srsAddress, session = {}) {
  session.envelope = {
    mailFrom: { address: '' },
    rcptTo: [
      {
        address: checkSRS(srsAddress),
        srs: true,
        srsAddress
      }
    ]
  };
  return getRecipients.call(mx, session);
}

test('relays to an SRS address only in reply to a forwarded message', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = mx;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  await mx.listen(await getPort());
  t.teardown(() => mx.close());

  // where the alias forwards to
  const received = [];
  const serverPort = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onData(stream, session, fn) {
      const chunks = [];
      stream.pipe(
        new Writable({
          write(chunk, encoding, fn) {
            chunks.push(chunk);
            fn();
          }
        })
      );
      stream.on('end', () => {
        received.push({
          from: session.envelope.mailFrom.address,
          data: Buffer.concat(chunks).toString()
        });
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(server.listen.bind(server))(serverPort);
  t.teardown(() => server.close());

  const user = await t.context.userFactory.withState({ plan: 'free' }).create();
  const domain = await t.context.domainFactory
    .withState({
      name: `${falso.randWord()}.${_.sample(config.goodDomains)}`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver
    })
    .create();

  const map = new Map();
  // the sender's domain does not use our service
  const sender = createSender(resolver, map);
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`forward-email-port=${serverPort}`, `forward-email=test@${IP_ADDRESS}`],
      true,
      ms('5m')
    )
  );
  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const srsAddress = srs.forward(sender, env.WEB_HOST);

  // nothing was forwarded with this SRS address yet
  // (so it is rejected like any address on a domain without our records)
  let err = await t.throwsAsync(resolve(mx, srsAddress));
  t.true(err.notConfigured);

  // a message from the sender is forwarded with that SRS address
  const connection = await asyncMxConnect({
    target: IP_ADDRESS,
    port: mx.server.address().port,
    dnsOptions: { resolve: util.callbackify(resolver.resolve.bind(resolver)) }
  });
  await nodemailer
    .createTransport({
      logger,
      host: connection.host,
      port: connection.port,
      connection: connection.socket,
      ignoreTLS: true,
      secure: false,
      tls
    })
    .sendMail({
      envelope: { from: sender, to: `hello@${domain.name}` },
      raw: `
To: hello@${domain.name}
From: ${sender}
Message-ID: <hello@${sender.split('@')[1]}>
Subject: hello
Content-Type: text/plain; charset=us-ascii

Hello.`.trim()
    });
  await pWaitFor(() => received.length === 1, { timeout: ms('15s') });
  t.is(received[0].from.toLowerCase(), srsAddress.toLowerCase());

  // the same message again (e.g. a retry) is not forwarded twice, and does
  // not grant more reverse deliveries
  await sendToMx(
    mx,
    { from: sender, to: `hello@${domain.name}` },
    `
To: hello@${domain.name}
From: ${sender}
Message-ID: <hello@${sender.split('@')[1]}>
Subject: hello
Content-Type: text/plain; charset=us-ascii

Hello.`.trim()
  );
  t.is(received.length, 1);
  t.is(
    await t.context.client.get(`srs_reverse:${srsAddress.toLowerCase()}`),
    String(config.srsReverseRepliesPerDestination)
  );

  // so a few replies to it (e.g. a delay notice, the bounce and an
  // auto-reply) are relayed to the sender
  // (also when a server sends to the SRS address in lowercase)
  for (let i = 0; i < config.srsReverseRepliesPerDestination; i++) {
    const data = await resolve(
      mx,
      i === 0 ? srsAddress.toLowerCase() : srsAddress
    );
    t.is(data.bounces.length, 0);
    t.deepEqual(
      data.normalized.map((recipient) => recipient.to),
      [[sender]]
    );
  }

  // and no more
  err = await t.throwsAsync(resolve(mx, srsAddress));
  t.true(err.notConfigured);
});

test('a destination that refuses a forwarded message grants no replies to its SRS address', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = mx;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  await mx.listen(await getPort());
  t.teardown(() => mx.close());

  // where the alias forwards to, which refuses the message
  // (its refusal is answered here, to the sender)
  const serverPort = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      fn(Object.assign(new Error('No such user'), { responseCode: 550 }));
    },
    logger: false,
    secure: false
  });
  await pify(server.listen.bind(server))(serverPort);
  t.teardown(() => server.close());

  const user = await t.context.userFactory.withState({ plan: 'free' }).create();
  const domain = await t.context.domainFactory
    .withState({
      name: `${falso.randWord()}.${_.sample(config.goodDomains)}`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver
    })
    .create();

  const map = new Map();
  const sender = createSender(resolver, map);
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`forward-email-port=${serverPort}`, `forward-email=test@${IP_ADDRESS}`],
      true,
      ms('5m')
    )
  );
  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const err = await t.throwsAsync(
    sendToMx(
      mx,
      { from: sender, to: `hello@${domain.name}` },
      `
To: hello@${domain.name}
From: ${sender}
Message-ID: <${randomUUID()}@${sender.split('@')[1]}>
Subject: hello
Content-Type: text/plain; charset=us-ascii

Hello.`.trim()
    )
  );
  t.true(err.responseCode >= 500, `${err.message}`);

  const srsAddress = srs.forward(sender, env.WEB_HOST);
  t.is(
    await t.context.client.get(`srs_reverse:${srsAddress.toLowerCase()}`),
    null
  );
});

test('a reply refused for now keeps its reverse delivery for the retry', async (t) => {
  // (the sender's mail server below cannot be reached, as nothing listens on
  // port 25 here, so the reply is refused for now)
  const isPort25Open = await new Promise((resolve) => {
    const socket = net.connect(25, IP_ADDRESS);
    socket.setTimeout(ms('5s'));
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
  if (isPort25Open) {
    t.log(`a mail server listens on ${IP_ADDRESS}:25, skipping`);
    t.pass();
    return;
  }

  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = mx;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  await mx.listen(await getPort());
  t.teardown(() => mx.close());

  const map = new Map();
  const sender = createSender(resolver, map);
  const senderDomain = sender.split('@')[1];
  map.set(
    `a:mx.${senderDomain}`,
    resolver.spoofPacket(`mx.${senderDomain}`, 'A', [IP_ADDRESS], true)
  );
  // and who replies (e.g. a server sending a bounce)
  const replier = createSender(resolver, map);
  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const srsAddress = srs.forward(sender, env.WEB_HOST);
  await grantSrsReverse(t.context.client, srsAddress);
  const key = `srs_reverse:${srsAddress.toLowerCase()}`;
  t.is(await t.context.client.get(key), '1');

  const err = await t.throwsAsync(
    sendToMx(
      mx,
      { from: replier, to: srsAddress },
      `
To: ${srsAddress}
From: ${replier}
Subject: auto-reply

Out of office.`.trim()
    )
  );
  t.true(err.responseCode >= 400 && err.responseCode < 500, `${err.message}`);

  // so the retry is relayed too
  t.is(await t.context.client.get(key), '1');

  // (and what a resolution records is what is given back)
  const session = {};
  await resolve(mx, srsAddress, session);
  t.deepEqual(session.srsReversesUsed, [{ srsAddress, settled: false }]);
  t.is(await t.context.client.get(key), '0');
  await restoreSrsReverses(t.context.client, session.srsReversesUsed);
  t.is(await t.context.client.get(key), '1');
  // (only once)
  await restoreSrsReverses(t.context.client, session.srsReversesUsed);
  t.is(await t.context.client.get(key), '1');
});

test('a reverse delivery that was relayed is spent, one that was not is given back', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const map = new Map();
  const sender = createSender(mx.resolver, map);
  await mx.resolver.options.cache.mset(map);
  const srsAddress = srs.forward(sender, env.WEB_HOST);
  const key = `srs_reverse:${srsAddress.toLowerCase()}`;
  await grantSrsReverse(t.context.client, srsAddress, 2);

  // a reply relayed to the sender spends it, even when the reply is then
  // refused for now because of another recipient (so a reply to an SRS
  // address and to a recipient that defers cannot relay without limit)
  const relayed = {};
  await resolve(mx, srsAddress, relayed);
  // (it is relayed only with the reverse delivery it holds)
  t.true(hasSrsReverse(relayed, srsAddress));
  spendSrsReverse(relayed, srsAddress.toLowerCase());
  t.false(hasSrsReverse(relayed, srsAddress));
  await restoreSrsReverses(t.context.client, relayed.srsReversesUsed);
  t.is(await t.context.client.get(key), '1');

  // one that was not relayed (e.g. refused, or skipped as an earlier attempt
  // already relayed it, see `getFingerprintKey`) is given back, once
  const skipped = {};
  await resolve(mx, srsAddress, skipped);
  t.is(await t.context.client.get(key), '0');
  await restoreSrsReverses(t.context.client, skipped.srsReversesUsed);
  t.is(await t.context.client.get(key), '1');
  t.false(hasSrsReverse(skipped, srsAddress));
  await restoreSrsReverses(t.context.client, skipped.srsReversesUsed);
  t.is(await t.context.client.get(key), '1');

  // (two of them for one sender in a message are told apart)
  await grantSrsReverse(t.context.client, srsAddress);
  const twice = {};
  await resolve(mx, srsAddress, twice);
  await resolve(mx, srsAddress, twice);
  t.is(twice.srsReversesUsed.length, 2);
  spendSrsReverse(twice, srsAddress);
  await restoreSrsReverses(t.context.client, twice.srsReversesUsed);
  t.is(await t.context.client.get(key), '1');
});

test('a retry of a reply already relayed to an SRS address is not refused', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const map = new Map();
  const sender = createSender(mx.resolver, map);
  await mx.resolver.options.cache.mset(map);
  const srsAddress = srs.forward(sender, env.WEB_HOST);
  const key = `srs_reverse:${srsAddress.toLowerCase()}`;

  // e.g. its last reverse delivery was relayed, and the reply was refused
  // for now for another recipient, so its sender retries it
  const fingerprint = randomUUID();
  const session = { fingerprint };
  let err = await t.throwsAsync(resolve(mx, srsAddress, session));
  t.true(err.notConfigured);
  await t.context.client.set(
    getFingerprintKey(session, checkSRS(srsAddress)),
    '1'
  );

  // (it is skipped when forwarded, see `forward` in `helpers/on-data-mx`)
  const data = await resolve(mx, srsAddress, session);
  t.is(data.bounces.length, 0);
  t.deepEqual(
    data.normalized.map((recipient) => recipient.to),
    [[sender]]
  );
  // without a reverse delivery (so it is never relayed, see `forward`)
  t.is(session.srsReversesUsed, undefined);
  t.false(hasSrsReverse(session, srsAddress));
  t.is(await t.context.client.get(key), null);

  // another message is still refused
  err = await t.throwsAsync(
    resolve(mx, srsAddress, { fingerprint: randomUUID() })
  );
  t.true(err.notConfigured);
});

test('of two SRS addresses of one sender, the one holding a reverse delivery is used', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const map = new Map();
  const sender = createSender(mx.resolver, map);
  await mx.resolver.options.cache.mset(map);

  // (an SRS address of yesterday and of today)
  const today = srs.forward(sender, env.WEB_HOST);
  const { now } = Date;
  let yesterday;
  try {
    Date.now = () => now() - ms('1d');
    yesterday = srs.forward(sender, env.WEB_HOST);
  } finally {
    Date.now = now;
  }

  t.not(today.toLowerCase(), yesterday.toLowerCase());

  // yesterday's holds a reverse delivery, and today's was already relayed
  await grantSrsReverse(t.context.client, yesterday);
  const session = {
    fingerprint: randomUUID(),
    envelope: {
      mailFrom: { address: '' },
      rcptTo: [today, yesterday].map((srsAddress) => ({
        address: checkSRS(srsAddress),
        srs: true,
        srsAddress
      }))
    }
  };
  await t.context.client.set(getFingerprintKey(session, checkSRS(today)), '1');

  const data = await getRecipients.call(mx, session);
  t.is(data.bounces.length, 0);
  t.deepEqual(
    data.normalized.map((recipient) => recipient.srsAddress),
    [yesterday]
  );
  t.true(hasSrsReverse(session, yesterday));
});

test('a retry of a reply already relayed to an SRS address is accepted and not relayed again', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = mx;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  await mx.listen(await getPort());
  t.teardown(() => mx.close());

  const map = new Map();
  const sender = createSender(resolver, map);
  const senderDomain = sender.split('@')[1];
  // (a relay would be refused for now, as nothing listens on port 25 here)
  map.set(
    `a:mx.${senderDomain}`,
    resolver.spoofPacket(`mx.${senderDomain}`, 'A', [IP_ADDRESS], true)
  );
  const replier = createSender(resolver, map);
  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const srsAddress = srs.forward(sender, env.WEB_HOST);
  const key = `srs_reverse:${srsAddress.toLowerCase()}`;
  const messageId = `<${randomUUID()}@${replier.split('@')[1]}>`;
  const raw = `
Message-ID: ${messageId}
To: ${srsAddress}
From: ${replier}
Subject: auto-reply

Out of office.`.trim();

  // an earlier attempt of the reply used the last reverse delivery and
  // relayed it to the sender
  const fingerprint = getFingerprint({}, [
    { key: 'message-id', value: messageId },
    { key: 'from', value: replier },
    { key: 'to', value: srsAddress },
    { key: 'subject', value: 'auto-reply' }
  ]);
  await t.context.client.set(
    getFingerprintKey({ fingerprint }, checkSRS(srsAddress)),
    '1'
  );

  // so its retry is accepted, and not relayed again
  const info = await sendToMx(mx, { from: replier, to: srsAddress }, raw);
  t.deepEqual(info.accepted, [srsAddress]);
  t.is(await t.context.client.get(key), null);

  // while another reply is still refused
  const err = await t.throwsAsync(
    sendToMx(
      mx,
      { from: replier, to: srsAddress },
      raw.replace(messageId, `<${randomUUID()}@${replier.split('@')[1]}>`)
    )
  );
  t.true(err.responseCode >= 500, `${err.message}`);
});

test('a reply to an SRS address is never relayed without a reverse delivery', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = mx;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  await mx.listen(await getPort());
  t.teardown(() => mx.close());

  const map = new Map();
  const sender = createSender(resolver, map);
  const replier = createSender(resolver, map);
  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const srsAddress = srs.forward(sender, env.WEB_HOST);
  const key = `srs_reverse:${srsAddress.toLowerCase()}`;
  const messageId = `<${randomUUID()}@${replier.split('@')[1]}>`;
  const fingerprint = getFingerprint({}, [
    { key: 'message-id', value: messageId },
    { key: 'from', value: replier },
    { key: 'to', value: srsAddress },
    { key: 'subject', value: 'auto-reply' }
  ]);
  const fingerprintKey = getFingerprintKey(
    { fingerprint },
    checkSRS(srsAddress)
  );

  // a retry resolved as already relayed (without a reverse delivery), whose
  // earlier attempt then gave up its claim on the sender (e.g. it failed)
  const { client } = t.context;
  const { exists } = client;
  client.exists = async (k) =>
    k === fingerprintKey ? 1 : exists.call(client, k);
  t.teardown(() => {
    client.exists = exists;
  });

  // is refused for now, on our side (not greylisted), and not relayed
  const err = await t.throwsAsync(
    sendToMx(
      mx,
      { from: replier, to: srsAddress },
      `
Message-ID: ${messageId}
To: ${srsAddress}
From: ${replier}
Subject: auto-reply

Out of office.`.trim()
    )
  );
  t.is(err.responseCode, 421, `${err.message}`);
  t.regex(err.response, /try again later/i);
  t.is(await client.get(fingerprintKey), null);
  t.is(await client.get(getGreylistKey(fingerprint)), null);
  t.is(await client.get(key), null);
});

test('replies to outbound SMTP mail are relayed to its sender, a few per recipient', async (t) => {
  const { client } = t.context;
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  await user.save();

  const resolver = createTangerine(client, logger);
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const recipientDomain = `${falso.randWord()}-rcpt.example.com`;
  const returnPath = `${domain.return_path}.${domain.name}`;
  const map = new Map();
  map.set(
    `mx:${recipientDomain}`,
    resolver.spoofPacket(
      recipientDomain,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true
    )
  );
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      env.WEB_HOST,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `cname:${returnPath}`,
    resolver.spoofPacket(returnPath, 'CNAME', [env.WEB_HOST], true)
  );
  map.set(
    `txt:${returnPath}`,
    resolver.spoofPacket(
      returnPath,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      ['v=DMARC1; p=reject; pct=100;'],
      true
    )
  );
  await resolver.options.cache.mset(map);

  // the recipient's mail server
  const received = [];
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onData(stream, session, fn) {
      stream.on('data', () => {});
      stream.on('end', () => {
        received.push(session.envelope.mailFrom.address);
        fn();
      });
    },
    logger: false,
    secure: false
  });
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await pify(server.listen.bind(server))(port);
  t.teardown(() => server.close());

  const sender = `${alias.name}@${domain.name}`;
  const email = await Emails.queue({
    message: {
      from: sender,
      to: [`someone@${recipientDomain}`, `another@${recipientDomain}`],
      subject: 'test',
      text: 'test'
    },
    user: user._id
  });

  // sent with an SRS envelope sender on the domain's return path
  await processEmail({ email, port, resolver, client });
  // (each recipient is delivered to on its own)
  t.is(received.length, 2);
  t.is(received[0], received[1]);
  const srsAddress = received[0];
  t.true(srsAddress.toLowerCase().endsWith(`@${returnPath}`));
  t.is(checkSRS(srsAddress).toLowerCase(), sender.toLowerCase());

  // which grants a few reverse deliveries per recipient
  const key = `srs_reverse:${srsAddress.toLowerCase()}`;
  const granted = String(2 * config.srsReverseRepliesPerDestination);
  t.is(await client.get(key), granted);

  // only once, however often the message is sent (every delivery attempt of
  // the queue sends it again)
  await grantSrsReverseOnce(client, srsAddress, String(email._id), 2);
  t.is(await client.get(key), granted);
});
