const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('../helpers/logger');
const config = require('../config');

const Users = require('../app/models/user');
const Domains = require('../app/models/domain');

const bullSharedConfig = sharedConfig('BULL');

const mongoose = new Mongoose({ ...bullSharedConfig.mongoose, logger });

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

module.exports = async job => {
  try {
    logger.info('vanity domains', { job });
    await Promise.all([mongoose.connect(), graceful.listen()]);
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
      config.vanityDomains.map(async vanityDomain => {
        const domain = await Domains.findOne({
          name: vanityDomain
        });
        if (domain) {
          if (!domain.is_global) {
            domain.is_global = true;
            await domain.save();
          }

          if (!domain.plan !== 'team') {
            domain.plan = 'team';
            await domain.save();
          }

          return;
        }

        await Domains.create({
          name: vanityDomain,
          plan: 'team',
          members: admins.map(admin => ({
            user: admin._id,
            group: 'admin'
          })),
          is_global: true
        });
      })
    );
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
