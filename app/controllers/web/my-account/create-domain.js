/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const { boolean } = require('boolean');

const { Domains, Aliases, Users } = require('#models');
const emailHelper = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const isExpiredOrNewlyCreated = require('#helpers/is-expired-or-newly-created');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');

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

  //
  // If the domain being added is an Ubuntu team domain and the user
  // is already authenticated via Ubuntu SSO, redirect them to the
  // existing domain instead of throwing UBUNTU_LOGIN_REQUIRED.
  // This prevents a redirect loop where the user is told to login
  // via Ubuntu SSO but is already logged in.
  //
  if (
    isSANB(ctx.request.body.domain) &&
    Object.keys(config.ubuntuTeamMapping).includes(
      ctx.request.body.domain.toLowerCase()
    ) &&
    isSANB(ctx.state.user[config.passport.fields.ubuntuProfileID]) &&
    isSANB(ctx.state.user[config.passport.fields.ubuntuUsername])
  ) {
    const existingDomain = await Domains.findOne({
      name: ctx.request.body.domain.toLowerCase(),
      plan: 'team',
      has_txt_record: true,
      'members.user': ctx.state.user._id
    })
      .lean()
      .exec();
    if (existingDomain) {
      // User is already a member of this domain, redirect to it
      const redirectTo = ctx.state.l(
        `/my-account/domains/${punycode.toASCII(existingDomain.name)}/aliases`
      );
      if (ctx.api) {
        ctx.body = { redirectTo };
        return;
      }

      ctx.flash('info', ctx.translate('DOMAIN_ALREADY_EXISTS'));
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    }

    //
    // User has Ubuntu SSO credentials but is not yet a domain member.
    // This can happen if syncUbuntuUser failed silently during login
    // (e.g. transient Launchpad API timeout). Trigger a sync now to
    // avoid the UBUNTU_LOGIN_REQUIRED redirect loop.
    //
    try {
      const map = await getUbuntuMembersMap();
      const user = await Users.findById(ctx.state.user._id);
      if (user) {
        await syncUbuntuUser(user, map);
        await Users.findByIdAndUpdate(user._id, {
          $set: { last_ubuntu_sync: new Date() }
        });
      }
    } catch (err) {
      logger.fatal(err);
      // Email admins with full error details so sync failures are visible
      const ubuntuUsername =
        ctx.state.user[config.passport.fields.ubuntuUsername] ||
        ctx.state.user.email;
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Ubuntu sync failed during create-domain for ${ubuntuUsername}`
        },
        locals: {
          message:
            `<p>Ubuntu membership sync failed when user ` +
            `<strong>${ctx.state.user.email}</strong> ` +
            `(Launchpad username: <code>${ubuntuUsername}</code>) ` +
            `attempted to add <code>${ctx.request.body.domain}</code>.</p>` +
            `<p><strong>Error:</strong> ${err.message}</p>` +
            `<pre><code>${err.stack}</code></pre>`
        }
      })
        .then()
        .catch((err) => logger.fatal(err));
    }

    // Re-check membership after sync attempt
    const domainAfterSync = await Domains.findOne({
      name: ctx.request.body.domain.toLowerCase(),
      plan: 'team',
      has_txt_record: true,
      'members.user': ctx.state.user._id
    })
      .lean()
      .exec();
    if (domainAfterSync) {
      const redirectTo = ctx.state.l(
        `/my-account/domains/${punycode.toASCII(domainAfterSync.name)}/aliases`
      );
      if (ctx.api) {
        ctx.body = { redirectTo };
        return;
      }

      ctx.flash('success', ctx.translate('DOMAIN_ALREADY_EXISTS'));
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    }

    //
    // If sync still didn't add them, they may not be a valid
    // participant of this team on Launchpad. Show a clear error.
    //
    const domainName = ctx.request.body.domain.toLowerCase();
    const teamSlug = config.ubuntuTeamMapping[domainName] || '~ubuntumembers';
    const err = Boom.badRequest(
      ctx.translateError(
        'UBUNTU_NOT_A_MEMBER',
        domainName,
        teamSlug,
        teamSlug,
        teamSlug
      )
    );
    if (ctx.api) throw err;
    ctx.flash('error', err.message);
    const redirectTo = ctx.state.l('/my-account/domains');
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
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
