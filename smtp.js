const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const SMTP = require('./smtp-server');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const INSTANCE =
  typeof process.env.NODE_APP_INSTANCE === 'string'
    ? Number.parseInt(process.env.NODE_APP_INSTANCE, 10)
    : 0;

const timeout = ms(`${INSTANCE * 5}s`);

const bree = new Bree({
  logger,
  jobs: [
    {
      //
      // this is a long running job, but we attempt to restart it
      // every 30s in case errors (e.g. uncaught exception edge case causes `process.exit()`)
      // this job has built-in setInterval for every 10m to unlock emails in queue
      // and we will also retry deferred emails and put them back into the queue
      //
      name: 'send-emails',
      interval: '30s',
      timeout
    }
  ]
});
const smtp = new SMTP({ client, bree });

const graceful = new Graceful({
  mongooses: [mongoose],
  servers: [smtp.server],
  redisClients: [client],
  brees: [bree],
  logger
});
graceful.listen();

(async () => {
  try {
    await Promise.all([smtp.listen(), bree.start()]);
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

logger.info('Lad bree started', { hide_meta: true });
