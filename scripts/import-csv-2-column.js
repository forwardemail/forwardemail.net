/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const fs = require('node:fs');
const path = require('node:path');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const isSANB = require('is-string-and-not-blank');
const splitLines = require('split-lines');
const mongoose = require('mongoose');
const isEmail = require('#helpers/is-email');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

// const config = require('#config');
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

  const lines = splitLines(file)
    .map((s) => s.trim())
    .filter((s) => isSANB(s));

  console.log('lines', lines);

  const badAlias = [];
  let aliases = [];
  const cleanup = [];

  for (let line of lines) {
    line = line.trim();

    if (!isSANB(line) || line === '"') continue;

    const originalLine = line;

    // replace prefix "."
    if (line.startsWith('.')) line = line.slice(1);

    // replace affix ".," with ","
    line = line.replace(/\.,/g, ',');

    // remove quotes and apostrophes
    line = line.replace(/['"]+/g, '');

    // replace double ".." with "."
    line = line.replace(/\.\./g, '.');

    // replace ".@" with "@"
    line = line.replace(/\.@/g, '@');

    // replace ">," with ","
    line = line.replace(/>,/g, ',');

    // Alias Full, Target Email
    const [targetEmail, fullAlias] = line.split(',');

    if (
      typeof fullAlias !== 'string' ||
      !isEmail(fullAlias) ||
      typeof targetEmail !== 'string' ||
      !isEmail(targetEmail)
    ) {
      badAlias.push(originalLine);
      continue;
    }

    const name = fullAlias.split('@')[0].trim().toLowerCase();

    const recipient = targetEmail.toLowerCase().trim();

    if (!isEmail(recipient)) {
      badAlias.push(originalLine);
      continue;
    }

    if (originalLine !== line) {
      cleanup.push({ before: originalLine, after: line });
    }

    aliases.push({
      name,
      recipient
    });

    /*
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
    */
  }

  console.log('total import', aliases.length);

  console.log('badAlias', badAlias.length);
  fs.writeFileSync(
    path.join(__dirname, 'bad-lines.csv'),
    lines.slice(0, 1) + badAlias.join('\n')
  );

  console.log('---- cleanup ----', cleanup.length);
  fs.writeFileSync(
    path.join(__dirname, 'cleanup.json'),
    JSON.stringify(cleanup, null, 2)
  );

  // filter out alias names that already exist
  const existingNames = await Aliases.distinct('name', {
    domain: domain._id
  });

  console.log('existingNames', existingNames.length);

  const EXISTING_NAMES = new Set(existingNames);

  console.log('BEFORE NEW ALIASES', aliases.length);

  aliases = aliases.filter((a) => !EXISTING_NAMES.has(a.name));

  console.log('AFTER NEW ALIASES', aliases.length);

  const results = await Aliases.collection.bulkWrite(
    aliases.map((a) => {
      const doc = new Aliases({
        user: user._id,
        domain: domain._id,
        name: a.name,
        recipients: [a.recipient],
        is_enabled: true
      }).toObject({
        bson: true,
        transform: false,
        virtuals: true,
        getters: true,
        _skipDepopulateTopLevel: true,
        depopulate: true,
        flattenDecimals: false,
        useProjection: false
      });

      doc.id = doc._id.toString();
      doc.object = 'alias';
      const now = new Date();
      doc.created_at = now;
      doc.updated_at = now;

      return {
        insertOne: doc
      };
    }),
    {
      writeConcern: {
        w: 'majority',
        wtimeout: 60000
      },
      ordered: false
    }
  );

  console.log('results', results);

  /*
  const bulk = Aliases.collection.initializeUnorderedBulkOp();
  for (const alias of aliases) {
    const doc = new Aliases({
      user: user._id,
      domain: domain._id,
      name: alias.name,
      recipients: [alias.recipient],
      is_enabled: true
    }).toObject({
      bson: true,
      transform: false,
      virtuals: true,
      getters: true,
      _skipDepopulateTopLevel: true,
      depopulate: true,
      flattenDecimals: false,
      useProjection: false
    });

    doc.object = 'alias';
    const now = new Date();
    doc.created_at = now;
    doc.updated_at = now;

    bulk.insert(doc);
  }

  const results = await bulk.execute();
  console.log('results', results);
  */

  const bulk2 = Aliases.collection.initializeUnorderedBulkOp();
  for await (const alias of Aliases.find({
    domain: domain._id,
    id: { $exists: false }
  })
    .select('_id')
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    console.log('alias', alias);
    bulk2
      .find({
        _id: alias._id
      })
      .updateOne({ $set: { id: alias._id.toString() } });
  }

  const results2 = await bulk2.execute();

  console.log('results2', results2);

  process.exit(0);
})();
