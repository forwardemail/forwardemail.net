/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const pMap = require('p-map');

const Domains = require('#models/domains');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  const _ids = await Domains.distinct('_id', {
    plan: { $in: ['enhanced_protection', 'team', 'enterprise'] }
  })
    .lean()
    .exec();

  console.log('_ids', _ids.length);

  await pMap(
    _ids,
    async (_id) => {
      const domain = await Domains.findById(_id);
      domain.skip_verification = true;
      domain.skip_ns_check = true;
      domain.skip_payment_check = true;
      try {
        await domain.save();
        console.log('saved', _id);
      } catch (err) {
        logger.error(err, { domain });
      }
    },
    { concurrency: config.concurrency }
  );

  process.exit(0);
})();
