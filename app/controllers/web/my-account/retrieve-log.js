/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const isEmail = require('#helpers/is-email');
const env = require('#config/env');

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
        $or: [
          { err: { $exists: false } },
          { 'err.isCodeBug': { $ne: true } },
          { message: 'delivered' }
        ]
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
  // ensure that user has access to this log
  // (logged in user must either be alias owner, domain admin, or recipient)
  //
  let hasAccess = false;

  //
  // Check 1: Validate MAIL FROM (sender)
  //
  if (
    (log?.email ||
      log?.meta?.email ||
      log?.meta?.app?.hostname === env.SMTP_HOST ||
      log?.meta?.app?.hostname === env.MX1_HOST ||
      log?.meta?.app?.hostname === env.MX2_HOST) && // validation safeguard
    isSANB(log.meta.session.envelope.mailFrom.address) &&
    isEmail(log.meta.session.envelope.mailFrom.address)
  ) {
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

    if (match) {
      // if the user is an admin of the domain, grant access
      if (isAdmin) {
        hasAccess = true;
      } else {
        const email = `${username}@${domain}`.toLowerCase();
        const domainToAliases = nonAdminDomainsToAliases[match.toString()];

        if (
          domainToAliases &&
          (domainToAliases.includes(`*@${domain}`) ||
            domainToAliases.includes(email))
        ) {
          hasAccess = true;
        }
      }
    }
  }

  //
  // Check 2: Validate RCPT TO (recipient) if not already granted access
  //
  if (
    !hasAccess &&
    Array.isArray(log?.meta?.session?.envelope?.rcptTo) &&
    log.meta.session.envelope.rcptTo.length > 0
  ) {
    // Check if user is a valid recipient
    const hasValidRecipient = log.meta.session.envelope.rcptTo.some((rcpt) => {
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

      // if the user is an admin of the domain, grant access
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
    });

    if (hasValidRecipient) hasAccess = true;
  }

  //
  // If user has no access through either MAIL FROM or RCPT TO, deny access
  //
  if (!hasAccess)
    throw Boom.badRequest(ctx.translateError('LOG_DOES_NOT_EXIST'));

  //
  // filter recipients to only show those relevant to the user
  //
  if (Array.isArray(log?.meta?.session?.envelope?.rcptTo))
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

  //
  // Filter BCC header to only show BCC recipients relevant to this user
  //
  if (
    log?.meta?.session?.headers &&
    typeof log.meta.session.headers === 'object' &&
    log.meta.session.headers.Bcc
  ) {
    // Parse BCC header (can be a string with comma-separated emails)
    const bccHeader = log.meta.session.headers.Bcc;
    let bccEmails = [];

    if (typeof bccHeader === 'string') {
      // Split by comma and clean up whitespace
      bccEmails = bccHeader
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email.length > 0);
    }

    // Filter BCC emails using the same logic as RCPT TO
    const filteredBccEmails = bccEmails.filter((email) => {
      // Extract username and domain
      const emailLower = email.toLowerCase();
      const parts = emailLower.split('@');
      if (parts.length !== 2) return false;

      const username = parts[0].includes('+')
        ? parts[0].slice(0, parts[0].indexOf('+'))
        : parts[0];
      const domain = parts[1];

      // Check if user is admin of the domain
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

      // If admin, show all BCC recipients for this domain
      if (isAdmin) return true;

      // Otherwise, only show if this email belongs to the user
      const fullEmail = `${username}@${domain}`.toLowerCase();
      const domainToAliases = nonAdminDomainsToAliases[match.toString()];

      if (!domainToAliases) return false;

      if (
        domainToAliases.includes(`*@${domain}`) ||
        domainToAliases.includes(fullEmail)
      )
        return true;

      return false;
    });

    // Update or remove the BCC header
    if (filteredBccEmails.length === 0) {
      // Remove BCC header entirely if no relevant recipients
      delete log.meta.session.headers.Bcc;
    } else {
      // Update BCC header with filtered recipients
      log.meta.session.headers.Bcc = filteredBccEmails.join(', ');
    }
  }

  ctx.state.log = log;

  return next();
}

module.exports = retrieveLog;
