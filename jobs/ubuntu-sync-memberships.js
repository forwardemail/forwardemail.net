/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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

const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  //
  // sync all ubuntu users with their launchpad teams
  // and get an in-memory cache of ubuntu memberships
  //
  try {
    const map = await getUbuntuMembersMap();

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
        } catch (err) {
          err.isCodeBug = true;
          await logger.fatal(err);
        }
      });
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Ubuntu Sync Memberships Issue'
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

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
