// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const { request, errors } = require('undici');

const mongoose = require('mongoose');
const Users = require('#models/users');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const response = await request(
      'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json',
      {
        signal: AbortSignal.timeout(10000),
        throwOnError: true
      }
    );

    // the error code is between 200-400 (e.g. 302 redirect)
    // in order to mirror the behavior of `throwOnError` we will re-use the undici errors
    // <https://github.com/nodejs/undici/issues/2093>
    if (response.statusCode !== 200)
      throw new errors.ResponseStatusCodeError(
        `Response status code ${response.statusCode}`,
        response.statusCode,
        response.headers
      );

    const json = await response.body.json();

    const DISPOSABLE = new Set(json);

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
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
