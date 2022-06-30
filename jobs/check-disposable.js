// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const superagent = require('superagent');

const Users = require('#models/user');
const Aliases = require('#models/alias');
const Domains = require('#models/domain');
const logger = require('#helpers/logger');

const breeSharedConfig = sharedConfig('BREE');

const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

  const { text } = await superagent.get(
    'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json'
  );

  const DISPOSABLE = new Set(JSON.parse(text));

  const users = await Users.find({ group: 'user', plan: 'free' })
    .select('_id email')
    .lean()
    .exec();
  const userIds = [];

  for (const user of users) {
    const domain = user.email.split('@')[1];
    if (DISPOSABLE.has(domain)) userIds.push(user._id);
  }

  const partiallyVerifiedDomainUserIds = await Domains.distinct(
    'members.user',
    {
      $or: [
        {
          is_global: false,
          has_mx_record: true
        },
        {
          is_global: false,
          has_txt_record: true
        },
        {
          is_global: false,
          plan: {
            $ne: 'free'
          }
        }
      ]
    }
  );

  // TODO: we may want to ban or send upgrade notices to users using disposable addresses
  //       that do not have fully verified domain names
  const disposableCount = await Users.count({
    $and: [
      {
        _id: { $in: userIds }
      },
      {
        _id: { $nin: partiallyVerifiedDomainUserIds }
      }
    ]
  });
  logger.info('disposableCount', { disposableCount });

  const globalDomainIds = await Domains.distinct('_id', { is_global: true });

  const aliasCount = await Aliases.count({
    user: { $in: userIds },
    domain: { $in: globalDomainIds }
  });
  logger.info('# of aliases for users with disposable email addresses', {
    aliasCount
  });

  const domainCount = await Domains.count({
    is_global: false,
    has_mx_record: false,
    has_txt_record: false,
    plan: 'free',
    'members.user': { $in: userIds }
  });
  logger.info('# of domains for users with disposable email addresses', {
    domainCount
  });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
