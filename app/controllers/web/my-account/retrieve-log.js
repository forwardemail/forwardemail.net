const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
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

  const log = await Logs.findOne({
    _id: new mongoose.Types.ObjectId(ctx.params.id)
  })
    .lean()
    .exec();

  if (
    !log ||
    !log.is_restricted ||
    !log?.meta?.err?.responseCode ||
    !Array.isArray(log.domains) ||
    log.domains.length === 0
  )
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  const domainIdsByUser = new Set(domainsByUser.map((d) => d.id));

  if (log.domains.every((d) => !domainIdsByUser.has(d.toString())))
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

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

  ctx.state.log = log;

  return next();
}

module.exports = retrieveLog;
