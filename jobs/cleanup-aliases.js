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
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const mongoose = require('mongoose');
const config = require('#config');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Aliases, Users, Domains } = require('#models');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const concurrency = Math.round(os.cpus().length * 2);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

async function mapper(alias) {
  // allows us to recursively call mapper()
  if (typeof alias !== 'object' || typeof alias.save !== 'function') {
    alias = await Aliases.findById(alias);
  }

  if (!alias) {
    console.error('Alias does not exist');
    return;
  }

  // force EN for locale
  alias.locale = i18n.config.defaultLocale;

  try {
    await alias.save();
  } catch (err) {
    if (
      err.has_exceeded_unique_count ||
      err.is_reserved_word ||
      err.is_max_alias_count
    ) {
      // if it's a global domain then ban the user
      const domain = await Domains.findById(alias.domain);
      if (!domain) throw new Error('Domain does not exist');
      if (domain.is_global) {
        const user = await Users.findById(alias.user);
        if (!user) throw new Error('User does not exist');
        // if the user not on a paid plan then ban them
        if (user.plan === 'free') {
          logger.info(
            '!!! BANNING !!!',
            'user.email',
            user.email,
            'err',
            err.message,
            'alias',
            alias.name,
            'domain',
            domain.name
          );
          user[config.userFields.isBanned] = true;
          await user.save();
        }

        /*
          // NOTE: don't remove for paying customers
          logger.info(
            '~~~ WE SHOULD REMOVE ALIAS ~~~',
            'user.email',
            user.email,
            'user.plan',
            user.plan,
            'err',
            err.message,
            'alias',
            alias.name,
            'domain',
            domain.name
          );
          // TODO: await alias.remove();
          */
      } else {
        // else we need to trim the recipients past max count
        // and we can use exceeded by count
        logger.info(
          'trimming aliases past max count',
          alias.recipients,
          'alias.name',
          alias.name,
          'domain.name',
          domain.name
        );

        for (let i = 1; i <= err.exceeded_by_count; i++) {
          alias.recipients.pop();
        }

        await mapper(alias);
      }
      // if alias name was invalid and they were on global
    } else if (
      err.message === 'Alias name was invalid.' ||
      err.message ===
        'Alias that is a catch-all must be enabled or deleted entirely to be disabled.' ||
      err.message === 'Alias already exists for domain.'
    ) {
      const domain = await Domains.findById(alias.domain);
      if (!domain) throw new Error('Domain does not exist');
      if (domain.is_global) {
        logger.info(
          'need to remove alias b/c was global',
          'alias',
          alias.name,
          'domain',
          domain.name
        );
        await alias.remove();
      } else {
        switch (err.message) {
          case 'Alias that is a catch-all must be enabled or deleted entirely to be disabled.': {
            // remove alias because it was disabled by user
            await alias.remove();

            break;
          }

          case 'Alias already exists for domain.': {
            // find the other aliases that are similar
            const others = await Aliases.find({
              _id: {
                $ne: alias._id
              },
              name: alias.name,
              domain: domain._id
            });

            if (others.length === 0)
              throw new Error('Other alias did not exist');
            // merge the recipients together

            for (const other of others) {
              alias.recipients.push(...other.recipients);
              alias.verified_recipients.push(...other.verified_recipients);
              alias.pending_recipients.push(...other.pending_recipients);
            }

            // remove existing
            await Aliases.deleteMany({
              _id: { $in: others.map((other) => other._id) }
            });

            // re-enable it just in case
            alias.is_enabled = true;

            // save the existing
            await mapper(alias);

            logger.info('MERGED ALIASES', alias, 'others', others);
            break;
          }

          case 'Alias name was invalid.': {
            // this assumes "+" symbol was the culprit
            // (e.g. someone made an alias with "+" in the username portion before we had a chance to patch that)
            alias.name = alias.name.split('+')[0];
            await mapper(alias);

            break;
          }

          default: {
            throw err;
          }
        }
      }
    } else if (
      err.message ===
        'User must be a domain admin to create a catch-all alias.' ||
      err.message ===
        'User must be a domain admin to create an alias with a reserved word (see the page on <a target="_blank" rel="noopener noreferrer" class="font-weight-bold" href="%s/reserved-email-addresses">Reserved Email Addresses</a>).'
    ) {
      const domain = await Domains.findById(alias.domain);
      if (!domain) throw new Error('Domain does not exist');
      if (domain.is_global)
        throw new Error('Cannot re-assign on global domain');
      // otherwise find the first admin
      const adminMember = domain.members.find((m) => m.group === 'admin');
      if (!adminMember)
        throw new Error('No admin members available for re-assignment');
      logger.info('Reassigning alias', alias, 'to admin member', adminMember);
      alias.user = adminMember.user;
      await mapper(alias);
    } else if (
      err.message !== 'Paid plan is required for recipient verification'
    ) {
      const user = await Users.findById(alias.user);
      if (!user[config.userFields.isBanned])
        logger.info('UNHANDLED ERROR', err);
    }
  }
}

(async () => {
  await setupMongoose(logger);

  logger.info('starting lowercase job');

  // TODO: this would need optimized in the future if we ran it
  try {
    const bannedUserIds = await Users.getBannedUserIdSet(client);
    const ids = await Aliases.distinct('_id', {
      user: { $nin: [...bannedUserIds] }
    });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
