/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const config = require('#config');

//
// In production every mailbox lives on a mounted volume (`/mnt/<location>`,
// see helpers/get-path-to-database.js).  A missing database file can only
// mean "this alias has no mailbox" when that volume is actually there; while
// it is down (or being restored, or an empty volume was mounted in its
// place) nothing can be concluded from the file's absence.
//
// The storage is considered available when its directory is a mount point
// (a different device than its parent directory) or when it already holds
// mailboxes (a plain directory in use, as in a self-hosted deployment that
// does not use a dedicated volume).  An unmounted mount point is an empty
// directory on the root filesystem and satisfies neither.
//
// Outside production mailboxes live in a plain directory under the OS tmp
// directory, which is always available.
//
function isMountPoint(dir) {
  try {
    return fs.statSync(dir).dev !== fs.statSync(path.dirname(dir)).dev;
  } catch {
    return false;
  }
}

function holdsMailboxes(dir) {
  let handle;
  try {
    handle = fs.opendirSync(dir);
    for (;;) {
      const entry = handle.readSync();
      if (!entry) return false;
      if (entry.name.endsWith('.sqlite')) return true;
    }
  } catch {
    return false;
  } finally {
    if (handle) {
      try {
        handle.closeSync();
      } catch {}
    }
  }
}

function isStorageAvailable(storagePath) {
  if (config.env !== 'production') return true;
  const dir = path.dirname(storagePath);
  return isMountPoint(dir) || holdsMailboxes(dir);
}

module.exports = isStorageAvailable;
