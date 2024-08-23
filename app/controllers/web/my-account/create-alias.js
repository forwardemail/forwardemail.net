/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { boolean } = require('boolean');

const config = require('#config');
const toObject = require('#helpers/to-object');
const { Users, Domains, Aliases } = require('#models');

// eslint-disable-next-line complexity
async function createAlias(ctx, next) {
  try {
    if (
      isSANB(ctx.state.body.name) &&
      !ctx.state.body.name.startsWith('/') &&
      ctx.state.body.name.includes('+')
    )
      return ctx.throw(
        Boom.badRequest(ctx.translateError('ALIAS_WITH_PLUS_UNSUPPORTED'))
      );

    //
    // if the domain is ubuntu.com and the user is in the user group
    // then don't allow them to create aliases (only manage/delete their own)
    //
    if (
      ctx.state.domain.plan === 'team' &&
      ctx.state.domain.has_txt_record &&
      Object.keys(config.ubuntuTeamMapping).includes(ctx.state.domain.name)
    ) {
      const member = ctx.state.domain.members.find(
        (member) => member.user && member.user.id === ctx.state.user.id
      );

      if (!member)
        return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

      if (member.group === 'user')
        return ctx.throw(
          Boom.notFound(ctx.translateError('UBUNTU_PERMISSIONS'))
        );
    }

    try {
      ctx.state.alias = await Aliases.create({
        ...ctx.state.body,
        is_api: boolean(ctx.api),
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        locale: ctx.locale
      });
    } catch (err) {
      // if there was a payment required error before creating the alias
      // and it was a global alias, then it indicates it requires an upgrade
      if (
        !ctx.api &&
        err &&
        err.isBoom &&
        err.output &&
        err.output.statusCode === 402
      ) {
        const redirectTo = ctx.state.l(
          '/my-account/billing/upgrade?plan=enhanced_protection'
        );
        ctx.flash('warning', err.message);
        if (ctx.accepts('html')) ctx.redirect(redirectTo);
        else ctx.body = { redirectTo };
        return;
      }

      throw err;
    }

    if (ctx.api) {
      ctx.state.alias = toObject(Aliases, ctx.state.alias);
      ctx.state.alias.user = toObject(Users, ctx.state.user);
      ctx.state.alias.domain = toObject(Domains, ctx.state.domain);
      ctx.state.alias.domain.members = ctx.state.domain.members;
      ctx.state.alias.domain.invites = ctx.state.domain.invites;
      return next();
    }

    if (
      ctx.state.alias.has_recipient_verification &&
      (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record)
    )
      ctx.flash(
        'warning',
        ctx.translate('RECIPIENT_VERIFICATION_PENDING_DOMAIN_VERIFICATION')
      );

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(
        ctx.state.domain.name
      )}/aliases?new=${ctx.state.alias.name}@${ctx.state.domain.name}`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(err);
  }
}

module.exports = createAlias;
