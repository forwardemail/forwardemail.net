/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

//
// NOTE: this is a helper script in case we need
//       to help a user restore from a backup
//       or export a SQLite database to EML manually for testing
//

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const punycode = require('node:punycode');
const { randomUUID } = require('node:crypto');

const Graceful = require('@ladjs/graceful');
const Redis = require('ioredis-mock');
const archiver = require('archiver');
const archiverZipEncrypted = require('archiver-zip-encrypted');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');
const { Builder } = require('json-sql-enhanced');

const AttachmentStorage = require('#helpers/attachment-storage');
const Messages = require('#models/messages');
const Indexer = require('#helpers/indexer');
const getDatabase = require('#helpers/get-database');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder({ bufferAsNative: true });

const attachmentStorage = new AttachmentStorage();
const indexer = new Indexer({
  attachmentStorage
});

// <https://github.com/artem-karpenko/archiver-zip-encrypted/>
archiver.registerFormat('zip-encrypted', archiverZipEncrypted);

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);

const graceful = new Graceful({
  logger,
  timeoutMs: ms('5s')
});

graceful.listen();

client.setMaxListeners(0);

//
// NOTE: out of scope asynchronous code will NOT get run
//       <https://github.com/piscinajs/piscina?tab=readme-ov-file#out-of-scope-asynchronous-code>
//

//
// spoof instance for `getDatabase` calls
// (since this is run in a worker outside of server instances)
//
const instance = {
  constructor: { name: 'SQLite' },
  client,
  logger
};

(async () => {
  await setupMongoose(logger);

  const storagePath = process.env.SQLITE_PATH;

  // <https://github.com/nodejs/node/issues/38006>
  const stats = await fs.promises.stat(storagePath);
  if (!stats.isFile() || stats.size === 0) {
    const err = new TypeError('Database empty');
    err.stats = stats;
    throw err;
  }

  const session = {
    user: {
      alias_id: process.env.ALIAS_ID,
      password: encrypt(process.env.SQLITE_PASSWORD),
      username: 'test'
    }
  };

  const db = await getDatabase(
    instance,
    // alias
    {
      id: process.env.ALIAS_ID,
      storage_location: os.tmpdir()
    },
    session,
    false,
    storagePath
  );

  const tmp = path.join(os.tmpdir(), `${randomUUID()}.zip`);

  //
  // NOTE: we could set a flag with timestamp of database being backed up
  //       and then modify `getDatabase` to return early if we detect it's in progress
  //       (otherwise if it's been in progress for more than like 5-10m then to unset flag)
  //
  //       <https://github.com/sqlitebrowser/sqlitebrowser/issues/366#issue-90377336>
  //       user_version is 32-bit signed integer
  //       (maximum value is 2,147,483,647) so we can't use `Date.now()`
  //       instead we could use the UTC h:mm format converted and then write a special parser
  //       > require('dayjs')().format('hhmm')
  //       '0140'
  //       > Number(require('dayjs')().format('hhmm'))
  //       140
  //
  //       but this is rather complicated, so instead we rely on checkpoint
  //       and then we check that we can open up the db we just copied
  //
  //       db.pragma(`user_version=${...}`);
  //

  // run a checkpoint to copy over wal to db (and block others from writing)
  db.pragma('wal_checkpoint(PASSIVE)');

  // create a password protected zip file in-memory using streams

  // create archive and specify method of encryption and password
  const archive = archiver.create('zip-encrypted', {
    zlib: { level: 8 },
    encryptionMethod: 'aes256',
    password: decrypt(session.user.password)
  });
  const output = fs.createWriteStream(tmp);
  archive.pipe(output);
  archive.append(
    `EML backup created via Forward Email\nhttps://forwardemail.net\n${new Date().toISOString()}`,
    { name: 'README.txt' }
  );

  const map = new Map();

  {
    const sql = builder.build({
      type: 'select',
      table: 'Mailboxes',
      fields: ['_id', 'path'],
      sort: 'path'
    });
    for (const mailbox of db.prepare(sql.query).iterate(sql.values)) {
      map.set(mailbox._id, mailbox.path);
      archive.append(null, {
        name: `${punycode.toASCII(mailbox.path)}/`
      });
    }
  }

  {
    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      sort: 'uid'
    });
    for (const result of db.prepare(sql.query).iterate(sql.values)) {
      const message = syncConvertResult(Messages, result);
      const mailboxPath = map.get(message.mailbox.toString());
      const name = punycode.toASCII(
        mailboxPath
          ? `${mailboxPath}/${message._id.toString()}.eml`
          : `${message._id.toString()}.eml`
      );
      // similar to 'rfc822' case in `helpers/get-query-response.js`
      // (value is a stream)
      const { value } = indexer.getContents(
        message.mimeTree,
        false,
        {},
        instance,
        session
      );
      archive.append(value, { name });
    }
  }

  archive.finalize();
  archive.on('warning', (err) => {
    logger.warn(err);
  });
  await new Promise((resolve, reject) => {
    archive.on('error', reject);
    archive.on('end', resolve);
  });

  console.log('tmp', tmp);
})();
