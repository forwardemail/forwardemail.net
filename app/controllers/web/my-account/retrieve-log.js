/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const isEmail = require('#helpers/is-email');

const { Logs, Aliases } = require('#models');

async function retrieveLog(ctx, next) {
  //
  // NOTE: this is a safeguard since logs are sensitive
  //
  if (!ctx.isAuthenticated())
    throw Boom.badRequest(ctx.translateError('LOGIN_REQUIRED'));

  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  const log = await Logs.findOne({
    $and: [
      { _id: new mongoose.Types.ObjectId(ctx.params.id) },
      {
        $or: [{ err: { $exists: false } }, { 'err.isCodeBug': { $ne: true } }]
      }
    ]
  })
    .lean()
    .exec();

  if (
    !log ||
    !log.is_restricted ||
    !Array.isArray(log.domains) ||
    log.domains.length === 0
  )
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  //
  // go through all domains that the user is not an admin of
  // and add those respective aliases as an $or query for logs
  // (e.g. this allows global vanity domain logs for the user)
  //
  const nonAdminDomains = ctx.state.domains.filter(
    (d) => d.plan !== 'free' && d.group !== 'admin'
  );
  const nonAdminDomainsToAliases = {};

  if (nonAdminDomains.length > 0) {
    const aliases = await Aliases.find({
      user: ctx.state.user._id,
      domain: {
        $in: nonAdminDomains.map((d) => d._id)
      }
    })
      .select('name domain')
      .lean()
      .exec();

    for (const alias of aliases) {
      if (!alias.domain) continue;

      const domain = nonAdminDomains.find(
        (d) => d.id === alias.domain.toString()
      );

      if (!domain) continue;

      if (!nonAdminDomainsToAliases[domain.id])
        nonAdminDomainsToAliases[domain.id] = [];

      nonAdminDomainsToAliases[domain.id].push(`${alias.name}@${domain.name}`);
    }
  }

  //
  // TODO: ensure that `log.meta.session.envelope.mailFrom.address` is valid
  // (logged in user must either be alias owner or domain admin)
  //
  if (log?.email || log?.meta?.email) {
    // validation safeguard
    if (
      !isSANB(log.meta.session.envelope.mailFrom.address) ||
      !isEmail(log.meta.session.envelope.mailFrom.address)
    )
      throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

    // get the portion without the "+" symbol since aliases don't permit use of "+" (automatic support)
    const rcpt = log.meta.session.envelope.mailFrom;
    const username = rcpt.address.includes('+')
      ? rcpt.address.slice(0, rcpt.address.indexOf('+'))
      : rcpt.address.split('@')[0];
    const domain = rcpt.address.split('@')[1];

    // get a match where the domain name matches and id existed
    let isAdmin = false;
    const match = log.domains.find((logDomain) => {
      const find = ctx.state.domains.find(
        (d) => d.id === logDomain.toString() && d.name === domain.toLowerCase()
      );
      if (!find) return false;
      if (find.group === 'admin') isAdmin = true;
      return true;
    });

    if (!match) throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

    // if the user is not an admin of the domain then filter for individual rcpts
    if (!isAdmin) {
      const email = `${username}@${domain}`.toLowerCase();

      const domainToAliases = nonAdminDomainsToAliases[match.toString()];

      if (!domainToAliases)
        throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

      if (
        !domainToAliases.includes(`*@${domain}`) &&
        !domainToAliases.includes(email)
      )
        throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));
    }
  }

  //
  // filter recipients (iff `email` not set)
  //
  if (
    !log.email &&
    !log?.meta?.email &&
    Array.isArray(log?.meta?.session?.envelope?.rcptTo)
  )
    log.meta.session.envelope.rcptTo = log.meta.session.envelope.rcptTo.filter(
      (rcpt) => {
        // get the portion without the "+" symbol since aliases don't permit use of "+" (automatic support)
        const username = rcpt.address.includes('+')
          ? rcpt.address.slice(0, rcpt.address.indexOf('+'))
          : rcpt.address.split('@')[0];
        const domain = rcpt.address.split('@')[1];

        // get a match where the domain name matches and id existed
        let isAdmin = false;
        const match = log.domains.find((logDomain) => {
          const find = ctx.state.domains.find(
            (d) =>
              d.id === logDomain.toString() && d.name === domain.toLowerCase()
          );
          if (!find) return false;
          if (find.group === 'admin') isAdmin = true;
          return true;
        });

        if (!match) return false;

        // if the user is not an admin of the domain then filter for individual rcpts
        if (isAdmin) return true;

        const email = `${username}@${domain}`.toLowerCase();

        const domainToAliases = nonAdminDomainsToAliases[match.toString()];

        if (!domainToAliases) return false;

        if (
          domainToAliases.includes(`*@${domain}`) ||
          domainToAliases.includes(email)
        )
          return true;

        return false;
      }
    );

  // check recipient length after filtering
  if (
    !log.email &&
    !log?.meta?.email &&
    log.meta.session.envelope.rcptTo.length === 0
  )
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  ctx.state.log = log;

  return next();
}

module.exports = retrieveLog;
