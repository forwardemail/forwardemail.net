/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const email = require('#helpers/email');
const getMessage = require('#helpers/get-message');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  // TODO: dashboard with chart for admin
  // TODO: email alert for admin
  // TODO: this job needs to run from each MX server and each SMTP server
  // TODO: test forwarding via TTI_FORWARDING_ADDRESS
  //       (ensure alias exists as tti@forwardemail.net and recipients is set to the array of imap config recipients)
  try {
    // get the data
    const providers = await Promise.all(
      config.imapConfigurations.map(async (provider) => {
        const [directMs, forwardingMs] = await Promise.all([
          //
          // direct
          //
          (async () => {
            const date = new Date();
            const subject = `Direct ${dayjs(date).format(
              'M/D/YY h:mm A z'
            )} (${date.getTime()})`;

            const info = await email({
              template: 'alert',
              message: {
                to: provider.config.auth.user,
                subject,
                date
              },
              locals: {
                message: subject
              }
            });

            const message = await getMessage(info, provider);
            return message.received
              ? message.received.getTime() - date.getTime()
              : 0;
          })(),
          //
          // forwarding
          //
          (async () => {
            const date = new Date();
            const subject = `Forwarder ${dayjs(date).format(
              'M/D/YY h:mm A z'
            )} (${date.getTime()})`;

            const info = await email({
              template: 'alert',
              message: {
                to: provider.forwarder,
                subject,
                date
              },
              locals: {
                message: subject
              }
            });

            const { message, err } = await getMessage(info, provider);

            if (err) {
              err.info = info;
              err.provider = provider;
              err.isCodeBug = true;
              await logger.fatal(err);
            }

            return _.isDate(message?.received)
              ? message.received.getTime() - date.getTime()
              : 0;
          })()
        ]);

        return {
          name: provider.name,
          directMs,
          forwardingMs
        };
      })
    );

    // result.message.received.getTime() - now.getTime()) / 1000
    console.log('providers', providers);

    await client.set(
      'tti',
      safeStringify({
        created_at: new Date(),
        providers
      })
    );
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
