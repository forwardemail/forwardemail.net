const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('../helpers/logger');

const Users = require('../app/models/user');

const bullSharedConfig = sharedConfig('BULL');

const mongoose = new Mongoose({ ...bullSharedConfig.mongoose, logger });

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

//
// this job removes unverified users from 7d+ ago
//
module.exports = async job => {
  try {
    logger.info('starting remove unverified users', { job });
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
        $lte: dayjs()
          .subtract(7, 'days')
          .toDate()
      }
    });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
