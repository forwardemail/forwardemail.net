// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

// const { randomUUID } = require('node:crypto');

const Redis = require('ioredis');

const IMAP = require('./imap-server');
const utils = require('./test/utils');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const Threads = require('#models/threads');
const Users = require('#models/users');
const getDatabase = require('#helpers/get-database');
const { encrypt } = require('#helpers/encrypt-decrypt');

(async () => {
  await utils.setupMongoose();

  const client = new Redis();
  const subscriber = new Redis();
  const imap = new IMAP({ client, subscriber }, false);
  const user = await Users.create({
    email: 'beep@boop.com',
    password: '$!@#!@#!@#!@#@!'
  });
  const domain = await Domains.create({
    name: 'example.com',
    members: [
      {
        user: user._id,
        group: 'admin'
      }
    ]
  });
  const alias = await Aliases.create({
    name: 'boop',
    domain: domain._id,
    user: user._id,
    recipients: ['beep@example.com']
  });

  console.time('read and write to database');
  const db = await getDatabase(imap.server, alias, {
    user: {
      password: encrypt('password')
    }
  });

  console.log('db', db);

  //
  // TODO: sqlite error with object insertion (is this a bug?)
  //       <https://github.com/2do2go/json-sql/issues/47>
  //

  const mailbox = await Mailboxes.create({
    db,
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
  const thread = await Threads.getThreadId(db, subject, mimeTree);
  console.log('thread', thread);
  const retention =
    typeof mailbox.retention === 'number' ? mailbox.retention : 0;

  const maildata = imap.indexer.getMaildata(mimeTree);

  const message = await Messages.create({
    db,
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

  // TODO: close
  db.close();

  console.log('DONE!');
  // eslint-disable-next-line n/prefer-global/process
  process.exit(0);
})();

// TODO: ensure all sql queries are protected from unsafe user input

// TODO: primary key must be id on all databases

// TODO: user-version is compiled revhash of the entire database string creation
// then execute one per line to alter everything
// note that we need to get a lock on the database beforehand
// ALTER TABLE employees ADD status VARCHAR;
