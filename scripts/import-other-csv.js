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
const mongoose = require('mongoose');
const isEmail = require('#helpers/is-email');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

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

  for (const line of lines.slice(1)) {
    // Alias Full, Target Email, Alias, First Name, Last Name, Title
    const [fullAlias, targetEmail, , firstName, lastName] = line.split(',');

    if (!isEmail(fullAlias)) {
      badAlias.push(line);
      continue;
    }

    const name = fullAlias.split('@')[0].trim().toLowerCase();

    let recipient = targetEmail.toLowerCase().trim();
    if (recipient === 'not.active@please.revise')
      recipient = 'nobody@forwardemail.net';

    if (!isEmail(recipient)) {
      badAlias.push(line);
      continue;
    }

    const recipients = [recipient];

    const description = (firstName.trim() + ' ' + lastName.trim()).trim();

    // eslint-disable-next-line no-await-in-loop
    const exists = await Aliases.exists({
      user: user._id,
      domain: domain._id,
      name
    });

    if (exists) continue;

    const is_enabled = recipients[0] !== 'nobody@forwardemail.net';

    if (!is_enabled) notActive.push(line);

    // eslint-disable-next-line no-await-in-loop
    await Aliases.create({
      user: user._id,
      domain: domain._id,
      name,
      recipients,
      description,
      is_enabled
    });
  }

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
