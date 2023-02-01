// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

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

graceful.listen();

(async () => {
  await setupMongoose();

  const $or = [];
  const props = [];

  for (const prop of Object.keys(Aliases.prototype.schema.paths)) {
    if (Aliases.prototype.schema.paths[prop].instance === 'String') {
      $or.push({
        [prop]: { $type: 10 }
      });
      props.push(prop);
    }
  }

  const count = await Aliases.countDocuments({ $or });
  console.log('count', count);

  const ids = await Aliases.distinct('_id', { $or });

  async function mapper(id) {
    const alias = await Aliases.findById(id);
    if (!alias) throw new Error('Alias does not exist');
    for (const prop of props) {
      if (alias[prop] === null) {
        console.log(`Alias ${alias.id} had null prop of ${prop}`);
        alias[prop] = undefined;
      }
    }

    try {
      await alias.save();
    } catch (err) {
      console.error(err, { alias });
    }
  }

  await pMap(ids, mapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
