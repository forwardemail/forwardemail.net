/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');

const logger = require('#helpers/logger');

const bree = new Bree({ logger });

const graceful = new Graceful({
  brees: [bree],
  logger
});
graceful.listen();

(async () => {
  await bree.start();
})();

logger.info('Lad bree started', { hide_meta: true });
