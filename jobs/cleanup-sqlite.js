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
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const pEvent = require('p-event');
const prettyBytes = require('pretty-bytes');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const subscriber = new Redis(breeSharedConfig.redis, logger);
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

//
// find all files that end with:
// - `-backup.sqlite`
// - `-backup-wal.sqlite`
// - `-backup-shm.sqlite`
//
//
const AFFIXES = ['-backup', '-backup-wal', '-backup-shm'];

const mountDir = config.env === 'production' ? '/mnt' : tmpdir;

// eslint-disable-next-line complexity
(async () => {
  await setupMongoose(logger);

  const wsp = createWebSocketAsPromised();

  try {
    if (isCancelled) return;

    const dirents = await fs.promises.readdir(mountDir, {
      withFileTypes: true
    });

    const ids = new Set();
    const filePaths = [];

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;
      // eslint-disable-next-line no-await-in-loop
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
        for (const affix of AFFIXES) {
          if (!basename.endsWith(affix)) {
            ids.add(basename.replace('-tmp', ''));
            continue;
          }

          const filePath = path.join(mountDir, dirent.name, file.name);
          // eslint-disable-next-line no-await-in-loop
          const stat = await fs.promises.stat(filePath);
          if (!stat.isFile()) continue; // safeguard
          // delete any backups that are 4h+ old
          if (stat.mtimeMs && stat.mtimeMs <= Date.now() - ms('4h')) {
            // eslint-disable-next-line no-await-in-loop
            await fs.promises.unlink(filePath);
            filePaths.push(filePath);
          }

          break;
        }
      }
    }

    // email admins of any old files cleaned up
    if (filePaths.length > 0)
      emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
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
            to: config.email.message.from,
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
      for (const id of ids) {
        try {
          //
          // attempt to vacuum database
          // (if and only if the user was logged in via IMAP)
          // (this fetches the password in-memory real-time)
          // (similar to when we write to tmp storage)
          //
          try {
            client.publish('sqlite_auth_request', id);
            // eslint-disable-next-line no-await-in-loop
            const [, response] = await pEvent(subscriber, 'message', {
              filter(args) {
                const [channel, data] = args;
                if (channel !== 'sqlite_auth_response' || !data) return;
                try {
                  const d = JSON.parse(data);
                  return d.id === id;
                } catch {}
              },
              multiArgs: true,
              timeout: ms('5s')
            });
            const user = JSON.parse(response);
            // eslint-disable-next-line no-await-in-loop
            await wsp.request({
              action: 'vacuum',
              timeout: ms('5m'),
              session: { user }
            });
          } catch (err) {
            logger.error(err);
          }

          // update `storage_used` for given alias
          // eslint-disable-next-line no-await-in-loop
          await wsp.request({
            action: 'size',
            timeout: ms('5s'),
            alias_id: id
          });

          // get total storage used for an alias (includes across all relevant domains/aliases)
          // eslint-disable-next-line no-await-in-loop
          const alias = await Aliases.findOne({ id });

          if (!alias) return;

          // if the alias did not have imap or it was not enabled
          // then we can return early since the check is not useful
          if (!alias.has_imap || !alias.is_enabled) return;

          // eslint-disable-next-line no-await-in-loop
          const storageUsed = await Aliases.getStorageUsed(alias);

          const percentageUsed = Math.round(
            (storageUsed / config.maxQuotaPerAlias) * 100
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
            typeof alias.storage_thresholds_sent_at === 'object' &&
            alias.storage_thresholds_sent_at[threshold.toString()] &&
            _.isDate(alias.storage_thresholds_sent_at[threshold.toString()]) &&
            new Date(
              alias.storage_thresholds_sent_at[threshold.toString()]
            ).getTime() >= dayjs().subtract(1, 'week').toDate().getTime()
          )
            return;

          if (typeof alias.storage_thresholds_sent_at !== 'object')
            alias.storage_thresholds_sent_at = {};

          // eslint-disable-next-line no-await-in-loop
          const domain = await Domains.findById(alias.domain);

          if (!domain) return;

          // get recipients and the majority favored locale
          // eslint-disable-next-line no-await-in-loop
          const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
            domain
          );

          // send the email to the user with threshold notification
          const subject =
            config.views.locals.emoji('warning') +
            ' ' +
            i18n.translate('STORAGE_THRESHOLD_SUBJECT', locale, percentageUsed);

          const message = i18n.translate(
            'STORAGE_THRESHOLD_MESSAGE',
            locale,
            percentageUsed,
            prettyBytes(storageUsed),
            prettyBytes(config.maxQuotaPerAlias),
            `${config.urls.web}/${locale}/my-account/billing`
          );

          // eslint-disable-next-line no-await-in-loop
          await emailHelper({
            template: 'alert',
            message: {
              to,
              bcc: config.email.message.from,
              subject
            },
            locals: {
              message,
              locale
            }
          });

          // mark when the email was successfully sent/queued
          alias.storage_thresholds_sent_at[threshold.toString()] = new Date();
          alias.markModified('storage_thresholds_sent_at');
          // eslint-disable-next-line no-await-in-loop
          await alias.save();
        } catch (err) {
          logger.error(err);
          // commented out as a safeguard
          // easy way to cleanup non-production environments tmpdir folders
          // if (
          //   config.env !== 'production' &&
          //   err.message === 'Alias does not exist'
          // ) {
          //   await fs.promises.unlink(
          //     path.join(mountDir, config.defaultStoragePath, `${id}.sqlite`)
          //   );
          // }
        }
      }
    }
  } catch (err) {
    await logger.error(err);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'SQLite cleanup had an error'
      },
      locals: {
        message: `<pre><code>${JSON.stringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  wsp.close();

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
