// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/alias');
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
