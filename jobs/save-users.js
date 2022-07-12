// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const Users = require('#models/user');
const logger = require('#helpers/logger');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

  const ids = await Users.distinct('_id', {});

  async function mapper(id) {
    const user = await Users.findById(id);
    if (!user) throw new Error('User does not exist');
    await user.save();
  }

  await pMap(ids, mapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
