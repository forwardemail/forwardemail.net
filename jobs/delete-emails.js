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

  try {
    for await (const email of Emails.find({
      created_at: { $lt: Date.now() - ms(config.emailRetention) }
    })
      .select('_id')
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      try {
        await Emails.deleteOne(
          { _id: email._id },
          {
            writeConcern: { w: 0, j: false }
          }
        );
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Delete Emails Issue'
      },
      locals: {
        message: `<pre><code>${JSON.stringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
