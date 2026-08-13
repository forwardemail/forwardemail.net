/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const process = require('node:process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const punycode = require('node:punycode');
const { PassThrough } = require('node:stream');

const { setTimeout } = require('node:timers/promises');
const Database = require('better-sqlite3-multiple-ciphers');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const archiver = require('archiver');
const archiverZipEncrypted = require('archiver-zip-encrypted');
const bytes = require('@forwardemail/bytes');
const dashify = require('dashify');
const getStream = require('get-stream');
const hasha = require('hasha');
const mimeTypes = require('mime-types');
const mongoose = require('mongoose');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const {
  GetObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { Builder } = require('json-sql-enhanced');
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { boolean } = require('boolean');

const isEmail = require('#helpers/is-email');
const _ = require('#helpers/lodash');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const AttachmentStorage = require('#helpers/attachment-storage');
const Messages = require('#models/messages');
const Indexer = require('#helpers/indexer');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const asctime = require('#helpers/asctime');
const checkDiskSpace = require('#helpers/check-disk-space');
const closeDatabase = require('#helpers/close-database');
const config = require('#config');
const email = require('#helpers/email');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const i18n = require('#helpers/i18n');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const refineAndLogError = require('#helpers/refine-and-log-error');
const safeVacuum = require('#helpers/safe-vacuum');
const setupMongoose = require('#helpers/setup-mongoose');
const setupPragma = require('#helpers/setup-pragma');
const { decrypt } = require('#helpers/encrypt-decrypt');
const { releaseRekeyLock } = require('#helpers/rekey-lock');
const checkS3BucketAccess = require('#helpers/check-s3-bucket-access');
const createTangerine = require('#helpers/create-tangerine');
const { getS3Client } = require('#helpers/get-s3-client');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');
const env = require('#config/env');

const BackupUploadLimiter = require('#helpers/backup-upload-limiter');
const parseBandwidth = require('#helpers/parse-bandwidth');
const createThrottleStream = require('#helpers/throttle-stream');

const builder = new Builder({ bufferAsNative: true });

const BACKUP_UPLOAD_BYTES_PER_SECOND = parseBandwidth(
  env.BACKUP_MAX_BANDWIDTH || '62.5MB/s'
);

// Lua script to atomically release a Redis lock only if we still own it.
// Prevents releasing a lock that expired and was re-acquired by another worker.
const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

const attachmentStorage = new AttachmentStorage();
const indexer = new Indexer({
  attachmentStorage
});

// NOTE: default S3 client is imported from get-s3-client helper
//       per-domain custom S3 clients are created via getS3Client(domain)

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

// All sqlite-worker instances and hosts reserve from this one Redis-backed
// budget before emitting upload chunks to R2 or another S3-compatible target.
const backupUploadLimiter = new BackupUploadLimiter({
  client,
  bytesPerSecond: BACKUP_UPLOAD_BYTES_PER_SECOND
});

//
// NOTE: out of scope asynchronous code will NOT get run
//       <https://github.com/piscinajs/piscina?tab=readme-ov-file#out-of-scope-asynchronous-code>
//

//
// spoof instance for `getDatabase` calls
// (since this is run in a worker outside of server instances)
//
// Create a Tangerine resolver for DNS lookups (Redis-backed, cached)
const resolver = createTangerine(client, logger);

const instance = {
  constructor: { name: 'SQLite' },
  client,
  resolver,
  logger
};

// <https://github.com/artem-karpenko/archiver-zip-encrypted/>
archiver.registerFormat('zip-encrypted', archiverZipEncrypted);

async function rekey(payload) {
  if (isCancelled) throw new ServerShutdownError();

  await setupMongoose(logger);

  // Claim this specific rekey before touching SQLite. A controller can then
  // distinguish an unacknowledged queue request from work already in flight.
  const claimedRekey = await Aliases.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(payload.session.user.alias_id),
      domain: new mongoose.Types.ObjectId(payload.session.user.domain_id),
      is_rekey: true,
      ...(payload.rekey_id
        ? { rekey_id: payload.rekey_id }
        : { rekey_id: { $exists: false } }),
      rekey_processing: { $ne: true }
    },
    {
      $set: { rekey_processing: true }
    }
  )
    .select('_id')
    .lean()
    .exec();

  if (!claimedRekey) {
    logger.info('Skipping stale or already-claimed rekey job', {
      alias_id: payload?.session?.user?.alias_id,
      rekey_id: payload?.rekey_id
    });
    return;
  }

  console.log(
    '[DEBUG:worker] rekey started',
    JSON.stringify({
      aliasId: payload?.session?.user?.alias_id,
      aliasName: payload?.session?.user?.alias_name,
      domainName: payload?.session?.user?.domain_name,
      storageLocation: payload?.session?.user?.storage_location
    })
  );
  logger.debug('rekey worker', { payload });

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
    db.pragma('wal_checkpoint(PASSIVE)');

    // create backup
    db.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}';`);

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

    //
    // Integrity check: verify the rekeyed database is not corrupt
    // BEFORE renaming it over the original. If this fails, the original
    // database remains untouched and the user is notified of the failure.
    //
    const integrityResult = backupDb.pragma('integrity_check', {
      simple: true
    });
    if (integrityResult !== 'ok') {
      throw new TypeError(
        `Integrity check failed after rekey VACUUM: ${integrityResult}`
      );
    }

    await closeDatabase(backupDb);

    //
    // Final verification: re-open the rekeyed database with the NEW password
    // to confirm it can actually be decrypted. This catches edge cases where
    // the rekey pragma appeared to succeed but the file is unreadable.
    //
    {
      const verifyDb = new Database(tmp, {
        readonly: true,
        fileMustExist: true,
        timeout: config.busyTimeout
      });
      try {
        await setupPragma(verifyDb, {
          user: {
            ...payload.session.user,
            password: payload.new_password
          }
        });
        const verifyIntegrity = verifyDb.pragma('integrity_check', {
          simple: true
        });
        if (verifyIntegrity !== 'ok') {
          throw new TypeError(
            `Post-rekey verification failed: ${verifyIntegrity}`
          );
        }
      } finally {
        try {
          verifyDb.close();
        } catch {}
      }
    }

    //
    // Cross-process quiesce BEFORE swapping the rekeyed file over the
    // live database.  Stale handles in other PM2 cluster workers keep
    // writing to the old inode, and their orphaned encrypted -wal file
    // would get replayed onto the new file after the rename, causing
    // SQLITE_NOTADB / SQLITE_CORRUPT corruption.
    //
    const swapLockKey = `db_swap_lock:${payload.session.user.alias_id}`;
    const swapLockOwner = `${os.hostname()}:${process.pid}:${Date.now()}`;
    const swapLockAcquired = await client.set(
      swapLockKey,
      swapLockOwner,
      'PX',
      ms('5m'),
      'NX'
    );
    if (!swapLockAcquired) {
      const err = new Error(
        `Database swap in progress by another worker for alias ${payload.session.user.alias_id}`
      );
      err.code = 'SQLITE_BUSY';
      throw err;
    }

    try {
      //
      // Broadcast cache eviction to ALL workers via Redis pub/sub so stale
      // handles to the about-to-be-replaced file are closed everywhere,
      // then wait a grace period for the eviction to propagate.
      //
      try {
        await client.publish('db_cache_evict', payload.session.user.alias_id);
      } catch (err) {
        logger.debug(err);
      }

      await setTimeout(ms('1s'));

      //
      // Exclusivity proof: if -wal/-shm files still exist after eviction,
      // a stale handle somewhere is still writing to the old inode —
      // abort the swap (retryable) instead of corrupting the new file.
      //
      if (
        fs.existsSync(storagePath.replace('.sqlite', '.sqlite-wal')) ||
        fs.existsSync(storagePath.replace('.sqlite', '.sqlite-shm'))
      ) {
        const err = new Error(
          `REKEY aborted, -wal/-shm files still exist for alias ${payload.session.user.alias_id} (another connection is still writing)`
        );
        err.code = 'SQLITE_BUSY';
        throw err;
      }

      //
      // remove the old -wal and -shm files BEFORE the rename
      // (removing them after the rename could delete files belonging
      //  to the freshly swapped-in database)
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

      // rename backup file (overwrites existing destination file)
      await fs.promises.rename(tmp, storagePath);
      backup = false;
      logger.debug('renamed', { tmp, storagePath });
    } finally {
      // Release the swap lock (only if we still own it)
      await client
        .eval(RELEASE_LOCK_SCRIPT, 1, swapLockKey, swapLockOwner)
        .catch(() => {});
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
      logger.fatal(err, { payload });
    }
  }

  try {
    await client.del(`reset_check:${payload.session.user.alias_id}`);
  } catch (err) {
    logger.fatal(err);
  }

  //
  // If the error is ServerShutdownError, do NOT clear is_rekey.
  // The job will be re-queued by sqlite-worker.js and retried
  // after the next restart. Clearing is_rekey here would allow
  // auth while the rekey is incomplete (corrupted state).
  //
  if (err instanceof ServerShutdownError) {
    // This job is immediately re-queued by sqlite-worker.js, so make it
    // claimable by the next worker rather than allowing stale recovery to
    // restore a rekey that is still scheduled to run.
    await Aliases.updateOne(
      {
        _id: new mongoose.Types.ObjectId(payload.session.user.alias_id),
        domain: new mongoose.Types.ObjectId(payload.session.user.domain_id),
        is_rekey: true,
        ...(payload.rekey_id
          ? { rekey_id: payload.rekey_id }
          : { rekey_id: { $exists: false } })
      },
      {
        $set: { rekey_processing: false }
      }
    ).catch((shutdownErr) => logger.fatal(shutdownErr));
    throw err;
  }

  try {
    const filter = {
      _id: new mongoose.Types.ObjectId(payload.session.user.alias_id),
      domain: new mongoose.Types.ObjectId(payload.session.user.domain_id),
      is_rekey: true,
      ...(payload.rekey_id
        ? { rekey_id: payload.rekey_id }
        : { rekey_id: { $exists: false } })
    };

    if (err) {
      // The live SQLite file still uses the old password after a failed
      // rekey. Restore its persisted token snapshot and clear the rekey
      // state in one database operation before authentication is re-enabled.
      const restoredAlias = await Aliases.findOneAndUpdate(filter, [
        {
          $set: {
            is_rekey: false,
            tokens: {
              $ifNull: ['$rekey_previous_tokens', '$tokens']
            }
          }
        },
        {
          $unset: [
            'rekey_started_at',
            'rekey_previous_tokens',
            'rekey_id',
            'rekey_processing'
          ]
        }
      ]);

      if (restoredAlias)
        await releaseRekeyLock(
          client,
          payload.session.user.alias_id,
          payload.rekey_id
        );
    } else {
      // The SQLite file now uses the new token, so discard only the
      // rollback snapshot and re-enable authentication.
      const completedAlias = await Aliases.findOneAndUpdate(filter, {
        $set: {
          is_rekey: false
        },
        $unset: {
          rekey_started_at: 1,
          rekey_previous_tokens: 1,
          rekey_id: 1,
          rekey_processing: 1
        }
      });

      if (completedAlias)
        await releaseRekeyLock(
          client,
          payload.session.user.alias_id,
          payload.rekey_id
        );
    }
  } catch (err) {
    logger.fatal(err);
  }

  if (err) {
    console.error(
      '[ERROR:worker] rekey failed',
      JSON.stringify({
        errName: err?.name,
        errMessage: err?.message?.slice(0, 500),
        errCode: err?.code,
        aliasId: payload?.session?.user?.alias_id,
        aliasName: payload?.session?.user?.alias_name,
        domainName: payload?.session?.user?.domain_name,
        storageLocation: payload?.session?.user?.storage_location
      })
    );
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

  console.log(
    '[DEBUG:worker] backup started',
    JSON.stringify({
      aliasId: payload?.session?.user?.alias_id,
      aliasName: payload?.session?.user?.alias_name,
      domainName: payload?.session?.user?.domain_name,
      storageLocation: payload?.session?.user?.storage_location
    })
  );
  logger.debug('backup worker', { payload });

  let tmp;
  let backup;
  let err;

  //
  // Look up domain to check for custom S3 configuration
  // This allows per-domain S3-compatible storage providers
  //
  let domain;
  try {
    domain = await Domains.findById(payload.session.user.domain_id)
      .select('+s3_access_key_id +s3_secret_access_key')
      .lean()
      .exec();
  } catch (err) {
    logger.warn(err, { payload });
  }

  let { client: s3, bucket: customBucket } = getS3Client(domain);

  //
  // If using custom S3, validate the bucket is not publicly accessible.
  // Public buckets are a serious security risk for email backups.
  // If public, fall back to default S3 and alert domain admins once daily.
  //
  if (domain && domain.has_custom_s3 === true && customBucket) {
    try {
      const isPublic = await checkS3BucketAccess(
        domain.s3_endpoint,
        customBucket,
        10000,
        resolver
      );
      if (isPublic) {
        // Save original bucket name for the email notification
        const publicBucketName = customBucket;

        logger.warn(
          'Custom S3 bucket is publicly accessible, falling back to default',
          {
            domain_id: domain._id,
            bucket: publicBucketName
          }
        );

        // Fall back to default S3 client
        const defaultResult = getS3Client();
        s3 = defaultResult.client;
        customBucket = null;

        // Email domain admins once daily about the public bucket
        const publicBucketKey = `custom_s3_public_bucket:${domain._id}`;
        const publicBucketCache = await client.get(publicBucketKey);
        if (!publicBucketCache) {
          await client.set(publicBucketKey, 'true', 'PX', ms('1d'));
          try {
            const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
              domain
            );
            await email({
              template: 'alert',
              message: {
                to,
                subject: i18n.translate(
                  'CUSTOM_S3_PUBLIC_BUCKET_SUBJECT',
                  locale,
                  domain.name
                )
              },
              locals: {
                message: i18n.translate(
                  'CUSTOM_S3_PUBLIC_BUCKET_MESSAGE',
                  locale,
                  publicBucketName,
                  domain.name
                ),
                locale
              }
            });
          } catch (_err) {
            logger.fatal(_err, { payload });
          }
        }
      }
    } catch (err) {
      logger.warn(err, { payload });
    }
  }

  // create bucket on s3 if it doesn't already exist
  // <https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/>
  const bucket =
    customBucket ||
    `${config.env}-${dashify(
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

  //
  // the key is either `.sqlite` for "sqlite" value of `payload.format`
  // or it is `.mbox` for "mbox" value or `zip` for "eml" value
  //
  // for custom S3 storage, prefix with ISO 8601 timestamp so users
  // retain a full backup history in their own bucket
  // (e.g. "2025-03-01T12:00:00.000Z-alias_id.sqlite")
  //
  // for default (system) S3 storage, use the flat key pattern
  // (e.g. "alias_id.sqlite") which overwrites the previous backup
  //
  const baseKey = `${payload.session.user.alias_id}.${extension}`;
  const key = customBucket
    ? `${new Date(payload.backup_at).toISOString()}-${baseKey}`
    : baseKey;

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

    if (config.env !== 'test' && !customBucket) {
      let res;
      try {
        res = await s3.send(
          new HeadBucketCommand({
            Bucket: bucket
          })
        );
      } catch (err) {
        if (err.name !== 'NotFound') throw err;
      }

      if (res?.$metadata?.httpStatusCode !== 200) {
        try {
          await s3.send(
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
      logger.warn(err, { payload });
    }

    switch (payload.format) {
      case 'sqlite': {
        // create backup
        // takes approx 5-10s per GB
        db.pragma('wal_checkpoint(PASSIVE)');
        db.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}';`);

        await closeDatabase(db);

        if (isCancelled) throw new ServerShutdownError();

        backup = true;

        //
        // open the backup to ensure that encryption still valid
        // (getDatabase takes 5 params: instance, alias, session,
        //  newlyCreated, customDbFilePath — pass `tmp` as the custom
        //  path so the BACKUP file is verified, not the live database)
        //
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
          output.once('error', reject);
          output.once('close', resolve);
          archive.once('error', reject);
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
          output.once('error', reject);
          output.once('close', resolve);
          archive.once('error', reject);
        });
        break;
      }
      // No default
    }

    // Close db handle for mbox/eml cases (sqlite case already closes it)
    if (db && db.open) await closeDatabase(db);

    // The temporary backup now exists and must be cleaned up for every format.
    backup = true;

    // calculate hash of file
    const hash = await hasha.fromFile(tmp, { algorithm: 'sha256' });

    // check if hash already exists in s3
    let shouldUpload = true;
    try {
      const obj = await s3.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key
        })
      );

      if (obj?.Metadata?.hash === hash) {
        shouldUpload = false;
        logger.debug('Backup hash already exists, skipping upload', {
          bucket,
          key,
          hash
        });
      }
    } catch (err) {
      // For custom S3 providers, transient errors (timeouts, throttling)
      // from HeadObject should not abort the backup — just proceed with upload.
      // Only re-throw for default (system) S3 where NotFound is the only expected error.
      if (customBucket) {
        logger.warn('HeadObject failed on custom S3, proceeding with upload', {
          bucket,
          key,
          error: err.message
        });
      } else if (err.name !== 'NotFound') {
        throw err;
      }
    }

    if (isCancelled) throw new ServerShutdownError();

    if (shouldUpload) {
      const source = fs.createReadStream(tmp);
      const body = source.pipe(
        createThrottleStream(BACKUP_UPLOAD_BYTES_PER_SECOND, {
          limiter: backupUploadLimiter
        })
      );
      source.on('error', (err) => body.destroy(err));

      const upload = new Upload({
        client: s3,
        queueSize: 2,
        partSize: 8 * 1024 * 1024,
        params: {
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType:
            mimeTypes.lookup(extension) ||
            (extension === 'sqlite'
              ? 'application/vnd.sqlite3'
              : 'application/octet-stream'),
          Metadata: { hash }
        }
      });
      await upload.done();

      // Immediately unlink tmp file to release page cache
      try {
        await fs.promises.rm(tmp, { force: true });
      } catch {}
    }

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
    // For custom S3 buckets, client-side errors (4xx like AccessDenied,
    // InvalidSignature) are user configuration issues, not code bugs.
    // Preserve the original error message so the user gets actionable
    // feedback (e.g. "Forbidden: Invalid signature") instead of the
    // generic "An internal server error has occurred" from refineAndLogError.
    // Guard with $metadata.httpStatusCode to ensure this is genuinely an
    // AWS SDK service exception and not an unrelated error leaking internals.
    err.isCodeBug = !(
      customBucket &&
      err.$fault === 'client' &&
      typeof err.$metadata?.httpStatusCode === 'number'
    );

    logger.fatal(err, { payload });
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
      logger.fatal(_err, { payload });
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
      logger.fatal(err, { payload });
    }
  }

  //
  // NOTE: out of scope asynchronous code will NOT get run
  //       (so we cannot do `then()` here to run after throwing)
  //
  // For SQLITE_NOTADB errors (wrong password / corrupt DB), set a 4-hour
  // cooldown instead of deleting the key. This prevents the same alias from
  // being retried hundreds of times per hour (the IMAP client re-triggers
  // backup on every connection, and without a cooldown it retries immediately).
  //
  if (err && err.code === 'SQLITE_NOTADB') {
    try {
      await client.set(
        `backup_check:${payload.session.user.alias_id}`,
        'notadb_cooldown',
        'PX',
        ms('4h')
      );
    } catch (_err) {
      logger.fatal(_err);
    }
  } else {
    try {
      await client.del(`backup_check:${payload.session.user.alias_id}`);
    } catch (_err) {
      logger.fatal(_err);
    }
  }

  // if an error occurred then allow cache to attempt again
  if (err) {
    console.error(
      '[ERROR:worker] backup failed',
      JSON.stringify({
        errName: err?.name,
        errMessage: err?.message?.slice(0, 500),
        errCode: err?.code,
        aliasId: payload?.session?.user?.alias_id,
        aliasName: payload?.session?.user?.alias_name,
        domainName: payload?.session?.user?.domain_name,
        storageLocation: payload?.session?.user?.storage_location
      })
    );
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

    //
    // if the domain has custom S3 configured, email domain admins
    // with a friendly error message (with Redis 6-hour dedup)
    //
    if (domain && domain.has_custom_s3 === true) {
      const domainAdminKey = `custom_s3_backup_error:${payload.session.user.domain_id}`;
      const domainAdminCache = await client.get(domainAdminKey);
      if (!domainAdminCache) {
        await client.set(domainAdminKey, true, 'PX', ms('6h'));
        try {
          const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
            domain
          );
          await email({
            template: 'alert',
            message: {
              to,
              subject: i18n.translate(
                'CUSTOM_S3_BACKUP_ERROR_SUBJECT',
                locale,
                payload.session.user.username,
                domain.name
              )
            },
            locals: {
              message: i18n.translate(
                'CUSTOM_S3_BACKUP_ERROR_MESSAGE',
                locale,
                payload.session.user.username,
                domain.name,
                err.message === 'Database empty'
                  ? err.message
                  : refineAndLogError(err, payload.session).message
              ),
              locale
            }
          });
        } catch (_err) {
          logger.fatal(_err, { payload });
        }
      }
    }

    throw err;
  }

  // include URL link in the email to download
  const link = await getSignedUrl(
    s3,
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

//
// Offloaded VACUUM: runs in the sqlite-worker process so it never blocks
// the IMAP/POP3 event loop.  Opens the database directly (bypassing
// getDatabase to avoid re-triggering maintenance), performs VACUUM INTO
// with atomic rename, and updates MongoDB/Redis on success.
//
async function vacuum(payload) {
  if (isCancelled) throw new ServerShutdownError();
  await setupMongoose(logger);

  const aliasId = payload.session.user.alias_id;
  const storagePath = getPathToDatabase({
    id: aliasId,
    storage_location: payload.session.user.storage_location
  });

  // Check if file exists
  let stats;
  try {
    stats = await fs.promises.stat(storagePath);
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }

  if (!stats.isFile() || stats.size === 0) return;

  let db;
  try {
    // Open database directly (NOT via getDatabase) to avoid re-triggering
    // maintenance or VACUUM recursion.
    db = new Database(storagePath, {
      timeout: config.busyTimeout,
      verbose: boolean(env.SQLITE_VERBOSE) ? console.log : null
    });
    await setupPragma(db, payload.session);

    // Check if auto_vacuum is already enabled (FULL=1)
    const autoVacuumMode = db.pragma('auto_vacuum', { simple: true });
    if (autoVacuumMode === 1) {
      // Already FULL — nothing to do
      db.close();
      db = null;
      await client.set(`vacuum_check:${aliasId}`, 'true', 'PX', ms('7d'));
      return;
    }

    //
    // Perform the swap via the shared safe-swap implementation, which
    // acquires vacuum_lock + db_swap_lock, broadcasts db_cache_evict to
    // quiesce stale handles in the other PM2 workers, checkpoints the WAL
    // fail-closed, verifies the new file, and only then atomically renames
    // it over the live database.  It also handles lock release and tmp
    // cleanup, and closes `db` when the swap succeeds.
    //
    const result = await safeVacuum({
      db,
      dbFilePath: storagePath,
      aliasId,
      client,
      session: payload.session
    });

    if (!result.swapped) return;

    // safeVacuum closed the handle before the rename
    db = null;

    // Mark migration complete in MongoDB
    await Aliases.findByIdAndUpdate(aliasId, {
      $set: { has_auto_vacuum_migration: true }
    });

    // Set Redis TTL so we don't re-run for 7 days
    await client.set(`vacuum_check:${aliasId}`, 'true', 'PX', ms('7d'));

    logger.info('VACUUM completed', {
      alias_id: aliasId,
      alias_name: payload.session.user.alias_name
    });
  } catch (err) {
    err.isCodeBug = true;
    logger.fatal(err, { alias_id: aliasId });
  } finally {
    if (db && db.open) db.close();
  }
}

module.exports = { rekey, backup, vacuum };
