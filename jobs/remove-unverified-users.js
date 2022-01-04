// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');
const Users = require('#models/user');

const breeSharedConfig = sharedConfig('BREE');

const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

//
// this job removes unverified users from 7d+ ago
//
(async () => {
  await mongoose.connect();

  await Users.deleteMany({
    github_profile_id: {
      $exists: false
    },
    google_profile_id: {
      $exists: false
    },
    has_verified_email: false,
    created_at: {
      $lte: dayjs().subtract(7, 'days').toDate()
    }
  });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
