/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const bytes = require('@forwardemail/bytes');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { getDirSize } = require('fast-dir-size');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const IP_ADDRESS = ip.address();
const TMP_DIR = os.tmpdir();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // send an email if tmpdir file size is more than 5 GB
    //
    const size = await getDirSize(TMP_DIR);
    if (size >= bytes('5GB')) {
      const subject = `${TMP_DIR} on ${os.hostname()} (${IP_ADDRESS}) is ${bytes(
        size
      )}`;
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject
        },
        locals: {
          message: subject
        }
      })
        .then()
        .catch((err) => logger.error(err));
    }

    const dirents = await fs.promises.readdir(TMP_DIR, {
      withFileTypes: true
    });

    for (const file of dirents) {
      //
      // if it was not HTML and not a puppeteer dir then return early
      //
      // <https://github.com/jef/streetmerchant/issues/378>
      // <https://jakeroid.com/blog/puppeteer-doesn-t-remove-files-from-temp-directory>
      // Pattern is: /^puppeteer_dev_chrome_profile/
      // and also: /^.org.chromium.Chromium/
      //
      // note that the HTML files are cleaned up from rendering for email-templates
      //
      if (
        path.extname(file.name) !== '.html' &&
        path.extname(file.name) !== '.heapsnapshot' &&
        !file.name.startsWith('puppeteer_dev_chrome_profile') &&
        !file.name.startsWith('.org.chromium.Chromium') &&
        !file.name.startsWith('.com.google.chrome.for.testing')
      )
        continue;

      const filePath = path.join(TMP_DIR, file.name);

      try {
        const stat = await fs.promises.stat(filePath);

        // delete if file/folder is 1d+ old
        if (stat.mtimeMs && stat.mtimeMs <= Date.now() - ms('1d')) {
          await fs.promises.rm(filePath, {
            force: true,
            recursive: true
          });

          logger.info('removed file', filePath);
        }
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }
    }
  } catch (err) {
    await logger.error(err);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Cleanup tmp had an error'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
