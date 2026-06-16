/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const process = require('node:process');
const { promisify } = require('node:util');
const { setTimeout } = require('node:timers/promises');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const SQLite = require('./sqlite-server');

const logger = require('#helpers/logger');
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
  timeoutMs: ms('1m'),
  customHandlers: [
    () => {
      sqlite.isClosing = true;
    },
    () => promisify(sqlite.wss.close).bind(sqlite.wss)(),
    // normal databases (no-op when databaseMap is null / disabled)
    async () => {
      if (sqlite.databaseMap) await sqlite.databaseMap.closeAll();
    },
    // temporary databases (no-op when temporaryDatabaseMap is null / disabled)
    async () => {
      if (sqlite.temporaryDatabaseMap)
        await sqlite.temporaryDatabaseMap.closeAll();
    }
  ]
});
graceful.listen();

(async () => {
  try {
    // In fork mode, each instance gets a unique port offset by NODE_APP_INSTANCE
    const instanceId = Number.parseInt(
      process.env.NODE_APP_INSTANCE || '0',
      10
    );
    const port =
      Number.parseInt(process.env.SQLITE_PORT || '3456', 10) + instanceId;
    await sqlite.listen(port);
    if (process.send) process.send('ready');
    logger.info(
      `SQLite WebSocket server listening on ${port} (LAN: ${ip.address()}:${port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    // Use timeout to prevent hanging if MongoDB pool is exhausted
    await Promise.race([logger.error(err), setTimeout(5000)]);
    process.exit(1);
  }
})();
