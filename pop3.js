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
const ip = require('ip');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const POP3 = require('./pop3-server');

const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const pop3SharedConfig = sharedConfig('POP3');
const client = new Redis(pop3SharedConfig.redis, logger);
const subscriber = new Redis(pop3SharedConfig.redis, logger);
client.setMaxListeners(0);
subscriber.setMaxListeners(0);

const wsp = createWebSocketAsPromised();

const pop3 = new POP3({ client, subscriber, wsp });

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [pop3.server],
  redisClients: [client, subscriber],
  logger,
  customHandlers: [
    () => {
      pop3.isClosing = true;
    },
    // <https://github.com/vitalets/websocket-as-promised#wspclosecode-reason--promiseevent>
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
    await pop3.listen();
    if (process.send) process.send('ready');
    logger.info(
      `POP3 server listening on ${
        pop3.server.address().port
      } (LAN: ${ip.address()}:${pop3.server.address().port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);
    process.exit(1);
  }
})();

logger.info('POP3 server started', { hide_meta: true });
