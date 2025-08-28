/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const monitorServer = require('#helpers/monitor-server');
const setupMongoose = require('#helpers/setup-mongoose');
const updateStorageUsed = require('#helpers/update-storage-used');

monitorServer();

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const subscriber = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);
subscriber.setMaxListeners(0);

const tmpdir = os.tmpdir();

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client, subscriber],
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
    if (message === 'cancel') {
      isCancelled = true;
    }
  });

graceful.listen();

const mountDir = config.env === 'production' ? '/mnt' : tmpdir;

(async () => {
  await setupMongoose(logger);

  subscriber.subscribe('sqlite_auth_response');

  //
  // TODO: delete aliases that no longer exist in R2
  //       - 605249d9559c394835521bbe.sqlite.gz
  //       - 605249d9559c394835521bbe.sqlite
  //
  // TODO: delete aliases that no longer exist in SQLite
  //

  try {
    if (isCancelled) return;

    const dirents = await fs.promises.readdir(mountDir, {
      withFileTypes: true
    });

    const ids = new Set();
    const filePaths = [];

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;

      const files = await fs.promises.readdir(
        path.join(mountDir, dirent.name),
        {
          withFileTypes: true
        }
      );
      for (const file of files) {
        if (!file.isFile()) continue;
        if (path.extname(file.name) !== '.sqlite') continue;
        const basename = path.basename(file.name, path.extname(file.name));

        // TODO: automated job to detect files on block storage
        //       and R2 that don't correspond to actual aliases (e.g. is_banned and/or is_removed)

        if (!basename.endsWith('-backup')) {
          ids.add(basename.replace('-tmp', ''));
          continue;
        }

        // if basename does not include ":" it's a safeguard
        // (since all backups are in "x:y-backup.sqlite" format)
        if (!basename.includes(':')) continue;

        const filePath = path.join(mountDir, dirent.name, file.name);
        try {
          const stat = await fs.promises.stat(filePath);
          if (!stat.isFile()) continue; // safeguard
          // delete any backups that are 4h+ old
          if (stat.mtimeMs && stat.mtimeMs <= Date.now() - ms('4h')) {
            await fs.promises.rm(filePath, {
              force: true,
              recursive: true
            });
            filePaths.push(filePath);
          }
        } catch (err) {
          logger.warn(err);
        }
      }
    }

    // email admins of any old files cleaned up
    if (filePaths.length > 0)
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `SQLite cleanup successfully removed (${filePaths.length}) stale backups`
        },
        locals: {
          message: `<ul><li><code class="small">${filePaths.join(
            '</code></li><li><code class="small">'
          )}</code></li></ul>`
        }
      })
        .then()
        .catch((err) => logger.error(err));

    // go through ids and find any
    // that were banned or removed
    if (ids.size > 0) {
      const badIds = await Aliases.distinct('id', {
        $or: [
          {
            id: { $in: [...ids] },
            [config.userFields.isBanned]: true
          },
          {
            id: { $in: [...ids] },
            [config.userFields.isRemoved]: true
          }
        ]
      });
      // email admins (manually remove for now, may automate this in near future once certain)
      if (badIds.length > 0) {
        emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: 'SQLite banned/removed aliases detected'
          },
          locals: {
            message: `<ul><li><code class="small">${badIds.join(
              '</code></li><li><code class="small">'
            )}</code></li></ul>`
          }
        })
          .then()
          .catch((err) => logger.error(err));
      }

      // go through all ids filtered out from bad ones and update storage
      for (const badId of badIds) {
        ids.delete(badId);
      }

      // now iterate through all ids and update their sizes and send (or unset) quota alerts
      await pMapSeries(ids, async (id) => {
        logger.debug('cleanup', { id });

        // ensure ID is hex string
        if (!mongoose.isObjectIdOrHexString(id)) return;

        // ensure alias still exists
        let alias = await Aliases.findOne({ id });

        if (!alias) {
          logger.debug('alias no longer exists', { id });
          return;
        }

        try {
          // update storage
          try {
            await updateStorageUsed(id, client);
          } catch (err) {
            logger.fatal(err, { id });
          }

          // get total storage used for an alias (includes across all relevant domains/aliases)
          alias = await Aliases.findOne({ id });

          if (!alias) {
            logger.debug('alias no longer exists', { id });
            return;
          }

          // if the alias did not have imap or it was not enabled
          // then we can return early since the check is not useful
          if (!alias.has_imap || !alias.is_enabled) return;

          const [storageUsed, maxQuotaPerAlias] = await Promise.all([
            Aliases.getStorageUsed(alias),
            Domains.getMaxQuota(alias.domain, alias)
          ]);

          const percentageUsed = Math.round(
            (storageUsed / maxQuotaPerAlias) * 100
          );

          // find closest threshold
          let threshold;
          for (const percentage of [50, 60, 70, 80, 90, 100]) {
            if (percentageUsed >= percentage) threshold = percentage;
          }

          // return early if no threshold found
          if (!threshold) return;

          // if user already received threshold notification
          // and the notification was sent within the past 7 days
          // then we can return early
          if (
            _.isPlainObject(alias.storage_thresholds_sent_at) &&
            alias.storage_thresholds_sent_at[threshold.toString()] &&
            _.isDate(alias.storage_thresholds_sent_at[threshold.toString()]) &&
            new Date(
              alias.storage_thresholds_sent_at[threshold.toString()]
            ).getTime() >= dayjs().subtract(1, 'week').toDate().getTime()
          )
            return;

          if (!_.isPlainObject(alias.storage_thresholds_sent_at))
            alias.storage_thresholds_sent_at = {};

          const domain = await Domains.findById(alias.domain);

          if (!domain) return;

          // get recipients and the majority favored locale
          const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
            domain
          );

          //
          // don't send a notification to the alias if the `alias.user` has
          // already received this threshold notification in past 7d
          //
          let cache = await client.get(
            `threshold:${alias.user.toString()}:${threshold.toString()}`
          );
          if (cache) return;

          //
          // don't send a notification to admins if they've already received
          // this threshold notification in past 7d
          //
          cache = await client.get(
            `threshold:${revHash(safeStringify(to))}:${threshold.toString()}`
          );
          if (cache) return;

          // send the email to the user with threshold notification
          const subject =
            config.views.locals.emoji('warning') +
            ' ' +
            i18n.translate(
              'STORAGE_THRESHOLD_SUBJECT',
              locale,
              percentageUsed,
              `${alias.name}@${domain.name}`
            );

          const message = i18n.translate(
            'STORAGE_THRESHOLD_MESSAGE',
            locale,
            percentageUsed,
            bytes(storageUsed),
            bytes(maxQuotaPerAlias),
            `${alias.name}@${domain.name}`,
            `${config.urls.web}/${locale}/my-account/billing`
          );

          // mark when the email was successfully sent/queued
          alias.storage_thresholds_sent_at[threshold.toString()] = new Date();
          alias.markModified('storage_thresholds_sent_at');

          await alias.save();

          // set threshold object for all aliases that belong to this domain with same user
          await Aliases.updateMany(
            {
              user: alias.user,
              domain: alias.domain
            },
            {
              $set: {
                storage_thresholds_sent_at: alias.storage_thresholds_sent_at
              }
            }
          );

          await client.set(
            `threshold:${alias.user.toString()}:${threshold.toString()}`,
            true,
            'PX',
            ms('7d')
          );
          await client.set(
            `threshold:${revHash(safeStringify(to))}:${threshold.toString()}`,
            true,
            'PX',
            ms('7d')
          );

          // TODO: use email queue so it retries (?)
          await emailHelper({
            template: 'alert',
            message: {
              to: `${alias.name}@${domain.name}`,
              cc: to,
              // bcc: config.alertsEmail,
              subject
            },
            locals: {
              message,
              locale
            }
          });
        } catch (err) {
          if (err.message === 'Alias does not exist') {
            err.isCodeBug = true;
            err.alias_id = id;
          }

          logger.error(err);
          // commented out as a safeguard
          // easy way to cleanup non-production environments tmpdir folders
          // if (
          //   config.env !== 'production' &&
          //   err.message === 'Alias does not exist'
          // ) {
          //   await fs.promises.rm(
          //     path.join(mountDir, config.defaultStoragePath, `${id}.sqlite`),
          //     { force: true, recursive: true }
          //   );
          // }
        }
      });
    }
  } catch (err) {
    await logger.error(err);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'SQLite cleanup had an error'
      },
      locals: {
        message: `<pre><code>${safeStringify(
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
