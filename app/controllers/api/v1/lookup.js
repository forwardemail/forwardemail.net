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

  const query = {
    verification_record: ctx.query.verification_record,
    plan: { $ne: 'free' }
  };

  // legacy compatibility
  if (isSANB(ctx.query.domain)) query.name = ctx.query.domain;

  const domain = await Domains.findOne(query).lean().exec();

  if (!domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const aliases = await Aliases.find({
    domain: domain._id
  })
    .populate('user', config.userFields.isBanned)
    .lean()
    .exec();

  const username = isSANB(ctx.query.username) ? ctx.query.username : false;

  ctx.body = aliases
    .filter((alias) => {
      if (!_.isObject(alias.user)) return false;
      if (alias.user[config.userFields.isBanned]) return false;
      if (alias.name === '*') return true;
      if (username && username !== alias.name) return false;
      return true;
    })
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
