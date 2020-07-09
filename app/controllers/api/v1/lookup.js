const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');

const config = require('../../../../config');
const Domains = require('../../../models/domain');
const Aliases = require('../../../models/alias');

async function lookup(ctx) {
  if (!isSANB(ctx.query.verification_record))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const domain = await Domains.findOne({
    verification_record: ctx.query.verification_record,
    plan: { $ne: 'free' }
  })
    .lean()
    .exec();

  if (!domain)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const aliases = await Aliases.find({
    domain: domain._id
  })
    .populate('user', config.userFields.isBanned)
    .lean()
    .exec();

  ctx.body = aliases
    .filter(
      (alias) =>
        _.isObject(alias.user) && !alias.user[config.userFields.isBanned]
    )
    .map((alias) => {
      // alias.name = "*" (wildcard catchall) otherwise an alias
      // alias.is_enabled = "!" prefixed alias name
      // alias.recipients = comma separated (split with a colon)
      if (alias.name === '*') return alias.recipients.join(',');

      return alias.recipients
        .map((recipient) => {
          return alias.is_enabled
            ? `${alias.name}:${recipient}`
            : `!${alias.name}`;
        })
        .join(',');
    });
}

module.exports = lookup;
