const Boom = require('@hapi/boom');
const auth = require('basic-auth');
const isSANB = require('is-string-and-not-blank');

const env = require('../../../../config/env');
const Domains = require('../../../models/domain');
const Aliases = require('../../../models/alias');

async function lookup(ctx) {
  const credentials = auth(ctx.req);

  if (
    typeof credentials === 'undefined' ||
    typeof credentials.name !== 'string' ||
    !credentials.name
  )
    return ctx.throw(
      Boom.unauthorized(
        ctx.translate
          ? ctx.translate('INVALID_API_CREDENTIALS')
          : 'Invalid API credentials.'
      )
    );

  if (!env.LOOKUP_SECRETS.includes(credentials.name))
    return ctx.throw(
      Boom.unauthorized(
        ctx.translate
          ? ctx.translate('INVALID_API_TOKEN')
          : 'Invalid API token.'
      )
    );

  if (!isSANB(ctx.query.verification_record))
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST')));

  const domain = await Domains.findOne({
    verification_record: ctx.query.verification_record
  })
    .lean()
    .exec();

  if (!domain)
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST')));

  const aliases = await Aliases.find({
    domain: domain._id
  })
    .populate('user', 'is_banned')
    .lean()
    .exec();

  ctx.body = aliases
    .filter(alias => !alias.user.is_banned)
    .map(alias => {
      // alias.name = "*" (wildcard catchall) otherwise an alias
      // alias.is_enabled = "!" prefixed alias name
      // alias.recipients = comma separated (split with a colon)
      if (alias.name === '*') return alias.recipients.join(',');
      return `${alias.is_enabled ? '' : '!'}${
        alias.name
      }:${alias.recipients.join(',')}`;
    });
}

module.exports = lookup;
