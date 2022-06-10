// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');

const API = require('@ladjs/api');
const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const ip = require('ip');

const Users = require('#models/user');
const apiConfig = require('#config/api');
const logger = require('#helpers/logger');

const api = new API(apiConfig, Users);
const mongoose = new Mongoose({ ...api.config.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [api.server],
  redisClients: [api.client],
  logger
});
graceful.listen();

(async () => {
  try {
    await api.listen(api.config.port);
    if (process.send) process.send('ready');
    const { port } = api.server.address();
    logger.info(
      `Lad API server listening on ${port} (LAN: ${ip.address()}:${port})`
    );
    await mongoose.connect();
  } catch (err) {
    logger.error(err);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
})();
