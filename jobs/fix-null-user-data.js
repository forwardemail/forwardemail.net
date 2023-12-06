/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const os = require('node:os');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const pMap = require('p-map');

const mongoose = require('mongoose');
const Users = require('#models/users');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const $or = [];
const props = [];

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');
  for (const prop of props) {
    if (user[prop] === null) {
      logger.info(`User ${user.email} had null prop of ${prop}`);
      user[prop] = undefined;
    }
  }

  await user.save();
}

(async () => {
  await setupMongoose(logger);

  try {
    for (const prop of Object.keys(Users.prototype.schema.paths)) {
      if (Users.prototype.schema.paths[prop].instance === 'String') {
        $or.push({
          [prop]: { $type: 10 }
        });
        props.push(prop);
      }
    }

    const count = await Users.countDocuments({ $or });
    logger.info('count', count);

    const ids = await Users.distinct('_id', { $or });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
