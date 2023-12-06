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
const { Aliases, Users, Domains } = require('#models');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const config = require('#config');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');
  try {
    await user.save();
  } catch (err) {
    logger.info('Error while saving user', user.email);
    logger.info(err);
    logger.info('---------------------');
  }
}

async function aliasMapper(id) {
  const alias = await Aliases.findById(id);
  if (!alias) throw new Error('Alias does not exist');
  try {
    await alias.save();
  } catch (err) {
    if (
      err.message ===
        'User cannot have more than (5) aliases on global domains.' ||
      err.message === 'Alias already exists for domain.'
    )
      return;
    const user = await Users.findById(alias.user);
    const domain = await Domains.findById(alias.domain).lean().exec();
    if (!user) {
      logger.info('User does not exist', alias.user);
      return;
    }

    if (!domain) {
      logger.info('Domain does not exist', alias.domain);
      return;
    }

    if (
      err.message ===
        'User must be a domain admin to create a catch-all alias.' &&
      domain.is_global
    ) {
      logger.info('banning', user.email);
      user[config.userFields.isBanned] = true;
      await user.save();
      return;
    }

    logger.info(
      `Error occurred for: ${user.email}`,
      'Alias',
      alias.name,
      'Domain',
      domain.name
    );
    logger.info(err);
    logger.info('-------------------------------------------');
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const ids = await Users.distinct('_id', {
      [config.userFields.isBanned]: false
    });

    await pMap(ids, mapper, { concurrency });

    const aliases = await Aliases.distinct('_id', { user: { $in: ids } });

    await pMap(aliases, aliasMapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
