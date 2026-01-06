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
const ip = require('ip');
const mongoose = require('mongoose');

const CardDAV = require('./carddav-server');
const Users = require('#models/users');
const cardDAVConfig = require('#config/carddav');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

(async () => {
  try {
    const cardDAV = new CardDAV(
      {
        ...cardDAVConfig,
        wsp: createWebSocketAsPromised()
      },
      Users
    );

    const graceful = new Graceful({
      mongooses: [mongoose],
      servers: [cardDAV.server],
      redisClients: [cardDAV.client],
      logger,
      customHandlers: [
        // <https://github.com/vitalets/websocket-as-promised#wspclosecode-reason--promiseevent>
        () => {
          try {
            cardDAV.config.wsp.close();
          } catch (err) {
            logger.fatal(err);
          }
        }
      ]
    });

    graceful.listen();

    await cardDAV.listen(cardDAV.config.port);
    if (process.send) process.send('ready');
    const { port } = cardDAV.server.address();
    logger.info(
      `CardDAV server listening on ${port} (LAN: ${
        cardDAV.config.protocol
      }://${ip.address()}:${port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
