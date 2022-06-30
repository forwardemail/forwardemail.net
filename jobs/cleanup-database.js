// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/alias');
const Domains = require('#models/domain');
const Users = require('#models/user');
const config = require('#config');
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

  // delete unverified and unpaid users from 7+ days ago
  {
    const results = await Users.deleteMany({
      plan: 'free',
      [config.userFields.isBanned]: {
        $ne: true
      },
      [config.passport.fields.githubProfileID]: {
        $exists: false
      },
      [config.passport.fields.googleProfileID]: {
        $exists: false
      },
      [config.userFields.hasVerifiedEmail]: false,
      created_at: {
        $lte: dayjs().subtract(7, 'days').toDate()
      }
    });

    logger.info('deleted unverified and unpaid users created 7+ days ago', {
      results
    });
  }

  // lookup all global domains and then lookup all unique userIds created using them
  const globalDomainIds = await Domains.distinct('_id', { is_global: true });

  const [
    globalDomainAliasUserIds,
    partiallyVerifiedDomainUserIds,
    domainsCreatedWithinPastWeekUserIds
  ] = await Promise.all([
    // exclude any user ids that have global aliases
    Aliases.distinct('user', {
      domain: { $in: globalDomainIds }
    }),
    // exclude any user ids that have domains that are partially verified or not free
    Domains.distinct('members.user', {
      $or: [
        {
          has_mx_record: true
        },
        {
          has_txt_record: true
        },
        {
          plan: {
            $ne: 'free'
          }
        }
      ]
    }),
    // exclude any user ids that have domains created within past 7 days
    Domains.distinct('members.user', {
      created_at: {
        $gte: dayjs().subtract(7, 'days').toDate()
      }
    })
  ]);

  logger.info('global domain alias user ids', {
    count: globalDomainAliasUserIds.length
  });
  logger.info('partially verified domain user ids', {
    count: partiallyVerifiedDomainUserIds.length
  });
  logger.info('domains created within past week user ids', {
    count: domainsCreatedWithinPastWeekUserIds.length
  });

  const query = {
    plan: 'free',
    [config.userFields.isBanned]: {
      $ne: true
    },
    created_at: {
      $lte: dayjs().subtract(30, 'days').toDate()
    },
    _id: {
      $nin: [
        ...globalDomainAliasUserIds,
        ...partiallyVerifiedDomainUserIds,
        ...domainsCreatedWithinPastWeekUserIds
      ]
    }
  };

  // TODO: we should probably delete these users or put them into a drip campaign
  const results = await Users.count(query);

  logger.info(
    'users on free plan created 30+ days ago without global aliases and no partially verified domains',
    { results }
  );

  // cleanup aliases and domains for users that do not exist
  {
    const userIds = await Users.distinct('_id', {});
    // safety net
    if (userIds.length > 0) {
      {
        // delete aliases with user ids that do not exist
        const results = await Aliases.deleteMany({
          user: {
            $nin: userIds
          }
        });
        logger.info('deleted aliases for users that did not exist', {
          results
        });
      }

      {
        // delete domains with user ids that do not exist
        const results = await Domains.deleteMany({
          'members.user': {
            $nin: userIds
          }
        });
        logger.info('deleted domains for users that did not exist', {
          results
        });
      }
    }
  }

  // cleanup aliases for domains that do not exist
  {
    const domainIds = await Domains.distinct('_id', {});
    // safety net
    if (domainIds.length > 0) {
      // delete aliases with domains that do not exist
      const results = await Aliases.deleteMany({
        domain: {
          $nin: domainIds
        }
      });
      logger.info('deleted aliases for domains that did not exist', {
        results
      });
    }
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
