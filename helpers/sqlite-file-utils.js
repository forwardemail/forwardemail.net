/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const ms = require('ms');

const logger = require('#helpers/logger');
const workerConfig = require('#helpers/sqlite-worker-config');

//
// Helpers shared by everything that replaces or removes a live database file
// (the rekey and VACUUM swaps in helpers/worker.js, the mailbox reset in
// helpers/reset-mailbox.js, and the corruption recovery in
// helpers/get-database.js).
//

// Suffixes of the files SQLite keeps next to a database.
const COMPANION_SUFFIXES = ['-wal', '-shm', '-journal'];

async function removeCompanionFiles(storagePath, suffixes) {
  for (const suffix of suffixes) {
    try {
      await fs.promises.rm(`${storagePath}${suffix}`, {
        force: true,
        recursive: true
      });
    } catch (err) {
      if (err.code !== 'ENOENT') {
        err.isCodeBug = true;
        throw err;
      }
    }
  }
}

//
// Whether a companion file of the live database exists that proves (or may
// prove) a connection: any -wal or -shm file does, while a rollback journal
// only does when it holds data (SQLite ignores an empty journal, which a
// crash may leave behind, and could never replay it).
//
function companionFileExists(storagePath, suffix) {
  try {
    const stats = fs.statSync(`${storagePath}${suffix}`);
    return suffix !== '-journal' || stats.size > 0;
  } catch {
    return false;
  }
}

// The companion files that currently prove a connection to the database.
function leftoverCompanionFiles(storagePath) {
  return COMPANION_SUFFIXES.filter((suffix) =>
    companionFileExists(storagePath, suffix)
  );
}

//
// Make the directory entry written by `rename` durable (the file contents
// were already fsync'd by SQLite with synchronous=FULL).
//
function fsyncDirectory(dirPath) {
  let fd;
  try {
    fd = fs.openSync(dirPath, 'r');
    fs.fsyncSync(fd);
  } catch (err) {
    logger.warn(err);
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {}
    }
  }
}

//
// Artifacts of file swaps and exports that were cut short (a process killed
// mid-operation) are removed once they are a day old, whichever alias they
// belong to: the rekeyed copy `<id>-<operation>-backup.sqlite` (with
// companions), the legacy request-scoped export
// `<request-hash>:<request-hash>-backup.<extension>`, the inline VACUUM copy
// `<id>.sqlite.vacuum-tmp-<pid>` and a broken file mutex that could not be
// removed (`<id>.sqlite.lock.stale-<uuid>`, see helpers/db-file-lock.js).  A
// running rekey never uses a copy that old:
// it removes and re-creates its copy on every attempt.  (A `<id>.sqlite.lock`
// directory itself is never touched: a stale one is broken by the next
// process that needs the mutex, and removing one that was just re-created
// would break a live mutex.)
//
// A mailbox that could not be opened with a valid password is quarantined by
// helpers/get-database.js (`<id>.sqlite.quarantine-<ts>` with companions)
// rather than deleted, and kept for QUARANTINE_RETENTION so it can be
// recovered by hand.  A rename keeps the mtime, so a quarantined file is
// aged by the time of its quarantine, which its name carries.
//
// Called by jobs/cleanup-sqlite.js for every file of every mailbox
// directory.  Resolves with `null` for a file that is neither, otherwise
// with whether the file was removed (or would have been, on a dry run).
//
const SQLITE_BACKUP_SUFFIX = 'backup\\.sqlite(?:-wal|-shm|-journal)?';
const LEGACY_BACKUP_SUFFIX =
  'backup\\.(?:sqlite(?:-wal|-shm|-journal)?|mbox|zip)';
const SWAP_ARTIFACT_NAME = new RegExp(
  // `getRekeyTmpPath()` accepts a legacy WebSocket request ID when a queued
  // rekey has no operation UUID.  Those IDs contain a colon (see
  // `create-websocket-as-promised.js`), so `:` is deliberate here.
  `^(?:[a-f\\d]{24}-[\\w:-]+-${SQLITE_BACKUP_SUFFIX}|[a-f\\d]{10,64}:[a-f\\d]{10,64}-${LEGACY_BACKUP_SUFFIX}|[a-f\\d]{24}\\.sqlite\\.vacuum-tmp-\\d+|[a-f\\d]{24}\\.sqlite\\.lock\\.stale-[\\w-]+)$`
);
const QUARANTINE_NAME =
  /^[a-f\d]{24}\.sqlite\.quarantine-(\d+)(?:-wal|-shm|-journal)?$/;
const SWAP_ARTIFACT_MAX_AGE = ms('1d');

async function removeStaleSwapArtifact(
  artifactPath,
  { dryRun = false, now = Date.now() } = {}
) {
  const name = path.basename(artifactPath);
  const quarantineMatch = name.match(QUARANTINE_NAME);
  if (!quarantineMatch && !SWAP_ARTIFACT_NAME.test(name)) return null;

  try {
    // A SQLite backup verification opens the copied database with WAL mode.
    // A normal close removes its -wal and -shm files, but an abrupt worker
    // death can leave them next to the copied database.  Age a companion by
    // its primary backup file when that file is still present: an old,
    // untouched WAL must not be removed from a backup that is otherwise
    // fresh.  Once the primary expires, remove the whole artifact group.
    let primaryPath = artifactPath;
    let shouldRemoveCompanions = false;
    if (!quarantineMatch) {
      const suffix = COMPANION_SUFFIXES.find((value) => name.endsWith(value));
      if (suffix) {
        const candidate = artifactPath.slice(0, -suffix.length);
        if (SWAP_ARTIFACT_NAME.test(path.basename(candidate))) {
          try {
            await fs.promises.stat(candidate);
            primaryPath = candidate;
          } catch (err) {
            if (err.code !== 'ENOENT') throw err;
          }
        }
      }

      shouldRemoveCompanions = primaryPath.endsWith('.sqlite');
    }

    const stats = await fs.promises.stat(primaryPath);
    const age = quarantineMatch
      ? now - Number(quarantineMatch[1])
      : now - stats.mtimeMs;
    const maxAge = quarantineMatch
      ? workerConfig.QUARANTINE_RETENTION
      : SWAP_ARTIFACT_MAX_AGE;
    if (age <= maxAge) return false;

    if (dryRun) {
      logger.info('Would remove stale swap artifact (dry run)', {
        artifactPath: primaryPath
      });
    } else {
      await fs.promises.rm(primaryPath, { force: true, recursive: true });
      if (shouldRemoveCompanions)
        await removeCompanionFiles(primaryPath, COMPANION_SUFFIXES);
      logger.info('Removed stale swap artifact', { artifactPath: primaryPath });
    }

    return true;
  } catch (err) {
    if (err.code !== 'ENOENT') logger.error(err, { artifactPath });
    return false;
  }
}

module.exports = {
  COMPANION_SUFFIXES,
  companionFileExists,
  fsyncDirectory,
  leftoverCompanionFiles,
  removeCompanionFiles,
  removeStaleSwapArtifact
};
