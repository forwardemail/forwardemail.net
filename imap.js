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

const IMAP = require('./imap-server');

const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);
const subscriber = new Redis(imapSharedConfig.redis, logger);

const wsp = createWebSocketAsPromised();

const imap = new IMAP({ client, subscriber, wsp });

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [imap.server],
  redisClients: [client, subscriber],
  logger,
  customHandlers: [
    // <https://github.com/vitalets/websocket-as-promised#wspclosecode-reason--promiseevent>
    () => wsp.close()
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
    logger.error(err);
    process.exit(1);
  }
})();

logger.info('IMAP server started', { hide_meta: true });
