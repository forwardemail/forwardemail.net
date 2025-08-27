/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const splitLines = require('split-lines');
const { boolean } = require('boolean');
const { isIP } = require('@forwardemail/validator');
const _ = require('#helpers/lodash');

const isDenylisted = require('#helpers/is-denylisted');
const isEmail = require('#helpers/is-email');
const parseRootDomain = require('#helpers/parse-root-domain');

async function validateDomain(ctx, next) {
  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));

  // trim and convert to lowercase the domain name
  ctx.request.body.domain = ctx.request.body.domain.trim().toLowerCase();

  const match = ctx.state.domains.find(
    (domain) =>
      domain.name === ctx.request.body.domain ||
      punycode.toASCII(domain.name) ===
        punycode.toASCII(ctx.request.body.domain)
  );

  if (match) {
    if (ctx.api)
      throw Boom.badRequest(ctx.translateError('DOMAIN_ALREADY_EXISTS'));

    const message = ctx.translate('DOMAIN_ALREADY_EXISTS');
    ctx.flash('warning', message);

    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(match.name)}/aliases`
    );

    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }

    return;
  }

  //
  // prevent users from adding "www." prefix (e.g. foo@www.example.com is never intended; unless via API perhaps)
  //
  if (!ctx.api && ctx.request.body.domain.startsWith('www.')) {
    const err = Boom.badRequest(
      ctx
        .translate('WWW_WARNING')
        .replace(/example.com/g, ctx.request.body.domain.replace('www.', ''))
    );
    err.no_translate = true;
    throw err;
  }

  //
  // check if domain is on the allowlist or denylist
  //
  const rootDomain = parseRootDomain(ctx.request.body.domain);

  try {
    await isDenylisted(rootDomain, ctx.client, ctx.resolver);
  } catch (err) {
    if (err.name === 'DenylistError')
      throw Boom.badRequest(
        ctx.translateError(
          'DENYLIST_DOMAIN_NOT_ALLOWED',
          err.denylistValue,
          ctx.state.l(`/denylist?q=${err.denylistValue}`)
        )
      );
    throw err;
  }

  // if it was allowlisted then notify them to contact help
  // (we would manually create)
  /*
  if (
    isAllowlist &&
    !ctx.state.user[config.userFields.approvedDomains].includes(rootDomain)
  ) {
    ctx.logger.fatal(
      new Error(
        `Account approval required for: ${ctx.request.body.domain} (${rootDomain})`
      )
    );
      throw Boom.badRequest(
        ctx.translateError(
          'ALLOWLIST_DOMAIN_NOT_ALLOWED',
          rootDomain,
          ctx.state.l('/help')
        )
      )
  }
  */

  if (isSANB(ctx.request.body.plan)) {
    if (
      !['free', 'enhanced_protection', 'team', 'enterprise'].includes(
        ctx.request.body.plan
      )
    )
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));
  } else {
    ctx.request.body.plan = ctx.state.user.plan || 'free';
  }

  ctx.state.recipients = [];

  if (ctx.api) {
    if (isSANB(ctx.request.body.catchall)) {
      // some API libraries like Guzzle convert false to "0"
      if (['false', '0', 0].includes(ctx.request.body.catchall)) {
        ctx.request.body.catchall = false;
      } else if (ctx.request.body.catchall === 'true') {
        ctx.state.recipients.push(ctx.state.user.email);
      } else {
        const rcpts = _.compact(
          _.uniq(
            _.map(
              splitLines(ctx.request.body.catchall)
                .join(' ')
                .split(',')
                .join(' ')
                .split(' '),
              (recipient) => recipient.trim()
            )
          )
        ).filter((val) => isEmail(val));
        // if no recipients parsed then throw error
        if (rcpts.length === 0)
          throw Boom.badRequest(
            ctx.translateError('ALIAS_MUST_HAVE_ONE_RECIPIENT')
          );

        ctx.state.recipients.push(...rcpts);
      }
    } else if (ctx.request.body.catchall === true) {
      ctx.state.recipients.push(ctx.state.user.email);
    }
  } else {
    ctx.request.body.catchall = true;
    ctx.state.recipients.push(ctx.state.user.email);
  }

  ctx.state.redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.request.body.domain)}`
  );

  // if the user was not on a valid plan then redirect them to billing post creation
  if (isSANB(ctx.request.body.plan)) {
    switch (ctx.request.body.plan) {
      case 'enhanced_protection': {
        if (
          !['enhanced_protection', 'team', 'enterprise'].includes(
            ctx.state.user.plan
          )
        ) {
          ctx.request.body.plan = 'free';
          ctx.state.redirectTo = ctx.state.l(
            `/my-account/domains/${punycode.toASCII(
              ctx.request.body.domain
            )}/billing?plan=enhanced_protection`
          );
        }

        break;
      }

      case 'team': {
        if (ctx.state.user.plan !== 'team') {
          ctx.request.body.plan =
            ctx.state.user.plan === 'enhanced_protection'
              ? 'enhanced_protection'
              : 'free';
          ctx.state.redirectTo = ctx.state.l(
            `/my-account/domains/${punycode.toASCII(
              ctx.request.body.domain
            )}/billing?plan=team`
          );
        }

        break;
      }

      // No default
    }
  }

  // Boolean settings for spam and requiring recipient verification
  ctx.state.optionalBooleans = {};
  for (const bool of [
    'has_adult_content_protection',
    'has_phishing_protection',
    'has_executable_protection',
    'has_virus_protection',
    'has_recipient_verification',
    'ignore_mx_check',
    'has_delivery_logs'
  ]) {
    if (_.isBoolean(ctx.request.body[bool]) || isSANB(ctx.request.body[bool]))
      ctx.state.optionalBooleans[bool] = boolean(ctx.request.body[bool]);
  }

  return next();
}

module.exports = validateDomain;
