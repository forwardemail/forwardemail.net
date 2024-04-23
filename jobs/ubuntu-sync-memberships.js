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
const _ = require('lodash');
const delay = require('delay');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');

const Aliases = require('#models/aliases');
const Users = require('#models/users');
const Domains = require('#models/domains');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const adminIds = await Users.distinct('_id', {
      group: 'admin'
    });

    let domain = await Domains.findOne({
      name: 'ubuntu.com',
      plan: 'team',
      'members.user': {
        $in: adminIds
      }
    });

    if (!domain)
      throw new Error(config.i18n.phrases.DOMAIN_DOES_NOT_EXIST_ANYWHERE);

    //
    // go through all ubuntu members and then lookup their profile
    // to ensure that they're still in the ~ubuntumembers team
    // and if not anymore, then remove their association with Ubuntu
    // in the user database - and also disable any of their aliases
    //
    const ids = await Users.distinct('_id', {
      [config.passport.fields.ubuntuProfileID]: {
        $exists: true
      },
      [config.passport.fields.ubuntuUsername]: {
        $exists: true
      }
    });

    // go in series with 1s delay in between so that we don't get rate limited
    for (const id of ids) {
      // eslint-disable-next-line no-await-in-loop
      const user = await Users.findById(id);
      if (!user) throw new Error('User does not exist');

      // eslint-disable-next-line no-await-in-loop
      const response = await retryRequest(
        `https://api.launchpad.net/1.0/~${
          user[config.passport.fields.ubuntuUsername]
        }/memberships_details`
      );

      // eslint-disable-next-line no-await-in-loop
      const json = await response.body.json();

      // TODO: support pagination for users that have paginated memberships

      if (
        !_.isObject(json) ||
        !_.isNumber(json.start) ||
        !_.isNumber(json.total_size) ||
        !_.isArray(json.entries)
      )
        throw new Error(config.i18n.phrases.UBUNTU_API_RESPONSE_INVALID);

      if (
        json.entries.some(
          (entry) =>
            entry.team_link === 'https://api.launchpad.net/1.0/~ubuntumembers'
        )
      ) {
        // continue early if the user is still a member
        continue;
      }

      // otherwise disassociate the user
      delete user[config.passport.fields.ubuntuProfileID];
      delete user[config.passport.fields.ubuntuUsername];
      // eslint-disable-next-line no-await-in-loop
      await user.save();

      // eslint-disable-next-line no-await-in-loop
      domain = await Domains.findOne({
        name: 'ubuntu.com',
        plan: 'team',
        'members.user': {
          $in: adminIds
        }
      });

      if (!domain)
        throw new Error(config.i18n.phrases.DOMAIN_DOES_NOT_EXIST_ANYWHERE);

      //
      // remove from member group (if they are not an admin)
      //
      const match = domain.members.find(
        (m) => m.user.toString() === user._id.toString()
      );

      if (match && match.group === 'user') {
        domain.members = domain.members.filter(
          (m) => m.user.toString() !== user._id.toString()
        );
        // eslint-disable-next-line no-await-in-loop
        await domain.save();
        //
        // and disable any existing aliases
        //
        // eslint-disable-next-line no-await-in-loop
        await Aliases.findAndUpdate(
          {
            user: user._id,
            domain: domain._id
          },
          {
            $set: {
              is_enabled: false
            }
          },
          {
            multi: true
          }
        );
      }

      // artificial 1s delay to prevent rate limiting
      // eslint-disable-next-line no-await-in-loop
      await delay(ms('1s'));
    }
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
