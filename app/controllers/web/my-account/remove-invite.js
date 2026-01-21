/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const isEmail = require('#helpers/is-email');

const { Domains } = require('#models');

async function removeInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
  // remove invite
  ctx.state.domain.invites = ctx.state.domain.invites.filter(
    (invite) => invite.email.toLowerCase() !== email.toLowerCase()
  );
  ctx.state.domain.skip_verification = true;
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.resolver = ctx.resolver;

  // Set audit metadata for domain update tracking
  ctx.state.domain.__audit_metadata = {
    user: ctx.state.user,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent')
  };

  ctx.state.domain = await ctx.state.domain.save();

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

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = removeInvite;
