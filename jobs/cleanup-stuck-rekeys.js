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
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const { releaseRekeyLock } = require('#helpers/rekey-lock');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

const REKEY_STALE_THRESHOLD = ms('15m');

(async () => {
  await setupMongoose(logger);

  try {
    const threshold = new Date(Date.now() - REKEY_STALE_THRESHOLD);

    // Find aliases stuck in rekey state
    const stuckAliases = await Aliases.find({
      is_rekey: true,
      // A live SQLite worker claims its job before touching the database.
      // Do not roll back a slow but active rekey from this periodic job.
      rekey_processing: { $ne: true },
      $or: [
        { rekey_started_at: { $lt: threshold } },
        // Handle legacy aliases without rekey_started_at (pre-migration)
        { rekey_started_at: { $exists: false } }
      ]
    })
      .select('name domain user rekey_started_at +rekey_id')
      .populate('domain', 'name')
      .populate('user', 'email locale')
      .lean()
      .exec();

    if (stuckAliases.length === 0) {
      logger.info('No stuck rekey operations found');
    } else {
      logger.warn(`Found ${stuckAliases.length} stuck rekey operations`);

      for (const alias of stuckAliases) {
        try {
          // The live SQLite database still uses its old password after an
          // interrupted rekey. Restore the persisted token snapshot atomically
          // before making the alias available for authentication again.
          await Aliases.findOneAndUpdate(
            {
              _id: alias._id,
              is_rekey: true,
              rekey_processing: { $ne: true }
            },
            [
              {
                $set: {
                  is_rekey: false,
                  tokens: {
                    $ifNull: ['$rekey_previous_tokens', '$tokens']
                  }
                }
              },
              {
                $unset: [
                  'rekey_started_at',
                  'rekey_previous_tokens',
                  'rekey_id',
                  'rekey_processing'
                ]
              }
            ]
          );

          await releaseRekeyLock(client, alias._id, alias.rekey_id).catch(
            (releaseErr) =>
              logger.error('Failed to release rekey lock', {
                err: releaseErr,
                alias_id: alias._id
              })
          );

          const ownerEmail = alias.user?.email;
          const locale = alias.user?.locale || i18n.config.defaultLocale;
          const domainName = alias.domain?.name || 'unknown';
          const username = `${alias.name}@${domainName}`;

          if (ownerEmail) {
            await email({
              template: 'alert',
              message: {
                to: ownerEmail,
                cc: config.alertsEmail,
                subject: i18n.translate(
                  'ALIAS_REKEY_INTERRUPTED_SUBJECT',
                  locale,
                  username
                )
              },
              locals: {
                message: i18n.translate(
                  'ALIAS_REKEY_INTERRUPTED',
                  locale,
                  username
                ),
                locale
              }
            });
          }

          logger.info('Cleared stuck rekey', {
            alias_id: alias._id,
            alias_name: username,
            rekey_started_at: alias.rekey_started_at
          });
        } catch (err) {
          logger.error('Failed to clear stuck rekey', {
            err,
            alias_id: alias._id
          });
        }
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
