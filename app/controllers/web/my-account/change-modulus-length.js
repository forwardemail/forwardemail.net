/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');

const Domains = require('#models/domains');

async function changeModulusLength(ctx) {
  const domain = await Domains.findById(ctx.state.domain._id);
  if (!domain)
    throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(domain.name)}/verify-smtp`
  );

  const text = ctx.translate('CHANGED_MODULUS_LENGTH');

  // ensure dkim_modulus_length is either "1024" or "2048"
  if (
    typeof ctx.request?.body?.dkim_modulus_length !== 'string' ||
    !['1024', '2048'].includes(ctx.request.body.dkim_modulus_length)
  )
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  // return early if it was already the intended value (e.g. safeguard for users with multiple tabs)
  const modulusLength = domain.dkim_modulus_length || 2048;
  if (modulusLength.toString() === ctx.request.body.dkim_modulus_length) {
    // if everything OK then success
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  // update the new modulus length (note we have enum in the model for sanity)
  domain.dkim_modulus_length = Number.parseInt(
    ctx.request.body.dkim_modulus_length,
    10
  );

  // generate a new key for the domain
  domain.dkim_private_key = undefined;

  // critical to prevent override (e.g. cloudflare defaulting to 2048)
  domain.skip_ns_check = true;

  // save the domain
  domain.locale = ctx.locale;
  domain.resolver = ctx.resolver;
  domain.skip_verification = true;

  // Set audit metadata for domain update tracking
  domain.__audit_metadata = {
    user: ctx.state.user,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent')
  };

  await domain.save();

  // if everything OK then success
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text,
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = changeModulusLength;
