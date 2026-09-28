/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const mongoose = require('mongoose');

const Aliases = require('#models/aliases');
const getPathToDatabase = require('#helpers/get-path-to-database');
const logger = require('#helpers/logger');
const { COMPANION_SUFFIXES } = require('#helpers/sqlite-file-utils');

// OPTIMIZATION: Combined alias query to fetch all needed fields at once
async function updateStorageUsed(id, client) {
  if (!mongoose.isObjectIdOrHexString(id))
    throw new TypeError('Alias ID missing');

  if (!client) throw new TypeError('Redis client missing');

  // OPTIMIZATION: Redis debounce — skip recalculation if another caller
  // already computed storage within the last 10 seconds.
  const debounceKey = `storage_debounce:${id}`;
  const acquired = await client.set(debounceKey, '1', 'PX', 10_000, 'NX');
  if (!acquired) return -1; // debounced, skip

  // OPTIMIZATION: Fetch alias with all needed fields in one query
  // Previously this was fetched twice - once for storage location, once for update
  const alias = await Aliases.findById(id)
    .select('_id id domain storage_location storage_used')
    .lean()
    .exec();

  if (alias) {
    let size = 0;

    try {
      // <https://github.com/nodejs/node/issues/38006>
      const filePath = getPathToDatabase(alias);
      const dirName = path.dirname(filePath);
      const ext = path.extname(filePath);
      const basename = path.basename(filePath, ext);
      //
      // Storage used is every file of the mailbox on disk: the database
      // ($id.sqlite), the temporary mailbox that holds mail received while
      // the main one was unavailable ($id-tmp.sqlite), and the files SQLite
      // keeps next to each (-wal, -shm, -journal).  The legacy names the
      // previous code looked for ($id-wal.sqlite …) are counted too, should
      // any exist.  (Quarantined and backup copies are ours, not counted.)
      //
      const files = [];
      for (const database of [
        filePath,
        path.join(dirName, `${basename}-tmp${ext}`)
      ])
        files.push(
          database,
          ...COMPANION_SUFFIXES.map((suffix) => `${database}${suffix}`)
        );
      for (const legacy of ['-wal', '-shm', '-tmp-wal', '-tmp-shm'])
        files.push(path.join(dirName, `${basename}${legacy}${ext}`));

      for (const candidate of files) {
        try {
          const stats = await fs.promises.stat(candidate);
          if (stats.isFile() && stats.size > 0) size += stats.size;
        } catch (err) {
          if (err.code !== 'ENOENT') {
            err.isCodeBug = true;
            throw err;
          }
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        err.isCodeBug = true;
        throw err;
      }
    }

    // OPTIMIZATION: Only update if storage size has changed
    // This avoids unnecessary database writes
    if (size !== alias.storage_used) {
      // NOTE: calling `await` here causes 40ms+ delays
      Promise.all([
        // save storage_used on the given alias
        Aliases.findByIdAndUpdate(alias._id, {
          $set: {
            storage_used: size
          }
        }),
        // reset cache for alias with alias-specific storage and quota values
        Aliases.isOverQuota(
          {
            id: alias.id,
            domain: alias.domain
          },
          0,
          client,
          true // indicates reset occurred
        )
      ])
        .then()
        .catch((err) => logger.fatal(err));
    }

    return size;
  }

  return 0;
}

module.exports = updateStorageUsed;
