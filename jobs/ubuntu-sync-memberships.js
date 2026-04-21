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
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const pMapSeries = require('p-map-series');
const pRetry = require('p-retry');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const retryLaunchpadRequest = require('#helpers/retry-launchpad-request');
const setupMongoose = require('#helpers/setup-mongoose');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');

const { LAUNCHPAD_ADDRESS_FAMILY } = retryLaunchpadRequest;

const JOB_RETRIES = 2;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

function shouldRetry(err) {
  return err?.message === 'Mapping outdated' || isRetryableError(err);
}

async function syncMemberships() {
  const map = await getUbuntuMembersMap();

  await logger.info('Ubuntu membership map fetched', {
    teams: [...map.entries()].map(([name, set]) => ({
      name,
      members: set.size
    })),
    launchpadAddressFamily: LAUNCHPAD_ADDRESS_FAMILY
  });

  const ids = await Users.distinct('_id', {
    [config.passport.fields.ubuntuProfileID]: {
      $exists: true
    },
    [config.passport.fields.ubuntuUsername]: {
      $exists: true
    }
  });

  await logger.info('Ubuntu membership sync user scan starting', {
    totalUsers: ids.length,
    launchpadAddressFamily: LAUNCHPAD_ADDRESS_FAMILY
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
