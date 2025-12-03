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

const mongoose = require('mongoose');
const emailHelper = require('#helpers/email');
const Logs = require('#models/logs');
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
    for await (const log of Logs.find({
      created_at: { $lt: Date.now() - ms(config.logRetention) }
    })
      .select('_id')
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      try {
        await Logs.deleteOne(
          { _id: log._id },
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
        to: config.alertsEmail,
        subject: 'Delete Logs Issue'
      },
      locals: {
        message: `<pre><code>${safeStringify(
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
