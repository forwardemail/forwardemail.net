/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const process = require('node:process');
const { promisify } = require('node:util');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const ip = require('ip');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const SQLite = require('./sqlite-server');

const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const setupMongoose = require('#helpers/setup-mongoose');

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);
const subscriber = new Redis(imapSharedConfig.redis, logger);
client.setMaxListeners(0);
subscriber.setMaxListeners(0);

const sqlite = new SQLite({ client, subscriber });

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [sqlite.server],
  redisClients: [client, subscriber],
  logger,
  customHandlers: [() => promisify(sqlite.wss.close).bind(sqlite.wss)()]
});
graceful.listen();
monitorServer();

(async () => {
  try {
    await sqlite.listen();
    if (process.send) process.send('ready');
    const { port } = sqlite.server.address();
    logger.info(
      `SQLite WebSocket server listening on ${port} (LAN: ${ip.address()}:${port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
