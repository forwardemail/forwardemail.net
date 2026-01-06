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

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const SQLite = require('./sqlite-server');

const closeDatabase = require('#helpers/close-database');
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
    // TODO: signal to all piscina workers we are shutting down
    // <https://github.com/piscinajs/piscina/issues/615>
    () => sqlite.piscina.close(),
    () => {
      sqlite.isClosing = true;
    },
    () => promisify(sqlite.wss.close).bind(sqlite.wss)(),
    // normal databases
    async () => {
      if (!sqlite.databaseMap || sqlite.databaseMap.size === 0) return;
      await Promise.all(
        [...sqlite.databaseMap.keys()].map(async (key) => {
          await closeDatabase(sqlite.databaseMap.get(key));
          sqlite.databaseMap.delete(key);
        })
      );
    },
    // temporary databases
    async () => {
      if (
        !sqlite.temporaryDatabaseMap ||
        sqlite.temporaryDatabaseMap.size === 0
      )
        return;
      await Promise.all(
        [...sqlite.temporaryDatabaseMap.keys()].map(async (key) => {
          await closeDatabase(sqlite.temporaryDatabaseMap.get(key));
          sqlite.temporaryDatabaseMap.delete(key);
        })
      );
    }
  ]
});
graceful.listen();

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
