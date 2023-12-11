/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

const Graceful = require('@ladjs/graceful');
const ProxyServer = require('@ladjs/proxy');
const ip = require('ip');

const logger = require('#helpers/logger');

const proxy = new ProxyServer({
  logger
});

const graceful = new Graceful({ servers: [proxy.server], logger });
graceful.listen();

(async () => {
  try {
    await proxy.listen(proxy.config.port);
    if (process.send) process.send('ready');
    const { port } = proxy.server.address();
    logger.info(
      `Lad proxy server listening on ${port} (LAN: ${ip.address()}:${port})`,
      { hide_meta: true }
    );
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
