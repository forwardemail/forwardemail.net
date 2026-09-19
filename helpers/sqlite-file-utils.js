/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const logger = require('#helpers/logger');

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

module.exports = {
  COMPANION_SUFFIXES,
  companionFileExists,
  fsyncDirectory,
  leftoverCompanionFiles,
  removeCompanionFiles
};
