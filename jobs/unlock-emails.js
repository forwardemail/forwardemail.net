/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');

const Emails = require('#models/emails');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // unlock queued jobs that are frozen for more than 10m+
    // and switch deferred emails back into queue
    //
    await Emails.updateMany(
      {
        is_locked: true,
        locked_at: {
          $exists: true,
          $lte: dayjs().subtract(10, 'minutes').toDate()
        },
        status: {
          $in: ['queued', 'deferred']
        }
      },
      {
        $set: {
          is_locked: false,
          status: 'queued'
        },
        $unset: {
          locked_by: 1,
          locked_at: 1
        }
      }
    );
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
