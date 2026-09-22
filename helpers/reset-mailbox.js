/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { randomUUID } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const Database = require('better-sqlite3-multiple-ciphers');
const ms = require('ms');

const Aliases = require('#models/aliases');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const getRekeyTmpPath = require('#helpers/get-rekey-tmp-path');
const logger = require('#helpers/logger');
const setupPragma = require('#helpers/setup-pragma');
const workerConfig = require('#helpers/sqlite-worker-config');
const { withDbFileLock } = require('#helpers/db-file-lock');
const {
  fsyncDirectory,
  leftoverCompanionFiles,
  removeCompanionFiles
} = require('#helpers/sqlite-file-utils');

//
// Replace an alias' mailbox with a fresh, empty one that is encrypted with
// the password in `session.user.password` (a "reset": the owner lost the
// password, or the alias gets its first one).
//
// The fresh mailbox is built next to the live file and renamed over it the
// way the sqlite-worker swaps a rekeyed copy (helpers/worker.js):
//
//  1. the swap is serialized with every other swap of the alias (the Redis
//     `db_swap_lock`) and with every open of the live file (the per-file
//     mutex of helpers/db-file-lock.js)
//  2. under the mutex, cached handles are evicted fleet-wide and the swap
//     only proceeds once no -wal/-shm (or hot -journal) file proves a
//     connection: a stale connection that closes later would otherwise
//     unlink the NEW mailbox's -wal/-shm files by name
//  3. when the reset is part of a password rotation (`rekeyId`, set by the
//     controller together with `is_rekey`), the inode of the fresh mailbox
//     is recorded in MongoDB right before the rename, so that a process
//     that dies at any point leaves a state recovery can settle with
//     certainty (helpers/recover-rekeys.js): the live file carrying the
//     recorded inode proves the reset happened
//  4. the rename replaces the live file atomically, the directory entry is
//     made durable, and cached handles are evicted once more
//
// Nothing about the live mailbox changes before step 4, so every failure
// leaves it intact (the fresh copy is removed again).  Resolves with
// `{ swapped: true, ino }`; rejects with a retryable `SQLITE_BUSY` error when
// exclusivity cannot be proven in time.
//
const HOSTNAME = os.hostname();
const REKEY_ID_REGEX = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;
const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

function busyError(message) {
  const err = new Error(message);
  err.code = 'SQLITE_BUSY';
  err.isResetRetryable = true;
  // The caller turns this expected fail-closed condition into a retryable 421.
  // Persisting it as fatal obscures actual reset and storage failures.
  err.ignoreHook = true;
  return err;
}

//
// Build the fresh mailbox at `tmp`: the same pragmas (cipher, key, page
// size, WAL) as every live mailbox, verified by re-opening it.  Closing the
// last connection checkpoints and removes the -wal/-shm files, so only the
// database file itself is left behind.
//
async function createFreshMailbox(tmp, session) {
  await removeCompanionFiles(tmp, ['', '-wal', '-shm', '-journal']);

  for (const verify of [false, true]) {
    const db = new Database(tmp, { timeout: config.busyTimeout });
    try {
      await setupPragma(db, session);
      if (verify) {
        const result = db.pragma('integrity_check', { simple: true });
        if (result !== 'ok')
          throw new TypeError(
            `Fresh mailbox failed its integrity check: ${result}`
          );
      }
    } finally {
      try {
        db.close();
      } catch {}
    }
  }

  const leftover = leftoverCompanionFiles(tmp);
  if (leftover.length > 0)
    throw new TypeError(`Fresh mailbox left ${leftover.join('/')} behind`);

  return fs.statSync(tmp, { bigint: true });
}

async function resetMailbox({
  client,
  storagePath,
  session,
  rekeyId,
  databaseMap,
  isCancelled = () => false
}) {
  const aliasId = session?.user?.alias_id;
  if (typeof aliasId !== 'string' || aliasId.length === 0)
    throw new TypeError('Alias ID missing');
  if (rekeyId !== undefined && !REKEY_ID_REGEX.test(rekeyId))
    throw new TypeError('Rekey operation ID invalid');

  // named after the operation, so leftovers of a killed reset are swept
  // like those of a rekey (jobs/cleanup-sqlite.js) and removed by recovery
  const tmp = getRekeyTmpPath(storagePath, {
    rekey_id: rekeyId || `reset-${randomUUID()}`
  });

  let swapped = false;
  try {
    const freshStats = await createFreshMailbox(tmp, session);

    if (isCancelled()) throw new ServerShutdownError();

    const swapLockKey = `db_swap_lock:${aliasId}`;
    const swapLockOwner = `${HOSTNAME}:${process.pid}:${Date.now()}`;
    const swapLockDeadline = Date.now() + workerConfig.RESET_SWAP_LOCK_WAIT;
    for (;;) {
      const acquired = await client.set(
        swapLockKey,
        swapLockOwner,
        'PX',
        ms('5m'),
        'NX'
      );
      if (acquired) break;
      if (Date.now() > swapLockDeadline)
        throw busyError(
          `Database swap in progress by another worker for alias ${aliasId}`
        );
      if (isCancelled()) throw new ServerShutdownError();
      await setTimeout(ms('1s'));
    }

    let ino;
    try {
      ino = await withDbFileLock(
        storagePath,
        { purpose: 'reset', timeoutMs: workerConfig.RESET_SWAP_LOCK_WAIT },
        async (fileLock) => {
          //
          // Exclusivity proof (see helpers/worker.js): evict cached handles
          // everywhere and wait until no companion file proves a connection.
          // A mutex that had to be broken as stale may have belonged to an
          // open that is merely stalled, so the proof must then hold twice.
          //
          const deadline = Date.now() + workerConfig.RESET_QUIESCE_TIMEOUT;
          const cleanChecksRequired = fileLock.brokeStale ? 2 : 1;
          let cleanChecks = 0;
          for (;;) {
            if (databaseMap && typeof databaseMap.evictAndClose === 'function')
              databaseMap.evictAndClose(aliasId);
            try {
              await client.publish('db_cache_evict', aliasId);
            } catch (err) {
              logger.debug(err);
            }

            await setTimeout(ms('1s'));

            const leftover = leftoverCompanionFiles(storagePath);
            if (leftover.length === 0) {
              cleanChecks++;
              if (cleanChecks >= cleanChecksRequired) break;
              await setTimeout(ms('1s'));
              continue;
            }

            cleanChecks = 0;
            if (isCancelled()) throw new ServerShutdownError();
            if (Date.now() > deadline)
              throw busyError(
                `Mailbox reset aborted, ${leftover.join(
                  '/'
                )} files still exist for alias ${aliasId} (another connection is still open)`
              );
            await setTimeout(ms('2s'));
          }

          // the fresh mailbox must still be the one that was verified
          const tmpStats = fs.statSync(tmp, { bigint: true });
          if (
            tmpStats.ino !== freshStats.ino ||
            tmpStats.size !== freshStats.size ||
            tmpStats.mtimeNs !== freshStats.mtimeNs
          ) {
            const err = new TypeError(
              `Mailbox reset aborted, fresh mailbox ${tmp} changed after it was verified`
            );
            err.isCodeBug = true;
            throw err;
          }

          //
          // Record the swap on the rotation this reset belongs to, in one
          // compare-and-set: a rotation that was rolled back in the meantime
          // matches nothing and the live mailbox is left untouched.
          //
          if (rekeyId) {
            const marked = await Aliases.updateOne(
              {
                _id: aliasId,
                is_rekey: true,
                rekey_id: rekeyId,
                rekey_processing: { $ne: true }
              },
              {
                $set: {
                  rekey_swap_ino: tmpStats.ino.toString(),
                  rekey_swapped_at: new Date()
                }
              }
            );
            if (marked.matchedCount !== 1) {
              const err = new Error(
                `Mailbox reset aborted, alias ${aliasId} no longer owns rekey operation ${rekeyId}`
              );
              err.isRekeySuperseded = true;
              throw err;
            }
          }

          // both locks must still be ours
          const swapLockValue = await client.get(swapLockKey);
          if (!fileLock.isOwned() || swapLockValue !== swapLockOwner)
            throw busyError(
              `Mailbox reset aborted, lost swap lock ownership for alias ${aliasId}`
            );

          // the proof above showed no connection owns these
          await removeCompanionFiles(storagePath, ['-wal', '-shm', '-journal']);

          try {
            await fs.promises.rename(tmp, storagePath);
            swapped = true;
          } catch (renameErr) {
            // the file system is the source of truth
            let liveIno;
            try {
              liveIno = fs.statSync(storagePath, { bigint: true }).ino;
            } catch {}

            swapped = liveIno === tmpStats.ino;
            if (!swapped) throw renameErr;
            logger.warn(renameErr, { storagePath });
          }

          fsyncDirectory(path.dirname(storagePath));

          if (databaseMap && typeof databaseMap.evictAndClose === 'function')
            databaseMap.evictAndClose(aliasId);
          try {
            await client.publish('db_cache_evict', aliasId);
          } catch (err) {
            logger.debug(err);
          }

          return tmpStats.ino;
        }
      );
    } finally {
      await client
        .eval(RELEASE_LOCK_SCRIPT, 1, swapLockKey, swapLockOwner)
        .catch(() => {});
    }

    return { swapped: true, ino };
  } finally {
    if (!swapped) {
      try {
        await removeCompanionFiles(tmp, ['', '-wal', '-shm', '-journal']);
      } catch (err) {
        logger.warn(err, { tmp });
      }
    }
  }
}

module.exports = resetMailbox;
