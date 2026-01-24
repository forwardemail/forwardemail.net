/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const ip = require('ip');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');
const ManageSieveServer = require('./managesieve-server');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');

const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const wsp = createWebSocketAsPromised();

const managesieve = new ManageSieveServer({
  client,
  wsp,
  logger
});

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [managesieve.server],
  redisClients: [client],
  logger,
  customHandlers: [
    () => {
      managesieve.isClosing = true;
    },
    () => {
      try {
        wsp.close();
      } catch (err) {
        logger.fatal(err);
      }
    }
  ]
});

graceful.listen();

(async () => {
  try {
    await managesieve.listen();
    if (process.send) {
      process.send('ready');
    }

    const address = managesieve.server.address();
    logger.info(
      `ManageSieve server listening on ${address.port} (LAN: ${ip.address()}:${
        address.port
      })`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);
    process.exit(1);
  }
})();

logger.info('ManageSieve server started', { hide_meta: true });
