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

const Boom = require('@hapi/boom');
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
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');
const setupMongoose = require('#helpers/setup-mongoose');
const monitorServer = require('#helpers/monitor-server');

const { fields } = config.passport;

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
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
      if (!user) continue;

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
        throw new Error(config.i17n.phrases.UBUNTU_API_RESPONSE_INVALID);

      for (const domainName of Object.keys(config.ubuntuTeamMapping)) {
        // eslint-disable-next-line no-await-in-loop
        const domain = await Domains.findOne({
          name: domainName,
          plan: 'team',
          has_txt_record: true
        });

        if (!domain) continue;

        // add user to the team if they are a member and don't have an @ yet
        let match = domain.members.find(
          (m) => m.user.toString() === user._id.toString()
        );

        if (
          json.entries.some(
            (entry) =>
              entry.team_link ===
              `https://api.launchpad.net/1.0/${config.ubuntuTeamMapping[domainName]}`
          )
        ) {
          if (!match) {
            match = {
              user: user._id,
              group: 'user'
            };
            domain.members.push(match);
            // eslint-disable-next-line no-await-in-loop
            await domain.save();
          }

          // now check that if the alias already exists and is owned by this user
          // eslint-disable-next-line no-await-in-loop
          const alias = await Aliases.findOne({
            user: user._id,
            domain: domain._id,
            name: user[fields.ubuntuUsername].toLowerCase()
          });

          // if not, then create it, but only if there aren't already 3+ aliases owned by this user
          if (!alias) {
            // eslint-disable-next-line no-await-in-loop
            const count = await Aliases.countDocuments({
              user: user._id,
              domain: domain._id
            });
            if (match.group !== 'admin' && count > 3) {
              const error = Boom.badRequest(
                i18n.api.t({
                  phrase: config.i18n.phrases.UBUNTU_MAX_LIMIT,
                  locale: user[config.lastLocaleField]
                })
              );
              error.no_translate = true;
              error.isCodeBug = true;
              error.email = user.email;
              error.ubuntuUsername = user[fields.ubuntuUsername];
              error.ubuntuProfileID = user[fields.ubuntuProfileID];
              logger.error(error);
              continue;
            }

            // eslint-disable-next-line no-await-in-loop
            await Aliases.create({
              // virtual to assist in preventing lookup
              is_new_user: true,

              user: user._id,
              domain: domain._id,
              name: user[fields.ubuntuUsername].toLowerCase(),
              recipients: [user.email],
              locale: user[config.lastLocaleField]
            });
          }

          continue;
        }

        //
        // otherwise disable any aliases and remove user from membership for this domain
        //
        if (match && match.group === 'user') {
          domain.members = domain.members.filter(
            (m) => m.user.toString() !== user._id.toString()
          );
          // eslint-disable-next-line no-await-in-loop
          await domain.save();
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
