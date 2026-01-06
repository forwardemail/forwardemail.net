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
const mongoose = require('mongoose');
const ip = require('ip');

const API = require('./api-server');

const Users = require('#models/users');
const apiConfig = require('#config/api');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const api = new API(
  {
    ...apiConfig,
    wsp: createWebSocketAsPromised()
  },
  Users
);

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [api.server],
  redisClients: [api.client],
  logger
});
graceful.listen();

(async () => {
  try {
    await api.listen(api.config.port);
    if (process.send) process.send('ready');
    const { port } = api.server.address();
    logger.info(
      `Lad API server listening on ${port} (LAN: ${
        api.config.protocol
      }://${ip.address()}:${port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
