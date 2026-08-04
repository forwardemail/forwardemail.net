/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const mongoose = require('mongoose');
const emailHelper = require('#helpers/email');
const Emails = require('#models/emails');

const logger = require('#helpers/logger');
const config = require('#config');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// Batch size for orphan chunk detection
const ORPHAN_BATCH_SIZE = 1000;

(async () => {
  await setupMongoose(logger);

  // TODO: move bucket to root
  const bucket = new mongoose.mongo.GridFSBucket(Emails.db);

  try {
    for await (const email of Emails.find({
      created_at: { $lt: Date.now() - ms(config.emailRetention) }
    })
      .select('_id message')
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      logger.debug('email', { email });
      try {
        await Emails.deleteOne(
          { _id: email._id },
          {
            writeConcern: { w: 0, j: false }
          }
        );
      } catch (err) {
        err.email = email;
        logger.error(err);
      }

      // we already have a post delete hook
      // but this is an additional safeguard
      if (
        email?.message?._id &&
        mongoose.isObjectIdOrHexString(email.message._id)
      ) {
        try {
          // message: {
          //    _id: ObjectId('xxxxxxx'),
          //    length: 43396560,
          //    chunkSize: 261120,
          //    uploadDate: ISODate('xxxxxx'),
          //    filename: 'xxxxxxx.eml',
          //    contentType: 'message/rfc822'
          //  },
          await bucket.delete(email.message._id);
        } catch (err) {
          err.email = email;
          logger.error(err);
        }
      }
    }

    // delete files and chunks that are > 60 days old
    // (safeguard in case emails removed but chunks and files weren't)
    // (while still supporting scheduled date sending, e.g. 30 days out)
    for await (const file of Emails.db
      .collection('fs.files')
      .find({})
      .project({ uploadDate: 1 })) {
      logger.debug('file', { file });
      if (new Date(file.uploadDate).getTime() < Date.now() - ms('60d')) {
        // remove it and delete from bucket
        try {
          await bucket.delete(file._id);
        } catch (err) {
          err.file = file;
          logger.error(err);
        }
      }
    }

    //
    // delete chunks without references to files
    //
    // Optimized: batch chunk processing to avoid N+1 countDocuments calls.
    // Collects files_ids in batches, does a single find on fs.files for
    // the batch, then deletes chunks whose files_id has no matching file.
    //
    {
      let batch = [];
      const chunksCollection = Emails.db.collection('fs.chunks');
      const filesCollection = Emails.db.collection('fs.files');

      const processBatch = async (chunks) => {
        if (chunks.length === 0) return;

        // Get unique files_ids from this batch (deduplicate for efficient $in query)
        const seen = new Set();
        const uniqueFilesIds = [];
        for (const c of chunks) {
          const key = c.files_id.toString();
          if (!seen.has(key)) {
            seen.add(key);
            uniqueFilesIds.push(c.files_id);
          }
        }

        // Single query to find which files_ids actually exist
        const existingFiles = await filesCollection
          .find({ _id: { $in: uniqueFilesIds } })
          .project({ _id: 1 })
          .toArray();

        const existingFileIds = new Set(
          existingFiles.map((f) => f._id.toString())
        );

        // Find orphan chunks (files_id not in existing files)
        const orphanChunkIds = chunks
          .filter((c) => !existingFileIds.has(c.files_id.toString()))
          .map((c) => c._id);

        // Batch delete orphan chunks
        if (orphanChunkIds.length > 0) {
          try {
            await chunksCollection.deleteMany({
              _id: { $in: orphanChunkIds }
            });
            logger.info('deleted orphan chunks', {
              count: orphanChunkIds.length
            });
          } catch (err) {
            logger.error(err);
          }
        }
      };

      for await (const chunk of chunksCollection
        .find({})
        .project({ _id: 1, files_id: 1 })) {
        batch.push(chunk);
        if (batch.length >= ORPHAN_BATCH_SIZE) {
          await processBatch(batch);
          batch = [];
        }
      }

      // Process remaining batch
      await processBatch(batch);
    }
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Delete Emails Issue'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
