/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const updateSmtpReputation = require('#helpers/update-smtp-reputation');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

//
// Evaluate recent outbound SMTP sending for every sender and move their
// reputation-based daily threshold up or down (see `config.smtpReputationTiers`)
// (missed days are caught up, and new senders are backfilled from history)
//
(async () => {
  await setupMongoose(logger);

  try {
    const counts = await updateSmtpReputation(undefined, { client });
    logger.info('smtp reputation updated', { counts });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
