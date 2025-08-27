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

const isSANB = require('is-string-and-not-blank');
const Graceful = require('@ladjs/graceful');
const pMap = require('p-map');

const mongoose = require('mongoose');
const Domains = require('#models/domains');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const domain = await Domains.findById(id);
  if (!domain) throw new Error('domain does not exist');
  // if domain does not have DKIM key/selector then create one
  if (!isSANB(domain.dkim_private_key) || !isSANB(domain.return_path)) {
    console.log('saving', domain.name);
    domain.skip_payment_check = true;
    domain.skip_verification = true;
    await domain.save();
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    const query = {
      $or: [
        {
          plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
          dkim_private_key: {
            $exists: false
          }
        },
        {
          plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
          return_path: {
            $exists: false
          }
        }
      ]
    };
    const count = await Domains.countDocuments(query);
    console.log('count', count);

    const ids = await Domains.distinct('_id', query);

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
