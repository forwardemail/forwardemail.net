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
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const getPort = require('get-port');
const ip = require('ip');
const ms = require('ms');
const pify = require('pify');
const splitLines = require('split-lines');
const test = require('ava');
const { factory } = require('factory-girl');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const POP3 = require('../../pop3-server');

const Mailboxes = require('#models/mailboxes');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const onAppend = require('#helpers/imap/on-append');
const { encrypt } = require('#helpers/encrypt-decrypt');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const client = new Redis();
const subscriber = new Redis();
const tlsOptions = { rejectUnauthorized: false };
const IP_ADDRESS = ip.address();

subscriber.setMaxListeners(0);

test.before(utils.setupMongoose);
test.before(utils.defineUserFactory);
test.before(utils.defineDomainFactory);
test.before(utils.definePaymentFactory);
test.before(utils.defineAliasFactory);
//
// NOTE: we don't want to `client.flushall()`
//       because it will remove caching from mandarin
//       (and translations will need run from scratch again)
//
test.before(async () => {
  // imapLockNamespace
  // smtpLimitNamespace
  const [imapLockKeys, smtpLimitKeys] = await Promise.all([
    client.keys(`${config.imapLockNamespace}*`),
    client.keys(`${config.smtpLimitNamespace}*`)
  ]);
  await Promise.all([
    imapLockKeys.map((k) => client.del(k)),
    smtpLimitKeys.map((k) => client.del(k))
  ]);
});
test.after.always(utils.teardownMongoose);
test.beforeEach(async (t) => {
  const secure = false;
  t.context.secure = secure;
  const port = await getPort();
  const sqlitePort = await getPort();
  const sqlite = new SQLite({ client, subscriber });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  t.context.wsp = wsp;
  const pop3 = new POP3({ client, subscriber, wsp }, secure);
  t.context.port = port;
  t.context.server = await pop3.listen(port);
  t.context.pop3 = pop3;

  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  t.context.user = await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver: pop3.resolver,
    has_smtp: true
  });

  t.context.domain = domain;

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email],
    has_imap: true
  });

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
      true
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
    t.log('stat', stat);
    t.is(stat, '0 0');
  }

  // LIST
  {
    // eslint-disable-next-line new-cap
    const list = await t.context.pop3Command.LIST();
    t.log('list', list);
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
    t.log('retr1', retr1);
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
    t.log('stat', stat);
    t.is(stat, '1 645');
  }

  // LIST
  {
    // eslint-disable-next-line new-cap
    const list = await t.context.pop3Command.LIST();
    t.log('list', list);
    t.deepEqual(list, [['1', '645']]);
  }

  // RETR 1
  {
    // eslint-disable-next-line new-cap
    const retr1 = await t.context.pop3Command.RETR(1);
    t.log('retr1', retr1);
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
  t.log('dele1', dele1);

  t.is(dele1, 'message 1 deleted');
});
