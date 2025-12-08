/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const dashify = require('dashify');

const _ = require('#helpers/lodash');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');

const S3 = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
});

/**
 * Remove alias backup files from R2 for a specific alias
 * @param {Object|String} alias - The alias object or alias ID string
 * @param {Object} options - Options object
 * @param {Boolean} options.dryRun - If true, only report what would be deleted without actually deleting
 * @returns {Promise<Array>} Array of deleted file keys (or files that would be deleted in dry run)
 */
async function removeAliasBackup(alias, options = {}) {
  const { dryRun = false } = options;
  let aliasObject = alias;

  // If alias is a string (ID), fetch the full alias object
  if (typeof alias === 'string') {
    aliasObject = await Aliases.findById(alias);
    if (!aliasObject) {
      logger.warn('Alias not found for R2 cleanup', { aliasId: alias });
      return [];
    }
  }

  if (!aliasObject || !aliasObject._id || !aliasObject.storage_location) {
    throw new Error(
      'Valid alias object with _id and storage_location is required'
    );
  }

  // Use the same bucket construction pattern as worker.js
  const bucket = `${config.env}-${dashify(
    _.camelCase(aliasObject.storage_location)
  )}`;
  const aliasId = aliasObject._id.toString();
  const deletedFiles = [];

  try {
    // List all objects in the bucket with the alias ID prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: aliasId
    });

    const response = await S3.send(listCommand);

    if (response.Contents && response.Contents.length > 0) {
      // Delete each file that matches the alias ID
      for (const object of response.Contents) {
        // Parse the filename to extract alias ID
        const key = object.Key;
        const filename = key.split('/').pop() || key;

        // Extract alias ID from filename (remove extensions and suffixes)
        let extractedAliasId = filename;

        // Remove common extensions including SQLite WAL/SHM files
        extractedAliasId = extractedAliasId.replace(
          /\.(sqlite|sqlite-shm|sqlite-wal|zip|gz)$/,
          ''
        );

        // Remove backup suffix if present
        extractedAliasId = extractedAliasId.replace(/-backup$/, '');

        // Remove temp suffix if present (handles -tmp variants)
        extractedAliasId = extractedAliasId.replace(/-tmp$/, '');

        // If the extracted alias ID matches the target alias ID, delete the file
        if (extractedAliasId === aliasId) {
          if (!dryRun) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: bucket,
              Key: key
            });

            await S3.send(deleteCommand);
          }

          deletedFiles.push(key);

          logger.info(
            dryRun
              ? 'Would delete R2 backup file (dry run)'
              : 'Deleted R2 backup file',
            {
              bucket,
              key,
              aliasId,
              storageLocation: aliasObject.storage_location,
              dryRun
            }
          );
        }
      }
    }

    return deletedFiles;
  } catch (err) {
    logger.error('Error removing alias backup from R2', {
      error: err,
      aliasId,
      storageLocation: aliasObject.storage_location,
      bucket,
      dryRun
    });
    throw err;
  }
}

/**
 * Remove alias backup files from R2 for multiple aliases
 * @param {Array} aliases - Array of alias objects or alias ID strings
 * @param {Object} options - Options object
 * @param {Boolean} options.dryRun - If true, only report what would be deleted without actually deleting
 * @returns {Promise<Array>} Array of deleted file keys (or files that would be deleted in dry run)
 */
async function removeMultipleAliasBackups(aliases, options = {}) {
  if (!Array.isArray(aliases) || aliases.length === 0) {
    return [];
  }

  const allDeletedFiles = [];

  for (const alias of aliases) {
    try {
      const deletedFiles = await removeAliasBackup(alias, options);
      allDeletedFiles.push(...deletedFiles);
    } catch (err) {
      const aliasId = typeof alias === 'string' ? alias : alias._id?.toString();
      logger.error('Error removing backup for alias', {
        error: err,
        aliasId,
        dryRun: options.dryRun
      });
      // Continue with other aliases even if one fails
    }
  }

  return allDeletedFiles;
}

/**
 * Remove R2 backup files for all aliases belonging to a specific user
 * @param {Object|String} user - The user object or user ID string
 * @param {Object} options - Options object
 * @param {Boolean} options.dryRun - If true, only report what would be deleted without actually deleting
 * @returns {Promise<Array>} Array of deleted file keys (or files that would be deleted in dry run)
 */
async function removeUserAliasBackups(user, options = {}) {
  let userObject = user;

  // If user is a string (ID), fetch the full user object
  if (typeof user === 'string') {
    userObject = await Users.findById(user);
    if (!userObject) {
      logger.warn('User not found for R2 cleanup', { userId: user });
      return [];
    }
  }

  if (!userObject || !userObject._id) {
    throw new Error('Valid user object with _id is required');
  }

  try {
    // Find all domains where this user is a member
    const domainIds = await Domains.distinct('_id', {
      members: {
        $elemMatch: {
          user: userObject._id
        }
      }
    });

    if (domainIds.length === 0) {
      logger.info('No domains found for user R2 cleanup', {
        userId: userObject._id,
        dryRun: options.dryRun
      });
      return [];
    }

    // Find all aliases in those domains
    const aliases = await Aliases.find({
      domain: { $in: domainIds }
    });

    if (aliases.length === 0) {
      logger.info('No aliases found for user R2 cleanup', {
        userId: userObject._id,
        dryRun: options.dryRun
      });
      return [];
    }

    logger.info(
      options.dryRun
        ? 'Would remove R2 backups for user aliases (dry run)'
        : 'Removing R2 backups for user aliases',
      {
        userId: userObject._id,
        aliasCount: aliases.length,
        dryRun: options.dryRun
      }
    );

    return await removeMultipleAliasBackups(aliases, options);
  } catch (err) {
    logger.error('Error removing user alias backups from R2', {
      error: err,
      userId: userObject._id,
      dryRun: options.dryRun
    });
    throw err;
  }
}

/**
 * Find and remove orphaned backup files from R2 that don't correspond to existing aliases
 * @param {String} storageLocation - The storage location to clean up
 * @param {Object} options - Options object
 * @param {Boolean} options.dryRun - If true, only report what would be deleted without actually deleting
 * @returns {Promise<Object>} Object containing deleted files and statistics
 */
async function cleanupOrphanedBackups(storageLocation, options = {}) {
  const { dryRun = false } = options;

  if (!storageLocation) {
    throw new Error('storageLocation is required');
  }

  // Use the same bucket construction pattern as worker.js
  const bucket = `${config.env}-${dashify(_.camelCase(storageLocation))}`;
  const deletedFiles = [];
  const aliasIds = new Set();

  try {
    // List all objects in the bucket
    let continuationToken;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken
      });

      const response = await S3.send(listCommand);

      if (response.Contents && response.Contents.length > 0) {
        // Extract alias IDs from all files
        for (const object of response.Contents) {
          const key = object.Key;
          const filename = key.split('/').pop() || key;

          // Extract alias ID from filename - handle all SQLite file patterns
          let extractedAliasId = filename;

          // Remove common extensions including SQLite WAL/SHM files
          extractedAliasId = extractedAliasId.replace(
            /\.(sqlite|sqlite-shm|sqlite-wal|zip|gz)$/,
            ''
          );

          // Remove backup suffix if present
          extractedAliasId = extractedAliasId.replace(/-backup$/, '');

          // Remove temp suffix if present (handles -tmp variants)
          extractedAliasId = extractedAliasId.replace(/-tmp$/, '');

          // Only add if it looks like a valid ObjectId (24 hex characters)
          if (/^[\da-fA-F]{24}$/.test(extractedAliasId)) {
            aliasIds.add(extractedAliasId);
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    if (aliasIds.size === 0) {
      return {
        deletedFiles: [],
        totalFiles: 0,
        orphanedFiles: 0,
        bannedUserFiles: 0,
        removedUserFiles: 0
      };
    }

    // Use cursor-based approach to check each alias and its user status
    const validAliasIds = new Set();
    const bannedUserAliasIds = new Set();
    const removedUserAliasIds = new Set();

    // Process aliases in batches using cursor
    const cursor = Aliases.find({
      _id: { $in: [...aliasIds] },
      storage_location: storageLocation
    })
      .populate({
        path: 'domain',
        populate: {
          path: 'members.user',
          model: 'User'
        }
      })
      .cursor();

    await cursor.eachAsync(async (alias) => {
      const aliasId = alias._id.toString();

      if (!alias.domain || !alias.domain.members) {
        // Orphaned alias (no domain or members)
        return;
      }

      let hasValidUser = false;
      let hasBannedUser = false;
      let hasRemovedUser = false;

      // Check all users in the domain
      for (const member of alias.domain.members) {
        if (member.user) {
          const { user } = member;

          // Check if user is banned
          if (user[config.userFields.isBanned] === true) {
            hasBannedUser = true;
            continue;
          }

          // Check if user is removed
          if (user[config.userFields.isRemoved] === true) {
            hasRemovedUser = true;
            continue;
          }

          // User is valid (not banned or removed)
          hasValidUser = true;
        }
      }

      // Categorize the alias based on user status
      if (hasValidUser) {
        validAliasIds.add(aliasId);
      } else if (hasBannedUser) {
        bannedUserAliasIds.add(aliasId);
      } else if (hasRemovedUser) {
        removedUserAliasIds.add(aliasId);
      }
      // If none of the above, it's orphaned (will be handled below)
    });

    // Find orphaned alias IDs (not in any category)
    const orphanedAliasIds = [...aliasIds].filter(
      (id) =>
        !validAliasIds.has(id) &&
        !bannedUserAliasIds.has(id) &&
        !removedUserAliasIds.has(id)
    );

    // Combine all IDs that should be deleted (orphaned + banned + removed)
    const aliasIdsToDelete = [
      ...orphanedAliasIds,
      ...bannedUserAliasIds,
      ...removedUserAliasIds
    ];

    logger.info(
      dryRun
        ? 'Found alias IDs to delete from R2 (dry run)'
        : 'Found alias IDs to delete from R2',
      {
        bucket,
        storageLocation,
        totalAliasIds: aliasIds.size,
        validAliasIds: validAliasIds.size,
        orphanedAliasIds: orphanedAliasIds.length,
        bannedUserAliasIds: bannedUserAliasIds.size,
        removedUserAliasIds: removedUserAliasIds.size,
        totalToDelete: aliasIdsToDelete.length,
        dryRun
      }
    );

    // Delete files for all categories of aliases to be removed
    for (const aliasIdToDelete of aliasIdsToDelete) {
      try {
        // List files for this specific alias ID
        const listCommand = new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: aliasIdToDelete
        });

        const response = await S3.send(listCommand);

        if (response.Contents && response.Contents.length > 0) {
          for (const object of response.Contents) {
            const key = object.Key;
            const filename = key.split('/').pop() || key;

            // Extract alias ID from filename - handle all SQLite file patterns
            let extractedAliasId = filename;

            // Remove common extensions including SQLite WAL/SHM files
            extractedAliasId = extractedAliasId.replace(
              /\.(sqlite|sqlite-shm|sqlite-wal|zip|gz)$/,
              ''
            );

            // Remove backup suffix if present
            extractedAliasId = extractedAliasId.replace(/-backup$/, '');

            // Remove temp suffix if present (handles -tmp variants)
            extractedAliasId = extractedAliasId.replace(/-tmp$/, '');

            // Only delete if it matches the alias ID to delete
            if (extractedAliasId === aliasIdToDelete) {
              if (!dryRun) {
                const deleteCommand = new DeleteObjectCommand({
                  Bucket: bucket,
                  Key: key
                });

                await S3.send(deleteCommand);
              }

              deletedFiles.push(key);

              let reason = 'orphaned';
              if (bannedUserAliasIds.has(aliasIdToDelete)) {
                reason = 'banned user';
              } else if (removedUserAliasIds.has(aliasIdToDelete)) {
                reason = 'removed user';
              }

              logger.info(
                dryRun
                  ? 'Would delete R2 backup file (dry run)'
                  : 'Deleted R2 backup file',
                {
                  bucket,
                  key,
                  aliasId: aliasIdToDelete,
                  storageLocation,
                  reason,
                  dryRun
                }
              );
            }
          }
        }
      } catch (err) {
        logger.error('Error removing backup file', {
          error: err,
          aliasId: aliasIdToDelete,
          storageLocation,
          bucket,
          dryRun
        });
      }
    }

    return {
      deletedFiles,
      totalFiles: aliasIds.size,
      orphanedFiles: orphanedAliasIds.length,
      bannedUserFiles: bannedUserAliasIds.size,
      removedUserFiles: removedUserAliasIds.size
    };
  } catch (err) {
    logger.error('Error cleaning up orphaned backups from R2', {
      error: err,
      storageLocation,
      bucket,
      dryRun
    });
    throw err;
  }
}

module.exports = {
  removeAliasBackup,
  removeMultipleAliasBackups,
  removeUserAliasBackups,
  cleanupOrphanedBackups
};
