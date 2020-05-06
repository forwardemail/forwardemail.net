const API = require('@ladjs/api');
const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const _ = require('lodash');

const logger = require('../helpers/logger');
const config = require('../config');

const Domains = require('../app/models/domain');

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
      ]
    });
    await Promise.all(domains.map(domain => domain.save()));
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
