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

const crypto = require('node:crypto');
const http = require('node:http');
const net = require('node:net');
const util = require('node:util');
const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const { authenticate } = require('mailauth');
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
const { MAX_SEPARATORS } = require('#helpers/get-unsafe-address-header');

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

  return { domain, received, send, port: smtp.server.address().port };
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

// a value folded into lines of `width` characters
function foldLines(value, width = 76) {
  return value.match(new RegExp(`.{1,${width}}`, 'g')).join('\r\n ');
}

// how long (CPU, all threads) and how long in all `fn` takes
async function timed(fn) {
  const cpu = process.cpuUsage();
  const started = Date.now();
  const result = await fn();
  const used = process.cpuUsage(cpu);
  return {
    result,
    cpu: (used.user + used.system) / 1000,
    elapsed: Date.now() - started
  };
}

test('refuses at once a message whose header no parser could read in reasonable time', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  // 40,000 folded lines in one field (160 KB): each parser joins them one at
  // a time, in time in the square of their number
  const folded = `Subject: x${'\r\n y'.repeat(40_000)}`;
  const many = await timed(() =>
    t.throwsAsync(send(message(domain, { headers: [folded] })))
  );
  t.is(many.result.responseCode, 421);
  t.regex(many.result.message, /more than 5000 lines/);
  t.true(many.cpu < 2000, `${Math.round(many.cpu)}ms of CPU`);

  // a field far longer than Postfix's limit
  const long = await timed(() =>
    t.throwsAsync(
      send(
        message(domain, {
          headers: [`X-Long: ${foldLines('x'.repeat(200_000), 998)}`]
        })
      )
    )
  );
  t.is(long.result.responseCode, 421);
  t.regex(long.result.message, /longer than 131072 bytes/);
  t.true(long.cpu < 2000, `${Math.round(long.cpu)}ms of CPU`);
  t.is(received.length, 0);

  // (a header with a few thousand lines is read)
  const some = `Subject: x${'\r\n y'.repeat(2000)}`;
  await send(
    message(domain, { headers: [some] }).replace('Subject: hardening\r\n', '')
  );
  await pWaitFor(() => received.length === 1, { timeout: ms('10s') });
});

test('delivers a field as long as Postfix leaves it, relayed with CRLF line breaks', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  // a References field Postfix truncated at header_size_limit: 102,400
  // bytes counted with LF line breaks, 1,678 more with CRLF
  const ids = [];
  let { length } = 'References:';
  for (let i = 0; length < 102_400 - 80; i++) {
    const id = ` <thread-${String(i).padStart(6, '0')}@lists.example.org>`;
    ids.push(id);
    length += id.length + 1;
  }

  let references = `References:${ids.join('\n')}`;
  references += 'x'.repeat(102_400 - references.length);
  t.is(references.length, 102_400);
  const crlf = references.replaceAll('\n', '\r\n');
  t.true(crlf.length > 104_000);
  await send(message(domain, { headers: [crlf] }));
  await pWaitFor(() => received.length === 1, { timeout: ms('10s') });
  t.pass();
});

test('refuses at once a From header mailauth could not read in reasonable time', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  // one address, and 99 KB of empty groups (nodemailer's addressparser,
  // which mailauth reads it with, takes time in the square of their number)
  const groups = await timed(() =>
    t.throwsAsync(
      send(
        message(domain, {
          from: `sender@acme-mail.net, ${foldLines('g:;'.repeat(33_000), 998)}`
        })
      )
    )
  );
  t.is(groups.result.responseCode, 421);
  t.regex(groups.result.message, /"From" header/);
  t.true(groups.cpu < 2000, `${Math.round(groups.cpu)}ms of CPU`);
  // (and 65 groups in a short one)
  const short = await t.throwsAsync(
    send(message(domain, { from: `sender@acme-mail.net, ${'g:;'.repeat(65)}` }))
  );
  t.is(short.responseCode, 421);
  t.regex(short.message, /too many addresses or groups/);
  // (also groups after a quote in angle brackets, or a comment in a comment,
  //  which the parser does not read as a quoted string or a comment)
  for (const from of [
    `sender@acme-mail.net, <">${':;'.repeat(65)}<">`,
    `sender@acme-mail.net (()${':'.repeat(65)})`
  ]) {
    const err = await t.throwsAsync(send(message(domain, { from })));
    t.is(err.responseCode, 421, `${from}`);
  }

  t.is(received.length, 0);
});

test('accepts a From header whose display name is another address', async (t) => {
  const { domain, received, send } = await setupForwarding(t);

  // (not valid RFC 5322, but sent by some list managers; the sender is the
  // address in the angle brackets, see helpers/get-from-address.js)

  for (const from of [
    'support@beta-corp.net <x@acme-mail.net>',
    'alice@beta-corp.net via Group <x@acme-mail.net>',
    '"x@acme-mail.net" <x@acme-mail.net>',
    'Sender <x@acme-mail.net>',
    // (colons and commas in a quoted display name or a comment are no
    //  groups or addresses)
    `"Alert: ${'disk: '.repeat(20)}full, again" <x@acme-mail.net>`,
    `x@acme-mail.net (${'note: '.repeat(20)})`
  ])
    await send(message(domain, { from }));

  await pWaitFor(() => received.length === 6, { timeout: ms('20s') });
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

// a header folded the way RFC 5322 asks (lines well under 998 characters)
function fold(name, items, separator = ',') {
  const lines = [];
  let line = `${name}: ${items[0]}`;
  for (const item of items.slice(1)) {
    if (line.length > 900) {
      lines.push(line + separator);
      line = ` ${item}`;
    } else {
      line += `${separator}${item}`;
    }
  }

  lines.push(line);
  return lines.join('\r\n');
}

//
// The address parsers take time quadratic in the length of an address list
// (see helpers/get-unsafe-address-header.js), so such a message is refused
// before any of them reads it.
//
test('refuses a message with an address list longer than any real one', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  const from = fold('From', [
    'sender@acme-mail.net',
    ...Array.from({ length: MAX_SEPARATORS + 1 }, () => 'x')
  ]);
  const raw = message(domain).replace('From: sender@acme-mail.net', () => from);

  const started = Date.now();
  const err = await t.throwsAsync(send(raw));
  t.is(err.responseCode, 421);
  t.regex(err.message, /"From" header has too many addresses/);
  t.true(Date.now() - started < ms('5s'));
  t.is(received.length, 0);
});

test('refuses an address header with a word longer than a line', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  const err = await t.throwsAsync(
    send(
      message(domain, {
        headers: [`Cc: friend@acme-mail.net, ${'a.'.repeat(600)}`]
      })
    )
  );
  t.is(err.responseCode, 421);
  t.regex(err.message, /"Cc" header has a word that is too long/);
  t.is(received.length, 0);
});

//
// The address parsers also read the headers of a message embedded as
// message/rfc822, so an oversized header hidden in one is refused too.
//
test('refuses an oversized address header inside an embedded message', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  const items = Array.from({ length: MAX_SEPARATORS + 1 }, () => 'x');
  const inner = [
    fold('To', ['a@acme-mail.net', ...items]),
    'Subject: forwarded',
    '',
    'the original message'
  ].join('\r\n');
  const raw = [
    'From: sender@acme-mail.net',
    `To: test@${domain.name}`,
    'Subject: fwd',
    'Content-Type: multipart/mixed; boundary=outer',
    '',
    '--outer',
    'Content-Type: message/rfc822',
    '',
    inner,
    '',
    '--outer--',
    ''
  ].join('\r\n');

  const started = Date.now();
  const err = await t.throwsAsync(send(raw));
  t.is(err.responseCode, 421);
  t.regex(err.message, /"To" header has too many addresses/);
  t.true(Date.now() - started < ms('10s'));
  t.is(received.length, 0);
});

test('accepts a message with a long list of recipients', async (t) => {
  const { domain, received, send } = await setupForwarding(t);
  const cc = fold(
    'Cc',
    Array.from(
      { length: 300 },
      (_, i) => `"Recipient, ${i}" <recipient-${i}@acme-mail.net>`
    ),
    ', '
  );
  await send(message(domain, { headers: [cc] }));
  await pWaitFor(() => received.length === 1, { timeout: ms('10s') });
  t.pass();
});

//
// Sends a message to the MX server byte for byte, without the dot stuffing
// and line end changes of an SMTP client, and resolves with the last reply
//
function sendAsWritten(port, envelope, data) {
  const commands = [
    'EHLO client.example.com',
    `MAIL FROM:<${envelope.from}>`,
    `RCPT TO:<${envelope.to}>`,
    'DATA',
    Buffer.concat([Buffer.from(data, 'binary'), Buffer.from('\r\n.\r\n')]),
    'QUIT'
  ];
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, IP_ADDRESS);
    let buffer = '';
    let last;
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
      buffer += chunk;
      // (a reply ends with a line of its code and a space)
      const lines = buffer.split('\r\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!/^\d{3} /.test(line)) continue;
        if (!line.startsWith('2') && !line.startsWith('3')) {
          socket.destroy();
          reject(new Error(line));
          return;
        }

        last = line;
        const command = commands.shift();
        if (command === undefined) continue;
        socket.write(
          Buffer.isBuffer(command) ? command : Buffer.from(`${command}\r\n`)
        );
      }
    });
    socket.on('close', () => resolve(last));
    socket.on('error', reject);
  });
}

// (the results of our DKIM signature and ARC seal on a message we sent)
async function checkOurSignatures(raw) {
  const publicKey = crypto
    .createPublicKey(config.signatureData.privateKey)
    .export({ type: 'spki', format: 'der' })
    .toString('base64');
  const name = `${config.signatureData.selector}._domainkey.${config.signatureData.signingDomain}`;
  const result = await authenticate(Buffer.from(raw), {
    ip: IP_ADDRESS,
    helo: 'mx.example.com',
    sender: 'sender@acme-mail.net',
    async resolver(domain, type) {
      if (domain === name && type === 'TXT')
        return [[`v=DKIM1; k=rsa; p=${publicKey}`]];
      const err = new Error('not found');
      err.code = 'ENOTFOUND';
      throw err;
    }
  });
  const signature = result.dkim.results.find(
    (r) => r.signingDomain === config.signatureData.signingDomain
  );
  return { dkim: signature?.status?.result, arc: result.arc.status.result };
}

test('a dot after a bare CR is forwarded with the bytes that were signed', async (t) => {
  const { domain, received, port } = await setupForwarding(t);

  // (a dot between a bare CR and a line end is doubled as it is sent, see
  // patches/nodemailer@10.1.7.patch, and must be doubled where it is signed)
  const raw = [
    `To: test@${domain.name}`,
    'From: sender@acme-mail.net',
    'Subject: bare CR',
    'Content-Type: text/plain; charset=us-ascii',
    '',
    'one\r.\r\ntwo\r.\nthree\r.'
  ].join('\r\n');
  const reply = await sendAsWritten(
    port,
    { from: 'sender@acme-mail.net', to: `test@${domain.name}` },
    raw
  );
  t.regex(reply, /^2/);
  await pWaitFor(() => received.length === 1, { timeout: ms('10s') });
  t.true(received[0].includes('one\r..\r\ntwo'));

  // our ARC seal and DKIM signature verify against the bytes received
  t.deepEqual(await checkOurSignatures(received[0]), {
    dkim: 'pass',
    arc: 'pass'
  });
});

test('a webhook is sent a message with a dot after a bare CR as it was received', async (t) => {
  const { domain, port } = await setupForwarding(t);

  const bodies = [];
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      bodies.push(JSON.parse(Buffer.concat(chunks).toString()));
      res.end('OK');
    });
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.teardown(() => server.close());
  await t.context.aliasFactory
    .withState({
      user: domain.members[0].user,
      domain: domain._id,
      name: 'hook',
      recipients: [`http://127.0.0.1:${server.address().port}/hook`]
    })
    .create();

  // (a webhook is not SMTP, so nothing is stuffed)
  const raw = [
    `To: hook@${domain.name}`,
    'From: sender@acme-mail.net',
    'Subject: bare CR',
    'Content-Type: text/plain; charset=us-ascii',
    '',
    'line1\r.\r\nend'
  ].join('\r\n');
  const reply = await sendAsWritten(
    port,
    { from: 'sender@acme-mail.net', to: `hook@${domain.name}` },
    raw
  );
  t.regex(reply, /^2/);
  await pWaitFor(() => bodies.length === 1, { timeout: ms('10s') });
  t.true(bodies[0].raw.includes('\r\n\r\nline1\r.\r\nend'));
  t.false(bodies[0].raw.includes('\r..'));
  t.deepEqual(await checkOurSignatures(bodies[0].raw), {
    dkim: 'pass',
    arc: 'pass'
  });
});
