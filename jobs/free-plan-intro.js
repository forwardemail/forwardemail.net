/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const isFQDN = require('is-fqdn');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');
const { boolean } = require('boolean');

const config = require('#config');
const email = require('#helpers/email');
const isEmail = require('#helpers/is-email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { hashEmail } = require('#helpers/unsubscribe');
const { Domains, EmailOptOuts, FreePlanIntros, Users } = require('#models');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  redisClients: [client],
  mongooses: [mongoose],
  logger
});

let isCancelled = false;

if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

//
// A free plan domain needs no account: its DNS records say where its mail
// goes, so most of the people who rely on it have never heard from us. Each
// address those records forward to is sent one email, once, about what the
// service includes (the MX servers queue them as mail arrives, see
// `queueFreePlanIntro` in helpers/get-forwarding-addresses.js).
//
// `config.freePlanIntroLimit` is how many are sent per run (hourly); zero,
// the default, sends none and queues none.
//
// Returns whether the email was sent.
//
async function mapper(member) {
  const [domain, addr] = member.split(' ');
  if (!isFQDN(domain) || !isEmail(addr)) return false;

  const denylisted = await client.mget(
    `denylist:${domain}`,
    `denylist:${addr}`
  );
  if (denylisted.some((value) => boolean(value))) return false;

  // (an address with an account, and a domain added to one, were sent the
  //  welcome and onboarding emails)
  if (await Users.exists({ email: addr })) return false;
  if (await Domains.exists({ name: domain })) return false;

  // (nor is an address that unsubscribed from our emails sent it)
  const hash = hashEmail(addr);
  if (await EmailOptOuts.exists({ hash, all: true })) return false;

  // claimed before it is sent, so two runs cannot both send it
  try {
    await FreePlanIntros.create({ hash });
  } catch (err) {
    if (err.code === 11000) return false;
    throw err;
  }

  try {
    await email({
      template: 'free-plan-intro',
      message: { to: addr },
      locals: { domain, locale: 'en' }
    });
  } catch (err) {
    // (not sent, so it is not kept from being sent later)
    try {
      await FreePlanIntros.deleteOne({ hash });
    } catch (_err) {
      logger.error(_err);
    }

    throw err;
  }

  return true;
}

(async () => {
  await setupMongoose(logger);

  try {
    const limit = config.freePlanIntroLimit;
    if (limit > 0) {
      //
      // Most of the queue is addresses that were sent it already (the MX
      // servers cannot tell), so it is read a batch at a time until the
      // limit is sent or the queue is empty.
      //
      let sent = 0;
      while (sent < limit) {
        if (isCancelled) break;
        const members = await client.spop(config.freePlanIntroQueue, 500);
        if (members.length === 0) break;
        for (const member of members) {
          if (isCancelled || sent >= limit) break;
          try {
            if (await mapper(member)) sent++;
          } catch (err) {
            logger.error(err);
          }
        }
      }

      // (the rest are queued again as their mail arrives, which keeps the
      //  queue no larger than an hour of mail)
      await client.unlink(config.freePlanIntroQueue);
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})().catch(async (err) => {
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
