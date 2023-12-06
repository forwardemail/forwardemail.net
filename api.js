/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const API = require('@ladjs/api');
const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const ip = require('ip');

const apiConfig = require('#config/api');
const Users = require('#models/users');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const monitorServer = require('#helpers/monitor-server');

const api = new API(apiConfig, Users);
const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [api.server],
  redisClients: [api.client],
  logger
});
graceful.listen();
monitorServer();

(async () => {
  try {
    await api.listen(api.config.port);
    if (process.send) process.send('ready');
    const { port } = api.server.address();
    logger.info(
      `Lad API server listening on ${port} (LAN: ${ip.address()}:${port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    logger.error(err);

    process.exit(1);
  }
})();
