/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const os = require('node:os');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const pMap = require('p-map');
const shortID = require('mongodb-short-id');
const sharedConfig = require('@ladjs/shared-config');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const config = require('#config');
const email = require('#helpers/email');
const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains, Aliases } = require('#models');
const { encrypt } = require('#helpers/encrypt-decrypt');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const concurrency = os.cpus().length;

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
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

function getEmailOptions(alias, to) {
  //
  // generate a link for verification
  // (uses cipher of domain.id + '/' + to)
  //
  const fromEmail = `${alias.name}@${alias.domain.name}`;
  const options = {
    template: 'recipient-verification',
    message: {
      to
    },
    locals: {
      fromEmail,
      toEmail: to,
      link: `${config.urls.web}/v/${encrypt(
        shortID.longToShort(alias.id) + '|' + to
      )}`
    }
  };

  //
  // allow template customization if admins allowed this domain to have such
  //
  if (alias.domain.has_custom_verification) {
    // name and email
    if (
      alias.domain.custom_verification.name &&
      !alias.domain.custom_verification.email
    )
      options.message.from = `${alias.domain.custom_verification.name} <${env.EMAIL_DEFAULT_FROM_EMAIL}>`;
    else if (
      alias.domain.custom_verification.name &&
      alias.domain.custom_verification.email
    )
      options.message.from = `${alias.domain.custom_verification.name} <${alias.domain.custom_verification.email}>`;
    else if (alias.domain.custom_verification.email)
      options.message.from = alias.domain.custom_verification.email;

    // subject
    if (alias.domain.custom_verification.subject)
      options.message.subject = alias.domain.custom_verification.subject;

    //
    // html and text (with interpolation)
    // (rewrite `VERIFICATION_LINK` with `locals.link`)
    // (rewrite `FROM_EMAIL` with `fromEmail`)
    // (rewrite `TO_EMAIL` with `to`)
    //
    if (alias.domain.custom_verification.html)
      options.message.html = alias.domain.custom_verification.html
        .replace(/VERIFICATION_LINK/g, options.locals.link)
        .replace(/FROM_EMAIL/g, fromEmail)
        .replace(/TO_EMAIL/g, to);
    if (alias.domain.custom_verification.text)
      options.message.text = alias.domain.custom_verification.text
        .replace(/VERIFICATION_LINK/g, options.locals.link)
        .replace(/FROM_EMAIL/g, fromEmail)
        .replace(/TO_EMAIL/g, to);
  }

  return options;
}

async function sendEmail(alias, to) {
  try {
    logger.info('sending email', { alias, to });
    await email(getEmailOptions(alias, to));
    return to;
  } catch (err) {
    logger.error(err);
  }
}

async function mapper(alias) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    if (!alias.domain || !alias.domain.id)
      throw new Error('Alias domain did not exist');

    let pendingRecipients = await pMap(
      alias.emails,
      (to) => sendEmail(alias, to),
      {
        concurrency
      }
    );

    // remove null values
    pendingRecipients = _.compact(pendingRecipients);

    // store that we sent this email
    if (pendingRecipients.length > 0)
      await Aliases.findByIdAndUpdate(alias._id, {
        $addToSet: {
          pending_recipients: {
            $each: pendingRecipients
          }
        }
      });

    return pendingRecipients;
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    //
    // find all aliases that haven't been sent verification emails yet
    // also don't send emails to users that are banned
    // and don't send emails for non-paid plans just in case
    //

    logger.info('starting recipient verification emails');

    const bannedUserIdSet = await Users.getBannedUserIdSet(client);

    const paidDomainIds = await Domains.distinct('_id', {
      plan: { $in: ['enhanced_protection', 'team'] },
      has_mx_record: true,
      has_txt_record: true
    });

    let aliases = await Aliases.aggregate([
      {
        $match: {
          has_recipient_verification: true,
          domain: { $in: paidDomainIds }
        }
      },
      {
        $project: {
          id: 1,
          user: 1,
          domain: 1,
          name: 1,
          recipients: 1,
          verified_and_pending: {
            $setUnion: ['$verified_recipients', '$pending_recipients']
          }
        }
      },
      {
        $lookup: {
          from: 'domains',
          as: 'domain',
          let: { domain_id: '$domain' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$domain_id'] } } },
            {
              $project: {
                id: 1,
                name: 1,
                has_custom_verification: 1,
                custom_verification: 1
              }
            }
          ]
        }
      },
      {
        $unwind: '$domain'
      },
      {
        $project: {
          id: 1,
          user: 1,
          name: 1,
          domain: 1,
          emails: { $setDifference: ['$recipients', '$verified_and_pending'] }
        }
      },
      {
        $match: { $expr: { $gt: [{ $size: '$emails' }, 0] } }
      }
    ]).option({
      maxTimeMS: 60000
    });

    if (aliases.length > 0) {
      aliases = aliases.filter((alias) => {
        return alias.user && !bannedUserIdSet.has(alias.user.toString());
      });

      if (aliases.length > 0) {
        const pendingRecipients = await pMap(aliases, mapper, { concurrency });
        logger.info('finished recipient verification emails', {
          pendingRecipients: pendingRecipients.flat()
        });
      }
    }
  } catch (err) {
    err.isCodeBug = true;
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
