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
const ip = require('ip');
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const pm2 = require('pm2');
const prettyMilliseconds = require('pretty-ms');
const ms = require('ms');
const safeStringify = require('fast-safe-stringify');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const IP_ADDRESS = ip.address();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// Lock file to prevent concurrent executions
const LOCK_FILE = path.join(os.tmpdir(), 'check-pm2.lock');

(async () => {
  let lockAcquired = false;
  let pm2Connected = false;

  try {
    // Try to acquire lock
    try {
      // Check if lock file exists and is stale (older than 30 minutes)
      if (fs.existsSync(LOCK_FILE)) {
        const stats = fs.statSync(LOCK_FILE);
        const lockAge = Date.now() - stats.mtimeMs;
        if (lockAge > ms('30m')) {
          // Lock is stale, remove it
          fs.unlinkSync(LOCK_FILE);
          await logger.warn(
            `Removed stale lock file (age: ${prettyMilliseconds(lockAge)})`
          );
        } else {
          // Lock is held by another process
          await logger.info(
            'Another instance is already running, exiting gracefully'
          );
          return;
        }
      }

      // Create lock file with exclusive flag
      fs.writeFileSync(LOCK_FILE, process.pid.toString(), { flag: 'wx' });
      lockAcquired = true;
    } catch (err) {
      if (err.code === 'EEXIST') {
        await logger.info(
          'Another instance is already running, exiting gracefully'
        );
        return;
      }

      throw err;
    }

    await setupMongoose(logger);

    //
    // NOTE: send an email if any pm2 process is not online
    // (this currently runs every 20 minutes via ansible cron config)
    // (and checks to ensure that processes have been running for >= 15 minutes)
    //
    // <https://github.com/Unitech/pm2/issues/5837>
    //
    await new Promise((resolve, reject) => {
      pm2.connect((err) => {
        if (err) return reject(err);
        pm2Connected = true;

        pm2.list(async (err, list) => {
          if (err) return reject(err);
          if (list.length === 0)
            return reject(
              new TypeError(
                `PM2 list empty on ${os.hostname()} (${IP_ADDRESS})`
              )
            );

          const bad = [];
          const reload = [];

          for (const p of list) {
            if (p.name === 'pm2-logrotate') continue;

            // TODO: an improvement would be to read the `ecosystem-xyz.json` file to determine the processes necessary
            if (
              p.pm2_env.status !== 'online' ||
              Date.now() - p.pm2_env.pm_uptime < ms('15m')
            )
              bad.push(p);

            // if any have "errored" status then attempt to reload them
            if (['stopped', 'errored'].includes(p.pm2_env.status))
              reload.push(p);
          }

          if (reload.length > 0) {
            for (const p of reload) {
              await new Promise((resolve, reject) => {
                pm2.reload(p.name, (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              });

              // reloaded process message
              const subject = `PM2 reloaded ${
                p.name
              } on ${os.hostname()} (${IP_ADDRESS})`;

              await emailHelper({
                template: 'alert',
                message: {
                  to: config.alertsEmail,
                  subject
                },
                locals: {
                  message: subject
                }
              });
            }
          }

          if (bad.length > 0) {
            const subject = `PM2 on ${os.hostname()} (${IP_ADDRESS}) has ${
              bad.length
            } bad process${bad.length > 1 ? 'es' : ''}`;
            const message = `<ul class="mb-0 text-left"><li>${bad
              .map(
                (p) =>
                  `${p.name} with status "${
                    p.pm2_env.status
                  }" and uptime of ${prettyMilliseconds(
                    Date.now() - p.pm2_env.pm_uptime
                  )}`
              )
              .join('</li><li>')}</li><ul>`;

            await emailHelper({
              template: 'alert',
              message: {
                to: config.alertsEmail,
                subject
              },
              locals: {
                message
              }
            });
          }

          resolve();
        });
      });
    });
  } catch (err) {
    await logger.error(err);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Check PM2 had an error'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  } finally {
    // Always disconnect PM2 if connected
    if (pm2Connected) {
      await new Promise((resolve) => {
        pm2.disconnect(() => resolve());
      });
    }

    // Close mongoose connection before exiting
    await mongoose.connection.close();

    // Remove lock file
    if (lockAcquired) {
      try {
        fs.unlinkSync(LOCK_FILE);
      } catch (err) {
        // Ignore errors when removing lock file
        await logger.warn(`Failed to remove lock file: ${err.message}`);
      }
    }
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
