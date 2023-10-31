/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const ip = require('ip');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');
const { WebSocket } = require('ws');
// const { WebSocket } = require('undici');

const SQLite = require('./sqlite-server');

const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { encrypt } = require('#helpers/encrypt-decrypt');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const sqlite = new SQLite({ client }, config.env === 'production');

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [sqlite.server],
  redisClients: [client],
  logger
});
graceful.listen();

function ping() {
  clearTimeout(this.pingTimeout);
  console.log('ping');
  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 5000);
}

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

    const client = new WebSocket(
      `${config.env === 'production' ? 'wss' : 'ws'}://${encrypt(
        env.API_SECRETS[0]
      )}:@${ip.address()}:${port}`
    );
    client.on('error', console.error);
    client.on('open', ping);
    client.on('ping', ping);
    client.on('close', function () {
      clearTimeout(this.pingTimeout);
    });
  } catch (err) {
    logger.error(err);

    process.exit(1);
  }
})();
