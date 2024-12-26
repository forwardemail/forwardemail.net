/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const isAllowlisted = require('#helpers/is-allowlisted');
const isDenylisted = require('#helpers/is-denylisted');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

const resolver = createTangerine(client, logger);

graceful.listen();

(async () => {
  await setupMongoose(logger);

  if (typeof process.env.VALUE !== 'string')
    throw new TypeError('VALUE missing');

  {
    const result = await isAllowlisted(process.env.VALUE, client, resolver);
    console.log('isAllowlisted', result);
  }

  {
    const result = await isDenylisted(process.env.VALUE, client, resolver);
    console.log('isDenylisted', result);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
