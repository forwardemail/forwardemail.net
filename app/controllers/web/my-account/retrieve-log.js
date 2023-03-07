const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

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

  const domainNames = new Set(domainsByUser.map((d) => d.name));

  ctx.state.log = await Logs.findOne({
    is_restricted: true,
    id: ctx.params.id,
    'meta.err.responseCode': { $exists: true },
    domains: {
      $exists: true,
      $in: domainsByUser.map((d) => d._id)
    }
  })
    .lean()
    .exec();

  if (!ctx.state.log)
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  const { log } = ctx.state;

  if (
    isSANB(log?.meta?.session?.envelope?.mailFrom?.address) &&
    isEmail(log.meta.session.envelope.mailFrom.address)
  )
    log.mailFrom = log.meta.session.envelope.mailFrom.address;
  log.rcpts = _.isArray(log?.meta?.session?.envelope.rcptTo)
    ? log.meta.session.envelope.rcptTo
        .filter(
          (rcpt) =>
            _.isObject(rcpt) &&
            isSANB(rcpt.address) &&
            isEmail(rcpt.address) &&
            domainNames.has(rcpt.address.split('@')[1].toLowerCase())
        )
        .map((rcpt) => rcpt.address)
    : [];

  return next();
}

module.exports = retrieveLog;
