/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');

const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');

const bree = new Bree({ logger });

const graceful = new Graceful({
  brees: [bree],
  logger
});
graceful.listen();
monitorServer();

(async () => {
  try {
    await bree.start();
  } catch (err) {
    await logger.error(err);
    process.exit(1);
  }
})();

logger.info('Lad bree started', { hide_meta: true });
