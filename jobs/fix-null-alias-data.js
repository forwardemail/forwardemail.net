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
const Aliases = require('#models/aliases');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});
const $or = [];
const props = [];

graceful.listen();
async function mapper(id) {
  const alias = await Aliases.findById(id);
  if (!alias) throw new Error('Alias does not exist');
  for (const prop of props) {
    if (alias[prop] === null) {
      logger.info(`Alias ${alias.id} had null prop of ${prop}`);
      alias[prop] = undefined;
    }
  }

  try {
    await alias.save();
  } catch (err) {
    console.error(err, { alias });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    for (const prop of Object.keys(Aliases.prototype.schema.paths)) {
      if (Aliases.prototype.schema.paths[prop].instance === 'String') {
        $or.push({
          [prop]: { $type: 10 }
        });
        props.push(prop);
      }
    }

    const count = await Aliases.countDocuments({ $or });
    logger.info('count', count);

    const ids = await Aliases.distinct('_id', { $or });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
