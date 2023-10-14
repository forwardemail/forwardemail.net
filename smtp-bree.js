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
      // this job has built-in setInterval for every 10m to unlock emails in queue
      // and we will also retry deferred emails and put them back into the queue
      //
      name: 'send-emails',
      interval: '30s',
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
