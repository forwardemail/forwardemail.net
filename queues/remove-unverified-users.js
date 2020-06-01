const moment = require('moment');

const Users = require('../app/models/user');
const logger = require('../helpers/logger');

//
// this job removes unverified users from 7d+ ago
//
module.exports = async job => {
  try {
    logger.info('starting remove unverified users', { job });
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
