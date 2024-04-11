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
const mongoose = require('mongoose');
const ip = require('ip');

const CalDAV = require('./caldav-server');
const Users = require('#models/users');
const calDAVConfig = require('#config/caldav');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const setupMongoose = require('#helpers/setup-mongoose');

const wsp = createWebSocketAsPromised();

const calDAV = new CalDAV(
  {
    ...calDAVConfig,
    wsp
  },
  Users
);
const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [calDAV.server],
  redisClients: [calDAV.client],
  logger,
  customHandlers: [
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
monitorServer();

(async () => {
  try {
    await calDAV.listen(calDAV.config.port);
    if (process.send) process.send('ready');
    const { port } = calDAV.server.address();
    logger.info(
      `CalDAV server listening on ${port} (LAN: ${ip.address()}:${port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();
