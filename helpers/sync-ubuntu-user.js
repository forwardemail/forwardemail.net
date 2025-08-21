/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Redis = require('@ladjs/redis');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pEvent = require('p-event');
const pMap = require('p-map');
const revHash = require('rev-hash');
const sharedConfig = require('@ladjs/shared-config');
const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');
const { emoji } = require('#config/utilities');

const { fields } = config.passport;

// TODO: re-use existing connection from web
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);
const resolver = createTangerine(client, logger);

class InvalidUbuntuUserError extends TypeError {
  constructor(message, options) {
    super(message);
    Error.captureStackTrace(this, InvalidUbuntuUserError);
    Object.assign(this, options);
  }
}

function renderDebug(map, stack) {
  // Convert Map with Sets to a plain object with arrays
  const mapWithArrays = Object.fromEntries(
    [...map.entries()].map(([key, set]) => [key, [...set]])
  );

  return `<pre><code>${JSON.stringify(
    {
      map: mapWithArrays,
      stack
    },
    null,
    2
  )}</code></pre>`;
}

function getKeyPrefix(user, domain) {
  return `sync_ubuntu_error:${revHash([user.id, domain.id].join(':'))}`;
}

function setDebugInfoForError(err, user) {
  // debugging information for admins
  err.isCodeBug = true;
  err.ubuntuProfileID = user[fields.ubuntuProfileID];
  err.ubuntuUsername = user[fields.ubuntuUsername];
  err.user_id = user.id;
  err.email = user.email;
}

async function logErrorWithUser(err, user) {
  setDebugInfoForError(err, user);
  await logger.error(err);
}

function getAdminEmailsForDomain(domain) {
  return domain.members
    .filter(
      (m) =>
        m.group === 'admin' &&
        m.user &&
        !m.user[config.userFields.isBanned] &&
        m.user[config.userFields.hasVerifiedEmail]
    )
    .map((m) => m.user.email);
}

//
// `user` is a user from user model with access to `constructor` for querying
// `map is a Map instance that looks like this:
// (it leverages `config.ubuntuTeamMapping`)
// Map = {
//  'ubuntu.com': new Set([
//    'kotodama',
//    ...
//  ])
//  ...
// }
//
// note that in the sync job we prepare the map in advance
// and invoke `syncUbuntuUser(user, map)` with the map so it doesn't
// get fetched again and again for each invocation (as it does in user pre-save hook)
// (rudimentary caching for duration of script)
//
// also see discussion here:
// <https://bugs.launchpad.net/bugs/2073219>
//
async function syncUbuntuUser(user, map) {
  try {
    if (
      !_.isObject(user) ||
      !isSANB(user[fields.ubuntuUsername]) ||
      !isSANB(user[fields.ubuntuProfileID]) ||
      !isEmail(user.email)
    )
      throw new TypeError('Invalid user object');

    if (!(map instanceof Map)) map = await getUbuntuMembersMap(resolver);

    if (map.size === 0)
      throw new TypeError('Map supplied was missing or empty');

    //
    // if the user's last sync was AFTER the mapping was created
    // then exit early so we get a fresh sync
    // (this will NEVER happen for when user hooks are run since it always gets a fresh mapping)
    //
    const date = map[Symbol.for('createdAt')];
    if (
      _.isDate(user.last_ubuntu_sync) &&
      new Date(user.last_ubuntu_sync).getTime() > date.getTime()
    )
      throw new TypeError('Mapping outdated');

    // safeguard to ensure every key exists
    if (
      ![...map.keys()].every((name) => Boolean(config.ubuntuTeamMapping[name]))
    )
      throw new TypeError('Map supplied had invalid team names');

    // if the user was banned then don't allow
    if (user[config.userFields.isBanned]) {
      const err = new InvalidUbuntuUserError('User was banned', {
        ignoreHook: true
      });
      throw err;
    }

    //
    // GET https://api.launchpad.net/1.0/~kotodamatest
    // - ensure `is_valid`
    // - ensure `is_ubuntu_coc_signer`
    //
    const url = `https://api.launchpad.net/1.0/~${user[fields.ubuntuUsername]}`;
    const response = await retryRequest(url, { resolver });
    const json = await response.body.json();

    // validate booleans
    for (const key of ['is_valid', 'is_ubuntu_coc_signer']) {
      if (typeof json[key] !== 'boolean')
        throw new TypeError(`Boolean property "${key}" is missing`);
    }

    if (!json.is_valid)
      throw new InvalidUbuntuUserError('Property "is_valid" was false', {
        url,
        response,
        json,
        ignoreHook: true
      });

    if (!json.is_ubuntu_coc_signer)
      throw new InvalidUbuntuUserError(
        'Property "is_ubuntu_coc_signer" was false',
        {
          url,
          response,
          json,
          ignoreHook: true
        }
      );

    //
    // NOTE: we do not need to check for `is_probationary`
    //       <https://git.launchpad.net/launchpad/tree/lib/lp/registry/model/person.py#n1444>
    //
    //       ```py
    //       def is_probationary(self):
    //           """See `IPerson`.
    //
    //           Users without karma have not demonstrated their intentions may not
    //           have the same privileges as users who have made contributions.
    //           """
    //           return not self.is_team and self.karma == 0
    //       ```
    //
    // if (json.is_probationary)
    //   throw new InvalidUbuntuUserError('Property "is_probationary" was true', {
    //     url,
    //     response,
    //     json,
    //     ignoreHook: true
    //   });

    //
    // iterate in parallel for each domain for the user
    // and either add or remove them based
    // off if they are a member or not
    //
    await pMap(
      [...map.keys()],

      async (name) => {
        try {
          const domain = await Domains.findOne({
            name,
            plan: 'team',
            has_txt_record: true
          }).populate(
            'members.user',
            `_id id ${config.userFields.fullEmail} ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail}`
          );

          if (!domain) {
            await logger.fatal(
              new TypeError(`${name} was not found with team and TXT`)
            );
            // return early
            return;
          }

          // key prefix for errors related to this user (so we don't send duplicate emails)
          const keyPrefix = getKeyPrefix(user, domain);

          const teamName = config.ubuntuTeamMapping[name];

          const adminEmailsForDomain = getAdminEmailsForDomain(domain);

          // safeguard
          if (adminEmailsForDomain.length === 0)
            throw new TypeError(
              `No valid admins were found for the domain ${domain.name}`
            );

          let needsAdded = false;

          // ensure user is added to `domain.members`
          let member = domain.members.find(
            (m) => m?.user?.id === user._id.toString()
          );
          if (!member) {
            needsAdded = true;
            member = {
              user: user._id,
              group: 'user'
            };
          }

          //
          // check if the user was in the Set from Map
          // to see if they were a member of the team or not
          //
          if (map.get(name).has(user[fields.ubuntuUsername])) {
            // ensure alias exists else create it
            let alias = await Aliases.findOne({
              user: user._id,
              domain: domain._id,
              name: user[fields.ubuntuUsername].toLowerCase()
            });

            if (!alias) {
              // if not, then create it, but only if there
              // aren't already 3+ aliases owned by user user
              const count = await Aliases.countDocuments({
                user: user._id,
                domain: domain._id
              });

              if (member.group !== 'admin' && count > 3)
                throw new TypeError(
                  `${emoji('warning')} ${user[
                    fields.ubuntuUsername
                  ].toLowerCase()}@${
                    domain.name
                  } not created due to ${count} existing aliases (exceeds > 3 limit)`
                );

              const isEqual =
                user.email ===
                `${user[fields.ubuntuUsername].toLowerCase()}@${domain.name}`;

              //
              // if this throws a Boom error (e.g. restricted username, e.g. mark@)
              // then we should email the uesr and cc admins
              // (but if and only if revhash of error message doesn't exist in cache for 30d)
              try {
                alias = await Aliases.create({
                  //
                  // virtual to assist with member lookup
                  // (so we don't create a user we don't want to yet)
                  //
                  virtual_member: member,
                  // virtual to assist in preventing lookup
                  is_new_user: true,

                  user: user._id,
                  domain: domain._id,
                  name: user[fields.ubuntuUsername].toLowerCase(),
                  recipients: [user.email],
                  locale: user[config.lastLocaleField],

                  // set alias state to disabled if it matched
                  is_enabled: !isEqual
                });
              } catch (err) {
                if (err && err.isBoom) {
                  const key = `${keyPrefix}:${revHash(err.message)}`;
                  const cache = await client.get(key);
                  if (cache) throw err;
                  await emailHelper({
                    template: 'alert',
                    message: {
                      to: user.email,
                      cc: adminEmailsForDomain,
                      bcc: config.alertsEmail,
                      subject: `${emoji('warning')} ${user[
                        fields.ubuntuUsername
                      ].toLowerCase()}@${domain.name} could not be created`
                    },
                    locals: {
                      message:
                        `<p>${user[fields.ubuntuUsername].toLowerCase()}@${
                          domain.name
                        } could not be created as a member of ${teamName} due to the following reason:</p><p>${
                          err.message
                        }</p>` + renderDebug(map, new Error('null').stack)
                    }
                  });
                  await client.set(key, true, 'PX', ms('30d'));
                }

                throw err;
              }

              if (needsAdded) {
                domain.members.push(member);
                await Domains.findByIdAndUpdate(domain._id, {
                  $set: {
                    members: domain.members
                  }
                });
              }

              // email admins if we found the user had same matching email as forwarding address
              try {
                await emailHelper({
                  template: 'alert',
                  message: {
                    to: adminEmailsForDomain,
                    bcc: config.alertsEmail,
                    subject: isEqual
                      ? `${emoji('warning')} ${alias.name}@${
                          domain.name
                        } disabled due to matching addresses`
                      : `${emoji('tada')} ${alias.name}@${domain.name} created`
                  },
                  locals: {
                    message:
                      `${alias.name}@${
                        domain.name
                      } was created since they are a member of ${teamName}${
                        isEqual
                          ? ', yet it was disabled due to matching addresses.'
                          : '.'
                      }` + renderDebug(map, new Error('null').stack)
                  }
                });
              } catch (err) {
                logger.fatal(err);
              }
            }

            // return early
            return;
          }

          //
          // otherwise if the user was not an admin then
          // we need to delete any aliases that belong to the user
          // and we also need to remove the user from the domain
          //

          // return early if we can
          // (either the user wasn't a member already or there were an admin)
          if (needsAdded || member?.group === 'admin') return;

          domain.members = domain.members.filter(
            (m) => m.user && m.user._id.toString() !== user._id.toString()
          );
          await Domains.findByIdAndUpdate(domain._id, {
            $set: {
              members: domain.members
            }
          });

          await Aliases.deleteMany({
            user: user._id,
            domain: domain._id
          });

          //
          // if user has no other aliases then mark email as unverified
          // (this way the automated job will delete the users account in 30d)
          //
          if (!user.isNew) {
            const [aliasCount, domainCount] = await Promise.all([
              Aliases.countDocuments({ user: user._id }),
              Domains.countDocuments({ 'members.user': user._id })
            ]);

            if (aliasCount === 0 && domainCount === 0)
              await user.constructor.findByIdAndUpdate(user._id, {
                $set: {
                  [config.userFields.hasVerifiedEmail]: false
                }
              });
          }

          // email admins
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: adminEmailsForDomain,
                bcc: config.alertsEmail,
                subject: `${emoji('wastebasket')} ${user[
                  fields.ubuntuUsername
                ].toLowerCase()}@${domain.name} removed`
              },
              locals: {
                message:
                  `${user[fields.ubuntuUsername].toLowerCase()}@${
                    domain.name
                  } was removed since they are no longer a member of ${teamName}.` +
                  renderDebug(map, new Error('null').stack)
              }
            });
          } catch (err) {
            await logger.fatal(err);
          }

          //
          // reset purge_cache of any sync_ubuntu_error errors for this user + domain id
          //
          const stream = client.scanStream({
            match: `${keyPrefix}:*`,
            count: 10000,
            type: 'string'
          });
          const keysToClear = [];
          stream.on('data', (keys) => {
            if (keys && keys.length > 0) keysToClear.push(...keys);
          });
          await pEvent(stream, 'end');
          if (keysToClear.length > 0)
            await Promise.all(keysToClear.map((key) => client.del(key)));
        } catch (err) {
          err.domainName = name;
          await logErrorWithUser(err, user);
        }

        //
        // as cleanup if the user was a member (user) and had zero aliases
        // then remove the user from the domain members array
        // (could probably remove this await and re-use existing `domain` in-memory from above)
        //
        try {
          const domain = await Domains.findOne({
            name,
            plan: 'team',
            has_txt_record: true,
            members: {
              $elemMatch: {
                user: user._id,
                group: 'user'
              }
            }
          });

          if (domain) {
            const count = await Aliases.countDocuments({
              domain: domain._id,
              user: user._id
            });
            if (count === 0) {
              // if user had zero aliases then remove them from group
              domain.members = domain.members.filter(
                (m) => m.user && m.user.toString() !== user._id.toString()
              );
              await Domains.findByIdAndUpdate(domain._id, {
                $set: {
                  members: domain.members
                }
              });
            }
          }
        } catch (err) {
          await logErrorWithUser(err, user);
        }
      },
      { concurrency: config.concurrency }
    );
  } catch (err) {
    //
    // if it was an instance of InvalidUbuntuUserError
    // then go through iterate over domain in parallel
    // and if the user was not an admin, then remove user from
    // members array and delete all of their aliases
    // (and also email admins of this)
    //
    if (err instanceof InvalidUbuntuUserError) {
      await pMap(
        [...map.keys()],
        async (name) => {
          try {
            const teamName = config.ubuntuTeamMapping[name];

            const domain = await Domains.findOne({
              name,
              plan: 'team',
              has_txt_record: true
            }).populate(
              'members.user',
              `_id id ${config.userFields.fullEmail} ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail}`
            );

            // return early if possible
            if (!domain) return;

            // key prefix for errors related to this user (so we don't send duplicate emails)
            const keyPrefix = getKeyPrefix(user, domain);

            const adminEmailsForDomain = getAdminEmailsForDomain(domain);

            // safeguard
            if (adminEmailsForDomain.length === 0)
              throw new TypeError(
                `No valid admins were found for the domain ${domain.name}`
              );

            // remove user from members
            let isMember = false;
            if (
              domain.members.some(
                (m) => m.user && m.user._id.toString() === user._id.toString()
              )
            ) {
              isMember = true;
              domain.members = domain.members.filter(
                (m) => m.user && m.user._id.toString() !== user._id.toString()
              );
              await Domains.findByIdAndUpdate(domain._id, {
                $set: {
                  members: domain.members
                }
              });
            }

            // remove aliases that belonged to user
            await Aliases.deleteMany({
              user: user._id,
              domain: domain._id
            });

            //
            // only email admins if one of two cases:
            // 1) the user was found in the `map` for the team
            // 2) the user was a member of the team already
            //
            if (isMember || map.get(name).has(user[fields.ubuntuUsername])) {
              // email admins
              const key = `${keyPrefix}:${revHash(err.message)}`;
              const cache = await client.get(key);

              if (!cache) {
                try {
                  await emailHelper({
                    template: 'alert',
                    message: {
                      to: user.email,
                      cc: adminEmailsForDomain,
                      bcc: config.alertsEmail,
                      subject: `${emoji('wastebasket')} ${user[
                        fields.ubuntuUsername
                      ].toLowerCase()}@${domain.name} ${
                        isMember ? 'removed' : 'not added'
                      } due to invalidity`
                    },
                    locals: {
                      message:
                        `<p>${user[fields.ubuntuUsername].toLowerCase()}@${
                          domain.name
                        } was ${
                          isMember ? 'removed' : 'not added'
                        } for the following invalidity reason from ${teamName}:</p><p>${
                          err.message
                        }</p>` + renderDebug(map, new Error('null').stack)
                    }
                  });
                  await client.set(key, true, 'PX', ms('30d'));
                } catch (err) {
                  await logger.fatal(err);
                }
              }
            }
          } catch (err) {
            await logErrorWithUser(err, user);
          }
        },
        { concurrency: config.concurrency }
      );
    }

    // debugging information for admins
    setDebugInfoForError(err, user);
    throw err;
  }
}

module.exports = syncUbuntuUser;
