const API = require('@ladjs/api');
const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const _ = require('lodash');
const moment = require('moment');

const config = require('../config');
const logger = require('../helpers/logger');

const Users = require('../app/models/user');

const api = new API({ logger });
const mongoose = new Mongoose(
  _.merge({ logger }, api.config.mongoose, config.mongoose)
);

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

//
// this job removes unverified users from 7d+ ago
//
module.exports = async job => {
  logger.info('starting remove unverified users', { job });
  try {
    await Promise.all([mongoose.connect(), graceful.listen()]);
    await Users.remove({
      github_profile_id: {
        $exists: false
      },
      google_profile_id: {
        $exists: false
      },
      has_verified_email: false,
      created_at: {
        $lte: moment()
          .subtract(7, 'days')
          .toDate()
      }
    });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
