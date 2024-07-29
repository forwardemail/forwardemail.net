/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const sharedConfig = require('@ladjs/shared-config');

const Emails = require('#models/emails');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  for await (const email of Emails.find({
    'envelope.to': /^srs/i,
    status: { $in: ['deferred', 'queued', 'rejected', 'bounced'] },
    date: {
      $gte: dayjs().subtract(5, 'day').toDate().getTime()
    }
  })
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    email.isNew = true;
    email.status = 'queued';
    email.is_locked = false;
    email.locked_by = undefined;
    email.locked_at = undefined;
    await email.save();
    console.log(`saved ${email.id} ${email.subject}`);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
