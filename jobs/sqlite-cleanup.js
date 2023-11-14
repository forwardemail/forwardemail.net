/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') {
      isCancelled = true;
    }
  });

graceful.listen();

//
// find all files that end with:
// - `-backup.sqlite`
// - `-backup-wal.sqlite`
// - `-backup-shm.sqlite`
//
//
const AFFIXES = ['-backup', '-backup-wal', '-backup-shm'];

(async () => {
  await setupMongoose(logger);

  try {
    if (isCancelled) return;

    const dirents = await fs.promises.readdir('/mnt', {
      withFileTypes: true
    });

    const filePaths = [];

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;
      // eslint-disable-next-line no-await-in-loop
      const files = await fs.promises.readdir(path.join('/mnt', dirent.name), {
        withFileTypes: true
      });
      for (const file of files) {
        if (!file.isFile()) continue;
        if (path.extname(file.name) !== '.sqlite') continue;
        const basename = path.basename(file.name, path.extname(file.name));
        for (const affix of AFFIXES) {
          if (!basename.endsWith(affix)) continue;
          const filePath = path.join('/mnt', dirent.name, file.name);
          // eslint-disable-next-line no-await-in-loop
          const stat = await fs.promises.stat(filePath);
          if (!stat.isFile()) continue; // safeguard
          // delete any backups that are 4h+ old
          if (stat.mtimeMs && stat.mtimeMs <= Date.now() - ms('4h')) {
            // eslint-disable-next-line no-await-in-loop
            await fs.promises.unlink(filePath);
            filePaths.push(filePath);
          }

          break;
        }
      }
    }

    // email admins of any old files cleaned up
    if (filePaths.length > 0)
      await emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `SQLite cleanup successfully removed (${filePaths.length}) stale backups`
        },
        locals: {
          message: `<ul><li><code class="small">${filePaths.join(
            '</code></li><li><code class="small">'
          )}</code></li></ul>`
        }
      });
  } catch (err) {
    await logger.error(err);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'SQLite cleanup had an error'
      },
      locals: {
        message: `<pre><code>${JSON.stringify(
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
