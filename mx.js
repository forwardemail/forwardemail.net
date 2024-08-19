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
const delay = require('delay');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const MX = require('./mx-server');
const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const mx = new MX({ client });

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
      await delay(ms('3s'));
    }
  ],
  logger
});
graceful.listen();
monitorServer();

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
