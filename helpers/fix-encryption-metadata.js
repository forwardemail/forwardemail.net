/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const logger = require('#helpers/logger');
const recursivelyParse = require('#helpers/recursively-parse');
const { decodeMetadata, encodeMetadata } = require('#helpers/msgpack-helpers');

/**
 * Fix corrupted PGP-encrypted message metadata in SQLite.
 *
 * Between Feb 2-7 2026 a faulty filter removed the `encrypted.asc` entry
 * from the `attachments` metadata array stored in the Messages table.
 * The actual body content was never lost - it was always correctly saved
 * in the Attachments table via `storeNodeBodies`.
 *
 * Timeline (all times UTC):
 *   - Bug introduced:  2026-02-02 04:53 (commit 75d4204e)
 *     Filtered PGP parts from data.attachments in on-append.js.
 *   - Second commit:   2026-02-02 19:32 (commit 2fb919d0)
 *     Reverted on-append filter but moved it to pre-validate hook,
 *     so attachments array was correct but `ha` was forced to false.
 *   - Partial revert:  2026-02-07 04:28 (commit 60cc340d, reverted commit 2)
 *     Re-exposed the original on-append filter from commit 1.
 *   - Full revert:     2026-02-07 19:21 (commit ca7bf3e9, reverted commit 1)
 *
 * The query window extends to Feb 8 00:00 UTC to cover deployment lag.
 *
 * This migration:
 *   1. Scans messages created during the bug window (Feb 2-8 2026).
 *   2. For each multipart/encrypted message, ALWAYS recalculates `ha`
 *      from the attachments metadata (since `ha` was wrong for all
 *      affected messages regardless of whether attachments were filtered).
 *   3. If the attachments metadata is also missing PGP parts, rebuilds
 *      it from the mimeTree.
 *
 * No raw-message reconstruction or on-the-fly patching is required.
 *
 * @param {Object} instance - The IMAP server / SQLite instance
 * @param {Object} session  - The session object (must contain `db` and `user`)
 * @param {Object} [options]
 * @param {number} [options.batchSize=100] - Rows per batch
 * @returns {Promise<Object>} Migration statistics
 */
async function fixEncryptionMetadata(instance, session, options = {}) {
  const { batchSize = 100 } = options;

  const stats = {
    messagesScanned: 0,
    messagesRepaired: 0,
    messagesSkipped: 0,
    messagesErrors: 0
  };

  const { db } = session;

  if (db.readonly) {
    logger.warn('Cannot fix encryption metadata on readonly database', {
      alias_id: session.user.alias_id
    });
    return stats;
  }

  try {
    // Ensure the Messages table exists
    const tableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Messages'"
      )
      .get();

    if (!tableExists) {
      return stats;
    }

    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      // Only look at messages created during the bug window
      const messages = db
        .prepare(
          `SELECT _id, mimeTree, attachments, ha
           FROM Messages
           WHERE idate >= '2026-02-02T00:00:00.000Z'
             AND idate <= '2026-02-08T00:00:00.000Z'
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

          // -- Decode mimeTree --
          const mimeTree = decodeMetadata(message.mimeTree, recursivelyParse);

          if (!mimeTree || typeof mimeTree !== 'object') {
            stats.messagesSkipped++;
            continue;
          }

          // Only target multipart/encrypted messages
          // NOTE: the decoded mimeTree does not have a top-level `contentType`
          // string; instead it stores `multipart: 'encrypted'` and the full
          // content-type is in `parsedHeader['content-type'].value`.
          const rootCt =
            (mimeTree.parsedHeader &&
              mimeTree.parsedHeader['content-type'] &&
              mimeTree.parsedHeader['content-type'].value) ||
            '';
          if (
            (mimeTree.multipart !== 'encrypted' &&
              rootCt !== 'multipart/encrypted') ||
            !Array.isArray(mimeTree.childNodes) ||
            mimeTree.childNodes.length < 2
          ) {
            stats.messagesSkipped++;
            continue;
          }

          // -- Decode existing attachments metadata --
          let attachments;
          try {
            attachments = decodeMetadata(message.attachments, recursivelyParse);
          } catch {
            attachments = [];
          }

          if (!Array.isArray(attachments)) {
            try {
              attachments =
                typeof message.attachments === 'string'
                  ? JSON.parse(message.attachments)
                  : [];
            } catch {
              attachments = [];
            }
          }

          // Check whether the PGP envelope parts are already present.
          // A properly-stored multipart/encrypted message has two parts:
          //   1. application/pgp-encrypted  (version identifier, ~12 bytes)
          //   2. application/octet-stream   (the encrypted.asc payload)
          // We check for the pgp-encrypted entry specifically, since
          // application/octet-stream is too generic and could match
          // unrelated attachments.
          const hasPgpParts = attachments.some(
            (a) =>
              a &&
              (a.contentType === 'application/pgp-encrypted' ||
                a.filename === 'encrypted.asc')
          );

          // Determine the final attachments array to use for `ha` calculation.
          // If PGP parts are missing, rebuild from the mimeTree.
          // If PGP parts are present, keep the existing attachments.
          let finalAttachments;
          let attachmentsChanged = false;

          if (hasPgpParts) {
            finalAttachments = attachments;
          } else {
            // Rebuild the attachments metadata from the mimeTree
            finalAttachments = rebuildAttachmentsMeta(mimeTree);
            attachmentsChanged = true;
          }

          // Recalculate `ha` using the same logic as the pre-validate hook:
          //   this.ha = Array.isArray(this.attachments)
          //     && this.attachments.some((a) => !a.related);
          const ha = finalAttachments.some((a) => !a.related) ? 1 : 0;

          // Check if anything actually needs updating
          const haChanged = message.ha !== ha;

          if (!attachmentsChanged && !haChanged) {
            stats.messagesSkipped++;
            continue;
          }

          // -- Persist the fix --
          if (attachmentsChanged) {
            const encodedAttachments = encodeMetadata(finalAttachments);
            db.prepare(
              `UPDATE Messages
               SET attachments = ?, ha = ?
               WHERE _id = ?`
            ).run(encodedAttachments, ha, message._id);
          } else {
            // Only ha needs fixing
            db.prepare(
              `UPDATE Messages
               SET ha = ?
               WHERE _id = ?`
            ).run(ha, message._id);
          }

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

      // Checkpoint WAL periodically to avoid unbounded growth
      if (offset % (batchSize * 10) === 0) {
        try {
          db.pragma('wal_checkpoint(PASSIVE)');
        } catch (err) {
          logger.warn(err);
        }
      }
    }

    // Final WAL checkpoint
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

/**
 * Walk the mimeTree and rebuild the `attachments` metadata array that
 * `getMaildata` would have originally produced.
 *
 * This mirrors the logic in WildDuck's `Indexer.prototype.getMaildata`:
 *   - Non-multipart, non-inline-text nodes with a body (or an attachmentId
 *     reference) are treated as attachments.
 *   - Inline text nodes (text/plain, text/html, etc.) are excluded unless
 *     they exceed 300 KB.
 *
 * @param {Object} mimeTree - Decoded mimeTree from the Messages table
 * @returns {Array} - The rebuilt attachments metadata array
 */
function rebuildAttachmentsMeta(mimeTree) {
  const attachments = [];
  let idCount = 0;

  const inlineTextTypes = new Set([
    'text/plain',
    'text/html',
    'text/rfc822-headers',
    'message/delivery-status'
  ]);

  function walk(node, alternative, related) {
    if (!node) {
      return;
    }

    const parsedContentType = node.parsedHeader
      ? node.parsedHeader['content-type']
      : null;
    const parsedDisposition = node.parsedHeader
      ? node.parsedHeader['content-disposition']
      : null;

    const contentType = (
      (parsedContentType && parsedContentType.value) ||
      node.contentType ||
      'application/octet-stream'
    )
      .toLowerCase()
      .trim();

    const transferEncoding = (
      (node.parsedHeader && node.parsedHeader['content-transfer-encoding']) ||
      '7bit'
    )
      .toLowerCase()
      .trim();

    const isMultipart = contentType.startsWith('multipart/');

    alternative = alternative || contentType === 'multipart/alternative';
    related = related || contentType === 'multipart/related';

    const disposition =
      ((parsedDisposition && parsedDisposition.value) || '')
        .toLowerCase()
        .trim() || false;

    const isInlineText =
      inlineTextTypes.has(contentType) &&
      (!disposition || disposition === 'inline');

    // A node is stored as an attachment if it has content (body or
    // attachmentId reference) and is not a multipart container, and is
    // either not inline text or exceeds the 300 KB threshold.
    const hasContent = (node.body && node.body.length > 0) || node.attachmentId;
    const exceedsInlineThreshold = node.size > 300 * 1024;

    if (
      !isMultipart &&
      hasContent &&
      (!isInlineText || exceedsInlineThreshold)
    ) {
      idCount++;
      const attachmentId =
        node.attachmentId || `ATT${String(idCount).padStart(5, '0')}`;

      const filename =
        (parsedDisposition &&
          parsedDisposition.params &&
          parsedDisposition.params.filename) ||
        (parsedContentType &&
          parsedContentType.params &&
          parsedContentType.params.name) ||
        node.filename ||
        false;

      const contentId = (
        (node.parsedHeader && node.parsedHeader['content-id']) ||
        ''
      )
        .toString()
        .replaceAll(/<|>/g, '')
        .trim();

      attachments.push({
        id: attachmentId,
        filename: filename || undefined,
        contentType,
        disposition,
        transferEncoding,
        cid: contentId ? `<${contentId}>` : null,
        related,
        sizeKb: Math.ceil(Math.max(node.size, 0) / 1024)
      });
    }

    // Recurse into message/rfc822
    if (node.message) {
      walk(node.message, alternative, related);
    }

    if (Array.isArray(node.childNodes)) {
      for (const child of node.childNodes) {
        walk(child, alternative, related);
      }
    }
  }

  walk(mimeTree, false, false);
  return attachments;
}

module.exports = { fixEncryptionMetadata };
