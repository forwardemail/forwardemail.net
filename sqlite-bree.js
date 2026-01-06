/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');

const logger = require('#helpers/logger');

const bree = new Bree({
  logger,
  jobs: [
    {
      //
      // this job cleans up any backup artifacts from 4 hr+ ago for 'rekey' and 'backup' sqlite-server cases
      // (e.g. the server stopped mid-backup or an error occurred, e.g. ran out of memory)
      // and in an attempt to save on disk stoarge, we will run `fs.unlink` on each of these files
      // and it also updates the storage size across all aliases found
      //
      name: 'cleanup-sqlite',
      interval: '1h',
      timeout: 0
    },
    {
      name: 'cleanup-r2-backups',
      timeout: 0,
      interval: '1d'
    }
  ]
});

const graceful = new Graceful({
  brees: [bree],
  logger
});
graceful.listen();

(async () => {
  try {
    await bree.start();
  } catch (err) {
    await logger.fatal(err);

    process.exit(1);
  }
})();

logger.info('SQLite bree started', { hide_meta: true });
