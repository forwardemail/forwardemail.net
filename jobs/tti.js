/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const os = require('node:os');
const { Buffer } = require('node:buffer');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const falso = require('@ngneat/falso');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const prettyMilliseconds = require('pretty-ms');
const sharedConfig = require('@ladjs/shared-config');
const { dkimSign } = require('mailauth/lib/dkim/sign');
const { ImapFlow } = require('imapflow');
const { randomstring } = require('@sidoshi/random-string');
const _ = require('#helpers/lodash');

const config = require('#config');
const combineErrors = require('#helpers/combine-errors');
const createMtaStsCache = require('#helpers/create-mta-sts-cache');
const createSession = require('#helpers/create-session');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const getMessage = require('#helpers/get-message');
const logger = require('#helpers/logger');
const sendEmail = require('#helpers/send-email');
const setupMongoose = require('#helpers/setup-mongoose');
const TTI = require('#models/tti');

// Maximum reasonable TTI value (2 minutes)
// Values beyond this are capped to prevent chart spikes from anomalies
// const MAX_REASONABLE_TTI_MS = ms('2m');

//
// every 30s ensure that IMAP connection is established
// (this ensures that all providers are always connected)
//
setInterval(async () => {
  try {
    await Promise.all(
      config.imapConfigurations.map(async (provider) => {
        try {
          // https://github.com/postalsys/imapflow/blob/88e46d9bbcdc347d22df27bc591841431d8dc831/lib/imap-flow.js#L243-L247
          if (
            imapClients.has(provider.name) &&
            imapClients.get(provider.name).usable
          )
            return;

          imapClients.delete(provider.name);
          const imapClient = new ImapFlow(provider.config);
          await imapClient.connect();
          await imapClient.mailboxOpen('INBOX');
          imapClients.set(provider.name, imapClient);
        } catch (err) {
          err.provider = provider;
          err.isCodeBug = true;
          await logger.fatal(err);
        }
      })
    );
  } catch (err) {
    err.isCodeBug = true;
    await logger.fatal(err);
  }
}, ms('30s'));

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const cache = createMtaStsCache(client);
const resolver = createTangerine(client, logger);
const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

const imapClients = new Map();

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger,
  timeoutMs: ms('30s'),
  customHandlers: [
    async () => {
      if (imapClients.size === 0) return;
      await Promise.all(
        [...imapClients.values()].map(async (client) => {
          try {
            await client.logout();
          } catch (err) {
            err.client = client;
            err.isCodeBug = true;
            await logger.fatal(err);
          }
        })
      );
    }
  ]
});

graceful.listen();

//
// TODO: need to test across all SMTP servers
//       (then when we render on home page in _tti.pug it will be average across all)
//       and we can have a /tti page rendering full charts historically
//
(async () => {
  await setupMongoose(logger);
  await checkTTI();
})();

async function checkTTI() {
  try {
    // check existing (within past 5 mins don't run)
    const tti = await TTI.findOne().sort({ created_at: -1 }).lean();
    if (
      tti && // if created_at of existing tti was < 5 minutes ago
      // and if all had values <= 10s then return early

      tti.created_at.getTime() > Date.now() - ms('5m') &&
      tti.providers.every(
        (p) =>
          p.directMs !== 0 &&
          p.directMs <= 10000 &&
          p.forwardingMs !== 0 &&
          p.forwardingMs <= 10000
      )
    ) {
      setTimeout(
        () =>
          checkTTI()
            .then()
            .catch((err) => logger.fatal(err)),
        ms('1m')
      );
      return;
    }

    // check if there is an existing lock
    const lock = await client.get('tti_lock');
    if (lock) {
      setTimeout(
        () =>
          checkTTI()
            .then()
            .catch((err) => logger.fatal(err)),
        ms('1m')
      );
      return;
    }

    // set a lock that expires after 5 minutes
    await client.set('tti_lock', true, 'PX', ms('5m'));

    // get the data
    const providers = await Promise.all(
      config.imapConfigurations.map(async (provider) => {
        let directMs = 0;
        let forwardingMs = 0;
        let imapClient;
        try {
          // https://github.com/postalsys/imapflow/blob/88e46d9bbcdc347d22df27bc591841431d8dc831/lib/imap-flow.js#L243-L247
          if (
            imapClients.has(provider.name) &&
            imapClients.get(provider.name).usable
          ) {
            imapClient = imapClients.get(provider.name);
            // Verify connection is actually healthy with a NOOP
            try {
              await Promise.race([
                imapClient.noop(),
                new Promise((resolve, reject) => {
                  setTimeout(
                    () => reject(new Error('IMAP NOOP timeout')),
                    ms('5s')
                  );
                })
              ]);
            } catch (healthErr) {
              logger.warn('IMAP health check failed, reconnecting', {
                provider: provider.name,
                error: healthErr.message
              });
              imapClients.delete(provider.name);
              imapClient = null;
            }
          }

          if (!imapClient) {
            imapClients.delete(provider.name);
            imapClient = new ImapFlow({
              ...provider.config,
              socketTimeout: ms('1d') // long-lived IMAP connections
            });
            await imapClient.connect();
            await imapClient.mailboxOpen('INBOX');
            imapClients.set(provider.name, imapClient);
          }

          const results = await Promise.all(
            [provider.config.auth.user, provider.forwarder].map(
              async (to, i) => {
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
Subject: ${
                  i === 0 ? 'Direct' : 'Forward'
                }: ${falso.randEmoji()} ${falso.randCatchPhrase()}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 7bit

Hi there,

${falso.randParagraph()}

--
Thank you,
Forward Email

"${falso.randCatchPhrase()}"
`.trim();

                const envelope = {
                  from: config.supportEmail,
                  to
                };

                let info;

                let date = new Date();
                const newRaw = Buffer.from(
                  `Date: ${date.toUTCString().replace(/GMT/, '+0000')}\n${raw}`
                );

                const signResult = await dkimSign(newRaw, {
                  canonicalization: 'relaxed/relaxed',
                  algorithm: 'rsa-sha256',
                  signTime: new Date(),
                  signatureData: [config.signatureData]
                });

                if (signResult.errors.length > 0) {
                  const err = combineErrors(
                    signResult.errors.map((error) => error.err)
                  );
                  // we may want to remove cyclical reference
                  // for (const error of signResult.errors) {
                  //   delete error.err;
                  // }
                  err.signResult = signResult;
                  throw err;
                }

                const signatures = Buffer.from(signResult.signatures, 'utf8');

                try {
                  // Wrap sendEmail with timeout to prevent indefinite hanging
                  const sendPromise = sendEmail({
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
                    raw: Buffer.concat(
                      [signatures, newRaw],
                      signatures.length + newRaw.length
                    ),
                    localAddress: IP_ADDRESS,
                    localHostname: HOSTNAME,
                    resolver,
                    client
                  });
                  info = await Promise.race([
                    sendPromise,
                    new Promise((resolve, reject) => {
                      setTimeout(
                        () => reject(new Error('sendEmail timeout after 2m')),
                        ms('2m')
                      );
                    })
                  ]);
                  if (
                    Array.isArray(info.rejectedErrors) &&
                    info.rejectedErrors.length > 0
                  )
                    throw combineErrors(info.rejectedErrors);
                } catch (err) {
                  err.isCodeBug = true;
                  logger.error(err);
                  // TODO: this needs to retry from another server
                  // attempt to send email with our SMTP server
                  // (e.g. in case bree.forwardemail.net is blocked)
                  date = new Date();
                  // TODO: handle transporter cleanup
                  // TODO: handle mx socket close
                  const newRaw = Buffer.from(
                    `Date: ${date
                      .toUTCString()
                      .replace(/GMT/, '+0000')}\n${raw}`
                  );

                  const signResult = await dkimSign(newRaw, {
                    canonicalization: 'relaxed/relaxed',
                    algorithm: 'rsa-sha256',
                    signTime: new Date(),
                    signatureData: [config.signatureData]
                  });

                  if (signResult.errors.length > 0) {
                    const err = combineErrors(
                      signResult.errors.map((error) => error.err)
                    );
                    // we may want to remove cyclical reference
                    // for (const error of signResult.errors) {
                    //   delete error.err;
                    // }
                    err.signResult = signResult;
                    throw err;
                  }

                  const signatures = Buffer.from(signResult.signatures, 'utf8');
                  // Wrap fallback sendMail with timeout
                  const fallbackPromise = config.email.transport.sendMail({
                    envelope,
                    raw: Buffer.concat(
                      [signatures, newRaw],
                      signatures.length + newRaw.length
                    )
                  });
                  info = await Promise.race([
                    fallbackPromise,
                    new Promise((resolve, reject) => {
                      setTimeout(
                        () =>
                          reject(
                            new Error('fallback sendMail timeout after 2m')
                          ),
                        ms('2m')
                      );
                    })
                  ]);
                  if (
                    Array.isArray(info.rejectedErrors) &&
                    info.rejectedErrors.length > 0
                  )
                    throw combineErrors(info.rejectedErrors);
                }

                /*
            const date = new Date();
            const info = await config.email.transport.sendMail({
              envelope,
              raw: dkim.sign(`Date: ${date.toUTCString().replace(/GMT/, '+0000')}\n${raw}`)
            });
            if (Array.isArray(info.rejectedErrors) && info.rejectedErrors.length > 0)
              throw combineErrors(info.rejectedErrors);
            */

                // rewrite messageId since `raw` overrides this
                info.messageId = messageId;

                const { received, err } = await getMessage(
                  imapClient,
                  info,
                  provider
                );

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

                if (!_.isDate(received)) return 0;
                const ttiMs = received.getTime() - date.getTime();
                //
                // NOTE: not being used but keeping here for future reference
                //
                // Cap extreme values to prevent chart spikes
                //
                /*
                if (ttiMs > MAX_REASONABLE_TTI_MS) {
                  logger.warn('TTI value exceeded maximum threshold, capping', {
                    provider: provider.name,
                    type: i === 0 ? 'direct' : 'forwarding',
                    actualMs: ttiMs,
                    cappedMs: MAX_REASONABLE_TTI_MS
                  });
                  return MAX_REASONABLE_TTI_MS;
                }
                */

                return ttiMs;
              }
            )
          );
          directMs = results[0];
          forwardingMs = results[1];
        } catch (err) {
          err.provider = provider;
          err.isCodeBug = true;
          logger.fatal(err);
        }

        // delete all messages once done
        if (imapClient) {
          try {
            await imapClient.messageDelete({ all: true });
          } catch (err) {
            err.provider = provider;
            err.client = imapClient;
            err.isCodeBug = true;
            logger.fatal(err);
          }
        }

        return {
          name: provider.name,
          directMs,
          forwardingMs
        };
      })
    );

    // Save TTI data to MongoDB
    const ttiDocument = new TTI({
      providers
    });
    await ttiDocument.save();

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
            to: config.alertsEmail,
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
    err.isCodeBug = true;
    await logger.error(err);
  }

  // release lock if any
  try {
    await client.del('tti_lock');
  } catch (err) {
    logger.error(err);
  }

  setTimeout(
    () =>
      checkTTI()
        .then()
        .catch((err) => logger.fatal(err)),
    ms('1m')
  );
}
