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
const pEvent = require('p-event');
const { parse } = require('fast-csv');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

// FILE_PATH=the file path to the CSV file
if (!isSANB(process.env.FILE_PATH)) throw new Error('FILE_PATH missing');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  const stat = await fs.promises.stat(process.env.FILE_PATH);
  if (!stat.isFile()) throw new Error(`${process.env.FILE_PATH} is not a file`);

  if (!process.env.WRITE_PATH || !process.env.WRITE_PATH.endsWith('.txt'))
    throw new Error('Write path missing (must end in ".txt")');

  try {
    const stat2 = await fs.promises.stat(process.env.WRITE_PATH);
    if (stat2.isFile())
      throw new Error('Write path exists, please delete it first');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  const stream = fs.createReadStream(process.env.FILE_PATH);
  const writeStream = fs.createWriteStream(process.env.WRITE_PATH);

  await pEvent(writeStream, 'open');

  const REGEX = /forwardemail\.net/i;

  // TODO: instead of doing this we can simply use ripgrep
  //       `rg 'forwardemail' -i ~/Desktop/mxrecords.csv > ~/Desktop/mx.csv`
  stream
    .pipe(parse({ delimiter: ';' }))
    .on('error', console.error)
    .on('data', (row) => {
      const [domain, exchanges] = row;
      // write to a new file stream the domain name
      if (REGEX.test(exchanges)) {
        console.log('domain matched', domain);
        writeStream.write(`${domain}\n`);
      }
    });

  await pEvent(stream, 'end');

  //
  // TODO: open the file that was created and read each line
  // perform DNS lookup on the domain name and create a mapping
  // (if it is `forward-email=` then perform lookup on email addresses)
  // (and create a mapping of email address -> [ array, of, domain, names, ... ]
  //
  // TODO: the "Date" header should be set in the future and spread out over a range
  //       (e.g. 1000 emails a day every day until the entire list is sent towards)
  //       (and we should keep track of the emails sent in a new file `emails.csv` with Email ID - that way we don't send duplicates)
  //
  // TODO: create an account for them automatically and email them their username and password
  //       (import all of their domains too as domains added to the free plan -> which will put them in a drip campaign)
  //       (their account will get auto-deleted in 30 days if they don't verify their email address)
  //
  // TODO: one-click link to create and one-click link to delete
  //
  // TODO: magic link to login on our login form
  //

  process.exit(0);
})();
