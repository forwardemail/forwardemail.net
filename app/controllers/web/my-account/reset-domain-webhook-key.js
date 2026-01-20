/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const { Domains } = require('#models');

async function resetDomainWebhookKey(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  // reset key (gets reset under pre validate domain hook in model)
  ctx.state.domain.webhook_key = undefined;

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;

  // Set audit metadata for domain update tracking
  ctx.state.domain.__audit_metadata = {
    user: ctx.state.user,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent')
  };

  ctx.state.domain = await ctx.state.domain.save();

  // clear cache for settings (used by SMTP)
  if (ctx.state.domain.plan !== 'free' && ctx.state.domain.has_txt_record)
    ctx.client
      .del(`v1_settings:${ctx.state.domain.name}`)
      .then()
      .catch((err) => ctx.logger.fatal(err));

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

module.exports = resetDomainWebhookKey;
