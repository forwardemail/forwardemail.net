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
const spamScanner = require('#helpers/spam-scanner');
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
      // Wait for in-flight DATA handlers to complete before closing WSP.
      // The IMAP append timeout is 1m, but most complete within seconds.
      // 15s gives active deliveries time to finish while still allowing
      // reasonably fast restarts during deploys.
      await setTimeout(ms('15s'));
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
    // load the Spam Scanner classifier now, not on the first message
    spamScanner.warm();
    logger.info(
      `MX server listening on ${
        mx.server.address().port
      } (LAN: ${ip.address()}:${mx.server.address().port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    // Use timeout to prevent hanging if MongoDB pool is exhausted
    await Promise.race([logger.error(err), setTimeout(5000)]);
    process.exit(1);
  }
})();

logger.info('MX server started', { hide_meta: true });
