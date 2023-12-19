/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

// const os = require('node:os');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const _ = require('lodash');
// const dayjs = require('dayjs-with-plugins');
// const ip = require('ip');
const mongoose = require('mongoose');
const pMapSeries = require('p-map-series');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const { randomstring } = require('@sidoshi/random-string');

const config = require('#config');
// const createMtaStsCache = require('#helpers/create-mta-sts-cache');
// const createSession = require('#helpers/create-session');
// const createTangerine = require('#helpers/create-tangerine');
const getMessage = require('#helpers/get-message');
const logger = require('#helpers/logger');
// const sendEmail = require('#helpers/send-email');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
// const cache = createMtaStsCache(client);
// const resolver = createTangerine(client, logger);
// const HOSTNAME = os.hostname();
// const IP_ADDRESS = ip.address();

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
  try {
    // get the data
    const providers = await Promise.all(
      config.imapConfigurations.map(async (provider) => {
        const [directMs, forwardingMs] = await pMapSeries(
          [provider.config.auth.user, provider.forwarder],
          async (to) => {
            const messageId = `<${randomstring({
              characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
              length: 10
            })}@${config.supportEmail.split('@')[1]}>`;

            const raw = `
MIME-Version: 1.0
Content-Language: en-US
To: ${to}
From: ${config.supportEmail}
Message-ID: ${messageId}
Subject: ${messageId}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

${messageId}`.trim();

            const envelope = {
              from: config.supportEmail,
              to
            };

            /*
            let date = new Date();

            const options = {
              session: createSession({
                envelope: {
                  from: config.supportEmail,
                  to: [to]
                },
                headers: {}
              }),
              cache,
              target: to.split('@')[1],
              port: 25,
              envelope,
              raw: `Date: ${date
                .toUTCString()
                .replace(/GMT/, '+0000')}\n${raw}`,
              localAddress: IP_ADDRESS,
              localHostname: HOSTNAME,
              resolver,
              client
            };

            logger.debug('options', { options });

            let info;
            try {
              // TODO: until Apple removes Bree from blocklist
              if (provider.name === 'Apple iCloud') throw new Error('Try SMTP');
              info = await sendEmail(options);
            } catch (err) {
              logger.error(err);
              // attempt to send email with our SMTP server
              // (e.g. in case bree.forwardemail.net is blocked)
              date = new Date();
              info = await config.email.transport.sendMail({
                envelope,
                raw: `Date: ${date
                  .toUTCString()
                  .replace(/GMT/, '+0000')}\n${raw}`
              });
            }
            */

            const date = new Date();
            const info = await config.email.transport.sendMail({
              envelope,
              raw: `Date: ${date.toUTCString().replace(/GMT/, '+0000')}\n${raw}`
            });

            // rewrite messageId since `raw` overrides this
            info.messageId = messageId;

            const { received, err } = await getMessage(info, provider);

            if (err) {
              delete info.source;
              delete info.originalMessage;
              err.info = info;
              err.provider = {
                ...provider,
                config: {
                  ...provider.config,
                  auth: {
                    user: provider.config.auth.user
                    // this omits pass
                  }
                }
              };
              err.isCodeBug = true;
              await logger.fatal(err);
            }

            return _.isDate(received) ? received.getTime() - date.getTime() : 0;
          }
        );

        return {
          name: provider.name,
          directMs,
          forwardingMs
        };
      })
    );

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
