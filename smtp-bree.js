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
      // this is a long running job, but we attempt to restart it
      // every 30s in case errors (e.g. uncaught exception edge case causes `process.exit()`)
      // this job is recursive and calls its main function to keep itself running (and sending emails)
      // (for putting emails back into queue that are frozen or need to be retried, see jobs/unlock-emails)
      //
      name: 'send-emails',
      interval: '30s',
      timeout: 0
    },
    {
      // this is a long running job as well
      // (with setTimeout upon completion)
      // (so it never exits, but this is just in case it does)
      // time to inbox monitoring
      name: 'tti',
      interval: '1m',
      timeout: 0
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

logger.info('SMTP bree started', { hide_meta: true });
