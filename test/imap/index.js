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
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { createHash, randomUUID } = require('node:crypto');

const Axe = require('axe');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const ip = require('ip');
// const isCI = require('is-ci');
const ms = require('ms');
const openpgp = require('openpgp/dist/node/openpgp.js');
const pWaitFor = require('p-wait-for');
const splitLines = require('split-lines');
const test = require('ava');
const { ImapFlow } = require('imapflow');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const Attachments = require('#models/attachments');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const config = require('#config');
const env = require('#config/env');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getDatabase = require('#helpers/get-database');
const { encrypt } = require('#helpers/encrypt-decrypt');
const createPassword = require('#helpers/create-password');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const semaphore = new Semaphore(2);

const logger = new Axe({ silent: true });
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(async (t) => {
  t.context.permit = await semaphore.acquire();
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
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
  await wsp.open();
  t.context.wsp = wsp;
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    secure
  );
  t.context.port = port;
  t.context.server = await imap.listen(port);
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

  t.context.user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: imap.resolver,
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
    }
  };

  await wsp.request(
    {
      action: 'setup',
      session: t.context.session
    },
    0
  );

  t.context.alias = await alias.save();

  // spoof dns records
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

  // store spoofed dns cache
  await imap.resolver.options.cache.mset(map);

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port,
    secure,
    logger,
    tls,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    },
    commandTimeout: 120000 // Increased to 120 seconds
  });

  await imapFlow.connect();

  const key = `concurrent_imap_${config.env}:${t.context.alias.id}`;
  const count = await t.context.client.incrby(key, 0);
  t.is(count, 1);

  t.context.imapFlow = imapFlow;

  // create inbox
  // await t.context.imapFlow.mailboxCreate('INBOX');
  await getDatabase(imap, alias, t.context.session);
  const mailbox = await Mailboxes.findOne(t.context.imap, t.context.session, {
    path: 'INBOX'
  });
  t.is(mailbox.specialUse, '\\Inbox');
  t.is(mailbox.uidNext, 1);
});

test.afterEach(async (t) => {
  const key = `concurrent_imap_${config.env}:${t.context.alias.id}`;
  const pttlBefore = await t.context.client.pttl(key);
  t.true(pttlBefore > 0);
  await t.context.imapFlow.logout();
  await t.context.imap.close();
  await pWaitFor(
    async () => {
      const count = await t.context.client.incrby(key, 0);
      return count === 0;
    },
    { timeout: ms('3s') }
  );
  const pttlAfter = await t.context.client.pttl(key);
  t.true(pttlAfter > 0);
  t.true(pttlAfter < pttlBefore);
});

test.afterEach.always(async (t) => {
  await t.context.permit.release();
});

test('prevents domain-wide passwords', async (t) => {
  const { domain } = t.context;
  const { password, salt, hash } = await createPassword();
  domain.tokens.push({
    description: 'test',
    salt,
    hash,
    user: t.context.user._id
  });
  domain.locale = 'en';
  domain.resolver = t.context.imap.resolver;
  domain.skip_verification = true;
  await domain.save();
  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port: t.context.port,
    secure: t.context.secure,
    logger,
    tls,
    auth: {
      user: `test@${domain.name}`,
      pass: password
    }
  });
  const err = await t.throwsAsync(imapFlow.connect());
  t.true(err.authenticationFailed);
  t.regex(err.response, /Alias does not exist/);
});

test('onAppend with private PGP', async (t) => {
  // creates unique user/domain/alias
  // (otherwise would interfere with other tests)
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
      resolver: t.context.imap.resolver,
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

  const pass = await alias.createToken();

  const session = {
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
    }
  };

  await t.context.wsp.request(
    {
      action: 'setup',
      session
    },
    0
  );

  await alias.save();

  const { publicKey } = await openpgp.generateKey({
    type: 'ecc', // Type of the key, defaults to ECC
    curve: 'curve25519', // ECC curve name, defaults to curve25519
    userIDs: [{ name: '', email: `${alias.name}@${domain.name}` }], // you can pass multiple user IDs
    passphrase: 'super long and hard to guess secret', // protects the private key
    format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });

  alias.has_pgp = true;
  alias.public_key = publicKey;
  await alias.save();

  session.user.alias_has_pgp = alias.has_pgp;
  session.user.alias_public_key = alias.public_key;

  await getDatabase(t.context.imap, alias, session);

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );

  // store spoofed dns cache
  await t.context.imap.resolver.options.cache.mset(map);

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port: t.context.port,
    secure: t.context.secure,
    logger,
    tls,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  await imapFlow.connect();

  //
  // `mailboxCreate(path)` whereas `path` is parsed by `normalizePath` function
  // <https://github.com/postalsys/imapflow/blob/d48d0d84e169d0c4315e32d1d565c08f382cace7/lib/tools.js#L36-L52>
  //
  await imapFlow.mailboxCreate('append-with-private-pgp');

  let mailbox = await Mailboxes.findOne(t.context.imap, session, {
    path: 'append-with-private-pgp'
  });

  if (!mailbox) throw new Error('Mailbox does not exist');

  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

  const append = await imapFlow.append(
    'append-with-private-pgp',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );

  // <https://github.com/postalsys/imapflow/issues/146#issuecomment-1747958257>
  t.is(append.destination, 'append-with-private-pgp');
  t.is(append.uid, 1);
  t.is(append.uidValidity, BigInt(mailbox.uidValidity));

  mailbox = await Mailboxes.findById(t.context.imap, session, mailbox._id);

  t.is(mailbox.uidNext, 2);

  // ensure PGP encrypted message was stored
  const msg = await Messages.findOne(t.context.imap, session, {
    mailbox: mailbox._id,
    uid: append.uid
  });
  t.is(
    msg.mimeTree.body.toString().trim(),
    'This is an OpenPGP/MIME encrypted message'
  );
});

test('onAppend with public PGP', async (t) => {
  // creates unique user/domain/alias
  // (otherwise would interfere with other tests)
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
      // NOTE: this is a known email with openpgp
      name: 'forwardemail.net',
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.imap.resolver,
      has_smtp: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      // NOTE: this is a known email with openpgp
      name: 'support',
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true,
      has_pgp: true
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  const session = {
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
    }
  };

  await getDatabase(t.context.imap, alias, session);

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );

  // store spoofed dns cache
  await t.context.imap.resolver.options.cache.mset(map);

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port: t.context.port,
    secure: t.context.secure,
    logger,
    tls,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  await imapFlow.connect();

  //
  // `mailboxCreate(path)` whereas `path` is parsed by `normalizePath` function
  // <https://github.com/postalsys/imapflow/blob/d48d0d84e169d0c4315e32d1d565c08f382cace7/lib/tools.js#L36-L52>
  //
  await imapFlow.mailboxCreate('append-with-public-pgp');

  let mailbox = await Mailboxes.findOne(t.context.imap, session, {
    path: 'append-with-public-pgp'
  });

  if (!mailbox) throw new Error('Mailbox does not exist');

  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

  const append = await imapFlow.append(
    'append-with-public-pgp',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );

  // <https://github.com/postalsys/imapflow/issues/146#issuecomment-1747958257>
  t.is(append.destination, 'append-with-public-pgp');
  t.is(append.uid, 1);
  t.is(append.uidValidity, BigInt(mailbox.uidValidity));

  mailbox = await Mailboxes.findById(t.context.imap, session, mailbox._id);

  t.is(mailbox.uidNext, 2);

  // ensure PGP encrypted message was stored
  const msg = await Messages.findOne(t.context.imap, session, {
    mailbox: mailbox._id,
    uid: append.uid
  });
  t.is(
    msg.mimeTree.body.toString().trim(),
    'This is an OpenPGP/MIME encrypted message'
  );
});

test('onAppend', async (t) => {
  const { imapFlow, alias, domain } = t.context;

  //
  // `mailboxCreate(path)` whereas `path` is parsed by `normalizePath` function
  // <https://github.com/postalsys/imapflow/blob/d48d0d84e169d0c4315e32d1d565c08f382cace7/lib/tools.js#L36-L52>
  //
  await imapFlow.mailboxCreate('append');

  let mailbox = await Mailboxes.findOne(t.context.imap, t.context.session, {
    path: 'append'
  });

  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

  const append = await imapFlow.append(
    'append',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );

  // <https://github.com/postalsys/imapflow/issues/146#issuecomment-1747958257>
  t.is(append.destination, 'append');
  t.is(append.uid, 1);
  t.is(append.uidValidity, BigInt(mailbox.uidValidity));

  mailbox = await Mailboxes.findById(
    t.context.imap,
    t.context.session,
    mailbox._id
  );

  t.is(mailbox.uidNext, 2);
});

test('onCreate', async (t) => {
  const mailbox = await t.context.imapFlow.mailboxCreate('beep');
  t.deepEqual(mailbox, {
    path: 'beep',
    created: true
  });
});

test('onFetch', async (t) => {
  const client = new ImapFlow({
    host: IP_ADDRESS,
    port: t.context.port,
    secure: t.context.secure,
    logger,
    tls,
    auth: {
      user: `${t.context.alias.name}@${t.context.domain.name}`,
      pass: t.context.pass
    }
  });
  await client.connect();

  // create mailbox folder
  const mbox = await client.mailboxCreate(['INBOX', 'fetch', 'child']);
  t.is(mbox.path, 'INBOX/fetch/child');
  const mailbox = await Mailboxes.findOne(t.context.imap, t.context.session, {
    path: 'INBOX/fetch/child'
  });
  t.true(typeof mailbox === 'object');
  t.is(mailbox.path, 'INBOX/fetch/child');

  //
  // write a bunch of messages to the mailbox (with and without attachments)
  //
  await Promise.all(
    // 5 x 2 = 10
    Array.from({ length: 5 }).map((k, i) => {
      const raw1 = `
Message-ID: <f869239d-3a31-4cb1-b30a-8a697252beb3@forwardemail.net>
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: test-${i}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim();

      const raw2 = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: test-${i}

This is a multi-part message in MIME format.
--------------cWFvDSey27tFG0hVYLqp9hs9
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test-${i}

--------------cWFvDSey27tFG0hVYLqp9hs9
Content-Type: text/plain; charset=UTF-8; name="example.txt"
Content-Disposition: attachment; filename="example.txt"
Content-Transfer-Encoding: base64

ZXhhbXBsZQo=

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

      return Promise.all([
        client.append('INBOX/fetch/child', Buffer.from(raw1), [], new Date()),
        client.append('INBOX/fetch/child', Buffer.from(raw2), [], new Date())
      ]);
    })
  );

  const lock = await client.getMailboxLock('INBOX/fetch/child');

  try {
    // fetchOne
    // `exists` is the largest seq number available in mailbox

    // NOTE: we don't store `raw` anymore so this test won't work
    /*
    const message = await client.fetchOne(client.mailbox.exists, {
      source: true
    });
    const msg = await Messages.findOne(t.context.imap, t.context.session, {
      mailbox: mailbox._id,
      uid: message.uid
    });
    t.is(
      message.source.toString(),
      splitLines(msg.raw.toString()).join('\r\n')
    );
    */

    // fetch
    // uid is always included, envelope strings are in unicode
    for await (const message of client.fetch('1:*', { envelope: true })) {
      // NOTE: since emailId not working (should be message.id from db)
      t.is(
        message.id,
        createHash('md5')
          .update(
            [
              mailbox.path,
              mailbox.uidValidity.toString(),
              message.uid.toString()
            ].join(':')
          )
          .digest('hex')
      );
    }

    // fetch (with search)
    for await (const message of client.fetch(
      {
        or: [{ to: `${t.context.alias.name}@${t.context.domain.name}` }]
      },
      { envelope: true, uid: true },
      { uid: true }
    )) {
      // NOTE: since emailId not working (should be message.id from db)
      t.is(
        message.id,
        createHash('md5')
          .update(
            [
              mailbox.path,
              mailbox.uidValidity.toString(),
              message.uid.toString()
            ].join(':')
          )
          .digest('hex')
      );
    }
  } finally {
    lock.release();
  }

  // cleanup
  await client.logout();
});

test('onSubscribe', async (t) => {
  await t.context.imapFlow.mailboxCreate('subscribe');
  const z = await t.context.imapFlow.mailboxSubscribe('subscribe');
  t.is(z, true);
  const f = await t.context.imapFlow.mailboxSubscribe('subscribeFail');
  t.is(f, false);
});

test('onUnsubscribe', async (t) => {
  await t.context.imapFlow.mailboxCreate('unsubscribe');
  t.is(await t.context.imapFlow.mailboxSubscribe('unsubscribe'), true);
  t.is(await t.context.imapFlow.mailboxUnsubscribe('unsubscribe'), true);
  t.is(await t.context.imapFlow.mailboxUnsubscribe('unsubscribe'), true);
});

test('LIST', async (t) => {
  const result = await t.context.imapFlow.exec('LIST', ['', '*']);
  t.is(result.response.command, 'OK');
});

test('onGetQuotaRoot', async (t) => {
  // creates unique user/domain/alias for quota
  // (otherwise would interfere with other tests)
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
      resolver: t.context.imap.resolver,
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

  const pass = await alias.createToken();

  const session = {
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
    }
  };

  await t.context.wsp.request(
    {
      action: 'setup',
      session
    },
    0
  );

  await alias.save();

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );

  // store spoofed dns cache
  await t.context.imap.resolver.options.cache.mset(map);

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port: t.context.port,
    secure: t.context.secure,
    logger,
    tls,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  await imapFlow.connect();

  {
    await t.context.wsp.request(
      {
        action: 'size',
        timeout: ms('30s'),
        alias_id: alias.id
      },
      0
    );

    const storageUsed = await Aliases.getStorageUsed(alias);
    t.is(storageUsed, config.INITIAL_DB_SIZE);
    const quota = await t.context.imapFlow.getQuota();
    t.is(quota.path, 'INBOX');
    t.is(quota.storage.limit, config.maxQuotaPerAlias);
    t.is(quota.storage.status, '0%');
    t.is(quota.storage.usage, config.INITIAL_DB_SIZE);
    // TODO: figure out why config.INITIAL_DB_SIZE is sometimes off here (e.g. its sometimes 200704)
    // t.deepEqual(quota, {
    //   path: 'INBOX',
    //   storage: {
    //     usage: config.INITIAL_DB_SIZE, // isCI ? 200704 : config.INITIAL_DB_SIZE,
    //     limit: config.maxQuotaPerAlias,
    //     status: '0%'
    //   }
    // });
  }

  await imapFlow.mailboxCreate('boopboop');

  {
    await t.context.wsp.request(
      {
        action: 'size',
        timeout: ms('30s'),
        alias_id: alias.id
      },
      0
    );
    const storageUsed = await Aliases.getStorageUsed(alias);
    t.is(storageUsed, config.INITIAL_DB_SIZE);
    const quota = await imapFlow.getQuota('boopboop');
    t.deepEqual(quota, {
      path: 'boopboop',
      storage: {
        usage: config.INITIAL_DB_SIZE,
        limit: config.maxQuotaPerAlias,
        status: '0%'
      }
    });
  }

  t.is(await imapFlow.getQuota('beepdoesnotexist'), false);

  // add a message to ensure quota used
  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

  const append = await imapFlow.append(
    'boopboop',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );

  await getDatabase(t.context.imap, alias, session);

  const mailbox = await Mailboxes.findOne(t.context.imap, session, {
    path: append.destination
  });

  t.is(mailbox.path, append.destination);

  {
    await t.context.wsp.request(
      {
        action: 'size',
        timeout: ms('30s'),
        alias_id: alias.id
      },
      0
    );
    // const message = await Messages.findOne(t.context.imap, session, {
    //   mailbox: mailbox._id,
    //   uid: append.uid
    // });
    const storageUsed = await Aliases.getStorageUsed(alias);
    t.is(storageUsed, config.INITIAL_DB_SIZE);
    const quota = await imapFlow.getQuota('boopboop');
    t.deepEqual(quota, {
      path: 'boopboop',
      storage: {
        // message size is rounded to nearest 1024 bytes
        usage: config.INITIAL_DB_SIZE,
        limit: config.maxQuotaPerAlias,
        status: '0%'
      }
    });
  }
});

test('onGetQuota', async (t) => {
  await t.context.wsp.request(
    {
      action: 'size',
      timeout: ms('30s'),
      alias_id: t.context.alias.id
    },
    0
  );
  const quota = await t.context.imapFlow.getQuota();
  t.deepEqual(quota, {
    path: 'INBOX',
    storage: {
      usage: config.INITIAL_DB_SIZE,
      limit: config.maxQuotaPerAlias,
      status: '0%'
    }
  });
});

test('onCopy', async (t) => {
  // create a bunch of messages in copy folder
  await t.context.imapFlow.mailboxCreate('copy');
  for (let i = 0; i < 10; i++) {
    const raw = `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: test-${i}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim();

    await t.context.imapFlow.append('copy', Buffer.from(raw), [], new Date());
  }

  // connect to mailbox
  await t.context.imapFlow.mailboxOpen('copy');

  // attempt to copy messages to "backup" folder
  // when it doesn't yet exist results in a fail (false)
  const backupResult = await t.context.imapFlow.messageCopy('1:*', 'backup');
  t.is(backupResult, false);

  // copy all messages to a mailbox called "Backup" (must exist)
  await t.context.imapFlow.mailboxCreate('backup');
  const result = await t.context.imapFlow.messageCopy('1:*', 'backup');
  t.true(result !== false);
  t.is(result.path, 'copy');
  t.is(result.destination, 'backup');
  t.is(result.uidMap.size, 10);
});

// delete removes an entire mailbox
test('onDelete', async (t) => {
  const err = await t.throwsAsync(t.context.imapFlow.mailboxDelete('BOOPBAZ'));
  t.is(err.message, 'Command failed');
  t.regex(err.response, /NO \[NONEXISTENT] DELETE completed/);
  t.is(err.responseStatus, 'NO');
  t.is(err.responseText, 'DELETE completed');
  t.is(err.serverResponseCode, 'NONEXISTENT');
  await t.context.imapFlow.mailboxCreate('WUHWOH');
  await t.context.imapFlow.mailboxDelete('WUHWOH');

  // now attempt to create a mailbox with messages and delete it
  await t.context.imapFlow.mailboxCreate('DELETE-WITH-MESSAGES');
  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();
  await t.context.imapFlow.append(
    'DELETE-WITH-MESSAGES',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );
  await t.context.imapFlow.append(
    'DELETE-WITH-MESSAGES',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );
  await t.context.imapFlow.append(
    'DELETE-WITH-MESSAGES',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );
  await t.context.imapFlow.append(
    'DELETE-WITH-MESSAGES',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );
  await t.context.imapFlow.mailboxDelete('DELETE-WITH-MESSAGES');
});

// expunge deletes messages
test('onExpunge', async (t) => {
  await t.context.imapFlow.mailboxCreate('expunge');

  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

  await t.context.imapFlow.append(
    'expunge',
    Buffer.from(raw),
    ['\\Seen'],
    new Date()
  );

  const mailbox = await Mailboxes.findOne(t.context.imap, t.context.session, {
    path: 'expunge'
  });

  t.is(mailbox.path, 'expunge');

  // note that a message won't get marked as deleted
  // since it has to have a Deleted flag at first
  const uids = await Messages.distinct(
    t.context.imap,
    t.context.session,
    'uid',
    {
      mailbox: mailbox._id,
      undeleted: true
    }
  );

  t.is(uids.length, 1);

  await t.context.imapFlow.mailboxOpen('expunge');

  const result = await t.context.imapFlow.messageFlagsAdd(
    uids,
    ['\\Deleted', 'NonJunk'],
    // <https://github.com/postalsys/imapflow/issues/21#issuecomment-658773009>
    { uid: true }
  );
  t.true(result);

  let data;
  t.context.imapFlow.on('expunge', (_data) => {
    data = _data;
  });

  const res = await t.context.imapFlow.messageDelete({ all: true });

  t.true(res);

  if (!data) await pWaitFor(() => Boolean(data), { timeout: ms('30s') });

  t.is(data.path, 'expunge');
  t.is(data.vanished, false);
  t.is(data.seq, 1);
});

// NOTE: onLsub is taken care of by onSubscribe and unSubscribe
// test('onLsub', async (t) => {});

test('onMove', async (t) => {
  // create a bunch of messages in move folder
  await t.context.imapFlow.mailboxCreate('move');
  for (let i = 0; i < 10; i++) {
    const raw = `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: test-${i}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim();

    await t.context.imapFlow.append('move', Buffer.from(raw), [], new Date());
  }

  // connect to mailbox
  await t.context.imapFlow.mailboxOpen('move');

  // attempt to move messages to "was-moved" folder
  // when it doesn't yet exist results in a fail (false)
  t.is(await t.context.imapFlow.messageMove('1:*', 'was-moved'), false);

  // move all messages to a mailbox called "was-moved" (ust exist)
  await t.context.imapFlow.mailboxCreate('was-moved');
  const result = await t.context.imapFlow.messageMove('1:*', 'was-moved');
  t.is(result.path, 'move');
  t.is(result.destination, 'was-moved');
  t.is(result.uidMap.size, 10);
});

test('onOpen', async (t) => {
  await t.context.imapFlow.mailboxCreate('opened');
  const result = await t.context.imapFlow.mailboxOpen('opened');
  t.is(result.path, 'opened');
});

test('onRename', async (t) => {
  await t.context.imapFlow.mailboxCreate(['parent', 'child']);
  const info = await t.context.imapFlow.mailboxRename(
    'parent/child',
    'important'
  );
  t.is(info.path, 'parent/child');
  t.is(info.newPath, 'important');
});

test('onSearch', async (t) => {
  await t.context.imapFlow.mailboxCreate('searchwoowoo');

  // create a bunch of seen and unseen messages
  for (let i = 0; i < 10; i++) {
    const raw = `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${t.context.alias.name}@${t.context.domain.name}
From: Linus <${t.context.alias.name}@${t.context.domain.name}>
Subject: Beep Baz Boop unseen-test-${i}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test Snap Ya Ya Ya
`.trim();

    await t.context.imapFlow.append(
      'searchwoowoo',
      Buffer.from(raw),
      [],
      new Date()
    );
  }

  for (let i = 0; i < 10; i++) {
    const raw = `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: seen-test-${i}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim();

    await t.context.imapFlow.append(
      'searchwoowoo',
      Buffer.from(raw),
      ['\\Seen'],
      new Date()
    );
  }

  await t.context.imapFlow.mailboxOpen('searchwoowoo');

  // find all unseen messages
  const list1 = await t.context.imapFlow.search({ seen: true });
  // use OR modifier (array of 2 or more search queries)
  const list2 = await t.context.imapFlow.search({
    seen: false,
    or: [{ flagged: true }, { from: 'linus' }]
  });
  t.is(list1.length, 10);
  t.is(list2.length, 0);
  t.notDeepEqual(list1, list2);

  //
  // iterate over all possible search params for maximum coverage
  // (we can further refine this in the future)
  //

  // booleans
  for (const key of [
    'answered',
    'deleted',
    'draft',
    'flagged',
    'seen',
    'all',
    'new',
    'old',
    'recent'
  ]) {
    await t.context.imapFlow.search({ [key]: false });

    await t.context.imapFlow.search({ [key]: true });
  }

  // strings (e.g. $text search)
  for (const key of [
    'to',
    'from',
    'cc',
    'bcc',
    'text',
    'body',
    'subject',
    'keyword',
    'unKeyword' // TODO: (?)
  ]) {
    await t.context.imapFlow.search({ [key]: 'test' });
  }

  // size
  for (const key of ['larger', 'smaller']) {
    await t.context.imapFlow.search({ [key]: 100 });
  }

  // dates
  for (const key of [
    'before',
    'on',
    'since',
    'sentBefore',
    'sentOn',
    'sentSince'
  ]) {
    await t.context.imapFlow.search({ [key]: new Date(Date.now() + 10000) });
  }
});

test('onStatus', async (t) => {
  await t.context.imapFlow.mailboxCreate('yoyo');

  // create a bunch of seen and unseen messages
  for (let i = 0; i < 10; i++) {
    const raw = `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: unseen-test-${i}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim();

    await t.context.imapFlow.append('yoyo', Buffer.from(raw), [], new Date());
  }

  for (let i = 0; i < 10; i++) {
    const raw = `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${t.context.alias.name}@${t.context.domain.name}
From: ${t.context.alias.name}@${t.context.domain.name}
Subject: seen-test-${i}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim();

    await t.context.imapFlow.append(
      'yoyo',
      Buffer.from(raw),
      ['\\Seen'],
      new Date()
    );
  }

  await t.context.imapFlow.mailboxOpen('yoyo');
  const status = await t.context.imapFlow.status('yoyo', {
    messages: true,
    unseen: true
  });
  t.is(status.path, 'yoyo');
  t.is(status.messages, 20);
  t.is(status.unseen, 10);
});

test('message flags set', async (t) => {
  await t.context.imapFlow.mailboxCreate('flag-set');

  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

  await t.context.imapFlow.append(
    'flag-set',
    Buffer.from(raw),
    ['\\Seen', '\\Flagged', '\\Draft'],
    new Date()
  );

  await t.context.imapFlow.mailboxOpen('flag-set');

  t.true(
    await t.context.imapFlow.messageFlagsSet({ all: true }, ['\\Deleted'])
  );

  const mailbox = await Mailboxes.findOne(t.context.imap, t.context.session, {
    path: 'flag-set'
  });

  t.is(mailbox.path, 'flag-set');

  const message = await Messages.findOne(t.context.imap, t.context.session, {
    mailbox: mailbox._id
  });

  t.deepEqual(message.flags, ['\\Deleted']);
});

test('message flags remove', async (t) => {
  await t.context.imapFlow.mailboxCreate('flag-remove');

  const raw = `
Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
MIME-Version: 1.0
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

--------------cWFvDSey27tFG0hVYLqp9hs9--`.trim();

  await t.context.imapFlow.append(
    'flag-remove',
    Buffer.from(raw),
    ['\\Seen', '\\Flagged', '\\Draft'],
    new Date()
  );

  await t.context.imapFlow.mailboxOpen('flag-remove');

  // download latest to test attachment storage
  const download = await t.context.imapFlow.download('*');
  t.true(_.isObject(download) && !_.isEmpty(download));
  const content = await getStream(download.content);
  t.deepEqual(
    _.compact(splitLines(raw)).join(''),
    _.compact(splitLines(content)).join('')
  );

  t.true(
    await t.context.imapFlow.messageFlagsRemove({ all: true }, ['\\Flagged'])
  );

  const mailbox = await Mailboxes.findOne(t.context.imap, t.context.session, {
    path: 'flag-remove'
  });

  t.is(mailbox.path, 'flag-remove');

  const message = await Messages.findOne(t.context.imap, t.context.session, {
    mailbox: mailbox._id
  });

  t.deepEqual(message.flags, ['\\Seen', '\\Draft']);
});

test('sync', async (t) => {
  await t.context.wsp.request(
    {
      action: 'sync',
      timeout: ms('10s'),
      session: t.context.session
    },
    0
  );
  t.pass();
});

test('temporary storage', async (t) => {
  // add some messages to tmp
  const now = new Date();
  const subject = randomUUID();
  const raw = Buffer.from(
    `
Date: ${now.toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: foo@foo.com
From: beep@beep.com
Subject: ${subject}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test
`.trim()
  );

  const result = await t.context.wsp.request(
    {
      action: 'tmp',
      aliases: [
        {
          address: `${t.context.alias.name}@${t.context.domain.name}`,
          id: t.context.alias.id
        }
      ],
      remoteAddress: IP_ADDRESS,
      date: now.toISOString(),
      raw
    },
    0
  );

  // errors should be empty object
  t.deepEqual(result, {});

  await t.context.wsp.request(
    {
      action: 'sync',
      session: t.context.session
    },
    0
  );

  // t.is(result.date, now.toISOString());
  // t.is(result.raw.type, 'Buffer');
  // t.deepEqual(raw, Buffer.from(result.raw.data));
  // t.is(result.remoteAddress, IP_ADDRESS);
  // t.true(typeof result._id === 'string');
  // t.true(typeof result.created_at === 'string');
  // t.true(typeof result.updated_at === 'string');

  // leverage existing connection to fetch
  await t.context.imapFlow.mailboxOpen('INBOX');

  // ensure message stored
  const msg = await Messages.findOne(t.context.imap, t.context.session, {
    subject
  });

  t.true(msg !== null);
  t.is(msg.subject, subject);
});

test('large mailbox', async (t) => {
  const { imapFlow, alias, domain } = t.context;

  let mailbox = await Mailboxes.findOne(t.context.imap, t.context.session, {
    path: 'INBOX'
  });

  const existingRaw = `Date: ${new Date().toISOString()}
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
Subject: test
Mime-Version: 1.0
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

`;
  const randomString = Array.from({
    length: bytes(env.SMTP_MESSAGE_MAX_SIZE) - existingRaw.length
  }).join('a');

  //
  // TODO: if we have the below then attachment gets created
  //
  /*
  const raw = `
Date: ${new Date().toISOString()}
MIME-Version: 1.0
Content-Language: en-US
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
Subject: test
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

${randomString}`.trim();
  */

  const raw = Buffer.from(`${existingRaw}${randomString}`.trim());

  await imapFlow.append('INBOX', raw, [], new Date());

  const storageUsed = await Aliases.getStorageUsed(alias);
  // t.is(storageUsed, bytes(env.SMTP_MESSAGE_MAX_SIZE) * 2);
  t.true(storageUsed >= bytes(env.SMTP_MESSAGE_MAX_SIZE) * 2);

  mailbox = await Mailboxes.findById(
    t.context.imap,
    t.context.session,
    mailbox._id
  );

  t.is(mailbox.uidNext, 2);

  for (let i = 0; i < 10; i++) {
    const raw = Buffer.from(
      `Date: ${new Date().toISOString()}
To: ${alias.name}@${domain.name}
From: ${alias.name}@${domain.name}
Subject: test #${i}
Mime-Version: 1.0
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

${i}`.trim()
    );

    await imapFlow.append('INBOX', raw, [], new Date());
  }

  await imapFlow.mailboxOpen('INBOX');

  const uids = [];
  for await (const message of imapFlow.fetch('1:*', {
    envelope: true
  })) {
    uids.push(message.uid);
  }

  for (const uid of uids) {
    // <https://github.com/postalsys/imapflow/issues/203>

    const stream = await imapFlow.download(uid, undefined, {
      chunkSize: 12500049
    });

    await getStream(stream.content);
  }
});

test('jpeg', async (t) => {
  await t.context.imapFlow.mailboxCreate('jpg');
  await t.context.imapFlow.mailboxOpen('jpg');
  const base64image = fs
    .readFileSync(path.join(__dirname, 'test.jpeg'))
    .toString('base64');
  t.is(base64image.length, 169996);
  const raw = `
Content-Type: multipart/mixed; boundary="------------CCi27vuUgvvY8z40K2vKMsFm"
Message-ID: <85c6ad5f-915a-47ab-b32b-2dd4a7ca4602@forwardemail.net>
Date: Wed, 5 Feb 2025 15:44:07 -0600
MIME-Version: 1.0
Content-Language: en-US
To: jpg@forwardemail.dev
From: Forward Email <support@forwardemail.net>
Subject: test

This is a multi-part message in MIME format.
--------------CCi27vuUgvvY8z40K2vKMsFm
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test

--------------CCi27vuUgvvY8z40K2vKMsFm
Content-Type: image/jpeg; name="test.jpeg"
Content-Disposition: attachment; filename="test.jpeg"
Content-Transfer-Encoding: base64

${base64image}
--------------CCi27vuUgvvY8z40K2vKMsFm--
`.trim();

  await t.context.imapFlow.append('jpg', Buffer.from(raw), [], new Date());

  // ensure that the attachment is stored properly
  const attachments = await Attachments.find(
    t.context.imap,
    t.context.session,
    { size: base64image.length }
  );
  t.is(attachments.length, 1);
  const base64 = Buffer.from(attachments[0].body, 'hex');
  t.is(base64.length, base64image.length);
  t.is(base64.toString(), base64image);

  await t.context.imapFlow.mailboxOpen('jpg');
  const download = await t.context.imapFlow.download('*');
  const content = await getStream(download.content);
  t.true(splitLines(raw).join('') === splitLines(content).join(''));
});

test('imap_flag_consistency_test', async (t) => {
  const { imapFlow, alias, domain } = t.context;
  const mailboxPath = 'INBOX'; // Or a dedicated test mailbox

  // 1. Append multiple messages
  const messageContent1 = `To: ${alias.name}@${domain.name}\nFrom: test1@example.com\nSubject: Test Message 1\n\nBody 1`;
  const messageContent2 = `To: ${alias.name}@${domain.name}\nFrom: test2@example.com\nSubject: Test Message 2\n\nBody 2`;
  const messageContent3 = `To: ${alias.name}@${domain.name}\nFrom: test3@example.com\nSubject: Test Message 3\n\nBody 3`;

  await imapFlow.append(
    mailboxPath,
    Buffer.from(messageContent1),
    [],
    new Date()
  );
  await imapFlow.append(
    mailboxPath,
    Buffer.from(messageContent2),
    [],
    new Date()
  );
  await imapFlow.append(
    mailboxPath,
    Buffer.from(messageContent3),
    [],
    new Date()
  );

  // Open mailbox to get message counts and UIDs if needed for store by UID
  await imapFlow.mailboxOpen(mailboxPath);
  t.is(imapFlow.mailbox.exists, 3, 'Should have 3 messages initially');

  // 2. Initial Flag Verification (Optional)
  let messages = [];
  for await (const msg of imapFlow.fetch('1:*', { flags: true })) {
    messages.push(msg);
  } // End of first fetch loop

  // Assuming UIDs are 1, 2, 3. If using sequence numbers, ensure mailbox is open.
  // Using sequence number for simplicity here, ensure mailbox is selected.
  await imapFlow.messageFlagsAdd('2', ['\\Answered']);
  // Or using UID: const storeResult = await imapFlow.messageStore("2", { flags: ["\\Answered"] }, { byUid: true });
  // Check storeResult if necessary, though the main check is fetching flags again.

  // 4. Verify Flags on All Messages
  messages = [];
  for await (const msg of imapFlow.fetch('1:*', { flags: true })) {
    messages.push(msg);
  }

  t.is(messages.length, 3, 'Should still have 3 messages');

  // Message 1 (sequence 1) should NOT be answered
  t.false(
    messages[0].flags.has('\\Answered'),
    'Msg 1 (seq 1) should NOT have \\Answered flag'
  );

  // Message 2 (sequence 2) SHOULD be answered
  t.true(
    messages[1].flags.has('\\Answered'),
    'Msg 2 (seq 2) SHOULD have \\Answered flag'
  );

  // Message 3 (sequence 3) should NOT be answered
  t.false(
    messages[2].flags.has('\\Answered'),
    'Msg 3 (seq 3) should NOT have \\Answered flag'
  );
});

test('imap_flag_consistency_large_mailbox_test', async (t) => {
  const { imapFlow, alias, domain } = t.context;
  const mailboxPath = 'INBOX'; // Or a dedicated test mailbox
  const numberOfMessages = 150; // Using 150 messages for a large mailbox test
  const targetMessageSequence = Math.floor(numberOfMessages / 2) + 1; // e.g., message 76 for 150 messages

  // 1. Append many messages
  t.log(`Appending ${numberOfMessages} messages...`);
  for (let i = 1; i <= numberOfMessages; i++) {
    const messageContent = `To: ${alias.name}@${domain.name}\nFrom: testuser${i}@example.com\nSubject: Large Mailbox Test Message ${i}\n\nThis is body of message ${i}.`;

    await imapFlow.append(
      mailboxPath,
      Buffer.from(messageContent),
      [],
      new Date()
    );
  }

  t.log(`${numberOfMessages} messages appended.`);

  // 2. Open Mailbox and verify count
  await imapFlow.mailboxOpen(mailboxPath);
  t.is(
    imapFlow.mailbox.exists,
    numberOfMessages,
    `Should have ${numberOfMessages} messages initially after append`
  );

  // 3. Initial Flag Verification (Optional but good for sanity)
  t.log('Verifying initial flags...');
  const initialMessages = [];
  for await (const msg of imapFlow.fetch(`1:${numberOfMessages}`, {
    flags: true
  })) {
    initialMessages.push(msg);
  }

  t.is(
    initialMessages.length,
    numberOfMessages,
    'Fetched all messages for initial flag check'
  );
  for (const initialMessage of initialMessages) {
    t.false(
      initialMessage.flags.has('\\Answered'),
      `Msg ${initialMessage.seq} should not have Answered flag initially`
    );
  }

  t.log('Initial flags verified.');

  // 4. Mark One Message as Answered
  t.log(
    `Marking message with sequence number ${targetMessageSequence} as \\Answered...`
  );
  await imapFlow.messageFlagsAdd(targetMessageSequence.toString(), [
    '\\Answered'
  ]);
  t.log(`Message ${targetMessageSequence} marked.`);

  // 5. Verify Flags on All Messages Post-Update
  t.log('Verifying flags on all messages post-update...');
  const updatedMessages = [];
  for await (const msg of imapFlow.fetch(`1:${numberOfMessages}`, {
    flags: true
  })) {
    updatedMessages.push(msg);
  }

  t.is(
    updatedMessages.length,
    numberOfMessages,
    'Fetched all messages for final flag check'
  );

  let unexpectedAnsweredFlags = 0;
  for (const updatedMessage of updatedMessages) {
    const currentMessageSeq = updatedMessage.seq;
    if (currentMessageSeq === targetMessageSequence) {
      t.true(
        updatedMessage.flags.has('\\Answered'),
        `Target Msg ${currentMessageSeq} SHOULD have \\Answered flag`
      );
    } else {
      if (updatedMessage.flags.has('\\Answered')) {
        unexpectedAnsweredFlags++;
        t.log(
          `ERROR: Msg ${currentMessageSeq} UNEXPECTEDLY has \\Answered flag`
        );
      }

      t.false(
        updatedMessage.flags.has('\\Answered'),
        `Msg ${currentMessageSeq} should NOT have \\Answered flag`
      );
    }
  }

  t.is(
    unexpectedAnsweredFlags,
    0,
    'No other messages should have the \\Answered flag'
  );
  t.log('All flags verified post-update.');
});

test('imap_thunderbird_simulation_answered_flag_large_mailbox', async (t) => {
  t.log(
    'Starting imap_thunderbird_simulation_answered_flag_large_mailbox test'
  );
  // eslint-disable-next-line unicorn/prefer-add-event-listener
  t.context.imapFlow.onerror = (err) => {
    console.error(
      'IMAPFlow client error during test imap_thunderbird_simulation_answered_flag_large_mailbox:',
      err
    );
    t.log('IMAPFlow client error occurred');
  };

  const { imapFlow, alias, domain } = t.context;
  const mailboxName = `INBOX`;
  const client = imapFlow;
  t.log('IMAP client initialized.');

  if (client.mailbox?.path === mailboxName) {
    t.log(`${mailboxName} is already open.`);
  } else {
    t.log(
      `Mailbox path is ${client.mailbox?.path}, attempting to open ${mailboxName}`
    );
    await client.mailboxOpen(mailboxName);
    t.log(`${mailboxName} opened.`);
  }

  t.log(`Attempting to get lock for ${mailboxName}`);
  const lock = await client.getMailboxLock(mailboxName);
  t.log(`Lock for ${mailboxName} acquired.`);

  try {
    const numMessages = 200;
    const targetMessageSequence = 101;

    t.log(`Populating ${mailboxName} with ${numMessages} messages...`);
    for (let i = 1; i <= numMessages; i++) {
      const subject = `Test Email Large Sim ${i}`;
      const body = `This is test email number ${i} for the large mailbox simulation.`;
      const message = `Subject: ${subject}\r\nTo: ${alias.name}@${domain.name}\r\nFrom: testuser${i}@example.com\r\n\r\n${body}`;

      await client.append(mailboxName, Buffer.from(message), []);
      if (i % 50 === 0 || i === numMessages) {
        t.log(`Appended ${i} of ${numMessages} messages to ${mailboxName}.`);
      }
    }

    t.log(`${numMessages} messages appended to ${mailboxName}.`);

    t.log(`Fetching status for ${mailboxName} to verify message count.`);
    await client.mailboxOpen(mailboxName);
    t.log(
      `Mailbox ${mailboxName} re-opened/selected. Current message count: ${client.mailbox.exists}`
    );
    t.is(
      client.mailbox.exists,
      numMessages,
      `Should have ${numMessages} messages after append in ${mailboxName}. Actual: ${client.mailbox.exists}`
    );

    t.log(`Determining UID for target sequence ${targetMessageSequence}...`);
    let targetUid = null;
    const fetchedMessagesForUidScan = [];
    for await (const msg of client.fetch(`1:${numMessages}`, {
      uid: true,
      seq: true
    })) {
      fetchedMessagesForUidScan.push(msg);
      if (msg.seq === targetMessageSequence) {
        targetUid = msg.uid;
      }
    }

    t.log(
      `Scanned ${fetchedMessagesForUidScan.length} messages to find UID for sequence ${targetMessageSequence}.`
    );
    t.truthy(
      targetUid,
      `Target UID for message sequence ${targetMessageSequence} should be found. Messages scanned: ${fetchedMessagesForUidScan
        .map((m) => `seq ${m.seq} uid ${m.uid}`)
        .join(', ')}`
    );
    if (!targetUid) {
      t.fail(
        `Could not determine UID for target sequence ${targetMessageSequence}. Aborting test.`
      );
      return;
    }

    t.log(
      `Target message sequence ${targetMessageSequence} has UID ${targetUid}.`
    );

    t.log(`Fetching initial flags for UID ${targetUid}.`);
    const initialTargetFlagsMsg = await client.fetchOne(targetUid.toString(), {
      flags: true,
      uid: true
    });

    t.truthy(
      initialTargetFlagsMsg,
      `Should fetch message with UID ${targetUid} to check initial flags.`
    );
    if (initialTargetFlagsMsg) {
      t.false(
        initialTargetFlagsMsg.flags.has('\\Answered'),
        `Msg UID ${targetUid} (seq ${targetMessageSequence}) should NOT initially have \\Answered flag. Current flags: ${[
          ...initialTargetFlagsMsg.flags
        ].join(', ')}`
      );
    }

    t.log(`Initial flags for UID ${targetUid} verified (not \\Answered).`);

    t.log(`Adding \\Answered flag to UID ${targetUid}.`);
    await client.messageFlagsAdd(targetUid.toString(), ['\\Answered'], {
      uid: true
    });
    t.log(`\\Answered flag added to UID ${targetUid}.`);

    t.log('Verifying flags on all messages post-update...');
    const allMessagesPostUpdate = [];
    for await (const msg of client.fetch(`1:${numMessages}`, {
      flags: true,
      uid: true,
      seq: true
    })) {
      allMessagesPostUpdate.push(msg);
    }

    t.is(
      allMessagesPostUpdate.length,
      numMessages,
      'Fetched all messages for final flag check'
    );
    t.log(
      `Fetched ${allMessagesPostUpdate.length} messages for final verification.`
    );

    let unexpectedAnsweredFlags = 0;
    let foundTargetFlagged = false;
    for (const msg of allMessagesPostUpdate) {
      if (msg.uid === targetUid) {
        foundTargetFlagged = true;
        t.true(
          msg.flags.has('\\Answered'),
          `Target Msg UID ${msg.uid} (seq ${
            msg.seq
          }) SHOULD have \\Answered flag. Flags: ${[...msg.flags].join(', ')}`
        );
      } else if (msg.flags.has('\\Answered')) {
        t.log(
          `ERROR: Msg UID ${msg.uid} (seq ${
            msg.seq
          }) UNEXPECTEDLY has \\Answered flag. Flags: ${[...msg.flags].join(
            ', '
          )}`
        );
        unexpectedAnsweredFlags++;
      }
    }

    t.true(
      foundTargetFlagged,
      `The target message (UID ${targetUid}) must be found in the final verification set.`
    );

    if (unexpectedAnsweredFlags > 0) {
      t.fail(
        `Found ${unexpectedAnsweredFlags} messages unexpectedly flagged as \\Answered. This indicates the bug is reproduced.`
      );
    } else {
      t.pass(
        `No other messages were unexpectedly flagged. Target message UID ${targetUid} correctly flagged.`
      );
    }

    t.log('Flag verification complete.');
  } catch (err) {
    t.log(
      `Test execution failed with error: ${err.message}. Stack: ${err.stack}`
    );
    t.fail(`Test failed with error: ${err.message}\nStack: ${err.stack}`);
  } finally {
    if (lock) {
      t.log(`Releasing lock for ${mailboxName}.`);
      await lock.release();
      t.log(`Lock for ${mailboxName} released.`);
    }

    t.log(
      'Exiting imap_thunderbird_simulation_answered_flag_large_mailbox test.'
    );
  }
});

test('imap_sequence_store_single_message_flag_consistency', async (t) => {
  const { imapFlow, alias, domain } = t.context;
  const mailboxPath = 'INBOX';

  // 1. Setup: Append 5 messages
  const numMessages = 5;
  const appendedMessages = [];
  for (let i = 0; i < numMessages; i++) {
    const raw = `To: ${alias.name}@${
      domain.name
    }\nFrom: test@example.com\nSubject: Test Message ${
      i + 1
    }\n\nThis is test message ${i + 1}.`;

    const appendResult = await imapFlow.append(
      mailboxPath,
      Buffer.from(raw),
      [],
      new Date()
    );
    appendedMessages.push(appendResult);
    t.log(`Appended message ${i + 1}, UID: ${appendResult.uid}`);
  }

  // 2. Client Connect & Initial State Fetch
  // Connection is already established in beforeEach
  // Select INBOX (usually default, but good to be explicit if needed, though append implies selection)
  const lock = await imapFlow.getMailboxLock(mailboxPath);
  try {
    t.log('Fetching initial state of all messages...');
    const initialMessagesState = [];
    for await (const msg of imapFlow.fetch('1:*', {
      uid: true,
      flags: true,
      envelope: true
    })) {
      initialMessagesState.push({
        uid: msg.uid,
        flags: new Set(msg.flags),
        seq: msg.seq,
        subject: msg.envelope.subject
      });
    }

    t.is(
      initialMessagesState.length,
      numMessages,
      'Should have fetched initial state for all messages'
    );
    t.log(
      'Initial messages state:',
      initialMessagesState.map((m) => ({
        seq: m.seq,
        uid: m.uid,
        flags: [...m.flags]
      }))
    );

    // 3. Target Selection
    const targetSeq = 3; // Target the 3rd message by sequence number
    const targetMessageInitial = initialMessagesState.find(
      (m) => m.seq === targetSeq
    );
    if (!targetMessageInitial) {
      t.fail(
        `Could not find message with sequence number ${targetSeq} in initial fetch.`
      );
      return;
    }

    const targetUid = targetMessageInitial.uid;
    t.log(`Targeting message with Seq: ${targetSeq}, UID: ${targetUid}`);

    // 4. Client Action (STORE by Sequence Number)
    const flagToAdd = '\\Flagged';
    t.log(`Adding flag '${flagToAdd}' to message with Seq: ${targetSeq}`);
    // Using 'STORE <sequence> +FLAGS (<flag>)' equivalent
    // imapflow's store command takes a sequence set string
    const storeResult = await imapFlow.messageFlagsAdd(String(targetSeq), [
      flagToAdd
    ]);
    t.log('Store command result:', storeResult);
    // storeResult for imapflow is an array of objects like [{seq, flags, uid (if fetched)}]
    // We should verify the command was successful, though imapflow throws on error.

    // 5. Verification
    t.log('Fetching final state of all messages...');
    const finalMessagesState = [];
    for await (const msg of imapFlow.fetch('1:*', {
      uid: true,
      flags: true,
      envelope: true
    })) {
      finalMessagesState.push({
        uid: msg.uid,
        flags: new Set(msg.flags),
        seq: msg.seq,
        subject: msg.envelope.subject
      });
    }

    t.is(
      finalMessagesState.length,
      numMessages,
      'Should have fetched final state for all messages'
    );
    t.log(
      'Final messages state:',
      finalMessagesState.map((m) => ({
        seq: m.seq,
        uid: m.uid,
        flags: [...m.flags]
      }))
    );

    // Assertion 1 (Target Message)
    const targetMessageFinal = finalMessagesState.find(
      (m) => m.uid === targetUid
    );
    if (!targetMessageFinal) {
      t.fail(`Could not find target message UID ${targetUid} in final fetch.`);
      return;
    }

    t.true(
      targetMessageFinal.flags.has(flagToAdd),
      `Target message (UID: ${targetUid}, Seq: ${targetMessageFinal.seq}) should have the '${flagToAdd}' flag.`
    );
    // Check that other original flags are preserved
    for (const initialFlag of targetMessageInitial.flags) {
      if (initialFlag !== flagToAdd) {
        // if it was already flagged, it's fine
        t.true(
          targetMessageFinal.flags.has(initialFlag),
          `Target message (UID: ${targetUid}) should still have original flag '${initialFlag}'.`
        );
      }
    }

    // Assertion 2 (Other Messages)
    for (const finalMsg of finalMessagesState) {
      if (finalMsg.uid === targetUid) continue; // Skip the target message

      const initialMsg = initialMessagesState.find(
        (m) => m.uid === finalMsg.uid
      );
      if (!initialMsg) {
        t.fail(
          `Found a message in final state (UID: ${finalMsg.uid}) that was not in initial state.`
        );
        continue;
      }

      t.deepEqual(
        [...finalMsg.flags].sort(),
        [...initialMsg.flags].sort(),
        `Flags for non-target message (UID: ${finalMsg.uid}, Seq: ${finalMsg.seq}) should be unchanged.`
      );
    }

    // Assertion 3 (Connection Stability) - Implicitly tested by commands not throwing connection errors.
    t.pass('Test completed, connection remained stable.');
  } finally {
    if (lock) await lock.release();
  }
});
