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
