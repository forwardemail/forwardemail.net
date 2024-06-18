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
const Redis = require('@ladjs/redis');
const _ = require('lodash');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const prettyMilliseconds = require('pretty-ms');
const safeStringify = require('safe-stable-stringify');
const sharedConfig = require('@ladjs/shared-config');
const { randomstring } = require('@sidoshi/random-string');

const config = require('#config');
const createMtaStsCache = require('#helpers/create-mta-sts-cache');
const createSession = require('#helpers/create-session');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const getMessage = require('#helpers/get-message');
const logger = require('#helpers/logger');
const sendEmail = require('#helpers/send-email');
const setupMongoose = require('#helpers/setup-mongoose');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const cache = createMtaStsCache(client);
const resolver = createTangerine(client, logger);
const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

//
// TODO: need to test across all SMTP servers
//       (then when we render on home page in _tti.pug it will be average across all)
//       and we can have a /tti page rendering full charts historically
//
(async () => {
  await setupMongoose(logger);
  // TODO: dashboard with chart for admin
  try {
    // check existing (within past 5 mins don't run)
    let tti = await client.get('tti');
    if (tti) {
      tti = JSON.parse(tti);
      tti.created_at = new Date(tti.created_at);
      // if created_at of existing tti was < 5 minutes ago
      // and if all had values <= 10s then return early
      if (
        tti.created_at.getTime() > Date.now() - ms('5m') &&
        tti.providers.every(
          (p) =>
            p.directMs !== 0 &&
            p.directMs <= 10000 &&
            p.forwardingMs !== 0 &&
            p.forwardingMs <= 10000
        )
      ) {
        if (parentPort) parentPort.postMessage('done');
        else process.exit(0);
        return;
      }
    }

    // check if there is an existing lock
    const lock = await client.get('tti_lock');
    if (lock) {
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    // set a lock that expires after 5 minutes
    await client.set('tti_lock', true, 'PX', ms('5m'));

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
Subject: test
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

test`.trim();

            const envelope = {
              from: config.supportEmail,
              to
            };

            let date;
            let info;

            try {
              date = new Date();
              info = await sendEmail({
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
              });
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

            /*
            const date = new Date();
            const info = await config.email.transport.sendMail({
              envelope,
              raw: `Date: ${date.toUTCString().replace(/GMT/, '+0000')}\n${raw}`
            });
            */

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

    // if some providers did not receive mail or
    // if some have >= 10s delay then email admins
    // (as long as we haven't in past 30m)
    if (
      providers.some(
        (p) =>
          p.directMs === 0 ||
          p.forwardingMs === 0 ||
          p.directMs >= 10000 ||
          p.forwardingMs >= 10000
      )
    ) {
      // ensure we haven't sent in past 30m
      const key = await client.get('tti_admin_email');
      if (!key) {
        // send an email to admins of the error
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: 'TTI Issue Detected'
          },
          locals: {
            message: `<ul class="mb-0"><li>${providers
              .map(
                (p) =>
                  `<strong>${p.name}:</strong> Direct (${
                    p.directMs === 0 ? 'N/A' : prettyMilliseconds(p.directMs)
                  }) &bull; Forwarding (${
                    p.forwardingMs === 0
                      ? 'N/A'
                      : prettyMilliseconds(p.forwardingMs)
                  })`
              )
              .join('</li><li>')}</li></ul>`
          }
        });
        // set email cache
        await client.set('tti_admin_email', true, 'PX', ms('30m'));
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  // release lock if any
  try {
    await client.del('tti_lock');
  } catch (err) {
    logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
