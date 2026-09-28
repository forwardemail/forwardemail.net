/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// MX server input limits that protect the authentication checks (the number
// of DKIM-Signature headers mailauth hashes the body for), and From headers
// whose display name is another address, which are delivered.
//

const process = require('node:process');

// a small message size limit, so the oversized DATA tests stay fast
// (read by config/env when the servers below are loaded)
process.env.SMTP_MESSAGE_MAX_SIZE = '1MB';

const net = require('node:net');
const util = require('node:util');
const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');
const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const { MAX_DKIM_SIGNATURES } = require('#helpers/is-authenticated-message');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(await getPort());
  const wsp = createWebSocketAsPromised({
    port: sqlite.server.address().port
  });
  await wsp.open();
  t.context.wsp = wsp;
});

test.afterEach.always(async (t) => {
  for (const closable of [t.context.wsp, t.context.sqlite]) {
    try {
      if (closable) await closable.close();
    } catch {}
  }
});

//
// An MX server, a forwarding alias on a verified domain, and the SMTP
// server the alias forwards to (which records what it receives).
//
async function setupForwarding(t) {
  const smtp = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = smtp;
  await smtp.listen(await getPort());
  t.teardown(() => smtp.close());

  const received = [];
  const serverPort = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onData(stream, session, fn) {
      const chunks = [];
      stream.pipe(
        new Writable({
          write(chunk, encoding, next) {
            chunks.push(chunk);
            next();
          }
        })
      );
      stream.on('end', () => {
        received.push(Buffer.concat(chunks).toString());
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(server.listen.bind(server))(serverPort);
  t.teardown(() => server.close());

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

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: serverPort.toString()
    })
    .create();
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: 'test',
      recipients: [`test@${IP_ADDRESS}`],
      is_enabled: true
    })
    .create();

  const map = new Map();
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true)
  );
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );
  await resolver.options.cache.mset(map);

  // no greylisting for this test client
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  async function send(raw, from = 'sender@acme-mail.net') {
    const mx = await asyncMxConnect({
      target: IP_ADDRESS,
      port: smtp.server.address().port,
      dnsOptions: {
        resolve: util.callbackify(resolver.resolve.bind(resolver))
      }
    });
    const transporter = nodemailer.createTransport({
      logger,
      host: mx.host,
      port: mx.port,
      connection: mx.socket,
      ignoreTLS: true,
      secure: false,
      tls
    });
    return transporter.sendMail({
      envelope: { from, to: `test@${domain.name}` },
      raw
    });
  }

  return { domain, received, send };
}

function dkimSignature(i) {
  return `DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=acme-mail.net; s=s${i}; l=${
    100_000 + i
  }; h=from:to:subject; bh=AAAA; b=AAAA`;
}

function message(domain, { headers = [], from = 'sender@acme-mail.net' } = {}) {
  return [
    ...headers,
    `To: test@${domain.name}`,
    `From: ${from}`,
    'Subject: hardening',
    'Content-Type: text/plain; charset=us-ascii',
    '',
    'hello'
  ].join('\r\n');
}

test('refuses a message with more DKIM-Signature headers than the limit', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  const headers = Array.from({ length: MAX_DKIM_SIGNATURES + 1 }, (_, i) =>
    dkimSignature(i)
  );

  const err = await t.throwsAsync(send(message(domain, { headers })));
  t.is(err.responseCode, 421);
  t.regex(err.message, /DKIM-Signature headers/);
  t.is(received.length, 0);
});

test('accepts a message with DKIM-Signature headers within the limit', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  const headers = Array.from({ length: MAX_DKIM_SIGNATURES }, (_, i) =>
    dkimSignature(i)
  );

  await send(message(domain, { headers }));
  await pWaitFor(() => received.length === 1, { timeout: ms('10s') });
  t.pass();
});

test('accepts a From header whose display name is another address', async (t) => {
  const { domain, received, send } = await setupForwarding(t);

  // (not valid RFC 5322, but sent by some list managers; the sender is the
  // address in the angle brackets, see helpers/get-from-address.js)

  for (const from of [
    'support@beta-corp.net <x@acme-mail.net>',
    'alice@beta-corp.net via Group <x@acme-mail.net>',
    '"x@acme-mail.net" <x@acme-mail.net>',
    'Sender <x@acme-mail.net>'
  ])
    await send(message(domain, { from }));

  await pWaitFor(() => received.length === 4, { timeout: ms('20s') });
  t.pass();
});

test('answers an oversized message 552 at the end of DATA', async (t) => {
  t.timeout(ms('30s'));
  const { domain, received, send } = await setupForwarding(t);

  const body = 'a'.repeat(76) + '\r\n';
  const raw = message(domain) + '\r\n' + body.repeat(20_000); // ~1.5 MB
  const err = await t.throwsAsync(send(raw));
  t.is(err.responseCode, 552);
  t.is(received.length, 0);

  // and the MX is still answering
  await send(message(domain));
  await pWaitFor(() => received.length === 1, { timeout: ms('10s') });
});

test('closes a connection that keeps sending far past the size limit', async (t) => {
  t.timeout(ms('30s'));
  const { domain, received, send } = await setupForwarding(t);

  const body = 'a'.repeat(76) + '\r\n';
  const raw = message(domain) + '\r\n' + body.repeat(60_000); // ~4.6 MB
  const err = await t.throwsAsync(send(raw));
  t.true(
    err.responseCode === 421 || /closed|econnreset|epipe/i.test(err.message),
    `${err.message}`
  );
  t.is(received.length, 0);
});

//
// Opens a raw SMTP connection and resolves with the greeting line.
//
function greet(port) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, '127.0.0.1');
    let data = '';
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
      data += chunk;
      if (data.includes('\r\n')) resolve({ socket, greeting: data.trim() });
    });
    socket.on('error', reject);
  });
}

test('concurrent connections are counted per /64 for IPv6 clients', async (t) => {
  const smtp = new MX({ client: t.context.client, wsp: t.context.wsp });
  await smtp.listen(await getPort());
  t.teardown(() => smtp.close());
  const { port } = smtp.server.address();

  // every connection arrives from a new address of the same /64
  // (a routable range: non-public addresses are treated as local and are
  // allowlisted, which keeps a counter per address)
  let n = 0;
  const { onConnect } = smtp.server;
  smtp.server.onConnect = (session, fn) => {
    session.remoteAddress = `2a01:4f8:1234:5678::${(++n).toString(16)}`;
    return onConnect(session, fn);
  };

  const sockets = [];
  t.teardown(() => {
    for (const socket of sockets) socket.destroy();
  });

  for (let i = 0; i < 10; i++) {
    const { socket, greeting } = await greet(port);
    sockets.push(socket);
    t.regex(greeting, /^220 /);
  }

  // the 11th address of the same /64 is over the limit
  const { socket, greeting } = await greet(port);
  sockets.push(socket);
  t.regex(greeting, /^421 .*Too many concurrent connections/);

  // closing the connections releases the /64's counter
  for (const socket of sockets) socket.end('QUIT\r\n');
  const key = `concurrent_mx_${config.env}:2a01:04f8:1234:5678::/64`;
  await pWaitFor(async () => Number(await t.context.client.get(key)) === 0, {
    timeout: ms('10s')
  });

  // and a new connection from that /64 is accepted again
  const again = await greet(port);
  sockets.push(again.socket);
  t.regex(again.greeting, /^220 /);
});
