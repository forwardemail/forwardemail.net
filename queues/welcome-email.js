const { select } = require('mongoose-json-select');

const bull = require('../bull');
const config = require('../config');
const logger = require('../helpers/logger');
const Users = require('../app/models/user');

module.exports = async job => {
  logger.info('welcome email', { job });
  try {
    const obj = {};
    obj[config.userFields.welcomeEmailSentAt] = { $exists: false };
    const users = await Users.find(obj)
      .lean()
      .exec();
    await Promise.all(
      users.map(async user => {
        // add welcome email job
        try {
          const job = await bull.add('email', {
            template: 'welcome',
            message: {
              to: user[config.userFields.fullEmail]
            },
            locals: {
              user: select(user.toObject(), Users.schema.options.toJSON.select)
            }
          });
          logger.info('added job', bull.getMeta({ job }));
          user[config.userFields.welcomeEmailSentAt] = new Date();
          await user.save();
        } catch (err) {
          logger.error(err);
        }
      })
    );
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
