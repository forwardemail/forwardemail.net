const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const RE2 = require('re2');
const regexParser = require('regex-parser');

const config = require('#config');
const Domains = require('#models/domain');
const Users = require('#models/user');
const Aliases = require('#models/alias');

const REGEX_FLAG_ENDINGS = ['/gi', '/ig', '/g', '/i', '/'];

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

  const domain = await Domains.findOne(query).lean().exec();

  if (!domain) {
    ctx.body = [];
    return;
  }

  const bannedUserIds = await Users.distinct('_id', {
    [config.userFields.isBanned]: true
  });

  const aliases = await Aliases.find({
    domain: domain._id,
    user: { $nin: bannedUserIds }
  })
    .lean()
    .exec();

  if (aliases.length === 0) {
    ctx.body = [];
    return;
  }

  const username = isSANB(ctx.query.username)
    ? ctx.query.username.toLowerCase()
    : false;

  if (domain.plan !== 'free') {
    for (const alias of aliases) {
      if (alias.has_recipient_verification) {
        const recipients = [];
        for (const recipient of alias.recipients) {
          // eslint-disable-next-line max-depth
          if (alias.verified_recipients.includes(recipient))
            recipients.push(recipient);
        }

        alias.recipients = recipients;
      }
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
      if (!domain.is_global) {
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
          const regex = new RE2(regexParser(parsedRegex));
          return regex.test(username);
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
