/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const RE2 = require('re2');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const regexParser = require('regex-parser');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const REGEX_FLAG_ENDINGS = ['/gi', '/ig', '/g', '/i', '/'];

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
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

/**
 * Validates a regex alias name and returns the error if invalid
 * @param {string} aliasName - The alias name to validate
 * @returns {Error|null} - Returns the error if invalid, null if valid
 */
function validateRegexAlias(aliasName) {
  if (!aliasName || !aliasName.startsWith('/')) return null;

  const hasTwoSlashes = aliasName.lastIndexOf('/') !== aliasName.indexOf('/');
  if (!hasTwoSlashes) return null;

  // find the regex flag ending
  let lastIndex;
  for (const ending of REGEX_FLAG_ENDINGS) {
    if (
      aliasName.lastIndexOf(ending) !== -1 &&
      aliasName.lastIndexOf(ending) !== 0
    ) {
      lastIndex = ending;
      break;
    }
  }

  if (!lastIndex) return null;

  let parsedRegex = aliasName.slice(
    0,
    Math.max(0, aliasName.lastIndexOf(lastIndex) + 1)
  );

  // add case insensitive flag since email addresses are case insensitive
  if (lastIndex === '/g' || lastIndex === '/') parsedRegex += 'i';

  try {
    // eslint-disable-next-line no-new
    new RE2(regexParser(parsedRegex));
    return null;
  } catch (err) {
    err.parsedRegex = parsedRegex;
    return err;
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    logger.info('Starting invalid regex aliases check job');

    let processedCount = 0;
    let invalidCount = 0;
    let emailsSent = 0;

    // get banned user ids to exclude
    const bannedUserIds = await Users.getBannedUserIdSet(client);

    // use cursor to iterate through all regex aliases
    for await (const alias of Aliases.find({
      name: { $regex: /^\// },
      user: { $nin: [...bannedUserIds] }
    })
      .populate('domain', 'name id members plan')
      .populate(
        'user',
        `email ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail}`
      )
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      // return early if the job was already cancelled
      if (isCancelled) break;

      processedCount++;

      // skip if domain doesn't exist or is on free plan
      if (!alias.domain || alias.domain.plan === 'free') continue;

      // validate the regex
      const err = validateRegexAlias(alias.name);
      if (!err) continue;

      invalidCount++;

      // check redis cache to see if we already sent an email for this alias this month
      // use same cache key as get-forwarding-addresses.js so they share the cache
      const cacheKey = `invalid_regex_alias:${alias.id}`;
      const cache = await client.get(cacheKey);
      if (cache) {
        logger.debug('Skipping email for alias (already sent this month)', {
          aliasId: alias.id,
          aliasName: alias.name
        });
        continue;
      }

      try {
        // get domain admins
        const obj = await Domains.getToAndMajorityLocaleByDomain(alias.domain);
        const to = [...obj.to];

        // add alias owner if different from admins
        if (
          alias?.user?.email &&
          alias.user[config.userFields.hasVerifiedEmail] &&
          !alias.user[config.userFields.isBanned] &&
          !to.includes(alias.user.email)
        ) {
          to.push(alias.user.email);
        }

        const subject = i18n.translate(
          'INVALID_REGEX_ALIAS_SUBJECT',
          obj.locale,
          alias.domain.name
        );
        const message = i18n.translate(
          'INVALID_REGEX_ALIAS_MESSAGE',
          obj.locale,
          alias.domain.name,
          alias.name,
          err.parsedRegex,
          err.message
        );

        await emailHelper({
          template: 'alert',
          message: {
            to,
            bcc: config.alertsEmail,
            subject
          },
          locals: {
            message,
            locale: obj.locale
          }
        });

        // cache for 30 days to prevent repeated emails
        await client.set(cacheKey, true, 'PX', ms('30d'));
        emailsSent++;

        logger.info('Sent invalid regex notification', {
          aliasId: alias.id,
          aliasName: alias.name,
          domainName: alias.domain.name,
          recipients: to
        });
      } catch (emailErr) {
        logger.error(emailErr, { aliasId: alias.id, aliasName: alias.name });
      }
    }

    logger.info('Completed invalid regex aliases check job', {
      processedCount,
      invalidCount,
      emailsSent
    });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
