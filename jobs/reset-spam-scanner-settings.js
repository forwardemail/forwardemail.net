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
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const resetSpamScannerSettings = require('#helpers/reset-spam-scanner-settings');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// (once, see `helpers/reset-spam-scanner-settings.js`)
(async () => {
  await setupMongoose(logger);
  try {
    const modified = await resetSpamScannerSettings();
    if (modified !== null)
      logger.info('spam scanner settings reset', { modified });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
