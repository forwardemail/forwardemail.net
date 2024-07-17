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

const Redis = require('@ladjs/redis');
const _ = require('lodash');
const checkDiskSpace = require('check-disk-space').default;
const dashify = require('dashify');
const hasha = require('hasha');
const mongoose = require('mongoose');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const prettyBytes = require('pretty-bytes');
const sharedConfig = require('@ladjs/shared-config');
const {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const Aliases = require('#models/aliases');
const closeDatabase = require('#helpers/close-database');
const config = require('#config');
const email = require('#helpers/email');
const env = require('#config/env');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const i18n = require('#helpers/i18n');
const isTimeoutError = require('#helpers/is-timeout-error');
const logger = require('#helpers/logger');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { decrypt } = require('#helpers/encrypt-decrypt');

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
  client
};

async function rekey(payload) {
  logger.debug('rekey worker', { payload });
  let err;

  const storagePath = getPathToDatabase({
    id: payload.session.user.alias_id,
    storage_location: payload.session.user.storage_location
  });

  // <https://github.com/nodejs/node/issues/38006>
  const stats = await fs.promises.stat(storagePath);
  if (
    !stats.isFile() ||
    stats.size === 0 ||
    stats.size <= config.INITIAL_DB_SIZE
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
      `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
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
    if (isTimeoutError(err)) {
      err.message = `Backup not complete due to OOM for ${payload.session.user.username}`;
      err.isCodeBug = true;
    }

    err.freemem = os.freemem();
    err.spaceRequired = spaceRequired;
    err.payload = payload;
    throw err;
  }

  // create backup
  const tmp = path.join(
    path.dirname(storagePath),
    `${payload.session.user.alias_id}-${payload.id}-backup.sqlite`
  );

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
  db.pragma('wal_checkpoint(FULL)');

  // create backup
  const results = db.exec(`VACUUM INTO '${tmp}'`);

  await closeDatabase(db);

  logger.debug('results', { results });

  let backup = true;

  try {
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
    backupDb.pragma('wal_checkpoint(PASSIVE)');

    // ensure journal mode changed to delete so we can rekey database
    const journalModeResult = backupDb.pragma('journal_mode=DELETE', {
      simple: true
    });
    if (journalModeResult !== 'delete')
      throw new TypeError('Journal mode could not be changed');

    // NOTE: the two VACUUM calls here need to go into a piscina worker thread pool

    // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/91>
    backupDb.prepare('VACUUM').run();
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
    backupDb.prepare('VACUUM').run();

    await closeDatabase(backupDb);

    // rename backup file (overwrites existing destination file)
    await fs.promises.rename(tmp, storagePath);
    backup = false;
    logger.debug('renamed', { tmp, storagePath });

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
  if (backup) {
    try {
      await fs.promises.rm(tmp, {
        force: true,
        recursive: true
      });
    } catch (err) {
      logger.fatal(err, { payload });
    }
  }

  if (err) throw err;
}

// eslint-disable-next-line complexity
async function backup(payload) {
  logger.debug('backup worker', { payload });

  let tmp;
  let backup;
  let err;

  try {
    // check how much space is remaining on storage location
    const storagePath = getPathToDatabase({
      id: payload.session.user.alias_id,
      storage_location: payload.session.user.storage_location
    });
    const diskSpace = await checkDiskSpace(storagePath);
    tmp = path.join(path.dirname(storagePath), `${payload.id}-backup.sqlite`);

    // <https://github.com/nodejs/node/issues/38006>
    const stats = await fs.promises.stat(storagePath);
    if (
      !stats.isFile() ||
      stats.size === 0 ||
      stats.size <= config.INITIAL_DB_SIZE
    ) {
      const err = new TypeError('Database empty');
      err.stats = stats;
      throw err;
    }

    // we calculate size of db x 2 (backup + tarball)
    const spaceRequired = stats.size * 2;

    if (diskSpace.free < spaceRequired)
      throw new TypeError(
        `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
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
      if (isTimeoutError(err)) {
        err.message = `Backup not complete due to OOM for ${payload.session.user.username}`;
        err.isCodeBug = true;
      }

      err.freemem = os.freemem();
      err.spaceRequired = spaceRequired;
      err.payload = payload;
      throw err;
    }

    // TODO: this needs moved into piscina

    // create bucket on s3 if it doesn't already exist
    // <https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/>
    const bucket = `${config.env}-${dashify(
      _.camelCase(payload.session.user.storage_location)
    )}`;

    const key = `${payload.session.user.alias_id}.sqlite`;

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
      // alias
      {
        id: payload.session.user.alias_id,
        storage_location: payload.session.user.storage_location
      },
      payload.session
    );

    // run a checkpoint to copy over wal to db
    db.pragma('wal_checkpoint(PASSIVE)');

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
      logger.fatal(err, { payload });
    }

    // create backup
    // takes approx 5-10s per GB
    db.exec(`VACUUM INTO '${tmp}'`);

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

    await closeDatabase(backupDb);

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
  } catch (_err) {
    err = _err;
  }

  // always do cleanup in case of errors
  if (tmp && backup) {
    try {
      await fs.promises.rm(tmp, {
        force: true,
        recursive: true
      });
    } catch (err) {
      logger.fatal(err, { payload });
    }
  }

  // if an error occurred then allow cache to attempt again
  // (but wait 30 minutes instead of 1 day)
  if (err) {
    //
    // NOTE: out of scope asynchronous code will NOT get run
    //       (so we cannot do `then()` here to run after throwing)
    //
    await client.del(`backup_check:${payload.session.user.alias_id}`);

    //
    // email user a friendly error message
    //
    // NOTE: out of scope asynchronous code will NOT get run
    //       (so we cannot do `then()` here to run after throwing)
    //
    await email({
      template: 'alert',
      message: {
        to: payload.email,
        cc: config.email.message.from,
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

    throw err;
  }

  //
  // NOTE: out of scope asynchronous code will NOT get run
  //       (so we cannot do `then()` here to run after returning)
  //
  // send email to user
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
        payload.session.user.username
      ),
      locale: payload.session.user.locale
    }
  });
}

module.exports = { rekey, backup };
