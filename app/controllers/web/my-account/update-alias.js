/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const _ = require('lodash');

const toObject = require('#helpers/to-object');
const { Users, Domains, Aliases } = require('#models');

async function updateAlias(ctx, next) {
  ctx.state.alias = await Aliases.findById(ctx.state.alias._id);
  ctx.state.alias = _.extend(ctx.state.alias, ctx.state.body);
  try {
    ctx.state.alias.locale = ctx.locale;
    ctx.state.alias.is_update = true;
    ctx.state.alias = await ctx.state.alias.save();

    // if the body had `has_pgp` or `public_key` and if the values changed
    // then refresh all IMAP sessions with the new updated public key and boolean
    if (
      (ctx.client && typeof ctx.request.body.public_key === 'string') ||
      ctx.request.body.has_pgp !== 'undefined'
    )
      ctx.client.publish('pgp_reload', ctx.state.alias.id);

    if (ctx.api) {
      ctx.state.alias = toObject(Aliases, ctx.state.alias);
      ctx.state.alias.user = toObject(Users, ctx.state.user);
      ctx.state.alias.domain = toObject(Domains, ctx.state.domain);
      ctx.state.alias.domain.members = ctx.state.domain.members;
      ctx.state.alias.domain.invites = ctx.state.domain.invites;
      return next();
    }

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
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = updateAlias;
