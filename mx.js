/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const { setTimeout } = require('node:timers/promises');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const MX = require('./mx-server');

const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const wsp = createWebSocketAsPromised();

const mx = new MX({ client, wsp });

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [mx.server],
  redisClients: [client],
  customHandlers: [
    () => {
      mx.isClosing = true;
    },
    async () => {
      // wait for connection rate limiter to finish
      // (since `onClose` is run in the background)
      await setTimeout(ms('3s'));
    },
    // <https://github.com/vitalets/websocket-as-promised#wspclosecode-reason--promiseevent>
    () => {
      try {
        wsp.close();
      } catch (err) {
        logger.fatal(err);
      }
    }
  ],
  logger
});
graceful.listen();

(async () => {
  try {
    await mx.listen();
    if (process.send) process.send('ready');
    logger.info(
      `MX server listening on ${
        mx.server.address().port
      } (LAN: ${ip.address()}:${mx.server.address().port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);
    process.exit(1);
  }
})();

logger.info('MX server started', { hide_meta: true });
