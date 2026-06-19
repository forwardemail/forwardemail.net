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

const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const parseSqlitePortRange = require('#helpers/parse-sqlite-port-range');

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
    //
    // This script runs in two modes, selected by the SQLITE_LEGACY env var that
    // the PM2 app block sets (see ecosystem-sqlite.json):
    //
    //   * NORMAL  (default): a fork-mode worker in the `sqlite` app. Its port is
    //     derived from SQLITE_PORT_RANGE + NODE_APP_INSTANCE, and a boot
    //     assertion guarantees the instance id stays inside the range.
    //
    //   * LEGACY (SQLITE_LEGACY=true): the dedicated single-instance
    //     `sqlite-legacy` app. It binds the legacy single SQLITE_PORT so that
    //     clients (or in-flight connections) that still target the old
    //     single-port endpoint keep reaching a live, fully-capable worker while
    //     the fleet migrates to SQLITE_PORT_RANGE. Being a standalone instance
    //     (not part of the range fork pool), it does NOT participate in the
    //     range/instance assertion.
    //
    const isLegacy = Boolean(env.SQLITE_LEGACY);

    let port;
    if (isLegacy) {
      port = Number.parseInt(env.SQLITE_PORT, 10);
      if (!Number.isInteger(port) || port <= 0) {
        throw new Error(
          `SQLITE_LEGACY is enabled but SQLITE_PORT="${env.SQLITE_PORT}" is not ` +
            'a valid port. Set SQLITE_PORT to the legacy single-port value.'
        );
      }
    } else {
      //
      // Derive the base port and worker count from a SINGLE source of truth:
      // SQLITE_PORT_RANGE (e.g. "3456:3465"). This MUST match what the client
      // pool (helpers/create-websocket-as-promised.js) and the UFW allowlist
      // use, otherwise the firewall, the listeners, and the client connections
      // diverge.
      //
      const { basePort, workerCount } = parseSqlitePortRange();

      // In fork mode, each instance gets a unique port offset by NODE_APP_INSTANCE
      const instanceId = Number.parseInt(
        process.env.NODE_APP_INSTANCE || '0',
        10
      );

      // Fail loudly on a mis-configured topology instead of silently binding a
      // port outside the firewalled range (which would break connectivity).
      if (instanceId < 0 || instanceId >= workerCount) {
        throw new Error(
          `NODE_APP_INSTANCE=${instanceId} is out of range for SQLITE_PORT_RANGE ` +
            `(${basePort}:${
              basePort + workerCount - 1
            }, workerCount=${workerCount}). ` +
            `Ensure ecosystem-sqlite.json 'instances' equals the range width.`
        );
      }

      port = basePort + instanceId;
    }

    await sqlite.listen(port);
    if (process.send) process.send('ready');
    logger.info(
      `SQLite WebSocket server listening on ${port}${
        isLegacy ? ' (legacy)' : ''
      } (LAN: ${ip.address()}:${port})`,
      { hide_meta: true }
    );
    if (isLegacy) {
      console.log(
        '[INFO:sqlite-server] legacy compatibility listener started',
        JSON.stringify({ port })
      );
    }

    await setupMongoose(logger);
  } catch (err) {
    // Use timeout to prevent hanging if MongoDB pool is exhausted
    await Promise.race([logger.error(err), setTimeout(5000)]);
    process.exit(1);
  }
})();
