/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

const Graceful = require('@ladjs/graceful');
const ProxyServer = require('@ladjs/proxy');
const ip = require('ip');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');

const proxySharedConfig = sharedConfig('PROXY');

const proxy = new ProxyServer({
  ...proxySharedConfig,
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
      `Lad proxy server listening on ${port} (LAN: ${
        proxy.config.protocol
      }://${ip.address()}:${port})`,
      { hide_meta: true }
    );
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
