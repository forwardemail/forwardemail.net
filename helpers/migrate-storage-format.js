/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const ms = require('ms');
const { boolean } = require('boolean');

const logger = require('#helpers/logger');
const {
  encodeAttachmentBody,
  encodeMetadata,
  isOldHexFormat,
  isOldJsonFormat
} = require('#helpers/msgpack-helpers');

/**
 * Migrate storage format for an alias database
 *
 * This is a one-time migration that converts:
 * 1. Attachment bodies: hex encoding -> native BLOB (50% savings)
 * 2. Metadata (mimeTree, headers, etc.): JSON text -> brotli-compressed BLOB (46-86% savings)
 *
 * The migration is idempotent - it only migrates data that is in old format.
 * Data already in new format is skipped.
 *
 * @param {Object} instance - The SQLite instance
 * @param {Object} session - The session object with db and user
 * @param {Object} options - Options
 * @param {number} options.batchSize - Number of records to process per batch (default: 100)
 * @returns {Promise<Object>} - Migration statistics
 */
async function migrateStorageFormat(instance, session, options = {}) {
  const { batchSize = 100 } = options;
  const stats = {
    attachmentsMigrated: 0,
    attachmentsSkipped: 0,
    attachmentsErrors: 0,
    messagesMigrated: 0,
    messagesSkipped: 0,
    messagesErrors: 0,
    mailboxesMigrated: 0,
    bytesSaved: 0
  };

  const { db } = session;

  // Check if database is readonly
  if (db.readonly) {
    logger.warn('Cannot migrate storage format on readonly database', {
      alias_id: session.user.alias_id
    });
    return stats;
  }

  try {
    //
    // 1. Migrate Attachments.body from hex text to native BLOB
    //
    const attachmentTableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Attachments'"
      )
      .get();

    if (attachmentTableExists) {
      let attachmentOffset = 0;
      let hasMoreAttachments = true;

      while (hasMoreAttachments) {
        // Get batch of attachments where body is text (old format)
        const attachments = db
          .prepare(
            `SELECT _id, body FROM Attachments WHERE typeof(body) = 'text' ORDER BY _id LIMIT ? OFFSET ?`
          )
          .all(batchSize, attachmentOffset);

        if (attachments.length === 0) {
          hasMoreAttachments = false;
          break;
        }

        for (const attachment of attachments) {
          try {
            // Check if in old hex format
            if (!isOldHexFormat(attachment.body)) {
              stats.attachmentsSkipped++;
              continue;
            }

            // Convert from hex to native BLOB
            const oldSize = attachment.body.length;
            const buffer = Buffer.from(attachment.body, 'hex');
            const encoded = encodeAttachmentBody(buffer);

            // Update in database
            db.prepare(`UPDATE Attachments SET body = ? WHERE _id = ?`).run(
              encoded,
              attachment._id
            );

            stats.attachmentsMigrated++;
            // Hex is 2x size, native BLOB is 1x, so we save 50%
            stats.bytesSaved += oldSize - buffer.length;
          } catch (err) {
            stats.attachmentsErrors++;
            logger.error(err, {
              attachment_id: attachment._id,
              alias_id: session.user.alias_id
            });
          }
        }

        attachmentOffset += batchSize;

        // Checkpoint WAL periodically
        if (attachmentOffset % (batchSize * 10) === 0) {
          try {
            db.pragma('wal_checkpoint(PASSIVE)');
          } catch (err) {
            logger.warn(err);
          }
        }
      }
    }

    //
    // 2. Migrate Messages metadata from JSON text to brotli-compressed BLOB
    //
    const messagesTableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Messages'"
      )
      .get();

    if (messagesTableExists) {
      // Note: 'headers' is excluded - it stays as JSON text for SQL json_each queries
      const metadataColumns = [
        'flags',
        'mimeTree',
        'envelope',
        'bodystructure',
        'attachments'
      ];

      let messageOffset = 0;
      let hasMoreMessages = true;

      while (hasMoreMessages) {
        // Get batch of messages where mimeTree is text (old format)
        const messages = db
          .prepare(
            `SELECT _id, flags, mimeTree, envelope, bodystructure, attachments
             FROM Messages WHERE typeof(mimeTree) = 'text' ORDER BY _id LIMIT ? OFFSET ?`
          )
          .all(batchSize, messageOffset);

        if (messages.length === 0) {
          hasMoreMessages = false;
          break;
        }

        for (const message of messages) {
          try {
            const updates = {};
            let needsUpdate = false;
            let savedBytes = 0;

            for (const col of metadataColumns) {
              const value = message[col];
              if (isOldJsonFormat(value)) {
                const oldSize = value.length;
                const parsed = JSON.parse(value);
                const encoded = encodeMetadata(parsed);
                updates[col] = encoded;
                needsUpdate = true;
                savedBytes += oldSize - encoded.length;
              } else {
                updates[col] = value;
              }
            }

            if (needsUpdate) {
              db.prepare(
                `UPDATE Messages
                 SET flags = ?, mimeTree = ?, envelope = ?, bodystructure = ?, attachments = ?
                 WHERE _id = ?`
              ).run(
                updates.flags,
                updates.mimeTree,
                updates.envelope,
                updates.bodystructure,
                updates.attachments,
                message._id
              );

              stats.messagesMigrated++;
              stats.bytesSaved += savedBytes;
            } else {
              stats.messagesSkipped++;
            }
          } catch (err) {
            stats.messagesErrors++;
            logger.error(err, {
              message_id: message._id,
              alias_id: session.user.alias_id
            });
          }
        }

        messageOffset += batchSize;

        // Checkpoint WAL periodically
        if (messageOffset % (batchSize * 10) === 0) {
          try {
            db.pragma('wal_checkpoint(PASSIVE)');
          } catch (err) {
            logger.warn(err);
          }
        }
      }
    }

    //
    // 3. Migrate Mailboxes.flags from JSON text to brotli-compressed BLOB
    //
    const mailboxesTableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Mailboxes'"
      )
      .get();

    if (mailboxesTableExists) {
      const mailboxes = db
        .prepare(
          `SELECT _id, flags FROM Mailboxes WHERE typeof(flags) = 'text'`
        )
        .all();

      for (const mailbox of mailboxes) {
        try {
          if (isOldJsonFormat(mailbox.flags)) {
            const oldSize = mailbox.flags.length;
            const parsed = JSON.parse(mailbox.flags);
            const encoded = encodeMetadata(parsed);

            db.prepare(`UPDATE Mailboxes SET flags = ? WHERE _id = ?`).run(
              encoded,
              mailbox._id
            );

            stats.mailboxesMigrated++;
            stats.bytesSaved += oldSize - encoded.length;
          }
        } catch (err) {
          logger.error(err, {
            mailbox_id: mailbox._id,
            alias_id: session.user.alias_id
          });
        }
      }
    }

    //
    // Note: Threads.ids is NOT migrated - it stays as JSON text for SQL json_each queries
    //

    // Final checkpoint
    try {
      db.pragma('wal_checkpoint(PASSIVE)');
    } catch (err) {
      logger.warn(err);
    }

    logger.info('Storage format migration completed', {
      alias_id: session.user.alias_id,
      stats
    });

    return stats;
  } catch (err) {
    logger.error(err, {
      alias_id: session.user.alias_id,
      stats
    });
    throw err;
  }
}

/**
 * Check if storage format migration is needed and perform it if necessary
 *
 * This function checks Redis cache and Aliases model to determine if migration
 * has already been performed. If not, it performs the migration and updates
 * the cache/model.
 *
 * Cache key: `storage_format_check:${alias_id}`
 *
 * @param {Object} instance - The SQLite instance with client (Redis)
 * @param {Object} session - The session object with db and user
 * @returns {Promise<boolean>} - True if migration was performed
 */
async function checkAndMigrateStorageFormat(instance, session) {
  const cacheKey = `storage_format_check:${session.user.alias_id}`;

  try {
    // Check Redis cache first
    const cached = await instance.client.get(cacheKey);
    if (boolean(cached)) {
      return false; // Already migrated
    }

    // Set cache to prevent concurrent migrations
    // Use a short TTL initially, will be extended after successful migration
    await instance.client.set(cacheKey, 'pending', 'PX', ms('5m'));

    // Perform migration
    const stats = await migrateStorageFormat(instance, session);

    // Calculate total errors
    const totalErrors = stats.attachmentsErrors + stats.messagesErrors;

    // If migration was successful (or nothing to migrate), set long-term cache
    // and update the Aliases model
    if (totalErrors === 0) {
      // Set cache for 30 days (will be refreshed on next access)
      await instance.client.set(cacheKey, 'true', 'PX', ms('30d'));

      // Update Aliases model to mark migration complete
      // This is a permanent flag stored in MongoDB
      try {
        const Aliases = require('#models/aliases');
        await Aliases.findByIdAndUpdate(session.user.alias_id, {
          $set: { has_storage_format_migration: true }
        });
      } catch (err) {
        // Non-fatal: cache is set, so migration won't run again soon
        logger.warn(err, { alias_id: session.user.alias_id });
      }

      const totalMigrated =
        stats.attachmentsMigrated +
        stats.messagesMigrated +
        stats.mailboxesMigrated +
        stats.threadsMigrated;

      return totalMigrated > 0;
    }

    // If there were errors, clear the cache so migration can be retried
    await instance.client.del(cacheKey);
    return false;
  } catch (err) {
    // Clear cache on error so migration can be retried
    try {
      await instance.client.del(cacheKey);
    } catch {
      // Ignore
    }

    logger.error(err, { alias_id: session.user.alias_id });
    return false;
  }
}

module.exports = {
  migrateStorageFormat,
  checkAndMigrateStorageFormat
};
