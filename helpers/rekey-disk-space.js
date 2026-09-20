/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const bytes = require('@forwardemail/bytes');

const checkDiskSpace = require('#helpers/check-disk-space');
const workerConfig = require('#helpers/sqlite-worker-config');

//
// Size of a live mailbox on disk: the main file plus its WAL (the WAL is
// checkpointed into the main file before a rekey copies it).  A file that
// does not exist counts as empty.
//
async function getMailboxSize(storagePath) {
  let size = 0;
  for (const suffix of ['', '-wal']) {
    try {
      const stats = await fs.promises.stat(`${storagePath}${suffix}`);
      if (stats.isFile()) size += stats.size;
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  return size;
}

//
// Free disk space a password rotation of a mailbox of `mailboxSize` bytes
// needs on its volume (see REKEY_DISK_MULTIPLIER and REKEY_MIN_FREE_DISK in
// helpers/sqlite-worker-config.js).
//
function getRekeySpaceRequired(mailboxSize) {
  if (!Number.isFinite(mailboxSize) || mailboxSize < 0)
    throw new TypeError('Mailbox size must be a non-negative number');
  return Math.max(
    workerConfig.REKEY_MIN_FREE_DISK,
    Math.ceil(mailboxSize * workerConfig.REKEY_DISK_MULTIPLIER)
  );
}

//
// Throws when the volume holding `storagePath` does not have the free space
// a rotation of that mailbox needs.  The size is measured unless given
// (a reset replaces the mailbox with a fresh one and passes 0), and the
// error can be shaped by the caller (`createError`) so that the worker can
// retry the job later instead of failing it.
//
async function assertRekeyDiskSpace(storagePath, options = {}) {
  const mailboxSize =
    typeof options.mailboxSize === 'number'
      ? options.mailboxSize
      : await getMailboxSize(storagePath);
  const required = getRekeySpaceRequired(mailboxSize);
  const { free } = await checkDiskSpace(storagePath);

  if (free < required) {
    const message = `Needed ${bytes(required)} but only ${bytes(
      free
    )} was available`;
    const err =
      typeof options.createError === 'function'
        ? options.createError(message)
        : new TypeError(message);
    err.mailboxSize = mailboxSize;
    err.spaceRequired = required;
    err.freeDiskSpace = free;
    throw err;
  }

  return { mailboxSize, required, free };
}

module.exports = {
  assertRekeyDiskSpace,
  getMailboxSize,
  getRekeySpaceRequired
};
