/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const Pop3Command = require('node-pop3');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pify = require('pify');
const pWaitFor = require('p-wait-for');
const splitLines = require('split-lines');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const POP3 = require('../../pop3-server');

const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { DAILY_LIMIT } = require('#helpers/bandwidth-limiter');
const getPathToDatabase = require('#helpers/get-path-to-database');
const onAppend = require('#helpers/imap/on-append');
const { encrypt } = require('#helpers/encrypt-decrypt');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const onAppendPromise = pify(onAppend, { multiArgs: true });
const tlsOptions = { rejectUnauthorized: false };
const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const secure = false;
  t.context.secure = secure;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  t.context.wsp = wsp;
  const pop3 = new POP3(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    secure
  );
  t.context.port = port;
  t.context.server = await pop3.listen(port);
  t.context.pop3 = pop3;

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

  t.context.user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: pop3.resolver,
      has_smtp: true
    })
    .create();

  t.context.domain = domain;

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  t.context.pass = pass;
  t.context.alias = await alias.save();

  // spoof session
  t.context.session = {
    user: {
      id: alias.id,
      username: `${alias.name}@${domain.name}`,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      password: encrypt(pass),
      storage_location: alias.storage_location,
      alias_has_pgp: alias.has_pgp,
      alias_public_key: alias.public_key,
      locale: 'en',
      owner_full_email: `${alias.name}@${domain.name}`
    },
    remoteAddress: IP_ADDRESS
  };

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    pop3.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );

  // store spoofed dns cache
  await pop3.resolver.options.cache.mset(map);

  const pop3Command = new Pop3Command({
    user: `${alias.name}@${domain.name}`,
    password: pass,
    host: 'localhost',
    port,
    tlsOptions
  });

  await pop3Command.connect();
  await pop3Command.command('USER', `${alias.name}@${domain.name}`);
  await pop3Command.command('PASS', pass);

  t.context.pop3Command = pop3Command;
});

test.afterEach(async (t) => {
  await t.context.pop3Command.command('QUIT');
  await t.context.pop3.close();
});

//
// <https://www.rfc-editor.org/rfc/rfc1939>
//
// Authorization state:
// - QUIT
//
// Transaction state:
// - STAT
// - LIST
// - RETR
// - DELE
// - NOOP
// - RSET
// - QUIT
//
// Optional commands:
// - TOP
// - UIDL
// - USER
// - PASS
// - APOP
//
// <https://www.rfc-editor.org/rfc/rfc1939#section-10>
// S: <wait for connection on TCP port 110>
// C: <open connection>
// S:    +OK POP3 server ready <1896.697170952@dbc.mtview.ca.us>
// C:    APOP mrose c4c9334bac560ecc979e58001b3e22fb
// S:    +OK mrose's maildrop has 2 messages (320 octets)
// C:    STAT
// S:    +OK 2 320
// C:    LIST
// S:    +OK 2 messages (320 octets)
// S:    1 120
// S:    2 200
// S:    .
// C:    RETR 1
// S:    +OK 120 octets
// S:    <the POP3 server sends message 1>
// S:    .
// C:    DELE 1
// S:    +OK message 1 deleted
// C:    RETR 2
// S:    +OK 200 octets
// S:    <the POP3 server sends message 2>
// S:    .
// C:    DELE 2
// S:    +OK message 2 deleted
// C:    QUIT
// S:    +OK dewey POP3 server signing off (maildrop empty)
// C:  <close connection>
// S:  <wait for next connection>
//
test('example pop3 session', async (t) => {
  // STAT
  {
    // eslint-disable-next-line new-cap
    const stat = await t.context.pop3Command.STAT();
    t.is(stat, '0 0');
  }

  // LIST
  {
    // eslint-disable-next-line new-cap
    const list = await t.context.pop3Command.LIST();
    t.deepEqual(list, []);
  }

  // RETR 1
  {
    // eslint-disable-next-line new-cap
    const retr1 = await t.throwsAsync(t.context.pop3Command.RETR(1));
    // Error {
    //   command: 'RETR 1',
    //   eventName: 'error',
    //   message: 'no such message, only 0 messages in maildrop',
    // }
    t.is(retr1.command, 'RETR 1');
    t.is(retr1.eventName, 'error');
    t.is(retr1.message, 'no such message, only 0 messages in maildrop');
  }

  //
  // append a new message
  //
  await t.context.pop3.refreshSession(t.context.session, 'POP3');
  const mailbox = await Mailboxes.findOne(t.context.pop3, t.context.session, {
    path: 'INBOX'
  });

  t.true(mailbox !== null);

  const flags = [];
  const raw = splitLines(
    `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
Message-ID: <beep-boop@${t.context.domain.name}>
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: test

This is a multi-part message in MIME format.
--------------cWFvDSey27tFG0hVYLqp9hs9
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test

--------------cWFvDSey27tFG0hVYLqp9hs9
Content-Type: text/plain; charset=UTF-8; name="example.txt"
Content-Disposition: attachment; filename="example.txt"
Content-Transfer-Encoding: base64

ZXhhbXBsZQo=

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim()
  ).join('\r\n');

  await onAppendPromise.call(
    t.context.pop3,
    'INBOX',
    flags,
    new Date(),
    raw,
    t.context.session
  );

  await t.context.pop3Command.command('QUIT');

  // reconnect
  t.context.pop3Command = new Pop3Command({
    user: `${t.context.alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });

  await t.context.pop3Command.connect();
  await t.context.pop3Command.command(
    'USER',
    `${t.context.alias.name}@${t.context.domain.name}`
  );
  await t.context.pop3Command.command('PASS', t.context.pass);

  // STAT
  {
    // eslint-disable-next-line new-cap
    const stat = await t.context.pop3Command.STAT();
    t.is(stat, `1 ${raw.length + 2}`);
  }

  // LIST
  {
    // eslint-disable-next-line new-cap
    const list = await t.context.pop3Command.LIST();
    t.deepEqual(list, [['1', `${raw.length + 2}`]]);
  }

  // RETR 1
  {
    // eslint-disable-next-line new-cap
    const retr1 = await t.context.pop3Command.RETR(1);
    //
    // TODO: line break near boundary is broken in WildDuck
    // <https://github.com/nodemailer/wildduck/issues/571>
    // t.deepEqual(splitLines(retr1), splitLines(raw));
    //
    t.is(
      splitLines(retr1.trim()).join('\n'),
      splitLines(
        `Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
Message-ID: <beep-boop@${t.context.domain.name}>
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: test

This is a multi-part message in MIME format.
--------------cWFvDSey27tFG0hVYLqp9hs9
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test

--------------cWFvDSey27tFG0hVYLqp9hs9
Content-Type: text/plain; charset=UTF-8; name="example.txt"
Content-Disposition: attachment; filename="example.txt"
Content-Transfer-Encoding: base64

ZXhhbXBsZQo=

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim()
      ).join('\n')
    );
  }

  // DELE 1
  // eslint-disable-next-line new-cap
  const dele1 = await t.context.pop3Command.DELE(1);

  t.is(dele1, 'message 1 deleted');

  // await t.context.pop3Command.command('QUIT');
});

// Add these tests to the end of test/pop3/index.js

test('POP3 DELE deletes message after QUIT', async (t) => {
  const { pop3Command, session, pop3 } = t.context;

  // Refresh session and append a message
  await pop3.refreshSession(session, 'POP3');

  await onAppendPromise.call(
    pop3,
    'INBOX',
    [],
    new Date(),
    `Subject: POP3 Delete Test\r\n\r\nBody`,
    session
  );

  // Reconnect to see the message
  await pop3Command.command('QUIT');

  t.context.pop3Command = new Pop3Command({
    user: `${t.context.alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });

  await t.context.pop3Command.connect();
  await t.context.pop3Command.command(
    'USER',
    `${t.context.alias.name}@${t.context.domain.name}`
  );
  await t.context.pop3Command.command('PASS', t.context.pass);

  // STAT should show 1 message
  // eslint-disable-next-line new-cap
  const stat1 = await t.context.pop3Command.STAT();
  t.regex(stat1, /^1 /, 'Should have 1 message before DELE');

  // DELE 1
  // eslint-disable-next-line new-cap
  const dele = await t.context.pop3Command.DELE(1);
  t.is(dele, 'message 1 deleted');

  // QUIT to expunge
  await t.context.pop3Command.command('QUIT');

  // Reconnect
  t.context.pop3Command = new Pop3Command({
    user: `${t.context.alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });

  await t.context.pop3Command.connect();
  await t.context.pop3Command.command(
    'USER',
    `${t.context.alias.name}@${t.context.domain.name}`
  );
  await t.context.pop3Command.command('PASS', t.context.pass);

  // STAT should now show 0
  // eslint-disable-next-line new-cap
  const stat2 = await t.context.pop3Command.STAT();
  t.is(stat2, '0 0', 'Message should be deleted after QUIT');

  // NOTE: this is commented out bc we don't actually delete yet
  const count = await Messages.countDocuments(pop3, session, {});
  t.is(count, 0);
});

test('POP3 RSET undeletes message', async (t) => {
  const { pop3Command, session, pop3 } = t.context;

  // Refresh session and append a message
  await pop3.refreshSession(session, 'POP3');

  await onAppendPromise.call(
    pop3,
    'INBOX',
    [],
    new Date(),
    `Subject: POP3 RSET Test\r\n\r\nBody`,
    session
  );

  // Reconnect
  await pop3Command.command('QUIT');

  t.context.pop3Command = new Pop3Command({
    user: `${t.context.alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });

  await t.context.pop3Command.connect();
  await t.context.pop3Command.command(
    'USER',
    `${t.context.alias.name}@${t.context.domain.name}`
  );
  await t.context.pop3Command.command('PASS', t.context.pass);

  // DELE 1
  // eslint-disable-next-line new-cap
  const dele = await t.context.pop3Command.DELE(1);
  t.is(dele, 'message 1 deleted');

  // RSET
  // eslint-disable-next-line new-cap
  const rset = await t.context.pop3Command.RSET();
  t.truthy(rset, 'RSET should succeed');

  // QUIT
  await t.context.pop3Command.command('QUIT');

  // Reconnect
  t.context.pop3Command = new Pop3Command({
    user: `${t.context.alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });

  await t.context.pop3Command.connect();
  await t.context.pop3Command.command(
    'USER',
    `${t.context.alias.name}@${t.context.domain.name}`
  );
  await t.context.pop3Command.command('PASS', t.context.pass);

  // Message should still exist (RSET undid the DELE)
  // eslint-disable-next-line new-cap
  const stat = await t.context.pop3Command.STAT();
  t.regex(stat, /^1 /, 'Message should still exist after RSET');
});

//
// A message a POP3 client downloads is marked read, and one it deletes is
// removed: WebSocket and push clients (webmail, the apps) are told once.
//
test('POP3 RETR and DELE are published to WebSocket and push clients', async (t) => {
  const { pop3Command, session, pop3, alias } = t.context;
  await pop3.refreshSession(session, 'POP3');
  for (const subject of ['read me', 'delete me'])
    await onAppendPromise.call(
      pop3,
      'INBOX',
      [],
      new Date(),
      `Subject: ${subject}\r\n\r\nBody`,
      session
    );

  const inbox = await Mailboxes.findOne(pop3, session, { path: 'INBOX' });

  // reconnect to see the messages
  await pop3Command.command('QUIT');
  t.context.pop3Command = new Pop3Command({
    user: `${alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });
  await t.context.pop3Command.connect();
  await t.context.pop3Command.command(
    'USER',
    `${alias.name}@${t.context.domain.name}`
  );
  await t.context.pop3Command.command('PASS', t.context.pass);

  const capture = utils.captureNotifications(t.context.client, alias.id);
  // eslint-disable-next-line new-cap
  await t.context.pop3Command.RETR(1);
  // eslint-disable-next-line new-cap
  await t.context.pop3Command.DELE(2);
  await t.context.pop3Command.command('QUIT');

  await pWaitFor(
    () =>
      capture.of('flagsUpdated').some((e) => e.flags.includes('\\Seen')) &&
      capture.of('messagesExpunged').length > 0,
    { timeout: ms('10s') }
  ).catch(() => {});
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
  capture.stop();

  const seen = capture
    .of('flagsUpdated')
    .filter((e) => e.flags.includes('\\Seen'));
  t.is(seen.length, 1);
  t.like(seen[0], {
    mailbox: inbox._id.toString(),
    path: 'INBOX',
    action: 'add',
    uids: [1]
  });

  const expunged = capture.of('messagesExpunged');
  t.is(expunged.length, 1);
  t.like(expunged[0], { path: 'INBOX', uids: [2] });

  // reconnect for afterEach
  t.context.pop3Command = new Pop3Command({
    user: `${alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });
  await t.context.pop3Command.connect();
});

test('POP3 RETR stops at the bandwidth limit', async (t) => {
  const { session, pop3, client, user } = t.context;
  await pop3.refreshSession(session, 'POP3');
  await onAppendPromise.call(
    pop3,
    'INBOX',
    [],
    new Date(),
    'Subject: POP3 Bandwidth Test\r\n\r\nBody',
    session
  );

  const connect = async () => {
    await t.context.pop3Command.command('QUIT');
    t.context.pop3Command = new Pop3Command({
      user: `${t.context.alias.name}@${t.context.domain.name}`,
      password: t.context.pass,
      host: 'localhost',
      port: t.context.port,
      tlsOptions
    });
    await t.context.pop3Command.connect();
    await t.context.pop3Command.command(
      'USER',
      `${t.context.alias.name}@${t.context.domain.name}`
    );
    await t.context.pop3Command.command('PASS', t.context.pass);
  };

  const day = new Date().toISOString().split('T')[0];
  const dailyKey = `bw_${config.env}:all:d:${day}:${user.id}`;

  // under the limit the message is downloaded and counted
  await connect();
  // eslint-disable-next-line new-cap
  const message = await t.context.pop3Command.RETR(1);
  t.regex(message, /POP3 Bandwidth Test/);
  await pWaitFor(async () => Number(await client.get(dailyKey)) > 0, {
    timeout: ms('5s')
  });

  // once the daily limit is used up it is refused
  await client.set(dailyKey, DAILY_LIMIT);
  await connect();
  // eslint-disable-next-line new-cap
  const err = await t.throwsAsync(t.context.pop3Command.RETR(1));
  t.regex(err.message, /Bandwidth limit reached/);

  // (a fresh connection for the QUIT after the test)
  t.context.pop3Command = new Pop3Command({
    user: `${t.context.alias.name}@${t.context.domain.name}`,
    password: t.context.pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });
  await t.context.pop3Command.connect();
});

//
// An alias without IMAP only sends mail, but mail apps need an incoming
// server to send mail: it signs in to an empty maildrop that is never stored
// (see helpers/imap/index.js).
//
test('an alias without IMAP signs in to an empty maildrop', async (t) => {
  const alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: t.context.domain._id,
      recipients: [t.context.user.email],
      has_imap: false
    })
    .create();
  const pass = await alias.createToken();
  await alias.save();

  const pop3Command = new Pop3Command({
    user: `${alias.name}@${t.context.domain.name}`,
    password: pass,
    host: 'localhost',
    port: t.context.port,
    tlsOptions
  });
  await pop3Command.connect();
  await pop3Command.command('USER', `${alias.name}@${t.context.domain.name}`);
  await pop3Command.command('PASS', pass);
  // eslint-disable-next-line new-cap
  t.is(await pop3Command.STAT(), '0 0');
  // eslint-disable-next-line new-cap
  t.deepEqual(await pop3Command.LIST(), []);
  await pop3Command.command('QUIT');

  // no mailbox was opened or created
  t.false(fs.existsSync(getPathToDatabase(alias)));
});

// a raw POP3 connection (see `connectRaw` in test/utils.js)
function connect(t) {
  return utils.connectRaw(
    t,
    { port: t.context.port, host: 'localhost' },
    /^\+OK/m
  );
}

// and one that has signed in
async function signIn(t) {
  const { alias, domain, pass } = t.context;
  const connection = await connect(t);
  connection.write(`USER ${alias.name}@${domain.name}\r\nPASS ${pass}\r\n`);
  await connection.until(/^\+OK maildrop has/m);
  return connection;
}

// what the server logs for the connections of a test (the lines it reads
// and writes among it)
function captureLog(t) {
  const { logger } = t.context.pop3;
  const { debug } = logger;
  const logged = [];
  logger.debug = (...args) => {
    logged.push(args.map(String).join(' '));
    return debug.apply(logger, args);
  };

  t.teardown(() => {
    logger.debug = debug;
  });
  return logged;
}

// the commands that were answered with no more than `+OK`
const answered = (connection) =>
  connection.output.split('\r\n').filter((line) => line === '+OK').length;

//
// The POP3 core read the next line when a command called back, from inside
// that call when the command is answered at once (NOOP, STAT), one level
// deeper for each line of what was written to the socket: a few thousand in
// one write (15 KB) ran out of stack, and the rest was not answered.  It
// reads every hundredth line from the event loop now, see
// patches/@zone-eu__wildduck@1.48.0.patch.
//
test('answers each of the commands of one write', async (t) => {
  const connection = await signIn(t);
  connection.write(`${'NOOP\r\n'.repeat(5000)}QUIT\r\n`);
  await Promise.race([connection.closed, delay(ms('30s'))]);
  t.is(answered(connection), 5000);
  t.regex(connection.output, /^\+OK Bye/m);
});

//
// The next line may be read from the event loop once the client has left:
// what it had sent by then was read with no session to read it for, an
// uncaught exception.  (The core has the same check where a lookup calls
// back.)
//
test('reads nothing more from a client that left', async (t) => {
  const { connections } = t.context.pop3.server;
  const count = connections.size;
  const connection = await signIn(t);
  // (while its first commands are answered it sends more, which the server
  // has by the time the client leaves, a turn later)
  connection.socket.once('data', () => {
    connection.write('STAT\r\n'.repeat(50));
    connection.socket.once('data', () => connection.socket.destroy());
  });
  connection.write('NOOP\r\n'.repeat(3000));
  await connection.closed;
  await pWaitFor(() => connections.size === count, { timeout: ms('10s') });
  await delay(100);

  const other = await connect(t);
  other.write('CAPA\r\n');
  await other.until(/^\.\r\n/m);
  t.is(connections.size, count + 1);
});

//
// (Every hundredth line, and not each: a client that writes its commands
// and leaves without waiting for the answers has them read in the turn they
// arrived in, a hundred of them at least, the QUIT that deletes among them.
// Read a turn apart, all but the first would be dropped when the connection
// closes.)
//
test('reads the commands that a client sent before it left', async (t) => {
  const { session, pop3 } = t.context;
  await pop3.refreshSession(session, 'POP3');
  await onAppendPromise.call(
    pop3,
    'INBOX',
    [],
    new Date(),
    'Subject: POP3 Leave Test\r\n\r\nBody',
    session
  );

  const connection = await signIn(t);
  t.regex(connection.output, /^\+OK maildrop has 1 message/m);
  connection.write(`${'NOOP\r\n'.repeat(50)}DELE 1\r\nQUIT\r\n`);
  connection.socket.destroy();

  await pWaitFor(
    async () => (await Messages.countDocuments(pop3, session, {})) === 0,
    { timeout: ms('5s') }
  ).catch(() => {});
  t.is(await Messages.countDocuments(pop3, session, {}), 0);
});

//
// Before it signs in, a client has a handful of commands to send.  Anyone
// could send them without end and never read the answers, which the server
// kept (half a megabyte more every second), busy all the while.
//
test('disconnects a client that sends many commands before it signs in', async (t) => {
  const anyone = await connect(t);
  anyone.write('CAPA\r\n'.repeat(150));
  await Promise.race([anyone.closed, delay(ms('10s'))]);
  t.true(anyone.socket.destroyed);
  t.is(anyone.output.split('+OK Capability list follows').length - 1, 100);
  t.regex(anyone.output, /^-ERR Too many commands before authentication/m);

  // (not one that has signed in)
  const known = await signIn(t);
  known.write(`${'NOOP\r\n'.repeat(150)}QUIT\r\n`);
  await Promise.race([known.closed, delay(ms('10s'))]);
  t.is(answered(known), 150);
  t.regex(known.output, /^\+OK Bye/m);
});

//
// A command may arrive in pieces.  The core dropped a piece that held no end
// of a line, and read the rest as a command of its own: the pieces are put
// together now, up to a length that no command has.
//
test('reads a command that arrives in pieces', async (t) => {
  const logged = captureLog(t);
  const connection = await connect(t);
  for (const piece of ['C', 'A', 'PA\r\nNO', 'OP\r\n']) {
    connection.write(piece);
    await delay(50);
  }

  await Promise.race([
    connection.until(/^-ERR Command not accepted/m),
    connection.closed
  ]);
  t.regex(connection.output, /^\+OK Capability list follows/m);
  t.regex(connection.output, /^-ERR Command not accepted/m);

  // (the start of a line is kept as it was read, not decoded on its own:
  // it may end inside a character, as here)
  const lines = Buffer.from('NOOP\r\nUSER éé@example.com\r\n');
  const cut = lines.indexOf('é') + 1;
  connection.write(lines.subarray(0, cut));
  await delay(50);
  connection.write(lines.subarray(cut));
  await connection.until(/^\+OK send PASS/m);
  t.true(logged.some((line) => line.endsWith('C: USER éé@example.com')));

  // (a line without an end is kept up to a length that no command has)
  const endless = await connect(t);
  endless.write('x'.repeat(8192));
  await delay(200);
  t.notRegex(endless.output, /^-ERR/m);
  t.false(endless.socket.destroyed);
  endless.write('x');
  await Promise.race([endless.closed, delay(ms('5s'))]);
  t.regex(endless.output, /^-ERR Line too long/m);
  t.true(endless.socket.destroyed);
});

//
// What a client signs in with is not written to the log.  The core hid the
// last word of the line only, and looked for it from every character of the
// line: one of 60 KB took seconds, before authentication.
//
test('logs none of what a client signs in with', async (t) => {
  const logged = captureLog(t);
  const connection = await connect(t);
  connection.write('USER someone\r\nPASS correct-horse battery-staple\r\n');
  await connection.until(/^-ERR/m);
  t.true(logged.some((line) => line.endsWith('C: PASS *hidden*')));
  t.false(logged.some((line) => /correct-horse|battery-staple/.test(line)));

  const other = await connect(t);
  const start = Date.now();
  other.write(`AUTH PLAIN ${'A'.repeat(60_000)} b\r\n`);
  await other.until(/^-ERR/m, ms('30s'));
  t.true(Date.now() - start < ms('1s'));
});

//
// What is sent between an STLS and its handshake is not the client's for
// sure (anyone between the two can add to what is not encrypted yet): the
// core read it as if it had been sent inside the session, once the handshake
// was done, a whole command or the start of one, which the first line of the
// client then ended.  It is not read now (the same patch).
//
test('reads nothing that was sent between an STLS and its handshake', async (t) => {
  for (const added of ['', 'USER someone\r\n', 'USER someone']) {
    const connection = await connect(t);
    connection.write(`STLS\r\n${added}`);
    await connection.until(/^\+OK Begin TLS/m);
    const session = await utils.startTLS(connection);
    t.truthy(session);
    session.write('CAPA\r\n');
    await session.until(/^(?:\.|\+OK send PASS)\r\n/m);
    t.is(session.output.split('\r\n')[0], '+OK Capability list follows');
    t.notRegex(session.output, /send PASS/);
    session.socket.destroy();
  }
});
