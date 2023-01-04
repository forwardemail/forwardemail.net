// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  try {
    // mirror the keys for our migration
    const [denylistedKeys, whitelistedKeys] = await Promise.all([
      client.keys('blacklist:*'),
      client.keys('whitelist:*')
    ]);
    const pipeline = client.pipeline();
    for (const key of denylistedKeys) {
      pipeline.set(key.replace('blacklist:', 'denylist:'), 'true');
    }

    for (const key of whitelistedKeys) {
      pipeline.set(key.replace('whitelist:', 'allowlist:'), 'true');
    }

    await pipeline.exec();
  } catch (err) {
    logger.fatal(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
