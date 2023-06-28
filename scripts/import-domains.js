// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const fs = require('fs');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');

const mongoose = require('mongoose');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const config = require('#config');
const Users = require('#models/users');
const Domains = require('#models/domains');
const Aliases = require('#models/aliases');

// environment variables passed to script:
// USER_EMAIL=the email of the user that the aliases created will belong to
// DOMAIN_NAME=the domain name that the aliases will belong to
// FILE_PATH=the file path to the CSV file to import
if (!isSANB(process.env.USER_EMAIL)) throw new Error('USER_EMAIL missing');
if (!isSANB(process.env.FILE_PATH)) throw new Error('FILE_PATH missing');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  const user = await Users.findOne({ email: process.env.USER_EMAIL })
    .lean()
    .exec();
  if (!user) throw new Error('User does not exist');

  const stat = await fs.promises.stat(process.env.FILE_PATH);
  if (!stat.isFile()) throw new Error(`${process.env.FILE_PATH} is not a file`);

  const file = await fs.promises.readFile(process.env.FILE_PATH, 'utf8');

  const lines = file.split('\n');

  await pMap(
    lines,
    async (name) => {
      if (!name) return;
      try {
        const domain = await Domains.create({
          is_api: true,
          members: [{ user: user._id, group: 'admin' }],
          name,
          is_global: false,
          plan: user.plan
        });

        await Aliases.create({
          is_api: true,
          user: user._id,
          domain: domain._id,
          name: '*',
          recipients: [user.email]
        });
        console.log(`created ${domain.name}`);
      } catch (err) {
        console.error(err);
      }
    },
    { concurrency: config.concurrency }
  );

  process.exit(0);
})();
