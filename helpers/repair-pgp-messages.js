/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const getStream = require('get-stream');

const Indexer = require('#helpers/indexer');
const logger = require('#helpers/logger');
const recursivelyParse = require('#helpers/recursively-parse');
const { repairEncryptedMessage } = require('#helpers/repair-encrypted-message');
const { decodeMetadata, encodeMetadata } = require('#helpers/msgpack-helpers');

/**
 * Repair corrupted PGP-encrypted messages in SQLite.
 *
 * Between Feb 2-6, 2026 a bug emptied the `encrypted.asc` body in
 * multipart/encrypted messages during storage.  This migration fixes
 * the persisted mimeTree, bodystructure, and envelope by reconstructing
 * the raw RFC 822 message from the Attachments table and re-running
 * `repairEncryptedMessage`.
 *
 * Follows the same one-time-migration pattern as `migrate-storage-format.js`.
 *
 * @param {Object} instance - The SQLite instance
 * @param {Object} session  - The session object with db and user
 * @param {Object} options
 * @param {number} options.batchSize - Records per batch (default: 100)
 * @returns {Promise<Object>} - Migration statistics
 */
async function repairPgpMessages(instance, session, options = {}) {
  const { batchSize = 100 } = options;
  const stats = {
    messagesScanned: 0,
    messagesRepaired: 0,
    messagesSkipped: 0,
    messagesErrors: 0
  };

  const { db } = session;

  if (db.readonly) {
    logger.warn('Cannot repair PGP messages on readonly database', {
      alias_id: session.user.alias_id
    });
    return stats;
  }

  try {
    const messagesTableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Messages'"
      )
      .get();

    if (!messagesTableExists) {
      return stats;
    }

    const indexer = new Indexer();

    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const messages = db
        .prepare(
          `SELECT _id, mimeTree, bodystructure, envelope, attachments
           FROM Messages
           WHERE idate >= '2026-02-02T00:00:00.000Z'
             AND idate <= '2026-02-07T00:00:00.000Z'
           ORDER BY _id
           LIMIT ? OFFSET ?`
        )
        .all(batchSize, offset);

      if (messages.length === 0) {
        hasMore = false;
        break;
      }

      for (const message of messages) {
        try {
          stats.messagesScanned++;

          const mimeTree = decodeMetadata(message.mimeTree, recursivelyParse);

          if (!mimeTree || typeof mimeTree !== 'object') {
            stats.messagesSkipped++;
            continue;
          }

          // Only target multipart/encrypted messages
          if (
            mimeTree.contentType !== 'multipart/encrypted' ||
            !Array.isArray(mimeTree.childNodes) ||
            mimeTree.childNodes.length < 2
          ) {
            stats.messagesSkipped++;
            continue;
          }

          // Find the encrypted.asc child node
          const encryptedPart = mimeTree.childNodes.find(
            (part) =>
              part &&
              typeof part === 'object' &&
              part.filename === 'encrypted.asc' &&
              part.contentType === 'application/octet-stream'
          );

          if (!encryptedPart) {
            stats.messagesSkipped++;
            continue;
          }

          // Only repair if the body is empty / suspiciously small
          if (encryptedPart.size > 500) {
            stats.messagesSkipped++;
            continue;
          }

          // Reconstruct the raw RFC 822 message from the mimeTree + Attachments table
          const data = indexer.getContents(
            mimeTree,
            false,
            {},
            instance,
            session
          );

          const raw =
            data && data.type === 'stream'
              ? await getStream.buffer(data.value)
              : Buffer.from((data || '').toString(), 'binary');

          if (!raw || raw.length === 0) {
            stats.messagesSkipped++;
            continue;
          }

          // Apply the repair
          const repairedMimeTree = repairEncryptedMessage(mimeTree, raw);

          // Check if the repair actually did anything
          const repairedPart = repairedMimeTree.childNodes.find(
            (part) =>
              part &&
              typeof part === 'object' &&
              part.filename === 'encrypted.asc'
          );

          if (!repairedPart || repairedPart.size <= 500) {
            // Repair did not change anything meaningful
            stats.messagesSkipped++;
            continue;
          }

          // Recompute bodystructure and envelope from the repaired mimeTree
          const bodystructure = indexer.getBodyStructure(repairedMimeTree);
          const envelope = indexer.getEnvelope(repairedMimeTree);

          // Re-encode and update the row
          const encodedMimeTree = encodeMetadata(repairedMimeTree);
          const encodedBodystructure = encodeMetadata(bodystructure);
          const encodedEnvelope = encodeMetadata(envelope);

          db.prepare(
            `UPDATE Messages
             SET mimeTree = ?, bodystructure = ?, envelope = ?
             WHERE _id = ?`
          ).run(
            encodedMimeTree,
            encodedBodystructure,
            encodedEnvelope,
            message._id
          );

          stats.messagesRepaired++;
        } catch (err) {
          stats.messagesErrors++;
          logger.error(err, {
            message_id: message._id,
            alias_id: session.user.alias_id
          });
        }
      }

      offset += batchSize;

      // Checkpoint WAL periodically
      if (offset % (batchSize * 10) === 0) {
        try {
          db.pragma('wal_checkpoint(PASSIVE)');
        } catch (err) {
          logger.warn(err);
        }
      }
    }

    // Final checkpoint
    try {
      db.pragma('wal_checkpoint(PASSIVE)');
    } catch (err) {
      logger.warn(err);
    }

    return stats;
  } catch (err) {
    logger.error(err, {
      alias_id: session.user.alias_id,
      stats
    });
    throw err;
  }
}

module.exports = { repairPgpMessages };
