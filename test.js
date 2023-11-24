/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

// const { randomUUID } = require('node:crypto');

const Redis = require('ioredis');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const SQLite = require('./sqlite-server');
const IMAP = require('./imap-server');
const utils = require('./test/utils');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const Payments = require('#models/payments');
const Threads = require('#models/threads');
const Users = require('#models/users');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getDatabase = require('#helpers/get-database');
const { encrypt } = require('#helpers/encrypt-decrypt');

(async () => {
  try {
    await utils.setupMongoose();

    const client = new Redis();
    const subscriber = new Redis();
    client.setMaxListeners(0);
    subscriber.setMaxListeners(0);
    const wsp = createWebSocketAsPromised();
    const sqlite = new SQLite({ client, subscriber });
    await sqlite.listen();
    const imap = new IMAP({ client, subscriber, wsp }, false);
    const user = await Users.create({
      email: 'beep@boop.com',
      password: '$!@#!@#!@#!@#@!'
    });
    user.plan = 'enhanced_protection';
    user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
    await Payments.create({
      user: user._id,
      amount: 300,
      invoice_at: user[config.userFields.planSetAt],
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    });
    await user.save();
    const resolver = createTangerine(client);
    const domain = await Domains.create({
      name: 'example.com',
      members: [
        {
          user: user._id,
          group: 'admin'
        }
      ],
      plan: 'enhanced_protection',
      has_smtp: true,
      smtp_verified_at: new Date(),
      resolver
    });
    const alias = await Aliases.create({
      name: 'boop',
      domain: domain._id,
      user: user._id,
      recipients: ['beep@example.com']
    });

    const pass = await alias.createToken();
    await alias.save();

    console.time('read and write to database');
    const session = {
      user: {
        id: alias.id,
        username: `${alias.name}@${domain.name}`,
        alias_id: alias.id,
        alias_name: alias.name,
        domain_id: domain.id,
        domain_name: domain.name,
        password: encrypt(pass),
        storage_location: alias.storage_location
      }
    };

    const db = await getDatabase(imap, alias, session);

    console.log('db', db);

    //
    // TODO: sqlite error with object insertion (is this a bug?)
    //       <https://github.com/2do2go/json-sql/issues/47>
    //

    const mailbox = await Mailboxes.create({
      imap,
      session,
      path: 'INBOX'
    });

    console.log('mailbox', mailbox);

    const flags = [];
    const date = new Date();
    const raw = `
  Content-Type: multipart/mixed; boundary="------------cWFvDSey27tFG0hVYLqp9hs9"
  MIME-Version: 1.0
  Message-ID: <beep-boop@${domain.name}>
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

    const {
      id,
      mimeTree,
      size,
      bodystructure,
      envelope,
      idate,
      hdate,
      msgid,
      subject,
      headers
    } = await imap.prepareMessage({
      flags,
      date,
      raw
    });
    const thread = await Threads.getThreadId(imap, session, subject, mimeTree);
    console.log('thread', thread);
    const retention =
      typeof mailbox.retention === 'number' ? mailbox.retention : 0;

    const maildata = imap.indexer.getMaildata(mimeTree);

    const message = await Messages.create({
      imap,
      session,
      mailbox: mailbox._id,
      _id: id,
      root: id,
      exp: retention !== 0,
      rdate: new Date(Date.now() + retention),
      idate,
      hdate,
      thread: thread._id,
      flags,
      size,
      headers,
      mimeTree,
      envelope,
      bodystructure,
      msgid,
      unseen: !flags.includes('\\Seen'),
      flagged: flags.includes('\\Flagged'),
      undeleted: !flags.includes('\\Deleted'),
      draft: flags.includes('\\Draft'),
      magic: maildata.magic,
      subject,
      copied: false,
      attachments: maildata.attachments || [],
      uid: mailbox.uidNext,
      modseq: mailbox.modifyIndex + 1,
      searchable: !flags.includes('\\Deleted'),
      junk: mailbox.specialUse === '\\Junk',
      remoteAddress: 'foo',
      transaction: 'APPEND',
      text: maildata.text
    });

    console.log('message', message);
    console.timeEnd('read and write to database');

    db.close();

    console.log('DONE!');
  } catch (err) {
    console.error(err);
  } finally {
    // eslint-disable-next-line n/prefer-global/process
    process.exit(0);
  }
})();
