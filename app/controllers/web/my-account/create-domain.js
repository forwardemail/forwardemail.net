/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const { boolean } = require('boolean');

const { Domains, Aliases } = require('#models');
const isExpiredOrNewlyCreated = require('#helpers/is-expired-or-newly-created');

const config = require('#config');
const logger = require('#helpers/logger');

async function createDomain(ctx, next) {
  //
  // if `team_domain` was specified then ensure that it's valid
  // (it's either an object ID or a name)
  //
  let teamDomain;
  if (
    isSANB(ctx.request.body.team_domain) &&
    ctx.request.body.team_domain !== 'none'
  ) {
    const query = mongoose.isObjectIdOrHexString(ctx.request.body.team_domain)
      ? {
          id: ctx.request.body.team_domain,
          plan: 'team',
          members: {
            $elemMatch: {
              user: ctx.state.user._id,
              group: 'admin'
            }
          }
        }
      : {
          name: ctx.request.body.team_domain.toLowerCase(),
          plan: 'team',
          members: {
            $elemMatch: {
              user: ctx.state.user._id,
              group: 'admin'
            }
          }
        };

    teamDomain = await Domains.findOne(query).lean().exec();

    // throw error if it wasn't valid
    if (!teamDomain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));
  }

  if (
    !teamDomain &&
    !ctx.state.user[config.userFields.hasVerifiedEmail] &&
    ctx.state.user.plan === 'free'
  ) {
    const names = await Domains.distinct('name', {
      'members.user': ctx.state.user._id,
      plan: config.isSelfHosted ? 'team' : 'free',
      is_global: false
    });

    //
    // if user already has 1+ domain on their account
    // and if they are on the free plan then don't allow them
    // to continue without verifying their email address first
    // (this slows down spammers from flooding our database)
    //
    if (names.length > 0) {
      // alert admins we prevented possible spammer
      const err = new TypeError(
        `${
          ctx.state.user.email
        } (unverified) attempted to create multiple domains${
          ctx.api ? ' (API)' : ''
        }`
      );
      err.isCodeBug = true;
      err.names = names;
      logger.fatal(err);

      if (ctx.api)
        throw Boom.unauthorized(
          ctx.translateError('EMAIL_VERIFICATION_REQUIRED')
        );

      ctx.flash('warning', ctx.translate('EMAIL_VERIFICATION_REQUIRED'));

      const redirectTo = ctx.state.l(config.verifyRoute);
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };

      return;
    }
  }

  try {
    // wrap with try/catch in case of unknown errors with the whois lookup
    let obj;
    try {
      obj = await isExpiredOrNewlyCreated(ctx.request.body.domain, ctx.client);
    } catch (err) {
      err.isCodeBug = true;
      logger.fatal(err);
    }

    if (
      obj?.err &&
      (ctx?.request?.body?.plan === 'free' || teamDomain?.plan === 'free')
    ) {
      if (ctx.api) throw Boom.badRequest(obj.err.message);
      const redirectTo = ctx.state.l(
        `/my-account/billing/upgrade?plan=enhanced_protection&domain=${ctx.request.body.domain}`
      );
      ctx.flash('warning', obj.err.message);
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    }

    if (teamDomain) {
      ctx.state.domain = await Domains.create({
        is_api: boolean(ctx.api),
        members: teamDomain.members,
        name: ctx.request.body.domain,
        is_global:
          ctx.state.user.group === 'admin' &&
          boolean(ctx.request.body.is_global),
        locale: ctx.locale,
        plan: teamDomain.plan,
        resolver: ctx.resolver,
        ...ctx.state.optionalBooleans
      });
    } else {
      ctx.state.domain = await Domains.create({
        is_api: boolean(ctx.api),
        members: [{ user: ctx.state.user._id, group: 'admin' }],
        name: ctx.request.body.domain,
        is_global:
          ctx.state.user.group === 'admin' &&
          boolean(ctx.request.body.is_global),
        locale: ctx.locale,
        plan: ctx.request.body.plan,
        resolver: ctx.resolver,
        ...ctx.state.optionalBooleans
      });
    }

    // create a default alias for the user pointing to the user or recipients
    if (boolean(ctx.api) && ctx.request.body.catchall === false) {
      // create domain without any aliases yet!
      ctx.logger.info('created domain without aliases', {
        domain: ctx.state.domain
      });
    } else {
      await Aliases.create({
        is_api: boolean(ctx.api),
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients:
          ctx.state.recipients.length > 0
            ? ctx.state.recipients
            : [ctx.state.user.email],
        locale: ctx.locale,
        ...(ctx.state.optionalBooleans.has_recipient_verification
          ? { has_recipient_verification: true }
          : {})
      });
    }

    if (ctx.api) return next();

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    if (ctx.accepts('html')) ctx.redirect(ctx.state.redirectTo);
    else ctx.body = { redirectTo: ctx.state.redirectTo };
  } catch (err) {
    // if there was a payment required error before creating the domain
    // it indicates that the domain was most likely a malicious extension
    // redirect to /my-account/domains/new?domain=$domain&plan=enhanced_protection
    if (
      !ctx.api &&
      err &&
      err.isBoom &&
      err.output &&
      err.output.statusCode === 402
    ) {
      const redirectTo = ctx.state.l(
        `/my-account/billing/upgrade?plan=enhanced_protection&domain=${ctx.request.body.domain}`
      );
      // all messages are already translated based off domain locale
      ctx.flash('warning', err.message);
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    }

    if (err.isBoom) throw err;
    throw Boom.badRequest(err);
  }
}

module.exports = createDomain;
