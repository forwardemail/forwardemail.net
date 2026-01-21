/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');

async function updateAlias(ctx, next) {
  ctx.state.alias = await Aliases.findById(ctx.state.alias._id);
  if (!ctx.state.alias)
    throw Boom.badRequest(ctx.translateError('ALIAS_DOES_NOT_EXIST'));
  ctx.state.alias = _.extend(ctx.state.alias, ctx.state.body);
  try {
    ctx.state.alias.locale = ctx.locale;
    ctx.state.alias.is_update = true;
    ctx.state.alias = await ctx.state.alias.save();

    // if the body had `has_pgp` or `public_key` and if the values changed
    // then refresh all IMAP sessions with the new updated public key and boolean
    if (
      (ctx.client && typeof ctx.request.body.public_key === 'string') ||
      typeof ctx.request.body.has_pgp !== 'undefined'
    )
      ctx.client.publish('pgp_reload', ctx.state.alias.id);

    // if the body had `has_smime` or `smime_certificate` and if the values changed
    // then refresh all IMAP sessions with the new updated certificate and boolean
    if (
      (ctx.client && typeof ctx.request.body.smime_certificate === 'string') ||
      typeof ctx.request.body.has_smime !== 'undefined'
    )
      ctx.client.publish('smime_reload', ctx.state.alias.id);

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
    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    throw err;
  }
}

module.exports = updateAlias;
