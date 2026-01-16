/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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

    // delete chunks without references to files
    for await (const chunk of Emails.db
      .collection('fs.chunks')
      .find({})
      .project({ files_id: 1 })) {
      logger.debug('chunk', { chunk });
      const count = await Emails.db.collection('fs.files').countDocuments({
        _id: chunk.files_id
      });
      if (count === 0) {
        // delete this chunk
        try {
          await Emails.db.collection('fs.chunks').deleteOne({
            _id: chunk._id
          });
        } catch (err) {
          err.chunk = chunk;
          logger.error(err);
        }
      }
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
