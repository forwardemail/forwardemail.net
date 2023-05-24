const Boom = require('@hapi/boom');
const RE2 = require('re2');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const regexParser = require('regex-parser');
const { boolean } = require('boolean');

const config = require('#config');
const Domains = require('#models/domains');
const Users = require('#models/users');
const Aliases = require('#models/aliases');
const email = require('#helpers/email');

const REGEX_FLAG_ENDINGS = ['/gi', '/ig', '/g', '/i', '/'];

// eslint-disable-next-line complexity
async function lookup(ctx) {
  if (!isSANB(ctx.query.verification_record))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const query = {
    verification_record: ctx.query.verification_record,
    plan: { $ne: 'free' }
  };

  // legacy compatibility
  if (isSANB(ctx.query.domain)) query.name = ctx.query.domain;

  // safeguard to prevent returning any domain
  if (_.isEmpty(query)) throw new Error('Domain query was empty');

  const domain = await Domains.findOne(query).lean().exec();

  if (!domain) {
    ctx.body = [];
    return;
  }

  const username = isSANB(ctx.query.username)
    ? ctx.query.username.toLowerCase()
    : false;

  let aliasQuery = {};
  // if the domain was is_global then filter for
  // user ids that are either not banned paid (and not 30d past due)
  // or not banned admin group users
  if (domain.is_global) {
    if (!username) throw new Error('Username required for global search');

    const validUsers = await Users.distinct('_id', {
      $or: [
        // get all not banned, paid users, and expiration is >= 30 days ago
        {
          [config.userFields.isBanned]: false,
          plan: { $ne: 'free' },
          [config.userFields.planExpiresAt]: {
            $gte: dayjs().subtract(30, 'days').toDate()
          }
        },
        // get all not banned, admin users
        {
          [config.userFields.isBanned]: false,
          group: 'admin'
        }
      ]
    });

    aliasQuery = {
      domain: domain._id,
      user: { $in: validUsers },
      name: username
    };
  } else {
    // if domain.is_catchall_regex_disabled and !username then throw error
    if (!username && domain.is_catchall_regex_disabled)
      throw new Error(
        'Username required for search due to catch-all/regex search disabled'
      );

    const bannedUserIds = await Users.distinct('_id', {
      [config.userFields.isBanned]: true
    });

    if (domain.is_catchall_regex_disabled) {
      aliasQuery = {
        domain: domain._id,
        ...(bannedUserIds.length > 0 ? { user: { $nin: bannedUserIds } } : {}),
        name: username
      };
    } else {
      // it is faster to query without $regex
      aliasQuery = {
        domain: domain._id,
        ...(bannedUserIds.length > 0 ? { user: { $nin: bannedUserIds } } : {})
      };
    }
  }

  // safeguard to prevent returning all aliases
  if (_.isEmpty(aliasQuery)) throw new Error('Alias query was empty');

  // eslint-disable-next-line unicorn/no-array-callback-reference
  const aliases = await Aliases.find(aliasQuery).lean().exec();

  if (aliases.length === 0) {
    ctx.body = [];
    return;
  }

  //
  // if the domain is on a team plan, then ensure at least one admin
  // has a team plan subscription and has paid to date
  //
  // else if domain is on enhanced protection plan, then lookup
  // the admin of the domain and ensure that they are paid to date
  //
  //
  if (!domain.is_global && !boolean(ctx.query.ignore_billing)) {
    const adminUserIds = domain.members
      .filter((member) => member.group === 'admin')
      .map((member) => member.user);

    // safeguard in case no admins exist due to data corruption
    if (adminUserIds.length === 0) {
      ctx.logger.warn(
        new Error(`Empty admin user ids: ${domain.name} (${domain.id})`),
        { domain }
      );
      ctx.body = [];
      return;
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
              ? { $in: ['team', 'enhanced_protection'] }
              : domain.plan,
          [config.userFields.hasVerifiedEmail]: true,
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
              ? { $in: ['team', 'enhanced_protection'] }
              : domain.plan,
          [config.userFields.hasVerifiedEmail]: true,
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
      ctx.logger.warn(
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
        ctx.logger.warn(
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
              .catch((err) => ctx.logger.error(err));
          })
          .catch((err) => ctx.logger.error(err));
      }

      // suspend forwarding by returning empty array (which causes 421 retry)
      ctx.body = [];
      return;
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
        .catch((err) => ctx.logger.error(err));
  }

  for (const alias of aliases) {
    if (alias.has_recipient_verification) {
      const recipients = [];
      for (const recipient of alias.recipients) {
        if (alias.verified_recipients.includes(recipient))
          recipients.push(recipient);
      }

      alias.recipients = recipients;
    }
  }

  ctx.body = aliases
    .filter((alias) => {
      if (alias.recipients.length === 0) return false;
      if (alias.name === '*') return true;
      if (!username) return true;

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
        const hasTwoSlashes = alias.name.lastIndexOf('/') !== 0;
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
            ctx.logger.warn(err, { parsedRegex, alias });
          }

          if (regex) return regex.test(username);
        }
      }

      if (username !== alias.name) return false;
      return true;
    })
    .map((alias) => {
      // alias.name = "*" (wildcard catchall) otherwise an alias
      // alias.is_enabled = "!" prefixed alias name
      // alias.recipients = comma separated (split with a colon)

      // if the alias requires recipient verification
      // then filter out recipients that haven't yet clicked
      // the verification link required and sent
      // (but if and only if the domain was not on free plan)
      if (alias.name === '*') return alias.recipients.join(',');

      return alias.recipients
        .map((recipient) =>
          alias.is_enabled ? `${alias.name}:${recipient}` : `!${alias.name}`
        )
        .join(',');
    });
}

module.exports = lookup;
