/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const mongoose = require('mongoose');

const Aliases = require('#models/aliases');
const config = require('#config');
const getPathToDatabase = require('#helpers/get-path-to-database');
const logger = require('#helpers/logger');

// OPTIMIZATION: Combined alias query to fetch all needed fields at once
async function updateStorageUsed(id, client) {
  if (!mongoose.isObjectIdOrHexString(id))
    throw new TypeError('Alias ID missing');

  if (!client) throw new TypeError('Redis client missing');

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
      // $id.sqlite
      const stats = await fs.promises.stat(filePath);
      if (stats.isFile() && stats.size > 0) {
        size += stats.size;
        // $id-wal.sqlite
        // $id-shm.sqlite
        // $id-tmp.sqlite
        // $id-tmp-wal.sqlite
        // $id-tmp-shm.sqlite
        for (const affix of config.env === 'test'
          ? ['-wal', '-shm']
          : ['-wal', '-shm', '-tmp', '-tmp-wal', '-tmp-shm']) {
          const affixFilePath = path.join(dirName, `${basename}${affix}${ext}`);
          try {
            const stats = await fs.promises.stat(affixFilePath);
            if (stats.isFile() && stats.size > 0) {
              size += stats.size;
            }
          } catch (err) {
            if (err.code !== 'ENOENT') {
              err.isCodeBug = true;
              throw err;
            }
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
        // reset cache for alias
        // client.del(`alias_quota:${alias.id}`),
        // TODO: may want to rewrite this part here (?)
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
