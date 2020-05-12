const API = require('@ladjs/api');
const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const _ = require('lodash');

const logger = require('../helpers/logger');
const config = require('../config');

const { Aliases, Users, Domains } = require('../app/models');

const api = new API({ logger });
const mongoose = new Mongoose(
  _.merge({ logger }, api.config.mongoose, config.mongoose)
);

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

module.exports = async job => {
  logger.info('migration', { job });
  try {
    await Promise.all([mongoose.connect(), graceful.listen()]);

    const domainsWithPortNumber = await Domains.find({
      smtp_port: {
        $type: 'number'
      }
    });

    await Promise.all(
      domainsWithPortNumber.map(async domain => {
        domain.smtp_port = domain.smtp_port.toString();
        await domain.save();
      })
    );

    const domains = await Domains.find({
      $or: [
        {
          verification_record: {
            $exists: false
          }
        },
        {
          plan: {
            $exists: false
          }
        },
        {
          smtp_port: {
            $exists: false
          }
        },
        {
          max_recipients_per_alias: {
            $exists: false
          }
        }
        /*
        {
          members: {
            $exists: true,
            $size: {
              $not: 0
            }
          },
          'members.0._id': {
            $exists: true
          },
          'members.0.id': {
            $exists: false
          }
        },
        {
          invites: {
            $exists: true,
            $size: {
              $not: 0
            }
          },
          'invites.0._id': {
            $exists: true
          },
          'invites.0.id': {
            $exists: false
          }
        }
        */
      ]
    });
    await Promise.all(domains.map(domain => domain.save()));

    // find all domains with zero aliases and create one pointing to admin
    const domainIds = await Domains.distinct('_id', {});
    await Promise.all(
      domainIds.map(async domainId => {
        const count = await Aliases.count({ domain: domainId });
        if (count > 0) return;
        const domain = await Domains.findById(domainId)
          .lean()
          .exec();
        if (!domain) throw new Error('Domain missing');
        const admin = domain.members.find(member => member.group === 'admin');
        if (!admin) throw new Error('Admin missing');
        const user = await Users.findById(admin.user)
          .lean()
          .exec();
        if (!user) throw new Error('User missing');
        // create a default alias for the user pointing to the admin
        await Aliases.create({
          user: user._id,
          domain: domain._id,
          name: '*',
          recipients: [user.email],
          locale: user.last_locale
        });
      })
    );
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
