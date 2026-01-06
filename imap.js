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

const IMAP = require('./imap-server');

const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);
const subscriber = new Redis(imapSharedConfig.redis, logger);
client.setMaxListeners(0);
subscriber.setMaxListeners(0);

const wsp = createWebSocketAsPromised();

const imap = new IMAP({ client, subscriber, wsp });

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [imap.server],
  redisClients: [client, subscriber],
  logger,
  customHandlers: [
    async () => {
      // wait for connection rate limiter to finish
      // (since `onClose` is run in the background)
      // (and `releaseConnection` handlers get run in background)
      await setTimeout(ms('3s'));
    },
    () => {
      imap.isClosing = true;
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
    await imap.listen();
    if (process.send) process.send('ready');
    logger.info(
      `IMAP server listening on ${
        imap.server.address().port
      } (LAN: ${ip.address()}:${imap.server.address().port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);
    process.exit(1);
  }
})();

logger.info('IMAP server started', { hide_meta: true });
