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
const { Buffer } = require('node:buffer');
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
const isSANB = require('is-string-and-not-blank');
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

const isEmail = require('#helpers/is-email');
const _ = require('#helpers/lodash');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const AttachmentStorage = require('#helpers/attachment-storage');
const appendContactsAndCalendarsToArchive = require('#helpers/append-contacts-and-calendars-to-archive');
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
const getRekeyTmpPath = require('#helpers/get-rekey-tmp-path');
const openDatabaseHandle = require('#helpers/open-database-handle');
const i18n = require('#helpers/i18n');
const isRetryableError = require('#helpers/is-retryable-error');
const isStorageAvailable = require('#helpers/is-storage-available');
const logger = require('#helpers/logger');
const refineAndLogError = require('#helpers/refine-and-log-error');
const safeVacuum = require('#helpers/safe-vacuum');
const setupMongoose = require('#helpers/setup-mongoose');
const setupPragma = require('#helpers/setup-pragma');
const { decrypt } = require('#helpers/encrypt-decrypt');
const workerConfig = require('#helpers/sqlite-worker-config');
const { finalizeRekey, rollbackRekey } = require('#helpers/rekey-recovery');
const { withDbFileLock } = require('#helpers/db-file-lock');
const {
  companionFileExists,
  fsyncDirectory,
  removeCompanionFiles
} = require('#helpers/sqlite-file-utils');
const checkS3BucketAccess = require('#helpers/check-s3-bucket-access');
const createTangerine = require('#helpers/create-tangerine');
const { getS3Client } = require('#helpers/get-s3-client');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');
const env = require('#config/env');

const BackupUploadLimiter = require('#helpers/backup-upload-limiter');
const parseBandwidth = require('#helpers/parse-bandwidth');
const createThrottleStream = require('#helpers/throttle-stream');

const builder = new Builder({ bufferAsNative: true });

const HOSTNAME = os.hostname();

// rekey operation IDs are UUIDs minted by the controller (they name files)
const REKEY_ID_REGEX = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;

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

//
// Error thrown when this rekey no longer owns the alias' rekey state (it was
// rolled back or superseded while running).  It is not a failure of the
// mailbox and the user has already been (or will be) notified by whoever
// took the state over, so no "rekey failed" email is sent for it.
//
class RekeySupersededError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RekeySupersededError';
    this.code = 'SQLITE_BUSY';
    this.isRekeySuperseded = true;
  }
}

//
// Thrown (and caught) inside `rekey` to leave the main sequence early when
// the mailbox already uses the new password and no file swap is needed.  It
// is control flow, not a failure: the alias is finalized as a success.
//
class RekeyNotNeeded extends Error {
  constructor() {
    super('Rekey not needed');
    this.name = 'RekeyNotNeeded';
  }
}

//
// A transient condition (storage not mounted, MongoDB/Redis unavailable,
// another swap in progress, a stale connection that does not close in time,
// low memory).  Nothing about the mailbox has changed: the rekey is put back
// in the queue with a backoff and run again from the start instead of being
// failed and rolled back.  Only after REKEY_MAX_ATTEMPTS does it fail.
//
class RekeyRetryableError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'RekeyRetryableError';
    this.code = 'SQLITE_BUSY';
    this.isRekeyRetryable = true;
    if (cause) this.cause = cause;
  }
}

function isTransientRekeyError(err) {
  return Boolean(
    err &&
      !err.isRekeySuperseded &&
      (err.isRekeyRetryable ||
        err.isDbFileLock ||
        err.code === 'SQLITE_BUSY' ||
        err.code === 'SQLITE_LOCKED' ||
        err.code === 'SQLITE_PROTOCOL' ||
        err.name === 'MongoNetworkError' ||
        err.name === 'MongoNetworkTimeoutError' ||
        err.name === 'MongoServerSelectionError' ||
        err.name === 'MongooseServerSelectionError' ||
        err.name === 'MongoNotConnectedError' ||
        err.name === 'MongoTopologyClosedError' ||
        err.name === 'MongoPoolClearedError' ||
        // mongoose buffered the operation while disconnected and gave up
        (err.name === 'MongooseError' &&
          /buffering timed out/i.test(err.message || '')) ||
        err.name === 'MaxRetriesPerRequestError' ||
        err.code === 'ECONNREFUSED' ||
        err.code === 'ECONNRESET' ||
        err.code === 'ETIMEDOUT')
  );
}

async function sendRekeyEmail(payload, subjectKey, messageKey, ...args) {
  try {
    await email({
      template: 'alert',
      message: {
        to: payload.session.user.owner_full_email,
        ...(subjectKey === 'ALIAS_REKEY_FAILED_SUBJECT'
          ? { cc: config.alertsEmail }
          : {}),
        subject: i18n.translate(
          subjectKey,
          payload.session.user.locale,
          payload.session.user.username
        )
      },
      locals: {
        message: i18n.translate(
          messageKey,
          payload.session.user.locale,
          payload.session.user.username,
          ...args
        ),
        locale: payload.session.user.locale
      }
    });
  } catch (err) {
    // an email failure must never change the outcome of a rekey
    logger.fatal(err, { payload: { ...payload, session: undefined } });
  }
}

async function rekey(payload) {
  if (isCancelled) throw new ServerShutdownError();

  await setupMongoose(logger);

  //
  // Validate the payload before touching anything: every field below is
  // used to locate or decrypt the mailbox and a malformed job must fail here
  // rather than half way through.
  //
  if (
    !mongoose.isObjectIdOrHexString(payload?.session?.user?.alias_id) ||
    !mongoose.isObjectIdOrHexString(payload?.session?.user?.domain_id) ||
    typeof payload?.session?.user?.storage_location !== 'string' ||
    !isSANB(payload?.session?.user?.password) ||
    !isSANB(payload?.new_password) ||
    (payload.rekey_id !== undefined && !REKEY_ID_REGEX.test(payload.rekey_id))
  ) {
    const err = new TypeError('Invalid rekey payload');
    err.isCodeBug = true;
    err.payload = { ...payload, session: undefined };
    throw err;
  }

  const aliasId = new mongoose.Types.ObjectId(payload.session.user.alias_id);
  const domainId = new mongoose.Types.ObjectId(payload.session.user.domain_id);

  // Every state transition below is scoped to this exact operation so a
  // duplicate, re-queued, or superseded job can never touch newer state.
  const rekeyFilter = {
    _id: aliasId,
    domain: domainId,
    is_rekey: true,
    ...(payload.rekey_id
      ? { rekey_id: payload.rekey_id }
      : { rekey_id: { $exists: false } })
  };

  //
  // Claim this specific rekey before touching SQLite. A controller can then
  // distinguish an unacknowledged queue request from work already in flight,
  // and recovery knows that a claimed rekey which this (single) worker is
  // not processing belongs to a process that died.
  //
  const claimedAt = new Date();
  let claimedRekey;
  try {
    claimedRekey = await Aliases.findOneAndUpdate(
      {
        ...rekeyFilter,
        rekey_processing: { $ne: true }
      },
      {
        $set: {
          rekey_processing: true,
          rekey_claimed_at: claimedAt
        }
      }
    )
      .select('_id storage_used')
      .lean()
      .exec();
  } catch (claimErr) {
    // nothing was claimed: the job simply runs again later
    throw new RekeyRetryableError(
      `Unable to claim rekey ${payload.rekey_id}: ${claimErr.message}`,
      claimErr
    );
  }

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
  // handles are tracked outside of the try block so they are always closed
  // (a leaked handle keeps -wal/-shm files alive and makes every subsequent
  //  rekey attempt for this alias fail its exclusivity proof)
  let db;
  let backupDb;
  // `swapMarked` is set once the swap was recorded in MongoDB, `swapped` once
  // the rename over the live database was confirmed on disk
  let swapMarked = false;
  let swapped = false;
  // set when the mailbox already uses the new password and no swap is needed
  let alreadyRekeyed = false;

  try {
    const storagePath = getPathToDatabase({
      id: payload.session.user.alias_id,
      storage_location: payload.session.user.storage_location
    });

    //
    // The new password decrypts to the raw key of the rekeyed database.  An
    // empty key would REMOVE the encryption (that is how SQLite3MultipleCiphers
    // interprets it), so it must be validated before anything else.
    //
    const newPassword = decrypt(payload.new_password);
    if (typeof newPassword !== 'string' || newPassword.length === 0) {
      const err = new TypeError('New password is empty');
      err.isCodeBug = true;
      throw err;
    }

    //
    // No process may keep a handle to the live file from here on: cached
    // handles are dropped fleet-wide (a request still using one closes it
    // the moment it is done) and the sqlite server refuses to open new
    // ones while `is_rekey` is set.  Together with the temporary-mailbox
    // fallback for inbound mail this guarantees that nothing written after
    // the VACUUM INTO snapshot below can be lost with the swap.
    //
    try {
      await client.publish('db_cache_evict', payload.session.user.alias_id);
    } catch (err) {
      logger.debug(err);
    }

    await setTimeout(ms('1s'));

    // <https://github.com/nodejs/node/issues/38006>
    let stats;
    try {
      stats = await fs.promises.stat(storagePath);
    } catch (statErr) {
      if (statErr.code !== 'ENOENT') throw statErr;
    }

    if (stats && !stats.isFile()) {
      const err = new TypeError(`${storagePath} is not a file`);
      err.isCodeBug = true;
      err.stats = stats;
      throw err;
    }

    //
    // A missing file only means "no mailbox" when the storage volume is
    // actually there; otherwise nothing can be concluded and the rekey
    // waits for the volume (retried with backoff).
    //
    if (!stats && !isStorageAvailable(storagePath))
      throw new RekeyRetryableError(
        `Storage volume for ${storagePath} is not available`
      );

    //
    // The volume is there but the mailbox of an alias that is known to hold
    // data is not: the file is lost or misplaced (e.g. an empty volume was
    // mounted in place of the real one).  Finalizing would discard the only
    // password that can decrypt the mailbox once it is back, so the rekey
    // waits instead (and fails, with the previous password restored, once
    // the retries are used up).
    //
    if (
      !stats &&
      typeof claimedRekey.storage_used === 'number' &&
      claimedRekey.storage_used > 0
    )
      throw new RekeyRetryableError(
        `Mailbox file ${storagePath} is missing although the alias reports ${bytes(
          claimedRekey.storage_used
        )} in use`
      );

    //
    // No mailbox on disk, or an empty file: there is nothing to rekey.  The
    // next open initializes the mailbox with the password that opens it,
    // i.e. the new one, so the rotation is complete.  An empty file (a
    // creation that never finished) is removed together with any companion
    // files so a stale -wal cannot be replayed into the fresh mailbox --
    // under the file mutex and re-checked there, so a creation that is in
    // progress right now (the file grows once its creator releases the
    // mutex) is rekeyed like any other mailbox instead.
    //
    let nothingToRekey = !stats;
    if (stats && stats.size === 0) {
      nothingToRekey = await withDbFileLock(
        storagePath,
        { purpose: 'rekey' },
        async () => {
          let current;
          try {
            current = fs.statSync(storagePath);
          } catch (statErr) {
            if (statErr.code !== 'ENOENT') throw statErr;
            return true;
          }

          if (current.size > 0) return false;

          await removeCompanionFiles(storagePath, [
            '',
            '-wal',
            '-shm',
            '-journal'
          ]);
          return true;
        }
      );

      // the file was being created: use its real size below
      if (!nothingToRekey) stats = await fs.promises.stat(storagePath);
    }

    if (nothingToRekey) {
      logger.warn('Rekey of an alias without a mailbox, nothing to rekey', {
        alias_id: payload.session.user.alias_id,
        storagePath
      });
      throw new RekeyNotNeeded();
    }

    // we calculate size of db x 2 (backup + tarball)
    const spaceRequired = stats.size * 2;

    const diskSpace = await checkDiskSpace(storagePath);
    if (diskSpace.free < spaceRequired)
      throw new RekeyRetryableError(
        `Needed ${bytes(spaceRequired)} but only ${bytes(
          diskSpace.free
        )} was available`
      );

    //
    // Ensure a reasonable amount of memory is free before starting.
    //
    // NOTE: unlike `backup` (which builds mbox/eml archives in memory) a
    //       rekey is a VACUUM INTO followed by VACUUMs with `temp_store=1`
    //       (temporary tables on disk) and a 16 MB page cache, so its memory
    //       use does not scale with the mailbox size.  Requiring 2x the
    //       database size in free memory made every rekey of a large
    //       mailbox time out on a busy host.
    //
    try {
      await pWaitFor(() => os.freemem() > workerConfig.MIN_FREE_MEM, {
        interval: ms('30s'),
        timeout: ms('5m')
      });
    } catch (err) {
      const retryErr = new RekeyRetryableError(
        `Rekey not started due to low memory for ${payload.session.user.username}`,
        err
      );
      retryErr.freemem = os.freemem();
      retryErr.minFreeMem = workerConfig.MIN_FREE_MEM;
      throw retryErr;
    }

    //
    // create backup
    //
    // NOTE: the temporary file is named after the rekey operation (instead of
    //       the WebSocket request) so a re-queued job can clean up after a
    //       hard kill and recovery can reason about it
    //
    tmp = getRekeyTmpPath(storagePath, payload);

    if (isCancelled) throw new ServerShutdownError();

    //
    // cleanup tmp if it already exists (e.g. this job was re-queued after a
    // hard kill mid-VACUUM INTO), otherwise SQLite throws
    // "output file already exists" and the retry can never succeed
    //
    await removeCompanionFiles(tmp, ['', '-wal', '-shm', '-journal']);

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
    //
    // Which password opens the mailbox right now?  Normally the previous
    // one.  If only the NEW one does, a previous run of this rotation
    // already swapped the file and just the bookkeeping is missing:
    // finalize instead of failing (a rollback would restore tokens that
    // cannot decrypt the mailbox).  If neither does the mailbox is
    // unreadable and the rotation fails (the previous tokens are restored,
    // which is the state the user started from).
    //
    // The probes are read-only (a read-only connection to a WAL-mode file
    // may create empty -wal/-shm companions, which are harmless and are
    // cleaned up by the read-write open below), and they happen before
    // `getDatabase` so an unreadable mailbox does not enter its
    // corruption-recovery path.
    //
    const opensWith = (password) =>
      withDbFileLock(storagePath, { purpose: 'rekey-probe' }, async () => {
        const probeDb = new Database(storagePath, {
          readonly: true,
          fileMustExist: true,
          timeout: config.busyTimeout
        });
        try {
          await setupPragma(probeDb, {
            user: { ...payload.session.user, password }
          });
          // reads the schema page: a wrong key cannot get this far
          return Number.isInteger(
            probeDb.pragma('schema_version', { simple: true })
          );
        } catch (probeErr) {
          if (probeErr.code !== 'SQLITE_NOTADB') throw probeErr;
          return false;
        } finally {
          try {
            probeDb.close();
          } catch {}
        }
      });

    if (!(await opensWith(payload.session.user.password))) {
      if (await opensWith(payload.new_password)) {
        logger.warn('Mailbox already uses the new password, nothing to rekey', {
          alias_id: payload.session.user.alias_id,
          storagePath
        });
        throw new RekeyNotNeeded();
      }

      const err = new Error(
        `Mailbox for ${payload.session.user.username} cannot be opened with the previous nor the new password`
      );
      err.code = 'SQLITE_NOTADB';
      err.isCodeBug = true;
      throw err;
    }

    if (isCancelled) throw new ServerShutdownError();

    // TODO: this should not fix database
    db = await getDatabase(
      instance,
      // alias
      {
        id: payload.session.user.alias_id,
        storage_location: payload.session.user.storage_location
      },
      payload.session
    );

    //
    // A request that was already in flight when the rotation started may
    // still commit to the live file around the snapshot (its handle is
    // closed as soon as it is done).  Such a commit must never be lost with
    // the swap, so the rekey starts over with a fresh snapshot whenever one
    // is detected.  Three checks cover the three phases:
    //
    //  1. while our handle is open: `data_version` changes whenever another
    //     connection (in any process) commits, so a different value after
    //     VACUUM INTO means the snapshot may not include that commit
    //  2. at our close: the last connection to close checkpoints the WAL
    //     into the main file, so a main file that changed across our own
    //     close carried frames of another connection (ours only read after
    //     the checkpoint below)
    //  3. after our close and until the swap: the main file's mtime is set
    //     to a marker in the past right after the close; a commit that is
    //     checkpointed later (by the closing connection) moves it, which
    //     the exclusivity proof re-checks before the rename.  A marker
    //     cannot be mistaken for "unchanged" whatever the timestamp
    //     granularity of the file system.
    //
    // run a checkpoint to copy over wal to db
    db.pragma('wal_checkpoint(PASSIVE)');

    const dataVersionBefore = db.pragma('data_version', { simple: true });

    // create backup
    db.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}';`);

    const dataVersionAfter = db.pragma('data_version', { simple: true });
    if (dataVersionAfter !== dataVersionBefore)
      throw new RekeyRetryableError(
        `REKEY aborted, another connection committed to the live database of alias ${payload.session.user.alias_id} while the snapshot was taken`
      );

    //
    // The handle is closed right away and without the usual `optimize`
    // (which may write): from here on nothing of ours may change the live
    // file, and the handle must be closed before the exclusivity proof
    // below (our own -wal/-shm files would abort the swap).
    //
    // (synchronous: nothing may run between the stats and the close)
    //
    const preCloseStats = fs.statSync(storagePath, { bigint: true });
    db.close();
    if (db.open)
      throw new TypeError('Live database handle could not be closed');
    const postCloseStats = fs.statSync(storagePath, { bigint: true });
    if (
      postCloseStats.size !== preCloseStats.size ||
      postCloseStats.mtimeNs !== preCloseStats.mtimeNs
    )
      throw new RekeyRetryableError(
        `REKEY aborted, the live database of alias ${payload.session.user.alias_id} was checkpointed after the snapshot was taken`
      );

    //
    // Baseline for the swap (see above): the marker is a minute in the past
    // so that any later write to the main file -- which sets the current
    // time -- differs from it.  When the marker cannot be set the plain
    // baseline is used (a change is then still detected, unless it lands
    // within the file system's timestamp granularity of our close).
    //
    try {
      fs.utimesSync(
        storagePath,
        Number(preCloseStats.atimeMs) / 1000,
        (Date.now() - ms('1m') - Math.floor(Math.random() * 1000)) / 1000
      );
    } catch (err) {
      logger.warn(err, { storagePath });
    }

    const snapshotStats = fs.statSync(storagePath, { bigint: true });

    if (isCancelled) throw new ServerShutdownError();
    // open the backup and encrypt it
    backupDb = await getDatabase(
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

    //
    // safeguard: every pragma below is destructive, so never run them
    // against anything other than the temporary copy we just created
    //
    if (backupDb.name !== tmp) {
      const err = new TypeError(
        `Expected backup handle for "${tmp}" but got "${backupDb.name}"`
      );
      err.isCodeBug = true;
      throw err;
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

    //
    // Rekey through the binary API so the key is derived exactly the way
    // `setupPragma` derives it on open (`db.key(Buffer)`), with no SQL
    // string quoting involved.
    //
    backupDb.rekey(Buffer.from(newPassword));

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

    if (backupDb.open)
      throw new TypeError('Rekeyed database handle could not be closed');

    //
    // Final verification: re-open the rekeyed database with the NEW password
    // to confirm it can actually be decrypted. This catches edge cases where
    // the rekey appeared to succeed but the file is unreadable.
    //
    // NOTE: the handle is read-only so nothing (journal mode, -wal/-shm files)
    //       can be changed on the file that is about to replace the live one
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

        // the rekeyed copy must be a rollback-journal database: a WAL-mode
        // copy would create -wal/-shm files the moment it is opened
        const verifyJournalMode = verifyDb.pragma('journal_mode', {
          simple: true
        });
        if (verifyJournalMode === 'wal') {
          throw new TypeError('Rekeyed database is unexpectedly in WAL mode');
        }
      } finally {
        try {
          verifyDb.close();
        } catch {}
      }
    }

    // the verification must not have left companion files behind
    for (const suffix of ['-wal', '-shm', '-journal']) {
      if (fs.existsSync(`${tmp}${suffix}`))
        throw new TypeError(`Rekeyed database left a ${suffix} file behind`);
    }

    //
    // Identity of the copy that was just verified: only this exact file may
    // be renamed over the live database (re-checked right before the
    // rename, so a copy that was replaced or written to in the meantime --
    // which no process should ever do -- can never be swapped in).
    //
    const verifiedStats = fs.statSync(tmp, { bigint: true });

    if (isCancelled) throw new ServerShutdownError();

    //
    // Cross-process quiesce BEFORE swapping the rekeyed file over the
    // live database.  Stale handles in other PM2 cluster workers keep
    // writing to the old inode, and their orphaned encrypted -wal file
    // would get replayed onto the new file after the rename, causing
    // SQLITE_NOTADB / SQLITE_CORRUPT corruption.
    //
    // Two locks are held for the swap:
    //
    //  1. the Redis `db_swap_lock` tells `getDatabase()` callers in the
    //     sqlite cluster workers to wait instead of opening the file, and
    //     serializes this swap with an inline VACUUM migration
    //  2. the per-file mutex (helpers/db-file-lock.js) is what makes the
    //     exclusivity proof airtight: every open of a live database takes
    //     it synchronously around `new Database()`, so once we hold it no
    //     connection can appear until the new file is in place, no matter
    //     how long another process' event loop stalls
    //
    const swapLockKey = `db_swap_lock:${payload.session.user.alias_id}`;
    const swapLockOwner = `${HOSTNAME}:${process.pid}:${Date.now()}`;
    const swapLockDeadline = Date.now() + workerConfig.REKEY_SWAP_LOCK_WAIT;
    let swapLockAcquired = false;
    for (;;) {
      swapLockAcquired = await client.set(
        swapLockKey,
        swapLockOwner,
        'PX',
        ms('5m'),
        'NX'
      );
      if (swapLockAcquired) break;
      if (Date.now() > swapLockDeadline)
        throw new RekeyRetryableError(
          `Database swap in progress by another worker for alias ${payload.session.user.alias_id}`
        );

      if (isCancelled) throw new ServerShutdownError();
      await setTimeout(ms('1s'));
    }

    try {
      await withDbFileLock(
        storagePath,
        { purpose: 'rekey', timeoutMs: workerConfig.REKEY_SWAP_LOCK_WAIT },
        async (fileLock) => {
          //
          // Broadcast cache eviction to ALL workers via Redis pub/sub so
          // stale handles to the about-to-be-replaced file are closed
          // everywhere, then wait a grace period for the eviction to land.
          //
          // Exclusivity proof: if -wal/-shm files (or a hot rollback
          // journal) still exist after eviction, a stale handle somewhere
          // is still open on the old inode.  A handle that was mid-query
          // when the eviction arrived is closed by the sqlite cluster worker
          // as soon as that query finishes, so keep re-broadcasting and
          // re-checking until the quiesce timeout, then abort instead of
          // corrupting the new file.
          //
          //
          // A mutex that had to be broken as stale may have belonged to an
          // open that is merely stalled (a process that is alive but not
          // running): its connection could still appear.  The proof is
          // then only trusted once it held for two consecutive checks.
          //
          const quiesceDeadline =
            Date.now() + workerConfig.REKEY_QUIESCE_TIMEOUT;
          const cleanChecksRequired = fileLock.brokeStale ? 2 : 1;
          let cleanChecks = 0;
          let attempt = 0;
          for (;;) {
            attempt++;
            try {
              await client.publish(
                'db_cache_evict',
                payload.session.user.alias_id
              );
            } catch (err) {
              logger.debug(err);
            }

            await setTimeout(ms('1s'));

            const leftover = ['-wal', '-shm', '-journal'].filter((suffix) =>
              companionFileExists(storagePath, suffix)
            );
            if (leftover.length === 0) {
              cleanChecks++;
              if (cleanChecks >= cleanChecksRequired) break;
              await setTimeout(workerConfig.REKEY_QUIESCE_INTERVAL);
              continue;
            }

            cleanChecks = 0;

            if (isCancelled) throw new ServerShutdownError();

            if (Date.now() > quiesceDeadline)
              throw new RekeyRetryableError(
                `REKEY aborted, ${leftover.join(
                  '/'
                )} files still exist for alias ${
                  payload.session.user.alias_id
                } (another connection is still open)`
              );

            logger.warn(
              `REKEY waiting for stale connections to close for alias ${
                payload.session.user.alias_id
              } (attempt ${attempt}, ${leftover.join('/')} still exist)`
            );
            await setTimeout(workerConfig.REKEY_QUIESCE_INTERVAL);
          }

          //
          // Nothing can open the live file now (we hold the mutex) and no
          // connection to it exists (the proof above): compare it with the
          // baseline taken after the snapshot.  A difference means an
          // in-flight request committed after the snapshot; see above.
          //
          const liveStats = fs.statSync(storagePath, { bigint: true });
          if (
            liveStats.ino !== snapshotStats.ino ||
            liveStats.size !== snapshotStats.size ||
            liveStats.mtimeNs !== snapshotStats.mtimeNs
          )
            throw new RekeyRetryableError(
              `REKEY aborted, live database of alias ${payload.session.user.alias_id} changed after the snapshot was taken (${snapshotStats.size} -> ${liveStats.size} bytes)`
            );

          //
          // Ownership re-check and swap marker in ONE atomic update: if
          // this operation was rolled back in the meantime (e.g. by the
          // stale-rekey job) nothing matches and the live file is left
          // untouched, so the restored tokens still decrypt it.  The inode
          // of the rekeyed copy is recorded so that recovery can tell for
          // certain whether the rename below happened.
          //
          const tmpStats = await fs.promises.stat(tmp, { bigint: true });
          if (
            tmpStats.ino !== verifiedStats.ino ||
            tmpStats.size !== verifiedStats.size ||
            tmpStats.mtimeNs !== verifiedStats.mtimeNs
          ) {
            const err = new Error(
              `REKEY aborted, rekeyed copy ${tmp} changed after it was verified`
            );
            err.isCodeBug = true;
            throw err;
          }

          const marked = await Aliases.updateOne(
            {
              ...rekeyFilter,
              rekey_processing: true
            },
            {
              $set: {
                rekey_swap_ino: tmpStats.ino.toString(),
                rekey_swapped_at: new Date()
              }
            }
          );

          if (marked.matchedCount !== 1)
            throw new RekeySupersededError(
              `REKEY aborted, alias ${payload.session.user.alias_id} no longer owns rekey operation ${payload.rekey_id}`
            );

          swapMarked = true;

          //
          // Both locks must still be ours: a lock that was broken as stale
          // (only possible if this process stalled for minutes) means
          // another process may have opened the old inode meanwhile.
          //
          const swapLockValue = await client.get(swapLockKey);
          if (!fileLock.isOwned() || swapLockValue !== swapLockOwner) {
            const err = new Error(
              `REKEY aborted, lost swap lock ownership for alias ${payload.session.user.alias_id}`
            );
            err.code = 'SQLITE_BUSY';
            throw err;
          }

          //
          // remove the old -wal/-shm/-journal files BEFORE the rename
          // (removing them after the rename could delete files belonging
          //  to the freshly swapped-in database); the proof above showed
          //  no connection owns them
          //
          await removeCompanionFiles(storagePath, ['-wal', '-shm', '-journal']);

          // rename backup file (overwrites existing destination file)
          try {
            await fs.promises.rename(tmp, storagePath);
            swapped = true;
          } catch (renameErr) {
            //
            // The file system is the source of truth: confirm on disk
            // before treating this as a failure (the inode moves with the
            // file, so this cannot be fooled by a stale copy)
            //
            let liveIno;
            try {
              liveIno = fs.statSync(storagePath, { bigint: true }).ino;
            } catch {}

            swapped = liveIno === tmpStats.ino;
            if (!swapped) throw renameErr;
            logger.warn(renameErr, { payload });
          }

          backup = false;
          fsyncDirectory(path.dirname(storagePath));
          logger.debug('renamed', { tmp, storagePath });

          //
          // Second eviction broadcast: closes any handle that was cached
          // in between (there should be none) before waiting contenders
          // are allowed to open the new file
          //
          try {
            await client.publish(
              'db_cache_evict',
              payload.session.user.alias_id
            );
          } catch (err) {
            logger.debug(err);
          }
        }
      );
    } finally {
      // Release the swap lock (only if we still own it)
      await client
        .eval(RELEASE_LOCK_SCRIPT, 1, swapLockKey, swapLockOwner)
        .catch(() => {});
    }
  } catch (_err) {
    if (_err instanceof RekeyNotNeeded) alreadyRekeyed = true;
    else err = _err;
  }

  // always close handles in case of errors
  for (const handle of [backupDb, db]) {
    if (handle && handle.open) {
      try {
        await closeDatabase(handle);
      } catch (closeErr) {
        logger.fatal(closeErr, { payload });
      }
    }
  }

  // always do cleanup in case of errors
  if (backup && tmp) {
    try {
      await removeCompanionFiles(tmp, ['', '-wal', '-shm', '-journal']);
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
  // (a shutdown is never signalled once the swap was recorded)
  //
  if (err instanceof ServerShutdownError && !swapMarked) {
    // This job is immediately re-queued by sqlite-worker.js, so make it
    // claimable by the next worker rather than allowing stale recovery to
    // restore a rekey that is still scheduled to run.
    await Aliases.updateOne(rekeyFilter, {
      $set: { rekey_processing: false },
      $unset: { rekey_claimed_at: 1 }
    }).catch((shutdownErr) => logger.fatal(shutdownErr));
    throw err;
  }

  //
  // A transient failure before anything irreversible happened: nothing about
  // the mailbox has changed, so instead of rolling back and telling the user
  // to try again, release the claim (only if it is still ours) and let
  // sqlite-worker.js put the job back in the queue with a backoff.  The
  // attempt counter travels with the job; past REKEY_MAX_ATTEMPTS the
  // failure is handled like any other below.
  //
  const attempts = Number(payload.rekey_attempts) || 0;
  if (
    err &&
    !swapMarked &&
    isTransientRekeyError(err) &&
    attempts < workerConfig.REKEY_MAX_ATTEMPTS
  ) {
    await Aliases.updateOne(
      {
        ...rekeyFilter,
        rekey_processing: true,
        rekey_claimed_at: claimedAt
      },
      {
        $set: { rekey_processing: false },
        $unset: { rekey_claimed_at: 1 }
      }
    ).catch((releaseErr) => logger.fatal(releaseErr));

    const retryErr = err.isRekeyRetryable
      ? err
      : new RekeyRetryableError(err.message, err);
    retryErr.attempts = attempts + 1;
    logger.warn(
      `Rekey of ${
        payload.session.user.username
      } hit a transient error and will be retried (attempt ${attempts + 1} of ${
        workerConfig.REKEY_MAX_ATTEMPTS
      }): ${err.message}`,
      { alias_id: payload.session.user.alias_id, rekey_id: payload.rekey_id }
    );
    throw retryErr;
  }

  // the retries are used up (or the swap was already recorded): from here
  // on the error is final and must not be scheduled for another retry
  if (err && err.isRekeyRetryable) {
    err.isRekeyRetryable = false;
    err.retriesExhausted = true;
  }

  // whether THIS run settled the alias (rolled it back or finalized it)
  let settled = false;
  try {
    if (err && !swapped) {
      // The live SQLite file still uses the old password after a failed
      // rekey. Restore its persisted token snapshot and clear the rekey
      // state in one database operation before authentication is re-enabled.
      // (if the rename failed after the swap was recorded then the record
      //  is cleared as part of the same atomic rollback)
      settled = Boolean(
        await rollbackRekey(client, payload.session.user.alias_id, {
          filter: rekeyFilter,
          rekeyId: payload.rekey_id,
          allowSwapped: swapMarked
        })
      );
    } else {
      // The SQLite file now uses the new token, so discard only the
      // rollback snapshot and re-enable authentication.
      settled = Boolean(
        await finalizeRekey(client, payload.session.user.alias_id, {
          filter: rekeyFilter,
          rekeyId: payload.rekey_id
        })
      );
    }
  } catch (err) {
    // NOTE: if this fails after the swap then the recorded inode lets the
    //       worker's startup recovery and periodic sweep finalize the alias
    //       (and notify the user); nothing is announced here in that case
    logger.fatal(err);
  }

  if (err && !swapped) {
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

    // (a superseded operation is normally settled -- and its user notified
    //  -- by whoever took the state over; if this run settled it after all,
    //  this run tells the user)
    if (settled)
      await sendRekeyEmail(
        payload,
        'ALIAS_REKEY_FAILED_SUBJECT',
        'ALIAS_REKEY_FAILED_MESSAGE',
        refineAndLogError(err, payload.session).message
      );

    throw err;
  }

  if (err) logger.fatal(err, { payload: { ...payload, session: undefined } });

  if (alreadyRekeyed)
    logger.info('Rekey finalized without a file swap', {
      alias_id: payload.session.user.alias_id
    });

  // email the user (only once the alias is really open for the new password)
  if (settled)
    await sendRekeyEmail(
      payload,
      'ALIAS_REKEY_READY_SUBJECT',
      'ALIAS_REKEY_READY'
    );
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
        const resourceSummary = appendContactsAndCalendarsToArchive({
          archive,
          database: db,
          onProgress: (message) => logger.debug(message, { payload })
        });
        archive.append(
          `MBOX backup created via Forward Email\nhttps://forwardemail.net\n${new Date().toISOString()}\n\nThis archive contains MBOX files organized by mailbox folder, VCF files organized under Contacts, and ICS files organized under Calendars.\n\nContacts: ${
            resourceSummary.contactCount
          }\nCalendars: ${resourceSummary.calendarCount}\nCalendar resources: ${
            resourceSummary.calendarEventCount
          }`,
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
        const resourceSummary = appendContactsAndCalendarsToArchive({
          archive,
          database: db,
          onProgress: (message) => logger.debug(message, { payload })
        });
        archive.append(
          `EML backup created via Forward Email\nhttps://forwardemail.net\n${new Date().toISOString()}\n\nThis archive contains EML files organized by mailbox folder, VCF files organized under Contacts, and ICS files organized under Calendars.\n\nContacts: ${
            resourceSummary.contactCount
          }\nCalendars: ${resourceSummary.calendarCount}\nCalendar resources: ${
            resourceSummary.calendarEventCount
          }`,
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
    // maintenance or VACUUM recursion, but still under the per-file mutex
    // so the open can never interleave with a rekey/VACUUM file swap.
    db = await openDatabaseHandle(storagePath, payload.session);

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
