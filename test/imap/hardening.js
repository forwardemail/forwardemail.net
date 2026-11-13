/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Input limits of the IMAP server (helpers/harden-imap-core.js), exercised
// over a raw socket against a real IMAP server.
//

const { Duplex } = require('node:stream');
const { setTimeout: delay } = require('node:timers/promises');
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pTimeout = require('p-timeout');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { MAX_LINE_LENGTH } = require('#helpers/harden-imap-core');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(async (t) => {
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
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
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  t.context.port = await getPort();
  await imap.listen(t.context.port);
  t.context.imap = imap;

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
      resolver: imap.resolver,
      has_smtp: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();
  t.context.username = `${alias.name}@${domain.name}`;
  t.context.pass = await alias.createToken();
  await alias.save();

  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await imap.resolver.options.cache.mset(map);
});

test.afterEach.always(async (t) => {
  for (const closable of [t.context.imap, t.context.wsp, t.context.sqlite]) {
    try {
      if (closable) await closable.close();
    } catch {}
  }

  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

// a raw IMAP connection (see `connectRaw` in test/utils.js)
function connect(t, options = {}) {
  return utils.connectRaw(
    t,
    { port: t.context.port, host: IP_ADDRESS, ...options },
    /^\* OK/m
  );
}

test('refuses literals before authentication, except for LOGIN', async (t) => {
  const connection = await connect(t);

  // APPEND is not even valid before login, but its literal used to be
  // accepted and buffered first
  connection.write('a APPEND INBOX {50000000}\r\n');
  await connection.until(/^a NO Literals are not accepted/m);
  t.false(connection.output.includes('+ Go ahead'));

  connection.write('b SEARCH TEXT {3}\r\n');
  await connection.until(/^b NO Literals are not accepted/m);
  t.false(connection.output.includes('+ Go ahead'));

  // LOGIN with literals still works
  const { username, pass } = t.context;
  connection.write(`c LOGIN {${username.length}}\r\n`);
  await connection.until(/^\+ /m);
  connection.write(`${username} {${pass.length}}\r\n`);
  await connection.until(/(?:^\+ [\s\S]*){2}/m);
  connection.write(`${pass}\r\n`);
  await connection.until(/^c OK/m);
  t.pass();
});

test('limits the number of literals in a command before authentication', async (t) => {
  const connection = await connect(t);
  connection.write('a LOGIN {1}\r\n');
  for (let i = 0; i < 4; i++) {
    await connection.until(new RegExp(`(?:^\\+ [\\s\\S]*){${i + 1}}`, 'm'));
    connection.write('x {1}\r\n');
  }

  await connection.until(/^a NO Too many literals/m);
  t.pass();
});

test('disconnects a client that sends an endless command line', async (t) => {
  const connection = await connect(t);
  const chunk = 'a'.repeat(64 * 1024);
  for (let sent = 0; sent <= MAX_LINE_LENGTH; sent += chunk.length)
    connection.write(chunk);

  await connection.closed;
  t.regex(connection.output, /\* BYE Line too long/);
});

//
// A whole line is parsed before its command is looked at, in time that grows
// with the square of what the line holds: a megabyte held the server for
// minutes
//
test('disconnects a client that sends more in the lines of a command than a command holds', async (t) => {
  const { username, pass } = t.context;
  // a line of this length, by a value of its ID
  const line = (tag, length) =>
    `${tag} ID ("name" "${'x'.repeat(length - tag.length - 15)}")`;
  t.is(line('a', 100).length, 100);

  // (before authentication 8 KB, each command for itself)
  const anonymous = await connect(t);
  for (const tag of ['a', 'b']) {
    anonymous.write(`${line(tag, 8192)}\r\n`);
    await anonymous.until(new RegExp(`^${tag} (?:OK|NO|BAD)`, 'm'));
  }

  anonymous.write(`${line('c', 8193)}\r\n`);
  await pTimeout(anonymous.closed, ms('10s'));
  t.regex(anonymous.output, /\* BYE Line too long/);
  t.notRegex(anonymous.output, /^c /m);

  // (once authenticated 64 KB, as other servers read of the set of the
  // messages of a large mailbox)
  const connection = await connect(t);
  connection.write(`a LOGIN "${username}" "${pass}"\r\n`);
  await connection.until(/^a OK/m);
  connection.write(`${line('b', 65_536)}\r\n`);
  await connection.until(/^b (?:OK|NO|BAD)/m);

  // (the lines of a command count together, its literals aside)
  const half = 'ALL '.repeat(8192);
  connection.write(`c SEARCH ${half}SUBJECT {1}\r\n`);
  await connection.until(/^\+ /m);
  connection.write(`x ${half}SUBJECT {1}\r\n`);
  await pTimeout(connection.closed, ms('10s'));
  t.regex(connection.output, /\* BYE Line too long/);
  t.notRegex(connection.output, /^c /m);

  // (what is sent after a line too long is not read: with it)
  const greedy = await connect(t);
  greedy.write(`a LOGIN "${username}" "${pass}"\r\n`);
  await greedy.until(/^a OK/m);
  greedy.write(`${line('b', 65_537)}\r\nc CREATE unread\r\n`);
  await pTimeout(greedy.closed, ms('10s'));
  t.regex(greedy.output, /\* BYE Line too long/);

  // (or once it is refused, as after a line that has no end, which the
  // parser refuses itself: a client that does not close is read from for a
  // second and a half more)
  const endless = await connect(t, { allowHalfOpen: true });
  endless.write(`a LOGIN "${username}" "${pass}"\r\n`);
  await endless.until(/^a OK/m);
  endless.write(`b ${'x'.repeat(65_537)}`);
  await endless.until(/\* BYE Line too long/);
  endless.write('\r\nc CREATE unread-too\r\n');
  await delay(ms('1s'));

  const next = await connect(t);
  next.write(`a LOGIN "${username}" "${pass}"\r\nb LIST "" "*"\r\n`);
  await next.until(/^b OK/m);
  t.regex(next.output, /^\* LIST .*INBOX/m);
  t.notRegex(next.output, /unread/);
});

//
// The parser reads the next line of what was written to the socket when it
// is called back for the last one, from inside that call when a command is
// answered (or refused) at once: one level deeper for each line.  A thousand
// NOOPs in one write (8 KB) ran out of stack, as an uncaught exception, and
// the connection was never answered again.
//
test('answers each of the commands of one write, and none after a line too long', async (t) => {
  const { username, pass } = t.context;
  const pipelined = await connect(t);
  pipelined.write(`a LOGIN "${username}" "${pass}"\r\n`);
  await pipelined.until(/^a OK/m);
  pipelined.write(`${'n NOOP\r\n'.repeat(4000)}z LOGOUT\r\n`);
  await pipelined.until(/^z OK/m, ms('2m'));
  t.is(pipelined.output.split('\r\nn OK').length - 1, 4000);

  // (the lines after one too long were each refused from inside the call
  // for the one before: 4,000 of them held the server for 15 seconds)
  const flooding = await connect(t);
  flooding.write(
    `a ID ("name" "${'x'.repeat(8193)}")\r\n${'b NOOP\r\n'.repeat(4000)}`
  );
  await pTimeout(flooding.closed, ms('10s'));
  t.regex(flooding.output, /\* BYE Line too long/);
  t.notRegex(flooding.output, /^[ab] /m);
});

//
// Before it signs in, a client has a handful of commands to send.  Anyone
// could send them without end and never read the answers, which the server
// kept (13 MB within 18 seconds of CAPABILITY commands), busy all the while.
//
test('disconnects a client that sends many commands before it signs in', async (t) => {
  const { username, pass } = t.context;
  const anyone = await connect(t);
  anyone.write('n NOOP\r\n'.repeat(150));
  await pTimeout(anyone.closed, ms('10s'));
  t.is(anyone.output.split('\r\nn OK').length - 1, 100);
  t.regex(anyone.output, /^\* BYE Too many commands before authentication/m);

  // (a command of several lines is one, the hundredth here, and once signed
  // in a client sends as many as it likes)
  const known = await connect(t);
  known.write(`${'n NOOP\r\n'.repeat(99)}a LOGIN {${username.length}}\r\n`);
  await known.until(/^\+ /m);
  known.write(`${username} {${pass.length}}\r\n`);
  await known.until(/(?:^\+ [\s\S]*){2}/m);
  known.write(`${pass}\r\n${'m NOOP\r\n'.repeat(150)}z LOGOUT\r\n`);
  await known.until(/^z OK/m);
  t.regex(known.output, /^a OK/m);
  t.is(known.output.split('\r\nm OK').length - 1, 150);

  // (one that is refused at its first line, which is not its last, is one)
  const refused = await connect(t);
  refused.write('r APPEND INBOX {1}\r\n'.repeat(150));
  await pTimeout(refused.closed, ms('10s'));
  t.is(refused.output.split('\r\nr NO Literals are not').length - 1, 100);
  t.regex(refused.output, /^\* BYE Too many commands before authentication/m);
});

//
// An address is some hundred characters long.  A username of any length
// was taken for one all the same: its domain was looked up, in the settings
// and in the DNS, and written out in the answer.  One of a megabyte, which
// ManageSieve reads in a line before authentication, took a second (see
// helpers/on-auth.js).
//
test('refuses a username that is far longer than an address', async (t) => {
  // (the alias of the test, with a "+" part that makes it of this length)
  const { username: address, pass } = t.context;
  const [name, domain] = address.split('@');
  const username = (length) =>
    `${name}+${'t'.repeat(length - address.length - 1)}@${domain}`;
  t.is(username(4097).length, 4097);

  const connection = await connect(t);
  connection.write(`a LOGIN "${username(4097)}" "${pass}"\r\n`);
  await connection.until(/^a (?:OK|NO)/m);
  t.regex(connection.output, /^a NO .*Invalid username, please enter/m);

  // (one of the longest length signs in)
  connection.write(`b LOGIN "${username(4096)}" "${pass}"\r\n`);
  await connection.until(/^b (?:OK|NO)/m);
  t.regex(connection.output, /^b OK/m);
});

//
// What is sent between a STARTTLS and its handshake is not the client's for
// sure: anyone between the two can add to what is not encrypted yet, and a
// client sends nothing then.  The lines of it that were left once the
// handshake was done were read as if they had been sent inside the session
// (the commands of one write are each read from the event loop, and the
// handshake is done before many are), as was the start of a line, which the
// first line of the client then ended.
//
test('reads nothing that was sent between a STARTTLS and its handshake', async (t) => {
  // (a client sends nothing in between)
  const client = await connect(t);
  client.write('a STARTTLS\r\n');
  await client.until(/^a OK/m);
  const secure = await utils.startTLS(client);
  t.truthy(secure);
  secure.write('b NOOP\r\n');
  await secure.until(/^b OK/m);

  // (commands, as many as a client may send before it signs in, and the
  // start of one: neither is answered, in the clear or in a session)
  for (const added of ['f NOOP\r\n'.repeat(90), 'f NOOP']) {
    const connection = await connect(t);
    connection.write(`a STARTTLS\r\n${added}`);
    await connection.until(/^a OK/m);
    const session = await utils.startTLS(connection);
    if (session) {
      session.write('\r\ny NOOP\r\n');
      await delay(ms('1s'));
      t.notRegex(session.output, /^[fy] OK/m);
    }

    t.is(session, null);
    await pTimeout(connection.closed, ms('10s'));
    t.notRegex(connection.output, /^f OK/m);
  }
});

//
// A client may send its STARTTLS in one write with the commands before it,
// and start the handshake as soon as it is answered.  The core starts its
// side from the event loop, a turn after it answers when the STARTTLS was
// itself read from the event loop (see `_onCommand` in
// helpers/harden-imap-core.js): what arrives in that turn is left for the
// handshake, and not read as a command (which would end the connection).
//
test('starts the session of a STARTTLS that was sent with other commands', async (t) => {
  const connection = await connect(t);
  //
  // (A client in this process reads the answer to the STARTTLS a turn after
  // the server is ready for the handshake.  This one starts it when it reads
  // the answer to the command before, which is when the server reads the
  // STARTTLS, and leaves what is said in the clear out of the session.)
  //
  const tunnel = new Duplex({
    read() {},
    write(chunk, encoding, callback) {
      connection.socket.write(chunk, callback);
    }
  });
  let session;
  let passed = 0;
  connection.socket.on('data', () => {
    const { output } = connection;
    if (!session && /^x2 OK/m.test(output))
      session = utils.startTLS(connection, tunnel);
    const answer = /^a OK.*\r\n/m.exec(output);
    if (!answer) return;
    passed = Math.max(passed, answer.index + answer[0].length);
    tunnel.push(Buffer.from(output.slice(passed), 'binary'));
    passed = output.length;
  });
  connection.write('x1 NOOP\r\nx2 NOOP\r\na STARTTLS\r\n');
  await connection.until(/^x2 OK/m);

  const secure = await session;
  t.truthy(secure);
  secure.write('b NOOP\r\n');
  await secure.until(/^b OK/m);

  // (a STARTTLS that is refused is followed by no handshake to wait for)
  secure.write('c STARTTLS\r\n');
  await secure.until(/^c NO/m);
  secure.write('d NOOP\r\n');
  await secure.until(/^d OK/m);
});

//
// The IMAP core wrote a response out in time that grew with the square of
// the number of values in it (it writes in one pass now, see
// patches/@zone-eu__wildduck@1.48.0.patch), and a message has as many
// addresses and parts as its sender gives it (within what
// helpers/get-unsafe-address-header.js accepts, as here): its envelope held
// the server that stores the mailboxes for most of a minute, each time a
// client asked for it.
//
test('writes out the envelope and structure of a message of many addresses and parts', async (t) => {
  const { username, pass } = t.context;
  // (the last one differs, and a line is folded every hundred)
  const list = (length, last) =>
    Array.from(
      { length },
      (_, i) =>
        (i === length - 1 ? last : 'a') +
        '@b.c' +
        (i === length - 1 ? '' : i % 100 === 99 ? ',\r\n ' : ',')
    ).join('');
  const part = '--b\r\nContent-Type: text/plain\r\n\r\nx\r\n';
  const raw = [
    // (the sender and the address to reply to are those of From, without
    // headers of their own)
    `From: ${list(8000, 'f')}`,
    `To: ${list(8000, 't')}`,
    `Cc: ${list(5000, 'c')}`,
    'Subject: many',
    'Message-ID: <many@example.com>',
    'Date: Tue, 10 Nov 2026 10:00:00 +0000',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="b"',
    '',
    `${part.repeat(990)}--b--`,
    ''
  ].join('\r\n');

  const connection = await connect(t);
  connection.write(`a LOGIN "${username}" "${pass}"\r\n`);
  await connection.until(/^a OK/m);
  connection.write(`b APPEND INBOX {${Buffer.byteLength(raw)}}\r\n`);
  await connection.until(/^\+ /m);
  connection.write(`${raw}\r\n`);
  await connection.until(/^b OK/m, ms('60s'));
  connection.write('c SELECT INBOX\r\n');
  await connection.until(/^c OK/m);

  connection.write('d FETCH 1 (UID ENVELOPE BODYSTRUCTURE)\r\n');
  await connection.until(/^d OK/m, ms('15s'));
  // (all of them, as the IMAP core writes them)
  const [, envelope, structure] =
    /ENVELOPE (\(.*\)) BODYSTRUCTURE (\(.*\))\)\r\n/.exec(connection.output) ||
    [];
  t.is((envelope || '').split('"b.c"').length - 1, 3 * 8000 + 8000 + 5000);
  for (const last of ['f', 't', 'c'])
    t.true(
      (envelope || '').includes(`(NIL NIL "a" "b.c")(NIL NIL "${last}" "b.c"))`)
    );
  t.is((structure || '').split('("TEXT" "PLAIN"').length - 1, 990);
  t.true((structure || '').endsWith('"MIXED" ("BOUNDARY" "b") NIL NIL NIL)'));
});

test('bounds a COMPRESS=DEFLATE bomb by the same line limit', async (t) => {
  const connection = await connect(t);
  const { username, pass } = t.context;
  connection.write(`a LOGIN "${username}" "${pass}"\r\n`);
  await connection.until(/^a OK/m);
  connection.write('b COMPRESS DEFLATE\r\n');
  await connection.until(/^b OK/m);

  // 64 MB of the same byte deflates to about 64 KB
  const deflate = zlib.createDeflateRaw();
  deflate.on('data', (data) => connection.socket.write(data));
  const block = Buffer.alloc(1024 * 1024, 'a');
  for (let i = 0; i < 64; i++) deflate.write(block);
  deflate.flush();

  // disconnected long before 64 MB could pile up in one line
  await pTimeout(connection.closed, ms('10s'));

  // and the server keeps serving other clients
  const next = await connect(t);
  next.write('a CAPABILITY\r\n');
  await next.until(/^a OK/m);
  t.pass();
});
