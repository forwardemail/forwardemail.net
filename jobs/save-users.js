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

(async () => {
  await setupMongoose(logger);

  const ids = await Users.distinct('_id', {
    [config.userFields.isBanned]: false
  });

  async function mapper(id) {
    const user = await Users.findById(id);
    if (!user) throw new Error('User does not exist');
    try {
      await user.save();
    } catch (err) {
      console.log('Error while saving user', user.email);
      console.log(err);
      console.log('---------------------');
    }
  }

  await pMap(ids, mapper, { concurrency });

  const aliases = await Aliases.distinct('_id', { user: { $in: ids } });

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
        console.log('User does not exist', alias.user);
        return;
      }

      if (!domain) {
        console.log('Domain does not exist', alias.domain);
        return;
      }

      if (
        err.message ===
          'User must be a domain admin to create a catch-all alias.' &&
        domain.is_global
      ) {
        console.log('banning', user.email);
        user[config.userFields.isBanned] = true;
        await user.save();
        return;
      }

      console.log(
        `Error occurred for: ${user.email}`,
        'Alias',
        alias.name,
        'Domain',
        domain.name
      );
      console.log(err);
      console.log('-------------------------------------------');
    }
  }

  await pMap(aliases, aliasMapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
