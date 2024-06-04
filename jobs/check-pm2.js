/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const os = require('node:os');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const ip = require('ip');
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const pm2 = require('pm2');
const prettyMs = require('pretty-ms');
const ms = require('ms');

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

(async () => {
  await setupMongoose(logger);

  try {
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
        pm2.list(async (err, list) => {
          if (err) return reject(err);
          if (list.length === 0)
            return reject(
              new TypeError(
                `PM2 list empty on ${os.hostname()} (${IP_ADDRESS})`
              )
            );

          // TODO: an improvement would be to read the `ecosystem-xyz.json` file to determine the processes necessary

          const bad = list.filter(
            (p) =>
              p.name !== 'pm2-logrotate' &&
              (p.pm2_env.status !== 'online' ||
                Date.now() - p.pm2_env.pm_uptime < ms('15m'))
          );

          if (bad.length > 0) {
            const subject = `PM2 on ${os.hostname()} (${IP_ADDRESS}) has ${
              bad.length
            }) bad process${bad.length > 1 ? 'es' : ''}`;
            const message = `<ul class="mb-0 text-left"><li>${bad
              .map(
                (p) =>
                  `${p.name} with status "${
                    p.pm2_env.status
                  }" and uptime of ${prettyMs(
                    Date.now() - p.pm2_env.pm_uptime
                  )}`
              )
              .join('</li><li>')}</li><ul>`;

            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject
              },
              locals: {
                message
              }
            });
          }

          pm2.disconnect((err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    });
  } catch (err) {
    await logger.error(err);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Check PM2 had an error'
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
