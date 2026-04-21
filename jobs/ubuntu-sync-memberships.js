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
const parseErr = require('parse-err');
const pMapSeries = require('p-map-series');
const pRetry = require('p-retry');
const sharedConfig = require('@ladjs/shared-config');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const Users = require('#models/users');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');

const JOB_RETRIES = 2;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// TODO: re-use existing connection from web
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const resolver = createTangerine(client, logger);

function shouldRetry(err) {
  return err?.message === 'Mapping outdated' || isRetryableError(err);
}

async function syncMemberships() {
  const map = await getUbuntuMembersMap(resolver);

  const ids = await Users.distinct('_id', {
    [config.passport.fields.ubuntuProfileID]: {
      $exists: true
    },
    [config.passport.fields.ubuntuUsername]: {
      $exists: true
    }
  });

  //
  // should be done in series otherwise domain update could conflict
  //
  if (ids.length > 0)
    await pMapSeries(ids, async (id) => {
      try {
        const user = await Users.findById(id);

        // return early if we can
        if (!user) return;

        await syncUbuntuUser(user, map);
        await Users.findByIdAndUpdate(user._id, {
          $set: {
            last_ubuntu_sync: new Date()
          }
        });
      } catch (err) {
        if (shouldRetry(err)) throw err; // short circuit so job will retry

        err.isCodeBug = true;
        await logger.fatal(err);
      }
    });
}

(async () => {
  try {
    await setupMongoose(logger);

    //
    // sync all ubuntu users with their launchpad teams
    // and get an in-memory cache of ubuntu memberships
    //
    await pRetry(() => syncMemberships(), {
      retries: JOB_RETRIES,
      async onFailedAttempt(err) {
        if (!shouldRetry(err)) throw err;

        await logger.warn('Ubuntu sync memberships attempt failed, retrying', {
          err,
          attemptNumber: err.attemptNumber,
          retriesLeft: err.retriesLeft
        });
      }
    });

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  } catch (err) {
    await logger.error(err);

    if (!shouldRetry(err)) {
      // send an email to admins of the error
      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: 'Ubuntu Sync Memberships Issue'
        },
        locals: {
          message: `<pre><code>${encode(
            safeStringify(parseErr(err), null, 2)
          )}</code></pre>`
        }
      });

      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    if (parentPort) parentPort.postMessage('error');
    else process.exit(1);
  }
})();
