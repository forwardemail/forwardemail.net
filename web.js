/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const Web = require('@ladjs/web');
const ip = require('ip');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const Users = require('#models/users');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const webConfig = require('#config/web');

const webSharedConfig = sharedConfig('WEB');
const redis = new Redis(
  webSharedConfig.redis,
  logger,
  webSharedConfig.redisMonitor
);

const web = new Web(webConfig(redis), Users);
const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [web.server],
  redisClients: [redis],
  logger
});
graceful.listen();

(async () => {
  try {
    await web.listen(web.config.port);
    if (process.send) process.send('ready');
    const { port } = web.server.address();
    logger.info(
      `Lad web server listening on ${port} (LAN: ${
        web.config.protocol
      }://${ip.address()}:${port})`,
      { hide_meta: true }
    );
    if (config.env === 'development')
      logger.info(
        `Please visit ${config.urls.web} in your browser for testing`,
        { hide_meta: true }
      );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
