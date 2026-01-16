/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const punycode = require('node:punycode');
const { PassThrough } = require('node:stream');

const { setTimeout } = require('node:timers/promises');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const archiver = require('archiver');
const archiverZipEncrypted = require('archiver-zip-encrypted');
const bytes = require('@forwardemail/bytes');
const dashify = require('dashify');
const getStream = require('get-stream');
const hasha = require('hasha');
const mongoose = require('mongoose');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const {
  S3Client,
  GetObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { Builder } = require('json-sql-enhanced');
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const isEmail = require('#helpers/is-email');
const _ = require('#helpers/lodash');
const Aliases = require('#models/aliases');
const AttachmentStorage = require('#helpers/attachment-storage');
const Messages = require('#models/messages');
const Indexer = require('#helpers/indexer');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const asctime = require('#helpers/asctime');
const checkDiskSpace = require('#helpers/check-disk-space');
const closeDatabase = require('#helpers/close-database');
const config = require('#config');
const email = require('#helpers/email');
const env = require('#config/env');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const i18n = require('#helpers/i18n');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const refineAndLogError = require('#helpers/refine-and-log-error');
const setupMongoose = require('#helpers/setup-mongoose');
const { decrypt } = require('#helpers/encrypt-decrypt');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder({ bufferAsNative: true });

const attachmentStorage = new AttachmentStorage();
const indexer = new Indexer({
  attachmentStorage
});

const S3 = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
});

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);

// TODO: do better graceful shutdown
let isCancelled = false;

const graceful = new Graceful({
  //
  // NOTE: we are explicitly not gracefully closing these
  //       to allow the backups to complete if they were being uploaded
  //
  ...(config.env === 'test'
    ? {
        mongooses: [mongoose],
        redisClients: [client]
      }
    : {}),
  logger,
  timeoutMs: config.env === 'test' ? ms('5s') : ms('1m'),
  customHandlers: [
    async () => {
      isCancelled = true;
      if (config.env === 'production') await setTimeout(ms('30s'));
    }
  ]
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

// <https://github.com/artem-karpenko/archiver-zip-encrypted/>
archiver.registerFormat('zip-encrypted', archiverZipEncrypted);

async function rekey(payload) {
  if (isCancelled) throw new ServerShutdownError();

  await setupMongoose(logger);

  await logger.debug('rekey worker', { payload });

  let err;
  let tmp;
  let backup = true;

  try {
    const storagePath = getPathToDatabase({
      id: payload.session.user.alias_id,
      storage_location: payload.session.user.storage_location
    });

    // <https://github.com/nodejs/node/issues/38006>
    const stats = await fs.promises.stat(storagePath);
    if (
      !stats.isFile() ||
      stats.size === 0
      // || stats.size <= config.INITIAL_DB_SIZE
    ) {
      const err = new TypeError('Database empty');
      err.stats = stats;
      throw err;
    }

    // we calculate size of db x 2 (backup + tarball)
    const spaceRequired = stats.size * 2;

    const diskSpace = await checkDiskSpace(storagePath);
    if (diskSpace.free < spaceRequired)
      throw new TypeError(
        `Needed ${bytes(spaceRequired)} but only ${bytes(
          diskSpace.free
        )} was available`
      );

    //
    // ensure that we have the space required available in memory
    // (prevents multiple backups from taking up all of the memory on server)
    try {
      await pWaitFor(
        () => {
          return os.freemem() > spaceRequired;
        },
        {
          interval: ms('30s'),
          timeout: ms('5m')
        }
      );
    } catch (err) {
      if (isRetryableError(err)) {
        err.message = `Backup not complete due to OOM for ${payload.session.user.username}`;
        err.isCodeBug = true;
      }

      err.freemem = os.freemem();
      err.spaceRequired = spaceRequired;
      err.payload = payload;
      throw err;
    }

    // create backup
    tmp = path.join(
      path.dirname(storagePath),
      `${payload.session.user.alias_id}-${payload.id}-backup.sqlite`
    );

    if (isCancelled) throw new ServerShutdownError();

    //
    // NOTE: we don't use `backup` command and instead use `VACUUM INTO`
    //       because if a page is modified during backup, it has to start over
    //       <https://news.ycombinator.com/item?id=31387556>
    //       <https://github.com/benbjohnson/litestream.io/issues/56>
    //
    //       also, if we used `backup` then for a temporary period
    //       the database would be unencrypted on disk, and instead
    //       we use VACUUM INTO which keeps the encryption as-is
    //       <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927>
    //
    //       const results = await db.backup(tmp);
    //
    //       so instead we use the VACUUM INTO command with the `tmp` path
    //
    // TODO: this should not fix database
    const db = await getDatabase(
      instance,
      // alias
      {
        id: payload.session.user.alias_id,
        storage_location: payload.session.user.storage_location
      },
      payload.session
    );

    // run a checkpoint to copy over wal to db
    try {
      db.pragma('wal_checkpoint(FULL)');
    } catch (err) {
      await logger.fatal(err, { payload });
    }

    // create backup
    db.exec(`VACUUM INTO '${tmp}'`);

    await closeDatabase(db);

    if (isCancelled) throw new ServerShutdownError();
    // open the backup and encrypt it
    const backupDb = await getDatabase(
      instance,
      // alias
      {
        id: payload.session.user.alias_id,
        storage_location: payload.session.user.storage_location
      },
      payload.session,
      false,
      tmp
    );

    // rekey the database with new password
    try {
      backupDb.pragma('wal_checkpoint(PASSIVE)');
    } catch (err) {
      await logger.fatal(err, { payload });
    }

    // ensure journal mode changed to delete so we can rekey database
    const journalModeResult = backupDb.pragma('journal_mode=DELETE', {
      simple: true
    });
    if (journalModeResult !== 'delete')
      throw new TypeError('Journal mode could not be changed');

    // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/91>
    backupDb.prepare('VACUUM').run();
    if (isCancelled) throw new ServerShutdownError();
    // backupDb.rekey(Buffer.from(decrypt(payload.new_password)));
    backupDb.pragma(`rekey="${decrypt(payload.new_password)}"`);

    //
    // NOTE: do not enable this again because if so it will create
    //       -wal and -shm files and corrupt the database
    //       `backupDb.pragma('journal_mode=WAL');`
    //
    //       (the next time the database is opened the journal mode will get switched to WAL)
    //

    // NOTE: VACUUM will persist the rekey operation and write to db
    // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/23#issuecomment-1152634207>
    if (isCancelled) throw new ServerShutdownError();
    backupDb.prepare('VACUUM').run();

    await closeDatabase(backupDb);

    // rename backup file (overwrites existing destination file)
    await fs.promises.rename(tmp, storagePath);
    backup = false;
    await logger.debug('renamed', { tmp, storagePath });

    //
    // remove the old -whm and -shm files
    //

    // -wal
    try {
      await fs.promises.rm(storagePath.replace('.sqlite', '.sqlite-wal'), {
        force: true,
        recursive: true
      });
    } catch (err) {
      if (err.code !== 'ENOENT') {
        err.isCodeBug = true;
        throw err;
      }
    }

    // -shm
    try {
      await fs.promises.rm(storagePath.replace('.sqlite', '.sqlite-shm'), {
        force: true,
        recursive: true
      });
    } catch (err) {
      if (err.code !== 'ENOENT') {
        err.isCodeBug = true;
        throw err;
      }
    }
  } catch (_err) {
    err = _err;
  }

  // always do cleanup in case of errors
  if (backup && tmp) {
    try {
      await fs.promises.rm(tmp, {
        force: true,
        recursive: true
      });
    } catch (err) {
      await logger.fatal(err, { payload });
    }
  }

  try {
    await client.del(`reset_check:${payload.session.user.alias_id}`);
  } catch (err) {
    await logger.fatal(err);
  }

  try {
    // unset `is_rekey` on the user
    await Aliases.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(payload.session.user.alias_id),
        domain: new mongoose.Types.ObjectId(payload.session.user.domain_id)
      },
      {
        $set: {
          is_rekey: false
        }
      }
    );
  } catch (err) {
    await logger.fatal(err);
  }

  if (err) {
    await email({
      template: 'alert',
      message: {
        to: payload.session.user.owner_full_email,
        cc: config.alertsEmail,
        subject: i18n.translate(
          'ALIAS_REKEY_FAILED_SUBJECT',
          payload.session.user.locale,
          payload.session.user.username
        )
      },
      locals: {
        message: i18n.translate(
          'ALIAS_REKEY_FAILED_MESSAGE',
          payload.session.user.locale,
          payload.session.user.username,
          err.message === 'Database empty'
            ? err.message
            : refineAndLogError(err, payload.session).message
        ),
        locale: payload.session.user.locale
      }
    });

    throw err;
  }

  // email the user
  await email({
    template: 'alert',
    message: {
      to: payload.session.user.owner_full_email,
      subject: i18n.translate(
        'ALIAS_REKEY_READY_SUBJECT',
        payload.session.user.locale,
        payload.session.user.username
      )
    },
    locals: {
      message: i18n.translate(
        'ALIAS_REKEY_READY',
        payload.session.user.locale,
        payload.session.user.username
      ),
      locale: payload.session.user.locale
    }
  });
}

async function backup(payload) {
  if (isCancelled) throw new ServerShutdownError();

  await setupMongoose(logger);

  logger.debug('backup worker', { payload });

  let tmp;
  let backup;
  let err;

  // create bucket on s3 if it doesn't already exist
  // <https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/>
  const bucket = `${config.env}-${dashify(
    _.camelCase(payload.session.user.storage_location)
  )}`;

  // determine extension format
  let extension;
  switch (payload.format) {
    case 'sqlite': {
      extension = 'sqlite';

      break;
    }

    case 'mbox': {
      extension = 'zip';

      break;
    }

    case 'eml': {
      extension = 'zip';

      break;
    }

    default: {
      // safeguard
      throw new TypeError('Unknown extension');
    }
  }

  // the key is either `.sqlite` for "sqlite" value of `payload.format`
  // or it is `.mbox` for "mbox" value or `zip` for "eml" value
  const key = `${payload.session.user.alias_id}.${extension}`;

  try {
    // check how much space is remaining on storage location
    const storagePath = getPathToDatabase({
      id: payload.session.user.alias_id,
      storage_location: payload.session.user.storage_location
    });
    tmp = path.join(
      path.dirname(storagePath),
      `${payload.id}-backup.${extension}`
    );

    // <https://github.com/nodejs/node/issues/38006>
    let stats;
    try {
      stats = await fs.promises.stat(storagePath);
    } catch (err) {
      // Handle case where database file doesn't exist yet
      if (err.code === 'ENOENT') {
        logger.warn('Database file does not exist for backup', {
          storagePath,
          payload
        });
        return;
      }

      throw err;
    }

    if (!stats.isFile() || stats.size === 0) {
      const err = new TypeError('Database empty');
      err.stats = stats;
      throw err;
    }

    if (isCancelled) throw new ServerShutdownError();

    // we calculate size of db * Y (backup + tarball)
    const spaceRequired = stats.size * 2; // 20% (1.2) vs. 50% (2)

    const diskSpace = await checkDiskSpace(storagePath);
    if (diskSpace.free < spaceRequired)
      throw new TypeError(
        `Needed ${bytes(spaceRequired)} but only ${bytes(
          diskSpace.free
        )} was available`
      );

    //
    // ensure that we have the space required available in memory
    // (prevents multiple backups from taking up all of the memory on server)
    try {
      await pWaitFor(
        () => {
          return os.freemem() > spaceRequired;
        },
        {
          interval: ms('5s'),
          timeout: ms('1m')
        }
      );
    } catch (err) {
      if (isRetryableError(err)) {
        err.message = `Backup not complete due to OOM for ${payload.session.user.username}`;
        err.isCodeBug = true;
      }

      err.freemem = os.freemem();
      err.spaceRequired = spaceRequired;
      err.payload = payload;
      throw err;
    }

    if (isCancelled) throw new ServerShutdownError();

    if (config.env !== 'test') {
      let res;
      try {
        res = await S3.send(
          new HeadBucketCommand({
            Bucket: bucket
          })
        );
      } catch (err) {
        if (err.name !== 'NotFound') throw err;
      }

      if (res?.$metadata?.httpStatusCode !== 200) {
        try {
          await S3.send(
            new CreateBucketCommand({
              ACL: 'private',
              Bucket: bucket
            })
          );
        } catch (err) {
          if (err.name !== 'BucketAlreadyOwnedByYou') throw err;
        }
      }
    }

    if (isCancelled) throw new ServerShutdownError();

    //
    // NOTE: we don't use `backup` command and instead use `VACUUM INTO`
    //       because if a page is modified during backup, it has to start over
    //       <https://news.ycombinator.com/item?id=31387556>
    //       <https://github.com/benbjohnson/litestream.io/issues/56>
    //
    //       also, if we used `backup` then for a temporary period
    //       the database would be unencrypted on disk, and instead
    //       we use VACUUM INTO which keeps the encryption as-is
    //       <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927>
    //
    //       const results = await db.backup(tmp);
    //
    //       so instead we use the VACUUM INTO command with the `tmp` path
    //
    const db = await getDatabase(
      instance,
      // alias
      {
        id: payload.session.user.alias_id,
        storage_location: payload.session.user.storage_location
      },
      payload.session
    );

    if (isCancelled) throw new ServerShutdownError();

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
    try {
      db.pragma('wal_checkpoint(PASSIVE)');
    } catch (err) {
      await logger.fatal(err, { payload });
    }

    // cleanup tmp if it already exists
    // otherwise you get an error like:
    // err = {
    //   name: 'SqliteError',
    //   message: 'output file already exists'
    //   ...
    // }
    try {
      await fs.promises.rm(tmp, {
        force: true,
        recursive: true
      });
    } catch (err) {
      await logger.warn(err, { payload });
    }

    switch (payload.format) {
      case 'sqlite': {
        // create backup
        // takes approx 5-10s per GB
        db.exec(`VACUUM INTO '${tmp}'`);

        await closeDatabase(db);

        if (isCancelled) throw new ServerShutdownError();

        backup = true;

        // open the backup to ensure that encryption still valid
        const backupDb = await getDatabase(
          instance,
          // alias
          {
            id: payload.session.user.alias_id,
            storage_location: payload.session.user.storage_location
          },
          payload.session,
          null,
          false,
          tmp
        );

        try {
          backupDb.pragma('wal_checkpoint(PASSIVE)');
        } catch (err) {
          await logger.fatal(err, { payload });
        }

        await closeDatabase(backupDb);

        break;
      }

      // create a password protected zip file in-memory using streams
      case 'mbox': {
        // create archive and specify method of encryption and password
        const archive = archiver.create('zip-encrypted', {
          zlib: { level: 8 },
          encryptionMethod: 'aes256',
          password: decrypt(payload.session.user.password)
        });
        const output = fs.createWriteStream(tmp);
        archive.pipe(output);
        archive.append(
          `MBOX backup created via Forward Email\nhttps://forwardemail.net\n${new Date().toISOString()}`,
          { name: 'README.txt' }
        );

        const sql = builder.build({
          type: 'select',
          table: 'Mailboxes',
          fields: ['_id', 'path'],
          sort: 'path'
        });

        for (const mailbox of db.prepare(sql.query).all(sql.values)) {
          const sql = builder.build({
            type: 'select',
            table: 'Messages',
            sort: 'uid',
            condition: {
              mailbox: mailbox._id
            }
          });

          const stream = new PassThrough();
          archive.append(stream, {
            name: punycode.toASCII(mailbox.path) + '.mbox'
          });
          for (const result of db.prepare(sql.query).iterate(sql.values)) {
            const message = syncConvertResult(Messages, result);
            // <https://github.com/nodemailer/wildduck/blob/49bd5015c188079e3a265c0873178e805f84ca2e/lib/mbox-stream.js#L31C38-L31C78>
            // similar to 'rfc822' case in `helpers/get-query-response.js`
            // (value is a stream)
            const { value } = indexer.getContents(
              message.mimeTree,
              false,
              {},
              instance,
              payload.session
            );
            //
            // TODO: add support for `X-UID`, `Status`, and `X-Status` support similar to Dovecot
            //       <https://doc.dovecot.org/admin_manual/mailbox_formats/mbox/#dovecot-s-metadata>
            //
            // TODO: add support for X-Mozilla-Status support
            //       `X-Mozilla-Status: 0001` if read, otherwise `X-Mozilla-Status: 0000` if unread
            //       <https://vincent.bernat.ch/en/x-mozilla-status>
            //       <https://hg.mozilla.org/comm-central/file/68ac92f5fc3cdaf8febc623abbdaea7165b44004/mailnews/base/public/nsMsgMessageFlags.idl>
            //
            // TODO: add X-Export-* headers like WildDuck (?)
            //       <https://github.com/nodemailer/wildduck/blob/49bd5015c188079e3a265c0873178e805f84ca2e/lib/mbox-export.js#L85>
            //
            // TODO: if we do any of the above todo's then we should mirror it for EML export too
            //

            const content = await getStream(value);
            stream.write(
              `From ${
                message.mimeTree?.parsedHeader?.from?.find(
                  (obj) =>
                    typeof obj.address === 'string' && isEmail(obj.address)
                )?.address || 'MAILER-DAEMON'
              } ${asctime(new Date(message.hdate))}\n${splitLines(
                content.trim()
              ).join('\n')}\n\n`
            );
          }

          stream.end();
        }

        archive.finalize();
        archive.on('warning', (err) => {
          logger.warn(err);
        });
        await new Promise((resolve, reject) => {
          archive.once('error', reject);
          archive.once('end', resolve);
        });
        break;
      }

      // create a password protected zip file in-memory using streams
      case 'eml': {
        // create archive and specify method of encryption and password
        const archive = archiver.create('zip-encrypted', {
          zlib: { level: 8 },
          encryptionMethod: 'aes256',
          password: decrypt(payload.session.user.password)
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
              payload.session
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
        break;
      }
      // No default
    }

    // calculate hash of file
    const hash = await hasha.fromFile(tmp, { algorithm: 'sha256' });

    // check if hash already exists in s3
    try {
      const obj = await S3.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key
        })
      );

      if (obj?.Metadata?.hash === hash)
        throw new TypeError('Hash already exists, returning early');
    } catch (err) {
      if (err.name !== 'NotFound') throw err;
    }

    if (isCancelled) throw new ServerShutdownError();

    const upload = new Upload({
      client: S3,
      params: {
        Bucket: bucket,
        Key: key,
        Body: fs.createReadStream(tmp),
        Metadata: { hash }
      }
    });
    await upload.done();

    // update alias imap backup date using provided time
    if (payload.format === 'sqlite') {
      await Aliases.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(payload.session.user.alias_id),
          domain: new mongoose.Types.ObjectId(payload.session.user.domain_id)
        },
        {
          $set: {
            imap_backup_at: new Date(payload.backup_at)
          }
        }
      );
    }
  } catch (_err) {
    err = _err;
    err.isCodeBug = true;
    await logger.fatal(err, { payload });
  }

  //
  // NOTE: this was commented out because auto_vacuum wasn't enabled properly
  //
  /*
  //
  // NOTE: if the SQLite file is 2x larger than the backup, then we
  //       should run a VACUUM since auto vacuum isn't optimal
  //
  if (payload.format === 'sqlite' && tmp && backup) {
    try {
      // check how much space is remaining on storage location
      const storagePath = getPathToDatabase({
        id: payload.session.user.alias_id,
        storage_location: payload.session.user.storage_location
      });
      const diskSpace = await checkDiskSpace(storagePath);

      // <https://github.com/nodejs/node/issues/38006>
      const stats = await fs.promises.stat(storagePath);
      if (!stats.isFile() || stats.size === 0) {
        const err = new TypeError('Database empty');
        err.stats = stats;
        throw err;
      }

      // we calculate size of db x 2 (backup + tarball)
      const spaceRequired = stats.size * 2;

      if (diskSpace.free < spaceRequired)
        throw new TypeError(
          `Needed ${bytes(spaceRequired)} but only ${bytes(
            diskSpace.free
          )} was available`
        );

      //
      // check if main sqlite file is >= 25% larger than tmp file
      //
      // <https://github.com/nodejs/node/issues/38006>
      const tmpStats = await fs.promises.stat(tmp);
      if (!tmpStats.isFile() || tmpStats.size === 0) {
        const err = new TypeError('Database empty');
        err.stats = stats;
        throw err;
      }

      if (stats.size >= Math.round(tmpStats.size * 1.25)) {
        const db = await getDatabase(
          instance,
          // alias
          {
            id: payload.session.user.alias_id,
            storage_location: payload.session.user.storage_location
          },
          payload.session
        );
        db.prepare('VACUUM').run();
        await closeDatabase(db);
      }
    } catch (_err) {
      _err.isCodeBug = true;
      await logger.fatal(_err, { payload });
    }
  }
  */

  // always do cleanup in case of errors
  if (tmp && backup) {
    try {
      await fs.promises.rm(tmp, {
        force: true,
        recursive: true
      });
    } catch (err) {
      await logger.fatal(err, { payload });
    }
  }

  //
  // NOTE: out of scope asynchronous code will NOT get run
  //       (so we cannot do `then()` here to run after throwing)
  //
  try {
    await client.del(`backup_check:${payload.session.user.alias_id}`);
  } catch (err) {
    await logger.fatal(err);
  }

  // if an error occurred then allow cache to attempt again
  if (err) {
    //
    // email user a friendly error message
    //
    // NOTE: out of scope asynchronous code will NOT get run
    //       (so we cannot do `then()` here to run after throwing)
    //
    if (payload.email)
      await email({
        template: 'alert',
        message: {
          to: payload.email,
          subject: i18n.translate(
            'ALIAS_BACKUP_FAILED_SUBJECT',
            payload.session.user.locale,
            payload.session.user.username
          )
        },
        locals: {
          message: i18n.translate(
            'ALIAS_BACKUP_FAILED_MESSAGE',
            payload.session.user.locale,
            payload.session.user.username,
            err.message === 'Database empty'
              ? err.message
              : refineAndLogError(err, payload.session).message
          ),
          locale: payload.session.user.locale
        }
      });

    //
    // email admins with the full error output
    //

    // prevent duplicate emails every 24 hours
    const key = `alias_backup_failed_check:${payload.session.user.username}`;
    const cache = await client.get(key);
    if (cache) throw err;
    await client.set(key, true, 'PX', ms('1d'));

    await email({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: i18n.translate(
          'ALIAS_BACKUP_FAILED_SUBJECT',
          payload.session.user.locale,
          payload.session.user.username
        )
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });

    throw err;
  }

  // include URL link in the email to download
  const link = await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key
    }),
    { expiresIn: 3600 * 4 } // # seconds till expiry (3600 = 60m * 4 = 4 hours)
  );

  //
  // NOTE: out of scope asynchronous code will NOT get run
  //       (so we cannot do `then()` here to run after returning)
  //
  // send email to user
  if (payload.email)
    await email({
      template: 'alert',
      message: {
        to: payload.email,
        subject: i18n.translate(
          'ALIAS_BACKUP_READY_SUBJECT',
          payload.session.user.locale,
          payload.session.user.username
        )
      },
      locals: {
        message: i18n.translate(
          'ALIAS_BACKUP_READY',
          payload.session.user.locale,
          payload.format,
          payload.session.user.username,
          link
        ),
        locale: payload.session.user.locale
      }
    });
}

module.exports = { rekey, backup };
