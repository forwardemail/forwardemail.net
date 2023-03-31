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

  // if user is an admin then let them view anything
  // if user is admin of domain then let them view
  // if user has an alias that is a recipient of the log then let them view
  //    (strip the RCPT TO to match the log only)
  const adminDomainIdsByUser = new Set(
    ctx.state.domains.filter((d) => d.group === 'admin').map((d) => d.id)
  );
  const domainIdsByUser = new Set(ctx.state.domains.map((d) => d.id));
  const domainNames = new Set(ctx.state.domains.map((d) => d.name));

  let isValid = ctx.state.user.group === 'admin';

  if (!isValid) {
    const aliases = new Set();
    for (const domain of ctx.state.domains) {
      if (!log.domains.some((d) => d.toString() === domain.id)) continue;
      for (const alias of domain.aliases) {
        aliases.add(`${alias.name}@${alias.domain.name}`);
      }
    }

    // try to find the domain where the user is an admin
    if (log.domains.some((d) => adminDomainIdsByUser.has(d.toString()))) {
      isValid = true;
    } else if (
      _.isArray(log?.meta?.session?.envelope?.rcptTo) &&
      log.domains.some((d) => domainIdsByUser.has(d.toString()))
    ) {
      //
      // else try to find where the user has the domain and their alias is a recipient
      // (this subsequently filters out the rcptTo array for matches only)
      //
      log.meta.session.envelope.rcptTo =
        log.meta.session.envelope.rcptTo.filter((rcpt) => {
          // get the portion without the "+" symbol since aliases don't permit use of "+" (automatic support)
          const username = rcpt.address.includes('+')
            ? rcpt.address.slice(0, rcpt.address.indexOf('+'))
            : rcpt.address.split('@')[0];
          const domain = rcpt.address.split('@')[1];
          const email = `${username}@${domain}`.toLowerCase();
          if (aliases.has(email)) return true;
          return false;
        });

      if (log.meta.session.envelope.rcptTo.length > 0) isValid = true;
    }
  }

  if (!isValid) throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

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
