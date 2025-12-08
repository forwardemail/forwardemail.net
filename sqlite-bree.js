/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

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
      timeout: '30m'
    },
    {
      name: 'jobs/cleanup-r2-backups',
      timeout: '1h',
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
  await bree.start();
})();

logger.info('SQLite bree started', { hide_meta: true });
