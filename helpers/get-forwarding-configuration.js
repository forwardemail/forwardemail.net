/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const regexParser = require('regex-parser');
const { boolean } = require('boolean');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const isEmail = require('#helpers/is-email');
const logger = require('#helpers/logger');

const REGEX_FLAG_ENDINGS = ['/gi', '/ig', '/g', '/i', '/'];

async function getForwardingConfiguration({
  verificationRecord,
  username = false,
  ignoreBilling,
  client,
  locale = i18n.config.defaultLocale
}) {
  if (!isSANB(verificationRecord))
    throw Boom.badRequest(i18n.translateError('DOMAIN_DOES_NOT_EXIST', locale));

  const domain = await Domains.findOne({
    verification_record: verificationRecord
  })
    .select(
      'has_catchall has_regex is_global _id is_catchall_regex_disabled members name id plan email_suspended_sent_at has_smtp is_smtp_suspended'
    )
    .lean()
    .exec();

  if (!domain || domain.plan === 'free') return {};

  let hasMultiplePGP = false;

  const bannedUserIdSet = await Users.getBannedUserIdSet(client);

  let aliasQuery = {};
  // if the domain was is_global then filter for
  // user ids that are either not banned paid (and not 30d past due)
  // or not banned admin group users
  if (domain.is_global) {
    if (!username) throw new TypeError('Username required for global search');

    aliasQuery = {
      domain: domain._id,
      name: username
    };
  } else {
    // if domain.is_catchall_regex_disabled and !username then throw error
    if (!username && domain.is_catchall_regex_disabled)
      throw new TypeError(
        'Username required for search due to catch-all/regex search disabled'
      );

    if (domain.is_catchall_regex_disabled) {
      aliasQuery = {
        domain: domain._id,
        name: username
      };
    } else {
      // it is faster to query without $regex
      aliasQuery = {
        domain: domain._id
      };
      // if domain doesn't have wildcard nor regex then add `name` to query
      // (a majority of domains don't have wildcards nor regular expressions)
      if (
        username &&
        typeof domain.has_catchall === 'boolean' &&
        !domain.has_catchall &&
        typeof domain.has_regex === 'boolean' &&
        !domain.has_regex
      ) {
        aliasQuery.name = username;
      }
    }
  }

  // safeguard to prevent returning all aliases
  if (_.isEmpty(aliasQuery)) throw new TypeError('Alias query was empty');

  // eslint-disable-next-line unicorn/no-array-callback-reference
  let aliases = await Aliases.find(aliasQuery)
    .select(
      'id user has_imap has_pgp public_key recipients name is_enabled error_code_if_disabled has_recipient_verification verified_recipients vacation_responder'
    )
    .lean()
    .exec();

  // TODO: vacation_responder

  //
  // NOTE: we are doing it this way for backwards compatibility for now
  //       (in the future we should probably just to `toUnicode` some users already converted so this supports legacy)
  //       (e.g. some users have aliases starting with "xn--" right now which means they already realized this bug)
  //
  // if there were no aliases found but a `username` was passed
  // then we can attempt to convert ASCII to Unicode and perform a lookup
  if (
    aliases.length === 0 &&
    username &&
    punycode.toUnicode(username) !== username
  ) {
    aliases = await Aliases.find({
      domain: domain._id,
      name: punycode.toUnicode(username)
    })
      .select(
        'id user has_imap has_pgp public_key recipients name is_enabled error_code_if_disabled has_recipient_verification verified_recipients vacation_responder'
      )
      .lean()
      .exec();
    if (aliases.length > 0) username = punycode.toUnicode(username);
  }

  if (aliases.length === 0) return {};

  //
  // if the domain was global then filter aliases
  // that belong to users with a non-banned and paid account
  //
  if (domain.is_global) {
    const arr = await Users.aggregate([
      {
        $match: {
          $or: [
            // get all paid users with expiration is >= 30 days ago
            {
              plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
              [config.userFields.planExpiresAt]: {
                $gte: dayjs().subtract(30, 'days').toDate()
              }
            },
            // get all admin users
            {
              group: 'admin'
            }
          ]
        }
      },
      { $group: { _id: '$id' } }
    ])
      .allowDiskUse(true)
      .exec();

    const validUserIdSet = new Set(arr.map((v) => v._id));

    aliases = aliases.filter((a) => {
      return (
        validUserIdSet.has(a.user.toString()) &&
        !bannedUserIdSet.has(a.user.toString())
      );
    });
  }

  //
  // if the domain is on a team plan, then ensure at least one admin
  // has a team plan subscription and has paid to date
  //
  // else if domain is on enhanced protection plan, then lookup
  // the admin of the domain and ensure that they are paid to date
  //
  //
  if (!domain.is_global && !boolean(ignoreBilling)) {
    const adminUserIds = domain.members
      .filter((member) => member.user && member.group === 'admin')
      .map((member) => member.user);

    // safeguard in case no admins exist due to data corruption
    if (adminUserIds.length === 0) {
      logger.warn(
        new Error(`Empty admin user ids: ${domain.name} (${domain.id})`),
        { domain }
      );
      return {};
    }

    const count = await Users.countDocuments({
      $or: [
        // ensure that the user has a plan that expires in the future
        {
          _id: {
            $in: adminUserIds
          },
          // if the domain was on a team plan, then the user must be on team plan
          // if the domain was on enhanced plan, then user can be on team or enhanced
          plan:
            domain.plan === 'enhanced_protection'
              ? { $in: ['team', 'enhanced_protection', 'enterprise'] }
              : domain.plan,
          // [config.userFields.hasVerifiedEmail]: true,
          [config.userFields.isBanned]: false,
          // plan expired 30 day grace window
          [config.userFields.planExpiresAt]: {
            $gte: dayjs().subtract(1, 'month').toDate()
          }
        },
        // OR that they have not yet received a follow up reminder and expiry is in the past
        {
          _id: {
            $in: adminUserIds
          },
          plan:
            domain.plan === 'enhanced_protection'
              ? { $in: ['team', 'enhanced_protection', 'enterprise'] }
              : domain.plan,
          // [config.userFields.hasVerifiedEmail]: true,
          [config.userFields.isBanned]: false,
          [config.userFields.planExpiresAt]: {
            $lt: new Date()
          },
          [config.userFields.paymentReminderFollowUpSentAt]: {
            $exists: false
          }
        }
      ]
    })
      .lean()
      .exec();

    //
    // if there were no valid users then email all admins for this domain
    // and mark when we last sent this notification for the domain
    // (if it was sent once, then wait until 2 weeks after to send again)
    // (finally after one month from when originally sent, don't send again)
    //
    if (count === 0) {
      logger.warn(
        new Error(`Suspended domain: ${domain.name} (${domain.id})`),
        { domain }
      );

      //
      // safeguard to resend emails if 1 week has passed
      // but don't send if termination notice already sent
      //
      // NOTE: this only goes out to actively used domains in real-time
      //
      if (
        _.isDate(domain.email_suspended_sent_at) &&
        dayjs(domain.email_suspended_sent_at)
          .add(1, 'week')
          .toDate()
          .getTime() <= Date.now()
      ) {
        logger.warn(
          new Error(
            `Resending suspended email to domain: ${domain.name} (${domain.id})`
          ),
          { domain }
        );
        domain.email_suspended_sent_at = null;
      }

      // store when we sent this immediately in case parallel requests
      if (!_.isDate(domain.email_suspended_sent_at)) {
        await Domains.findByIdAndUpdate(domain._id, {
          $set: {
            email_suspended_sent_at: new Date()
          }
        });

        Domains.getToAndMajorityLocaleByDomain(domain)
          .then((obj) => {
            email({
              template: 'email-suspended',
              message: { to: obj.to },
              locals: {
                domain,
                locale: obj.locale
              }
            })
              .then()
              .catch((err) => logger.error(err));
          })
          .catch((err) => logger.error(err));
      }

      // suspend forwarding by returning empty array (which causes 421 retry)
      return {};
    }

    // if the count was not zero and
    // the domain had a value set for when emails were sent
    // then we need to remove that date
    if (_.isDate(domain.email_suspended_sent_at))
      Domains.findByIdAndUpdate(domain._id, {
        $unset: {
          email_suspended_sent_at: 1
        }
      })
        .then()
        .catch((err) => logger.error(err));
  }

  const body = {
    alias_ids: [], // ids of IMAP storage to deliver to (supports 1 nested lookup)
    has_imap: false,
    alias_public_key: false,
    vacation_responder: false,
    mapping: []
  };

  function pushToBody(alias) {
    // alias.name = "*" (wildcard catchall) otherwise an alias
    // alias.is_enabled = "!" prefixed alias name (or !! or !!!)
    // alias.recipients = comma separated (split with a colon)

    // NOTE: we don't allow catch-all's to be disabled (see logic in alias model)

    // push "IMAP" to alias.recipients if it has IMAP and username
    if (
      username &&
      alias.has_imap &&
      alias.is_enabled &&
      alias.name !== '*' &&
      !alias.name.startsWith('/') &&
      !body.alias_ids.includes(alias.id)
    ) {
      body.alias_ids.push(alias.id);
      body.has_imap = true;
    }

    //
    // vacation responder support
    //
    if (
      username &&
      alias.is_enabled &&
      alias.name !== '*' &&
      !alias.name.startsWith('/') &&
      domain.has_smtp &&
      !domain.is_smtp_suspended &&
      alias?.vacation_responder?.is_enabled
    ) {
      // push vacation responder IFF domain was approved and within time range
      let isValid = true;
      if (
        _.isDate(alias?.vacation_responder?.start_date) &&
        Date.now() < new Date(alias.vacation_responder.start_date).getTime()
      )
        isValid = false;
      else if (
        _.isDate(alias?.vacation_responder?.end_date) &&
        Date.now() > new Date(alias.vacation_responder.end_date).getTime()
      )
        isValid = false;
      if (isValid) {
        body.vacation_responder = {
          ...alias.vacation_responder,
          // these are used for queueing emails
          alias_id: alias.id,
          from: `${alias.name}@${domain.name}`,
          user: alias.user.toString()
        };
      }
    }

    //
    // set PGP key for body response
    // (see FAQ note about this; we don't encrypt if we detect multiple matches)
    // (and instead we send a one-time courtesy email for the owner once a week)
    //
    if (
      !hasMultiplePGP &&
      alias.is_enabled &&
      alias.has_pgp &&
      isSANB(alias.public_key)
    ) {
      if (body.alias_public_key) {
        hasMultiplePGP = true;
        delete body.alias_public_key;
      } else {
        body.alias_public_key = alias.public_key;
      }
    }

    // recursively lookup all inboxes we need to deliver this to
    if (username && alias.is_enabled && alias.recipients.length > 0) {
      for (const recipient of alias.recipients) {
        if (!isEmail(recipient)) continue;
        const [rcptName, rcptDomain] = recipient.split('@');
        if (rcptName !== username && rcptName !== punycode.toUnicode(username))
          continue;
        if (rcptDomain !== domain.name) continue;
        const id = aliasIdsWithIMAPByName[rcptName];
        if (!id) continue;
        if (body.alias_ids.includes(id)) continue;
        // rudimentary limitation to max of 25 IMAP storage inboxes at once
        if (body.alias_ids.length >= 25) {
          logger.error(
            new TypeError(
              `${username} ${alias.name}@${domain.name} (${alias.id}) from ${domain.name} (${domain.id}) attempted to be forwarded to more than 25 IMAP mailboxes at once`
            )
          );
        } else {
          body.alias_ids.push(id);
          body.has_imap = true;
        }
      }
    }

    // if the alias requires recipient verification
    // then filter out recipients that haven't yet clicked
    // the verification link required and sent
    // (but if and only if the domain was not on free plan)
    if (alias.name === '*' && alias.recipients.length > 0) {
      body.mapping.push(alias.recipients.join(','));
      return;
    }

    if (alias.recipients.length > 0)
      body.mapping.push(
        alias.recipients
          .map((recipient) => {
            if (alias.is_enabled) return `${alias.name}:${recipient}`;
            if (
              !alias.error_code_if_disabled ||
              alias.error_code_if_disabled === 250
            )
              return `!${alias.name}`;
            if (alias.error_code_if_disabled === 421) return `!!${alias.name}`;
            if (alias.error_code_if_disabled === 550) return `!!!${alias.name}`;
            // safeguard
            const err = new TypeError(`Invalid error code`);
            err.alias = alias;
            err.isCodeBug = true;
            throw err;
          })
          .join(',')
      );
  }

  // create a mapping in advance for
  // recursive IMAP storage support
  const aliasIdsWithIMAPByName = {};
  if (username) {
    for (const alias of aliases) {
      if (
        !bannedUserIdSet.has(alias.user.toString()) &&
        alias.has_imap &&
        alias.is_enabled &&
        alias.name !== '*' &&
        !alias.name.startsWith('/')
      ) {
        aliasIdsWithIMAPByName[alias.name] = alias.id;
      }
    }
  }

  for (const alias of aliases) {
    if (bannedUserIdSet.has(alias.user.toString())) continue;
    // rewrite `alias.recipients` to verified recipients only
    // if and only if user has recipient verification enabled
    if (alias.has_recipient_verification && alias.recipients.length > 0) {
      const recipients = [];
      for (const recipient of alias.recipients) {
        if (alias.verified_recipients.includes(recipient))
          recipients.push(recipient);
      }

      alias.recipients = recipients;
    }

    //
    // if there were no recipients entered and it was disabled
    // then we should do a virtual `nobody@forwardemail.net`
    // so the logic in `pushToBody` works properly
    //
    if (!alias.is_enabled && alias.recipients.length === 0) {
      alias.recipients = ['nobody@forwardemail.net'];
    }

    // if there were no recipients and it wasnt a username query with IMAP
    if (alias.recipients.length === 0 && (!username || !alias.has_imap))
      continue;

    if (alias.name === '*') {
      pushToBody(alias);
      continue;
    }

    if (!username) {
      pushToBody(alias);
      continue;
    }

    //
    // regex is not supported on global vanity domains
    // (this is noted of in the FAQ section regarding regex)
    // (also the majority of this code is copied from the FE smtp server codebase)
    //
    if (!domain.is_global && !domain.is_catchall_regex_disabled) {
      // must start with / and end with /: and not have the same index for the last index
      // forward-email=/^(support|info)$/:forwardemail+$1@gmail.com
      // -> this would forward to forwardemail+support@gmail.com if email sent to support@

      // it either ends with:
      // "/gi:"
      // "/ig:"
      // "/g:"
      // "/i:"
      // "/:"
      //
      let lastIndex;
      const hasTwoSlashes =
        alias.name.lastIndexOf('/') !== alias.name.indexOf('/');
      const startsWithSlash = alias.name.startsWith('/');
      if (startsWithSlash && hasTwoSlashes) {
        for (const ending of REGEX_FLAG_ENDINGS) {
          if (
            alias.name.lastIndexOf(ending) !== -1 &&
            alias.name.lastIndexOf(ending) !== 0
          ) {
            lastIndex = ending;
            break;
          }
        }
      }

      //
      // regular expression support
      // <https://github.com/forwardemail/free-email-forwarding/pull/245/commits/e04ea02d700b51771bf61ed512d1763bbf80784b>
      // (with added support for regex gi flags)
      //
      if (startsWithSlash && hasTwoSlashes && lastIndex) {
        let parsedRegex = alias.name.slice(
          0,
          Math.max(0, alias.name.lastIndexOf(lastIndex) + 1)
        );

        // add case insensitive flag since email addresses are case insensitive
        if (lastIndex === '/g:' || lastIndex === '/:') parsedRegex += 'i';
        //
        // `forward-email=/^(support|info)$/:forwardemail+$1@gmail.com`
        // support@mydomain.com -> forwardemail+support@gmail.com
        //
        // `forward-email=/^(support|info)$/:forwardemail.net/$1`
        // info@mydomain.com -> POST to forwardemail.net/info
        //
        // `forward-email=/Support/g:forwardemail.net`
        //
        // `forward-email=/SUPPORT/gi:forwardemail.net`
        let regex;
        try {
          regex = new RE2(regexParser(parsedRegex));
        } catch (err) {
          logger.warn(err, { parsedRegex, alias });
        }

        if (regex) {
          if (
            regex.test(username) ||
            regex.test(punycode.toUnicode(username))
          ) {
            pushToBody(alias);
          }

          continue;
        }
      }
    }

    if (username !== alias.name && punycode.toUnicode(username) !== alias.name)
      continue;

    pushToBody(alias);
  }

  // send error alert email regarding multiple PGP setup
  if (hasMultiplePGP) {
    client
      .get(`multiple_pgp_check:${domain.id}`)
      .then(async (cache) => {
        if (boolean(cache)) return;
        try {
          await client.set(
            `multiple_pgp_check:${domain.id}`,
            true,
            'PX',
            ms('7d')
          );
          const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
          const subject = i18n.translate(
            'MULTIPLE_PGP_SUBJECT',
            obj.locale,
            `${username}@${domain.name}`
          );
          const message = i18n.translate(
            'MULTIPLE_PGP_MESSAGE',
            obj.locale,
            domain.name,
            `${username}@${domain.name}`
          );
          await email({
            template: 'alert',
            message: {
              to: obj.to,
              bcc: config.alertsEmail,
              subject
            },
            locals: {
              message,
              locale: obj.locale
            }
          });
        } catch (err) {
          logger.fatal(err);
        }
      })
      .catch((err) => logger.fatal(err));
  }

  return body;
}

module.exports = getForwardingConfiguration;
