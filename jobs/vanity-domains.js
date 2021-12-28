// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');
const config = require('#config');

const Users = require('#models/user');
const Domains = require('#models/domain');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

  // get all admins
  const admins = await Users.find({
    group: 'admin'
  })
    .lean()
    .exec();
  if (admins.length === 0) {
    logger.info('No admins exist yet');
    return;
  }

  // go through all config.vanityDomains and create them assigned to admin
  await Promise.all(
    config.vanityDomains.map(async (vanityDomain) => {
      const domain = await Domains.findOne({
        name: vanityDomain
      });
      if (domain) {
        if (!domain.is_global) {
          domain.is_global = true;
          domain.skip_verification = true;
          await domain.save();
        }

        if (!domain.plan !== 'team') {
          domain.plan = 'team';
          domain.skip_verification = true;
          await domain.save();
        }

        return;
      }

      await Domains.create({
        name: vanityDomain,
        plan: 'team',
        members: admins.map((admin) => ({
          user: admin._id,
          group: 'admin'
        })),
        is_global: true,
        client
      });
    })
  );
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
