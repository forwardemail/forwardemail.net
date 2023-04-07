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
const Domains = require('#models/domains');
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
  const domain = await Domains.findById(id);
  if (!domain) throw new Error('domain does not exist');
  for (const prop of props) {
    if (domain[prop] === null) {
      logger.info(`domain ${domain.id} had null prop of ${prop}`);
      domain[prop] = undefined;
    }
  }

  domain.skip_verification = true;
  await domain.save();
}

(async () => {
  await setupMongoose(logger);
  try {
    for (const prop of Object.keys(Domains.prototype.schema.paths)) {
      if (Domains.prototype.schema.paths[prop].instance === 'String') {
        $or.push({
          [prop]: { $type: 10 }
        });
        props.push(prop);
      }
    }

    const count = await Domains.countDocuments({ $or });
    logger.info('count', count);

    const ids = await Domains.distinct('_id', { $or });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
