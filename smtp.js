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

const SMTP = require('./smtp-server');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const smtp = new SMTP({ client });

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [smtp.server],
  redisClients: [client],
  logger
});
graceful.listen();

(async () => {
  try {
    await smtp.listen();
    if (process.send) process.send('ready');
    logger.info(
      `SMTP server listening on ${
        smtp.server.address().port
      } (LAN: ${ip.address()}:${smtp.server.address().port})`,
      { hide_meta: true }
    );
    await setupMongoose(logger);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();

logger.info('SMTP server started', { hide_meta: true });
