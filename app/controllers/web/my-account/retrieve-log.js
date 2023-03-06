const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const { Logs } = require('#models');

async function retrieveLog(ctx, next) {
  //
  // NOTE: this is a safeguard since logs are sensitive
  //
  if (!ctx.isAuthenticated())
    return ctx.throw(Boom.badRequest(ctx.translateError('LOGIN_REQUIRED')));

  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  // if user does not have any domains
  const domainsByUser = ctx.state.domains.filter(
    (d) =>
      d.group === 'admin' && (!d.is_global || ctx.state.user.group === 'admin')
  );

  // safeguard to always ensure at least one domain is queried
  if (domainsByUser.length === 0)
    throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  ctx.state.log = await Logs.findOne({
    is_restricted: true,
    id: ctx.params.id,
    domains: {
      $in: domainsByUser.map((d) => d._id)
    }
  })
    .lean()
    .exec();

  if (!ctx.state.log)
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  return next();
}

module.exports = retrieveLog;
