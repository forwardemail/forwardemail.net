/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const fs = require('node:fs');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');
const { isEmail } = require('validator');

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
if (!isSANB(process.env.DOMAIN_NAME)) throw new Error('DOMAIN_NAME missing');
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

  const domain = await Domains.findOne({
    'members.user': user._id,
    name: process.env.DOMAIN_NAME
  })
    .lean()
    .exec();

  if (!domain) throw new Error('Domain does not exist');

  const stat = await fs.promises.stat(process.env.FILE_PATH);
  if (!stat.isFile()) throw new Error(`${process.env.FILE_PATH} is not a file`);

  const file = await fs.promises.readFile(process.env.FILE_PATH, 'utf8');

  const lines = file.split('\n');

  const badAlias = [];
  const notActive = [];

  await pMap(
    lines.slice(1),
    async (line) => {
      // Alias Full, Target Email
      const [targetEmail, fullAlias] = line.split(',');

      if (
        typeof fullAlias !== 'string' ||
        !isEmail(fullAlias) ||
        typeof targetEmail !== 'string' ||
        !isEmail(targetEmail)
      ) {
        badAlias.push(line);
        return;
      }

      const name = fullAlias.split('@')[0].trim().toLowerCase();

      const recipient = targetEmail.toLowerCase().trim();

      if (!isEmail(recipient)) {
        badAlias.push(line);
        return;
      }

      const recipients = [recipient];

      const exists = await Aliases.exists({
        user: user._id,
        domain: domain._id,
        name
      });

      if (exists) return;

      await Aliases.create({
        user: user._id,
        domain: domain._id,
        name,
        recipients,
        is_enabled: true
      });
    },
    { concurrency: config.concurrency }
  );

  console.log('--------------------------');
  console.log('badAlias');
  console.log(lines.slice(0, 1));
  console.log(badAlias.join('\n'));
  console.log('--------------------------');

  console.log('--------------------------');
  console.log('notActive');
  console.log(lines.slice(0, 1));
  console.log(notActive.join('\n'));
  console.log('--------------------------');

  process.exit(0);
})();
